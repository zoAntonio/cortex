const { notion } = require('../../config/notion');
const { queryAll } = require('../../shared/notion/query');
const { vider } = require('../../shared/cache');
const projetSchema = require('../projets/projet.schema');
const taskSchema = require('../projets/task.schema');
const ressourceSchema = require('./ressource.schema');
const areaSchema = require('./area.schema');

const filtreArchive = (archive) => ({ property: 'Archive', checkbox: { equals: archive } });
const lire = (schema, archive) => queryAll(schema, { filter: filtreArchive(archive), ttl: 300 });

exports.findProjets = (archive) => lire(projetSchema, archive);
exports.findTaches = (archive) => lire(taskSchema, archive);
exports.findRessources = (archive) => lire(ressourceSchema, archive);
exports.findAreas = (archive) => lire(areaSchema, archive);

// Archivés ou non : sert à retrouver le nom d'un projet / d'une area depuis un autre élément
exports.findTousProjets = () => queryAll(projetSchema, { ttl: 300 });
exports.findToutesAreas = () => queryAll(areaSchema, { ttl: 300 });

// --- Écritures (le cache est vidé pour que la lecture suivante soit à jour) ---

exports.majPage = async (pageId, properties) => {
  await notion.pages.update({ page_id: pageId, properties });
  vider();
};

exports.creerTache = async ({ nom, echeance, termine }) => {
  const properties = {
    Nom: { title: [{ text: { content: nom } }] },
    Completed: { checkbox: !!termine },
  };
  if (echeance) properties['Due Date'] = { date: { start: echeance } };

  const page = await notion.pages.create({
    parent: { type: 'data_source_id', data_source_id: taskSchema.dataSourceId },
    properties,
  });
  vider();
  return page.id;
};
