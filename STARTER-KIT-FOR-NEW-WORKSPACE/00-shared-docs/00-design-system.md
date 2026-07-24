# Shared Design System — Deep-Dive Modules (74–79)

Paste this file into Antigravity's context alongside `00-global-spec.md` before every module prompt. This deep-dive set (modules 74–79) goes further into two topics the extension set (51–73) only introduced at a survey level — Time Series decomposition (module 57) and PCA/LDA (module 56) — breaking each into its own richer, standalone module. It reuses the exact same design system as the original 50-module set and the 23-module extension set — same colors, same panels, same theme, same legend rules — so all three sets feel like one continuous product, not three bolted together.

## Color theory: colors carry meaning, not just decoration

Every page uses the same five-color semantic mapping already established across modules 1–73. Once a user learns it once, they never have to relearn it, on any set.

- **Indigo/blue — `--primary` (#4f46e5), `--primary-light` (#818cf8):** "interactive / touch this / query." Every slider fill, primary button, and draggable element uses this. It's the color the eye should land on first.
- **Amber — `--active` (#f59e0b):** "active / changing / trainable right now." Used for anything mid-update: a gradient flowing backward, an expert lighting up in MoE, a LoRA adapter training, a token being generated. Warm = motion/change, by design.
- **Emerald — `--success` (#10b981):** "correct / converged / matched / frozen-safe." Used sparingly, as a reward signal: a loss curve settling, a flashcard-style reveal, two distributions matching exactly. Because it's rare, it reads as a small win when it appears.
- **Rose — `--danger` (#ef4444):** "wrong / diverging / error." Used even more sparingly than green — a loss curve blowing up, a greedy decoding path losing to beam search, a wrong MCQ-style reveal. Scarcity is what keeps it attention-grabbing instead of alarming.
- **Neutral scale — `--frozen`, `--text-muted`, `--border`:** "at rest / not yet interacted with / frozen weights." This is the default state everything starts in before a user does anything. Exact hex values are theme-dependent (warm grays on the light-beige background, lighter warm grays on dark-beige) — see the light/dark values in the reusable CSS block below and the full rationale in `00-app-theme.md`. Never hardcode a specific hex for these three in module code; always reference the CSS variable so they repaint correctly on theme toggle.

Never introduce a sixth **UI-state** color — the five above (interactive, active, success, danger, frozen) must always mean the same thing everywhere. Don't reassign, say, teal to mean "converged" on one module and something else on another.

## Categorical colors: distinguishing multiple data items, not UI state

Some modules show several simultaneous *items of the same kind* that a user needs to visually tell apart and track across stages — module 78's PC1/PC2/PC3 axes and their variance-explained strips, module 74's Simple-Moving-Average vs. Exponential-Moving-Average trend lines, module 77's per-lag ACF/PACF bars. Coloring all of them identically works but reads flat and wastes a real opportunity: giving each item its own consistent color, carried through every stage or panel it appears in, makes the diagram both more visually engaging and easier to trace ("this teal PC1 arrow in the original-data panel is the same teal axis in the rotated-output panel").

This is a **second, separate palette** from the 5 semantic colors above, and the two must never be confused:

- **Semantic colors (blue/amber/green/red/gray)** always mean the same UI *state* — interactive, active, success, danger, frozen — regardless of which module you're on.
- **Categorical colors** only ever mean "this is data item N, distinct from data item M within this one visualization" — they carry no state meaning and are scoped to a single module.

Use this 6-hue categorical set (each has a light-mode and dark-mode value, both contrast-checked against the beige/dark-beige backgrounds):

| Name | Light mode | Dark mode |
|---|---|---|
| Teal | `#0f766e` | `#2dd4bf` |
| Coral | `#c2410c` | `#fb923c` |
| Rose | `#be185d` | `#f472b6` |
| Sky | `#0369a1` | `#38bdf8` |
| Violet | `#7e22ce` | `#c084fc` |
| Mustard | `#a16207` | `#facc15` |

Rules for using it:

1. Only apply categorical colors to genuinely distinct *data items*, never to buttons, sliders, or other controls — those stay on the 5-color semantic system.
2. **Never assign a categorical color that collides with a semantic color active in the same view.** If a stage already uses green for a "correct/converged" highlight, don't also use green as a category's base color in that same view — pick from the table above, skipping any hue that would echo a semantic color already doing work on that page.
3. Carry the same item's color through every stage it appears in — the same tree, expert, or candidate should keep its color from the first stage it appears in through the last — rather than assigning colors fresh at each stage.
4. Cap it at however many items the module actually needs (up to 6 from this table) — don't add categorical color to items that don't need individual tracking (e.g. module 61's already-rejected weak learners can stay uniform `--frozen` gray once superseded).
5. If a module needs more than 6 simultaneous items (e.g. module 54 rendering 8+ Random Forest trees), fall back to the tint/shade approach — two or three of the categorical hues each in 2-3 lightness steps — rather than inventing a 7th+ hue.

## Visual theme: light/dark beige, not stark white/black

The five meaning-colors above never change. What changes, in this section, is everything *underneath* them — the page background, card surface, borders, and text colors. Every module ships in a warm beige light mode by default, with an automatic dark "deep beige" mode via `prefers-color-scheme: dark` — never pure white (`#fff`) and never pure black (`#000`). Full rationale, exact hex values, and contrast math for the whole Acadbyte product (this diagram set plus the main app) live in `00-app-theme.md`; treat that file as the source of truth if the two ever drift. The short version for this file's CSS block below:

- **Light mode:** warm beige page (`--bg`), a slightly lighter off-white-beige card surface (`--card-bg`) so cards lift off the page, warm dark-brown text (`--text`, contrast ≈13:1) — never gray-on-white, it should feel warm, not clinical.
- **Dark mode:** a dark warm brown (`--bg`), *not* near-black — think "espresso," not "void" — with a slightly lighter card surface and warm cream text (contrast ≈14:1).
- Every color pair below was checked against WCAG AA (4.5:1 minimum for body text) in both modes — see `00-app-theme.md` for the numbers. `--primary`, `--active`, `--success`, and `--danger` all have a light-mode and dark-mode value specifically because a color that reads fine on dark beige (bright amber) often fails contrast on light beige, and vice versa.
- No manual toggle is required per module — respect the OS/browser's `prefers-color-scheme` automatically via the media query in the CSS block below. (The main app, being a persistent multi-page product, may add a manual override switch on top of this — see `00-app-theme.md`.)
- Treat this like a professional product's design system, not a demo: the goal is something a user would want to look at across all 79 modules in a row (the original 50, the 23-module extension, and these 6 deep dives), not something that merely "functions." Favor restraint over decoration — warmth and contrast do the work, not extra ornamentation.

## Typography

- Headings and UI labels: `system-ui, -apple-system, "Segoe UI", sans-serif`, semibold, slightly tight letter-spacing.
- Body/caption text: same family, regular weight, `--text-muted` color, ~15px.
- **Live numeric readouts** (the number that updates when you drag a slider or click a button): bold, `tabular-nums`, ~20px, colored with whichever semantic color is currently relevant (blue while dragging, green on success, amber while training). This is the page's core feedback loop — treat it as the visual focal point, never as an afterthought caption.
- Token IDs, matrix values, code-like values: `ui-monospace, "SF Mono", Consolas, monospace`.

## Motion: the difference between "correct" and "satisfying"

- **Micro-hover** on every clickable/draggable element: `transform: scale(1.03)` + a soft shadow lift, 150ms `ease-out`. Nothing interactive should ever feel static under the cursor.
- **State-change transitions** (bar height changing, opacity fading, a line redrawing): 200–400ms `ease-in-out`. This is the default for "something updated because you did something."
- **Reward reveals** (a correct match, a converged curve, a completed merge, a flip revealing the true masked word): use a slight overshoot easing, `cubic-bezier(0.34, 1.56, 0.64, 1)`, 400–600ms, optionally paired with a brief scale-pulse (1 → 1.08 → 1) on the revealed element. This is the one place a bit of bounce is earned — it's the "aha" moment landing.
- **Live counters** (a number ticking from 0 to its target, a compute-cost tally): animate via `requestAnimationFrame` counting up over ~500ms rather than snapping instantly. Small detail, large effect on how "alive" a page feels.
- Respect `prefers-reduced-motion: reduce` — fall back to instant state changes, no exceptions.
- No animation in this entire set should exceed ~1.5 seconds for a single step. Module 78's multi-stage pipeline chains several short steps rather than using one long animation.

## Reusable component CSS

Include this exact block (or equivalent Tailwind utility classes producing the same result) in every module page. Colors are defined as light-mode defaults on `:root`, overridden by a `[data-theme="dark"]` block that JS toggles — this is what makes the light/dark toggle button (next section) possible, rather than relying solely on `prefers-color-scheme`:

```css
:root {
  color-scheme: light dark;
  --bg: #f5f1e6;
  --card-bg: #fbf8f1;
  --bg-muted: #ede6d3;
  --border: #d6c9a0;
  --text: #2b2620;
  --text-muted: #6b6355;
  --primary: #4f46e5;
  --primary-light: #818cf8;
  --active: #9c4208;
  --success: #0f7a52;
  --danger: #b91c1c;
  --frozen: #9c9280;
  --explain-bg: #eee9f7;
  --radius: 12px;
  --shadow: 0 1px 3px rgba(43,38,32,0.08), 0 4px 12px rgba(43,38,32,0.05);
  --font: system-ui, -apple-system, "Segoe UI", sans-serif;
  --mono: ui-monospace, "SF Mono", Consolas, monospace;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="dark"] {
  color-scheme: dark;
  --bg: #1e1b16;
  --card-bg: #2f2a22;
  --bg-muted: #363026;
  --border: #4a4232;
  --text: #f2ead8;
  --text-muted: #b8ad97;
  --primary: #8b85f0;
  --primary-light: #a6a1f5;
  --active: #f5a524;
  --success: #34d399;
  --danger: #f87171;
  --frozen: #7a7264;
  --explain-bg: #2a2540;
  --shadow: 0 1px 3px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.25);
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  margin: 0;
  padding: 24px;
  transition: background 200ms var(--ease-out), color 200ms var(--ease-out);
}

.card {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 24px;
  max-width: 760px;
  margin: 0 auto;
  transition: background 200ms var(--ease-out), border-color 200ms var(--ease-out);
}

/* Light/dark toggle — top-right corner of every module card, see the
   dedicated section below for markup, JS, and placement rules. */
.theme-toggle {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg-muted);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 150ms var(--ease-out), background 150ms;
}
.theme-toggle:hover { transform: scale(1.08); }
.theme-toggle svg { width: 18px; height: 18px; }

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 150ms var(--ease-out), background 150ms;
}
.btn-primary:hover { transform: scale(1.03); background: #4338ca; }

.btn-secondary {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 150ms var(--ease-out), background 150ms;
}
.btn-secondary:hover { transform: scale(1.03); background: var(--bg); }

input[type="range"] {
  accent-color: var(--primary);
  cursor: pointer;
}

.readout {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  font-size: 20px;
  color: var(--primary);
  transition: color 300ms;
}

.caption {
  color: var(--text-muted);
  font-size: 14px;
  font-style: italic;
  margin-top: 16px;
  opacity: 0;
  transition: opacity 400ms var(--ease-out);
}
.caption.visible { opacity: 1; }

.explain-panel {
  background: var(--explain-bg);
  border-left: 3px solid var(--primary);
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 16px;
  font-size: 14px;
  color: var(--text);
  min-height: 20px;
  transition: opacity 200ms;
}
.explain-panel .step-label {
  font-weight: 700;
  color: var(--primary);
  margin-right: 6px;
}
```

The `.caption` class starts invisible and gets a `visible` class added via JS the first time the user interacts — captions should land as a payoff after doing something, not sit there statically before the user has touched anything.

## Light/dark toggle button — required on every module, not just auto-detection

Every module ships its own manual light/dark toggle (a small round icon button, top-right of `.card` — see `.theme-toggle` above). Auto-detecting `prefers-color-scheme` on first load is a good *default*, but a user reading module 53 at night with their OS set to light mode still needs a one-click way to flip it, without that choice being locked to their system setting. Each module is a standalone HTML file, so this cannot be a single app-wide setting — it must be built into every page individually, exactly the same way each time.

Markup (place as the first child of `.card`, before `.steps-panel`):

```html
<button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">
  <svg id="themeIconSun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
  <svg id="themeIconMoon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>
</button>
```

JS (include verbatim at the top of `script.js`, before any module-specific logic — this must run before first paint's worth of interaction, though a small flash on load is acceptable since it's a single static page, not a SPA):

```js
(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    const sun = document.getElementById('themeIconSun');
    const moon = document.getElementById('themeIconMoon');
    function syncIcon(theme) {
      sun.style.display = theme === 'dark' ? 'none' : 'block';
      moon.style.display = theme === 'dark' ? 'block' : 'none';
    }
    syncIcon(initial);
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      syncIcon(next);
    });
  });
})();
```

Rules:

1. Every module's `index.html` gets the button markup; every module's `script.js` gets the toggle script, verbatim, at the top of the file.
2. The button shows a sun icon in light mode (tap to go dark) and a moon icon in dark mode (tap to go light) — never both at once, never a generic "settings" icon.
3. Persist the choice in `localStorage` under the key `theme` so revisiting the same module keeps the user's last choice; if nothing is stored yet, fall back to the OS's `prefers-color-scheme`.
4. This is a per-page toggle, not a per-course one — module 3 and module 40 opened in separate tabs each remember their own last-set theme independently (`localStorage` is scoped per key, not per module, so in practice one choice will end up applying everywhere a user has visited; that's fine and expected — it's the same behavior as most real sites' light/dark toggle).
5. Do not gate anything else in the page behind JavaScript loading — the `:root` light-mode variables must render correctly even if, hypothetically, this script failed to load.

## Live explanation panel (`.explain-panel`) — separate from the caption

Every module needs **two** different pieces of text, and they are not interchangeable:

- **`.caption`** — the one big takeaway, shown once, after the first interaction, and never changed again. This already exists in every module file.
- **`.explain-panel`** — a running, live commentary that **updates every single time the user changes something** (drags a slider, clicks a button, toggles a checkbox, hovers a node). It narrates the specific mechanical effect of that specific action, using the actual current values, not generic boilerplate text.

Example, for the Temperature module: dragging the slider to 1.6 should update the explain panel to something like *"Temperature = 1.60 → dividing the logits by a larger number shrinks the gaps between them, so softmax now spreads probability across more tokens instead of concentrating it on 'sat.'"* Dragging it to 0.3 should produce different text, not the same sentence with a new number spliced in — the explanation itself should reflect what actually happened at that value (sharpening vs. flattening, which token now dominates, etc.).

Rules for every module's explain panel:

1. Update its text on **every** interaction, not just the first one — this is the main difference from `.caption`.
2. Reference the actual current values (the exact slider position, the exact token clicked, the exact branch expanded), never a static placeholder sentence.
3. Keep it to 1–2 sentences, in plain language, written the way you'd explain it out loud to someone watching over your shoulder.
4. Place it directly under the diagram/controls and above the `.caption`, using the `.explain-panel` class.
5. It should never be empty after the user's first interaction — set a sensible default sentence describing the initial state before any interaction happens, so the panel isn't blank on page load.

## Steps-to-interact panel — every module needs one, and it comes first

Before a user touches anything, they need a plain, numbered list telling them what to actually do — not a description of what the diagram demonstrates (that's the `.caption`'s job), just the literal sequence of physical actions: "Step 1: drag the slider. Step 2: click Sample." This is a **third** distinct text element, alongside `.explain-panel` and `.caption`, and the three are never interchangeable:

- **`.steps-panel`** — a short numbered list of literal actions, visible immediately on page load, never hidden or faded in. Comes first, above the diagram/controls.
- **`.explain-panel`** — live, updates on every interaction, narrates what just happened mechanically.
- **`.caption`** — the one fixed takeaway, revealed once after the first interaction.

Each module's own `.md` file specifies its exact steps (2–4 short numbered items, phrased as direct imperatives: "Drag the X slider," "Click Y," never "You could try..."). Add this CSS:

```css
.steps-panel {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 16px 12px 32px;
  margin-bottom: 20px;
  font-size: 13px;
  color: var(--text-muted);
}
.steps-panel li { margin: 2px 0; }
.steps-panel strong { color: var(--text); }
```

Render it as a `<ol class="steps-panel">` with each `<li>` starting with a bolded "Step N:" — e.g. `<li><strong>Step 1:</strong> Drag the Temperature slider.</li>`.

## Legend — required whenever a diagram uses more than one non-obvious color or shape

If a module encodes meaning in dot color, line style, shape, or anything else that isn't already spelled out in a visible text label (an axis label, a button caption), it needs a legend — a small static key, placed directly under the diagram and above the controls, mapping each visual element to what it means. A user should never have to guess what a colored dot represents. Module 47's embedding-space dots are the reference case: without a legend, "10 gray dots and 3 purple dots" means nothing; with one, it's immediately "gray = irrelevant decoy, colored = an actual retrievable chunk." A module whose colors are already self-evident from labels (e.g. a bar chart with token names on the x-axis) can use a short one- or two-item legend or, if truly nothing needs explaining beyond what `.explain-panel` already covers, may skip it — but default to including one rather than assuming it's obvious.

```css
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin: 4px 0 16px;
  padding: 10px 14px;
  background: var(--bg-muted);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 12px;
  color: var(--text-muted);
}
.legend-item { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.legend-swatch { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
```

Give each swatch its own modifier class matching the color/shape it's representing (e.g. `.legend-swatch.cat-1 { background: var(--cat-1); }`, or `.legend-swatch.ring { background: none; border: 2px solid var(--success); }` for a ring-style indicator). Use square swatches (`border-radius: 3px` instead of `50%`) when the diagram itself uses bars/boxes rather than dots, so the legend's shape matches what's actually on screen.

**On module 78, the one multi-stage module in this set, the legend must be dynamic, not static — only list what's actually visible in the current stage, never the full set up front.** Showing all possible legend entries on stage 1, when only some of those colors exist anywhere on stage 1's card, is confusing rather than helpful — it describes elements the user can't see yet. Build a small per-stage lookup (an object of stage-index → array of legend-item keys, keyed the same way on desktop and mobile) and re-render the legend's contents inside the same `renderStage()` function that already updates the explain panel, so it updates in lockstep with whichever stage is current — reached by clicking, scrubbing, or auto-play, exactly like every other stage-dependent element. If a stage has no color-coded elements at all, hide the legend entirely for that stage (`display: none`) rather than leaving an empty box. `module-47-rag-pipeline.md` (in the original `diagrams/` folder) and `module-53-decision-tree.md` (in `diagrams/extension-modules/`, with an already-built prototype at `diagrams/extension-modules/prototypes/module-53-decision-tree/`) are the worked reference examples of a per-stage legend mapping — module 78's own file spells out its exact per-stage legend contents the same way.

## Multi-stage modules: stage scrubber + persistent clickable stages

Module 78 (PCA Deep Dive) is the one module in this set that shows more than one sequential stage or step — walking from the original 2D data, through the PC arrows, to the rotated PCA output, then into a 3D-to-PC cascade with variance-explained density strips. A module like this must **never** be a single "Run" button that auto-plays through everything and then leaves the user with no way back in. That pattern was tried on the original course's RAG module first and failed: the explanation moved on before anyone could read it, and once the animation finished there was nothing left to interact with. Reference `prototypes/module-47-rag-pipeline/` in the original `diagrams/` folder, and `prototypes/module-53-decision-tree/` in `diagrams/extension-modules/` (an already-built, already-approved example in this exact product family), as proven implementations of this pattern.

Every multi-stage module needs all three of these, working off one shared piece of state (the current stage index), not three separate mechanisms:

1. **Persistently clickable stage indicators.** Each stage/step gets its own clickable element (a real `<button>`, not a `<div>` with a click listener bolted on — buttons are focusable and keyboard-accessible by default). Clicking a stage jumps straight to it and shows its explanation, **at any time** — before the user has pressed play, mid-autoplay, or long after the animation has finished. A finished animation should never leave the diagram inert; every stage stays a live control forever.

2. **A scrubber.** A single `<input type="range">` spanning `0` to `stageCount − 1`, one step per stage. Dragging it moves forward or backward through stages at whatever pace the user wants, updating the explanation and the visual state immediately as it moves — this is what lets someone go back three stages to re-read something they scrolled past too fast.

3. **An optional auto-play button** ("Run," "Run query," etc.) for people who just want to watch it play once. Auto-play must move the *same* shared stage-index state that the scrubber and the stage buttons use — it is not a separate animation track. Auto-play should be interruptible: touching the scrubber or clicking a stage while it's playing stops the auto-play immediately and hands control back to the user. Slow auto-play down enough to be readable on its own (roughly 700–1000ms per stage, not 400ms) — it's a convenience preview, not the primary way anyone is expected to actually read the page.

Visual states for stage indicators (three, not two): **completed** (a thin `--success` border, box background at ~0.85 opacity), **current** (`--primary` border and label color, full opacity, slightly scaled up), **upcoming** (default `--border`, box background at ~0.75 opacity). This lets a user glance at the row and immediately see where they are, not just what's "done."

**Never fade the whole stage element — including its text — with a single blanket `opacity` on the button/container.** An earlier version of the RAG module did exactly this (`opacity: 0.35` on non-current stages) and it made the stage labels and data inside genuinely hard to read, especially in dark mode, where faded light-on-dark text loses contrast fast. The fix, required on module 78: keep label and body text at their normal full-contrast colors (`var(--text)` / `var(--text-muted)`, never dimmed further) in every state — completed, current, and upcoming alike. Only the **box background/border** gets the light opacity reduction (~0.75–0.85, never below 0.7) to signal "not current," while the stage number/label stays exactly as legible as the current stage's. If you need a stronger "de-emphasized" cue than that, change the border color or weight, not the text's visibility.

The explain panel always reflects whichever stage is current, however the user got there — clicked, scrubbed, or auto-played. There is exactly one explanation visible at a time, and it never changes on its own; it only changes because the current stage changed.

## Engagement principles (apply across every module, without adding complexity)

1. **One obvious first action per page.** Every module should have exactly one slider, button, or draggable element that's visually the most prominent thing on the page — the thing a user tries first with zero instructions needed.
2. **Something should visibly move within 1 second of any interaction.** No dead clicks. If a button's effect takes longer than a second to become visible, add an immediate small acknowledgment (a highlight, a brief pulse) while the fuller animation plays out.
3. **Numbers should count, not snap.** Anywhere a number changes (loss value, probability, compute cost, KL divergence), animate the digit change rather than replacing it instantly.
4. **Reset is always available and always a secondary button.** Never let a user get stuck in a state they can't back out of.
5. **Don't add gamification that isn't in the spec.** No points, streaks, or badges across pages — each page is a standalone demo, not a game with persistent state (there's no backend to store that anyway). "Fun" here means satisfying micro-interactions and clear color meaning, not point systems.
