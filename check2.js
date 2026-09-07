        </div>
  
        <div id="footer-cats-container" class="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
          <!-- Populated by JS -->
        </div>
      </div>
  
      <div
        class="max-w-7xl mx-auto border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between 
text-xs text-gray-400">
        <p>&copy; 2025 Seu Manto &bull; Todos os direitos reservados.</p>
        <p class="mt-2 md:mt-0">Tecnologia desenvolvida com <span class="text-red-500">&hearts;</span></p>
      </div>
    </footer>
  
>   <script>
      const WA = "551      99999999"; 
           o nst  DEFAULT_PR ODUCTS = {
         n acionais : [
            { id:  "n1", name : "F lamengo", season: "25/26", tag: " t", ta gLabel: "Torcedor",  img: "asse ts/        
j ers ey_flamengo .png", price:  "R$ 189 ", categ ory:  "na cionais"  },
           { id : "n2", name: "Corinthians", season:  "25/2 6", tag: "t", tagLa bel: "Torce dor        m g:  
"assets/img /jersey_cor inthian s.png",  pric e: " R$ 199",  category:  "nac ionais" },
          { id: "n3", na me: "F lamengo", season: " 25/26", tag : "        t agL abel: "Joga dor", img: "as sets/im 
g/jersey _fla meng o.png", p rice: "R$  289" , category: "nacionais" },
          {  id: " n4", name: "Corinth ians", seas on      "25      6", tag:  "j        a gLa bel: "Jogad or", img: 
"ass ets/img /jersey_ cori nthi ans.png",  price: "R$  299 ", category: "nacionais" }
        ],
          europeus: [
           { id: "e1 ",         :  "R eal Madrid" , season: "2 4/25",  tag: "t" , ta gLab el: "Torc edor", img : "a 
ssets/img/jersey_real_madrid.png",  price : "R$ 219", categor y: "europe us"                  { id: " e2", n ame: "B 
arcelona ", s easo n: "24/25 ", tag: "j" , ta gLabel: "Jogador", img: "ass ets/im g/jersey_barcelona. png", pric e:    
     3 19" , category:  "europeus" },
           {  id: "e3" , na me:  "PSG", se ason: "24/ 25",  tag: "t", tagLabel: "Torcedor", img: "a ssets/ 
img/jersey_psg.png" , price: " R$      09"      catego ry        u rop eus" },
           { id: "e4", nam e: "Man chester  Cit y",  season: " 24/25", tag:  "j",  tagLabel: "Jogador", img: 
"assets/im g/jers ey_manchester_city. png", p ric        R $ 3 09", catego ry: "europeus" }
         ],
         retr o: [ 
           { id : "r1", name:  "Br asil Retr\u00f4", season: "1970", ta g: "r" , tagLabel: "Retr\u 00f4",  img        
s set s/img/jerse y_retro_brasil.png",  price:  "R$ 22 9",  cate gory: "re tro" },
           {  id: "r2", name: "AC Milan Retr\u00f4 ", sea son: "1994", tag: " r", tag Lab        " Ret r\u00f4", i mg: 
"assets/img/jersey _retro_ milan.p ng",  pri ce: "R$ 2 49", category : "r etro" },
          { id: "r3", name: " Brasil  Retr\u00f4", seaso n: "197 0"      ta    g: "    r", tagLabel: "Retr\u00f4", 
img: "assets/img/jersey_retro_brasil.png",     price: "R$ 229",      ategory: "retro" },
          {      d: "r4", name: "AC Milan Retr\u00f4", season: "1994", tag: "r", tagLa    bel    : "Retr\u00f4", img: 
"asse      /img/jersey_retro_milan.png", price: "R$ 249", category: "retro" }
        ]
      };
  
      let PRO      CTS = JSON.parse(localStorage.getItem('seuman      _products'));
      if (!PRODUCTS) {
        PRODUCTS = DEFAULT_PRODUCTS;
            localStorage.setItem('seumanto_products', JSON.stringify(PRODUCTS));
      }
           const DEFAULT_BANNERS = {
        home_desktop: "https://placehold.co/192      600/111/D6AF68?text=Banner+Home+Desktop+(1920x600)",
        home_mobile: "assets/i      /banner_brasil.png",
        cat_nac_d: "https://placehold.co/400x600/111/3      F14?text=BRASILEIRAO",
        cat_nac_m: "https://placehold.co/600x800/111/39FF14      ext=BRASILEIRAO+Mobile",
        cat_int_d: "https://placehold.co/400x600/111/39FF14?text=INTERNACIONAIS"            cat_int_m: 
"https://placehold.co/600x800/111/39FF14?text=INTERNACIONAIS+Mobile",
        cat_r    et_d    : "https://placehold.co/400x60      11        FF14?text=CAMISAS+RETRO",
        cat_ret_m: "https://pl        old.co/6          /111/39FF14?text=CAMISAS+RETRO+Mobile",
        grids_desktop: "https://placehold.c          x250/D6AF68/111?text=Banner+Entre+Grades+Desktop+(1440x250)",
        grids_mob          https://placehold.co/768x300/D6AF68/111?text=Banner+Entre+Grades+Mobile+(768x300)"
      }           const DEFAULT_MEGA_FOOTER = [
        {
          id: "brasileiros", name: "Brasileiros", active          ,
          subs: [
            { title: "Minas Gerais", items: "Atlético Mineiro, Cruzeiro, América Mineiro" },
                {       tle      "R        e Janeiro", items: "Flamengo, Vasco, Fluminense, Botafogo" }                
          e: "São Paulo", items: "São Paulo, Palmeiras, Santos, Corinthians, Bragantino" },
            { title: "Sul", items: "Inte          nal, Grêmio, Athletico Paranaense, Coritiba, Juventude" },
            { title: "No          /Norte", items: "Bahia, Vitória, Fortaleza, Ceará, Sport, Náutico, Santa Cruz, 
Remo,          ndu" }
          ]
        },
        {
          id: "internacionais", name: "Internacionais", active: true,
          subs: [
                    {      it        "Premier League (ING)", items: "Arsenal, Chelsea        verpool,          ester 
City, Manchester United, Tottenham" },
            { title: "La Liga (ESP)", items: "Barcelona, Real Madrid          tico de Madrid" },
            { title: "Serie A (ITA)", items: "Juventus, Milan, Inter de Milão, Napoli, Roma" },
                { title: "Outras Ligas", items: "PSG, Bayern de Munique, Borussia Dortmund, Bayer Leverkusen, Ajax, 
Porto, Benfica"                   ]                ,
        {
          id: "selecoes", name: "Seleções", acti        true,
              subs: [
            { title: "América", items: "Brasil, Argentina, Uruguai, Colômbia, Equador, Chile, Peru, Bol�via, Venezu  
        ,
            { title: "Europa", items: "Alemanha, Itália, França, Espanha, Inglaterra, Portugal, Holanda, Croácia, 
Bélgic                    { title: "África & Ásia", items: "Senegal, Marrocos, Nigéria, Egito, Camarões, Japão, 
Coreia do Sul, Arábia Sa        a"      
                          },
        {
          id: "libertadores", name: "L        tadores"          ve: true,
          subs: [
            { title: "Times Brasileiros", items: "Fluminense, S          lo, Grêmio, Atlético Mineiro, Palmeiras, 
Flamengo, Botafogo" },
            { t        :       im    es A    rgentinos", items: "River Plate, Estudiantes, San Lorenzo, Rosario C    
entral, Talleres      Boca Juniors" },
                  title: "Outros Pa�ses", items: "Peñarol, Nacional, Colo-Colo, LDU,     Independi ente del Valle, 
Bol�var      Cerro Porteño" }
          ]
            },
        {
          id: "outros", name: "Outros Esportes", active: true,
          subs: [
            { title: "NBA", items: "Lakers, Celtics, Warriors, Bulls, Heat, Mavericks, Nu      ets" },
            { title: "NFL", items: "Chiefs, Patriots, 49ers,     Eag    les, Packers, Cowboys" }
          ]
        }
      ];
  
           et BANNERS = JSON.parse(localStorage.getItem('seumanto_banners'));
      if (      ANNERS) {
        BANNERS = DEFAULT_BANNERS;
        localStorage.setItem('sea      o_banners', JSON.stringify(BANNERS));
      } else if (!BANNERS.cat_nac      ) {
        // Migration for old schema
        BANNERS = { ...DEFAULT_BA      ERS, home_desktop: BANNERS.home_desktop, home_mobile: BANNERS.home_mo      le, 
grids_desktop: BANNERS.grids_desktop, grids_mobile: BANNERS.grids      obile };
        localStorage.setItem('seumanto_banners', JSON.stringif      BANNERS));
      }
  
      document.addEventListener("DOMContentLoaded", ()      > {
        document.getElementById('banner-home-desktop').src = BANNERS.home_d      ktop;
        document.getElementById('banner-home-mobile').src = BANNERS.homm      ile;
  
        document      etElementById('banner-cat-nac-d').src = BANNERS.cat_nac_d;
        document.getE      mentById('banner-cat-na        ).src = BANNERS.cat_nac_m;
        docum        getElementById('banner-cat-int-d').src = BANNERS.cat_int_d;
        document.ge      len      yId('banner-cat-int-m').src = BANNERS.cat_int_m;
        docu      nt.getElementById('banner-cat-ret-d').src = BANNERS.cat_r      _d;
        document.get      ementById('banner-cate      m').src = BANNERS.cat_ret_m;
  
        document.getElemen        d('banner-grids-        top').src = BANNERS.grids_desktop;
        document.getElementById('banner-grids-mobile').src = BANNERS.grids_mobile;
  
        // Render Mega Menu
        let megaFooterData = JSON.parse(localStorage.getItem('seumanto_megafooter'));
        if (!megaFooterData) {
          megaFooterData = DEFAULT_MEGA_FOOTER;
          localStorage.setItem('seumanto_megafooter', JSON.stringify(megaFooterData));
        }
  
        const desktopNav = document.getElementById('desktop-nav');
        const mobileNav = document.getElementById('mobile-nav');
                desktopHtml = '';
        le          leHtml = '';
  
        megaFooterData.filter(c => c.active).forEach(cat => {
          // Desktop HTML
          desktopHtml += `
        <div class="group h-full flex items-center px-4 c          pointer hover:bg-gray-50 transition-col             
     <span class="nav-            rm al-cas              -normal">${cat.name} <span class="text-[10px] 
ml-1">&#9662;</span></span>
          <div   clas              e left-0 top-full w-full hidden group-hover:block z-50 pt-4 -mt-4">
            <div class="bg-[#111] text-white shadow-2xl border-t border-[#333]"                        iv c          
max-w-7xl mx-auto p-8 grid gri        ls-2        grid-cols-4 lg:grid-cols-5 gap-8">
      `;
              cat.subs.forE        sub => {
            desktopHtml += `<div>
          <h4 class="font-bold text-sm mb-4 text-[#D6AF68] uppercase tracking-wider">${sub.title}</h4>
          <ul class="space-y-3 text-sm text-gray-400">`;
            sub.items.split(',').forEach(item => {
              const i = item.trim();
              if (i) {
                const msg = encodeURIComponent("Ol\u00e1! Gostaria de saber mais sobre as camisas do " + i);
                desktopHtml += `<li><a         ="https://wa.me/5511999999          xt=${msg}" target="_blank" 
class="hover:text-white transition-colors">${i}</a></li>`;
              }
            });
            desktopHtml += `</ul></div>`;
          });
          desktopHtml += `</          div></div></div>`;
  
          // Mobile H                mobileHtml += `
                 cl ass="b              rder-gray-100 last:border-0">
          <button onclick="document.getElementById('mob-su b -${c              lassList.toggle('hidden')" 
class="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50 text-left">
            ${cat.name} <span            te          text          400">&#9662;</span>
          <        ton>             <div id="mob-sub-${cat.id       cla=      idden px-4 pb-4 bg-gray-50 space-y-4     
 t-2">
      `;
          cat.subs.forEa      (sub => {
            mobile      ml += `<div>
          <h4 class="font-bold text-xs text-[#D6AF68] uppercase mb-      >${sub.title}</h4>
                  class="space-y-2        t-xs text-gray-600 pl-2 border-l border-gray-200">`;
            sub          .split(',').forEach(item => {
              const i = item.trim();
              if (i) {
                const msg = encodeURIComponent("Ol          ! Gostaria de sabe           sobre as camisas do " + i);
                mobileHtml += `<l i><a href="https://wa.me/5511999999999?te          sg}" target="_blank" class="block 
py-1 h            t-[#D6AF68]">${i}</a></li>`;
              }
            });
            mobileHtml += `</ul></div>`;
          });
                   eHtm          </div></div>`;
        });            desktopNav.innerHTML = desktopHtml;
        mobileNav.innerHTML = mobileHtml;
  
        // Fill Footer Categories
        const footerCats          ne          cument.getElementById('f        r-ca        ontainer');
        if (footerCatsContain      )     {
              let fHtml = ''; 
              megaFooterData.fi lte r(c   => c.ac t ive). sli ce( 0 , 4).fo r Each(cat                  fHtml += 
`<div><h4 class="font-bold text-gray-900 uppercase trackin      wider mb-4 text-[11px]">${cat.name}</h4u      
class="space-y-3">`;
            const teams = [];
            cat.subs.forE      h(s => { s.items.split(',').forEach(i => { if (i.trim()) teams.push(i.tri      )); }); 
});
            teams.sort().slice(0, 5).forEach(t => {
                   Html += `<li><a href="#" class="text-[13px] text-gray-500 hover:text-[#D6AF68] 
transition-colors">${t}</a></li>`;
            });
            if (teams.length > 5) {
              fHtml += `<li class="pt-1"><a href="#" class="text-[#D6AF68] font-bold text-[11px] uppercase 
tracking-wider">Ver mais +</a></li>`;
            }
            fHtml += `</ul></div>`;
          });
          footerCatsContainer.innerHTML = fHtml;
        }
      });
  
      function cardHTML(p) {
        const tagClass = p.tag === "t" ? "tag-t" : p.tag === "j" ? "tag-j" : "tag-r";
  
        let numPrice = parseFloat(p.price.replace(/[^\d,]/g, '').replace(',', '.'));
        if (isNaN(numPrice)) numPrice = 199.9;
  
        const oldPrice = "R$ " + (numPrice + 100).toFixed(2).replace('.', ',');
        const pixPrice = "R$ " + (numPrice * 0.98).toFixed(2).replace('.', ',');
        const instPrice = "R$ " + (numPrice / 12).toFixed(2).replace('.', ',');
  
        return `<div class="jersey-card" onclick="window.location.href='produto.html?id=${p.id}'">
      <div style="position:relative;overflow:hidden;">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="tag ${tagClass}" style="position:absolute;top:10px;left:10px;">${p.tagLabel}</span>
      </div>
      <div class="px-3 py-    5 t    ext-center bg-white flex flex -c       items-center border-t border-gray-100">    
       <p class="text-[13px] text-gray-800 lead    ing    nug mb-4 font-medium h-[40px] flex items-cent     
justify-center">
          Camisa ${p.name} ${p.season}<br>${p.tagLa    l}
        </p>
        
          <div class="flex item      nter justify-center gap-2 mb-1">
          <span class="text-[11px] text-gray-500 line-through">${oldPrice}</span>
          <span clat      xl font-extrabold text-b       tracking-tight">${p.pri      /span>
        </div>
        
        <div class="t         font-bold text-[#10b981          le x items-center justify-center gap-1">
          ${pixPrice} com Pix
          <svg          10" height="10" viewB        0 24       fill      rrentColor"><path d="M12 2L      l10 10 
10-10L12 2z"/></svg>
        </div>
                 <div class="text-[11px] text-gray-800 font-semibold">
          12 x de ${        ice}
        </div>
      </          /div>`;
      }
  
      function fillTra          tems) {
        const el = document.getElementById(id);
        el.innerHTML = items.map(cardHTML).join("");
      }
  
      // Render Dynamic Catalog (Vitrines da Home)
      const dynamicCatalog = document.getElementById('dynamic-catalog');
      if (dynamicCatalog) {
        let catalogHtml = '';
        const vitrinesData = JSON.parse(localStorage.getItem('seumanto_vitrines')) || ['Lan\u00e7amentos', 'Mais 
Vendidos', 'Destaques'];
  
        // Flatten all products
        const allProducts = [];
        Object.values(PRODUCTS).forEach(catArray => {
          catArray.forEach(p => {
            if (!p.vitrines) p.vitrines = ['Lan\u00e7amentos']; // Fallback for old products
            allProducts.push(p);
          });
        });
  
        let sectionsRendered = 0;
  
        vitrinesData.forEach((vitrineName, index) => {
          const items = allProducts.filter(p => p.vitrines.includes(vitrineName));
          if (items.length > 0) {
            const safeId = 'vitrine-' + index;
            catalogHtml += `
            <section id="${safeId}" class="py-12 ${sectionsRendered % 2 !== 0 ? 'bg-gray-50' : ''}">
              <div class="max-w-7xl mx-auto px-6 mb-6 flex items-end justify-between">
                <div>
                  <h2 class="sec-label">${vitrineName.toUpperCase()}</h2>
                  <div class="gold-line mb-0"></div>
                </div>
                <a href="https://wa.me/5511999999999?text=${encodeURIComponent('Ol\u00e1! Quero ver mais camisas da 
se\u00e7\u00e3o ' + vitrineName)}" target="_blank" class="text-[10px] sm:text-xs font-bold text-gray-500 
hover:text-[#D6AF68] uppercase tracking-wider flex items-center gap-1 mb-2">Ver mais <span class="text-[8px] 
sm:text-[10px]">&#10095;</span></a>
              </div>
              <div class="relative max-w-7xl mx-auto px-2 md:px-6 group">
                <button onclick="document          entById('track-${safeId}').scr            t: -320, behavior: 
'smooth'})" class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg w-12 h-12 rounded-full flex 
items-center justify-center text-gray-800 hover:bg-[#D6AF68] hover:text-white transition-colors opacity-0 
group-hover:opacity-100 hidden md:flex border border-gray-100 text-xl">&#10094;</button>
                
                <div class="carousel-track gap-4 px-4 pb-6 pt-2" id="track-${safeId}"></div>
                
                <button onclick="document.getElementById('track-${safeId}').scrollBy({left: 320, behavior: 'smooth'})" 
class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg w-12 h-12 rounded-full flex items-center 
justify-center text-gray-800 hover:bg-[#D6AF68] hover:text-white transition-colors opacity-0 group-hover:opacity-100 
hidden md:flex border border-gray-100 text-xl">&#10095;</button>
              </div>
            </section>
          `;
  
            if (sectionsRendered === 0) {
              catalogHtml += `
              <section class="py-10 max-w-7xl mx-auto px-6 border-y border-gray-100 my-8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center 
flex-shrink-0 text-black">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" 
height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" 
r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                    </div>
                    <div>
                      <h4 class="font-bold text-sm text-gray-900">Frete Gr&aacute;tis</h4>
                      <p class="text-[11px] text-gray-500">para todo Brasil</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center 
flex-shrink-0 text-black">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" 
rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                    </div>
                    <div>
                      <h4 class="font-bold text-sm text-gray-900">Cart&atilde;o de Cr&eacute;dito</h4>
                      <p class="text-[11px] text-gray-500">em at&eacute; 12x no cart&atilde;o</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center 
flex-shrink-0 text-black">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
