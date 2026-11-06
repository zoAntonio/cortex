require('dotenv').config();

// Configuration du DNS pour éviter les problèmes de résolution de noms
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Client } = require('@notionhq/client');


const app = express();
app.use(cors());
app.use(express.json());

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Test général
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    notionToken: !!process.env.NOTION_TOKEN,
    mongo: mongoose.connection.readyState === 1,
  });
});

// Liste ce que l'intégration Notion peut voir
app.get('/api/notion/test', async (req, res) => {
  try {
    const response = await notion.search({});
    const items = response.results.map((r) => ({
      id: r.id,
      type: r.object,
      titre: r.title?.[0]?.plain_text ?? '(sans titre)',
    }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur MongoDB :', err.message));

app.listen(process.env.PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${process.env.PORT}`);
});