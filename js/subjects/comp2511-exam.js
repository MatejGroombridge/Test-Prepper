/* subjects/comp2511-exam.js — a harder exam-style set for every section of
   the COMP2511 final, written to the 26T3 outline. These aim above the
   sample exam: subtle dispatch and generics traces, contract reasoning with
   invariants, pattern pitfalls (cycles, re-entrant notification, identity),
   concurrency bugs, design evaluation in architecture, and Section 3
   problems that combine a pattern with a real edge case.
   Load after comp2511-labs.js, before comp2511.js. */
(function (global) {
  'use strict';

  var D = global.COMP2511Data;
  var pre = D.pre, c = D.c;
  var SRC = 'harder exam-style set';

  function add(bank, key, items) {
    items.forEach(function (x) { x.src = SRC; });
    bank[key] = (bank[key] || []).concat(items);
  }
  function addList(list, items) {
    items.forEach(function (x) { x.src = SRC; list.push(x); });
  }
  function ul(items) { return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>'; }

  /* ===================== Section 1: multiple choice ===================== */

  add(D.MCQ, 'oo', [
    { q: 'What does this print?' + pre(`
static void f(long x)    { System.out.println("long"); }
static void f(Integer x) { System.out.println("Integer"); }
static void f(int... x)  { System.out.println("varargs"); }

f(5);`),
      o: ['long', 'Integer', 'varargs', 'It does not compile: the call is ambiguous'],
      why: 'Overload resolution runs in phases. Phase 1 allows only widening (no boxing, no varargs): ' + c('int → long') + ' works, so ' + c('f(long)') + ' wins before boxing to ' + c('Integer') + ' (phase 2) or varargs (phase 3) are even considered.' },
    { q: 'What does this print?' + pre(`
class Base {
    Base() { init(); }
    void init() { System.out.println("base"); }
}
class Child extends Base {
    private String name = "child";
    @Override
    void init() { System.out.println(name); }
}

new Child();`),
      o: ['null', 'child', 'base', 'It throws a NullPointerException'],
      why: 'The Base constructor runs before Child’s field initialisers. Its call to ' + c('init()') + ' still dispatches to the override (the object is already a Child), which reads ' + c('name') + ' while it is still ' + c('null') + '. Printing a null String prints "null", it does not throw. This is why constructors should not call overridable methods.' },
    { q: 'What does this print?' + pre(`
class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }
    public boolean equals(Point p) { return x == p.x && y == p.y; }
    public int hashCode() { return 31 * x + y; }
}

Set<Point> s = new HashSet<>();
s.add(new Point(1, 2));
Object o = new Point(1, 2);
System.out.println(s.contains(new Point(1, 2)) + " " + new Point(1, 2).equals(o));`),
      o: ['false false', 'true true', 'true false', 'false true'],
      why: c('equals(Point)') + ' <i>overloads</i> ' + c('equals(Object)') + ', it does not override it. HashSet calls ' + c('equals(Object)') + ', which is still identity, so ' + c('contains') + ' is false even with matching hash codes. In the second call the argument’s declared type is ' + c('Object') + ', so the compiler also picks ' + c('equals(Object)') + ': false. An ' + c('@Override') + ' annotation would have caught it.' },
    { q: 'What does ' + c('new C().hi()') + ' return?' + pre(`
interface A { default String hi() { return "A"; } }
interface B extends A { default String hi() { return "B"; } }
class C implements A, B { }`),
      o: ['"B"', '"A"', 'It does not compile: C inherits two defaults for hi()', 'It throws at runtime'],
      why: 'When one interface’s default overrides another’s, the more specific one (B, which extends A) wins. It would only fail to compile if A and B were unrelated, in which case C must override ' + c('hi()') + ' itself (and may call ' + c('A.super.hi()') + ').' }
  ]);

  add(D.MCQ, 'dbc', [
    { q: c('Account') + ' has the invariant ' + c('balance ≥ 0') + '. ' + c('withdraw(a)') + ' has precondition ' + c('0 < a ≤ balance') + ' and postcondition ' + c('balance == old(balance) − a') + '. Which subclass is a valid subtype?',
      o: ['Pre: 0 < a ≤ balance. Post: balance == old(balance) − a, and the withdrawal is appended to a history list.',
          'Pre: 0 < a ≤ balance + 100 (an overdraft). Post: balance == old(balance) − a.',
          'Pre: 0 < a ≤ balance and a ≤ 500. Post: balance == old(balance) − a.',
          'Pre: 0 < a ≤ balance. Post: balance == old(balance) − a − 1 (a $1 fee).'],
      why: 'Recording history strengthens the postcondition without contradicting it, so it is fine. The overdraft <i>weakens</i> the precondition (allowed on its own), but the resulting negative balance breaks the inherited invariant. The $500 cap strengthens the precondition. The fee contradicts the parent’s postcondition, and withdrawing the whole balance would leave −1, breaking the invariant too.' },
    { q: 'The parent declares ' + c('public Number compute() throws IOException') + '. Which override in a subclass compiles?',
      o: [c('public Integer compute() throws FileNotFoundException'),
          c('public Object compute()'),
          c('public Integer compute() throws Exception'),
          c('protected Number compute()')],
      why: 'An override may narrow the return type (covariant return, a stronger postcondition), throw fewer or narrower checked exceptions, and keep or widen access. ' + c('Object') + ' widens the return type, ' + c('Exception') + ' is broader than ' + c('IOException') + ', and ' + c('protected') + ' narrows access: all three would break code written against the parent, so the compiler rejects them.' },
    { q: c('Team') + ' has the invariant ' + c('players.size() ≤ 11') + ', and every mutator checks it before changing anything. A test still finds a Team with 12 players. What is the most likely cause?',
      o: [c('getPlayers()') + ' returns the internal list, so a client added a player directly',
          'The invariant was only checked in the constructor',
          'A subclass weakened the precondition of ' + c('addPlayer') + '',
          'The list is an ' + c('ArrayList') + ' rather than a ' + c('LinkedList') + ''],
      why: 'Invariants can only be guaranteed if the state is encapsulated. Returning the mutable internal list (representation exposure) lets clients bypass every check. Return ' + c('List.copyOf(players)') + ' or ' + c('Collections.unmodifiableList(players)') + '. The second option is ruled out by the question, which says every mutator checks.' }
  ]);

  add(D.MCQ, 'principles', [
    { q: 'Inside ' + c('class Checkout { private Cart cart; void pay(PaymentGateway gw) { … } }') + ', which of these calls comply with the Law of Demeter?<br>' +
        'I. ' + c('gw.charge(cart.total())') + '<br>II. ' + c('new Receipt(cart.total()).print()') + '<br>III. ' + c('cart.getCustomer().getEmail()') + '<br>IV. ' + c('gw.lastTransaction().refund()'),
      o: ['I and II only', 'I only', 'I, II and III', 'II and IV only'], fixed: true,
      why: 'A method may talk to ' + c('this') + ', its fields (cart), its parameters (gw) and objects it creates (the new Receipt). III and IV call methods on objects <i>returned by</i> a friend, a stranger. ' + c('cart.total()') + ' in I and II is fine: cart is a field.' },
    { q: c('ReportService') + ' contains ' + c('private PdfWriter writer = new PdfWriter();') + '. Which change best applies the Dependency Inversion Principle?',
      o: ['Define a ' + c('ReportWriter') + ' interface that ReportService needs, have PdfWriter implement it, and pass one in through the constructor',
          'Make PdfWriter a Singleton and call ' + c('PdfWriter.getInstance()') + '',
          'Make ReportService extend PdfWriter so it can call the write methods directly',
          'Move ' + c('new PdfWriter()') + ' into a private static factory method in ReportService'],
      why: 'DIP: the high-level module depends on an abstraction it owns, and the low-level detail implements it. The other three all leave ReportService bound to the concrete PdfWriter class; the Singleton and the static factory just hide the ' + c('new') + '.' },
    { q: c('ReadOnlyList<E> implements List<E>') + ' throws ' + c('UnsupportedOperationException') + ' from ' + c('add') + ', ' + c('remove') + ', ' + c('set') + ' and ' + c('clear') + '. Which two principles does this most directly break?',
      o: ['Liskov Substitution and Interface Segregation', 'Open-Closed and Single Responsibility', 'Dependency Inversion and the Law of Demeter', 'Single Responsibility and Dependency Inversion'],
      why: 'Code written against ' + c('List') + ' that adds an element breaks when handed a ReadOnlyList (LSP: the subtype cannot honour the parent’s contract). And ReadOnlyList is forced to depend on mutators it cannot support (ISP: the interface is too fat for this client). The JDK accepts this trade-off by documenting the methods as "optional operations".' }
  ]);

  add(D.MCQ, 'java', [
    { q: c('readFile()') + ' declares ' + c('throws IOException') + '. What happens with this code?' + pre(`
try {
    readFile();
} catch (Exception e) {
    System.out.println("general");
} catch (FileNotFoundException e) {
    System.out.println("missing");
}`),
      o: ['It does not compile: the second catch is unreachable',
          'It prints "missing" when the file does not exist',
          'It prints "general" for every exception, and the second catch is ignored',
          'It does not compile: FileNotFoundException is not thrown by readFile()'],
      why: 'Catch blocks are tried in order, and ' + c('FileNotFoundException') + ' is a subclass of ' + c('Exception') + ', so the second block could never run. Java treats an unreachable catch as a compile error. Put the most specific catch first.' },
    { q: 'Which of these lines compile?' + pre(`
List<? extends Number> a = new ArrayList<Integer>();   // 1
a.add(3);                                               // 2
Number n = a.get(0);                                    // 3
List<? super Integer> b = new ArrayList<Number>();      // 4
b.add(3);                                               // 5
Integer i = b.get(0);                                   // 6`),
      o: ['1, 3, 4 and 5', 'All six', '1, 2, 3 and 4', '1, 3, 5 and 6'],
      why: 'PECS. ' + c('? extends Number') + ' is a producer: you can read Numbers out (3) but cannot add anything (2), because the list might really be a ' + c('List<Double>') + '. ' + c('? super Integer') + ' is a consumer: you can add Integers (5), but reading gives only ' + c('Object') + ' (6 fails without a cast).' },
    { q: 'What is wrong with this test?' + pre(`
@Test
public void negativeWithdrawalRejected() {
    try {
        account.withdraw(-5);
    } catch (IllegalArgumentException e) {
        assertEquals("negative amount", e.getMessage());
    }
}`),
      o: ['It passes even if withdraw throws nothing at all',
          'It fails whenever withdraw throws, because the exception escapes the test',
          'It does not compile: assertEquals cannot be used in a catch block',
          'Nothing: it is the recommended JUnit 5 style'],
      why: 'If no exception is thrown, the catch never runs and the test passes vacuously. Use ' + c('var e = assertThrows(IllegalArgumentException.class, () -> account.withdraw(-5));') + ' and then assert on ' + c('e.getMessage()') + ' (or add ' + c('fail()') + ' after the call).' }
  ]);

  add(D.MCQ, 'fp', [
    { q: 'What does this print?' + pre(`
List<String> log = new ArrayList<>();
Optional<Integer> r = Stream.of(1, 2, 3, 4)
        .peek(x -> log.add("p" + x))
        .filter(x -> x % 2 == 0)
        .map(x -> x * 10)
        .findFirst();
System.out.println(log + " " + r.get());`),
      o: ['[p1, p2] 20', '[p1, p2, p3, p4] 20', '[] 20', '[p1, p2, p3, p4] 2'],
      why: 'Streams are lazy and process one element at a time through the whole pipeline. 1 is peeked and filtered out; 2 is peeked, passes, becomes 20, and ' + c('findFirst') + ' short-circuits, so 3 and 4 are never pulled.' },
    { q: 'Pick the most semantically correct type for the redacted declaration:' + pre(`
[redacted] r = words.stream()
        .collect(Collectors.groupingBy(String::length, Collectors.counting()));`),
      o: [c('Map<Integer, Long>'), c('Map<Integer, Integer>'), c('Map<String, Long>'), c('Map<Integer, List<String>>')],
      why: 'The classifier ' + c('String::length') + ' gives Integer keys, and the downstream collector ' + c('counting()') + ' produces a ' + c('Long') + '. Without the downstream collector the values would be ' + c('List<String>') + '.' },
    { q: c('loadDefault()') + ' prints "loading" and returns "guest". What happens?' + pre(`
String name = Optional.of("Ann").orElse(loadDefault());`),
      o: ['"loading" is printed, and name is "Ann"', 'Nothing is printed, and name is "Ann"', '"loading" is printed, and name is "guest"', 'It throws, because orElse needs a Supplier'],
      why: c('orElse') + ' takes a value, and Java evaluates arguments before the call, so ' + c('loadDefault()') + ' always runs, even though the Optional is present. ' + c('orElseGet(this::loadDefault)') + ' takes a Supplier and only calls it when the Optional is empty.' },
    { q: 'Given ' + c('Function<Integer, Integer> f = x -> x + 1;') + ' and ' + c('Function<Integer, Integer> g = x -> x * 2;') + ', what are ' + c('f.andThen(g).apply(3)') + ' and ' + c('f.compose(g).apply(3)') + '?',
      o: ['8 and 7', '7 and 8', '8 and 8', '7 and 7'], fixed: true,
      why: c('f.andThen(g)') + ' applies f first, then g: (3 + 1) × 2 = 8. ' + c('f.compose(g)') + ' applies g first, then f: 3 × 2 + 1 = 7.' }
  ]);

  add(D.MCQ, 'smells', [
    { q: 'A team removes every Message Chain in the codebase by adding a delegating method at each step (Hide Delegate). Which smell are they most at risk of creating?',
      o: ['Middle Man', 'Feature Envy', 'Shotgun Surgery', 'Data Clumps'],
      why: 'Hide Delegate and Remove Middle Man are opposites. Hiding every delegate turns classes into pass-throughs that mostly forward calls: Middle Man. The fix is a balance, often moving the behaviour itself (Move Method) instead of forwarding to it.' },
    { q: 'Every time a new ' + c('Shape') + ' subclass is added, a matching ' + c('ShapeRenderer') + ' subclass and a ' + c('ShapeSerializer') + ' subclass must also be added. Which smell is this most precisely?',
      o: ['Parallel Inheritance Hierarchies', 'Shotgun Surgery', 'Divergent Change', 'Refused Bequest'],
      why: 'Parallel Inheritance Hierarchies is a special case of Shotgun Surgery in which each new subclass in one hierarchy forces one in another. It is the more precise name here.' },
    { q: 'Which of these changes is <b>not</b> a refactoring?',
      o: ['Making a lookup return an empty list instead of null when nothing is found',
          'Extracting the discount calculation into its own method',
          'Replacing ' + c('1.1') + ' with a constant ' + c('GST_MULTIPLIER') + '',
          'Moving a method from Invoice to Customer, leaving a delegating method behind'],
      why: 'A refactoring changes structure without changing observable behaviour. Callers that checked for null now behave differently, so the first option is a behaviour change (a good one, but it needs its own tests).' }
  ]);

  add(D.MCQ, 'patterns', [
    { q: 'A subject notifies observers with ' + c('for (Observer o : observers) o.update(this);') + ' over an ArrayList. One observer unsubscribes itself inside its ' + c('update') + '. What typically happens?',
      o: ['A ConcurrentModificationException is thrown from the loop',
          'The observer is removed and every other observer is still notified normally',
          'It deadlocks, because the subject is locked during notification',
          'The observer is notified a second time'],
      why: 'Modifying an ArrayList while a for-each loop iterates over it makes the iterator fail fast. Notify over a snapshot: ' + c('for (Observer o : List.copyOf(observers))') + ', or use a ' + c('CopyOnWriteArrayList') + '.' },
    { q: 'In a file-system Composite, ' + c('Folder.size()') + ' returns the sum of its children’s sizes. A user moves a folder into one of its own sub-folders. What happens the next time ' + c('size()') + ' is called on it?',
      o: ['Infinite recursion, ending in a StackOverflowError', 'It returns 0', 'It counts the moved folder twice', 'Java detects the cycle and throws an IllegalStateException'],
      why: 'A Composite assumes a tree. A cycle makes the recursive operation loop forever. ' + c('add') + ' should reject a child that is the folder itself or one of its ancestors, e.g. by checking ' + c('child.contains(this)') + ' before adding.' },
    { q: 'Which is a genuine limitation of the Decorator pattern?',
      o: ['A decorated object is a different object: identity checks and ' + c('instanceof') + ' on the inner component only see the outermost wrapper',
          'Decorators cannot be combined at runtime',
          'Each combination of features needs its own subclass',
          'The component must be an abstract class rather than an interface'],
      why: 'Wrapping changes identity: ' + c('new Milk(coffee) != coffee') + ', and code asking ' + c('c instanceof Sugar') + ' fails unless Sugar happens to be outermost. The other options describe what Decorator <i>solves</i>, or are false.' },
    { q: 'A GUI toolkit uses Abstract Factory, with ' + c('createButton()') + ' and ' + c('createCheckbox()') + ' and a Light and a Dark factory. What does adding a new product, a ' + c('Slider') + ', require?',
      o: ['Changing the factory interface and every concrete factory',
          'Adding one new concrete factory and nothing else',
          'Only adding the LightSlider and DarkSlider classes',
          'Nothing in the factories, because clients create sliders directly'],
      why: 'Abstract Factory makes new <i>families</i> cheap (one new factory) but new <i>product types</i> expensive: the interface gains ' + c('createSlider()') + ', so every existing factory must change. That is the pattern’s main trade-off.' }
  ]);

  add(D.MCQ, 'async', [
    { q: 'Why does double-checked locking need ' + c('instance') + ' to be ' + c('volatile') + '?' + pre(`
public static Config getInstance() {
    if (instance == null) {
        synchronized (Config.class) {
            if (instance == null) instance = new Config();
        }
    }
    return instance;
}`),
      o: ['Without it, another thread can see a non-null reference to an object whose constructor has not finished',
          'Without it, two Config objects are always created',
          'synchronized cannot be used on a class literal unless the field is volatile',
          'volatile makes the whole method atomic, so the synchronized block could be removed'],
      why: 'Writes can be reordered, so the reference may be published before the fields are written. A thread taking the unsynchronised fast path would then use a half-built object. ' + c('volatile') + ' forbids that reordering. (An eager ' + c('static final') + ' instance avoids the problem entirely.)' },
    { q: 'Two threads each create <b>their own</b> Counter and call ' + c('inc()') + ' 1,000 times. What is the final value of ' + c('count') + '?' + pre(`
class Counter {
    private static int count = 0;
    public synchronized void inc() { count++; }
}`),
      o: ['Any value up to 2,000: the threads lock different objects', 'Always 2,000', 'Always 1,000', 'It deadlocks'],
      why: 'A synchronized instance method locks ' + c('this') + '. Two different Counters mean two different locks, so nothing stops the threads interleaving on the shared static field. Use a ' + c('static synchronized') + ' method, a lock on ' + c('Counter.class') + ', or an ' + c('AtomicInteger') + '.' },
    { q: c('fetchUser(id)') + ' returns ' + c('CompletableFuture<User>') + ' and ' + c('fetchOrders(user)') + ' returns ' + c('CompletableFuture<List<Order>>') + '. What is the type of ' + c('fetchUser(id).thenApply(this::fetchOrders)') + '?',
      o: [c('CompletableFuture<CompletableFuture<List<Order>>>') + ': use ' + c('thenCompose') + ' to flatten it',
          c('CompletableFuture<List<Order>>'),
          c('List<Order>') + ', because ' + c('thenApply') + ' waits for the result',
          'It does not compile'],
      why: c('thenApply') + ' is map: it wraps whatever the function returns, giving a future of a future. ' + c('thenCompose') + ' is flatMap: it chains an asynchronous step, giving ' + c('CompletableFuture<List<Order>>') + '.' }
  ]);

  add(D.MCQ, 'model', [
    { q: 'A Student takes many Courses and a Course has many Students. Each student receives a grade in each course they take. Where does the grade belong?',
      o: ['In an Enrolment class linking one Student to one Course, with the grade as its field',
          'A ' + c('grade') + ' field on Student',
          'A ' + c('List<Integer> grades') + ' on Course, kept in the same order as its student list',
          'A ' + c('grade') + ' field on Course'],
      why: 'The grade belongs to the <i>pair</i>, not to either end. Make the relationship a class (an association class): Student 1 — 0..* Enrolment 0..* — 1 Course. Parallel lists are fragile, and a single field on either side cannot hold one grade per course or per student.' },
    { q: 'A model has ' + c('Order 1 ◆—— 1..* OrderLine') + ' and ' + c('OrderLine 0..* —— 1 Product') + '. Which statement is <b>false</b>?',
      o: ['Deleting a Product deletes the OrderLines that refer to it',
          'An Order cannot exist with zero lines',
          'A Product can appear on many order lines',
          'Deleting an Order deletes its OrderLines'],
      why: 'Only Order–OrderLine is a composition (filled diamond), so lines live and die with their order. Product–OrderLine is a plain association: removing a product does not destroy history. 1..* means at least one line, and 0..* at the line end means a product may be on many lines.' }
  ]);

  add(D.MCQ, 'archfund', [
    { q: 'Which of these is an <b>architectural</b> decision, rather than a design decision?',
      o: ['The UI may only call the business layer; it may never query the database directly',
          'Tax calculation will use the Strategy pattern',
          'Prices will be stored as BigDecimal rather than double',
          'The repository class will be named OrderRepository'],
      why: 'Architectural decisions are structural rules that constrain the whole system and its characteristics: here, closed layers and layers of isolation. The others are local design choices inside one component.' },
    { q: 'A diagram shows the controllers, services and repositories inside the API application, and how they reach the database. Which C4 level is it?',
      o: ['Component (level 3)', 'Container (level 2)', 'System Context (level 1)', 'Code (level 4)'],
      why: 'Zooming into one container (the API) to show its major building blocks is the Component diagram. The Container diagram stops at "API application" and "Database" as boxes, and Code shows classes.' },
    { q: 'Five services share one database "to make reporting easy". Which characteristic is most compromised?',
      o: ['Independent deployability and modifiability: any schema change must be coordinated across every service',
          'Read performance', 'Usability', 'Security of the database password'],
      why: 'The shared schema becomes a hidden contract between all five services, so none can change its data model or deploy alone. It is a distributed monolith. Reporting needs are better met by a reporting store fed by events or replicas.' }
  ]);

  add(D.MCQ, 'styles', [
    { q: 'In a choreographed saga, Payment has already charged the customer, then Inventory fails to reserve stock. What should happen?',
      o: ['Inventory publishes a failure event; Payment reacts by refunding (a compensating transaction)',
          'The database rolls back both services’ changes in one distributed transaction',
          'The Order service connects to the Payment database and deletes the payment row',
          'Nothing: the saga guarantees Inventory cannot fail after Payment succeeds'],
      why: 'Sagas replace one ACID transaction with a sequence of local transactions, and each step needs a compensating action that semantically undoes it. Each service owns its data, so no one reaches into another service’s database.' },
    { q: 'An event broker delivers each event <i>at least once</i>, so a consumer may see the same OrderPlaced event twice. Which property must the consumer’s handler have?',
      o: ['Idempotency: processing the same event twice has the same effect as processing it once',
          'Statelessness: it must not write to a database',
          'Synchronous execution: it must reply to the producer',
          'Ordering: it must process events in the order they were published'],
      why: 'With at-least-once delivery, duplicates are normal. Handlers record processed event IDs, or use naturally idempotent writes (upserts keyed by order ID), so a retry does not, for example, charge twice.' },
    { q: 'A team wants to transcode uploaded 4K videos in a serverless function. Each job takes 30–40 minutes. What is the main problem?',
      o: ['Functions have a maximum execution time (about 15 minutes on AWS Lambda), so the job is cut off',
          'Functions cannot be triggered by file uploads',
          'Serverless platforms cannot scale beyond one instance',
          'Functions cannot read files from object storage'],
      why: 'Serverless suits short, event-triggered work. Long jobs belong in a container or batch service. Alternatively, split the work into chunks that are each processed by a function and orchestrated by a workflow.' },
    { q: 'In a modular monolith, the Billing module calls ' + c('enrolment.internal.EnrolmentRepository') + ' directly. What is the best response?',
      o: ['Modules should talk only through each other’s published API (an interface). Restrict internals with package visibility or architecture tests.',
          'Nothing: in a monolith every class may call any other',
          'Split Billing into a microservice so it cannot see the repository',
          'Merge Billing and Enrolment into one module'],
      why: 'A modular monolith’s value is its enforced domain boundaries. Reaching into another module’s internals couples them and erodes the boundary, which later blocks extraction into a service. Enforce it in the build or with tests rather than reaching for a distributed fix.' }
  ]);

  /* ===================== Section 2: short answer ======================== */

  add(D.SHORT, 'oo', [
    { m: 4,
      q: 'What does the following print? Explain each line with reference to static and dynamic polymorphism.' + pre(`
class A {
    void m(A a) { System.out.println("A.m(A)"); }
    void m(B b) { System.out.println("A.m(B)"); }
}
class B extends A {
    @Override
    void m(A a) { System.out.println("B.m(A)"); }
}

A x = new B();
B y = new B();
A z = y;
x.m(y);
x.m(z);
y.m(x);`),
      model: '<p>It prints <b>A.m(B)</b>, <b>B.m(A)</b>, <b>B.m(A)</b>.</p>' + ul([
        c('x.m(y)') + ': the compiler sees an argument declared as ' + c('B') + ', so it picks the most specific overload, ' + c('m(B)') + '. At runtime x is a B, but B does not override ' + c('m(B)') + ', so A’s version runs.',
        c('x.m(z)') + ': z is declared as ' + c('A') + ' (even though it refers to a B), so the compiler picks ' + c('m(A)') + '. At runtime x is a B, which overrides ' + c('m(A)') + ': "B.m(A)".',
        c('y.m(x)') + ': the argument is declared ' + c('A') + ', so ' + c('m(A)') + ' is chosen, and B’s override runs.',
        'The rule: the overload (signature) is chosen at compile time from <i>declared</i> types; the override (body) is chosen at runtime from the receiver’s <i>actual</i> class. Argument runtime types never affect dispatch (Java is single-dispatch).']),
      must: ['All three lines correct, in order', 'Overload chosen from declared argument types at compile time', 'Override chosen from the receiver’s runtime class', 'Noted B does not override m(B) / arguments’ runtime types are ignored'] },
    { m: 4,
      q: c('Student') + ' implements ' + c('equals') + ' and ' + c('hashCode') + ' using its ' + c('zid') + ' field, and has a ' + c('setZid') + ' method.' + pre(`
Set<Student> s = new HashSet<>();
Student st = new Student("z1234567", "Ann");
s.add(st);
st.setZid("z7654321");
System.out.println(s.contains(st));
s.add(st);
System.out.println(s.size());`) +
        'a) Explain why the first line almost certainly prints ' + c('false') + ' and the second prints ' + c('2') + ', even though only one Student object exists. (2 marks)<br>b) State the design rule this breaks, and two ways to fix it. (2 marks)',
      model: '<p><b>a)</b> HashSet stores each element in a bucket chosen from its ' + c('hashCode') + ' <i>at insertion time</i>. Changing zid changes the hash, so ' + c('contains') + ' looks in a different bucket and does not find the object. The object is still in the old bucket. ' + c('add') + ' also looks in the new bucket, finds nothing, and inserts the same object again: size 2, and the set now holds a duplicate.</p>' +
        '<p><b>b)</b> Fields used by ' + c('equals') + '/' + c('hashCode') + ' must not change while the object is in a hash-based collection. In other words, value identity should be immutable. Fixes: make zid ' + c('final') + ' with no setter (create a new Student, or keep a separate mutable field outside equality). Or, if it must change, remove the object, mutate it, then re-insert it. A third option is to base equality on an immutable surrogate ID.</p>',
      must: ['Bucket chosen from hashCode at insertion; lookup uses the new hash', 'Second add inserts the same object again (duplicate)', 'Rule: equality fields must be immutable while in a hashed collection', 'Two valid fixes (final field / remove-mutate-reinsert / immutable ID)'] }
  ]);

  add(D.SHORT, 'dbc', [
    { m: 5,
      q: c('Discount') + ' has ' + c('double apply(double price)') + ' with precondition ' + c('price ≥ 0') + ' and postcondition ' + c('0 ≤ result ≤ price') + '. For each subclass, state whether it is a valid subtype, and justify your answer using Design by Contract. (1 mark each)' +
        ul([c('MemberDiscount') + ': pre ' + c('price ≥ 0') + '; post ' + c('result == price × 0.9'),
            c('PeakPricing') + ': pre ' + c('price ≥ 0') + '; post ' + c('result == price × 1.1'),
            c('BulkDiscount') + ': pre ' + c('price ≥ 100') + '; post ' + c('result == price − 20'),
            c('FreeItem') + ': no precondition; post ' + c('result == 0')]) +
        'Then explain what a client holding a ' + c('Discount') + ' reference would experience if handed one of the invalid ones. (1 mark)',
      model: ul([
        '<b>MemberDiscount — valid.</b> Same precondition, and ' + c('0.9 × price') + ' always lies in [0, price], so the postcondition is stronger (more specific), which is allowed.',
        '<b>PeakPricing — invalid.</b> ' + c('1.1 × price > price') + ' for any positive price, so it breaks (weakens) the parent’s postcondition.',
        '<b>BulkDiscount — invalid.</b> It strengthens the precondition: a client may legitimately call ' + c('apply(50)') + ' on a Discount and now violates the contract. (Its postcondition holds when price ≥ 100, but that does not save it.)',
        '<b>FreeItem — valid.</b> No precondition is a weaker precondition, which is allowed. Whenever the parent’s precondition holds (price ≥ 0), 0 satisfies 0 ≤ result ≤ price, so the postcondition is stronger.',
        '<b>Client impact:</b> code written against Discount, such as a checkout that assumes a discount never raises a price or accepts any non-negative price, silently produces wrong totals or hits rejected calls when given PeakPricing or BulkDiscount. That is an LSP violation: the subtype is not substitutable.']),
      must: ['MemberDiscount valid (stronger post)', 'PeakPricing invalid (breaks post)', 'BulkDiscount invalid (stronger pre)', 'FreeItem valid (weaker pre, post holds within parent’s pre)', 'Client impact tied to substitutability / LSP'] }
  ]);

  add(D.SHORT, 'principles', [
    { m: 5,
      q: 'Consider this class:' + pre(`
public class CountingSet<E> extends HashSet<E> {
    private int added = 0;

    @Override
    public boolean add(E e) { added++; return super.add(e); }

    @Override
    public boolean addAll(Collection<? extends E> c) {
        added += c.size();
        return super.addAll(c);
    }
    public int getAdded() { return added; }
}

CountingSet<String> s = new CountingSet<>();
s.addAll(List.of("a", "b", "c"));
System.out.println(s.getAdded());`) +
        'a) What is printed, and why? (2 marks)<br>b) What general principle does this illustrate? Rewrite the class so the count is correct and does not depend on HashSet’s internals. (3 marks)',
      model: '<p><b>a)</b> It prints <b>6</b>. ' + c('addAll') + ' adds 3, then ' + c('super.addAll') + ' (inherited from AbstractCollection) calls ' + c('add') + ' once per element. Dynamic dispatch sends those calls to the overridden ' + c('add') + ', which counts each element again.</p>' +
        '<p><b>b)</b> Inheritance breaks encapsulation (the fragile base class problem): the subclass depends on undocumented self-use inside its parent, which may change between versions. <b>Favour composition over inheritance</b>: wrap a Set and forward to it.</p>' + pre(`
public class CountingSet<E> {
    private final Set<E> inner = new HashSet<>();
    private int added = 0;

    public boolean add(E e) { added++; return inner.add(e); }
    public boolean addAll(Collection<? extends E> c) {
        added += c.size();
        return inner.addAll(c);      // inner's internal calls stay inside inner
    }
    public boolean contains(Object o) { return inner.contains(o); }
    public int size() { return inner.size(); }
    public int getAdded() { return added; }
}`) + '<p>(Implementing ' + c('Set<E>') + ' by forwarding every method, as a decorator over any Set, is an even better answer: it keeps substitutability without inheriting the implementation.)</p>',
      must: ['Prints 6', 'super.addAll calls the overridden add (self-use + dynamic dispatch)', 'Named fragile base class / inheritance breaks encapsulation', 'Composition: private Set field with forwarding methods', 'Count no longer depends on the parent’s implementation'] }
  ]);

  add(D.SHORT, 'java', [
    { m: 4,
      q: 'A ' + c('BankAccount.withdraw') + ' method signals problems with ' + c('throw new Exception("Insufficient funds")') + ', and callers do ' + c('catch (Exception e) { if (e.getMessage().equals("Insufficient funds")) … }') + '.<br>' +
        'a) Give two problems with this design. (2 marks)<br>b) Redesign it, stating whether your exception is checked or unchecked and why. (2 marks)',
      model: '<p><b>a)</b></p>' + ul([
        'Callers must compare message strings, which breaks when the message is reworded or translated. The type system cannot distinguish failure kinds.',
        c('catch (Exception e)') + ' also swallows unrelated failures (NullPointerException, bugs), hiding them.',
        'A plain ' + c('Exception') + ' carries no data: the caller cannot find out the shortfall or balance without parsing text.']) +
        '<p><b>b)</b> Define ' + c('class InsufficientFundsException extends Exception') + ' with fields such as ' + c('requested') + ' and ' + c('available') + ', declare ' + c('withdraw(double) throws InsufficientFundsException') + ', and have callers catch exactly that type. It is <b>checked</b> because it is a recoverable business condition that callers should be forced to handle (offer a smaller amount, show a message). ' +
        'Invalid arguments such as a negative amount are programmer errors, so they get an unchecked ' + c('IllegalArgumentException') + ' (or are made a precondition under DbC).</p>',
      must: ['Two real problems (string matching, over-broad catch, no data)', 'Custom exception class carrying data', 'Checked vs unchecked choice justified (recoverable business condition)', 'Callers catch the specific type'] },
    { m: 3,
      q: 'Write the signature and body of a generic static method ' + c('copyMatching') + ' that copies every element of a source list that satisfies a predicate into a destination list. It must accept, for example, a ' + c('List<Integer>') + ' source, a ' + c('List<Number>') + ' destination and a ' + c('Predicate<Object>') + '. Justify each wildcard.',
      model: pre(`
public static <T> void copyMatching(List<? extends T> src,
                                   List<? super T> dst,
                                   Predicate<? super T> keep) {
    for (T x : src) {
        if (keep.test(x)) dst.add(x);
    }
}`) + ul([
        c('src') + ' is a <b>producer</b> of T (we only read from it): ' + c('? extends T') + ' accepts a list of any subtype.',
        c('dst') + ' is a <b>consumer</b> of T (we only add to it): ' + c('? super T') + ' accepts a list of any supertype, e.g. ' + c('List<Number>') + ' or ' + c('List<Object>') + '.',
        'The predicate <b>consumes</b> a T: ' + c('Predicate<? super T>') + ' lets a ' + c('Predicate<Object>') + ' or ' + c('Predicate<Number>') + ' test Integers. With T inferred as Integer, all three example arguments type-check (PECS).']),
      must: ['Correct generic signature with <T>', 'extends on the source, super on the destination', 'super on the predicate', 'Justified with producer/consumer (PECS)'] }
  ]);

  add(D.SHORT, 'fp', [
    { m: 4,
      q: 'Rewrite the following using the Streams API.' + pre(`
Map<String, Double> totals = new HashMap<>();
for (Order o : orders) {
    if (o.getAmount() > 50) {
        String name = o.getCustomer().getName();
        totals.put(name, totals.getOrDefault(name, 0.0) + o.getAmount());
    }
}`) + 'Then explain why replacing your answer with ' + c('orders.parallelStream().forEach(o -> totals.merge(…))') + ' writing into the same ' + c('HashMap') + ' would be wrong.',
      model: pre(`
Map<String, Double> totals = orders.stream()
        .filter(o -> o.getAmount() > 50)
        .collect(Collectors.groupingBy(o -> o.getCustomer().getName(),
                                       Collectors.summingDouble(Order::getAmount)));`) +
        '<p>A parallel ' + c('forEach') + ' runs the lambda on several threads at once. HashMap is not thread-safe, so concurrent ' + c('merge') + ' calls can lose updates or corrupt the map. Side effects on shared mutable state also break the functional model, in which each element is processed independently. ' +
        c('collect') + ' with ' + c('groupingBy') + ' is safe in parallel: each thread builds its own partial map, and the partial maps are combined at the end (use ' + c('groupingByConcurrent') + ' if desired).</p>',
      must: ['filter then groupingBy with summingDouble (or toMap with merge)', 'Correct key (customer name) and values', 'Parallel forEach on HashMap → race condition / lost updates', 'Collectors combine per-thread results safely'] },
    { m: 3,
      q: 'Rewrite this using ' + c('Optional') + ', with no explicit null checks. Then comment on whether the rewrite fixes every design issue in the original.' + pre(`
String city = "unknown";
if (user != null && user.getAddress() != null
        && user.getAddress().getCity() != null) {
    city = user.getAddress().getCity();
}`),
      model: pre(`
String city = Optional.ofNullable(user)
        .map(User::getAddress)
        .map(Address::getCity)
        .orElse("unknown");`) +
        '<p>Each ' + c('map') + ' returns an empty Optional if the previous step (or the function’s result) is null, so the chain short-circuits safely. It removes the repetition and the nested null checks. ' +
        'It does not fix the <b>Law of Demeter</b> issue: the code still reaches through user to address to city (a message chain). If this is a common query, ' + c('user.getCity()') + ' or ' + c('Optional<String> getCity()') + ' on User would hide the structure (Hide Delegate). Ideally the getters would return Optional instead of null in the first place.</p>',
      must: ['ofNullable then map, map, orElse', 'Explains that map short-circuits on empty/null', 'Notes the message chain / LoD remains, with a fix'] }
  ]);

  add(D.SHORT, 'smells', [
    { m: 5,
      q: 'Identify <b>three</b> distinct code smells in this code. For each, name the refactoring that resolves it. Then name a design pattern that would suit the pay rules, and say why. (5 marks)' + pre(`
public class PayrollService {
    public double pay(Employee e, int hours, double rate, double bonusPct,
                      boolean isManager, String type) {
        double base;
        if (type.equals("HOURLY")) {
            base = hours * rate + Math.max(0, hours - 38) * rate * 0.5;
        } else if (type.equals("SALARY")) {
            base = e.getAnnualSalary() / 26;
        } else if (type.equals("CONTRACT")) {
            base = e.getInvoiceTotal();
        } else {
            throw new IllegalArgumentException("bad type");
        }
        if (isManager) base += base * bonusPct;
        if (e.getStartDate().isBefore(LocalDate.now().minusYears(10))) base += 200;
        return base * (1 - 0.32);
    }
}`),
      model: ul([
        '<b>Switch statement on a type code</b>: the String ' + c('type') + ' selects the pay rule, so a new employment type means editing this method (an OCP violation), and a typo fails only at runtime. → <i>Replace Conditional with Polymorphism</i> / Replace Type Code with Strategy.',
        '<b>Long Parameter List</b> (and a flag argument): hours, rate, bonusPct, isManager and type mostly describe the employee. ' + c('isManager') + ' is a boolean flag that selects behaviour. → <i>Preserve Whole Object</i> / <i>Introduce Parameter Object</i>, and move the data into Employee.',
        '<b>Feature Envy</b>: the method mostly uses Employee’s data (salary, invoices, start date). → <i>Move Method</i>: the long-service bonus and the base pay belong on Employee or its pay scheme.',
        '<b>Magic numbers</b>: 38, 0.5, 26, 200 and 0.32 have no names. → <i>Replace Magic Number with Symbolic Constant</i> (' + c('STANDARD_HOURS') + ', ' + c('OVERTIME_LOADING') + ', ' + c('PAY_PERIODS') + ', ' + c('TAX_RATE') + ').',
        '<b>Pattern: Strategy.</b> Each employee holds a ' + c('PayScheme') + ' (Hourly, Salaried, Contract) with ' + c('double basePay(Employee e)') + '. PayrollService calls ' + c('e.getScheme().basePay(e)') + ' and applies the shared bonus and tax rules. A new type is a new class (Open-Closed), and an employee’s scheme can change at runtime (contract to salaried) without changing their class.']),
      must: ['Three distinct smells, each named precisely', 'Each located in the code', 'A correct refactoring for each', 'Strategy (or polymorphism) proposed, with roles mapped', 'Justification: OCP and/or runtime change of scheme'] }
  ]);

  add(D.SHORT, 'patterns', [
    { m: 5,
      q: 'A product search lets users filter results. A colleague has written ' + c('InStockFilter') + ', ' + c('UnderPriceFilter') + ', ' + c('BrandFilter') + ', and then ' + c('InStockAndUnderPriceFilter') + ', ' + c('InStockOrBrandFilter') + ' and so on, with a new class for every combination users ask for.<br>' +
        'a) Name a pattern that removes the class explosion, and map its roles onto this problem. (2 marks)<br>b) Write the interface and the AND combinator in Java, and show how "in stock AND (under $50 OR brand Acme)" is built. (3 marks)',
      model: '<p><b>a) Composite.</b> Component: a ' + c('ProductFilter') + ' interface with ' + c('boolean matches(Product p)') + '. Leaves: InStockFilter, UnderPriceFilter, BrandFilter. Composites: ' + c('AndFilter') + ' and ' + c('OrFilter') + ', each holding a list of child filters (leaves or other composites). Any boolean expression becomes a tree built at runtime, so no combination class is ever needed.</p>' +
        '<p><b>b)</b></p>' + pre(`
public interface ProductFilter {
    boolean matches(Product p);
}

public class AndFilter implements ProductFilter {
    private final List<ProductFilter> parts;
    public AndFilter(List<ProductFilter> parts) { this.parts = List.copyOf(parts); }
    public boolean matches(Product p) {
        return parts.stream().allMatch(f -> f.matches(p));
    }
}

ProductFilter f = new AndFilter(List.of(
        new InStockFilter(),
        new OrFilter(List.of(new UnderPriceFilter(50), new BrandFilter("Acme")))));`) +
        '<p>Decorator is a weaker answer: it can chain AND, but it cannot express OR over sub-expressions as naturally as a tree.</p>',
      must: ['Composite named', 'Roles mapped: component interface, leaves, And/Or composites', 'Interface with matches(Product)', 'AndFilter holds children and delegates with allMatch / loop', 'Nested expression built correctly'] },
    { m: 4,
      q: 'A ' + c('Database') + ' Singleton is used by 40 classes, each calling ' + c('Database.getInstance()') + '. The team now finds their unit tests are slow and flaky: tests hit the real database and interfere with each other.<br>' +
        'Explain why the Singleton causes this, and propose a design that keeps a single database connection in production but makes the classes testable.',
      model: ul([
        '<b>Hidden dependency:</b> nothing in a class’s constructor or signature says it needs the database. The call is buried inside its methods, so a test cannot see it, let alone replace it.',
        '<b>Global mutable state:</b> every test shares the same instance and data, so tests depend on each other’s leftovers and on run order (flaky).',
        '<b>Tight coupling to a concrete class:</b> ' + c('getInstance()') + ' is static, so it cannot be overridden or mocked (this is also a DIP violation).',
        '<b>Fix:</b> define a ' + c('Database') + ' interface, and have classes receive it through their constructor (dependency injection). The application’s entry point (composition root) creates the one real instance and passes it everywhere, so "only one" becomes a wiring decision rather than a global. Tests pass an in-memory fake or a mock, giving each test fresh, isolated state.']),
      must: ['Hidden dependency / cannot substitute', 'Shared global state makes tests interfere', 'Introduce an interface + constructor injection', 'Single instance kept by creating it once at the composition root'] }
  ]);

  add(D.SHORT, 'async', [
    { m: 4,
      q: 'Consider:' + pre(`
public void transfer(Account from, Account to, int amount) {
    synchronized (from) {
        synchronized (to) {
            from.debit(amount);
            to.credit(amount);
        }
    }
}`) + 'a) Describe a concrete interleaving of two threads that deadlocks. (2 marks)<br>b) Fix it, and explain why your fix cannot deadlock. (2 marks)',
      model: '<p><b>a)</b> Thread 1 runs ' + c('transfer(a, b, 10)') + ' and Thread 2 runs ' + c('transfer(b, a, 5)') + '. T1 locks a; T2 locks b; T1 now waits for b (held by T2) while T2 waits for a (held by T1). Each holds what the other needs, in a circular wait, so neither can ever proceed.</p>' +
        '<p><b>b)</b> Always acquire the locks in one global order, e.g. by account ID:</p>' + pre(`
public void transfer(Account from, Account to, int amount) {
    Account first  = from.getId() < to.getId() ? from : to;
    Account second = first == from ? to : from;
    synchronized (first) {
        synchronized (second) {
            from.debit(amount);
            to.credit(amount);
        }
    }
}`) + '<p>Both threads now lock the lower ID first, so a thread holding one lock is never waiting for a lock that is held by someone waiting on it. Lock ordering breaks the circular-wait condition. (A single global lock also works, at the cost of concurrency.)</p>',
      must: ['Opposite-direction transfers interleaving', 'Circular wait explained', 'Consistent global lock order (or one lock / tryLock with timeout)', 'Explained why ordering prevents the cycle'] }
  ]);

  /* ===================== Section 4: architecture ======================== */

  add(D.ARCH, 'archfund', [
    { m: 5,
      q: '<b>Evaluate this design.</b> A university’s enrolment system is a single deployment on one server, with UI, Service and Repository layers. "For speed", several UI pages query the database directly. During enrolment week, ' + c('EnrolmentService') + ' calls an external payment provider synchronously for every enrolment, and that provider sometimes takes 20 seconds to respond. All logs are written to a file on the server’s local disk.<br>' +
        'Identify <b>three</b> weaknesses. For each, name the architectural characteristic it harms, and propose an improvement.',
      model: ul([
        '<b>UI bypasses the service layer</b> (open layers by accident). This breaks layers of isolation, so a schema change now ripples into the UI, and business rules can be skipped. It harms <i>maintainability</i> and <i>security</i>. Improvement: make the layers closed (UI → Service only), and add read-optimised service queries if speed really matters.',
        '<b>Synchronous call to a slow external provider in the critical path.</b> Every enrolment thread blocks for up to 20 s, threads pile up during the peak, and the whole system stalls. It harms <i>performance</i>, <i>availability</i> and <i>fault tolerance</i>. Improvement: take payment asynchronously (record the enrolment as pending, publish a PaymentRequested message, confirm on callback), add timeouts and a circuit breaker, and set a bounded retry.',
        '<b>Single server</b>, a single point of failure with no horizontal scaling for a predictable peak. It harms <i>availability</i>, <i>scalability</i> and <i>elasticity</i>. Improvement: run several stateless instances behind a load balancer, scaled up for enrolment week.',
        '<b>Logs on local disk</b>: lost if the server dies, and impossible to correlate across instances. It harms <i>observability</i>, <i>maintainability</i> and <i>recoverability</i>. Improvement: centralised logging with request or correlation IDs.']),
      must: ['Three distinct weaknesses drawn from the scenario', 'Each tied to a named characteristic', 'A concrete, appropriate improvement for each', 'Recognised the synchronous external dependency as the critical risk'] },
    { m: 4,
      q: 'A team’s ADR reads, in full: <i>"ADR 12: Kafka. We will use Kafka."</i><br>Critique it, then rewrite it properly, for the following context. Order, Inventory and Email services currently call each other over REST, and an outage in Email has repeatedly blocked checkouts.',
      model: '<p><b>Critique:</b> it has no status, no context (what problem? what forces? which alternatives?), no rationale, and no consequences. A future reader cannot tell why Kafka was chosen or when to revisit the decision. The decision is also stated as a technology, not as the architectural choice it implements.</p>' + pre(`
ADR 12: Publish order events through a message broker
Status: Accepted (2026-11-23)

Context:
  Checkout calls Inventory and Email synchronously over REST. Email
  outages have repeatedly blocked checkouts, although email is not
  needed to complete an order. More consumers (analytics, loyalty)
  are planned. Options: keep REST with retries and timeouts; a shared
  database table polled by consumers; a message broker (Kafka, RabbitMQ).

Decision:
  Order will publish OrderPlaced events to Kafka. Inventory, Email and
  future services subscribe. Checkout no longer waits for Email.

Consequences:
  + An Email outage no longer affects checkout; events are retained
    and processed when Email recovers.
  + New consumers are added without changing Order.
  - Eventual consistency: a confirmation email may arrive late.
  - Consumers must be idempotent (at-least-once delivery).
  - The team must operate and monitor Kafka; tracing a flow is harder.`),
      must: ['Critique: missing context, alternatives, rationale, consequences', 'Title and status', 'Context with forces and options considered', 'Decision stated clearly', 'Consequences with positives and negatives (incl. eventual consistency / idempotency / ops cost)'] }
  ]);

  add(D.ARCH, 'styles', [
    { m: 5,
      q: 'A ride-share start-up with 8 developers and no customers yet plans to launch with <b>12 microservices</b> (Riders, Drivers, Matching, Pricing, Payments, Ratings, Notifications, …), each with its own database, deployed on Kubernetes.<br>' +
        'Evaluate this plan, and recommend an architecture for launch. Name two trade-offs of your recommendation, and say when you would revisit it.',
      model: ul([
        '<b>Evaluation:</b> 12 services for 8 developers means each person owns 1–2 services plus their pipelines, databases and monitoring. That is high operational cost before the product is validated. Service boundaries drawn before the domain is understood are likely to be wrong, and moving a responsibility between services is far harder than moving it between modules. Cross-service flows (match, then price, then pay) need distributed transactions or sagas from day one, and debugging spans the network.',
        '<b>Recommendation:</b> a <b>modular monolith</b>: one deployable, with modules aligned to the same domains (Riders, Drivers, Matching, Pricing, Payments…), each exposing a public API and owning its own tables or schema. This keeps domain partitioning and clean boundaries while staying cheap to build, test and deploy.',
        '<b>Trade-offs:</b> the whole system scales as one unit, so Matching cannot scale independently, and one bad deploy takes everything down. Module boundaries must be enforced by discipline or tooling, otherwise they erode.',
        '<b>Revisit</b> when a module has clearly different scaling or availability needs (e.g. Matching at peak), or when team growth makes coordinating deploys painful. Then extract that module along its existing boundary.']),
      must: ['Identifies operational cost vs team size', 'Premature/unstable service boundaries', 'Recommends modular monolith (or justified alternative)', 'Two real trade-offs of the recommendation', 'A concrete trigger for extracting services later'] },
    { m: 4,
      q: 'An online shop uses <b>broker-topology</b> event-driven architecture: Order publishes OrderPlaced, and Inventory, Payment, Email and Analytics each react independently. New requirements: if stock cannot be reserved, the payment must be refunded and the order cancelled, and support staff must be able to see exactly which step each order is up to.<br>Should they move to a <b>mediator</b> topology? Justify, including what they would give up.',
      model: ul([
        'The new requirements describe <b>coordinated workflow</b>: step ordering, error handling with compensation (refund on stock failure), and a single view of each order’s state. In a broker topology there is no component that knows the whole flow. Compensation logic gets scattered across services, and "where is order 123 up to?" requires piecing events together.',
        'A <b>mediator</b> (orchestrator) holds the workflow: it sends ReserveStock, then TakePayment, listens for the results, issues compensating commands (Refund, CancelOrder) on failure, and records each order’s state. That gives staff one place to query. So yes, at least for the order-fulfilment flow.',
        '<b>Given up:</b> the mediator couples to every step and can become a bottleneck or single point of failure (it must be made highly available). Adding a step means changing the mediator, so the flow is less extensible than in a broker, where a new consumer simply subscribes. Throughput can also drop.',
        'A hybrid is reasonable: a mediator for the core order saga, while Email and Analytics keep subscribing to the events it publishes.']),
      must: ['Recognises error handling/compensation and state visibility as mediator strengths', 'Explains what the mediator does in this flow', 'At least two costs (coupling, bottleneck/SPOF, less extensible)', 'Clear justified conclusion (possibly hybrid)'] },
    { m: 3,
      q: 'A team moves its chat back-end to serverless functions. To route messages, the function keeps the set of currently connected users in a ' + c('static') + ' Map inside the function code. In testing it works, but in production messages are often lost. Explain why, and how to fix it.',
      model: ul([
        'Functions are <b>stateless and ephemeral</b>. Under load the platform runs many instances in parallel, each with its own memory, so a user connected via instance A is invisible to instance B. Instances are also recycled at any time, wiping the Map. In testing a single warm instance hid the problem.',
        '<b>Fix:</b> keep connection state in an external shared store (e.g. DynamoDB or Redis, keyed by user and connection ID), or use the platform’s managed WebSocket gateway, which tracks connections. Then any instance can look up and post to any connection.',
        'Every function invocation should treat local memory as a cache at most, never as the source of truth.']),
      must: ['Multiple concurrent instances with separate memory', 'Instances recycled / cold starts lose state', 'External shared state store (or managed connection service) as the fix'] }
  ]);

  /* ===================== Section 4: sequence diagrams =================== */

  var SEQ_MUST = ['Every participant declared, actors as actor', 'Messages in the right order, with calls (->>) and replies (-->>)'];

  addList(D.SEQ, [
    { q: 'A user requests a password reset on a website. The Web App sends the email address to the Auth Service. The Auth Service first checks with the Rate Limiter; if the user has made more than 3 requests in the last hour, the request is rejected. Otherwise, if the email belongs to an account, the Auth Service generates a token, stores it in the Token Store with a 15-minute expiry, and asks the Email Service to send a reset link (it does not wait for the email to be sent). Whether or not the account exists, the user sees the same "If the account exists, a link has been sent" message. Later, the user clicks the link; the Auth Service looks the token up and either lets them set a new password or shows "link expired".',
      model: `sequenceDiagram
    actor User
    participant Web as Web App
    participant Auth as Auth Service
    participant RL as Rate Limiter
    participant TS as Token Store
    participant ES as Email Service

    User->>Web: Request reset (email)
    Web->>Auth: requestReset(email)
    Auth->>RL: allow(email)
    RL-->>Auth: allowed?
    alt more than 3 requests in the last hour
        Auth-->>Web: rejected (too many requests)
        Web-->>User: "Try again later"
    else allowed
        opt account exists for email
            Auth->>Auth: generateToken()
            Auth->>TS: save(token, userId, expiry = 15 min)
            TS-->>Auth: ok
            Auth-)ES: sendResetLink(email, token)
        end
        Auth-->>Web: accepted
        Web-->>User: "If the account exists, a link has been sent"
    end

    User->>Web: Click reset link (token)
    Web->>Auth: validate(token)
    Auth->>TS: find(token)
    TS-->>Auth: token record / none
    alt token found and not expired
        Auth-->>Web: valid
        Web-->>User: Show new-password form
        User->>Web: Submit new password
        Web->>Auth: resetPassword(token, password)
        Auth->>TS: delete(token)
        Auth-->>Web: done
        Web-->>User: "Password changed"
    else missing or expired
        Auth-->>Web: invalid
        Web-->>User: "Link expired"
    end`,
      notes: 'The same message for existing and unknown accounts is a security requirement (it prevents account enumeration), so the "account exists" branch is an <code>opt</code> nested inside the allowed branch, not a separate reply. Using <code>-)</code> for the email shows the Auth Service does not wait.',
      must: SEQ_MUST.concat(['alt for the rate limit with both outcomes reaching the user', 'opt for account exists; same reply either way', 'Asynchronous message to the Email Service', 'Second interaction: alt for valid vs expired token'] ) },

    { q: 'An online shop uses a choreographed saga over a Message Broker. When a customer checks out, the Order Service saves the order as PENDING, replies to the customer that the order is being processed, and publishes OrderCreated. The Payment Service consumes OrderCreated and charges the card, publishing PaymentSucceeded or PaymentFailed. The Inventory Service consumes PaymentSucceeded and tries to reserve stock, publishing StockReserved or StockFailed. On StockReserved the Order Service marks the order CONFIRMED. On PaymentFailed, the Order Service marks it CANCELLED. On StockFailed, the Payment Service refunds the card and the Order Service marks the order CANCELLED. The customer is notified of the final outcome by the Notification Service, which listens for order status changes.',
      model: `sequenceDiagram
    actor Customer
    participant OS as Order Service
    participant MB as Message Broker
    participant PS as Payment Service
    participant IS as Inventory Service
    participant NS as Notification Service

    Customer->>OS: checkout(cart, card)
    OS->>OS: save order (PENDING)
    OS-->>Customer: "Order is being processed"
    OS-)MB: OrderCreated
    MB-)PS: OrderCreated
    PS->>PS: charge(card)
    alt payment succeeds
        PS-)MB: PaymentSucceeded
        MB-)IS: PaymentSucceeded
        IS->>IS: reserve(items)
        alt stock reserved
            IS-)MB: StockReserved
            MB-)OS: StockReserved
            OS->>OS: mark CONFIRMED
        else out of stock
            IS-)MB: StockFailed
            par compensate
                MB-)PS: StockFailed
                PS->>PS: refund(card)
            and cancel
                MB-)OS: StockFailed
                OS->>OS: mark CANCELLED
            end
        end
    else payment fails
        PS-)MB: PaymentFailed
        MB-)OS: PaymentFailed
        OS->>OS: mark CANCELLED
    end
    OS-)MB: OrderStatusChanged
    MB-)NS: OrderStatusChanged
    NS-)Customer: Outcome (confirmed / cancelled)`,
      notes: 'Every inter-service message goes through the broker and uses the asynchronous arrow; no service calls another directly (that is what makes it choreography). The refund is the compensating transaction for a payment that was taken before stock failed. The customer gets an immediate reply, then a later notification.',
      must: SEQ_MUST.concat(['All events pass through the broker with async arrows', 'Nested alt: payment outcome, then stock outcome', 'Refund on StockFailed (compensation), order cancelled', 'Immediate reply to customer, final outcome via Notification Service'] ) },

    { q: 'A rider requests a trip in a ride-share app. The Trip Service asks the Pricing Service for a fare estimate and shows it to the rider, who confirms. The Trip Service then asks the Matching Service for nearby drivers. It offers the trip to drivers one at a time, nearest first: each driver has 15 seconds to accept, and the offer moves to the next driver on decline or timeout. This repeats until a driver accepts or 3 minutes pass. If a driver accepts, the Trip Service notifies the rider and the driver at the same time. If no driver accepts in time, the rider is told no drivers are available. At any point before a driver accepts, the rider may cancel the request.',
      model: `sequenceDiagram
    actor Rider
    participant App as Rider App
    participant TS as Trip Service
    participant PS as Pricing Service
    participant MS as Matching Service
    actor Driver

    Rider->>App: Request trip (pickup, destination)
    App->>TS: requestTrip(pickup, destination)
    TS->>PS: estimate(pickup, destination)
    PS-->>TS: fare
    TS-->>App: fare estimate
    App-->>Rider: Show fare
    Rider->>App: Confirm
    App->>TS: confirm(tripId)
    TS->>MS: nearbyDrivers(pickup)
    MS-->>TS: drivers (nearest first)
    loop each driver, until one accepts or 3 minutes pass
        TS-)Driver: offer(trip)
        alt accepts within 15 s
            Driver-->>TS: accept
        else declines or 15 s timeout
            Driver-->>TS: decline / no response
        end
    end
    opt rider cancels before acceptance
        Rider->>App: Cancel
        App->>TS: cancel(tripId)
        TS-->>App: cancelled
    end
    alt a driver accepted
        par notify both
            TS-)App: Driver assigned
            App-->>Rider: Show driver and ETA
        and
            TS-)Driver: Trip confirmed (pickup details)
        end
    else nobody accepted in 3 minutes
        TS-->>App: No drivers available
        App-->>Rider: "No drivers available"
    end`,
      notes: 'Mermaid cannot interrupt a loop, so the "cancel at any time" is shown as an <code>opt</code> (state the assumption in a note if you like, e.g. <code>Note over Rider,TS: may happen at any point before acceptance</code>). Drivers are a separate actor. The loop condition names both exits, and the outcome alt covers both.',
      must: SEQ_MUST.concat(['Fare estimate before confirmation', 'loop with both exit conditions, inner alt for accept vs decline/timeout', 'par for notifying rider and driver together', 'opt (or alt) for rider cancellation', 'Failure branch when no driver accepts'] ) }
  ]);

  /* ===================== Section 3: domain models ======================= */

  addList(D.DOMAIN, [
    { title: 'Food delivery marketplace',
      spec: [
        'The platform lists <b>restaurants</b>. Each restaurant has a name, an address and a <b>menu</b> of items. A <b>menu item</b> is either a single <b>dish</b> (name, price, and whether it is vegetarian) or a <b>combo</b>, which bundles other menu items (dishes or smaller combos) at a price that is 15% less than the total of its parts.',
        '<b>Customers</b> place <b>orders</b> with one restaurant. An order has one or more <b>order lines</b>, each a menu item with a quantity, and records the price at the time of ordering (menus change).',
        'Orders move through the statuses PLACED, PREPARING, PICKED_UP, DELIVERED or CANCELLED. An order can only be cancelled before it is picked up.',
        '<b>Couriers</b> deliver orders. A courier rides a bike, a scooter or a car. Bikes can carry at most 2 active orders, scooters 3, and cars 5. A courier is assigned to at most one restaurant pickup at a time.',
        'Customers can apply one <b>promotion</b> code per order: either a percentage off, or a fixed amount off orders above a minimum spend.'
      ],
      controller: `public interface DeliveryController {
    void addRestaurant(String restaurantId, String name, String address);
    void addDish(String restaurantId, String itemId, String name, double price, boolean vegetarian);
    void addCombo(String restaurantId, String comboId, String name, List<String> itemIds);
    String placeOrder(String customerId, String restaurantId,
                      List<String> itemIds, List<Integer> quantities, String promoCode);
    void advanceStatus(String orderId);
    void cancel(String orderId);
    void assignCourier(String orderId, String courierId);
    double orderTotal(String orderId);
}`,
      model: `/** Composite: a menu item is a Dish (leaf) or a Combo of menu items. */
public interface MenuItem {
    String getId();
    String getName();
    double getPrice();
    boolean isVegetarian();          // a combo is vegetarian if all its parts are
}

public class Dish implements MenuItem {
    private String id, name;
    private double price;
    private boolean vegetarian;
}

public class Combo implements MenuItem {
    private static final double BUNDLE_DISCOUNT = 0.15;
    private String id, name;
    private List<MenuItem> items;    // aggregation, 1 combo — 2..* MenuItem
                                     // (items are shared with the menu)
    public double getPrice() { ... } // sum of parts × 0.85
}

public class Restaurant {
    private String id, name, address;
    private List<MenuItem> menu;     // composition, 1 restaurant ◆— 0..* MenuItem
    public MenuItem findItem(String itemId) { ... }
}

public class Customer {
    private String id;
    private List<Order> orders;      // 1 customer — 0..* Order
}

public enum OrderStatus { PLACED, PREPARING, PICKED_UP, DELIVERED, CANCELLED }

public class Order {
    private String id;
    private Customer customer;       // exactly 1
    private Restaurant restaurant;   // exactly 1
    private List<OrderLine> lines;   // composition, 1 order ◆— 1..* OrderLine
    private OrderStatus status;
    private Promotion promotion;     // 0..1
    private Courier courier;         // 0..1, set when assigned

    public void advance() { ... }    // PLACED → PREPARING → PICKED_UP → DELIVERED
    /** @throws IllegalStateException once picked up */
    public void cancel() { ... }
    public double total() { ... }    // sum of lines, then the promotion
}

/** Snapshot of price at order time, so later menu changes don't alter it. */
public class OrderLine {
    private MenuItem item;           // association, * lines — 1 MenuItem
    private int quantity;
    private double unitPrice;
    public double subtotal() { ... }
}

/** Strategy: how a promotion changes a subtotal. */
public interface Promotion {
    String getCode();
    double apply(double subtotal);
}
public class PercentOff implements Promotion { private String code; private double percent; }
public class AmountOff implements Promotion { private String code; private double amount, minSpend; }

/** The vehicle decides capacity, so a courier can change vehicle. */
public enum VehicleType {
    BIKE(2), SCOOTER(3), CAR(5);
    private final int capacity;
    VehicleType(int capacity) { this.capacity = capacity; }
}

public class Courier {
    private String id, name;
    private VehicleType vehicle;
    private List<Order> activeOrders;   // 0..capacity, all from one restaurant pickup
    public boolean canTake(Order o) { ... }  // capacity and same-restaurant rule
    public void assign(Order o) { ... }
}`,
      notes: 'The combo is the key decision: making it a Composite lets combos contain combos and lets order lines hold any MenuItem. OrderLine copies the unit price because menu prices change. Status is an enum field, not subclasses, because it changes at runtime. The vehicle is a field, not a Courier subclass, because a courier can switch vehicles.',
      must: ['MenuItem interface with Dish and Combo (Composite); Combo holds MenuItems', 'Order ◆ OrderLine composition with quantity and snapshot price', 'Status as an enum field with cancel/advance on Order', 'Promotion as an interface (or abstract) with two kinds', 'Courier capacity from vehicle type, not courier subclasses; cardinalities commented throughout'] },

    { title: 'Conference management',
      spec: [
        'A <b>conference</b> runs over several days at a <b>venue</b>, which has <b>rooms</b> (each with a name and a seating capacity).',
        'The program consists of <b>sessions</b>, each scheduled in one room at a start and end time. A session is either a <b>talk</b>, given by one or more <b>speakers</b>, or a <b>workshop</b>, which has a facilitator, a maximum number of participants (no more than the room’s capacity) and a list of <b>prerequisite</b> workshops.',
        'Two sessions cannot use the same room at overlapping times.',
        'People <b>register</b> for the conference with a <b>ticket type</b> (EARLY_BIRD, STANDARD or STUDENT), each with a price. A speaker may also register as an attendee.',
        'Registered attendees can sign up to workshops. When a workshop is full, attendees join its <b>waitlist</b> in the order they signed up, and the first person on the waitlist gets a place when someone withdraws.'
      ],
      controller: `public interface ConferenceController {
    void addRoom(String roomId, String name, int capacity);
    String scheduleTalk(String title, String roomId, LocalDateTime start,
                        LocalDateTime end, List<String> speakerIds);
    String scheduleWorkshop(String title, String roomId, LocalDateTime start,
                            LocalDateTime end, String facilitatorId,
                            int maxParticipants, List<String> prerequisiteIds);
    String register(String personId, String ticketType);
    void signUp(String registrationId, String workshopId);
    void withdraw(String registrationId, String workshopId);
    List<String> participants(String workshopId);
    List<String> waitlist(String workshopId);
}`,
      model: `public class Conference {
    private String name;
    private LocalDate startDate, endDate;
    private Venue venue;                     // association, * conferences — 1 venue
    private List<Session> sessions;          // composition, 1 conference ◆— 0..* Session
    private List<Registration> registrations;// composition, 1 conference ◆— 0..* Registration

    /** @throws IllegalArgumentException if the room is booked at an overlapping time */
    public void schedule(Session s) { ... }
}

public class Venue {
    private String name;
    private List<Room> rooms;                // composition, 1 venue ◆— 1..* Room
}

public class Room {
    private String id, name;
    private int capacity;
}

/** A person can be a speaker, a facilitator and an attendee at once,
 *  so these are roles (associations), not Person subclasses. */
public class Person {
    private String id, name, email;
}

public abstract class Session {
    private String id, title;
    private Room room;                       // association, * sessions — 1 room
    private LocalDateTime start, end;
    public boolean overlaps(Session other) { ... }   // same room and times intersect
}

public class Talk extends Session {
    private List<Person> speakers;           // * talks — 1..* speakers
}

public class Workshop extends Session {
    private Person facilitator;              // exactly 1
    private int maxParticipants;             // ≤ room.capacity (checked in constructor)
    private List<Workshop> prerequisites;    // * — * (self-association)
    private List<Registration> participants; // 0..maxParticipants
    private Deque<Registration> waitlist;    // FIFO, 0..*

    /** adds to participants, or to the end of the waitlist if full */
    public void signUp(Registration r) { ... }
    /** removes r; promotes the head of the waitlist if a place opened */
    public void withdraw(Registration r) { ... }
    public boolean meetsPrerequisites(Registration r) { ... }
}

public enum TicketType {
    EARLY_BIRD(450), STANDARD(650), STUDENT(200);
    private final double price;
    TicketType(double price) { this.price = price; }
}

/** One person's attendance at one conference. */
public class Registration {
    private String id;
    private Person person;                   // exactly 1
    private TicketType ticketType;
    private List<Workshop> workshops;        // workshops signed up for, 0..*
}`,
      notes: 'The traps are roles and the waitlist. Speaker and attendee are roles the same person can hold, so a Speaker class extending Person breaks when a speaker registers. Registration is the association class between a person and the conference. The waitlist must preserve order (a Deque or Queue), and promotion belongs on Workshop because that is where the capacity lives.',
      must: ['Session abstract with Talk and Workshop subclasses', 'Person with roles via associations (no Speaker/Attendee subclass trap)', 'Registration as the link between person and conference, with ticket type', 'Workshop: capacity, ordered waitlist (Queue/Deque), prerequisites self-association, signUp/withdraw', 'Room overlap check placed sensibly; compositions and cardinalities commented'] }
  ]);

  /* ===================== Section 3: refactor and extend ================= */

  addList(D.REFACTOR, [
    { title: 'Course prerequisites',
      intro: '<p>A university’s enrolment system checks whether a student meets a course’s prerequisites. Each course stores its prerequisites as a list of groups. A student qualifies by completing every course in <i>any one</i> group, plus an optional minimum number of units of credit (UOC).</p>' +
        '<p><b>New requirements:</b> prerequisites can now nest to any depth, e.g. <i>COMP2521 AND (COMP1531 OR (COMP1521 AND 48 UOC))</i>. A new kind of requirement, <i>enrolled in program X</i>, is being added (students now belong to a program). More kinds of requirement are expected. Each requirement must still describe itself in the format shown in the tests.</p>',
      files: [
        { name: 'Course.java', text: `public class Course {
    private String code;
    private int uoc;
    // Each inner list is a group of courses that must ALL be completed;
    // a student qualifies by completing ANY one group.
    private List<List<String>> prereqGroups = new ArrayList<>();
    private int minUoc;   // 0 means no UOC requirement

    public Course(String code, int uoc) { this.code = code; this.uoc = uoc; }

    public void addPrereqGroup(List<String> group) { prereqGroups.add(group); }
    public void setMinUoc(int minUoc) { this.minUoc = minUoc; }

    public boolean canEnrol(Student s) {
        if (minUoc > 0 && s.getUoc() < minUoc) return false;
        if (prereqGroups.isEmpty()) return true;
        for (List<String> group : prereqGroups) {
            boolean ok = true;
            for (String c : group) {
                if (!s.getCompleted().contains(c)) ok = false;
            }
            if (ok) return true;
        }
        return false;
    }

    public String describePrereqs() {
        String d = "";
        for (int i = 0; i < prereqGroups.size(); i++) {
            if (i > 0) d += " OR ";
            d += "(" + String.join(" AND ", prereqGroups.get(i)) + ")";
        }
        if (minUoc > 0) d += (d.isEmpty() ? "" : " AND ") + minUoc + " UOC";
        return d;
    }
}

public class Student {
    private Set<String> completed = new HashSet<>();
    private int uoc;

    public Set<String> getCompleted() { return completed; }
    public int getUoc() { return uoc; }
    public void complete(String code, int courseUoc) {
        completed.add(code);
        uoc += courseUoc;
    }
}` },
        { name: 'PrereqTest.java', text: `@Test
public void testNested() {
    // COMP2521 AND (COMP1531 OR (COMP1521 AND 48 UOC))
    Requirement r = new AllOf(List.of(
            new Completed("COMP2521"),
            new AnyOf(List.of(
                    new Completed("COMP1531"),
                    new AllOf(List.of(new Completed("COMP1521"), new MinUoc(48)))))));
    Course c = new Course("COMP2511", 6, r);

    Student s = new Student("3778");
    s.complete("COMP2521", 6);
    s.complete("COMP1521", 6);
    assertFalse(c.canEnrol(s));                  // only 12 UOC
    for (int i = 0; i < 6; i++) s.complete("GENE100" + i, 6);
    assertTrue(c.canEnrol(s));                   // now 48 UOC
    assertEquals("(COMP2521 AND (COMP1531 OR (COMP1521 AND 48 UOC)))", r.describe());
}

@Test
public void testProgram() {
    Requirement r = new AllOf(List.of(new InProgram("3778"), new Completed("COMP1511")));
    Student s = new Student("3707");
    s.complete("COMP1511", 6);
    assertFalse(new Course("COMP1531", 6, r).canEnrol(s));
    assertEquals("(program 3778 AND COMP1511)", r.describe());
}

@Test
public void testNoPrerequisites() {
    assertTrue(new Course("COMP1511", 6, Requirement.none()).canEnrol(new Student("3778")));
}` }
      ],
      smells: ul([
        '<b>Primitive obsession / wrong data structure</b>: ' + c('List<List<String>>') + ' plus an ' + c('int') + ' can express only "OR of ANDs, then AND a UOC". Nesting and new requirement kinds cannot be represented at all.',
        '<b>Open-Closed violation</b>: every new kind of requirement means new fields in Course and edits to both ' + c('canEnrol') + ' and ' + c('describePrereqs') + '. The two methods walk the same structure separately and can drift apart (duplicated logic).',
        '<b>Feature Envy / Law of Demeter</b>: ' + c('canEnrol') + ' digs into the student’s data (' + c('s.getCompleted().contains(c)') + ') instead of asking the student.',
        '<b>Representation exposure</b>: ' + c('getCompleted()') + ' returns the internal mutable set, so any caller can add completed courses without the UOC being updated.',
        '<b>Low cohesion</b> in Course: it is both a course and a mini rule-evaluator. Also, ' + c('complete') + ' double-counts UOC if a course is completed twice.']),
      pattern: { options: ['Composite', 'Decorator', 'Observer', 'Singleton'], correct: 0,
                 why: 'Requirements form a tree: leaves (completed a course, minimum UOC, in a program) and composites (AND, OR) that hold any requirements, including other composites. Both evaluation and description recurse uniformly over the tree. That is Composite.' },
      task: 'Refactor the code using your chosen pattern so that the tests in ' + c('PrereqTest.java') + ' pass, including the new program requirement. Briefly justify your design in a comment.',
      model: `/** Component (Composite): every requirement can be checked against a
 *  student and can describe itself. Leaves and combinations are treated
 *  uniformly, so requirements nest to any depth. A new kind of requirement
 *  is one new class: no existing code changes (Open-Closed). */
public interface Requirement {
    boolean isMetBy(Student s);
    String describe();

    static Requirement none() { return new NoRequirement(); }
}

// ---- leaves ------------------------------------------------------------
public class Completed implements Requirement {
    private final String code;
    public Completed(String code) { this.code = code; }
    public boolean isMetBy(Student s) { return s.hasCompleted(code); }
    public String describe() { return code; }
}

public class MinUoc implements Requirement {
    private final int uoc;
    public MinUoc(int uoc) { this.uoc = uoc; }
    public boolean isMetBy(Student s) { return s.getUoc() >= uoc; }
    public String describe() { return uoc + " UOC"; }
}

public class InProgram implements Requirement {
    private final String program;
    public InProgram(String program) { this.program = program; }
    public boolean isMetBy(Student s) { return s.isInProgram(program); }
    public String describe() { return "program " + program; }
}

public class NoRequirement implements Requirement {
    public boolean isMetBy(Student s) { return true; }
    public String describe() { return "none"; }
}

// ---- composites ----------------------------------------------------------
/** Shared by AND and OR: holds the children and formats the description. */
public abstract class CompoundRequirement implements Requirement {
    private final List<Requirement> parts;
    private final String joiner;

    protected CompoundRequirement(List<Requirement> parts, String joiner) {
        this.parts = List.copyOf(parts);
        this.joiner = joiner;
    }
    protected List<Requirement> parts() { return parts; }

    public String describe() {
        return parts.stream().map(Requirement::describe)
                .collect(Collectors.joining(" " + joiner + " ", "(", ")"));
    }
}

public class AllOf extends CompoundRequirement {
    public AllOf(List<Requirement> parts) { super(parts, "AND"); }
    public boolean isMetBy(Student s) { return parts().stream().allMatch(r -> r.isMetBy(s)); }
}

public class AnyOf extends CompoundRequirement {
    public AnyOf(List<Requirement> parts) { super(parts, "OR"); }
    public boolean isMetBy(Student s) { return parts().stream().anyMatch(r -> r.isMetBy(s)); }
}

// ---- the model -----------------------------------------------------------
public class Course {
    private final String code;
    private final int uoc;
    private final Requirement prerequisite;

    public Course(String code, int uoc, Requirement prerequisite) {
        this.code = code; this.uoc = uoc; this.prerequisite = prerequisite;
    }
    public boolean canEnrol(Student s) { return prerequisite.isMetBy(s); }
    public String describePrereqs() { return prerequisite.describe(); }
}

public class Student {
    private final String program;
    private final Set<String> completed = new HashSet<>();
    private int uoc;

    public Student(String program) { this.program = program; }

    public void complete(String code, int courseUoc) {
        if (completed.add(code)) uoc += courseUoc;   // no double counting
    }
    public boolean hasCompleted(String code) { return completed.contains(code); }
    public int getUoc() { return uoc; }
    public boolean isInProgram(String p) { return program.equals(p); }
}`,
      notes: 'The abstract ' + c('CompoundRequirement') + ' removes the duplication between AND and OR: only the joiner and the match rule differ (a small Template Method). Student now answers questions about itself (' + c('hasCompleted') + ', ' + c('isInProgram') + ') instead of exposing its set. Returning ' + c('NoRequirement') + ' rather than null avoids a null check in Course (a Null Object).',
      must: ['Requirement interface implemented by leaves and composites', 'AllOf/AnyOf hold a List<Requirement> and recurse (arbitrary nesting)', 'InProgram added as one new class; Student gains a program', 'describe() matches the test format exactly', 'Student encapsulated (no getCompleted exposure); rationale refers to Composite/OCP'] },

    { title: 'Loyalty tiers',
      intro: '<p>A retailer’s loyalty scheme gives customers a tier based on how much they spend each year. The tier decides how many points they earn, their shipping fee and their birthday bonus. Customers are upgraded as soon as their spend for the year reaches the next threshold, and tiers are reassessed at the end of each year.</p>' +
        '<p><b>New requirements:</b> a <b>PLATINUM</b> tier, reached at $20,000 of spend in a year: 3 points per whole dollar, free shipping, and a 1,000-point birthday bonus. At the end of a year, Platinum members <b>keep Platinum</b> if they spent at least $15,000. Otherwise they are reassessed on their spend like everyone else. The marketing team expects to add and adjust tiers often.</p>',
      files: [
        { name: 'Customer.java', text: `public class Customer {
    private String name;
    private String tier = "BRONZE";   // BRONZE, SILVER, GOLD
    private double yearSpend;
    private int points;

    public Customer(String name) { this.name = name; }

    public void purchase(double amount) {
        yearSpend += amount;
        int base = (int) amount;      // 1 point per whole dollar at Bronze
        if (tier.equals("BRONZE")) points += base;
        else if (tier.equals("SILVER")) points += (int) (base * 1.5);
        else if (tier.equals("GOLD")) points += base * 2;
        if (tier.equals("BRONZE") && yearSpend >= 1000) tier = "SILVER";
        if (tier.equals("SILVER") && yearSpend >= 5000) tier = "GOLD";
    }

    public double shippingFee(double orderTotal) {
        if (tier.equals("GOLD")) return 0;
        if (tier.equals("SILVER")) return orderTotal >= 50 ? 0 : 5.0;
        return orderTotal >= 100 ? 0 : 9.95;
    }

    public int birthdayBonus() {
        switch (tier) {
            case "SILVER": return 200;
            case "GOLD": return 500;
            default: return 0;
        }
    }

    public void endOfYear() {
        // tiers are reassessed on the year's spend, then spend resets
        if (yearSpend < 1000) tier = "BRONZE";
        else if (yearSpend < 5000) tier = "SILVER";
        else tier = "GOLD";
        yearSpend = 0;
    }

    public String getTier() { return tier; }
    public int getPoints() { return points; }
}` },
        { name: 'LoyaltyTest.java', text: `@Test
public void testUpgradeMidYear() {
    Customer c = new Customer("Ann");
    c.purchase(999);                 // Bronze: 999 points
    c.purchase(1);                   // earns at Bronze, then becomes Silver
    assertEquals("SILVER", c.getTier());
    c.purchase(100);                 // Silver: 150 points
    assertEquals(1150, c.getPoints());
    assertEquals(5.0, c.shippingFee(40), 0.001);
}

@Test
public void testPlatinum() {
    Customer c = new Customer("Bo");
    c.purchase(20000);               // earns at Bronze, then straight to Platinum
    assertEquals("PLATINUM", c.getTier());
    c.purchase(10);                  // Platinum: 30 points
    assertEquals(20030, c.getPoints());
    assertEquals(0.0, c.shippingFee(1), 0.001);
    assertEquals(1000, c.birthdayBonus());
}

@Test
public void testEndOfYear() {
    Customer c = new Customer("Cy");
    c.purchase(20000);
    c.endOfYear();                   // spent 20,000: Platinum
    assertEquals("PLATINUM", c.getTier());
    c.purchase(16000);
    c.endOfYear();                   // 16,000 ≥ 15,000: Platinum kept
    assertEquals("PLATINUM", c.getTier());
    c.purchase(6000);
    c.endOfYear();                   // 6,000: reassessed to Gold
    assertEquals("GOLD", c.getTier());
}` }
      ],
      smells: ul([
        '<b>Switch statements on a type code</b>: the String ' + c('tier') + ' is tested in four methods (points, shipping, bonus, transitions). Adding Platinum means editing all four (Shotgun Surgery, and an Open-Closed violation), and a typo like "GLOD" fails silently.',
        '<b>Tier rules scattered and duplicated</b>: the thresholds 1000 and 5000 appear in both ' + c('purchase') + ' and ' + c('endOfYear') + ', so they can drift apart. The upgrade code cascades only one step per hard-coded if, so a jump past several thresholds depends on the statement order.',
        '<b>Magic numbers</b>: 1.5, 2, 50, 100, 9.95, 200 and 500 carry business meaning but have no names.',
        '<b>Low cohesion</b>: Customer owns purchase history and every tier’s rules. Tier behaviour is the part that changes most often, and it should live on its own.']),
      pattern: { options: ['Strategy', 'Decorator', 'Composite', 'Abstract Factory'], correct: 0,
                 why: 'Each tier is an interchangeable set of rules (points, shipping, bonus) that the customer delegates to, and a customer swaps tier at runtime. That is Strategy, held as a field and not as Customer subclasses, because the tier changes. (State is an equally good name if your course covered it: the tiers also decide their own transitions.)' },
      task: 'Refactor the code using your chosen pattern so that the tests in ' + c('LoyaltyTest.java') + ' pass, and add the Platinum tier. Briefly justify your design in a comment.',
      model: `/** Strategy: each tier supplies the rules that differ between tiers. The
 *  customer holds its current tier and delegates to it, swapping it at
 *  runtime as spend changes, so a customer never changes class. A new tier
 *  is one subclass and one entry in Tiers. */
public abstract class Tier {
    private final String name;
    private final double threshold;          // yearly spend needed to reach it
    private final double pointsPerDollar;
    private final double freeShippingFrom;
    private final double shippingFee;
    private final int birthdayBonus;

    protected Tier(String name, double threshold, double pointsPerDollar,
                   double freeShippingFrom, double shippingFee, int birthdayBonus) {
        this.name = name; this.threshold = threshold;
        this.pointsPerDollar = pointsPerDollar; this.freeShippingFrom = freeShippingFrom;
        this.shippingFee = shippingFee; this.birthdayBonus = birthdayBonus;
    }

    public String name() { return name; }
    public double threshold() { return threshold; }
    public int pointsFor(double amount) { return (int) ((int) amount * pointsPerDollar); }
    public double shippingFee(double orderTotal) {
        return orderTotal >= freeShippingFrom ? 0 : shippingFee;
    }
    public int birthdayBonus() { return birthdayBonus; }

    /** The tier to hold next year. Overridden where a tier has its own rule. */
    public Tier atYearEnd(double yearSpend) { return Tiers.forSpend(yearSpend); }
}

public class Bronze extends Tier {
    public Bronze() { super("BRONZE", 0, 1.0, 100, 9.95, 0); }
}
public class Silver extends Tier {
    public Silver() { super("SILVER", 1000, 1.5, 50, 5.0, 200); }
}
public class Gold extends Tier {
    public Gold() { super("GOLD", 5000, 2.0, 0, 0, 500); }
}
public class Platinum extends Tier {
    private static final double RETAIN_AT = 15000;
    public Platinum() { super("PLATINUM", 20000, 3.0, 0, 0, 1000); }

    @Override
    public Tier atYearEnd(double yearSpend) {
        return yearSpend >= RETAIN_AT ? this : Tiers.forSpend(yearSpend);
    }
}

/** The tier ladder, highest first: the one place thresholds are compared. */
public final class Tiers {
    private static final List<Tier> LADDER =
            List.of(new Platinum(), new Gold(), new Silver(), new Bronze());

    private Tiers() { }

    public static Tier forSpend(double spend) {
        return LADDER.stream().filter(t -> spend >= t.threshold()).findFirst().orElseThrow();
    }
}

public class Customer {
    private final String name;
    private Tier tier = new Bronze();
    private double yearSpend;
    private int points;

    public Customer(String name) { this.name = name; }

    public void purchase(double amount) {
        points += tier.pointsFor(amount);        // earn at the tier held when buying
        yearSpend += amount;
        Tier reached = Tiers.forSpend(yearSpend);
        if (reached.threshold() > tier.threshold()) tier = reached;   // upgrade only
    }

    public double shippingFee(double orderTotal) { return tier.shippingFee(orderTotal); }
    public int birthdayBonus() { return tier.birthdayBonus(); }

    public void endOfYear() {
        tier = tier.atYearEnd(yearSpend);
        yearSpend = 0;
    }

    public String getTier() { return tier.name(); }
    public int getPoints() { return points; }
}`,
      notes: 'Holding the numbers as constructor data keeps each tier class short. Only behaviour that genuinely differs (Platinum’s retention rule) is overridden. A single generic Tier class configured with data would also be defensible, but then Platinum’s rule needs a flag, and the class becomes conditional again. Upgrading via the ladder fixes the original one-step-per-if bug: a $20,000 purchase goes straight to Platinum. An enum with constant-specific bodies is another clean implementation of the same Strategy.',
      must: ['Tier as an abstraction (abstract class/interface) with one class per tier', 'Customer holds a Tier field and delegates points, shipping and bonus (no tier switches left)', 'Upgrades can jump several tiers; thresholds in one place', 'Platinum added with its own year-end retention rule (override, not a flag in Customer)', 'Rationale: Strategy/State, runtime change, Open-Closed'] }
  ]);

  /* ===================== Section 3: design and build ==================== */

  addList(D.SCRATCH, [
    { title: 'Role-based access control',
      intro: '<p>A university portal controls access with <b>permissions</b> (e.g. ' + c('"grades.read"') + ') and <b>roles</b>. A role can be granted permissions and also <b>other roles</b>: granting the role ' + c('student') + ' to ' + c('tutor') + ' means a tutor can do everything a student can. Users are assigned roles. Implement the methods in ' + c('AccessControl') + '.</p>' +
        '<ul><li>' + c('can(user, permission)') + ' is true if any role assigned to the user contains the permission, directly or through any depth of nested roles. Unknown users have no permissions.</li>' +
        '<li>' + c('permissionsOf(role)') + ' returns every permission reachable from the role, sorted alphabetically, with no duplicates, even when a permission is reachable along several paths.</li>' +
        '<li>Granting must never create a cycle (a role that contains itself, directly or indirectly). Such a grant throws ' + c('IllegalArgumentException') + ' and leaves everything unchanged.</li></ul>',
      files: [
        { name: 'AccessControl.java', text: `public class AccessControl {
    public void createPermission(String name) { ... }
    public void createRole(String name) { ... }
    /** Adds a permission or another role to a role. */
    public void grant(String role, String permissionOrRole) { ... }
    public void assign(String userId, String role) { ... }
    public boolean can(String userId, String permission) { ... }
    public List<String> permissionsOf(String role) { ... }
}` },
        { name: 'AccessControlTest.java', text: `@Test
public void testCan() {
    AccessControl ac = new AccessControl();
    ac.createPermission("grades.read");
    ac.createPermission("grades.write");
    ac.createPermission("forum.post");
    ac.createRole("student");
    ac.createRole("tutor");
    ac.createRole("admin");
    ac.grant("student", "forum.post");
    ac.grant("tutor", "student");          // a tutor can do all a student can
    ac.grant("tutor", "grades.read");
    ac.grant("admin", "tutor");
    ac.grant("admin", "grades.write");
    ac.assign("z1", "tutor");
    assertTrue(ac.can("z1", "forum.post"));
    assertTrue(ac.can("z1", "grades.read"));
    assertFalse(ac.can("z1", "grades.write"));
    assertFalse(ac.can("nobody", "forum.post"));
}

@Test
public void testPermissionsAndCycles() {
    AccessControl ac = new AccessControl();
    ac.createPermission("a");
    ac.createPermission("b");
    ac.createRole("r1");
    ac.createRole("r2");
    ac.createRole("r3");
    ac.grant("r1", "a");
    ac.grant("r2", "r1");
    ac.grant("r2", "a");                   // "a" now reachable twice
    ac.grant("r3", "r2");
    ac.grant("r3", "b");
    assertEquals(List.of("a", "b"), ac.permissionsOf("r3"));
    assertThrows(IllegalArgumentException.class, () -> ac.grant("r1", "r3"));
    assertThrows(IllegalArgumentException.class, () -> ac.grant("r1", "r1"));
    assertEquals(List.of("a"), ac.permissionsOf("r1"));
}` }
      ],
      parts: [
        { kind: 'written', marks: 3,
          prompt: 'What design pattern fits this problem? Map each of its roles onto the scenario, and say where the cycle check belongs and why.',
          model: '<p><b>Composite.</b> Component: an ' + c('AccessNode') + ' interface with operations such as ' + c('allows(permission)') + ', ' + c('collect(set)') + ' and ' + c('contains(node)') + '. Leaf: ' + c('Permission') + '. Composite: ' + c('Role') + ', which holds a list of AccessNodes (permissions and other roles) and answers each operation by recursing over its children. The controller treats a permission and a whole role hierarchy the same way.</p>' +
            '<p>The cycle check belongs in ' + c('Role.add(child)') + ', the only place a child is attached: reject the child if it already contains this role (' + c('child.contains(this)') + '). Keeping it inside the composite protects the tree invariant no matter who calls ' + c('add') + ', and because the check runs before the child is added, nothing changes on failure.</p>',
          checklist: ['Named Composite', 'Permission as leaf, Role as composite holding AccessNodes', 'Operations recurse uniformly over the tree', 'Cycle check in the composite’s add, before mutating'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('createPermission') + ', ' + c('createRole') + ', ' + c('grant') + ', ' + c('assign') + ' and ' + c('can') + ' so that ' + c('testCan') + ' passes.',
          prefill: `public interface AccessNode {
    // ...
}

public class Permission implements AccessNode {
    // ...
}

public class Role implements AccessNode {
    // ...
}

public class AccessControl {
    // ...
}`,
          model: `public interface AccessNode {
    String getName();
    boolean allows(String permission);
}

public class Permission implements AccessNode {
    private final String name;
    public Permission(String name) { this.name = name; }
    public String getName() { return name; }
    public boolean allows(String p) { return name.equals(p); }
}

public class Role implements AccessNode {
    private final String name;
    private final List<AccessNode> children = new ArrayList<>();

    public Role(String name) { this.name = name; }
    public String getName() { return name; }
    public void add(AccessNode child) { children.add(child); }

    public boolean allows(String p) {
        return children.stream().anyMatch(c -> c.allows(p));
    }
}

public class AccessControl {
    private final Map<String, AccessNode> nodes = new HashMap<>();   // permissions and roles
    private final Map<String, Role> roles = new HashMap<>();
    private final Map<String, List<Role>> userRoles = new HashMap<>();

    public void createPermission(String name) { nodes.put(name, new Permission(name)); }

    public void createRole(String name) {
        Role r = new Role(name);
        roles.put(name, r);
        nodes.put(name, r);
    }

    public void grant(String role, String permissionOrRole) {
        roles.get(role).add(nodes.get(permissionOrRole));
    }

    public void assign(String userId, String role) {
        userRoles.computeIfAbsent(userId, k -> new ArrayList<>()).add(roles.get(role));
    }

    public boolean can(String userId, String permission) {
        return userRoles.getOrDefault(userId, List.of()).stream()
                .anyMatch(r -> r.allows(permission));
    }
}`,
          checklist: ['Common interface for Permission and Role', 'Role holds AccessNodes and recurses (any depth)', 'Separate role lookup so grant needs no cast', 'can() handles unknown users', 'Controller only wires objects together; logic lives in the nodes'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('permissionsOf') + ' and cycle prevention so that ' + c('testPermissionsAndCycles') + ' passes. Add operations to the component interface rather than inspecting types in the controller.',
          prefill: `public interface AccessNode {
    // ...
}

public class AccessControl {
    // ...
    public List<String> permissionsOf(String role) {
        // TODO
    }
}`,
          model: `public interface AccessNode {
    String getName();
    boolean allows(String permission);
    /** Adds every permission reachable from this node. */
    void collect(Set<String> into);
    /** Is other this node, or anywhere below it? */
    boolean contains(AccessNode other);
}

public class Permission implements AccessNode {
    ...
    public void collect(Set<String> into) { into.add(name); }
    public boolean contains(AccessNode other) { return this == other; }
}

public class Role implements AccessNode {
    ...
    /** @throws IllegalArgumentException if adding child would create a cycle */
    public void add(AccessNode child) {
        if (child.contains(this)) {
            throw new IllegalArgumentException(child.getName() + " already contains " + name);
        }
        children.add(child);
    }

    public void collect(Set<String> into) {
        children.forEach(c -> c.collect(into));
    }

    public boolean contains(AccessNode other) {
        return this == other || children.stream().anyMatch(c -> c.contains(other));
    }
}

public class AccessControl {
    ...
    public List<String> permissionsOf(String role) {
        Set<String> found = new TreeSet<>();     // sorted, no duplicates
        roles.get(role).collect(found);
        return new ArrayList<>(found);
    }
}`,
          checklist: ['collect() recurses and a Set removes duplicates; result sorted', 'contains() recursive; Role.add rejects child.contains(this)', 'Self-grant (r1 into r1) rejected too', 'Check happens before mutation, so state is unchanged on failure', 'No instanceof or casts in the controller'] }
      ] },

    { title: 'Live spreadsheet',
      intro: '<p>Build the model for a tiny spreadsheet. A cell holds either a number or a <b>formula</b> over other cells. A formula’s value must update automatically whenever the value of any cell it references changes, including through chains (A1 → B1 → C1). Empty cells are 0. Implement the methods in ' + c('Sheet') + '.</p>' +
        '<ul><li>Setting a cell replaces its previous content. A cell that stops being a formula must stop reacting to the cells it used to reference.</li>' +
        '<li>The change log records every time a cell’s value <i>actually changes</i>, as ' + c('"B1: 8.0 -> 10.0"') + '. Recomputing to the same value logs nothing.</li>' +
        '<li>You may assume there are no circular references.</li></ul>',
      files: [
        { name: 'Sheet.java', text: `public class Sheet {
    public void setNumber(String cell, double value) { ... }
    public void setSum(String cell, List<String> refs) { ... }
    public void setProduct(String cell, List<String> refs) { ... }
    public double get(String cell) { ... }
    public List<String> changeLog() { ... }
}` },
        { name: 'SheetTest.java', text: `@Test
public void testChains() {
    Sheet s = new Sheet();
    s.setNumber("A1", 2);
    s.setNumber("A2", 3);
    s.setSum("B1", List.of("A1", "A2"));      // 5
    s.setSum("C1", List.of("B1", "A1"));      // 7
    assertEquals(7, s.get("C1"), 0.001);
    s.setNumber("A1", 10);                    // B1 = 13, C1 = 23
    assertEquals(13, s.get("B1"), 0.001);
    assertEquals(23, s.get("C1"), 0.001);
    s.setNumber("B1", 1);                     // B1 is no longer a formula
    s.setNumber("A2", 100);                   // must not change B1
    assertEquals(1, s.get("B1"), 0.001);
    assertEquals(11, s.get("C1"), 0.001);
}

@Test
public void testProductAndLog() {
    Sheet s = new Sheet();
    s.setNumber("A1", 2);
    s.setNumber("A2", 4);
    s.setProduct("B1", List.of("A1", "A2"));
    s.setNumber("A1", 2);                     // unchanged: nothing logged
    s.setNumber("A2", 5);
    assertEquals(List.of("A1: 0.0 -> 2.0", "A2: 0.0 -> 4.0", "B1: 0.0 -> 8.0",
                         "A2: 4.0 -> 5.0", "B1: 8.0 -> 10.0"), s.changeLog());
}` }
      ],
      parts: [
        { kind: 'written', marks: 3,
          prompt: 'What design pattern fits this problem? Map its roles onto the scenario (note that a formula cell plays two roles), and explain how you handle a cell that stops being a formula.',
          model: '<p><b>Observer.</b> Every cell is a <b>subject</b> that keeps a list of observers and notifies them when its value changes. A formula cell is also an <b>observer</b> of each cell it references: when notified, it recomputes its value, and if that value changed it notifies <i>its</i> observers. That is how chains propagate. The change log is another observer, attached to every cell, so logging needs no code in the cells themselves.</p>' +
            '<p>Push old and new values (' + c('valueChanged(cell, old, now)') + '): the log needs both. When a cell’s content is replaced, it first <b>detaches</b> from every cell its old formula referenced, then attaches to the new references. Otherwise stale subscriptions would keep overwriting it. Notifying only on an actual change stops needless cascades.</p>',
          checklist: ['Named Observer', 'Cells as subjects; formula cells also observers of their references', 'Log as an observer (or equivalent)', 'Detach from old references when content changes'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('setNumber') + ', ' + c('setSum') + ' and ' + c('get') + ' so that ' + c('testChains') + ' passes.',
          prefill: `public interface CellObserver {
    // ...
}

public class Cell implements CellObserver {
    // ...
}

public class Sheet {
    // ...
}`,
          model: `public interface CellObserver {
    void valueChanged(Cell cell, double oldValue, double newValue);
}

/** What a cell holds: a number or a formula over other cells. */
public interface Content {
    double evaluate();
    List<Cell> references();
}

public class NumberContent implements Content {
    private final double value;
    public NumberContent(double value) { this.value = value; }
    public double evaluate() { return value; }
    public List<Cell> references() { return List.of(); }
}

public class SumFormula implements Content {
    private final List<Cell> refs;
    public SumFormula(List<Cell> refs) { this.refs = List.copyOf(refs); }
    public double evaluate() { return refs.stream().mapToDouble(Cell::getValue).sum(); }
    public List<Cell> references() { return refs; }
}

/** Subject (notifies dependents) and observer (of the cells it references). */
public class Cell implements CellObserver {
    private final String name;
    private Content content = new NumberContent(0);
    private double value;
    private final List<CellObserver> observers = new ArrayList<>();

    public Cell(String name) { this.name = name; }
    public String getName() { return name; }
    public double getValue() { return value; }

    public void attach(CellObserver o) { observers.add(o); }
    public void detach(CellObserver o) { observers.remove(o); }

    public void setContent(Content newContent) {
        content.references().forEach(r -> r.detach(this));   // stop old subscriptions
        content = newContent;
        content.references().forEach(r -> r.attach(this));
        recompute();
    }

    @Override
    public void valueChanged(Cell source, double oldValue, double newValue) {
        recompute();
    }

    private void recompute() {
        double old = value;
        value = content.evaluate();
        if (old != value) {
            for (CellObserver o : List.copyOf(observers)) o.valueChanged(this, old, value);
        }
    }
}

public class Sheet {
    private final Map<String, Cell> cells = new HashMap<>();

    private Cell cell(String name) {
        return cells.computeIfAbsent(name, Cell::new);
    }
    private List<Cell> cells(List<String> names) {
        return names.stream().map(this::cell).toList();
    }

    public void setNumber(String name, double value) {
        cell(name).setContent(new NumberContent(value));
    }
    public void setSum(String name, List<String> refs) {
        cell(name).setContent(new SumFormula(cells(refs)));
    }
    public double get(String name) { return cell(name).getValue(); }
}`,
          checklist: ['Observer interface; cells keep observers and notify on change', 'Formula cells subscribe to their references and recompute', 'Chains propagate (B1 notifies C1)', 'Old subscriptions detached when content is replaced', 'Notifies only when the value actually changes'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('setProduct') + ' and ' + c('changeLog') + ' so that ' + c('testProductAndLog') + ' passes, without duplicating the sum logic.',
          prefill: `public class Sheet {
    // ...
    public void setProduct(String cell, List<String> refs) {
        // TODO
    }
    public List<String> changeLog() {
        // TODO
    }
}`,
          model: `/** One formula class: the operation is a strategy, so sum and product
 *  (and later min, max, average) don't repeat the subscription logic. */
public class Formula implements Content {
    private final List<Cell> refs;
    private final double identity;
    private final DoubleBinaryOperator combine;

    private Formula(List<Cell> refs, double identity, DoubleBinaryOperator combine) {
        this.refs = List.copyOf(refs); this.identity = identity; this.combine = combine;
    }
    public static Formula sum(List<Cell> refs) { return new Formula(refs, 0, Double::sum); }
    public static Formula product(List<Cell> refs) { return new Formula(refs, 1, (a, b) -> a * b); }

    public double evaluate() {
        double result = identity;
        for (Cell c : refs) result = combine.applyAsDouble(result, c.getValue());
        return result;
    }
    public List<Cell> references() { return refs; }
}

/** Another observer: attached to every cell when it is created. */
public class ChangeLog implements CellObserver {
    private final List<String> entries = new ArrayList<>();
    public void valueChanged(Cell cell, double oldValue, double newValue) {
        entries.add(cell.getName() + ": " + oldValue + " -> " + newValue);
    }
    public List<String> entries() { return List.copyOf(entries); }
}

public class Sheet {
    private final Map<String, Cell> cells = new HashMap<>();
    private final ChangeLog log = new ChangeLog();

    private Cell cell(String name) {
        return cells.computeIfAbsent(name, n -> {
            Cell c = new Cell(n);
            c.attach(log);               // first observer, so a cell's own change
            return c;                    // is logged before its dependents'
        });
    }
    ...
    public void setSum(String name, List<String> refs) {
        cell(name).setContent(Formula.sum(cells(refs)));
    }
    public void setProduct(String name, List<String> refs) {
        cell(name).setContent(Formula.product(cells(refs)));
    }
    public List<String> changeLog() { return log.entries(); }
}`,
          checklist: ['Product added without copying sum’s logic (shared Formula / strategy)', 'Log implemented as an observer, not as code inside Cell', 'Logs only real changes, with the exact format', 'Order: a cell’s change is logged before its dependents’', 'Returns a copy of the log'] }
      ] }
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
