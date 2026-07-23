const themeToggle = document.querySelector('.theme-toggle');
const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateHeatmap();
});

function getThemeColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const numTokens = 60;
const tokensRow = document.getElementById('tokens-row');
const windowOverlay = document.getElementById('window-overlay');
const stripContainer = document.getElementById('strip-container');
const heatmapBar = document.getElementById('heatmap-bar');
const sizeReadout = document.getElementById('window-size');
const rangeReadout = document.getElementById('window-range');
const caption = document.querySelector('.caption');
let firstInteraction = false;

const tokens = [];
for (let i = 1; i <= numTokens; i++) {
    const chip = document.createElement('div');
    chip.className = 'token-chip';
    if ((i >= 1 && i <= 5) || (i >= 56 && i <= 60)) {
        chip.classList.add('important');
    } else {
        chip.classList.add('normal');
    }
    if (i === 1 || i === numTokens || i % 10 === 0) {
        chip.textContent = i;
    }
    tokensRow.appendChild(chip);
    tokens.push(chip);
}

let isDragging = false;
let isResizing = false;
let resizeSide = null;
let startX, startLeft, startWidth;
let currentLeftPercent = 10;
let currentWidthPercent = 40; 

function updateView() {
    windowOverlay.style.left = currentLeftPercent + '%';
    windowOverlay.style.width = currentWidthPercent + '%';
    
    let startIdx = Math.max(1, Math.round((currentLeftPercent / 100) * numTokens) + 1);
    let span = Math.round((currentWidthPercent / 100) * numTokens);
    let endIdx = Math.min(numTokens, startIdx + span - 1);
    
    if (endIdx < startIdx) endIdx = startIdx;
    
    sizeReadout.textContent = (endIdx - startIdx + 1);
    rangeReadout.textContent = `T${startIdx}–T${endIdx}`;
    
    tokens.forEach((chip, i) => {
        const tokenNum = i + 1;
        if (tokenNum >= startIdx && tokenNum <= endIdx) {
            chip.classList.remove('dimmed');
        } else {
            chip.classList.add('dimmed');
        }
    });
    
    updateHeatmap();
}

function updateHeatmap() {
    const success = getThemeColor('--success');
    const danger = getThemeColor('--danger');
    
    const startX = currentLeftPercent;
    const endX = currentLeftPercent + currentWidthPercent;
    const midX = currentLeftPercent + currentWidthPercent / 2;
    
    heatmapBar.style.background = `linear-gradient(to right, 
        transparent 0%, 
        transparent ${startX}%, 
        ${success} ${startX}%, 
        ${danger} ${midX}%, 
        ${success} ${endX}%, 
        transparent ${endX}%, 
        transparent 100%)`;
}

function onPointerDown(e, action, side) {
    if (!firstInteraction) {
        firstInteraction = true;
        caption.classList.add('visible');
    }
    if (e.type === 'mousedown') e.preventDefault();
    if (action === 'drag') {
        isDragging = true;
    } else if (action === 'resize') {
        isResizing = true;
        resizeSide = side;
    }
    startX = e.clientX || (e.touches && e.touches[0].clientX);
    startLeft = currentLeftPercent;
    startWidth = currentWidthPercent;
    
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('touchmove', onPointerMove, {passive: false});
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchend', onPointerUp);
}

function onPointerMove(e) {
    if (!isDragging && !isResizing) return;
    if (e.cancelable) e.preventDefault();
    
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const dx = x - startX;
    const containerWidth = stripContainer.getBoundingClientRect().width;
    const dxPercent = (dx / containerWidth) * 100;
    
    if (isDragging) {
        currentLeftPercent = startLeft + dxPercent;
        if (currentLeftPercent < 0) currentLeftPercent = 0;
        if (currentLeftPercent + currentWidthPercent > 100) currentLeftPercent = 100 - currentWidthPercent;
    } else if (isResizing) {
        if (resizeSide === 'left') {
            currentLeftPercent = startLeft + dxPercent;
            currentWidthPercent = startWidth - dxPercent;
            if (currentLeftPercent < 0) {
                currentWidthPercent += currentLeftPercent;
                currentLeftPercent = 0;
            }
            if (currentWidthPercent < 15) {
                currentLeftPercent = startLeft + startWidth - 15;
                currentWidthPercent = 15;
            }
        } else if (resizeSide === 'right') {
            currentWidthPercent = startWidth + dxPercent;
            if (currentLeftPercent + currentWidthPercent > 100) {
                currentWidthPercent = 100 - currentLeftPercent;
            }
            if (currentWidthPercent < 15) currentWidthPercent = 15;
        }
    }
    updateView();
}

function onPointerUp() {
    isDragging = false;
    isResizing = false;
    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('touchmove', onPointerMove);
    document.removeEventListener('mouseup', onPointerUp);
    document.removeEventListener('touchend', onPointerUp);
}

windowOverlay.addEventListener('mousedown', (e) => onPointerDown(e, 'drag'));
windowOverlay.addEventListener('touchstart', (e) => onPointerDown(e, 'drag'), {passive: true});

document.getElementById('handle-left').addEventListener('mousedown', (e) => { e.stopPropagation(); onPointerDown(e, 'resize', 'left'); });
document.getElementById('handle-left').addEventListener('touchstart', (e) => { e.stopPropagation(); onPointerDown(e, 'resize', 'left'); }, {passive: true});

document.getElementById('handle-right').addEventListener('mousedown', (e) => { e.stopPropagation(); onPointerDown(e, 'resize', 'right'); });
document.getElementById('handle-right').addEventListener('touchstart', (e) => { e.stopPropagation(); onPointerDown(e, 'resize', 'right'); }, {passive: true});

updateView();
