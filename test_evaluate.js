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
  
  console.log('Visiting minkang.x.yupoo.com...');
  await page.goto('https://minkang.x.yupoo.com/', { waitUntil: 'networkidle2' });
  
  // Wait to make sure challenge is cleared
  await new Promise(r => setTimeout(r, 5000));
  
  const url = 'https://photo.yupoo.com/minkang/1f95b6144f/large.jpg';
  console.log('Fetching image via page.evaluate...');
  
  try {
    const bufferArray = await page.evaluate(async (imgUrl) => {
      const response = await fetch(imgUrl);
      const buffer = await response.arrayBuffer();
      return Array.from(new Uint8Array(buffer));
    }, url);
    
    const buffer = Buffer.from(bufferArray);
    console.log('Downloaded bytes:', buffer.length);
    if (buffer.length < 15000 && buffer.toString('utf8').includes('Tencent Cloud EdgeOne')) {
        console.log('STILL BLOCKED!');
    } else {
        console.log('SUCCESS!');
    }
  } catch(e) {
    console.log('Error', e.message);
  }

  await browser.close();
}
test();
