/* subjects/comp2511-batch2.js — COMP2511 final exam, Batch 2.
   A second full set of questions for every section, written in the style
   and at the difficulty of the sample exam and Batch 1, so there is fresh
   material once Batch 1 is done. Every item is tagged `batch: 2`; the
   Batches menu (practice) and the "Questions from" select (mock exam)
   choose between the sets. The bank is big enough for a full mock exam
   from Batch 2 alone.
   Load after comp2511-exam.js, before comp2511.js. */
(function (global) {
  'use strict';

  var D = global.COMP2511Data;
  var pre = D.pre, c = D.c;
  var BATCH = 2;

  function add(bank, key, items) {
    items.forEach(function (x) { x.batch = BATCH; });
    bank[key] = (bank[key] || []).concat(items);
  }
  function addList(list, items) {
    items.forEach(function (x) { x.batch = BATCH; list.push(x); });
  }
  function ul(items) { return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>'; }

  /* ===================== Section 1: multiple choice ===================== */

  add(D.MCQ, 'oo', [
    { q: 'What does this print?' + pre(`
static void show(Object o) { System.out.println("Object"); }
static void show(String s) { System.out.println("String"); }

show(null);`),
      o: ['String', 'Object', 'It does not compile: the call is ambiguous', 'It throws a NullPointerException'],
      why: c('null') + ' can be passed to both overloads, so the compiler picks the <i>most specific</i> one. ' + c('String') + ' is a subtype of ' + c('Object') + ', so ' + c('show(String)') + ' wins. It would only be ambiguous if there were two unrelated candidates, e.g. ' + c('show(String)') + ' and ' + c('show(Integer)') + '.' },
    { q: 'What does ' + c('new B().a()') + ' print?' + pre(`
class A {
    void a() { System.out.print("A"); b(); }
    void b() { System.out.print("a"); }
}
class B extends A {
    @Override
    void b() { System.out.print("b"); }
}`),
      o: ['Ab', 'Aa', 'A', 'Aab'],
      why: c('a()') + ' is inherited, so A’s body runs and prints "A". Its call to ' + c('b()') + ' is really ' + c('this.b()') + ', and ' + c('this') + ' is a B, so dynamic dispatch runs B’s override: "b". Self-calls inside a parent method still dispatch on the runtime class.' },
    { q: 'What does ' + c('new Child().call()') + ' print?' + pre(`
class Parent {
    private void hi() { System.out.println("Parent"); }
    void call() { hi(); }
}
class Child extends Parent {
    void hi() { System.out.println("Child"); }
}`),
      o: ['Parent', 'Child', 'It does not compile: Child cannot override a private method', 'It does not compile: hi() is not visible in call()'],
      why: 'Private methods are not inherited, so they cannot be overridden. ' + c('Child.hi()') + ' is a brand-new method that happens to share the name. Inside ' + c('Parent.call()') + ', the call to the private ' + c('hi()') + ' is bound at compile time to Parent’s version. Adding ' + c('@Override') + ' to Child’s method would make this a compile error, which is how you would catch the mistake.' },
    { q: 'Which statement about abstract classes and interfaces in Java is correct?',
      o: ['An abstract class can have constructors and instance fields; an interface can have neither.',
          'An interface can have instance fields as long as they are private.',
          'A class can extend several abstract classes but implement only one interface.',
          'An abstract class must declare at least one abstract method.'],
      why: 'An abstract class is a partial class: it can hold state and constructors (called by subclasses through ' + c('super(...)') + '). Interface fields are always ' + c('public static final') + ' constants, and interfaces have no constructors. Java allows one superclass but many interfaces. An abstract class may have no abstract methods at all; it just cannot be instantiated.' }
  ]);

  add(D.MCQ, 'dbc', [
    { q: c('Catalogue.find(String query)') + ' has precondition ' + c('query != null') + ' and postcondition ' + c('result != null') + ' (an empty list if nothing matches). Which overriding version in a subclass is a valid subtype?',
      o: ['It also accepts a null query, returning every item.',
          'It returns null when nothing matches, to save allocating an empty list.',
          'It requires the query to be at least 3 characters long.',
          'It throws IllegalArgumentException for blank queries.'],
      why: 'Accepting null <i>weakens</i> the precondition: every call that was legal on the parent is still legal, and the postcondition still holds. Returning null breaks the postcondition clients rely on. Requiring 3+ characters, or rejecting blank queries, <i>strengthens</i> the precondition, so a client holding a ' + c('Catalogue') + ' could make a legal call that the subclass refuses.' },
    { q: 'Under Design by Contract, a client calls a method without satisfying its precondition. What is the supplier (the method) obliged to do?',
      o: ['Nothing: the contract no longer binds it, and its behaviour is undefined.',
          'Check the precondition and throw a checked exception.',
          'Fix the arguments so the precondition holds, then continue.',
          'Still guarantee the postcondition, because postconditions always hold.'],
      why: 'DbC splits responsibility: the <i>client</i> must establish the precondition, and only then does the supplier promise the postcondition. If the client breaks its side, the supplier owes nothing. That is why DbC code does not re-check preconditions; checking anyway and throwing is <i>defensive programming</i>, a different approach.' },
    { q: c('Square extends Rectangle') + '. ' + c('Rectangle.setWidth(w)') + ' has postcondition ' + c('getWidth() == w && getHeight() == old(getHeight())') + '. Square overrides ' + c('setWidth') + ' to set both sides to ' + c('w') + '. Which is the best description?',
      o: ['It breaks LSP: the override weakens the inherited postcondition, so code written for Rectangle gets the wrong area.',
          'It is valid: a square is a rectangle, so inheritance is correct by definition.',
          'It breaks LSP because the override strengthens the precondition.',
          'It is valid because the override keeps the same method signature.'],
      why: 'The parent promises that ' + c('setWidth') + ' leaves the height alone. Square changes the height, so a client that sets width 5 and height 4 and expects area 20 gets 16 (or 25). The "is-a" relationship in maths is not enough: substitutability is about <i>behaviour</i> (contracts), not names or signatures.' },
    { q: 'When must a class invariant hold?',
      o: ['After the constructor finishes, and before and after every public method call.',
          'At every single line of every method, including private helpers.',
          'Only after the constructor finishes.',
          'Only when the client checks it by calling a validation method.'],
      why: 'An invariant describes every <i>visible</i> state of the object. A public method may break it temporarily while it works (e.g. halfway through moving money between two fields), as long as it is restored before the method returns. Private helpers called in the middle of an update may see it broken.' }
  ]);

  add(D.MCQ, 'principles', [
    { q: 'Which line inside ' + c('ShippingService.ship(Order o)') + ' breaks the Law of Demeter? (' + c('courier') + ' is a field of ShippingService.)',
      o: [c('String city = o.getCustomer().getAddress().getCity();'),
          c('double w = o.totalWeight();'),
          c('courier.collect(o);'),
          c('Label l = new Label(o); l.print();')],
      why: 'A method may call methods on ' + c('this') + ', its parameters, objects it creates, and its own fields. ' + c('o.getCustomer()') + ' is fine, but calling ' + c('getAddress()') + ' on the result talks to a stranger (and then a stranger’s stranger). The fix is to ask the order for what you need: ' + c('o.deliveryCity()') + ' (Hide Delegate).' },
    { q: 'An office ' + c('Machine') + ' interface declares ' + c('print()') + ', ' + c('scan()') + ' and ' + c('fax()') + '. ' + c('BasicPrinter') + ' implements it, and its ' + c('scan()') + ' and ' + c('fax()') + ' throw ' + c('UnsupportedOperationException') + '. Which principle is most directly violated by the interface design?',
      o: ['Interface Segregation', 'Single Responsibility', 'Open-Closed', 'Dependency Inversion'],
      why: 'BasicPrinter is forced to depend on methods it does not use, which is the definition of an ISP violation. The fix is smaller role interfaces (' + c('Printer') + ', ' + c('Scanner') + ', ' + c('Fax') + ') that a multifunction device can implement together. (The throwing methods are also a Liskov problem, but that is a symptom of the fat interface.)' },
    { q: c('ReportService') + '’s constructor does ' + c('this.repo = new MySqlReportRepository();') + '. Which change best applies the Dependency Inversion Principle?',
      o: ['Define a ReportRepository interface and pass an implementation into ReportService’s constructor.',
          'Make MySqlReportRepository a Singleton and call getInstance() instead.',
          'Make ReportService extend MySqlReportRepository so it can call its methods directly.',
          'Move the MySQL code into ReportService so there is one fewer class.'],
      why: 'DIP says high-level policy (reporting) should depend on an abstraction, not on a concrete low-level detail (MySQL). An interface plus constructor injection lets you swap databases or pass a fake in tests. A Singleton still hard-codes the concrete class, inheritance couples even more tightly, and inlining destroys the separation.' },
    { q: 'Which change <b>increases cohesion</b> without increasing coupling?',
      o: ['Moving a method that only uses Customer’s fields from OrderService into Customer.',
          'Merging the Logger and Mailer classes into one Utilities class.',
          'Adding a public setter for every private field so other classes can update them.',
          'Making a class call three new collaborators instead of computing a value itself.'],
      why: 'A method that only uses Customer’s data is Feature Envy: moving it puts behaviour with the data it belongs to, so both classes become more focused. A Utilities grab-bag lowers cohesion, public setters raise coupling, and extra collaborators add dependencies.' }
  ]);

  add(D.MCQ, 'java', [
    { q: 'What does ' + c('System.out.println(f())') + ' print?' + pre(`
static int f() {
    try {
        return 1;
    } finally {
        return 2;
    }
}`),
      o: ['2', '1', '12', 'It does not compile'],
      why: 'A ' + c('finally') + ' block always runs, even after a ' + c('return') + '. A ' + c('return') + ' inside finally replaces the pending return value (and would also swallow any exception). It compiles, with a warning, and is a known bad practice for exactly this reason.' },
    { q: 'Inside ' + c('class Box<T> { ... }') + ', which line does <b>not</b> compile?',
      o: [c('T item = new T();'),
          c('List<T> items = new ArrayList<>();'),
          c('T item = null;'),
          c('static <U> Box<U> of(U u) { return new Box<>(); }')],
      why: 'Generics are implemented by <i>type erasure</i>: at runtime T is just Object, so the compiler cannot know which constructor ' + c('new T()') + ' should call. The usual workaround is to pass in a ' + c('Supplier<T>') + ' (or a ' + c('Class<T>') + '). The other lines only use T as a static type, which erasure allows.' },
    { q: 'Which assignment compiles?',
      o: [c('List<? extends Number> nums = new ArrayList<Integer>();'),
          c('List<Number> nums = new ArrayList<Integer>();'),
          c('List<Object> objs = new ArrayList<String>();'),
          c('ArrayList<Integer> ints = new List<Integer>();')],
      why: 'Generics are invariant: ' + c('List<Integer>') + ' is not a ' + c('List<Number>') + ', even though Integer is a Number (otherwise you could add a Double to a list of Integers). A wildcard ' + c('? extends Number') + ' accepts a list of any Number subtype, read-only. ' + c('List') + ' is an interface, so it cannot be instantiated.' },
    { q: 'Which JUnit 5 test correctly checks that ' + c('account.withdraw(-5)') + ' throws ' + c('IllegalArgumentException') + '?',
      o: [c('assertThrows(IllegalArgumentException.class, () -> account.withdraw(-5));'),
          c('try { account.withdraw(-5); } catch (IllegalArgumentException e) { }'),
          c('assertEquals(IllegalArgumentException.class, account.withdraw(-5));'),
          c('assertThrows(IllegalArgumentException.class, account.withdraw(-5));')],
      why: c('assertThrows') + ' takes the exception class and an ' + c('Executable') + ' (a lambda) that it runs and watches. The try/catch version passes even if nothing is thrown, because it has no ' + c('fail()') + '. The last option calls ' + c('withdraw') + ' <i>before</i> assertThrows runs, so the exception escapes the test (and it does not compile if withdraw returns void).' }
  ]);

  add(D.MCQ, 'fp', [
    { q: 'What does this print?' + pre(`
Stream.of(1, 2, 3)
      .peek(System.out::print)
      .map(x -> x * 2);
System.out.println("!");`),
      o: ['!', '123!', '246!', '123246!'],
      why: 'Intermediate operations (' + c('peek') + ', ' + c('map') + ', ' + c('filter') + ') are <i>lazy</i>: they only describe the pipeline. Nothing is processed until a terminal operation such as ' + c('forEach') + ', ' + c('collect') + ' or ' + c('count') + ' runs, and there is none here.' },
    { q: 'Pick the most semantically correct type:' + pre('[redacted] isAdult = p -> p.getAge() >= 18;   // p is a Person'),
      o: [c('Predicate<Person>'), c('Function<Person, Integer>'), c('Consumer<Person>'), c('Supplier<Boolean>')],
      why: 'It takes one Person and returns a boolean: a ' + c('Predicate<Person>') + '. (' + c('Function<Person, Boolean>') + ' would also compile, but Predicate states the intent and adds ' + c('and') + ', ' + c('or') + ' and ' + c('negate') + '.) A Function returning Integer, a Consumer (returns nothing) and a Supplier (takes nothing) do not fit.' },
    { q: 'What does this print?' + pre(`
Optional<String> r = List.of("a", "bb", "ccc", "dd").stream()
        .filter(s -> s.length() == 2)
        .map(String::toUpperCase)
        .findFirst();
System.out.println(r.orElse("none"));`),
      o: ['BB', 'DD', 'BBDD', 'none'],
      why: 'The stream keeps encounter order. "bb" is the first element of length 2; it is upper-cased and ' + c('findFirst') + ' returns ' + c('Optional[BB]') + ', so ' + c('orElse') + ' gives "BB". (findFirst short-circuits: "ccc" and "dd" are never even mapped.)' },
    { q: 'Which snippet compiles?',
      o: [c('int base = 10; Function<Integer, Integer> f = x -> x + base;'),
          c('int base = 10; Function<Integer, Integer> f = x -> x + base; base = 20;'),
          c('int total = 0; list.forEach(x -> total += x);'),
          c('int n = 1; Runnable r = () -> n++;')],
      why: 'A lambda can only capture local variables that are <i>effectively final</i> (never reassigned anywhere). Reassigning ' + c('base') + ' afterwards, or modifying ' + c('total') + ' or ' + c('n') + ' inside the lambda, breaks that rule. To accumulate, use a stream reduction such as ' + c('list.stream().mapToInt(x -> x).sum()') + '.' }
  ]);

  add(D.MCQ, 'smells', [
    { q: 'Several methods across the codebase take ' + c('(String street, String suburb, String postcode, String state)') + ' as parameters, in that order. Which smell is this, and the usual fix?',
      o: ['Data Clumps: Introduce Parameter Object (an Address class)',
          'Feature Envy: Move Method',
          'Shotgun Surgery: Inline Class',
          'Speculative Generality: Collapse Hierarchy'],
      why: 'The same group of values keeps travelling together, which signals a missing concept. Extracting an ' + c('Address') + ' class shortens the parameter lists, gives validation and formatting a home, and removes the risk of passing the fields in the wrong order.' },
    { q: 'Adding a new payment method (e.g. Afterpay) requires small edits to ' + c('Checkout') + ', ' + c('Receipt') + ', ' + c('RefundService') + ', ' + c('ReportExporter') + ' and ' + c('FraudCheck') + '. Which smell is this?',
      o: ['Shotgun Surgery', 'Divergent Change', 'Middle Man', 'Lazy Class'],
      why: 'One change forces many small edits in many classes: Shotgun Surgery. The fix is to gather the payment-specific behaviour in one place, e.g. a ' + c('PaymentMethod') + ' type per method (Move Method, Replace Conditional with Polymorphism). Divergent Change is the mirror image: one class edited for many unrelated reasons.' },
    { q: c('ReadOnlyList extends ArrayList') + ' and overrides ' + c('add') + ', ' + c('remove') + ' and ' + c('set') + ' to throw ' + c('UnsupportedOperationException') + '. What are the smell and the refactoring?',
      o: ['Refused Bequest: Replace Inheritance with Delegation (wrap a list and expose only the read methods)',
          'Data Class: Encapsulate Field',
          'Switch Statements: Replace Conditional with Polymorphism',
          'Long Method: Extract Method'],
      why: 'The subclass refuses most of what it inherits, which also breaks substitutability (LSP): code expecting an ArrayList will crash. Holding a private ' + c('List') + ' and forwarding only the read operations gives the same behaviour without promising operations it cannot honour.' },
    { q: 'Which statement about refactoring is correct?',
      o: ['It changes the internal structure without changing observable behaviour, and relies on tests to show behaviour is unchanged.',
          'It is the same as adding new features, done at the same time to save effort.',
          'It should only be done once, at the end of a project.',
          'It usually changes the public API so callers must be updated.'],
      why: 'Refactoring is behaviour-preserving restructuring in small, safe steps. The tests are the safety net that proves nothing observable changed. Mixing it with feature work makes it impossible to tell which change broke something.' }
  ]);

  add(D.MCQ, 'patterns', [
    { q: 'A text editor lets users apply bold, italic, underline and highlight to a piece of text, in any combination, and new styles are planned. Which pattern fits best?',
      o: ['Decorator', 'Abstract Factory', 'Observer', 'Singleton'],
      why: 'Each style wraps the text, adds its own effect and delegates the rest, and styles can be stacked in any combination at runtime without a subclass per combination. That is Decorator.' },
    { q: 'A GUI toolkit must create buttons, checkboxes and menus that all match the current theme (Light, Dark or High-contrast). Mixing widgets from different themes must be impossible. Which pattern fits best?',
      o: ['Abstract Factory', 'Factory Method', 'Composite', 'Strategy'],
      why: 'There are <i>families</i> of related products that must be used together. An Abstract Factory has one create method per product (' + c('createButton()') + ', ' + c('createCheckbox()') + ', ' + c('createMenu()') + ') and one concrete factory per family, so a client holding a DarkFactory can only ever get dark widgets.' },
    { q: 'In an Observer implementation, ' + c('notifyObservers()') + ' loops over ' + c('for (Observer o : observers) o.update(this);') + '. One observer calls ' + c('subject.detach(this)') + ' inside its ' + c('update') + '. What happens, and what is the usual fix?',
      o: ['A ConcurrentModificationException; iterate over a copy of the list.',
          'Nothing goes wrong: detach takes effect after the loop finishes.',
          'A deadlock; make notifyObservers synchronized.',
          'The observer is notified twice; use a Set instead of a List.'],
      why: 'Removing from an ArrayList while a for-each loop is iterating over it makes the iterator fail fast with ConcurrentModificationException. Iterating over a snapshot (' + c('new ArrayList<>(observers)') + ') or using ' + c('CopyOnWriteArrayList') + ' lets observers attach and detach during notification safely.' },
    { q: 'What is wrong with this Singleton in a multi-threaded program?' + pre(`
public static Config getInstance() {
    if (instance == null) {
        instance = new Config();
    }
    return instance;
}`),
      o: ['Two threads can both see null and each create an instance.',
          'Nothing: static methods are always thread-safe.',
          'It causes a deadlock if two threads call it at once.',
          'It cannot compile because the constructor is private.'],
      why: 'The check and the assignment are not atomic. Two threads can pass the null check before either assigns, so two Config objects exist. Fixes: make the method ' + c('synchronized') + ', initialise eagerly (' + c('private static final Config INSTANCE = new Config();') + '), or use the holder-class idiom.' }
  ]);

  add(D.MCQ, 'async', [
    { q: 'A counter field is declared ' + c('private volatile int count;') + ' and two threads each run ' + c('count++') + ' 10,000 times. What is guaranteed about the final value?',
      o: ['Nothing beyond being at most 20,000: volatile gives visibility, not atomicity, so updates can be lost.',
          'It is exactly 20,000, because volatile makes ++ atomic.',
          'It is exactly 10,000, because each thread overwrites the other.',
          'The program deadlocks.'],
      why: c('count++') + ' is read, add, write. ' + c('volatile') + ' makes each read see the latest write, but two threads can still read the same value and both write value + 1. Use ' + c('AtomicInteger.incrementAndGet()') + ' or ' + c('synchronized') + ' for an atomic read-modify-write.' },
    { q: 'What does this print?' + pre(`
Thread t = new Thread(() ->
        System.out.println(Thread.currentThread().getName()));
t.run();`),
      o: ['main', 'Thread-0', 'Nothing: the thread was never started', 'It throws IllegalThreadStateException'],
      why: c('run()') + ' is just an ordinary method call, so the lambda runs on the <i>current</i> thread (main). Only ' + c('start()') + ' creates a new thread, which would print "Thread-0".' },
    { q: 'Which statement about ' + c('CompletableFuture') + ' is correct?',
      o: [c('thenCompose') + ' takes a function that returns another CompletableFuture and flattens the result; ' + c('thenApply') + ' takes a plain function.',
          c('thenApply') + ' always runs its function on a new thread.',
          c('join()') + ' returns immediately with null if the future has not finished.',
          c('thenCombine') + ' runs two futures one after the other.'],
      why: 'Using ' + c('thenApply') + ' with an async function would give ' + c('CompletableFuture<CompletableFuture<T>>') + '; ' + c('thenCompose') + ' chains it into a single future (like ' + c('flatMap') + '). ' + c('join()') + ' blocks until the result is ready. ' + c('thenCombine') + ' waits for two <i>independent</i> futures running concurrently and merges their results.' },
    { q: 'Which is <b>not</b> one of the four conditions that must all hold for a deadlock?',
      o: ['Starvation of low-priority threads', 'Mutual exclusion', 'Hold and wait', 'Circular wait'],
      why: 'The four (Coffman) conditions are mutual exclusion, hold and wait, no pre-emption, and circular wait. Breaking any one prevents deadlock; lock ordering breaks circular wait. Starvation is a different liveness problem, where a thread never gets scheduled.' }
  ]);

  add(D.MCQ, 'model', [
    { q: 'Students enrol in courses, and each student receives a mark for each course they take. Where should the mark live?',
      o: ['In an Enrolment class that links one Student to one Course.',
          'As a field of Student.',
          'As a field of Course.',
          'In a static Map<String, Integer> inside a Marks utility class.'],
      why: 'The mark belongs to the <i>relationship</i>, not to either end: a student has many marks and a course gives many marks. An association class (Enrolment) holding the student, the course and the mark models it exactly, with 1 Student — 0..* Enrolment — 1 Course.' },
    { q: 'An ' + c('Order') + ' has several ' + c('OrderLine') + 's. An order line makes no sense without its order, and deleting the order deletes its lines. Which relationship is this?',
      o: ['Composition', 'Aggregation', 'Inheritance', 'Dependency'],
      why: 'The lines are owned by exactly one order and share its lifetime: composition (filled diamond on Order). Aggregation would mean the parts exist independently, like products that appear in many orders.' },
    { q: 'A class diagram shows ' + c('Team 1 ——— 5..11 Player') + '. What does it mean?',
      o: ['Each team has between 5 and 11 players, and each player is in exactly one team.',
          'Each player is in between 5 and 11 teams.',
          'There is one team in total, with 5 to 11 players.',
          'Each team has 5 or 11 players, never in between.'],
      why: 'Read across the line: the multiplicity next to a class says how many of <i>that</i> class one object at the other end links to. Next to Player, 5..11 means a team links to 5 to 11 players; next to Team, 1 means each player links to exactly one team.' },
    { q: 'Gym members are Casual, Standard or Premium, and members change level often. Premium members can book classes up to 14 days ahead; others 3 days. How should the level be modelled?',
      o: ['As a field on Member referring to a MembershipLevel (an enum or Strategy) that answers how far ahead they can book.',
          'As subclasses CasualMember, StandardMember and PremiumMember.',
          'As a String field, with an if/else wherever booking rules are needed.',
          'As three separate lists of members in the Gym class.'],
      why: 'Something that changes at runtime should be a field, not the object’s class: a Java object cannot change class, so subclasses would force you to copy the member into a new object (and lose its identity). Putting the rule on the level object keeps the behaviour polymorphic without String comparisons.' }
  ]);

  add(D.MCQ, 'archfund', [
    { q: 'Which of these is an <b>architectural characteristic</b> rather than a functional requirement?',
      o: ['The system must keep working if one data centre goes offline.',
          'Customers can download an invoice as a PDF.',
          'Staff can refund an order up to 30 days after purchase.',
          'Users can reset their password by email.'],
      why: 'Architectural characteristics describe <i>how well</i> the system works (here, fault tolerance / availability), and they shape the structure. The others describe <i>what</i> the system does: features and business rules.' },
    { q: 'Which section of an Architecture Decision Record records the trade-offs, including the downsides of the chosen option?',
      o: ['Consequences', 'Context', 'Status', 'Title'],
      why: 'Context explains the forces and the options considered, the Decision states what was chosen, and <b>Consequences</b> records what follows from it, good and bad. An ADR that lists no negatives is a warning sign: every decision is a trade-off.' },
    { q: 'Which C4 diagram shows the mobile app, the API, the database and the message queue of one system, each with its technology?',
      o: ['Container diagram', 'System Context diagram', 'Component diagram', 'Code diagram'],
      why: 'The Container level zooms inside the system boundary to the separately deployable or runnable units and how they communicate. The Context level shows the system as one box; the Component level zooms inside a single container.' },
    { q: 'What is the difference between <b>fault tolerance</b> and <b>availability</b>?',
      o: ['Fault tolerance is continuing to work correctly when a part fails; availability is the proportion of time the system is usable.',
          'They are two names for the same characteristic.',
          'Availability is about handling sudden spikes in load; fault tolerance is about steady growth.',
          'Fault tolerance is about protecting data from attackers; availability is about response time.'],
      why: 'Fault tolerance is one way to achieve high availability (e.g. redundant instances take over when one crashes), but a system could also be highly available with no faults tolerated, simply because it rarely fails. Spikes vs growth is elasticity vs scalability.' },
    { q: 'In Mermaid sequence diagram syntax, which arrow shows an <b>asynchronous</b> message, where the sender does not wait for a reply?',
      o: [c('A-)B: OrderPlaced'), c('A->>B: placeOrder()'), c('A-->>B: orderId'), c('A-xB: request')],
      why: c('-)') + ' is the open-arrow async message. ' + c('->>') + ' is a synchronous call, ' + c('-->>') + ' (dashed) is a reply, and ' + c('-x') + ' shows a lost or failed message.' }
  ]);

  add(D.MCQ, 'styles', [
    { q: 'A video-streaming company has 30 development teams. Each team wants to deploy its own features several times a day, and the recommendations feature needs far more computing power than the rest. Which style fits best?',
      o: ['Microservices', 'Layered monolith', 'Modular monolith', 'A single serverless function'],
      why: 'Independent deployment per team and independent scaling of one hot part are the main reasons to accept the operational cost of microservices. A monolith (layered or modular) is deployed and scaled as a whole.' },
    { q: 'What is the <b>architecture sinkhole</b> anti-pattern?',
      o: ['Requests pass through layers that do nothing but forward them to the next layer.',
          'A database that every service writes to directly.',
          'An event that no consumer ever subscribes to.',
          'A serverless function that runs longer than its time limit.'],
      why: 'In a layered architecture, a sinkhole is a request that flows through the business layer (and others) with no logic applied, just pass-through calls. A few are normal; if most requests are like this, the closed layers are costing more than they are worth.' },
    { q: 'An insurance claim must go through validation, fraud check, assessment and payment in a fixed order, and if payment fails the earlier steps must be compensated. Which event-driven topology suits this best?',
      o: ['Mediator topology: a central orchestrator controls the order and handles errors.',
          'Broker topology: each service reacts to the previous event with no coordinator.',
          'A layered monolith with no events.',
          'Peer-to-peer polling between services.'],
      why: 'A mediator knows the whole workflow, so it can enforce the order, track state and trigger compensating actions when a step fails. A broker (choreography) is more decoupled and scalable, but error handling and a guaranteed order are harder because no one sees the whole process.' },
    { q: 'Which task is the <b>worst</b> fit for a serverless (functions-as-a-service) architecture?',
      o: ['Re-encoding a 4-hour video in one continuous job',
          'Resizing an image whenever one is uploaded',
          'Sending a welcome email when a user signs up',
          'Handling a webhook from a payment provider'],
      why: 'Functions are short-lived and have execution time limits (minutes, not hours). A long continuous job belongs in a container or batch service, or must be split into chunks. The others are short, event-triggered tasks, the ideal case.' },
    { q: 'In a microservices architecture, each service owns its own database. What is a direct consequence?',
      o: ['Operations that span services, like placing an order and reserving stock, need sagas or API composition instead of one database transaction.',
          'Services can join each other’s tables directly with SQL.',
          'All services must be written in the same programming language.',
          'The system becomes strongly consistent everywhere by default.'],
      why: 'Database-per-service keeps services decoupled and independently deployable, but there is no shared transaction any more. Cross-service updates use sagas (with compensating actions) and become eventually consistent; cross-service reads use API composition or replicated read models.' }
  ]);

  /* ===================== Section 2: short answer ======================== */

  add(D.SHORT, 'oo', [
    { m: 4,
      q: 'Is this valid inheritance? Conceptually justify your answer, and suggest a better design if it is not.' + pre(`
public class Stack<E> extends ArrayList<E> {
    public void push(E e) { add(e); }
    public E pop()        { return remove(size() - 1); }
    public E peek()       { return get(size() - 1); }
}`),
      model: '<p><b>No.</b> A stack is not an ArrayList: inheritance here is used to reuse code, not because the subclass honours the parent’s behaviour.</p>' + ul([
        'Stack inherits the whole public API of ArrayList: ' + c('add(int, E)') + ', ' + c('remove(int)') + ', ' + c('set') + ', ' + c('sort') + ' and so on. Any client can insert into the middle or reorder elements, which breaks the stack’s last-in-first-out invariant. The class cannot protect its own rules.',
        'It exposes the implementation choice: callers can come to depend on Stack being an ArrayList, so switching to a linked structure later breaks them.',
        'If Stack tried to fix this by overriding those methods to throw, it would become a Refused Bequest and break Liskov substitution for code expecting an ArrayList.',
        '<b>Better:</b> composition. Hold a ' + c('private final List<E> items = new ArrayList<>();') + ' and expose only ' + c('push') + ', ' + c('pop') + ', ' + c('peek') + ', ' + c('isEmpty') + ' and ' + c('size') + ', forwarding to the list. (Java’s own ' + c('java.util.Stack extends Vector') + ' is a well-known example of this mistake; ' + c('Deque') + ' is recommended instead.)']),
      must: ['Verdict: not valid', 'Inherited methods let clients break LIFO / the invariant', 'Exposes implementation / tight coupling to ArrayList', 'Composition (private list field, forwarding only stack operations) proposed'] },
    { m: 3,
      q: 'What does the following print? Explain the order, with reference to how Java chains constructors.' + pre(`
class A {
    A()      { System.out.print("A"); }
    A(int x) { this(); System.out.print("a" + x); }
}
class B extends A {
    B()      { super(1); System.out.print("B"); }
    B(int y) { System.out.print("b" + y); }
}

new B();
System.out.println();
new B(2);`),
      model: '<p>It prints <b>Aa1B</b> on the first line and <b>Ab2</b> on the second.</p>' + ul([
        c('new B()') + ' calls ' + c('super(1)') + ', i.e. ' + c('A(int)') + '. Its first statement, ' + c('this()') + ', runs ' + c('A()') + ', printing "A". Back in ' + c('A(int)') + ', "a1" is printed, and finally B’s body prints "B".',
        c('new B(2)') + ' has no explicit ' + c('super(...)') + ' or ' + c('this(...)') + ', so the compiler inserts ' + c('super()') + ': ' + c('A()') + ' prints "A", then B’s body prints "b2".',
        'Rule: every constructor’s first statement is ' + c('this(...)') + ' or ' + c('super(...)') + ' (implicitly ' + c('super()') + '), so the parent part of an object is always fully constructed before the child’s constructor body runs.']),
      must: ['Line 1: Aa1B', 'Line 2: Ab2', 'Explained the implicit super() call and that parent constructors run first'] },
    { m: 4,
      q: 'A game has characters. Some characters can fly, some can swim, some can do both, and some can do neither. All characters have a name and health and can take damage. A colleague proposes the classes ' + c('Character') + ', ' + c('FlyingCharacter') + ', ' + c('SwimmingCharacter') + ' and ' + c('FlyingSwimmingCharacter') + '.<br>' +
      'a) Explain why this hierarchy is a problem. (2 marks)<br>b) Propose a better design using abstract classes and/or interfaces, and show the class signatures for a Duck that can fly and swim. (2 marks)',
      model: '<p><b>a)</b> Java has single inheritance, so FlyingSwimmingCharacter cannot extend both FlyingCharacter and SwimmingCharacter: one of the two behaviours has to be copied into it (duplicated code). Every new ability (climb, burrow) doubles the number of combination classes, a <b>class explosion</b>. An ability is also fixed by class, so a character cannot gain or lose one at runtime.</p>' +
        '<p><b>b)</b> Put the shared state in an abstract class and make each ability an interface, so a class can combine any of them:</p>' + pre(`
public abstract class Character {
    private final String name;
    private int health;
    protected Character(String name, int health) { ... }
    public void takeDamage(int amount) { ... }
}

public interface Flyer  { void fly(); }
public interface Swimmer { void swim(); }

public class Duck extends Character implements Flyer, Swimmer {
    public Duck(String name) { super(name, 50); }
    public void fly()  { ... }
    public void swim() { ... }
}`) + '<p>(If abilities must change at runtime, hold them as fields instead, e.g. a ' + c('List<Ability>') + ' or a ' + c('MovementStrategy') + ': composition over inheritance.)</p>',
      must: ['Single inheritance forces duplication in the combined class', 'Class explosion as abilities are added', 'Abstract class for shared state (name, health, takeDamage)', 'Interfaces per ability; Duck extends Character implements Flyer, Swimmer'] }
  ]);

  add(D.SHORT, 'dbc', [
    { m: 4,
      q: 'Is this valid inheritance? Conceptually justify your answer.' + pre(`
public class Thermostat {
    /**
     * @precondition  10 <= t && t <= 30
     * @postcondition getTarget() == t
     */
    public void setTarget(double t) { ... }
    public double getTarget() { ... }
}

public class SmartThermostat extends Thermostat {
    /**
     * Rounds to the nearest half degree, which the hardware supports.
     * @precondition  5 <= t && t <= 35
     * @postcondition getTarget() == Math.round(t * 2) / 2.0
     */
    @Override
    public void setTarget(double t) { ... }
}`),
      model: '<p><b>No</b>, it is not valid inheritance.</p>' + ul([
        'The precondition is <b>weakened</b> (5–35 accepts every value 10–30 accepts, and more). That on its own is allowed.',
        'The postcondition is <b>not</b> the same or stronger. The parent promises ' + c('getTarget() == t') + ' exactly; the subclass only promises the nearest half degree. For ' + c('setTarget(21.3)') + ' the target becomes 21.5, which breaks the parent’s promise.',
        'So a client written against Thermostat (e.g. one that sets 21.3 and then checks or displays ' + c('getTarget()') + ') sees behaviour the parent’s contract rules out: SmartThermostat is not substitutable, an LSP violation.',
        'Fix: loosen the parent’s postcondition if rounding is acceptable for all thermostats (e.g. ' + c('|getTarget() − t| ≤ 0.25') + '), or do not make SmartThermostat a subtype.']),
      must: ['Verdict: not valid', 'Precondition weakened → allowed', 'Postcondition weakened (rounding breaks getTarget() == t), with an example value', 'Linked to LSP / clients of the parent'] },
    { m: 3,
      q: 'Explain the difference between <b>Design by Contract</b> and <b>defensive programming</b>. Give one situation where each is the better choice.',
      model: '<p>Under <b>Design by Contract</b>, responsibilities are split: the caller must establish the precondition, and the method then guarantees the postcondition. The method does <i>not</i> re-check its preconditions; a violated precondition is a bug in the caller. This keeps code simple and avoids repeated checks.</p>' +
        '<p>Under <b>defensive programming</b>, the method trusts nothing: it checks its inputs and state itself and handles bad values (throwing an exception, returning an error, using a default).</p>' +
        ul(['DbC suits <b>internal</b> code where the callers are your own trusted, tested modules, e.g. a private helper in a sorting algorithm that requires a non-empty array.',
            'Defensive programming suits <b>boundaries</b> where input comes from untrusted sources: a public API, user input, a file or a network request, e.g. validating a JSON request body before using it.']),
      must: ['DbC: caller ensures pre; supplier guarantees post; no re-checking', 'Defensive: method checks and handles invalid input itself', 'A sensible situation for each (trusted internal vs untrusted boundary)'] },
    { m: 4,
      q: 'A ' + c('BoundedQueue<T>') + ' holds at most ' + c('capacity') + ' items, fixed in the constructor, and has the methods ' + c('void enqueue(T item)') + ', ' + c('T dequeue()') + ' and ' + c('int size()') + '.<br>' +
      'Write a class invariant, and a precondition and postcondition for ' + c('enqueue') + ' and for ' + c('dequeue') + ', using Design by Contract.',
      model: pre(`
/** @invariant 0 <= size() && size() <= capacity */
public class BoundedQueue<T> {

    /**
     * @precondition  size() < capacity && item != null
     * @postcondition size() == old(size()) + 1
     *                && item is now the last element (the others unchanged, in order)
     */
    public void enqueue(T item) { ... }

    /**
     * @precondition  size() > 0
     * @postcondition size() == old(size()) - 1
     *                && result == old(first element)
     *                && the remaining elements are unchanged, in order
     */
    public T dequeue() { ... }
}`) + '<p>Marks go to the invariant bounding size, and to pre/postconditions that say what changes (size), what is returned (the old front element) and the order (FIFO). Whether null items are allowed is a design choice; state it either way.</p>',
      must: ['Invariant: 0 ≤ size ≤ capacity', 'enqueue pre: not full; post: size + 1 and item at the end', 'dequeue pre: not empty; post: size − 1 and returns the old front', 'Uses old(...) / states FIFO order'] }
  ]);

  add(D.SHORT, 'principles', [
    { m: 3,
      q: 'Which design principle does this method break? Explain why it matters, and rewrite it.' + pre(`
public class ShippingCalculator {
    public double shippingFor(Order o) {
        return o.getCustomer().getAddress().getCountry().getShippingRate()
               * o.getWeight();
    }
}`),
      model: '<p>It breaks the <b>Law of Demeter</b> (principle of least knowledge). ' + c('shippingFor') + ' may talk to its parameter ' + c('o') + ', but it then reaches through Customer, Address and Country: three objects it should not know about (a message chain).</p>' +
        '<p>It matters because ShippingCalculator is now coupled to the internal structure of four classes. If addresses move off Customer (e.g. each order gets its own delivery address), this code breaks, even though shipping rules did not change.</p>' + pre(`
public class Order {
    public double shippingRate() { return deliveryAddress.shippingRate(); }
    ...
}
public class Address {
    public double shippingRate() { return country.getShippingRate(); }
}

public class ShippingCalculator {
    public double shippingFor(Order o) {
        return o.shippingRate() * o.getWeight();
    }
}`) + '<p>Each class now only asks its direct neighbour (Hide Delegate: "tell, don’t ask").</p>',
      must: ['Named Law of Demeter / message chain', 'Explained the coupling to the structure of several classes', 'Rewrite with delegating methods so the calculator only talks to Order'] },
    { m: 4,
      q: 'Identify <b>two</b> SOLID principles this class breaks, explaining how. Then describe a better design.' + pre(`
public class ReportGenerator {
    public String generate(List<Sale> sales, String format) {
        double total = 0;
        for (Sale s : sales) total += s.getAmount();
        if (format.equals("CSV")) {
            return "total," + total;
        } else if (format.equals("HTML")) {
            return "<p>Total: " + total + "</p>";
        } else if (format.equals("JSON")) {
            return "{\\"total\\": " + total + "}";
        }
        throw new IllegalArgumentException(format);
    }
    public void saveToFile(String report, String path) { ... }
    public void emailTo(String report, String address) { ... }
}`),
      model: ul([
        '<b>Single Responsibility:</b> the class calculates figures, formats them in three ways, writes files and sends email. These change for unrelated reasons (a new statistic, a new format, a new mail server), so one class is edited by everyone.',
        '<b>Open-Closed:</b> adding a format (e.g. PDF) means editing the if/else chain in ' + c('generate') + ', instead of adding new code.',
        '<b>Better design:</b> a ' + c('SalesSummary') + ' (or ' + c('ReportCalculator') + ') computes the figures; a ' + c('ReportFormatter') + ' interface with ' + c('String format(SalesSummary s)') + ' has ' + c('CsvFormatter') + ', ' + c('HtmlFormatter') + ' and ' + c('JsonFormatter') + ' implementations (Strategy); and a ' + c('ReportSink') + ' interface (' + c('FileSink') + ', ' + c('EmailSink') + ') delivers the output. A new format is a new class.']),
      must: ['SRP violation explained (several reasons to change)', 'OCP violation explained (edit the conditional per format)', 'Formats as polymorphic classes / Strategy', 'Calculation, formatting and delivery separated'] },
    { m: 4,
      q: c('Duck') + ' has ' + c('quack()') + ' and ' + c('fly()') + '. ' + c('MallardDuck') + ' and ' + c('RedheadDuck') + ' inherit both. ' + c('RubberDuck') + ' overrides ' + c('fly()') + ' to do nothing and ' + c('quack()') + ' to squeak; ' + c('DecoyDuck') + ' overrides both to do nothing. Product now wants rocket-powered flying for some ducks, and wants a duck to be able to lose the ability to fly when injured.<br>' +
      'Explain what is wrong with the current design, name the principle that fixes it, and outline the new design.',
      model: ul([
        'Behaviour is inherited where it does not apply: RubberDuck and DecoyDuck override methods just to cancel them (Refused Bequest), and a client calling ' + c('fly()') + ' on a Duck may get a silent no-op. Each new kind of duck means checking and overriding every method again.',
        'Behaviour is fixed by class, so a duck cannot lose the ability to fly at runtime, and sharing rocket-flying between two unrelated duck classes would mean copying it.',
        '<b>Favour composition over inheritance</b> (encapsulate what varies, i.e. Strategy). Duck holds ' + c('FlyBehaviour fly') + ' and ' + c('QuackBehaviour quack') + ' fields and delegates: ' + c('performFly() { fly.fly(); }') + '.',
        'Implementations: ' + c('FlyWithWings') + ', ' + c('FlyNoWay') + ', ' + c('FlyRocketPowered') + '; ' + c('Quack') + ', ' + c('Squeak') + ', ' + c('MuteQuack') + '. ' + c('setFlyBehaviour(new FlyNoWay())') + ' handles the injured duck. A new behaviour is a new class, reusable by any duck.']),
      must: ['Overriding to cancel behaviour / Refused Bequest or LSP problem', 'Behaviour fixed at compile time; duplication across classes', 'Composition over inheritance / Strategy named', 'Behaviour interfaces with implementations, held as fields, swappable at runtime'] }
  ]);

  add(D.SHORT, 'java', [
    { m: 3,
      q: 'a) What does the following print? Explain. (2 marks)' + pre(`
static int f() {
    try {
        System.out.print("t");
        throw new IllegalStateException("x");
    } catch (RuntimeException e) {
        System.out.print("c");
        return 1;
    } finally {
        System.out.print("f");
    }
}

System.out.println(f());`) + 'b) What changes if the catch clause is ' + c('catch (IllegalArgumentException e)') + ' instead? (1 mark)',
      model: '<p><b>a)</b> It prints <b>tcf1</b>. "t" is printed, then IllegalStateException is thrown. It is a RuntimeException, so the catch block runs and prints "c". ' + c('return 1') + ' is pending, but the finally block always runs before the method actually returns, printing "f". Then ' + c('println') + ' prints the returned 1.</p>' +
        '<p><b>b)</b> IllegalStateException is not an IllegalArgumentException, so it is not caught. "t" is printed, the finally block still runs and prints "f", and the exception propagates out of ' + c('f()') + ' so ' + c('println') + ' never runs: the output is <b>tf</b> followed by the uncaught exception’s stack trace. (It still compiles, because unchecked exceptions need not be declared.)</p>',
      must: ['a) tcf1', 'finally runs before the pending return completes', 'b) tf, then the exception propagates (not caught, println never runs)'] },
    { m: 4,
      q: 'Write a generic static method ' + c('max') + ' that returns the largest element of a non-empty ' + c('List') + ', using the elements’ natural ordering.<br>' +
      'It must work for a ' + c('List<java.sql.Timestamp>') + ', where ' + c('Timestamp') + ' extends ' + c('java.util.Date') + ' and ' + c('Date implements Comparable<Date>') + '. Explain why the bound on your type parameter needs a wildcard.',
      model: pre(`
public static <T extends Comparable<? super T>> T max(List<? extends T> xs) {
    T best = xs.get(0);
    for (T x : xs) {
        if (x.compareTo(best) > 0) best = x;
    }
    return best;
}`) + ul([
        c('T extends Comparable<T>') + ' would require ' + c('Timestamp implements Comparable<Timestamp>') + '. It does not: it inherits ' + c('Comparable<Date>') + ' from Date, so a ' + c('List<Timestamp>') + ' would be rejected.',
        c('Comparable<? super T>') + ' accepts any T that can be compared with T <i>or with a supertype of T</i>. A Timestamp can be compared with any Date, so ' + c('compareTo(best)') + ' is safe. The comparator <i>consumes</i> T values, hence ' + c('super') + ' (PECS).',
        c('List<? extends T>') + ' lets the method read from a list of any subtype of T: the list is a producer.']),
      must: ['Correct signature with a bounded type parameter', 'Loop or stream comparing with compareTo', 'Explains why Comparable<T> fails for Timestamp (it implements Comparable<Date>)', '? super T justified (consumer / PECS)'] },
    { m: 4,
      q: 'A ' + c('ShoppingCart') + ' has ' + c('void add(String item, double price)') + ', ' + c('void remove(String item)') + ' (which throws ' + c('NoSuchElementException') + ' if the item is not in the cart) and ' + c('double total()') + '.<br>' +
      'Write <b>three</b> JUnit 5 tests that between them check the total after adding items, the total after removing an item, and the exception. Explain one thing that makes a unit test a good one.',
      model: pre(`
public class ShoppingCartTest {
    private ShoppingCart cart;

    @BeforeEach
    public void setUp() { cart = new ShoppingCart(); }

    @Test
    public void totalSumsAddedItems() {
        cart.add("apple", 1.50);
        cart.add("bread", 4.00);
        assertEquals(5.50, cart.total(), 0.001);
    }

    @Test
    public void removeReducesTotal() {
        cart.add("apple", 1.50);
        cart.add("bread", 4.00);
        cart.remove("apple");
        assertEquals(4.00, cart.total(), 0.001);
    }

    @Test
    public void removingMissingItemThrows() {
        assertThrows(NoSuchElementException.class, () -> cart.remove("milk"));
    }
}`) + '<p>Good unit tests are <b>independent</b> (a fresh cart per test via ' + c('@BeforeEach') + ', so order does not matter), test <b>one behaviour</b> each with a descriptive name, and are <b>deterministic</b>. Doubles are compared with a tolerance (delta).</p>',
      must: ['Three tests with @Test, each checking one behaviour', 'assertEquals with a delta for doubles', 'assertThrows with a lambda for the exception', 'A valid quality of good tests (independence, one behaviour, repeatable, clear names)'] }
  ]);

  add(D.SHORT, 'fp', [
    { m: 4,
      q: 'Rewrite the following using the Streams API, so that it has no explicit loops and no mutable local lists.' + pre(`
List<Student> enrolled = new ArrayList<>();
for (Student s : students) {
    if (s.getCourses().contains("COMP2511")) {
        enrolled.add(s);
    }
}
enrolled.sort((a, b) -> Double.compare(b.getWam(), a.getWam()));
List<String> top = new ArrayList<>();
for (int i = 0; i < Math.min(3, enrolled.size()); i++) {
    top.add(enrolled.get(i).getName());
}`) + 'Then explain why ' + c('limit(3)') + ' is placed where it is in your answer.',
      model: pre(`
List<String> top = students.stream()
        .filter(s -> s.getCourses().contains("COMP2511"))
        .sorted(Comparator.comparingDouble(Student::getWam).reversed())
        .limit(3)
        .map(Student::getName)
        .collect(Collectors.toList());     // or .toList() in Java 16+`) +
        '<p>' + c('limit(3)') + ' must come <i>after</i> ' + c('sorted') + ': limiting first would take any three enrolled students and then sort just those, instead of the three highest WAMs. It comes before ' + c('map') + ' only for efficiency (names are only extracted for the three kept); after ' + c('map') + ' would give the same result. The stream also copes with fewer than three students with no ' + c('Math.min') + ' needed.</p>',
      must: ['filter on COMP2511', 'sorted by WAM descending (comparator reversed)', 'limit(3) then map to names, collected to a list', 'Explained limit must follow sorted'] },
    { m: 3,
      q: 'a) What do the two print statements output? Explain. (2 marks)' + pre(`
Function<Integer, Integer> inc = x -> x + 1;
Function<Integer, Integer> dbl = x -> x * 2;

System.out.println(inc.andThen(dbl).apply(3));
System.out.println(inc.compose(dbl).apply(3));`) +
      'b) Give the most suitable functional interface type, and a lambda, for "takes two Strings and returns the longer one". (1 mark)',
      model: '<p><b>a)</b> <b>8</b> then <b>7</b>. ' + c('f.andThen(g)') + ' applies f first, then g: (3 + 1) × 2 = 8. ' + c('f.compose(g)') + ' applies g first, then f: 3 × 2 + 1 = 7. Both return a new Function without calling anything until ' + c('apply') + '.</p>' +
        '<p><b>b)</b> ' + c('BinaryOperator<String> longer = (a, b) -> a.length() >= b.length() ? a : b;') + '. Both inputs and the output are the same type, so BinaryOperator is more specific than ' + c('BiFunction<String, String, String>') + ' (which is also acceptable).</p>',
      must: ['8, with andThen applying inc first', '7, with compose applying dbl first', 'BinaryOperator<String> (or BiFunction) with a correct lambda'] },
    { m: 3,
      q: 'A colleague wrote:' + pre(`
int total = 0;
List<Integer> doubled = nums.stream()
        .map(x -> { total += x; return x * 2; })
        .collect(Collectors.toList());`) +
      'Explain why this does not compile, why the "fix" of making ' + c('total') + ' a one-element array is still poor style, and rewrite it properly.',
      model: ul([
        'It does not compile because a lambda may only capture local variables that are <b>effectively final</b>, and ' + c('total += x') + ' reassigns ' + c('total') + '.',
        'Using ' + c('int[] total = {0}') + ' compiles, but it is a <b>side effect</b> inside ' + c('map') + '. Functional pipelines should be stateless: the result now depends on how often and in which order ' + c('map') + ' runs, so it breaks under ' + c('parallelStream()') + ' (a race on the array) and is easy to break with laziness (no terminal operation means total stays 0).',
        'Rewrite as two separate, pure pipelines:']) + pre(`
int total = nums.stream().mapToInt(Integer::intValue).sum();
List<Integer> doubled = nums.stream().map(x -> x * 2).collect(Collectors.toList());`),
      must: ['Captured locals must be effectively final', 'Side effects in map are fragile (laziness / parallel race)', 'Rewrite with sum() for the total and a pure map for the list'] }
  ]);

  add(D.SHORT, 'smells', [
    { m: 5,
      q: 'Identify <b>three</b> distinct code smells in this code. For each, say where it occurs and name a refactoring that resolves it. Then name a design pattern suited to the member rules, and say why. (5 marks)' + pre(`
public class LibraryManager {
    public String checkout(Member m, Book b, String memberType) {
        if (b.getStatus().equals("ON_LOAN") || b.getStatus().equals("LOST")) {
            return "Unavailable";
        }
        int days;
        double maxFines;
        if (memberType.equals("STUDENT"))    { days = 14; maxFines = 5.0; }
        else if (memberType.equals("STAFF")) { days = 28; maxFines = 20.0; }
        else                                 { days = 7;  maxFines = 0.0; }

        if (m.getAccount().getFines().getTotal() > maxFines) {
            return "Blocked";
        }
        b.setStatus("ON_LOAN");
        b.setDueDate(LocalDate.now().plusDays(days));
        m.getLoans().add(b);
        return "OK, due " + b.getDueDate();
    }
}`),
      model: ul([
        '<b>Switch statements on a type code</b>: ' + c('memberType') + ' is a String compared in an if/else chain, and passed separately from the Member it describes. A new member type means editing this method. → <i>Replace Type Code with Strategy/Subclasses</i> (Replace Conditional with Polymorphism).',
        '<b>Primitive obsession</b>: book status is a String ("ON_LOAN", "LOST"), so typos compile and valid statuses are not listed anywhere; the loan rules are bare numbers (14, 5.0, 28…). → <i>Replace Type Code with an enum</i> (' + c('BookStatus') + '), named constants.',
        '<b>Message chain</b> (Law of Demeter): ' + c('m.getAccount().getFines().getTotal()') + '. → <i>Hide Delegate</i>: ' + c('m.outstandingFines()') + '.',
        '<b>Feature envy / inappropriate intimacy</b>: the manager sets the book’s status and due date and adds directly to the member’s internal loans list. → <i>Move Method</i>: ' + c('b.lendUntil(date)') + ', ' + c('m.addLoan(b)') + ' (and Encapsulate Collection).',
        '<b>Pattern: Strategy.</b> Member holds a ' + c('MembershipPolicy') + ' (StudentPolicy, StaffPolicy, PublicPolicy) with ' + c('int loanDays()') + ' and ' + c('double maxFines()') + '. checkout asks ' + c('m.getPolicy()') + ' instead of branching. A new member type is a new class (Open-Closed), and a member’s policy can change at runtime (a student becomes staff) without changing their object.']),
      must: ['Three distinct smells, each named precisely', 'Each located in the code', 'A correct refactoring for each', 'Strategy (or polymorphism) for member rules, with roles', 'Justified by OCP and/or runtime change'] },
    { m: 4,
      q: 'For each snippet, name the code smell and a refactoring that fixes it. (1 mark each)' +
        '<p>a)</p>' + pre(`
public class Point3D { public double x, y, z; }

public class Geometry {
    public static double distance(Point3D a, Point3D b) { ... uses a.x, b.x ... }
    public static Point3D translate(Point3D p, double dx, double dy, double dz) { ... }
}`) +
        '<p>b)</p>' + pre(`
public class OrderManager {
    private OrderRepository repo;
    public Order find(String id)  { return repo.find(id); }
    public void save(Order o)     { repo.save(o); }
    public void delete(String id) { repo.delete(id); }
}`) +
        '<p>c)</p>' + pre(`
public class RoutePlanner {
    private Map<Stop, Integer> distances;   // only used inside findRoute()
    private Set<Stop> visited;              // only used inside findRoute()
    public Route findRoute(Stop from, Stop to) { ... }
    public List<Stop> allStops() { ... }
}`) +
        '<p>d)</p>' + pre(`
public double checkoutTotal(Cart cart) {
    // add up the prices, skipping free items
    ... 12 lines ...
    // apply the member discount
    ... 9 lines ...
    // add shipping for orders under $50
    ... 7 lines ...
}`),
      model: ul([
        '<b>a) Data Class</b> (with Feature Envy in Geometry): Point3D is only public fields, and other classes do all its work. → <i>Encapsulate Field</i>, then <i>Move Method</i>: ' + c('a.distanceTo(b)') + ', ' + c('p.translate(dx, dy, dz)') + '.',
        '<b>b) Middle Man</b>: OrderManager only forwards to the repository. → <i>Remove Middle Man</i> (clients use the repository directly), or give OrderManager real responsibilities.',
        '<b>c) Temporary Field</b>: fields that are only meaningful during one algorithm and are otherwise empty or stale. → <i>Extract Class</i> (a ' + c('RouteSearch') + ' method object holding them as locals or fields), or make them local variables.',
        '<b>d) Long Method / Comments</b>: comments label the sections of a long method. → <i>Extract Method</i> for each section (' + c('itemsSubtotal') + ', ' + c('applyMemberDiscount') + ', ' + c('shippingFor') + '), so the names replace the comments.']),
      must: ['a) Data Class → encapsulate + move behaviour in', 'b) Middle Man → Remove Middle Man', 'c) Temporary Field → Extract Class / locals', 'd) Long Method or Comments → Extract Method'] },
    { m: 3,
      q: 'A team lead says: "This module is a mess, let’s just rewrite it from scratch over the next sprint instead of refactoring." Explain the difference between refactoring and rewriting, why automated tests matter before refactoring, and one risk of the rewrite.',
      model: ul([
        '<b>Refactoring</b> improves internal structure in small, behaviour-preserving steps (Extract Method, Move Method…), with the system working after every step. <b>Rewriting</b> replaces the code wholesale, so behaviour is re-implemented, not preserved.',
        '<b>Tests</b> are what make refactoring safe: run them after each small step and any change in behaviour shows up immediately, close to its cause. Without them, a "refactor" is just an untested change. If the module has no tests, write characterisation tests first.',
        '<b>Rewrite risk:</b> old code contains years of bug fixes and edge cases that nobody documented. The rewrite loses them, takes longer than planned, and in the meantime two versions must be maintained. Refactoring delivers improvements incrementally instead.']),
      must: ['Refactoring = small behaviour-preserving steps; rewrite = replace wholesale', 'Tests detect behaviour changes after each step', 'A real risk of rewriting (lost edge cases, schedule, no working system in between)'] }
  ]);

  add(D.SHORT, 'patterns', [
    { m: 3,
      q: 'Which design pattern best fits this scenario? Justify your answer by mapping the pattern’s roles onto the scenario.<br><i>A smart-home hub monitors sensors. When the front-door sensor detects the door opening, the hallway lights turn on, the security camera starts recording, and a notification is pushed to the owner’s phone. Owners can add or remove devices from this behaviour at any time from the app.</i>',
      model: '<p><b>Observer.</b></p>' + ul([
        '<b>Subject:</b> the door sensor (' + c('DoorSensor') + '), which keeps a list of observers with ' + c('attach') + '/' + c('detach') + ' and calls ' + c('notifyObservers()') + ' when it detects a change.',
        '<b>Observer:</b> an interface such as ' + c('SensorListener') + ' with ' + c('void update(SensorEvent e)') + '.',
        '<b>Concrete observers:</b> ' + c('HallwayLights') + ', ' + c('SecurityCamera') + ', ' + c('PhoneNotifier') + ', each reacting in its own way.',
        'Fits because one change must trigger many independent reactions, the sensor does not need to know what the devices are (loose coupling), and devices are added and removed at runtime by attaching and detaching.']),
      must: ['Observer named', 'Subject, observer interface and concrete observers mapped', 'Justified: one-to-many, loose coupling, attach/detach at runtime'] },
    { m: 4,
      q: 'Identify <b>two</b> problems with this Singleton and write a corrected version.' + pre(`
public class Logger {
    private static Logger instance;
    private final List<String> lines = new ArrayList<>();

    public Logger() { }

    public static Logger getInstance() {
        if (instance == null) {
            instance = new Logger();
        }
        return instance;
    }

    public void log(String msg) { lines.add(msg); }
}`),
      model: ul([
        '<b>Public constructor:</b> anyone can write ' + c('new Logger()') + ', so nothing guarantees a single instance. It must be ' + c('private') + '.',
        '<b>Lazy initialisation is not thread-safe:</b> two threads can both see ' + c('instance == null') + ' and create two loggers, one of which loses its lines.',
        '<b>The shared list is not thread-safe:</b> concurrent ' + c('log') + ' calls on an ArrayList can lose entries or corrupt it. A Singleton is global shared state, so its own methods must be safe to call from several threads.']) + pre(`
public class Logger {
    private static final Logger INSTANCE = new Logger();   // eager: thread-safe
    private final List<String> lines = new ArrayList<>();

    private Logger() { }

    public static Logger getInstance() { return INSTANCE; }

    public synchronized void log(String msg) { lines.add(msg); }
}`) + '<p>(A ' + c('synchronized') + ' lazy ' + c('getInstance') + ', or the holder-class idiom, also fixes creation.)</p>',
      must: ['Public constructor allows more instances', 'Unsynchronised lazy init can create two instances', 'Corrected code: private constructor and thread-safe creation', 'Bonus/alternative: log() made thread-safe'] },
    { m: 5,
      q: 'A navigation app calculates a route between two places by <b>car</b>, <b>bike</b> or <b>walking</b>, with public transport coming soon. Users can switch mode halfway through a journey, and the route is recalculated with the new mode.<br>' +
      'a) Name the most suitable pattern and map its roles. (2 marks)<br>b) Write the interface, one concrete class (the body can be a comment) and the ' + c('Navigator') + ' class, showing how the mode is switched at runtime. (3 marks)',
      model: '<p><b>a) Strategy.</b> Context: ' + c('Navigator') + '. Strategy: a ' + c('RouteStrategy') + ' interface with ' + c('Route buildRoute(Location from, Location to)') + '. Concrete strategies: ' + c('DrivingStrategy') + ', ' + c('CyclingStrategy') + ', ' + c('WalkingStrategy') + ' (and later ' + c('TransitStrategy') + '). The algorithm varies and is chosen and swapped at runtime, and new modes are added without changing Navigator.</p>' +
        '<p><b>b)</b></p>' + pre(`
public interface RouteStrategy {
    Route buildRoute(Location from, Location to);
}

public class CyclingStrategy implements RouteStrategy {
    public Route buildRoute(Location from, Location to) {
        // prefer bike lanes, avoid highways
    }
}

public class Navigator {
    private RouteStrategy strategy;
    private Location destination;

    public Navigator(RouteStrategy strategy, Location destination) {
        this.strategy = strategy;
        this.destination = destination;
    }

    public void setStrategy(RouteStrategy strategy) { this.strategy = strategy; }

    public Route routeFrom(Location current) {
        return strategy.buildRoute(current, destination);
    }
}

// switching halfway:
nav.setStrategy(new WalkingStrategy());
Route r = nav.routeFrom(gps.currentLocation());`),
      must: ['Strategy named', 'Context, strategy interface and concrete strategies mapped', 'Interface with a route method', 'Navigator holds the strategy as a field and delegates', 'Setter (or equivalent) used to switch at runtime'] }
  ]);

  add(D.SHORT, 'async', [
    { m: 4,
      q: 'Two consumer threads call ' + c('take()') + ' and one producer thread calls ' + c('put()') + ' on this queue.' + pre(`
public class TaskQueue {
    private final Queue<String> tasks = new LinkedList<>();

    public synchronized void put(String t) {
        tasks.add(t);
        notifyAll();
    }

    public synchronized String take() throws InterruptedException {
        if (tasks.isEmpty()) {
            wait();
        }
        return tasks.remove();
    }
}`) + 'a) Describe how a consumer can crash with ' + c('NoSuchElementException') + '. (2 marks)<br>b) Fix it, and name a library class that would avoid writing this by hand. (2 marks)',
      model: '<p><b>a)</b> Both consumers find the queue empty and call ' + c('wait()') + ', releasing the lock. The producer adds one task and calls ' + c('notifyAll()') + ', waking both. Consumer 1 reacquires the lock first and removes the task. Consumer 2 then reacquires the lock and continues <i>after</i> the ' + c('if') + ', without re-checking, so ' + c('tasks.remove()') + ' on an empty queue throws. (Spurious wake-ups, where wait returns with no notify at all, cause the same failure.)</p>' +
        '<p><b>b)</b> Re-check the condition in a loop after every wake-up:</p>' + pre(`
public synchronized String take() throws InterruptedException {
    while (tasks.isEmpty()) {
        wait();
    }
    return tasks.remove();
}`) + '<p>Or use ' + c('java.util.concurrent.BlockingQueue') + ' (e.g. ' + c('LinkedBlockingQueue') + '), whose ' + c('put') + ' and ' + c('take') + ' do the waiting correctly.</p>',
      must: ['Both consumers woken by notifyAll; only one task', 'Second consumer does not re-check after waking', 'Fix: while loop around wait()', 'BlockingQueue named'] },
    { m: 3,
      q: 'Explain the difference between <b>concurrency</b> and <b>parallelism</b>. Then explain the difference between <b>blocking</b> and <b>non-blocking</b> I/O, with an example of where non-blocking I/O helps.',
      model: ul([
        '<b>Concurrency</b> is structuring a program as several tasks that are in progress at the same time and can interleave; on a single core they take turns. <b>Parallelism</b> is tasks literally executing at the same instant on multiple cores. Concurrency is about dealing with many things; parallelism is about doing many things at once.',
        '<b>Blocking I/O:</b> the calling thread waits, doing nothing, until the read or request completes. <b>Non-blocking/asynchronous I/O:</b> the call returns immediately, and the result is delivered later through a callback, future or event, so the thread can do other work meanwhile.',
        '<b>Example:</b> a web server handling 10,000 slow client connections. With blocking I/O it needs a thread per connection (lots of memory, mostly idle). With non-blocking I/O, a few threads serve them all, reacting when data arrives. Similarly, a UI stays responsive while a download runs.']),
      must: ['Concurrency: interleaved progress; parallelism: simultaneous execution', 'Blocking waits vs non-blocking returns immediately with callback/future', 'A sensible example (server with many connections, responsive UI)'] },
    { m: 4,
      q: 'This method makes two independent remote calls, each taking about one second.' + pre(`
public ProductView view(String id) {
    Price price = pricing.fetchPrice(id);
    Stock stock = inventory.fetchStock(id);
    return new ProductView(price, stock);
}`) + 'Rewrite it with ' + c('CompletableFuture') + ' so the calls run concurrently, and show the price as "unavailable" (use ' + c('Price.UNKNOWN') + ') if the pricing call fails. Explain why it is now roughly twice as fast.',
      model: pre(`
public CompletableFuture<ProductView> view(String id) {
    CompletableFuture<Price> price = CompletableFuture
            .supplyAsync(() -> pricing.fetchPrice(id))
            .exceptionally(ex -> Price.UNKNOWN);
    CompletableFuture<Stock> stock = CompletableFuture
            .supplyAsync(() -> inventory.fetchStock(id));

    return price.thenCombine(stock, ProductView::new);
}`) + '<p>Both ' + c('supplyAsync') + ' calls start immediately on pool threads, so the two one-second waits overlap: about 1 s in total instead of 2 s. ' + c('thenCombine') + ' runs when <i>both</i> futures are complete and builds the view from their results. ' + c('exceptionally') + ' replaces a failed price with the fallback, so one failing service does not fail the whole page. A caller that must have the value now can call ' + c('view(id).join()') + '.</p>',
      must: ['Two supplyAsync calls started before waiting', 'thenCombine (or allOf) to merge results', 'exceptionally / handle for the pricing fallback', 'Explains overlap of the two waits (~1 s vs ~2 s)'] }
  ]);

  /* ===================== Section 4: architecture ======================== */

  add(D.ARCH, 'archfund', [
    { m: 4,
      q: 'A university is building an online exam-supervision platform. Requirements include: <i>"up to 15,000 students sit exams at the same time at 9am in exam week"</i>, <i>"an exam must not be interrupted if one server fails"</i>, <i>"webcam recordings contain sensitive personal data"</i> and <i>"the platform must plug into the university’s existing learning management system"</i>.<br>' +
        'Identify <b>four</b> architectural characteristics this system needs, and justify each from the requirements.',
      model: ul([
        '<b>Elasticity</b> (or scalability): 15,000 concurrent students at a fixed time is a large, predictable burst; capacity must rise for exam week and fall afterwards.',
        '<b>Fault tolerance</b> (and availability): an exam must continue if a server fails, so there must be redundancy and failover with no lost progress.',
        '<b>Security</b> (and privacy): recordings are sensitive personal data, needing access control, encryption in transit and at rest, and retention rules.',
        '<b>Interoperability</b>: it must integrate with the existing LMS (single sign-on, exam lists, results).',
        'Also acceptable with justification: performance (low-latency video), auditability, deployability (no releases during exam week).']),
      must: ['Four distinct characteristics', 'Each tied to a specific requirement in the scenario', 'Correct terminology (e.g. elasticity vs scalability, fault tolerance vs availability)'] },
    { m: 4,
      q: 'A team of six developers is starting a new event-ticketing platform. After discussion, they decide to build a <b>modular monolith</b> rather than microservices, with modules for Events, Tickets, Payments and Accounts. Write an <b>Architectural Decision Record</b> for this decision.',
      model: pre(`
Title:  ADR 001: Build the ticketing platform as a modular monolith
Status: Accepted (25 Nov 2026)

Context:
  Six developers, one team, a first release in four months. The domain
  splits naturally into Events, Tickets, Payments and Accounts, but the
  boundaries may still move as we learn. Load is spiky around big on-sales.
  Options considered: layered monolith, modular monolith, microservices.

Decision:
  We will build a single deployable application organised into domain
  modules (events, tickets, payments, accounts). Modules talk only through
  each other's public interfaces, enforced by package visibility and
  architecture tests. Each module owns its own database tables.

Consequences:
  + One build, one deployment, simple local development and debugging.
  + Transactions across modules are ordinary database transactions.
  + Clear module boundaries let us extract a service later if needed.
  - The whole application scales as one unit, so on-sales mean scaling
    everything, not just Tickets.
  - Boundaries need discipline; without enforcement they erode.
  - One bad release can take down every module.`) +
        '<p>The key marks are a context that states the forces and the options considered, a decision in active voice, and honest consequences including the negatives.</p>',
      must: ['Title and status', 'Context: team size/timeline/domain forces and options considered', 'Decision clearly stated (modules, boundaries)', 'Consequences with positives and negatives'] },
    { m: 4,
      q: 'A gym chain’s system has a member mobile app, a staff web portal, a backend API, a PostgreSQL database, and integrations with a payment provider and an SMS gateway.<br>' +
        'a) List what appears on a <b>C4 System Context</b> diagram for this system. (2 marks)<br>b) Describe what a <b>C4 Component</b> diagram of the backend API might show. (2 marks)',
      model: '<p><b>a)</b> The gym system as a <b>single box</b>; the people who use it: <b>members</b> and <b>gym staff</b>; and the <b>external systems</b> it depends on: the payment provider and the SMS gateway. Each arrow is labelled with what it is for (e.g. "Books classes using", "Takes payments via"). No apps, API or database are shown: those are internal and belong on the Container diagram.</p>' +
        '<p><b>b)</b> It zooms into the API container and shows its main components and their responsibilities, e.g. a ' + c('MembershipController') + ' and ' + c('BookingController') + ' handling HTTP requests; ' + c('Membership Service') + ', ' + c('Booking Service') + ' and ' + c('Billing Service') + ' holding the business rules; repositories that access PostgreSQL; and adapters (' + c('Payment Gateway Client') + ', ' + c('SMS Notifier') + ') that call the external systems. Arrows show which component uses which, with the database and external systems drawn outside the container.</p>',
      must: ['Context: system as one box', 'Context: people (members, staff) and external systems (payments, SMS)', 'Component: zoom inside the API container', 'Component: named components with responsibilities and their relationships'] },
    { m: 3,
      q: '"Everything in software architecture is a trade-off." Explain this statement using an example of two architectural characteristics that pull against each other.',
      model: '<p>There is no best architecture in general: each decision improves some characteristics by giving up others, so an architect must choose based on which characteristics matter most for <i>this</i> system and record why (the "why" is more important than the "how").</p>' +
        '<p><b>Example: security vs performance.</b> Encrypting every request, validating tokens on every call and routing traffic through a gateway protects data, but each step adds latency. A banking system accepts the cost; an internal analytics dashboard might not.</p>' +
        '<p>Other good examples: scalability vs simplicity (microservices scale independently but are much harder to run); consistency vs availability in distributed data; fault tolerance vs cost (redundant servers).</p>',
      must: ['No universally best option: improving one characteristic costs another', 'A concrete pair of competing characteristics', 'Explained how the choice depends on the system’s priorities'] }
  ]);

  add(D.ARCH, 'styles', [
    { m: 3,
      q: 'Explain which architectural style is most suitable, and justify it with reference to the style’s characteristics.<br><i>A local council needs a portal where residents register their pets and pay an annual fee. Three developers will build it in two months. Traffic is low and steady (a few hundred registrations a week), and the budget for hosting and operations is small.</i>',
      model: '<p><b>Layered monolith.</b></p>' + ul([
        'Simple to build, test and deploy as one unit: suits a small team and a short timeline.',
        'Low and steady load means there is no need for independent scaling or elasticity.',
        'Cheapest to host and operate: one application and one database, no broker or service mesh.',
        'Trade-off: it can become tangled as it grows, but the scope here is small. (A modular monolith is also defensible.)']),
      must: ['Chose a (layered or modular) monolith', 'Small team / short timeline / simplicity', 'Low steady load and low budget', 'Acknowledged a trade-off'] },
    { m: 3,
      q: 'Explain which architectural style is most suitable, and justify it with reference to the style’s characteristics.<br><i>An agriculture company has 50,000 soil sensors that each send a reading every minute. Irrigation control, frost alerts and long-term analytics must all react to the same readings, independently. New uses of the data (e.g. fertiliser recommendations) are added every few months.</i>',
      model: '<p><b>Event-driven architecture</b> (broker topology).</p>' + ul([
        'Readings are published as events to a broker; irrigation, alerting and analytics subscribe and react asynchronously.',
        'A high-volume stream (about 830 readings a second) suits asynchronous processing, scaled by adding consumers.',
        'Producers do not know their consumers, so fertiliser recommendations can be added as a new subscriber with no change to the sensors or existing services.',
        'Trade-off: harder to test and trace end to end, and the system is eventually consistent.']),
      must: ['Chose event-driven', 'Asynchronous, high-volume, many consumers of the same events', 'New consumers added without changing producers', 'Acknowledged a trade-off'] },
    { m: 4,
      q: 'An online store is being split into microservices: <b>Catalogue</b>, <b>Cart</b>, <b>Orders</b> and <b>Payments</b>, each with its own database.<br>' +
        'a) Why should each service own its own database, rather than all sharing one? (2 marks)<br>b) Placing an order must create the order, take payment, and cancel the order if payment fails. Explain how this is done without a single database transaction. (2 marks)',
      model: '<p><b>a)</b> A shared database couples services through the schema: one team’s table change can break other services, and services cannot be deployed or scaled independently, which removes the main benefit of microservices. With database-per-service, each service hides its data behind its API, can choose the storage that suits it, and can change its schema freely.</p>' +
        '<p><b>b)</b> Use a <b>saga</b>: a sequence of local transactions, each in one service, linked by events or by an orchestrator. Orders creates the order as PENDING and publishes OrderCreated; Payments charges the card and publishes PaymentSucceeded or PaymentFailed; Orders then marks the order CONFIRMED, or runs the <b>compensating action</b> (cancel the order). The system is eventually consistent: for a short time the order is PENDING.</p>',
      must: ['Shared DB couples schemas / blocks independent deployment and scaling', 'Each service owns and hides its data', 'Saga of local transactions (choreography or orchestration)', 'Compensating action on failure; eventual consistency'] },
    { m: 4,
      q: 'A company’s eight-year-old monolith is slowing down development, and it wants to move to microservices without a risky "big bang" rewrite. Describe an incremental approach, and give <b>two</b> risks to manage along the way.',
      model: '<p>Use the <b>strangler fig</b> approach:</p>' + ul([
        'Put a routing layer (an API gateway or proxy) in front of the monolith, so all requests go through it.',
        'Pick one well-bounded, valuable area (e.g. Notifications), build it as a new service, and route its requests to the service instead of the monolith.',
        'Move its data to the service’s own database, and remove the old code from the monolith.',
        'Repeat area by area. The monolith shrinks until it can be retired, and the system works throughout. Modularising the monolith first makes the boundaries easier to find.']) +
        '<p><b>Risks:</b> keeping data consistent while two systems share or sync it during migration; extra network latency and failure points for calls that used to be in-process; running and monitoring a distributed system (logging, tracing, deployments) requires skills and tooling the team may not have; and drawing the service boundaries in the wrong place, which creates chatty, tightly coupled services.</p>',
      must: ['Incremental extraction behind a routing layer (strangler fig)', 'One bounded area at a time, with its own data, monolith keeps working', 'Two relevant risks'] },
    { m: 5,
      q: '<b>Evaluate this decision.</b> A four-person startup building a booking app for hair salons started with <b>twelve microservices</b> (users, salons, stylists, services, bookings, reminders, reviews, payments, search, images, admin, reporting), each with its own repository, database and deployment pipeline. Six months in, simple features take weeks, most bugs involve calls between services, and the cloud bill is high, while traffic is a few hundred bookings a day.<br>' +
        'Identify <b>three</b> problems with the decision, and recommend what they should do now.',
      model: ul([
        '<b>Operational complexity far beyond the team’s size:</b> twelve pipelines, databases and deployments for four people. Most time goes on infrastructure, not features.',
        '<b>Fine-grained services with chatty communication:</b> a simple feature like "book a stylist for a service" spans several services, so it needs coordinated changes and releases, and most bugs are now distributed-system bugs (timeouts, partial failures, inconsistent data across databases).',
        '<b>No benefit that pays for the cost:</b> a few hundred bookings a day needs no independent scaling, and one team does not need independent deployment. Meanwhile twelve databases and services cost money even when idle.',
        'Also valid: service boundaries were guessed before the domain was understood; cross-service transactions such as booking and payment need sagas.',
        '<b>Recommendation:</b> consolidate into a <b>modular monolith</b>, keeping the domain boundaries as modules with clear interfaces (e.g. Salons, Bookings, Payments, Accounts), one deployment and one database with separate schemas. Extract a service later only when a concrete need appears (e.g. image processing as a serverless function).']),
      must: ['Three distinct problems drawn from the scenario', 'Team size vs operational overhead', 'Chatty / distributed bugs from overly fine-grained services', 'Costs without the scaling or deployment benefits', 'Recommends consolidating into a (modular) monolith, with justification'] }
  ]);

  /* ===================== Section 4: sequence diagrams =================== */

  var SEQ_MUST = ['Every participant declared, actors as actor', 'Messages in the right order, with calls (->>) and replies (-->>)'];

  addList(D.SEQ, [
    { q: 'A library member borrows books at a self-service kiosk. The member scans their library card, and the Kiosk asks the Loan Service to start a session; the Loan Service fetches the member’s details from the Member Service. If the member owes more than $10 in fines, the kiosk shows "Please see the front desk" and the session ends. Otherwise the member scans one or more books. For each book, the Loan Service checks the Catalogue: if the book is available, the Loan Service creates a loan with a due date and the Catalogue marks the book as on loan, and the kiosk shows the due date; if the book is reserved for another member, the kiosk shows "Reserved — cannot be borrowed". When the member presses Finish, the kiosk prints a receipt, and the Loan Service asks the Email Service to send a confirmation email without waiting for it.',
      model: `sequenceDiagram
    actor Member
    participant K as Kiosk
    participant LS as Loan Service
    participant MS as Member Service
    participant Cat as Catalogue
    participant ES as Email Service

    Member->>K: Scan library card
    K->>LS: startSession(cardId)
    LS->>MS: getMember(cardId)
    MS-->>LS: member (incl. fines owed)
    alt fines owed > $10
        LS-->>K: blocked
        K-->>Member: "Please see the front desk"
    else fines ok
        LS-->>K: session started
        loop for each book scanned
            Member->>K: Scan book
            K->>LS: borrow(sessionId, bookId)
            LS->>Cat: checkAvailability(bookId)
            Cat-->>LS: status
            alt available
                LS->>LS: createLoan(member, book, dueDate)
                LS->>Cat: markOnLoan(bookId)
                Cat-->>LS: ok
                LS-->>K: loan (dueDate)
                K-->>Member: Show due date
            else reserved for another member
                LS-->>K: reserved
                K-->>Member: "Reserved — cannot be borrowed"
            end
        end
        Member->>K: Press Finish
        K->>LS: finishSession(sessionId)
        LS-)ES: sendConfirmation(member, loans)
        LS-->>K: loans summary
        K-->>Member: Print receipt
    end`,
      notes: 'The fines check is an <code>alt</code> because both outcomes must be shown; the book loop sits inside the "fines ok" branch, and each book has its own available/reserved <code>alt</code>. The email uses <code>-)</code> because the Loan Service does not wait.',
      must: SEQ_MUST.concat(['Member details fetched before the fines decision', 'alt for blocked vs allowed, both reaching the member', 'loop over scanned books with an inner alt (available vs reserved)', 'Catalogue updated when a loan is created', 'Receipt printed and asynchronous email on Finish'] ) },

    { q: 'A customer orders dinner in the Food App. The App sends the order to the Order Service, which asks the Payment Gateway to authorise the card. If the card is declined, the customer sees "Payment declined". If it is approved, the Order Service sends the order to the Restaurant System and waits for the restaurant to accept or reject it. If the restaurant rejects it, the Order Service asks the Payment Gateway to void the authorisation, and the customer sees "The restaurant can’t take your order". If the restaurant accepts, the Order Service asks the Payment Gateway to capture the payment, and then, at the same time, tells the customer "Order confirmed" and asks the Courier Service to find a courier (without waiting for a reply). Later, when the restaurant marks the order as ready, the Order Service tells the customer that the courier is on the way.',
      model: `sequenceDiagram
    actor Customer
    participant App as Food App
    participant OS as Order Service
    participant PG as Payment Gateway
    participant RS as Restaurant System
    participant CS as Courier Service

    Customer->>App: Place order (items, card)
    App->>OS: placeOrder(items, card)
    OS->>PG: authorise(card, amount)
    PG-->>OS: approved / declined
    alt declined
        OS-->>App: payment declined
        App-->>Customer: "Payment declined"
    else approved
        OS->>RS: newOrder(order)
        RS-->>OS: accepted / rejected
        alt rejected
            OS->>PG: void(authorisation)
            PG-->>OS: voided
            OS-->>App: rejected
            App-->>Customer: "The restaurant can't take your order"
        else accepted
            OS->>PG: capture(authorisation)
            PG-->>OS: captured
            par confirm to customer
                OS-->>App: confirmed
                App-->>Customer: "Order confirmed"
            and request a courier
                OS-)CS: findCourier(order)
            end
            RS-)OS: orderReady(orderId)
            OS-)App: courierOnTheWay(orderId)
            App-->>Customer: "Your courier is on the way"
        end
    end`,
      notes: 'Two nested <code>alt</code>s capture the two decision points (payment, then the restaurant). The simultaneous confirmation and courier request is a <code>par</code>. The "order ready" message comes later and is initiated by the restaurant, so it is an asynchronous message into the Order Service rather than a reply.',
      must: SEQ_MUST.concat(['Authorisation before the restaurant is contacted', 'alt for declined vs approved', 'Nested alt for restaurant reject (void) vs accept (capture)', 'par for confirming and requesting a courier, courier request asynchronous', 'Later "ready" message leading to the courier notification'] ) },

    { q: 'A user logs in to a banking web app with two-factor authentication. The Web App sends the username and password to the Auth Service, which looks the user up in the User Store and checks the password hash. If the credentials are wrong, the Auth Service records a failed attempt in the User Store; after 5 failures in a row the account is locked and the user sees "Account locked — contact support", otherwise they see "Invalid username or password". If the credentials are right, the Auth Service generates a 6-digit code and asks the SMS Gateway to send it to the user’s phone (it does not wait), and the user is asked for the code. The user has up to three tries to enter the correct code. On a correct code, the Auth Service creates a session and the user sees their dashboard; after three wrong codes, the login is cancelled and the user sees "Too many attempts".',
      model: `sequenceDiagram
    actor User
    participant Web as Web App
    participant Auth as Auth Service
    participant US as User Store
    participant SMS as SMS Gateway

    User->>Web: Enter username and password
    Web->>Auth: login(username, password)
    Auth->>US: findUser(username)
    US-->>Auth: user (hash, failedCount, phone)
    Auth->>Auth: checkHash(password)
    alt credentials wrong
        Auth->>US: recordFailure(username)
        US-->>Auth: failedCount
        alt 5 failures in a row
            Auth->>US: lock(username)
            Auth-->>Web: locked
            Web-->>User: "Account locked — contact support"
        else fewer than 5
            Auth-->>Web: invalid
            Web-->>User: "Invalid username or password"
        end
    else credentials right
        Auth->>Auth: generateCode()
        Auth-)SMS: sendCode(phone, code)
        Auth-->>Web: code required
        Web-->>User: Ask for code
        loop up to 3 tries, until the code is correct
            User->>Web: Enter code
            Web->>Auth: verifyCode(username, code)
            Auth-->>Web: correct / wrong
        end
        alt code correct
            Auth->>Auth: createSession(user)
            Auth-->>Web: session token
            Web-->>User: Show dashboard
        else three wrong codes
            Auth-->>Web: cancelled
            Web-->>User: "Too many attempts"
        end
    end`,
      notes: 'The loop condition names both exits (a correct code, or three tries), and the outcome after the loop is its own <code>alt</code>. Showing "Wrong code, try again" inside the loop is a fine addition. Sending the SMS with <code>-)</code> matches "does not wait".',
      must: SEQ_MUST.concat(['User looked up and password checked before any branch', 'alt for wrong vs right credentials', 'Nested alt (or opt) for locking after 5 failures', 'Asynchronous SMS send', 'loop of up to three code attempts with both exits', 'Outcome alt: session + dashboard vs cancelled'] ) }
  ]);

  /* ===================== Section 3: domain models ======================= */

  addList(D.DOMAIN, [
    { title: 'Cinema chain bookings',
      spec: [
        'The chain has <b>cinemas</b>. Each cinema has several <b>screens</b>, and each screen has rows of <b>seats</b>. A seat is a standard seat, a premium recliner, or a wheelchair space.',
        '<b>Movies</b> (title, classification, duration) are shown in <b>sessions</b>: one movie, on one screen, at a start time. A session can be cancelled, which refunds every booking for it.',
        '<b>Customers</b> make <b>bookings</b> for one session. A booking has one or more <b>tickets</b>, each for one seat and a ticket type (adult, child or concession). The price depends on the ticket type, and premium recliners cost $5 more.',
        'Customers can book as guests or as <b>loyalty members</b>. Members earn 10 points per dollar spent and can redeem 1,000 points for a free ticket.',
        '<b>Staff</b> are managers or ushers, and each works at one cinema.'
      ],
      controller: `public interface CinemaController {
    void addScreen(String cinemaId, String screenId, int rows, int seatsPerRow);
    void setSeatType(String screenId, String seatId, String type);
    String scheduleSession(String screenId, String movieId, LocalDateTime start);
    String book(String customerId, String sessionId,
                List<String> seatIds, List<String> ticketTypes);
    double bookingTotal(String bookingId);
    void cancelSession(String sessionId);
    int loyaltyPoints(String memberId);
}`,
      model: `public class Cinema {
    private String id, name;
    private List<Screen> screens;        // composition, 1 cinema ◆— 1..* Screen
    private List<Staff> staff;           // aggregation, 1 cinema — 0..* Staff
}

public class Screen {
    private String id;
    private List<Seat> seats;            // composition, 1 screen ◆— 1..* Seat
    public Seat getSeat(String seatId) { ... }
}

public enum SeatType {
    STANDARD(0), PREMIUM(5), WHEELCHAIR(0);
    private final double surcharge;
    SeatType(double surcharge) { this.surcharge = surcharge; }
    public double getSurcharge() { return surcharge; }
}

public class Seat {
    private String id;                   // e.g. "F12"
    private SeatType type;               // can be changed by setSeatType
}

public class Movie {
    private String id, title, classification;
    private Duration duration;
}

public class Session {
    private String id;
    private Movie movie;                 // association, * sessions — 1 Movie
    private Screen screen;               // association, * sessions — 1 Screen
    private LocalDateTime start;
    private List<Booking> bookings;      // 1 session — 0..* Booking
    private boolean cancelled;
    public boolean isFree(Seat seat) { ... }
    /** marks cancelled and refunds every booking */
    public void cancel() { ... }
}

public enum TicketType {
    ADULT(18.0), CHILD(12.0), CONCESSION(14.0);
    private final double basePrice;
    TicketType(double basePrice) { this.basePrice = basePrice; }
    public double getBasePrice() { return basePrice; }
}

public class Booking {
    private String id;
    private Customer customer;           // exactly 1
    private Session session;             // exactly 1
    private List<Ticket> tickets;        // composition, 1 booking ◆— 1..* Ticket
    public double total() { ... }        // sum of ticket prices
    public void refund() { ... }
}

/** One seat at one ticket type for one booking. */
public class Ticket {
    private Seat seat;
    private TicketType type;
    private boolean redeemedWithPoints;  // a free ticket
    public double price() { ... }        // 0 if redeemed, else base + seat surcharge
}

/** Guests and members both make bookings. */
public class Customer {
    private String id, name, email;
    private List<Booking> bookings;      // 1 customer — 0..* Booking
}

public class LoyaltyMember extends Customer {
    private static final int POINTS_PER_DOLLAR = 10;
    private static final int POINTS_PER_FREE_TICKET = 1000;
    private int points;
    public void earn(double dollars) { ... }
    public boolean redeemFreeTicket() { ... }
}

public abstract class Staff {
    private String id, name;
    private Cinema cinema;               // works at exactly 1 cinema
}
public class Manager extends Staff { }
public class Usher extends Staff { }`,
      notes: 'Being a loyalty member is modelled as a subclass because a guest who joins becomes a new kind of account. A field (a nullable <code>LoyaltyAccount</code>) is equally defensible, and better if guests can join mid-booking. Prices live on the enums so a new ticket type changes one place.',
      must: ['Cinema ◆ Screen ◆ Seat compositions; Booking ◆ Ticket composition', 'Session links one Movie and one Screen at a time; holds its bookings and can cancel/refund', 'Seat and ticket types as enums (or classes) carrying the price rules', 'Loyalty member modelled (subclass or account field) with points behaviour', 'Staff abstract with Manager/Usher, each at one cinema; cardinalities as comments'] },

    { title: 'University course enrolments',
      spec: [
        '<b>Courses</b> have a code, a name and a number of units of credit. A course may have <b>prerequisites</b>: a single course, or a combination that requires <i>all of</i> or <i>one of</i> a list of requirements. Combinations can be nested, e.g. COMP1531 <i>and</i> (COMP2521 <i>or</i> COMP1927).',
        'A course is run in particular terms as a <b>course offering</b>. Each offering has a <b>convenor</b> and a number of <b>classes</b>: lectures, tutorials and labs, each with a time, a room and a capacity.',
        '<b>Students</b> enrol in an offering and must choose one tutorial. If the tutorial is full, they join that tutorial’s <b>waitlist</b>, which is served in the order students joined it.',
        'Each class is taught by one or more <b>tutors</b> or lecturers. Some people are both a student and a tutor (e.g. postgraduate students), and must keep one university ID.',
        'A student can enrol only if they have completed the course’s prerequisites with a passing mark.'
      ],
      controller: `public interface EnrolmentController {
    void createCourse(String code, String name, int uoc);
    void setPrerequisite(String code, String expression);  // e.g. "COMP1531 && (COMP2521 || COMP1927)"
    void createOffering(String code, String term, String convenorId);
    void addClass(String code, String term, String classId, String type, int capacity);
    boolean canEnrol(String zid, String code);
    void enrol(String zid, String code, String term, String tutorialId);
    List<String> waitlist(String classId);
}`,
      model: `public class Course {
    private String code, name;
    private int uoc;
    private Requirement prerequisite;          // 0..1, may be a nested tree
    private List<CourseOffering> offerings;    // composition, 1 course ◆— 0..* offering
    public boolean prerequisitesMetBy(Student s) {
        return prerequisite == null || prerequisite.isMetBy(s);
    }
}

/** Composite: a requirement is one course, or an all-of / one-of group. */
public interface Requirement {
    boolean isMetBy(Student s);
}
public class CourseRequirement implements Requirement {      // leaf
    private Course course;
    public boolean isMetBy(Student s) { return s.hasPassed(course); }
}
public class AllOf implements Requirement {
    private List<Requirement> parts;           // 2..* children
    public boolean isMetBy(Student s) { ... }  // every part
}
public class OneOf implements Requirement {
    private List<Requirement> parts;           // 2..* children
    public boolean isMetBy(Student s) { ... }  // any part
}

public class CourseOffering {
    private Course course;
    private String term;
    private Person convenor;                   // association, exactly 1
    private List<UniClass> classes;            // composition, 1 offering ◆— 1..* class
    private List<Enrolment> enrolments;        // 1 offering — 0..* Enrolment
}

public enum ClassType { LECTURE, TUTORIAL, LAB }

public class UniClass {
    private String id;
    private ClassType type;
    private LocalTime time;
    private String room;
    private int capacity;
    private List<Person> teachers;             // aggregation, * classes — 1..* Person
    private List<Student> members;             // aggregation, 0..capacity
    private Deque<Student> waitlist;           // FIFO, 0..*
    public boolean isFull() { ... }
    /** adds the student, or appends them to the waitlist if full */
    public void join(Student s) { ... }
}

/** One student in one offering, with their tutorial and final mark. */
public class Enrolment {
    private Student student;
    private CourseOffering offering;
    private UniClass tutorial;
    private Integer mark;                      // null until finalised
    public boolean isPass() { ... }
}

/** One person, one ID, possibly several roles at once. */
public class Person {
    private String zid, name;
    private Student studentRole;               // 0..1
    private Tutor tutorRole;                   // 0..1
}
public class Student {
    private Person person;
    private List<Enrolment> enrolments;        // 1 student — 0..* Enrolment
    public boolean hasPassed(Course c) { ... }
}
public class Tutor {
    private Person person;
}`,
      notes: 'The nested prerequisites are a textbook Composite. A person who is both a student and a tutor is the tricky part: subclasses (<code>Student extends Person</code>, <code>Tutor extends Person</code>) would force two objects with the same zid, so roles held by one Person are better. The mark lives on Enrolment, the association between a student and an offering.',
      must: ['Prerequisites as a Composite (leaf course requirement; all-of and one-of composites)', 'Course ◆ CourseOffering ◆ classes; class types modelled', 'Enrolment association class holding the tutorial and mark', 'Waitlist as an ordered (FIFO) collection on the tutorial', 'Student/tutor as roles of one Person (or a justified alternative), with cardinalities'] },

    { title: 'Car-share service',
      spec: [
        'The service has <b>vehicles</b>: cars, vans and e-bikes. Each has an ID, a home <b>pod</b> (a parking location) and a status: available, booked, in use, or under maintenance. Cars and vans record their odometer reading; e-bikes record their battery level.',
        '<b>Members</b> are on a <b>plan</b>, which they can change at the start of any month: <i>Casual</i> ($0 a month, $12/hour + $0.40/km), <i>Everyday</i> ($10 a month, $9/hour + $0.30/km) or <i>Frequent</i> ($30 a month, $6/hour + $0.20/km). E-bikes always cost $0.50 a minute, whatever the plan.',
        'Members <b>book</b> a vehicle for a time slot. When the member unlocks the vehicle, the booking becomes a <b>trip</b>; when it ends, the trip records the kilometres driven and its cost.',
        'After a trip, a member can submit a <b>damage report</b> for the vehicle. A vehicle with an open damage report goes under maintenance until a technician closes the report.',
        'A <b>business account</b> has several members as drivers and receives one combined monthly <b>invoice</b> for all their trips. Personal members are invoiced individually.'
      ],
      controller: `public interface CarShareController {
    void addVehicle(String vehicleId, String type, String podId);
    void changePlan(String memberId, String plan);
    String book(String memberId, String vehicleId, LocalDateTime start, LocalDateTime end);
    void startTrip(String bookingId);
    double endTrip(String bookingId, int kmDriven);
    void reportDamage(String vehicleId, String memberId, String description);
    void closeDamageReport(String reportId);
    double monthlyInvoice(String accountId, YearMonth month);
}`,
      model: `public class Pod {
    private String id, address;
    private List<Vehicle> vehicles;          // aggregation, 1 pod — 0..* Vehicle (home pod)
}

public enum VehicleStatus { AVAILABLE, BOOKED, IN_USE, MAINTENANCE }

public abstract class Vehicle {
    private String id;
    private Pod homePod;
    private VehicleStatus status;
    private List<DamageReport> reports;      // composition, 1 vehicle ◆— 0..* report
    /** e-bikes ignore the plan; cars and vans ask it */
    public abstract double tripCost(Plan plan, Duration time, int km);
    public boolean hasOpenDamage() { ... }
}
public abstract class MotorVehicle extends Vehicle {
    private int odometerKm;
    public double tripCost(Plan plan, Duration time, int km) {
        return plan.cost(time, km);
    }
}
public class Car extends MotorVehicle { }
public class Van extends MotorVehicle { }
public class EBike extends Vehicle {
    private static final double PER_MINUTE = 0.50;
    private int batteryPercent;
    public double tripCost(Plan plan, Duration time, int km) { ... }
}

/** Strategy: the plan changes over time, so it is a field, not a subclass. */
public interface Plan {
    double monthlyFee();
    double cost(Duration time, int km);
}
public class CasualPlan implements Plan { }    // $0, $12/h, $0.40/km
public class EverydayPlan implements Plan { }  // $10, $9/h, $0.30/km
public class FrequentPlan implements Plan { }  // $30, $6/h, $0.20/km

public class Member {
    private String id, name, licenceNumber;
    private Plan plan;                       // exactly 1 at a time
    private Plan nextMonthPlan;              // 0..1, applied at the start of the month
    private Account account;                 // exactly 1 (personal or business)
}

/** Who gets invoiced. */
public abstract class Account {
    private String id;
    public abstract List<Member> drivers();
    public double invoiceFor(YearMonth month) { ... }  // fees + every driver's trips
}
public class PersonalAccount extends Account {
    private Member member;                   // exactly 1
}
public class BusinessAccount extends Account {
    private String companyName, abn;
    private List<Member> drivers;            // aggregation, 1 account — 1..* Member
}

public class Booking {
    private String id;
    private Member member;                   // exactly 1
    private Vehicle vehicle;                 // exactly 1
    private LocalDateTime start, end;
    private Trip trip;                       // 0..1, composition, created on unlock
    public void start() { ... }
}

public class Trip {
    private LocalDateTime unlockedAt, endedAt;
    private int kmDriven;
    private double cost;                     // fixed when the trip ends
    public double end(int km) { ... }
}

public class DamageReport {
    private String id;
    private Member reporter;
    private String description;
    private boolean open;
    public void close() { ... }              // vehicle leaves maintenance if no others open
}`,
      notes: 'The plan is a Strategy held by the member because it changes monthly; the "next month" field records a pending change. E-bike pricing overrides the plan, so cost is a polymorphic method on Vehicle that consults the plan only for motor vehicles. Business and personal accounts share invoicing in an abstract Account.',
      must: ['Vehicle hierarchy (Car, Van, E-bike) with type-specific fields', 'Plan as a Strategy/field on Member (not a member subclass), with the pricing rules', 'Booking → Trip (0..1) with km and cost recorded', 'Damage reports linked to the vehicle and driving maintenance status', 'Business vs personal accounts for invoicing; cardinalities as comments'] }
  ]);

  /* ===================== Section 3: refactor and extend ================= */

  addList(D.REFACTOR, [
    /* ---------------------------------------------------------------- */
    { title: 'Car park pricing',
      intro: '<p>A car park charges by the started hour. The operator switches between pricing schemes during the day (standard, event days, overnight), and motorbikes pay half. The current code is below.</p>' +
        '<p><b>New requirements:</b> add a <b>weekend</b> scheme: the first hour is free, then $2.50 per started hour, capped at $20.00. The operator expects to add more schemes (e.g. early bird), and must still be able to switch scheme at any time without restarting.</p>',
      files: [
        { name: 'ParkingLot.java', text: `public class ParkingLot {
    private String pricing = "STANDARD";    // "STANDARD", "EVENT" or "NIGHT"

    public void setPricing(String pricing) { this.pricing = pricing; }

    public double fee(String vehicle, int minutes) {
        int hours = (minutes + 59) / 60;
        double fee;
        if (pricing.equals("STANDARD")) {
            fee = hours * 4.0;
            if (fee > 30) fee = 30;
        } else if (pricing.equals("EVENT")) {
            fee = 25.0;
        } else {
            fee = 10.0;
        }
        if (vehicle.equals("motorbike")) fee = fee * 0.5;
        return fee;
    }

    public String describe() {
        if (pricing.equals("STANDARD")) return "$4.00/hour, max $30.00";
        else if (pricing.equals("EVENT")) return "Event: $25.00 flat";
        else return "Night: $10.00 flat";
    }
}` },
        { name: 'ParkingLotTest.java', text: `@Test
public void testWeekend() {
    ParkingLot lot = new ParkingLot(new StandardPricing());
    assertEquals(12.0, lot.fee("car", 150), 0.001);       // 3 started hours x $4
    lot.setPricing(new WeekendPricing());
    assertEquals(5.0, lot.fee("car", 150), 0.001);        // first hour free, 2 x $2.50
    assertEquals(2.5, lot.fee("motorbike", 150), 0.001);
    assertEquals("Weekend: first hour free, then $2.50/hour, max $20.00", lot.describe());
}

@Test
public void testWeekendCap() {
    ParkingLot lot = new ParkingLot(new WeekendPricing());
    assertEquals(20.0, lot.fee("car", 12 * 60), 0.001);   // 11 x $2.50 = $27.50, capped
    assertEquals(0.0, lot.fee("car", 45), 0.001);
}` }
      ],
      smells: ul([
        '<b>Switch statements on a type code</b>: the String ' + c('pricing') + ' is tested in an if/else chain in <i>both</i> ' + c('fee') + ' and ' + c('describe') + '. A new scheme means editing both (Open-Closed violation, and the two chains can drift apart: forget one and the description is wrong).',
        '<b>Primitive obsession</b>: schemes and vehicles are Strings, so ' + c('setPricing("EVNT")') + ' compiles and silently falls into the night rate (the final ' + c('else') + ').',
        '<b>Magic numbers</b>: 4.0, 30, 25.0, 10.0 and 0.5 are unexplained, and $4.00 and $30.00 are repeated as text in ' + c('describe') + '.',
        '<b>Low cohesion</b>: each scheme’s rule is split across two methods instead of living in one place.']),
      pattern: { options: ['Strategy', 'Decorator', 'Observer', 'Composite'], correct: 0,
                 why: 'Each pricing scheme is an interchangeable algorithm for the same job, and the car park must switch between them at runtime: that is Strategy, with ParkingLot as the context. Decorator would suit adding surcharges on top of a price, not choosing one scheme.' },
      task: 'Refactor the code using your chosen pattern so that the tests in ' + c('ParkingLotTest.java') + ' pass, keeping the existing schemes and the motorbike discount. Briefly justify your design in a comment.',
      model: `/** Strategy: each pricing scheme is one class. ParkingLot (the context)
 *  holds the current scheme and can be switched at runtime. */
public interface PricingStrategy {
    double baseFee(int minutes);
    String describe();
}

/** Shared logic for "rate per started hour, some free hours, a daily cap". */
public abstract class HourlyPricing implements PricingStrategy {
    private final double rate, cap;
    private final int freeHours;

    protected HourlyPricing(double rate, int freeHours, double cap) {
        this.rate = rate; this.freeHours = freeHours; this.cap = cap;
    }
    protected static int startedHours(int minutes) { return (minutes + 59) / 60; }

    public double baseFee(int minutes) {
        int charged = Math.max(0, startedHours(minutes) - freeHours);
        return Math.min(charged * rate, cap);
    }
}

public class StandardPricing extends HourlyPricing {
    public StandardPricing() { super(4.0, 0, 30.0); }
    public String describe() { return "$4.00/hour, max $30.00"; }
}

public class WeekendPricing extends HourlyPricing {
    public WeekendPricing() { super(2.5, 1, 20.0); }
    public String describe() { return "Weekend: first hour free, then $2.50/hour, max $20.00"; }
}

/** Flat-fee schemes differ only in the amount and label. */
public class FlatPricing implements PricingStrategy {
    private final String label;
    private final double amount;
    public FlatPricing(String label, double amount) { this.label = label; this.amount = amount; }
    public double baseFee(int minutes) { return amount; }
    public String describe() { return String.format("%s: $%.2f flat", label, amount); }
}

public class EventPricing extends FlatPricing {
    public EventPricing() { super("Event", 25.0); }
}
public class NightPricing extends FlatPricing {
    public NightPricing() { super("Night", 10.0); }
}

public class ParkingLot {
    private static final double MOTORBIKE_FACTOR = 0.5;
    private PricingStrategy pricing;

    public ParkingLot(PricingStrategy pricing) { this.pricing = pricing; }

    public void setPricing(PricingStrategy pricing) { this.pricing = pricing; }

    public double fee(String vehicle, int minutes) {
        double fee = pricing.baseFee(minutes);
        return vehicle.equals("motorbike") ? fee * MOTORBIKE_FACTOR : fee;
    }

    public String describe() { return pricing.describe(); }
}

/* Rationale: Strategy. Each scheme's fee rule and description live in one
   class, so they cannot drift apart, and a new scheme (weekend, early bird)
   is a new class with no edits to ParkingLot (Open-Closed). The lot keeps a
   reference to the current strategy, so the operator switches at runtime.
   The motorbike discount applies to every scheme, so it stays in the lot. */`,
      notes: 'The abstract ' + c('HourlyPricing') + ' removes the duplication between the standard and weekend schemes (rate, free hours, cap); putting the formula in each class is acceptable but loses marks for repetition. Keeping the vehicle rule in ParkingLot is deliberate: it is orthogonal to the scheme. Making vehicles a second strategy, or an enum with a factor, is a good extension.',
      must: ['PricingStrategy interface; ParkingLot holds one and delegates fee and describe', 'Every existing scheme kept as its own class, plus WeekendPricing', 'setPricing swaps the strategy at runtime; no String scheme comparisons remain',
             'Shared hourly/cap logic not duplicated; magic numbers named', 'Brief rationale referring to Open-Closed / runtime switching'] },

    /* ---------------------------------------------------------------- */
    { title: 'Org chart costs',
      intro: '<p>An HR system reports the cost and headcount of each department, and prints an org chart. Departments can contain employees and other departments. The current code is below.</p>' +
        '<p><b>New requirements:</b> departments can now include <b>contractors</b>. A contractor costs their daily rate × 220 working days a year, is not counted in headcount, and appears in the chart as "Name (contractor)". The chart must list each department’s members <b>in the order they were added</b>, whatever their kind. More kinds of members (e.g. interns) are expected.</p>',
      files: [
        { name: 'Org.java', text: `public class Employee {
    private String name;
    private double salary;
    public Employee(String name, double salary) { this.name = name; this.salary = salary; }
    public String getName() { return name; }
    public double getSalary() { return salary; }
}

public class Department {
    private String name;
    private List<Employee> employees = new ArrayList<>();
    private List<Department> subDepartments = new ArrayList<>();

    public Department(String name) { this.name = name; }
    public void addEmployee(Employee e) { employees.add(e); }
    public void addDepartment(Department d) { subDepartments.add(d); }
    public String getName() { return name; }
    public List<Employee> getEmployees() { return employees; }
    public List<Department> getSubDepartments() { return subDepartments; }
}

public class Payroll {
    public double totalCost(Department d) {
        double total = 0;
        for (Employee e : d.getEmployees()) total += e.getSalary();
        for (Department sub : d.getSubDepartments()) total += totalCost(sub);
        return total;
    }

    public int headcount(Department d) {
        int n = d.getEmployees().size();
        for (Department sub : d.getSubDepartments()) n += headcount(sub);
        return n;
    }

    public String chart(Department d, String indent) {
        String s = indent + d.getName() + "\\n";
        for (Employee e : d.getEmployees()) s += indent + "  " + e.getName() + "\\n";
        for (Department sub : d.getSubDepartments()) s += chart(sub, indent + "  ");
        return s;
    }
}` },
        { name: 'OrgTest.java', text: `@Test
public void testCostAndHeadcount() {
    Department eng = new Department("Engineering");
    eng.add(new Employee("Ana", 120000));
    Department web = new Department("Web");
    web.add(new Employee("Ben", 100000));
    web.add(new Contractor("Cy", 500));            // 500 x 220 = 110,000
    eng.add(web);
    eng.add(new Employee("Dee", 90000));
    assertEquals(420000, eng.cost(), 0.001);
    assertEquals(3, eng.headcount());
}

@Test
public void testChart() {
    Department eng = new Department("Engineering");
    eng.add(new Employee("Ana", 120000));
    Department web = new Department("Web");
    web.add(new Employee("Ben", 100000));
    web.add(new Contractor("Cy", 500));
    eng.add(web);
    eng.add(new Employee("Dee", 90000));
    assertEquals("Engineering\\n  Ana\\n  Web\\n    Ben\\n    Cy (contractor)\\n  Dee\\n",
                 eng.chart());
}` }
      ],
      smells: ul([
        '<b>Feature Envy</b>: every method of ' + c('Payroll') + ' works on Department’s data through its getters; Payroll has no data of its own.',
        '<b>Duplicated code</b>: the same two-loop recursive walk (employees, then sub-departments) is copied into each of the three methods, and every new report would copy it again.',
        '<b>Shotgun surgery / Open-Closed</b>: storing each kind of member in its own list means contractors need a third list, a third add method and edits to all three reports. Separate lists also lose the order members were added, which the chart now needs.',
        '<b>Inappropriate intimacy / broken encapsulation</b>: ' + c('getEmployees()') + ' and ' + c('getSubDepartments()') + ' return the internal mutable lists, so any caller can change a department behind its back.']),
      pattern: { options: ['Composite', 'Decorator', 'Strategy', 'Singleton'], correct: 0,
                 why: 'The org chart is a part-whole tree: departments contain people and other departments to any depth, and reports should treat one person and a whole department the same way. That is Composite, with people as leaves and Department as the composite.' },
      task: 'Refactor the code using your chosen pattern so that the tests in ' + c('OrgTest.java') + ' pass, and add contractors. ' + c('Department') + ' now has a single ' + c('add') + ' method. Briefly justify your design in a comment.',
      model: `/** Component. People and departments are all OrgUnits, so a department can
 *  hold any mix of them, nested to any depth (Composite). */
public interface OrgUnit {
    String getName();
    double cost();
    int headcount();
    String chart(String indent);
}

// ---- leaves ---------------------------------------------------------
public class Employee implements OrgUnit {
    private final String name;
    private final double salary;
    public Employee(String name, double salary) { this.name = name; this.salary = salary; }
    public String getName() { return name; }
    public double cost() { return salary; }
    public int headcount() { return 1; }
    public String chart(String indent) { return indent + name + "\\n"; }
}

public class Contractor implements OrgUnit {
    private static final int WORKING_DAYS = 220;
    private final String name;
    private final double dailyRate;
    public Contractor(String name, double dailyRate) { this.name = name; this.dailyRate = dailyRate; }
    public String getName() { return name; }
    public double cost() { return dailyRate * WORKING_DAYS; }
    public int headcount() { return 0; }                 // not on the staff count
    public String chart(String indent) { return indent + name + " (contractor)\\n"; }
}

// ---- composite -----------------------------------------------------
public class Department implements OrgUnit {
    private final String name;
    private final List<OrgUnit> members = new ArrayList<>();   // in the order added

    public Department(String name) { this.name = name; }
    public void add(OrgUnit unit) { members.add(unit); }
    public String getName() { return name; }

    public double cost() {
        return members.stream().mapToDouble(OrgUnit::cost).sum();
    }
    public int headcount() {
        return members.stream().mapToInt(OrgUnit::headcount).sum();
    }
    public String chart(String indent) {
        StringBuilder sb = new StringBuilder(indent + name + "\\n");
        for (OrgUnit m : members) sb.append(m.chart(indent + "  "));
        return sb.toString();
    }
    public String chart() { return chart(""); }
}

/* Rationale: each operation lives with the data it needs, so the recursion
   is written once per class instead of once per report, and Payroll (pure
   Feature Envy) disappears. Contractors are one new leaf class with no edits
   to Department. One list keeps members in the order they were added, and
   no internal list is exposed. */`,
      notes: 'Moving each operation into the tree removes Payroll entirely; keeping a Payroll that simply calls ' + c('dept.cost()') + ' is also fine. A ' + c('Person') + ' abstract class shared by Employee and Contractor is reasonable if they share more than a name. Watch the leaf/composite split: Department should not test ' + c('instanceof Contractor') + '.',
      must: ['OrgUnit interface implemented by Employee, Contractor and Department', 'Department holds one List<OrgUnit> (insertion order) and recurses through the interface',
             'cost, headcount and chart each implemented per class; no duplicated walks, no instanceof', 'Contractor added as a new leaf with no edits to Department', 'Internal lists no longer exposed; brief rationale'] },

    /* ---------------------------------------------------------------- */
    { title: 'Chat message filters',
      intro: '<p>A chat app formats each message before it is shown. Rooms turn steps on or off with constructor flags. The current code is below.</p>' +
        '<p><b>New requirements:</b> each chat room must be able to choose <b>which</b> steps run <b>and in what order</b> (e.g. one room truncates before converting smileys, another after). A new <b>shout</b> step (convert to upper case) is being added, and more steps are planned.</p>',
      files: [
        { name: 'MessageFormatter.java', text: `public class MessageFormatter {
    private boolean trim;
    private boolean censor;
    private boolean smileys;
    private int maxLength;           // 0 means no limit

    public MessageFormatter(boolean trim, boolean censor, boolean smileys, int maxLength) {
        this.trim = trim; this.censor = censor;
        this.smileys = smileys; this.maxLength = maxLength;
    }

    public String format(String msg) {
        String out = msg;
        if (trim) out = out.trim();
        if (censor) {
            for (String w : List.of("heck", "darn")) {
                out = out.replace(w, "*".repeat(w.length()));
            }
        }
        if (smileys) out = out.replace(":)", "[smile]").replace(":(", "[frown]");
        if (maxLength > 0 && out.length() > maxLength) {
            out = out.substring(0, maxLength) + "...";
        }
        return out;
    }
}` },
        { name: 'MessageFilterTest.java', text: `@Test
public void testTrimCensorTruncate() {
    MessageFilter f = new Truncate(new Censor(new Trim(new Plain())), 12);
    assertEquals("oh **** that...", f.apply("  oh heck that hurt  "));
}

@Test
public void testOrderMatters() {
    MessageFilter shoutLast = new Shout(new Smileys(new Plain()));
    assertEquals("HELLO [SMILE]", shoutLast.apply("hello :)"));
    MessageFilter shoutFirst = new Smileys(new Shout(new Plain()));
    assertEquals("HELLO [smile]", shoutFirst.apply("hello :)"));
}` }
      ],
      smells: ul([
        '<b>Boolean flag parameters / long parameter list</b>: ' + c('new MessageFormatter(true, false, true, 40)') + ' is unreadable at the call site, and every new step adds another constructor parameter (breaking every caller).',
        '<b>Order hard-coded</b> in ' + c('format') + ': trim, censor, smileys, truncate. The new requirement (per-room order) cannot be met without rewriting the method.',
        '<b>Open-Closed violation / low cohesion</b>: every step lives in one method, so adding shout means editing a class that already does four unrelated jobs.',
        '<b>Magic values</b>: ' + c('maxLength == 0') + ' as a sentinel for "no limit", the inline banned-word list and the "..." literal.']),
      pattern: { options: ['Decorator', 'Strategy', 'Observer', 'Abstract Factory'], correct: 0,
                 why: 'Each step wraps the message processing of the steps inside it and adds its own transformation, and rooms stack any steps in any order at runtime, with no subclass per combination. That is Decorator. Strategy picks one algorithm; here several are combined.' },
      task: 'Refactor the code using your chosen pattern so that the tests in ' + c('MessageFilterTest.java') + ' pass, and add the shout step. ' + c('MessageFormatter') + ' can be removed. Briefly justify your design in a comment.',
      model: `/** Component: anything that turns a message into a formatted message. */
public interface MessageFilter {
    String apply(String msg);
}

/** Concrete component: the innermost layer, which leaves the text alone. */
public class Plain implements MessageFilter {
    public String apply(String msg) { return msg; }
}

/** Abstract decorator: runs the wrapped filter first, then its own step.
 *  So filters run from the inside out, in the order they were wrapped. */
public abstract class FilterDecorator implements MessageFilter {
    private final MessageFilter inner;
    protected FilterDecorator(MessageFilter inner) { this.inner = inner; }
    public final String apply(String msg) { return transform(inner.apply(msg)); }
    protected abstract String transform(String msg);
}

// ---- concrete decorators -------------------------------------------
public class Trim extends FilterDecorator {
    public Trim(MessageFilter inner) { super(inner); }
    protected String transform(String msg) { return msg.trim(); }
}

public class Censor extends FilterDecorator {
    private static final List<String> BANNED = List.of("heck", "darn");
    public Censor(MessageFilter inner) { super(inner); }
    protected String transform(String msg) {
        for (String w : BANNED) msg = msg.replace(w, "*".repeat(w.length()));
        return msg;
    }
}

public class Smileys extends FilterDecorator {
    public Smileys(MessageFilter inner) { super(inner); }
    protected String transform(String msg) {
        return msg.replace(":)", "[smile]").replace(":(", "[frown]");
    }
}

public class Truncate extends FilterDecorator {
    private static final String ELLIPSIS = "...";
    private final int maxLength;
    public Truncate(MessageFilter inner, int maxLength) {
        super(inner);
        if (maxLength <= 0) throw new IllegalArgumentException("maxLength must be positive");
        this.maxLength = maxLength;
    }
    protected String transform(String msg) {
        return msg.length() <= maxLength ? msg : msg.substring(0, maxLength) + ELLIPSIS;
    }
}

public class Shout extends FilterDecorator {                        // the new filter
    public Shout(MessageFilter inner) { super(inner); }
    protected String transform(String msg) { return msg.toUpperCase(); }
}

/* Rationale: each step is one small class, so a new filter is one new class
   (Open-Closed). Rooms build their own chain, which fixes both which steps
   run and in what order; a step can even appear twice. The boolean flags
   and the "0 means no limit" sentinel are gone: a room without truncation
   simply does not wrap a Truncate. */`,
      notes: 'A ' + c('List<MessageFilter>') + ' pipeline that applies each step in turn (a Composite or chain) also meets the requirement and is a good answer if justified; the tests fix the decorator-style constructors here. Making ' + c('apply') + ' final in the abstract decorator (a small Template Method) guarantees every step runs the inner chain first.',
      must: ['MessageFilter interface; Plain concrete component', 'Abstract decorator wraps a MessageFilter and applies the inner one first', 'One decorator per step, plus Shout; order set by how they are wrapped',
             'Flags and the 0 sentinel removed; banned words and ellipsis named', 'Brief rationale referring to Open-Closed / runtime composition and order'] }
  ]);

  /* ===================== Section 3: build from scratch ================== */

  addList(D.SCRATCH, [
    /* ---------------------------------------------------------------- */
    { title: 'Online auction',
      intro: '<p>You are building <b>BidHub</b>, an online auction site. Each <b>lot</b> has a name and a reserve price. <b>Bidders</b> can watch lots they are interested in.</p>' +
        '<ul><li>A bid must be higher than the lot’s current highest bid (any positive amount if there is none); otherwise it is rejected.</li>' +
        '<li>When a bid is accepted, every watcher of the lot except the bidder receives the message <code>New bid of $X on LOT by NAME</code> (two decimal places). The bidder who has just been outbid receives <code>You have been outbid on LOT</code> instead.</li>' +
        '<li>A bidder who places an accepted bid starts watching the lot automatically. Bidders can stop watching at any time.</li>' +
        '<li>When a lot closes, every watcher receives <code>LOT sold to NAME for $X</code>, or <code>LOT passed in</code> if there were no bids or the highest bid is below the reserve. No bids are accepted after closing.</li></ul>' +
        '<p>You must implement the methods of ' + c('AuctionController') + '.</p>',
      files: [
        { name: 'AuctionController.java', text: `public class AuctionController {
    public void addLot(String lotId, String name, double reserve) { ... }
    public void addBidder(String bidderId, String name) { ... }
    public void watch(String bidderId, String lotId) { ... }
    public void unwatch(String bidderId, String lotId) { ... }
    /** Returns true if the bid was accepted. */
    public boolean bid(String bidderId, String lotId, double amount) { ... }
    public void close(String lotId) { ... }
    /** Every message the bidder has received, oldest first. */
    public List<String> messages(String bidderId) { ... }
}` },
        { name: 'AuctionControllerTest.java', text: `@Test
public void testBidNotifications() {
    AuctionController a = new AuctionController();
    a.addLot("L1", "Vintage clock", 100);
    a.addBidder("b1", "Ann");
    a.addBidder("b2", "Bo");
    a.addBidder("b3", "Cal");
    a.watch("b3", "L1");
    assertTrue(a.bid("b1", "L1", 50));
    assertFalse(a.bid("b2", "L1", 50));          // must beat the current bid
    assertTrue(a.bid("b2", "L1", 80));
    assertEquals(List.of("New bid of $50.00 on Vintage clock by Ann",
                         "New bid of $80.00 on Vintage clock by Bo"), a.messages("b3"));
    assertEquals(List.of("You have been outbid on Vintage clock"), a.messages("b1"));
    assertEquals(List.of(), a.messages("b2"));
}

@Test
public void testClose() {
    AuctionController a = new AuctionController();
    a.addLot("L1", "Vintage clock", 100);
    a.addLot("L2", "Old map", 500);
    a.addBidder("b1", "Ann");
    a.addBidder("b2", "Bo");
    a.bid("b1", "L1", 120);
    a.bid("b2", "L1", 150);
    a.close("L1");
    List<String> m = a.messages("b1");
    assertEquals("Vintage clock sold to Bo for $150.00", m.get(m.size() - 1));
    assertFalse(a.bid("b1", "L1", 200));         // closed
    a.bid("b1", "L2", 300);
    a.close("L2");
    m = a.messages("b1");
    assertEquals("Old map passed in", m.get(m.size() - 1));
}` }
      ],
      parts: [
        { kind: 'written', marks: 3,
          prompt: 'What design pattern can be used to model this scenario? Justify your choice by explaining how the scenario maps to the key characteristics of the pattern.',
          model: '<p><b>Observer.</b></p><ul>' +
            '<li>Subject: ' + c('Lot') + ', which keeps its set of watchers with ' + c('attach') + '/' + c('detach') + ' (watch/unwatch) and notifies them when its state changes (a new bid, closing).</li>' +
            '<li>Observer: a ' + c('LotObserver') + ' interface with ' + c('update(String message)') + '; concrete observer: ' + c('Bidder') + ', which stores the messages it receives.</li>' +
            '<li>One change must reach many interested parties, the set of watchers changes at runtime, and the lot does not need to know anything about its watchers beyond the interface (loose coupling, e.g. an email notifier could watch too).</li></ul>',
          checklist: ['Named Observer', 'Lot as subject with attach/detach/notify; Bidder as concrete observer via an interface', 'Justified: one-to-many updates, watchers change at runtime, loose coupling'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('addLot') + ', ' + c('addBidder') + ', ' + c('watch') + ', ' + c('unwatch') + ', ' + c('bid') + ' and ' + c('messages') + ', with the bid notifications, so that ' + c('testBidNotifications') + ' passes.',
          prefill: `public interface LotObserver {
    // ...
}

public class Bidder implements LotObserver {
    // ...
}

public class Lot {
    // ...
}

public class AuctionController {
    private Map<String, Lot> lots = new HashMap<>();
    private Map<String, Bidder> bidders = new HashMap<>();
    // ...
}`,
          model: `/** Observer interface: anything that wants to hear about a lot. */
public interface LotObserver {
    void update(String message);
}

/** Concrete observer. */
public class Bidder implements LotObserver {
    private final String id, name;
    private final List<String> inbox = new ArrayList<>();
    public Bidder(String id, String name) { this.id = id; this.name = name; }
    public String getName() { return name; }
    public void update(String message) { inbox.add(message); }
    public List<String> getMessages() { return List.copyOf(inbox); }
}

/** Subject. */
public class Lot {
    private final String name;
    private final double reserve;
    private final Set<Bidder> watchers = new LinkedHashSet<>();   // no duplicates, stable order
    private Bidder highestBidder;
    private double highestBid;

    public Lot(String name, double reserve) { this.name = name; this.reserve = reserve; }

    public void attach(Bidder b) { watchers.add(b); }
    public void detach(Bidder b) { watchers.remove(b); }

    public boolean bid(Bidder bidder, double amount) {
        if (amount <= highestBid) return false;           // must beat the current bid
        Bidder previous = highestBidder;
        highestBidder = bidder;
        highestBid = amount;
        attach(bidder);                                   // bidders watch automatically
        String news = String.format("New bid of $%.2f on %s by %s", amount, name, bidder.getName());
        for (Bidder w : new ArrayList<>(watchers)) {
            if (w == bidder) continue;
            w.update(w == previous ? "You have been outbid on " + name : news);
        }
        return true;
    }
}

public class AuctionController {
    private final Map<String, Lot> lots = new HashMap<>();
    private final Map<String, Bidder> bidders = new HashMap<>();

    public void addLot(String lotId, String name, double reserve) { lots.put(lotId, new Lot(name, reserve)); }
    public void addBidder(String bidderId, String name) { bidders.put(bidderId, new Bidder(bidderId, name)); }
    public void watch(String bidderId, String lotId) { lots.get(lotId).attach(bidders.get(bidderId)); }
    public void unwatch(String bidderId, String lotId) { lots.get(lotId).detach(bidders.get(bidderId)); }
    public boolean bid(String bidderId, String lotId, double amount) {
        return lots.get(lotId).bid(bidders.get(bidderId), amount);
    }
    public List<String> messages(String bidderId) { return bidders.get(bidderId).getMessages(); }
}`,
          checklist: ['LotObserver interface; Bidder implements it and stores messages', 'Lot keeps watchers (no duplicates) and notifies them; bid validation against the current highest', 'Outbid bidder gets the outbid message instead; the bidder gets nothing; accepted bidders auto-watch',
                      'Controller only looks objects up and delegates', 'Iterates over a copy (or otherwise safe) while notifying'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('close') + ', so that ' + c('testClose') + ' passes. Closing notifies every watcher of the result, handles a lot that is passed in, and stops any further bids.',
          prefill: `public class AuctionController {
    // ...
    public void close(String lotId) {
        // TODO
    }
}`,
          model: `// In Lot
private boolean closed = false;

public boolean bid(Bidder bidder, double amount) {
    if (closed || amount <= highestBid) return false;    // closed lots refuse bids
    ...                                                  // rest unchanged
}

public void close() {
    if (closed) return;
    closed = true;
    broadcast(highestBidder != null && highestBid >= reserve
            ? String.format("%s sold to %s for $%.2f", name, highestBidder.getName(), highestBid)
            : name + " passed in");
}

private void broadcast(String message) {
    for (Bidder w : new ArrayList<>(watchers)) w.update(message);
}

// In AuctionController
public void close(String lotId) { lots.get(lotId).close(); }`,
          checklist: ['Lot tracks closed state and rejects later bids', 'Sold vs passed in decided against the reserve (and no bids)', 'Every watcher, including the winner, notified with the exact format', 'Closing twice does not notify twice; controller just delegates'] }
      ] },

    /* ---------------------------------------------------------------- */
    { title: 'Project planner',
      intro: '<p>You are building <b>PlanIt</b>, which tracks the work left on a project.</p>' +
        '<ul><li>A <b>task</b> has a name, an estimate in whole hours, and whether it is done.</li>' +
        '<li>A <b>group</b> (e.g. a release or a milestone) has a name and contains tasks and/or other groups, nested to any depth.</li>' +
        '<li>For a task or a group you can ask for the total <b>estimate</b>, the <b>remaining</b> hours (the estimates of tasks not yet done) and the <b>progress</b>: hours done as a percentage of the estimate, rounded down. An empty group has progress 0.</li>' +
        '<li>An <b>outline</b> prints a group as an indented tree, two spaces per level. A group line shows its name and <code>(done/estimate h)</code>; a task line shows <code>[x]</code> or <code>[ ]</code>, its name and its estimate. Children appear in the order they were added.</li></ul>' +
        '<p>You must implement the methods of ' + c('PlannerController') + '.</p>',
      files: [
        { name: 'PlannerController.java', text: `public class PlannerController {
    /** parentId is null for a top-level group. */
    public void addGroup(String id, String name, String parentId) { ... }
    public void addTask(String id, String name, int hours, String parentId) { ... }
    public void complete(String taskId) { ... }
    public int estimate(String id) { ... }
    public int remaining(String id) { ... }
    public int progress(String id) { ... }
    public String outline(String id) { ... }
}` },
        { name: 'PlannerControllerTest.java', text: `private PlannerController sample() {
    PlannerController p = new PlannerController();
    p.addGroup("r1", "Release 1", null);
    p.addTask("t1", "Design", 8, "r1");
    p.addGroup("g1", "Build", "r1");
    p.addTask("t2", "Backend", 7, "g1");
    p.addTask("t3", "Frontend", 5, "g1");
    p.complete("t1");
    return p;
}

@Test
public void testEstimates() {
    PlannerController p = sample();
    assertEquals(20, p.estimate("r1"));
    assertEquals(12, p.remaining("r1"));
    assertEquals(12, p.remaining("g1"));
    assertEquals(0, p.remaining("t1"));
}

@Test
public void testProgressAndOutline() {
    PlannerController p = sample();
    assertEquals(40, p.progress("r1"));          // 8 of 20 hours
    assertEquals(0, p.progress("g1"));
    p.addGroup("g2", "Docs", "r1");
    assertEquals(0, p.progress("g2"));           // empty group
    assertEquals("Release 1 (8/20h)\\n"
               + "  [x] Design (8h)\\n"
               + "  Build (0/12h)\\n"
               + "    [ ] Backend (7h)\\n"
               + "    [ ] Frontend (5h)\\n"
               + "  Docs (0/0h)\\n", p.outline("r1"));
}` }
      ],
      parts: [
        { kind: 'written', marks: 3,
          prompt: 'What design pattern can be used to model this scenario? Justify your choice by explaining how the scenario maps to the key characteristics of the pattern.',
          model: '<p><b>Composite.</b></p><ul>' +
            '<li>Component: a ' + c('PlanItem') + ' interface with ' + c('estimate()') + ', ' + c('remaining()') + ', ' + c('progress()') + ' and ' + c('outline()') + '.</li>' +
            '<li>Leaf: ' + c('Task') + ', which answers from its own hours and done flag.</li>' +
            '<li>Composite: ' + c('Group') + ', which holds a list of PlanItems and computes each answer from its children, recursively.</li>' +
            '<li>Work forms a part-whole tree of any depth, and the controller asks a single task and a whole release the same questions through one interface.</li></ul>',
          checklist: ['Named Composite', 'Task as leaf, Group as composite holding PlanItems', 'Recursive tree of any depth, treated uniformly'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('addGroup') + ', ' + c('addTask') + ', ' + c('complete') + ', ' + c('estimate') + ' and ' + c('remaining') + ', creating the classes they need, so that ' + c('testEstimates') + ' passes.',
          prefill: `public interface PlanItem {
    // ...
}

public class Task implements PlanItem {
    // ...
}

public class Group implements PlanItem {
    // ...
}

public class PlannerController {
    // ...
}`,
          model: `/** Component: tasks and groups are both PlanItems. */
public interface PlanItem {
    int estimate();
    int remaining();
}

/** Leaf. */
public class Task implements PlanItem {
    private final String name;
    private final int hours;
    private boolean done = false;
    public Task(String name, int hours) { this.name = name; this.hours = hours; }
    public void complete() { done = true; }
    public int estimate() { return hours; }
    public int remaining() { return done ? 0 : hours; }
}

/** Composite: holds tasks and other groups, to any depth. */
public class Group implements PlanItem {
    private final String name;
    private final List<PlanItem> children = new ArrayList<>();
    public Group(String name) { this.name = name; }
    public void add(PlanItem item) { children.add(item); }
    public int estimate() { return children.stream().mapToInt(PlanItem::estimate).sum(); }
    public int remaining() { return children.stream().mapToInt(PlanItem::remaining).sum(); }
}

public class PlannerController {
    private final Map<String, PlanItem> items = new HashMap<>();
    private final Map<String, Task> tasks = new HashMap<>();
    private final Map<String, Group> groups = new HashMap<>();

    public void addGroup(String id, String name, String parentId) {
        Group g = new Group(name);
        attach(id, g, parentId);
        groups.put(id, g);
    }

    public void addTask(String id, String name, int hours, String parentId) {
        Task t = new Task(name, hours);
        attach(id, t, parentId);
        tasks.put(id, t);
    }

    private void attach(String id, PlanItem item, String parentId) {
        if (parentId != null) groups.get(parentId).add(item);
        items.put(id, item);
    }

    public void complete(String taskId) { tasks.get(taskId).complete(); }
    public int estimate(String id) { return items.get(id).estimate(); }
    public int remaining(String id) { return items.get(id).remaining(); }
}`,
          checklist: ['PlanItem interface; Task and Group implement estimate and remaining themselves', 'Group sums its children through the interface (no instanceof)', 'Controller keeps id → item lookups and attaches new items to their parent', 'complete() only on tasks; done tasks count 0 remaining'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('progress') + ' and ' + c('outline') + ', so that ' + c('testProgressAndOutline') + ' passes.',
          prefill: `public class PlannerController {
    // ...
    public int progress(String id) {
        // TODO
    }

    public String outline(String id) {
        // TODO
    }
}`,
          model: `public interface PlanItem {
    int estimate();
    int remaining();
    String outline(String indent);

    default int doneHours() { return estimate() - remaining(); }

    /** Percentage of hours done, rounded down; 0 for an empty group. */
    default int progress() {
        return estimate() == 0 ? 0 : doneHours() * 100 / estimate();
    }
}

// In Task
public String outline(String indent) {
    return indent + (done ? "[x] " : "[ ] ") + name + " (" + hours + "h)\\n";
}

// In Group
public String outline(String indent) {
    StringBuilder sb = new StringBuilder(
            indent + name + " (" + doneHours() + "/" + estimate() + "h)\\n");
    for (PlanItem child : children) sb.append(child.outline(indent + "  "));
    return sb.toString();
}

// In PlannerController
public int progress(String id) { return items.get(id).progress(); }
public String outline(String id) { return items.get(id).outline(""); }`,
          checklist: ['progress computed once (default method or abstract class), integer division rounds down', 'Empty group handled (no division by zero)', 'outline recursive, two spaces per level, children in insertion order', 'Exact output format matches the test'] }
      ] },

    /* ---------------------------------------------------------------- */
    { title: 'Dungeon levels',
      intro: '<p>You are building the level generator for a dungeon game. Every level is made of rooms and has a difficulty. Each difficulty has its own matching set of parts:</p>' +
        '<ul><li><b>Easy</b>: enemy <i>Goblin</i> (3 damage), trap <i>Spike pit</i> (5 damage), reward 10 gold per room.</li>' +
        '<li><b>Hard</b>: enemy <i>Troll</i> (9 damage), trap <i>Fire trap</i> (15 damage), reward 40 gold per room.</li></ul>' +
        '<p>Rooms alternate, starting with an enemy room: enemy, trap, enemy, trap… Every room gives one reward. Parts from different difficulties must never be mixed in one level, and more difficulties will be added.</p>' +
        '<p>You must implement the methods of ' + c('DungeonController') + '.</p>',
      files: [
        { name: 'DungeonController.java', text: `public class DungeonController {
    /** difficulty is "easy" or "hard" (part c adds "nightmare"); returns a level id.
     *  Throws IllegalArgumentException for an unknown difficulty. */
    public String createLevel(String difficulty, int rooms) { ... }
    public int totalDamage(String levelId) { ... }
    public int totalGold(String levelId) { ... }
    public String describe(String levelId) { ... }
}` },
        { name: 'DungeonControllerTest.java', text: `@Test
public void testTotals() {
    DungeonController d = new DungeonController();
    String easy = d.createLevel("easy", 3);
    assertEquals(11, d.totalDamage(easy));       // 3 + 5 + 3
    assertEquals(30, d.totalGold(easy));
    String hard = d.createLevel("hard", 4);
    assertEquals(48, d.totalDamage(hard));       // 9 + 15 + 9 + 15
    assertEquals(160, d.totalGold(hard));
    assertThrows(IllegalArgumentException.class, () -> d.createLevel("medium", 2));
}

@Test
public void testDescribeAndNightmare() {
    DungeonController d = new DungeonController();
    String easy = d.createLevel("easy", 3);
    String nightmare = d.createLevel("nightmare", 2);
    assertEquals("Easy level: Goblin, Spike pit, Goblin (30 gold)", d.describe(easy));
    assertEquals("Nightmare level: Dragon, Lava pit (200 gold)", d.describe(nightmare));
    assertEquals(55, d.totalDamage(nightmare));
}` }
      ],
      parts: [
        { kind: 'written', marks: 3,
          prompt: 'What design pattern can be used to model this scenario? Justify your choice by explaining how the scenario maps to the key characteristics of the pattern.',
          model: '<p><b>Abstract Factory.</b></p><ul>' +
            '<li>Abstract factory: a ' + c('DifficultyFactory') + ' interface with one create method per product: ' + c('createEnemy()') + ', ' + c('createTrap()') + ', ' + c('createReward()') + '.</li>' +
            '<li>Concrete factories: ' + c('EasyFactory') + ' and ' + c('HardFactory') + ', one per family.</li>' +
            '<li>Abstract products: room (enemy/trap) and reward types; concrete products: Goblin, Troll, Spike pit, Fire trap, 10 and 40 gold.</li>' +
            '<li>The products come in <b>families that must match</b>. A Level is given one factory and only ever creates parts through it, so mixing difficulties is impossible, and a new difficulty is one new factory with no change to Level.</li></ul>',
          checklist: ['Named Abstract Factory', 'Factory interface with a create method per product; one concrete factory per difficulty', 'Justified: families of related products that must not be mixed', 'Extensible: new difficulty = new factory'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('createLevel') + ', ' + c('totalDamage') + ' and ' + c('totalGold') + ' for easy and hard levels, so that ' + c('testTotals') + ' passes.',
          prefill: `public interface DifficultyFactory {
    // ...
}

public class Level {
    // ...
}

public class DungeonController {
    private Map<String, Level> levels = new HashMap<>();
    // ...
}`,
          model: `// ---- abstract products ---------------------------------------------
public interface Room {
    String getName();
    int damage();
}
public interface Reward {
    int gold();
}

// ---- concrete products ---------------------------------------------
/** Enemies and traps differ only in name and damage, so one class each
 *  is enough; the factories decide the values. */
public class Enemy implements Room {
    private final String name;
    private final int damage;
    public Enemy(String name, int damage) { this.name = name; this.damage = damage; }
    public String getName() { return name; }
    public int damage() { return damage; }
}
public class Trap implements Room {
    private final String name;
    private final int damage;
    public Trap(String name, int damage) { this.name = name; this.damage = damage; }
    public String getName() { return name; }
    public int damage() { return damage; }
}
public class Gold implements Reward {
    private final int amount;
    public Gold(int amount) { this.amount = amount; }
    public int gold() { return amount; }
}

// ---- abstract factory and one concrete factory per difficulty ------
public interface DifficultyFactory {
    Room createEnemy();
    Room createTrap();
    Reward createReward();
}
public class EasyFactory implements DifficultyFactory {
    public Room createEnemy()    { return new Enemy("Goblin", 3); }
    public Room createTrap()     { return new Trap("Spike pit", 5); }
    public Reward createReward() { return new Gold(10); }
}
public class HardFactory implements DifficultyFactory {
    public Room createEnemy()    { return new Enemy("Troll", 9); }
    public Room createTrap()     { return new Trap("Fire trap", 15); }
    public Reward createReward() { return new Gold(40); }
}

/** A level only ever talks to one factory, so its parts always match. */
public class Level {
    private final List<Room> rooms = new ArrayList<>();
    private final List<Reward> rewards = new ArrayList<>();

    public Level(DifficultyFactory factory, int roomCount) {
        for (int i = 0; i < roomCount; i++) {
            rooms.add(i % 2 == 0 ? factory.createEnemy() : factory.createTrap());
            rewards.add(factory.createReward());
        }
    }
    public int totalDamage() { return rooms.stream().mapToInt(Room::damage).sum(); }
    public int totalGold() { return rewards.stream().mapToInt(Reward::gold).sum(); }
}

public class DungeonController {
    private final Map<String, Level> levels = new HashMap<>();
    private int nextId = 1;

    public String createLevel(String difficulty, int rooms) {
        String id = "level" + nextId++;
        levels.put(id, new Level(factoryFor(difficulty), rooms));
        return id;
    }

    /** The only place that maps a name to a family. */
    private DifficultyFactory factoryFor(String difficulty) {
        switch (difficulty) {
            case "easy": return new EasyFactory();
            case "hard": return new HardFactory();
            default: throw new IllegalArgumentException("unknown difficulty: " + difficulty);
        }
    }

    public int totalDamage(String levelId) { return levels.get(levelId).totalDamage(); }
    public int totalGold(String levelId) { return levels.get(levelId).totalGold(); }
}`,
          checklist: ['DifficultyFactory with createEnemy, createTrap, createReward; Easy and Hard factories', 'Level builds alternating rooms and rewards using only its factory', 'Totals computed polymorphically (no switch on difficulty outside one factory-selection method)', 'Unknown difficulty throws IllegalArgumentException'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('describe') + ', and add a <b>nightmare</b> difficulty: enemy <i>Dragon</i> (25 damage), trap <i>Lava pit</i> (30 damage), reward 100 gold per room. ' + c('describe') + ' gives the difficulty, the room names in order, and the total gold, as in ' + c('testDescribeAndNightmare') + '.',
          prefill: `public class DungeonController {
    // ...
    public String describe(String levelId) {
        // TODO
    }
}`,
          model: `public interface DifficultyFactory {
    String getName();                 // new: used by describe
    Room createEnemy();
    Room createTrap();
    Reward createReward();
}

public class EasyFactory implements DifficultyFactory {
    public String getName() { return "Easy"; }
    ...
}
public class HardFactory implements DifficultyFactory {
    public String getName() { return "Hard"; }
    ...
}

/** The new difficulty is one new class. */
public class NightmareFactory implements DifficultyFactory {
    public String getName()      { return "Nightmare"; }
    public Room createEnemy()    { return new Enemy("Dragon", 25); }
    public Room createTrap()     { return new Trap("Lava pit", 30); }
    public Reward createReward() { return new Gold(100); }
}

// In Level
private final String difficulty;      // set from factory.getName() in the constructor

public String describe() {
    return difficulty + " level: "
         + rooms.stream().map(Room::getName).collect(Collectors.joining(", "))
         + " (" + totalGold() + " gold)";
}

// In DungeonController
private DifficultyFactory factoryFor(String difficulty) {
    switch (difficulty) {
        case "easy":      return new EasyFactory();
        case "hard":      return new HardFactory();
        case "nightmare": return new NightmareFactory();
        default: throw new IllegalArgumentException("unknown difficulty: " + difficulty);
    }
}

public String describe(String levelId) { return levels.get(levelId).describe(); }`,
          checklist: ['NightmareFactory added as one new class; Level unchanged apart from describe', 'describe joins room names in order with ", " and shows total gold', 'Difficulty name comes from the factory, not a second switch', 'Exact output format matches the test'] }
      ] }
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
