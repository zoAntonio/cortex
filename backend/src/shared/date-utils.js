const { timezone } = require('../config/env');

// Date du jour au format YYYY-MM-DD, en fuseau Madagascar
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: timezone });

// Garde seulement YYYY-MM-DD (au cas où Notion renvoie une heure)
const day = (d) => d.slice(0, 10);

const addDays = (d, n) => new Date(Date.parse(d) + n * 86400000).toISOString().slice(0, 10);
const diffDays = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

module.exports = { today, day, addDays, diffDays };