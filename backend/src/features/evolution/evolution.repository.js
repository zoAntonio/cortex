const { queryAll } = require('../../shared/notion/query');
const schema = require('./suivi.schema');

// Lignes entre deux dates incluses, triées par date
exports.findBetween = (debut, fin) =>
  queryAll(schema, {
    filter: {
      and: [
        { property: 'Date', date: { on_or_after: debut } },
        { property: 'Date', date: { on_or_before: fin } },
      ],
    },
    sorts: [{ property: 'Date', direction: 'ascending' }],
  });