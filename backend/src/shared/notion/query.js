const { notion } = require('../../config/notion');
const casters = require('./casters');
const { AppError } = require('../errors');

// Transforme une page Notion brute en objet simple, selon le schéma
function mapPage(page, fields) {
  const out = { id: page.id };
  for (const [cle, [nomNotion, type]] of Object.entries(fields)) {
    const prop = page.properties[nomNotion];
    if (!prop) {
      throw new AppError(`Propriété Notion introuvable : "${nomNotion}"`, 500);
    }
    const caster = casters[type];
    if (!caster) throw new AppError(`Type inconnu dans le schéma : "${type}"`, 500);
    out[cle] = caster(prop);
  }
  return out;
}

// Récupère TOUTES les lignes (gère la pagination) et les mappe
async function queryAll(schema, { filter, sorts } = {}) {
  if (!schema.dataSourceId) {
    throw new AppError('ID de data source manquant (voir backend/.env)', 500);
  }
  const resultats = [];
  let cursor;
  do {
    const rep = await notion.dataSources.query({
      data_source_id: schema.dataSourceId,
      filter,
      sorts,
      start_cursor: cursor,
      page_size: 100,
    });
    resultats.push(...rep.results.map((p) => mapPage(p, schema.fields)));
    cursor = rep.has_more ? rep.next_cursor : undefined;
  } while (cursor);
  return resultats;
}

module.exports = { queryAll, mapPage };