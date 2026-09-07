const fs = require('fs');

const bkp = fs.readFileSync('produtos_completo_bkp.csv', 'utf8').split('\n');
const curr = fs.readFileSync('produtos_completo.csv', 'utf8').split('\n');

// Pega os itens do BKP que são da Premier League e não são square
const premierLines = bkp.filter((line, index) => {
  if (index === 0) return false; // skip header
  if (!line.includes('Premier League')) return false; // apenas premier league
  if (line.includes('square.jpg')) return false; // remove square
  
  return true;
}).map(line => {
  // O BKP não tem aspas, vamos colocar aspas pra ficar igual ao curr
  const parts = line.split(',');
  if (parts.length >= 5) {
    return `"${parts[0]}","${parts[1]}","${parts[2]}","${parts[3]}",${parts[4]}`;
  }
  return line;
});

// Adiciona no final do current
const finalLines = [...curr.filter(l => l.trim().length > 0), ...premierLines];

fs.writeFileSync('produtos_completo.csv', finalLines.join('\n'));
console.log(`Adicionadas ${premierLines.length} imagens/linhas da Premier League no CSV atual.`);
