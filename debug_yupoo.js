const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs = require('fs');

async function run() {
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const execPath = chromePaths.find(p => fs.existsSync(p));

  const browser = await puppeteer.launch({ 
    headless: true, 
    executablePath: execPath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  // Go to a known album, e.g. Flamengo from the CSV (so we know it exists)
  await page.goto('https://minkang.x.yupoo.com/albums/252957689?uid=1&isSubCate=true&referrercate=720314', { waitUntil: 'networkidle2' });
  
  const coverInfo = await page.evaluate(() => {
    const meta = document.querySelector('meta[property="og:image"]');
    return meta ? meta.getAttribute('content') : null;
  });
  console.log('og:image:', coverInfo);
  await browser.close();
}
run();
