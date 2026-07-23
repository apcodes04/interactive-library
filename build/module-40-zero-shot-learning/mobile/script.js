const toggle = document.getElementById('example-toggle');
const wrapper = document.getElementById('examples-wrapper');
const caption = document.getElementById('caption');
const themeToggle = document.querySelector('.theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

toggle.addEventListener('change', (e) => {
  if (e.target.checked) {
    wrapper.classList.add('open');
  } else {
    wrapper.classList.remove('open');
  }
  caption.classList.add('visible');
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
