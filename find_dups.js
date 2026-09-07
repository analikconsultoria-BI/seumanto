const fs = require('fs');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) { result.push(current); current = ''; }
    else current += char;
  }
  result.push(current);
  return result;
}

const cleanStr = str => str ? str.replace(/^"|"$/g, '').trim() : '';

const csvData = fs.readFileSync('produtos_completo.csv', 'utf8');
const lines = csvData.split('\n').filter(l => l.trim().length > 0);

// Group by title
const byTitle = new Map();

lines.forEach(line => {
  const parts = parseCSVLine(line);
  if (parts.length < 5) return;
  const titulo = cleanStr(parts[1]);
  const url = cleanStr(parts[2]);
  
  if (!byTitle.has(titulo)) {
    byTitle.set(titulo, new Set());
  }
  byTitle.get(titulo).add(url);
});

// Find titles that have more than 1 unique album URL
let duplicates = [];
for (const [titulo, urls] of byTitle.entries()) {
  if (urls.size > 1) {
    duplicates.push({
      titulo,
      urls: Array.from(urls)
    });
  }
}

console.log(`Encontrados ${duplicates.length} produtos com mais de 1 álbum.\n`);

// Mostra as primeiras 5 ocorrências para o usuário
duplicates.slice(0, 5).forEach((dup, i) => {
  console.log(`\n=== Amostra ${i+1} ===`);
  console.log(`Título: "${dup.titulo}"`);
  console.log(`Aparece em ${dup.urls.length} álbuns diferentes:`);
  dup.urls.forEach(u => console.log(`  - ${u}`));
});
