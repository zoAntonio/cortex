const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./shared/errors');
const { cacheMiddleware } = require('./shared/cache');
const path = require('path');
const dist = path.join(__dirname, '../../frontend/dist/frontend/browser');

const app = express();
app.use(cors());
app.use(express.json());

app.use(cacheMiddleware);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/notion', require('./features/notion-explorer/notion-explorer.routes'));
app.use('/api/habitudes', require('./features/habitudes/habitudes.routes'));
app.use('/api/evolution', require('./features/evolution/evolution.routes'));
app.use('/api/objectifs', require('./features/objectifs/objectifs.routes'));
app.use('/api/projets', require('./features/projets/projets.routes'));
app.use('/api/revue', require('./features/revue/revue.routes'));

app.use(express.static(dist));
app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')));

// Toujours en dernier
app.use(notFound);
app.use(errorHandler);

module.exports = app;