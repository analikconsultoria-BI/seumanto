const fs = require('fs');
const path = 'produtos_completo.csv';

if (!fs.existsSync(path)) process.exit(1);

let data = fs.readFileSync(path, 'utf8');

// Find URLs like https://photo.yupoo.com/minkang/a5cfcb3cc4.jpg
// and replace them with https://photo.yupoo.com/minkang/a5cfcb3cc4/big.jpg
// Regex explanation:
// photo\.yupoo\.com\/minkang\/([a-zA-Z0-9]+)\.(jpg|jpeg|png)
// Replacement: photo.yupoo.com/minkang/$1/big.$2

const fixedData = data.replace(/photo\.yupoo\.com\/minkang\/([a-zA-Z0-9]+)\.(jpg|jpeg|png)/gi, 'photo.yupoo.com/minkang/$1/big.$2');

fs.writeFileSync(path, fixedData, 'utf8');
console.log('URLs do CSV corrigidas com sucesso!');
