require('../../config/env');

module.exports = {
  dataSourceId: process.env.NOTION_DS_RESOURCES,
  fields: {
    nom:     ['Nom', 'title'],
    statut:  ['Status', 'status'],
    type:    ['Type', 'select'],
    pause:   ['Pause', 'checkbox'],
    archive: ['Archive', 'checkbox'],
  },
};
