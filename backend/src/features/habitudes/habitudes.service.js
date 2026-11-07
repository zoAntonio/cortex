const repo = require('./habitudes.repository');
const { HABITUDES } = require('./habitudes.schema');
const { today, day, addDays, diffDays } = require('../../shared/date-utils');

// Série en cours : on ne casse pas la série si aujourd'hui n'est pas encore coché
function serieEnCours(set) {
  let d = today();
  if (!set.has(d)) d = addDays(d, -1);
  let n = 0;
  while (set.has(d)) { n++; d = addDays(d, -1); }
  return n;
}

function meilleureSerie(datesTriees) {
  let best = 0, cur = 0, prev = null;
  for (const d of datesTriees) {
    cur = prev && diffDays(prev, d) === 1 ? cur + 1 : 1;
    best = Math.max(best, cur);
    prev = d;
  }
  return best;
}

exports.heatmap = async (annee) => {
  const lignes = (await repo.findByYear(annee)).filter((l) => l.date);
  const joursSuivis = new Set(lignes.map((l) => day(l.date))).size;

  const habitudes = HABITUDES.map(({ cle, nom }) => {
    const jours = [...new Set(lignes.filter((l) => l[cle]).map((l) => day(l.date)))].sort();
    const set = new Set(jours);
    return {
      cle,
      nom,
      jours,
      stats: {
        total: jours.length,
        serieEnCours: serieEnCours(set),
        meilleureSerie: meilleureSerie(jours),
        tauxReussite: joursSuivis ? Math.round((jours.length / joursSuivis) * 100) : 0,
      },
    };
  });

  return { annee, habitudes };
};