# Mobile Design System — All 50 Interactive Diagrams

This is a **separate** file from `00-design-system.md` on purpose: the desktop version of every module is the primary spec, and the mobile version is a distinct, additional build for each module — not a CSS media query bolted onto the same files. Every module gets built **twice**: once as the desktop version (per `00-design-system.md` and the module's own `.md` file) and once as the mobile version (per this file, same data and logic, different interaction and layout). Paste this file into context alongside `00-global-spec.md` and the module's own `.md` file whenever you're building the mobile variant.

## Why a fully separate build instead of responsive CSS alone

Several interaction patterns used on desktop don't translate to a touch screen at all — hover tooltips, fine-grained mouse dragging on small targets, side-by-side multi-column layouts that need a wide viewport. Squeezing the desktop version into a phone-width container with only `@media` breakpoints would leave dead interactions behind (a tooltip nobody can trigger, a drag handle nobody can grab precisely). Building the mobile version as its own `index.html` / `style.css` / `script.js` — reusing the exact same hardcoded data and underlying logic from the module's spec — lets each interaction be re-thought for touch instead of just shrunk.

## Output location

For module `module-XX-slug`, the mobile build goes in a sibling folder: `build/module-XX-slug/mobile/`, containing its own `index.html`, `style.css`, `script.js`. The desktop build stays at `build/module-XX-slug/` exactly as specified in `00-global-spec.md`. Never mix the two — the mobile folder is a self-contained variant, not a shared-code refactor.

## Layout rules

- Single column, always. Anything shown side-by-side on desktop (two charts, two panels, a diagram next to a legend) stacks vertically on mobile, in the order: diagram/visual first, then controls, then the three text panels (steps, explain, caption).
- Design for a 375px-wide viewport as the baseline (roughly an iPhone SE / small Android phone); it must not require horizontal scrolling at that width. Test mentally against 375px, not just "responsive in general."
- Card padding drops from 24px to 16px; font sizes for body text increase slightly (14px → 15px) since phone viewing distance and touch precision both favor slightly larger text over desktop's tighter spacing.
- Any element with more than 3–4 items side-by-side on desktop (the 5-bar softmax charts, the 8-expert MoE circle, the 9-stage RAG pipeline) becomes horizontally scrollable with visible scroll-snap on mobile, rather than shrinking every item until it's unreadable.

## Touch target and input rules

- Every clickable/tappable element is at least 44×44px (Apple's and Google's shared minimum recommended touch target), even if that means a button looks larger relative to its text than the desktop version.
- **Hover has no mobile equivalent — replace every hover-triggered reveal with a tap-triggered one.** Module 5's neighbor-lines-on-hover, module 22's angle-arc-on-hover-adjacent-drag, and module 33's cell-hover-highlight all become tap-to-show instead: tapping toggles the reveal on, tapping elsewhere (or the same element again) toggles it off. Never leave content only reachable via hover on the mobile build.
- **Fine mouse-drag becomes either touch-drag with a larger hit area, or a stepper fallback — pick whichever keeps the interaction legible at touch precision.** For continuous drags on small targets (module 22's vector arrowheads, module 16's matrix-entry drag-implied inputs), prefer real number inputs or +/- stepper buttons over expecting a precise touch-drag on a thin SVG line. For sliders (temperature, learning rate, k/p values, context window resize), a native `<input type="range">` remains the right control — just make the thumb larger via CSS (`::-webkit-slider-thumb`, min 28px) so it's grabbable with a fingertip.
- **Scrubbers on the 8 multi-stage modules (4, 8, 12, 15, 17, 23, 31, 47) get large tap-targets for each stage, arranged as a horizontally scrollable row of big buttons (min 56×56px) rather than small clickable dots.** The range-input scrubber itself stays, with an enlarged thumb, but the individual per-stage buttons are the primary mobile interaction since they're far easier to hit precisely than dragging a thin slider to an exact stage.
- No functionality should depend on a right-click, a keyboard shortcut, or a multi-finger gesture. Single tap and single-finger drag only.

## Stacking order for the 8 multi-stage modules' mobile builds

For modules 4, 8, 12, 15, 17, 23, 31, and 47, stack the page in exactly this order top to bottom: steps-panel, hint text, stage-strip (the row of large tap-target stage buttons), stage-detail (the diagram itself), legend, scrubber-row (the dial), **explain-panel**, then controls (Run/auto-play, Back, Next, Reset), then caption last. The explain-panel sits directly under the dial and above the buttons — not after the buttons — so the explanation of what the diagram is currently showing is the thing a user reads right after they've moved the dial, before they decide what to do next. This was a direct fix to an earlier version that put the explain-panel after the button row, which put it out of the natural reading flow.

**The Reset button gets its own accent color: `--success` (green), not the neutral `--text-muted`/`--border` styling every other secondary button uses.** Give it a dedicated `.btn-reset` class — border and text colored `var(--success)`, filling solid green with white text on `:active` — so it's visually distinct from Back/Next/Run at a glance. This applies to every multi-stage module's mobile build; desktop keeps the standard `.btn-secondary` styling for Reset unless told otherwise.

## Color theme and the light/dark toggle

Mobile uses the exact same beige light-mode / dark-beige dark-mode token values defined in `00-design-system.md`'s `:root` / `[data-theme="dark"]` CSS block (full rationale and hex table in `00-app-theme.md`) — do not invent separate mobile colors. The one mobile-specific rule: the `.theme-toggle` button (see `00-design-system.md`) moves to the top-right of the mobile `.card`, sized up slightly to a 44×44px tap target (versus desktop's 36×36px), since it's a real tap target on mobile, not just a hover-adjacent click target. Same sun/moon icon swap, same `localStorage` persistence, same `prefers-color-scheme` fallback on first load — the JS is identical between desktop and mobile builds, only the button's CSS size changes.

## Motion and performance

- Keep all motion timing from `00-design-system.md` the same (150ms hovers obviously don't apply, but the 200–400ms state-change and 400–600ms reward-reveal timings carry over unchanged).
- Reduce simultaneous animated elements where a desktop module animates many things at once (e.g. module 23's 5×5 heatmap, module 33's 3×3 Jacobian grid) — mobile GPUs are weaker, so prefer animating the changed cells only rather than the whole grid repainting every transition.
- Respect `prefers-reduced-motion` exactly as on desktop.

## What stays identical to desktop

- The exact hardcoded data (sentences, vectors, matrices, probabilities) — never re-derive or simplify the underlying numbers for mobile.
- The five-color semantic mapping (blue/amber/green/red/gray) and what each color means.
- The `.steps-panel`, `.explain-panel`, and `.caption` text content — same exact wording as the desktop version's module file specifies, just restyled to mobile spacing.
- The light/dark theme tokens and the toggle button's behavior (icon swap, `localStorage` persistence, OS-preference fallback) — only its on-screen size changes for mobile, per above.
- The acceptance checklist from `00-global-spec.md` still applies, checked against a 375px-wide viewport instead of the 800×500px desktop frame.
