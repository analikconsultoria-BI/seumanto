const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const dir = path.join(__dirname, 'assets', 'catalog');
const files = fs.readdirSync(dir);
const smallFiles = [];

files.forEach(f => {
  if (!f.endsWith('.jpg') && !f.endsWith('.jpeg') && !f.endsWith('.png')) return;
  try {
    let dimensions;
    if (sizeOf.imageSize) dimensions = sizeOf.imageSize(path.join(dir, f));
    else if (sizeOf.default) dimensions = sizeOf.default(path.join(dir, f));
    else dimensions = sizeOf(path.join(dir, f));
    
    if (dimensions.width < 300 && dimensions.height < 300) {
      smallFiles.push({ file: f, w: dimensions.width, h: dimensions.height });
    }
  } catch (e) {
  }
});

console.log('Total small dimension files:', smallFiles.length);
if (smallFiles.length > 0) {
    console.log(smallFiles.slice(0, 10));
}
