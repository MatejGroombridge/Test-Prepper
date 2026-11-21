/* subjects/comp2511-practice.js — the course's own revision material, added
   to the COMP2511 banks. Load after comp2511-code.js, before comp2511.js.

   Every item carries `src`, shown under the question:
     'course practice questions'  the official practice MCQ / short-answer set
     'Week 10 tutorial'           tute 10 (finding patterns, smells, serverless,
                                  architecture revision)
   Model answers for the short answers are ours: the course does not publish
   them. The lab-based design and programming problems are in
   comp2511-labs.js. */
(function (global) {
  'use strict';

  var D = global.COMP2511Data;
  var pre = D.pre, c = D.c;
  var PQ = 'course practice questions', T10 = 'Week 10 tutorial';

  function add(bank, key, src, items) {
    items.forEach(function (x) { x.src = src; });
    bank[key] = (bank[key] || []).concat(items);
  }
  function ul(items) { return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>'; }

  /* ======================= multiple choice: practice set ================= */

  add(D.MCQ, 'oo', PQ, [
    { q: 'On a bike, there are one or more tyres. This relationship is an example of:',
      o: ['Aggregation', 'Composition', 'Neither'], fixed: true,
      why: 'A tyre can exist without the bike (it can be swapped, sold or fitted to another bike), so it is aggregation. Compare a car’s VIN plate, which would be destroyed with the car.' },
    { q: 'Which of the following statements is correct?',
      o: ['Overloaded methods are resolved at compile-time, while overridden methods are resolved at runtime.',
          'Overloaded methods have the same method signature, while overridden methods have a different method signature.',
          'Overloaded methods can have different access modifiers, while overridden methods must have the same access modifier.',
          'Overloaded methods are defined in different classes, while overridden methods are defined in the same class.'],
      why: 'Overloading = same name, different parameters, chosen by the compiler. Overriding = same signature in a subclass, chosen by dynamic dispatch. (Overrides may <i>widen</i> access, so they need not be identical; overloads can be in the same class.)' },
    { q: 'Which of the following statements is <b>untrue</b> about method overriding?',
      o: ['During method overriding, the overridden method in the sub-class can specify a less permissive access modifier',
          'Constructors cannot be overridden',
          'If a static method in the base class is redefined in the sub-class, the latter hides the method in the base class',
          'In method overriding, run-time polymorphism ensures the call is resolved to the correct method based on the run-time type of the object'],
      why: 'An override may keep or widen access (protected → public) but never narrow it: narrowing would break callers using the parent type, an LSP violation the compiler refuses.' },
    { q: 'Consider the following code:' + pre(`
class X {
    public void a() {}
}

class Y {
    public void b() {}
}

class Z extends X, Y {
    protected void a() {}

    public void b() {}

    public void b(String arg) {}
}`) +
        '(1) It doesn’t compile because there is more than one class in the same file<br>' +
        '(2) It doesn’t compile because double inheritance is not possible in Java<br>' +
        '(3) It doesn’t compile because the methods a and b are not marked with @Override<br>' +
        '(4) It doesn’t compile because you cannot overload a method that is overriding a method in a superclass<br>' +
        '(5) It doesn’t compile because a cannot have its visibility reduced from the superclass to the subclass<br>' +
        '(6) The code does compile<br><br>Which set of statements is true?',
      o: ['(1), (2)', '(1), (3), (5)', '(2), (3), (4), (5)', '(2), (5)', '(2), (4), (5)', '(6)'], a: 3, fixed: true,
      why: 'A class can extend only one class (2), and an override cannot reduce visibility from public to protected (5). Several non-public classes may share a file, @Override is optional, and overloading an overridden method is fine.' }
  ]);

  add(D.MCQ, 'model', PQ, [
    { q: '<i>A single GitLab repository can have zero or more merge requests.</i> Which UML multiplicity best represents this relationship? <span class="small muted">(The original question used images; here the options are written out.)</span>',
      o: ['Repository 1 ◆—— 0..* MergeRequest', 'Repository 1 ◆—— 1..* MergeRequest', 'Repository 0..* ◆—— 1 MergeRequest', 'Repository 1 ◆—— 1 MergeRequest'],
      why: 'Read each end on its own: each merge request belongs to exactly one repository (1 at the repository end), and a repository has <i>zero</i> or more merge requests (0..* — 1..* would forbid a repository with none). A merge request cannot exist without its repository, hence the filled diamond.' }
  ]);

  add(D.MCQ, 'principles', PQ, [
    { q: 'From a student’s Assignment II blog: <i>“After I refactored the code, I started work on adding new features but found I had to go and modify everything because the design didn’t work with the new requirements.”</i> Which SOLID principle is being violated?',
      o: ['Single Responsibility Principle', 'Open-Closed Principle', 'Liskov Substitution Principle', 'Interface Segregation Principle', 'Dependency Inversion Principle'], a: 1, fixed: true,
      why: 'New features should be addable by extension; having to modify everything means the design is not closed for modification.' },
    { q: 'From a student’s Assignment II blog: <i>“I was working on the enemy goal class, but in order to implement it I ended up putting in way too many unrelated responsibilities into that class like some of the battle logic and some of the logic for destroying spawners.”</i> Which SOLID principle is being violated?',
      o: ['Single Responsibility Principle', 'Open-Closed Principle', 'Liskov Substitution Principle', 'Interface Segregation Principle', 'Dependency Inversion Principle'], fixed: true,
      why: '“Too many unrelated responsibilities” in one class is the definition of an SRP violation (and low cohesion).' },
    { q: 'Nick is working on a UNSW CSE system. Which statement is most accurate about how Nick should build the system?',
      o: ['The design should allow new engineers to easily join the project after Nick has left.',
          'The system should be built in Java so that Design Patterns can be used.',
          'Documentation is unimportant as the code should be written so well it is understandable.',
          'Testing the system works is a lower priority than getting it working.'],
      why: 'Maintainability is the point of the course: other people will change this code. Patterns are not Java-specific, documentation still matters, and testing is not optional.' }
  ]);

  add(D.MCQ, 'java', PQ, [
    { q: 'Which of the following exceptions must be handled by a try-catch block or declared?',
      o: ['MalformedURLException', 'NullPointerException', 'ClassCastException', 'ArithmeticException'],
      why: c('MalformedURLException') + ' extends ' + c('IOException') + ', so it is checked. The other three extend ' + c('RuntimeException') + '.' }
  ]);

  add(D.MCQ, 'fp', PQ, [
    { q: 'Pick the most semantically correct type for the redacted declaration:' + pre('[redacted] rval = () -> Math.random();'),
      o: ['Supplier<Double>', 'Function<Double, Boolean>', 'Consumer<Double>', 'Predicate<Double>'],
      why: 'No input, returns a value: ' + c('Supplier<T>') + '.' }
  ]);

  add(D.MCQ, 'patterns', PQ, [
    { q: 'Grace is generating course outlines. There are exactly three types — COMP, SENG and BINF — and no other types or subtypes. Each outline is a random course code (e.g. COMPXXXX) and a lecturer chosen from that type’s list, nothing more or less. Grace wants to pass "COMP", "SENG" or "BINF" to a method and get back the right course outline. Which pattern is most appropriate?',
      o: ['Factory Pattern', 'Composite Pattern', 'Abstract Factory Pattern', 'Decorator Pattern'],
      why: 'One method that takes a type key and returns one product. Abstract Factory is for <i>families</i> of related products; here each outline is a single product with no variations.' },
    { q: 'A design pattern used to enhance a component’s functionality dynamically at run-time is:',
      o: ['Decorator Pattern', 'Composite Pattern', 'Abstract Factory Pattern', 'Observer Pattern'],
      why: 'Decorator wraps a component in objects with the same interface that add behaviour, and they can be added at runtime.' }
  ]);

  /* ====================== multiple choice: Week 10 tutorial ============== */

  add(D.MCQ, 'patterns', T10, [
    { q: 'Which pattern fits? <i>Sorting collections of records in different orders.</i>',
      o: ['Strategy', 'Composite', 'Observer', 'Decorator'],
      why: 'Each ordering is an interchangeable algorithm. Java’s ' + c('Comparator') + ' passed to ' + c('sort') + ' is exactly a strategy.' },
    { q: 'Which pattern fits? <i>Listing the contents of a file system.</i>',
      o: ['Composite', 'Strategy', 'Decorator', 'Abstract Factory'],
      why: 'Folders contain files and folders: a part–whole tree, listed by recursing through a common interface.' },
    { q: 'Which pattern fits? <i>Updating a UI component when the state of a program changes.</i>',
      o: ['Observer', 'Decorator', 'Composite', 'Singleton'],
      why: 'The UI component subscribes to the model (subject) and is notified of changes; this is the basis of MVC.' },
    { q: 'Which pattern fits? <i>A frozen yogurt shop that alters the cost and weight of a bowl based on the toppings customers choose before checkout.</i>',
      o: ['Decorator', 'Composite', 'Strategy', 'Observer'],
      why: 'Each topping wraps the bowl and adjusts cost and weight, stacking in any combination.' },
    { q: 'Which pattern fits? <i>In a stealth game, enemy guards should be alerted when the player produces a loud noise.</i>',
      o: ['Observer', 'Strategy', 'Decorator', 'Factory Method'],
      why: 'The player (or a noise source) is the subject; guards register as observers and react when notified.' },
    { q: 'Which pattern fits? <i>A cross-platform app must create buttons, menus and dialogs that match the look and feel of Windows, macOS or Linux.</i>',
      o: ['Abstract Factory', 'Factory Method', 'Decorator', 'Composite'],
      why: 'A family of related widgets per platform that must be used together: one concrete factory per platform.' },
    { q: 'Which pattern fits? <i>A text editor where bold, italic, underline, highlight and fonts can be combined, and added or removed dynamically.</i>',
      o: ['Decorator', 'Strategy', 'Composite', 'Observer'],
      why: 'Formatting effects wrap the text and stack in any combination at runtime.' }
  ]);

  add(D.MCQ, 'styles', T10, [
    { q: 'What is the primary benefit of serverless computing for developers?',
      o: ['No infrastructure management required', 'Complete control over the operating system', 'No need to write functions', 'Permanent server allocation'],
      why: 'The provider runs and scales the servers; developers deploy functions.' },
    { q: 'In a serverless system, when does a function typically execute?',
      o: ['In response to specific events, e.g. API calls or file uploads', 'At scheduled time intervals only', 'Continuously, e.g. as a background process', 'Only when the server is restarted'],
      why: 'Functions are event-triggered. A schedule is one possible trigger, not the only one.' },
    { q: 'Which of the following is <b>not</b> a serverless platform?',
      o: ['Docker Lambda', 'AWS Lambda', 'Azure Functions', 'Google Cloud Functions'],
      why: 'Docker is a container technology; "Docker Lambda" is not a provider’s functions platform.' },
    { q: 'What best describes the cost model of serverless computing?',
      o: ['Usage-based micro-billing', 'Fixed monthly fee', 'Per second of CPU usage', 'Based on RAM usage only'],
      why: 'You pay for invocations and execution time × memory actually used, and nothing when idle.' },
    { q: 'Which best describes the correct order of operations in a typical serverless function workflow?',
      o: ['A user request is received, an event triggers a function, and the function processes and returns a result',
          'A function stores data, triggers an event, and then receives a user request',
          'A user request is sent, the function processes data, then an event is triggered',
          'A function runs continuously, waiting to trigger an API Gateway response'],
      why: 'Request → event (e.g. via an API gateway) → function runs → result. Functions do not run continuously.' },
    { q: 'What is a major drawback of serverless architecture?',
      o: ['Cold start latency', 'Low availability', 'High upfront infrastructure cost', 'Poor scalability'],
      why: 'Availability and scalability are strengths, and there is no upfront cost. Cold starts add latency when no warm instance exists.' },
    { q: 'Which principle is <b>least</b> aligned with serverless design?',
      o: ['Monolithic code blocks', 'Statelessness', 'Single-responsibility functions', 'Event-driven logic'],
      why: 'Serverless favours small, stateless, single-purpose functions triggered by events.' },
    { q: 'What is a mitigation strategy for cold start issues?',
      o: ['Using warm-up plugins or provisioned concurrency', 'Restarting the server', 'Using containers', 'Increasing memory allocation to the function'],
      why: 'Keep instances warm (scheduled pings) or pay the provider to keep some initialised (provisioned concurrency). More memory can shorten start-up slightly but does not remove it.' },
    { q: 'Comparing serverless and microservice architectures, which is TRUE about serverless?',
      o: ['It is managed fully by the cloud provider', 'It uses containers for deployment', 'Monitoring is fully integrated', 'It has fixed computational costs'],
      why: 'Microservices are typically deployed in containers you operate; serverless runtimes are managed by the provider. Costs vary with use, and monitoring across functions is a known weakness.' },
    { q: 'Why are serverless functions typically designed to be stateless?',
      o: ['So that functions can scale independently and reliably', 'To reduce memory usage', 'To allow them to store local logs easily', 'To improve compatibility with operating systems'],
      why: 'Any instance can handle any request and instances come and go, so no state may live in one; it goes to external stores.' },
    { q: 'What is a key design principle that makes serverless architecture suitable for modern applications?',
      o: ['Event-driven workflows with small, composable functions', 'Complex functions with multiple responsibilities', 'Rigidly defined request and response chains', 'Dependence on local file systems for state management'],
      why: 'Small functions wired together by events are easy to scale, replace and recombine.' },
    { q: 'Why can observability be a challenge in serverless systems?',
      o: ['The request flow may span multiple short-lived functions', 'Functions do not support logs', 'Functions are executed on user-managed servers', 'Serverless functions run too slowly to trace'],
      why: 'One user request may touch many ephemeral functions, so tracing it end to end needs distributed tracing and correlation IDs.' },
    { q: 'Which scenario is best suited for a serverless architecture?',
      o: ['A low-traffic contact form that stores submissions in a database', 'A long-running background process with complex state',
          'A high-performance game server with persistent connections', 'A legacy application requiring access to local file systems'],
      why: 'Short, stateless, infrequent, event-triggered work. The others need long runs, state, persistent connections or local disks.' },
    { q: 'What role does an event play in a serverless system?',
      o: ['It triggers the execution of a function', 'It replaces the need for functions', 'It controls billing rates', 'It stores function logs for auditing'],
      why: 'Events (HTTP requests, uploads, queue messages, timers) are what invoke functions.' },
    { q: 'What is a common drawback of relying too heavily on a single cloud provider, particularly in serverless architecture?',
      o: ['Vendor lock-in, limiting flexibility and portability', 'Decreased application performance', 'Slower deployment across platforms', 'Bills become expensive over time'],
      why: 'Functions depend on the provider’s triggers, services and deployment model, which makes moving providers costly.' },

    { q: 'A small café wants an electronic way to manage orders, with only a handful of features (create an order, mark it complete, delete it), to test the idea before committing. Which architecture is most suitable?',
      o: ['Layered Architecture', 'Microservices', 'Event driven', 'Modular Monolith'],
      why: 'Tiny scope, tiny team, trial project: the simplest, cheapest structure wins.' },
    { q: 'An organisation wants to scale user management, billing and content recommendation <b>independently</b> for a streaming platform like Netflix. Which architecture is most suitable?',
      o: ['Microservices', 'Event driven', 'Layered Architecture', 'Modular Monolith'],
      why: 'Independent scaling (and deployment) of separate capabilities is the defining strength of microservices.' },
    { q: 'A government tax agency needs high control over deployments and compliance enforcement. Which architecture provides easier centralised governance?',
      o: ['Monolithic', 'Microservices', 'Modular Monolith', 'Event Driven'],
      why: 'One codebase and one deployment pipeline are the easiest to control, audit and certify. (A modular monolith is also a single deployment; the official answer is not published, so this is our reading. Microservices and EDA distribute control.)' },
    { q: 'An education platform needs clear boundaries between features like course content, assessment and user management. Teams are aligned to business domains. What is the best fit?',
      o: ['Modular Monolith', 'Serverless', 'Layered Architecture', 'Microservices'],
      why: 'Domain partitioning matches the teams, and nothing in the scenario demands independent scaling or deployment, so the modular monolith gets clear boundaries without distribution costs.' },
    { q: 'An IoT device continuously sends JSON health data to the cloud, which must process it and generate alerts immediately. What is the most efficient choice?',
      o: ['Event Driven', 'Microservices', 'Layered', 'Monolithic'],
      why: 'A continuous stream of events processed asynchronously, with consumers reacting in real time.' },
    { q: 'An image-processing pipeline must resize photos as soon as they are uploaded to a cloud bucket. Cost is a major concern. What should you use?',
      o: ['Serverless', 'Microservices', 'Modular Monolith', 'Event driven'],
      why: 'An upload event triggers a short function; pay only per resize and nothing when idle.' },
    { q: 'You are migrating a legacy layered system and want domain-based modularity without increasing operational complexity. What is your best first step?',
      o: ['Convert it to a modular monolith', 'Migrate to serverless functions', 'Move to microservices', 'Keep the layered structure permanently'],
      why: 'Domain modules with a single deployment: modularity without the operational burden of a distributed system.' }
  ]);

  /* ========================== short answers ============================== */

  add(D.SHORT, 'oo', PQ, [
    { m: 4,
      q: 'For each code snippet: identify the logic error (1 mark), and write a failing assertion that would catch it as part of a unit test, e.g. ' + c('assertEquals(4, f(2))') + ' (1 mark).' +
        '<br><b>a)</b>' + pre(`
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null) return false;
    if (!(obj instanceof Article)) return false;

    Article other = (Article) obj;

    return this.title.equals(other.title) && this.views.equals(other.views);
}`) + '<b>b)</b>' + pre(`
public List<Integer> withoutOddNumbers(List<Integer> numbers) {
    for (Integer number : numbers) {
        if (number % 2 != 0) {
            numbers.remove(number);
        }
    }

    return new ArrayList<Integer>(numbers);
}`),
      model: '<p><b>a)</b> ' + c('instanceof') + ' lets a <i>subclass</i> of Article compare equal to an Article, but not the other way round if the subclass also overrides ' + c('equals') + ' — breaking symmetry. Use ' + c('getClass() != obj.getClass()') + '. ' +
        'With ' + c('class FeaturedArticle extends Article') + ' (whose own equals also checks a ' + c('featuredUntil') + ' field):</p>' +
        pre(`
Article a = new Article("Java", 10);
Article f = new FeaturedArticle("Java", 10, tomorrow);
assertEquals(f.equals(a), a.equals(f));   // fails: a.equals(f) is true, f.equals(a) false`) +
        '<p>(Also acceptable: ' + c('a.equals(f)') + ' should be false because they are different kinds of object — ' + c('assertFalse(a.equals(f))') + '.)</p>' +
        '<p><b>b)</b> It removes from the list while iterating over it with a for-each loop. That usually throws ' + c('ConcurrentModificationException') + ', and in some cases silently skips the element after a removal (when the removed element is second-to-last, the loop just ends). It also mutates the caller’s list. Fix: ' + c('numbers.removeIf(n -> n % 2 != 0)') + ' on a copy, or a stream filter.</p>' +
        pre(`
assertEquals(List.of(), withoutOddNumbers(new ArrayList<>(List.of(1, 3))));
// fails: removing 1 ends the loop early, so [3] is returned
assertEquals(List.of(2, 4), withoutOddNumbers(new ArrayList<>(List.of(1, 2, 3, 4))));
// fails: throws ConcurrentModificationException`),
      must: ['a) instanceof breaks symmetry with subclasses (or allows subclass equality)', 'a) a concrete assertion that fails', 'b) modifying the list during for-each iteration', 'b) a concrete assertion that fails (exception or skipped element)'] },
    { m: 7,
      q: 'Consider the following code, which does not compile. The error (on ' + c('List<String> bar') + ' in ' + c('Foo2') + ') is: <i>The return type is incompatible with Foo.bar()</i>.' + pre(`
class Foo {
    public ArrayList<String> bar() {
        return new ArrayList<String>();
    }
}

class Foo2 extends Foo {
    @Override
    public List<String> bar() {
        return new ArrayList<String>();
    }
}`) +
        'a) Explain the difference between <b>covariance</b> and <b>contravariance</b>. (2 marks)<br>' +
        'b) Does the code fail to compile because it breaks covariance or contravariance? (1 mark)<br>' +
        'c) With reference to Design by Contract, explain how the code constitutes invalid inheritance and violates the Liskov Substitution Principle. (4 marks)',
      model: '<p><b>a)</b> <i>Covariance</i>: in a subtype, a type may be specialised to a <b>narrower</b> subtype — in Java, an overriding method may return a more specific type than the parent (parent returns ' + c('List') + ', child returns ' + c('ArrayList') + '). ' +
        '<i>Contravariance</i>: a type may be generalised to a <b>wider</b> supertype — e.g. an overriding method accepting a more general parameter type than the parent. Java allows covariant return types but not contravariant parameters (a different parameter type is an overload, not an override).</p>' +
        '<p><b>b)</b> <b>Covariance.</b> The child’s return type ' + c('List') + ' is wider than the parent’s ' + c('ArrayList') + '; return types may only stay the same or narrow.</p>' +
        '<p><b>c)</b> The return type is part of the method’s <b>postcondition</b>: Foo.bar() promises "returns an ArrayList". Foo2.bar() only promises "returns some List" — a <b>weaker postcondition</b>, which a subclass may not have. ' +
        'A client written against Foo can rely on the promise, e.g. ' + c('foo.bar().ensureCapacity(100)') + ' or ' + c('ArrayList<String> xs = foo.bar();') + '. If handed a Foo2, that client could receive a ' + c('LinkedList') + ' and break. ' +
        'So Foo2 is not substitutable for Foo, violating LSP; the compiler rejects it for exactly this reason.</p>',
      must: ['Covariance: narrower/more specific type in the subtype (e.g. return types)', 'Contravariance: wider/more general type (e.g. parameters)', 'b) covariance',
             'Return type is part of the postcondition; the child weakens it', 'Client relying on ArrayList breaks when given Foo2 → not substitutable (LSP)'] }
  ]);

  add(D.SHORT, 'principles', PQ, [
    { m: 2,
      q: 'Consider these two classes from a previous COMP2511 assignment. Which class do you think has better <b>cohesion</b>? Justify your answer.' + pre(`
public final class Angle {
    private final double radians;          // stored internally as radians

    private Angle(double radians) { this.radians = normalise(radians); }
    public static Angle fromRadians(double radians) { return new Angle(radians); }
    public static Angle fromDegrees(double degrees) { return new Angle(Math.toRadians(degrees)); }
    private static double normalise(double radians) { ... }

    public int compareTo(Angle other) { return Double.compare(this.radians, other.radians); }
    public Angle add(Angle other)      { return Angle.fromRadians(this.radians + other.radians); }
    public Angle subtract(Angle other) { return Angle.fromRadians(this.radians - other.radians); }
}

public final class MathsHelper {
    /** Distance between a satellite and another satellite. */
    public static double getDistance(double satelliteHeight, Angle satelliteAngle,
                                     double otherHeight, Angle otherAngle) {
        // convert both to euclidean, then find the length between them
        ...
    }
    /** Distance between a satellite and a device. */
    public static double getDistance(double satelliteHeight, Angle satelliteAngle, Angle deviceAngle) {
        return getDistance(satelliteHeight, satelliteAngle, RADIUS_OF_JUPITER, deviceAngle);
    }
    /** Is a satellite visible to a device? */
    public static boolean isVisible(double satelliteHeight, Angle satelliteAngle, Angle deviceAngle) { ... }
    /** Is a satellite visible to another satellite? */
    public static boolean isVisible(double satelliteHeight, Angle satelliteAngle,
                                    double otherHeight, Angle otherAngle) {
        // converts both to euclidean again (duplicated), then line-circle intersection maths
        ...
    }
}`),
      model: '<p><b>Angle</b> has better cohesion. Everything in it — its single field, the factories, normalisation, comparison, addition and subtraction — serves one purpose: representing and manipulating an angle. It is also immutable and encapsulates its representation (radians) completely.</p>' +
        '<p>MathsHelper is a "helper" grab-bag of static functions about satellites, devices, distance and visibility. It has no state of its own, operates on data belonging to other concepts (heights and angles of satellites), and duplicates the euclidean conversion in two methods. Its functions belong with the concepts they describe (e.g. a ' + c('Position') + ' class with ' + c('distanceTo') + ' and ' + c('canSee') + '), which would raise cohesion.</p>',
      must: ['Chose Angle', 'Justified: all members relate to one concept/responsibility', 'Contrasted MathsHelper: utility grab-bag operating on other classes’ data (or duplication)'] }
  ]);

  add(D.SHORT, 'dbc', PQ, [
    { m: 4,
      q: 'With reference to Design by Contract and the Liskov Substitution Principle, explain whether or not this inheritance relationship is valid. Justify your answer.' + pre(`
class StandardUNSWLatePenalty {
    /**
     * @postconditions: The late penalty will be at most
     * the number of days late * 5
     */
    public int calculateLatePenalty(LocalDateTime dueDate, LocalDateTime submittedDate) { ... }
}

class COMP2511AssignmentIILatePenalty extends StandardUNSWLatePenalty {
    /**
     * @postconditions: The late penalty is the number of days late * 2
     */
    public int calculateLatePenalty(LocalDateTime dueDate, LocalDateTime submittedDate) { ... }
}`),
      model: '<p><b>Valid.</b> The preconditions are unchanged. The parent promises the penalty is <i>at most</i> days × 5; the child promises it is <i>exactly</i> days × 2. Since days late ≥ 0, days × 2 ≤ days × 5, so every result the child returns satisfies the parent’s postcondition — and it promises something more precise.</p>' +
        '<p>That is a <b>strengthened</b> postcondition, which is allowed. Any client that uses a StandardUNSWLatePenalty and relies on "penalty ≤ 5 × days" (e.g. to cap a mark deduction) still gets correct behaviour from the COMP2511 version, so it is substitutable and satisfies LSP.</p>',
      must: ['Verdict: valid', 'days × 2 ≤ days × 5 so the parent’s postcondition still holds', 'Named it a strengthened postcondition (allowed)', 'Linked to clients of the parent / substitutability'] },
    { m: 4,
      q: 'Kate hasn’t completed the pre- and postconditions of ' + c('FirstClassAirport') + ' yet.' + pre(`
public class Airport {
  /**
   * @precondition 0 <= number of bags <= 2, total weight of bags is less than 23kgs
   * @postcondition return the boarding number (a String starting with "BN")
   */
  public String checkIn(List<Bags> bags) { ... }
}
public class FirstClassAirport extends Airport {
  /**
   * @precondition // TODO
   * @postcondition // TODO
   */
  public String checkIn(List<Bags> bags) { ... }
}`) +
        'She says: <i>"I want to give my FirstClassAirport passengers special check-in treatment, but I’m afraid of breaking the preconditions and postconditions of the Airport class."</i><br>' +
        'With reference to Design by Contract and LSP, explain what she means by breaking the pre- and postconditions. Give an example of a valid pair for FirstClassAirport, both different from Airport’s, and explain why they are valid.',
      model: '<p>Clients of ' + c('Airport') + ' may be given a ' + c('FirstClassAirport') + ' and must not notice (LSP). She would <i>break</i> the precondition by <b>strengthening</b> it — accepting less, e.g. "at most 1 bag" — so a client passing 2 bags fails. She would break the postcondition by <b>weakening</b> it — promising less, e.g. returning a code that does not start with "BN" — so a client parsing the boarding number fails.</p>' +
        '<p>Valid example:</p>' + ul([
          '<b>Precondition:</b> 0 ≤ number of bags ≤ 3, total weight less than 32 kg. This is <i>weaker</i>: every input Airport accepts (≤ 2 bags, &lt; 23 kg) is still accepted, plus more — the first-class extra allowance.',
          '<b>Postcondition:</b> returns a boarding number starting with "BNF" and the passenger is added to the priority boarding group. This is <i>stronger</i>: "BNF…" still starts with "BN", so Airport’s promise holds, and more is guaranteed.']),
      must: ['Breaking = strengthening the precondition or weakening the postcondition', 'Explained via a client of Airport receiving a FirstClassAirport (LSP)', 'A weaker (wider) precondition example, justified', 'A stronger postcondition example that still starts with "BN", justified'] },
    { m: 4,
      q: 'With reference to Design by Contract and the Liskov Substitution Principle, explain why this inheritance is invalid.' + pre(`
public class Flight {
    /*
    @precondition age >= 0, name does not contain any spaces
    @postcondition The flight is booked
    */
    boolean book(int age, String name) { ... }
}
public class GoldFlight extends Flight {
    /*
    @precondition age >= 50, name does not contain any spaces
    @postcondition The flight is booked
    */
    @Override
    boolean book(int age, String name) { ... }
}`),
      model: '<p>GoldFlight <b>strengthens the precondition</b>: Flight accepts any age ≥ 0, but GoldFlight only accepts age ≥ 50. Under Design by Contract a subclass may only keep or weaken preconditions, because callers only know the parent’s contract.</p>' +
        '<p>A client written against Flight may legitimately call ' + c('flight.book(30, "Ana")') + '. If that Flight is actually a GoldFlight, the call violates GoldFlight’s precondition and the booking is not guaranteed — the client breaks through no fault of its own. GoldFlight is therefore not substitutable for Flight, violating LSP. The postcondition being identical does not save it.</p>' +
        '<p>Fix: model the age rule as an eligibility check that is part of the parent’s contract (e.g. ' + c('canBook(age)') + '), or do not make GoldFlight a subtype of Flight.</p>',
      must: ['Identified the precondition is strengthened (age ≥ 50 vs ≥ 0)', 'Stated subclasses may only weaken preconditions', 'Concrete client example (e.g. age 30) that breaks', 'Concluded not substitutable → LSP violation'] }
  ]);

  add(D.SHORT, 'smells', PQ, [
    { m: 3,
      q: 'Chloe, Nicole and Sebastian are adding features to the Assignment II codebase. They find this note from the previous team:<br><i>"We were trying to make the way Potions are implemented more extensible through refactoring in a few different classes. However, we found that when we tried to make these changes, the InventoryItem class would always break."</i><br>' +
        'State what design smell is present, and explain how it differs from Shotgun Surgery.',
      model: '<p><b>Divergent Change</b> (with the tight coupling that causes it): InventoryItem is changed — or breaks — for reasons that are not about inventory items at all, such as how potions work. One class is affected by many different kinds of change, a sign it has too many responsibilities or depends on the internals of potion classes.</p>' +
        '<p><b>Shotgun Surgery</b> is the mirror image: a <i>single</i> change forces small edits across <i>many</i> classes. Divergent change is <i>many</i> kinds of change landing on <i>one</i> class. Fix here: decouple InventoryItem from potion details (potions implement an interface InventoryItem depends on; move potion logic into the potion classes).</p>',
      must: ['Named Divergent Change (or a well-argued coupling smell)', 'Explained it as one class affected by many unrelated changes', 'Contrasted with Shotgun Surgery: one change → many classes'] },
    { m: 5,
      q: 'Consider this student’s Assignment I code:' + pre(`
for (Entity entity2 : entList) {
    if (entity.canLoad(entity2)) {
        if (entity2 instanceof PassengerTrain) {
            for (Entity entity3 : entList) {
                if (entity instanceof CargoTrain && !(entity3 instanceof Passenger)) {
                    if (entity2.canLoad(entity3)) {
                        canLoad.add(entity3.getId());
                    }
                } else if (!(entity instanceof CargoTrain) && entity2.canLoad(entity3)) {
                    canLoad.add(entity3.getId());
                }
            }
        }
        canLoad.add(entity2.getId());
    }
}`) +
        'a) State two code smells present. (2 marks)<br>b) In your own words, explain the underlying design problem causing these smells and what should be done to improve the design. (3 marks)',
      model: '<p><b>a)</b> Any two of: <b>type checking with instanceof</b> (the switch-statements smell); <b>deeply nested conditionals / long method</b>; <b>duplicated code</b> (the ' + c('canLoad(entity3)') + ' / ' + c('add(entity3.getId())') + ' branch appears twice); <b>poor naming</b> (' + c('entity2') + ', ' + c('entity3') + ').</p>' +
        '<p><b>b)</b> The rules for "what can be loaded onto what" live outside the classes they are about, so the code asks objects for their type and decides for them, instead of asking them to behave. That is a missing use of <b>polymorphism</b>, and it violates the Open-Closed Principle: every new train or load type means editing this loop. ' +
        'Fix: Replace Conditional with Polymorphism — each train subclass overrides ' + c('canLoad(Entity)') + ' (a CargoTrain refuses passengers), and a train can report what it can carry, e.g. ' + c('loadableIds(List<Entity>)') + '. Then extract the remaining loop into a well-named method, so this code becomes one or two lines.</p>',
      must: ['Two correctly named smells', 'Underlying problem: type-based decisions made outside the classes (missing polymorphism)', 'Linked to Open-Closed / extensibility', 'Fix: move canLoad rules into subclasses (Replace Conditional with Polymorphism) and simplify'] },
    { m: 5,
      q: 'The tutor team is building a new Assignment I about a train network. The spec is a draft and the admins may rewrite parts of it later. Mike pushed this code (assume it compiles):' + pre(`
public class Station {
  private String stationID;
  private Coordinate X;
  private Coordinate Y;
  private List<Train> trainInfoList;
  public Station createStation() { ... }
  public void upgradeStation() { ... }
  public void dockTrainsAtStation(List<Train> trains, List<Station> stations) {
    for (Train tr : trains) {
      for (Station st : stations) {
        if (st.equals(tr.getNextStation())) {
            tr.setXLocation(st.getX());
            tr.setYLocation(st.getY());
            tr.processIncomingPassengers();
            trainInfoList.add(new TrainInfo(tr.getName(), tr.getId(), tr.getLocation(),
                new PassengerModule(tr.getPassengers(), tr.getPassengerCount(), st)));
        }
      }
    }
  }
  public void unloadTrains() { ... }
}`) +
        'a) Name and explain one design principle violated by this code. (2 marks)<br>b) Name the most prominent code smell. (1 mark)<br>c) Explain the possible consequences of this smell for future development, with reference to coupling or cohesion. (2 marks)',
      model: '<p><b>a)</b> <b>Single Responsibility Principle</b>: Station creates stations, upgrades them, moves trains, processes passengers and builds reporting objects — many reasons to change. (Also acceptable: Law of Demeter, since it digs through ' + c('tr.getPassengers()') + ' to build a PassengerModule; or encapsulation, as the train’s position is set from outside.)</p>' +
        '<p><b>b)</b> <b>Feature Envy</b>: ' + c('dockTrainsAtStation') + ' is almost entirely about the Train’s data — setting its location, processing its passengers, reading its name, id and passengers.</p>' +
        '<p><b>c)</b> Station is <b>tightly coupled</b> to Train’s internals (how location is stored, how passengers are held). Because the spec may be rewritten, any change to Train — e.g. location becoming a single Position, or passengers moving into carriages — breaks Station too, and similar logic elsewhere (shotgun surgery). Station also has <b>low cohesion</b>, so it becomes a place every team member edits. Fix: move the behaviour to Train, e.g. ' + c('train.arriveAt(station)') + '.</p>',
      must: ['A principle named and explained (SRP / LoD / encapsulation)', 'Feature Envy (or a justified alternative)', 'Consequence tied to coupling or cohesion', 'Linked to the changing spec / future development'] },
    { m: 4,
      q: 'Consider the following inheritance design:' + pre(`
interface Organism {
    public void eat();
    public void sleep();
    public void reproduce();
    public void interact(Organism o);
}
class Dog implements Organism { ... }
class Cat implements Organism { ... }
class Bacteria implements Organism { ... }
class Plant implements Organism { ... }`) +
        'a) What code smell could arise from this design? (1 mark)<br>b) What changes should be made to improve the design? (3 marks)',
      model: '<p><b>a)</b> <b>Refused Bequest</b>: Bacteria and Plant are forced to implement ' + c('sleep') + ', ' + c('eat') + ' and ' + c('interact') + ' even though those make no sense for them, so they will leave them empty or throw ' + c('UnsupportedOperationException') + ' (also an ISP and LSP problem).</p>' +
        '<p><b>b)</b> Apply the <b>Interface Segregation Principle</b>: keep ' + c('Organism') + ' to what every organism genuinely does (' + c('reproduce()') + '), and split the rest into role interfaces such as ' + c('Eater') + ', ' + c('Sleeper') + ', ' + c('Interactive') + '. Dog and Cat implement all of them — ideally via an abstract ' + c('Animal') + ' class holding their shared behaviour; Plant implements ' + c('Organism') + ' and perhaps a ' + c('Photosynthesiser') + '; Bacteria implements only what it does. ' +
        'Code that needs something to sleep now depends only on ' + c('Sleeper') + ', so no class is forced to fake behaviour and every implementation honours its contract.</p>',
      must: ['a) Refused Bequest (or ISP violation)', 'Split into smaller role interfaces (ISP)', 'Organisms implement only what applies; shared animal behaviour in an abstract class', 'Explained why: no empty/throwing methods, substitutability'] }
  ]);

  add(D.SHORT, 'smells', T10, [
    { m: 3,
      q: 'Mark, Bill and Jeff are working on a PetShop application, which can feed, clean and exercise different types of animals. Mark notices that each time he adds a new species, he also has to rewrite all the methods in PetShop so it can take care of the new animal.<br>Identify the code smell(s) and the underlying design problem.',
      model: '<p>Smells: <b>Switch Statements</b> (PetShop’s feed/clean/exercise each branch on the species) and <b>Shotgun Surgery</b> (one new species → edits across every method). PetShop also likely shows <b>Feature Envy</b>, since it holds knowledge that belongs to the animals.</p>' +
        '<p>Underlying problem: an <b>Open-Closed violation</b> caused by missing polymorphism — species-specific behaviour lives in PetShop instead of in the animals. Fix: an ' + c('Animal') + ' abstraction with ' + c('feed()') + ', ' + c('clean()') + ', ' + c('exercise()') + ' overridden per species; PetShop just calls ' + c('animal.feed()') + '. A new species is then one new class.</p>',
      must: ['Named the conditional/type-switch smell (or shotgun surgery)', 'Underlying problem: OCP violation / behaviour in the wrong class', 'Fix with polymorphism on Animal'] },
    { m: 3,
      q: 'Identify the code smells and any underlying design problem.' + pre(`
public class Person {
  private String firstName;
  private String lastName;
  private int age;
  private int birthDay;
  private int birthMonth;
  private int birthYear;
  private String streetAddress;
  private String suburb;
  private String city;
  private String country;
  private int postcode;

  public Person(String firstName, String lastName, int age, int birthDay, int birthMonth,
      int birthYear, String streetAddress, String suburb, String city, String country,
      int postcode) {
    ...
  }
  // Some various methods below
}`),
      model: ul([
        '<b>Long Parameter List</b>: an 11-argument constructor is unreadable and easy to call with arguments in the wrong order (several are adjacent ints or Strings).',
        '<b>Data Clumps</b>: (birthDay, birthMonth, birthYear) and (streetAddress, suburb, city, country, postcode) always travel together. Extract ' + c('Address') + ' and use ' + c('LocalDate') + ' for the date of birth (Introduce Parameter Object / Extract Class).',
        '<b>Primitive Obsession</b>: a date as three ints and a postcode as an int (losing leading zeros, e.g. 0800 in Darwin).',
        '<b>Redundant / derived data</b>: ' + c('age') + ' can be computed from the birth date, and will silently go stale.']) +
        '<p>Underlying problem: Person has low cohesion — it is doing the job of several missing domain classes.</p>',
      must: ['Long parameter list', 'Data clumps → Address and a date object', 'Primitive obsession or redundant age field'] },
    { m: 3,
      q: 'Identify the code smells and any underlying design problem.' + pre(`
public class MathLibrary {
  List<Book> books;

  int sumTitles() {
    int total = 0;
    for (Book b : books) {
      total += b.title.titleLength;
    }
    return total;
  }
}

public class Book {
  Title title; // books are modelled as titles (content doesn't matter)
}

public class Title {
  int titleLength;
  int getTitleLength() { return titleLength; }
  void setTitleLength(int tL) { titleLength = tL; }
}`),
      model: ul([
        '<b>Law of Demeter violation / Message Chain</b>: ' + c('b.title.titleLength') + ' reaches through Book into Title.',
        '<b>Inappropriate Intimacy / broken encapsulation</b>: fields are package-visible and accessed directly, even bypassing Title’s own getter.',
        '<b>Data Class / Lazy Class</b>: Book and Title hold data with no behaviour; Book only wraps a Title.',
        '<b>Feature Envy</b>: sumTitles works on Book and Title’s data rather than its own.']) +
        '<p>Fix: make fields private and give Book a method — ' + c('int titleLength() { return title.getTitleLength(); }') + ' — so MathLibrary only talks to its direct collaborators: ' + c('books.stream().mapToInt(Book::titleLength).sum()') + '. Consider inlining Title into Book if it never gains behaviour.</p>',
      must: ['Law of Demeter / message chain', 'Direct field access breaking encapsulation (or data/lazy class)', 'Fix: private fields + delegate method on Book'] },
    { m: 2,
      q: 'How do code smells cause problems when developing code? Is a code smell <b>always</b> a sign of a design problem?',
      model: '<p>Smells make code harder to understand, change and test: changes ripple (coupling), responsibilities are unclear (cohesion), duplicated logic drifts apart, and every new requirement is more expensive and riskier than it should be.</p>' +
        '<p>Not always. A smell is a <i>hint</i> worth investigating, not proof. A switch in a single factory method, a "middle man" that is a deliberate facade at a module boundary, or a data class used as a DTO can be the right design. Judge it by whether it actually makes likely changes harder.</p>',
      must: ['Concrete effects on development (change ripple, readability, testing)', 'Not always — a smell is a heuristic, with an example of a justified one'] }
  ]);

  add(D.SHORT, 'patterns', PQ, [
    { m: 5,
      q: '“Team Central” lets a project manager create a ticket for a project and add stakeholders who are interested in how it is progressing. Every week the manager posts an update with information on progress and whether the project is On Track, Off Track, At Risk or Complete, and the stakeholders are notified by email. Stakeholders can be added and removed while the project is ongoing.<br>What design pattern could be used to model this? Justify your choice by describing how the scenario relates to the key characteristics of the pattern.',
      model: '<p><b>Observer.</b></p>' + ul([
        '<b>Subject</b>: the ' + c('Ticket') + '. It keeps a list of observers and has ' + c('addStakeholder') + ' (attach), ' + c('removeStakeholder') + ' (detach) and ' + c('postUpdate') + ', which changes its state (latest update, status) and notifies all observers.',
        '<b>Observer interface</b>: ' + c('TicketObserver.update(Ticket t)') + ' (pull) or ' + c('update(Update u)') + ' (push the update text and status).',
        '<b>Concrete observers</b>: ' + c('Stakeholder') + 's, whose ' + c('update') + ' sends them an email.',
        'One-to-many dependency: one ticket, many stakeholders, all notified automatically when its state changes.',
        'Loose coupling and runtime subscription: the ticket only knows the observer interface, stakeholders can join or leave at any time, and new notification types (Slack, SMS) are new observers with no change to Ticket.']),
      must: ['Named Observer', 'Ticket = subject with attach/detach/notify', 'Stakeholders = observers notified on each update', 'One-to-many and runtime add/remove', 'Loose coupling / extensibility'] },
    { m: 4,
      q: 'In a photo-editing app, users can apply enhancements like sharpening, brightness changes or colour filters. These can be combined in any order, and new types of enhancement are frequently added. The core photo logic should not be modified when new enhancements are introduced.<br>What design pattern can be used? Justify your answer with reference to the pattern’s key characteristics.',
      model: '<p><b>Decorator.</b></p>' + ul([
        'Component interface: ' + c('Photo') + ' with ' + c('render()') + ' (or ' + c('getPixels()') + ').',
        'Concrete component: ' + c('BasePhoto') + ' — the core photo logic, never modified.',
        'Abstract decorator: ' + c('Enhancement implements Photo') + ', wrapping a ' + c('Photo') + ' and delegating to it.',
        'Concrete decorators: ' + c('Sharpen') + ', ' + c('Brightness') + ', ' + c('ColourFilter') + ' — each applies its effect to the result of the wrapped photo.',
        'Enhancements stack at runtime in any order (' + c('new Sharpen(new Brightness(photo, +10))') + '), with no subclass per combination; a new enhancement is one new class, satisfying Open-Closed.']),
      must: ['Named Decorator', 'Roles mapped: component, concrete component, decorators', 'Combine in any order at runtime', 'New enhancements without modifying the core (Open-Closed)'] },
    { m: 5,
      q: 'Assignment II gains four new entities — possessor bird, venomous cockroach, potato gnome and phoenix — and each can be produced as a creature of fire, water, earth or air (a fire possessor bird, a water possessor bird, …, a fire cockroach, …).<br>Select the most suitable <b>creational</b> design pattern. Justify your choice by describing the mapping of this domain to the pattern’s key characteristics.',
      model: '<p><b>Abstract Factory.</b></p>' + ul([
        '<b>Abstract factory</b>: ' + c('CreatureFactory') + ' with ' + c('createPossessorBird()') + ', ' + c('createCockroach()') + ', ' + c('createPotatoGnome()') + ', ' + c('createPhoenix()') + '.',
        '<b>Concrete factories</b>: one per element — ' + c('FireCreatureFactory') + ', ' + c('WaterCreatureFactory') + ', ' + c('EarthCreatureFactory') + ', ' + c('AirCreatureFactory') + '. Each element is a <i>family</i>.',
        '<b>Abstract products</b>: ' + c('PossessorBird') + ', ' + c('Cockroach') + ', ' + c('PotatoGnome') + ', ' + c('Phoenix') + '; concrete products such as ' + c('FirePossessorBird') + '.',
        'Game code is given one factory and never names concrete classes, so creatures of one element are created consistently (e.g. a fire level spawns only fire creatures), and a new element is one new factory with no change to client code.',
        'Alternative worth mentioning: if elements only change data (damage type, resistances), the element can be a field/strategy instead of 16 classes — but as a creational choice for families, Abstract Factory fits.']),
      must: ['Named Abstract Factory', 'Elements as families → one concrete factory each', 'Creature kinds as products → one create method each', 'Client decoupled from concrete classes; consistency within a family', 'Extensibility (new element = new factory)'] }
  ]);

  add(D.SHORT, 'async', PQ, [
    { m: 4,
      q: 'In an online multiplayer game, players defeat monsters to earn gold, and each monster should be defeated by only one player. But when many players attack one monster at once, occasionally two players defeat it at the same time and both gain gold — and players are now running multiple accounts to exploit this.<br>With reference to a design pattern and any other course concepts, explain what causes this issue and how you might prevent it.',
      model: '<p><b>Cause: a race condition.</b> Each attack runs on its own thread and does a <i>check-then-act</i> on shared monster state:</p>' +
        pre(`
if (!monster.isDefeated()) {     // both threads see false
    monster.setDefeated(true);
    player.addGold(monster.getGold());
}`) +
        '<p>Two threads interleave between the check and the act, both see "not defeated", and both award the gold.</p>' +
        '<p><b>Prevention:</b> make defeat-and-reward atomic for each monster — a ' + c('synchronized') + ' ' + c('Monster.tryDefeat(Player p)') + ' method (or a lock per monster), or an ' + c('AtomicBoolean') + ' with ' + c('compareAndSet(false, true)') + ', so exactly one thread wins. ' +
        'Design pattern: if rewards go through a shared <b>Singleton</b> (e.g. a ' + c('GoldBank') + ' / ' + c('RewardManager') + '), its ' + c('getInstance') + ' and reward methods must themselves be thread-safe — a lazily initialised singleton can even create two managers under the same race. ' +
        'Alternatively, use the <b>Observer</b> pattern: the monster notifies its observers (the reward system) exactly once, from inside the synchronized defeat, instead of each attacker deciding it won.</p>',
      must: ['Identified a race condition / check-then-act on shared state', 'Described the interleaving that pays twice', 'A correct fix: synchronized / lock / atomic compare-and-set', 'Referenced a pattern sensibly (thread-safe Singleton, or Observer notified once)'] }
  ]);

  /* ======================== architecture answers ========================= */

  add(D.ARCH, 'styles', T10, [
    { m: 3,
      q: 'Describe a scenario where a serverless function would be used to handle user-submitted form data.',
      model: '<p>A website’s contact or registration form posts to an API gateway endpoint, which triggers a function. The function validates the fields, writes the submission to a managed database (e.g. DynamoDB), and publishes an event or calls an email service to send a confirmation. It then returns a success or error response and exits.</p>' +
        '<p>Why serverless fits: submissions are infrequent and unpredictable, each one is short and stateless, there are no servers to run between submissions, and cost is per submission.</p>',
      must: ['Trigger: HTTP request via an API gateway', 'Function validates and stores in a managed store (stateless)', 'Why it fits: sporadic, short, pay per use'] },
    { m: 3,
      q: 'How could a serverless architecture be used to support an image-upload feature on a website?',
      model: '<p>The client asks a small function for a pre-signed upload URL and uploads the image straight to object storage (e.g. S3), so the file never passes through an application server. The storage service emits an "object created" event, which triggers a resize function (thumbnails), and possibly others in parallel (content moderation, metadata extraction). They write results back to storage and update a database record the site reads.</p>' +
        '<p>Benefits: scales automatically with upload bursts, costs nothing when idle, and each step is a small, independent function. Watch for execution-time limits on very large images, and cold starts (acceptable, as processing is in the background).</p>',
      must: ['Upload to object storage (ideally via pre-signed URL)', 'Storage event triggers processing functions', 'Results stored / database updated', 'A benefit or limitation'] },
    { m: 3,
      q: 'Explain how serverless functions could be used in an IoT health-monitoring system.',
      model: '<p>Wearables send readings (heart rate, oxygen) to an IoT gateway or message stream. Each batch of messages triggers a function that validates and normalises the data and stores it in a time-series database. Another function evaluates rules (e.g. heart rate above a threshold for 5 minutes) and, on a match, publishes an alert event that triggers a notification function to text a carer or clinician. Scheduled functions produce daily summaries.</p>' +
        '<p>Serverless absorbs bursty traffic from thousands of devices without provisioning servers. Concerns: cold-start latency for urgent alerts (mitigate with provisioned concurrency), statelessness (rules needing history must query the store), and the security and privacy of health data.</p>',
      must: ['Device data stream triggers ingestion functions', 'Rule-evaluation function generates alert events → notification function', 'Scalability benefit', 'A relevant concern (latency for alerts, state, privacy)'] },
    { m: 3,
      q: 'Why is a serverless approach useful for sending notifications in real-time chat or messaging applications?',
      model: '<p>Each new message is an event (a database write, or a message on a queue) that triggers a short notification function, which looks up the recipients’ devices and sends push notifications. Notification load is extremely spiky — a busy group chat or a viral moment can create bursts of thousands per second, then near-silence — and serverless scales out instantly per event and back to zero, charging only per notification. The notification logic stays decoupled from the chat service, and functions are small and stateless. The live connections themselves (websockets) are usually handled by a managed service, since functions cannot hold long connections.</p>',
      must: ['Message event triggers a notification function', 'Spiky load → automatic scaling and pay per use', 'Decoupling / statelessness, or the websocket caveat'] },
    { m: 3,
      q: 'In what way can serverless functions improve scalability for an e-commerce site during high-traffic periods like Black Friday?',
      model: '<p>Functions scale horizontally and automatically with the number of events: if checkout requests jump from 50 to 50,000 a minute, the provider runs that many concurrent instances, with no capacity planning or pre-provisioned servers. Bursty, independent tasks — order confirmation emails, payment webhooks, inventory updates, invoice PDFs, image resizing — can each run as functions triggered by events or queues, so a spike in one does not starve the others, and queues absorb peaks. After the sale, capacity drops back and cost falls with it.</p>' +
        '<p>Caveats: downstream databases must also scale (or be protected by queues), concurrency limits apply, and cold starts may affect latency-sensitive endpoints unless capacity is pre-warmed.</p>',
      must: ['Automatic horizontal scaling per event', 'Example tasks offloaded to functions/queues', 'Scale back down / pay per use', 'A caveat (database bottleneck, limits, cold starts)'] },
    { m: 3,
      q: 'Your team is experiencing tight coupling between features in a layered monolith and wants to increase maintainability <b>without</b> splitting into microservices. What architecture should you consider, and why?',
      model: '<p>A <b>modular monolith</b>. Re-partition the code by business domain (e.g. Orders, Catalogue, Accounts) instead of by technical layer, with each module owning its own logic and data access and exposing a small public interface; other modules may only use that interface (enforced by package visibility or architecture tests).</p>' +
        '<p>Why: features are then contained in one module, so changes stop rippling across layers that every feature shares — higher cohesion, lower coupling and clearer ownership. It keeps one deployment unit, one process and in-process calls, so none of the operational cost of microservices, and the modules can be extracted into services later if needed.</p>',
      must: ['Chose modular monolith', 'Domain partitioning with module boundaries/interfaces', 'Improves cohesion/coupling and maintainability', 'Keeps a single deployment (no microservices overhead)'] },
    { m: 3,
      q: 'A logistics company wants components like route planning, delivery updates and notifications to react automatically and asynchronously to order events. What architectural style supports this best?',
      model: '<p><b>Event-driven architecture.</b> The order service publishes events such as ' + c('OrderCreated') + ', ' + c('OrderPacked') + ' and ' + c('DeliveryDelayed') + ' to a broker; route planning, delivery tracking and notifications subscribe and react independently and asynchronously.</p>' +
        '<p>Producers do not know their consumers, so components are loosely coupled and a new consumer (e.g. analytics) can be added without changing existing ones. Each consumer scales on its own and failures are isolated: if notifications are down, events queue up and are processed later. Trade-offs: eventual consistency, and harder tracing and error handling — a broker topology suits simple reactions, a mediator suits ordered workflows.</p>',
      must: ['Chose event-driven', 'Order events published, components subscribe and react asynchronously', 'Loose coupling / easy to add consumers', 'A trade-off or topology note'] },
    { m: 3,
      q: 'A product needs to scale a high-traffic search service independently of the rest of the application. Which architecture should be used, and what design consideration does this highlight?',
      model: '<p><b>Microservices</b> (at least extracting search as its own service). Search becomes an independently deployable service with its own data store (e.g. a search index), so it can run many replicas behind a load balancer while the rest of the app stays small.</p>' +
        '<p>Design consideration: <b>service granularity and boundaries</b> should follow differences in architectural characteristics — here, scalability. Separate a component when it needs to scale, deploy or fail independently. This also raises data ownership (the index is kept in sync through events from the catalogue service) and the costs of network calls and eventual consistency.</p>',
      must: ['Chose microservices / extract search as a service', 'Independent scaling with its own data store', 'Design consideration: granularity driven by characteristics (scalability)', 'Data synchronisation or distribution cost noted'] }
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
