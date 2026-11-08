const repo = require('./mois.repository');
const { day, debutMois, finMois } = require('../../shared/date-utils');

exports.mois = async (dateRef) => {
  const debut = debutMois(dateRef);
  const fin = finMois(dateRef);
  const lignes = await repo.findStartedBefore(fin);

  const objectifs = lignes
    .filter((l) => l.periode)
    .map((l) => ({
      id: l.id,
      nom: l.nom,
      debut: day(l.periode.start),
      fin: day(l.periode.end ?? l.periode.start),
    }))
    // On garde ceux qui chevauchent le mois demandé
    .filter((o) => o.fin >= debut);

  return { mois: debut.slice(0, 7), debut, fin, objectifs };
};