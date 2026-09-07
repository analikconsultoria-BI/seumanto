const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');

async function getAlbums() {
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const execPath = chromePaths.find(p => fs.existsSync(p));

  const browser = await puppeteer.launch({ 
    headless: true,
    executablePath: execPath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.goto('https://minkang.x.yupoo.com/search/album?uid=1&sort=&q=Vasco', { waitUntil: 'networkidle2' });
  
  const albums = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="/albums/"]')).map(a => {
      const title = a.getAttribute('title') || a.innerText || '';
      return { title: title.trim(), url: a.href };
    }).filter(x => x.title && x.url && x.url.includes('/albums/'));
  });
  
  // Deduplicate by URL
  const unique = [];
  const urls = new Set();
  for (const a of albums) {
    if (!urls.has(a.url)) {
      urls.add(a.url);
      unique.push(a);
    }
  }
  fs.writeFileSync('vasco_albums.json', JSON.stringify(unique, null, 2));
  console.log(`Saved ${unique.length} albums to vasco_albums.json`);
  await browser.close();
}
getAlbums();
