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

for(let i=0; i<20; i++) points.push({x: rngGaussian(30,15), y: rngGaussian(30,15), c: 'A'});
for(let i=0; i<20; i++) points.push({x: rngGaussian(70,15), y: rngGaussian(70,15), c: 'B'});
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
  
  if(lr > 0.3) explain.textContent = `Learning rate is ${lr.toFixed(4)}. This is high, which might cause divergence.`;
  else if(lr >= 0.01) explain.textContent = `Learning rate is ${lr.toFixed(4)}. This seems like a reasonable range for convergence.`;
  else explain.textContent = `Learning rate is ${lr.toFixed(4)}. This is very small, meaning it will learn very slowly.`;
}
lrSlider.addEventListener('input', updateLR);
// Initialize the readout visually.
lrReadout.textContent = getLR().toFixed(4);

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
