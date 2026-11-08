const express = require('express');
const service = require('./evolution.service');
const { ok, asyncHandler, dateISO } = require('../../shared/http');
const { today } = require('../../shared/date-utils');

const router = express.Router();

// GET /api/evolution?date=2026-11-08
router.get('/', asyncHandler(async (req, res) => {
  const date = dateISO(req.query.date, { nom: 'date', defaut: today() });
  ok(res, await service.evolution(date));
}));

module.exports = router;