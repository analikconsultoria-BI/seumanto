/**
 * analyze_usage.js
 * Analisa quais arquivos em assets/catalog/ são realmente usados pelo CSV,
 * quais são duplicatas (original + _big cópia), quais são órfãos,
 * e quantos produtos são infantis.
 */

const fs = require('fs');
const path = require('path');

const catalogDir = path.join(__dirname, 'assets', 'catalog');
const csvPath = path.join(__dirname, 'produtos_completo.csv');

// === 1. Ler CSV e coletar imagens usadas + produtos infantis ===
const csvText = fs.readFileSync(csvPath, 'utf8');
const lines = csvText.split('\n').map(l => l.trim()).filter(l => l);

const usedImages = new Set();
const kidsTitles = new Set();
const kidsImages = new Set();
const allProducts = new Map(); // titulo -> {categoria, imagens}

const kidsKeywords = ['kids', 'child', 'children', 'boys', 'infantil'];

lines.forEach(line => {
  const parts = parseCSVLine(line);
  if (parts.length < 5) return;

  const [categoria, titulo, , imagem_raw, ordem_raw] = parts;
  const imagem = imagem_raw.replace(/^"|"$/g, '').trim();
  const titulo_clean = titulo.replace(/^"|"$/g, '').trim();
  const ordem = parseInt((ordem_raw || '').trim());

  // Ignorar order 0 e square
  if (ordem === 0 || imagem.includes('/square.')) return;

  const isKids = kidsKeywords.some(kw => titulo_clean.toLowerCase().includes(kw));

  // Converter URL para filename local
  let fname = null;
  if (imagem.includes('photo.yupoo.com')) {
    const f = imagem.replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_');
    fname = f;
    usedImages.add(fname);
    if (isKids) {
      kidsTitles.add(titulo_clean);
      kidsImages.add(fname);
    }
  }
});

// === 2. Listar todos os arquivos no catalog ===
const allFiles = fs.readdirSync(catalogDir);

// === 3. Classificar cada arquivo ===
const used = [];
const orphan = [];
const duplicate = []; // _big que é cópia de outro arquivo com mesmo photoId

// Mapear photoId -> arquivos
const byPhotoId = {};
allFiles.forEach(fname => {
  const base = fname.replace(/\.(jpg|jpeg|png)$/i, '');
  const idx = base.indexOf('_');
  const photoId = idx !== -1 ? base.slice(0, idx) : base;
  if (!byPhotoId[photoId]) byPhotoId[photoId] = [];
  byPhotoId[photoId].push(fname);
});

// Para cada arquivo, classificar
const usedSet = new Set();
const orphanSet = new Set();
const duplicateOriginals = new Set(); // arquivos _{hash} que têm um _big correspondente

allFiles.forEach(fname => {
  const isBig = fname.match(/_big\.(jpg|jpeg|png)$/i) || fname.match(/_large\.(jpg|jpeg|png)$/i);
  const base = fname.replace(/\.(jpg|jpeg|png)$/i, '');
  const idx = base.indexOf('_');
  const photoId = idx !== -1 ? base.slice(0, idx) : base;

  if (usedImages.has(fname)) {
    usedSet.add(fname);
  } else {
    // Verificar se existe uma versão _big desse photoId que é usada
    const bigVersions = (byPhotoId[photoId] || []).filter(f =>
      f.match(/_big\.(jpg|jpeg|png)$/i) && usedImages.has(f)
    );
    if (!isBig && bigVersions.length > 0) {
      duplicateOriginals.add(fname); // este é o original redundante
    } else {
      orphanSet.add(fname);
    }
  }
});

// === 4. Separar órfãos infantis ===
const kidsOrphans = [...orphanSet].filter(f => kidsImages.has(f));
const otherOrphans = [...orphanSet].filter(f => !kidsImages.has(f));

// === RELATÓRIO ===
const totalSize = (files) => {
  let bytes = 0;
  files.forEach(f => {
    try { bytes += fs.statSync(path.join(catalogDir, f)).size; } catch(e) {}
  });
  return (bytes / 1024 / 1024 / 1024).toFixed(2);
};

console.log('=== ANÁLISE DO CATALOG ===\n');
console.log(`Total de arquivos em assets/catalog/: ${allFiles.length}`);
console.log(`Tamanho total estimado no disco: veja abaixo\n`);

console.log(`✅ Usados pelo site (imagens do CSV): ${usedSet.size} arquivos`);
console.log(`   → Tamanho: ${totalSize([...usedSet])} GB\n`);

console.log(`🔁 Duplicatas (originais _{hash} com _big cópia usada): ${duplicateOriginals.size} arquivos`);
console.log(`   → Podem ser DELETADOS com segurança`);
console.log(`   → Tamanho: ${totalSize([...duplicateOriginals])} GB\n`);

console.log(`👶 Produtos infantis no CSV: ${kidsTitles.size} produtos`);
console.log(`   → Imagens de produtos infantis referenciadas: ${kidsImages.size}`);
const kidsUsed = [...kidsImages].filter(f => usedSet.has(f));
console.log(`   → Dessas, estão no catalog: ${kidsUsed.length} arquivos`);
console.log(`   → Tamanho: ${totalSize(kidsUsed)} GB\n`);

console.log(`🗑️  Órfãos (sem produto no CSV): ${orphanSet.size} arquivos`);
console.log(`   → De produtos infantis: ${kidsOrphans.length}`);
console.log(`   → Outros (categorias removidas etc): ${otherOrphans.length}`);
console.log(`   → Tamanho total órfãos: ${totalSize([...orphanSet])} GB\n`);

// Salvar listas para uso posterior
fs.writeFileSync('catalog_used.txt', [...usedSet].join('\n'));
fs.writeFileSync('catalog_duplicates.txt', [...duplicateOriginals].join('\n'));
fs.writeFileSync('catalog_orphans.txt', [...orphanSet].join('\n'));
fs.writeFileSync('catalog_kids_images.txt', [...kidsUsed].join('\n'));
fs.writeFileSync('catalog_kids_titles.txt', [...kidsTitles].join('\n'));

console.log('Listas salvas em:');
console.log('  catalog_used.txt       – imagens em uso');
console.log('  catalog_duplicates.txt – originais redundantes (seguros para deletar)');
console.log('  catalog_orphans.txt    – órfãos sem produto');
console.log('  catalog_kids_images.txt – imagens de produtos infantis');
console.log('  catalog_kids_titles.txt – títulos dos produtos infantis no CSV');

// ===
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQuotes = !inQuotes; }
    else if (c === ',' && !inQuotes) { result.push(current); current = ''; }
    else { current += c; }
  }
  result.push(current);
  return result;
}
