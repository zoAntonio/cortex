const { queryAll } = require('../../shared/notion/query');
const schema = require('./hebdo.schema');

exports.findBetween = (debut, fin) =>
  queryAll(schema, {
    filter: {
      and: [
        { property: 'Semaine', date: { on_or_after: debut } },
        { property: 'Semaine', date: { on_or_before: fin } },
      ],
    },
    sorts: [{ property: 'Semaine', direction: 'ascending' }],
  });