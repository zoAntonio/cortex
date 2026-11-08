const { queryAll } = require('../../shared/notion/query');
const projetSchema = require('./projet.schema');
const taskSchema = require('./task.schema');

const nonArchive = { property: 'Archive', checkbox: { equals: false } };

exports.findProjets = () => queryAll(projetSchema, { filter: nonArchive });
exports.findTaches = () => queryAll(taskSchema, { filter: nonArchive });