const express = require('express');
const service = require('./habitudes.service');
const { AppError } = require('../../shared/errors');
const { today } = require('../../shared/date-utils');

const router = express.Router();

// GET /api/habitudes/heatmap?annee=2026
router.get('/heatmap', async (req, res, next) => {
  try {
    const annee = req.query.annee ? Number(req.query.annee) : Number(today().slice(0, 4));
    if (!Number.isInteger(annee) || annee < 2000 || annee > 2100) {
      throw new AppError('Paramètre "annee" invalide', 400);
    }
    res.json(await service.heatmap(annee));
  } catch (err) { next(err); }
});

module.exports = router;