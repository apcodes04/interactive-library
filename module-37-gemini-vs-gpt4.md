# Module 37 — Gemini vs. GPT-4 (Q31 — LLM Question)

Build a confirmed-vs-speculative comparison table with one hard-data bar chart. Use an HTML/CSS table plus a small Chart.js bar chart. Follow `00-design-system.md` for colors/type/motion.

**Exact table rows** (columns: "Gemini," "GPT-4"):

| Claim | Gemini | GPT-4 |
|---|---|---|
| Native multimodal pretraining | Confirmed — trained jointly on text/image/audio/video from the start | Not applicable — vision (GPT-4V) added after initial text-only training |
| Officially confirmed MoE architecture | Confirmed for Gemini 1.5 | Reported, unconfirmed by OpenAI |
| Training hardware | Confirmed — Google TPU v4/v5e pods | Not officially disclosed in comparable detail |
| Max context window (tokens) | 1,000,000 (Gemini 1.5 Pro) | 128,000 (GPT-4 Turbo) |

**Behavior:** a toggle labeled "Show confirmed facts only" greys out and fades (40% opacity) any cell containing "Reported, unconfirmed" or "Not officially disclosed" when switched on. Below the table, a Chart.js horizontal bar chart compares the one fully numeric, confirmed row (context window): Gemini 1,000,000 vs. GPT-4 128,000, drawn to scale so the size difference is visually obvious (this bar chart is never affected by the toggle, since both values are confirmed).

**Caption:** "Toggle off the unconfirmed claims — notice how little is actually left. The context window bars, though, are real, published numbers you can compare directly."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Toggle "Show confirmed facts only."
2. Compare the table and the context-window bar chart.
