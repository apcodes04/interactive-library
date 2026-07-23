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

words.forEach((w, i) => {
    const chip = document.createElement('div');
    chip.className = 'chip hidden';
    chip.textContent = w;
    autoSentence.appendChild(chip);
});

words.forEach((w, i) => {
    const chip = document.createElement('div');
    if (i === 8) {
        chip.className = 'chip mask';
        chip.textContent = '[MASK]';
    } else {
        chip.className = 'chip';
        chip.textContent = w;
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
            c.className = 'chip'; 
        } else if (i === currentStep) {
            c.className = 'chip active'; 
        } else {
            c.className = 'chip hidden'; 
        }
    });
    
    if (currentStep < words.length) {
        explain.innerHTML = `<strong>Autoregressive:</strong> Predicting word ${currentStep+1} ("${words[currentStep]}"). Can only see left.`;
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

// Since mobile wraps text into multiple lines, hardcoding an arc from the last element to the first elements is visually complex.
// For mobile, we'll draw a simplified abstract curve to represent context.
function drawArrows() {
    const svg = document.querySelector('.bidirectional-arrows');
    svg.innerHTML = `
        <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" class="arrow-head" />
            </marker>
        </defs>
        <!-- Conceptual arrows representing backward and forward context -->
        <path d="M 250 60 Q 150 -10 20 20" class="arrow-line" marker-end="url(#arrowhead)"/>
    `;
}

setTimeout(drawArrows, 100);
window.addEventListener('resize', drawArrows);
