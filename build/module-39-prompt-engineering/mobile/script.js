const tabs = document.querySelectorAll('.tab-btn');
const output = document.getElementById('output-panel');
const caption = document.getElementById('caption');
const themeToggle = document.querySelector('.theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

const texts = {
  '1': 'The article talks about renewable energy and its benefits.',
  '2': 'This piece surveys renewable energy adoption trends, highlighting cost declines in solar and wind and their implications for grid policy.',
  '3': '<ul><li>Solar and wind costs have fallen sharply.</li><li>Adoption is accelerating in most major markets.</li><li>Grid policy is the main remaining bottleneck.</li></ul>'
};

tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    
    output.classList.add('fade');
    setTimeout(() => {
      output.innerHTML = texts[btn.dataset.tab];
      output.classList.remove('fade');
    }, 250);
    
    caption.classList.add('visible');
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
