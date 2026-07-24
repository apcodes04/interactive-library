# Module 68 — Evaluation Metrics: BLEU / ROUGE / Perplexity (LLM Concept)

Build a page scoring three fixed candidate generations against a reference sentence using three different metrics, live-computed. Use vanilla CSS/JS. Follow `00-design-system.md` for colors/type/motion.

**Exact data:** reference sentence: `"The cat sat quietly on the warm mat."` Three fixed candidates:
- Candidate 1 (good): `"The cat sat quietly on the warm mat."`
- Candidate 2 (partial): `"A cat was sitting on the mat."`
- Candidate 3 (poor): `"Dogs like to run in the park."`

**Toy bigram table for perplexity** (illustrative and fixed, not a real trained model — comment this clearly in code), covering the words needed by the reference and all 3 candidates; any bigram not listed gets a fixed smoothing probability of 0.01: `P(cat|The)=0.6, P(sat|cat)=0.5, P(quietly|sat)=0.3, P(on|quietly)=0.4, P(the|on)=0.7, P(warm|the)=0.2, P(mat|warm)=0.8, P(was|A)=0.5, P(sitting|was)=0.4, P(on|sitting)=0.6, P(mat|the)=0.3, P(like|Dogs)=0.4, P(to|like)=0.5, P(run|to)=0.3, P(in|run)=0.4, P(the|in)=0.6, P(park|the)=0.2`.

**Layout:** a `.card` with the reference sentence shown at the top, a candidate toggle ("Candidate 1" / "Candidate 2" / "Candidate 3"), and three metric panels below: BLEU, ROUGE-L, Perplexity.

**Computation (live, in `script.js`, from the fixed reference/candidate text and bigram table):** BLEU via standard n-gram precision (1- to 4-gram) with brevity penalty; ROUGE-L via longest-common-subsequence recall; Perplexity via the fixed bigram table above (standard perplexity formula: exp of negative average log-probability). All three are real, deterministic computations, not hardcoded output numbers.

**Visual detail:** for BLEU/ROUGE, highlight the overlapping n-grams between reference and candidate directly in the text (`--success` background on matched spans, `--text-muted` on unmatched). For Perplexity, show a small scale from low (green, "not surprising") to high (red, "very surprising") with a marker at the candidate's computed value.

**Legend:** Matched n-gram (highlighted), Unmatched n-gram, Perplexity scale (low=good to high=bad).

**Caption:** "BLEU and ROUGE reward word overlap with the reference — perplexity instead asks how surprised a language model would be by these exact words, and the three metrics don't always agree on which candidate is 'better.'"

**Steps to interact (render as `.steps-panel`, visible on load):**
1. Click "Candidate 1," "Candidate 2," or "Candidate 3" to switch which generation is being scored.
2. Compare the BLEU, ROUGE-L, and Perplexity panels for that candidate.
3. Notice where the three metrics agree and where they disagree on quality.
