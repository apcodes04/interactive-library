const themeToggle = document.querySelector('.theme-toggle');
const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

const words = ["The", "chef", "who", "trained", "in", "Paris", "prepared", "the", "dish."];
const targetIndex = 6; 

function getHeadColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? ['#818cf8', '#a5b4fc', '#c7d2fe'] : ['#4f46e5', '#6366f1', '#818cf8'];
}

let headColors = getHeadColors();

const weights = {
    1: [0.05, 0.70, 0.05, 0.02, 0.02, 0.02, 0.0, 0.02, 0.12],
    2: [0.02, 0.05, 0.02, 0.02, 0.02, 0.05, 0.0, 0.12, 0.70],
    3: [0.02, 0.02, 0.05, 0.40, 0.05, 0.40, 0.0, 0.02, 0.04] 
};

const svg = d3.select('#diagram').append('svg').attr('width', '100%').attr('height', '100%');
const width = svg.node().getBoundingClientRect().width;
const height = svg.node().getBoundingClientRect().height;

const paddingX = 10;
const chipWidth = 75;
const chipHeight = 30;
const gapX = (width - paddingX * 2 - 3 * chipWidth) / 2;
const gapY = 50;
const startY = 30;

const linesG = svg.append('g');
const chipsG = svg.append('g');

let firstInteraction = false;
let activeHeads = { 1: true, 2: true, 3: true };

const positions = words.map((w, i) => {
    const r = Math.floor(i / 3);
    const c = i % 3;
    return {
        x: paddingX + c * (chipWidth + gapX) + chipWidth / 2,
        y: startY + r * (chipHeight + gapY) + chipHeight / 2
    };
});

words.forEach((word, i) => {
    const p = positions[i];
    const g = chipsG.append('g')
        .attr('transform', `translate(${p.x - chipWidth/2}, ${p.y - chipHeight/2})`);
    
    g.append('rect')
        .attr('class', i === targetIndex ? 'word-chip active' : 'word-chip')
        .attr('width', chipWidth)
        .attr('height', chipHeight);
        
    g.append('text')
        .attr('class', 'word-text')
        .attr('x', chipWidth / 2)
        .attr('y', chipHeight / 2 + 2)
        .style('font-weight', i === targetIndex ? 'bold' : 'normal')
        .text(word);
});

function drawLines() {
    linesG.selectAll('*').remove();
    const pTarget = positions[targetIndex];
    
    headColors = getHeadColors();
    
    document.querySelector('#head-1').parentElement.style.setProperty('--head-color', headColors[0]);
    document.querySelector('#head-2').parentElement.style.setProperty('--head-color', headColors[1]);
    document.querySelector('#head-3').parentElement.style.setProperty('--head-color', headColors[2]);
    
    [1, 2, 3].forEach(head => {
        if (!activeHeads[head]) return;
        const color = headColors[head-1];
        const w = weights[head];
        
        w.forEach((weight, i) => {
            if (i === targetIndex || weight < 0.05) return;
            const p = positions[i];
            const controlX = (pTarget.x + p.x) / 2 + (head * 5); 
            const controlY = (pTarget.y + p.y) / 2 - 20 - (head * 10);
            
            linesG.append('path')
                .attr('class', 'attention-line')
                .attr('d', `M ${pTarget.x} ${pTarget.y} Q ${controlX} ${controlY} ${p.x} ${p.y}`)
                .style('stroke', color)
                .style('stroke-width', weight * 8)
                .style('opacity', weight * 1.5);
        });
    });
}

function updateExplain() {
    let activeCount = Object.values(activeHeads).filter(Boolean).length;
    let text = "";
    if (activeCount === 3) text = "All 3 heads active, connecting 'prepared' to its context.";
    else if (activeCount === 0) text = "No heads active.";
    else {
        let details = [];
        if (activeHeads[1]) details.push("Head 1 (subject)");
        if (activeHeads[2]) details.push("Head 2 (object)");
        if (activeHeads[3]) details.push("Head 3 (modifier)");
        text = details.join(", ") + " active.";
    }
    document.getElementById('explain').textContent = text;
}

[1, 2, 3].forEach(head => {
    document.getElementById(`head-${head}`).addEventListener('change', (e) => {
        if (!firstInteraction) {
            firstInteraction = true;
            document.querySelector('.caption').classList.add('visible');
        }
        activeHeads[head] = e.target.checked;
        drawLines();
        updateExplain();
    });
});

themeToggle.addEventListener('click', () => setTimeout(drawLines, 50));
drawLines();
