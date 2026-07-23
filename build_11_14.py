import generator

# Boilerplate JS for theme, steps, explain
js_boilerplate = """
const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const caption = document.getElementById('caption');
const explainPanel = document.getElementById('explain-panel');
let hasInteracted = false;

// Theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (window.updateChartsTheme) window.updateChartsTheme();
}
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
} else {
    setTheme('light');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

function markInteraction(explainText) {
    if (!hasInteracted) {
        hasInteracted = true;
        caption.classList.add('visible');
    }
    if (explainText) explainPanel.innerHTML = explainText;
}

function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
"""

mod11_js = js_boilerplate + """
document.getElementById('steps-list').innerHTML = `
    <li>Drag the "x" slider.</li>
    <li>Watch the dot move on both charts.</li>
    <li>Read the f(x) and f'(x) readouts.</li>
`;
explainPanel.innerHTML = "At x=0, ReLU is 0. But its slope is undefined.";

document.getElementById('module-content').innerHTML = `
    <div class="row">
        <div class="col" style="position:relative; height: 300px;"><canvas id="chart-fx"></canvas></div>
        <div class="col" style="position:relative; height: 300px;"><canvas id="chart-dfx"></canvas></div>
    </div>
    <div class="row" style="align-items: center; justify-content: center; margin-top:16px;">
        <label for="x-slider" style="font-weight:bold;">x</label>
        <input type="range" id="x-slider" min="-5" max="5" step="0.1" value="0" style="width: 300px;">
    </div>
    <div class="row" style="justify-content: center; margin-top:16px; gap: 32px;">
        <div class="readout" id="readout-fx">f(x) = 0.00</div>
        <div class="readout" id="readout-dfx">f'(x) = <span style="color:var(--danger)">undefined</span></div>
    </div>
`;

let chartFx, chartDfx;
const xSlider = document.getElementById('x-slider');
const rFx = document.getElementById('readout-fx');
const rDfx = document.getElementById('readout-dfx');

function createCharts() {
    const ctxFx = document.getElementById('chart-fx').getContext('2d');
    const ctxDfx = document.getElementById('chart-dfx').getContext('2d');
    
    const xVals = [];
    const yFx = [];
    const yDfx1 = [];
    const yDfx2 = [];
    for(let i=-50; i<=50; i++) {
        let x = i/10;
        xVals.push(x);
        yFx.push(Math.max(0, x));
        if (x < 0) { yDfx1.push(0); yDfx2.push(null); }
        else if (x > 0) { yDfx1.push(null); yDfx2.push(1); }
        else { yDfx1.push(null); yDfx2.push(null); }
    }

    const primaryColor = getCssVar('--primary');
    const activeColor = getCssVar('--active');
    const textColor = getCssVar('--text-main');
    const gridColor = getCssVar('--border');

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: {display: false}, tooltip: {enabled: false} },
        scales: {
            x: { ticks: {color: textColor}, grid: {color: gridColor}, min: -5, max: 5 },
            y: { ticks: {color: textColor}, grid: {color: gridColor} }
        }
    };

    chartFx = new Chart(ctxFx, {
        type: 'line',
        data: {
            labels: xVals,
            datasets: [
                { data: yFx, borderColor: primaryColor, borderWidth: 2, pointRadius: 0 },
                { data: [{x:0, y:0}], backgroundColor: activeColor, pointRadius: 6, type: 'scatter' }
            ]
        },
        options: { ...commonOptions, scales: { ...commonOptions.scales, y: { ...commonOptions.scales.y, min: -1, max: 5 } } }
    });

    chartDfx = new Chart(ctxDfx, {
        type: 'line',
        data: {
            labels: xVals,
            datasets: [
                { data: yDfx1, borderColor: primaryColor, borderWidth: 2, pointRadius: 0 },
                { data: yDfx2, borderColor: primaryColor, borderWidth: 2, pointRadius: 0 },
                { data: [{x:0, y:0}], borderColor: primaryColor, backgroundColor: 'transparent', pointRadius: 4, borderWidth: 2, type: 'scatter' },
                { data: [{x:0, y:1}], borderColor: primaryColor, backgroundColor: 'transparent', pointRadius: 4, borderWidth: 2, type: 'scatter' },
                { data: [{x:0, y:null}], backgroundColor: activeColor, pointRadius: 6, type: 'scatter' }
            ]
        },
        options: { ...commonOptions, scales: { ...commonOptions.scales, y: { ...commonOptions.scales.y, min: -0.5, max: 1.5 } } }
    });
}

window.updateChartsTheme = function() {
    if(chartFx) chartFx.destroy();
    if(chartDfx) chartDfx.destroy();
    createCharts();
    updateSlider();
};

function updateSlider() {
    let x = parseFloat(xSlider.value);
    let fx = Math.max(0, x);
    let dfx = x < 0 ? 0 : (x > 0 ? 1 : null);
    
    rFx.innerHTML = `f(x) = ${fx.toFixed(2)}`;
    if (x === 0) {
        rDfx.innerHTML = `f'(x) = <span style="color:var(--danger)">undefined</span>`;
    } else {
        rDfx.innerHTML = `f'(x) = ${dfx}`;
    }
    
    // Find index for x
    chartFx.data.datasets[1].data = [{x: x, y: fx}];
    chartFx.update();
    
    let dfxY = dfx === null ? 0.5 : dfx; // Just position the dot somewhere if null, but maybe hide it?
    // wait, if undefined, we can just hide the dot by making radius 0
    chartDfx.data.datasets[4].data = [{x: x, y: dfxY}];
    chartDfx.data.datasets[4].pointRadius = dfx === null ? 0 : 6;
    chartDfx.update();

    let txt = `At x=${x.toFixed(1)}, `;
    if (x<0) txt += `input is negative, so output is 0 and derivative is 0. Gradient vanishes.`;
    else if (x>0) txt += `input is positive, so output is x and derivative is 1. Gradient flows perfectly.`;
    else txt += `input is exactly 0. The derivative is undefined (the sharp corner).`;
    
    markInteraction(txt);
}

xSlider.addEventListener('input', updateSlider);
createCharts();
updateSlider();
hasInteracted = false; // Reset to false initially
caption.classList.remove('visible');
"""

mod11_js_mobile = mod11_js.replace('class="row"', 'class="row" style="flex-direction:column;"')

mod14_js = js_boilerplate + """
document.getElementById('steps-list').innerHTML = `
    <li>Drag the "Predicted probability" slider.</li>
    <li>Watch the dot move along the curve.</li>
    <li>Read the "Loss" readout.</li>
`;
explainPanel.innerHTML = "Loss is moderate when somewhat unsure.";

document.getElementById('module-content').innerHTML = `
    <div style="position:relative; height: 350px; width:100%;"><canvas id="chart-loss"></canvas></div>
    <div class="row" style="align-items: center; justify-content: center; margin-top:16px;">
        <label for="p-slider" style="font-weight:bold; text-align:center;">Predicted probability of the true class<br>
        <input type="range" id="p-slider" min="0.01" max="1.0" step="0.01" value="0.5" style="width: 300px; margin-top: 8px;">
        </label>
    </div>
    <div class="row" style="justify-content: center; margin-top:16px;">
        <div class="readout" id="readout-loss">Loss = 0.69</div>
    </div>
`;

let chartLoss;
const pSlider = document.getElementById('p-slider');
const rLoss = document.getElementById('readout-loss');

function createCharts() {
    const ctxLoss = document.getElementById('chart-loss').getContext('2d');
    
    const pVals = [];
    const lossVals = [];
    for(let i=1; i<=100; i++) {
        let p = i/100;
        pVals.push(p);
        lossVals.push(-Math.log(p));
    }

    const primaryColor = getCssVar('--primary');
    const textColor = getCssVar('--text-main');
    const gridColor = getCssVar('--border');

    chartLoss = new Chart(ctxLoss, {
        type: 'line',
        data: {
            labels: pVals,
            datasets: [
                { data: lossVals, borderColor: primaryColor, borderWidth: 2, pointRadius: 0 },
                { data: [{x:0.5, y:-Math.log(0.5)}], backgroundColor: getCssVar('--active'), pointRadius: 8, type: 'scatter' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: { legend: {display: false}, tooltip: {enabled: false} },
            scales: {
                x: { ticks: {color: textColor}, grid: {color: gridColor}, min: 0, max: 1 },
                y: { ticks: {color: textColor}, grid: {color: gridColor}, min: 0, max: 5 }
            }
        }
    });
}

window.updateChartsTheme = function() {
    if(chartLoss) chartLoss.destroy();
    createCharts();
    updateSlider();
};

function updateSlider() {
    let p = parseFloat(pSlider.value);
    let loss = -Math.log(p);
    
    rLoss.innerHTML = `Loss = ${loss.toFixed(3)}`;
    
    let dotColor = getCssVar('--active');
    if (p > 0.7) dotColor = getCssVar('--success');
    else if (p < 0.3) dotColor = getCssVar('--danger');
    
    chartLoss.data.datasets[1].data = [{x: p, y: loss}];
    chartLoss.data.datasets[1].backgroundColor = dotColor;
    chartLoss.update();

    let txt = `Probability is ${p.toFixed(2)}. `;
    if (p > 0.7) txt += `High confidence in the correct class yields a very small loss near 0.`;
    else if (p < 0.3) txt += `Confidently wrong! The logarithmic penalty skyrockets toward infinity.`;
    else txt += `Unsure. The loss is moderate.`;
    
    markInteraction(txt);
}

pSlider.addEventListener('input', updateSlider);
createCharts();
updateSlider();
hasInteracted = false;
caption.classList.remove('visible');
"""

generator.generate_module(
    "module-11-relu-derivative", 
    "Module 11 - ReLU Derivative", 
    "The derivative is either exactly 0 or exactly 1 — nothing in between — and that simplicity is a big part of why ReLU trains so cleanly.", 
    "", False, mod11_js, mod11_js_mobile
)

generator.generate_module(
    "module-14-cross-entropy-loss", 
    "Module 14 - Cross-Entropy Loss", 
    "Being confidently wrong, low probability on the true class, is punished far harder than being merely unsure. That's the shape of this curve, not a design choice bolted on afterward.", 
    "", False, mod14_js, mod14_js
)
