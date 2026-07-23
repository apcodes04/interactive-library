const themeToggle = document.querySelector('.theme-toggle');
const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

const words = ["The", "cat", "sat", "on", "the", "mat", "because", "it", "was"];
const autoSentence = document.getElementById('auto-sentence');
const maskedSentence = document.getElementById('masked-sentence');

// Setup Auto
words.forEach((w, i) => {
    const chip = document.createElement('div');
    chip.className = 'chip hidden';
    chip.textContent = w;
    autoSentence.appendChild(chip);
});

// Setup Masked
words.forEach((w, i) => {
    const chip = document.createElement('div');
    if (i === 8) {
        chip.className = 'chip mask';
        chip.textContent = '[MASK]';
        chip.id = 'mask-target';
    } else {
        chip.className = 'chip';
        chip.textContent = w;
        if (i === 0) chip.id = 'left-target';
    }
    maskedSentence.appendChild(chip);
});

let playInterval = null;
let currentStep = 0;
let firstInteraction = false;
const btnReplay = document.getElementById('btn-replay');
const explain = document.getElementById('explain');
const caption = document.querySelector('.caption');

function updateAuto() {
    const chips = autoSentence.querySelectorAll('.chip');
    chips.forEach((c, i) => {
        if (i < currentStep) {
            c.className = 'chip'; // fully visible past
        } else if (i === currentStep) {
            c.className = 'chip active'; // currently predicting
        } else {
            c.className = 'chip hidden'; // frozen/hidden future
        }
    });
    
    if (currentStep < words.length) {
        explain.innerHTML = `<strong>Autoregressive:</strong> Predicting word ${currentStep+1} ("${words[currentStep]}"). It can only see the words to its left.`;
    } else {
        explain.innerHTML = `<strong>Autoregressive:</strong> Sentence complete.`;
    }
}

btnReplay.addEventListener('click', () => {
    if (!firstInteraction) {
        firstInteraction = true;
        caption.classList.add('visible');
    }
    if (playInterval) clearInterval(playInterval);
    currentStep = 0;
    updateAuto();
    
    playInterval = setInterval(() => {
        currentStep++;
        updateAuto();
        if (currentStep >= words.length) {
            clearInterval(playInterval);
        }
    }, 600);
});

// Draw arrows for masked
function drawArrows() {
    const svg = document.querySelector('.bidirectional-arrows');
    svg.innerHTML = '';
    const mask = document.getElementById('mask-target');
    const left = document.getElementById('left-target');
    
    // We assume layout is single row for simple arrow drawing on desktop
    const maskRect = mask.getBoundingClientRect();
    const leftRect = left.getBoundingClientRect();
    const containerRect = maskedSentence.getBoundingClientRect();
    
    // Convert to relative SVG coords (SVG covers the sentence container)
    // Actually SVG is 600x60, absolute positioning is tricky. Let's just use fixed percentages for visual.
    // SVG width 600, height 60
    svg.innerHTML = `
        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" class="arrow-head" />
            </marker>
            <marker id="arrowhead-start" markerWidth="10" markerHeight="7" refX="1" refY="3.5" orient="auto">
                <polygon points="10 0, 0 3.5, 10 7" class="arrow-head" />
            </marker>
        </defs>
        <!-- Mask to left -->
        <path d="M 520 40 Q 280 0 40 40" class="arrow-line" marker-end="url(#arrowhead)" marker-start="url(#arrowhead-start)"/>
    `;
}

setTimeout(drawArrows, 100);
window.addEventListener('resize', drawArrows);
