const express = require('express');
const service = require('./revue.service');
const { ok, asyncHandler } = require('../../shared/http');

const router = express.Router();

// GET /api/revue/elements?archive=1   inventaire (tâches, projets, ressources, areas)
router.get('/elements', asyncHandler(async (req, res) =>
  ok(res, await service.elements(req.query.archive === '1'))));

// GET /api/revue/etat   compteurs pour les revues hebdo / mensuelle
router.get('/etat', asyncHandler(async (req, res) => ok(res, await service.etat())));

// POST /api/revue/archiver   { type, id, archive? }
router.post('/archiver', asyncHandler(async (req, res) => ok(res, await service.archiver(req.body))));

// POST /api/revue/statut   { type, id, statut }
router.post('/statut', asyncHandler(async (req, res) => ok(res, await service.changerStatut(req.body))));

// POST /api/revue/taches/reporter   { ids, date }
router.post('/taches/reporter', asyncHandler(async (req, res) =>
  ok(res, await service.reporterTaches(req.body))));

// POST /api/revue/taches/:id/terminer
router.post('/taches/:id/terminer', asyncHandler(async (req, res) =>
  ok(res, await service.terminerTache(req.params.id))));

// POST /api/revue/projets/:id/convertir   projet -> tâche
router.post('/projets/:id/convertir', asyncHandler(async (req, res) =>
  ok(res, await service.convertirProjetEnTache(req.params.id))));

module.exports = router;
