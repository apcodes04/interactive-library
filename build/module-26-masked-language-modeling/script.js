const themeToggle = document.querySelector('.theme-toggle');
const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);

function getThemeColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const ctx = document.getElementById('predict-chart').getContext('2d');
const dataVals = [62, 18, 12, 8];
const labels = ['mat', 'rug', 'floor', 'chair'];

Chart.defaults.color = getThemeColor('--text-muted');
Chart.defaults.font.family = getThemeColor('--font');

let chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            data: dataVals,
            backgroundColor: getThemeColor('--active'),
            borderRadius: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: true, max: 100, grid: { color: getThemeColor('--border') }, ticks: { callback: v => v+'%' } },
            x: { grid: { display: false } }
        },
        plugins: { legend: { display: false } },
        animation: { duration: 300 }
    }
});

themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    Chart.defaults.color = getThemeColor('--text-muted');
    chart.options.scales.y.grid.color = getThemeColor('--border');
    chart.data.datasets[0].backgroundColor = getThemeColor('--active');
    chart.update();
});

const btnPredict = document.getElementById('btn-predict');
const btnReset = document.getElementById('btn-reset');
const chartContainer = document.getElementById('chart-container');
const maskChip = document.getElementById('mask-chip');
const explain = document.getElementById('explainPanel');
const caption = document.querySelector('.caption');
let firstInteraction = false;

btnPredict.addEventListener('click', () => {
    if (!firstInteraction) {
        firstInteraction = true;
        caption.classList.add('visible');
    }
    explain.innerHTML = `Computing probabilities... Candidates appear based on surrounding context.`;
    chartContainer.classList.add('visible');
    
    setTimeout(() => {
        maskChip.classList.add('flipped');
maskChip.textContent = '[MAT]';
        explain.innerHTML = `Predicted <strong>'mat'</strong> with 62% confidence, filled into the mask.`;
        
        // update chart to show green for mat
        let colors = [getThemeColor('--success'), getThemeColor('--frozen'), getThemeColor('--frozen'), getThemeColor('--frozen')];
        chart.data.datasets[0].backgroundColor = colors;
        chart.update();
        // generate probability table if not already present
        const probCard = document.getElementById('probCard');
        if (!document.getElementById('prob-table')) {
          const table = document.createElement('table');
          table.id = 'prob-table';
          table.style.width = '100%';
          const header = document.createElement('tr');
          header.innerHTML = '<th>Word</th><th>Probability</th>';
          table.appendChild(header);
          labels.forEach((label, i) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${label}</td><td>${dataVals[i]}%</td>`;
            table.appendChild(row);
          });
          probCard.appendChild(table);
          probCard.style.display = 'block';
        }
    }, 800);
});

btnReset.addEventListener('click', () => {
    chartContainer.classList.remove('visible');
    maskChip.classList.remove('flipped');
    explain.innerHTML = `A sentence with a missing token. The model will use bidirectional context to predict it.`;
    chart.data.datasets[0].backgroundColor = getThemeColor('--active');
    chart.update();
    const probCard = document.getElementById('probCard');
    probCard.style.display = 'none';
    const existingTable = document.getElementById('prob-table');
    if (existingTable) existingTable.remove();
});
