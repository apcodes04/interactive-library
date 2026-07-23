
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

const logits = [4.0, 2.0, 1.5, 0.5, 0.0, -0.5]; // For tokens representing 7, 1, 9, 4, 3, 8
const labels = ['7', '1', '9', '4', '3', '8'];
const baseStudent = [0.20, 0.18, 0.17, 0.16, 0.15, 0.14];
let currentStep = 0;
let currentTemp = 1.0;

function softmax(arr, T) {
  const maxLogit = Math.max(...arr.map(x => x/T));
  const exps = arr.map(x => Math.exp((x/T) - maxLogit));
  const sum = exps.reduce((a,b)=>a+b, 0);
  return exps.map(x => x/sum);
}

const ctxT = document.getElementById('chart-teacher').getContext('2d');
const ctxS = document.getElementById('chart-student').getContext('2d');

function initChart(ctx, color) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{ data: [], backgroundColor: color, borderRadius: 2 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { y: { min: 0, max: 1 } },
      animation: { duration: 400 },
      plugins: { legend: { display: false } }
    }
  });
}
const chartTeacher = initChart(ctxT, getComputedStyle(document.documentElement).getPropertyValue('--primary'));
const chartStudent = initChart(ctxS, getComputedStyle(document.documentElement).getPropertyValue('--active'));

function updateCharts() {
  const teacherDist = softmax(logits, currentTemp);
  chartTeacher.data.datasets[0].data = teacherDist;
  chartTeacher.update();
  
  const targetDist = softmax(logits, 1.0); // usually student learns against T=1 or matches temperature, prompt says "teacher's T=1 target distribution"
  const studentDist = baseStudent.map((val, i) => val + (targetDist[i] - val) * (currentStep/5));
  chartStudent.data.datasets[0].data = studentDist;
  chartStudent.update();
}
updateCharts();

const sliderTemp = document.getElementById('slider-temp');
const tempVal = document.getElementById('temp-val');
sliderTemp.addEventListener('input', () => {
  markInteracted();
  currentTemp = parseFloat(sliderTemp.value);
  tempVal.textContent = currentTemp.toFixed(1);
  updateCharts();
  if(currentTemp > 2) document.getElementById('explain').textContent = `Temperature ${currentTemp.toFixed(1)}. The teacher distribution is smoothed out, revealing secondary predictions.`;
  else document.getElementById('explain').textContent = `Temperature ${currentTemp.toFixed(1)}.`;
});

const btnTrain = document.getElementById('btn-train');
btnTrain.addEventListener('click', () => {
  markInteracted();
  if(currentStep < 5) {
    currentStep++;
    btnTrain.textContent = `Train step (${currentStep}/5)`;
    updateCharts();
    document.getElementById('explain').textContent = `Training step ${currentStep}. Student distribution moves closer to the teacher's target.`;
  }
  if(currentStep === 5) {
    btnTrain.disabled = true;
    document.getElementById('explain').textContent = "Training complete. Student matches the target distribution.";
  }
});
    