/**
 * download_premier.js
 * Baixa apenas as imagens da Premier League que ainda não existem em assets/catalog/
 * Usa o mesmo mecanismo de bypass (puppeteer + stealth) que o download_images.js
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');

async function downloadPremierImages() {
  const bkpCsvPath = 'produtos_completo_bkp.csv';
  const outDir = path.join(__dirname, 'assets', 'catalog');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const csvData = fs.readFileSync(bkpCsvPath, 'utf8');
  const lines = csvData.split('\n').filter(l => l.trim().length > 0);

  // Pegar apenas URLs de imagens da Premier League com /large. (ignorar square)
  const imagesToDownload = new Set();
  lines.forEach(line => {
    if (!line.startsWith('Premier League')) return;
    // BKP não tem aspas, split simples por vírgula é suficiente
    // Formato: categoria,titulo,url_album,imagem,ordem_imagem
    const parts = line.split(',');
    if (parts.length < 4) return;
    // A URL da imagem é o penúltimo campo (antes do número de ordem)
    // Como a URL não tem vírgulas, podemos pegar o campo 3
    const imgUrl = parts[3].trim();
    if (imgUrl.includes('photo.yupoo.com') && imgUrl.includes('/large.')) {
      imagesToDownload.add(imgUrl);
    }
  });

  const urls = Array.from(imagesToDownload);
  console.log(`Encontradas ${urls.length} imagens únicas da Premier League para verificar/baixar.`);

  // Verificar quais já existem
  const missing = urls.filter(url => {
    const filename = url.replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_');
    return !fs.existsSync(path.join(outDir, filename));
  });

  console.log(`Já existem: ${urls.length - missing.length} | Precisam ser baixadas: ${missing.length}`);

  if (missing.length === 0) {
    console.log('Todas as imagens da Premier League já estão baixadas!');
    return;
  }

  // Encontrar o Chrome ou Edge no Windows
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  let execPath = chromePaths.find(p => fs.existsSync(p));

  if (!execPath) {
    console.error("ERRO: Chrome ou Edge não encontrado!");
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: execPath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--window-size=1280,800'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer': 'https://minkang.x.yupoo.com/'
  });

  console.log('Obtendo cookies do Yupoo...');
  try {
    await page.goto('https://minkang.x.yupoo.com/', { waitUntil: 'networkidle2', timeout: 20000 });
  } catch(e) { console.log('(timeout ao carregar Yupoo, continuando mesmo assim)'); }

  await new Promise(r => setTimeout(r, 3000));
  console.log('Iniciando downloads das imagens da Premier League...');

  let count = 0;
  let downloaded = 0;
  let blocked = 0;
  let errors = 0;

  for (const url of missing) {
    count++;
    const filename = url.replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_');
    const filePath = path.join(outDir, filename);

    try {
      const base64 = await page.evaluate(async (imgUrl) => {
        const response = await fetch(imgUrl, {
          headers: {
            'Referer': 'https://minkang.x.yupoo.com/',
            'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
          }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const buffer = await response.arrayBuffer();
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
      }, url);

      const buffer = Buffer.from(base64, 'base64');

      if (buffer.length < 15000 && buffer.toString('utf8').includes('Tencent Cloud EdgeOne')) {
        console.log(`[${count}/${missing.length}] ⚠ Bloqueado: ${filename}`);
        blocked++;
        await new Promise(r => setTimeout(r, 5000));
      } else {
        fs.writeFileSync(filePath, buffer);
        console.log(`[${count}/${missing.length}] ✓ Baixado: ${filename}`);
        downloaded++;
      }

      await new Promise(r => setTimeout(r, 400));
    } catch (error) {
      console.error(`[${count}/${missing.length}] ✗ Erro: ${filename} → ${error.message}`);
      errors++;
    }
  }

  await browser.close();
  console.log(`\n=== CONCLUÍDO ===`);
  console.log(`✓ Baixados: ${downloaded} | ⚠ Bloqueados: ${blocked} | ✗ Erros: ${errors}`);
  console.log(`Atualize o site no navegador (F5) para ver as imagens da Premier League!`);
}

downloadPremierImages().catch(console.error);
