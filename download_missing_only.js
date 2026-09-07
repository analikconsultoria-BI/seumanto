/**
 * download_missing_only.js
 * Baixa apenas as 554 imagens listadas em images_still_missing.txt
 * usando Puppeteer com stealth para bypass do Tencent EdgeOne.
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');

const catalogDir = path.join(__dirname, 'assets', 'catalog');
const missingListPath = path.join(__dirname, 'images_still_missing.txt');
const baseUrl = 'https://photo.yupoo.com/minkang/';

async function downloadMissing() {
  if (!fs.existsSync(missingListPath)) {
    console.error('images_still_missing.txt não encontrado. Rode fix_missing_images.js primeiro.');
    process.exit(1);
  }

  const missingFiles = fs.readFileSync(missingListPath, 'utf8')
    .split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Filtrar os que já foram baixados em corridas anteriores
  const toDownload = missingFiles.filter(fname => !fs.existsSync(path.join(catalogDir, fname)));
  console.log(`Total na lista: ${missingFiles.length} | Ainda faltando: ${toDownload.length}`);

  if (toDownload.length === 0) {
    console.log('Todas as imagens já foram baixadas!');
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
  if (!execPath) {
    console.error('Chrome/Edge não encontrado!');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: execPath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
    'Referer': 'https://minkang.x.yupoo.com/'
  });

  console.log('Obtendo cookies do Yupoo...');
  try {
    await page.goto('https://minkang.x.yupoo.com/', { waitUntil: 'networkidle2', timeout: 20000 });
  } catch(e) {}
  await new Promise(r => setTimeout(r, 3000));
  console.log('Iniciando downloads...\n');

  let success = 0, failed = 0, skipped = 0;
  const failedList = [];

  for (let i = 0; i < toDownload.length; i++) {
    const fname = toDownload[i];
    const destPath = path.join(catalogDir, fname);

    if (fs.existsSync(destPath)) { skipped++; continue; }

    // Reconstruir URL: {photoId}_{suffix}.ext → https://photo.yupoo.com/minkang/{photoId}/{suffix}.ext
    const underIdx = fname.indexOf('_');
    if (underIdx === -1) { failed++; failedList.push(fname); continue; }
    const photoId = fname.slice(0, underIdx);
    const rest = fname.slice(underIdx + 1); // e.g., "big.jpg"
    const url = `${baseUrl}${photoId}/${rest}`;

    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
      try {
        // Usar page.goto() diretamente na URL da imagem evita bloqueio CORS do fetch()
        const response = await page.goto(url, {
          waitUntil: 'networkidle0',
          timeout: 15000,
          referer: 'https://minkang.x.yupoo.com/'
        });

        if (!response || !response.ok()) {
          const status = response ? response.status() : 0;
          throw new Error(`HTTP ${status}`);
        }

        const buffer = await response.buffer();

        if (buffer.length < 5000 && buffer.toString('utf8', 0, 300).includes('EdgeOne')) {
          console.log(`[${i+1}/${toDownload.length}] Bloqueado EdgeOne (tentativa ${attempt}/3): ${fname}`);
          await new Promise(r => setTimeout(r, 8000));
        } else {
          fs.writeFileSync(destPath, buffer);
          success++;
          ok = true;
          if (success <= 5 || success % 50 === 0) {
            console.log(`[${i+1}/${toDownload.length}] ✅ ${fname} (${Math.round(buffer.length/1024)}KB)`);
          }
        }
      } catch(err) {
        if (attempt < 3) {
          console.log(`[${i+1}/${toDownload.length}] Erro tentativa ${attempt}: ${err.message}`);
          await new Promise(r => setTimeout(r, 3000));
        }
      }
    }

    if (!ok) {
      failed++;
      failedList.push(fname);
      console.log(`[${i+1}/${toDownload.length}] ❌ Falhou: ${fname}`);
    }

    await new Promise(r => setTimeout(r, 400));
  }

  await browser.close();

  console.log('\n=== RESULTADO ===');
  console.log(`✅ Baixados com sucesso: ${success}`);
  console.log(`⏭️  Já existiam: ${skipped}`);
  console.log(`❌ Falharam: ${failed}`);

  if (failedList.length > 0) {
    fs.writeFileSync(missingListPath, failedList.join('\n'));
    console.log(`\nFalhas salvas em images_still_missing.txt para nova tentativa.`);
  } else {
    fs.unlinkSync(missingListPath);
    console.log('\nTodas as imagens foram baixadas com sucesso!');
  }
}

downloadMissing().catch(console.error);
