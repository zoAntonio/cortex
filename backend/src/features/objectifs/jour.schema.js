require('../../config/env');

module.exports = {
  dataSourceId: process.env.NOTION_DS_OBJECTIFS_JOURNALIERS,
  fields: {
    nom:      ['Objectif journalier', 'title'],
    date:     ['Date', 'date'],
    accompli: ['Accompli', 'checkbox'],
    hebdoIds: ['Objectif hebdomadaire', 'relation'],
  },
};