import os

def build_m3(base_dir):
    slug = 'module-03-tokenization'
    d_dir = os.path.join(base_dir, 'build', slug)
    m_dir = os.path.join(d_dir, 'mobile')
    os.makedirs(m_dir, exist_ok=True)

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

.text-input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  font-family: var(--font);
  font-size: 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  resize: vertical;
  min-height: 80px;
}
.chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  min-height: 60px;
  padding: 12px;
  background: var(--bg-muted);
  border-radius: 8px;
  border: 1px dashed var(--border);
}
.token-chip {
  padding: 6px 12px;
  border-radius: 16px;
  color: #fff;
  font-family: var(--mono);
  font-size: 14px;
  cursor: pointer;
  transition: transform 150ms var(--ease-out), box-shadow 150ms var(--ease-out);
  animation: popIn 150ms var(--ease-bounce);
}
.token-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
.token-chip.t-0 { background: var(--primary); }
.token-chip.t-1 { background: var(--primary-light); }
@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
"""

    m_css = css + """
body { padding: 16px; }
.card { max-width: 100%; padding: 16px; }
.theme-toggle { width: 44px; height: 44px; top: 12px; right: 12px; }
.chip-container { padding: 16px; gap: 10px; }
.token-chip { padding: 8px 14px; font-size: 16px; min-height: 44px; display: flex; align-items: center; justify-content: center; }
"""

    html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Module 3 - Tokenization</title>
  <link rel="stylesheet" href="style.css">
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
        <li>Type or edit the sentence in the text box.</li>
        <li>Watch the token chips update live.</li>
        <li>{HOVER_TAP} any chip to see its token ID.</li>
      </ol>
    </div>
    
    <div class="text-input-container">
      <textarea id="text-input">The cat sat on the mat because it was tired.</textarea>
      <div class="chip-container" id="chip-container"></div>
    </div>
    
    <div class="explain-panel" id="explain">Start typing to see how the text is split into tokens.</div>
    
    <div class="caption" id="caption">This is exactly what the model sees — the words you type are being split into these token units before anything else happens.</div>
  </div>
  <script src="script.js"></script>
</body>
</html>"""

    js = """
// Theme toggle
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

// Pseudo-tokenizer
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % 100000;
}
function tokenize(text) {
  const tokens = [];
  let currentWord = "";
  let currentStart = 0;
  const suffixes = ["ing", "tion", "ed", "ly"];
  
  function flushWord(index) {
    if (currentWord.length === 0) return;
    
    // Check suffix
    let foundSuffix = "";
    for (let s of suffixes) {
      if (currentWord.length > s.length && currentWord.toLowerCase().endsWith(s)) {
        foundSuffix = currentWord.slice(-s.length);
        break;
      }
    }
    
    if (foundSuffix) {
      let base = currentWord.slice(0, -foundSuffix.length);
      tokens.push({
        text: base,
        start: currentStart,
        end: currentStart + base.length,
        id: hashString(base)
      });
      tokens.push({
        text: foundSuffix,
        start: currentStart + base.length,
        end: currentStart + currentWord.length,
        id: hashString(foundSuffix)
      });
    } else {
      tokens.push({
        text: currentWord,
        start: currentStart,
        end: currentStart + currentWord.length,
        id: hashString(currentWord)
      });
    }
    currentWord = "";
  }
  
  let i = 0;
  while (i < text.length) {
    const char = text[i];
    if (/\\s/.test(char)) {
      flushWord(i);
      // keep whitespace as token? GPT tokenizer often merges leading spaces.
      // we'll emit space as its own token if there's multiple, or just prepend to next word.
      // for simplicity, let's treat whitespace + punctuation as distinct tokens.
      let wsStart = i;
      let wsText = char;
      while (i + 1 < text.length && /\\s/.test(text[i + 1])) {
        wsText += text[i + 1];
        i++;
      }
      tokens.push({ text: wsText, start: wsStart, end: i + 1, id: hashString(wsText) });
    } else if (/[.,?!;'":]/.test(char)) {
      flushWord(i);
      tokens.push({ text: char, start: i, end: i + 1, id: hashString(char) });
    } else {
      if (currentWord.length === 0) currentStart = i;
      currentWord += char;
    }
    i++;
  }
  flushWord(i);
  return tokens;
}

const input = document.getElementById('text-input');
const container = document.getElementById('chip-container');
const explain = document.getElementById('explain');
const caption = document.getElementById('caption');
let interacted = false;

// {TOUCH_LOGIC}

function renderTokens() {
  const text = input.value;
  const tokens = tokenize(text);
  
  // preserve existing DOM to avoid reflow when possible, 
  // but for simplicity we'll diff via basic recreation, preserving objects.
  container.innerHTML = '';
  
  let nonSpaceCount = 0;
  tokens.forEach((t, index) => {
    // don't visibly render pure space tokens, or we can render them faintly?
    // The spec says "one per token". We'll render them, but maybe styling them differently or just skip rendering if it's pure space to keep it clean.
    // GPT tokenizer merges spaces into words (e.g. " cat").
    // Our pseudo tokenized them. Let's merge leading spaces visually if possible, or just skip rendering pure spaces for UI clarity unless it's the only thing.
    if (/^\\s+$/.test(t.text)) {
      // Create a faint chip for space
      const chip = document.createElement('div');
      chip.className = `token-chip`;
      chip.style.background = 'transparent';
      chip.style.color = 'var(--text-muted)';
      chip.style.border = '1px solid var(--border)';
      chip.textContent = "␣".repeat(t.text.length);
      chip.title = `ID: ${t.id} · chars ${t.start}–${t.end}`;
      // TOUCH_EVENT_LISTENER
      container.appendChild(chip);
      return;
    }
    
    const chip = document.createElement('div');
    chip.className = `token-chip t-${nonSpaceCount % 2}`;
    chip.textContent = t.text;
    chip.title = `ID: ${t.id} · chars ${t.start}–${t.end}`;
    // TOUCH_EVENT_LISTENER
    container.appendChild(chip);
    nonSpaceCount++;
  });
  
  if (interacted) {
    explain.textContent = `The text is split into ${tokens.length} tokens. Notice how punctuation or suffixes might split into their own units!`;
  }
}

let timeout;
input.addEventListener('input', () => {
  if (!interacted) {
    interacted = true;
    caption.classList.add('visible');
  }
  clearTimeout(timeout);
  timeout = setTimeout(renderTokens, 150);
});

renderTokens();
"""
    m_js = js.replace('{TOUCH_LOGIC}', """
    let activeChip = null;
    function handleTap(chip, t) {
      if (activeChip) activeChip.style.transform = '';
      activeChip = chip;
      chip.style.transform = 'scale(1.1)';
      explain.textContent = `Tapped token "${t.text}" — ID: ${t.id}, spanning chars ${t.start}–${t.end}.`;
    }
    """).replace('// TOUCH_EVENT_LISTENER', """
      chip.addEventListener('click', () => { handleTap(chip, t); interacted = true; caption.classList.add('visible'); });
    """)
    
    d_js = js.replace('{TOUCH_LOGIC}', "").replace('// TOUCH_EVENT_LISTENER', "")

    with open(os.path.join(d_dir, 'style.css'), 'w') as f: f.write(css)
    with open(os.path.join(d_dir, 'index.html'), 'w') as f: f.write(html.replace('{HOVER_TAP}', 'Hover'))
    with open(os.path.join(d_dir, 'script.js'), 'w') as f: f.write(d_js)
    
    with open(os.path.join(m_dir, 'style.css'), 'w') as f: f.write(m_css)
    with open(os.path.join(m_dir, 'index.html'), 'w') as f: f.write(html.replace('{HOVER_TAP}', 'Tap'))
    with open(os.path.join(m_dir, 'script.js'), 'w') as f: f.write(m_js)

build_m3('d:/AcadByte/22-07-26/ML TOP 50 Reformatted/claude game lib/diagrams')
