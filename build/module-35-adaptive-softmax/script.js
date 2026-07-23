const frequentWords = ['the', 'a', 'is', 'and', 'to'];
let cost = 0;

const input = document.getElementById('word-input');
const btnDrop = document.getElementById('btn-drop');
const btnReset = document.getElementById('btn-reset');
const costReadout = document.getElementById('cost-readout');
const ball = document.getElementById('ball');
const tierHead = document.getElementById('tier-head');
const tierTail = document.getElementById('tier-tail');
const caption = document.getElementById('caption');
const themeToggle = document.querySelector('.theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

btnDrop.addEventListener('click', () => {
  const word = input.value.trim().toLowerCase();
  if (!word) return;
  
  btnDrop.disabled = true;
  caption.classList.add('visible');
  
  // reset state
  ball.style.top = '0px';
  ball.className = 'ball dropping';
  tierHead.classList.remove('lit');
  tierTail.classList.remove('lit');
  
  const isFrequent = frequentWords.includes(word);
  
  setTimeout(() => {
    if (isFrequent) {
      ball.style.top = '120px'; // middle of head tier
      setTimeout(() => {
        ball.classList.add('head-land');
        tierHead.classList.add('lit');
        cost += 1;
        costReadout.textContent = cost;
        btnDrop.disabled = false;
        input.value = '';
      }, 400);
    } else {
      ball.style.top = '220px'; // middle of tail tier
      setTimeout(() => {
        ball.classList.add('tail-land');
        tierTail.classList.add('lit');
        cost += 3;
        costReadout.textContent = cost;
        btnDrop.disabled = false;
        input.value = '';
      }, 400);
    }
  }, 50);
});

btnReset.addEventListener('click', () => {
  cost = 0;
  costReadout.textContent = '0';
  ball.className = 'ball';
  tierHead.classList.remove('lit');
  tierTail.classList.remove('lit');
  input.value = '';
});

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
