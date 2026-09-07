const https = require('https');
const fs = require('fs');

const url = 'https://wsrv.nl/?url=photo.yupoo.com/minkang/1b47bf679a/large.jpg';

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
    console.log('Success! Headers:', res.headers);
  } else {
    console.log('Failed:', res.statusMessage);
  }
}).on('error', (err) => {
  console.error('Error:', err.message);
});
