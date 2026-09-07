const fetch = require('node-fetch'); // we'll use native fetch or https

async function test(proxy) {
  try {
    const res = await fetch(proxy);
    console.log(proxy, res.status);
    if(res.status === 200) {
      const buff = await res.arrayBuffer();
      console.log('Size:', buff.byteLength);
    }
  } catch(e) {
    console.log(proxy, 'Error');
  }
}

async function run() {
  await test('https://corsproxy.io/?https://photo.yupoo.com/minkang/1b47bf679a/large.jpg');
  await test('https://api.allorigins.win/raw?url=https://photo.yupoo.com/minkang/1b47bf679a/large.jpg');
  await test('https://images.weserv.nl/?url=photo.yupoo.com/minkang/1b47bf679a/large.jpg');
  await test('https://wsrv.nl/?url=photo.yupoo.com/minkang/1b47bf679a/large.jpg');
}
run();
