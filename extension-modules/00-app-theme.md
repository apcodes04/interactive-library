# Acadbyte visual theme — light/dark beige design system

This is the single source of truth for color, contrast, and the light/dark toggle across **all** Acadbyte surfaces: the main course app (Library, Dashboard, flashcard review — the screen shown in the reference screenshot), the original 50 interactive diagram modules, and the 23 extension modules (51–73) in this folder. `00-design-system.md` and `00-mobile-design-system.md` both quote the same values; if anything ever drifts, this file wins.

Written for a coding AI to implement directly — treat it as if a senior product designer (15+ years, the kind of person who ships design systems other teams borrow from) handed you exact values, not vibes. The brief in one line: **warm beige, never stark white or true black; every color pair passes WCAG AA; every page gets a manual light/dark toggle, not just OS auto-detection; simple enough to disappear, polished enough to notice.**

## Why beige, why not the current near-black theme

The reference screenshot's current theme is a near-black background (`#0d0b09`-ish) with a single orange/amber accent — high contrast, but cold and a little generic ("just another dark-mode SaaS app"). Beige gives the product a warmer, more distinctive identity — closer to paper, a study notebook, a well-made document — while still supporting a genuine dark mode for low-light study sessions. Both modes must feel like the same product, just lit differently, not two different apps.

## Core palette

All hex values below were checked against WCAG AA (4.5:1 minimum for body text, 3:1 for large text/UI components) using the standard relative-luminance contrast formula. Numbers in parentheses are the contrast ratio against that mode's `--bg`.

### Light mode (default, warm beige)

| Token | Hex | Use | Contrast vs `--bg` |
|---|---|---|---|
| `--bg` | `#f5f1e6` | Page background | — |
| `--card-bg` | `#fbf8f1` | Card/panel surface (lighter than page, for lift) | — |
| `--bg-muted` | `#ede6d3` | Recessed panels, input backgrounds, steps-panel | — |
| `--border` | `#d6c9a0` | Dividers, card borders | 1.46 (visual separation, not text) |
| `--text` | `#2b2620` | Primary text (warm dark brown, not gray) | 13.28 |
| `--text-muted` | `#6b6355` | Secondary text, captions, metadata | 5.25 |
| `--primary` | `#4f46e5` | Interactive accent — links, primary buttons, active nav state | 5.57 |
| `--active` | `#9c4208` | "in progress / changing" accent (amber family, darkened for AA) | 5.82 |
| `--success` | `#0f7a52` | Correct / completed / converged | 4.74 |
| `--danger` | `#b91c1c` | Wrong / error / diverging | 5.73 |

### Dark mode ("espresso," not black — toggled via the button below, defaulting to OS preference)

| Token | Hex | Use | Contrast vs `--bg` |
|---|---|---|---|
| `--bg` | `#1e1b16` | Page background — warm dark brown, never `#000` | — |
| `--card-bg` | `#2f2a22` | Card/panel surface (lighter than page, for lift) | — |
| `--bg-muted` | `#363026` | Recessed panels, input backgrounds | — |
| `--border` | `#4a4232` | Dividers, card borders | 1.73 |
| `--text` | `#f2ead8` | Primary text (warm cream, not pure white) | 14.33 |
| `--text-muted` | `#b8ad97` | Secondary text, captions, metadata | 7.73 |
| `--primary` | `#8b85f0` | Interactive accent (lightened from light-mode indigo for dark contrast) | 5.48 |
| `--active` | `#f5a524` | "in progress / changing" accent (brighter amber reads fine on dark) | 8.41 |
| `--success` | `#34d399` | Correct / completed / converged | 8.93 |
| `--danger` | `#f87171` | Wrong / error / diverging | 6.20 |

Never use pure white text (`#ffffff`) or pure black background (`#000000`) anywhere in either mode — both read as harsh against a beige-based palette. If a third-party component (an embedded chart library, a code-syntax theme) forces pure white/black, wrap it in a container using `--card-bg` so the harsh color is contained rather than touching the page edge.

## Manual light/dark toggle — every page gets one

Auto-detecting `prefers-color-scheme` is the correct *default*, but it is not sufficient on its own — a user must be able to override it with one tap, independent of their OS setting, and that override should persist on return visits (`localStorage`, key `theme`, value `"light"` or `"dark"`).

- **Placement:** top-right of the main navigation bar for the main app (next to the existing moon icon slot already in the screenshot's nav — this replaces/wires up that icon); top-right corner of the `.card` for each standalone diagram module (see `.theme-toggle` in `00-design-system.md`).
- **Icon:** a simple sun (light mode active, tap to go dark) / moon (dark mode active, tap to go light) glyph, swapped on toggle — never a generic gear/settings icon, never both icons shown at once.
- **Mechanism:** toggle a `data-theme="light"|"dark"` attribute on `<html>`; all colors are CSS custom properties keyed off that attribute (see the `:root` / `[data-theme="dark"]` pattern in `00-design-system.md`), so the whole page repaints instantly with no flash-of-unstyled-content beyond the color values themselves.
- **First load:** read `localStorage.getItem('theme')`; if unset, fall back to `window.matchMedia('(prefers-color-scheme: dark)').matches`.
- Never make the toggle a settings-page-only option — it must be reachable in one tap from wherever the user currently is.

## Component guidance (main app — spec only, no code access yet)

These notes describe how the existing screenshot's layout should be re-skinned, for whoever implements the main app. No main-app source was available to edit directly in this session, so this is a specification, not a diff.

- **Top nav bar:** `--card-bg`, bottom border in `--border`. Logo and active nav item (`Dashboard`) in `--text`; inactive nav items in `--text-muted`; the "Review · 4" badge keeps a small `--active`-colored pill so it still reads as "needs attention" in both modes.
- **Page background:** `--bg`, never the nav bar's `--card-bg` — the two should be distinguishable at a glance, exactly like the light/dark card-vs-page split described above.
- **Breadcrumb / eyebrow text** ("Top 50 LLM Interview Questions · Level 1..."): `--text-muted`, small caps or letter-spaced, unchanged in spirit from the current design.
- **Title ("What is Machine Learning at its core?"):** `--text`, bold, largest text on the page — this should visually anchor the page in both modes.
- **Badges ("BEGINNER", "3 min"):** pill shape, `--bg-muted` background, `--text-muted` text, 1px `--border` outline — quiet by default, not competing with the title.
- **Progress bar:** track in `--bg-muted`, filled segments in `--active`; "1 of 5 done" label in `--text-muted`.
- **Tabs (Read / Question / Card):** underline style, active tab in `--text` with a `--primary` underline, inactive tabs in `--text-muted`.
- **Card ("CARD 1 OF 2" / "RECALL" / the question text):** `--card-bg` surface distinct from the page, `1px solid var(--border)`, generous padding (24–32px), the question text itself large and in `--text` for easy reading at arm's length — this is the thing being read, so it gets the most contrast and the most whitespace.
- **"Try to answer first, then reveal" hint:** `--text-muted`, small, centered, an eye icon — a quiet nudge, not a competing call to action.
- **Previous / Next controls:** ghost/secondary buttons (`--text-muted`, `--border` outline) — these are navigation, not the primary action, so they should never outrank the card content.

## Quality bar

Whoever builds against this spec — human or AI — should self-check against these before calling a page done:

1. Does every text/background pair in the page actually match one of the token pairs above, not an eyeballed close-enough color?
2. Does toggling light/dark actually flip the whole page instantly, including any charts, SVGs, or third-party widgets — not just the page chrome?
3. Would this still look intentional with the screenshot's exact content swapped in? (It should look like a genuine redesign, not a search-and-replace of one color for another.)
4. Is anything using pure white or pure black? If yes, fix it.
5. Reload the page — does it correctly remember the last-chosen theme, and does a first-ever visit correctly match the OS preference?
