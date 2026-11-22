require('../../config/env');

module.exports = {
  dataSourceId: process.env.NOTION_DS_OBJECTIFS_HEBDO,
  fields: {
    nom:            ['Objectif hebdomadaire', 'title'],
    semaine:        ['Semaine', 'date'],
    seuilValide:    ['Seuil valide', 'number'],
    seuilExcellent: ['Seuil excellent', 'number'],
    reussis:        ['Objectifs journaliers réussis', 'rollupNumber'],
    resultat:       ['Résultat hebdomadaire', 'formula'],
    joursIds:       ['Objectifs journaliers', 'relation'],
  },
};