/**
 * csv_loader.js – Carrega produtos_completo.csv e transforma em dados do site
 * 
 * Estrutura CSV:
 *   categoria, titulo, url_album, imagem, ordem_imagem
 * 
 * Regras:
 *   - Linhas com mesmo titulo+url_album = mesmo produto (variações/imagens)
 *   - ordem_imagem=1 = imagem de capa (grid)
 *   - Apenas imagens "large" são usadas (filtra as "square")
 *   - Separado por Liga/categoria
 */

async function loadCSVProducts() {
  // Check if already loaded and cached
  const cached = localStorage.getItem('seumanto_csv_loaded_v40');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      localStorage.removeItem('seumanto_csv_loaded_v40');
    }
  }
  
  // Clear old caches
  localStorage.removeItem('seumanto_csv_loaded_v39');
  localStorage.removeItem('seumanto_csv_loaded_v38');
  localStorage.removeItem('seumanto_csv_loaded_v32');

  try {
    const response = await fetch('produtos_completo.csv');
    const text = await response.text();
    return parseCSV(text);
  } catch (err) {
    console.error('Erro ao carregar CSV:', err);
    return null;
  }
}

function parseCSV(csvText) {
  const lines = csvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 1) return null;

  // Não tem header no novo CSV, todas as linhas são dados
  const dataLines = lines;

  // Group by product (titulo + url_album = unique product)
  const productMap = new Map();

  dataLines.forEach(line => {
    // Parse CSV line (handling commas in URLs)
    const parts = parseCSVLine(line);
    if (parts.length < 5) return;

    const [categoria, titulo, url_album, imagem_raw, ordem_imagem] = parts;

    // Remove possíveis aspas e espaços
    const cleanStr = str => str ? str.replace(/^"|"$/g, '').trim() : '';
    const imagem = cleanStr(imagem_raw);

    const key = cleanStr(titulo); // Agrupar APENAS pelo título

    if (!productMap.has(key)) {
      productMap.set(key, {
        categoria: cleanStr(categoria),
        titulo: cleanStr(titulo),
        url_album: cleanStr(url_album), // Guardamos o primeiro album que aparecer
        images: [],
        coverImage: null
      });
    }

    const product = productMap.get(key);

    // Ignorar linhas se vierem de um álbum duplicado (mesmo título, outro link)
    if (product.url_album !== cleanStr(url_album)) {
      return;
    }

    // Converte a URL do Yupoo para o caminho do arquivo local baixado
    const rawImgUrl = imagem;
    let imgUrl = rawImgUrl;
    if (rawImgUrl.includes('photo.yupoo.com')) {
      const filename = rawImgUrl.replace('https://photo.yupoo.com/minkang/', '').replace(/\//g, '_');
      imgUrl = 'assets/catalog/' + filename + '?v=1'; // Cache buster for replaced 75x75 thumbnails
    }

    const order = parseInt(ordem_imagem.trim());

    // Ignora imagens square (thumbnails do CSV antigo)
    if (rawImgUrl.includes('/square.')) return;

    // Skip order 0 images
    if (order === 0) return;

    // Ignorar produtos de Outros Esportes (NBA, NFL, Basquete)
    const lowerTitleCheck = titulo.toLowerCase();
    if (lowerTitleCheck.includes('nba') || lowerTitleCheck.includes('nfl') || lowerTitleCheck.includes('lakers') || lowerTitleCheck.includes('basketball') || lowerTitleCheck.includes('basquete') || lowerTitleCheck.includes('bulls') || lowerTitleCheck.includes('celtics')) {
      return;
    }

    // Deduplicação: ignora se essa URL já foi adicionada a esse produto
    const alreadyAdded = product.images.some(img => img.url === imgUrl);
    if (alreadyAdded) return;

    product.images.push({ url: imgUrl, order: order });
  });

  // Convert to site format
  const products = {};
  let idCounter = 0;

  let overrides = {};
  try {
    overrides = JSON.parse(localStorage.getItem('seumanto_cover_overrides') || '{}');
  } catch (e) { }

  // Category mapping
  const catMap = {
    'Brasileirao Serie A': { key: 'brasileirao', label: 'Brasileirão', vitrine: 'Brasileirão' },
    'La Liga': { key: 'laliga', label: 'La Liga', vitrine: 'La Liga' },
    'Premier League': { key: 'premier', label: 'Premier League', vitrine: 'Premier League' }
  };

  productMap.forEach((prod, key) => {
    let catInfo = catMap[prod.categoria] || { key: 'outros', label: prod.categoria, vitrine: prod.categoria };

    const lowerTitle = prod.titulo.toLowerCase();
    const isKids = ['kids', 'child', 'children', 'boys', 'infantil'].some(kw => lowerTitle.includes(kw));
    const isWomen = ['women', 'woman', 'ladies', 'female', 'feminina', 'feminino'].some(kw => lowerTitle.includes(kw));

    // Sort images by order
    prod.images.sort((a, b) => a.order - b.order);

    // Extract team name and season from title
    const { team, season, tagLabel, tag, cleanName, type, retro, edition } = parseTitle(prod.titulo);

    // Sobrescrever a categoria se for infantil ou feminino ou erro do fornecedor
    if (isKids) {
      catInfo = { key: 'infantil', label: 'Infantil', vitrine: 'Linha Infantil' };
    } else if (isWomen) {
      catInfo = { key: 'feminino', label: 'Feminino', vitrine: 'Linha Feminina' };
    } else if (team === 'Real Betis' || team === 'Real Madrid' || team === 'Barcelona') {
      catInfo = { key: 'laliga', label: 'La Liga', vitrine: 'La Liga' };
    } else if (team === 'Arsenal' || team === 'Chelsea' || team === 'Liverpool' || team === 'Manchester City' || team === 'Manchester United' || team === 'Tottenham' || team === 'Aston Villa' || team === 'Newcastle' || team === 'Sunderland' || team === 'Birmingham') {
      catInfo = { key: 'premier', label: 'Premier League', vitrine: 'Premier League' };
    } else if (team === "O'Higgins" || team === 'Bayern de Munique' || team === 'Borussia Dortmund' || team === 'Juventus' || team === 'Milan' || team === 'Inter de Milão' || team === 'PSG' || team === 'Inter Miami' || team === 'Al Nassr') {
      catInfo = { key: 'internacionais', label: 'Internacionais', vitrine: 'Internacionais' };
    }

    if (!products[catInfo.key]) {
      products[catInfo.key] = [];
    }

    // Determine sizes from title
    const sizes = extractSizes(prod.titulo);

    // Calculate Pricing logic based on type and tag
    let priceInfo = {
      baseStr: "Consultar",
      oldStr: "",
      pixStr: "Consultar",
      instStr: "Consultar",
      hasPrice: false
    };

    if (type === "Camisa") {
      if (retro === "Retrô" || tag === 'r') { // Retro
        priceInfo = { baseStr: "R$ 180,00", oldStr: "R$ 250,00", pixStr: "R$ 170,00", instStr: "2x de R$ 90,00", hasPrice: true };
      } else if (edition === "Edição Especial" || tag === 'se') { // Special Edition
        priceInfo = { baseStr: "R$ 160,00", oldStr: "R$ 220,00", pixStr: "R$ 150,00", instStr: "2x de R$ 80,00", hasPrice: true };
      } else if (tag === 'j') { // Player Version (Jogador)
        priceInfo = { baseStr: "R$ 160,00", oldStr: "R$ 220,00", pixStr: "R$ 150,00", instStr: "2x de R$ 80,00", hasPrice: true };
      } else { // Torcedor and others (default)
        priceInfo = { baseStr: "R$ 130,00", oldStr: "R$ 180,00", pixStr: "R$ 120,00", instStr: "2x de R$ 65,00", hasPrice: true };
      }
    }

    idCounter++;
    const productId = 'csv_' + idCounter;

    // Apply cover override if it exists
    let coverImg = prod.images.length > 0 ? prod.images[0].url : '';
    let finalImages = prod.images.map(i => i.url);
    if (overrides[productId] && finalImages.includes(overrides[productId])) {
      coverImg = overrides[productId];
      // Mover a imagem forçada para ser a primeira da galeria
      finalImages = [coverImg, ...finalImages.filter(url => url !== coverImg)];
    }

    const productObj = {
      id: productId,
      name: cleanName,
      fullName: prod.titulo,
      season: season,
      tag: tag,
      tagLabel: tagLabel,
      type: type,
      img: coverImg,
      images: finalImages,
      priceInfo: priceInfo,
      price: priceInfo.baseStr, // legacy fallback
      category: catInfo.key,
      liga: catInfo.label,
      vitrines: [catInfo.vitrine, 'Lançamentos'],
      sizes: sizes,
      team: team,
      url_album: prod.url_album
    };

    products[catInfo.key].push(productObj);
  });

  // Cache in localStorage
  const result = { products, loaded: true };
  try {
    localStorage.setItem('seumanto_csv_loaded_v40', JSON.stringify(result));
  } catch (e) {
    // localStorage might be full, that's ok
    console.warn('Não foi possível cachear produtos no localStorage');
  }

  return result;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseTitle(titulo) {
  let cleanTitle = titulo.replace(/\d+$/, '').trim(); // remove trailing numbers (image count)

  // Try to extract season (e.g., "26/27", "24/25", "10/11", "1995", "2000")
  let season = '';
  const seasonMatch = cleanTitle.match(/(\d{2}\/\d{2}|\d{4})/);
  if (seasonMatch) {
    season = seasonMatch[1];
  }

  // Determine tag
  let tag = 't';
  let tagLabel = 'Torcedor';
  const titleLower = cleanTitle.toLowerCase();

  if (titleLower.includes('player version') || titleLower.includes('match')) {
    tag = 'j';
    tagLabel = 'Jogador';
  } else if (titleLower.includes('retro')) {
    tag = 'r';
    tagLabel = 'Retrô';
  } else if (titleLower.includes('women') || titleLower.includes('wome')) {
    tag = 'f';
    tagLabel = 'Feminina';
  } else if (titleLower.includes('kids') || titleLower.includes('kid')) {
    tag = 'k';
    tagLabel = 'Infantil';
  } else if (titleLower.includes('goalkeeper') || titleLower.includes('gk')) {
    tag = 'g';
    tagLabel = 'Goleiro';
  } else if (titleLower.includes('training') || titleLower.includes('pre-match')) {
    tag = 'tr';
    tagLabel = 'Treino';
  } else if (titleLower.includes('special edition')) {
    tag = 'se';
    tagLabel = 'Edição Especial';
  }

  // TYPE
  let type = "Camisa";
  if (titleLower.includes("shorts")) type = "Calção";
  else if (titleLower.includes("kit")) type = "Kit";
  else if (titleLower.includes("jacket") || titleLower.includes("tracksuit")) type = "Jaqueta";
  else if (titleLower.includes("windbreaker")) type = "Corta Vento";
  else if (titleLower.includes("pants")) type = "Calça";
  else if (titleLower.includes("set") || titleLower.includes("suit")) type = "Conjunto";

  // EDITION
  let edition = "";
  if (titleLower.includes("home")) edition = "Titular (Home)";
  else if (titleLower.includes("away")) edition = "Reserva (Away)";
  else if (titleLower.includes("third")) edition = "3ª (Third)";
  else if (titleLower.includes("fourth")) edition = "4ª (Fourth)";
  else if (titleLower.includes("special edition")) edition = "Edição Especial";
  else if (titleLower.includes("pre-match")) edition = "Pré-Jogo";
  else if (titleLower.includes("training")) edition = "Treino";
  else if (titleLower.includes("goalkeeper") || titleLower.includes(" gk ")) edition = "Goleiro";

  // RETRO
  let retro = titleLower.includes("retro") ? "Retrô" : "";

  // Extract team name
  const knownTeams = [
    'Flamengo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Sao Paulo', 'Santos', 'Vasco da Gama', 'Vasco', 'Fluminense', 'Botafogo', 'Grêmio', 'Gremio', 'Internacional', 'Cruzeiro', 'Atlético Mineiro', 'Atletico Mineiro', 'Atlético-MG', 'Atletico-MG', 'Bahia', 'Fortaleza', 'Athletico Paranaense', 'Athletico-PR', 'Athletico', 'Sport Recife', 'Bragantino', 'Chapecoense', 'Coritiba', 'Mirassol', 'Remo', 'Vitória', 'Vitoria', 'O\'Higgins',
    'Real Madrid', 'Barcelona', 'Real Betis', 'Arsenal', 'Chelsea', 'Liverpool', 'Manchester City', 'Manchester United', 'Tottenham', 'Bayern de Munique', 'Bayern Munich', 'Bayern', 'Borussia Dortmund', 'Juventus', 'Milan', 'Inter de Milão', 'PSG', 'Paris Saint Germain', 'Inter Miami', 'Al Nassr', 'Aston Villa', 'Newcastle', 'Sunderland', 'Birmingham'
  ];

  let team = "";
  let foundTeam = false;
  for (const kt of knownTeams) {
    if (titleLower.includes(kt.toLowerCase())) {
      team = kt;
      if (team === 'Vasco') team = 'Vasco da Gama';
      if (team === 'Gremio') team = 'Grêmio';
      if (team === 'Sao Paulo') team = 'São Paulo';
      if (team === 'Atletico Mineiro' || team === 'Atlético-MG' || team === 'Atletico-MG') team = 'Atlético Mineiro';
      if (team === 'Athletico-PR' || team === 'Athletico') team = 'Athletico Paranaense';
      if (team === 'Vitoria') team = 'Vitória';
      if (team === 'Bayern Munich' || team === 'Bayern') team = 'Bayern de Munique';
      if (team === 'Paris Saint Germain') team = 'PSG';
      foundTeam = true;
      break;
    }
  }

  if (!foundTeam) {
    let tempTeam = cleanTitle;
    tempTeam = tempTeam.replace(/\s*(S-\d*XL\d*|S-XXL|Size[s]?[:\s]*[\d\-]+).*$/i, '');
    tempTeam = tempTeam.replace(/\s*Jersey.*$/i, '');
    tempTeam = tempTeam.replace(/\s*(Home|Away|Third|Fourth|GK|Goalkeeper|Pre-Match|Training|Special Edition|Player Version|Long Sleeved|Women'?s?|Womens?|Kids Kit|Kids|Vest|Shorts|Originals|Trefoil|Member|Signature|World Cup|Version|Match|Full-Button|Baseball|Retro).*$/i, '');
    tempTeam = tempTeam.replace(/\s*\d{2}\/\d{2}\s*/, ' ').replace(/\s*\d{4}\s*/, ' ').trim();
    tempTeam = tempTeam.replace(/\s+/g, ' ').trim();
    
    if (!tempTeam || tempTeam.match(/^[\d\/\s]+$/) || tempTeam.length <= 2) {
      team = ""; // Não adicionar nome de time lixo no título do produto
    } else {
      team = tempTeam.split(' ').slice(0, 2).join(' ');
      team = team.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }


  let fullNameParts = [type, team, season, edition, retro].filter(Boolean);
  
  let partsToKeep = [];
  fullNameParts.forEach(part => {
    if (part.toLowerCase() === tagLabel.toLowerCase()) return;
    partsToKeep.push(part);
  });
  
  let safeTemp = partsToKeep.join(" ").toLowerCase();
  let shouldAppend = true;
  
  if (safeTemp.includes(tagLabel.toLowerCase())) {
     shouldAppend = false;
  }
  if (type !== "Camisa" && tagLabel === "Torcedor") {
     shouldAppend = false;
  }
  
  if (shouldAppend) {
     partsToKeep.push(tagLabel);
  }
  
  let finalName = partsToKeep.join(" ").replace(/\s+/g, ' ').trim();

  return { team, season, tagLabel, tag, cleanName: finalName, type, retro, edition };
}

function extractSizes(titulo) {
  const sizeMatch = titulo.match(/S-(\d*XL\d*|XXL)/i);
  if (sizeMatch) {
    const maxSize = sizeMatch[1].toUpperCase();
    const sizeList = ['S', 'M', 'L', 'XL'];
    if (maxSize.includes('2XL') || maxSize === 'XXL') sizeList.push('2XL');
    if (maxSize.includes('3XL')) { sizeList.push('2XL', '3XL'); }
    if (maxSize.includes('4XL')) { sizeList.push('2XL', '3XL', '4XL'); }
    return [...new Set(sizeList)];
  }

  // Kids sizes
  if (titulo.toLowerCase().includes('kids') || titulo.match(/Size[:\s]*\d+/i)) {
    return ['16', '18', '20', '22', '24', '26', '28'];
  }

  return ['S', 'M', 'L', 'XL'];
}
