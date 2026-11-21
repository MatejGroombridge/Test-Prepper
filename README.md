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
js/subjects/arts3367-kit.js  ARTS3367 builders and mock test, shared by both tests
js/subjects/arts3367.js    ARTS3367 Test 1 question bank, model answers, primers
js/subjects/arts3367-t2.js ARTS3367 Test 2 question bank, model answers, primers
js/subjects/comp2511-mcq.js      COMP2511 multiple-choice bank (load first of the four)
js/subjects/comp2511-written.js  COMP2511 short answers, architecture answers, sequence diagrams
js/subjects/comp2511-code.js     COMP2511 domain models, refactoring and build-from-scratch problems
js/subjects/comp2511-practice.js COMP2511 course practice questions and Week 10 tutorial (MCQ, short, architecture)
js/subjects/comp2511-labs.js     COMP2511 course exercises: TMS, Airline, Shopping, Barbie, Engineering, Gardening, Shipping, Business rules
js/subjects/comp2511.js    COMP2511 primers, templates, mock exam, drills, reference
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
- **54 hard multiple-choice questions**, six or so per topic, that test understanding
  rather than definitions: applying a view to a new case (a hydraulic Martian, a pigeon
  trained on scarlet only), finding the premise an argument needs, telling apart
  objections that attack a claim from ones that attack its motivation, comparing
  thinkers, and two-statement “I / II / both / neither” questions.
- **32 extended-response questions**: the 10 from the sample handout, word for word
  (flagged in the question), and 22 more written to the same pattern. Each has a
  dot-point model answer laid out as an essay plan, and a checklist of what a marker
  looks for. The handout asks for prose, not bullet points: the dot points are for
  learning and planning.
- **Format chips** filter practice to core multiple choice, hard multiple choice or
  extended response.
- **Topic primer** (`g`) on every question: summary, key claims, the argument step by
  step, and common confusions.
- **Mock test** in the real test’s shape: Section A (10 MCQs, one from every topic plus
  one extra, about 60% of them from the hard bank) and Section B (choose one of three essay prompts, with a live word count).
  After you submit, you self-assess the essay and the score updates. The essay counts
  10 marks here; that weighting is a guess, as is the default 45-minute limit.
- **Reference drawer** fills the gaps in the notes (why “lightning is electrical
  discharge” is misleading, Descartes on the cat, the missed Week 2) and sets out how
  the essay is marked.

### Test 2

A separate entry in the subject picker (**ARTS3367 · Philosophy of Mind — Test 2**),
with its own progress, in the same shape as Test 1: **105 core and 54 hard
multiple-choice questions** and **32 extended-response questions** (the 6 from the
Test 2 sample handout, word for word, plus 26 more), across nine topics:

- Consciousness: Nagel’s bat; Jackson’s knowledge argument and epiphenomenal qualia;
  Levine’s explanatory gap and the three responses (dualism, illusionism,
  bridge-building materialism); Strawson’s realistic physicalism and panpsychism;
  Godfrey-Smith on life, nervous systems and Chalmers’ neuron replacement.
- Personal identity: identity, Leibniz’s two principles and Locke’s memory theory
  (circularity, quasi-memory); Olson’s animalism; Dennett’s centre of narrative
  gravity and Ismael’s reply; Parfit on fission and what matters.

The readings were inferred from the notes and the handout. The reference drawer flags
where the notes and the readings differ (Chalmers’ replacement argument concludes
that experience is *preserved*) and fills small gaps (Eddington, Reid’s brave officer,
the prince and the cobbler). Both tests build their questions with `arts3367-kit.js`.

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


## COMP2511 Object-Oriented Design & Programming — final exam

Built from the 26T3 exam outline, the sample exam, the course schedule (weeks 1–10),
the course’s practice questions and the Week 10 tutorial.
The **mock exam** follows the real paper’s shape: 3 hours, 100 marks.

| Section | Marks | What the mock gives you |
|---|---|---|
| 1 Multiple choice | 8 | 8 questions from different topics, always including architecture |
| 2 Short answer | 22 | 4–8 questions whose marks add up to exactly 22 |
| 3 Design & programming | 40 | a domain model (10) and two programming problems worth 30 together: usually a refactor (15) and a build (15), sometimes Barbie (10) with Gardening (20) |
| 4 Software architecture | 30 | up to 5 architecture questions (20) and a Mermaid sequence diagram (10) |

The banks:

- **153 multiple-choice** across 11 topics: OO and polymorphism (overloading vs
  overriding, static and field hiding, equals/hashCode), design by contract and LSP,
  SOLID and the Law of Demeter, exceptions/generics/JUnit, functional interfaces and
  streams, code smells, the six patterns in the course (Strategy, Composite, Observer,
  Decorator, Factory, Singleton), concurrency, domain modelling, architecture
  characteristics/ADRs/C4/Mermaid, and the five architectural styles.
- **48 short answers** in the Section 2 style: "is this valid inheritance?", "what does
  this print?", identify two smells and fix them, pick a pattern and map its roles.
- **7 domain models** (airline, music streaming, hospital, library, gym, TMS, airline
  schedules), each with a provided controller and a sample model with relationship and
  cardinality comments.
- **9 refactoring problems**: five of ours (Decorator, Observer, Strategy, Composite,
  Abstract Factory) with starter code and tests, plus the course’s Shopping refactor
  (Strategy), Barbie (Decorator), Engineering (four named smells) and Gardening (LSP,
  Law of Demeter, Factory).
- **6 build-from-scratch problems** with tests, in three parts like the sample exam’s
  VSLite question, including the course’s Shipping discounts (Decorator) and Business
  rules (Composite + JSON factory).
- **24 architecture questions** and **9 Mermaid sequence diagrams** with sample
  diagrams and a marker’s checklist.

Questions taken from the course show a **Source** line (sample exam, course practice
questions, Week 10 tutorial, course exercises); unmarked ones are ours. The course
publishes no model answers for its short-answer practice questions or exercises, so
those sample answers are ours. The course exercises come with starter code we did not
have: the code in those questions is **reconstructed** to fit the spec and says so, so
it will differ from the original. The GitLab class-diagram MCQ is rewritten with the
multiplicities in text, and Week 10 G3 is answered “monolithic”, which is our reading.

Code, diagrams and written answers are self-assessed against the sample answer and a
checklist. Every question type has a **topic primer** (`g`) with the method, a worked
example and where marks are lost. Five drill sets (pattern cues, smells → fixes,
principles, Java and functional types, architecture) and a reference drawer with a
Mermaid syntax sheet complete it. The banks are new questions in the sample exam’s
style; two deliberately build on sample-exam scenarios with a twist (the library
sequence diagram adds a reservation queue, and the e-commerce scaling question asks you
to evaluate a migration plan).

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
