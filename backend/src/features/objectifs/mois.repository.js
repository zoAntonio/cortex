const { queryAll } = require('../../shared/notion/query');
const schema = require('./mois.schema');

// Tout ce qui commence avant la fin du mois (le chevauchement est vérifié dans le service)
exports.findStartedBefore = (fin) =>
  queryAll(schema, {
    filter: { property: 'Période', date: { on_or_before: fin } },
    sorts: [{ property: 'Période', direction: 'ascending' }],
  });