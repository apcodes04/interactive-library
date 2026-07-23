// Light/dark toggle — must run before the chart is built so the correct
// theme's colors are read on first paint.
(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);
})();

function themeColor(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

const tokens = ["sat", "ran", "walked", "stood", "jumped", "stayed", "left", "flew"];
const logits = [4.0, 2.0, 1.8, 1.2, 0.8, 0.5, 0.2, -0.5];

function softmax(vals, T) {
  const scaled = vals.map(v => v / T);
  const max = Math.max(...scaled);
  const exps = scaled.map(v => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
}

const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: tokens,
    datasets: [{
      label: 'Probability',
      data: softmax(logits, 1.0),
      backgroundColor: tokens.map(() => themeColor('--primary')),
      borderRadius: 6
    }]
  },
  options: {
    animation: { duration: 300 },
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: 1, ticks: { callback: v => (v * 100).toFixed(0) + '%' } },
      x: { ticks: { font: { size: 10 } } }
    }
  }
});

const tempSlider = document.getElementById('temp');
const tempReadout = document.getElementById('tempReadout');
const caption = document.getElementById('caption');
const explainPanel = document.getElementById('explainPanel');
const sampleBtn = document.getElementById('sampleBtn');
let interacted = false;

function topToken(probs) {
  let maxIdx = 0;
  for (let i = 1; i < probs.length; i++) if (probs[i] > probs[maxIdx]) maxIdx = i;
  return { token: tokens[maxIdx], prob: probs[maxIdx] };
}

function explainForTemp(T, probs) {
  const top = topToken(probs);
  if (T < 0.4) {
    return `Temperature = ${T.toFixed(2)} → almost all probability (${(top.prob * 100).toFixed(0)}%) is now on "${top.token}" — close to greedy decoding.`;
  } else if (T <= 1.2) {
    return `Temperature = ${T.toFixed(2)} → "${top.token}" still leads (${(top.prob * 100).toFixed(0)}%) but real probability remains on the next few tokens.`;
  } else {
    return `Temperature = ${T.toFixed(2)} → probability has spread out much more evenly; "${top.token}" only leads with ${(top.prob * 100).toFixed(0)}%.`;
  }
}

function setDefaultExplain() {
  explainPanel.textContent = explainForTemp(1.0, softmax(logits, 1.0));
}
setDefaultExplain();

function reveal() {
  if (!interacted) {
    interacted = true;
    caption.classList.add('visible');
  }
}

tempSlider.addEventListener('input', () => {
  reveal();
  const T = parseFloat(tempSlider.value);
  tempReadout.textContent = T.toFixed(2);
  const probs = softmax(logits, T);
  chart.data.datasets[0].data = probs;
  chart.data.datasets[0].backgroundColor = tokens.map(() => themeColor('--primary'));
  chart.update();
  explainPanel.textContent = explainForTemp(T, probs);
});

sampleBtn.addEventListener('click', () => {
  reveal();
  const T = parseFloat(tempSlider.value);
  const probs = softmax(logits, T);
  let r = Math.random();
  let idx = 0;
  for (let i = 0; i < probs.length; i++) {
    if (r < probs[i]) { idx = i; break; }
    r -= probs[i];
    idx = i;
  }
  chart.data.datasets[0].backgroundColor = tokens.map((_, i) => i === idx ? themeColor('--success') : themeColor('--primary'));
  chart.update();
  explainPanel.textContent = `Sampled "${tokens[idx]}" (a ${(probs[idx] * 100).toFixed(1)}% chance at this temperature) — a weighted random draw, not necessarily the top token.`;
  setTimeout(() => {
    chart.data.datasets[0].backgroundColor = tokens.map(() => themeColor('--primary'));
    chart.update();
  }, 900);
});

// Toggle button: swap the icon, persist the choice, and immediately
// re-color the chart bars so light/dark switches without a reload.
window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('themeToggle');
  const sun = document.getElementById('themeIconSun');
  const moon = document.getElementById('themeIconMoon');
  const root = document.documentElement;

  function syncIcon(theme) {
    sun.style.display = theme === 'dark' ? 'none' : 'block';
    moon.style.display = theme === 'dark' ? 'block' : 'none';
  }
  syncIcon(root.getAttribute('data-theme'));

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncIcon(next);
    chart.data.datasets[0].backgroundColor = tokens.map(() => themeColor('--primary'));
    chart.update();
  });
});
