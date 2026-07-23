
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
    