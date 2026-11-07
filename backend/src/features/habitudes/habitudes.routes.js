const express = require('express');
const service = require('./habitudes.service');
const { ok, asyncHandler, entier } = require('../../shared/http');
const { today } = require('../../shared/date-utils');

const router = express.Router();

// GET /api/habitudes/heatmap?annee=2026
router.get('/heatmap', asyncHandler(async (req, res) => {
  const annee = entier(req.query.annee, {
    nom: 'annee', min: 2000, max: 2100, defaut: Number(today().slice(0, 4)),
  });
  ok(res, await service.heatmap(annee));
}));

module.exports = router;