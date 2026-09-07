const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configurações
const CSV_PATH = 'produtos_completo.csv';
const CATALOG_DIR = path.join('assets', 'catalog');
const PROGRESS_FILE = 'super_scraper_progress.json';

// Funções Auxiliares CSV
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) { result.push(current); current = ''; }
    else current += char;
  }
  result.push(current);
  return result;
}
const cleanStr = str => str ? str.replace(/^"|"$/g, '').trim() : '';

// Download nativo (evita bloqueios do Puppeteer)
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const dest = path.join(CATALOG_DIR, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      return resolve(true); // Já existe
    }

    const options = {
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
      },
      timeout: 10000
    };

    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return resolve(false); // Ignorar falhas, mas continuar script
      }

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
      file.on('error', (err) => { fs.unlink(dest, () => {}); resolve(false); });
    }).on('error', (err) => resolve(false));
  });
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 200;
      var maxScrolls = 50;
      var scrolls = 0;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        scrolls++;
        if (totalHeight >= scrollHeight || scrolls >= maxScrolls) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function run() {
  console.log('--- INICIANDO SUPER SCRAPER ---');
  if (!fs.existsSync(CATALOG_DIR)) fs.mkdirSync(CATALOG_DIR, { recursive: true });

  const csvData = fs.readFileSync(CSV_PATH, 'utf8');
  const lines = csvData.split('\n').filter(l => l.trim().length > 0);
  
  // Mapear albums existentes
  const albumMap = new Map(); // url -> { category, title, lines: [] }
  lines.forEach(line => {
    const parts = parseCSVLine(line);
    if (parts.length < 5) return;
    const cat = cleanStr(parts[0]);
    const tit = cleanStr(parts[1]);
    const url = cleanStr(parts[2]);
    if (!albumMap.has(url)) {
      albumMap.set(url, { category: cat, title: tit, lines: [] });
    }
    albumMap.get(url).lines.push(line);
  });

  const albums = Array.from(albumMap.entries());
  console.log(`Total de Álbuns Únicos para processar: ${albums.length}`);

  let progress = {};
  if (fs.existsSync(PROGRESS_FILE)) {
    progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    console.log(`Retomando: ${Object.keys(progress).length} álbuns já processados.`);
  }

  // Setup Browser
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const execPath = chromePaths.find(p => fs.existsSync(p));

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: execPath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Obtendo sessão do Yupoo...');
  try { await page.goto('https://minkang.x.yupoo.com/', { waitUntil: 'networkidle2', timeout: 15000 }); } catch(e) {}
  
  let newCSVLines = [];
  let downloadedCount = 0;
  
  for (let i = 0; i < albums.length; i++) {
    const [albumUrl, data] = albums[i];
    
    if (progress[albumUrl] === 'done') {
      newCSVLines.push(...data.lines);
      continue;
    }

    process.stdout.write(`[${i+1}/${albums.length}] ${albumUrl} ... `);

    try {
      await page.goto(albumUrl, { waitUntil: 'networkidle2', timeout: 15000 });
      await autoScroll(page);
      await new Promise(r => setTimeout(r, 1000)); // wait extra for images to render

      // Extrair todas as imagens e descobrir a ordem
      const extractedImgs = await page.evaluate(() => {
        const results = [];
        const ogImageMeta = document.querySelector('meta[property="og:image"]');
        const ogImageUrl = ogImageMeta ? ogImageMeta.getAttribute('content') : '';
        let coverHash = '';
        if (ogImageUrl) {
          const match = ogImageUrl.match(/minkang\/([a-f0-9]+)\//) || ogImageUrl.match(/([a-f0-9]{8,})/);
          if (match) coverHash = match[1];
        }

        document.querySelectorAll('img').forEach(img => {
          const src = img.getAttribute('data-src') || img.src || '';
          const alt = img.alt || '';
          if (src && src.includes('minkang')) {
            let finalSrc = src;
            let order = 99; // fallback
            const altMatch = alt.match(/-(\d+)\.(jpg|jpeg|png|webp)$/i);
            if (altMatch) order = parseInt(altMatch[1]);
            
            // Força a imagem da capa (og:image) para ser a primeira (order = 0)
            if (coverHash && src.includes(coverHash)) {
              order = 0;
            }
            
            results.push({ src: finalSrc, alt: alt, order: order });
          }
        });
        return results;
      });
      
      if (extractedImgs.length === 0) {
        process.stdout.write(`ERRO (Nenhuma img)\n`);
        newCSVLines.push(...data.lines); // mantém o antigo
        progress[albumUrl] = 'error';
        continue;
      }
      
      // Filtrar apenas únicas baseadas no hash
      const uniqueImgsMap = new Map();
      extractedImgs.forEach(img => {
        const match = img.src.match(/([a-f0-9]+)\/(small|medium|large|square)/) || img.src.match(/minkang\/([a-f0-9]+)\//) || img.src.match(/([a-f0-9]{8})/);
        if (match) {
          const hash = match[1];
          // Preferimos a ordem descoberta sobre o 99 padrão
          if (!uniqueImgsMap.has(hash) || uniqueImgsMap.get(hash).order === 99) {
             uniqueImgsMap.set(hash, img);
          }
        }
      });
      
      const uniqueImgs = Array.from(uniqueImgsMap.values());
      uniqueImgs.sort((a, b) => a.order - b.order); // Ordem correta!

      // Baixar e Gerar novas linhas
      let dlCount = 0;
      let newLinesForAlbum = [];
      
      for (const img of uniqueImgs) {
        const filename = img.src.replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_').replace(/_square|_small|_medium|_large/g, ''); 
        
        // Yupoo URL manipulation to download high res
        let dlUrl = img.src;
        // if it ends with square.jpg, we just try to get the original or leave it
        
        const success = await downloadImage(dlUrl, filename);
        if (success) {
           dlCount++;
           const newLine = `"${data.category}","${data.title}","${albumUrl}","https://photo.yupoo.com/minkang/${filename.replace('_', '/')}",${img.order}`;
           newLinesForAlbum.push(newLine);
        }
      }
      
      if (newLinesForAlbum.length > 0) {
        newCSVLines.push(...newLinesForAlbum);
        process.stdout.write(`OK (${newLinesForAlbum.length} imgs, ${dlCount} baixadas)\n`);
        progress[albumUrl] = 'done';
        downloadedCount += dlCount;
      } else {
        process.stdout.write(`FALHA (0 downloads)\n`);
        newCSVLines.push(...data.lines);
        progress[albumUrl] = 'error';
      }

    } catch (e) {
      process.stdout.write(`ERRO: ${e.message.substring(0, 30)}\n`);
      newCSVLines.push(...data.lines);
      progress[albumUrl] = 'error';
    }

    // Salva progresso a cada 10 albuns para não perder nada
    if (i % 10 === 0) {
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress));
      fs.writeFileSync('produtos_completo_new.csv', newCSVLines.join('\n'));
    }
  }

  // Finalização
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress));
  fs.writeFileSync('produtos_completo.csv', newCSVLines.join('\n'));
  await browser.close();
  console.log(`\n========== CONCLUÍDO ==========`);
  console.log(`Total de novas imagens processadas/verificadas: ${downloadedCount}`);
  console.log(`O catálogo foi atualizado perfeitamente!`);
}

run().catch(console.error);
