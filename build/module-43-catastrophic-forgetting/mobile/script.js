
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
    