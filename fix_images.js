const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets', 'catalog');
const files = fs.readdirSync(dir);

// Agrupa por prefixo (ex: 86aa11bd01)
const groups = {};

files.forEach(f => {
  if (!f.endsWith('.jpg') && !f.endsWith('.jpeg')) return;
  const parts = f.split('_');
  const prefix = parts[0].replace(/\.(jpg|jpeg)$/i, '');
  
  if (!groups[prefix]) {
    groups[prefix] = [];
  }
  groups[prefix].push(f);
});

let updated = 0;

Object.keys(groups).forEach(prefix => {
  const groupFiles = groups[prefix];
  if (groupFiles.length <= 1) return; // Nao tem versao alternativa
  
  // Encontra o maior arquivo
  let maxFile = null;
  let maxSize = -1;
  let hasSmallBase = false;
  let baseExt = '.jpg';
  
  groupFiles.forEach(f => {
    const stat = fs.statSync(path.join(dir, f));
    if (stat.size > maxSize) {
      maxSize = stat.size;
      maxFile = f;
    }
    if (f === prefix + '.jpg' || f === prefix + '.jpeg') {
      hasSmallBase = true;
      baseExt = path.extname(f);
    }
  });
  
  if (hasSmallBase && maxFile && maxFile !== prefix + baseExt) {
    // Copia o maior arquivo por cima do base
    fs.copyFileSync(path.join(dir, maxFile), path.join(dir, prefix + baseExt));
    updated++;
  }
});

console.log('Images fixed:', updated);
