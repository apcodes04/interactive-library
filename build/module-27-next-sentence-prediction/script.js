const themeToggle = document.querySelector('.theme-toggle');
const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateColors();
});

let isTruePair = true;
let firstInteraction = false;

const btnShuffle = document.getElementById('btn-shuffle');
const sentenceBText = document.getElementById('sentence-b-text');
const gaugeFg = document.querySelector('.gauge-fg');
const gaugeVal = document.getElementById('gauge-val');
const gaugeStatus = document.getElementById('gauge-status');
const statusIcon = document.getElementById('status-icon');
const statusText = document.getElementById('status-text');
const explain = document.getElementById('explain');
const caption = document.querySelector('.caption');

const arcLength = 157; // Math.PI * 50

function getThemeColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function updateColors() {
    const color = isTruePair ? getThemeColor('--success') : getThemeColor('--danger');
    gaugeFg.style.stroke = color;
    gaugeVal.style.color = color;
    gaugeStatus.style.color = color;
}

function updateState() {
    // 92% -> dashoffset = arcLength * (1 - 0.92) = 157 * 0.08 = 12.56
    // 8% -> dashoffset = arcLength * (1 - 0.08) = 157 * 0.92 = 144.44
    const targetPercent = isTruePair ? 92 : 8;
    const offset = arcLength * (1 - targetPercent / 100);
    
    sentenceBText.style.opacity = '0';
    statusIcon.style.opacity = '0';
    statusText.style.opacity = '0';
    
    setTimeout(() => {
        if (isTruePair) {
            sentenceBText.textContent = '"Cold air rushed in."';
            statusIcon.textContent = '✓';
            statusText.textContent = 'IsNext';
            explain.innerHTML = `Sentence pair represents a genuine consecutive sequence. The model is highly confident it's a match.`;
        } else {
            sentenceBText.textContent = '"The stock market fell sharply."';
            statusIcon.textContent = '✗';
            statusText.textContent = 'NotNext';
            explain.innerHTML = `An unrelated sentence was swapped in. The model correctly drops its confidence, recognizing they don't belong together.`;
        }
        updateColors();
        
        sentenceBText.style.transition = 'opacity 0.3s ease';
        statusIcon.style.transition = 'opacity 0.3s ease';
        statusText.style.transition = 'opacity 0.3s ease';
        sentenceBText.style.opacity = '1';
        statusIcon.style.opacity = '1';
        statusText.style.opacity = '1';
    }, 150);

    gaugeFg.style.strokeDashoffset = offset;
    
    // Animate the number
    let startVal = parseInt(gaugeVal.textContent);
    let duration = 500;
    let startTime = null;
    
    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = Math.min((timestamp - startTime) / duration, 1);
        let easeOut = 1 - Math.pow(1 - progress, 3);
        let curr = startVal + (targetPercent - startVal) * easeOut;
        gaugeVal.textContent = Math.round(curr) + '%';
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}

btnShuffle.addEventListener('click', () => {
    if (!firstInteraction) {
        firstInteraction = true;
        caption.classList.add('visible');
    }
    isTruePair = !isTruePair;
    updateState();
});

// Initialize styles
updateColors();
gaugeFg.style.strokeDashoffset = arcLength * (1 - 0.92);
