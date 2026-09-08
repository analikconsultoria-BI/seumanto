const WA = "5519988369538";

// Products will be loaded from CSV
let PRODUCTS = {};

// Shared team badge map — used by mega menu AND categoria.html filter
window.TEAM_BADGES = {
  // Brasileirão
  'flamengo':               'assets/img/escudos/br/Flamengo_f.webp',
  'palmeiras':              'assets/img/escudos/br/palmeiras_f.webp',
  'corinthians':            'assets/img/escudos/br/Corinthians_f.webp',
  'são paulo':              'assets/img/escudos/br/Sao-Paulo_f.webp',
  'santos':                 'assets/img/escudos/br/Santos.svg',
  'vasco da gama':          'assets/img/escudos/br/Vasco_f.webp',
  'fluminense':             'assets/img/escudos/br/Fluminense_f.webp',
  'botafogo':               'assets/img/escudos/br/Botafogo_f.webp',
  'grêmio':                 'assets/img/escudos/br/Gremio.webp',
  'internacional':          'assets/img/escudos/br/Internacional_f.webp',
  'cruzeiro':               'assets/img/escudos/br/Cruzeiro_f.webp',
  'atlético mineiro':       'assets/img/escudos/br/Atletico-Mineiro_f.webp',
  'bahia':                  'assets/img/escudos/br/Bahia_f.webp',
  'fortaleza':              'assets/img/escudos/br/Fortaleza_f.webp',
  'athletico paranaense':   'assets/img/escudos/br/Atletico-Paranaense_f.webp',
  'bragantino':             'assets/img/escudos/br/Bragantino_f.webp',
  'chapecoense':            'assets/img/escudos/br/Chapecoense_f.webp',
  'remo':                   'assets/img/escudos/br/Remo.webp',
  'vitória':                'assets/img/escudos/br/Vitoria.svg',
  'mirassol':               'assets/img/escudos/br/Mirassol.svg',
  'coritiba':               'assets/img/escudos/br/Coritiba_f.webp',
  'ceará':                  'assets/img/escudos/br/Ceara_f.webp',
  'atlético go':            'assets/img/escudos/br/Atletico-GO.png',
  'juventus da mooca':      'assets/img/escudos/br/Juventus-Mooca.svg',
  'juventus mooca':         'assets/img/escudos/br/Juventus-Mooca.svg',
  // La Liga
  'real madrid':            'assets/img/escudos/int/Real-Madrid_SF4x.webp',
  'barcelona':              'assets/img/escudos/int/Barcelona.png',
  'real betis':             'assets/img/escudos/int/Real-Betis.png',
  'atlético de madrid':     'assets/img/escudos/int/Atletico-Madrid.png',
  // Premier League
  'arsenal':                'assets/img/escudos/int/Arsenal_SF4x.webp',
  'chelsea':                'assets/img/escudos/int/Chelsea_SF4x.webp',
  'liverpool':              'assets/img/escudos/int/Liverpool_SF4x.webp',
  'manchester city':        'assets/img/escudos/int/M-City_SF4x.webp',
  'manchester united':      'assets/img/escudos/int/M-United_SF4x.webp',
  'tottenham':              'assets/img/escudos/int/Tottenhan_SF4x.webp',
  'aston villa':            'assets/img/escudos/int/Aston-Villa.png',
  'newcastle':              'assets/img/escudos/int/Newcastle.png',
  'sunderland':             'assets/img/escudos/int/Sunderland.png',
  'birmingham':             'assets/img/escudos/int/Birmingham.png',
  'everton':                'assets/img/escudos/int/Everton.png',
  'fulham':                 'assets/img/escudos/int/Fulham.png',
  'wolves':                 'assets/img/escudos/int/Wolves.png',
  'derby county':           'assets/img/escudos/int/Derby-County.png',
  'portsmouth':             'assets/img/escudos/int/Portsmouth.png',
  'sheffield wednesday':    'assets/img/escudos/int/Sheffield-Wednesday.png',
  'coventry':               'assets/img/escudos/int/Coventry.png',
  'preston':                'assets/img/escudos/int/Preston.png',
  'queens park rangers':    'assets/img/escudos/int/QPR.png',
  // Outros internacionais
  'bayern de munique':      'assets/img/escudos/int/Bayern_SF4x.webp',
  'borussia dortmund':      'assets/img/escudos/int/Borussia_SF4x.webp',
  'bayer leverkusen':       'assets/img/escudos/int/Bayer-Leverkusen.png',
  'juventus':               'assets/img/escudos/int/Juventus_SF4x.webp',
  'milan':                  'assets/img/escudos/int/Milan_SF4x.webp',
  'psg':                    'assets/img/escudos/int/Psg_SF4x.webp',
  'atlético nacional':      'assets/img/escudos/int/Atletico-Nacional.png',
  'atlético rosario':       'assets/img/escudos/int/Atletico-Rosario.png',
};

// Builds the navigation menu dynamically from loaded products
// Only teams with real products appear; no phantom entries
function buildMenuFromProducts(products) {
  const ligaTeams = {};
  Object.values(products).forEach(catArr => {
    catArr.forEach(p => {
      if (!p.team || !p.liga) return;
      if (['Infantil', 'Feminino'].includes(p.liga)) return;
      if (!ligaTeams[p.liga]) ligaTeams[p.liga] = new Set();
      ligaTeams[p.liga].add(p.team);
    });
  });

  const LIGA_ORDER = ['Brasileirão', 'La Liga', 'Premier League', 'Internacionais'];
  const LIGA_ID    = { 'Brasileirão': 'brasileirao', 'La Liga': 'laliga', 'Premier League': 'premier', 'Internacionais': 'internacionais' };

  return LIGA_ORDER
    .filter(liga => ligaTeams[liga] && ligaTeams[liga].size > 0)
    .map(liga => ({
      id: LIGA_ID[liga] || liga.toLowerCase(),
      name: liga,
      active: true,
      subs: [{ title: liga, items: [...ligaTeams[liga]].sort().join(', ') }]
    }));
}

const DEFAULT_BANNERS = {
  home_desktop: "assets/img/SELEÇÃO BRASILEIRA.png",
  home_mobile: "assets/img/SELEÇÃO BRASILEIRA.png",
  cat_nac_d: "assets/img/BRASILEIRAO.png",
  cat_nac_m: "assets/img/BRASILEIRAO.png",
  cat_int_d: "assets/img/INTERNACIONAL.png",
  cat_int_m: "assets/img/INTERNACIONAL.png",
  cat_ret_d: "assets/img/RETRO.png",
  cat_ret_m: "assets/img/RETRO.png",
  grids_desktop: "https://placehold.co/1440x250/D6AF68/111?text=Banner+Entre+Grades+Desktop+(1440x250)",
  grids_mobile: "https://placehold.co/768x300/D6AF68/111?text=Banner+Entre+Grades+Mobile+(768x300)"
};

const DEFAULT_MEGA_FOOTER = [
  {
    id: "brasileiros", name: "Brasileiros", active: true,
    subs: [
      { title: "Minas Gerais", items: "Atlético Mineiro, Cruzeiro, América Mineiro" },
      { title: "Rio de Janeiro", items: "Flamengo, Vasco, Fluminense, Botafogo" },
      { title: "São Paulo", items: "São Paulo, Palmeiras, Santos, Corinthians, Bragantino" },
      { title: "Sul", items: "Internacional, Grêmio, Athletico Paranaense, Coritiba, Juventude" },
      { title: "Nordeste/Norte", items: "Bahia, Vitória, Fortaleza, Ceará, Sport, Náutico, Santa Cruz, Remo, Paysandu" }
    ]
  },
  {
    id: "internacionais", name: "Internacionais", active: true,
    subs: [
      { title: "Premier League (ING)", items: "Arsenal, Chelsea, Liverpool, Manchester City, Manchester United, Tottenham" },
      { title: "La Liga (ESP)", items: "Barcelona, Real Madrid, Atlético de Madrid" },
      { title: "Serie A (ITA)", items: "Juventus, Milan, Inter de Milão, Napoli, Roma" },
      { title: "Outras Ligas", items: "PSG, Bayern de Munique, Borussia Dortmund, Bayer Leverkusen, Ajax, Porto, Benfica" }
    ]
  },
  {
    id: "selecoes", name: "Seleções", active: true,
    subs: [
      { title: "América", items: "Brasil, Argentina, Uruguai, Colômbia, Equador, Chile, Peru, Bolívia, Venezuela" },
      { title: "Europa", items: "Alemanha, Itália, França, Espanha, Inglaterra, Portugal, Holanda, Croácia, Bélgica" },
      { title: "África & Ásia", items: "Senegal, Marrocos, Nigéria, Egito, Camarões, Japão, Coreia do Sul, Arábia Saudita" }
    ]
  },
  {
    id: "libertadores", name: "Libertadores", active: true,
    subs: [
      { title: "Times Brasileiros", items: "Fluminense, São Paulo, Grêmio, Atlético Mineiro, Palmeiras, Flamengo, Botafogo" },
      { title: "Times Argentinos", items: "River Plate, Estudiantes, San Lorenzo, Rosario Central, Talleres, Boca Juniors" },
      { title: "Outros Países", items: "Peñarol, Nacional, Colo-Colo, LDU, Independiente del Valle, Bolívar, Cerro Porteño" }
    ]
  }
];

let BANNERS = null; // Loaded async inside DOMContentLoaded

document.addEventListener("DOMContentLoaded", async () => {
  // Try to load config from site-config.json (deployed config), fall back to localStorage then defaults
  let siteConfig = null;
  try {
    const r = await fetch('site-config.json?' + Date.now());
    if (r.ok) siteConfig = await r.json();
  } catch(e) {}

  if (siteConfig && siteConfig.banners) {
    BANNERS = siteConfig.banners;
    localStorage.setItem('seumanto_banners', JSON.stringify(BANNERS));
  } else {
    BANNERS = JSON.parse(localStorage.getItem('seumanto_banners'));
    if (!BANNERS || BANNERS.grids_desktop?.includes('image.png') || !BANNERS.cat_nac_d) {
      BANNERS = DEFAULT_BANNERS;
    }
  }

  // Apply WhatsApp number from config
  const waNumber = (siteConfig && siteConfig.whatsapp) || WA;
  document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
    a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + waNumber);
  });

  // Apply category banner links + images from config
  const catBannerImgIds = [
    ['banner-cat-nac-d', 'banner-cat-nac-m'],
    ['banner-cat-int-d', 'banner-cat-int-m'],
    ['banner-cat-ret-d', 'banner-cat-ret-m'],
  ];
  if (siteConfig && siteConfig.cat_banners) {
    siteConfig.cat_banners.forEach((b, i) => {
      const linkEl = document.getElementById('cat-banner-link-' + i);
      if (linkEl && b.link) linkEl.href = b.link;
      const [dId, mId] = catBannerImgIds[i] || [];
      if (b.img_d && dId) { const el = document.getElementById(dId); if (el) el.src = b.img_d; }
      if (b.img_m && mId) { const el = document.getElementById(mId); if (el) el.src = b.img_m; }
    });
  }

  // Set banner images (carousel)
  const setBanner = (id, src) => { const el = document.getElementById(id); if (el && src) el.src = src; };
  setBanner('banner-home-desktop', BANNERS.home_desktop);
  setBanner('banner-home-mobile', BANNERS.home_mobile);

  // === LOAD CSV PRODUCTS ===
  if (typeof loadCSVProducts === 'function') {
    try {
      const csvData = await loadCSVProducts();
      if (csvData && csvData.products) {
        PRODUCTS = csvData.products;
        // Save for produto.html to use
        try { localStorage.setItem('seumanto_products', JSON.stringify(PRODUCTS)); } catch (e) { }
      }
    } catch (err) {
      console.warn('CSV load failed, using defaults:', err);
    }
  }

  // Render Mega Menu — always built dynamically from loaded products
  let megaFooterData = Object.keys(PRODUCTS).length > 0
    ? buildMenuFromProducts(PRODUCTS)
    : DEFAULT_MEGA_FOOTER;

  const desktopNav = document.getElementById('desktop-nav');
  const mobileNav = document.getElementById('mobile-nav');
  let desktopHtml = '';
  let mobileHtml = '';

  megaFooterData.filter(c => c.active).forEach(cat => {
    // Count total teams to decide column layout
    const allItems = cat.subs.flatMap(s => s.items.split(',').map(i => i.trim()).filter(Boolean));
    const cols = allItems.length <= 8 ? 1 : allItems.length <= 16 ? 2 : 3;
    const colStyle = `column-count:${cols};column-gap:2rem;`;

    desktopHtml += `
      <div class="nav-mega-item h-full flex items-center px-4 cursor-pointer hover:bg-gray-100 transition-colors" style="position:relative;">
        <span class="nav-link !normal-case tracking-normal">${cat.name} <span class="text-[10px] ml-1">&#9662;</span></span>
        <div class="nav-mega-dropdown" style="display:none;position:absolute;left:0;top:100%;z-index:9999;min-width:200px;">
          <div class="bg-[#111] text-white shadow-2xl border border-[#333] rounded-b-lg mt-0" style="padding:1.25rem 1.5rem;">
    `;
    cat.subs.forEach(sub => {
      desktopHtml += `<div>
        <h4 class="font-bold text-xs mb-3 text-[#D6AF68] uppercase tracking-wider">${sub.title}</h4>
        <ul style="${colStyle}">`;
      sub.items.split(',').forEach(item => {
        const i = item.trim();
        if (!i) return;
        const badge = (window.TEAM_BADGES || {})[i.toLowerCase()];
        const badgeImg = badge ? `<img src="${badge}" alt="${i}" style="width:18px;height:18px;object-fit:contain;display:inline-block;vertical-align:middle;margin-right:6px;border-radius:50%;">` : '';
        desktopHtml += `<li style="break-inside:avoid;padding:3px 0;"><a href="categoria.html?v=${encodeURIComponent(i)}" style="color:#9ca3af;font-size:13px;display:flex;align-items:center;white-space:nowrap;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#9ca3af'">${badgeImg}${i}</a></li>`;
      });
      desktopHtml += `</ul></div>`;
    });
    desktopHtml += `</div></div></div>`;

    mobileHtml += `
      <div class="border-b border-gray-100 last:border-0">
        <button onclick="document.getElementById('mob-sub-${cat.id}').classList.toggle('hidden')" class="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50 text-left">
          ${cat.name} <span class="text-xs text-gray-400">&#9662;</span>
        </button>
        <div id="mob-sub-${cat.id}" class="hidden px-4 pb-4 bg-gray-50 space-y-4 pt-2">
    `;
    cat.subs.forEach(sub => {
      mobileHtml += `<div>
        <h4 class="font-bold text-xs text-[#D6AF68] uppercase mb-2">${sub.title}</h4>
        <ul class="space-y-2 text-xs text-gray-600 pl-2 border-l border-gray-200">`;
      sub.items.split(',').forEach(item => {
        const i = item.trim();
        if (!i) return;
        const badge = (window.TEAM_BADGES || {})[i.toLowerCase()];
        const badgeImg = badge ? `<img src="${badge}" alt="${i}" class="w-4 h-4 object-contain rounded-full mr-1 inline-block">` : '';
        mobileHtml += `<li><a href="categoria.html?v=${encodeURIComponent(i)}" class="flex items-center py-1 hover:text-[#D6AF68]">${badgeImg}${i}</a></li>`;
      });
      mobileHtml += `</ul></div>`;
    });
    mobileHtml += `</div></div>`;
  });

  if (desktopNav) desktopNav.innerHTML = desktopHtml;
  if (mobileNav) mobileNav.innerHTML = mobileHtml;

  // JS-controlled hover for dropdown nav (prevents gap-closing bug)
  desktopNav && desktopNav.querySelectorAll('.nav-mega-item').forEach(item => {
    const dropdown = item.querySelector('.nav-mega-dropdown');
    let closeTimer = null;
    const open = () => { clearTimeout(closeTimer); dropdown.style.display = 'block'; };
    const close = () => { closeTimer = setTimeout(() => { dropdown.style.display = 'none'; }, 150); };
    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', close);
    dropdown.addEventListener('mouseenter', open);
    dropdown.addEventListener('mouseleave', close);
  });

  // Fill Footer Categories
  const footerCatsContainer = document.getElementById('footer-cats-container');
  if (footerCatsContainer) {
    try {
      let fHtml = '';
      (megaFooterData || []).filter(c => c && c.active).slice(0, 4).forEach(cat => {
        fHtml += `<div><h4 class="font-bold text-gray-900 uppercase tracking-wider mb-4 text-[11px]">${cat.name || ''}</h4><ul class="space-y-3">`;
        const teams = [];
        if (cat.subs && Array.isArray(cat.subs)) {
          cat.subs.forEach(s => {
            if (s && s.items && typeof s.items === 'string') {
              s.items.split(',').forEach(i => { if (i.trim()) teams.push(i.trim()); });
            }
          });
        }
        teams.sort().slice(0, 5).forEach(t => {
          fHtml += `<li><a href="categoria.html?v=${encodeURIComponent(t)}" class="text-[13px] text-gray-500 hover:text-[#D6AF68] transition-colors">${t}</a></li>`;
        });
        if (teams.length > 5) {
          fHtml += `<li class="pt-1"><a href="categoria.html?v=${encodeURIComponent(cat.name)}" class="text-[#D6AF68] font-bold text-[11px] uppercase tracking-wider">Ver mais +</a></li>`;
        }
        fHtml += `</ul></div>`;
      });
      footerCatsContainer.innerHTML = fHtml;
    } catch (err) {
      console.error("Footer render error:", err);
    }
  }

  // Render Team Logos
  const teamLogosContainer = document.getElementById('team-logos-container');
  if (teamLogosContainer) {
    const TEAM_LOGOS = [
      { name: 'Flamengo', src: 'assets/img/escudos/br/Flamengo_f.webp', color: '#c52728' },
      { name: 'Palmeiras', src: 'assets/img/escudos/br/palmeiras_f.webp', color: '#006437' },
      { name: 'Corinthians', src: 'assets/img/escudos/br/Corinthians_f.webp', color: '#000000' },
      { name: 'São Paulo', src: 'assets/img/escudos/br/Sao-Paulo_f.webp', color: '#ff0000' },
      { name: 'Santos', src: 'assets/img/escudos/br/Santos.svg', color: '#000000' },
      { name: 'Vasco', src: 'assets/img/escudos/br/Vasco_f.webp', color: '#000000' },
      { name: 'Fluminense', src: 'assets/img/escudos/br/Fluminense_f.webp', color: '#9f2241' },
      { name: 'Botafogo', src: 'assets/img/escudos/br/Botafogo_f.webp', color: '#000000' },
      { name: 'Grêmio', src: 'assets/img/escudos/br/Gremio.webp', color: '#0d80bf' },
      { name: 'Internacional', src: 'assets/img/escudos/br/Internacional_f.webp', color: '#e30613' },
      { name: 'Cruzeiro', src: 'assets/img/escudos/br/Cruzeiro_f.webp', color: '#003a94' },
      { name: 'Atlético Mineiro', src: 'assets/img/escudos/br/Atletico-Mineiro_f.webp', color: '#000000' },
      { name: 'Bahia', src: 'assets/img/escudos/br/Bahia_f.webp', color: '#003a94' },
      { name: 'Fortaleza', src: 'assets/img/escudos/br/Fortaleza_f.webp', color: '#003a94' },
      { name: 'Real Madrid', src: 'assets/img/escudos/int/Real-Madrid_SF4x.webp', color: '#f4c430' },
      { name: 'Arsenal', src: 'assets/img/escudos/int/Arsenal_SF4x.webp', color: '#ef0107' },
      { name: 'Chelsea', src: 'assets/img/escudos/int/Chelsea_SF4x.webp', color: '#034694' },
      { name: 'Liverpool', src: 'assets/img/escudos/int/Liverpool_SF4x.webp', color: '#c8102E' },
      { name: 'Manchester City', src: 'assets/img/escudos/int/M-City_SF4x.webp', color: '#6cabdd' },
      { name: 'Manchester United', src: 'assets/img/escudos/int/M-United_SF4x.webp', color: '#da291c' },
      { name: 'Tottenham', src: 'assets/img/escudos/int/Tottenhan_SF4x.webp', color: '#132257' },
      { name: 'Bayern de Munique', src: 'assets/img/escudos/int/Bayern_SF4x.webp', color: '#dc052d' },
      { name: 'Borussia Dortmund', src: 'assets/img/escudos/int/Borussia_SF4x.webp', color: '#fde100' },
      { name: 'Juventus', src: 'assets/img/escudos/int/Juventus_SF4x.webp', color: '#000000' },
      { name: 'Milan', src: 'assets/img/escudos/int/Milan_SF4x.webp', color: '#fb090b' },
      { name: 'PSG', src: 'assets/img/escudos/int/Psg_SF4x.webp', color: '#004170' }
    ];

    const allProds = [];
    Object.values(PRODUCTS).forEach(arr => allProds.push(...arr));

    const teamsWithProducts = TEAM_LOGOS.filter(t => {
      return allProds.some(p => {
        const pName = (p.name || '').toLowerCase();
        const pSub = (p.subcategory || '').toLowerCase();
        const tName = t.name.toLowerCase();
        const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, ' ');
        return norm(pSub) === norm(tName) || norm(pName).includes(norm(tName));
      });
    });

    if (teamsWithProducts.length > 0) {
      let html = '';
      teamsWithProducts.forEach(t => {
        html += `
          <div class="swiper-slide">
            <a href="categoria.html?v=${encodeURIComponent(t.name)}" class="flex flex-col items-center justify-center gap-3 group outline-none w-full">
              <div class="w-16 h-16 md:w-24 md:h-24 rounded-full border border-gray-200 p-2 shadow-sm bg-white overflow-hidden group-hover:border-[${t.color}] group-hover:shadow-[0_4px_15px_${t.color}66] transition-all duration-300">
                <img src="${t.src}" alt="${t.name}" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300">
              </div>
              <span class="text-[10px] md:text-[13px] font-bold text-gray-700 group-hover:text-[${t.color}] uppercase tracking-tight text-center w-full truncate px-1 transition-colors">${t.name}</span>
            </a>
          </div>
        `;
      });
      teamLogosContainer.innerHTML = html;
      
      const section = document.getElementById('team-logos-section');
      if (section) section.style.display = 'block';

      // Initialize Swiper after HTML injection
      if (window.Swiper) {
        new Swiper('.teamSwiper', {
          slidesPerView: 3,
          spaceBetween: 10,
          navigation: {
            nextEl: '.team-next',
            prevEl: '.team-prev',
          },
          breakpoints: {
            640: {
              slidesPerView: 4,
              spaceBetween: 16
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 24
            }
          }
        });
      }
    } else {
      const section = document.getElementById('team-logos-section');
      if (section) section.style.display = 'none';
    }
  }

  // Render Dynamic Catalog
  renderCatalog();
});

function cardHTML(p) {
  const tagClasses = { t: 'tag-t', j: 'tag-j', r: 'tag-r', f: 'tag-f', k: 'tag-k', g: 'tag-g', tr: 'tag-tr', se: 'tag-se' };
  const tagClass = tagClasses[p.tag] || 'tag-t';
  const priceInfo = p.priceInfo || { hasPrice: false, baseStr: "Consultar" };

  let priceHtml = '';
  if (priceInfo.hasPrice) {
    priceHtml = `
      <div class="mb-1">
        <span class="text-[11px] text-gray-500 line-through whitespace-nowrap">${priceInfo.oldStr}</span>
      </div>
      <div class="text-xl font-extrabold text-black tracking-tight whitespace-nowrap mb-1">${priceInfo.baseStr}</div>

      <div class="text-xs font-bold text-[#10b981] mb-2 flex items-center justify-center gap-1 whitespace-nowrap">
        ${priceInfo.pixStr} com Pix
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2z"/></svg>
      </div>

      <div class="text-[11px] text-gray-800 font-semibold whitespace-nowrap">
        ${priceInfo.instStr}
      </div>
    `;
  } else {
    priceHtml = `
      <div class="mt-3 mb-1">
        <span class="text-xl font-extrabold text-black tracking-tight">Consultar Preço</span>
      </div>
      <div class="text-[11px] text-[#10b981] font-bold mt-2">Ver via WhatsApp</div>
    `;
  }

  return `<div class="jersey-card" onclick="window.location.href='produto.html?id=${p.id}'">
    <div style="position:relative;overflow:hidden;">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
    </div>
    <div class="px-3 py-4 text-center bg-white flex flex-col items-center border-t border-gray-100">
      <p class="text-[13px] text-gray-800 leading-snug mb-3 font-medium line-clamp-2 text-center w-full min-h-[40px]">
        ${p.name}
      </p>
      ${priceHtml}
    </div>
  </div>`;
}

function fillTrack(id, items) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = items.map(cardHTML).join("");
}

window.getVariedItems = function (items, limit) {
  const groups = {};
  const priorities = ['palmeiras', 'flamengo', 'corinthians', 'sao paulo', 'são paulo', 'vasco', 'gremio', 'grêmio', 'cruzeiro', 'atletico', 'atlético', 'botafogo', 'fluminense', 'internacional', 'bahia', 'real madrid', 'barcelona', 'arsenal', 'manchester city', 'manchester united', 'liverpool', 'bayern', 'psg', 'chelsea', 'tottenham', 'juventus', 'milan', 'inter'];

  items.forEach(p => {
    let t = 'outros_' + Math.random().toString(36).substr(2, 5); // Fallback para manter os outros únicos e aleatórios
    const lowerName = (p.name + " " + p.fullName).toLowerCase();

    for (const team of priorities) {
      if (lowerName.includes(team)) {
        // Normalizar nomes semelhantes
        t = (team === 'são paulo' || team === 'sao paulo') ? 'sao paulo' :
          (team === 'grêmio' || team === 'gremio') ? 'gremio' :
            (team === 'atlético' || team === 'atletico') ? 'atletico' : team;
        break;
      }
    }

    if (!groups[t]) groups[t] = [];
    groups[t].push(p);
  });

  // Sort os times pela prioridade definida
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    let ia = priorities.indexOf(a);
    let ib = priorities.indexOf(b);
    if (ia === -1) ia = 999;
    if (ib === -1) ib = 999;
    return ia - ib;
  });

  const result = [];
  let round = 0;
  while (result.length < limit && result.length < items.length) {
    let addedInRound = false;
    for (const k of sortedKeys) {
      if (groups[k][round]) {
        result.push(groups[k][round]);
        addedInRound = true;
        if (result.length >= limit) break;
      }
    }
    if (!addedInRound) break;
    round++;
  }
  return result;
}

function renderCatalog() {
  const dynamicCatalog = document.getElementById('dynamic-catalog');
  if (!dynamicCatalog) return;

  let catalogHtml = '';
  // Determine vitrines from loaded products
  const productKeys = Object.keys(PRODUCTS);
  let vitrinesData;
  if (productKeys.some(k => ['brasileirao', 'laliga', 'premier'].includes(k))) {
    vitrinesData = ['Brasileirão', 'La Liga', 'Premier League'];
  } else {
    vitrinesData = JSON.parse(localStorage.getItem('seumanto_vitrines')) || ['Lançamentos', 'Mais Vendidos', 'Destaques'];
  }

  // Flatten all products
  const allProducts = [];
  Object.values(PRODUCTS).forEach(catArray => {
    catArray.forEach(p => {
      if (!p.vitrines) p.vitrines = ['Lançamentos'];
      allProducts.push(p);
    });
  });

  let sectionsRendered = 0;

  vitrinesData.forEach((vitrineName, index) => {
    const items = allProducts.filter(p => p.vitrines.includes(vitrineName));
    if (items.length > 0) {
      const safeId = 'vitrine-' + index;
      catalogHtml += `
      <section id="${safeId}" class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-6 mb-6 flex items-end justify-between">
          <div>
            <h2 class="sec-label">${vitrineName.toUpperCase()}</h2>
            <div class="gold-line mb-0"></div>
          </div>
          <a href="categoria.html?v=${encodeURIComponent(vitrineName)}" class="text-[10px] sm:text-xs font-bold text-gray-500 hover:text-[#D6AF68] uppercase tracking-wider flex items-center gap-1 mb-2">Ver mais <span class="text-[8px] sm:text-[10px]">&#10095;</span></a>
        </div>
        <div class="relative max-w-7xl mx-auto px-2 md:px-6 group">
          <button onclick="document.getElementById('track-${safeId}').scrollBy({left: -320, behavior: 'smooth'})" class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg w-12 h-12 rounded-full flex items-center justify-center text-gray-800 hover:bg-[#D6AF68] hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden md:flex border border-gray-100 text-xl">&#10094;</button>
          
          <div class="carousel-track gap-4 px-4 pb-6 pt-2" id="track-${safeId}"></div>
          
          <button onclick="document.getElementById('track-${safeId}').scrollBy({left: 320, behavior: 'smooth'})" class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg w-12 h-12 rounded-full flex items-center justify-center text-gray-800 hover:bg-[#D6AF68] hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden md:flex border border-gray-100 text-xl">&#10095;</button>
        </div>
      </section>
      `;

      if (sectionsRendered === 0) {
        catalogHtml += `
        <section class="py-10 max-w-7xl mx-auto px-6 border-y border-gray-100 my-8">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            <div class="flex items-center gap-2 md:gap-4">
              <div class="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              <div>
                <h4 class="font-bold text-xs md:text-sm text-gray-900">Frete Gr&aacute;tis</h4>
                <p class="text-[10px] md:text-[11px] text-gray-500">para todo Brasil</p>
              </div>
            </div>
            <div class="flex items-center gap-2 md:gap-4">
              <div class="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              </div>
              <div>
                <h4 class="font-bold text-xs md:text-sm text-gray-900">Cart&atilde;o de Cr&eacute;dito</h4>
                <p class="text-[10px] md:text-[11px] text-gray-500">em at&eacute; 12x no cart&atilde;o</p>
              </div>
            </div>
            <div class="flex items-center gap-2 md:gap-4">
              <div class="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              </div>
              <div>
                <h4 class="font-bold text-xs md:text-sm text-gray-900">Site Seguro</h4>
                <p class="text-[10px] md:text-[11px] text-gray-500 leading-tight">Certificados de seguran&ccedil;a e pol&iacute;tica de privacidade</p>
              </div>
            </div>
            <div class="flex items-center gap-2 md:gap-4">
              <div class="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </div>
              <div>
                <h4 class="font-bold text-xs md:text-sm text-gray-900">D&uacute;vidas?</h4>
                <p class="text-[10px] md:text-[11px] text-gray-500">Me chama no WPP</p>
              </div>
            </div>
          </div>
        </section>
        `;
      }

      if (sectionsRendered === 1) {
        catalogHtml += `
        <section class="w-full py-8 max-w-7xl mx-auto px-4 lg:px-6">
          <img src="${BANNERS.grids_desktop}" class="hidden lg:block w-full h-auto rounded-xl object-cover">
          <img src="${BANNERS.grids_mobile}" alt="Banner Promo" class="block lg:hidden w-full h-auto rounded-xl object-cover">
        </section>
        `;
      }

      sectionsRendered++;
    }
  });

  dynamicCatalog.innerHTML = catalogHtml;

  vitrinesData.forEach((vitrineName, index) => {
    let items = allProducts.filter(p => p.vitrines.includes(vitrineName) && p.type === 'Camisa');
    if (items.length > 0) {
      items = window.getVariedItems(items, 8); // Otimização: max 8 produtos, apenas camisas, super variados
      fillTrack("track-vitrine-" + index, items);
    }
  });
}

function openMenu() {
  const d = document.getElementById("drawer"), o = document.getElementById("overlay");
  d.classList.add("drawer-open"); o.classList.remove("hidden");
  requestAnimationFrame(() => o.style.opacity = "1");
  document.body.style.overflow = "hidden";
}
function closeMenu() {
  const d = document.getElementById("drawer"), o = document.getElementById("overlay");
  d.classList.remove("drawer-open"); o.style.opacity = "0";
  setTimeout(() => o.classList.add("hidden"), 300);
  document.body.style.overflow = "";
}

function performSearch() {
  const inp = document.getElementById('global-search');
  const val = inp ? inp.value.trim() : '';
  if (val) {
    window.location.href = 'categoria.html?v=' + encodeURIComponent(val);
  }
}

// Bind enter key to search
document.addEventListener("DOMContentLoaded", () => {
  const inp = document.getElementById('global-search');
  if (inp) {
    inp.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }
});
