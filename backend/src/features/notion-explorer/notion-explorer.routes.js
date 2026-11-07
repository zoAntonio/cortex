const express = require('express');
const { notion } = require('../../config/notion');

const router = express.Router();

// GET /api/notion/bases : liste les data sources accessibles + leurs IDs
router.get('/bases', async (req, res, next) => {
  try {
    const rep = await notion.search({
      filter: { property: 'object', value: 'data_source' },
    });
    res.json(
      rep.results.map((r) => ({
        id: r.id,
        titre: r.title?.map((t) => t.plain_text).join('') || '(sans titre)',
      }))
    );
  } catch (err) { next(err); }
});

// GET /api/notion/bases/:id : propriétés et types d'une data source
router.get('/bases/:id', async (req, res, next) => {
  try {
    const ds = await notion.dataSources.retrieve({ data_source_id: req.params.id });
    res.json({
      titre: ds.title?.map((t) => t.plain_text).join(''),
      proprietes: Object.entries(ds.properties).map(([nom, p]) => ({ nom, type: p.type })),
    });
  } catch (err) { next(err); }
});

module.exports = router;