import os

base_dir = r'd:/AcadByte/22-07-26/ML TOP 50 Reformatted/claude game lib/diagrams/build'
os.makedirs(base_dir, exist_ok=True)

html_template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Module {num}</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
  <div class="app-container">
    <div class="header-row">
      <h2>{title}</h2>
      <button class="theme-toggle" aria-label="Toggle dark mode">
        <svg id="icon-sun" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="display:none;"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <svg id="icon-moon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
    
    <div class="steps-panel">
      <h3>Steps to interact</h3>
      <ol>
{steps}
      </ol>
    </div>

    <div class="card">
{content}
    </div>

    <div class="explain-panel" id="explain">{explain}</div>

    <div class="caption" id="caption">{caption}</div>
  </div>
  <script src="script.js"></script>
</body>
</html>"""

css_template = """
:root {
  --bg-color: #ffffff;
  --panel-bg: #f8f9fa;
  --border-color: #e9ecef;
  --text-main: #212529;
  --text-muted: #6c757d;
  --primary: #0d6efd;
  --active: #ffc107;
  --success: #198754;
  --danger: #dc3545;
  --frozen: #adb5bd;
}

[data-theme="dark"] {
  --bg-color: #212529;
  --panel-bg: #343a40;
  --border-color: #495057;
  --text-main: #f8f9fa;
  --text-muted: #ced4da;
  --primary: #0d6efd;
  --active: #ffc107;
  --success: #198754;
  --danger: #dc3545;
  --frozen: #6c757d;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg-color);
  color: var(--text-main);
  margin: 0;
  padding: 20px;
}
.app-container { max-width: 800px; margin: 0 auto; }
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.theme-toggle { background: none; border: none; color: var(--text-main); cursor: pointer; }
.steps-panel, .explain-panel, .card {
  background: var(--panel-bg); border: 1px solid var(--border-color);
  border-radius: 8px; padding: 15px; margin-bottom: 20px;
}
.steps-panel h3 { margin-top: 0; }
.caption { font-style: italic; color: var(--text-muted); opacity: 0; transition: opacity 0.5s; }
.caption.visible { opacity: 1; }
button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
.btn-primary { background: var(--primary); color: white; }
.btn-secondary { background: var(--border-color); color: var(--text-main); }
.btn-primary:disabled, .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

{extra_css}
"""

mobile_css_template = css_template.replace('.app-container { max-width: 800px; margin: 0 auto; }', '.app-container { max-width: 100%; padding: 10px; margin: 0; }\n.btn-reset { background: var(--success); color: white; border: none; border-radius: 4px; padding: 8px 16px; font-weight: bold; cursor: pointer; }')

js_base = """
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
"""

def make_module(slug, num, title, steps, content, explain, caption, extra_css, js_specific):
    d_dir = os.path.join(base_dir, slug)
    m_dir = os.path.join(d_dir, 'mobile')
    os.makedirs(m_dir, exist_ok=True)
    
    html = html_template.replace('{num}', num).replace('{title}', title).replace('{steps}', steps).replace('{content}', content).replace('{explain}', explain).replace('{caption}', caption)
    css = css_template.replace('{extra_css}', extra_css)
    m_css = mobile_css_template.replace('{extra_css}', extra_css)
    js = js_base + js_specific
    
    for d, c in [(d_dir, css), (m_dir, m_css)]:
        with open(os.path.join(d, 'index.html'), 'w', encoding='utf-8') as f: f.write(html)
        with open(os.path.join(d, 'style.css'), 'w', encoding='utf-8') as f: f.write(c)
        with open(os.path.join(d, 'script.js'), 'w', encoding='utf-8') as f: f.write(js)
    print(f'Generated {slug}')

# 43
make_module('module-43-catastrophic-forgetting', '43', 'Catastrophic Forgetting',
    '<li>Click "Fine-tune on Task B (no protection)".</li><li>Click "Reset".</li><li>Click "Fine-tune on Task B (with protection)" and compare outcomes.</li>',
    '''<div class="controls-row" style="margin-bottom: 20px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn-primary" id="btn-no-prot">Fine-tune on Task B (no protection)</button>
        <button class="btn-secondary" id="btn-with-prot">Fine-tune on Task B (with EWC/replay protection)</button>
        <button class="btn-secondary" id="btn-reset">Reset</button>
      </div>
      <div style="display:flex; justify-content:space-around; align-items:center; flex-wrap:wrap;">
        <div style="text-align:center;">
          <div class="box-title">Task A accuracy</div>
          <svg id="gauge-a" width="150" height="150" viewBox="0 0 100 100"></svg>
        </div>
        <div style="text-align:center;">
          <div class="box-title">Task B accuracy</div>
          <svg id="gauge-b" width="150" height="150" viewBox="0 0 100 100"></svg>
        </div>
      </div>''',
    'Both tasks start at 85% accuracy.',
    'Same fine-tuning goal, same starting point — protecting old-task weights is the only difference between Task A collapsing and Task A barely moving.',
    '.box-title { font-weight:bold; margin-bottom:10px; } .gauge-bg { fill: none; stroke: var(--border-color); stroke-width: 10; } .gauge-val { fill: none; stroke-width: 10; stroke-linecap: round; transition: stroke-dasharray 1s ease-in-out, stroke 1s ease-in-out; } .gauge-text { font-size: 20px; font-weight: bold; fill: var(--text-main); text-anchor: middle; alignment-baseline: middle; }',
    '''
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}
function describeArc(x, y, radius, startAngle, endAngle){
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
    return d;       
}

const circLength = 2 * Math.PI * 40;
const svgA = d3.select("#gauge-a");
const svgB = d3.select("#gauge-b");

function initGauge(svg) {
  svg.append("circle").attr("cx", 50).attr("cy", 50).attr("r", 40).attr("class", "gauge-bg");
  svg.append("circle").attr("cx", 50).attr("cy", 50).attr("r", 40).attr("class", "gauge-val")
     .style("stroke-dasharray", `0 ${circLength}`).style("transform", "rotate(-90deg)").style("transform-origin", "50px 50px");
  svg.append("text").attr("x", 50).attr("y", 50).attr("class", "gauge-text").text("0%");
}
initGauge(svgA); initGauge(svgB);

function setGauge(svg, pct, color) {
  svg.select(".gauge-val").style("stroke-dasharray", `${(pct/100)*circLength} ${circLength}`).style("stroke", color);
  
  const textEl = svg.select(".gauge-text").node();
  const startPct = parseInt(textEl.textContent) || 0;
  d3.transition().duration(1000).tween("text", function() {
    const i = d3.interpolateRound(startPct, pct);
    return function(t) { textEl.textContent = i(t) + "%"; };
  });
}

function reset() {
  setGauge(svgA, 85, "var(--primary)");
  setGauge(svgB, 85, "var(--primary)");
  document.getElementById('explain').textContent = "Both tasks reset to 85% accuracy.";
}
reset();

document.getElementById('btn-no-prot').addEventListener('click', () => {
  markInteracted();
  setGauge(svgA, 40, "var(--danger)");
  setGauge(svgB, 95, "var(--success)");
  document.getElementById('explain').textContent = "Without protection, learning Task B overwrites knowledge for Task A. Task A accuracy collapses.";
});

document.getElementById('btn-with-prot').addEventListener('click', () => {
  markInteracted();
  reset();
  setTimeout(() => {
    setGauge(svgA, 82, "var(--success)");
    setGauge(svgB, 92, "var(--success)");
    document.getElementById('explain').textContent = "With protection (EWC/replay), Task B is learned while constraining weights important for Task A.";
  }, 1100);
});

document.getElementById('btn-reset').addEventListener('click', reset);
    '''
)

# 44
make_module('module-44-peft', '44', 'Parameter-Efficient Fine-Tuning (PEFT)',
    '<li>Click the "Full fine-tuning" / "PEFT" toggle.</li><li>Compare how many blocks turn warm-colored each time.</li>',
    '''<div style="margin-bottom:20px;">
         <label style="font-weight:bold; cursor:pointer;">
           <input type="checkbox" id="peft-toggle" style="margin-right:10px;"> Full fine-tuning / PEFT
         </label>
       </div>
       <div class="readout" id="readout" style="margin-bottom:20px; font-weight:bold;">Trainable parameters: 4 of 52 (8%)</div>
       <div style="display:flex; gap:20px; align-items:center;">
         <div id="grid-base" class="grid-base"></div>
         <div style="font-size:24px; font-weight:bold;">+</div>
         <div id="grid-adapter" class="grid-adapter"></div>
       </div>''',
    'PEFT state active: Only the small adapter blocks are updated during training.',
    'Same base model size both times — the only thing that changed is how many of these blocks are actually allowed to update.',
    '''
.grid-base { display:grid; grid-template-columns: repeat(8, 20px); gap:4px; }
.grid-adapter { display:grid; grid-template-columns: repeat(1, 20px); grid-template-rows: repeat(4, 20px); gap:4px; }
.block { width:20px; height:20px; border-radius:2px; transition: background-color 400ms ease; }
.block-frozen { background-color: var(--frozen); }
.block-active { background-color: var(--active); }
.block-hot { background-color: #fd7e14; } /* Warm orange representing training, avoiding --danger red */
    ''',
    '''
const gridBase = document.getElementById('grid-base');
const gridAdapter = document.getElementById('grid-adapter');
const toggle = document.getElementById('peft-toggle');
const readout = document.getElementById('readout');
const explain = document.getElementById('explain');

for(let i=0; i<48; i++) {
  const el = document.createElement('div');
  el.className = 'block block-frozen base-block';
  gridBase.appendChild(el);
}
for(let i=0; i<4; i++) {
  const el = document.createElement('div');
  el.className = 'block block-active adapter-block';
  gridAdapter.appendChild(el);
}

toggle.addEventListener('change', () => {
  markInteracted();
  const isFull = toggle.checked;
  const baseBlocks = document.querySelectorAll('.base-block');
  
  if(isFull) {
    baseBlocks.forEach(b => { b.classList.remove('block-frozen'); b.classList.add('block-hot'); });
    readout.textContent = "Trainable parameters: 48 of 52 (92%)";
    explain.textContent = "Full fine-tuning active: The entire base model is being updated. High compute and memory cost.";
  } else {
    baseBlocks.forEach(b => { b.classList.add('block-frozen'); b.classList.remove('block-hot'); });
    readout.textContent = "Trainable parameters: 4 of 52 (8%)";
    explain.textContent = "PEFT state active: Only the small adapter blocks are updated during training. Base model is frozen.";
  }
});
    '''
)

# 45
make_module('module-45-lora-qlora', '45', 'LoRA and QLoRA',
    '<li>Click "Compute update".</li><li>Watch A and B combine into the delta grid added to W.</li><li>Toggle "QLoRA view" to see the quantized version.</li>',
    '''<div class="controls-row" style="margin-bottom: 20px; display:flex; gap:10px; align-items:center;">
         <button class="btn-primary" id="btn-compute">Compute update</button>
         <label style="cursor:pointer; font-weight:bold;"><input type="checkbox" id="qlora-toggle"> QLoRA view</label>
       </div>
       <div id="matrix-container" style="display:flex; align-items:center; gap:20px; min-height:200px; position:relative;">
         <div style="text-align:center;"><div style="margin-bottom:5px;">W (8x8)</div><svg id="svg-w" width="160" height="160"></svg></div>
         <div id="plus-sign" style="font-size:24px; font-weight:bold; opacity:0;">+</div>
         <div id="delta-container" style="text-align:center; opacity:0; width:160px;"><div style="margin-bottom:5px;">ΔW = B×A</div><svg id="svg-delta" width="160" height="160"></svg></div>
         <div id="anim-ab" style="display:flex; align-items:center; gap:10px;">
           <div style="text-align:center;"><div style="margin-bottom:5px;">B (8x2)</div><svg id="svg-b" width="40" height="160"></svg></div>
           <div style="font-size:20px;">×</div>
           <div style="text-align:center;"><div style="margin-bottom:5px;">A (2x8)</div><svg id="svg-a" width="160" height="40"></svg></div>
         </div>
       </div>''',
    'W is frozen. A and B are small trainable matrices.',
    'W never changes color or texture in the top state — it\'s completely frozen. Only these two thin strips are ever actually trained.',
    '.cell { stroke: #fff; stroke-width: 1px; } .cell-frozen { fill: var(--frozen); opacity: 0.8; } .cell-active { fill: var(--active); } .cell-delta { fill: #fd7e14; }',
    '''
const svgW = d3.select('#svg-w');
const svgB = d3.select('#svg-b');
const svgA = d3.select('#svg-a');
const svgDelta = d3.select('#svg-delta');

function drawGrid(svg, rows, cols, cellClass, width, height) {
  svg.selectAll('*').remove();
  const cW = width/cols, cH = height/rows;
  for(let r=0; r<rows; r++) {
    for(let c=0; c<cols; c++) {
      let opacity = 0.4 + (Math.random() * 0.6); // illustrative weights
      svg.append('rect').attr('x', c*cW).attr('y', r*cH).attr('width', cW).attr('height', cH)
         .attr('class', 'cell ' + cellClass).style('opacity', opacity);
    }
  }
}

drawGrid(svgW, 8, 8, 'cell-frozen', 160, 160);
drawGrid(svgB, 8, 2, 'cell-active', 40, 160);
drawGrid(svgA, 2, 8, 'cell-active', 160, 40);
drawGrid(svgDelta, 8, 8, 'cell-delta', 160, 160);

const qloraToggle = document.getElementById('qlora-toggle');
qloraToggle.addEventListener('change', () => {
  markInteracted();
  const isQ = qloraToggle.checked;
  if(isQ) {
    svgW.selectAll('*').remove();
    for(let r=0; r<4; r++) {
      for(let c=0; c<4; c++) {
        svgW.append('rect').attr('x', c*40).attr('y', r*40).attr('width', 40).attr('height', 40)
           .attr('class', 'cell cell-frozen').style('opacity', 0.6);
        svgW.append('text').attr('x', c*40+20).attr('y', r*40+20)
           .attr('text-anchor', 'middle').attr('alignment-baseline', 'middle')
           .style('font-size', '10px').style('fill', '#fff').text('4-bit');
      }
    }
    document.getElementById('explain').textContent = "QLoRA active: W is heavily quantized to 4-bit blocks. A and B remain in higher precision for stable training.";
  } else {
    drawGrid(svgW, 8, 8, 'cell-frozen', 160, 160);
    document.getElementById('explain').textContent = "LoRA active: W is in standard precision but frozen.";
  }
});

const btnCompute = document.getElementById('btn-compute');
btnCompute.addEventListener('click', () => {
  markInteracted();
  btnCompute.disabled = true;
  document.getElementById('explain').textContent = "Multiplying A and B creates the low-rank delta matrix...";
  
  // Animate sweep
  const sweep = d3.select('#anim-ab').append('div').style('position', 'absolute')
                  .style('top', 0).style('left', 0).style('width', '100%').style('height', '100%')
                  .style('background', 'rgba(255,193,7,0.3)').style('pointer-events', 'none');
                  
  sweep.transition().duration(500).style('opacity', 0).on('end', () => {
    sweep.remove();
    document.getElementById('anim-ab').style.display = 'none';
    
    document.getElementById('delta-container').style.opacity = 1;
    document.getElementById('plus-sign').style.opacity = 1;
    document.getElementById('explain').textContent = "The computed delta matrix is added to W.";
    
    setTimeout(() => {
      document.getElementById('anim-ab').style.display = 'flex';
      document.getElementById('delta-container').style.opacity = 0;
      document.getElementById('plus-sign').style.opacity = 0;
      btnCompute.disabled = false;
      document.getElementById('explain').textContent = qloraToggle.checked ? "QLoRA active: W is heavily quantized to 4-bit blocks." : "W is frozen. A and B are small trainable matrices.";
    }, 2000);
  });
});
    '''
)

# 46
make_module('module-46-model-distillation', '46', 'Model Distillation',
    '<li>Drag the "Temperature" slider.</li><li>Click "Train step" repeatedly.</li><li>Watch the student\'s bars move closer to the teacher\'s.</li>',
    '''<div class="controls-row" style="margin-bottom: 20px; display:flex; align-items:center; gap:20px;">
         <label>Temperature: <span id="temp-val">1.0</span><br>
           <input type="range" id="slider-temp" min="0.5" max="3.0" step="0.1" value="1.0">
         </label>
         <button class="btn-primary" id="btn-train">Train step (0/5)</button>
       </div>
       <div class="layout-split" style="display:flex; gap:20px; width:100%;">
         <div style="flex:1;"><div class="box-title">Teacher</div><canvas id="chart-teacher"></canvas></div>
         <div style="flex:1;"><div class="box-title">Student</div><canvas id="chart-student"></canvas></div>
       </div>''',
    'Temperature 1.0. The teacher has sharp predictions.',
    'Raise the temperature and watch the smaller bars in the teacher\'s distribution become visible — those are exactly the signal the student is learning from that a hard label alone would never show.',
    '',
    '''
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
    '''
)
