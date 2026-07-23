// Theme toggle
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

const states = [
  ["u", "n", "h", "a", "p", "p", "i", "n", "e", "s", "s"],
  ["u", "n", "h", "a", "pp", "i", "n", "e", "s", "s"],
  ["u", "n", "h", "a", "pp", "i", "n", "e", "ss"],
  ["u", "n", "h", "a", "pp", "i", "n", "ess"],
  ["u", "n", "h", "a", "pp", "i", "ness"],
  ["u", "n", "h", "app", "i", "ness"],
  ["u", "n", "happ", "i", "ness"],
  ["u", "n", "happi", "ness"],
  ["un", "happi", "ness"]
];

const explainTexts = [
  "Start at step 0: the word 'unhappiness' broken down into 11 single characters.",
  "Merge p+p → pp. The model learns 'pp' occurs frequently.",
  "Merge s+s → ss. Another frequent character pair.",
  "Merge e+ss → ess. Grouping characters into common suffixes.",
  "Merge n+ess → ness. We have now formed a complete subword 'ness'.",
  "Merge a+pp → app. Merging the middle letters.",
  "Merge h+app → happ. Combining into 'happ'.",
  "Merge happ+i → happi. Combining to form the root 'happi'.",
  "Merge u+n → un. Final merge: grouping the prefix 'un'. We now have 3 recognizable tokens!"
];

let currentStep = 0;
let interacted = false;
const wordContainer = document.getElementById('word-container');
const scrubber = document.getElementById('scrubber');
const stepReadout = document.getElementById('step-readout');
const explain = document.getElementById('explain');
const caption = document.getElementById('caption');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');
const stageStrip = document.getElementById('stage-strip');

for (let i = 0; i <= 8; i++) {
  const btn = document.createElement('button');
  btn.className = 'stage-btn';
  btn.textContent = i;
  btn.addEventListener('click', () => setStep(i));
  stageStrip.appendChild(btn);
}
const stageBtns = document.querySelectorAll('.stage-btn');

function setStep(newStep) {
  if (newStep < 0 || newStep > 8) return;
  const isAdjacent = Math.abs(newStep - currentStep) === 1;
  currentStep = newStep;
  
  if (!interacted) { interacted = true; caption.classList.add('visible'); }
  
  scrubber.value = currentStep;
  stepReadout.textContent = currentStep;
  explain.textContent = explainTexts[currentStep];
  
  btnPrev.disabled = currentStep === 0;
  btnNext.disabled = currentStep === 8;
  
  stageBtns.forEach((b, i) => {
    if (i === currentStep) b.classList.add('active');
    else b.classList.remove('active');
  });
  
  renderDiagram(isAdjacent);
}

function renderDiagram(animate) {
  wordContainer.innerHTML = '';
  const currentTokens = states[currentStep];
  
  currentTokens.forEach(token => {
    const box = document.createElement('div');
    box.className = 'token-box';
    box.textContent = token;
    
    if (animate && currentStep > 0) {
      const prevTokens = states[currentStep - 1];
      if (!prevTokens.includes(token)) {
        box.classList.add('merged');
      }
    }
    
    wordContainer.appendChild(box);
  });
}

btnNext.addEventListener('click', () => setStep(currentStep + 1));
btnPrev.addEventListener('click', () => setStep(currentStep - 1));
scrubber.addEventListener('input', (e) => setStep(parseInt(e.target.value, 10)));
btnReset.addEventListener('click', () => setStep(0));

setStep(0);
