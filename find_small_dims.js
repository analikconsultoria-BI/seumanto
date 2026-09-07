const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const dir = path.join(__dirname, 'assets', 'catalog');
const files = fs.readdirSync(dir);
const smallFiles = [];

files.forEach(f => {
  if (!f.endsWith('.jpg') && !f.endsWith('.jpeg') && !f.endsWith('.png')) return;
  try {
    const dimensions = sizeOf(path.join(dir, f));
    if (dimensions.width <= 100 && dimensions.height <= 100) {
      smallFiles.push(f);
    }
  } catch (e) {
    // try default export
    try {
        const d2 = sizeOf.default(path.join(dir, f));
        if (d2.width <= 100 && d2.height <= 100) smallFiles.push(f);
    } catch(err2) {
        // ignore
    }
  }
});

console.log('Total small dimension files:', smallFiles.length);
fs.writeFileSync('small_dim_files.json', JSON.stringify(smallFiles));
