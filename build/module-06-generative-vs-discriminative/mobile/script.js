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

// Seeded generator
let seed = 42;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
const rngGaussian = (mean, sd) => {
  let u = 1 - random(), v = random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * sd + mean;
};

const points = [];
for(let i=0; i<20; i++) points.push({x: rngGaussian(30,15), y: rngGaussian(30,15), c: 'A'});
for(let i=0; i<20; i++) points.push({x: rngGaussian(70,15), y: rngGaussian(70,15), c: 'B'});
points.push({x: 55, y: 55, c: 'A'});
points.push({x: 48, y: 48, c: 'B'});

const width = 340, height = 350;
const svg = d3.select('#plot-svg').attr('viewBox', `0 0 ${width} ${height}`);

const xScale = d3.scaleLinear().domain([0, 100]).range([30, width - 30]);
const yScale = d3.scaleLinear().domain([0, 100]).range([height - 30, 30]);

const contourGroup = svg.append('g').attr('class', 'contours');
const lineGroup = svg.append('g').attr('class', 'lines');
const dotGroup = svg.append('g').attr('class', 'dots');

// Draw line
const boundary = lineGroup.append('line')
  .attr('class', 'boundary-line')
  .attr('x1', xScale(0)).attr('y1', yScale(100))
  .attr('x2', xScale(100)).attr('y2', yScale(0))
  .attr('opacity', 1);

// Generate contours
const gridRes = 30; // lower res for mobile performance
const gridA = new Array(gridRes * gridRes).fill(0);
const gridB = new Array(gridRes * gridRes).fill(0);
function gaussian2D(x, y, ux, uy, sigma) {
  return Math.exp(-((x-ux)*(x-ux) + (y-uy)*(y-uy)) / (2*sigma*sigma));
}
for (let j = 0; j < gridRes; j++) {
  for (let i = 0; i < gridRes; i++) {
    let px = (i / gridRes) * 100;
    let py = (j / gridRes) * 100;
    let valA = gaussian2D(px, py, 30, 30, 15);
    let valB = gaussian2D(px, py, 70, 70, 15);
    gridA[j * gridRes + i] = valA;
    gridB[j * gridRes + i] = valB;
  }
}

const contoursA = d3.contours().size([gridRes, gridRes]).thresholds([0.1, 0.4, 0.7])(gridA);
const contoursB = d3.contours().size([gridRes, gridRes]).thresholds([0.1, 0.4, 0.7])(gridB);
const path = d3.geoPath().projection(d3.geoTransform({
  point: function(x, y) {
    this.stream.point(xScale((x/gridRes)*100), yScale(100 - (y/gridRes)*100)); // yScale flips y
  }
}));

contourGroup.selectAll('path.ca')
  .data(contoursA).enter().append('path')
  .attr('class', 'contour-a')
  .attr('d', path)
  .attr('opacity', 0)
  .style('fill-opacity', (d, i) => 0.15 + i * 0.15);

contourGroup.selectAll('path.cb')
  .data(contoursB).enter().append('path')
  .attr('class', 'contour-b')
  .attr('d', path)
  .attr('opacity', 0)
  .style('fill-opacity', (d, i) => 0.15 + i * 0.15);

// Draw dots
dotGroup.selectAll('circle')
  .data(points).enter().append('circle')
  .attr('cx', d => xScale(d.x))
  .attr('cy', d => yScale(d.y))
  .attr('r', 5)
  .attr('class', d => d.c === 'A' ? 'dot-a' : 'dot-b')
  .attr('stroke', '#fff')
  .attr('stroke-width', 1);

let interacted = false;
const btnDisc = document.getElementById('btn-discriminative');
const btnGen = document.getElementById('btn-generative');
const explain = document.getElementById('explain');
const caption = document.getElementById('caption');

function setMode(mode) {
  if (!interacted) { interacted = true; caption.classList.add('visible'); }
  if (mode === 'disc') {
    btnDisc.className = 'btn-primary'; btnGen.className = 'btn-secondary';
    boundary.attr('opacity', 1);
    contourGroup.selectAll('path').attr('opacity', 0);
    explain.textContent = "The discriminative model draws a boundary line to separate classes. It answers: 'Which side of the line is this on?'";
  } else {
    btnDisc.className = 'btn-secondary'; btnGen.className = 'btn-primary';
    boundary.attr('opacity', 0);
    contourGroup.selectAll('path').attr('opacity', 1);
    explain.textContent = "The generative model builds a probability distribution (density) for each class. It answers: 'How likely is it that a point belongs to this class given its location?'";
  }
}

btnDisc.addEventListener('click', () => setMode('disc'));
btnGen.addEventListener('click', () => setMode('gen'));
