const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./shared/errors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/notion', require('./features/notion-explorer/notion-explorer.routes'));

// Toujours en dernier
app.use(notFound);
app.use(errorHandler);

module.exports = app;