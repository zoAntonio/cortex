require('../../config/env');

module.exports = {
  dataSourceId: process.env.NOTION_DS_AREAS,
  fields: {
    nom:        ['Nom', 'title'],
    statut:     ['État', 'status'],
    projetIds:  ['Projects', 'relation'],
    archive:    ['Archive', 'checkbox'],
  },
};
