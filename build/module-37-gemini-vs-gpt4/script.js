const toggle = document.getElementById('facts-toggle');
const table = document.querySelector('.comparison-table');
const caption = document.getElementById('caption');
const themeToggle = document.querySelector('.theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

toggle.addEventListener('change', (e) => {
  if (e.target.checked) {
    table.classList.add('facts-only');
  } else {
    table.classList.remove('facts-only');
  }
  caption.classList.add('visible');
});

// Chart.js initialization
const ctx = document.getElementById('contextChart').getContext('2d');
let chart;

let isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
const applyTheme = () => {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  iconSun.style.display = isDark ? 'block' : 'none';
  iconMoon.style.display = isDark ? 'none' : 'block';
  
  if (chart) {
    chart.options.scales.x.grid.color = isDark ? '#374151' : '#e5e7eb';
    chart.options.scales.y.grid.color = isDark ? '#374151' : '#e5e7eb';
    chart.options.scales.x.ticks.color = isDark ? '#f9fafb' : '#333333';
    chart.options.scales.y.ticks.color = isDark ? '#f9fafb' : '#333333';
    chart.update();
  }
};

chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Gemini 1.5 Pro', 'GPT-4 Turbo'],
    datasets: [{
      label: 'Context Window (tokens)',
      data: [1000000, 128000],
      backgroundColor: ['#2563eb', '#10b981']
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { 
        beginAtZero: true,
        grid: { color: isDark ? '#374151' : '#e5e7eb' },
        ticks: { color: isDark ? '#f9fafb' : '#333333' }
      },
      y: { 
        grid: { color: isDark ? '#374151' : '#e5e7eb' },
        ticks: { color: isDark ? '#f9fafb' : '#333333' }
      }
    }
  }
});

applyTheme();
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  applyTheme();
});
