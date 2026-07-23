import os
import json

def generate_module_01(base_dir):
    slug = 'module-01-hyperparameter'
    
    # Desktop paths
    d_dir = os.path.join(base_dir, 'build', slug)
    m_dir = os.path.join(d_dir, 'mobile')
    os.makedirs(m_dir, exist_ok=True)
    
    # Shared CSS for both
    css = """
:root {
  color-scheme: light dark;
  --bg: #f5f1e6;
  --card-bg: #fbf8f1;
  --bg-muted: #ede6d3;
  --border: #d6c9a0;
  --text: #2b2620;
  --text-muted: #6b6355;
  --primary: #4f46e5;
  --primary-light: #818cf8;
  --active: #9c4208;
  --success: #0f7a52;
  --danger: #b91c1c;
  --frozen: #9c9280;
  --explain-bg: #eee9f7;
  --radius: 12px;
  --shadow: 0 1px 3px rgba(43,38,32,0.08), 0 4px 12px rgba(43,38,32,0.05);
  --font: system-ui, -apple-system, "Segoe UI", sans-serif;
  --mono: ui-monospace, "SF Mono", Consolas, monospace;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="dark"] {
  color-scheme: dark;
  --bg: #1e1b16;
  --card-bg: #2f2a22;
  --bg-muted: #363026;
  --border: #4a4232;
  --text: #f2ead8;
  --text-muted: #b8ad97;
  --primary: #8b85f0;
  --primary-light: #a6a1f5;
  --active: #f5a524;
  --success: #34d399;
  --danger: #f87171;
  --frozen: #7a7264;
  --explain-bg: #2a2540;
  --shadow: 0 1px 3px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.25);
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  margin: 0;
  padding: 24px;
  transition: background 200ms var(--ease-out), color 200ms var(--ease-out);
}

.card {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 24px;
  max-width: 760px;
  margin: 0 auto;
  transition: background 200ms var(--ease-out), border-color 200ms var(--ease-out);
}
.theme-toggle {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg-muted);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.theme-toggle svg { width: 18px; height: 18px; }
.steps-panel {
  background: var(--bg-muted);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}
.steps-panel h3 { margin: 0 0 12px 0; font-size: 16px; }
.steps-panel ol { margin: 0; padding-left: 24px; color: var(--text-muted); }
.explain-panel {
  background: var(--explain-bg);
  border-left: 4px solid var(--primary);
  padding: 16px;
  margin: 24px 0;
  border-radius: 4px 8px 8px 4px;
  min-height: 40px;
}
.caption {
  font-size: 15px;
  color: var(--text-muted);
  text-align: center;
  margin-top: 24px;
  opacity: 0;
  transition: opacity 400ms var(--ease-out);
}
.caption.visible { opacity: 1; }
.legend {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin: 16px 0;
  font-size: 14px;
  color: var(--text-muted);
}
.legend-item { display: flex; align-items: center; gap: 6px; }
.legend-color { width: 12px; height: 12px; border-radius: 50%; }
.layout-split { display: flex; gap: 24px; margin-bottom: 24px; }
.layout-split > * { flex: 1; min-width: 0; }
.controls { display: flex; gap: 16px; align-items: center; background: var(--bg-muted); padding: 16px; border-radius: 8px; }
.btn-primary {
  background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;
}
.btn-secondary {
  background: transparent; color: var(--text); border: 1px solid var(--border); padding: 8px 16px; border-radius: 6px; cursor: pointer;
}
input[type=range] { flex: 1; }
.readout { font-family: var(--mono); font-weight: bold; font-size: 18px; color: var(--primary); }

svg { width: 100%; height: 250px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 6px; overflow: visible; }
.dot-a { fill: var(--primary); }
.dot-b { fill: var(--danger); }
.boundary-line { stroke: var(--primary); stroke-width: 2; transition: all 200ms linear; }
.loss-line { stroke: var(--primary); stroke-width: 2; fill: none; transition: stroke 200ms ease; }
.axis path, .axis line { stroke: var(--border); }
.axis text { fill: var(--text-muted); font-family: var(--font); font-size: 10px; }
"""
    m_css = css + """
.card { max-width: 100%; padding: 16px; }
.theme-toggle { width: 44px; height: 44px; }
.layout-split { flex-direction: column; }
.controls { flex-direction: column; align-items: stretch; }
input[type=range]::-webkit-slider-thumb { width: 28px; height: 28px; }
.btn-primary, .btn-secondary { padding: 12px 16px; min-height: 44px; }
"""

    html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Module 1 - Hyperparameter</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
  <div class="card">
    <button class="theme-toggle" aria-label="Toggle theme">
      <svg id="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      <svg id="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </button>
    <div class="steps-panel">
      <h3>Steps to interact</h3>
      <ol>
        <li>Drag the "Learning rate" slider.</li>
        <li>Click "Train."</li>
        <li>Watch the loss curve and decision boundary respond.</li>
      </ol>
    </div>
    
    <div class="layout-split">
      <div>
        <svg id="plot-svg"></svg>
        <div class="legend">
          <div class="legend-item"><div class="legend-color" style="background:var(--primary)"></div>Class A</div>
          <div class="legend-item"><div class="legend-color" style="background:var(--danger)"></div>Class B</div>
        </div>
      </div>
      <div>
        <svg id="loss-svg"></svg>
      </div>
    </div>
    
    <div class="explain-panel" id="explain">Adjust the learning rate and click Train to see how it affects the model's convergence.</div>
    
    <div class="controls">
      <label for="lr-slider">Learning rate: <span class="readout" id="lr-readout">0.1</span></label>
      <input type="range" id="lr-slider" min="-3" max="0.301" step="0.01" value="-1">
      <button class="btn-primary" id="btn-train">Train</button>
    </div>
    
    <div class="caption" id="caption">The learning rate alone decided whether training converged smoothly, crawled, or diverged — nothing else in this chart changed.</div>
  </div>
  <script src="script.js"></script>
</body>
</html>"""

    js = """
// Set up theme toggle
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

// Data setup
const randomGaussian = (mean, sd) => {
  let u = 1 - Math.random(), v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * sd + mean;
};
const points = [];
Math.seedrandom = 42; // mock seeded behavior, just generating points
for(let i=0; i<20; i++) points.push({x: randomGaussian(30,15), y: randomGaussian(30,15), c: 'A'});
for(let i=0; i<20; i++) points.push({x: randomGaussian(70,15), y: randomGaussian(70,15), c: 'B'});
// Add some noise
points.push({x: 55, y: 55, c: 'A'});
points.push({x: 48, y: 48, c: 'B'});

// Plot SVG
const width = 300, height = 250;
const plotSvg = d3.select('#plot-svg').attr('viewBox', `0 0 ${width} ${height}`);
const xScale = d3.scaleLinear().domain([0, 100]).range([20, width-20]);
const yScale = d3.scaleLinear().domain([0, 100]).range([height-20, 20]);

plotSvg.selectAll('circle').data(points).enter().append('circle')
  .attr('cx', d => xScale(d.x))
  .attr('cy', d => yScale(d.y))
  .attr('r', 4)
  .attr('class', d => d.c === 'A' ? 'dot-a' : 'dot-b');

const boundary = plotSvg.append('line')
  .attr('class', 'boundary-line')
  .attr('x1', xScale(0)).attr('y1', yScale(50))
  .attr('x2', xScale(100)).attr('y2', yScale(50));

// Loss SVG
const lossSvg = d3.select('#loss-svg').attr('viewBox', `0 0 ${width} ${height}`);
const xLoss = d3.scaleLinear().domain([0, 50]).range([30, width-10]);
const yLoss = d3.scaleLinear().domain([0, 9]).range([height-20, 20]);

lossSvg.append('g').attr('transform', `translate(0,${height-20})`).call(d3.axisBottom(xLoss).ticks(5));
lossSvg.append('g').attr('transform', `translate(30,0)`).call(d3.axisLeft(yLoss).ticks(5));

const lossPath = lossSvg.append('path').attr('class', 'loss-line');

// State
let interacted = false;
let isTraining = false;
const explain = document.getElementById('explain');
const caption = document.getElementById('caption');
const lrSlider = document.getElementById('lr-slider');
const lrReadout = document.getElementById('lr-readout');
const btnTrain = document.getElementById('btn-train');

function getLR() {
  return Math.pow(10, parseFloat(lrSlider.value));
}

function updateLR() {
  const lr = getLR();
  lrReadout.textContent = lr.toFixed(4);
  lrReadout.style.color = 'var(--active)';
  setTimeout(() => lrReadout.style.color = 'var(--primary)', 300);
  
  if(!interacted) {
    interacted = true;
    caption.classList.add('visible');
  }
  
  if(lr > 0.3) explain.textContent = `Learning rate is ${lr.toFixed(4)}. This is high.`;
  else if(lr >= 0.01) explain.textContent = `Learning rate is ${lr.toFixed(4)}. This seems like a reasonable range.`;
  else explain.textContent = `Learning rate is ${lr.toFixed(4)}. This is very small.`;
}
lrSlider.addEventListener('input', updateLR);

btnTrain.addEventListener('click', () => {
  if(isTraining) return;
  isTraining = true;
  btnTrain.disabled = true;
  if(!interacted) { interacted = true; caption.classList.add('visible'); }
  
  const lr = getLR();
  let traj = [];
  let type = '';
  if (lr > 0.3) {
    type = 'diverging';
    for(let step=0; step<=50; step++) {
      let l = 2.5 + step * 0.15 * Math.sin(step * 0.9);
      traj.push({step, loss: Math.max(0, Math.min(9, l))});
    }
    explain.textContent = `Training with LR ${lr.toFixed(4)}... Loss is oscillating and blowing up (diverging)!`;
  } else if (lr >= 0.01) {
    type = 'converging';
    for(let step=0; step<=50; step++) {
      let l = 0.1 + 2.4 * Math.exp(-step/12);
      traj.push({step, loss: l});
    }
    explain.textContent = `Training with LR ${lr.toFixed(4)}... Loss is decreasing smoothly (converging).`;
  } else {
    type = 'crawling';
    for(let step=0; step<=50; step++) {
      let l = 2.5 - (step/50)*0.5;
      traj.push({step, loss: l});
    }
    explain.textContent = `Training with LR ${lr.toFixed(4)}... Loss is barely moving (crawling).`;
  }
  
  lossPath.attr('d', '').style('stroke', 'var(--primary)');
  
  let step = 0;
  function tick() {
    if(step > 50) {
      isTraining = false;
      btnTrain.disabled = false;
      if(type === 'diverging') lossPath.style('stroke', 'var(--danger)');
      if(type === 'crawling') lossPath.style('stroke', 'var(--text-muted)');
      if(type === 'converging') lossPath.style('stroke', 'var(--success)');
      return;
    }
    
    const currentData = traj.slice(0, step+1);
    const line = d3.line().x(d => xLoss(d.step)).y(d => yLoss(d.loss));
    lossPath.attr('d', line(currentData));
    
    if(type === 'converging') {
      let progress = step/50;
      boundary.attr('y1', yScale(50 - 20*progress)).attr('y2', yScale(50 + 20*progress));
    } else if(type === 'diverging') {
      boundary.attr('y1', yScale(50 + (Math.random()-0.5)*40)).attr('y2', yScale(50 + (Math.random()-0.5)*40));
    } else {
      let progress = step/50;
      boundary.attr('y1', yScale(50 - 2*progress)).attr('y2', yScale(50 + 2*progress));
    }
    
    if(type === 'diverging' && traj[step].loss > 6) {
      lossPath.style('stroke', 'var(--danger)');
    }
    
    step++;
    requestAnimationFrame(() => setTimeout(tick, 30));
  }
  tick();
});
"""
    with open(os.path.join(d_dir, 'style.css'), 'w') as f: f.write(css)
    with open(os.path.join(d_dir, 'index.html'), 'w') as f: f.write(html)
    with open(os.path.join(d_dir, 'script.js'), 'w') as f: f.write(js)
    
    with open(os.path.join(m_dir, 'style.css'), 'w') as f: f.write(m_css)
    with open(os.path.join(m_dir, 'index.html'), 'w') as f: f.write(html.replace('style.css', 'style.css'))
    with open(os.path.join(m_dir, 'script.js'), 'w') as f: f.write(js)

if __name__ == '__main__':
    generate_module_01('d:/AcadByte/22-07-26/ML TOP 50 Reformatted/claude game lib/diagrams')
