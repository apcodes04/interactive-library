# Home page — connecting all 6 deep-dive modules (a separate homepage from both the original course and the extension set)

Build this **last**, only after all 6 modules (and their mobile variants) exist in `build/`. It is one additional deliverable, in its own folder: `build/home/index.html`, `build/home/style.css`, `build/home/script.js`. Paste this file into context alongside `00-design-system.md` and `00-app-theme.md` when building it.

**This is a third, distinct, standalone homepage — it is not the same page as, and must never modify, either the original 50-module course's homepage (`diagrams/build/home/`) or the 23-module extension set's homepage (`diagrams/extension-modules/build/home/`).** Same visual design language (same beige/dark-beige theme, same card style, same layout conventions) so all three feel like siblings from one product, but three separate pages in three separate folders, each only ever listing its own module set. A user reaching this deep-dive homepage should see exactly these 6 modules — never a merged list, and never another set's cards mixed in. These 6 modules continue the global numbering right after module 73 (Vector DB / ANN Search), and all 6 sit in the Advanced tier — present them as a direct continuation of that tier, not a new tier of their own. The one acceptable addition for navigation is a plain `<a>` link (e.g. "Back to the 23-module extension set →") pointing at `../../../extension-modules/build/home/index.html` — a hyperlink only, never an iframe embed or shared code, since embedding the *entire other homepage* would defeat the isolation this whole build is built around.

## What this is, in one sentence

A single landing page that lists all 6 deep-dive modules as cards and lets a user open or preview any of them — **without merging any module's code**. Every module folder (`build/module-XX-slug/`) stays exactly as isolated as `00-global-spec.md` already requires; the home page only ever *links to* or *embeds via `<iframe>`* another module's `index.html`, and never imports its JS or CSS directly. This is the one acceptable way to "connect" 6 pages that must otherwise never share code: an `<iframe>` is a hard browser-level isolation boundary, so module 74's variables can never collide with module 78's, even though both are visible from the same home page.

Do not attempt this any other way (no bundler, no shared JS modules imported across module boundaries, no copying module code into the home page's own script.js). If it can't be done with plain links and `<iframe src="...">`, it's out of scope for this deliverable.

## File layout

```
diagrams/
  extension-modules/
    build/home/index.html   <- the extension set's own homepage, one level up from this one
  deep-dive-modules/
    build/
      home/
        index.html
        style.css
        script.js
      module-74-trend-extraction/
        index.html / style.css / script.js
        mobile/index.html / style.css / script.js
      module-75-seasonality-detection/
        ...
      ... (all 6, through module-79-lda-deep-dive)
```

`build/home/` is a sibling of the 6 module folders, not a parent — relative paths from the home page to a module are `../module-XX-slug/index.html` and `../module-XX-slug/mobile/index.html`. The link back to the extension set's homepage is `../../../extension-modules/build/home/index.html` (up out of `home/`, up out of `build/`, up out of `deep-dive-modules/`, then into `extension-modules/build/home/`).

## The module registry — the only place module metadata lives

At the top of `script.js`, hardcode a single array of all 6 modules. This is the one "connecting" data structure — everything else on the page is generated from it:

```js
const MODULES = [
  { id: 74, slug: "module-74-trend-extraction", title: "Trend Extraction", tier: "Advanced", tag: "AI/ML" },
  { id: 75, slug: "module-75-seasonality-detection", title: "Seasonality Detection", tier: "Advanced", tag: "AI/ML" },
  { id: 76, slug: "module-76-residual-anomaly-detection", title: "Residual & Anomaly Detection", tier: "Advanced", tag: "AI/ML" },
  { id: 77, slug: "module-77-autocorrelation-acf-pacf", title: "Autocorrelation (ACF/PACF)", tier: "Advanced", tag: "AI/ML" },
  { id: 78, slug: "module-78-pca-deep-dive", title: "PCA Deep Dive", tier: "Advanced", tag: "AI/ML" },
  { id: 79, slug: "module-79-lda-deep-dive", title: "LDA Deep Dive", tier: "Advanced", tag: "AI/ML" }
];
```

Use each module's exact folder slug and title as established in this folder's own `README.md` table — do not re-derive these, copy them so the home page and the README never disagree. All 6 use `tier: "Advanced"` and `tag: "AI/ML"`.

## Layout

- **Header:** page title ("Acadbyte — Deep-Dive Modules" or similar, clearly distinguishing it from both the original course's "Acadbyte — Interactive Diagrams" and the extension set's own homepage title), a small text link "Back to the 23-module extension set →" pointing at `../../../extension-modules/build/home/index.html` (plain `<a>` hyperlink only, per the note above), a text search input (filters cards by title as-you-type), and the `.theme-toggle` button (top-right, same sun/moon pattern as every module) — this toggle only affects the home page's own chrome, not any embedded module. Since all 6 modules share one tier, tier-filter buttons are unnecessary here — skip them.
- **Body:** one section, "Advanced — continuing from module 73," with a responsive card grid below it (`grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))`), cards in numeric order 74 through 79.
- **Card contents:** module number + title, the "Advanced" and "AI/ML" badges (same badge style as `00-app-theme.md`'s component guidance — `--bg-muted` pill, `--text-muted` text), a one-line note on which module it deepens (e.g. "Deepens module 57" or "Deepens module 56"), and two buttons: **Preview** (opens the embedded-iframe panel described below) and **Open** (navigates to `../module-XX-slug/index.html` in a new tab).

## The preview panel

Clicking **Preview** on any card opens an overlay panel (not a full page navigation) containing:

1. A header row: the module's title, a **Desktop / Mobile** toggle (two small buttons), and a close (×) button.
2. An `<iframe>` filling the rest of the panel, `src` set to `../module-XX-slug/index.html` (desktop) or `../module-XX-slug/mobile/index.html` (mobile). Switching Desktop/Mobile just changes `iframe.src` and, for mobile, constrains the iframe's own width to ~390px (centered, with a visible phone-like frame) so it's obvious it's a mobile preview, not a bug.
3. Clicking outside the panel, pressing `Escape`, or clicking × closes it and clears the `iframe.src` (only ever one live at a time).

This is the entire interactive surface of the home page. No routing library, no build step — vanilla JS toggling a `.open` class and swapping one `iframe.src` string.

## Visual theme

Same beige light/dark system as every module (`:root` / `[data-theme="dark"]`, full values in `00-app-theme.md`). Card style matches `.card` conventions already established: `--card-bg` surface, `1px solid var(--border)`, `var(--radius)`, hover lift (`scale(1.02)`, 150ms). The search input and the "back to extension set" link use `--bg-muted`/`--primary` styling consistent with every other module.

## Acceptance checklist for this deliverable specifically

1. `build/home/index.html`, `style.css`, `script.js` exist; no other file was modified to make this work (module folders remain untouched, and neither the original course's nor the extension set's own homepage was touched).
2. All 6 modules appear exactly once, in numeric order 74 through 79, matching `README.md`.
3. The search box filters cards live as you type.
4. Clicking **Preview** on at least 3 different modules correctly loads that module's own `index.html` inside the iframe, with that module's own steps-panel/explain-panel/caption/theme-toggle all visibly present and functional inside the iframe.
5. Switching **Desktop / Mobile** inside an open preview correctly swaps to the module's `mobile/index.html` and visibly narrows the frame.
6. Closing the preview (×, `Escape`, or outside click) removes the iframe's `src` (verify via dev tools that no module's JS keeps running in the background after close).
7. The home page's own light/dark toggle works independently of whatever theme an embedded module happens to be in.
8. The "Back to the 23-module extension set" link correctly navigates to `../../../extension-modules/build/home/index.html` (only test this if that file exists yet; if not, note it in the build log rather than treating it as a failure).
9. Opening the browser console shows no errors on the home page itself, and no cross-module variable collisions are possible by construction (since nothing is imported — this is a design guarantee, not something to test at runtime).
