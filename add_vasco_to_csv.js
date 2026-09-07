const fs = require('fs');
const CSV_PATH = 'produtos_completo.csv';

const albums = JSON.parse(fs.readFileSync('vasco_albums.json', 'utf8'));
let csv = fs.readFileSync(CSV_PATH, 'utf8');

let added = 0;
for (const album of albums) {
  if (!csv.includes(album.url)) {
    const title = album.title.replace(/"/g, '""');
    const newLine = `"Brasileirao Serie A","${title}","${album.url}","",0\n`;
    csv += newLine;
    added++;
  }
}

fs.writeFileSync(CSV_PATH, csv);
console.log(`Added ${added} new Vasco albums to CSV.`);
