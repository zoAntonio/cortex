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

module.exports = { ok, asyncHandler, entier };