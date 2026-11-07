class AppError extends Error {
  constructor(message, status = 500, code = 'ERREUR_INTERNE') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// Traduit les erreurs du SDK Notion en messages clairs
function traduire(err) {
  if (err instanceof AppError) return err;

  const c = err.code; // code Notion (ex. 'unauthorized', 'object_not_found')
  if (c === 'unauthorized')
    return new AppError('Token Notion invalide ou expiré (vérifie NOTION_TOKEN dans .env)', 401, 'NOTION_TOKEN_INVALIDE');
  if (c === 'object_not_found')
    return new AppError('Base introuvable ou non partagée avec l’intégration (Notion : « ... » → Connexions)', 404, 'NOTION_NON_PARTAGE');
  if (c === 'rate_limited')
    return new AppError('Limite de requêtes Notion atteinte, réessaie dans quelques secondes', 429, 'NOTION_LIMITE_DEBIT');
  if (c === 'validation_error')
    return new AppError(`Requête Notion invalide : ${err.message}`, 400, 'NOTION_REQUETE_INVALIDE');
  if (c === 'restricted_resource')
    return new AppError('Accès refusé par Notion à cette ressource', 403, 'NOTION_ACCES_REFUSE');

  return new AppError(err.message || 'Erreur interne', 500, 'ERREUR_INTERNE');
}

const notFound = (req, res, next) =>
  next(new AppError(`Route introuvable : ${req.method} ${req.originalUrl}`, 404, 'ROUTE_INTROUVABLE'));

// Dernier middleware : format d'erreur uniforme
const errorHandler = (err, req, res, next) => {
  const e = traduire(err);
  if (e.status >= 500) console.error(err); // détail complet dans le terminal
  res.status(e.status).json({
    ok: false,
    erreur: { code: e.code, message: e.message, status: e.status },
  });
};

module.exports = { AppError, notFound, errorHandler };