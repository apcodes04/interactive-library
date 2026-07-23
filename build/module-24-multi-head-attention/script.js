const themeToggle = document.querySelector('.theme-toggle');
const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

const words = ["The", "chef", "who", "trained", "in", "Paris", "prepared", "the", "dish."];
const targetIndex = 6; // "prepared"

// Dark mode overrides for head colors to maintain contrast
function getHeadColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? ['#818cf8', '#a5b4fc', '#c7d2fe'] : ['#4f46e5', '#6366f1', '#818cf8'];
}

let headColors = getHeadColors();

const weights = {
    1: [0.05, 0.70, 0.05, 0.02, 0.02, 0.02, 0.0, 0.02, 0.12], // Head 1: strong to 'chef'
    2: [0.02, 0.05, 0.02, 0.02, 0.02, 0.05, 0.0, 0.12, 0.70], // Head 2: strong to 'dish'
    3: [0.02, 0.02, 0.05, 0.40, 0.05, 0.40, 0.0, 0.02, 0.04]  // Head 3: strong to 'trained', 'Paris'
};

const svg = d3.select('#diagram').append('svg').attr('width', '100%').attr('height', '100%');
const width = svg.node().getBoundingClientRect().width;
const height = svg.node().getBoundingClientRect().height;
const padding = 20;
const chipWidth = (width - padding * 2) / words.length - 8;
const chipHeight = 32;
const yPos = height - 50;

const linesG = svg.append('g');
const chipsG = svg.append('g');

let firstInteraction = false;
let activeHeads = { 1: true, 2: true, 3: true };

words.forEach((word, i) => {
    const x = padding + i * (chipWidth + 8) + chipWidth / 2;
    const g = chipsG.append('g')
        .attr('transform', `translate(${x - chipWidth/2}, ${yPos - chipHeight/2})`);
    
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
    const startX = padding + targetIndex * (chipWidth + 8) + chipWidth / 2;
    const startY = yPos - chipHeight / 2;
    
    headColors = getHeadColors();
    
    // Update label colors
    document.querySelector('#head-1').parentElement.style.setProperty('--head-color', headColors[0]);
    document.querySelector('#head-2').parentElement.style.setProperty('--head-color', headColors[1]);
    document.querySelector('#head-3').parentElement.style.setProperty('--head-color', headColors[2]);
    
    let offset = 0; // for spacing out multiple lines to same word
    
    [1, 2, 3].forEach(head => {
        if (!activeHeads[head]) return;
        const color = headColors[head-1];
        const w = weights[head];
        
        w.forEach((weight, i) => {
            if (i === targetIndex || weight < 0.05) return;
            const endX = padding + i * (chipWidth + 8) + chipWidth / 2;
            const endY = yPos - chipHeight / 2;
            const controlY = startY - 80 - (Math.abs(i - targetIndex) * 10) - (head * 5); // stagger heights
            
            linesG.append('path')
                .attr('class', 'attention-line')
                .attr('d', `M ${startX} ${startY} Q ${(startX + endX)/2} ${controlY} ${endX} ${endY}`)
                .style('stroke', color)
                .style('stroke-width', weight * 8)
                .style('opacity', weight * 1.5);
        });
    });
}

function updateExplain() {
    let activeCount = Object.values(activeHeads).filter(Boolean).length;
    let text = "";
    if (activeCount === 3) text = "All 3 heads are active, showing connections from 'prepared' to its relevant context.";
    else if (activeCount === 0) text = "No heads active. The model has no attention context for 'prepared'.";
    else {
        let details = [];
        if (activeHeads[1]) details.push("Head 1 tracking the subject ('chef')");
        if (activeHeads[2]) details.push("Head 2 tracking the object ('dish')");
        if (activeHeads[3]) details.push("Head 3 tracking the modifier ('trained', 'Paris')");
        text = details.join(", ") + ".";
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
