const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const https = require('https');
const path = require('path');

const CATALOG_DIR = path.join('assets', 'catalog');
const CSV_PATH = 'produtos_completo.csv';

function downloadImage(url, filename) {
  return new Promise((resolve) => {
    const dest = path.join(CATALOG_DIR, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) return resolve(true);

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://minkang.x.yupoo.com/'
      },
      timeout: 10000
    };

    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filename).then(resolve);
      }
      if (res.statusCode !== 200) return resolve(false);

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
      file.on('error', () => { fs.unlink(dest, () => {}); resolve(false); });
    }).on('error', () => resolve(false));
  });
}

async function scrapeImages() {
  const albums = JSON.parse(fs.readFileSync('vasco_albums.json', 'utf8'));
  let csv = fs.readFileSync(CSV_PATH, 'utf8');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    executablePath: ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].find(fs.existsSync),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  
  const page = await browser.newPage();
  
  let newCSV = '';

  for (let i = 0; i < albums.length; i++) {
    const { title, url } = albums[i];
    
    // Check if album is already in CSV
    if (csv.includes(url)) {
      console.log(`[${i+1}/${albums.length}] Skipping ${title} - already in CSV`);
      continue;
    }

    console.log(`[${i+1}/${albums.length}] Processing: ${title}`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      
      const images = await page.evaluate(() => {
        const results = [];
        const ogImageMeta = document.querySelector('meta[property="og:image"]');
        let coverHash = ogImageMeta ? (ogImageMeta.getAttribute('content').match(/([a-f0-9]{8,})/) || [])[1] : '';

        document.querySelectorAll('img').forEach(img => {
          const src = img.getAttribute('data-src') || img.src || '';
          if (src && src.includes('minkang') && !src.includes('square')) {
            let order = 99;
            const altMatch = (img.alt || '').match(/-(\d+)\.(jpg|jpeg|png|webp)$/i);
            if (altMatch) order = parseInt(altMatch[1]);
            if (coverHash && src.includes(coverHash)) order = 0;
            
            const hashMatch = src.match(/([a-f0-9]+)\//);
            if (hashMatch) {
              results.push({ src, hash: hashMatch[1], order });
            }
          }
        });
        return results;
      });

      if (images.length === 0) {
         console.log('  No images found');
         continue;
      }

      // deduplicate
      const uniqueMap = new Map();
      images.forEach(img => {
        if (!uniqueMap.has(img.hash) || uniqueMap.get(img.hash).order === 99) uniqueMap.set(img.hash, img);
      });
      const uniqueImgs = Array.from(uniqueMap.values()).sort((a,b) => a.order - b.order);

      let albumLines = '';
      let dlCount = 0;

      for (const img of uniqueImgs) {
        const filename = img.src.replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_');
        const success = await downloadImage(img.src, filename);
        if (success) {
          dlCount++;
          const safeTitle = title.replace(/"/g, '""');
          const cleanSrc = `https://photo.yupoo.com/minkang/${filename.replace('_', '/')}`;
          albumLines += `"Brasileirao Serie A","${safeTitle}","${url}","${cleanSrc}",${img.order}\n`;
        }
      }

      if (albumLines) {
        newCSV += albumLines;
        console.log(`  Downloaded ${dlCount} images`);
      }

    } catch (e) {
      console.log(`  Error: ${e.message.split('\n')[0]}`);
    }
  }

  if (newCSV) {
    fs.appendFileSync(CSV_PATH, newCSV);
    console.log(`Appended new albums to ${CSV_PATH}`);
  }
  await browser.close();
}

scrapeImages();
