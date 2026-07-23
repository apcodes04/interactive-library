let depth = 0;
const maxDepth = 3;

const scrubber = document.getElementById('scrubber');
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');
const btnReset = document.getElementById('btn-reset');
const depthBtns = document.querySelectorAll('.depth-btn');
const caption = document.getElementById('caption');
const readouts = document.querySelectorAll('.readout');

const nodesD1 = document.querySelectorAll('.d1');
const nodesD2 = document.querySelectorAll('.d2');
const nodesD3 = document.querySelectorAll('.d3');

function updateVis() {
  scrubber.value = depth;
  depthBtns.forEach(b => {
    b.classList.remove('active');
    if (parseInt(b.dataset.depth) === depth) b.classList.add('active');
  });
  
  nodesD1.forEach(n => { if(depth >= 1 && !n.classList.contains('faded')) n.classList.add('visible'); else n.classList.remove('visible'); });
  nodesD2.forEach(n => { if(depth >= 2 && !n.classList.contains('faded')) n.classList.add('visible'); else n.classList.remove('visible'); });
  nodesD3.forEach(n => { if(depth >= 3 && !n.classList.contains('faded')) n.classList.add('visible'); else n.classList.remove('visible'); });
  
  document.querySelectorAll('.d1.faded').forEach(n => { if(depth >= 1) n.style.opacity = '0.7'; else n.style.opacity = '0'; });
  document.querySelectorAll('.d2.faded').forEach(n => { if(depth >= 2) n.style.opacity = '0.7'; else n.style.opacity = '0'; });
  document.querySelectorAll('.d3.faded').forEach(n => { if(depth >= 3) n.style.opacity = '0.7'; else n.style.opacity = '0'; });
  
  if (depth === 3) {
    readouts.forEach(r => r.style.display = 'block');
  } else {
    readouts.forEach(r => r.style.display = 'none');
  }
  
  btnBack.disabled = depth === 0;
  btnNext.disabled = depth === maxDepth;
  
  if (depth > 0) caption.classList.add('visible');
}

scrubber.addEventListener('input', (e) => {
  depth = parseInt(e.target.value);
  updateVis();
});

btnNext.addEventListener('click', () => {
  if (depth < maxDepth) { depth++; updateVis(); }
});
btnBack.addEventListener('click', () => {
  if (depth > 0) { depth--; updateVis(); }
});
btnReset.addEventListener('click', () => {
  depth = 0; updateVis();
});

depthBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    depth = parseInt(btn.dataset.depth);
    updateVis();
  });
});

updateVis();

const themeToggle = document.querySelector('.theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');
let isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
const applyTheme = () => {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  iconSun.style.display = isDark ? 'block' : 'none';
  iconMoon.style.display = isDark ? 'none' : 'block';
};
applyTheme();
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  applyTheme();
});
