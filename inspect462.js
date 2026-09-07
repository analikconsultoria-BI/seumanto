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

const productMap = new Map();
lines.forEach(line => {
  const parts = parseCSVLine(line);
  if (parts.length < 5) return;
  const [categoria, titulo, url_album, imagem_raw, ordem_imagem] = parts;
  const imagem = cleanStr(imagem_raw);
  const key = cleanStr(titulo) + '__SEP__' + cleanStr(url_album);
  if (!productMap.has(key)) {
    productMap.set(key, {
      categoria: cleanStr(categoria),
      titulo: cleanStr(titulo),
      url_album: cleanStr(url_album),
      images: []
    });
  }
  if (!imagem.includes('/square.')) {
    const alreadyAdded = productMap.get(key).images.some(x => x.url === imagem);
    if (!alreadyAdded) productMap.get(key).images.push({ url: imagem, order: parseInt(cleanStr(ordem_imagem)) });
  }
});

const allProducts = Array.from(productMap.values());

// Print csv_462 (index 461)
const target = allProducts[461];
target.images.sort((a, b) => a.order - b.order);
console.log('=== csv_462 ===');
console.log('Titulo:', target.titulo);
console.log('Categoria:', target.categoria);
console.log('URL Album:', target.url_album);
console.log('Imagens:');
target.images.forEach((img, i) => {
  const filename = img.url.replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_');
  const exists = fs.existsSync('assets/catalog/' + filename);
  console.log('  [' + (i+1) + '] ordem=' + img.order + ' exists=' + exists + ' -> ' + filename);
});

// Also: check what ORDEM values exist across ALL products to find patterns
console.log('\n\n=== ANALISE GERAL DE ORDENS ===');
let productsWithNoOrder1 = 0;
let productsWithHighMinOrder = 0;
let totalProducts = 0;

allProducts.forEach((prod, idx) => {
  prod.images.sort((a, b) => a.order - b.order);
  totalProducts++;
  const orders = prod.images.map(x => x.order);
  const minOrder = Math.min(...orders);
  if (!orders.includes(1)) {
    productsWithNoOrder1++;
    if (productsWithNoOrder1 <= 5) {
      console.log('Produto csv_' + (idx+1) + ' (' + prod.titulo.substring(0,40) + ')');
      console.log('  Ordens: ' + orders.join(', ') + ' | minOrder=' + minOrder);
    }
  }
});

console.log('\nTotal produtos:', totalProducts);
console.log('Produtos SEM ordem=1:', productsWithNoOrder1);
