# MATH2859 practice

Offline practice site built from the three past test papers. Open `index.html` in a
browser — no server, no install, no internet.

## What it does

Ten question templates cover every question type in the three papers:

| Template | From |
|---|---|
| Simple linear regression: fit, intervals, inference | Test 1 Q1, Test 3 Q1 |
| Regression with a one-sided test and a rejection rule | Test 2 Q4 |
| Proportions: z-test, sample size, power, exact binomial p | Test 1 Q2 |
| One-way ANOVA from raw data | Test 1 Q3, Test 3 Q4 |
| Completing an ANOVA table + Bonferroni | Test 2 Q1 |
| Sums of normal random variables (independent and correlated) | Test 2 Q2 Part I |
| Two-sample t: CI, test, CI↔test logic | Test 2 Q2 Part II, Test 3 Q3 |
| CLT and the sampling distribution of X̄ | Test 2 Q3 |
| Binomial: exact, normal approximation, sums | Test 3 Q2 |
| One-sample CI and one-sided t test | Test 3 Q3 |
| Paired samples: analysing the differences | lecture notes (decision tree) |
| Rejection region and power for a one-sample z test | lecture notes (worked example) |
| Reading MATLAB regression output | lecture notes (fitlm panel) |
| Choosing the appropriate procedure | lecture notes (decision tree) |

Every question **regenerates with new data** each time, so a type can be repeated
until it is automatic. Answers are computed from the generated data by a built-in
statistics engine, so marking is exact.

## Friction reducers

- **Instant marking** with sensible tolerance — a correctly-rounded answer always passes.
- **Named mistake diagnosis.** Wrong answers that match a known error are called out
  by name: two-sided p-value where a one-sided is wanted, CI where a PI is wanted,
  `n−1` instead of `n−2` df, SDs added instead of variances, forgetting to round a
  sample size up, `binocdf(k,…)` instead of `binocdf(k-1,…)`.
- **Multiple choice for MATLAB commands** and for hypotheses/conclusions — no typing.
- **Select-all-that-apply** for "state the assumptions" instead of writing prose.
- **Copy buttons** for the data in MATLAB or Python form.
- **Inline plots** — the scatterplots and boxplots the written parts ask you to
  interpret are drawn from the same data, so you can practise the interpretation
  without switching to MATLAB just to see the shape.
- **Expression input.** Type `2*(1-0.9987)` instead of computing it first.
- **Hint ladder**: hint → show answer → full worked solution with runnable code.
- **Written parts** are self-assessed against a model answer plus a checklist of the
  points that earn marks.
- **Mock test mode**: timed, feedback hidden until submit, then a marked report.
- **Rapid drill**: flashcards for the commands and definitions.
- **Progress tracking** ranks your weakest topics. Revealing an answer you never
  attempted does *not* count against you.

Keyboard: `Enter` check · `1`–`5` choose · `n` next question · `?` command reference ·
`space` flip a drill card.

## Layout

```
index.html                 page shell
css/style.css              styling (light and dark)
js/stats.js                distributions and inference engine (verified against scipy)
js/subjects.js             subject registry — load before any subject module
js/finite.js               number theory / finite field engine (verified vs sympy)
js/subjects/math2859.js    MATH2859 templates, drills and reference
js/subjects/math2400.js    MATH2400 templates, drills and reference
js/subjects/comp3311.js    COMP3311 templates, sample answers and reference
js/subjects/arts3367.js    ARTS3367 question bank, model answers, primers and mock test
js/subjects/_template.js   annotated starting point for a new subject (not loaded)
js/app.js                  UI, marking, progress — subject-agnostic
```

## ARTS3367 Philosophy of Mind and Psychology

For In-class Test 1 (20%): ten multiple-choice questions, then one mini-essay of up
to 500 words chosen from three, on weeks 1–4. Built from lecture notes, the Week 2
readings (Putnam, “The Nature of Mental States”; Searle on the Chinese Room) and the
sample-question handout.

- **105 multiple-choice questions** across nine topics: Descartes and dualism,
  behaviourism, Smart’s identity theory, functionalism, the Chinese Room, Davidson’s
  anomalous monism, supervenience and emergence, Kim’s causal exclusion argument, and
  Yablo on proportionality. Each answer comes with an explanation that names the trap
  in the most tempting wrong option. Option lengths are balanced, so the longest
  answer is not a giveaway.
- **32 extended-response questions**: the 10 from the sample handout, word for word
  (flagged in the question), and 22 more written to the same pattern. Each has a
  dot-point model answer laid out as an essay plan, and a checklist of what a marker
  looks for. The handout asks for prose, not bullet points: the dot points are for
  learning and planning.
- **Format chips** filter practice to just multiple choice or just extended response.
- **Topic primer** (`g`) on every question: summary, key claims, the argument step by
  step, and common confusions.
- **Mock test** in the real test’s shape: Section A (10 MCQs, one from every topic plus
  one extra) and Section B (choose one of three essay prompts, with a live word count).
  After you submit, you self-assess the essay and the score updates. The essay counts
  10 marks here; that weighting is a guess, as is the default 45-minute limit.
- **Reference drawer** fills the gaps in the notes (why “lightning is electrical
  discharge” is misleading, Descartes on the cat, the missed Week 2) and sets out how
  the essay is marked.

In any subject’s mock test, a written or code answer you attempted is now handed back
for self-assessment after you submit, not marked wrong automatically. Blank answers
still score zero.

## COMP3311 Database Systems

Built from the 20T3, 21T3, 22T3 and 23T1 papers, on the **Classes database**
(Students, Rooms, Classes, Facilities, Has, Attends). 16 question types covering
every question type that appears across the four papers:

SQL joins/filtering, grouping, subqueries and division; set operations and NULL
semantics; PL/pgSQL functions
(setof, parameterised, returns text, and `language sql`); writing triggers and
tracing given ones; psycopg2 scripts and psycopg2 code analysis; ER to schema in
both the ER mapping and single-table mapping; FDs and BCNF plus the step-by-step
decomposition algorithm; relational algebra both written and evaluated (including
division); serializability, two-phase locking, and ACID/isolation levels; DDL and
referential integrity; and performance concepts including index choice and query tuning.

21 question types, ~800 distinct questions.

Code is **not** auto-marked. Code boxes open prefilled with the right skeleton;
you then reveal the sample answer or press **Copy for AI hint** (keyboard `c`),
which puts the question, the schema, and what you have typed on the clipboard.


## Adding a subject

1. Copy `js/subjects/_template.js` to `js/subjects/<id>.js`.
2. Add `<script src="js/subjects/<id>.js"></script>` to `index.html`, after
   `subjects.js` and before `app.js`.
3. Fill in the templates.

Everything else builds itself from the registration: the header picker appears
once a second subject exists, and the topic filter, mock test, drill sets,
reference drawer and progress tracking all follow the active subject. Progress is
stored per subject (`practice-progress-v2:<id>`), so scores never mix.

Question parts can be `numeric`, `interval`, `choice`, `multi` or `written`;
`traps` attach a named diagnosis to a specific wrong value, which is what makes
the feedback useful rather than just "incorrect".

## MATH2400 Finite Mathematics

Built from the 2017–2022 papers plus the official short answers. 13 question types:

| Question type | Seen in |
|---|---|
| Euclidean algorithm, gcd and divisibility proofs | every paper |
| Writing numbers in another base | every paper |
| Periodic base expansion as a rational | 2018–2022 |
| Continued fraction expansions | every paper |
| Linear Diophantine equations | 2017, 2018, 2020, 2022 |
| Systems of simultaneous congruences | 2018–2022 |
| Euler φ, element orders, existence of finite fields | 2017, 2019–2022 |
| RSA: modulus, exponents, decryption | every paper |
| Primitive roots and the order test | 2017–2020, 2022 |
| The (7,4) Hamming code | every paper |
| Division and gcd of polynomials over Z_p | 2018–2020 |
| Testing irreducibility (roots, Eisenstein) | 2017, 2021, 2022 |
| Arithmetic in a finite field | every paper |

Every question type has a **"How to do this"** toggle (keyboard `g`) containing a
plain-English statement of the idea, the method as numbered steps, a fully worked
example using real past-paper numbers, and the specific ways marks get lost. It is
hidden during a mock test, for the same reason hints are.

`js/finite.js` is the engine: exact integer and rational arithmetic, base expansions,
continued fractions, polynomials over Z_p, finite fields and Hamming codes. It was
verified by reproducing the official short answers from all seven papers, then
cross-checked against sympy on 525 generated questions.

Answers that are not plain numbers — polynomials, fractions, code words, continued
fractions, digit strings — use the `text` part kind. Any reasonable notation is
accepted: `x^2+x+1`, `1 + x + x²`, `a**2+a+1` and `α²+α+1` all mark the same.

## Added from the lecture notes

Four topics appeared in the notes but in none of the three papers, and all four look examinable:

- **Paired data.** The decision tree flags it explicitly ("Paired data? Analyse differences").
  The question drills the trap of using `ttest2` on paired data, and the df of n−1 rather than
  n₁+n₂−2. Data is generated so the pairing genuinely matters.
- **Power and the rejection region for a one-sample z test of a mean** (σ known). A full worked
  example in the notes, and Test 1 Q2(c) already proves power is examinable — but only for a
  proportion, which the bank already had.
- **Reading a `fitlm` output panel.** Test 2 Q1 gives you partial ANOVA output; this is the
  regression counterpart. All answers are derived from the *printed, rounded* values, so reading
  the table correctly gives the marked answer.
- **Choosing the right procedure**, straight from the lecture decision tree. Test 2 Q2(b)(ii)
  asked exactly this.

Smaller points from the notes became drill cards rather than questions: the nπ₀(1−π₀) > 5
validity condition, the relative importance of the four regression assumptions (the CLT protects
normality, nothing else), `multcompare`/LSD, `grpstats`, `crosstab`, and F = t² in simple regression.

## A caveat worth knowing

The strength-of-evidence wording follows the convention in these papers
(p < 0.01 strong; 0.01–0.1 some/moderate; ≥ 0.1 weak or none). If your lecturer
uses different cut-offs, that is the one thing here to adjust.

Progress is stored in this browser's local storage only.
