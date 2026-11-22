require('../../config/env');

module.exports = {
  dataSourceId: process.env.NOTION_DS_OBJECTIFS_MENSUELS,
  fields: {
    nom:     ['Objectif mensuel', 'title'],
    periode: ['Période', 'dateRange'],
  },
};