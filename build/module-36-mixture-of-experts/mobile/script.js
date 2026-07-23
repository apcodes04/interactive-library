const buttons = document.querySelectorAll('.token-btn');
const activeCount = document.getElementById('active-count');
const capacityUsed = document.getElementById('capacity-used');
const caption = document.getElementById('caption');
const themeToggle = document.querySelector('.theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

const svg = document.getElementById('moe-svg');
const dot = document.getElementById('anim-dot');
const dotA = document.getElementById('anim-dot-a');
const dotB = document.getElementById('anim-dot-b');
const pathIn = document.getElementById('path-in');

// Expert positions
const expPos = {
  1: {x: 350, y: 50}, 2: {x: 420, y: 80}, 3: {x: 450, y: 150}, 4: {x: 420, y: 220},
  5: {x: 350, y: 250}, 6: {x: 280, y: 220}, 7: {x: 250, y: 150}, 8: {x: 280, y: 80}
};

function resetAll() {
  document.querySelectorAll('.expert-node').forEach(n => n.classList.remove('lit'));
  document.querySelectorAll('.path-line').forEach(p => p.classList.remove('lit'));
  dot.style.opacity = '0';
  dotA.style.opacity = '0';
  dotB.style.opacity = '0';
  
  // reset animation elements
  dot.setAttribute('cx', '50');
  dotA.setAttribute('cx', '150'); dotA.setAttribute('cy', '150');
  dotB.setAttribute('cx', '150'); dotB.setAttribute('cy', '150');
}

function animateDot(element, startX, startY, endX, endY, duration, callback) {
  element.style.opacity = '1';
  let start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    let progress = (timestamp - start) / duration;
    if (progress > 1) progress = 1;
    
    element.setAttribute('cx', startX + (endX - startX) * progress);
    element.setAttribute('cy', startY + (endY - startY) * progress);
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      if (callback) callback();
    }
  }
  window.requestAnimationFrame(step);
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Disable buttons during anim
    buttons.forEach(b => b.disabled = true);
    resetAll();
    caption.classList.add('visible');
    
    const experts = btn.dataset.experts.split(',').map(Number);
    pathIn.classList.add('lit');
    
    // Animate from Input to Router
    animateDot(dot, 50, 150, 150, 150, 400, () => {
      dot.style.opacity = '0';
      pathIn.classList.remove('lit');
      
      const e1 = experts[0], e2 = experts[1];
      const p1 = expPos[e1], p2 = expPos[e2];
      
      document.getElementById(`path-${e1}`).classList.add('lit');
      document.getElementById(`path-${e2}`).classList.add('lit');
      
      // Animate from Router to Experts
      let done = 0;
      const onDone = () => {
        done++;
        if (done === 2) {
          document.getElementById(`expert-${e1}`).classList.add('lit');
          document.getElementById(`expert-${e2}`).classList.add('lit');
          dotA.style.opacity = '0';
          dotB.style.opacity = '0';
          activeCount.textContent = '2';
          capacityUsed.textContent = '25';
          buttons.forEach(b => b.disabled = false);
        }
      };
      
      animateDot(dotA, 150, 150, p1.x, p1.y, 400, onDone);
      animateDot(dotB, 150, 150, p2.x, p2.y, 400, onDone);
    });
  });
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
