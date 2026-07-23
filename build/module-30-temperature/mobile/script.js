const themeToggle = document.querySelector('.theme-toggle');
const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateChartTheme();
});

function getThemeColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const rawLogits = { sat: 4.0, ran: 2.0, walked: 1.8, stood: 1.2, jumped: 0.8, stayed: 0.5, left: 0.2, flew: -0.5 };
const labels = Object.keys(rawLogits);
const logits = Object.values(rawLogits);

function computeSoftmax(t) {
    let exp = logits.map(l => Math.exp(l / t));
    let sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(e => e / sum);
}

Chart.defaults.color = getThemeColor('--text-muted');
Chart.defaults.font.family = getThemeColor('--font');
Chart.defaults.font.size = 11;

const ctx = document.getElementById('prob-chart').getContext('2d');
let currentProbs = computeSoftmax(1.0);
let bgColors = Array(labels.length).fill(getThemeColor('--primary'));

let chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            data: currentProbs,
            backgroundColor: bgColors,
            borderRadius: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: true, max: 1.0, grid: { color: getThemeColor('--border') } },
            x: { grid: { display: false }, ticks: { maxRotation: 45, minRotation: 45 } }
        },
        plugins: { legend: { display: false } },
        animation: { duration: 300 }
    }
});

function updateChartTheme() {
    Chart.defaults.color = getThemeColor('--text-muted');
    chart.options.scales.y.grid.color = getThemeColor('--border');
    bgColors = bgColors.map(c => c === getThemeColor('--success', true) ? getThemeColor('--success') : getThemeColor('--primary'));
    chart.data.datasets[0].backgroundColor = bgColors;
    chart.update();
}

let firstInteraction = false;
const slider = document.getElementById('temp-slider');
const tempVal = document.getElementById('temp-val');
const btnSample = document.getElementById('btn-sample');
const explain = document.getElementById('explain');
const caption = document.querySelector('.caption');
let sampleResetTimeout = null;

slider.addEventListener('input', () => {
    if (!firstInteraction) {
        firstInteraction = true;
        caption.classList.add('visible');
    }
    const t = parseFloat(slider.value);
    tempVal.textContent = t.toFixed(2);
    currentProbs = computeSoftmax(t);
    
    bgColors = Array(labels.length).fill(getThemeColor('--primary'));
    chart.data.datasets[0].data = currentProbs;
    chart.data.datasets[0].backgroundColor = bgColors;
    chart.update();
    
    if (t < 0.5) explain.innerHTML = `Temperature is low (${t.toFixed(2)}). Distribution becomes sharper.`;
    else if (t > 1.5) explain.innerHTML = `Temperature is high (${t.toFixed(2)}). Distribution becomes flatter.`;
    else explain.innerHTML = `Temperature is ${t.toFixed(2)}. Balanced mix of predictability and randomness.`;
});

btnSample.addEventListener('click', () => {
    if (!firstInteraction) {
        firstInteraction = true;
        caption.classList.add('visible');
    }
    const t = parseFloat(slider.value);
    
    let r = Math.random();
    let sum = 0;
    let selectedIdx = 0;
    for (let i = 0; i < currentProbs.length; i++) {
        sum += currentProbs[i];
        if (r <= sum) {
            selectedIdx = i;
            break;
        }
    }
    
    bgColors = Array(labels.length).fill(getThemeColor('--primary'));
    bgColors[selectedIdx] = getThemeColor('--success');
    chart.data.datasets[0].backgroundColor = bgColors;
    chart.update();
    
    explain.innerHTML = `Sampled token: <strong>"${labels[selectedIdx]}"</strong> at T=${t.toFixed(2)}.`;
    
    if (sampleResetTimeout) clearTimeout(sampleResetTimeout);
    sampleResetTimeout = setTimeout(() => {
        bgColors[selectedIdx] = getThemeColor('--primary');
        chart.data.datasets[0].backgroundColor = bgColors;
        chart.update();
    }, 1500);
});
