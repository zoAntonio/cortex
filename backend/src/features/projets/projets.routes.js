const express = require('express');
const service = require('./projets.service');
const { ok, asyncHandler } = require('../../shared/http');

const router = express.Router();

// GET /api/projets
router.get('/', asyncHandler(async (req, res) => ok(res, await service.projets())));

module.exports = router;