# Module 70 — Scaling Laws (LLM Concept)

Build a page showing loss-vs-compute curves for 4 fixed toy model sizes, with a compute-budget slider that highlights the compute-optimal size at each budget. Use vanilla SVG (log-log chart). Follow `00-design-system.md` for colors/type/motion and its Categorical colors section.

**Exact data:** a simplified, clearly-illustrative Chinchilla-style formula, fixed constants: `loss(N, D) = 1.69 * N^-0.076 * D^-0.095 + 1.5`, where N = model parameters and D = training tokens. Four fixed toy model sizes: Model A = 125,000,000 params (`--cat-1`), Model B = 1,300,000,000 params (`--cat-2`), Model C = 13,000,000,000 params (`--cat-3`), Model D = 175,000,000,000 params (`--cat-4`). For a given compute budget C (in FLOPs, approximated as `6*N*D`), each model's tokens-seen D is `C / (6*N)` — compute all 4 curves live from these fixed constants and formula, not from real training runs.

**Layout:** a `.card` with a log-log line chart, x-axis = compute budget (log scale), y-axis = loss, one line per model size in its categorical color.

**Control:** slider "Compute budget," log scale, wide range (e.g. 1e18 to 1e23 FLOPs) — draws a vertical marker line at the current budget and highlights (bolds, raises z-index of) whichever model-size curve currently has the lowest loss at that x-position.

**Toggle:** `.btn-secondary` "Show compute-optimal frontier" — draws a dashed `--success` line connecting the lowest-loss point across the full range of compute budgets (the "frontier"), computed live by evaluating all 4 curves across a fixed grid of budget values and taking the minimum at each.

**Legend:** Model A/B/C/D (categorical colors), Compute-optimal frontier (dashed line), Current compute budget (vertical marker).

**Caption:** "At any fixed compute budget, one model size sits closest to the frontier — bigger isn't automatically better if you haven't fed it enough tokens to match."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Compute budget" slider.
2. Watch which model-size curve currently sits lowest (best) at that budget.
3. Toggle "Show compute-optimal frontier" to see the ideal model-size path across all budgets.
