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



function renderTokens() {
  const text = input.value;
  const tokens = tokenize(text);
  
  container.innerHTML = '';
  
  let nonSpaceCount = 0;
  tokens.forEach((t, index) => {
    if (/^\\s+$/.test(t.text)) {
      const chip = document.createElement('div');
      chip.className = `token-chip`;
      chip.style.background = 'transparent';
      chip.style.color = 'var(--text-muted)';
      chip.style.border = '1px solid var(--border)';
      chip.textContent = "␣".repeat(t.text.length);
      chip.title = `ID: ${t.id} · chars ${t.start}–${t.end}`;
      
      container.appendChild(chip);
      return;
    }
    
    const chip = document.createElement('div');
    chip.className = `token-chip t-${nonSpaceCount % 2}`;
    chip.textContent = t.text;
    chip.title = `ID: ${t.id} · chars ${t.start}–${t.end}`;
    
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
