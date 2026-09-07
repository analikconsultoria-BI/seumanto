const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');

async function test() {
  const browser = await puppeteer.launch({ 
    headless: "new",
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Navigate to photo.yupoo.com first to get the cookies
  console.log('Visiting yupoo main site to acquire cookies...');
  try {
    await page.goto('https://yupoo.com/', { waitUntil: 'networkidle2', timeout: 15000 });
  } catch (e) {
    console.log('Timeout visiting yupoo, continuing...');
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Visiting photo.yupoo.com to acquire cookies...');
  try {
    await page.goto('https://photo.yupoo.com/', { waitUntil: 'networkidle2', timeout: 15000 });
  } catch (e) {
    console.log('Timeout visiting photo.yupoo, continuing...');
  }

  await new Promise(r => setTimeout(r, 2000));

  // Now try to fetch the image directly
  const url = 'https://photo.yupoo.com/minkang/1b47bf679a/large.jpg';
  console.log('Fetching image...');
  try {
    await page.setExtraHTTPHeaders({
      'Referer': 'https://minkang.x.yupoo.com/'
    });
    const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    const buffer = await response.buffer();
    
    console.log('Downloaded bytes:', buffer.length);
    if (buffer.length < 15000 && buffer.toString('utf8').includes('Tencent Cloud EdgeOne')) {
        console.log('STILL BLOCKED BY EDGEONE!');
    } else {
        console.log('SUCCESS!');
        fs.writeFileSync('test_stealth.jpg', buffer);
    }
  } catch (e) {
    console.error(e.message);
  }
  await browser.close();
}
test();
