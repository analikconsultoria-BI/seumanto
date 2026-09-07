const https = require('https');
const fs = require('fs');

const url = 'https://photo.yupoo.com/minkang/1b47bf679a/large.jpg';
const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Referer': 'https://yupoo.com/',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
  }
};

https.get(url, options, (res) => {
  console.log('Status Code:', res.statusCode);
  if (res.statusCode === 200) {
    console.log('Success! Headers:', res.headers);
  } else {
    console.log('Failed:', res.statusMessage);
  }
}).on('error', (err) => {
  console.error('Error:', err.message);
});
