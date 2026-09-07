/**
 * download_missing.js
 * Baixa APENAS as imagens que estão no CSV mas não existem em assets/catalog/
 * Usa a mesma técnica que funcionou para a Premier League (headless + Referer headers)
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');

async function downloadMissing() {
  const csvPath = 'produtos_completo.csv';
  const outDir = path.join(__dirname, 'assets', 'catalog');

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Ler o CSV e extrair todas as URLs
  const csvData = fs.readFileSync(csvPath, 'utf8');
  const lines = csvData.split('\n').filter(l => l.trim().length > 0);

  const allUrls = new Set();
  lines.forEach(line => {
    const matches = line.match(/https:\/\/photo\.yupoo\.com\/[^"',\s]+/g);
    if (matches) {
      matches.forEach(url => {
        url = url.trim();
        if (!url.includes('/square.')) allUrls.add(url);
      });
    }
  });

  // Verificar quais faltam na pasta
  const missing = [];
  allUrls.forEach(url => {
    const filename = url.replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_');
    if (!fs.existsSync(path.join(outDir, filename))) {
      missing.push({ url, filename });
    }
  });

  console.log(`Total no CSV: ${allUrls.size} | Já existem: ${allUrls.size - missing.length} | Faltando: ${missing.length}`);

  if (missing.length === 0) {
    console.log('✅ Todas as imagens já estão baixadas! Nada a fazer.');
    return;
  }

  // Encontrar Chrome
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  const execPath = chromePaths.find(p => fs.existsSync(p));
  if (!execPath) { console.error('Chrome/Edge não encontrado!'); process.exit(1); }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: execPath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9',
    'Referer': 'https://minkang.x.yupoo.com/'
  });

  console.log('Obtendo cookies do Yupoo...');
  try {
    await page.goto('https://minkang.x.yupoo.com/', { waitUntil: 'networkidle2', timeout: 20000 });
  } catch(e) { console.log('(timeout, continuando mesmo assim)'); }
  await new Promise(r => setTimeout(r, 3000));

  console.log(`\nIniciando download de ${missing.length} imagens faltantes...\n`);

  let downloaded = 0, blocked = 0, errors = 0;

  for (let i = 0; i < missing.length; i++) {
    const { url, filename } = missing[i];
    const filePath = path.join(outDir, filename);

    // Dupla verificação: pula se foi baixado por outro processo enquanto rodava
    if (fs.existsSync(filePath)) {
      console.log(`[${i+1}/${missing.length}] ⏭ Já existe: ${filename}`);
      continue;
    }

    try {
      const base64 = await page.evaluate(async (imgUrl) => {
        const res = await fetch(imgUrl, {
          headers: {
            'Referer': 'https://minkang.x.yupoo.com/',
            'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
          }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let bin = '';
        for (let j = 0; j < bytes.length; j++) bin += String.fromCharCode(bytes[j]);
        return btoa(bin);
      }, url);

      const buffer = Buffer.from(base64, 'base64');

      // Verifica se é a página de bloqueio do EdgeOne
      if (buffer.length < 20000 && buffer.toString('utf8', 0, 500).includes('EdgeOne')) {
        console.log(`[${i+1}/${missing.length}] ⚠ Bloqueado: ${filename} — aguardando 8s...`);
        blocked++;
        await new Promise(r => setTimeout(r, 8000));
      } else if (buffer.length < 1000) {
        console.log(`[${i+1}/${missing.length}] ⚠ Resposta muito pequena (${buffer.length}B), ignorando: ${filename}`);
        errors++;
      } else {
        fs.writeFileSync(filePath, buffer);
        console.log(`[${i+1}/${missing.length}] ✓ ${filename} (${(buffer.length/1024).toFixed(0)}KB)`);
        downloaded++;
      }

      await new Promise(r => setTimeout(r, 350));
    } catch (err) {
      console.error(`[${i+1}/${missing.length}] ✗ Erro: ${filename} → ${err.message}`);
      errors++;
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  await browser.close();
  console.log(`\n========== CONCLUÍDO ==========`);
  console.log(`✓ Baixados: ${downloaded}`);
  console.log(`⚠ Bloqueados: ${blocked}`);
  console.log(`✗ Erros: ${errors}`);
  if (blocked + errors > 0) {
    console.log(`\nRode novamente: node download_missing.js`);
    console.log(`(ele pula os já baixados e tenta só os que faltam)`);
  } else {
    console.log(`\n🎉 Tudo baixado! Dê F5 no site.`);
  }
}

downloadMissing().catch(console.error);
