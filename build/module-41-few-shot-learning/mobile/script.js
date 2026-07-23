
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

const confLookup = [40, 65, 80, 85, 87, 88];
let examples = 0;
const btnAdd = document.getElementById('btn-add');
const btnRemove = document.getElementById('btn-remove');
const promptBox = document.getElementById('prompt-box');
const meterFill = document.getElementById('meter-fill');
const confLabel = document.getElementById('conf-label');
const explain = document.getElementById('explain');

function updateState() {
  markInteracted();
  const conf = confLookup[examples];
  confLabel.textContent = conf + '%';
  meterFill.style.width = conf + '%';
  if (conf < 65) meterFill.style.background = 'var(--primary)';
  else if (conf < 85) meterFill.style.background = 'var(--active)';
  else meterFill.style.background = 'var(--success)';
  
  btnAdd.disabled = (examples >= 5);
  btnRemove.disabled = (examples <= 0);
  
  if (examples === 0) explain.textContent = "Current examples: 0. Confidence is low without examples.";
  else if (examples <= 2) explain.textContent = `Current examples: ${examples}. Confidence rises quickly initially.`;
  else explain.textContent = `Current examples: ${examples}. Confidence is plateauing. Diminishing returns in action.`;
  
  document.querySelectorAll('.added-example').forEach(e => e.remove());
  for(let i=0; i<examples; i++) {
    const el = document.createElement('div');
    el.className = 'example-box added-example';
    el.textContent = `Example ${i+1}: Cheese -> Fromage`;
    promptBox.parentNode.insertBefore(el, promptBox);
  }
}
btnAdd.addEventListener('click', () => { if (examples < 5) { examples++; updateState(); } });
btnRemove.addEventListener('click', () => { if (examples > 0) { examples--; updateState(); } });
    