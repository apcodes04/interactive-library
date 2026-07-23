# Module 10 — What Are Large Language Models (Q49 — LLM Question)

Build a scale slider demo. Use vanilla JS/CSS, no charting library needed. Follow `00-design-system.md` for colors/type/motion.

**Layout:** a `.card` with a slider labeled "Model size" ranging 1–100 (unitless), default 1. Above it, a CSS grid of small circles (dot-grid) — grid should show `round(10 + slider*1.9)` filled dots (so ~12 dots at minimum, ~200 at maximum), all `--primary` colored, newly-added dots fading in as the slider increases.

**Capability checklist below, exact thresholds:**

| capability | unlocks at slider value |
|---|---|
| Basic text completion | 10 |
| Coherent multi-turn chat | 35 |
| Multi-step reasoning | 65 |
| Tool use / function calling | 90 |

Each list item starts greyed out (`--frozen` text/icon) with an empty circle; the moment the slider crosses its threshold, it animates to `--success` green with a checkmark icon, using the reward-reveal motion from the design system (scale-pulse, overshoot easing).

**Caption:** "Capabilities like reasoning and tool use don't appear gradually — drag past each threshold and notice they switch on all at once, past a certain scale."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Drag the "Model size" slider.
2. Watch the dot-grid grow.
3. Watch capabilities unlock on the checklist as you cross each threshold.
