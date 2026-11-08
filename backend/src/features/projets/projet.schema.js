require('../../config/env');

module.exports = {
  dataSourceId: process.env.NOTION_DS_PROJECTS,
  fields: {
    nom:      ['Nom', 'title'],
    statut:   ['Status', 'status'],
    priorite: ['Priority', 'select'],
    debut:    ['Start Date', 'date'],
    fin:      ['End Date', 'date'],
    archive:  ['Archive', 'checkbox'],
  },
};