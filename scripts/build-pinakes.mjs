import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const csvPath = join(__dirname, '../data/library_enriched_v1_1.csv');
const outPath = join(__dirname, '../public/pinakes.json');

function parseCSV(raw) {
  const lines = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim());
  const result = [];
  for (const line of lines) {
    const fields = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { fields.push(cur); cur = ''; }
      else { cur += ch; }
    }
    fields.push(cur);
    result.push(fields.map(f => f.trim()));
  }
  return result;
}

const raw = readFileSync(csvPath, 'utf8');
const rows = parseCSV(raw);
const [headers, ...dataRows] = rows;

const books = [];
const themes = new Set();
const categories = new Set();
const mediums = new Set();

for (const fields of dataRows) {
  const row = Object.fromEntries(headers.map((h, i) => [h, fields[i] ?? '']));
  const bookThemes = [row.Theme1, row.Theme2, row.Theme3, row.Theme4, row.Theme5].filter(Boolean);
  bookThemes.forEach(t => themes.add(t));
  if (row.Category) categories.add(row.Category);
  if (row.Medium) mediums.add(row.Medium);
  books.push({
    title: row.Title,
    author: row.Author,
    released: row.Released,
    read: row.Purchased,
    medium: row.Medium,
    category: row.Category,
    themes: bookThemes,
  });
}

const output = {
  books,
  facets: {
    themes: [...themes].sort(),
    categories: [...categories].sort(),
    mediums: [...mediums].sort(),
  },
};

writeFileSync(outPath, JSON.stringify(output));
console.log(`pinakes.json: ${books.length} books · ${themes.size} themes · ${categories.size} categories · ${mediums.size} mediums`);
