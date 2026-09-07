const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');

async function downloadImages() {
  const csvPath = 'produtos_completo.csv';
  const outDir = path.join(__dirname, 'assets', 'catalog');
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const csvData = fs.readFileSync(csvPath, 'utf8');
  const lines = csvData.split('\n').filter(l => l.trim().length > 0);
  
  // Extrair todas as imagens do yupoo (formato: categoria,titulo,album,imagem,ordem)
  const imagesToDownload = new Set();
  lines.forEach(line => {
    // Extrair URL de imagem - está entre aspas no CSV
    const matches = line.match(/https:\/\/photo\.yupoo\.com\/[^"',]+/g);
    if (matches) {
      matches.forEach(url => imagesToDownload.add(url.trim()));
    }
  });

  const urls = Array.from(imagesToDownload);
  console.log(`Encontradas ${urls.length} imagens únicas para baixar.`);
  console.log(`Salvando em: ${outDir}`);

  // Encontrar o Chrome ou Edge no Windows
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  let execPath = chromePaths.find(p => fs.existsSync(p));

  if (!execPath) {
    console.error("ERRO: Chrome ou Edge não encontrado! Instale o Chrome ou ajuste o caminho.");
    process.exit(1);
  }

  // Iniciar navegador em modo headless para não dar crash
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

  console.log('Obtendo cookies de permissão do Yupoo (bypass EdgeOne)...');
  try {
    await page.goto('https://minkang.x.yupoo.com/', { waitUntil: 'networkidle2', timeout: 20000 });
  } catch(e) {}
  
  await new Promise(r => setTimeout(r, 4000));
  
  console.log('Cookies obtidos. A página está aberta. Iniciando os downloads nativos via fetch...');

  let count = 0;
  for (const url of urls) {
    count++;
    // Transformar a URL em nome de arquivo local
    // De: https://photo.yupoo.com/minkang/200faea255/2443ef33.jpg
    // Para: 200faea255_2443ef33.jpg
    const filename = url.replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_');
    const filePath = path.join(outDir, filename);

    if (fs.existsSync(filePath)) {
      console.log(`[${count}/${urls.length}] Já existe: ${filename}`);
      continue;
    }

    let success = false;
    let attempts = 0;
    while (!success && attempts < 3) {
      attempts++;
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
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
              binary += String.fromCharCode(bytes[i]);
          }
          return window.btoa(binary);
        }, url);
        
        const buffer = Buffer.from(base64, 'base64');
        
        // Verifica se é uma página HTML de erro (Tencent Cloud EdgeOne) em vez de imagem
        if (buffer.length < 15000 && buffer.toString('utf8').includes('Tencent Cloud EdgeOne')) {
          console.log(`[${count}/${urls.length}] Bloqueado pelo EdgeOne (Tentativa ${attempts}/3): ${filename}`);
          await new Promise(r => setTimeout(r, 8000)); 
        } else {
          fs.writeFileSync(filePath, buffer);
          console.log(`[${count}/${urls.length}] Baixado com sucesso: ${filename}`);
          success = true;
        }
        
      } catch (error) {
        if (attempts < 3) {
           console.log(`[${count}/${urls.length}] Erro (${error.message}) - Tentando novamente (${attempts}/3) em 3s...`);
           await new Promise(r => setTimeout(r, 3000));
        } else {
           console.error(`[${count}/${urls.length}] Falha final ao baixar ${filename}: ${error.message}`);
        }
      }
    }
    
    // Pausa rápida entre as imagens
    await new Promise(r => setTimeout(r, 600)); 
  }

  await browser.close();
  console.log('Download em massa concluído com sucesso!');
}

downloadImages().catch(console.error);
