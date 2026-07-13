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

const PRODUCTS = {
  lancamentos: [
    { name: "Top Golden Hour", desc: "Cortininha • Dourado degradê", price: "R$ 149", tag: "Novo", gradient: "linear-gradient(135deg,#ffc15e,#ff8a5b)" },
    { name: "Calcinha Maré Alta", desc: "Asa-delta • Coral", price: "R$ 119", tag: "Novo", gradient: "linear-gradient(135deg,#ff8a5b,#ff6b9d)" },
    { name: "Conjunto Entardecer", desc: "Hot pant • Rosé", price: "R$ 259", tag: "Novo", gradient: "linear-gradient(135deg,#ff6b9d,#ffc15e)" },
    { name: "Top Horizonte", desc: "Triângulo • Turquesa", price: "R$ 149", tag: "Novo", gradient: "linear-gradient(135deg,#2ec4b6,#1b6ca8)" },
    { name: "Saída Maré Baixa", desc: "Kimono leve • Areia", price: "R$ 189", tag: "Novo", gradient: "linear-gradient(135deg,#ffc15e,#2ec4b6)" },
  ],
  maisvendidos: [
    { name: "Conjunto Deep Blue", desc: "Lateral larga • Azul profundo", price: "R$ 249", old: "R$ 289", gradient: "linear-gradient(135deg,#1b6ca8,#0b3d5c)" },
    { name: "Top Recorte Ondas", desc: "Cortininha • Turquesa", price: "R$ 139", gradient: "linear-gradient(135deg,#2ec4b6,#1b6ca8)" },
    { name: "Calcinha Sunset", desc: "Fio • Coral degradê", price: "R$ 109", gradient: "linear-gradient(135deg,#ff8a5b,#ffc15e)" },
    { name: "Maiô Costas Nadador", desc: "Recorte lateral • Rosé", price: "R$ 219", gradient: "linear-gradient(135deg,#ff6b9d,#ff8a5b)" },
    { name: "Conjunto Ilha", desc: "Asa-delta • Verde mar", price: "R$ 259", old: "R$ 299", gradient: "linear-gradient(135deg,#2ec4b6,#0b3d5c)" },
  ],
  ugc: [
    { name: "@ju.ferreira", desc: "usando Top Golden Hour", gradient: "linear-gradient(135deg,#ffc15e,#ff6b9d)" },
    { name: "@carolzinha", desc: "usando Conjunto Ilha", gradient: "linear-gradient(135deg,#2ec4b6,#1b6ca8)" },
    { name: "@marinamota", desc: "usando Saída Maré Baixa", gradient: "linear-gradient(135deg,#ff8a5b,#ffc15e)" },
    { name: "@bebiaz", desc: "usando Conjunto Deep Blue", gradient: "linear-gradient(135deg,#1b6ca8,#0b3d5c)" },
    { name: "@nat.oliveira", desc: "usando Top Horizonte", gradient: "linear-gradient(135deg,#ff6b9d,#2ec4b6)" },
  ],
};

function renderCarousel(id, key) {
  const container = document.getElementById(id);
  if (!container) return;
  const items = PRODUCTS[key] || [];
  container.innerHTML = items.map((item, i) => `
    <article class="product-card">
      <div class="product-card__img" style="background:${item.gradient}">
        ${item.tag ? `<span class="product-card__tag">${item.tag}</span>` : ""}
        <button class="product-card__fav" data-fav aria-label="Favoritar ${item.name}">♡</button>
      </div>
      <div class="product-card__body">
        <p class="product-card__name">${item.name}</p>
        <p class="product-card__desc">${item.desc}</p>
        ${item.price ? `
        <div class="product-card__footer">
          <span>${item.old ? `<span class="product-card__old">${item.old}</span>` : ""}<span class="product-card__price">${item.price}</span></span>
          <button class="product-card__add" data-add aria-label="Adicionar ${item.name} ao carrinho">+</button>
        </div>` : ""}
      </div>
    </article>
  `).join("");
}

renderCarousel("carousel-lancamentos", "lancamentos");
renderCarousel("carousel-maisvendidos", "maisvendidos");
renderCarousel("carousel-ugc", "ugc");

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

document.addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]");
  if (fav) {
    const active = fav.classList.toggle("is-active");
    fav.textContent = active ? "♥" : "♡";
    wishlistCount += active ? 1 : -1;
    wishlistBadge.textContent = wishlistCount;
    bump(wishlistBadge);
  }
  const add = e.target.closest("[data-add]");
  if (add) {
    cartCount += 1;
    cartBadge.textContent = cartCount;
    bump(cartBadge);
  }
});

const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("is-open");
  menuToggle.classList.toggle("is-active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
  mobileNav.classList.remove("is-open");
  menuToggle.classList.remove("is-active");
  menuToggle.setAttribute("aria-expanded", "false");
}));

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

const ALL_PRODUCTS = [...PRODUCTS.lancamentos, ...PRODUCTS.maisvendidos];

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

const newsletterForm = document.getElementById("newsletterForm");
const newsletterFeedback = document.getElementById("newsletterFeedback");
newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  newsletterFeedback.textContent = "Prontinho! Cupom VEIGA10 chegando no seu e-mail 🌅";
  newsletterForm.reset();
});
