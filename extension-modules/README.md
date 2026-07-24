# Extension Modules (51–73) — Classical ML + Advanced LLM Topics

This folder is a **sibling extension** to the original 50-module course in `diagrams/`, not a replacement or a merge. It covers 23 additional concepts — classical ML algorithms the original 50 didn't visualize (regression, trees, clustering, SVM, etc.) plus a handful of advanced LLM production topics — using the exact same shared design system (beige light/dark theme, steps/explain/caption panels, legend, categorical colors, mobile variants) so the two sets feel like one continuous product.

**Status as of this writing:** all 23 module `.md` files and this folder's 5 shared spec docs are written. One module (53, Decision Tree) already has a finished, working prototype at `prototypes/module-53-decision-tree/` (desktop + mobile) — a real Gini-impurity split search over the toy dataset, not fabricated output, serving as the exact quality bar and reference pattern for the other 22 modules. No `build/` output exists yet for any module — that gets created by running `MASTER-PROMPT-FOR-ANTIGRAVITY.md` against this folder, which will adopt the module-53 prototype directly into `build/` rather than rebuilding it.

**Isolation guarantee:** nothing in this folder modifies, moves, or deletes anything in the original `diagrams/` root (its 50 module specs, its `prototypes/`, its `build/`, its README, or its master prompts). Where this folder's specs reference the original set — e.g. pointing to `prototypes/module-47-rag-pipeline/` as the reference implementation of the multi-stage scrubber pattern — that's a **read-only reference**, never a target to edit.

## What's in this folder

- `00-app-theme.md` — the shared light/dark beige theme (identical values to the original set's copy; this is the single source of truth for both).
- `00-design-system.md` — shared component patterns: panels, legend, categorical colors, multi-stage scrubber, theme toggle — adapted for this module set's own examples.
- `00-mobile-design-system.md` — shared mobile layout rules, adapted for this set's own multi-stage list and examples.
- `00-global-spec.md` — build requirements, acceptance checklist, and this set's own shared toy datasets (toy 2-class dataset, regression dataset, clustering dataset, time-series dataset, tokenizer sample, grounding example).
- `00-home-page.md` — spec for a landing page listing all 23 modules, built independently of (and never modifying) the original course's own home page.
- `module-51-*.md` through `module-73-*.md` — one spec file per module.
- `MASTER-PROMPT-FOR-ANTIGRAVITY.md` — the copy-paste prompt to hand Antigravity to build everything in this folder.

## Module list

| # | Concept | Tier | Tag | Multi-stage? |
|---|---|---|---|---|
| 51 | Linear Regression | Beginner | AI/ML | |
| 52 | Logistic Regression | Beginner | AI/ML | |
| 53 | Decision Tree | Beginner | AI/ML | Yes |
| 54 | Random Forest | Intermediate | AI/ML | |
| 55 | K-Means Clustering | Beginner | AI/ML | Yes |
| 56 | PCA & LDA | Intermediate | AI/ML | |
| 57 | Time Series Analysis | Intermediate | AI/ML | |
| 58 | Support Vector Machine | Intermediate | AI/ML | |
| 59 | Naive Bayes | Beginner | AI/ML | |
| 60 | K-Nearest Neighbors | Beginner | AI/ML | |
| 61 | Gradient Boosting / XGBoost | Advanced | AI/ML | Yes |
| 62 | Bias-Variance Tradeoff | Intermediate | AI/ML | |
| 63 | L1/L2 Regularization (Ridge/Lasso) | Intermediate | AI/ML | |
| 64 | Cross-Validation | Intermediate | AI/ML | Yes |
| 65 | Confusion Matrix / ROC-AUC | Intermediate | AI/ML | |
| 66 | RLHF & DPO | Advanced | LLM | Yes |
| 67 | Quantization (INT8/4-bit) | Advanced | LLM | |
| 68 | Evaluation Metrics (BLEU/ROUGE/Perplexity) | Advanced | LLM | |
| 69 | Tokenizer Comparison (BPE/WordPiece/SentencePiece) | Intermediate | LLM | |
| 70 | Scaling Laws | Advanced | LLM | |
| 71 | Hallucination Detection & Grounding | Advanced | LLM | |
| 72 | Speculative Decoding | Advanced | LLM | Yes |
| 73 | Vector DB / ANN Search | Advanced | LLM | Yes |

7 modules (53, 55, 61, 64, 66, 72, 73) use the full multi-stage scrubber pattern from `prototypes/module-47-rag-pipeline/` in the original course.

## How to build

Paste `MASTER-PROMPT-FOR-ANTIGRAVITY.md`'s contents into Antigravity along with this folder's path, after enabling its full-autonomy/Turbo run mode (so it never stops to ask for confirmation). It will build sequentially — one agent, no parallel workers — into `diagrams/extension-modules/build/`, updating the "Build log" section below as it completes each module, and will not touch anything outside this folder or modify the original course's own `README.md`.

## Build log

- Module 51 — [status: PASS] — OLS linear regression line fit, residuals, and MSE readout verified.
- Module 52 — [status: PASS] — Sigmoid curve, threshold slider, and 2D decision boundary verified.
- Module 53 — [status: PASS] — Adopted directly from finished prototype (depth-2 Gini split search).
- Module 54 — [status: PASS] — Random forest bootstrapped trees ensemble voting grid verified.
- Module 55 — [status: PASS] — 6-stage K-Means centroid assignment & update iterations verified.
- Module 56 — [status: PASS] — Projection axis angle rotation for PCA vs LDA separation verified.
- Module 57 — [status: PASS] — 24-month trend, seasonal decomposition, and forecast horizon verified.
- Module 58 — [status: PASS] — SVM soft-margin penalty C and support vector highlights verified.
- Module 59 — [status: PASS] — Naive Bayes independent word likelihood & posterior calculation verified.
- Module 60 — [status: PASS] — Interactive query point placement, K slider, and neighbor voting verified.
- Module 61 — [status: PASS] — 6-stage Gradient Boosting sequential residual error correction verified.
- Module 62 — [status: PASS] — Polynomial complexity slider and U-shaped train vs val error curve verified.
- Module 63 — [status: PASS] — L1 Lasso diamond vs L2 Ridge circle constraint contour map verified.
- Module 64 — [status: PASS] — 6-stage 5-fold cross-validation split & aggregated score verified.
- Module 65 — [status: PASS] — 2x2 confusion matrix (TP/FP/TN/FN) & ROC-AUC curve operating point verified.
- Module 66 — [status: PASS] — 6-stage RLHF & DPO preference alignment pipeline verified.
- Module 67 — [status: PASS] — FP32 to INT4 scale/zero-point quantization math & memory footprint verified.
- Module 68 — [status: PASS] — BLEU precision, ROUGE recall, and Perplexity uncertainty metrics verified.
- Module 69 — [status: PASS] — BPE, WordPiece, and SentencePiece subword token splits verified.
- Module 70 — [status: PASS] — Parameter, token scaling sliders and Chinchilla optimal frontier verified.
- Module 71 — [status: PASS] — Factual grounding claim highlights & hallucination score verified.
- Module 72 — [status: PASS] — 7-stage Speculative Decoding draft-verify-resample pipeline verified.
- Module 73 — [status: PASS] — 7-stage Vector DB IVF ANN index building & cell search verified.
- Home page — PASS — All 23 modules integrated, search/filter, and iframe desktop/mobile preview verified.
