document.getElementById('yr').textContent = new Date().getFullYear();

// mobile nav
const burger = document.getElementById('burger'), navlinks = document.getElementById('navlinks');
burger.addEventListener('click', () => navlinks.classList.toggle('open'));
navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navlinks.classList.remove('open')));

// cursor glow
const glow = document.getElementById('cursorGlow');
addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

const CL = window.CLUSTERS || [];
const byKey = {}; CL.forEach(c => byKey[c.key] = c);

// ---- hero marquee (big flowing image columns) ----
const heroPics = ['images/hero-avatar.jpg','images/hero-soilyget.jpg','images/hero-smartgarbage.jpg','images/hero-heartcare.jpg'];
['avatar','ftc','info26','nishack','itfest','scup','mentees','intern','wro'].forEach(k => {
  if (byKey[k] && byKey[k].images[0]) heroPics.push(byKey[k].images[0].src);
});
const uniq = [...new Set(heroPics)];
const colA = uniq.filter((_, i) => i % 2 === 0);
const colB = uniq.filter((_, i) => i % 2 === 1);
function buildCol(list) {
  const col = document.createElement('div'); col.className = 'mq-col';
  const track = document.createElement('div'); track.className = 'mq-track';
  list.concat(list).forEach(src => {            // duplicate for seamless loop
    const img = document.createElement('img'); img.src = src; img.loading = 'lazy'; img.alt = '';
    track.appendChild(img);
  });
  col.appendChild(track); return col;
}
const mq = document.getElementById('heroMarquee');
mq.appendChild(buildCol(colA)); mq.appendChild(buildCol(colB));

// ---- helpers ----
function card(src, cap, cls) {
  const d = document.createElement('div'); d.className = cls;
  d.dataset.src = src; d.dataset.cap = cap || '';
  d.innerHTML = `<img src="${src}" alt="${(cap||'').replace(/"/g,'&quot;')}" loading="lazy">`;
  return d;
}
function setIdx(parent) {
  const kids = [...parent.children], n = kids.length;
  kids.forEach((k, i) => { k.style.setProperty('--i', i); k.style.setProperty('--n', n); });
}

// ---- featured-work hover fans ----
document.querySelectorAll('.work-row').forEach(row => {
  let imgs = [];
  if (row.dataset.imgs) imgs = row.dataset.imgs.split(',').filter(Boolean).map(s => ({src:s,cap:''}));
  else if (row.dataset.clusters) row.dataset.clusters.split(',').filter(Boolean).forEach(k => { if (byKey[k]) imgs = imgs.concat(byKey[k].images); });
  if (!imgs.length) return;
  // ensure one "set" is wide enough (>=2200px) so the seamless x2 loop never gaps, however few images exist
  const ITEM_W = 314; // 300px card + 14px gap
  let set = imgs.slice();
  while (set.length * ITEM_W < 2200) set = set.concat(imgs);
  const strip = document.createElement('div'); strip.className = 'w-strip';
  const track = document.createElement('div'); track.className = 'w-track';
  set.concat(set).forEach(im => track.appendChild(card(im.src, im.cap || '', 'fc')));
  strip.appendChild(track); row.appendChild(strip);
});

// ---- evidence: big image grids per cluster ----
const wrap = document.getElementById('clusters');
CL.forEach(c => {
  const sec = document.createElement('div'); sec.className = 'cluster'; sec.dataset.group = c.group;
  const head = document.createElement('div'); head.className = 'c-head';
  head.innerHTML = `<h3>${c.title}</h3><span>${c.result||''}</span>`;
  const imgs = document.createElement('div'); imgs.className = 'c-imgs';
  c.images.forEach(im => imgs.appendChild(card(im.src, im.cap, 'card')));
  sec.appendChild(head); sec.appendChild(imgs); wrap.appendChild(sec);
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
function vis(){ return [...document.querySelectorAll('#clusters .cluster')].filter(c=>c.style.display!=='none').flatMap(c=>[...c.querySelectorAll('.card')]); }
function open(el){ cur=el; lbImg.src=el.dataset.src; lbImg.alt=el.dataset.cap; lbCap.textContent=el.dataset.cap; lb.classList.add('open'); document.body.style.overflow='hidden'; }
function close(){ lb.classList.remove('open'); document.body.style.overflow=''; }
function step(d){ const v=vis(), i=v.indexOf(cur); if(i<0)return; open(v[(i+d+v.length)%v.length]); }
wrap.addEventListener('click', e => { const el=e.target.closest('.card'); if(el) open(el); });
document.getElementById('lbClose').addEventListener('click', close);
document.getElementById('lbPrev').addEventListener('click', () => step(-1));
document.getElementById('lbNext').addEventListener('click', () => step(1));
lb.addEventListener('click', e => { if(e.target===lb) close(); });
addEventListener('keydown', e => { if(!lb.classList.contains('open'))return; if(e.key==='Escape')close(); if(e.key==='ArrowLeft')step(-1); if(e.key==='ArrowRight')step(1); });

// ---- scroll reveal (fade in + out) ----
const io = new IntersectionObserver(es => es.forEach(en => en.target.classList.toggle('visible', en.isIntersecting)), {threshold:.08, rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
