const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');

async function test() {
  const browser = await puppeteer.launch({ 
    headless: "new"
  });
  const page = await browser.newPage();
  
  await page.setExtraHTTPHeaders({
    'Referer': 'https://yupoo.com/'
  });

  const url = 'https://photo.yupoo.com/minkang/1b47bf679a/large.jpg';
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    const buffer = await response.buffer();
    console.log('Downloaded bytes:', buffer.length);
    fs.writeFileSync('test_stealth.jpg', buffer);
  } catch (e) {
    console.error(e);
  }
  await browser.close();
}
test();
