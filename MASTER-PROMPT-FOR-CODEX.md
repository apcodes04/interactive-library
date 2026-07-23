# Master Prompt — Test Run (give this to Codex/Opus first, before doing all 50)

## Files to attach for this test run (5 files, all in this folder)

1. `00-global-spec.md`
2. `00-design-system.md`
3. `00-mobile-design-system.md`
4. `00-app-theme.md`
5. `module-30-temperature.md`

(Module 30, Temperature, is the recommended first test — it's the simplest build and already has a working reference version in `prototypes/module-30-temperature/`, including its `mobile/` variant, you can compare its output against.)

## The prompt to paste

```
I'm building a series of 50 standalone interactive diagrams for an ML/LLM course. I've attached five files: 00-global-spec.md (build rules, shared example data, acceptance checklist), 00-design-system.md (colors, typography, motion, reusable CSS, the light/dark theme toggle, and the required live explain-panel component), 00-mobile-design-system.md (the separate mobile-build rules), 00-app-theme.md (the exact beige light-mode / dark-beige dark-mode color values and contrast rationale), and module-30-temperature.md (the one page to build in this run).

Build exactly this one module — both its desktop and mobile versions. Requirements:

1. Follow every rule in 00-global-spec.md and 00-design-system.md exactly — same CSS variables (including the light/dark theme values from 00-app-theme.md), same color meanings (blue = interactive, amber = active/changing, green = success/converged, red = wrong/diverging, gray = frozen/at rest), same motion timing.

2. Output two folders: module-30-temperature/ (desktop) containing exactly three files — index.html (markup and <link>/<script> tags only, no inline CSS or JS), style.css (all styling), script.js (all interaction logic) — and module-30-temperature/mobile/ (mobile) containing its own index.html, style.css, script.js per 00-mobile-design-system.md: single column, 375px baseline, tap instead of hover, 44×44px minimum touch targets. Same underlying data and logic in both; only layout and interaction differ. Do not merge desktop and mobile into one file, and do not add any other files.

3. Include the .steps-panel element specified in 00-design-system.md on both versions — a short numbered list of literal actions from module-30-temperature.md's own "Steps to interact" section, visible immediately on load, before the diagram.

4. Include the .explain-panel element specified in 00-design-system.md on both versions. It must update its text on every single interaction (not just the first), describing in plain language exactly what just changed and why, using the real current values — not generic placeholder text. Give it a sensible default sentence before any interaction so it's never blank on load. This is separate from the .caption element, which states one fixed takeaway and only appears once, after the first interaction.

5. Include the .theme-toggle light/dark button (see 00-design-system.md's toggle section) on both versions — the exact beige/dark-beige CSS variables from 00-app-theme.md, sun/moon icon swap, defaulting to prefers-color-scheme and persisting the choice in localStorage. Never pure white or pure black anywhere.

5b. NOTE FOR MULTI-STAGE MODULES ONLY (does not apply to module 30, which has no sequential stages): modules 4, 8, 12, 15, 17, 23, 31, and 47 each show more than one sequential stage/step, and for those specifically, a single auto-play button is not enough — this was tried on the RAG module first and failed, because the explanation moved on before anyone could read it, and once the animation finished there was nothing left to interact with. Each of those 8 modules must instead provide, off one shared current-stage-index variable: (a) individually clickable stage indicators that remain clickable forever, including after any animation finishes, each one jumping straight to that stage and showing its explanation, (b) a scrubber (range input) that moves forward and backward through stages at the user's own pace, and (c) an optional auto-play button that moves that same shared state and can be interrupted at any time by touching the scrubber or clicking a stage directly. On mobile, the per-stage buttons must be large tap targets (56×56px minimum), per 00-mobile-design-system.md. When you build one of these 8 modules, read the "Multi-stage modules" section of 00-design-system.md in full before starting.

6. Use the exact hardcoded data given in module-30-temperature.md (the 8 fixed logits) — do not invent different numbers, do not call any real model or API.

7. Before you finish, run through the acceptance checklist in 00-global-spec.md yourself (all 14 items, including the theme-toggle ones) and tell me explicitly, item by item, which ones pass and which don't.

8. Build only this one module (both variants). Do not start on any other module until I've reviewed this one and confirmed it's good.
```

## What to do with the result

1. Open the generated desktop `index.html` in a real browser (double-click it, or drag it into a browser tab — no server needed), then open the `mobile/index.html` too and resize your browser window down to roughly 375px wide (or use your browser's device toolbar) to check it.
2. Compare both against `prototypes/module-30-temperature/` (the known-working reference, which also has a `mobile/` folder) — drag the slider, click "Sample one token," confirm the explain panel text changes every time and the chart reshapes correctly, on both desktop and mobile.
3. Click the theme toggle on both versions and confirm the whole page — including the chart colors — flips between the beige light mode and dark-beige dark mode with no pure white/black anywhere.
4. Check off the acceptance checklist items yourself, don't just trust the model's self-report.
5. If it's good: move to the next module by repeating the same prompt structure, swapping in `module-01-hyperparameter.md` (or whichever module you want next) as the fifth attached file and updating the folder names accordingly. Everything else in the prompt template stays the same. **Recommended second test:** run `module-47-rag-pipeline.md` next (not a simple module 1–2 pick) — it's the multi-stage reference module, already rebuilt in `prototypes/module-47-rag-pipeline/` (desktop and mobile) with the scrubber + clickable-stages pattern, so you can verify Codex reproduces that pattern correctly before trusting it on the other 7 multi-stage modules (4, 8, 12, 15, 17, 23, 31).
6. If it's not good: tell the coding tool specifically what's wrong (e.g. "the explain panel isn't updating on slider drag, only on page load") and ask it to fix just that, rather than restarting from scratch.
7. Once all 50 modules (both variants) are done and reviewed, the last remaining deliverable is the connecting home page — see `00-home-page.md` and `prototypes/home/` for that spec and reference; it's a single additional page, not a per-module task, so it only needs to be built once, last.

## Files you need per module, going forward (5 every time)

- `00-global-spec.md` (always)
- `00-design-system.md` (always)
- `00-mobile-design-system.md` (always)
- `00-app-theme.md` (always)
- `module-XX-slug.md` (swap this one each time — the module you're building that turn)
