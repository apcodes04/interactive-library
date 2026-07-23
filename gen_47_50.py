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

mobile_css_template = css_template.replace('.app-container { max-width: 800px; margin: 0 auto; }', '.app-container { max-width: 100%; padding: 10px; margin: 0; display:flex; flex-direction:column; }\n.btn-reset { background: var(--success); color: white; border: none; border-radius: 4px; padding: 8px 16px; font-weight: bold; cursor: pointer; }')

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
    
    if slug == 'module-47-rag-pipeline':
        # Mobile specific order for multi-stage
        m_html = html.replace('<div class="card">', '<!-- mobile order -->').replace('</div>\n\n    <div class="explain-panel" id="explain">', '')
        m_html = m_html.replace('<!-- mobile order -->', '<div class="card">\n' + content + '\n</div>\n<div class="explain-panel" id="explain">' + explain + '</div>\n<div id="controls-container"></div>')
        html = html.replace('<div class="card">', '<div class="card">\n')
    else:
        m_html = html
        
    js = js_base + js_specific
    
    for d, c, h in [(d_dir, css, html), (m_dir, m_css, m_html)]:
        with open(os.path.join(d, 'index.html'), 'w', encoding='utf-8') as f: f.write(h)
        with open(os.path.join(d, 'style.css'), 'w', encoding='utf-8') as f: f.write(c)
        with open(os.path.join(d, 'script.js'), 'w', encoding='utf-8') as f: f.write(js)
    print(f'Generated {slug}')

# 47
make_module('module-47-rag-pipeline', '47', 'RAG Pipeline',
    '<li>Click any stage button, or drag the scrubber.</li><li>Use "◀ Back" / "Forward ▶" to step one stage at a time.</li><li>Click "Run query (auto-play)" to watch it play automatically.</li>',
    '''
<div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom: 20px;">
  <button class="stage" data-idx="0">1. Docs</button>
  <button class="stage" data-idx="1">2. Chunks</button>
  <button class="stage" data-idx="2">3. Embed</button>
  <button class="stage" data-idx="3">4. VecDB</button>
  <button class="stage" data-idx="4">5. Query</button>
  <button class="stage" data-idx="5">6. Retrieve</button>
  <button class="stage" data-idx="6">7. Prompt</button>
  <button class="stage" data-idx="7">8. LLM</button>
  <button class="stage" data-idx="8">9. Answer</button>
</div>
<div id="diagram" style="min-height: 250px; position:relative; border: 1px dashed var(--border-color); border-radius:8px; padding:10px;">
  <!-- Diagram layers rendered via JS -->
  <div id="layer-docs" class="layer">📄 📄</div>
  <div id="layer-chunks" class="layer">📦 📦 📦</div>
  <div id="layer-embed" class="layer"><svg width="100" height="100" id="svg-embed"></svg></div>
  <div id="layer-vecdb" class="layer">🛢️ Vector DB</div>
  <div id="layer-query" class="layer" style="top:20px; right:20px;">"What is AI?"</div>
  <div id="layer-prompt" class="layer" style="bottom:20px; right:20px;">Prompt + [Ch 1, Ch 2]</div>
  <div id="layer-llm" class="layer" style="bottom:20px; right:150px;">🤖 LLM</div>
  <div id="layer-ans" class="layer" style="bottom:20px; left:20px;">"AI is..."</div>
</div>
<div class="legend" id="legend"></div>
<div style="margin-top:20px; display:flex; align-items:center; gap:10px;">
  <input type="range" id="scrubber" min="0" max="8" step="1" value="0" style="flex:1;">
</div>
<div id="controls" style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
  <button class="btn-primary" id="btn-run">Run query (auto-play)</button>
  <button class="btn-secondary" id="btn-prev">◀ Back</button>
  <button class="btn-secondary" id="btn-next">Forward ▶</button>
  <button class="btn-secondary btn-reset" id="btn-reset">Reset</button>
</div>
    ''',
    'Stage 1: Documents. Start with raw text documents.',
    'Watch which chunks actually get pulled into the final prompt — everything else in that vector database, however relevant it might seem, never reaches the model at all.',
    '''
.stage { padding: 8px 12px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-muted); cursor:pointer; font-size:12px; transition: all 300ms; }
.stage.current { background: var(--primary); color: white; border-color: var(--primary); }
.stage.completed { background: var(--success); color: white; border-color: var(--success); }
.layer { position: absolute; transition: opacity 400ms, transform 400ms; opacity: 0; font-weight: bold; background: var(--bg-color); padding: 5px; border: 1px solid var(--border-color); border-radius: 4px;}
.layer.visible { opacity: 1; transform: scale(1); }
.legend { margin-top: 10px; font-size: 12px; color: var(--text-muted); }
    ''',
    '''
let currentStage = 0;
let playing = false;
let playInterval = null;
const stages = document.querySelectorAll('.stage');
const scrubber = document.getElementById('scrubber');
const layers = [
  document.getElementById('layer-docs'),
  document.getElementById('layer-chunks'),
  document.getElementById('layer-embed'),
  document.getElementById('layer-vecdb'),
  document.getElementById('layer-query'),
  null, // stage 6 is retrieval highlight in embed
  document.getElementById('layer-prompt'),
  document.getElementById('layer-llm'),
  document.getElementById('layer-ans')
];

// Embed SVG setup
const svg = d3.select('#svg-embed');
for(let i=0; i<10; i++) {
  svg.append('circle').attr('cx', 20 + Math.random()*60).attr('cy', 20 + Math.random()*60).attr('r', 3).attr('fill', 'var(--frozen)');
}
const c1 = svg.append('circle').attr('cx', 30).attr('cy', 30).attr('r', 4).attr('fill', 'var(--primary)').style('opacity', 0);
const c2 = svg.append('circle').attr('cx', 35).attr('cy', 28).attr('r', 4).attr('fill', 'var(--primary)').style('opacity', 0);
const c3 = svg.append('circle').attr('cx', 70).attr('cy', 80).attr('r', 4).attr('fill', 'var(--primary)').style('opacity', 0);
const queryC = svg.append('circle').attr('cx', 32).attr('cy', 32).attr('r', 5).attr('fill', 'var(--active)').style('opacity', 0);
const retrieveRing = svg.append('circle').attr('cx', 32).attr('cy', 30).attr('r', 15).attr('fill', 'none').attr('stroke', 'var(--active)').attr('stroke-width', 2).style('opacity', 0);

const explains = [
  "Stage 1: Documents. Start with raw text documents.",
  "Stage 2: Chunking. Split documents into manageable chunks.",
  "Stage 3: Embeddings. Convert chunks into vector points (blue). Gray dots are other existing chunks.",
  "Stage 4: Vector DB. Store all embeddings for fast search.",
  "Stage 5: Query. User asks a question.",
  "Stage 6: Retrieval. Embed the query (yellow) and find the nearest chunks (circled).",
  "Stage 7: Prompt. Insert the retrieved chunks into the prompt alongside the query.",
  "Stage 8: LLM. Pass the enriched prompt to the model.",
  "Stage 9: Answer. Model generates the final answer based on the provided context."
];

function updateUI() {
  stages.forEach((s, i) => {
    s.className = 'stage';
    if(i < currentStage) s.classList.add('completed');
    if(i === currentStage) s.classList.add('current');
  });
  scrubber.value = currentStage;
  document.getElementById('explain').textContent = explains[currentStage];
  
  // Layer visibility
  layers.forEach((l, i) => {
    if(!l) return;
    if(i <= currentStage) { l.classList.add('visible'); }
    else { l.classList.remove('visible'); }
  });
  
  // Custom layer logic
  if(currentStage >= 2) { c1.style('opacity', 1); c2.style('opacity', 1); c3.style('opacity', 1); }
  else { c1.style('opacity', 0); c2.style('opacity', 0); c3.style('opacity', 0); }
  
  if(currentStage >= 5) { queryC.style('opacity', 1); retrieveRing.style('opacity', 1); }
  else { queryC.style('opacity', 0); retrieveRing.style('opacity', 0); }
  
  // Legend
  const leg = document.getElementById('legend');
  if(currentStage >= 2 && currentStage < 5) leg.innerHTML = '🔵 Current Chunks ⚪ Decoy Chunks';
  else if(currentStage >= 5) leg.innerHTML = '🔵 Retrieved Chunks 🟡 Query ⚪ Ignored Chunks';
  else leg.innerHTML = '';
}

function stopPlay() {
  playing = false;
  document.getElementById('btn-run').textContent = 'Run query (auto-play)';
  clearInterval(playInterval);
}

document.getElementById('btn-run').addEventListener('click', () => {
  markInteracted();
  if(playing) { stopPlay(); return; }
  playing = true;
  document.getElementById('btn-run').textContent = 'Pause';
  if(currentStage === 8) currentStage = 0;
  playInterval = setInterval(() => {
    if(currentStage < 8) { currentStage++; updateUI(); }
    else stopPlay();
  }, 900);
});

stages.forEach((s, i) => s.addEventListener('click', () => {
  markInteracted();
  stopPlay();
  currentStage = i;
  updateUI();
}));

scrubber.addEventListener('input', () => {
  markInteracted();
  stopPlay();
  currentStage = parseInt(scrubber.value);
  updateUI();
});

document.getElementById('btn-prev').addEventListener('click', () => {
  markInteracted(); stopPlay();
  if(currentStage > 0) currentStage--;
  updateUI();
});
document.getElementById('btn-next').addEventListener('click', () => {
  markInteracted(); stopPlay();
  if(currentStage < 8) currentStage++;
  updateUI();
});
document.getElementById('btn-reset').addEventListener('click', () => {
  stopPlay();
  currentStage = 0;
  updateUI();
});

updateUI();

// Mobile controls reparenting
if(document.body.clientWidth < 600 && document.getElementById('controls-container')) {
  document.getElementById('controls-container').appendChild(document.getElementById('controls'));
}
    '''
)

# 48
make_module('module-48-knowledge-graph', '48', 'Knowledge Graph Integration',
    '<li>Click any entity node.</li><li>Read the plain-language facts that appear in the side panel.</li>',
    '''<div class="layout-split" style="display:flex; gap:20px; flex-wrap:wrap;">
         <div style="flex:2; border: 1px solid var(--border-color); border-radius:8px; min-height: 300px;">
           <svg id="graph-svg" width="100%" height="300"></svg>
         </div>
         <div style="flex:1; background:var(--panel-bg); padding:15px; border-radius:8px;">
           <h4 style="margin-top:0;">Facts for <span id="fact-title" style="color:var(--primary)">None</span></h4>
           <ul id="fact-list" style="padding-left:20px; font-size:14px;">
             <li>Select a node to view facts.</li>
           </ul>
         </div>
       </div>''',
    'Click a node to generate text.',
    'Click "Eiffel Tower" — every connected edge becomes a plain sentence instantly. That\'s the graph-to-text conversion step described in this module, made concrete.',
    '.node { cursor:pointer; fill: var(--primary); transition: fill 0.3s; } .node.active { fill: var(--active); } .link { stroke: var(--text-muted); stroke-width: 2px; }',
    '''
const nodes = [
  {id: 'Paris'}, {id: 'France'}, {id: 'Eiffel Tower'},
  {id: 'Louvre'}, {id: 'Seine'}, {id: 'Europe'}
];
const links = [
  {source: 'Paris', target: 'France', label: 'capital_of', text: 'Paris is the capital of France.'},
  {source: 'Eiffel Tower', target: 'Paris', label: 'located_in', text: 'The Eiffel Tower is located in Paris.'},
  {source: 'Louvre', target: 'Paris', label: 'located_in', text: 'The Louvre is located in Paris.'},
  {source: 'Seine', target: 'Paris', label: 'flows_through', text: 'The Seine flows through Paris.'},
  {source: 'France', target: 'Europe', label: 'part_of', text: 'France is part of Europe.'},
  {source: 'Paris', target: 'Seine', label: 'on_river', text: 'Paris is on the river Seine.'},
  {source: 'Eiffel Tower', target: 'Paris', label: 'built_in_1889', text: 'The Eiffel Tower was built in 1889.'}
];

const width = 400, height = 300;
const svg = d3.select('#graph-svg').attr('viewBox', `0 0 ${width} ${height}`);

const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id).distance(80))
  .force('charge', d3.forceManyBody().strength(-300))
  .force('center', d3.forceCenter(width / 2, height / 2));

const link = svg.append('g')
  .selectAll('line').data(links).enter().append('line')
  .attr('class', 'link');
  
const linkLabel = svg.append('g')
  .selectAll('text').data(links).enter().append('text')
  .style('font-size', '10px').style('fill', 'var(--text-muted)')
  .text(d => d.label);

const node = svg.append('g')
  .selectAll('circle').data(nodes).enter().append('circle')
  .attr('class', 'node').attr('r', 15)
  .on('click', (event, d) => {
    markInteracted();
    d3.selectAll('.node').classed('active', false);
    d3.select(event.currentTarget).classed('active', true);
    
    document.getElementById('fact-title').textContent = d.id;
    const ul = document.getElementById('fact-list');
    ul.innerHTML = '';
    
    let factsCount = 0;
    links.forEach(l => {
      if(l.source.id === d.id || l.target.id === d.id) {
        factsCount++;
        const li = document.createElement('li');
        li.textContent = l.text;
        ul.appendChild(li);
      }
    });
    document.getElementById('explain').textContent = `Generated ${factsCount} plain-language sentences from graph edges connected to ${d.id}.`;
  });
  
const nodeLabel = svg.append('g')
  .selectAll('text').data(nodes).enter().append('text')
  .text(d => d.id).style('font-size', '12px').attr('dx', 18).attr('dy', 4);

simulation.on('tick', () => {
  link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      
  linkLabel.attr('x', d => (d.source.x + d.target.x)/2)
           .attr('y', d => (d.source.y + d.target.y)/2);

  node.attr('cx', d => d.x).attr('cy', d => d.y);
  nodeLabel.attr('x', d => d.x).attr('y', d => d.y);
});
    '''
)

# 49
make_module('module-49-common-challenges', '49', 'Common Challenges With LLMs',
    '<li>Click a preset button.</li><li>Drag any of the 7 axis sliders to adjust it further.</li>',
    '''<div class="controls-row" style="margin-bottom: 20px; display:flex; gap:10px;">
         <button class="btn-secondary" id="btn-preset1">Customer support chatbot</button>
         <button class="btn-secondary" id="btn-preset2">Medical information assistant</button>
       </div>
       <div class="layout-split" style="display:flex; gap:20px; flex-wrap:wrap;">
         <div style="flex:1; min-width:250px;">
           <canvas id="radar-chart"></canvas>
         </div>
         <div id="sliders-container" style="flex:1; min-width:200px; display:flex; flex-direction:column; gap:10px;">
           <!-- Sliders generated via JS -->
         </div>
       </div>''',
    'Adjusting values...',
    'Load the "Medical information assistant" preset and compare its shape to the chatbot preset — the same 7 challenges apply everywhere, but never with equal weight.',
    '',
    '''
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
    '''
)

# 50
make_module('module-50-diagnostic-scenario', '50', 'Diagnosing Outputs',
    '<li>Click the root node.</li><li>Click one of the 4 branch questions.</li><li>Read the fix that appears, then click a different branch to compare.</li>',
    '''
<div id="tree-container" style="text-align:center;">
  <button class="btn-primary" id="btn-root" style="margin-bottom:20px; font-size:16px;">Offensive or factually incorrect output detected.</button>
  <div id="branches" style="display:none; justify-content:center; gap:10px; flex-wrap:wrap;">
    <div style="flex:1; min-width:150px;">
      <button class="btn-secondary branch-btn" style="width:100%; height:100%;">Is the input adversarial / a jailbreak attempt?</button>
      <div class="leaf-fix" style="display:none; margin-top:10px; padding:10px; background:var(--success); color:white; border-radius:4px;">Strengthen system prompt, add input filtering and output moderation.</div>
    </div>
    <div style="flex:1; min-width:150px;">
      <button class="btn-secondary branch-btn" style="width:100%; height:100%;">Is RAG involved?</button>
      <div class="leaf-fix" style="display:none; margin-top:10px; padding:10px; background:var(--success); color:white; border-radius:4px;">Audit retrieval pipeline and re-ranking, require source citation.</div>
    </div>
    <div style="flex:1; min-width:150px;">
      <button class="btn-secondary branch-btn" style="width:100%; height:100%;">Is temperature unusually high?</button>
      <div class="leaf-fix" style="display:none; margin-top:10px; padding:10px; background:var(--success); color:white; border-radius:4px;">Lower temperature / adjust sampling parameters.</div>
    </div>
    <div style="flex:1; min-width:150px;">
      <button class="btn-secondary branch-btn" style="width:100%; height:100%;">Was there a recent fine-tune or system-prompt change?</button>
      <div class="leaf-fix" style="display:none; margin-top:10px; padding:10px; background:var(--success); color:white; border-radius:4px;">Revert or retrain with cleaned data, apply stronger KL penalty.</div>
    </div>
  </div>
</div>
    ''',
    'Start by investigating the failure.',
    'Each path here leads to a completely different fix — which is exactly why reproducing and isolating the failure has to come before choosing one.',
    '.leaf-fix { font-weight: bold; font-size: 14px; animation: fadeIn 300ms; } @keyframes fadeIn { from {opacity:0} to {opacity:1} }',
    '''
const btnRoot = document.getElementById('btn-root');
const branches = document.getElementById('branches');
const branchBtns = document.querySelectorAll('.branch-btn');
const leafs = document.querySelectorAll('.leaf-fix');

btnRoot.addEventListener('click', () => {
  markInteracted();
  branches.style.display = 'flex';
  document.getElementById('explain').textContent = "Root selected. Investigate the 4 main branches.";
});

branchBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    markInteracted();
    // Collapse others
    leafs.forEach((l, j) => {
      if(i !== j) l.style.display = 'none';
      branchBtns[j].classList.remove('btn-primary');
      branchBtns[j].classList.add('btn-secondary');
    });
    // Toggle current
    if(leafs[i].style.display === 'block') {
      leafs[i].style.display = 'none';
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-secondary');
      document.getElementById('explain').textContent = "Branch collapsed. Compare other potential root causes.";
    } else {
      leafs[i].style.display = 'block';
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
      document.getElementById('explain').textContent = "Path selected. Implementing the specific fix for this root cause.";
    }
  });
});
    '''
)
