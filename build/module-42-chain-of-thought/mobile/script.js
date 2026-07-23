
const themeBtn = document.querySelector('.theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');
const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
if (currentTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  iconSun.style.display = 'block'; iconMoon.style.display = 'none';
}
themeBtn.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  iconSun.style.display = isDark ? 'none' : 'block';
  iconMoon.style.display = isDark ? 'block' : 'none';
});
let interacted = false;
function markInteracted() {
  if (!interacted) { interacted = true; document.getElementById('caption').classList.add('visible'); }
}

const textDirect = "1,592";
const textCot = "47 × 36 = 47 × 30 + 47 × 6 = 1,410 + 282 = 1,692";
const btnRun = document.getElementById('btn-run');
const ansDirect = document.getElementById('ans-direct');
const ansCot = document.getElementById('ans-cot');
const explain = document.getElementById('explain');
let isRunning = false;

btnRun.addEventListener('click', () => {
  if (isRunning) return;
  isRunning = true;
  markInteracted();
  ansDirect.innerHTML = ''; ansCot.innerHTML = '';
  explain.textContent = "Generating answers...";
  
  let iDirect = 0, iCot = 0;
  
  const timerDirect = setInterval(() => {
    if (iDirect < textDirect.length) {
      ansDirect.textContent += textDirect.charAt(iDirect);
      iDirect++;
    } else {
      clearInterval(timerDirect);
      ansDirect.innerHTML = `<span style="color:var(--danger)">${textDirect}</span>`;
    }
  }, 150); // slow it down to finish roughly same time or earlier
  
  const timerCot = setInterval(() => {
    if (iCot < textCot.length) {
      ansCot.textContent += textCot.charAt(iCot);
      iCot++;
    } else {
      clearInterval(timerCot);
      ansCot.innerHTML = textCot.replace("1,692", `<span style="color:var(--success)">1,692</span>`);
      explain.textContent = "Generation complete. Direct answer is incorrect, chain-of-thought is correct.";
      isRunning = false;
    }
  }, 30);
});
    