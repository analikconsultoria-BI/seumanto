const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');

const CSV_PATH = 'produtos_completo.csv';

const targetTeams = [
    'Athletico', 'Athletico-PR', 'Athletico Paranaense', 'Atlético-MG', 'Atletico-MG', 'Atletico Mineiro', 
    'Bahia', 'Botafogo', 'Bragantino', 'Chapecoense', 'Corinthians', 'Coritiba', 'Cruzeiro', 
    'Flamengo', 'Fluminense', 'Grêmio', 'Gremio', 'Internacional', 'Mirassol', 'Palmeiras', 
    'Remo', 'Santos', 'São Paulo', 'Sao Paulo', 'Vasco', 'Vitória', 'Vitoria'
];

const ignoredWords = ['kids', 'kid', 'child', 'infantil', 'woman', 'women', 'ladies', 'feminina', 'feminino', 'kit', 'kits'];

async function run() {
    console.log('Iniciando scraper do Brasileirão...');
    const chromePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
    ];
    const execPath = chromePaths.find(p => fs.existsSync(p));

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: execPath,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    let newCSVLines = [];
    let foundNew = 0;
    
    // Read existing CSV to avoid duplicates
    let existingUrls = new Set();
    if (fs.existsSync(CSV_PATH)) {
        const lines = fs.readFileSync(CSV_PATH, 'utf8').split('\n');
        for (const line of lines) {
            const parts = line.split(',');
            if (parts.length > 2) {
                const url = parts[2].replace(/"/g, '').trim();
                if (url.includes('yupoo.com')) existingUrls.add(url);
            }
        }
    }
    
    console.log(`Carregadas ${existingUrls.size} URLs existentes para evitar duplicidade.`);

    const teamsToSearch = ['Athletico', 'Atlético-MG', 'Bahia', 'Botafogo', 'Bragantino', 'Chapecoense', 'Coritiba', 'Cruzeiro', 'Fluminense', 'Fortaleza', 'Internacional', 'Mirassol', 'Remo', 'Vitória'];

    for (const team of teamsToSearch) {
        console.log(`Procurando por: ${team}...`);
        const searchUrl = `https://minkang.x.yupoo.com/search/album?uid=1&q=${encodeURIComponent(team)}`;
        
        const page = await browser.newPage();
        try {
            await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 15000 });
        } catch (e) {
            // ignore timeout
        }
        
        const albums = await page.evaluate(() => {
            let results = [];
            document.querySelectorAll('.album__main').forEach(el => {
                const a = el.closest('a');
                if (a) {
                    results.push({
                        url: a.href,
                        title: el.getAttribute('title') || ''
                    });
                }
            });
            return results;
        });
        
        for (const album of albums) {
            if (existingUrls.has(album.url)) continue;
            
            const titleLower = album.title.toLowerCase();
            const isIgnored = ignoredWords.some(w => titleLower.includes(w));
            if (isIgnored) continue;
            
            console.log(`Novo alvo: ${album.title}`);
            existingUrls.add(album.url);
            
            const albumPage = await browser.newPage();
            try {
                await albumPage.goto(album.url, { waitUntil: 'networkidle2', timeout: 15000 });
                const imgs = await albumPage.evaluate(() => {
                    let results = [];
                    document.querySelectorAll('img').forEach((img, index) => {
                        let src = img.getAttribute('data-src') || img.src || '';
                        if (src.includes('minkang')) {
                            const filename = src.replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_').replace(/_square|_small|_medium|_large/g, '');
                            results.push({ filename: filename, order: index });
                        }
                    });
                    return results;
                });
                
                // Filter uniquely by filename
                const uniqueImgs = [];
                const seen = new Set();
                for (const img of imgs) {
                    if (!seen.has(img.filename)) {
                        seen.add(img.filename);
                        uniqueImgs.push(img);
                    }
                }
                
                if (uniqueImgs.length > 0) {
                    for (const img of uniqueImgs) {
                        const cleanTitle = album.title.replace(/"/g, '""');
                        const newLine = `"Brasileirao Serie A","${cleanTitle}","${album.url}","https://photo.yupoo.com/minkang/${img.filename.replace('_', '/')}",${img.order}`;
                        newCSVLines.push(newLine);
                    }
                    foundNew++;
                    console.log(` -> Adicionadas ${uniqueImgs.length} imagens.`);
                }
            } catch (e) {
                console.log(` -> Erro.`);
            } finally {
                await albumPage.close();
            }
        }
        await page.close();
    }

    if (newCSVLines.length > 0) {
        fs.appendFileSync(CSV_PATH, '\n' + newCSVLines.join('\n'));
        console.log(`\nAdicionados ${foundNew} novos produtos ao CSV.`);
    } else {
        console.log('\nNenhum produto novo encontrado.');
    }
    
    await browser.close();
    console.log('Finalizado.');
}

run().catch(console.error);
