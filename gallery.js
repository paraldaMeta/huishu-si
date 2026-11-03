import { createTypographyVortexRenderer } from './racso/vortex.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const orbit = document.querySelector('#orbit');
let stopOrbit;
function syncMotion() {
  stopOrbit?.();
  stopOrbit = reduced.matches ? null : createTypographyVortexRenderer(orbit, orbit.firstElementChild, () => ({
    phrase: 'HUISHU SI / INTERACTIVE ARCHIVE / ', mode: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    speed: .65, ringGrowth: 1.24, opacity: .84, dissolveRadius: .85, particleAmount: .8, suctionDuration: 840
  }));
}
syncMotion();
reduced.addEventListener('change', syncMotion);
const editions = [
  ['Rumi · 创作工作室','剪辑台','#bb5547'], ['获客松','增长实验室','#4e7189'],
  ['XV 塔罗 · 3D 牌桌','翻牌室','#78569a'], ['尼兹瓦 · 黄金时刻','日落漫游','#a16c35'],
  ['回向','静心室','#687b60'], ['Racso','素材档案','#515993']
];
const dialog = document.querySelector('#preview');
window.showProject = p => {
  dialog.querySelector('img').src = p.shot;
  dialog.querySelector('img').alt = p.title + ' 界面';
  dialog.querySelector('h2').textContent = p.title;
  dialog.querySelector('p').textContent = p.desc;
  const link = dialog.querySelector('a');
  link.hidden = !p.url;
  if (p.url) link.href = p.url;
  dialog.showModal();
};
function closePreview() {
  if (reduced.matches) return dialog.close();
  dialog.animate([{opacity:1},{opacity:0,transform:'translateY(10px)'}],{duration:140}).finished.then(() => dialog.close());
}
dialog.querySelector('button').onclick = closePreview;
dialog.oncancel = e => { e.preventDefault(); closePreview(); };
dialog.onclick = e => { 
  if(e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closePreview();
  }
};
document.querySelector('.btn-wrapper').addEventListener('click', e => {
  e.preventDefault();
  document.querySelector('#chips button').click();
  document.querySelector('#filters').scrollIntoView();
});
const shelf = document.querySelector('#shelf');
for (const [i,[name,label,color]] of editions.entries()) {
  const p = window.PROJECTS.find(item => item.title === name);
  if (!p) continue;
  const number = String(i+1).padStart(2,'0');
  const book = document.createElement('a');
  book.className = 'book-card';
  book.href = '#work-'+number;
  book.setAttribute('aria-label','查看精选作品 '+name);
  book.style.setProperty('--cover-color',color);
  book.style.setProperty('--cover','url("'+p.shot+'")');
  book.innerHTML = '<span class="book"><span class="book-shadow"></span><span class="book-back"></span><span class="page-block"></span><span class="front-cover"><b></b></span></span><small></small>';
  book.querySelector('b').textContent = number;
  book.querySelector('small').textContent = label;
  shelf.append(book);
  const scene = document.createElement('article');
  scene.className = 'scene';
  scene.id = 'work-'+number;
  scene.style.setProperty('--tone',color);
  scene.innerHTML = '<div><small></small><h3></h3><p></p><a target="_blank" rel="noopener">进入作品 ↗</a></div><button type="button"><img loading="lazy" alt=""></button>';
  scene.querySelector('small').textContent = 'PLATE '+number+' / 06　 ·　'+label;
  scene.querySelector('h3').textContent = name;
  scene.querySelector('p').textContent = [p.lock,p.desc].filter(Boolean).join(' · ');
  scene.querySelector('a').href = p.url;
  scene.querySelector('img').src = p.shot;
  scene.querySelector('button').setAttribute('aria-label','放大 '+name);
  scene.querySelector('button').onclick = () => window.showProject(p);
  document.querySelector('#scenes').append(scene);
}
for(const frame of document.querySelectorAll('.card-frame')) {
  frame.onpointermove = e => {
    if(e.pointerType !== 'mouse' || reduced.matches) return;
    const r = frame.getBoundingClientRect();
    frame.style.setProperty('--tilt', ((e.clientX-r.left)/r.width-.5)*5+'deg');
  };
  frame.onpointerleave = () => frame.style.removeProperty('--tilt');
}
const mark = document.querySelector('.endmark');
mark.style.backgroundImage = editions.map(([name])=>window.PROJECTS.find(p=>p.title===name)?.shot).filter(Boolean).map(s=>'url("'+s+'")').join(',');
if(location.hash === '#recent' || location.hash === '#all') document.querySelector('#filters').scrollIntoView();
