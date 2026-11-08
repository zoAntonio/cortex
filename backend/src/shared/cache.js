const { AsyncLocalStorage } = require('async_hooks');

const DUREE_DEFAUT = 120; // secondes

const contexte = new AsyncLocalStorage(); // sait si la requête en cours demande ?refresh=1
const memoire = new Map();                // cle -> { expire, valeur }
const enCours = new Map();                // cle -> promesse (évite les doublons simultanés)

async function cached(cle, secondes, fn) {
  const forcer = contexte.getStore()?.refresh;

  if (!forcer) {
    const e = memoire.get(cle);
    if (e && e.expire > Date.now()) return e.valeur;
    if (enCours.has(cle)) return enCours.get(cle);
  }

  const promesse = fn()
    .then((valeur) => {
      memoire.set(cle, { expire: Date.now() + secondes * 1000, valeur });
      return valeur;
    })
    .finally(() => enCours.delete(cle));

  enCours.set(cle, promesse);
  return promesse;
}

// Middleware : lit ?refresh=1 et le rend disponible à tout le code de la requête
const cacheMiddleware = (req, res, next) =>
  contexte.run({ refresh: req.query.refresh === '1' }, next);

const vider = () => memoire.clear();

module.exports = { cached, cacheMiddleware, vider, DUREE_DEFAUT };