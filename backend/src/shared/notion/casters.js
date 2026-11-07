const plain = (arr = []) => arr.map((t) => t.plain_text).join('');

// Chaque type déclaré dans un schéma correspond à une fonction ici
const casters = {
  title:       (p) => plain(p.title),
  text:        (p) => plain(p.rich_text),
  number:      (p) => p.number,
  checkbox:    (p) => p.checkbox,
  select:      (p) => p.select?.name ?? null,
  multiSelect: (p) => p.multi_select.map((o) => o.name),
  status:      (p) => p.status?.name ?? null,
  date:        (p) => p.date?.start ?? null,
  dateRange:   (p) => (p.date ? { start: p.date.start, end: p.date.end } : null),
  relation:    (p) => p.relation.map((r) => r.id),
  url:         (p) => p.url,
  // Formule : on prend la valeur selon son type (number, string, boolean, date)
  formula: (p) => {
    const f = p.formula;
    if (f.type === 'date') return f.date?.start ?? null;
    return f[f.type] ?? null;
  },
  // Rollup numérique (ex. progression)
  rollupNumber: (p) => p.rollup?.number ?? null,
};

module.exports = casters;