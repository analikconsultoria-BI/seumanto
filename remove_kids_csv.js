/**
 * remove_kids_csv.js
 * Remove todas as linhas de produtos infantis do produtos_completo.csv
 */

const fs = require('fs');

const csvPath = 'produtos_completo.csv';
const kidsKeywords = ['kids', 'child', 'children', 'boys', 'infantil'];

const lines = fs.readFileSync(csvPath, 'utf8').split('\n');

let removed = 0;
const kept = lines.filter(line => {
  if (!line.trim()) return false;
  const lower = line.toLowerCase();
  const isKids = kidsKeywords.some(kw => lower.includes(kw));
  if (isKids) { removed++; return false; }
  return true;
});

fs.copyFileSync(csvPath, csvPath.replace('.csv', '_bkp_prekids.csv'));
fs.writeFileSync(csvPath, kept.join('\n'));

console.log(`✅ Linhas removidas (infantis): ${removed}`);
console.log(`📄 Linhas mantidas: ${kept.length}`);
console.log(`💾 Backup salvo em: produtos_completo_bkp_prekids.csv`);
