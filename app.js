// ---- year ----
document.getElementById('yr').textContent = new Date().getFullYear();

// ---- mobile nav ----
const burger = document.getElementById('burger');
const navlinks = document.getElementById('navlinks');
burger.addEventListener('click', () => navlinks.classList.toggle('open'));
navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navlinks.classList.remove('open')));

// ---- build gallery ----
const grid = document.getElementById('gallery-grid');
const items = (window.GALLERY || []);
items.forEach(it => {
  const d = document.createElement('div');
  d.className = 'g-item';
  d.dataset.cat = it.cat;
  d.dataset.src = it.src;
  d.dataset.cap = it.cap;
  d.innerHTML = `<img src="${it.src}" alt="${it.cap.replace(/"/g,'&quot;')}" loading="lazy">`
              + `<div class="cap">${it.cap}</div>`;
  grid.appendChild(d);
});

// ---- filters ----
document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const cat = btn.dataset.cat;
  grid.querySelectorAll('.g-item').forEach(el => {
    el.style.display = (cat === 'all' || el.dataset.cat === cat) ? '' : 'none';
  });
});

// ---- lightbox ----
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCap');
let currentEl = null;

function visibleItems() {
  return [...grid.querySelectorAll('.g-item')].filter(el => el.style.display !== 'none');
}
function openLB(el) {
  currentEl = el;
  lbImg.src = el.dataset.src;
  lbImg.alt = el.dataset.cap;
  lbCap.textContent = el.dataset.cap;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLB() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}
function step(dir) {
  const vis = visibleItems();
  const i = vis.indexOf(currentEl);
  if (i === -1) return;
  openLB(vis[(i + dir + vis.length) % vis.length]);
}
grid.addEventListener('click', e => {
  const el = e.target.closest('.g-item');
  if (el) openLB(el);
});
document.getElementById('lbClose').addEventListener('click', closeLB);
document.getElementById('lbPrev').addEventListener('click', () => step(-1));
document.getElementById('lbNext').addEventListener('click', () => step(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});

// ---- scroll reveal ----
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
