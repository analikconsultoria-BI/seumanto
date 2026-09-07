const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');

const CSV_FILE = 'produtos_completo.csv';

const targets = [
  { url: 'https://minkang.x.yupoo.com/categories/720314?isSubCate=true', pages: 2, catName: 'Brasileirao Serie A' },
  { url: 'https://minkang.x.yupoo.com/categories/720315?isSubCate=true', pages: 1, catName: 'Brasileirao Serie A' },
  { url: 'https://minkang.x.yupoo.com/categories/720325?isSubCate=true', pages: 1, catName: 'Brasileirao Serie A' },
  { url: 'https://minkang.x.yupoo.com/categories/725796?isSubCate=true', pages: 1, catName: 'Brasileirao Serie A' },
  { url: 'https://minkang.x.yupoo.com/categories/720317?isSubCate=true', pages: 1, catName: 'Brasileirao Serie A' },
  { url: 'https://minkang.x.yupoo.com/categories/720316?isSubCate=true', pages: 1, catName: 'Brasileirao Serie A' },
  { url: 'https://minkang.x.yupoo.com/categories/718622?isSubCate=true', pages: 4, catName: 'La Liga' },
  { url: 'https://minkang.x.yupoo.com/categories/718623?isSubCate=true', pages: 3, catName: 'La Liga' }
];

// Helper to escape CSV fields
function escapeCSV(str) {
  if (typeof str !== 'string') str = String(str);
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

async function run() {
  console.log("Loading existing CSV to prevent duplicates...");
  const existingUrls = new Set();
  if (fs.existsSync(CSV_FILE)) {
    const data = fs.readFileSync(CSV_FILE, 'utf-8').split('\n');
    for (const line of data) {
      if (!line.trim()) continue;
      // Very naive splitting just to find the URL (3rd column)
      // Since some titles might have commas, a robust parser is better, but this usually works if we check if any part contains yupoo.com/albums
      const parts = line.split(',');
      for (const p of parts) {
        if (p.includes('yupoo.com/albums')) {
          existingUrls.add(p.replace(/"/g, '').trim());
        }
      }
    }
  }
  console.log(`Found ${existingUrls.size} existing albums.`);

  const browser = await puppeteer.launch({ 
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  let newRecordsCount = 0;

  for (const target of targets) {
    for (let pNum = 1; pNum <= target.pages; pNum++) {
      const pageUrl = pNum === 1 ? target.url : `${target.url}&page=${pNum}`;
      console.log(`\nNavigating to ${target.catName} -> Page ${pNum}: ${pageUrl}`);
      
      let retries = 3;
      let success = false;
      while(retries > 0 && !success) {
        try {
          await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
          success = true;
        } catch(e) {
          retries--;
          console.log("Retry goto page...");
        }
      }

      if (!success) continue;

      // Extract albums from this page
      const albums = await page.evaluate(() => {
        const els = document.querySelectorAll('a.album__main');
        const results = [];
        els.forEach(el => {
          results.push({
            title: el.getAttribute('title') || el.innerText,
            url: el.href
          });
        });
        return results;
      });

      console.log(`Found ${albums.length} albums on this page.`);

      for (const album of albums) {
        if (existingUrls.has(album.url)) {
          console.log(`[SKIP] Already exists: ${album.title}`);
          continue;
        }

        console.log(`[SCRAPING] ${album.title}`);
        
        // Go to album
        let albumSuccess = false;
        let albumRetries = 3;
        while(albumRetries > 0 && !albumSuccess) {
          try {
            await page.goto(album.url, { waitUntil: 'networkidle2', timeout: 30000 });
            albumSuccess = true;
          } catch(e) {
            albumRetries--;
          }
        }
        
        if (!albumSuccess) {
          console.log("Failed to load album, skipping.");
          continue;
        }

        const images = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('.showalbum__children.image__main img.image__img'));
          return imgs.map(i => i.getAttribute('data-origin-src') || i.getAttribute('data-src') || i.src).filter(src => src && src.includes('yupoo.com')).map(src => {
            if(src.startsWith('//')) return 'https:' + src;
            return src;
          });
        });

        // Save up to 6 images
        const toSave = images.slice(0, 6);
        let order = 1;
        for (const img of toSave) {
          const cleanTitle = album.title.replace(/\s+/g, ' ').trim();
          const line = `${escapeCSV(target.catName)},${escapeCSV(cleanTitle)},${escapeCSV(album.url)},${escapeCSV(img)},${order}\n`;
          fs.appendFileSync(CSV_FILE, line);
          order++;
        }
        
        if (toSave.length > 0) {
          console.log(`  -> Saved ${toSave.length} images.`);
          existingUrls.add(album.url); // prevent duplicate if it appears again
          newRecordsCount++;
        } else {
          console.log(`  -> No images found.`);
        }
        
        // Wait to not hammer the server
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  await browser.close();
  console.log(`\nDone! Successfully extracted and appended ${newRecordsCount} new products to CSV.`);
}

run().catch(console.error);
