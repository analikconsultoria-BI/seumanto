/**
 * download_native.js
 * Baixa imagens usando Node.js nativo (https.get) - sem Puppeteer, sem CORS
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const csvPath = 'produtos_completo.csv';
const outDir = path.join(__dirname, 'assets', 'catalog');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function downloadFile(imgUrl, dest) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(imgUrl);
    const lib = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': 'https://minkang.x.yupoo.com/',
        'Accept': 'image/avif,image/webp,image/apng,image/jpeg,image/*,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
        'Cache-Control': 'no-cache',
        'sec-ch-ua': '"Google Chrome";v="121", "Not A(Brand";v="99"',
        'sec-fetch-dest': 'image',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'same-site'
      }
    };

    const req = lib.request(options, (res) => {
      // Segue redirecionamentos (301/302)
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        // Verifica se é HTML de bloqueio em vez de imagem
        const preview = buffer.toString('utf8', 0, 200);
        if (preview.includes('EdgeOne') || preview.includes('<!DOCTYPE') || preview.includes('<html')) {
          return reject(new Error('Bloqueado (HTML recebido)'));
        }
        if (buffer.length < 500) {
          return reject(new Error(`Arquivo muito pequeno (${buffer.length} bytes)`));
        }
        fs.writeFileSync(dest, buffer);
        resolve(buffer.length);
      });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  // Ler CSV e coletar URLs faltando
  const csvData = fs.readFileSync(csvPath, 'utf8');
  const lines = csvData.split('\n').filter(l => l.trim().length > 0);

  const allUrls = new Set();
  lines.forEach(line => {
    const matches = line.match(/https:\/\/photo\.yupoo\.com\/[^"',\s]+/g);
    if (matches) {
      matches.forEach(u => {
        u = u.trim();
        if (!u.includes('/square.')) allUrls.add(u);
      });
    }
  });

  const missing = [];
  allUrls.forEach(imgUrl => {
    const filename = imgUrl.replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_');
    const filePath = path.join(outDir, filename);
    if (!fs.existsSync(filePath)) {
      missing.push({ imgUrl, filename, filePath });
    }
  });

  console.log(`Total no CSV: ${allUrls.size}`);
  console.log(`Já existem: ${allUrls.size - missing.length}`);
  console.log(`Faltando: ${missing.length}\n`);

  if (missing.length === 0) {
    console.log('✅ Todas as imagens já estão baixadas!');
    return;
  }

  let downloaded = 0, blocked = 0, errors = 0;

  for (let i = 0; i < missing.length; i++) {
    const { imgUrl, filename, filePath } = missing[i];

    if (fs.existsSync(filePath)) continue; // baixado por outro processo

    try {
      const size = await downloadFile(imgUrl, filePath);
      console.log(`[${i+1}/${missing.length}] ✓ ${filename} (${(size/1024).toFixed(0)}KB)`);
      downloaded++;
      await sleep(200);
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Bloqueado')) {
        console.log(`[${i+1}/${missing.length}] ⚠ Bloqueado: ${filename} — aguardando 10s...`);
        blocked++;
        await sleep(10000);
      } else {
        console.log(`[${i+1}/${missing.length}] ✗ ${filename}: ${msg}`);
        errors++;
        await sleep(300);
      }
    }
  }

  console.log(`\n========== CONCLUÍDO ==========`);
  console.log(`✓ Baixados: ${downloaded} | ⚠ Bloqueados: ${blocked} | ✗ Erros: ${errors}`);
  if (blocked + errors > 0) {
    console.log('Rode novamente para tentar baixar os que falharam.');
  } else {
    console.log('🎉 Tudo certo! Dê F5 no site.');
  }
}

main().catch(console.error);
