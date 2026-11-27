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

Practice is filtered with the **Topics** and **Formats** dropdowns above the question.
Keyboard shortcuts are listed at the bottom of the reference panel (`?`).

## Layout

```
index.html                 page shell
css/style.css              styling (light and dark)
js/stats.js                distributions and inference engine (verified against scipy)
js/subjects.js             subject registry — load before any subject module
js/mips.js                 mipsy-style MIPS assembler and simulator (runs COMP1521 MIPS answers)
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
js/subjects/comp2511-exam.js     COMP2511 harder exam-style set across all four sections
js/subjects/comp2511-batch2.js   COMP2511 Batch 2: a second full set for every section
js/subjects/comp2511.js    COMP2511 primers, templates, mock exam, drills, reference
js/subjects/comp1521-mips.js  COMP1521 MIPS questions: starters, sample answers, test inputs
js/subjects/comp1521-c.js     COMP1521 C questions: provided files, examples, sample answers
js/subjects/comp1521-batch2.js COMP1521 Batch 2: the 20T3, 22T2 and 22T3 finals
js/subjects/comp1521.js       COMP1521 templates, mock exam, primers, drills, reference
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
- **The Formats menu** filters practice to core multiple choice, hard multiple choice or
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

- **189 multiple-choice** across 11 topics: OO and polymorphism (overloading vs
  overriding, static and field hiding, equals/hashCode), design by contract and LSP,
  SOLID and the Law of Demeter, exceptions/generics/JUnit, functional interfaces and
  streams, code smells, the six patterns in the course (Strategy, Composite, Observer,
  Decorator, Factory, Singleton), concurrency, domain modelling, architecture
  characteristics/ADRs/C4/Mermaid, and the five architectural styles.
- **60 short answers** in the Section 2 style: "is this valid inheritance?", "what does
  this print?", identify two smells and fix them, pick a pattern and map its roles.
- **9 domain models** (airline, music streaming, hospital, library, gym, TMS, airline
  schedules, food delivery with combo menus, conference with workshop waitlists), each with a provided controller and a sample model with relationship and
  cardinality comments.
- **11 refactoring problems**: five of ours (Decorator, Observer, Strategy, Composite,
  Abstract Factory) with starter code and tests, plus the course’s Shopping refactor
  (Strategy), Barbie (Decorator), Engineering (four named smells) and Gardening (LSP,
  Law of Demeter, Factory), and two harder ones: course prerequisites (Composite) and
  loyalty tiers (Strategy, with tiers that change at runtime).
- **8 build-from-scratch problems** with tests, in three parts like the sample exam’s
  VSLite question, including the course’s Shipping discounts (Decorator) and Business
  rules (Composite + JSON factory), plus role-based access control (Composite with cycle
  rejection) and a live spreadsheet (Observer chains with a change log).
- **29 architecture questions** and **12 Mermaid sequence diagrams** with sample
  diagrams and a marker’s checklist.

Questions taken from the course show a **Source** line (sample exam, course practice
questions, Week 10 tutorial, course exercises); unmarked ones are ours. Questions marked
**harder exam-style set** aim above the sample exam: subtle dispatch and generics traces,
contracts with invariants, pattern pitfalls (cycles, re-entrant notification, identity),
concurrency bugs, design evaluation in Section 4, and Section 3 problems with a real
edge case. Their Java sample answers compile and pass their tests on JDK 21. The course
publishes no model answers for its short-answer practice questions or exercises, so
those sample answers are ours. The course exercises come with starter code we did not
have: the code in those questions is **reconstructed** to fit the spec and says so, so
it will differ from the original. The GitLab class-diagram MCQ is rewritten with the
multiplicities in text, and Week 10 G3 is answered “monolithic”, which is our reading.

Code, diagrams and written answers are self-assessed against the sample answer and a
checklist. Every question type has a **topic primer** (`g`) with the method, a worked
example and where marks are lost. Several primers also carry reference tables: the
full code-smell catalogue with fixes and the refactoring techniques, UML relationship
symbols (hollow vs filled diamonds, triangles, dashed lines), multiplicities and class
boxes, the patterns and principles at a glance, and architecture characteristics, C4
levels and an ADR template. Five drill sets (pattern cues, smells → fixes,
principles, Java and functional types, architecture) and a reference drawer with a
Mermaid syntax sheet complete it. The banks are new questions in the sample exam’s
style; two deliberately build on sample-exam scenarios with a twist (the library
sequence diagram adds a reservation queue, and the e-commerce scaling question asks you
to evaluate a migration plan).

### Batch 2

A second set of questions, written once Batch 1 was finished, in the same style and at
the same difficulty as the sample exam and Batch 1. The **Batches** menu next to Formats
picks which set practice draws from (remembered per subject), and the mock exam has a
**Questions from** select, so a full 100-mark paper can come from Batch 2 alone.
Everything above is Batch 1. Batch 2 has:

- **46 multiple-choice** across all 11 topics (overload resolution with null, private
  methods and dispatch, contracts for search and thermostats, LoD, ISP, DIP, erasure,
  lazy streams, effectively final, Observer detaching mid-notify, Singleton races,
  volatile, saga-friendly microservice data).
- **24 short answers** across the 8 Section 2 topics (Stack extends ArrayList,
  constructor chaining, a rounding thermostat, BoundedQueue contracts, Duck behaviours,
  PECS with Timestamp, JUnit tests, a smells-heavy library checkout, a broken Singleton,
  wait-in-if, CompletableFuture with a fallback).
- **9 architecture questions** and **3 Mermaid sequence diagrams** (library kiosk,
  food order with restaurant accept/reject, login with 2FA).
- **3 domain models** (cinema chain, course enrolments with nested prerequisites and
  people with two roles, car share with plans and business accounts).
- **3 refactors** (car-park pricing with Strategy, org-chart costs with Composite, chat
  message filters with Decorator) and **3 builds** (online auction with Observer,
  project planner with Composite, dungeon levels with Abstract Factory). Their Java
  sample answers compile and pass their tests on JDK 21.
## COMP1521 Computer Systems Fundamentals — final exam

Built from the 26T2 exam format (10 practical questions in 3 hours, easiest first,
marks not equal, each answer a `.c` or `.s` file, autotested with unseen tests and
hand-checked against each question's restrictions) and the 20T2 final you were given.
The **mock exam** has 10 questions in the 20T2 paper's order, one from each topic:

| Q | Topic | Language | Mock marks |
|---|---|---|---|
| 1 | Basics: read, compute, print, if/else | MIPS | 6 |
| 2 | Bitwise functions with a provided test file | C | 7 |
| 3 | Bits and conditions | MIPS | 8 |
| 4 | Loops | MIPS | 9 |
| 5 | Arguments, environment, `stat` | C | 10 |
| 6 | Files and bytes (`fgetc`, `fseek`, binary data) | C | 10 |
| 7 | Arrays, strings, 2D arrays | MIPS | 11 |
| 8 | UTF-8, IEEE 754 floats, two's complement | C | 12 |
| 9 | Functions, the calling convention, recursion | MIPS | 13 |
| 10 | Directory trees, `posix_spawn` + pipes, pthreads | C | 14 |

The real paper's marks per question are not published; the mock weights later
questions more, totalling 100.

**60 questions**: 29 MIPS and 31 C, including all nine 20T2 questions (marked
**Source: 20T2 final**, also available on their own as the *20T2 past paper* topic).

**MIPS answers run in the browser.** `js/mips.js` is a small mipsy-style assembler and
simulator: the syscalls the course uses (1, 4, 5, 8, 9, 10, 11, 12), the pseudo-
instructions (`li`, `la`, `blt`, three-operand `mul`/`div`/`rem`, immediates as third
operands, and the stack helpers `begin`, `end`, `push`, `pop` that the sample answers use), constants (`N = 10`, `.space 4 * N`), and mipsy's errors: using an
uninitialised register or memory, overflow in `add`/`addi`/`sub`, unaligned accesses,
falling off the end of `main`. Each MIPS question has **Run** (your own input),
**Run autotests** (the examples, like `1521 autotest`) and **Mark it** (the examples
plus unseen tests; you score the fraction passed). In the mock, autotests work during
the test and everything is marked on submit. It is a close approximation of mipsy, not
mipsy itself, so check final answers on CSE.

**C answers are self-assessed.** The app can't compile C: write it, build it with `dcc`
on CSE, test it, then compare with the sample answer and the marker's checklist
(restrictions such as "no `/`, `*` or `%`" or "must use `fseek`").

Every question has a C reference or the exact provided files, an examples transcript in
the exam's format, restrictions, a sample answer and notes on the trap it tests.
Each topic has a **primer** (method, worked example, where marks are lost) with the
syscall, register, permission-bit, `fseek`, UTF-8 and IEEE 754 tables. Four drill sets
(MIPS, bits and representation, C files and system calls, UTF-8 and floats) and a
reference drawer complete it.

How the answers were checked: every MIPS sample answer passes all its tests (216 in
total) in the simulator, against expected output computed independently in JavaScript
from the C program. Every MIPS starter fails them. The C sample answers could not be
compiled here (no C compiler on this machine). Their bit-level logic (parity, byte and
bit reversal, rotation, sign extension, two's complement, UTF-8 encode, decode, count
and reverse) was ported line by line to Python and matched against independent
references on thousands of random inputs. The float examples were checked against
Python's `struct`.

### Batch 2: the 20T3, 22T2 and 22T3 finals

Thirty more questions, every question from three past finals: 20T3 (Q1–Q7 and Q9–Q11;
the paper itself drops Q8 as no longer in the course), 22T2 (Q1–Q10) and 22T3
(Q1–Q10). Choose them with the **Batches** menu, next to Formats; the mock exam's
**Questions from** select can build a full 10-question paper from Batch 2 alone. Each
paper is also its own topic (*20T3 past paper*, *22T2 past paper*, *22T3 past paper*),
in question order and with the paper's own marks.

- **12 MIPS**, all runnable with autotests and unseen tests: the warm-ups, the bit
  counters, a low/high loop, a 2D-array reflect and quicksort with VLAs on the stack,
  the Towers of Hanoi (assembled with a provided `main.s`, as `1521 mipsy main.s
  answer.s`), a recursive-descent boolean parser, and the arbitrary-precision `+`/`*`
  calculator.
- **18 C**: bitwise functions, environment variables, file bytes, `posix_spawnp` per
  input line, comparing directory trees, `find` with depth limits, a quota watcher
  with one thread per file, the `rush` shell, deleting a line, UTF-8 slicing and
  repair, and splitting a file across five threads.

Question text, examples and restrictions are the papers'. The papers did not include
their starter files, test harnesses or example data, so those are **reconstructed** to
fit, and each such question says so. 22T2 Q8's `main` reads the number of disks so it
can be tested at several sizes, and 22T3 Q9's example files are regenerated: evaluating
them reproduces the paper's counts (288, 32, 62) exactly.

How Batch 2 was checked: every MIPS sample answer passes all its tests in the
simulator, and each JavaScript reference agrees with the paper's C program compiled
with gcc on every test input. Every C sample answer was compiled with gcc and run on
the paper's examples, which it reproduces exactly (including 22T2 Q7's directory
listings and 22T3 Q7's invalid-UTF-8 line). The quota watcher was also replayed
through the paper's two-terminal scenario under ThreadSanitizer with no races
reported.

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
