import os
import sys

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

mobile_css_template = css_template.replace('.app-container { max-width: 800px; margin: 0 auto; }', '.app-container { max-width: 100%; padding: 10px; margin: 0; }\n.btn-reset { background: var(--success); color: white; }')

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

# 41
make_module('module-41-few-shot-learning', '41', 'Few-Shot Learning',
    '<li>Click "+ Add example" repeatedly.</li><li>Watch the confidence meter rise, then plateau.</li><li>Click "Remove example" to reverse it.</li>',
    '''<div id="example-container"></div>
      <div class="example-box" id="prompt-box"><strong>Prompt:</strong> Translate English to French.</div>
      <div class="btn-row" style="margin:10px 0;">
        <button class="btn-primary" id="btn-add">+ Add example</button>
        <button class="btn-secondary" id="btn-remove" disabled>Remove example</button>
      </div>
      <div>Confidence: <span id="conf-label">40%</span></div>
      <div class="meter-bg"><div class="meter-fill" id="meter-fill" style="width:40%;"></div></div>''',
    'Current examples: 0. Confidence is low without examples.',
    'Notice the meter barely moves after the third example — this is the diminishing-returns point described in this module, made visible.',
    '.example-box { border: 1px dashed var(--text-muted); padding: 10px; margin-bottom: 5px; border-radius: 4px; }\n.meter-bg { width: 100%; height: 20px; background: var(--border-color); border-radius: 10px; overflow: hidden; margin-top: 10px; }\n.meter-fill { height: 100%; background: var(--primary); transition: width 400ms ease-out, background 400ms ease-out; }',
    '''
const confLookup = [40, 65, 80, 85, 87, 88];
let examples = 0;
const btnAdd = document.getElementById('btn-add');
const btnRemove = document.getElementById('btn-remove');
const promptBox = document.getElementById('prompt-box');
const meterFill = document.getElementById('meter-fill');
const confLabel = document.getElementById('conf-label');
const explain = document.getElementById('explain');

function updateState() {
  markInteracted();
  const conf = confLookup[examples];
  confLabel.textContent = conf + '%';
  meterFill.style.width = conf + '%';
  if (conf < 65) meterFill.style.background = 'var(--primary)';
  else if (conf < 85) meterFill.style.background = 'var(--active)';
  else meterFill.style.background = 'var(--success)';
  
  btnAdd.disabled = (examples >= 5);
  btnRemove.disabled = (examples <= 0);
  
  if (examples === 0) explain.textContent = "Current examples: 0. Confidence is low without examples.";
  else if (examples <= 2) explain.textContent = `Current examples: ${examples}. Confidence rises quickly initially.`;
  else explain.textContent = `Current examples: ${examples}. Confidence is plateauing. Diminishing returns in action.`;
  
  document.querySelectorAll('.added-example').forEach(e => e.remove());
  for(let i=0; i<examples; i++) {
    const el = document.createElement('div');
    el.className = 'example-box added-example';
    el.textContent = `Example ${i+1}: Cheese -> Fromage`;
    promptBox.parentNode.insertBefore(el, promptBox);
  }
}
btnAdd.addEventListener('click', () => { if (examples < 5) { examples++; updateState(); } });
btnRemove.addEventListener('click', () => { if (examples > 0) { examples--; updateState(); } });
    '''
)

# 42
make_module('module-42-chain-of-thought', '42', 'Chain-of-Thought Prompting',
    '<li>Click "Run both."</li><li>Watch the two answer boxes type out.</li><li>Compare their final answers.</li>',
    '''<div><strong>Question:</strong> What is 47 × 36?</div>
       <button class="btn-primary" id="btn-run" style="margin: 10px 0;">Run both</button>
       <div class="layout-split" style="display:flex; gap:20px;">
         <div style="flex:1;"><div class="box-title">Direct answer</div><div class="answer-box" id="ans-direct"></div></div>
         <div style="flex:1;"><div class="box-title">Chain-of-thought</div><div class="answer-box" id="ans-cot"></div></div>
       </div>''',
    'Click "Run both" to see the difference between direct answering and chain-of-thought reasoning.',
    'Same question, same model capability — one had room to work the problem out, the other didn\'t.',
    '.answer-box { min-height: 100px; border: 1px solid var(--border-color); padding: 10px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; }\n.box-title { font-weight: bold; margin-bottom: 5px; }',
    '''
const textDirect = "1,592";
const textCot = "47 × 36 = 47 × 30 + 47 × 6 = 1,410 + 282 = 1,692";
const btnRun = document.getElementById('btn-run');
const ansDirect = document.getElementById('ans-direct');
const ansCot = document.getElementById('ans-cot');
const explain = document.getElementById('explain');
let isRunning = false;

btnRun.addEventListener('click', () => {
  if (isRunning) return;
  isRunning = true;
  markInteracted();
  ansDirect.innerHTML = ''; ansCot.innerHTML = '';
  explain.textContent = "Generating answers...";
  
  let iDirect = 0, iCot = 0;
  
  const timerDirect = setInterval(() => {
    if (iDirect < textDirect.length) {
      ansDirect.textContent += textDirect.charAt(iDirect);
      iDirect++;
    } else {
      clearInterval(timerDirect);
      ansDirect.innerHTML = `<span style="color:var(--danger)">${textDirect}</span>`;
    }
  }, 150); // slow it down to finish roughly same time or earlier
  
  const timerCot = setInterval(() => {
    if (iCot < textCot.length) {
      ansCot.textContent += textCot.charAt(iCot);
      iCot++;
    } else {
      clearInterval(timerCot);
      ansCot.innerHTML = textCot.replace("1,692", `<span style="color:var(--success)">1,692</span>`);
      explain.textContent = "Generation complete. Direct answer is incorrect, chain-of-thought is correct.";
      isRunning = false;
    }
  }, 30);
});
    '''
)
