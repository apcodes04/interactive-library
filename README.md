# Interactive ML Diagrams Library

50 interactive, self-contained web visualizations covering core **Machine Learning** and **Large Language Model** concepts — from hyperparameters and overfitting all the way to RAG pipelines and diagnostic scenarios.

Every module ships as a standalone folder (`index.html` + `style.css` + `script.js`) with **desktop** and **mobile** variants, a built-in light/dark theme toggle, and zero external build steps.

## 🌟 Features

- **50 Interactive Modules** — Beginner → Intermediate → Advanced, each with its own self-contained visualization.
- **Desktop & Mobile** — Every module has a dedicated mobile build with touch-friendly controls.
- **Light / Dark Theme** — Toggle between a warm beige light mode and a sleek dark mode, saved across sessions.
- **Home Page** — A connecting landing page with search, tier filters, and iframe preview for every module.
- **No Build Pipeline** — Pure HTML + CSS + JS. Open any `index.html` in a browser and go.

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/apcodes04/interactive-library.git
cd interactive-library

# Open the home page
open build/home/index.html   # macOS
start build/home/index.html  # Windows
```

Or serve locally:

```bash
npx serve -l 5000 .
```

## 📚 Module Index

### Beginner (1–10)

| # | Concept |
|---|---------|
| 1 | Hyperparameter |
| 2 | Overfitting |
| 3 | Tokenization |
| 4 | OOV / BPE |
| 5 | Embeddings |
| 6 | Generative vs. Discriminative Models |
| 7 | Discriminative AI vs. Generative AI |
| 8 | Sequence-to-Sequence Models |
| 9 | Foundation Model Types |
| 10 | What Are LLMs |

### Intermediate (11–35)

| # | Concept |
|---|---------|
| 11 | ReLU Derivative |
| 12 | Chain Rule / Gradient Descent |
| 13 | Softmax Derivation |
| 14 | Cross-Entropy Loss |
| 15 | Gradient w.r.t. Embeddings |
| 16 | Eigenvalues & Eigenvectors |
| 17 | Vanishing Gradient Problem |
| 18 | Transformers vs. Seq2Seq |
| 19 | Encoder vs. Decoder |
| 20 | Positional Encodings |
| 21 | Attention Mechanisms |
| 22 | Dot Product in Self-Attention |
| 23 | Computing Attention Scores |
| 24 | Multi-Head Attention |
| 25 | LLMs vs. Statistical LMs |
| 26 | Masked Language Modeling (BERT) |
| 27 | Next Sentence Prediction |
| 28 | Autoregressive vs. Masked Models |
| 29 | Context Window |
| 30 | Temperature |
| 31 | Beam Search vs. Greedy Decoding |
| 32 | Top-k vs. Nucleus Sampling |
| 33 | Jacobian Matrix |
| 34 | KL Divergence |
| 35 | Adaptive Softmax |

### Advanced (36–50)

| # | Concept |
|---|---------|
| 36 | Mixture of Experts |
| 37 | Gemini vs. GPT-4 |
| 38 | GPT-4 vs. GPT-3 |
| 39 | Prompt Engineering |
| 40 | Zero-Shot Learning |
| 41 | Few-Shot Learning |
| 42 | Chain-of-Thought Prompting |
| 43 | Catastrophic Forgetting |
| 44 | PEFT |
| 45 | LoRA and QLoRA |
| 46 | Model Distillation |
| 47 | RAG Pipeline |
| 48 | Knowledge Graph Integration |
| 49 | Common Challenges |
| 50 | Diagnostic Scenario |

## 🛠 Tech Stack

- **HTML5 / CSS3 / Vanilla JS**
- **Chart.js** — bar/line charts in select modules
- **D3.js** — force layouts and vector visualizations
- **MathJax / KaTeX** — rendered math where needed

## 📄 License

MIT
