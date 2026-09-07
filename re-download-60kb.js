const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets', 'catalog');
const files = fs.readdirSync(dir);

const smallFiles = [];
files.forEach(f => {
  const stat = fs.statSync(path.join(dir, f));
  if (stat.size < 60000) { // < 60KB
    smallFiles.push(f);
  }
});

console.log('Total small files to download:', smallFiles.length);

const downloadImage = (filename, attempt = 1) => {
  return new Promise((resolve) => {
    const hash = filename.replace(/\.(jpg|jpeg|png)$/i, '');
    let suffix = '/big.jpg';
    if (attempt === 2) suffix = '/medium.jpg';
    if (attempt === 3) suffix = '/max.jpg';
    
    const realHash = hash.split('_')[0];
    const url = `https://photo.yupoo.com/minkang/${realHash}${suffix}`;
    
    const options = {
      headers: {
        'Referer': 'https://minkang.x.yupoo.com/',
        'User-Agent': 'Mozilla/5.0'
      },
      timeout: 5000
    };

    const req = https.get(url, options, (res) => {
      if (res.statusCode === 200) {
        const dest = path.join(dir, filename + '.tmp');
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const stat = fs.statSync(dest);
          if (stat.size > 60000) { // Downloaded successfully and is large
            fs.renameSync(dest, path.join(dir, filename));
            resolve(true);
          } else {
            // Even if it's small, it might be the only size available.
            // But we already have the small one. Just keep it.
            fs.unlinkSync(dest);
            resolve(false);
          }
        });
      } else {
        if (attempt < 3) {
          resolve(downloadImage(filename, attempt + 1));
        } else {
          resolve(false);
        }
      }
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
};

const processQueue = async () => {
  let success = 0;
  const concurrency = 20;
  for (let i = 0; i < smallFiles.length; i += concurrency) {
    const chunk = smallFiles.slice(i, i + concurrency);
    const results = await Promise.all(chunk.map(f => downloadImage(f)));
    success += results.filter(r => r).length;
    console.log(`Processed ${i + chunk.length}/${smallFiles.length}. Success: ${success}`);
  }
  console.log('Finished downloading small images. Success:', success);
};

processQueue();
