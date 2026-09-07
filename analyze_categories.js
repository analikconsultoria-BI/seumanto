const fs = require('fs');
const path = require('path');

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

const groups = {
  infantil: {
    keywords: ['kids', 'child', 'children', 'boys', 'infantil'],
    products: new Set(),
    teams: new Set(),
    images: new Set(),
    totalBytes: 0
  },
  feminino: {
    keywords: ['women', 'woman', 'ladies', 'female', 'feminina', 'feminino'],
    products: new Set(),
    teams: new Set(),
    images: new Set(),
    totalBytes: 0
  },
  calcoes: {
    keywords: ['shorts', 'pants', 'calção', 'calcao', 'trousers', 'short'],
    products: new Set(),
    teams: new Set(),
    images: new Set(),
    totalBytes: 0
  }
};

// Funçao simplificada para extrair o time do titulo
function extractTeam(title) {
  let name = title.replace(/\d{2}\/\d{2}/g, '')
                 .replace(/S-XXL|S-4XL|S-XXXL|SIZE \d+-\d+/g, '')
                 .replace(/kids kit|Jersey|Women's|Shorts/gi, '');
  
  // Pegar as primeiras 2 palavras como o nome do time base
  const words = name.trim().split(/\s+/).slice(0, 2);
  return words.join(' ').replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ]/g, '').trim();
}

lines.forEach(line => {
  const parts = parseCSVLine(line);
  if (parts.length < 5) return;
  
  const titulo = cleanStr(parts[1]);
  const imgUrl = cleanStr(parts[3]);
  const lowerTitle = titulo.toLowerCase();
  
  const filename = imgUrl.replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_');
  const localPath = path.join('assets', 'catalog', filename);
  
  Object.keys(groups).forEach(key => {
    const group = groups[key];
    const isMatch = group.keywords.some(kw => lowerTitle.includes(kw));
    
    if (isMatch) {
      group.products.add(titulo); // Use titulo as unique product identifier
      const team = extractTeam(titulo);
      if (team.length > 2) group.teams.add(team);
      
      if (!group.images.has(filename)) {
        group.images.add(filename);
        if (fs.existsSync(localPath)) {
          const stats = fs.statSync(localPath);
          group.totalBytes += stats.size;
        }
      }
    }
  });
});

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

console.log('=== RELATÓRIO DE CATEGORIAS ===\n');

Object.keys(groups).forEach(key => {
  const g = groups[key];
  console.log(`[${key.toUpperCase()}]`);
  console.log(`- Produtos únicos: ${g.products.size}`);
  console.log(`- Total de imagens únicas: ${g.images.size}`);
  console.log(`- Espaço em disco (Imagens baixadas): ${formatBytes(g.totalBytes)}`);
  
  const teamsArray = Array.from(g.teams);
  // Limitar visualização dos times para não poluir muito, caso sejam muitos
  const displayTeams = teamsArray.length > 15 ? teamsArray.slice(0, 15).join(', ') + ` ... (e mais ${teamsArray.length - 15})` : teamsArray.join(', ');
  console.log(`- Times identificados (${teamsArray.length}): ${displayTeams}\n`);
});
