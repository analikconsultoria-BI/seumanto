/**
 * cleanup_catalog.js
 * Deleta duplicatas, órfãos e imagens infantis do assets/catalog/
 * Lê as listas geradas pelo analyze_usage.js
 */

const fs = require('fs');
const path = require('path');

const catalogDir = path.join(__dirname, 'assets', 'catalog');

function deleteList(listFile, label) {
  if (!fs.existsSync(listFile)) {
    console.log(`⚠️  ${label}: arquivo de lista não encontrado (${listFile})`);
    return 0;
  }
  const files = fs.readFileSync(listFile, 'utf8')
    .split('\n').map(l => l.trim()).filter(l => l);

  let deleted = 0, missing = 0;
  for (const fname of files) {
    const fpath = path.join(catalogDir, fname);
    if (fs.existsSync(fpath)) {
      fs.unlinkSync(fpath);
      deleted++;
    } else {
      missing++;
    }
  }
  console.log(`${label}: ${deleted} deletados, ${missing} já não existiam`);
  return deleted;
}

console.log('Iniciando limpeza do catalog...\n');

const d1 = deleteList('catalog_duplicates.txt', '🔁 Duplicatas');
const d2 = deleteList('catalog_orphans.txt',    '🗑️  Órfãos');
const d3 = deleteList('catalog_kids_images.txt','👶 Infantis');

const total = d1 + d2 + d3;
console.log(`\n✅ Total deletado: ${total} arquivos`);

const remaining = fs.readdirSync(catalogDir).length;
console.log(`📁 Arquivos restantes em assets/catalog/: ${remaining}`);
