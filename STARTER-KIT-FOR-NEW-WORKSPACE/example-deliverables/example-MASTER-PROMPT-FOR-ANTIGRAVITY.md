# Master Prompt — Build All 6 Deep-Dive Modules + Home Page Autonomously (Antigravity)

## Folder to give Antigravity

Point it at this folder specifically:

```
D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\
```

Every path this task needs is spelled out explicitly below — it should never need to guess one:

- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\00-global-spec.md`
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\00-design-system.md`
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\00-mobile-design-system.md`
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\00-app-theme.md`
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\00-home-page.md`
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\module-74-trend-extraction.md` through `module-79-lda-deep-dive.md` (6 files)
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\README.md` — this folder's own README (Antigravity updates this one, and only this one)
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\prototypes\module-53-decision-tree\` (+ its `mobile\` subfolder) — one level up, a finished, working, already-approved multi-stage module from the sibling extension set. This is the exact pattern module 78 (this set's own multi-stage module) must follow — read it fully before building module 78.
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\prototypes\module-47-rag-pipeline\` (+ mobile) — two levels up, in the original course, read-only reference for the multi-stage scrubber pattern in its original form.
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\prototypes\module-30-temperature\` (+ mobile) — two levels up, read-only reference for a simple single-view module.

## Hard constraints — read all three before anything else

**1. Isolation — nothing outside `diagrams\deep-dive-modules\` may be created, modified, moved, or deleted, for any reason, at any point in this run.** Treat every file in `diagrams\` (the original 50 modules, its `00-*.md` docs, its `prototypes\`, its `build\`, its `README.md`, its master prompts) AND every file in `diagrams\extension-modules\` (its 23 module specs, its shared docs, its `prototypes\`, its `README.md`, its own master prompt, and any `build\` it may have) as strictly read-only reference material. All output goes inside `diagrams\deep-dive-modules\build\`.

**2. README — only one file gets updated, and only one section of it.** Do not touch `diagrams\deep-dive-modules\README.md`'s existing content above the "## Build log" heading — only ever append/update the "Build log" section at the bottom of that same file with your progress. Never create a new README anywhere else, and never modify `diagrams\README.md` (the original course's README) or `diagrams\extension-modules\README.md` (the extension set's README) under any circumstances. If you need to keep track of anything else as you go — decisions made, issues hit, notes to yourself — keep it inside this same `README.md`'s Build log section rather than creating a separate tracking file.

**3. Single agent, no parallelization.** Do this entire task yourself, sequentially, in one continuous run. Do not spawn sub-agents, parallel agents, background workers, or split this work across multiple simultaneous threads/processes — no multi-agent orchestration of any kind, even if your tooling supports it. Build one module fully (desktop, then mobile, then its checklist) before starting the next.

## Before you paste this: enable full autonomy in Antigravity's settings

This prompt is written so the user pastes it once and does nothing else until it's done — 6 modules × 2 variants + a home page in one unattended pass. Before pasting, turn on Antigravity's autonomous/"Turbo"/"YOLO"-style run mode — full auto-approve for file writes and terminal commands, with permission granted for everything this run needs to do inside the folder above. The prompt itself asks for zero confirmations from the user's end; the only thing the user needs to configure beforehand is that autonomy setting.

## The prompt to paste

```
You have access to the folder D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\. It contains a 6-module build spec that goes deeper into two topics from a sibling 23-module extension set: Time Series Analysis (split into Trend Extraction, Seasonality Detection, Residual & Anomaly Detection, and Autocorrelation) and PCA/LDA (split into a PCA Deep Dive and an LDA Deep Dive). These 6 modules continue the global numbering as 74 through 79 and all sit in the Advanced tier.

READ THESE THREE CONSTRAINTS FIRST, THEY OVERRIDE EVERYTHING ELSE IN THIS PROMPT:

1. ISOLATION: everything you create or modify must live inside D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\. Both diagrams\ (the original 50-module course) and diagrams\extension-modules\ (the 23-module extension set) one and two levels up are read-only reference material — open and read anything in them, never write to them, rename anything in them, or delete anything in them. All of your output goes in diagrams\deep-dive-modules\build\.

2. README: the only file you update outside of build\ is diagrams\deep-dive-modules\README.md itself, and only its "## Build log" section at the very bottom — never touch the content above that heading. If you need to track anything else (decisions, issues, notes), keep it in that same Build log section rather than creating a separate tracking file. Do not create a new README anywhere else, and do not modify D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\README.md or D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\README.md under any circumstances.

3. SINGLE AGENT ONLY: do this entire task yourself, sequentially, in one continuous run. Do not spawn sub-agents, parallel agents, background workers, or split this work across multiple simultaneous threads or processes for any part of this task. Build one module completely (desktop files, then mobile files, then its full acceptance checklist) before moving to the next module. No multi-agent orchestration of any kind, even if it's available to you.

Work through this entire task autonomously, start to finish, without stopping to ask my permission or confirmation at any point. Only stop early on a specific module if you hit a genuine spec contradiction you cannot resolve (see the "blocked" step below) — log it and move on to the next module rather than stalling the whole run. Otherwise, keep going until every module and the home page are done.

STEP 0 — Get full context before touching anything. Do these reads, in this order, and do not skip any of them:

a. Read D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\00-global-spec.md, 00-design-system.md, 00-mobile-design-system.md, and 00-app-theme.md in full. These are the shared rules for every module in this set.
b. As read-only reference, open D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\prototypes\module-53-decision-tree\index.html, style.css, script.js and its mobile\ subfolder — a real, working, already-approved implementation of a multi-stage module in this exact product family. You will use this as your direct template when you build module 78 (the one multi-stage module in this set): study how it structures the shared current-stage state, how script.js implements real algorithms against fixed data rather than fabricating output numbers, how the legend re-renders per stage, how the theme toggle is wired, and how the mobile version reorders the same content.
c. As secondary, read-only reference, open D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\prototypes\module-47-rag-pipeline\ (+ mobile) and D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\prototypes\module-30-temperature\ (+ mobile), two levels up in the original course. Do not modify anything inside either referenced folder; only read them.
d. Check D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\build\ (it may not exist yet). For each module-74 through module-79, a module counts as fully DONE only if all of these exist: build\module-XX-slug\index.html, style.css, script.js AND build\module-XX-slug\mobile\index.html, style.css, script.js. Report to me, before doing any further building, a plain list: "Already built: [module numbers/names]" and "Still need to build: [module numbers/names]" — then proceed to build only the ones in the second list, in order.

STEP 1 — For each remaining module-XX-slug.md file, build it to the same quality bar as module-53-decision-tree:

1. Read that module's own .md file (D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\module-XX-slug.md) for its specific content: what to build, the exact hardcoded data or exact algorithm to implement, the exact interaction, the exact caption text, and its "Steps to interact" list.
2. Create D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\build\module-XX-slug\ containing exactly three files: index.html (markup and <link>/<script> tags only, no inline CSS or JS), style.css (all styling), script.js (all interaction logic). Never merge modules together, never split one module's files into more than these three.
3. Also create build\module-XX-slug\mobile\ containing its own index.html, style.css, script.js, per 00-mobile-design-system.md — single column, 375px baseline, tap instead of hover everywhere, 44×44px minimum touch targets, and for module 78 specifically, large 56×56px per-stage tap buttons instead of small dots. Same underlying hardcoded data and logic as the desktop version — only layout and interaction change.
4. Include the .steps-panel, the .explain-panel (updating on every interaction, real current values, never generic boilerplate), and the exact .caption text, revealed only after the first interaction.
5. Include the .theme-toggle light/dark button on both desktop and mobile — the exact beige/dark-beige CSS variables, sun/moon icon swap, prefers-color-scheme default, localStorage persistence. Never pure white or pure black anywhere.
6. Include a .legend under the diagram whenever the diagram uses any color or shape not already explained by a visible label, and apply the Categorical colors section whenever the module needs to visually distinguish several simultaneous same-type data items (module 78's PC1/PC2/PC3, module 79's PCA-vs-LDA axes, module 74's SMA-vs-EMA lines).
7. Module 78 is this set's one multi-stage module. Do not build a single auto-play button that runs through everything and leaves the page inert afterward. Use module-53-decision-tree's actual script.js (in diagrams\extension-modules\prototypes\) as your direct template for the shared currentStage variable, the renderStage() function, the persistently clickable stage buttons, the scrubber, the interruptible auto-play, Back/Next, and Reset. De-emphasize completed/upcoming stages by dimming the stage box's background/border opacity only (0.7–0.85) — never fade the label or body text itself. On the mobile build, stack the page in this order: diagram, legend, scrubber/dial, explain-panel, then the controls row (Run/Back/Next/Reset), then caption, with Reset styled in the dedicated green `.btn-reset` class exactly as module-53's mobile build does it.
8. Where a module's file specifies an exact algorithm (e.g. "real covariance eigen-decomposition," "real Durbin-Levinson PACF recursion," "real centered moving average") rather than pre-computed output numbers, implement that actual algorithm in script.js against the exact fixed input data given — do not fabricate plausible-looking output numbers instead of running the real computation, and do not call any live API or model.
9. Use only the exact hardcoded data given in each module's file — never invent your own numbers.
10. After finishing each module's desktop AND mobile builds, run through the full acceptance checklist in 00-global-spec.md yourself — all 18 items. If any item fails, fix it before moving to the next module.
11. Append one line to D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\README.md's "## Build log" section, at the bottom of that file, in the format "Module XX — [status: PASS/FIXED/FAILED] — [one-line note if relevant]" after every module (both variants). Do not touch anything else in that README.
12. If a module genuinely cannot be completed as specified, stop on that module, write the issue clearly into the README's Build log section, and continue to the next module rather than guessing.

STEP 2 — Build the home page, only after all 6 modules show DONE.

Read D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\deep-dive-modules\00-home-page.md in full and build build\home\index.html, style.css, script.js exactly as it specifies: a module registry array covering all 6 (title, tier, tag, slug — all "Advanced"/"AI/ML," pull these from this folder's own README.md table), a search box, a light/dark toggle for the home page's own chrome, a link back to the extension set's own homepage (a plain hyperlink only, never an iframe or shared code), and an iframe-based Preview panel (Desktop/Mobile switch) plus an "Open in new tab" fallback for every card. This home page is independent of, and must never modify, either the original course's or the extension set's own homepage. Run the acceptance checklist in 00-home-page.md yourself before calling it done, and log a final "Home page — PASS/FIXED/FAILED" line to the README's Build log.

STEP 3 — Final report.

When everything is done, give me a final summary: how many modules passed cleanly, how many needed fixes, how many are flagged as blocked and exactly which numbers, and confirmation that the home page's checklist passed. Also explicitly confirm all four of: (a) nothing outside diagrams\deep-dive-modules\ was created, modified, or deleted during this run, (b) neither diagrams\README.md nor diagrams\extension-modules\README.md was ever touched, (c) this entire run was done sequentially by you alone, with no sub-agents or parallel workers spawned at any point, and (d) module 78 follows the same shared-state multi-stage pattern as module-53-decision-tree.

Remember: work through all of this without stopping for my confirmation at any step along the way.
```

## What you'll get back

- `build\module-74-trend-extraction\` through `build\module-79-lda-deep-dive\`, each with its own desktop files plus a `mobile\` subfolder.
- `build\home\` — the connecting landing page for this 6-module set, linking back to the extension set's homepage without modifying it.
- An updated `README.md` with a filled-in "Build log" section, and nothing else in that file touched.
- The original `diagrams\` folder and `diagrams\extension-modules\` completely untouched.

## After it finishes

1. Skim the README's Build log section first — anything marked FAILED or flagged needs your eyes before you trust it.
2. Confirm nothing changed in `diagrams\` or `diagrams\extension-modules\` — check file modification times if you want to be certain.
3. Open `build\home\index.html`, click Preview on a few modules, and confirm the "back to extension set" link resolves correctly.
4. Toggle light/dark on both the home page and inside a couple of previewed modules to confirm the theme flips cleanly.
5. Spot-check module 78's mobile view to confirm the 56×56px per-stage tap buttons are present, the page order matches module 53's mobile build, and Reset is visibly green.
6. Open module 79 and confirm the PCA axis and LDA axis visibly point in different directions, and that the class-overlap readout is lower for LDA than for PCA.
