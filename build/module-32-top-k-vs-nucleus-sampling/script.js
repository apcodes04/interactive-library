const dataConf = [0.95, 0.02, 0.01, 0.005, 0.005, 0.003, 0.003, 0.002, 0.001, 0.001];
const dataUnc = [0.14, 0.13, 0.12, 0.11, 0.10, 0.10, 0.09, 0.08, 0.07, 0.06];

let currentData = dataConf;
let k = 3;
let p = 0.9;

const chart = document.getElementById('chart');
const kSlider = document.getElementById('k-slider');
const pSlider = document.getElementById('p-slider');
const kVal = document.getElementById('k-val');
const pVal = document.getElementById('p-val');
const btnConf = document.getElementById('btn-confident');
const btnUnc = document.getElementById('btn-uncertain');
const readK = document.getElementById('readout-k');
const readP = document.getElementById('readout-p');
const caption = document.getElementById('caption');

for (let i = 0; i < 10; i++) {
  const w = document.createElement('div');
  w.className = 'bar-wrapper';
  w.innerHTML = `<div class="bar" id="bar-${i}"></div><div class="bar-label" id="lbl-${i}"></div>`;
  chart.appendChild(w);
}

function update() {
  let pSum = 0;
  let pCount = 0;
  
  for (let i = 0; i < 10; i++) {
    const val = currentData[i];
    const bar = document.getElementById(`bar-${i}`);
    const lbl = document.getElementById(`lbl-${i}`);
    
    // Scale for visual: max confident is 0.95, max uncertain is 0.14
    // We scale so the tallest is near 100% height.
    const maxVal = Math.max(...currentData);
    bar.style.height = `${(val / maxVal) * 90}%`;
    lbl.textContent = val.toFixed(3);
    
    // K logic
    if (i < k) {
      bar.classList.add('k-sel');
    } else {
      bar.classList.remove('k-sel');
    }
    
    // P logic
    if (pSum < p) {
      bar.classList.add('p-sel');
      pCount++;
      pSum += val;
    } else {
      bar.classList.remove('p-sel');
    }
  }
  
  readK.textContent = k;
  readP.textContent = pCount;
}

kSlider.addEventListener('input', (e) => {
  k = parseInt(e.target.value);
  kVal.textContent = k;
  caption.classList.add('visible');
  update();
});

pSlider.addEventListener('input', (e) => {
  p = parseFloat(e.target.value);
  pVal.textContent = p.toFixed(2);
  caption.classList.add('visible');
  update();
});

btnConf.addEventListener('click', () => {
  currentData = dataConf;
  btnConf.classList.add('active');
  btnUnc.classList.remove('active');
  caption.classList.add('visible');
  update();
});

btnUnc.addEventListener('click', () => {
  currentData = dataUnc;
  btnUnc.classList.add('active');
  btnConf.classList.remove('active');
  caption.classList.add('visible');
  update();
});

update();

// Theme toggle
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
