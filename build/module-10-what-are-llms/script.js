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

const slider = document.getElementById('size-slider');
const readout = document.getElementById('size-readout');
const dotGrid = document.getElementById('dot-grid');
const checkItems = document.querySelectorAll('.check-item');
const explain = document.getElementById('explain');
const caption = document.getElementById('caption');
let interacted = false;

// We need round(10 + slider*1.9) dots.
// Max is round(10 + 100*1.9) = 200.
// We will pre-render 200 dots and toggle display to avoid destroying/creating elements constantly.
const maxDots = 200;
const dots = [];
for (let i = 0; i < maxDots; i++) {
  const d = document.createElement('div');
  d.className = 'dot';
  d.style.display = 'none'; // hidden initially
  dotGrid.appendChild(d);
  dots.push(d);
}

function updateState() {
  if (!interacted) { interacted = true; caption.classList.add('visible'); }
  const val = parseInt(slider.value, 10);
  readout.textContent = val;
  
  // Dots
  const numDots = Math.round(10 + val * 1.9);
  for(let i=0; i<maxDots; i++) {
    if (i < numDots) {
      if (dots[i].style.display === 'none') {
        dots[i].style.display = 'block';
        // force reflow to trigger animation if needed, though they stay visible once shown
      }
    } else {
      dots[i].style.display = 'none';
    }
  }
  
  // Checks
  let maxThresholdReached = 0;
  checkItems.forEach(item => {
    const thresh = parseInt(item.getAttribute('data-threshold'), 10);
    if (val >= thresh) {
      if (!item.classList.contains('success')) {
        item.classList.remove('frozen');
        item.classList.add('success');
      }
      maxThresholdReached = Math.max(maxThresholdReached, thresh);
    } else {
      item.classList.add('frozen');
      item.classList.remove('success');
    }
  });
  
  // Explain
  if (maxThresholdReached === 0) {
    explain.textContent = "At low scale, the model has few parameters and limited capabilities. (Drag slider to scale up)";
  } else if (maxThresholdReached === 10) {
    explain.textContent = "Threshold crossed! The model is now large enough to reliably complete basic text.";
  } else if (maxThresholdReached === 35) {
    explain.textContent = "Threshold crossed! Scale unlocks the ability to maintain context over a long chat.";
  } else if (maxThresholdReached === 65) {
    explain.textContent = "Threshold crossed! The model can now perform chain-of-thought reasoning.";
  } else if (maxThresholdReached === 90) {
    explain.textContent = "Threshold crossed! At massive scale, the model can reliably use external tools and APIs.";
  }
}

slider.addEventListener('input', updateState);
// Initial render (but don't trigger interacted state yet)
const numDots = Math.round(10 + parseInt(slider.value, 10) * 1.9);
for(let i=0; i<numDots; i++) dots[i].style.display = 'block';
