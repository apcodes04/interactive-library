# Home page — connecting all 50 modules

Build this **last**, only after all 50 modules (and their mobile variants) exist in `build/`. It is one additional deliverable, in its own folder: `build/home/index.html`, `build/home/style.css`, `build/home/script.js`. Paste this file into context alongside `00-design-system.md` and `00-app-theme.md` when building it.

## What this is, in one sentence

A single landing page that lists all 50 modules as cards and lets a user open or preview any of them — **without merging any module's code**. Every module folder (`build/module-XX-slug/`) stays exactly as isolated as `00-global-spec.md` already requires; the home page only ever *links to* or *embeds via `<iframe>`* another module's `index.html`, and never imports its JS or CSS directly. This is the one acceptable way to "connect" 50 pages that must otherwise never share code: an `<iframe>` is a hard browser-level isolation boundary, so module 12's variables can never collide with module 47's, even though both are visible from the same home page.

Do not attempt this any other way (no bundler, no shared JS modules imported across module boundaries, no copying module code into the home page's own script.js). If it can't be done with plain links and `<iframe src="...">`, it's out of scope for this deliverable.

## File layout

```
build/
  home/
    index.html
    style.css
    script.js
  module-01-hyperparameter/
    index.html / style.css / script.js
    mobile/index.html / style.css / script.js
  module-02-overfitting/
    ...
  ... (all 50)
```

`build/home/` is a sibling of the 50 module folders, not a parent — relative paths from the home page to a module are `../module-XX-slug/index.html` and `../module-XX-slug/mobile/index.html`.

## The module registry — the only place module metadata lives

At the top of `script.js`, hardcode a single array of all 50 modules. This is the one "connecting" data structure — everything else on the page is generated from it:

```js
const MODULES = [
  { id: 1, slug: "module-01-hyperparameter", title: "Hyperparameter tuning", tier: "Beginner", tag: "AI/ML" },
  { id: 2, slug: "module-02-overfitting", title: "Overfitting vs. underfitting", tier: "Beginner", tag: "AI/ML" },
  // ... all 50, in order. Use each module's exact folder slug and the tier/title
  // already established in README.md's table of contents — do not re-derive these,
  // copy them from README.md so the home page and the README never disagree.
];
```

Each module's `tier` must be exactly one of `"Beginner"`, `"Intermediate"`, `"Advanced"` (matching the three tiers already used across the 50 `.md` specs and `README.md`), and `tag` one of `"AI/ML"` or `"LLM"`.

## Layout

- **Header:** page title ("Acadbyte — Interactive Diagrams"), a text search input (filters cards by title as-you-type), three tier-filter buttons (All / Beginner / Intermediate / Advanced), and the `.theme-toggle` button (top-right, same sun/moon pattern as every module) — this toggle only affects the home page's own chrome, not any embedded module, since each module manages its own theme independently inside its `iframe`.
- **Body:** one section per tier, in order (Beginner, then Intermediate, then Advanced), each with a heading and a responsive card grid below it (`grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))`).
- **Card contents:** module number + title, the tier badge and AI/ML-vs-LLM tag (same badge style as `00-app-theme.md`'s component guidance — `--bg-muted` pill, `--text-muted` text), and two buttons: **Preview** (opens the embedded-iframe panel described below) and **Open** (navigates to `../module-XX-slug/index.html` in a new tab — full-fidelity fallback, and the only option that always works even if iframes are blocked in some embed context).

## The preview panel

Clicking **Preview** on any card opens an overlay panel (not a full page navigation) containing:

1. A header row: the module's title, a **Desktop / Mobile** toggle (two small buttons), and a close (×) button.
2. An `<iframe>` filling the rest of the panel, `src` set to `../module-XX-slug/index.html` (desktop) or `../module-XX-slug/mobile/index.html` (mobile). Switching Desktop/Mobile just changes `iframe.src` and, for mobile, constrains the iframe's own width to ~390px (centered, with a visible phone-like frame) so it's obvious it's a mobile preview, not a bug.
3. Clicking outside the panel, pressing `Escape`, or clicking × closes it and clears the `iframe.src` (don't leave 50 possible iframes loaded at once — only ever one live at a time).

This is the entire interactive surface of the home page. No routing library, no build step — vanilla JS toggling a `.open` class and swapping one `iframe.src` string.

## Visual theme

Same beige light/dark system as every module (`:root` / `[data-theme="dark"]`, full values in `00-app-theme.md`). Card style matches `.card` conventions already established: `--card-bg` surface, `1px solid var(--border)`, `var(--radius)`, hover lift (`scale(1.02)`, 150ms). Tier section headings use `--text`, bold; the search input and filter buttons use `--bg-muted` backgrounds so they read as controls, not content.

## Acceptance checklist for this deliverable specifically

1. `build/home/index.html`, `style.css`, `script.js` exist; no other file was modified to make this work (module folders remain untouched).
2. All 50 modules appear exactly once, grouped correctly by tier, in the same order as `README.md`.
3. The search box filters cards live as you type; a tier filter button shows only that tier's section(s).
4. Clicking **Preview** on at least 3 different modules (spot-check across tiers) correctly loads that module's own `index.html` inside the iframe, with that module's own steps-panel/explain-panel/caption/theme-toggle all visibly present and functional inside the iframe.
5. Switching **Desktop / Mobile** inside an open preview correctly swaps to the module's `mobile/index.html` and visibly narrows the frame.
6. Closing the preview (×, `Escape`, or outside click) removes the iframe's `src` (verify via dev tools that no module's JS keeps running in the background after close).
7. The home page's own light/dark toggle works independently of whatever theme an embedded module happens to be in.
8. Opening the browser console shows no errors on the home page itself, and no cross-module variable collisions are possible by construction (since nothing is imported — this is a design guarantee, not something to test at runtime).
