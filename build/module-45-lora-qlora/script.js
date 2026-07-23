
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
    