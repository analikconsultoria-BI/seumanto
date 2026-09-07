const https = require('https');
const fs = require('fs');

const url = 'https://photo.yupoo.com/minkang/200faea255/big.jpg';
const options = {
  headers: {
    'Referer': 'https://minkang.x.yupoo.com/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

https.get(url, options, (res) => {
  console.log('Status Code:', res.statusCode);
  if (res.statusCode === 200) {
    const file = fs.createWriteStream('test_dl.jpg');
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded successfully');
    });
  } else {
    console.log('Failed to download');
  }
}).on('error', (err) => {
  console.error('Error:', err.message);
});
