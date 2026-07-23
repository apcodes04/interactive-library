
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

const axes = ['Compute', 'Latency', 'Hallucination', 'Bias', 'Privacy', 'Safety', 'Knowledge staleness'];
const presets = {
  p1: [3, 8, 5, 4, 6, 5, 3],
  p2: [4, 3, 9, 6, 9, 9, 7]
};
let currentVals = [...presets.p1];

const ctx = document.getElementById('radar-chart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'radar',
  data: {
    labels: axes,
    datasets: [{
      label: 'Importance (0-10)',
      data: currentVals,
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary') + '40', // opacity
      borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
      pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary')
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    scales: { r: { min: 0, max: 10, ticks: {stepSize:2} } },
    animation: { duration: 500 }
  }
});

const slidersContainer = document.getElementById('sliders-container');
axes.forEach((axis, i) => {
  const div = document.createElement('div');
  div.innerHTML = `<label style="font-size:14px;">${axis}: <span id="val-${i}">${currentVals[i]}</span></label><br>
                   <input type="range" id="slider-${i}" min="0" max="10" step="1" value="${currentVals[i]}" style="width:100%;">`;
  slidersContainer.appendChild(div);
  
  document.getElementById(`slider-${i}`).addEventListener('input', (e) => {
    markInteracted();
    const val = parseInt(e.target.value);
    document.getElementById(`val-${i}`).textContent = val;
    currentVals[i] = val;
    chart.update();
    document.getElementById('explain').textContent = `Adjusted ${axis} to ${val}. Different use cases have vastly different risk profiles.`;
  });
});

function loadPreset(arr, name) {
  markInteracted();
  currentVals = [...arr];
  chart.data.datasets[0].data = currentVals;
  chart.update();
  axes.forEach((axis, i) => {
    document.getElementById(`slider-${i}`).value = currentVals[i];
    document.getElementById(`val-${i}`).textContent = currentVals[i];
  });
  document.getElementById('explain').textContent = `Loaded preset: ${name}.`;
}

document.getElementById('btn-preset1').addEventListener('click', () => loadPreset(presets.p1, 'Customer support chatbot'));
document.getElementById('btn-preset2').addEventListener('click', () => loadPreset(presets.p2, 'Medical information assistant'));
    