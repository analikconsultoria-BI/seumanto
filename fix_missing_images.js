/**
 * fix_missing_images.js
 *
 * Problema: O CSV referencia imagens como {photoId}_big.jpg mas muitos arquivos
 * foram baixados com o nome {photoId}_{hashCode}.jpg (formato antigo do Yupoo).
 *
 * Solução: Para cada imagem faltante, encontra a versão alternativa existente
 * no catalog e cria uma cópia com o nome esperado.
 */

const fs = require('fs');
const path = require('path');

const catalogDir = path.join(__dirname, 'assets', 'catalog');
const csvPath = path.join(__dirname, 'produtos_completo.csv');

// 1. Indexar todos os arquivos existentes por photoId
console.log('Indexando arquivos existentes...');
const existingFiles = fs.readdirSync(catalogDir);
const byPhotoId = {};

for (const fname of existingFiles) {
  // Extrai o photoId: tudo antes do primeiro '_' se tiver, ou o baseName sem extensão
  const base = fname.replace(/\.(jpg|jpeg|png)$/i, '');
  const underscoreIdx = base.indexOf('_');
  const photoId = underscoreIdx !== -1 ? base.slice(0, underscoreIdx) : base;

  if (!byPhotoId[photoId]) byPhotoId[photoId] = [];
  byPhotoId[photoId].push(fname);
}

console.log(`Arquivos indexados: ${existingFiles.length} | IDs únicos: ${Object.keys(byPhotoId).length}`);

// 2. Ler CSV e coletar todas as imagens esperadas
console.log('Lendo CSV...');
const csvText = fs.readFileSync(csvPath, 'utf8');
const urlRegex = /https:\/\/photo\.yupoo\.com\/minkang\/([a-f0-9]+)\/([^\s"',\r\n]+)/g;

const expectedFiles = new Map(); // filename -> photoId
let match;
while ((match = urlRegex.exec(csvText)) !== null) {
  const photoId = match[1];
  const suffix = match[2]; // e.g., "big.jpg" or "5c2ca83e.jpg"
  const expectedName = `${photoId}_${suffix}`;
  expectedFiles.set(expectedName, photoId);
}

console.log(`Imagens únicas esperadas pelo CSV: ${expectedFiles.size}`);

// 3. Identificar faltantes e aplicar correção
let fixed = 0;
let skipped = 0;
let noAlternative = 0;
const stillMissing = [];

for (const [expectedName, photoId] of expectedFiles) {
  const destPath = path.join(catalogDir, expectedName);

  // Já existe → ok
  if (fs.existsSync(destPath)) {
    skipped++;
    continue;
  }

  // Procurar alternativa com mesmo photoId
  const alternatives = byPhotoId[photoId] || [];

  // Preferir: _big.jpg > _large.jpg > outros (excluindo _square)
  const filtered = alternatives.filter(f => !f.includes('_square'));

  if (filtered.length === 0) {
    noAlternative++;
    stillMissing.push(expectedName);
    continue;
  }

  // Ordenar por preferência de qualidade
  const ranked = filtered.sort((a, b) => {
    const score = f => f.includes('_big.') ? 0 : f.includes('_large.') ? 1 : 2;
    return score(a) - score(b);
  });

  const source = path.join(catalogDir, ranked[0]);

  try {
    fs.copyFileSync(source, destPath);
    fixed++;
    if (fixed <= 10) {
      console.log(`  Copiado: ${ranked[0]} → ${expectedName}`);
    } else if (fixed === 11) {
      console.log('  ... (exibindo apenas os primeiros 10)');
    }
  } catch (err) {
    console.error(`  Erro ao copiar ${ranked[0]} → ${expectedName}: ${err.message}`);
    noAlternative++;
    stillMissing.push(expectedName);
  }
}

console.log('');
console.log('=== RESULTADO ===');
console.log(`✅ Corrigidos: ${fixed}`);
console.log(`⏭️  Já existiam: ${skipped}`);
console.log(`❌ Sem alternativa (precisam download): ${noAlternative}`);

if (stillMissing.length > 0) {
  const missingPath = path.join(__dirname, 'images_still_missing.txt');
  fs.writeFileSync(missingPath, stillMissing.join('\n'));
  console.log(`\nArquivos ainda faltantes salvos em: images_still_missing.txt`);
}

console.log('\nConcluído! Atualize o localStorage do browser (abra o site em aba anônima) para ver as imagens corrigidas.');
