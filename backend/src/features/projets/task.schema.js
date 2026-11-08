require('../../config/env');

module.exports = {
  dataSourceId: process.env.NOTION_DS_TASK,
  fields: {
    nom:       ['Nom', 'title'],
    echeance:  ['Due Date', 'date'],
    projetIds: ['Project', 'relation'],
    termine:   ['Completed', 'checkbox'],
    archive:   ['Archive', 'checkbox'],
  },
};