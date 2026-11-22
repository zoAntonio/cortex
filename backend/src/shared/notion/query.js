const { notion } = require('../../config/notion');
const casters = require('./casters');
const { AppError } = require('../errors');
const { cached, DUREE_DEFAUT } = require('../cache');

function mapPage(page, fields) {
  const out = { id: page.id };
  for (const [cle, [nomNotion, type]] of Object.entries(fields)) {
    const prop = page.properties[nomNotion];
    if (!prop) {
      throw new AppError(`Propriété Notion introuvable : "${nomNotion}"`, 500, 'NOTION_PROPRIETE_INTROUVABLE');
    }
    const caster = casters[type];
    if (!caster) throw new AppError(`Type inconnu dans le schéma : "${type}"`, 500, 'SCHEMA_TYPE_INCONNU');
    out[cle] = caster(prop);
  }
  return out;
}

// Lecture réelle de Notion (pagination incluse)
async function fetchAll(schema, { filter, sorts }) {
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

// Lecture avec cache. ttl = durée en secondes (défaut 120)
async function queryAll(schema, { filter, sorts, ttl = DUREE_DEFAUT } = {}) {
  if (!schema.dataSourceId) {
    throw new AppError('ID de data source manquant (voir backend/.env)', 500, 'CONFIG_ID_MANQUANT');
  }
  const cle = JSON.stringify([schema.dataSourceId, filter, sorts]);
  return cached(cle, ttl, () => fetchAll(schema, { filter, sorts }));
}

module.exports = { queryAll, mapPage };