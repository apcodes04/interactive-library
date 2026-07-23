# Master Prompt — Build All 50 Modules + Home Page Autonomously (Antigravity)

## Folder to give Antigravity

Point it at the whole folder, not individual files:

```
D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\
```

That one folder already contains everything it needs: `00-global-spec.md`, `00-design-system.md`, `00-mobile-design-system.md`, `00-app-theme.md`, `00-home-page.md`, all 50 `module-01-*.md` through `module-50-*.md` files, the reference `prototypes/` folder (which includes a working `home/` page prototype), and this file. Nothing else needs to be attached separately.

## Before you paste this: enable full autonomy in Antigravity's settings

This prompt is written to run start-to-finish with zero check-ins — 50 modules × 2 variants + a home page in one unattended pass. For that to actually happen without Antigravity stopping to ask permission, turn on its autonomous/"YOLO"-style run mode (whatever your Antigravity build calls full auto-approve for file writes and terminal commands) **before** pasting the prompt below. If your version still prompts per-action even with that setting on, that's Antigravity's own safety gate, not something the prompt can override — but the prompt itself asks for zero confirmations from this end.

## The prompt to paste

```
You have access to the folder D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\. It contains a 50-part interactive diagram build spec for an ML/LLM course, plus a final home page that connects all 50.

The whole point of the shared spec files is that all 50 modules look and feel like one consistent product — same colors, same theme toggle, same panel structure, same legend behavior, same mobile layout conventions — while each module's actual interactive mechanic (what you drag, click, or scrub, and what it teaches) is unique to that module's concept. Never copy one module's specific interaction onto another; do copy every module's shared UI/UX system exactly.

Work through this entire task autonomously, start to finish, without stopping to ask my permission or confirmation at any point — not between modules, not before creating folders, not before overwriting a file you determine needs a fix. Only stop early if you hit a genuine spec contradiction you cannot resolve (see the "blocked" step below). Otherwise, keep going until every module and the home page are done.

STEP 0 — Check what already exists, before building anything.

Look inside diagrams\build\ (it may not exist yet — if so, skip to Step 1 with nothing marked existing). For each module-01 through module-50, a module counts as fully DONE only if all of these exist: build\module-XX-slug\index.html, style.css, script.js AND build\module-XX-slug\mobile\index.html, style.css, script.js. If only some of those six files exist, treat that module as NOT done and rebuild it completely (don't try to patch a partial folder). Report to me, before doing any building, a plain list: "Already built: [module numbers/names]" and "Still need to build: [module numbers/names]" — then proceed to build only the ones in the second list, in order. If build\ doesn't exist at all yet, state that clearly and proceed to build all 50 from scratch.

STEP 1 — Read the shared spec files first, in full, before touching any module.

Read 00-global-spec.md, 00-design-system.md, 00-mobile-design-system.md, and 00-app-theme.md — these are the shared rules for every single module and do not change between modules. Then open prototypes\module-30-temperature\, prototypes\module-47-rag-pipeline\, and prototypes\home\ (all with their mobile\ subfolders) as reference implementations of what a finished, correct module looks like end to end — module 47 in particular demonstrates every shared UI/UX requirement at once: the theme toggle, steps-panel, live explain-panel, caption, a dynamic per-stage legend, categorical data colors, the multi-stage scrubber pattern, and the mobile-specific stacking order with a green Reset button. Match its quality bar and its exact patterns, not just its general shape.

STEP 2 — Build each remaining module, one at a time, in order.

For each module-XX-slug.md file still in your "still need to build" list:

1. Read that module's file for its specific content: what to build, the exact hardcoded data, the exact interaction, the exact caption text, and its "Steps to interact" list.
2. Create diagrams\build\module-XX-slug\ containing exactly three files: index.html (markup and <link>/<script> tags only, no inline CSS or JS), style.css (all styling), script.js (all interaction logic). Never merge modules together, never split one module's files into more than these three, never touch the module's own .md file or anything inside prototypes\.
3. Also create diagrams\build\module-XX-slug\mobile\ containing its own index.html, style.css, script.js, per 00-mobile-design-system.md — single column, 375px baseline, tap instead of hover everywhere, 44×44px minimum touch targets, and for the 8 multi-stage modules (listed below) large 56×56px per-stage tap buttons instead of small dots. Same underlying hardcoded data and logic as the desktop version — only layout and interaction change.
4. Include the .steps-panel element (see 00-design-system.md) — a short numbered list of literal actions from the module's own file, e.g. "Step 1: Drag the Temperature slider," visible immediately on load, before the diagram, on both desktop and mobile.
5. Include the .explain-panel element that updates its text on every single interaction (not just the first) with a plain-language, specific description of what just changed and why, using the real current values — never generic or repeated boilerplate text. Give it a sensible default sentence before any interaction.
6. Include the exact .caption text specified in that module's file, revealed only after the first interaction.
7. Include the .theme-toggle light/dark button (see 00-design-system.md's toggle section and 00-app-theme.md) on both desktop and mobile — the exact beige/dark-beige CSS variables, the sun/moon icon swap, prefers-color-scheme default, localStorage persistence. Never pure white or pure black anywhere.
8. Include a .legend under the diagram, above the controls, whenever the diagram uses any color or shape not already explained by a visible label (see 00-design-system.md's Legend section). Also apply the Categorical colors section there whenever the module needs to visually distinguish several simultaneous same-type data items (e.g. multiple attention heads, multiple experts, multiple candidate tokens) — use the 6-hue categorical palette, never a hue that collides with a semantic color already active in that same view, and carry each item's assigned color consistently through every stage it appears in.
9. Modules 4, 8, 12, 15, 17, 23, 31, and 47 are multi-stage — each shows more than one sequential stage or step. For these 8 specifically:
   a. Do not build a single auto-play button that runs through everything and leaves the page inert afterward. Before building any of these 8, read the full "Multi-stage modules" section of 00-design-system.md, and use prototypes\module-47-rag-pipeline\ (desktop and mobile) as your reference implementation: one shared current-stage-index variable driving individually clickable stage buttons that stay clickable forever, a scrubber (range input) for moving forward and backward through stages at the user's own pace, and an optional auto-play button that moves that same shared state and stops immediately if the user touches the scrubber or clicks a stage directly.
   b. De-emphasize completed/upcoming stages by dimming the stage box's background/border opacity only (0.7–0.85) — never fade the label or body text itself, which must stay fully legible in every state, in both light and dark mode.
   c. Make the legend dynamic, not static: re-render its contents inside the same function that updates the explain panel, so it only ever shows the entries relevant to whichever stage is currently on screen — hide it entirely on a stage with nothing color-coded. See module 47's per-stage legend mapping in its own .md file as the exact worked example.
   d. On the mobile build only, stack the page in this order: diagram, legend, scrubber/dial, explain-panel, then the controls row (Run/Back/Next/Reset), then caption — explain-panel sits above the buttons, not below them. Give the Reset button its own `.btn-reset` class styled with the green `--success` color (border + text, filling solid on tap), visually distinct from Back/Next/Run. Desktop keeps the standard neutral `.btn-secondary` styling for Reset.
10. Use only the exact hardcoded data given in each module's file — never invent your own numbers, never call a live API or model.
11. After finishing each module's desktop AND mobile builds, run through the full acceptance checklist in 00-global-spec.md yourself — all 18 items, including the theme-toggle, legend, text-legibility, and (for the 8 multi-stage modules) mobile stacking-order/green-Reset items. If any item fails, fix it before moving to the next module — do not move on with a known failure.
12. Append one line to diagrams\build\build-log.md in the format "Module XX — [status: PASS/FIXED/FAILED] — [one-line note if relevant]" after every module (both variants).
13. If a module genuinely cannot be completed as specified (e.g. a data inconsistency you find in its .md file), stop on that module, write the issue clearly into build-log.md, and continue to the next module rather than guessing — flag it for me to resolve rather than silently improvising a fix that isn't in the spec.

STEP 3 — Build the home page, only after all 50 modules show DONE.

Once every module has both its desktop and mobile folders complete and passing, read 00-home-page.md in full and build diagrams\build\home\index.html, style.css, script.js exactly as it specifies: a module registry array covering all 50 (title, tier, tag, slug — pull these from README.md's table so they never disagree), grouped by tier, with search, tier filters, a light/dark toggle for the home page's own chrome, and an iframe-based Preview panel (with a Desktop/Mobile switch) plus an "Open in new tab" fallback for every card. Use prototypes\home\ as your reference implementation — it already demonstrates this exact pattern against the two existing prototype modules. Do not import any module's JS/CSS directly into the home page; only ever link to or iframe its index.html. Run the 8-item acceptance checklist in 00-home-page.md yourself before calling it done, and log a final "Home page — PASS/FIXED/FAILED" line to build-log.md.

STEP 4 — Final report.

When everything is done (all 50 modules, both variants each, plus the home page), give me a final summary: how many modules passed cleanly, how many needed fixes, how many are flagged as blocked and exactly which numbers, and confirmation that the home page's 8-item checklist passed.

Remember: work through all of this without stopping for my confirmation at any step along the way. I will review the finished result myself via build-log.md and by opening build\home\index.html in a browser.
```

## What you'll get back

- `diagrams\build\module-01-hyperparameter\` through `diagrams\build\module-50-diagnostic-scenario\`, each with its own desktop files plus a `mobile\` subfolder — every one openable by double-clicking `index.html`.
- `diagrams\build\home\` — the connecting landing page; open `diagrams\build\home\index.html` to browse and preview every module from one screen.
- `diagrams\build\build-log.md` — a running record of what passed, what got fixed, and what's flagged, plus the home page's result.

## After it finishes

1. Skim `build-log.md` first — anything marked FAILED or flagged needs your eyes before you trust it.
2. Open `build\home\index.html` and click Preview on a handful of modules across all three tiers — this is the fastest way to spot-check many modules without opening 50 separate files.
3. Toggle light/dark on both the home page and inside a couple of previewed modules to confirm the theme actually flips cleanly, with no pure-white/pure-black flashes.
4. Spot-check the mobile view (the Desktop/Mobile switch inside Preview) on at least one multi-stage module (e.g. module 47) to confirm the 56×56px per-stage tap buttons are actually present and usable, the page order is diagram → legend → dial → explanation → buttons, and Reset is visibly green.
5. On that same module, click through 3–4 different stages and confirm the legend's contents actually change to match what's on screen each time, rather than showing every possible entry all the time.
6. Check any module with multiple simultaneous data items (multiple attention heads, experts, candidate tokens) for genuinely distinct, consistent colors per item — not everything rendered in one flat color.
