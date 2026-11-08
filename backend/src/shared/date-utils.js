const { timezone } = require('../config/env');

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: timezone });
const day = (d) => d.slice(0, 10);
const addDays = (d, n) => new Date(Date.parse(d) + n * 86400000).toISOString().slice(0, 10);
const diffDays = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

// Lundi de la semaine qui contient la date
const debutSemaine = (d) => addDays(d, -((new Date(Date.parse(d)).getUTCDay() + 6) % 7));

// Libellé court du jour (lun, mar...)
const JOURS = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
const nomJour = (d) => JOURS[new Date(Date.parse(d)).getUTCDay()];

module.exports = { today, day, addDays, diffDays, debutSemaine, nomJour };