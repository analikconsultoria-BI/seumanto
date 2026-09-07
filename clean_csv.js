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

const csvPath = 'produtos_completo.csv';
const backupPath = 'produtos_completo_dups_bkp.csv';

// Fazer backup
const csvData = fs.readFileSync(csvPath, 'utf8');
fs.writeFileSync(backupPath, csvData);

const lines = csvData.split('\n').filter(l => l.trim().length > 0);

const seenTitles = new Map(); // titulo -> url_album_escolhido
const newLines = [];
let removedLines = 0;

// Pass 1: Determinar qual álbum será o "escolhido" para cada título (o primeiro que aparecer)
lines.forEach(line => {
  const parts = parseCSVLine(line);
  if (parts.length < 5) return;
  
  const titulo = cleanStr(parts[1]);
  const url_album = cleanStr(parts[2]);
  
  if (!seenTitles.has(titulo)) {
    seenTitles.set(titulo, url_album);
  }
});

// Pass 2: Escrever apenas as linhas que pertencem ao álbum escolhido para aquele título
// e remover linhas *idênticas* (mesma imagem, mesmo album, mesma ordem)
const seenExactLines = new Set();

lines.forEach(line => {
  const parts = parseCSVLine(line);
  if (parts.length < 5) {
    newLines.push(line);
    return;
  }
  
  const titulo = cleanStr(parts[1]);
  const url_album = cleanStr(parts[2]);
  const chosen_album = seenTitles.get(titulo);
  
  // Se essa linha pertence a um álbum duplicado, ignoramos
  if (url_album !== chosen_album) {
    removedLines++;
    return;
  }
  
  // Se for uma linha 100% idêntica a outra (mesmo título, álbum, imagem, ordem), ignoramos
  const exactKey = `${titulo}|${url_album}|${cleanStr(parts[3])}|${cleanStr(parts[4])}`;
  if (seenExactLines.has(exactKey)) {
    removedLines++;
    return;
  }
  
  seenExactLines.add(exactKey);
  newLines.push(line);
});

fs.writeFileSync(csvPath, newLines.join('\n'));
console.log(`\nLimpeza concluída!`);
console.log(`Linhas totais antes: ${lines.length}`);
console.log(`Linhas duplicadas removidas (álbuns repetidos ou linhas idênticas): ${removedLines}`);
console.log(`Linhas totais agora: ${newLines.length}`);
