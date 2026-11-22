const repo = require('./revue.repository');
const { today, day, debutSemaine } = require('../../shared/date-utils');
const { AppError } = require('../../shared/errors');

// Propriété Notion de statut + valeurs autorisées, par type d'élément
const STATUTS = {
  projet: { prop: 'Status', valeurs: ['Inbox', 'Planned', 'In progress', 'En pause', 'Done'] },
  ressource: { prop: 'Status', valeurs: ['Inbox', 'To Review', 'Done'] },
  area: { prop: 'État', valeurs: ['Pas commencé', 'En cours', 'Terminé'] },
};
const TYPES = ['tache', 'projet', 'ressource', 'area'];

const invalide = (msg) => new AppError(msg, 400, 'PARAMETRE_INVALIDE');
const verifierId = (id) => {
  if (typeof id !== 'string' || !/^[0-9a-f-]{32,36}$/i.test(id)) throw invalide('Identifiant invalide');
  return id;
};
const verifierType = (type) => {
  if (!TYPES.includes(type)) throw invalide(`Type invalide (${TYPES.join(', ')})`);
  return type;
};
const verifierDate = (d) => {
  if (typeof d !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(d) || Number.isNaN(Date.parse(d)))
    throw invalide('Date invalide (format YYYY-MM-DD)');
  return d;
};

// ---------- Lecture ----------

async function charger(archive) {
  const [projets, tachesActives, ressources, areas, tousProjets, toutesAreas, tachesArchivees] =
    await Promise.all([
      repo.findProjets(archive),
      repo.findTaches(false), // sert aux statistiques des projets, quel que soit le mode
      repo.findRessources(archive),
      repo.findAreas(archive),
      repo.findTousProjets(),
      repo.findToutesAreas(),
      archive ? repo.findTaches(true) : [],
    ]);
  return {
    projets, ressources, areas,
    taches: archive ? tachesArchivees : tachesActives,
    tachesActives,
    nomProjet: new Map(tousProjets.map((p) => [p.id, p.nom])),
    nomArea: new Map(toutesAreas.map((a) => [a.id, a.nom])),
  };
}

const premierNom = (ids, noms) => ids.map((i) => noms.get(i)).find(Boolean) ?? null;

function construire(c) {
  const aujourdhui = today();

  const parProjet = new Map();
  for (const t of c.tachesActives)
    for (const pid of t.projetIds) {
      if (!parProjet.has(pid)) parProjet.set(pid, []);
      parProjet.get(pid).push(t);
    }

  const taches = c.taches.map((t) => {
    const echeance = t.echeance ? day(t.echeance) : null;
    return {
      id: t.id, type: 'tache', nom: t.nom,
      statut: t.termine ? 'Terminée' : 'À faire',
      categorie: premierNom(t.projetIds, c.nomProjet) ?? 'Sans projet',
      priorite: null, echeance,
      termine: t.termine, aRevoir: t.aRevoir,
      enRetard: !t.termine && !!echeance && echeance < aujourdhui,
    };
  });

  const projets = c.projets.map((p) => {
    const ts = parProjet.get(p.id) ?? [];
    const terminees = ts.filter((t) => t.termine).length;
    const ouvertes = ts.length - terminees;
    const area = premierNom(p.areaIds, c.nomArea);
    return {
      id: p.id, type: 'projet', nom: p.nom, statut: p.statut,
      categorie: area ?? 'Sans area',
      priorite: p.priorite, echeance: p.fin ? day(p.fin) : null,
      total: ts.length, terminees, ouvertes,
      sansArea: !area,
      // Aucune tâche : c'est peut-être juste une tâche déguisée en projet
      candidatTache: ts.length === 0 && p.statut !== 'Done',
      // On ne convertit que si aucune tâche ouverte ne serait laissée derrière
      convertible: ouvertes === 0 && p.statut !== 'Done',
      // Fini (statut Done, ou toutes les tâches faites) : à archiver
      inactif: p.statut === 'Done' || (ts.length > 0 && ouvertes === 0),
    };
  });

  const ressources = c.ressources.map((r) => ({
    id: r.id, type: 'ressource', nom: r.nom, statut: r.statut,
    categorie: r.type ?? 'Sans type', pause: r.pause,
  }));

  const projetsActifs = new Set(
    projets.filter((p) => p.statut === 'In progress' || p.statut === 'Planned').map((p) => p.id),
  );
  const areas = c.areas.map((a) => ({
    id: a.id, type: 'area', nom: a.nom, statut: a.statut,
    categorie: a.statut ?? 'Sans état',
    sansProjetActif: !a.projetIds.some((id) => projetsActifs.has(id)),
  }));

  return { taches, projets, ressources, areas };
}

// Inventaire complet (archive=false : éléments vivants, archive=true : l'onglet Archives)
exports.elements = async (archive) => {
  const e = construire(await charger(archive));
  return {
    archive,
    compteurs: {
      taches: e.taches.length, projets: e.projets.length,
      ressources: e.ressources.length, areas: e.areas.length,
    },
    ...e,
  };
};

// Ce que la revue doit montrer : combien d'éléments demandent une décision
exports.etat = async () => {
  const e = construire(await charger(false));
  const aujourdhui = today();
  return {
    aujourdhui,
    semaine: debutSemaine(aujourdhui),
    mois: aujourdhui.slice(0, 7),
    compteurs: {
      inboxProjets: e.projets.filter((p) => p.statut === 'Inbox').length,
      inboxRessources: e.ressources.filter((r) => r.statut === 'Inbox').length,
      tachesEnRetard: e.taches.filter((t) => t.enRetard).length,
      tachesARevoir: e.taches.filter((t) => t.aRevoir && !t.termine).length,
      ressourcesARevoir: e.ressources.filter((r) => r.statut === 'To Review').length,
      projetsSansArea: e.projets.filter((p) => p.sansArea && p.statut !== 'Inbox').length,
      projetsInactifs: e.projets.filter((p) => p.inactif).length,
      projetsCandidatsTaches: e.projets.filter((p) => p.candidatTache).length,
      projetsPlanifies: e.projets.filter((p) => p.statut === 'Planned').length,
      areasSansProjetActif: e.areas.filter((a) => a.sansProjetActif).length,
    },
  };
};

// ---------- Écriture ----------

exports.archiver = async ({ type, id, archive }) => {
  verifierType(type);
  verifierId(id);
  await repo.majPage(id, { Archive: { checkbox: archive !== false } });
  return { id, archive: archive !== false };
};

exports.changerStatut = async ({ type, id, statut }) => {
  verifierType(type);
  verifierId(id);
  const def = STATUTS[type];
  if (!def) throw invalide('Ce type n’a pas de statut');
  if (!def.valeurs.includes(statut)) throw invalide(`Statut invalide (${def.valeurs.join(', ')})`);
  await repo.majPage(id, { [def.prop]: { status: { name: statut } } });
  return { id, statut };
};

exports.terminerTache = async (id) => {
  verifierId(id);
  await repo.majPage(id, { Completed: { checkbox: true } });
  return { id };
};

// Reporte plusieurs tâches à une nouvelle date (séquentiel : Notion limite à ~3 requêtes/s)
exports.reporterTaches = async ({ ids, date }) => {
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 100)
    throw invalide('"ids" doit contenir entre 1 et 100 identifiants');
  ids.forEach(verifierId);
  verifierDate(date);
  for (const id of ids) await repo.majPage(id, { 'Due Date': { date: { start: date } } });
  return { reportees: ids.length, date };
};

exports.convertirProjetEnTache = async (id) => {
  verifierId(id);
  const projet = (await repo.findTousProjets()).find((p) => p.id === id);
  if (!projet) throw new AppError('Projet introuvable', 404, 'PROJET_INTROUVABLE');

  const ouvertes = (await repo.findTaches(false)).filter(
    (t) => !t.termine && t.projetIds.includes(id),
  ).length;
  if (ouvertes > 0)
    throw new AppError(
      `Ce projet a encore ${ouvertes} tâche(s) ouverte(s) : termine-les ou archive-les d’abord`,
      409, 'PROJET_NON_CONVERTIBLE',
    );

  const tacheId = await repo.creerTache({
    nom: projet.nom,
    echeance: projet.fin ? day(projet.fin) : null,
    termine: projet.statut === 'Done',
  });
  await repo.majPage(id, { Archive: { checkbox: true } });
  return { projetId: id, tacheId };
};
