/**
 * check_missing.js
 * Verifica quais imagens do CSV atual ainda não existem em assets/catalog/
 */
const fs = require('fs');
const path = require('path');

const csvPath = 'produtos_completo.csv';
const outDir = path.join(__dirname, 'assets', 'catalog');

const csvData = fs.readFileSync(csvPath, 'utf8');
const lines = csvData.split('\n').filter(l => l.trim().length > 0);

const imagesToCheck = new Set();
lines.forEach(line => {
  const matches = line.match(/https:\/\/photo\.yupoo\.com\/[^"',\s]+/g);
  if (matches) {
    matches.forEach(url => {
      // Ignora square
      if (!url.includes('/square.')) {
        imagesToCheck.add(url.trim());
      }
    });
  }
});

const urls = Array.from(imagesToCheck);
let exists = 0;
let missing = 0;

urls.forEach(url => {
  const filename = url.replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_');
  if (fs.existsSync(path.join(outDir, filename))) {
    exists++;
  } else {
    missing++;
  }
});

console.log(`Total de imagens no CSV: ${urls.length}`);
console.log(`✓ Já existem na pasta: ${exists}`);
console.log(`✗ Faltando (precisam ser baixadas): ${missing}`);
