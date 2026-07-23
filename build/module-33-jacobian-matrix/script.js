const cells = document.querySelectorAll('.cell:not(.val-0\\.0)');
const nodes = document.querySelectorAll('.node');
const linesSvg = document.getElementById('lines-svg');
const caption = document.getElementById('caption');
const themeToggle = document.querySelector('.theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

// Create lines
const connections = [];
cells.forEach(cell => {
  const inIdx = cell.dataset.in;
  const outIdx = cell.dataset.out;
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.classList.add('conn-line');
  line.dataset.in = inIdx;
  line.dataset.out = outIdx;
  linesSvg.appendChild(line);
  connections.push({ inIdx, outIdx, line, cell });
});

function drawLines() {
  const svgRect = linesSvg.getBoundingClientRect();
  connections.forEach(conn => {
    const inNode = document.getElementById(`in-${conn.inIdx}`);
    const outNode = document.getElementById(`out-${conn.outIdx}`);
    const inRect = inNode.getBoundingClientRect();
    const outRect = outNode.getBoundingClientRect();
    
    conn.line.setAttribute('x1', inRect.right - svgRect.left);
    conn.line.setAttribute('y1', inRect.top + inRect.height/2 - svgRect.top);
    conn.line.setAttribute('x2', outRect.left - svgRect.left);
    conn.line.setAttribute('y2', outRect.top + outRect.height/2 - svgRect.top);
    
    // Line thickness based on value
    const val = parseFloat(conn.cell.textContent);
    conn.line.style.strokeWidth = Math.max(1, val * 6) + 'px';
  });
}

window.addEventListener('resize', drawLines);
setTimeout(drawLines, 100);

function dimAll() {
  cells.forEach(c => c.classList.add('dimmed'));
  nodes.forEach(n => n.classList.add('dimmed'));
  connections.forEach(c => c.line.classList.add('dimmed'));
  caption.classList.add('visible');
}
function resetAll() {
  cells.forEach(c => { c.classList.remove('dimmed'); c.classList.remove('highlighted'); });
  nodes.forEach(n => { n.classList.remove('dimmed'); n.classList.remove('highlighted'); });
  connections.forEach(c => { c.line.classList.remove('dimmed'); c.line.classList.remove('highlighted'); });
}

cells.forEach(cell => {
  const handleHover = () => {
    dimAll();
    cell.classList.remove('dimmed');
    cell.classList.add('highlighted');
    document.getElementById(`in-${cell.dataset.in}`).classList.add('highlighted');
    document.getElementById(`out-${cell.dataset.out}`).classList.add('highlighted');
    connections.find(c => c.cell === cell).line.classList.add('highlighted');
  };
  cell.addEventListener('mouseenter', handleHover);
  cell.addEventListener('touchstart', handleHover);
  cell.addEventListener('mouseleave', resetAll);
  cell.addEventListener('touchend', resetAll);
});

nodes.forEach(node => {
  const handleHover = () => {
    dimAll();
    node.classList.remove('dimmed');
    node.classList.add('highlighted');
    const type = node.dataset.type;
    const idx = node.dataset.idx;
    
    connections.forEach(c => {
      if (c[type + 'Idx'] === idx) {
        c.cell.classList.remove('dimmed');
        c.cell.classList.add('highlighted');
        c.line.classList.remove('dimmed');
        c.line.classList.add('highlighted');
        const otherType = type === 'in' ? 'out' : 'in';
        document.getElementById(`${otherType}-${c[otherType + 'Idx']}`).classList.add('highlighted');
      }
    });
  };
  node.addEventListener('mouseenter', handleHover);
  node.addEventListener('touchstart', handleHover);
  node.addEventListener('mouseleave', resetAll);
  node.addEventListener('touchend', resetAll);
});

let isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
const applyTheme = () => {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  iconSun.style.display = isDark ? 'block' : 'none';
  iconMoon.style.display = isDark ? 'none' : 'block';
};
applyTheme();
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  applyTheme();
});
