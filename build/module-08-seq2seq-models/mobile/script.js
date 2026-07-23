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

const stages = ["Encoded", "Je", "suis", "très", "fatigué"];
const explainTexts = [
  "Encoding complete. All 4 input words have been compressed into the Context vector.",
  "Decoded word 1: 'Je'. Extracted from the Context vector.",
  "Decoded word 2: 'suis'. Extracted from the Context vector.",
  "Decoded word 3: 'très'. Extracted from the Context vector.",
  "Decoded word 4: 'fatigué'. All output words generated from the single context vector."
];

let currentStep = 0;
let interacted = false;
let isReady = false;

const scrubber = document.getElementById('scrubber');
const explain = document.getElementById('explain');
const caption = document.getElementById('caption');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');
const stageStrip = document.getElementById('stage-strip');
const contextVector = document.getElementById('context-vector');
const diagramArea = document.getElementById('diagram-area');

const flyingToken = document.createElement('div');
flyingToken.className = 'flying-token';
diagramArea.appendChild(flyingToken);

stages.forEach((label, i) => {
  const btn = document.createElement('button');
  btn.className = 'stage-btn';
  btn.textContent = label;
  btn.disabled = true;
  btn.addEventListener('click', () => { if(isReady) setStep(i); });
  stageStrip.appendChild(btn);
});
const stageBtns = document.querySelectorAll('.stage-btn');

function pulseCircle() {
  contextVector.classList.remove('pulse');
  void contextVector.offsetWidth; // trigger reflow
  contextVector.classList.add('pulse');
}

function setStep(newStep) {
  if (newStep < 0 || newStep > 4) return;
  const isForwardMove = newStep === currentStep + 1;
  currentStep = newStep;
  
  if (!interacted) { interacted = true; caption.classList.add('visible'); }
  
  scrubber.value = currentStep;
  explain.textContent = explainTexts[currentStep];
  
  btnPrev.disabled = currentStep === 0;
  btnNext.disabled = currentStep === 4;
  
  stageBtns.forEach((b, i) => {
    if (i === currentStep) b.classList.add('active');
    else b.classList.remove('active');
  });
  
  for(let i=1; i<=4; i++) {
    const el = document.getElementById(`out-${i}`);
    if (i <= currentStep) el.classList.add('visible');
    else el.classList.remove('visible');
  }

  if (isForwardMove) {
    pulseCircle();
  }
}

btnNext.addEventListener('click', () => setStep(currentStep + 1));
btnPrev.addEventListener('click', () => setStep(currentStep - 1));
scrubber.addEventListener('input', (e) => setStep(parseInt(e.target.value, 10)));
btnReset.addEventListener('click', () => setStep(0));

// Initial Encoding Animation
setTimeout(() => {
  let encodeStep = 0;
  function encodeNext() {
    if (encodeStep > 3) {
      isReady = true;
      scrubber.disabled = false;
      btnNext.disabled = false;
      btnReset.disabled = false;
      stageBtns.forEach(b => b.disabled = false);
      setStep(0);
      return;
    }
    const inBox = document.getElementById(`in-${encodeStep}`);
    explain.textContent = `Encoding word ${encodeStep+1}...`;
    
    const inRect = inBox.getBoundingClientRect();
    const cRect = contextVector.getBoundingClientRect();
    const diagRect = diagramArea.getBoundingClientRect();
    
    const startX = inRect.left - diagRect.left + inRect.width/2 - 8;
    const startY = inRect.top - diagRect.top + inRect.height/2 - 8;
    const endX = cRect.left - diagRect.left + cRect.width/2 - 8;
    const endY = cRect.top - diagRect.top + cRect.height/2 - 8;
    
    flyingToken.style.transform = `translate(${startX}px, ${startY}px)`;
    flyingToken.style.opacity = '1';
    
    setTimeout(() => {
      flyingToken.style.transform = `translate(${endX}px, ${endY}px)`;
      setTimeout(() => {
        flyingToken.style.opacity = '0';
        pulseCircle();
        encodeStep++;
        setTimeout(encodeNext, 200);
      }, 400); 
    }, 50); 
  }
  encodeNext();
}, 500);
