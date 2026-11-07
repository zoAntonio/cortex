require('../../config/env'); // garantit que le .env est chargé

// [clé code, nom exact de la propriété Notion]
const HABITUDES = [
  ['makeMyBed',    'Make My Bed'],
  ['shower',       'Shower'],
  ['exercise',     'Exercise 15min'],
  ['read',         'Read'],
  ['planDay',      'Plan a day'],
  ['drink',        'Drink 2L'],
  ['meditation',   'Meditation'],
  ['workFuture',   'Work on future'],
  ['journal',      'Journal'],
  ['resetLife',    'Reset life'],
].map(([cle, nom]) => ({ cle, nom }));

const fields = { date: ['Date', 'date'] };
for (const h of HABITUDES) fields[h.cle] = [h.nom, 'checkbox'];

module.exports = {
  dataSourceId: process.env.NOTION_DS_HABITS,
  fields,
  HABITUDES,
};