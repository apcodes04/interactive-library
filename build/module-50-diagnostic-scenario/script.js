
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

const btnRoot = document.getElementById('btn-root');
const branches = document.getElementById('branches');
const branchBtns = document.querySelectorAll('.branch-btn');
const leafs = document.querySelectorAll('.leaf-fix');

btnRoot.addEventListener('click', () => {
  markInteracted();
  branches.style.display = 'flex';
  document.getElementById('explain').textContent = "Root selected. Investigate the 4 main branches.";
});

branchBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    markInteracted();
    // Collapse others
    leafs.forEach((l, j) => {
      if(i !== j) l.style.display = 'none';
      branchBtns[j].classList.remove('btn-primary');
      branchBtns[j].classList.add('btn-secondary');
    });
    // Toggle current
    if(leafs[i].style.display === 'block') {
      leafs[i].style.display = 'none';
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-secondary');
      document.getElementById('explain').textContent = "Branch collapsed. Compare other potential root causes.";
    } else {
      leafs[i].style.display = 'block';
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
      document.getElementById('explain').textContent = "Path selected. Implementing the specific fix for this root cause.";
    }
  });
});
    