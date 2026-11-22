const repo = require('./hebdo.repository');
const jourRepo = require('./jour.repository');
const { addDays, debutSemaine, day } = require('../../shared/date-utils');

function niveau(reussis, valide, excellent) {
  if (reussis === null) return 'insuffisant';
  if (excellent !== null && reussis >= excellent) return 'excellent';
  if (valide !== null && reussis >= valide) return 'valide';
  return 'insuffisant';
}

exports.semaine = async (dateRef) => {
  const debut = debutSemaine(dateRef);
  const fin = addDays(debut, 6);

  const [lignes, jours] = await Promise.all([
    repo.findBetween(debut, fin),
    jourRepo.findBetween(debut, fin),
  ]);

  const objectifs = lignes.map((l) => ({
    id: l.id,
    nom: l.nom,
    reussis: l.reussis,
    seuilValide: l.seuilValide,
    seuilExcellent: l.seuilExcellent,
    resultat: l.resultat,
    niveau: niveau(l.reussis, l.seuilValide, l.seuilExcellent),
    progression: l.seuilExcellent
      ? Math.min(100, Math.round(((l.reussis ?? 0) / l.seuilExcellent) * 100))
      : null,
    jours: jours
      .filter((j) => j.hebdoIds.includes(l.id))
      .map((j) => ({ date: j.date ? day(j.date) : null, nom: j.nom, accompli: j.accompli })),
  }));

  return { debut, fin, objectifs };
};