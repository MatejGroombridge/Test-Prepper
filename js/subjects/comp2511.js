/* subjects/comp2511.js — COMP2511 Object-Oriented Design & Programming,
   final exam (26T3 format). Content lives in comp2511-mcq.js, -written.js,
   -code.js, -practice.js and -labs.js (load those first); this file
   builds the templates, the mock exam in the real four-section shape, the
   drills and the reference drawer, and registers the subject.

   Exam shape: 3 hours, 100 marks.
     Section 1  multiple choice                   8
     Section 2  short answer                     22
     Section 3  design & programming             40  (domain model 10,
                                                      two problems totalling 30)
     Section 4  software architecture            30  (sequence diagram 10,
                                                      architecture answers 20) */
(function (global) {
  'use strict';

  var D = global.COMP2511Data;
  if (!D || !D.MCQ || !D.SHORT || !D.DOMAIN) throw new Error('load the comp2511 data files before comp2511.js');
  var c = D.c, pre = D.pre;

  var TOPIC_NAME = {};
  D.TOPICS.forEach(function (t) { TOPIC_NAME[t.key] = t.name; });
  TOPIC_NAME.seq = 'Sequence diagrams';

  /* ============================== primers ============================== */

  var GUIDES = {
    oo: {
      idea: 'Java decides <i>which method signature</i> at compile time from declared types, and <i>which body</i> at runtime from the object’s class. Almost every "what does this print?" question is testing that split.',
      stepsTitle: 'Answering a "what does it print?" question',
      steps: [
        'Write down the <b>declared</b> type and the <b>runtime</b> type of every variable.',
        'For each call, pick the overload using the declared types of the arguments (compile time).',
        'Then dispatch: if the runtime class overrides that exact signature, its body runs; otherwise the inherited one.',
        'Fields and static methods do not dispatch: they always use the declared type.',
        'Explain using the words <i>static type</i>, <i>dynamic type</i>, <i>overriding</i>, <i>overloading</i>, <i>dynamic dispatch</i>.'
      ],
      worked: pre(`
Animal a = new Dog();   // declared Animal, runtime Dog
a.noise();              // Dog.noise() if Dog overrides it
a.name;                 // Animal's field — fields are not polymorphic
a.kind();               // static: Animal.kind() — hidden, not overridden`) +
        '<p><b>Aggregation vs composition:</b> can the part exist without the whole, or be shared? Then aggregation. Destroyed with the whole and owned by exactly one? Composition.</p>',
      traps: [
        'Saying an overload is chosen at runtime. It is chosen at compile time from the declared argument types.',
        'Forgetting that overriding <code>equals</code> requires overriding <code>hashCode</code>.',
        'Using <code>instanceof</code> in <code>equals</code> for a class hierarchy, breaking symmetry; use <code>getClass()</code>.',
        'Returning a mutable internal list from a getter, which breaks encapsulation.'
      ]
    },
    dbc: {
      idea: 'A contract is precondition (what the client must ensure), postcondition (what the method then guarantees) and invariant (what is always true of the object between calls). A subclass is valid only if a client of the parent can never tell it was handed the child.',
      stepsTitle: 'Answering "is this valid inheritance?"',
      steps: [
        'Compare <b>preconditions</b>: the child must accept everything the parent accepts. Same or <i>weaker</i> is fine; stronger is a violation.',
        'Compare <b>postconditions</b>: the child must promise at least what the parent promises. Same or <i>stronger</i> is fine; weaker is a violation.',
        'Check <b>invariants</b>: the child must preserve every invariant of the parent.',
        'Check <b>exceptions</b>: a new checked exception is a weaker postcondition (and does not compile).',
        'Give a verdict, then a concrete client scenario that breaks (or is safe), and name LSP.'
      ],
      worked: '<p>Parent ' + c('quote(w)') + ' pre: 0 &lt; w ≤ 30, post: cost ≥ 5. Child pre: 0 &lt; w ≤ 50 (weaker ✓), post: cost ≥ 12 (stronger ✓). <b>Valid.</b></p>' +
        '<p>Parent ' + c('add(song)') + ' pre: song ≠ null. Child pre: song ≠ null and not explicit (stronger ✗). A client adding an explicit song to "a Playlist" breaks. <b>Invalid.</b></p>' +
        '<p>Sample-exam pattern: child widens the time range (weaker pre ✓) but its postcondition drops "schedule the nearest class" to "nothing happens" and adds an exception (weaker post ✗). <b>Invalid.</b></p>',
      traps: [
        'Getting the direction backwards: "weaker" precondition means accepts <i>more</i> inputs.',
        'Checking only the method and forgetting the class invariant.',
        'Giving a verdict without the client scenario that justifies it — the "conceptually justify" marks.',
        'Confusing DbC (client checks preconditions) with defensive programming (supplier checks everything).'
      ]
    },
    principles: {
      idea: 'Low coupling, high cohesion. SOLID, the Law of Demeter, composition over inheritance and DRY/KISS/YAGNI are all ways of getting there. Exam questions describe a symptom; you name the principle and the fix.',
      stepsTitle: 'Symptom → principle',
      steps: [
        '"A class does several unrelated jobs / changes for many reasons" → <b>Single Responsibility</b>.',
        '"Adding a new kind of X means editing existing code (switches)" → <b>Open-Closed</b>.',
        '"A subclass breaks expectations / throws UnsupportedOperation" → <b>Liskov Substitution</b>.',
        '"Implementers forced to stub out methods they do not need" → <b>Interface Segregation</b>.',
        '"High-level class constructs a concrete low-level class" → <b>Dependency Inversion</b> (depend on an interface; inject it).',
        '"a.getB().getC().doThing()" → <b>Law of Demeter</b> (tell, don’t ask).'
      ],
      worked: '<p>Coupling vs cohesion with a scenario (a common 4-mark question): define both, classify the code (e.g. high coupling, low cohesion), then tie it to the scenario’s people: developers who only know their own area won’t see the ripple effects; frequently changing requirements multiply them; many people editing one class causes conflicts.</p>',
      traps: [
        'Naming the principle but not explaining the consequence in the given scenario.',
        'Confusing coupling (between modules) with cohesion (within a module).',
        'Fixing DIP by adding an interface but still constructing the concrete class inside the high-level class.',
        'Calling every chain of dots a Demeter violation: fluent builders and streams return the same kind of object and are fine.'
      ]
    },
    java: {
      idea: 'Checked exceptions are part of a method’s contract; unchecked ones signal bugs. Generics are invariant, so wildcards are how you get flexibility: Producer Extends, Consumer Super.',
      steps: [
        'Checked: extends <code>Exception</code>, must be caught or declared. Unchecked: extends <code>RuntimeException</code>.',
        'Catch the most specific exceptions first; <code>finally</code> always runs.',
        '<code>List&lt;Dog&gt;</code> is not a <code>List&lt;Animal&gt;</code>. Reading from it → <code>? extends Animal</code>. Adding to it → <code>? super Dog</code>.',
        'Type erasure: no <code>new T()</code>, no <code>instanceof List&lt;String&gt;</code>, no generic arrays.',
        'JUnit 5: <code>assertEquals(expected, actual)</code>, <code>assertThrows(X.class, () -&gt; …)</code>; tests pin behaviour before refactoring.'
      ],
      traps: [
        'Writing <code>List&lt;Number&gt;</code> where <code>List&lt;? extends Number&gt;</code> is needed.',
        'Catching <code>Exception</code> and swallowing it silently.',
        'Swapping <code>assertEquals</code> arguments, so failure messages read backwards.'
      ]
    },
    fp: {
      idea: 'A lambda implements a functional interface; choose the type by its shape. Streams are lazy pipelines: source → intermediate operations → one terminal operation.',
      stepsTitle: 'Pick the functional interface by shape',
      steps: [
        'T → boolean: <code>Predicate&lt;T&gt;</code>',
        'T → nothing: <code>Consumer&lt;T&gt;</code>',
        'nothing → T: <code>Supplier&lt;T&gt;</code>',
        'T → R: <code>Function&lt;T,R&gt;</code>; T → T: <code>UnaryOperator&lt;T&gt;</code>',
        '(T, U) → R: <code>BiFunction</code>; (T, T) → T: <code>BinaryOperator&lt;T&gt;</code>',
        'nothing → nothing: <code>Runnable</code>'
      ],
      worked: pre(`
students.stream()
        .filter(s -> s.getWam() >= 75)     // Predicate<Student>
        .map(Student::getZid)              // Function<Student, String>
        .sorted()
        .collect(Collectors.toList());     // terminal: nothing runs before this`),
      traps: [
        'Choosing <code>Function&lt;T, Boolean&gt;</code> when <code>Predicate&lt;T&gt;</code> is the semantically correct type.',
        'Expecting output from a pipeline with no terminal operation.',
        'Reassigning a captured local variable inside a lambda (must be effectively final).',
        'Using <code>forEach</code> to add to an outside list instead of <code>collect</code>.'
      ]
    },
    smells: {
      idea: 'A smell is a surface symptom of a deeper design problem. Marks come from naming the smell precisely, pointing at where it occurs, and naming a refactoring that actually removes it.',
      stepsTitle: 'For each smell you report',
      steps: [
        '<b>Name</b> it precisely (Feature Envy, not "bad code").',
        '<b>Locate</b> it: the class, method and lines.',
        '<b>Why</b> it hurts: which change becomes hard, or which principle it breaks.',
        '<b>Fix</b> with a named refactoring: Extract Method/Class, Move Method, Replace Conditional with Polymorphism, Introduce Parameter Object, Hide Delegate, Replace Type Code with Class/Strategy.',
        'Keep behaviour identical: the regression tests must still pass.'
      ],
      worked: '<p>Type switches repeated across methods → <b>Switch Statements</b> + Open-Closed violation → Replace Conditional with Polymorphism (subclasses or Strategy). ' +
        '<code>a.getB().getC().x()</code> → <b>Message Chains</b> / Law of Demeter → Hide Delegate. Same parameters travelling together → <b>Data Clumps</b> → Introduce Parameter Object.</p>',
      traps: [
        'Listing smells without saying how to fix them (the fix is usually half the marks).',
        'Picking two trivial smells (a bad variable name) when there are moderate-to-severe ones (switch on type, god class).',
        'Changing behaviour while refactoring — e.g. "fixing" an odd rule the tests depend on.'
      ]
    },
    patterns: {
      idea: 'Each pattern solves one recurring problem. Recognise the problem from cue words, then justify by mapping every role in the pattern to something in the scenario — that mapping is where the marks are.',
      stepsTitle: 'Cue words → pattern',
      steps: [
        '"interchangeable algorithms", "switch at runtime" → <b>Strategy</b>',
        '"tree", "part-whole", "contains other X", "treat uniformly" → <b>Composite</b>',
        '"add features/responsibilities dynamically", "any combination of extras" → <b>Decorator</b>',
        '"notify", "subscribe", "when X changes, Y and Z update" → <b>Observer</b>',
        '"families of related objects", "themes", "must match" → <b>Abstract Factory</b>; "subclass decides which class to create" → <b>Factory Method</b>',
        '"exactly one", "shared global access" → <b>Singleton</b> (and say why that is acceptable here)'
      ],
      worked: '<p>Justification template (3 marks): <b>Pattern.</b> Role 1 = domain thing; Role 2 = domain thing; Role 3 = domain thing. ' +
        'Then one sentence on the problem it solves here (runtime swapping / no class explosion / uniform treatment / loose coupling) and one on extensibility (new X is a new class, nothing existing changes).</p>' +
        '<table class="mini"><tr><th>Pattern</th><th>Roles</th></tr>' +
        '<tr><td>Strategy</td><td>Context, Strategy interface, Concrete strategies</td></tr>' +
        '<tr><td>Composite</td><td>Component, Leaf, Composite (holds children)</td></tr>' +
        '<tr><td>Decorator</td><td>Component, Concrete component, Abstract decorator (wraps a component), Concrete decorators</td></tr>' +
        '<tr><td>Observer</td><td>Subject (attach/detach/notify), Observer interface, Concrete observers</td></tr>' +
        '<tr><td>Abstract Factory</td><td>Abstract factory, Concrete factories, Abstract products, Concrete products</td></tr></table>',
      traps: [
        'Naming a pattern without mapping its roles to the scenario.',
        'Strategy vs State vs Decorator confusion: Strategy swaps an algorithm the client picks; Decorator wraps and stacks.',
        'A "Composite" with no recursion, or a "Decorator" that does not implement the same interface as what it wraps.',
        'Using Singleton for convenience without noting the testing/global-state cost.'
      ]
    },
    async: {
      idea: 'Shared mutable state + threads = race conditions. Make compound operations atomic (synchronized, locks, atomics), and keep slow work off the thread that must stay responsive.',
      steps: [
        'Spot the read-modify-write or check-then-act (<code>count++</code>, <code>if (x == null) x = …</code>).',
        'Describe an interleaving that loses an update.',
        'Fix: <code>synchronized</code> (one thread per object lock), <code>ReentrantLock</code>, or <code>AtomicInteger</code>; for a lazy Singleton, a synchronized <code>getInstance</code> or eager initialisation.',
        'Deadlock: threads each holding a lock the other needs; prevent with a consistent lock order.',
        'Asynchronous: return immediately, deliver the result later (<code>CompletableFuture</code>, callbacks, events).'
      ],
      traps: [
        'Synchronising the writer but not the reader.',
        'Calling <code>run()</code> instead of <code>start()</code>.',
        'Claiming async makes work faster; it makes the caller more responsive.'
      ]
    },
    model: {
      idea: 'Domain modelling answers are stubs: interfaces, classes, inheritance, method signatures and key fields, with relationships, ownership and cardinalities written as comments. You are marked on entities, relationships/cardinalities and functionality.',
      stepsTitle: 'A method that scores well',
      steps: [
        '<b>Nouns → classes</b>. Underline every noun in the spec; merge synonyms; drop ones that are just attributes.',
        '<b>Is-a → inheritance</b> only when permanent and substitutable (Pilot is-a CrewMember). Things that change at runtime (membership tier, status) are fields or state objects.',
        '<b>Shared capability across unrelated classes → interface</b> (Followable, Chargeable).',
        '<b>Has-a → fields</b>, each with a comment: aggregation or composition, and the cardinality at both ends (1, 0..1, 0..*, 1..*).',
        '<b>Relationships with their own data → a class</b> (Booking, Admission, Loan).',
        '<b>Verbs → methods</b>, placed on the class that owns the data; check every controller method can be implemented from your model.',
        '<b>Justify</b> non-obvious decisions in JavaDoc.'
      ],
      worked: pre(`
public class Classroom {
    private int capacity;
    private Staff invigilator;        // association, * classrooms — 1 staff
    private List<Student> students;   // aggregation, 0..capacity
    public void addStudent(Student s) { ... }    // enforces capacity
    public void removeStudent(Student s) { ... }
}
public class Centre {
    private Staff supervisor;         // exactly 1
    private List<Classroom> rooms;    // composition, 1 centre ◆— 1..* Classroom
}`),
      traps: [
        'Writing a list field with no comment on aggregation/composition or cardinality.',
        'Modelling a runtime-changing status as a subclass.',
        'Forgetting the "association class" for relationships that carry data (dates, seats).',
        'Implementing methods — you only need signatures; spend the time on structure.',
        'Not checking your model supports every method of the given controller.'
      ]
    },
    archfund: {
      idea: 'Architecture is about trade-offs, and why matters more than how. Characteristics (the "-ilities") drive style choices; ADRs record decisions; C4 describes structure at four zoom levels; sequence diagrams describe behaviour.',
      steps: [
        '<b>Characteristics</b>: scalability (growth), elasticity (bursts), availability, fault tolerance, performance, security, maintainability, testability, deployability, interoperability. Tie each to a requirement.',
        '<b>ADR</b>: Title, Status, Context (forces and options), Decision (active voice), Consequences (good <i>and</i> bad).',
        '<b>C4</b>: Context (system as one box, users, external systems) → Container (deployable units and technology) → Component (inside one container) → Code.',
        '<b>Logical components</b>: actors → actions → group related actions → check cohesion/coupling and characteristics.'
      ],
      traps: [
        'Confusing scalability with elasticity.',
        'An ADR with only positive consequences.',
        'Putting technology choices on a Context diagram, or external systems inside the boundary.'
      ]
    },
    styles: {
      idea: 'Choose the simplest style that meets the characteristics the scenario stresses, justify it from those characteristics, and name the trade-off you accept.',
      stepsTitle: 'Scenario cues → style',
      steps: [
        'Small team, MVP, simple domain, low budget → <b>layered monolith</b>.',
        'Growing domain, want clear boundaries but one deployment, may split later → <b>modular monolith</b>.',
        'Many teams, independent deploys, parts with very different scaling or reliability needs → <b>microservices</b>.',
        'Real-time reactions, many independent consumers of the same events, high throughput → <b>event-driven</b>.',
        'Short, event-triggered, bursty or rare tasks, pay per use, no server management → <b>serverless</b>.',
        'Justify with 2–3 characteristics, then state one cost you accept.'
      ],
      worked: '<table class="mini"><tr><th>Style</th><th>Strength</th><th>Cost</th></tr>' +
        '<tr><td>Layered</td><td>Simple, cheap, familiar</td><td>Changes span layers; scales as a whole; sinkhole</td></tr>' +
        '<tr><td>Modular monolith</td><td>Domain boundaries, one deploy</td><td>Discipline needed to keep modules apart</td></tr>' +
        '<tr><td>Microservices</td><td>Independent deploy/scale, fault isolation</td><td>Ops complexity, network, distributed data</td></tr>' +
        '<tr><td>Event-driven</td><td>Decoupled, scalable, responsive</td><td>Hard to debug/trace, eventual consistency</td></tr>' +
        '<tr><td>Serverless</td><td>Auto-scaling, pay per use, no servers</td><td>Cold starts, time limits, lock-in</td></tr></table>',
      traps: [
        'Choosing microservices by default; for a small team it is usually wrong.',
        'Justifying with generic praise instead of the scenario’s specific needs.',
        'Forgetting the trade-off sentence.'
      ]
    },
    seq: {
      idea: 'A sequence diagram shows one scenario over time: participants across the top, messages top to bottom. Marks come from the right participants, the right order, calls vs replies, and fragments (alt/opt/loop/par) for every condition in the scenario.',
      stepsTitle: 'Building one in Mermaid',
      steps: [
        'Start with ' + c('sequenceDiagram') + '. Declare ' + c('actor User') + ' for people and ' + c('participant Svc as Order Service') + ' for systems, in left-to-right order of first use.',
        'Calls: ' + c('A->>B: method(args)') + '. Replies: ' + c('B-->>A: result') + '. Async messages/events: ' + c('A-)B: event') + '. Self-calls: ' + c('A->>A: validate') + '.',
        'Every "if/otherwise" → ' + c('alt condition') + ' … ' + c('else other') + ' … ' + c('end') + '. "May" → ' + c('opt') + '. "Repeat/until/for each" → ' + c('loop condition') + '. "At the same time" → ' + c('par') + ' … ' + c('and') + ' … ' + c('end') + '.',
        'Close every fragment with ' + c('end') + '. Avoid semicolons and # in message text.',
        'Read the scenario sentence by sentence and tick each one off against an arrow.'
      ],
      worked: pre(`
sequenceDiagram
    actor User
    participant Web
    participant Loan as Loan Service
    User->>Web: Borrow book
    Web->>Loan: borrow(userId, bookId)
    alt available
        Loan-->>Web: confirmed
    else unavailable
        Loan-->>Web: unavailable
    end
    Web-->>User: Show result`),
      traps: [
        'Missing a branch: every "if" in the scenario needs both paths shown.',
        'Using solid arrows for replies (use -->>).',
        'Inventing participants not implied by the scenario, or merging two services into one.',
        'Forgetting an ' + c('end') + ', which stops the diagram rendering.'
      ]
    }
  };

  var GUIDE_DM = GUIDES.model;
  var GUIDE_REFACTOR = {
    idea: 'Refactoring questions are marked mostly on design: the smells you identify, the pattern you choose and how cleanly you apply it, and whether the extension drops in without touching existing code. The tests must still pass.',
    stepsTitle: 'A plan for a refactoring question',
    steps: [
      'Read the tests first: they tell you the class names and constructor shapes your refactor must use.',
      'List the smells with locations (part a). Aim for two or three moderate-to-severe ones, each with why it hurts.',
      'Pick the pattern from the shape of the new requirement (part b).',
      'Refactor in small steps, keeping it compiling: introduce the interface, move one branch into one class, repeat, then delete the conditional.',
      'Add the extension as new classes only, if you can — that is the proof your design is open for extension.',
      'Write a 3–4 line rationale comment: pattern, roles, which smells are gone, how the extension fitted in.'
    ],
    traps: [
      'Leaving the old switch in place "for now" next to the new classes.',
      'Renaming public methods the tests call.',
      'Spending the time on part a: it is worth a few marks; the refactor carries the bulk.',
      'Code that does not compile — in the real exam that can mean no automarking marks.'
    ]
  };
  var GUIDE_SCRATCH = {
    idea: 'Build-from-scratch questions give a domain and a controller. Identify the pattern first, design the interface it implies, then implement the controller methods by delegating to the model — the controller should wire things up, not hold the logic.',
    stepsTitle: 'A plan for the 15 marks',
    steps: [
      'Read the tests and examples: they fix the class names, constructors and exact output formats.',
      'Name the pattern and map its roles (part a).',
      'Write the interface with every operation the later parts need.',
      'Implement the classes so each owns its behaviour; put shared logic in an abstract class rather than copying it.',
      'Implement the controller by delegating; keep any string → object mapping in one place (a small factory method).',
      'Check edge cases from the spec (minimums, ordering, "only once") and trace each test by hand.'
    ],
    traps: [
      'Type switches or instanceof chains in the controller — the design marks are lost even if tests pass.',
      'Duplicating the same formula in several classes instead of reusing it.',
      'Output that differs by a space or a decimal place from the spec.'
    ]
  };

  /* ============================== helpers ============================== */

  function shuffleChoice(rng, options, correctIdx) {
    var idx = rng.shuffle(options.map(function (_, i) { return i; }));
    return { options: idx.map(function (i) { return options[i]; }), correct: idx.indexOf(correctIdx) };
  }

  function mcPart(rng, item, label) {
    var sh = item.fixed ? { options: item.o.slice(), correct: item.a || 0 }
                        : shuffleChoice(rng, item.o, item.a || 0);
    return { kind: 'choice', label: label || '', marks: 1, prompt: item.q,
             options: sh.options, correct: sh.correct, solution: item.why + srcNote(item) };
  }

  /* A short-answer or architecture card. */
  function writtenCard(item) {
    return { intro: '<div>' + item.q + '</div>' + srcNote(item), data: [], parts: [writtenPart(item)] };
  }

  function writtenPart(item, label) {
    return { kind: 'written', label: label || '', marks: item.m, prompt: 'Type your answer as you would into the answer text file.',
             model: item.model, checklist: item.must, rows: 9, placeholder: 'Your answer…' };
  }

  /* Deal from a shuffled deck per bank, so practice works through every
     question before any repeats. */
  var decks = {};
  function deal(key, n, rng) {
    if (!decks[key] || !decks[key].length) {
      var all = [];
      for (var i = 0; i < n; i++) all.push(i);
      decks[key] = rng.shuffle(all);
    }
    return decks[key].pop();
  }
  function dealFrom(key, bank, rng) { return bank[deal(key, bank.length, rng)]; }

  function filesBlock(files, name) {
    return { name: name || 'Starter code', langs: files.map(function (f) { return { name: f.name, text: f.text }; }) };
  }

  function specList(items) {
    return '<ul>' + items.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>';
  }

  /* Where a question came from, when it is not one of ours. */
  function srcNote(item) {
    return item && item.src ? '<p class="small muted">Source: ' + item.src + '.</p>' : '';
  }

  /* ============================== builders ============================= */

  var DM_NOTE = 'There is no single right model. Compare the <i>decisions</i>: what became a class, what is inherited versus a field, which relationships own their parts, and whether every controller method has somewhere to live.';

  function buildDomain(d) {
    return {
      intro: (d.lead ? '<p>' + d.lead + '</p>' : '') +
        '<p>Model the domain for the following requirements to form the basis of a potential software solution.</p>' + specList(d.spec) +
        '<p>Your answer should include interfaces (if applicable), class signatures with inheritance where appropriate, method signatures, and key fields and relationships — ' +
        'including aggregations, compositions and cardinalities, written as comments. You do <b>not</b> need to implement the methods. Justify design decisions in comments or JavaDoc. Do not draw a UML diagram.</p>' +
        '<p class="small muted">Marked on: ' + (d.breakdown || 'modelling of entities (4) · aggregations, compositions and cardinalities (3) · modelling of functionality (3)') +
        '. The controller interface below is provided; there is intentionally undefined behaviour, so make assumptions as long as they do not reduce the scope.</p>' + srcNote(d),
      data: [{ name: 'Provided controller', langs: [{ name: 'Controller.java', text: d.controller }] }],
      parts: [{
        kind: 'code', label: '', marks: 10, lang: 'Java',
        prompt: 'Write your interfaces and class stubs.',
        prefill: '// Interfaces, classes, fields and method signatures only.\n// Write relationships as comments, e.g.\n//   private List<Seat> seats;   // composition, 1 aircraft ◆— 1..* Seat\n\n',
        rows: 22, model: d.model, checklist: d.must,
        notes: d.notes ? d.notes + ' ' + DM_NOTE : DM_NOTE
      }]
    };
  }

  /* Total marks of a refactor or build item. */
  function itemMarks(x) {
    return x.parts ? x.parts.reduce(function (s, p) { return s + p.marks; }, 0) : 15;
  }

  /* Starter code to edit in place: every provided file except the tests. */
  function starterText(files) {
    return files.filter(function (f) { return !/test/i.test(f.name); })
      .map(function (f) { return f.text; }).join('\n\n');
  }

  /* Part-by-part builder shared by build-from-scratch items and refactor
     items that define their own parts. */
  function buildParts(s, rng, filesName) {
    var labels = ['a)', 'b)', 'c)', 'd)', 'e)', 'f)'];
    return {
      intro: s.intro + srcNote(s),
      data: [filesBlock(s.files, filesName)],
      parts: s.parts.map(function (p, i) {
        var q = { kind: p.kind, label: p.label || labels[i], marks: p.marks, prompt: p.prompt, model: p.model, checklist: p.checklist, notes: p.notes };
        if (p.kind === 'code') {
          q.lang = p.lang;
          q.prefill = (p.prefill === 'FILES' ? starterText(s.files) : p.prefill) + '\n';
          q.rows = p.prefill === 'FILES' ? 24 : 20;
        } else if (p.kind === 'choice') {
          var sh = shuffleChoice(rng, p.options, p.correct);
          q.options = sh.options; q.correct = sh.correct; q.solution = p.why;
          delete q.model; delete q.checklist;
        } else { q.rows = 7; q.placeholder = 'Your answer…'; }
        return q;
      })
    };
  }

  function buildRefactor(r, rng) {
    if (r.parts) return buildParts(r, rng, 'Starter code');
    var pat = shuffleChoice(rng, r.pattern.options, r.pattern.correct);
    return {
      intro: r.intro + '<p>The regression tests below must pass after your changes.</p>' + srcNote(r),
      data: [filesBlock(r.files)],
      parts: [
        { kind: 'written', label: 'a)', marks: 3,
          prompt: 'Identify the design problems and code smells in the starter code. For each, say where it occurs and why it is a problem.',
          model: r.smells, rows: 7,
          checklist: ['At least two moderate-to-severe smells, named precisely', 'Each located in the code', 'Each explained: what change it makes hard / which principle it breaks'] },
        { kind: 'choice', label: 'b)', marks: 1, prompt: 'Which design pattern best fits the refactoring and the new requirements?',
          options: pat.options, correct: pat.correct, solution: r.pattern.why },
        { kind: 'code', label: 'c)', marks: 11, lang: 'Java', prompt: r.task,
          prefill: r.files[0].text + '\n', rows: 24, model: r.model, notes: r.notes, checklist: r.must }
      ]
    };
  }

  function buildScratch(s, rng) { return buildParts(s, rng, 'Provided files'); }

  function buildSeq(s) {
    return {
      intro: '<p>Draw a sequence diagram using Mermaid syntax for the following scenario:</p><p><i>' + s.q + '</i></p>' + srcNote(s),
      data: [],
      parts: [{
        kind: 'code', label: '', marks: 10, lang: 'Mermaid',
        prompt: 'Write your diagram (as you would into the .md answer file). Paste it into a Mermaid renderer to check it draws.',
        prefill: 'sequenceDiagram\n    actor User\n    participant System\n\n', rows: 22,
        model: s.model, notes: s.notes, checklist: s.must
      }]
    };
  }

  /* ============================== templates ============================ */

  var TEMPLATES = [];

  D.TOPICS.forEach(function (t) {
    TEMPLATES.push({
      id: 'mc-' + t.key, topic: t.name, format: 'Multiple choice', marks: 1,
      title: t.name + ': multiple choice', guide: GUIDES[t.key],
      build: function (rng) { return { intro: '', data: [], parts: [mcPart(rng, dealFrom('mc-' + t.key, D.MCQ[t.key], rng))] }; }
    });
  });

  Object.keys(D.SHORT).forEach(function (key) {
    TEMPLATES.push({
      id: 'sa-' + key, topic: TOPIC_NAME[key], format: 'Short answer',
      title: TOPIC_NAME[key] + ': short answer', guide: GUIDES[key],
      build: function (rng) {
        return writtenCard(dealFrom('sa-' + key, D.SHORT[key], rng));
      }
    });
  });

  TEMPLATES.push({
    id: 'dm', topic: TOPIC_NAME.model, format: 'Design & programming',
    title: 'Domain modelling', guide: GUIDE_DM,
    build: function (rng) { return buildDomain(dealFrom('dm', D.DOMAIN, rng)); }
  });
  TEMPLATES.push({
    id: 'refactor', topic: TOPIC_NAME.smells, format: 'Design & programming',
    title: 'Refactor and extend', guide: GUIDE_REFACTOR,
    build: function (rng) { return buildRefactor(dealFrom('refactor', D.REFACTOR, rng), rng); }
  });
  TEMPLATES.push({
    id: 'scratch', topic: TOPIC_NAME.patterns, format: 'Design & programming',
    title: 'Design and build from scratch', guide: GUIDE_SCRATCH,
    build: function (rng) { return buildScratch(dealFrom('scratch', D.SCRATCH, rng), rng); }
  });
  TEMPLATES.push({
    id: 'seq', topic: TOPIC_NAME.seq, format: 'Architecture',
    title: 'Sequence diagram (Mermaid)', guide: GUIDES.seq,
    build: function (rng) { return buildSeq(dealFrom('seq', D.SEQ, rng)); }
  });
  Object.keys(D.ARCH).forEach(function (key) {
    TEMPLATES.push({
      id: 'arch-' + key, topic: TOPIC_NAME[key], format: 'Architecture',
      title: TOPIC_NAME[key] + ': architecture question', guide: GUIDES[key],
      build: function (rng) {
        return writtenCard(dealFrom('arch-' + key, D.ARCH[key], rng));
      }
    });
  });

  /* Standard builder from _template.js. */
  function build(templateId, seed) {
    var tpl = null, i;
    for (i = 0; i < TEMPLATES.length; i++) if (TEMPLATES[i].id === templateId) tpl = TEMPLATES[i];
    if (!tpl) return null;
    for (var k = 0; k < 40; k++) {
      var rng = global.Stats.rng(seed + k * 7919);
      var q;
      try { q = tpl.build(rng); } catch (e) { q = null; }
      if (q) {
        q.id = tpl.id; q.topic = tpl.topic; q.title = tpl.title;
        q.marks = q.parts.reduce(function (s, p) { return s + (p.marks || 0); }, 0);
        q.seed = seed + k * 7919;
        return q;
      }
    }
    return null;
  }

  /* ============================== mock exam ============================ */

  /* Choose at most `maxCount` written items whose marks add up exactly to
     `target`. Each attempt shuffles the pool and runs a depth-first search
     for an exact subset; of several solutions, keep the one covering the
     most distinct topics. Falls back to the closest sum found. */
  function pickToTotal(pool, target, rng, maxCount) {
    var best = null, bestScore = -1, closest = [], closestSum = -1;
    function topics(set) {
      var seen = {};
      set.forEach(function (x) { seen[x.key] = 1; });
      return Object.keys(seen).length;
    }
    for (var attempt = 0; attempt < 12; attempt++) {
      var order = rng.shuffle(pool.slice()), budget = 20000, chosen = [];
      var found = (function dfs(start, sum) {
        if (sum === target) return chosen.slice();
        if (sum > closestSum) { closestSum = sum; closest = chosen.slice(); }
        if (chosen.length >= maxCount || --budget < 0) return null;
        for (var i = start; i < order.length; i++) {
          if (sum + order[i].item.m > target) continue;
          chosen.push(order[i]);
          var r = dfs(i + 1, sum + order[i].item.m);
          chosen.pop();
          if (r) return r;
        }
        return null;
      })(0, 0);
      if (found && topics(found) > bestScore) { best = found; bestScore = topics(found); }
    }
    return best || closest;
  }

  function flatPool(banks) {
    var pool = [];
    Object.keys(banks).forEach(function (key) {
      banks[key].forEach(function (item) { pool.push({ key: key, item: item }); });
    });
    return pool;
  }

  function examCard(label, title, topic, q) {
    q.examLabel = label; q.title = title; q.topic = topic; q.seed = 0;
    q.marks = q.parts.reduce(function (s, p) { return s + (p.marks || 0); }, 0);
    return q;
  }

  function tagParts(q, topic, tpl) {
    q.parts.forEach(function (p) { p.topic = topic; p.tpl = tpl; });
    q.id = tpl;
    return q;
  }

  /* Two Section 3 programming problems whose marks sum to 30. The first is
     dealt from all refactor and build problems; its partner makes up the
     remaining marks, preferring the other kind. Refactors come first. */
  function section3Pair(rng) {
    var all = D.REFACTOR.map(function (item) { return { kind: 'refactor', item: item }; })
      .concat(D.SCRATCH.map(function (item) { return { kind: 'scratch', item: item }; }));
    var first = all[deal('s3', all.length, rng)];
    var need = 30 - itemMarks(first.item);
    var fits = all.filter(function (x) { return x !== first && itemMarks(x.item) === need; });
    var other = fits.filter(function (x) { return x.kind !== first.kind; });
    var partner = rng.pick(other.length ? other : fits);
    var pair = [first, partner];
    return pair.sort(function (a, b) { return (a.kind === 'scratch') - (b.kind === 'scratch'); });
  }

  function buildMock() {
    var rng = global.Stats.rng(Math.floor(Math.random() * 1e9));
    var out = [], n = 1;

    // ---- Section 1: 8 multiple choice, distinct topics, at least one
    //      from each architecture topic (as in the sample) ----
    var arch = D.TOPICS.filter(function (t) { return t.key === 'archfund' || t.key === 'styles'; });
    var rest = rng.shuffle(D.TOPICS.filter(function (t) { return arch.indexOf(t) < 0; })).slice(0, 6);
    var mcTopics = rest.concat(arch).sort(function (a, b) { return D.TOPICS.indexOf(a) - D.TOPICS.indexOf(b); });
    var mcParts = mcTopics.map(function (t, i) {
      var p = mcPart(rng, dealFrom('mc-' + t.key, D.MCQ[t.key], rng), 'Q' + (i + 1) + '.');
      p.topic = t.name; p.tpl = 'mc-' + t.key;
      return p;
    });
    out.push(examCard('Section 1', 'Multiple choice (Q1–8)', 'Section 1 · 8 marks',
      { id: 'mock-mc', intro: '<p>Answer all eight questions. Each is worth 1 mark.</p>', data: [], parts: mcParts }));
    n = 9;

    // ---- Section 2: short answers totalling 22 ----
    pickToTotal(flatPool(D.SHORT), 22, rng, 8)
      .sort(function (a, b) { return Object.keys(D.SHORT).indexOf(a.key) - Object.keys(D.SHORT).indexOf(b.key); })
      .forEach(function (x) {
        var q = tagParts(writtenCard(x.item), TOPIC_NAME[x.key], 'sa-' + x.key);
        out.push(examCard('Q' + n, 'Section 2 · Short answer', TOPIC_NAME[x.key], q));
        n++;
      });

    // ---- Section 3: domain model 10, then two programming problems
    //      totalling 30 (usually a refactor 15 + a build 15) ----
    var dm = tagParts(buildDomain(dealFrom('dm', D.DOMAIN, rng)), TOPIC_NAME.model, 'dm');
    out.push(examCard('Q' + n++, 'Section 3 · Domain modelling', TOPIC_NAME.model, dm));
    section3Pair(rng).forEach(function (x) {
      var q = x.kind === 'refactor'
        ? tagParts(buildRefactor(x.item, rng), TOPIC_NAME.smells, 'refactor')
        : tagParts(buildScratch(x.item, rng), TOPIC_NAME.patterns, 'scratch');
      out.push(examCard('Q' + n++, x.kind === 'refactor' ? 'Section 3 · Refactor and extend' : 'Section 3 · Design and build',
        x.kind === 'refactor' ? TOPIC_NAME.smells : TOPIC_NAME.patterns, q));
    });

    // ---- Section 4: architecture answers totalling 20, then the diagram ----
    pickToTotal(flatPool(D.ARCH), 20, rng, 5)
      .sort(function (a, b) { return (a.key === 'styles') - (b.key === 'styles'); })
      .forEach(function (x) {
        var q = tagParts(writtenCard(x.item), TOPIC_NAME[x.key], 'arch-' + x.key);
        out.push(examCard('Q' + n, 'Section 4 · Software architecture', TOPIC_NAME[x.key], q));
        n++;
      });
    var sq = tagParts(buildSeq(dealFrom('seq', D.SEQ, rng)), TOPIC_NAME.seq, 'seq');
    out.push(examCard('Q' + n, 'Section 4 · Sequence diagram', TOPIC_NAME.seq, sq));

    return out;
  }

  /* ============================== drills =============================== */

  var PATTERNS = [
    { q: '"Interchangeable algorithms, chosen or switched at runtime"', a: 'Strategy', alt: 'Context holds a Strategy interface; concrete strategies implement it', tag: 'Behavioural' },
    { q: '"When X changes, all interested Ys must update"', a: 'Observer', alt: 'Subject with attach/detach/notify; Observer interface with update', tag: 'Behavioural' },
    { q: '"Tree of parts and wholes, treated uniformly"', a: 'Composite', alt: 'Component interface; Leaf; Composite holds children and recurses', tag: 'Structural' },
    { q: '"Add responsibilities dynamically, in any combination"', a: 'Decorator', alt: 'Decorator implements the component interface and wraps one', tag: 'Structural' },
    { q: '"Create families of related objects that must match"', a: 'Abstract Factory', alt: 'One concrete factory per family; one create method per product', tag: 'Creational' },
    { q: '"Let subclasses decide which class to instantiate"', a: 'Factory Method', alt: 'Abstract createX() in the creator, overridden by subclasses', tag: 'Creational' },
    { q: '"Exactly one instance, globally accessible"', a: 'Singleton', alt: 'private constructor, static getInstance(); watch thread safety', tag: 'Creational' },
    { q: 'Strategy vs Decorator in one line', a: 'Strategy changes the guts; Decorator changes the skin', tag: 'Comparisons' },
    { q: 'Observer push vs pull', a: 'Push sends the data; pull sends "I changed" and observers query', tag: 'Comparisons' },
    { q: 'Composite: transparency vs safety', a: 'add() on the component (transparent, unsafe on leaves) vs only on the composite (safe, less uniform)', tag: 'Comparisons' },
    { q: 'Creational / Structural / Behavioural are about…', a: 'object creation / composing objects into structures / communication and responsibility', tag: 'Comparisons' }
  ];

  var SMELLS = [
    { q: 'Same switch on a type code in several places', a: 'Switch Statements → Replace Conditional with Polymorphism', tag: 'Smells' },
    { q: 'Method uses another class’s data more than its own', a: 'Feature Envy → Move Method', tag: 'Smells' },
    { q: 'Same few parameters always travel together', a: 'Data Clumps → Introduce Parameter Object / Extract Class', tag: 'Smells' },
    { q: 'One change forces edits in many classes', a: 'Shotgun Surgery → Move Method/Field to gather it', tag: 'Smells' },
    { q: 'One class changed for many different reasons', a: 'Divergent Change → Extract Class', tag: 'Smells' },
    { q: 'a.getB().getC().doIt()', a: 'Message Chains → Hide Delegate (Law of Demeter)', tag: 'Smells' },
    { q: 'Class only delegates to another', a: 'Middle Man → Remove Middle Man', tag: 'Smells' },
    { q: 'Subclass overrides inherited methods to throw', a: 'Refused Bequest → fix the hierarchy / Replace Inheritance with Delegation', tag: 'Smells' },
    { q: 'Domain concepts stored as String/int/double', a: 'Primitive Obsession → Replace Data Value with Object', tag: 'Smells' },
    { q: 'Class with only fields, getters and setters', a: 'Data Class → Move behaviour into it', tag: 'Smells' },
    { q: 'Fields only used during one algorithm', a: 'Temporary Field → Extract Class / Method Object', tag: 'Smells' },
    { q: 'Framework built "just in case"', a: 'Speculative Generality → Collapse Hierarchy / Inline Class (YAGNI)', tag: 'Smells' },
    { q: 'Huge class doing everything', a: 'Large Class / God Class → Extract Class', tag: 'Smells' },
    { q: 'Unexplained literals like 0.95, 1.1', a: 'Magic Numbers → Replace with Named Constant', tag: 'Smells' }
  ];

  var PRINCIPLES = [
    { q: 'S in SOLID', a: 'Single Responsibility: one reason to change', tag: 'SOLID' },
    { q: 'O in SOLID', a: 'Open-Closed: open for extension, closed for modification', tag: 'SOLID' },
    { q: 'L in SOLID', a: 'Liskov Substitution: subtypes usable wherever the parent is expected', tag: 'SOLID' },
    { q: 'I in SOLID', a: 'Interface Segregation: no client forced to depend on methods it does not use', tag: 'SOLID' },
    { q: 'D in SOLID', a: 'Dependency Inversion: depend on abstractions, not concretions', tag: 'SOLID' },
    { q: 'Law of Demeter: m may call methods on…', a: 'this, its parameters, objects it creates, and this’s direct fields', tag: 'Principles' },
    { q: 'Subclass preconditions may be…', a: 'weakened (same or accept more)', tag: 'Design by contract' },
    { q: 'Subclass postconditions may be…', a: 'strengthened (same or promise more)', tag: 'Design by contract' },
    { q: 'Invariants in a subclass must be…', a: 'preserved', tag: 'Design by contract' },
    { q: 'Who checks preconditions under DbC?', a: 'The client (caller)', tag: 'Design by contract' },
    { q: 'Coupling', a: 'How much one module depends on others (aim low)', tag: 'Principles' },
    { q: 'Cohesion', a: 'How well a module’s contents belong together (aim high)', tag: 'Principles' },
    { q: 'Why favour composition over inheritance?', a: 'Swap behaviour at runtime; avoid fragile base classes and class explosion', tag: 'Principles' }
  ];

  var JAVA = [
    { q: 'T → boolean', a: 'Predicate<T>', tag: 'Functional interfaces' },
    { q: 'T → nothing', a: 'Consumer<T>', tag: 'Functional interfaces' },
    { q: 'nothing → T', a: 'Supplier<T>', tag: 'Functional interfaces' },
    { q: 'T → R', a: 'Function<T, R>', tag: 'Functional interfaces' },
    { q: '(T, T) → T', a: 'BinaryOperator<T>', tag: 'Functional interfaces' },
    { q: 'nothing → nothing', a: 'Runnable', tag: 'Functional interfaces' },
    { q: 'Read Animals from a list of any Animal subtype', a: 'List<? extends Animal>', tag: 'Generics' },
    { q: 'Add Integers to a list', a: 'List<? super Integer>', tag: 'Generics' },
    { q: 'PECS', a: 'Producer Extends, Consumer Super', tag: 'Generics' },
    { q: 'Checked exception', a: 'extends Exception (not RuntimeException); must catch or declare', tag: 'Exceptions' },
    { q: 'Unchecked exception', a: 'extends RuntimeException; signals a bug or broken precondition', tag: 'Exceptions' },
    { q: 'Override equals → also override', a: 'hashCode', tag: 'OO' },
    { q: 'Overloads are chosen…', a: 'at compile time, from declared types', tag: 'OO' },
    { q: 'Overrides are chosen…', a: 'at runtime, from the object’s class', tag: 'OO' },
    { q: 'Unique, insertion-ordered collection', a: 'LinkedHashSet', tag: 'Collections' }
  ];

  var ARCHITECTURE = [
    { q: 'Small team, MVP, low budget', a: 'Layered monolith', tag: 'Styles' },
    { q: 'Domain boundaries, single deployment', a: 'Modular monolith', tag: 'Styles' },
    { q: 'Many teams, independent deploys, independent scaling', a: 'Microservices', tag: 'Styles' },
    { q: 'Real-time reactions, many consumers of the same events', a: 'Event-driven', tag: 'Styles' },
    { q: 'Short, bursty, event-triggered tasks; pay per use', a: 'Serverless', tag: 'Styles' },
    { q: 'Main weakness of event-driven', a: 'Hard to debug and trace; eventual consistency', tag: 'Styles' },
    { q: 'Main weakness of serverless', a: 'Cold starts, time limits, vendor lock-in', tag: 'Styles' },
    { q: 'Main weakness of microservices', a: 'Operational complexity, network latency, distributed data', tag: 'Styles' },
    { q: 'Architecture sinkhole', a: 'Requests passing through layers that add no logic', tag: 'Styles' },
    { q: 'Closed layer', a: 'Requests must pass through it (layers of isolation)', tag: 'Styles' },
    { q: 'EDA broker vs mediator', a: 'Broker: chain reaction, decoupled. Mediator: orchestrator, control and error handling', tag: 'Styles' },
    { q: 'Cross-service transaction', a: 'Saga with compensating actions', tag: 'Styles' },
    { q: 'Scalability vs elasticity', a: 'Steady growth vs sudden bursts', tag: 'Characteristics' },
    { q: 'First law of software architecture', a: 'Everything is a trade-off', tag: 'Characteristics' },
    { q: 'Second law', a: 'Why is more important than how', tag: 'Characteristics' },
    { q: 'ADR sections', a: 'Title, Status, Context, Decision, Consequences', tag: 'Modelling' },
    { q: 'C4 levels', a: 'Context → Container → Component → Code', tag: 'Modelling' },
    { q: 'C4 Container diagram shows', a: 'Deployable/runnable units and their technology', tag: 'Modelling' },
    { q: 'Mermaid: call / reply / async', a: '->>  /  -->>  /  -)', tag: 'Modelling' },
    { q: 'Mermaid fragments', a: 'alt…else…end, opt, loop, par…and…end', tag: 'Modelling' }
  ];

  /* Drill cards are plain text (they contain generics like List<T>), but the
     app renders them as HTML, so escape them once here. */
  [PATTERNS, SMELLS, PRINCIPLES, JAVA, ARCHITECTURE].forEach(function (set) {
    set.forEach(function (card) {
      card.q = D.esc(card.q); card.a = D.esc(card.a);
      if (card.alt) { card.alt = D.esc(card.alt); card.altLabel = 'roles'; }
    });
  });

  /* ============================== subject ============================== */

  var nMc = 0, nSa = 0, nArch = 0;
  D.TOPICS.forEach(function (t) { nMc += D.MCQ[t.key].length; });
  Object.keys(D.SHORT).forEach(function (k) { nSa += D.SHORT[k].length; });
  Object.keys(D.ARCH).forEach(function (k) { nArch += D.ARCH[k].length; });

  var SUBJECT = {
    id: 'comp2511',
    code: 'COMP2511',
    name: 'OO Design & Programming — Final exam',
    tagline: 'Built on the 26T3 exam outline, the sample exam, the course practice questions and the Week 10 tutorial: ' + nMc + ' multiple-choice, ' + nSa + ' short-answer and ' + nArch + ' architecture questions, ' +
      D.DOMAIN.length + ' domain models, ' + D.REFACTOR.length + ' refactor-and-extend problems, ' + D.SCRATCH.length + ' build-from-scratch problems and ' + D.SEQ.length + ' Mermaid sequence diagrams. ' +
      'Code and written answers are self-assessed against a sample and a marker’s checklist, or use "Copy for AI hint" for feedback on your attempt.',
    templates: TEMPLATES,
    build: build,
    labels: { guide: 'Topic primer', guideOpen: 'Hide primer', same: 'Another of this type' },

    mockTest: {
      minutes: 180,
      blurb: 'The real exam’s shape, 100 marks over 3 hours: <b>Section 1</b>, 8 multiple-choice (8 marks); <b>Section 2</b>, short answers (22 marks); ' +
        '<b>Section 3</b>, a domain model (10) and two programming problems (30 together, usually a refactor-and-extend and a build-from-scratch); <b>Section 4</b>, architecture questions (20) and a Mermaid sequence diagram (10). ' +
        'Feedback is hidden until you submit; written and code answers are then self-assessed. The real exam adds 10 minutes of reading time — take it before you press start. ' +
        'In the real exam, code that does not compile may get no automarking marks, so compile as you go.',
      build: buildMock
    },

    drillBlurb: 'Pattern cues, smells and their fixes, principles, Java and functional types, and architecture styles.',
    drillSets: [
      { id: 'patterns', label: 'Patterns', cards: PATTERNS },
      { id: 'smells', label: 'Smells → fixes', cards: SMELLS },
      { id: 'principles', label: 'Principles & contracts', cards: PRINCIPLES },
      { id: 'java', label: 'Java & functional', cards: JAVA },
      { id: 'arch', label: 'Architecture', cards: ARCHITECTURE }
    ],

    reference: {
      title: 'COMP2511 reference',
      blurb: 'Pattern cues, Mermaid syntax, architecture styles, and how the exam is marked.',
      fromDrill: 'patterns',
      sections: [
        { heading: 'Mermaid sequence diagram syntax', rows: [
          ['Start', c('sequenceDiagram')],
          ['People / systems', c('actor User') + ' · ' + c('participant OS as Order Service')],
          ['Call (synchronous)', c('A->>B: placeOrder(items)')],
          ['Reply', c('B-->>A: orderId')],
          ['Async message / event', c('A-)B: OrderPlaced')],
          ['Failed / lost message', c('A-xB: request')],
          ['Self call', c('A->>A: validate()')],
          ['If / else', c('alt card approved') + ' … ' + c('else declined') + ' … ' + c('end')],
          ['Optional', c('opt user wants receipt') + ' … ' + c('end')],
          ['Repeat', c('loop until a driver accepts') + ' … ' + c('end')],
          ['Parallel', c('par') + ' … ' + c('and') + ' … ' + c('end')],
          ['Notes', c('Note over A,B: text')],
          ['Activation', c('A->>+B: call') + ' then ' + c('B-->>-A: reply')]
        ] },
        { heading: 'Architecture styles at a glance', rows: [
          ['Layered monolith', 'Technical partitioning, one deploy. Simple and cheap; changes span layers; sinkhole risk.'],
          ['Modular monolith', 'Domain partitioning, one deploy. Clear boundaries; a stepping stone to services.'],
          ['Microservices', 'Service per bounded context, own database, independent deploy and scale. Costly to operate.'],
          ['Event-driven', 'Asynchronous events through a broker (choreography) or mediator (orchestration). Decoupled; hard to trace.'],
          ['Serverless', 'Event-triggered functions, scale to zero, pay per use. Cold starts, time limits, lock-in.']
        ] },
        { heading: 'How the exam is marked', rows: [
          ['Section 1 (8)', '6–8 multiple choice; marks per question may vary.'],
          ['Section 2 (22)', '4–8 short answers typed into a text file; no diagrams.'],
          ['Section 3 (40)', 'Domain model (stubs + relationship comments), one build-from-scratch and one refactor-and-extend; design is a significant part of the marks.'],
          ['Section 4 (30)', '2–6 architecture questions, always including a Mermaid sequence diagram.'],
          ['Compiling', 'Run ' + c('gradle compile') + ' often. Non-compiling code may get no automarking marks; dryruns check it compiles and passes a basic test.'],
          ['Readable design', 'Markers must be able to read your design: clear names, a short rationale comment, no dead code.'],
          ['Resources in the exam', 'Lecture slides and code, the Java 21 API docs and the Mermaid docs/renderer. No internet otherwise.']
        ] },
        { heading: 'Things that cost marks', rows: [
          ['Naming a pattern without mapping its roles', 'Map every role (context, strategy, leaf, composite…) to something in the scenario.'],
          ['Smells without fixes', 'For each smell: name, location, why it hurts, named refactoring.'],
          ['Leaving the old conditional in place', 'After refactoring to polymorphism, the switch should be gone.'],
          ['Lists with no cardinality', 'In domain models, comment every relationship: aggregation/composition and multiplicities.'],
          ['Status as a subclass', 'Things that change at runtime are fields or state objects, not subclasses.'],
          ['Missing branches in a sequence diagram', 'Every "if" in the scenario needs alt/else; every "may" an opt; every "until" a loop.'],
          ['Choosing microservices by default', 'Justify the style from the scenario’s characteristics, and name the trade-off.']
        ] }
      ]
    }
  };

  if (global.Subjects) global.Subjects.register(SUBJECT);
  global.COMP2511 = SUBJECT;
})(typeof window !== 'undefined' ? window : globalThis);

if (typeof module !== 'undefined') module.exports = (typeof window !== 'undefined' ? window : globalThis).COMP2511;
