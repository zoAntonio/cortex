const { timezone } = require('../config/env');

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: timezone });
const day = (d) => d.slice(0, 10);
const addDays = (d, n) => new Date(Date.parse(d) + n * 86400000).toISOString().slice(0, 10);
const diffDays = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

const debutSemaine = (d) => addDays(d, -((new Date(Date.parse(d)).getUTCDay() + 6) % 7));

const JOURS = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
const nomJour = (d) => JOURS[new Date(Date.parse(d)).getUTCDay()];

// Premier et dernier jour du mois qui contient la date
const debutMois = (d) => `${d.slice(0, 7)}-01`;
const finMois = (d) =>
  new Date(Date.UTC(Number(d.slice(0, 4)), Number(d.slice(5, 7)), 0)).toISOString().slice(0, 10);

module.exports = { today, day, addDays, diffDays, debutSemaine, nomJour, debutMois, finMois };