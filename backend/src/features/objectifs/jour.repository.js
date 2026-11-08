const { queryAll } = require('../../shared/notion/query');
const schema = require('./jour.schema');

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