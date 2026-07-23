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

const btnDisc = document.getElementById('btn-disc');
const btnGen = document.getElementById('btn-gen');
const resDisc = document.getElementById('res-disc');
const resGen = document.getElementById('res-gen');
const dotDisc = document.getElementById('dot-disc');
const dotGen = document.getElementById('dot-gen');
const pathDisc = document.getElementById('path-disc');
const pathGen = document.getElementById('path-gen');
const explain = document.getElementById('explain');
const caption = document.getElementById('caption');
let interacted = false;

function animateDot(dot, path, resElem, explainText, isDisc) {
  if (!interacted) { interacted = true; caption.classList.add('visible'); }
  
  resDisc.classList.remove('visible');
  resGen.classList.remove('visible');
  
  const length = path.getTotalLength();
  dot.setAttribute('opacity', '1');
  
  let start = performance.now();
  function tick(now) {
    let elapsed = now - start;
    let t = Math.min(1, elapsed / 500);
    let e = t * (2 - t);
    
    let p = path.getPointAtLength(e * length);
    dot.setAttribute('cx', p.x);
    dot.setAttribute('cy', p.y);
    
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      dot.setAttribute('opacity', '0');
      resElem.classList.add('visible');
      explain.textContent = explainText;
      if(isDisc) {
        explain.style.borderLeftColor = 'var(--primary)';
        // Swap full text on mobile
        resDisc.textContent = "Sentiment: Negative — 91%";
      } else {
        explain.style.borderLeftColor = 'var(--active)';
        resGen.textContent = "Suggested reply: We're sorry to hear that — could you tell us your phone model so we can look into the battery issue?";
      }
    }
  }
  requestAnimationFrame(tick);
}

btnDisc.addEventListener('click', () => {
  animateDot(dotDisc, pathDisc, resDisc, "Discriminative model analyzed the review and mapped it to a discrete category (Sentiment: Negative).", true);
});

btnGen.addEventListener('click', () => {
  animateDot(dotGen, pathGen, resGen, "Generative model analyzed the review and generated a completely new sequence of text (Suggested reply).", false);
});
