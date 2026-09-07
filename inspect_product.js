/**
 * inspect_product.js
 * Mostra os dados do produto csv_465 no CSV
 */

const fs = require('fs');

const csvData = fs.readFileSync('produtos_completo.csv', 'utf8');
const lines = csvData.split('\n').filter(l => l.trim().length > 0);

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

// Simula o agrupamento do csv_loader.js
const productMap = new Map();
let skipped = 0;

lines.forEach(line => {
  const parts = parseCSVLine(line);
  if (parts.length < 5) { skipped++; return; }
  const [categoria, titulo, url_album, imagem_raw, ordem_imagem] = parts;
  const imagem = cleanStr(imagem_raw);
  const key = cleanStr(titulo) + '||' + cleanStr(url_album);
  
  if (!productMap.has(key)) {
    productMap.set(key, {
      categoria: cleanStr(categoria),
      titulo: cleanStr(titulo),
      url_album: cleanStr(url_album),
      images: []
    });
  }
  
  if (!imagem.includes('/square.')) {
    productMap.get(key).images.push({ url: imagem, order: parseInt(cleanStr(ordem_imagem)) });
  }
});

// Converte para array ordenado por categoria para simular csv_loader
const catOrder = { 'Brasileirao Serie A': 0, 'La Liga': 1, 'Premier League': 2 };
const allProducts = Array.from(productMap.values()).sort((a, b) => {
  return (catOrder[a.categoria] || 99) - (catOrder[b.categoria] || 99);
});

// Produto 465 (índice 464)
const target = allProducts[464];
if (!target) {
  console.log('Produto 465 não encontrado');
  process.exit(1);
}

target.images.sort((a, b) => a.order - b.order);

console.log('=== PRODUTO csv_465 ===');
console.log('Categoria:', target.categoria);
console.log('Título:', target.titulo);
console.log('URL Album:', target.url_album);
console.log(`Total de imagens: ${target.images.length}`);
console.log('\nImagens:');
target.images.forEach((img, i) => {
  const filename = img.url.replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_');
  // Verifica duplicatas
  const isDup = target.images.findIndex(x => x.url === img.url) !== i;
  console.log(`  [${i+1}] ordem=${img.order} ${isDup ? '⚠ DUPLICATA' : ''} → ${filename}`);
});

// Conta duplicatas
const urls = target.images.map(i => i.url);
const uniqueUrls = new Set(urls);
if (urls.length !== uniqueUrls.size) {
  console.log(`\n⚠ PROBLEMA: ${urls.length - uniqueUrls.size} imagem(ns) duplicada(s)!`);
}

// Verifica se a ordem=1 existe
const coverImg = target.images.find(i => i.order === 1);
console.log('\nCapa (order=1):', coverImg ? coverImg.url : 'NÃO ENCONTRADA — usará images[0]');
if (!coverImg) console.log('images[0]:', target.images[0]?.url);
