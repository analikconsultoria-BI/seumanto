/**
 * fix_order.js
 * Corrige a ordem das imagens de um album específico no CSV
 * Usage: node fix_order.js <album_id>
 * Ex:    node fix_order.js 252958006
 */

const fs = require('fs');

const albumId = process.argv[2];
if (!albumId) {
  console.error('Usage: node fix_order.js <album_id>');
  process.exit(1);
}

const csvPath = 'produtos_completo.csv';
const csvData = fs.readFileSync(csvPath, 'utf8');
const lines = csvData.split('\n');

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

// Primeiro: coletar as imagens desse album com suas ordens atuais
const albumLines = [];
const otherLines = [];

lines.forEach((line, idx) => {
  if (line.includes(albumId)) {
    albumLines.push({ idx, line });
  } else {
    otherLines.push({ idx, line });
  }
});

console.log(`Album ${albumId}: ${albumLines.length} linhas encontradas`);

if (albumLines.length === 0) {
  console.error('Álbum não encontrado!');
  process.exit(1);
}

// Extrair as ordens atuais
const parsedAlbum = albumLines.map(({ idx, line }) => {
  const parts = parseCSVLine(line);
  if (parts.length < 5) return { idx, line, order: null };
  const order = parseInt(cleanStr(parts[4]));
  return { idx, line, order, parts };
}).filter(x => x.order !== null && !isNaN(x.order));

// Verificar duplicatas antes de ordenar
const uniqueUrls = new Set(parsedAlbum.map(x => cleanStr(x.parts[3])));
const noDups = [...uniqueUrls].map(url => parsedAlbum.find(x => cleanStr(x.parts[3]) === url));

// Ordenar pela ordem atual para mapear novo -> velho
noDups.sort((a, b) => a.order - b.order);
const totalImages = noDups.length;

console.log(`Imagens únicas: ${totalImages}`);
console.log('Ordens ANTES:');
noDups.forEach((x, i) => {
  const fname = cleanStr(x.parts[3]).replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_');
  console.log('  ordem=' + x.order + ' -> ' + fname);
});

// Inverter a ordem: imagem que tinha ordem 1 vira a última, e a última vira 1
// Ex: [1,2] -> [2,1], [1,2,3] -> [3,2,1]
const reversedOrders = noDups.map(x => x.order).reverse();

console.log('\nOrdens DEPOIS:');
noDups.forEach((x, i) => {
  const fname = cleanStr(x.parts[3]).replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_');
  console.log('  ordem=' + reversedOrders[i] + ' -> ' + fname);
});

// Reescrever o CSV com as novas ordens
const newLines = [...lines];

noDups.forEach((item, i) => {
  const newOrder = reversedOrders[i];
  const parts = item.parts;
  // Reconstruir a linha com nova ordem
  const newLine = '"' + parts[0] + '","' + parts[1] + '","' + cleanStr(parts[2]) + '","' + cleanStr(parts[3]) + '",' + newOrder;
  newLines[item.idx] = newLine;
});

// Também atualizar linhas duplicadas desse album (se houver) com as mesmas correções
// (serão ignoradas pelo dedup do csv_loader, mas para manter o CSV limpo)
albumLines.forEach(({ idx, line }) => {
  const parts = parseCSVLine(line);
  if (parts.length < 5) return;
  const url = cleanStr(parts[3]);
  const match = noDups.find(x => cleanStr(x.parts[3]) === url);
  if (match) {
    const newOrder = reversedOrders[noDups.indexOf(match)];
    const newLine = '"' + parts[0] + '","' + parts[1] + '","' + cleanStr(parts[2]) + '","' + url + '",' + newOrder;
    newLines[idx] = newLine;
  }
});

fs.writeFileSync(csvPath, newLines.join('\n'));
console.log('\nCSV atualizado com sucesso!');
console.log('Agora de F5 no site para ver a nova ordem.');
