const SITE_HEADER = `
<div class="topbar">
  <p>Frete grátis acima de R$ 299 · 5% OFF no Pix · Parcelamento em até 6x sem juros</p>
</div>

<header class="header" id="header">
  <div class="header__inner">
    <button class="menu-toggle" id="menuToggle" aria-label="Abrir menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <a href="index.html" class="logo">veiga<span>wave</span></a>

    <nav class="nav" id="nav" aria-label="Navegação principal">
      <ul class="nav__list">
        <li><a href="novidades.html" data-nav="novidades">Novidades</a></li>
        <li><a href="colecoes.html" data-nav="colecoes">Coleções</a></li>
        <li class="has-dropdown">
          <button class="nav__trigger" aria-expanded="false" data-nav="biquinis">Biquínis</button>
          <div class="dropdown">
            <div class="dropdown__col">
              <h4>Por peça</h4>
              <a href="biquinis.html#tops">Tops</a>
              <a href="biquinis.html#calcinhas">Calcinhas</a>
              <a href="biquinis.html#conjuntos">Conjuntos</a>
            </div>
            <div class="dropdown__col">
              <h4>Por corte</h4>
              <a href="biquinis.html">Cortininha</a>
              <a href="biquinis.html">Asa-delta</a>
              <a href="biquinis.html">Hot pant</a>
              <a href="biquinis.html">Lateral larga</a>
            </div>
            <div class="dropdown__col dropdown__col--highlight">
              <h4>Cápsula da vez</h4>
              <p>Golden Hour — tons de pôr do sol pra maré alta.</p>
              <a href="colecoes.html" class="dropdown__cta">Ver coleção →</a>
            </div>
          </div>
        </li>
        <li><a href="maio-body.html" data-nav="maiobody">Maiôs/Body</a></li>
        <li><a href="saidas-de-praia.html" data-nav="saidas">Saídas de praia</a></li>
        <li><a href="sale.html" class="nav__sale" data-nav="sale">Sale/Outlet</a></li>
        <li><a href="sobre.html" data-nav="sobre">Sobre a marca</a></li>
        <li><a href="contato.html" data-nav="contato">Contato</a></li>
      </ul>
    </nav>

    <div class="header__actions">
      <button class="icon-btn" id="searchToggle" aria-label="Buscar" aria-expanded="false">
        <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <button class="icon-btn" aria-label="Minha conta">
        <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <button class="icon-btn" id="wishlistBtn" aria-label="Favoritos">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 20s-7-4.4-9.5-8.7C.6 8 2 4.5 5.6 4c2-.3 3.7.7 4.4 2.3C10.7 4.7 12.4 3.7 14.4 4 18 4.5 19.4 8 17.5 11.3 15 15.6 12 20 12 20z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
        <span class="badge" id="wishlistCount">0</span>
      </button>
      <button class="icon-btn" id="cartBtn" aria-label="Carrinho">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="21" r="1.4" fill="currentColor"/><circle cx="18" cy="21" r="1.4" fill="currentColor"/></svg>
        <span class="badge" id="cartCount">0</span>
      </button>
    </div>
  </div>

  <div class="search-overlay" id="searchOverlay">
    <div class="search-overlay__inner">
      <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <input type="text" id="searchInput" placeholder="Buscar biquíni, cor, corte..." autocomplete="off">
      <button class="icon-btn" id="searchClose" aria-label="Fechar busca">✕</button>
    </div>
    <ul class="search-suggestions" id="searchSuggestions"></ul>
  </div>
</header>

<div class="mobile-nav" id="mobileNav">
  <ul>
    <li><a href="novidades.html">Novidades</a></li>
    <li><a href="colecoes.html">Coleções</a></li>
    <li><a href="biquinis.html">Biquínis</a></li>
    <li><a href="maio-body.html">Maiôs/Body</a></li>
    <li><a href="saidas-de-praia.html">Saídas de praia</a></li>
    <li><a href="sale.html">Sale/Outlet</a></li>
    <li><a href="sobre.html">Sobre a marca</a></li>
    <li><a href="contato.html">Contato</a></li>
  </ul>
</div>
`;

const SITE_FOOTER = `
<footer class="footer" id="rodape">
  <div class="footer__grid">
    <div>
      <a href="index.html" class="logo logo--footer">veiga<span>wave</span></a>
      <p>Biquínis, maiôs e saídas de praia inspirados no encontro do pôr do sol com o mar.</p>
    </div>
    <div>
      <h4>Ajuda</h4>
      <a href="#">Rastrear pedido</a>
      <a href="#">Trocas e devoluções</a>
      <a href="#">Guia de medidas</a>
      <a href="contato.html">Fale com a gente</a>
    </div>
    <div>
      <h4>Institucional</h4>
      <a href="sobre.html">Sobre a marca</a>
      <a href="#">Política de privacidade</a>
      <a href="#">Termos de uso</a>
      <a href="#">Atacado / Revenda</a>
    </div>
    <div>
      <h4>Fale com a gente</h4>
      <a href="mailto:contato@veigawave.com.br">contato@veigawave.com.br</a>
      <a href="contato.html">WhatsApp</a>
      <a href="#">Instagram</a>
    </div>
  </div>
  <div class="footer__bottom">
    <p>© 2026 veigawave. Todos os direitos reservados.</p>
  </div>
</footer>

<button class="whatsapp-btn" aria-label="Falar no WhatsApp">
  <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor"><path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.35.66 4.55 1.8 6.43L4 29l7.73-1.75a12.98 12.98 0 0 0 4.29.73c6.62 0 12.02-5.4 12.02-12.02C28.04 8.4 22.64 3 16.02 3zm0 21.85c-1.5 0-2.95-.4-4.22-1.15l-.3-.18-4.58 1.04 1.06-4.47-.2-.32a9.8 9.8 0 0 1-1.5-5.25c0-5.43 4.4-9.83 9.74-9.83 5.4 0 9.74 4.4 9.74 9.83 0 5.43-4.4 9.83-9.74 9.83zm5.36-7.36c-.29-.15-1.73-.85-2-.95-.27-.1-.47-.15-.66.15-.2.29-.76.95-.93 1.15-.17.2-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.43-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.14-.17.19-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.6-.9-2.19-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.2 3.02c.15.2 2.06 3.16 5 4.42.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.12.56-.08 1.73-.71 1.98-1.4.24-.68.24-1.27.17-1.4-.07-.12-.27-.19-.56-.34z"/></svg>
</button>
`;

function mountLayout() {
  const headerSlot = document.getElementById("site-header");
  const footerSlot = document.getElementById("site-footer");
  if (headerSlot) headerSlot.innerHTML = SITE_HEADER;
  if (footerSlot) footerSlot.innerHTML = SITE_FOOTER;

  const current = document.body.dataset.page;
  if (current) {
    document.querySelectorAll(`[data-nav="${current}"]`).forEach((el) => el.classList.add("is-current"));
  }
}

mountLayout();
