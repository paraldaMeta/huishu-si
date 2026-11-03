const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const dialog = document.querySelector('#preview');
window.showProject = p => {
  dialog.querySelector('img').src = p.shot;
  dialog.querySelector('img').alt = p.title + ' 界面';
  dialog.querySelector('h2').textContent = p.title;
  dialog.querySelector('p').textContent = p.desc;
  const link = dialog.querySelector('a');
  link.hidden = !p.url;
  if (p.url) link.href = p.url;
  dialog.querySelector('a').textContent = '打开项目 ↗';
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
for(const frame of document.querySelectorAll('.card-frame')) {
  frame.onpointermove = e => {
    if(e.pointerType !== 'mouse' || reduced.matches) return;
    const r = frame.getBoundingClientRect();
    frame.style.setProperty('--tilt', ((e.clientX-r.left)/r.width-.5)*5+'deg');
  };
  frame.onpointerleave = () => frame.style.removeProperty('--tilt');
}
import { constellation } from './racso/constellation.js';

const signal = document.querySelector('.archive-signal');
const signalTitle = document.querySelector('#signal-title');
const signalCount = document.querySelector('#signal-count');
const chips = document.querySelector('#chips');
const ease = 'cubic-bezier(.16,1,.3,1)';

function updateSignal() {
  const selected = chips.querySelector('[aria-pressed="true"]');
  signalTitle.textContent = selected.firstChild.textContent;
  signalCount.textContent = selected.querySelector('.n').textContent.padStart(2, '0');
  if (!reduced.matches) {
    signalTitle.animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0)'}], {duration:480,easing:ease});
    signalCount.animate([{transform:'translateY(12px)',opacity:.25},{transform:'none',opacity:1}], {duration:400,easing:ease});
  }
}
updateSignal();
chips.addEventListener('click', updateSignal);
document.addEventListener('gallery-filter', updateSignal);
constellation(signal, signal.querySelector('canvas'), reduced);

const reveal = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const node = entry.target;
    reveal.unobserve(node);
    node.classList.add('in-view');
  }
}, {threshold:.09});
document.querySelectorAll('.section-head,.card-frame,.scene,.endmark,.book-card').forEach(node => reveal.observe(node));

const archive = document.querySelector('#archive');
const room = document.querySelector('#studio');
const rail = document.querySelector('.room-scroll');
const objects = [...room.querySelectorAll('.object')];
const products = ['OscarFlix','尼兹瓦 · 黄金时刻','XV 塔罗 · 3D 牌桌'];
const art = room.querySelector('.room-art');
let sequence;
async function perform(target, frames, duration, complete) {
  if (sequence) return;
  if (reduced.matches) return complete();
  const animation = target.animate(frames, {duration, easing:'cubic-bezier(.33,.05,.19,1)', fill:'both'});
  sequence = animation;
  room.classList.add('in-action');
  try {
    await animation.finished;
    if (!room.hidden) complete();
  } catch (error) {
    if (error.name !== 'AbortError') throw error;
  } finally {
    animation.cancel();
    sequence = null;
    room.classList.remove('in-action');
  }
}
function visitObject(i, open) {
  if (i === 0) return perform(room.querySelector('.film-strip'), [
    {transform:'translate(-55%,72%) rotate(-13deg) scale(.65)',opacity:0},
    {opacity:1,offset:.22},
    {transform:'translate(8%,-20%) rotate(-5deg) scale(1.08)',opacity:1,offset:.85},
    {transform:'translate(8%,-20%) rotate(-5deg) scale(1.08)',opacity:1}
  ],1050,open);
  if (i === 1) {
    const rect = art.getBoundingClientRect();
    const x = rect.left + rect.width * .57;
    const y = rect.top + rect.height * .449;
    art.style.transformOrigin = '57% 44.9%';
    const travel = 'translate('+(innerWidth/2-x)+'px,'+(innerHeight/2-y)+'px) scale(3.3)';
    return perform(art, [{transform:'none'},{transform:travel}],1250,open);
  }
  open();
}
room.querySelectorAll('a[href="#all"]').forEach(link => {
  link.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (sequence) return;
    const drawer = room.querySelector('.drawer-prop');
    if (rail.scrollWidth > rail.clientWidth) rail.scrollLeft = drawer.offsetLeft + drawer.offsetWidth/2 - rail.clientWidth/2;
    perform(drawer, [{ '--pull':'0%' },{ '--pull':'95%',offset:.78 },{ '--pull':'95%' }],950,() => { location.hash = 'all'; });
  });
});
reduced.addEventListener('change', () => { if (reduced.matches) sequence?.finish(); });
objects.forEach((object, i) => {
  const project = PROJECTS.find(p => p.title === products[i]);
  object.setAttribute('aria-label', object.textContent.trim() + '，打开' + project.title);
  object.onclick = () => visitObject(i, () => {
    window.showProject(project);
    dialog.dataset.object = ['film','city','tarot'][i];
    dialog.querySelector('a').textContent = ['进入 OscarFlix · 需登录 ↗','进入黄金时刻 ↗','进入 XV 牌桌 ↗'][i];
  });
});
dialog.addEventListener('close', () => delete dialog.dataset.object);
room.querySelectorAll('.total').forEach(n => n.textContent = PROJECTS.length);
function openRoomOrArchive() {
  const key = location.hash.slice(1);
  const opened = ['all','recent','filters',...Object.keys(CATEGORIES)].includes(key);
  if (opened) sequence?.cancel();
  room.hidden = opened;
  archive.hidden = !opened;
  if (opened) {
    if (key === 'filters') chips.querySelector('button').click();
    archive.scrollIntoView();
    archive.querySelector('a').focus({preventScroll:true});
  } else {
    rail.scrollLeft = (rail.scrollWidth - rail.clientWidth) / 2;
    if (key === 'studio') rail.focus({preventScroll:true});
    window.scrollTo(0, 0);
  }
}
openRoomOrArchive();
window.addEventListener('hashchange', openRoomOrArchive);
