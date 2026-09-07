}, fontFamily: { sport: ["Bebas Neue", "sans-serif"], body: ["Inter", "sans-serif"] } } } }
    </script>
    <link
      href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap"
      rel="stylesheet">
    <style>
      * {
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent
      }
  
      body {
        font-family: "Inter", sans-serif;
        background: #fff;
        color: #111
      }
  
      .logo-ph {
        width: 48px;
        height: 48px;
        border: 2px dashed #D6AF68;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px;
        color: #D6AF68;
        text-align: center;
        line-height: 1.3;
        letter-spacing: .3px;
        flex-shrink: 0
      }
  
      /* CAROUSEL TRACK */
      .carousel-track {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
      }
  
      /* CARD */
      .jersey-card {
        width: 240px;
        flex-shrink: 0;
        scroll-snap-align: start;
        background: #f9f9f9;
        border: 1px solid #ececec;
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        transition: transform .3s, box-shadow .3s
      }
  
      @media(min-width: 768px) {
        .jersey-card {
          width: calc((100% - 48px)/4);
        }
      }
  
      .jersey-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 16px 40px rgba(201, 168, 76, .18)
      }
  
      .jersey-card img {
        width: 100%;
        height: 220px;
        object-fit: cover;
        object-position: center;
        display: block;
        background: #f0f0f0;
        transition: transform .4s
      }
  
      .jersey-card:hover img {
        transform: scale(1.06)
      }
  
      /* TAG */
      .tag {
        display: inline-block;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 20px;
        letter-spacing: .5px;
        text-transform: uppercase
      }
  
      .tag-t {
        background: #e6f4e6;
        color: #2a7a2a
      }
  
      .tag-j {
        background: #fff3e0;
        color: #a05a00
      }
  
      .tag-r {
        background: #ede7f6;
        color: #4a2080
      }
  
      /* DRAWER */
      .drawer {
        transition: transform .35s cubic-bezier(.4, 0, .2, 1)
      }
  
      .drawer-open {
        transform: translateX(0) !important
      }
  
      /* SECTION LABEL */
      .sec-label {
        font-family: "Bebas Neue", sans-serif;
        font-size: clamp(1.6rem, 5vw, 2.8rem);
        letter-spacing: .12em;
        color: #111
      }
  
      /* GOLD LINE */
      .gold-line {
        width: 40px;
        height: 3px;
        background: #D6AF68;
        border-radius: 2px;
        margin: 6px 0 20px
      }
  
      /* HERO */
      .hero-bg {
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1000 100%)
      }
  
      /* CTA */
      .btn-wpp {
        background: #D6AF68;
        color: #fff;
        font-weight: 700;
        border-radius: 12px;
        transition: background .25s, box-shadow .25s
      }
  
      .btn-wpp:hover {
        background: #A07830;
        box-shadow: 0 8px 24px rgba(201, 168, 76, .35)
      }
  
      /* NAV LINK */
      .nav-link {
        font-size: .8rem;
        font-weight: 600;
        letter-spacing: .06em;
        text-transform: uppercase;
        color: #444;
        transition: color .2s;
        white-space: nowrap
      }
  
      .nav-link:hover {
        color: #D6AF68
      }
  
      /* TICKER */
      .ticker-wrap {
        overflow: hidden;
        background: #D6AF68;
        padding: 8px 0
      }
  
      .ticker-inner {
        display: flex;
        width: max-content;
        animation: marquee 20s linear infinite
      }
  
      /* CAT CIRCLE */
      .cat-circle {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 2px solid #ececec;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        background: #f5f5f5;
        transition: border-color .2s, transform .2s;
        flex-shrink: 0
      }
  
      .cat-circle:hover {
        border-color: #D6AF68;
        transform: scale(1.08)
      }
  
      /* SCROLLBAR HIDE */
      ::-webkit-scrollbar {
        display: none
      }
  
      /* MOBILE MENU OVERLAY */
      #overlay {
        transition: opacity .3s
      }
    </style>
  </head>
  
  <body>
  
    <!-- OVERLAY -->
    <div id="overlay" onclick="closeMenu()" class="fixed inset-0 bg-black/50 z-40 hidden opacity-0"></div>
  
    <!-- DRAWER -->
    <aside id="drawer"
      class="drawer fixed top-0 left-0 h-full w-72 bg-white z-50 -translate-x-full shadow-2xl flex flex-col">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <span class="font-sport text-2xl tracking-widest text-[#D6AF68]">MENU</span>
        <button onclick="closeMenu()" class="text-gray-400 hover:text-black text-3xl leading-none">&times;</button>
      </div>
      <nav id="mobile-nav" class="p-4 space-y-1 text-sm font-semibold text-gray-700 flex-1 overflow-y-auto">
        <!-- Populated by JS -->
      </nav>
      <div class="p-4 border-t border-gray-100 flex-shrink-0">
        <a href="https://wa.me/5511999999999" target="_blank"
          class="block px-4 py-3 rounded-lg text-[#D6AF68] bg-amber-50 text-center text-sm font-bold">&#128172; Falar 
no
          WhatsApp</a>
      </div>
    </aside>
  
    <!-- HEADER -->
    <header class="sticky top-0 z-30 bg-white border-b border-gray-100" style="backdrop-filter:blur(12px);">
      <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <button onclick="openMenu()" class="p-2 rounded-lg hover:bg-gray-100 lg:hidden">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2"
            stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div class="flex items-center gap-3">
          <div class="logo-ph">SUA<br>LOGO</div>
          <span class="font-sport text-xl tracking-widest text-[#D6AF68] hidden sm:block">SEU MANTO</span>
        </div>
        <nav id="desktop-nav" class="hidden lg:flex items-center h-full">
          <!-- Populated by JS -->
        </nav>
        <a href="https://wa.me/5511999999999" target="_blank"
          class="btn-wpp flex items-center gap-2 px-4 py-2 text-xs rounded-xl">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-
.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.
134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.57
9-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 
2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 
1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 
01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 
2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 
11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 
005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span class="hidden sm:inline">Pedir a minha</span>
        </a>
      </div>
    </header>
  
    <!-- BANNER HOME -->
    <section class="w-full">
      <!-- Desktop (1920x600) -->
      <img id="banner-home-desktop" src="https://placehold.co/1920x600/111/D6AF68?text=Banner+Home+Desktop+(1920x600)"
        class="hidden md:block w-full h-auto object-cover">
      <!-- Mobile (768x900) -->
      <img id="banner-home-mobile" src="https://placehold.co/768x900/111/D6AF68?text=Banner+Home+Mobile+(768x900)"
        alt="Banner Home" class="block md:hidden w-full h-auto object-cover">
    </section>
  
  
    <!-- TICKER -->
    <div class="ticker-wrap">
      <div class="ticker-inner">
        <span class="font-sport tracking-widest text-sm text-black px-3 whitespace-nowrap">CAMISAS NACIONAIS
          &nbsp;&#10022;&nbsp; CAMISAS EUROPEIAS &nbsp;&#10022;&nbsp; COLE&Ccedil;&Atilde;O RETR&Ocirc;
          &nbsp;&#10022;&nbsp; VERS&Atilde;O TORCEDOR &nbsp;&#10022;&nbsp; VERS&Atilde;O JOGADOR &nbsp;&#10022;&nbsp;
          CONSULTE VIA WHATSAPP &nbsp;&#10022;&nbsp; ENTREGA TODO BRASIL &nbsp;&#10022;&nbsp; CAMISAS NACIONAIS
          &nbsp;&#10022;&nbsp; CAMISAS EUROPEIAS &nbsp;&#10022;&nbsp; COLE&Ccedil;&Atilde;O RETR&Ocirc;
          &nbsp;&#10022;&nbsp; VERS&Atilde;O TORCEDOR &nbsp;&#10022;&nbsp; VERS&Atilde;O JOGADOR &nbsp;&#10022;&nbsp;
          CONSULTE VIA WHATSAPP &nbsp;&#10022;&nbsp; ENTREGA TODO BRASIL &nbsp;&#10022;&nbsp;</span>
      </div>
    </div>
  
    <!-- BANNERS CATEGORIAS -->
    <section class="w-full py-8 max-w-7xl mx-auto px-4 lg:px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="#nacionais"
          class="block overflow-hidden rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <img id="banner-cat-nac-d" src="https://placehold.co/400x600/111/39FF14?text=BRASILEIRAO"
            class="hidden md:block w-full h-auto object-cover">
          <img id="banner-cat-nac-m" src="https://placehold.co/600x800/111/39FF14?text=BRASILEIRAO+Mobile"
            alt="Brasileir&atilde;o" class="block md:hidden w-full h-auto object-cover">
        </a>
        <a href="#europeus"
          class="block overflow-hidden rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <img id="banner-cat-int-d" src="https://placehold.co/400x600/111/39FF14?text=INTERNACIONAIS"
            class="hidden md:block w-full h-auto object-cover">
          <img id="banner-cat-int-m" src="https://placehold.co/600x800/111/39FF14?text=INTERNACIONAIS+Mobile"
            alt="Internacionais" class="block md:hidden w-full h-auto object-cover">
        </a>
        <a href="#retro"
          class="block overflow-hidden rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <img id="banner-cat-ret-d" src="https://placehold.co/400x600/111/39FF14?text=CAMISAS+RETRO"
            class="hidden md:block w-full h-auto object-cover">
          <img id="banner-cat-ret-m" src="https://placehold.co/600x800/111/39FF14?text=CAMISAS+RETRO+Mobile"
            alt="Retr&ocirc;" class="block md:hidden w-full h-auto object-cover">
        </a>
      </div>
    </section>
  
    <!-- DYNAMIC CATALOG -->
    <div id="dynamic-catalog"></div>
  
    <!-- WPP CTA -->
    <section class="py-24 px-6 bg-gradient-to-r from-amber-400 via-orange-500 to-[#D6AF68] text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="font-sport tracking-widest mb-4 leading-none text-black drop-shadow-sm"
          style="font-size:clamp(3rem,6vw,5.5rem);">
          N&Atilde;O ENCONTROU O SEU MANTO?
        </h2>
        <p class="text-black/80 text-lg md:text-xl font-medium mb-10 leading-relaxed max-w-2xl mx-auto">
          Trabalhamos com encomendas de edi&ccedil;&otilde;es limitadas, camisas retr&ocirc; raras e 
lan&ccedil;amentos de
          todas as ligas do mundo.
        </p>
        <a href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Quero%20fazer%20uma%20encomenda%20especial." 
target="_blank"
          class="inline-block bg-black text-white font-extrabold text-sm tracking-widest uppercase py-5 px-12 
rounded-full hover:bg-gray-900 hover:scale-105 transition-all shadow-2xl">
          CHAMAR NO WHATSAPP
        </a>
      </div>
    </section>
  
    <!-- FOOTER -->
    <footer class="bg-gray-50 pt-16 pb-8 px-6 border-t border-gray-200">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
        <div>
          <div class="logo-ph mb-4"></div>
          <p class="font-sport text-2xl tracking-widest text-[#D6AF68] mb-2">SEU MANTO</p>
          <p class="text-gray-500 mb-6 leading-relaxed text-[13px]">Sua paix&atilde;o estampada no peito. Camisas de
            futebol de alt&iacute;ssima qualidade com envio para todo o Brasil.</p>
          <a href="https://wa.me/5511999999999" target="_blank"
            class="text-green-600 font-bold flex items-center gap-2 hover:text-green-700">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.16
4-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.60
6.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.
579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 
2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 
1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 
01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 
2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 
11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 
005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Atendimento via WhatsApp
          </a>
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
      const WA = "5511999999999";
      const DEFAULT_PRODUCTS = {
        nacionais: [
          { id: "n1", name: "Flamengo", season: "25/26", tag: "t", tagLabel: "Torcedor", img: 
"assets/img/jersey_flamengo.png", price: "R$ 189", category: "nacionais" },
          { id: "n2", name: "Corinthians", season: "25/26", tag: "t", tagLabel: "Torcedor", img: 
"assets/img/jersey_corinthians.png", price: "R$ 199", category: "nacionais" },
          { id: "n3", name: "Flamengo", season: "25/26", tag: "j", tagLabel: "Jogador", img: 
"assets/img/jersey_flamengo.png", price: "R$ 289", category: "nacionais" },
          { id: "n4", name: "Corinthians", season: "25/26", tag: "j", tagLabel: "Jogador", img: 
"assets/img/jersey_corinthians.png", price: "R$ 299", category: "nacionais" }
        ],
        europeus: [
          { id: "e1", name: "Real Madrid", season: "24/25", tag: "t", tagLabel: "Torcedor", img: 
"assets/img/jersey_real_madrid.png", price: "R$ 219", category: "europeus" },
          { id: "e2", name: "Barcelona", season: "24/25", tag: "j", tagLabel: "Jogador", img: 
"assets/img/jersey_barcelona.png", price: "R$ 319", category: "europeus" },
          { id: "e3", name: "PSG", season: "24/25", tag: "t", tagLabel: "Torcedor", img: "assets/img/jersey_psg.png", 
price: "R$ 209", category: "europeus" },
          { id: "e4", name: "Manchester City", season: "24/25", tag: "j", tagLabel: "Jogador", img: 
"assets/img/jersey_manchester_city.png", price: "R$ 309", category: "europeus" }
        ],
        retro: [
          { id: "r1", name: "Brasil Retr\u00f4", season: "1970", tag: "r", tagLabel: "Retr\u00f4", img: 
"assets/img/jersey_retro_brasil.png", price: "R$ 229", category: "retro" },
          { id: "r2", name: "AC Milan Retr\u00f4", season: "1994", tag: "r", tagLabel: "Retr\u00f4", img: 
"assets/img/jersey_retro_milan.png", price: "R$ 249", category: "retro" },
          { id: "r3", name: "Brasil Retr\u00f4", season: "1970", tag: "r", tagLabel: "Retr\u00f4", img: 
"assets/img/jersey_retro_brasil.png", price: "R$ 229", category: "retro" },
          { id: "r4", name: "AC Milan Retr\u00f4", season: "1994", tag: "r", tagLabel: "Retr\u00f4", img: 
"assets/img/jersey_retro_milan.png", price: "R$ 249", category: "retro" }
        ]
      };
  
      let PRODUCTS = JSON.parse(localStorage.getItem('seumanto_products'));
      if (!PRODUCTS) {
        PRODUCTS = DEFAULT_PRODUCTS;
        localStorage.setItem('seumanto_products', JSON.stringify(PRODUCTS));
      }
  
      const DEFAULT_BANNERS = {
        home_desktop: "https://placehold.co/1920x600/111/D6AF68?text=Banner+Home+Desktop+(1920x600)",
        home_mobile: "assets/img/banner_brasil.png",
        cat_nac_d: "https://placehold.co/400x600/111/39FF14?text=BRASILEIRAO",
        cat_nac_m: "https://placehold.co/600x800/111/39FF14?text=BRASILEIRAO+Mobile",
        cat_int_d: "https://placehold.co/400x600/111/39FF14?text=INTERNACIONAIS",
        cat_int_m: "https://placehold.co/600x800/111/39FF14?text=INTERNACIONAIS+Mobile",
        cat_ret_d: "https://placehold.co/400x600/111/39FF14?text=CAMISAS+RETRO",
        cat_ret_m: "https://placehold.co/600x800/111/39FF14?text=CAMISAS+RETRO+Mobile",
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
            { title: "Nordeste/Norte", items: "Bahia, Vitória, Fortaleza, Ceará, Sport, Náutico, Santa Cruz, Remo, 
Paysandu" }
          ]
        },
        {
          id: "internacionais", name: "Internacionais", active: true,
          subs: [
            { title: "Premier League (ING)", items: "Arsenal, Chelsea, Liverpool, Manchester City, Manchester United, 
Tottenham" },
            { title: "La Liga (ESP)", items: "Barcelona, Real Madrid, Atlético de Madrid" },
            { title: "Serie A (ITA)", items: "Juventus, Milan, Inter de Milão, Napoli, Roma" },
            { title: "Outras Ligas", items: "PSG, Bayern de Munique, Borussia Dortmund, Bayer Leverkusen, Ajax, Porto, 
Benfica" }
          ]
        },
        {
          id: "selecoes", name: "Seleções", active: true,
          subs: [
            { title: "América", items: "Brasil, Argentina, Uruguai, Colômbia, Equador, Chile, Peru, Bol�via, 
Venezuela" },
            { title: "Europa", items: "Alemanha, Itália, França, Espanha, Inglaterra, Portugal, Holanda, Croácia, 
Bélgica" },
            { title: "África & Ásia", items: "Senegal, Marrocos, Nigéria, Egito, Camarões, Japão, Coreia do Sul, 
Arábia Saudita" }
          ]
        },
        {
          id: "libertadores", name: "Libertadores", active: true,
          subs: [
            { title: "Times Brasileiros", items: "Fluminense, São Paulo, Grêmio, Atlético Mineiro, Palmeiras, 
Flamengo, Botafogo" },
            { title: "Times Argentinos", items: "River Plate, Estudiantes, San Lorenzo, Rosario Central, Talleres, 
Boca Juniors" },
            { title: "Outros Pa�ses", items: "Peñarol, Nacional, Colo-Colo, LDU, Independiente del Valle, Bol�var, 
Cerro Porteño" }
          ]
        },
        {
          id: "outros", name: "Outros Esportes", active: true,
          subs: [
            { title: "NBA", items: "Lakers, Celtics, Warriors, Bulls, Heat, Mavericks, Nuggets" },
            { title: "NFL", items: "Chiefs, Patriots, 49ers, Eagles, Packers, Cowboys" }
          ]
        }
      ];
  
      let BANNERS = JSON.parse(localStorage.getItem('seumanto_banners'));
      if (!BANNERS) {
        BANNERS = DEFAULT_BANNERS;
        localStorage.setItem('seumanto_banners', JSON.stringify(BANNERS));
      } else if (!BANNERS.cat_nac_d) {
        // Migration for old schema
        BANNERS = { ...DEFAULT_BANNERS, home_desktop: BANNERS.home_desktop, home_mobile: BANNERS.home_mobile, 
grids_desktop: BANNERS.grids_desktop, grids_mobile: BANNERS.grids_mobile };
        localStorage.setItem('seumanto_banners', JSON.stringify(BANNERS));
      }
  
      document.addEventListener("DOMContentLoaded", () => {
        document.getElementById('banner-home-desktop').src = BANNERS.home_desktop;
        document.getElementById('banner-home-mobile').src = BANNERS.home_mobile;
  
        document.getElementById('banner-cat-nac-d').src = BANNERS.cat_nac_d;
        document.getElementById('banner-cat-nac-m').src = BANNERS.cat_nac_m;
        document.getElementById('banner-cat-int-d').src = BANNERS.cat_int_d;
        document.getElementById('banner-cat-int-m').src = BANNERS.cat_int_m;
        document.getElementById('banner-cat-ret-d').src = BANNERS.cat_ret_d;
        document.getElementById('banner-cat-ret-m').src = BANNERS.cat_ret_m;
  
        document.getElementById('banner-grids-desktop').src = BANNERS.grids_desktop;
        document.getElementById('banner-grids-mobile').src = BANNERS.grids_mobile;
  
        // Render Mega Menu
        let megaFooterData = JSON.parse(localStorage.getItem('seumanto_megafooter'));
        if (!megaFooterData) {
          megaFooterData = DEFAULT_MEGA_FOOTER;
          localStorage.setItem('seumanto_megafooter', JSON.stringify(megaFooterData));
        }
  
        const desktopNav = document.getElementById('desktop-nav');
        const mobileNav = document.getElementById('mobile-nav');
        let desktopHtml = '';
        let mobileHtml = '';
  
        megaFooterData.filter(c => c.active).forEach(cat => {
          // Desktop HTML
          desktopHtml += `
        <div class="group h-full flex items-center px-4 cursor-pointer hover:bg-gray-50 transition-colors">
          <span class="nav-link !normal-case tracking-normal">${cat.name} <span class="text-[10px] 
ml-1">&#9662;</span></span>
          <div class="absolute left-0 top-full w-full hidden group-hover:block z-50 pt-4 -mt-4">
            <div class="bg-[#111] text-white shadow-2xl border-t border-[#333]">
              <div class="max-w-7xl mx-auto p-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
      `;
          cat.subs.forEach(sub => {
            desktopHtml += `<div>
          <h4 class="font-bold text-sm mb-4 text-[#D6AF68] uppercase tracking-wider">${sub.title}</h4>
          <ul class="space-y-3 text-sm text-gray-400">`;
            sub.items.split(',').forEach(item => {
              const i = item.trim();
              if (i) {
                const msg = encodeURIComponent("Ol\u00e1! Gostaria de saber mais sobre as camisas do " + i);
                desktopHtml += `<li><a href="https://wa.me/5511999999999?text=${msg}" target="_blank" 
class="hover:text-white transition-colors">${i}</a></li>`;
              }
            });
            desktopHtml += `</ul></div>`;
          });
          desktopHtml += `</div></div></div></div>`;
  
          // Mobile HTML
          mobileHtml += `
        <div class="border-b border-gray-100 last:border-0">
          <button onclick="document.getElementById('mob-sub-${cat.id}').classList.toggle('hidden')" class="w-full flex 
justify-between items-center px-4 py-3 hover:bg-gray-50 text-left">
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
              if (i) {
                const msg = encodeURIComponent("Ol\u00e1! Gostaria de saber mais sobre as camisas do " + i);
                mobileHtml += `<li><a href="https://wa.me/5511999999999?text=${msg}" target="_blank" class="block py-1 
hover:text-[#D6AF68]">${i}</a></li>`;
              }
            });
            mobileHtml += `</ul></div>`;
          });
          mobileHtml += `</div></div>`;
        });
  
        desktopNav.innerHTML = desktopHtml;
        mobileNav.innerHTML = mobileHtml;
  
        // Fill Footer Categories
        const footerCatsContainer = document.getElementById('footer-cats-container');
        if (footerCatsContainer) {
          let fHtml = '';
          megaFooterData.filter(c => c.active).slice(0, 4).forEach(cat => {
            fHtml += `<div><h4 class="font-bold text-gray-900 uppercase tracking-wider mb-4 
text-[11px]">${cat.name}</h4><ul class="space-y-3">`;
            const teams = [];
            cat.subs.forEach(s => { s.items.split(',').forEach(i => { if (i.trim()) teams.push(i.trim()); }); });
            teams.sort().slice(0, 5).forEach(t => {
              fHtml += `<li><a href="#" class="text-[13px] text-gray-500 hover:text-[#D6AF68] 
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
      <div class="px-3 py-5 text-center bg-white flex flex-col items-center border-t border-gray-100">
        <p class="text-[13px] text-gray-800 leading-snug mb-4 font-medium h-[40px] flex items-center justify-center">
          Camisa ${p.name} ${p.season}<br>${p.tagLabel}
        </p>
        
        <div class="flex items-center justify-center gap-2 mb-1">
          <span class="text-[11px] text-gray-500 line-through">${oldPrice}</span>
          <span class="text-xl font-extrabold text-black tracking-tight">${p.price}</span>
        </div>
        
        <div class="text-xs font-bold text-[#10b981] mb-2 flex items-center justify-center gap-1">
          ${pixPrice} com Pix
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 
2z"/></svg>
        </div>
        
        <div class="text-[11px] text-gray-800 font-semibold">
          12 x de ${instPrice}
        </div>
      </div>
    </div>`;
      }
  
      function fillTrack(id, items) {
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
                <button onclick="document.getElementById('track-${safeId}').scrollBy({left: -320, behavior: 
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
stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 
10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                    </div>
                    <div>
                      <h4 class="font-bold text-sm text-gray-900">Site Seguro</h4>
                      <p class="text-[11px] text-gray-500 leading-tight">Certificados de seguran&ccedil;a 
e<br>pol&iacute;tica de privacidade</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center 
flex-shrink-0 text-black">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 
1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 
3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </div>
                    <div>
                      <h4 class="font-bold text-sm text-gray-900">D&uacute;vidas?</h4>
                      <p class="text-[11px] text-gray-500">Fale com um atendente</p>
                    </div>
                  </div>
                </div>
              </section>
            `;
            }
  
            if (sectionsRendered === 1) {
              catalogHtml += `
              <section class="w-full py-8 max-w-7xl mx-auto px-4 lg:px-6">
                <img src="${BANNERS.grids_desktop}" class="hidden md:block w-full h-auto rounded-xl object-cover">
                <img src="${BANNERS.grids_mobile}" alt="Banner Promo" class="block md:hidden w-full h-auto rounded-xl 
object-cover">
              </section>
            `;
            }
  
            sectionsRendered++;
          }
        });
  
        dynamicCatalog.innerHTML = catalogHtml;
  
        vitrinesData.forEach((vitrineName, index) => {
          const items = allProducts.filter(p => p.vitrines.includes(vitrineName));
          if (items.length > 0) {
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
    </script>
  </body>
  
