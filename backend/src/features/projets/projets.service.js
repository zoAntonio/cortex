const repo = require('./projets.repository');
const { today, day } = require('../../shared/date-utils');

const ORDRE_STATUT = { 'In progress': 0, Planned: 1, Inbox: 2, 'En pause': 3, Done: 4 };
const ORDRE_PRIORITE = { High: 0, Medium: 1, Low: 2 };

exports.projets = async () => {
  const [projets, taches] = await Promise.all([repo.findProjets(), repo.findTaches()]);
  const aujourdhui = today();

  // Index des tâches par projet (une tâche peut être liée à plusieurs projets)
  const parProjet = new Map();
  for (const t of taches) {
    for (const pid of t.projetIds) {
      if (!parProjet.has(pid)) parProjet.set(pid, []);
      parProjet.get(pid).push(t);
    }
  }

  const liste = projets.map((p) => {
    const ts = parProjet.get(p.id) ?? [];
    const terminees = ts.filter((t) => t.termine).length;
    const ouvertes = ts.filter((t) => !t.termine && t.echeance);
    const echeances = ouvertes.map((t) => day(t.echeance));

    return {
      id: p.id,
      nom: p.nom,
      statut: p.statut,
      priorite: p.priorite,
      debut: p.debut ? day(p.debut) : null,
      fin: p.fin ? day(p.fin) : null,
      total: ts.length,
      terminees,
      progression: ts.length ? Math.round((terminees / ts.length) * 100) : 0,
      enRetard: echeances.filter((d) => d < aujourdhui).length,
      prochaineEcheance: echeances.filter((d) => d >= aujourdhui).sort()[0] ?? null,
    };
  });

  liste.sort(
    (a, b) =>
      (ORDRE_STATUT[a.statut] ?? 9) - (ORDRE_STATUT[b.statut] ?? 9) ||
      (ORDRE_PRIORITE[a.priorite] ?? 9) - (ORDRE_PRIORITE[b.priorite] ?? 9) ||
      a.nom.localeCompare(b.nom),
  );

  const tachesTotal = liste.reduce((s, p) => s + p.total, 0);
  const tachesTerminees = liste.reduce((s, p) => s + p.terminees, 0);

  return {
    resume: {
      projets: liste.length,
      tachesTotal,
      tachesTerminees,
      progression: tachesTotal ? Math.round((tachesTerminees / tachesTotal) * 100) : 0,
      enRetard: liste.reduce((s, p) => s + p.enRetard, 0),
    },
    projets: liste,
  };
};