# Master Prompt — Build All 23 Extension Modules + Home Page Autonomously (Antigravity)

## Folder to give Antigravity

Point it at this folder specifically, not the parent `diagrams\` folder:

```
D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\
```

Everything it needs already lives here or one level up, and every path is spelled out explicitly in the prompt below — it should never need to guess a path:

- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\00-global-spec.md`
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\00-design-system.md`
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\00-mobile-design-system.md`
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\00-app-theme.md`
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\00-home-page.md`
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\module-51-linear-regression.md` through `module-73-vector-db-ann-search.md` (23 files)
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\README.md` — this folder's own README (Antigravity updates this one, and only this one)
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\prototypes\module-53-decision-tree\` (+ its `mobile\` subfolder) — a finished, working, already-approved prototype built inside this same folder. **This is the exact quality bar and exact pattern every other module in this set must match** — read it fully before building anything else.
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\prototypes\module-47-rag-pipeline\` (+ mobile) — one level up, in the original course, read-only reference for the multi-stage scrubber pattern in its original form.
- `D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\prototypes\module-30-temperature\` (+ mobile) — one level up, read-only reference for a simple single-view module.

## Hard constraints — read all three before anything else

**1. Isolation — nothing outside `diagrams\extension-modules\` may be created, modified, moved, or deleted, for any reason, at any point in this run.** Treat every file one level up in `diagrams\` (the original 50 module `.md` files, `00-*.md` docs, `prototypes\`, `build\`, `README.md`, `CLAUDE.md`, the other `MASTER-PROMPT-*.md` files) as strictly read-only reference material. All output goes inside `diagrams\extension-modules\build\`.

**2. README — only one file gets updated, and only one section of it.** Do not touch `diagrams\extension-modules\README.md`'s existing content above the "## Build log" heading — only ever append/update the "Build log" section at the bottom of that same file with your progress. Never create a new README anywhere else, and never modify the original course's `diagrams\README.md` (the "Claude" README) under any circumstances.

**3. Single agent, no parallelization.** Do this entire task yourself, sequentially, in one continuous run. Do not spawn sub-agents, parallel agents, background workers, or split this work across multiple simultaneous threads/processes — no multi-agent orchestration of any kind, even if your tooling supports it. Build one module fully (desktop, then mobile, then its checklist) before starting the next. This keeps the shared design system consistent module to module and keeps the single build log coherent — parallel agents building different modules simultaneously is exactly what would break both of those things.

## Before you paste this: enable full autonomy in Antigravity's settings

This prompt is written so the user pastes it once and does nothing else until it's done — 23 modules × 2 variants + a home page in one unattended pass. Before pasting, turn on Antigravity's autonomous/"Turbo"/"YOLO"-style run mode — full auto-approve for file writes and terminal commands, with permission granted for everything this run needs to do inside the folder above. If Antigravity has a per-session permission setting, grant it "allow all" for this session so it never has to stop and ask. The prompt itself asks for zero confirmations from the user's end; the only thing the user needs to configure beforehand is that autonomy setting.

## The prompt to paste

```
You have access to the folder D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\. It contains a 23-part interactive diagram build spec — classical ML concepts plus advanced LLM production topics — extending an existing 50-module course, plus a final home page that connects all 23. One module (53, Decision Tree) already has a finished, working prototype built inside this same folder, at prototypes\module-53-decision-tree\ — that prototype is your primary reference for what "done" looks like.

READ THESE THREE CONSTRAINTS FIRST, THEY OVERRIDE EVERYTHING ELSE IN THIS PROMPT:

1. ISOLATION: everything you create or modify must live inside D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\. The parent diagrams\ folder one level up (the original 50 modules, its 00-*.md docs, its prototypes\, its build\, its README.md, its other master prompts) is read-only reference material for you — open and read it, never write to it, rename anything in it, or delete anything in it. All of your output goes in diagrams\extension-modules\build\.

2. README: the only file you update outside of build\ is diagrams\extension-modules\README.md itself, and only its "## Build log" section at the very bottom — never touch the content above that heading. Do not create a new README anywhere else and do not modify D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\README.md (the original course's README) under any circumstances.

3. SINGLE AGENT ONLY: do this entire task yourself, sequentially, in one continuous run. Do not spawn sub-agents, parallel agents, background workers, or split this work across multiple simultaneous threads or processes for any part of this task. Build one module completely (desktop files, then mobile files, then its full acceptance checklist) before moving to the next module. No multi-agent orchestration of any kind, even if it's available to you.

Work through this entire task autonomously, start to finish, without stopping to ask my permission or confirmation at any point. Only stop early on a specific module if you hit a genuine spec contradiction you cannot resolve (see the "blocked" step below) — log it and move on to the next module rather than stalling the whole run. Otherwise, keep going until every module and the home page are done.

STEP 0 — Get full context before touching anything. Do these reads, in this order, and do not skip any of them:

a. Read D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\00-global-spec.md, 00-design-system.md, 00-mobile-design-system.md, and 00-app-theme.md in full. These are the shared rules for every module in this set.
b. Read D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\module-53-decision-tree.md (the spec) side by side with the actual finished files at D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\prototypes\module-53-decision-tree\index.html, style.css, script.js and its mobile\ subfolder. This is a real, working, already-approved implementation of one of this set's own multi-stage modules — study exactly how it structures its HTML, how script.js implements a real algorithm (Gini-impurity split search) against fixed seeded data rather than fabricating output numbers, how the legend re-renders per stage, how the theme toggle is wired, and how the mobile version reorders the same content. Every module you build should read like it came from the same hand that built this one.
c. As secondary, read-only reference, open D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\prototypes\module-47-rag-pipeline\ (+ mobile) and D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\prototypes\module-30-temperature\ (+ mobile), one level up in the original course — these established the multi-stage and simple-module patterns originally. Do not modify anything inside that folder; only read it.
d. Check D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\build\ (it may not exist yet). For each module-51 through module-73, a module counts as fully DONE only if all of these exist: build\module-XX-slug\index.html, style.css, script.js AND build\module-XX-slug\mobile\index.html, style.css, script.js. Module 53 is a special case: its finished prototype already exists at prototypes\module-53-decision-tree\ — if build\module-53-decision-tree\ does not exist yet, copy that already-finished prototype (both the desktop files and the mobile\ subfolder) into build\module-53-decision-tree\ as-is rather than regenerating it from scratch, since it already passes the full acceptance checklist. Report to me, before doing any further building, a plain list: "Already built: [module numbers/names]" and "Still need to build: [module numbers/names]" — then proceed to build only the ones in the second list, in order.

STEP 1 — For each remaining module-XX-slug.md file, build it exactly the way module-53-decision-tree.md was built into its prototype:

1. Read that module's own .md file (D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\module-XX-slug.md) for its specific content: what to build, the exact hardcoded data or exact algorithm to implement, the exact interaction, the exact caption text, and its "Steps to interact" list.
2. Create D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\build\module-XX-slug\ containing exactly three files: index.html (markup and <link>/<script> tags only, no inline CSS or JS), style.css (all styling), script.js (all interaction logic). Never merge modules together, never split one module's files into more than these three.
3. Also create build\module-XX-slug\mobile\ containing its own index.html, style.css, script.js, per 00-mobile-design-system.md — single column, 375px baseline, tap instead of hover everywhere, 44×44px minimum touch targets, and for the 7 multi-stage modules large 56×56px per-stage tap buttons instead of small dots. Same underlying hardcoded data and logic as the desktop version — only layout and interaction change.
4. Include the .steps-panel, the .explain-panel (updating on every interaction, real current values, never generic boilerplate), and the exact .caption text, revealed only after the first interaction — exactly like the module-53 prototype does.
5. Include the .theme-toggle light/dark button on both desktop and mobile — the exact beige/dark-beige CSS variables, sun/moon icon swap, prefers-color-scheme default, localStorage persistence. Never pure white or pure black anywhere. Copy the theme-toggle implementation pattern directly from the module-53 prototype's script.js.
6. Include a .legend under the diagram whenever the diagram uses any color or shape not already explained by a visible label, and apply the Categorical colors section whenever the module needs to visually distinguish several simultaneous same-type data items. Copy the dynamic per-stage legend pattern (LEGEND_ITEMS object + stageLegend lookup array + renderLegend function) directly from the module-53 prototype for any of the 7 multi-stage modules.
7. Modules 55, 61, 64, 66, 72, and 73 (module 53 is already done) are the remaining multi-stage modules. For each: do not build a single auto-play button that runs through everything and leaves the page inert afterward. Use module-53-decision-tree's actual script.js as your direct template for the shared currentStage variable, the renderStage() function, the persistently clickable stage buttons, the scrubber, the interruptible auto-play, Back/Next, and Reset. De-emphasize completed/upcoming stages by dimming the stage box's background/border opacity only (0.7–0.85) — never fade the label or body text itself. On the mobile build, stack the page in this order: diagram, legend, scrubber/dial, explain-panel, then the controls row (Run/Back/Next/Reset), then caption, with Reset styled in the dedicated green `.btn-reset` class exactly as module-53's mobile build does it.
8. Where a module's file specifies an exact algorithm (e.g. "real Gini-impurity split search," "real Lloyd's algorithm," "real gradient descent from these fixed points") rather than pre-computed output numbers, implement that actual small algorithm in script.js against the exact fixed input data given — do not fabricate plausible-looking output numbers instead of running the real computation, and do not call any live API or model. Module 53's script.js (a real Gini-impurity search, not a fabricated tree) is the proof this is meant literally.
9. Use only the exact hardcoded data given in each module's file — never invent your own numbers.
10. After finishing each module's desktop AND mobile builds, run through the full acceptance checklist in 00-global-spec.md yourself — all 18 items. If any item fails, fix it before moving to the next module.
11. Append one line to D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\README.md's "## Build log" section, at the bottom of that file, in the format "Module XX — [status: PASS/FIXED/FAILED] — [one-line note if relevant]" after every module (both variants). Do not touch anything else in that README.
12. If a module genuinely cannot be completed as specified, stop on that module, write the issue clearly into the README's Build log section, and continue to the next module rather than guessing.

STEP 2 — Build the home page, only after all 23 modules show DONE.

Read D:\AcadByte\22-07-26\ML TOP 50 Reformatted\claude game lib\diagrams\extension-modules\00-home-page.md in full and build build\home\index.html, style.css, script.js exactly as it specifies: a module registry array covering all 23 (title, tier, tag, slug — pull these from this folder's own README.md table so they never disagree), grouped by tier, with search, tier filters, a light/dark toggle for the home page's own chrome, and an iframe-based Preview panel (Desktop/Mobile switch) plus an "Open in new tab" fallback for every card. This home page is independent of, and must never modify, the original course's own home page one level up. Run the 8-item acceptance checklist in 00-home-page.md yourself before calling it done, and log a final "Home page — PASS/FIXED/FAILED" line to the README's Build log.

STEP 3 — Final report.

When everything is done, give me a final summary: how many modules passed cleanly, how many needed fixes, how many are flagged as blocked and exactly which numbers, and confirmation that the home page's 8-item checklist passed. Also explicitly confirm all three of: (a) nothing outside diagrams\extension-modules\ was created, modified, or deleted during this run, (b) the original diagrams\README.md was never touched, and (c) this entire run was done sequentially by you alone, with no sub-agents or parallel workers spawned at any point.

Remember: work through all of this without stopping for my confirmation at any step along the way.
```

## What you'll get back

- `build\module-51-linear-regression\` through `build\module-73-vector-db-ann-search\`, each with its own desktop files plus a `mobile\` subfolder — module 53 copied straight from the already-finished prototype.
- `build\home\` — the connecting landing page for this module set specifically.
- An updated `README.md` with a filled-in "Build log" section, and nothing else in that file touched.
- The original `diagrams\` folder (the 50-module course, its README, its build, its master prompts) completely untouched.

## After it finishes

1. Skim the README's Build log section first — anything marked FAILED or flagged needs your eyes before you trust it.
2. Confirm nothing changed in the original `diagrams\` root — check file modification times on `diagrams\README.md`, `diagrams\build\`, and `diagrams\prototypes\` if you want to be certain.
3. Open `build\home\index.html` and click Preview on a handful of modules across all three tiers.
4. Spot-check that a couple of the newly built modules (not just module 53) actually feel like they came from the same hand — same theme toggle behavior, same panel structure, same legend logic.
5. Toggle light/dark on both the home page and inside a couple of previewed modules to confirm the theme flips cleanly.
6. Spot-check the mobile view on one of the newly built multi-stage modules (55, 61, 64, 66, 72, or 73) to confirm the 56×56px per-stage tap buttons are present, the page order matches module 53's mobile build, and Reset is visibly green.
