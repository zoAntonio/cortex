const express = require('express');
const jour = require('./jour.service');
const hebdo = require('./hebdo.service');
const mois = require('./mois.service');
const { ok, asyncHandler, dateISO } = require('../../shared/http');
const { today } = require('../../shared/date-utils');

const router = express.Router();

const lireDate = (req) => dateISO(req.query.date, { nom: 'date', defaut: today() });

router.get('/jour', asyncHandler(async (req, res) => ok(res, await jour.jour(lireDate(req)))));
router.get('/semaine', asyncHandler(async (req, res) => ok(res, await hebdo.semaine(lireDate(req)))));
router.get('/mois', asyncHandler(async (req, res) => ok(res, await mois.mois(lireDate(req)))));

module.exports = router;