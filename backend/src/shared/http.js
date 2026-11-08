const { AppError } = require('./errors');

// Réponse de succès uniforme
const ok = (res, data) =>
  res.json({ ok: true, data, meta: { genereLe: new Date().toISOString() } });

// Plus besoin de try/catch dans les routes
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Validation d'un entier dans une plage (ex. année)
const entier = (valeur, { nom, min, max, defaut }) => {
  if (valeur === undefined || valeur === '') return defaut;
  const n = Number(valeur);
  if (!Number.isInteger(n) || n < min || n > max)
    throw new AppError(`Paramètre "${nom}" invalide (entier entre ${min} et ${max})`, 400, 'PARAMETRE_INVALIDE');
  return n;
};

// Date au format YYYY-MM-DD
const dateISO = (valeur, { nom, defaut }) => {
  if (valeur === undefined || valeur === '') return defaut;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valeur) || Number.isNaN(Date.parse(valeur)))
    throw new AppError(`Paramètre "${nom}" invalide (format YYYY-MM-DD)`, 400, 'PARAMETRE_INVALIDE');
  return valeur;
};

module.exports = { ok, asyncHandler, entier, dateISO };