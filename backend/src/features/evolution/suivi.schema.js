require('../../config/env');

module.exports = {
  dataSourceId: process.env.NOTION_DS_SUIVI,
  fields: {
    date:        ['Date', 'date'],
    note:        ['Note/20', 'formula'],
    noteTaches:  ['Note Taches', 'formula'],
    nbHabitudes: ['NB Habitude', 'number'],
    tache1:      ['1', 'checkbox'],
    tache2:      ['2', 'checkbox'],
    tache3:      ['3', 'checkbox'],
  },
};