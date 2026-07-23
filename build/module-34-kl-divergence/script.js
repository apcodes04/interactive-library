const P = [0.40, 0.25, 0.20, 0.10, 0.05];
let Q = [...P];

const chartP = document.getElementById('chart-p');
const chartQ = document.getElementById('chart-q');
const klValue = document.getElementById('kl-value');
const klReadout = document.getElementById('kl-readout');
const caption = document.getElementById('caption');
const themeToggle = document.querySelector('.theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

// Initialize bars
P.forEach((val, i) => {
  const barP = document.createElement('div');
  barP.className = 'bar';
  barP.style.height = `${val * 100 * 2}px`;
  barP.innerHTML = `<div class="bar-label">${(val*100).toFixed(0)}%</div>`;
  chartP.appendChild(barP);

  const barQ = document.createElement('div');
  barQ.className = 'bar';
  barQ.style.height = `${val * 100 * 2}px`;
  barQ.innerHTML = `<div class="bar-label" id="lbl-q-${i}">${(val*100).toFixed(0)}%</div>`;
  barQ.dataset.idx = i;
  chartQ.appendChild(barQ);
});

const qBars = chartQ.querySelectorAll('.bar');

function updateKL() {
  let div = 0;
  for (let i = 0; i < 5; i++) {
    // protect against 0
    const qv = Math.max(0.001, Q[i]);
    div += P[i] * Math.log(P[i] / qv);
  }
  klValue.textContent = div.toFixed(3);
  
  if (div < 0.01) klReadout.style.color = 'var(--success)';
  else if (div > 0.5) klReadout.style.color = 'var(--danger)';
  else klReadout.style.color = 'var(--active)';
}

function updateQDisplay() {
  Q.forEach((val, i) => {
    qBars[i].style.height = `${val * 100 * 2}px`;
    document.getElementById(`lbl-q-${i}`).textContent = `${(val*100).toFixed(0)}%`;
  });
  updateKL();
}

// Drag logic
let activeIdx = -1;
let startY = 0;
let startVal = 0;

qBars.forEach((bar, i) => {
  bar.addEventListener('mousedown', (e) => {
    activeIdx = i;
    startY = e.clientY;
    startVal = Q[i];
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    caption.classList.add('visible');
  });
  
  bar.addEventListener('touchstart', (e) => {
    activeIdx = i;
    startY = e.touches[0].clientY;
    startVal = Q[i];
    document.addEventListener('touchmove', onTouchMove, {passive: false});
    document.addEventListener('touchend', onUp);
    caption.classList.add('visible');
  });
});

function onMove(e) {
  if (activeIdx === -1) return;
  e.preventDefault();
  handleDrag(e.clientY);
}
function onTouchMove(e) {
  if (activeIdx === -1) return;
  e.preventDefault();
  handleDrag(e.touches[0].clientY);
}

function handleDrag(y) {
  const dy = startY - y; // up is positive
  const diff = dy / 200; // rough scale
  let newVal = Math.max(0.01, startVal + diff);
  
  // temporarily assign
  Q[activeIdx] = newVal;
  
  // renormalize others
  let sumOthers = 0;
  for(let i=0; i<5; i++) {
    if(i !== activeIdx) sumOthers += Q[i];
  }
  
  const targetSumOthers = 1 - newVal;
  if(targetSumOthers < 0.01) {
    newVal = 0.99;
    Q[activeIdx] = newVal;
    sumOthers = 1 - newVal;
  }
  
  const scale = targetSumOthers / Math.max(0.001, sumOthers);
  
  for(let i=0; i<5; i++) {
    if(i !== activeIdx) {
      Q[i] = Math.max(0.001, Q[i] * scale);
    }
  }
  
  updateQDisplay();
}

function onUp() {
  activeIdx = -1;
  document.removeEventListener('mousemove', onMove);
  document.removeEventListener('mouseup', onUp);
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onUp);
}

document.getElementById('btn-snap').addEventListener('click', () => {
  Q = [...P];
  qBars.forEach(bar => bar.style.transition = 'height 0.4s');
  updateQDisplay();
  caption.classList.add('visible');
  setTimeout(() => {
    qBars.forEach(bar => bar.style.transition = 'height 0.1s');
  }, 450);
});

updateKL();

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
