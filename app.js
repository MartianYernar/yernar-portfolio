document.getElementById('yr').textContent = new Date().getFullYear();

// ---- mobile nav ----
const burger = document.getElementById('burger'), navlinks = document.getElementById('navlinks');
burger.addEventListener('click', () => navlinks.classList.toggle('open'));
navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navlinks.classList.remove('open')));

// ---- cursor glow ----
const glow = document.getElementById('cursorGlow');
addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

// ---- helpers ----
const CL = window.CLUSTERS || [];
const byKey = {}; CL.forEach(c => byKey[c.key] = c);
function card(src, cap, cls) {
  const d = document.createElement('div'); d.className = cls;
  d.dataset.src = src; d.dataset.cap = cap || '';
  d.innerHTML = `<img src="${src}" alt="${(cap||'').replace(/"/g,'&quot;')}" loading="lazy">`;
  return d;
}
function setIdx(parent) {
  const kids = [...parent.children]; const n = kids.length;
  kids.forEach((k, i) => { k.style.setProperty('--i', i); k.style.setProperty('--n', n); });
}

// ---- hero fan ----
const heroImgs = ['images/hero-avatar.jpg','images/hero-soilyget.jpg','images/hero-research.png','images/hero-smartgarbage.jpg','images/hero-heartcare.jpg'];
const heroFan = document.getElementById('heroFan');
heroImgs.forEach(s => heroFan.appendChild(card(s, '', 'fan-card')));
setIdx(heroFan);
// parallax tilt
const heroSection = document.querySelector('.hero');
heroSection.addEventListener('mousemove', e => {
  const r = heroSection.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  heroFan.style.transform = `rotateY(${x*14}deg) rotateX(${-y*14}deg)`;
});
heroSection.addEventListener('mouseleave', () => heroFan.style.transform = '');

// ---- featured work hover fans ----
document.querySelectorAll('.work-row').forEach(row => {
  let imgs = [];
  if (row.dataset.imgs) imgs = row.dataset.imgs.split(',').filter(Boolean).map(s => ({src:s,cap:''}));
  else if (row.dataset.clusters) row.dataset.clusters.split(',').filter(Boolean).forEach(k => {
    if (byKey[k]) imgs = imgs.concat(byKey[k].images);
  });
  imgs = imgs.slice(0, 5);
  if (!imgs.length) return;
  const fan = document.createElement('div'); fan.className = 'w-fan';
  imgs.forEach(im => fan.appendChild(card(im.src, im.cap, 'fc')));
  setIdx(fan);
  row.appendChild(fan);
});

// ---- evidence gallery (clusters) ----
const wrap = document.getElementById('clusters');
CL.forEach(c => {
  const sec = document.createElement('div'); sec.className = 'cluster'; sec.dataset.group = c.group;
  const head = document.createElement('div'); head.className = 'c-head';
  head.innerHTML = `<h3>${c.title}</h3><span>${c.result||''}</span>`;
  const stack = document.createElement('div'); stack.className = 'c-stack';
  c.images.forEach(im => stack.appendChild(card(im.src, im.cap, 'card')));
  setIdx(stack);
  sec.appendChild(head); sec.appendChild(stack); wrap.appendChild(sec);
});

// ---- filters ----
document.getElementById('filters').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  b.classList.add('active');
  const g = b.dataset.g;
  document.querySelectorAll('.cluster').forEach(cl => cl.style.display = (g==='all'||cl.dataset.group===g) ? '' : 'none');
});

// ---- lightbox ----
const lb = document.getElementById('lightbox'), lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap');
let cur = null;
function visCards(){ return [...document.querySelectorAll('#clusters .cluster')].filter(c=>c.style.display!=='none').flatMap(c=>[...c.querySelectorAll('.card')]); }
function open(el){ cur=el; lbImg.src=el.dataset.src; lbImg.alt=el.dataset.cap; lbCap.textContent=el.dataset.cap; lb.classList.add('open'); document.body.style.overflow='hidden'; }
function close(){ lb.classList.remove('open'); document.body.style.overflow=''; }
function step(d){ const v=visCards(); const i=v.indexOf(cur); if(i<0)return; open(v[(i+d+v.length)%v.length]); }
wrap.addEventListener('click', e => { const el=e.target.closest('.card'); if(el) open(el); });
document.getElementById('lbClose').addEventListener('click', close);
document.getElementById('lbPrev').addEventListener('click', () => step(-1));
document.getElementById('lbNext').addEventListener('click', () => step(1));
lb.addEventListener('click', e => { if(e.target===lb) close(); });
addEventListener('keydown', e => { if(!lb.classList.contains('open'))return; if(e.key==='Escape')close(); if(e.key==='ArrowLeft')step(-1); if(e.key==='ArrowRight')step(1); });

// ---- scroll reveal (fade in + out) ----
const io = new IntersectionObserver(es => es.forEach(en => en.target.classList.toggle('visible', en.isIntersecting)), {threshold:.08, rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
