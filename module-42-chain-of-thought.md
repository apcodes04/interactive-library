# Module 42 — Chain-of-Thought Prompting (Q36 — LLM Question)

Build a side-by-side typewriter reasoning demo. Use vanilla JS typewriter-style text reveal (setInterval-based, no library needed). Follow `00-design-system.md` for colors/type/motion.

**Exact data:** question — "What is 47 × 36?"
- Left box "Direct answer": types only "1,592" (wrong).
- Right box "Chain-of-thought": types "47 × 36 = 47 × 30 + 47 × 6 = 1,410 + 282 = 1,692" in full, then highlights the final "1,692" in `--success` green once complete. The left box's wrong final answer stays highlighted in `--danger` red once complete.

**Layout:** a `.card` with two side-by-side answer boxes and one "Run both" `.btn-primary` button that triggers both typewriter animations simultaneously (character reveal speed ~30ms/character).

**Caption:** "Same question, same model capability — one had room to work the problem out, the other didn't."

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Run both."
2. Watch the two answer boxes type out.
3. Compare their final answers.
