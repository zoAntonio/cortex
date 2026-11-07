class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

// Middleware 404 : à placer APRÈS toutes les routes
const notFound = (req, res) =>
  res.status(404).json({ erreur: `Route introuvable : ${req.method} ${req.originalUrl}` });

// Middleware d'erreurs : format uniforme { erreur }
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ erreur: err.message });
};

module.exports = { AppError, notFound, errorHandler };