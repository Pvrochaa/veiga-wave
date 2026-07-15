(function heroSky() {
  const canvas = document.getElementById("sky");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let rect;

  function resize() {
    rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  addEventListener("resize", resize);

  function draw(t) {
    const w = rect.width, h = rect.height;

    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#2a6f74");
    sky.addColorStop(0.34, "#e6a15c");
    sky.addColorStop(0.52, "#ff6a45");
    sky.addColorStop(0.72, "#0e5f5c");
    sky.addColorStop(1, "#062524");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const bands = [
      { y: 0.6, a: 9, l: 0.013, s: 0.0009, top: "rgba(255,196,107,.22)", bottom: "rgba(20,198,178,.42)" },
      { y: 0.7, a: 13, l: 0.010, s: 0.0007, top: "rgba(20,198,178,.4)", bottom: "rgba(10,132,120,.55)" },
      { y: 0.81, a: 17, l: 0.008, s: 0.0005, top: "rgba(10,132,120,.55)", bottom: "rgba(7,33,31,.78)" },
      { y: 0.93, a: 24, l: 0.006, s: 0.00035, top: "rgba(7,33,31,.85)", bottom: "#062524" },
    ];

    bands.forEach((b) => {
      const points = [];
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 6) {
        const y = h * b.y + Math.sin(x * b.l + t * b.s) * b.a + Math.sin(x * b.l * 0.45 + t * b.s * 0.65) * b.a * 0.4;
        points.push([x, y]);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      const fill = ctx.createLinearGradient(0, h * b.y - b.a, 0, h);
      fill.addColorStop(0, b.top);
      fill.addColorStop(1, b.bottom);
      ctx.fillStyle = fill;
      ctx.fill();

      ctx.beginPath();
      points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.strokeStyle = "rgba(255,255,255,.16)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
    });

    for (let i = 0; i < 16; i++) {
      const seed = i * 137.5;
      const x = (seed + t * 0.012) % w;
      const y = h * 0.6 + Math.sin(x * 0.013 + t * 0.0009) * 9 - 5;
      const twinkle = (Math.sin(t * 0.0022 + i * 1.7) + 1) / 2;
      ctx.beginPath();
      ctx.arc(x, y, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,224,170,${(0.12 + twinkle * 0.38).toFixed(2)})`;
      ctx.fill();
    }
  }

  if (reduceMotion) { draw(0); return; }
  let start = null;
  function loop(ts) {
    if (start === null) start = ts;
    draw(ts - start);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

// Catálogo vem da API (tabela `products`) — só o UGC (carrossel "Vestido por
// vocês") continua fixo aqui, já que não são produtos de verdade.
let PRODUCTS = {
  lancamentos: [],
  maisvendidos: [],
  biquinis: [],
  maiobody: [],
  saidas: [],
  sale: [],
  ugc: [
    { name: "@ju.ferreira", desc: "usando Top Golden Hour", gradient: "linear-gradient(135deg,#ffc15e,#ff6b9d)" },
    { name: "@carolzinha", desc: "usando Conjunto Ilha", gradient: "linear-gradient(135deg,#2ec4b6,#1b6ca8)" },
    { name: "@marinamota", desc: "usando Saída Maré Baixa", gradient: "linear-gradient(135deg,#ff8a5b,#ffc15e)" },
    { name: "@bebiaz", desc: "usando Conjunto Deep Blue", gradient: "linear-gradient(135deg,#1b6ca8,#0b3d5c)" },
    { name: "@nat.oliveira", desc: "usando Top Horizonte", gradient: "linear-gradient(135deg,#ff6b9d,#2ec4b6)" },
  ],
};

function priceLabel(cents) {
  const reais = cents / 100;
  return `R$ ${Number.isInteger(reais) ? reais : reais.toFixed(2).replace(".", ",")}`;
}

function toDisplayProduct(p) {
  const onSale = p.originalPriceCents && p.originalPriceCents > p.priceCents;
  const discountPct = onSale ? Math.round((1 - p.priceCents / p.originalPriceCents) * 100) : null;
  return {
    slug: p.slug,
    name: p.name,
    desc: p.desc || "",
    price: priceLabel(p.priceCents),
    old: onSale ? priceLabel(p.originalPriceCents) : undefined,
    tag: p.isNew ? "Novo" : onSale ? `-${discountPct}%` : undefined,
    gradient: p.imageUrl ? undefined : `linear-gradient(135deg,${p.gradientFrom},${p.gradientTo})`,
    image: p.imageUrl || undefined,
    piece: p.piece || undefined,
  };
}

const ACCENT_MAP = {
  a: "áàãâä", e: "éèêë", i: "íìîï", o: "óòõôö", u: "úùûü", c: "ç", n: "ñ",
};
const ACCENT_LOOKUP = Object.entries(ACCENT_MAP).reduce((map, [plain, accented]) => {
  for (const ch of accented) map[ch] = plain;
  return map;
}, {});

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^\x00-\x7f]/g, (ch) => ACCENT_LOOKUP[ch] || ch)
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeAttr(str) {
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const CART_ID_KEY = "veigawave_cart_id";

function getCartId() {
  let id = localStorage.getItem(CART_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(CART_ID_KEY, id);
  }
  return id;
}

function productCardHTML(item) {
  const slug = item.slug || slugify(item.name);
  const imgStyle = item.image
    ? `background-image:url('${escapeAttr(item.image)}');background-size:cover;background-position:center;`
    : `background:${item.gradient || "var(--sand-tint)"};`;
  return `
    <article class="product-card">
      <div class="product-card__img" style="${imgStyle}">
        ${item.tag ? `<span class="product-card__tag">${item.tag}</span>` : ""}
        <button
          class="product-card__fav" data-fav
          data-slug="${slug}"
          data-name="${escapeAttr(item.name)}"
          data-desc="${escapeAttr(item.desc || "")}"
          data-price="${escapeAttr(item.price || "")}"
          data-gradient="${escapeAttr(item.gradient || "")}"
          aria-label="Favoritar ${item.name}"
        >♡</button>
      </div>
      <div class="product-card__body">
        <p class="product-card__name">${item.name}</p>
        <p class="product-card__desc">${item.desc}</p>
        ${item.price ? `
        <div class="product-card__footer">
          <span>${item.old ? `<span class="product-card__old">${item.old}</span>` : ""}<span class="product-card__price">${item.price}</span></span>
          <div class="product-card__actions">
            <button
              class="product-card__buy" data-buy
              data-slug="${slug}"
              data-name="${escapeAttr(item.name)}"
              data-desc="${escapeAttr(item.desc || "")}"
              data-price="${escapeAttr(item.price || "")}"
              data-gradient="${escapeAttr(item.gradient || "")}"
              aria-label="Comprar ${item.name} agora"
              title="Comprar agora"
            ><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg></button>
            <button
              class="product-card__add" data-add
              data-slug="${slug}"
              data-name="${escapeAttr(item.name)}"
              data-desc="${escapeAttr(item.desc || "")}"
              data-price="${escapeAttr(item.price || "")}"
              data-gradient="${escapeAttr(item.gradient || "")}"
              aria-label="Adicionar ${item.name} ao carrinho"
              title="Adicionar ao carrinho"
            ><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="21" r="1.4" fill="currentColor" stroke="none"/><circle cx="18" cy="21" r="1.4" fill="currentColor" stroke="none"/></svg></button>
          </div>
        </div>` : ""}
      </div>
    </article>
  `;
}

function renderCarousel(id, key) {
  const container = document.getElementById(id);
  if (!container) return;
  const items = PRODUCTS[key] || [];
  container.innerHTML = items.map(productCardHTML).join("");
}

function renderGrid(id, items) {
  const container = document.getElementById(id);
  if (!container) return;
  container.innerHTML = items.length
    ? items.map(productCardHTML).join("")
    : `<p class="grid-empty">Nada por aqui ainda — volta em breve.</p>`;
}

async function initCatalog() {
  try {
    const res = await fetch("/api/produtos");
    const data = await res.json();
    const raw = data.products || [];

    PRODUCTS.lancamentos = raw.filter((p) => p.isNew).map(toDisplayProduct);
    PRODUCTS.maisvendidos = raw.filter((p) => p.isBestseller).map(toDisplayProduct);
    PRODUCTS.biquinis = raw.filter((p) => p.category === "biquinis").map(toDisplayProduct);
    PRODUCTS.maiobody = raw.filter((p) => p.category === "maiobody").map(toDisplayProduct);
    PRODUCTS.saidas = raw.filter((p) => p.category === "saidas").map(toDisplayProduct);
    PRODUCTS.sale = raw
      .filter((p) => p.originalPriceCents && p.originalPriceCents > p.priceCents)
      .map(toDisplayProduct);

    ALL_PRODUCTS = raw.map(toDisplayProduct);
  } catch {
    // sem catálogo por enquanto — grids ficam com a mensagem de "vazio"
  }

  renderCarousel("carousel-lancamentos", "lancamentos");
  renderCarousel("carousel-maisvendidos", "maisvendidos");
  renderCarousel("carousel-ugc", "ugc");
  renderGrid("grid-novidades", PRODUCTS.lancamentos);
  renderGrid("grid-maiobody", PRODUCTS.maiobody);
  renderGrid("grid-saidas", PRODUCTS.saidas);
  renderGrid("grid-sale", PRODUCTS.sale);

  const biquinisGrid = document.getElementById("grid-biquinis");
  if (biquinisGrid) {
    const tabs = document.querySelectorAll(".tabs [data-tab]");
    function applyTab(tab) {
      const items = tab === "todos" ? PRODUCTS.biquinis : PRODUCTS.biquinis.filter((p) => p.piece === tab);
      renderGrid("grid-biquinis", items);
      tabs.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.tab === tab));
    }
    tabs.forEach((btn) => btn.addEventListener("click", () => applyTab(btn.dataset.tab)));
    applyTab(location.hash ? location.hash.slice(1) : "todos");
  }
}

initCatalog();

document.querySelectorAll(".carousel-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const carousel = document.getElementById(`carousel-${btn.dataset.carousel}`);
    const card = carousel.querySelector(".product-card");
    const step = card ? card.getBoundingClientRect().width + 20 : 260;
    carousel.scrollBy({ left: step * Number(btn.dataset.dir), behavior: "smooth" });
  });
});

let wishlistCount = 0;
let cartCount = 0;
const wishlistBadge = document.getElementById("wishlistCount");
const cartBadge = document.getElementById("cartCount");

function bump(badge) {
  badge.classList.add("pop");
  setTimeout(() => badge.classList.remove("pop"), 200);
}

// Atribuído dentro do initAccountPanel() mais abaixo — os cliques só
// acontecem depois que o script inteiro já rodou, então isso já está
// preenchido quando alguém realmente clica.
let openAccountPanel = null;
let pendingFavorite = null;

function setWishlistCount(n) {
  wishlistCount = Math.max(0, n);
  wishlistBadge.textContent = wishlistCount;
}

function favoriteProductFromButton(btn) {
  return {
    slug: btn.dataset.slug,
    name: btn.dataset.name,
    desc: btn.dataset.desc,
    price: btn.dataset.price,
    gradient: btn.dataset.gradient,
  };
}

async function fetchFavoriteSlugs(email) {
  try {
    const res = await fetch(`/api/favoritos?email=${encodeURIComponent(email)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.favorites || []).map((f) => f.slug);
  } catch {
    return [];
  }
}

async function syncFavoriteButtons() {
  const account = getAccount();
  if (!account) {
    setWishlistCount(0);
    return;
  }
  const slugs = await fetchFavoriteSlugs(account.email);
  setWishlistCount(slugs.length);
  document.querySelectorAll("[data-fav]").forEach((btn) => {
    const isFav = slugs.includes(btn.dataset.slug);
    btn.classList.toggle("is-active", isFav);
    btn.textContent = isFav ? "♥" : "♡";
  });
}

async function toggleFavorite(btn) {
  const account = getAccount();
  if (!account) {
    pendingFavorite = btn;
    if (openAccountPanel) openAccountPanel();
    return;
  }

  const willFavorite = !btn.classList.contains("is-active");
  btn.classList.toggle("is-active", willFavorite);
  btn.textContent = willFavorite ? "♥" : "♡";
  setWishlistCount(wishlistCount + (willFavorite ? 1 : -1));
  bump(wishlistBadge);

  const product = favoriteProductFromButton(btn);

  try {
    if (willFavorite) {
      await fetch("/api/favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: account.email, product }),
      });
    } else {
      await fetch("/api/favoritos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: account.email, slug: product.slug }),
      });
      if (document.body.dataset.page === "favoritos") {
        btn.closest(".product-card")?.remove();
      }
    }
  } catch {
    // reverte se a chamada falhar
    btn.classList.toggle("is-active", !willFavorite);
    btn.textContent = !willFavorite ? "♥" : "♡";
    setWishlistCount(wishlistCount + (willFavorite ? -1 : 1));
  }
}

function completePendingFavorite() {
  if (!pendingFavorite) return;
  const btn = pendingFavorite;
  pendingFavorite = null;
  toggleFavorite(btn);
}

function setCartCount(n) {
  cartCount = Math.max(0, n);
  cartBadge.textContent = cartCount;
}

async function syncCartBadge() {
  try {
    const res = await fetch(`/api/carrinho?cartId=${encodeURIComponent(getCartId())}`);
    if (!res.ok) return;
    const data = await res.json();
    const total = (data.items || []).reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  } catch {
    // sem conexão — mantém o que já estava mostrando
  }
}

async function addToCart(btn) {
  const product = {
    slug: btn.dataset.slug,
    name: btn.dataset.name,
    desc: btn.dataset.desc,
    price: btn.dataset.price,
    gradient: btn.dataset.gradient,
  };

  setCartCount(cartCount + 1);
  bump(cartBadge);

  try {
    const res = await fetch("/api/carrinho", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId: getCartId(), product }),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.totalItems === "number") setCartCount(data.totalItems);
    }
  } catch {
    // mantém a contagem otimista mesmo se a chamada falhar
  }
}

async function buyNow(btn) {
  await addToCart(btn);
  location.href = "carrinho.html";
}

document.addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]");
  if (fav) toggleFavorite(fav);

  const add = e.target.closest("[data-add]");
  if (add) addToCart(add);

  const buy = e.target.closest("[data-buy]");
  if (buy) buyNow(buy);
});

syncCartBadge();

const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const mobileNavClose = document.getElementById("mobileNavClose");
const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");

function openMobileNav() {
  mobileNav.classList.add("is-open");
  mobileNavBackdrop.classList.add("is-open");
  menuToggle.classList.add("is-active");
  menuToggle.setAttribute("aria-expanded", "true");
}
function closeMobileNav() {
  mobileNav.classList.remove("is-open");
  mobileNavBackdrop.classList.remove("is-open");
  menuToggle.classList.remove("is-active");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  mobileNav.classList.contains("is-open") ? closeMobileNav() : openMobileNav();
});
mobileNavClose.addEventListener("click", closeMobileNav);
mobileNavBackdrop.addEventListener("click", closeMobileNav);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMobileNav(); });
mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobileNav));

document.querySelectorAll(".has-dropdown").forEach((item) => {
  const trigger = item.querySelector(".nav__trigger");
  trigger.addEventListener("click", () => {
    const isOpen = item.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });
});
document.addEventListener("click", (e) => {
  document.querySelectorAll(".has-dropdown.is-open").forEach((item) => {
    if (!item.contains(e.target)) {
      item.classList.remove("is-open");
      item.querySelector(".nav__trigger").setAttribute("aria-expanded", "false");
    }
  });
});

const searchOverlay = document.getElementById("searchOverlay");
const searchToggle = document.getElementById("searchToggle");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");
const searchSuggestions = document.getElementById("searchSuggestions");

let ALL_PRODUCTS = [];

function openSearch() {
  searchOverlay.classList.add("is-open");
  searchToggle.setAttribute("aria-expanded", "true");
  setTimeout(() => searchInput.focus(), 150);
}
function closeSearch() {
  searchOverlay.classList.remove("is-open");
  searchToggle.setAttribute("aria-expanded", "false");
  searchInput.value = "";
  searchSuggestions.innerHTML = "";
}
searchToggle.addEventListener("click", openSearch);
searchClose.addEventListener("click", closeSearch);
searchOverlay.addEventListener("click", (e) => { if (e.target === searchOverlay) closeSearch(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSearch(); });

searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchSuggestions.innerHTML = ""; return; }
  const matches = ALL_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  searchSuggestions.innerHTML = matches.length
    ? matches.slice(0, 6).map((p) => `<li><a href="#">${p.name} — <span style="opacity:.6">${p.desc}</span></a></li>`).join("")
    : `<li class="empty">Nada por aqui ainda. Bora tentar outra palavra?</li>`;
});

const ACCOUNT_KEY = "veigawave_account";

function getAccount() {
  try { return JSON.parse(localStorage.getItem(ACCOUNT_KEY)); } catch { return null; }
}

(function initAccountPanel() {
  const toggle = document.getElementById("accountToggle");
  const panel = document.getElementById("accountPanel");
  if (!toggle || !panel) return;

  const closeBtn = document.getElementById("accountClose");
  const guestView = document.getElementById("accountGuest");
  const userView = document.getElementById("accountUser");
  const tabs = panel.querySelectorAll("[data-account-tab]");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const accountAvatar = document.getElementById("accountAvatar");
  const accountName = document.getElementById("accountName");
  const accountEmail = document.getElementById("accountEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  function renderState() {
    const acc = getAccount();
    const loggedIn = !!acc;
    guestView.classList.toggle("is-hidden", loggedIn);
    userView.classList.toggle("is-hidden", !loggedIn);
    toggle.classList.toggle("is-authed", loggedIn);
    if (loggedIn) {
      accountName.textContent = acc.nome;
      accountEmail.textContent = acc.email;
      accountAvatar.textContent = acc.nome.trim().charAt(0).toUpperCase() || "?";
    }
  }

  function openPanel() {
    renderState();
    panel.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }
  function closePanel() {
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  openAccountPanel = openPanel;

  toggle.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);
  panel.addEventListener("click", (e) => { if (e.target === panel) closePanel(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanel(); });

  tabs.forEach((tab) => tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
    const view = tab.dataset.accountTab;
    loginForm.classList.toggle("is-hidden", view !== "entrar");
    signupForm.classList.toggle("is-hidden", view !== "criar");
  }));

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const stored = getAccount();
    const nome = stored && stored.email === email ? stored.nome : email.split("@")[0];
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify({ nome, email }));
    loginForm.reset();
    renderState();
    await syncFavoriteButtons();
    completePendingFavorite();
    setTimeout(closePanel, 400);
  });

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = signupForm.nome.value.trim();
    const email = signupForm.email.value.trim();
    const telefone = signupForm.telefone.value.trim();
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify({ nome, email, telefone }));
    signupForm.reset();
    renderState();
    await syncFavoriteButtons();
    completePendingFavorite();
    setTimeout(closePanel, 400);
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(ACCOUNT_KEY);
    renderState();
    document.querySelectorAll("[data-fav].is-active").forEach((btn) => {
      btn.classList.remove("is-active");
      btn.textContent = "♡";
    });
    setWishlistCount(0);
  });

  renderState();
})();

syncFavoriteButtons();

const newsletterForm = document.getElementById("newsletterForm");
const newsletterFeedback = document.getElementById("newsletterFeedback");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    newsletterFeedback.textContent = "Prontinho! Cupom VEIGA10 chegando no seu e-mail 🌅";
    newsletterForm.reset();
  });
}

const contactForm = document.getElementById("contactForm");
const contactFeedback = document.getElementById("contactFeedback");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    contactFeedback.textContent = "Recebemos sua mensagem! A gente responde em até 1 dia útil 🌊";
    contactForm.reset();
  });
}

const TRACKING_STATUS_ORDER = ["confirmado", "separacao", "enviado", "entregue"];
const TRACKING_STATUS_LABELS = {
  confirmado: "Confirmado",
  separacao: "Em separação",
  enviado: "Enviado",
  entregue: "Entregue",
};

function formatTrackingDate(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function formatCents(cents) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function trackingStepsHTML(order) {
  const eventDate = {};
  order.timeline.forEach((e) => { eventDate[e.status] = e.occurredAt; });
  const currentIndex = TRACKING_STATUS_ORDER.indexOf(order.status);

  const steps = TRACKING_STATUS_ORDER.map((status, i) => {
    const reached = i <= currentIndex;
    const current = i === currentIndex;
    const classes = ["tracking-step"];
    if (reached) classes.push("is-reached");
    if (current) classes.push("is-current");
    return `
      <div class="${classes.join(" ")}">
        <span class="tracking-step__dot">${reached ? "✓" : i + 1}</span>
        <span class="tracking-step__label">${TRACKING_STATUS_LABELS[status]}</span>
        ${eventDate[status] ? `<span class="tracking-step__date">${formatTrackingDate(eventDate[status])}</span>` : ""}
      </div>
    `;
  }).join("");

  return `<div class="tracking-steps">${steps}</div>`;
}

function trackingSummaryHTML(order) {
  const items = Array.isArray(order.items) ? order.items : [];
  const itemsHTML = items
    .map((item) => `<li>${item.qty}× ${item.name}${item.price_cents ? ` — ${formatCents(item.price_cents)}` : ""}</li>`)
    .join("");

  const trackingHTML = order.trackingCode
    ? `<div class="tracking-summary__tracking">
        <strong>${order.carrier || "Transportadora"}</strong> — código ${order.trackingCode}
        ${order.trackingUrl ? `<br><a href="${order.trackingUrl}" target="_blank" rel="noopener">Rastrear na transportadora →</a>` : ""}
      </div>`
    : "";

  return `
    <div class="tracking-summary">
      <p class="tracking-summary__number">Pedido ${order.orderNumber}</p>
      <p class="tracking-summary__meta">Status atual: <strong>${order.statusLabel}</strong></p>
      ${itemsHTML ? `<ul class="tracking-summary__items">${itemsHTML}</ul>` : ""}
      ${trackingHTML}
    </div>
  `;
}

const trackingForm = document.getElementById("trackingForm");
const trackingFeedback = document.getElementById("trackingFeedback");
const trackingResult = document.getElementById("trackingResult");

if (trackingForm) {
  trackingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    trackingFeedback.textContent = "Buscando seu pedido...";
    trackingResult.classList.add("is-hidden");
    trackingResult.innerHTML = "";

    const orderNumber = trackingForm.pedido.value.trim();
    const email = trackingForm.email.value.trim();

    try {
      const response = await fetch("/api/rastrear-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });
      const data = await response.json();

      if (!response.ok) {
        trackingFeedback.textContent = "";
        trackingResult.innerHTML = `<p class="tracking-error">${data.error || "Não foi possível encontrar esse pedido."}</p>`;
        trackingResult.classList.remove("is-hidden");
        return;
      }

      trackingFeedback.textContent = "";
      trackingResult.innerHTML = trackingSummaryHTML(data) + trackingStepsHTML(data);
      trackingResult.classList.remove("is-hidden");
    } catch {
      trackingFeedback.textContent = "";
      trackingResult.innerHTML = `<p class="tracking-error">Erro ao buscar o pedido. Tenta de novo em instantes.</p>`;
      trackingResult.classList.remove("is-hidden");
    }
  });
}

const favoritosGrid = document.getElementById("grid-favoritos");
const favoritosLoggedOut = document.getElementById("favoritosLoggedOut");
const favoritosLoginBtn = document.getElementById("favoritosLoginBtn");

if (favoritosGrid) {
  if (favoritosLoginBtn) {
    favoritosLoginBtn.addEventListener("click", () => {
      if (openAccountPanel) openAccountPanel();
    });
  }

  async function renderFavoritos() {
    const account = getAccount();
    if (!account) {
      favoritosLoggedOut.classList.remove("is-hidden");
      favoritosGrid.classList.add("is-hidden");
      return;
    }
    favoritosLoggedOut.classList.add("is-hidden");
    favoritosGrid.classList.remove("is-hidden");

    try {
      const res = await fetch(`/api/favoritos?email=${encodeURIComponent(account.email)}`);
      const data = await res.json();
      const favorites = data.favorites || [];
      favoritosGrid.innerHTML = favorites.length
        ? favorites.map(productCardHTML).join("")
        : `<p class="grid-empty">Você ainda não favoritou nada. <a href="colecoes.html">Dá uma olhada na coleção</a>.</p>`;
      favoritosGrid.querySelectorAll("[data-fav]").forEach((btn) => {
        btn.classList.add("is-active");
        btn.textContent = "♥";
      });
    } catch {
      favoritosGrid.innerHTML = `<p class="grid-empty">Não deu pra carregar seus favoritos agora. Tenta de novo em instantes.</p>`;
    }
  }

  renderFavoritos();
}

const cartListEl = document.getElementById("cartList");
const cartEmptyEl = document.getElementById("cartEmpty");
const cartWrapEl = document.getElementById("cartWrap");
const cartSubtotalEl = document.getElementById("cartSubtotal");

function parsePriceToCents(priceStr) {
  if (!priceStr) return 0;
  const digits = String(priceStr).replace(/[^\d,]/g, "").replace(",", ".");
  const value = parseFloat(digits);
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

function cartItemHTML(item) {
  const lineCents = parsePriceToCents(item.price) * item.quantity;
  return `
    <li class="cart-item" data-slug="${item.slug}">
      <div class="cart-item__img" style="background:${item.gradient || "var(--sand-tint)"}"></div>
      <div class="cart-item__body">
        <p class="cart-item__name">${item.name}</p>
        <p class="cart-item__desc">${item.desc || ""}</p>
      </div>
      <div class="cart-item__qty">
        <button type="button" data-qty-dec aria-label="Diminuir quantidade de ${item.name}">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-qty-inc aria-label="Aumentar quantidade de ${item.name}">+</button>
      </div>
      <p class="cart-item__price">${formatCents(lineCents)}</p>
      <button type="button" class="cart-item__remove" data-remove aria-label="Remover ${item.name}">✕</button>
    </li>
  `;
}

if (cartListEl) {
  async function loadCart() {
    try {
      const res = await fetch(`/api/carrinho?cartId=${encodeURIComponent(getCartId())}`);
      const data = await res.json();
      const items = data.items || [];

      if (items.length === 0) {
        cartEmptyEl.classList.remove("is-hidden");
        cartWrapEl.classList.add("is-hidden");
        return;
      }

      cartEmptyEl.classList.add("is-hidden");
      cartWrapEl.classList.remove("is-hidden");
      cartListEl.innerHTML = items.map(cartItemHTML).join("");

      const subtotalCents = items.reduce((sum, item) => sum + parsePriceToCents(item.price) * item.quantity, 0);
      cartSubtotalEl.textContent = formatCents(subtotalCents);
    } catch {
      cartEmptyEl.classList.add("is-hidden");
      cartWrapEl.classList.remove("is-hidden");
      cartListEl.innerHTML = `<p class="grid-empty">Não deu pra carregar o carrinho agora. Tenta de novo em instantes.</p>`;
    }
  }

  async function updateCartQuantity(slug, quantity) {
    await fetch("/api/carrinho", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId: getCartId(), slug, quantity }),
    });
    await loadCart();
    await syncCartBadge();
  }

  async function removeFromCart(slug) {
    await fetch("/api/carrinho", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId: getCartId(), slug }),
    });
    await loadCart();
    await syncCartBadge();
  }

  cartListEl.addEventListener("click", (e) => {
    const li = e.target.closest(".cart-item");
    if (!li) return;
    const slug = li.dataset.slug;
    const currentQty = Number(li.querySelector(".cart-item__qty span").textContent);

    if (e.target.closest("[data-qty-inc]")) updateCartQuantity(slug, currentQty + 1);
    else if (e.target.closest("[data-qty-dec]")) updateCartQuantity(slug, currentQty - 1);
    else if (e.target.closest("[data-remove]")) removeFromCart(slug);
  });

  loadCart();
}
