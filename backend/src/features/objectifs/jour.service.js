const repo = require('./jour.repository');

exports.jour = async (date) => {
  const lignes = await repo.findBetween(date, date);
  const objectifs = lignes.map((l) => ({ id: l.id, nom: l.nom, accompli: l.accompli }));
  const accomplis = objectifs.filter((o) => o.accompli).length;

  return {
    date,
    total: objectifs.length,
    accomplis,
    progression: objectifs.length ? Math.round((accomplis / objectifs.length) * 100) : 0,
    objectifs,
  };
};