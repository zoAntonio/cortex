const repo = require('./evolution.repository');
const { day, addDays, debutSemaine, nomJour } = require('../../shared/date-utils');

const arrondi = (n) => Math.round(n * 10) / 10;

// Construit les 7 jours d'une semaine, en complétant les jours absents
function construireSemaine(debut, lignes) {
  const parDate = new Map(lignes.filter((l) => l.date).map((l) => [day(l.date), l]));

  const jours = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(debut, i);
    const l = parDate.get(date);
    return {
      date,
      jour: nomJour(date),
      note: l?.note ?? null,
      noteTaches: l?.noteTaches ?? null,
      nbHabitudes: l?.nbHabitudes ?? null,
      tachesFaites: l ? [l.tache1, l.tache2, l.tache3].filter(Boolean).length : null,
    };
  });

  const suivis = jours.filter((j) => typeof j.note === 'number');
  const total = suivis.reduce((s, j) => s + j.note, 0);
  const meilleur = suivis.reduce((m, j) => (!m || j.note > m.note ? j : m), null);

  return {
    debut,
    fin: addDays(debut, 6),
    jours,
    stats: {
      moyenne: suivis.length ? arrondi(total / suivis.length) : null,
      total: arrondi(total),
      joursSuivis: suivis.length,
      meilleurJour: meilleur ? { date: meilleur.date, note: meilleur.note } : null,
    },
  };
}

function comparer(actuelle, precedente) {
  const a = actuelle.stats.moyenne;
  const p = precedente.stats.moyenne;
  if (a === null || p === null) return { ecartMoyenne: null, ecartPourcent: null, tendance: 'stable' };

  const ecart = arrondi(a - p);
  return {
    ecartMoyenne: ecart,
    ecartPourcent: p > 0 ? Math.round((ecart / p) * 100) : null,
    tendance: Math.abs(ecart) < 0.05 ? 'stable' : ecart > 0 ? 'hausse' : 'baisse',
  };
}

exports.evolution = async (dateRef) => {
  const debutActuelle = debutSemaine(dateRef);
  const debutPrecedente = addDays(debutActuelle, -7);

  // Une seule requête Notion pour les deux semaines
  const lignes = await repo.findBetween(debutPrecedente, addDays(debutActuelle, 6));
  const dansSemaine = (debut) =>
    lignes.filter((l) => l.date && day(l.date) >= debut && day(l.date) <= addDays(debut, 6));

  const semaineActuelle = construireSemaine(debutActuelle, dansSemaine(debutActuelle));
  const semainePrecedente = construireSemaine(debutPrecedente, dansSemaine(debutPrecedente));

  return {
    semaineActuelle,
    semainePrecedente,
    comparaison: comparer(semaineActuelle, semainePrecedente),
  };
};