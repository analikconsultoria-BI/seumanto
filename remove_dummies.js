const fs = require('fs');
let csv = fs.readFileSync('produtos_completo.csv', 'utf8');
const lines = csv.split('\n');
const newLines = lines.filter(l => !l.endsWith(',"",0') && !l.endsWith(',"",0\r'));
fs.writeFileSync('produtos_completo.csv', newLines.join('\n'));
console.log(`Removed ${lines.length - newLines.length} dummy lines`);
