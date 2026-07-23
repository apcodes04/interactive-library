# Interactive Diagrams — Index

Each module is built as its own self-contained folder (`index.html` + `style.css` + `script.js`), delivered **twice** — once for desktop, once for mobile (`mobile/index.html` + `style.css` + `script.js`) — never merged with another module's files. After all 50 exist, one additional connecting home page ties them together without importing any module's code.

**First time?** Start with `MASTER-PROMPT-FOR-CODEX.md` — it walks through testing one module (Temperature) end to end, desktop and mobile, before you run all 50.

**Testing one at a time (Codex/Opus, chat-based):** attach 5 files — `00-global-spec.md`, `00-design-system.md`, `00-mobile-design-system.md`, `00-app-theme.md`, and the one `module-XX-*.md` you're building — then run the acceptance checklist from `00-global-spec.md` before moving to the next module.

**Building all 50 + the home page unattended (Antigravity, agentic):** point it at this entire `diagrams\` folder and use `MASTER-PROMPT-FOR-ANTIGRAVITY.md` — it checks what's already built, reports it, builds only what's missing, loops through the rest itself, builds the home page last, and writes a build log, all without pausing for confirmation.

**Building all 50 + the home page unattended and resumably (Claude Code):** `cd` into this folder and run `claude` — it auto-loads `CLAUDE.md`, which carries all the persistent rules plus a `build/PROGRESS.md` log so it can be restarted cleanly (via `claude --continue` or a fresh session) if it hits a usage limit partway through. See `MASTER-PROMPT-FOR-CLAUDE-CODE.md` for the folder, model choice (Sonnet 5), and first message to type.

- `MASTER-PROMPT-FOR-CODEX.md` — ready-to-paste prompt for your first single-module test build (desktop + mobile)
- `MASTER-PROMPT-FOR-ANTIGRAVITY.md` — ready-to-paste prompt to build all 50 modules + the home page autonomously in one run, checking existing progress first
- `MASTER-PROMPT-FOR-CLAUDE-CODE.md` + `CLAUDE.md` — resumable autonomous build for Claude Code, survives usage-limit restarts via a persistent progress log
- `00-design-system.md` — color theory, typography, motion, reusable CSS, the light/dark theme toggle, the steps-panel and live explain-panel specs, the multi-stage scrubber pattern
- `00-mobile-design-system.md` — why mobile is a fully separate build, layout/touch-target rules, what stays identical to desktop
- `00-app-theme.md` — the exact beige light-mode / dark-beige dark-mode palette, contrast math, and component guidance (covers both this diagram set and the main Acadbyte app)
- `00-home-page.md` — spec for the final page that connects all 50 modules via search/filter + an iframe preview panel, without importing any module's code
- `00-global-spec.md` — build rules (modular 3-file-per-module output, mobile variant, theme toggle, home page), acceptance checklist, shared example data
- `prototypes/module-30-temperature/` — working example (simple: slider + Chart.js + explain panel), desktop and `mobile/`
- `prototypes/module-47-rag-pipeline/` — working example (complex: 9-stage animated pipeline + explain panel + scrubber), desktop and `mobile/`
- `prototypes/home/` — working example of the connecting home page, wired up against the two prototypes above

## What's actually built right now vs. still just a spec

**Built (real, working code you can open in a browser today):**

- `prototypes/module-30-temperature/` — desktop + mobile, both with steps-panel, explain-panel, caption, and a working light/dark toggle.
- `prototypes/module-47-rag-pipeline/` — desktop + mobile, both with the full multi-stage scrubber pattern and a working light/dark toggle.
- `prototypes/home/` — a working home page listing all 50 modules by tier, with search and tier filters; only modules 30 and 47 are clickable ("Preview ready") since those are the only two with real code so far — the other 48 render as disabled cards on purpose, so the page is honest about what actually exists.

**Not yet built (spec only — a `.md` file exists, but no `index.html`/`style.css`/`script.js` has been generated):** modules 1–29, 31–46, 48–50 — 48 of the 50. There is no `build/` folder yet at all; that only gets created the first time you run one of the three master prompts above.

Handing any of the three master prompts to Codex, Antigravity, or Claude Code is what turns the remaining 48 `.md` specs into real code — none of them have been run yet in this project.

## Beginner (1–10)

| # | File | Concept | Q# | Type |
|---|---|---|---|---|
| 1 | module-01-hyperparameter.md | Hyperparameter | Q47 | AI/ML |
| 2 | module-02-overfitting.md | Overfitting | Q16 | AI/ML |
| 3 | module-03-tokenization.md | Tokenization | Q1 | LLM |
| 4 | module-04-oov-bpe.md | OOV / BPE | Q14 | LLM |
| 5 | module-05-embeddings.md | Embeddings | Q8 | LLM |
| 6 | module-06-generative-vs-discriminative.md | Generative vs. Discriminative models | Q17 | AI/ML |
| 7 | module-07-discriminative-ai-vs-generative-ai.md | Discriminative AI vs. Generative AI | Q37 | AI |
| 8 | module-08-seq2seq-models.md | Sequence-to-Sequence Models | Q6 | AI/ML |
| 9 | module-09-foundation-models.md | Foundation Model types | Q32 | AI |
| 10 | module-10-what-are-llms.md | What Are LLMs | Q49 | LLM |

## Intermediate (11–35)

| # | File | Concept | Q# | Type |
|---|---|---|---|---|
| 11 | module-11-relu-derivative.md | ReLU derivative | Q28 | AI/ML |
| 12 | module-12-chain-rule-gradient-descent.md | Chain rule / gradient descent | Q29 | AI/ML |
| 13 | module-13-softmax-derivation.md | Softmax derivation | Q21 | LLM |
| 14 | module-14-cross-entropy-loss.md | Cross-Entropy Loss | Q23 | LLM |
| 15 | module-15-gradient-wrt-embeddings.md | Gradient wrt Embeddings | Q24 | LLM |
| 16 | module-16-eigenvalues-eigenvectors.md | Eigenvalues & Eigenvectors | Q26 | AI/ML |
| 17 | module-17-vanishing-gradient.md | Vanishing Gradient Problem | Q41 | AI/ML |
| 18 | module-18-transformers-vs-seq2seq.md | Transformers vs. Seq2Seq | Q15 | LLM |
| 19 | module-19-encoder-vs-decoder.md | Encoder vs. Decoder | Q44 | LLM |
| 20 | module-20-positional-encodings.md | Positional Encodings | Q19 | LLM |
| 21 | module-21-attention-mechanisms.md | Attention Mechanisms (intuitive) | Q48 | LLM |
| 22 | module-22-dot-product-self-attention.md | Dot Product in Self-Attention | Q22 | LLM |
| 23 | module-23-computing-attention-scores.md | Computing Attention Scores | Q30 | LLM |
| 24 | module-24-multi-head-attention.md | Multi-Head Attention | Q20 | LLM |
| 25 | module-25-llms-vs-statistical-lms.md | LLMs vs. Statistical LMs | Q45 | LLM |
| 26 | module-26-masked-language-modeling.md | Masked Language Modeling | Q5 | LLM |
| 27 | module-27-next-sentence-prediction.md | Next Sentence Prediction | Q9 | LLM |
| 28 | module-28-autoregressive-vs-masked.md | Autoregressive vs. Masked Models | Q7 | LLM |
| 29 | module-29-context-window.md | Context Window | Q46 | LLM |
| 30 | module-30-temperature.md | Temperature | Q4 | LLM |
| 31 | module-31-beam-search-vs-greedy.md | Beam Search vs. Greedy Decoding | Q3 | LLM |
| 32 | module-32-top-k-vs-nucleus-sampling.md | Top-k vs. Nucleus Sampling | Q10 | LLM |
| 33 | module-33-jacobian-matrix.md | Jacobian Matrix | Q25 | AI/ML |
| 34 | module-34-kl-divergence.md | KL Divergence | Q27 | LLM |
| 35 | module-35-adaptive-softmax.md | Adaptive Softmax | Q40 | LLM |

## Advanced (36–50)

| # | File | Concept | Q# | Type |
|---|---|---|---|---|
| 36 | module-36-mixture-of-experts.md | Mixture of Experts | Q35 | LLM |
| 37 | module-37-gemini-vs-gpt4.md | Gemini vs. GPT-4 | Q31 | LLM |
| 38 | module-38-gpt4-vs-gpt3.md | GPT-4 vs. GPT-3 | Q18 | LLM |
| 39 | module-39-prompt-engineering.md | Prompt Engineering | Q11 | LLM |
| 40 | module-40-zero-shot-learning.md | Zero-Shot Learning | Q39 | LLM |
| 41 | module-41-few-shot-learning.md | Few-Shot Learning | Q42 | LLM |
| 42 | module-42-chain-of-thought.md | Chain-of-Thought Prompting | Q36 | LLM |
| 43 | module-43-catastrophic-forgetting.md | Catastrophic Forgetting | Q12 | LLM |
| 44 | module-44-peft.md | PEFT | Q33 | LLM |
| 45 | module-45-lora-qlora.md | LoRA and QLoRA | Q2 | LLM |
| 46 | module-46-model-distillation.md | Model Distillation | Q13 | LLM |
| 47 | module-47-rag-pipeline.md | RAG Pipeline | Q34 | LLM |
| 48 | module-48-knowledge-graph.md | Knowledge Graph Integration | Q38 | LLM |
| 49 | module-49-common-challenges.md | Common Challenges | Q50 | LLM |
| 50 | module-50-diagnostic-scenario.md | Diagnostic Scenario | Q43 | LLM |

## The 8 multi-stage modules (scrubber pattern required)

Modules **4, 8, 12, 15, 17, 23, 31, 47** each show more than one sequential stage — these need the full clickable-stages + scrubber + interruptible-autoplay pattern from `00-design-system.md`, not a single auto-play button. Module 47's prototype is the reference implementation for this pattern.

## Known limitations (verified, not fixed — for your awareness)

- All 50 module files were reviewed for internal consistency (data completeness, no leftover placeholder text, exact numbers where the spec calls for them) — verified clean by an automated scan.
- All four prototype folders' `script.js` files (module-30 desktop/mobile, module-47 desktop/mobile) plus `prototypes/home/script.js` were checked for JavaScript syntax errors only (`node --check`) — this sandbox has no headless browser available, so none have been visually rendered or screenshotted. Open them yourself in a browser before treating them as the reference standard for the other 48 modules.
- Module 4's BPE merge steps are intentionally loose on intermediate merge order (only the start state, end state, and step count are pinned) — noted in that file, not an oversight.
- The beige light/dark theme's exact hex values were checked against WCAG AA contrast math (see `00-app-theme.md`) but, like everything else above, not visually verified in a real browser in this sandbox.
