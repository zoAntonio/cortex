const { queryAll } = require('../../shared/notion/query');
const schema = require('./habitudes.schema');

// Toutes les lignes de l'année, triées par date
exports.findByYear = (annee) =>
  queryAll(schema, {
    filter: {
      and: [
        { property: 'Date', date: { on_or_after: `${annee}-01-01` } },
        { property: 'Date', date: { on_or_before: `${annee}-12-31` } },
      ],
    },
    sorts: [{ property: 'Date', direction: 'ascending' }],
  });