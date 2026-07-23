
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

const gridBase = document.getElementById('grid-base');
const gridAdapter = document.getElementById('grid-adapter');
const toggle = document.getElementById('peft-toggle');
const readout = document.getElementById('readout');
const explain = document.getElementById('explain');

for(let i=0; i<48; i++) {
  const el = document.createElement('div');
  el.className = 'block block-frozen base-block';
  gridBase.appendChild(el);
}
for(let i=0; i<4; i++) {
  const el = document.createElement('div');
  el.className = 'block block-active adapter-block';
  gridAdapter.appendChild(el);
}

toggle.addEventListener('change', () => {
  markInteracted();
  const isFull = toggle.checked;
  const baseBlocks = document.querySelectorAll('.base-block');
  
  if(isFull) {
    baseBlocks.forEach(b => { b.classList.remove('block-frozen'); b.classList.add('block-hot'); });
    readout.textContent = "Trainable parameters: 48 of 52 (92%)";
    explain.textContent = "Full fine-tuning active: The entire base model is being updated. High compute and memory cost.";
  } else {
    baseBlocks.forEach(b => { b.classList.add('block-frozen'); b.classList.remove('block-hot'); });
    readout.textContent = "Trainable parameters: 4 of 52 (8%)";
    explain.textContent = "PEFT state active: Only the small adapter blocks are updated during training. Base model is frozen.";
  }
});
    