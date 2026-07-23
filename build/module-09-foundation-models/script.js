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

const items = document.querySelectorAll('.accordion-item');
const explain = document.getElementById('explain');
const caption = document.getElementById('caption');
let interacted = false;

items.forEach(item => {
  const header = item.querySelector('.accordion-header');
  header.addEventListener('click', () => {
    if (!interacted) { interacted = true; caption.classList.add('visible'); }
    
    const isActive = item.classList.contains('active');
    
    // Close all
    items.forEach(i => i.classList.remove('active'));
    
    // Toggle current
    if (!isActive) {
      item.classList.add('active');
      const modality = item.getAttribute('data-modality');
      explain.textContent = `Viewing ${modality} Foundation Models. These models are adapted to understand and generate ${modality.toLowerCase()} data.`;
    } else {
      explain.textContent = "Select a modality to see examples of Foundation Models.";
    }
  });
});
