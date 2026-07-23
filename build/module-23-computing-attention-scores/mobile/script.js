const themeToggle = document.querySelector('.theme-toggle');
const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    renderStage();
});

const rawScores = [
    [8, 2, 1, 0, 3],
    [2, 9, 0, 1, 2],
    [1, 0, 7, 4, 1],
    [0, 1, 4, 6, 2],
    [3, 2, 1, 2, 8]
];
const vColors = ['#0f766e', '#c2410c', '#be185d', '#0369a1', '#7e22ce']; 

let currentStage = 0;
let playInterval = null;
let hasInteracted = false;

const scrubber = document.getElementById('scrubber');
const btnBack = document.getElementById('btn-back');
const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');
const btnPlay = document.getElementById('btn-play');
const stageBtns = document.querySelectorAll('.stage-btn');
const explainPanel = document.getElementById('explain');
const legendPanel = document.getElementById('legend');
const caption = document.querySelector('.caption');

const svg = d3.select('#diagram').append('svg').attr('width', '100%').attr('height', '100%');
const width = svg.node().getBoundingClientRect().width;
const height = svg.node().getBoundingClientRect().height;
const cellSize = Math.min(width, height) / 5 - 4;
const gridG = svg.append('g').attr('transform', `translate(${(width - cellSize*5)/2}, ${(height - cellSize*5)/2})`);

function getThemeColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function handleInteraction() {
    if (!hasInteracted) {
        hasInteracted = true;
        caption.classList.add('visible');
    }
    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
        btnPlay.textContent = 'Play';
    }
}

function renderStage() {
    scrubber.value = currentStage;
    stageBtns.forEach(btn => btn.classList.toggle('active', parseInt(btn.dataset.stage) === currentStage));
    btnBack.disabled = currentStage === 0;
    btnNext.disabled = currentStage === 3;
    
    const frozen = getThemeColor('--frozen');
    const primary = getThemeColor('--primary');
    const active = getThemeColor('--active');
    
    let matrixData = [];
    for(let r=0; r<5; r++) {
        let rowSum = 0;
        let expRow = [];
        for(let c=0; c<5; c++) {
            let val = rawScores[r][c];
            if (currentStage >= 1) val = val / 8;
            if (currentStage >= 2) expRow.push(Math.exp(val));
            matrixData.push({r, c, raw: rawScores[r][c], scaled: val});
        }
        if (currentStage >= 2) {
            let sum = expRow.reduce((a,b)=>a+b, 0);
            for(let c=0; c<5; c++) {
                matrixData[r*5+c].softmax = expRow[c] / sum;
            }
        }
    }

    const scaleRaw = d3.scaleLinear().domain([0, 9]).range([frozen, primary]);
    const scaleScaled = d3.scaleLinear().domain([0, 9/8]).range([frozen, primary]);
    
    gridG.selectAll('.cell-group').remove();
    
    if (currentStage === 3) {
        legendPanel.innerHTML = vColors.map((c, i) => `<div class="legend-item"><div class="legend-color" style="background:${c}"></div>V${i+1}</div>`).join('');
        explainPanel.innerHTML = `Stage 3: <strong>Weighted sum</strong>. Blending 5 vectors based on softmax probabilities.`;
        
        for(let r=0; r<5; r++) {
            let g = gridG.append('g').attr('class', 'cell-group').attr('transform', `translate(0, ${r*cellSize})`);
            
            for(let c=0; c<5; c++) {
                let w = matrixData[r*5+c].softmax;
                g.append('rect')
                 .attr('x', c * (cellSize*0.8))
                 .attr('y', 4)
                 .attr('width', cellSize*0.6)
                 .attr('height', cellSize*0.6)
                 .style('fill', vColors[c])
                 .style('opacity', w);
            }
            
            let R=0, G=0, B=0;
            for(let c=0; c<5; c++) {
                let w = matrixData[r*5+c].softmax;
                let rgb = d3.color(vColors[c]);
                R += rgb.r * w; G += rgb.g * w; B += rgb.b * w;
            }
            g.append('rect')
             .attr('x', 5 * (cellSize*0.8) + 8)
             .attr('y', 4)
             .attr('width', cellSize*0.6)
             .attr('height', cellSize*0.6)
             .style('fill', `rgb(${R},${G},${B})`)
             .style('stroke', getThemeColor('--border'));
             
            g.append('text')
             .attr('x', 5 * (cellSize*0.8) + 8 + cellSize*0.3)
             .attr('y', 4 + cellSize*0.3)
             .attr('class', 'cell-text')
             .style('font-size', '10px')
             .text('Σ');
        }
    } else {
        legendPanel.innerHTML = '';
        const cells = gridG.selectAll('.cell-group').data(matrixData).enter()
            .append('g').attr('class', 'cell-group')
            .attr('transform', d => `translate(${d.c * cellSize}, ${d.r * cellSize})`);
            
        cells.append('rect')
            .attr('class', 'cell')
            .attr('width', cellSize - 2)
            .attr('height', cellSize - 2)
            .style('fill', d => {
                if (currentStage === 0) return scaleRaw(d.raw);
                if (currentStage === 1) return scaleScaled(d.scaled);
                if (currentStage === 2) {
                    const scaleSoftmax = d3.scaleLinear().domain([0, 1]).range([frozen, active]);
                    return scaleSoftmax(d.softmax);
                }
            });
            
        cells.append('text')
            .attr('class', 'cell-text')
            .attr('x', cellSize/2)
            .attr('y', cellSize/2)
            .text(d => {
                if (currentStage === 0) return d.raw;
                if (currentStage === 1) return d.scaled.toFixed(1); // rounded for mobile
                if (currentStage === 2) return d.softmax.toFixed(2);
            });
            
        if (currentStage === 0) explainPanel.innerHTML = `Stage 0: <strong>Raw scores</strong>. Unscaled Q·Kᵀ matrix.`;
        if (currentStage === 1) explainPanel.innerHTML = `Stage 1: <strong>Scaled</strong>. Divided by 8 (√d_k).`;
        if (currentStage === 2) explainPanel.innerHTML = `Stage 2: <strong>Softmax</strong>. Row sum = 1.0 (probabilities).`;
    }
}

stageBtns.forEach(btn => btn.addEventListener('click', (e) => {
    handleInteraction();
    currentStage = parseInt(e.target.dataset.stage);
    renderStage();
}));
scrubber.addEventListener('input', (e) => {
    handleInteraction();
    currentStage = parseInt(e.target.value);
    renderStage();
});
btnBack.addEventListener('click', () => {
    handleInteraction();
    if (currentStage > 0) { currentStage--; renderStage(); }
});
btnNext.addEventListener('click', () => {
    handleInteraction();
    if (currentStage < 3) { currentStage++; renderStage(); }
});
btnReset.addEventListener('click', () => {
    handleInteraction();
    currentStage = 0;
    renderStage();
});
btnPlay.addEventListener('click', () => {
    hasInteracted = true;
    caption.classList.add('visible');
    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
        btnPlay.textContent = 'Play';
    } else {
        if (currentStage === 3) currentStage = 0;
        renderStage();
        btnPlay.textContent = 'Stop';
        playInterval = setInterval(() => {
            if (currentStage < 3) {
                currentStage++;
                renderStage();
            } else {
                clearInterval(playInterval);
                playInterval = null;
                btnPlay.textContent = 'Play';
            }
        }, 1200);
    }
});

renderStage();
