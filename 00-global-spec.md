# Global Build Requirements & Shared Assets — All 50 Interactive Diagrams

Paste this file into Antigravity's context together with `00-design-system.md`, `00-mobile-design-system.md`, and `00-app-theme.md` at the start of every session, then paste only the individual module file (`module-XX-*.md`) for the page you want built that turn. Once all 50 are done, also paste `00-home-page.md` for the final connecting-home-page deliverable. Each module is built and delivered **twice**: a desktop folder (`build/module-XX-slug/index.html` + `style.css` + `script.js`) and a mobile folder (`build/module-XX-slug/mobile/index.html` + `style.css` + `script.js`) — never merge two modules' files together, and never split one module's files across two of its own folders.

## Global build requirements

- **Modular file output, one folder per module.** For module `module-XX-slug.md`, output a folder named `module-XX-slug/` containing exactly three files: `index.html` (markup only — a `<link>` to `style.css` and a `<script>` tag for `script.js`, plus the one CDN `<script>` tag if the module needs a library), `style.css` (all styling, including the shared CSS variables block from `00-design-system.md`), and `script.js` (all interaction logic). Do not inline any CSS or JS inside `index.html`. This keeps every module's files self-contained and separate from every other module's — the RAG pipeline's three files never mix with the overfitting module's three files, and each folder can be zipped, moved, or handed off independently.
- No build step, no bundler, no backend. The only allowed external dependency is the one CDN `<script>` tag named in that module's file (loaded directly in `index.html`).
- Include the exact CSS variables block from `00-design-system.md` at the top of every `style.css`, and follow its color/typography/motion rules for anything not explicitly overridden by the module's own prompt.
- No live API or model calls, ever. All data (sentences, vectors, matrices, probabilities, logits) must be hardcoded or precomputed directly in `script.js`, using the exact values given in the module file — do not invent your own numbers where exact ones are specified.
- Responsive layout that renders correctly in an embed frame as small as 800×500px, no fixed-pixel overflow, no horizontal scroll.
- Every slider, button, or toggle must have a visible text label and a live-updating numeric readout (styled with the `.readout` class) wherever the module implies a changing number.
- **Steps-to-interact panel, required on every module, shown first.** Include a `.steps-panel` (see `00-design-system.md`) — a short numbered list of literal actions (2–4 items, e.g. "Step 1: Drag the Temperature slider," "Step 2: Click Sample one token") — visible immediately on page load, above the diagram. Use the exact steps given in the module's own `.md` file. This is distinct from, and comes before, the explain panel and caption.
- **Live explain panel, required on every module.** Include a `.explain-panel` element (see `00-design-system.md`) that updates its text on every single user interaction — not just the first one — describing in plain language exactly what just happened and why, using the real current values. Give it a sensible default sentence before any interaction so it's never blank on load. This is in addition to, not instead of, the `.caption` element.
- **Mobile variant, required for every module.** Build a second, separate version of every module at `build/module-XX-slug/mobile/` following `00-mobile-design-system.md` in full — single-column layout, tap instead of hover, larger touch targets, and (for the 8 multi-stage modules) large per-stage tap buttons instead of small clickable dots. Same underlying data and logic as the desktop version; different layout and interaction only.
- **Legend, required whenever the diagram uses a color or shape that isn't already explained by a visible label.** See `00-design-system.md`'s Legend section — a small static key under the diagram, above the controls, mapping every non-obvious dot/color/shape to its meaning. Also apply the Categorical colors section there whenever a module needs to distinguish several simultaneous same-type data items (e.g. module 47's 3 retrievable chunks) — a separate 6-hue palette from the 5 semantic UI-state colors, never colliding with a semantic color already active in the same view.
- **Multi-stage mobile stacking order and Reset button color, required on modules 4, 8, 12, 15, 17, 23, 31, 47's mobile builds.** Per `00-mobile-design-system.md`: diagram, then legend, then the scrubber/dial, then `.explain-panel`, then the controls row (Run/Back/Next/Reset), then caption — the explain panel sits above the buttons, not below them. The Reset button uses a dedicated `.btn-reset` green (`--success`) accent, distinct from Back/Next/Run.
- **Light/dark theme with a manual toggle, required on every module (both desktop and mobile).** Use the exact beige light-mode / dark-beige dark-mode CSS variables from `00-design-system.md`'s `:root` / `[data-theme="dark"]` block (full rationale and hex table in `00-app-theme.md`) — never pure white or pure black. Every page ships its own `.theme-toggle` sun/moon icon button (top-right of `.card`), defaulting to `prefers-color-scheme` on first visit and persisting the user's choice in `localStorage` afterward. This is a per-page requirement, not a one-time setup — copy the exact markup/CSS/JS pattern from `00-design-system.md`'s toggle section into every single module.
- **Home page, one additional deliverable built last.** After all 50 modules (and their mobile variants) exist, build `build/home/index.html` + `style.css` + `script.js` per `00-home-page.md` — a single landing page listing every module as a card, grouped by tier, that opens or `<iframe>`-previews any module without importing its code. Do not start this until all 50 modules are done; do not let it modify any module folder.
- **Multi-stage modules require a scrubber plus permanently clickable stage indicators, not just an auto-play button.** Modules 4, 8, 12, 15, 17, 23, 31, and 47 (any module with more than one sequential stage/step) must follow the full pattern in `00-design-system.md`'s "Multi-stage modules" section: one shared current-stage-index state driving (1) individually clickable stage buttons that remain clickable forever, including after any animation finishes, (2) a range-input scrubber that moves forward and backward through stages at the user's own pace, and (3) an optional auto-play button that moves the same shared state and can be interrupted at any time by touching the scrubber or clicking a stage directly. Never ship a multi-stage module where the only way to see a given stage's explanation is to sit through the whole auto-play animation.
- Include the module's exact caption text under the diagram (below the explain panel), using the `.caption` class, revealed (class `visible` added) on first user interaction rather than shown statically from page load.
- Keep any single animation step under ~1.5 seconds; add a visible `.btn-secondary`-styled "Reset" button whenever the diagram accumulates state (steps taken, values dragged, etc.).
- Where a module says "toy" or "precomputed," do not compute it from a real embedding model, real corpus, or real training run — use the exact hardcoded numbers given.

## Acceptance checklist (run this after each generated module, before moving to the next one)

1. Both the desktop folder and the `mobile/` folder exist, each containing exactly `index.html`, `style.css`, `script.js` — no inline CSS/JS left in either `index.html`.
2. Desktop opens with no console errors and no layout overflow at 800×500px. Mobile opens with no console errors and no horizontal scroll at 375px width.
3. The steps-to-interact panel is present and visible immediately on load (not hidden, not faded in) on both versions, listing the exact steps from the module's `.md` file.
4. The one "obvious first action" (per the design system's engagement principle 1) is visually clear within 2 seconds of looking at the page, no instructions needed.
5. Every live number animates/counts rather than snapping instantly.
6. The explain panel shows a sensible default on load, and its text visibly changes after every interaction (not just the first) — check this by interacting at least twice and confirming the text is different each time.
7. The caption is present, uses the exact text specified, and fades in only after the first interaction.
8. Reset (where applicable) returns the page to its exact initial state.
9. Colors match the semantic mapping in `00-design-system.md` (blue = interactive, amber = active/changing, green = success/converged, red = wrong/diverging, gray = frozen/at rest) — no unrelated colors introduced.
10. `prefers-reduced-motion` is respected (transitions collapse to instant).
11. **For multi-stage modules only (4, 8, 12, 15, 17, 23, 31, 47):** every stage indicator is still clickable after letting auto-play run to completion — click stage 2 right now and confirm its explanation shows immediately. Drag the scrubber backward and confirm the visual state and explanation both update to match. Start auto-play, then touch the scrubber mid-play, and confirm auto-play stops rather than fighting the user for control. On mobile, confirm the per-stage buttons are large enough to tap precisely (at least 56×56px) and hover-only reveals have a tap equivalent.
12. On mobile specifically: every touch target measures at least 44×44px, nothing depends on hover, and single-finger tap/drag is sufficient for every interaction.
13. The `.theme-toggle` button is present on both desktop and mobile, defaults to the OS's `prefers-color-scheme`, and clicking it immediately flips every color on the page (including chart/SVG colors driven from JS, not just CSS) to the matching light/dark values from `00-design-system.md` — no pure white or pure black anywhere, in either mode.
14. Reloading the page after toggling remembers the last-chosen theme (`localStorage`), and a fresh browser profile with no stored value matches the OS preference correctly.
15. **Home page only (build this check after all 50 modules exist):** run the 8-item acceptance checklist inside `00-home-page.md` — all 50 modules listed exactly once in the correct tier, search/filter working, preview iframe correctly loading each module's own index.html, and closing the preview leaving no module's script still running in the background.
16. If the diagram uses any color or shape not already explained by a visible label, a `.legend` is present under the diagram, and every distinct dot/color/shape in the visualization has a matching legend entry — no unexplained colors. **On the 8 multi-stage modules specifically:** the legend updates per stage — jump to at least 3 different stages and confirm the legend shows only the entries relevant to that stage's card, not the full set every time, and hides entirely on a stage with nothing color-coded.
17. Non-current stage/box text (labels, data inside boxes) is still clearly readable, not washed out — de-emphasis comes from the container's background/border opacity only, never from fading the text itself below ~0.7 opacity.
18. **Multi-stage modules' mobile builds only (4, 8, 12, 15, 17, 23, 31, 47):** page order is diagram, legend, scrubber, explain-panel, then controls (Run/Back/Next/Reset), then caption — explain-panel sits above the button row. The Reset button is visibly green (`--success`), distinct from Back/Next/Run.

## Shared assets (referenced by name inside individual module files)

- **Sentence A:** "The cat sat on the mat because it was tired." (9 tokens: The / cat / sat / on / the / mat / because / it / was / tired — treat "was" + "tired" as index 9/10 if a module needs exactly 9 or 10; default to the 9-word version "The cat sat on the mat because it was tired" and drop the final "tired" only where a module explicitly asks for a 6- or 8-token version.)

- **Sentence B:** "The chef who trained in Paris prepared the dish." — used for the multi-head attention module.

- **Toy vocabulary with fixed 2D coordinates** (used for embeddings, top-k/nucleus, cross-entropy, softmax, temperature, and gradient-nudge modules):

  | word | x | y |
  |---|---|---|
  | cat | 12 | 45 |
  | dog | 15 | 48 |
  | mat | 60 | 20 |
  | sat | 55 | 25 |
  | tired | 20 | 78 |
  | chef | 80 | 40 |
  | dish | 82 | 20 |
  | Paris | 90 | 60 |
  | trained | 70 | 65 |
  | prepared | 78 | 30 |
  | happy | 25 | 75 |
  | sad | 22 | 80 |

- **Toy 2-class 2D dataset** (used for overfitting, hyperparameter, and generative-vs-discriminative modules): 40 points on a 0–100 scale. Class A: 20 points scattered in a Gaussian-like cluster centered at (30, 30) with spread ±15. Class B: 20 points scattered in a cluster centered at (70, 70) with spread ±15. Generate these with a seeded random function (seed = 42) so the same 40 points render identically every time the page loads, and include 3–4 points from each class that land in the other class's territory (e.g. one Class A point near (55, 55), one Class B point near (48, 48)) so a linear boundary is imperfect and overfitting has something real to latch onto.

- **Toy N-gram table** (used for the LLMs-vs-statistical-LMs module), exactly these 6 entries and nothing else — any prefix not listed here must show all next-word probabilities as exactly zero:

  | prefix | next-word probabilities |
  |---|---|
  | "the cat" | sat: 0.9, ran: 0.1 |
  | "the dog" | barked: 0.8, sat: 0.2 |
  | "she opened" | door: 0.6, box: 0.4 |
  | "he was" | tired: 0.7, happy: 0.3 |
  | "they went" | home: 0.5, outside: 0.5 |
  | "it was" | raining: 0.55, sunny: 0.45 |

- **Illustrative LLM-style distribution** for the same module (used only as a contrast to the N-gram table above, explicitly commented in code as illustrative, not a real model call): for any 2-word prefix typed, always render this same fixed 7-token distribution regardless of exact prefix match — `sat: 0.28, walked: 0.19, ran: 0.15, stood: 0.13, jumped: 0.10, stayed: 0.09, left: 0.06` — to make the point that it never collapses to zero the way the N-gram table does.
