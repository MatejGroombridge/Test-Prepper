/* subjects/comp2511-written.js — COMP2511 final exam, written banks.
   SHORT  Section 2 short answers by topic: { q, m, model, must }
   ARCH   Section 4 architecture short answers: { q, m, model, must }
   SEQ    Section 4 sequence diagrams (mermaid): { q, model, must, notes } */
(function (global) {
  'use strict';

  var D = global.COMP2511Data;
  var pre = D.pre, c = D.c;

  function ul(items) { return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>'; }

  D.SHORT = {
    /* ---------------------------------------------------------------- */
    oo: [
      { m: 3,
        q: 'What does the following program print? With reference to static and dynamic polymorphism, explain your answer.' + pre(`
class Printer {
    void print(Object o) { System.out.println("Printer:Object"); }
    void print(String s) { System.out.println("Printer:String"); }
}
class FancyPrinter extends Printer {
    @Override
    void print(Object o) { System.out.println("Fancy:Object"); }
}
class App {
    public static void main(String[] args) {
        Printer p = new FancyPrinter();
        Object o = "hello";
        p.print(o);
        p.print("hello");
    }
}`),
        model: '<p>It prints <b>Fancy:Object</b> then <b>Printer:String</b>.</p>' +
          '<p>Choosing <i>which overload</i> is static polymorphism and happens at compile time, from the declared types. ' +
          'In ' + c('p.print(o)') + ', ' + c('o') + ' is declared ' + c('Object') + ', so the compiler picks ' + c('print(Object)') + '. ' +
          'In ' + c('p.print("hello")') + ' the argument is a ' + c('String') + ', so it picks ' + c('print(String)') + '.</p>' +
          '<p>Choosing <i>which body</i> of that method runs is dynamic polymorphism and happens at runtime, from the object’s actual class. ' +
          c('p') + ' refers to a ' + c('FancyPrinter') + ', which overrides ' + c('print(Object)') + ' (giving "Fancy:Object") but does not override ' + c('print(String)') + ', so the inherited Printer version runs.</p>',
        must: ['Both lines of output, in order', 'Overload chosen at compile time from the declared (static) type of the argument',
               'Override chosen at runtime from the actual class of p (dynamic dispatch)', 'Noted that FancyPrinter does not override print(String)'] },
      { m: 4,
        q: 'A developer writes ' + c('class Stack<E> extends ArrayList<E>') + ' and adds ' + c('push') + ' and ' + c('pop') + ' methods.' +
          '<br>a) Explain why this is a poor use of inheritance. (2 marks)<br>b) Describe a better design and why it is better. (2 marks)',
        model: '<p><b>a)</b> A stack is not an ArrayList: inheritance is meant for "is-a" relationships where the child can be used anywhere the parent is. ' +
          'Here Stack inherits every public ArrayList method — ' + c('add(int, E)') + ', ' + c('remove(int)') + ', ' + c('set') + ', ' + c('get') + ' — so clients can insert into the middle and break the LIFO invariant. ' +
          'It also couples Stack to ArrayList’s implementation (fragile base class): changes in the parent can break the child.</p>' +
          '<p><b>b)</b> Use composition: Stack has a private ' + c('List<E>') + ' field and exposes only ' + c('push') + ', ' + c('pop') + ', ' + c('peek') + ', ' + c('isEmpty') + ', delegating to the list. ' +
          'The invariant is now enforced, the public interface is minimal, and the backing list can be swapped (e.g. for a LinkedList) without affecting clients.</p>',
        must: ['Stack is not substitutable for ArrayList / not a true is-a', 'Inherited methods let clients break the LIFO invariant',
               'Proposed composition: private list field + delegation', 'Explained the benefit: encapsulation and/or freedom to change the implementation'] },
      { m: 3,
        q: c('Point') + ' has fields ' + c('x, y') + '. ' + c('ColourPoint extends Point') + ' adds ' + c('colour') + '. Both implement ' + c('equals') + ' using ' + c('instanceof') + ' and compare all of their own fields.' +
          '<br>Explain, with an example, which property of ' + c('equals') + ' this breaks, and how to fix it.',
        model: '<p>It breaks <b>symmetry</b>. Let ' + c('p = new Point(1, 2)') + ' and ' + c('cp = new ColourPoint(1, 2, RED)') + '. ' +
          c('p.equals(cp)') + ' is true: ' + c('cp instanceof Point') + ' holds and x, y match. But ' + c('cp.equals(p)') + ' is false: ' + c('p instanceof ColourPoint') + ' fails. ' +
          'Equality must be symmetric, so collections behave unpredictably (e.g. ' + c('list.contains') + ' depends on argument order).</p>' +
          '<p>Fix: compare ' + c('getClass() != obj.getClass()') + ' so only objects of the exact same class can be equal (and override ' + c('hashCode') + ' consistently). ' +
          'Alternatively favour composition: ColourPoint <i>has</i> a Point rather than extending it.</p>',
        must: ['Named symmetry', 'Concrete example where a.equals(b) differs from b.equals(a)', 'Fix with getClass() comparison (or composition)'] }
    ],

    /* ---------------------------------------------------------------- */
    dbc: [
      { m: 4,
        q: 'Is this valid inheritance? Conceptually justify your answer.' + pre(`
public class BankAccount {
    /** @invariant balance >= 0 */
    protected double balance;

    /**
     * @precondition  amount > 0 && amount <= balance
     * @postcondition balance == old(balance) - amount
     */
    public void withdraw(double amount) { ... }
}

public class OverdraftAccount extends BankAccount {
    private double limit = 500;

    /**
     * @precondition  amount > 0 && amount <= balance + limit
     * @postcondition balance == old(balance) - amount
     */
    @Override
    public void withdraw(double amount) { ... }
}`),
        model: '<p><b>No</b>, it is not valid inheritance, even though the method contract on its own is fine.</p>' +
          '<p>The precondition is <i>weakened</i> (it accepts every amount the parent accepts, and more), which is allowed. The postcondition is unchanged, which is allowed.</p>' +
          '<p>However, the parent’s <b>class invariant</b> ' + c('balance >= 0') + ' is broken: withdrawing more than the balance leaves a negative balance. ' +
          'A subclass must maintain its parent’s invariants, because clients of BankAccount rely on them (e.g. code that assumes a non-negative balance). ' +
          'So OverdraftAccount is not substitutable for BankAccount (LSP violation). A fix is to model both as siblings under an abstract Account with the weaker invariant ' + c('balance >= -limit') + '.</p>',
        must: ['Correct verdict (not valid)', 'Precondition weakened → allowed', 'Postcondition unchanged → allowed',
               'Invariant balance >= 0 is broken → violates LSP', 'Linked to substitutability for clients of the parent'] },
      { m: 4,
        q: 'Is this valid inheritance? Conceptually justify your answer.' + pre(`
public class Courier {
    /**
     * @precondition  0 < weightKg && weightKg <= 30
     * @postcondition returns a cost >= 5.00
     */
    public double quote(double weightKg) { ... }
}

public class ExpressCourier extends Courier {
    /**
     * @precondition  0 < weightKg && weightKg <= 50
     * @postcondition returns a cost >= 12.00
     */
    @Override
    public double quote(double weightKg) { ... }
}`),
        model: '<p><b>Yes</b>, this is valid inheritance.</p>' +
          '<p>The precondition is <i>weakened</i>: every weight in (0, 30] is also in (0, 50], so any client call that was legal for Courier is still legal for ExpressCourier.</p>' +
          '<p>The postcondition is <i>strengthened</i>: a cost of at least 12.00 is also at least 5.00, so ExpressCourier still delivers everything Courier promised.</p>' +
          '<p>Weaker-or-equal preconditions and stronger-or-equal postconditions mean ExpressCourier can be substituted anywhere a Courier is expected, satisfying the Liskov Substitution Principle.</p>',
        must: ['Correct verdict (valid)', 'Precondition weakened, with the reason that is safe', 'Postcondition strengthened, with the reason that is safe', 'Tied to LSP / substitutability'] },
      { m: 4,
        q: 'Is this valid inheritance? Conceptually justify your answer.' + pre(`
public class Playlist {
    /**
     * @precondition  song != null
     * @postcondition song is added to the end of the playlist
     */
    public void add(Song song) { ... }
}

public class KidsPlaylist extends Playlist {
    /**
     * @precondition  song != null && !song.isExplicit()
     * @postcondition song is added to the end of the playlist
     */
    @Override
    public void add(Song song) { ... }
}`),
        model: '<p><b>No.</b> KidsPlaylist <i>strengthens</i> the precondition: it rejects explicit songs that Playlist accepts.</p>' +
          '<p>A client written against Playlist may legally add an explicit song. If it is handed a KidsPlaylist, that call now violates the contract, so KidsPlaylist cannot be substituted for Playlist (LSP violation), even though "a kids playlist is a playlist" sounds like a natural is-a.</p>' +
          '<p>Fix: make the filtering rule part of the parent’s contract (e.g. ' + c('add') + ' returns false or throws a documented exception when a song is rejected by a policy), or use composition with a content-filter strategy rather than inheritance.</p>',
        must: ['Correct verdict (not valid)', 'Identified the precondition is strengthened', 'Explained the failing client scenario', 'Suggested a fix (contract change or composition)'] },
      { m: 3,
        q: 'Compare <b>Design by Contract</b> with <b>defensive programming</b>. Give one advantage of each.',
        model: '<p>In Design by Contract, responsibility is split: the <i>client</i> guarantees the preconditions, and the supplier, trusting them, guarantees the postconditions and invariants. The supplier does not re-check its inputs.</p>' +
          '<p>In defensive programming, the <i>supplier</i> checks every input itself and handles bad input (throws, returns an error), trusting no caller.</p>' +
          '<p>DbC advantage: simpler, faster supplier code with no duplicated checks, and documented contracts that make responsibilities explicit and inheritance rules (LSP) checkable. ' +
          'Defensive advantage: robust at trust boundaries (public APIs, user input), since a buggy or malicious caller cannot corrupt state.</p>',
        must: ['DbC: client responsible for preconditions', 'Defensive: supplier checks everything', 'One valid advantage of each'] }
    ],

    /* ---------------------------------------------------------------- */
    principles: [
      { m: 4,
        q: 'Priya leads eight developers building a food-delivery app. Each developer works on a separate feature and knows little about the rest of the codebase, and the client changes requirements often. ' +
          'A developer submits a ' + c('PaymentProcessor') + ' that calls directly into the internals of nine other classes (reading their fields, calling helper methods), and that also formats receipts and sends marketing emails.' +
          '<br>a) Describe the difference between coupling and cohesion. (2 marks)<br>b) With explicit reference to Priya’s team, explain why merging this class may cause maintenance problems. (2 marks)',
        model: '<p><b>a)</b> <i>Coupling</i> is the degree to which one module depends on others: tightly coupled modules know about each other’s internals, so changes ripple between them. ' +
          '<i>Cohesion</i> is the degree to which the contents of one module belong together and serve a single purpose. Good design aims for low coupling and high cohesion.</p>' +
          '<p><b>b)</b> PaymentProcessor is <i>highly coupled</i> (it depends on the internals of nine classes) and has <i>low cohesion</i> (payments, receipts and marketing). ' +
          'Because each developer only knows their own feature, a teammate changing one of those nine classes will not realise they are breaking payments. ' +
          'With frequent requirement changes, this happens often, and a change to marketing emails forces edits to the payment code. ' +
          'Eight people editing one unfocused class also means merge conflicts. Bugs become likely and changes slow.</p>',
        must: ['Correct definition of coupling', 'Correct definition of cohesion', 'Identified this class as high coupling and low cohesion',
               'Linked to the team: developers lack knowledge of other areas / frequent requirement changes ripple'] },
      { m: 3,
        q: 'Explain which design principle this code violates, and how you would fix it.' + pre(`
public class ShippingService {
    public double cost(Order order) {
        String postcode = order.getCustomer().getAddress().getPostcode();
        return postcode.startsWith("2") ? 10.0 : 15.0;
    }
}`),
        model: '<p>It violates the <b>Law of Demeter</b> (principle of least knowledge): ShippingService talks to a "stranger" — the Address, obtained via Order then Customer — rather than only to its immediate collaborators. ' +
          'ShippingService is now coupled to the structure of Order, Customer and Address; if Customer stores addresses differently, ShippingService breaks.</p>' +
          '<p>Fix: give Order a method that answers the question, e.g. ' + c('order.getDeliveryPostcode()') + ' (which asks the customer, which asks its address), or better, pass the ShippingService only the data it needs: ' + c('cost(String postcode)') + '.</p>',
        must: ['Named the Law of Demeter', 'Explained the coupling to the chain of classes', 'A concrete fix (delegate method or pass the needed data)'] },
      { m: 4,
        q: 'Explain which SOLID principle this code violates, refactor it (in code or in words), and give one concrete benefit of your refactoring.' + pre(`
public class NotificationService {
    private SmtpEmailSender sender = new SmtpEmailSender("smtp.unsw.edu.au");

    public void notifyUser(User user, String msg) {
        sender.sendEmail(user.getEmail(), msg);
    }
}`),
        model: '<p>It violates the <b>Dependency Inversion Principle</b>: a high-level policy (notify a user) depends directly on a low-level concrete detail (an SMTP sender it constructs itself).</p>' +
          pre(`
public interface MessageSender {
    void send(User user, String msg);
}
public class SmtpEmailSender implements MessageSender { ... }

public class NotificationService {
    private final MessageSender sender;
    public NotificationService(MessageSender sender) { this.sender = sender; }

    public void notifyUser(User user, String msg) {
        sender.send(user, msg);
    }
}`) +
          '<p>Benefits: unit tests can inject a fake sender rather than sending real email; SMS or push senders can be added without modifying NotificationService (also satisfying Open-Closed).</p>',
        must: ['Named DIP', 'Introduced an abstraction (interface) that both depend on', 'Injected the dependency (constructor) instead of constructing it', 'A concrete benefit (testing or extensibility)'] },
      { m: 3,
        q: 'Explain the <b>Interface Segregation Principle</b> using this example, and show how to fix it.' + pre(`
public interface Worker {
    void work();
    void eat();
    void sleep();
}
public class Robot implements Worker {
    public void work() { ... }
    public void eat()   { throw new UnsupportedOperationException(); }
    public void sleep() { throw new UnsupportedOperationException(); }
}`),
        model: '<p>ISP says clients should not be forced to depend on methods they do not use. Worker is a "fat" interface: Robot must implement ' + c('eat') + ' and ' + c('sleep') + ', which make no sense for it, and does so by throwing — a trap for callers (and an LSP violation).</p>' +
          '<p>Fix: split into role interfaces ' + c('Workable { work(); }') + ', ' + c('Feedable { eat(); }') + ', ' + c('Restable { sleep(); }') + '. ' + c('Human') + ' implements all three; ' + c('Robot') + ' implements only ' + c('Workable') + '. Code that schedules work depends only on Workable.</p>',
        must: ['Stated ISP', 'Explained why Robot’s throwing methods are a problem', 'Split into smaller role interfaces'] },
      { m: 4,
        q: 'Explain the <b>Open-Closed Principle</b>. Using the following code as an example, explain how it is violated and how you would fix it.' + pre(`
public double area(Shape s) {
    if (s.getType().equals("circle"))    return Math.PI * s.getR() * s.getR();
    if (s.getType().equals("rectangle")) return s.getW() * s.getH();
    if (s.getType().equals("triangle"))  return 0.5 * s.getW() * s.getH();
    throw new IllegalArgumentException();
}`),
        model: '<p>OCP: software entities should be <i>open for extension</i> but <i>closed for modification</i> — you should be able to add behaviour by adding code, not by editing working code.</p>' +
          '<p>Here, adding a hexagon means editing this method (and any other method that switches on ' + c('getType()') + '), risking breaking existing shapes. Shape also carries fields (r, w, h) that only some types use.</p>' +
          '<p>Fix: Replace Conditional with Polymorphism. Make ' + c('Shape') + ' an interface (or abstract class) with ' + c('double area()') + ', implemented by ' + c('Circle') + ', ' + c('Rectangle') + ' and ' + c('Triangle') + ', each holding only its own fields. ' +
          'Callers just call ' + c('s.area()') + '. A new shape is a new class; nothing existing changes.</p>',
        must: ['Correct statement of OCP', 'Explained why adding a type forces modification', 'Polymorphic fix: area() on each shape subclass'] }
    ],

    /* ---------------------------------------------------------------- */
    java: [
      { m: 3,
        q: 'Explain the difference between <b>checked</b> and <b>unchecked</b> exceptions in Java, and when you would use each in your own API.',
        model: '<p><i>Checked</i> exceptions extend ' + c('Exception') + ' but not ' + c('RuntimeException') + '. The compiler forces callers to catch them or declare them with ' + c('throws') + '. ' +
          '<i>Unchecked</i> exceptions extend ' + c('RuntimeException') + ' (or ' + c('Error') + ') and need not be declared or caught.</p>' +
          '<p>Use a checked exception for recoverable conditions the caller should reasonably expect and handle, which are outside its control (file not found, network failure, insufficient funds in a domain API). ' +
          'Use an unchecked exception for programming errors and broken preconditions (null argument, index out of range, illegal state), where the fix is to correct the calling code.</p>',
        must: ['Checked: compiler-enforced catch/declare; extends Exception', 'Unchecked: extends RuntimeException; not enforced', 'Sensible guidance on when to use each'] },
      { m: 4,
        q: 'a) Write the signature of a static method ' + c('sum') + ' that adds up the values in a list of any numeric type — it must accept ' + c('List<Integer>') + ' and ' + c('List<Double>') + '. (1 mark)' +
          '<br>b) Explain why the parameter type ' + c('List<Number>') + ' would not work, even though ' + c('Integer') + ' is a subtype of ' + c('Number') + '. (3 marks)',
        model: '<p><b>a)</b> ' + c('public static double sum(List<? extends Number> values)') + ' (or the generic form ' + c('static <T extends Number> double sum(List<T> values)') + '), using ' + c('n.doubleValue()') + ' inside.</p>' +
          '<p><b>b)</b> Java generics are <i>invariant</i>: ' + c('List<Integer>') + ' is not a subtype of ' + c('List<Number>') + '. ' +
          'If it were, this would compile: ' + c('List<Number> nums = intList; nums.add(3.5);') + ' — putting a Double into a list of Integers and breaking type safety at runtime. ' +
          'The wildcard ' + c('? extends Number') + ' allows any list of a Number subtype, and the compiler then forbids adding to it (except null), so reading Numbers out is safe.</p>',
        must: ['Correct signature with ? extends Number (or bounded T)', 'Generics are invariant', 'Explained the type-safety problem (adding a Double)', 'Why the wildcard is safe (read-only)'] },
      { m: 3,
        q: 'You are about to refactor a large class you did not write. Explain the role of tests in this process, and what makes a good regression test.',
        model: '<p>Refactoring must preserve behaviour, so before touching the code you need tests that pin down its current behaviour (if they do not exist, write characterisation tests first). ' +
          'Run them after every small step: green means behaviour preserved, red pinpoints the step that broke it.</p>' +
          '<p>A good regression test exercises behaviour through the public interface (not private details, which you are about to change), covers normal and edge cases, is deterministic, fast and independent of other tests, and asserts specific outcomes.</p>',
        must: ['Tests establish behaviour is preserved', 'Write/run tests before and after small steps', 'Test through the public interface, not internals', 'At least one other quality: deterministic, independent, edge cases'] }
    ],

    /* ---------------------------------------------------------------- */
    fp: [
      { m: 3,
        q: 'Rewrite the following using the Java Streams API, and explain one advantage of your version.' + pre(`
List<String> result = new ArrayList<>();
for (Student s : students) {
    if (s.getWam() >= 75) {
        result.add(s.getZid());
    }
}
Collections.sort(result);`),
        model: pre(`
List<String> result = students.stream()
        .filter(s -> s.getWam() >= 75)
        .map(Student::getZid)
        .sorted()
        .toList();`) +
          '<p>Advantage: it is declarative — it says <i>what</i> (filter, map, sort) rather than <i>how</i> (loop, mutate a list), so intent is clearer and there is no mutable accumulator to get wrong. ' +
          'Each step is a small pure function, easily changed, and the pipeline can be parallelised with ' + c('parallelStream()') + '.</p>',
        must: ['filter with the correct predicate', 'map to the zID (lambda or method reference)', 'sorted and a terminal collect/toList', 'A valid advantage'] },
      { m: 3,
        q: 'What is the value of ' + c('out') + '? Explain how the pipeline is evaluated.' + pre(`
Map<Boolean, Long> out = Stream.of("cat", "horse", "ox", "zebra", "emu")
        .map(String::length)
        .collect(Collectors.partitioningBy(n -> n > 3,
                                           Collectors.counting()));`),
        model: '<p>' + c('{false=3, true=2}') + '.</p>' +
          '<p>The lengths are 3, 5, 2, 5, 3. ' + c('partitioningBy') + ' splits them by the predicate ' + c('n > 3') + ': true for 5 and 5 (2 items), false for 3, 2 and 3 (3 items), and the downstream ' + c('counting()') + ' collector counts each partition. ' +
          'Streams are lazy: nothing happens until the terminal ' + c('collect') + ', which pulls each element through ' + c('map') + ' and into the collector one at a time.</p>',
        must: ['Correct result {false=3, true=2}', 'Explained partitioningBy + counting', 'Mentioned laziness / terminal operation drives evaluation'] }
    ],

    /* ---------------------------------------------------------------- */
    smells: [
      { m: 5,
        q: 'Identify two code smells in the following code, and explain how you would resolve each.' + pre(`
public double calculateFee(Vehicle v, int hours) {
    double fee = 0;
    if (v.getType().equals("car")) {
        fee = hours * 4.0;
        if (fee > 30) fee = 30;
    } else if (v.getType().equals("motorbike")) {
        fee = hours * 2.0;
        if (fee > 15) fee = 15;
    } else if (v.getType().equals("truck")) {
        fee = hours * 9.0;
        if (fee > 60) fee = 60;
    }
    if (v.getOwner().getMembership().getLevel().equals("gold")) {
        fee = fee * 0.8;
    }
    return fee;
}`),
        model: '<p><b>1. Switch statements / type code</b> (also an OCP violation): behaviour is chosen with an if-chain on a string type, and every new vehicle type means editing this method (and probably others like it). The rate-and-cap logic is also duplicated three times. ' +
          '<i>Fix:</i> Replace Conditional with Polymorphism — give ' + c('Vehicle') + ' subclasses (or a rate strategy per type) a ' + c('fee(hours)') + ' method; the shared "rate × hours capped at max" can live once in an abstract parent with the rate and cap supplied by each subclass.</p>' +
          '<p><b>2. Message chain / Law of Demeter</b>: ' + c('v.getOwner().getMembership().getLevel()') + ' couples this method to three classes’ structure. ' +
          '<i>Fix:</i> Hide Delegate — ask ' + c('v.getOwner().discountRate()') + ' or better pass the discount in, so the membership logic lives with Membership.</p>' +
          '<p>Other valid answers: magic numbers (rates, caps, 0.8 → named constants); primitive obsession (type as a String → enum or class).</p>',
        must: ['First smell named and located', 'Concrete refactoring for the first smell', 'Second smell named and located', 'Concrete refactoring for the second smell', 'Fixes actually remove the smell (e.g. polymorphism, not a bigger switch)'] },
      { m: 4,
        q: 'Identify two code smells in this method and explain how you would refactor them.' + pre(`
public class Invoice {
    private Customer customer;
    private List<Item> items;

    public String print() {
        String out = customer.getFirstName() + " " + customer.getLastName() + "\\n";
        out += customer.getStreet() + ", " + customer.getSuburb() + " "
             + customer.getPostcode() + "\\n";
        double total = 0;
        for (Item i : items) {
            out += i.getName() + " " + i.getQty() * i.getUnitPrice() + "\\n";
            total += i.getQty() * i.getUnitPrice();
        }
        if (total > 100) total = total * 0.95;
        out += "Total: " + (total * 1.1);
        return out;
    }
}`),
        model: '<p><b>Feature envy</b>: ' + c('print') + ' uses five getters on Customer to build a name and address, and computes each line total from Item’s fields. ' +
          'Fix: Move Method — ' + c('customer.mailingLabel()') + ' and ' + c('item.lineTotal()') + ' put the logic with the data (and remove the duplicated ' + c('qty * unitPrice') + ').</p>' +
          '<p><b>Long method / low cohesion</b>: one method formats the header, the lines, applies a discount rule and tax. Fix: Extract Method — ' + c('subtotal()') + ', ' + c('applyDiscount()') + ', ' + c('withGst()') + ' — so each rule can change and be tested alone.</p>' +
          '<p>Also valid: magic numbers (100, 0.95, 1.1 → named constants like ' + c('GST_RATE') + '); data clumps (street, suburb, postcode → an Address class).</p>',
        must: ['First smell correctly named', 'Fix for the first smell', 'Second smell correctly named', 'Fix for the second smell'] },
      { m: 3,
        q: 'Distinguish <b>Divergent Change</b> from <b>Shotgun Surgery</b>, giving an example of each.',
        model: '<p><b>Divergent Change</b>: one class is changed for many different reasons. E.g. ' + c('Employee') + ' must be edited when tax rules change, when the database schema changes and when the payslip layout changes. Fix: Extract Class so each reason to change has its own class (SRP).</p>' +
          '<p><b>Shotgun Surgery</b>: one reason to change forces small edits in many classes. E.g. changing the GST rate means editing ' + c('Invoice') + ', ' + c('Cart') + ', ' + c('Refund') + ' and ' + c('Report') + '. Fix: Move Method/Field so the logic lives in one place (a ' + c('TaxPolicy') + ').</p>' +
          '<p>They are mirror images: many reasons → one class versus one reason → many classes.</p>',
        must: ['Divergent change definition + example', 'Shotgun surgery definition + example', 'Contrast (mirror images) or appropriate fixes'] }
    ],

    /* ---------------------------------------------------------------- */
    patterns: [
      { m: 3,
        q: 'A café ordering system sells drinks. Customers can add any combination of extras — extra shot, oat milk, caramel syrup, whipped cream — and each extra changes the price and the description on the receipt. New extras are added every season.' +
          '<br>Give the most appropriate design pattern. Justify your choice by mapping this domain to the key characteristics of the pattern.',
        model: '<p><b>Decorator.</b></p>' + ul([
          'Component interface: ' + c('Drink') + ' with ' + c('cost()') + ' and ' + c('description()') + '.',
          'Concrete components: ' + c('Espresso') + ', ' + c('Tea') + ' — the base drink.',
          'Abstract decorator: ' + c('ExtraDecorator implements Drink') + ' and holds a wrapped ' + c('Drink') + '.',
          'Concrete decorators: ' + c('ExtraShot') + ', ' + c('OatMilk') + '… each delegates to the wrapped drink and adds its own price and text.',
          'Extras are stacked at runtime in any combination (' + c('new OatMilk(new ExtraShot(new Espresso()))') + '), avoiding a subclass for every combination; a new seasonal extra is one new class (Open-Closed).']),
        must: ['Named Decorator', 'Mapped component/concrete component/decorator roles to the domain', 'Runtime combination without class explosion', 'Extensibility for new extras'] },
      { m: 3,
        q: 'A smart-home hub reads a temperature sensor. When the temperature changes, the wall display, the phone app and the air-conditioning controller must all react. Users can add or remove devices at any time.' +
          '<br>Give the most appropriate design pattern and justify it by mapping the domain to the pattern’s key characteristics.',
        model: '<p><b>Observer.</b></p>' + ul([
          'Subject: the ' + c('TemperatureSensor') + ', which keeps a list of observers and has ' + c('attach') + ', ' + c('detach') + ', ' + c('notifyObservers') + '.',
          'Observer interface: ' + c('TemperatureObserver.update(double temp)') + ' (push) or ' + c('update(TemperatureSensor s)') + ' (pull).',
          'Concrete observers: ' + c('WallDisplay') + ', ' + c('PhoneApp') + ', ' + c('AirconController') + '.',
          'On each change the sensor notifies every registered observer, without knowing their concrete classes: a one-to-many dependency with loose coupling.',
          'Devices attach and detach at runtime, and a new device type needs no change to the sensor.']),
        must: ['Named Observer', 'Subject and observers identified in the domain', 'One-to-many notification on state change', 'Runtime subscribe/unsubscribe and loose coupling'] },
      { m: 3,
        q: 'A company’s org chart consists of employees and departments. A department can contain employees and other departments. Management wants the total salary cost and the headcount of any employee or any department, calculated the same way.' +
          '<br>Give the most appropriate design pattern and justify it.',
        model: '<p><b>Composite.</b></p>' + ul([
          'Component: ' + c('OrgUnit') + ' interface with ' + c('salaryCost()') + ' and ' + c('headcount()') + '.',
          'Leaf: ' + c('Employee') + ' — returns its own salary and 1.',
          'Composite: ' + c('Department') + ' holds a ' + c('List<OrgUnit>') + ' and returns the sum over its children, recursing through sub-departments.',
          'Clients treat a single employee and a whole division uniformly through the one interface — the part-whole tree is what Composite is for.']),
        must: ['Named Composite', 'Leaf and composite identified', 'Recursive aggregation over children', 'Uniform treatment of parts and wholes'] },
      { m: 3,
        q: 'An online store calculates sales tax differently in Australia, New Zealand and the UK, and expects to add more countries. A customer can change their delivery country during checkout, and the tax shown must update immediately.' +
          '<br>Give the most appropriate design pattern and justify it.',
        model: '<p><b>Strategy.</b></p>' + ul([
          'Strategy interface: ' + c('TaxStrategy.calculate(Order o)') + '.',
          'Concrete strategies: ' + c('AustralianGst') + ', ' + c('NzGst') + ', ' + c('UkVat') + ' — interchangeable algorithms.',
          'Context: ' + c('Checkout') + ' holds a TaxStrategy and delegates to it; ' + c('setTaxStrategy') + ' swaps it at runtime when the country changes.',
          'Adding a country is a new class, with no change to Checkout (Open-Closed), and no conditional on country inside the checkout.']),
        must: ['Named Strategy', 'Strategy interface + concrete strategies identified', 'Context delegates and can swap at runtime', 'Extensibility without modification'] },
      { m: 3,
        q: 'A tower-defence game has a Forest world and a Desert world. Each world needs its own matching set of enemies: a ground unit, a flying unit and a boss. Mixing a forest boss into a desert level must be impossible. More worlds are planned.' +
          '<br>Give the most appropriate design pattern and justify it.',
        model: '<p><b>Abstract Factory.</b></p>' + ul([
          'Abstract factory: ' + c('EnemyFactory') + ' with ' + c('createGround()') + ', ' + c('createFlyer()') + ', ' + c('createBoss()') + '.',
          'Concrete factories: ' + c('ForestEnemyFactory') + ', ' + c('DesertEnemyFactory') + ' — one per family.',
          'Abstract products: ' + c('GroundEnemy') + ', ' + c('FlyingEnemy') + ', ' + c('Boss') + '; concrete products per world.',
          'The level is given one factory, so every enemy it creates comes from the same family (consistency), and the level code never names concrete classes. A new world is a new factory plus its products.']),
        must: ['Named Abstract Factory', 'Factory per family / products identified', 'Guarantees products from one family are used together', 'Client decoupled from concrete classes'] },
      { m: 4,
        q: 'a) Explain why the following Singleton is unsafe in a multithreaded program. (2 marks)<br>b) Describe two ways to fix it. (2 marks)' + pre(`
public class IdGenerator {
    private static IdGenerator instance;
    private int next = 0;

    private IdGenerator() {}

    public static IdGenerator getInstance() {
        if (instance == null) instance = new IdGenerator();
        return instance;
    }
    public int nextId() { return next++; }
}`),
        model: '<p><b>a)</b> Two problems, both race conditions. In ' + c('getInstance') + ', two threads can both see ' + c('instance == null') + ' before either assigns it, so two IdGenerators are created and the "single instance" guarantee fails (and IDs may repeat across them). ' +
          'In ' + c('nextId') + ', ' + c('next++') + ' is a read-modify-write, so two threads can read the same value and return duplicate IDs.</p>' +
          '<p><b>b)</b> Make ' + c('getInstance') + ' ' + c('synchronized') + ', or initialise eagerly with ' + c('private static final IdGenerator instance = new IdGenerator();') + ' (class loading is thread-safe), or use the holder-class idiom. ' +
          'Also make ' + c('nextId') + ' ' + c('synchronized') + ' or use an ' + c('AtomicInteger') + '.</p>',
        must: ['Check-then-act race in getInstance → multiple instances', 'next++ not atomic → duplicate ids', 'Fix 1 (synchronized / eager / holder)', 'Fix 2 (including making nextId safe)'] },
      { m: 4,
        q: 'Compare the <b>push</b> and <b>pull</b> models of the Observer pattern. Give one advantage and one disadvantage of each.',
        model: '<p><b>Push</b>: the subject sends the changed data in the notification, e.g. ' + c('update(double price)') + '. ' +
          '+ Observers need no reference to the subject and no extra calls; simple. − The subject must guess what every observer needs; observers may receive data they do not use, and the update signature changes whenever the data does.</p>' +
          '<p><b>Pull</b>: the subject sends a minimal notification (often itself), and each observer queries the getters it needs, e.g. ' + c('update(Stock s) { s.getPrice(); }') + '. ' +
          '+ Flexible: different observers take different data, and the update signature is stable. − Observers are coupled to the subject’s interface, and need extra calls (state may also change between notification and query).</p>',
        must: ['Push defined', 'Pull defined', 'An advantage and a disadvantage of push', 'An advantage and a disadvantage of pull'] },
      { m: 3,
        q: 'Both Strategy and Decorator use composition and delegation. Explain the difference in intent between them, using an example of each.',
        model: '<p><b>Strategy</b> replaces <i>part of an algorithm inside</i> an object: the context holds one strategy and delegates a step to it, e.g. a ' + c('Router') + ' delegating to a ' + c('WalkingRoute') + ' or ' + c('DrivingRoute') + '. Only one strategy is in use at a time and the client usually chooses it.</p>' +
          '<p><b>Decorator</b> adds behaviour <i>around</i> an object from outside, without it knowing: decorators implement the same interface as what they wrap and can be stacked, e.g. ' + c('new Encrypted(new Compressed(new FileStream()))') + '.</p>' +
          '<p>In short, Strategy changes the guts; Decorator changes the skin.</p>',
        must: ['Strategy: swaps an internal algorithm', 'Decorator: wraps with same interface, adds behaviour, stackable', 'Example of each'] }
    ],

    /* ---------------------------------------------------------------- */
    async: [
      { m: 4,
        q: 'Two threads each call ' + c('deposit(10)') + ' 1,000 times on the same account, starting from a balance of 0.' + pre(`
public class Account {
    private int balance = 0;
    public void deposit(int amount) { balance = balance + amount; }
    public int getBalance() { return balance; }
}`) +
          'a) Explain why the final balance is sometimes less than 20,000. (2 marks)<br>b) Explain how to fix it. (2 marks)',
        model: '<p><b>a)</b> ' + c('balance = balance + amount') + ' is not atomic: it reads balance, adds, then writes. Threads can interleave: both read 50, both compute 60, both write 60 — one deposit is lost. This is a race condition on shared mutable state.</p>' +
          '<p><b>b)</b> Make the read-modify-write atomic: declare ' + c('deposit') + ' (and ' + c('getBalance') + ', for visibility) ' + c('synchronized') + ', so only one thread at a time can run them on this account; or use a ' + c('ReentrantLock') + '; or store the balance in an ' + c('AtomicInteger') + ' and call ' + c('addAndGet') + '.</p>',
        must: ['Identified read-modify-write is not atomic', 'Described an interleaving that loses an update', 'A correct fix (synchronized / lock / atomic)', 'Fix also covers the reader or explains mutual exclusion'] },
      { m: 3,
        q: 'A desktop app downloads a 200 MB file when the user clicks a button, and the whole window freezes until it finishes. Explain why, and how asynchronous design fixes it.',
        model: '<p>The download runs <i>synchronously</i> on the UI thread, which is also the thread that repaints the window and handles input. While it is blocked waiting on the network, nothing else can happen, so the window freezes.</p>' +
          '<p>Run the download asynchronously — on a background thread, an executor, or with ' + c('CompletableFuture.supplyAsync(...)') + ' — and return immediately. When it completes, a callback (e.g. ' + c('thenAccept') + ') updates the UI. The UI thread stays free to respond (showing progress, allowing cancel). The download itself is not faster; the app is more responsive.</p>',
        must: ['Blocking work on the UI/main thread', 'Move work to another thread / async task', 'Callback or future to handle the result'] }
    ]
  };

  /* ==================================================================== */

  D.ARCH = {
    archfund: [
      { m: 4,
        q: 'A university is building a new exam-timetabling system. Requirements include: <i>"timetables are published for 60,000 students at 9am on release day"</i>, <i>"the system must integrate with the existing student records system"</i>, <i>"rules change every term"</i> and <i>"students’ personal data must be protected"</i>.' +
          '<br>Identify <b>four</b> architectural characteristics this system needs, and justify each from the requirements.',
        model: ul([
          '<b>Elasticity</b> (or scalability/performance): 60,000 students all access timetables at 9am on release day — a predictable burst that must not bring the system down.',
          '<b>Interoperability</b>: it must exchange data with the existing student records system.',
          '<b>Maintainability / modifiability</b> (or configurability): timetabling rules change every term, so changing rules must be cheap and safe.',
          '<b>Security</b>: personal data must be protected — authentication, authorisation, encryption.',
          'Also acceptable with justification: availability on release day, testability of rule changes.']),
        must: ['Four distinct characteristics', 'Each tied to a specific requirement', 'Correct terminology (e.g. elasticity vs scalability)'] },
      { m: 4,
        q: 'A startup has decided to use PostgreSQL rather than MongoDB for its new booking platform, because bookings need strong consistency (no double-booking) and the data is highly relational.' +
          '<br>Write an <b>Architectural Decision Record</b> for this decision.',
        model: pre(`
Title:  ADR 003: Use PostgreSQL as the primary booking datastore
Status: Accepted (21 Nov 2026)

Context:
  The platform stores venues, time slots, customers and bookings, which are
  heavily related. Two customers must never book the same slot, so we need
  transactional guarantees. Team members already know SQL. Options
  considered: PostgreSQL, MongoDB.

Decision:
  We will use PostgreSQL, enforcing no double-booking with a unique
  constraint on (slot_id) in the bookings table inside ACID transactions.

Consequences:
  + Strong consistency and referential integrity enforced by the database.
  + Joins and reporting queries are straightforward.
  - Schema changes require migrations.
  - Horizontal write scaling is harder than with MongoDB; we may need
    read replicas or partitioning later.`) +
          '<p>The key marks are a clear context (forces and options), a decision stated in active voice, and honest consequences — including the negatives.</p>',
        must: ['Title and status', 'Context explains the forces and options considered', 'Decision clearly stated', 'Consequences include both positives and negatives'] },
      { m: 4,
        q: 'A food-delivery platform has a customer mobile app, a restaurant web portal, a backend API, a PostgreSQL database, a message queue, and integrates with Stripe for payments and Google Maps for routing.' +
          '<br>Describe what a <b>C4 Container diagram</b> for this system would show, and explain how it differs from the <b>System Context</b> diagram.',
        model: '<p>The <b>Container</b> diagram zooms inside the system boundary and shows each separately runnable/deployable unit, its technology and how they communicate: ' +
          'the Customer Mobile App (e.g. React Native) and Restaurant Web Portal (SPA) both call the Backend API (e.g. Java/Spring) over HTTPS/JSON; the API reads and writes the PostgreSQL database and publishes order events to the message queue, which a notification worker might consume. ' +
          'Stripe and Google Maps stay outside the boundary as external systems the API calls. Customers and restaurant staff appear as people using the apps.</p>' +
          '<p>The <b>System Context</b> diagram is one level up: the whole platform is a single box, with only the people (customers, restaurant staff, couriers) and external systems (Stripe, Google Maps) around it, and no technology or internals.</p>',
        must: ['Container = deployable/runnable units inside the system boundary', 'Listed the containers with technology and communication', 'External systems shown outside the boundary', 'Context = system as one box with users and external systems'] },
      { m: 3,
        q: 'Explain the difference between <b>scalability</b> and <b>elasticity</b>, and give an example of a system that needs each.',
        model: '<p><b>Scalability</b>: the ability to handle increasing load over time — more users, data or requests — by adding resources, with performance maintained. Example: a social network growing steadily from 1 million to 50 million users over three years.</p>' +
          '<p><b>Elasticity</b>: the ability to handle sudden, short bursts by rapidly adding and then removing capacity. Example: a ticketing site when a major concert goes on sale, or a university portal when results are released.</p>',
        must: ['Scalability: sustained growth', 'Elasticity: sudden bursts, scale up and down quickly', 'A sensible example of each'] },
      { m: 4,
        q: 'Explain how you would identify the <b>logical components</b> of a new library-management system using the <b>actor/action</b> approach, and list the components you would end up with.',
        model: '<p>Identify the actors and the actions each performs, then group related actions into components, refining by checking each component’s responsibility is cohesive and that coupling between components is low.</p>' +
          ul(['Member: search the catalogue, borrow, return, reserve, pay fines.',
              'Librarian: add and remove items, manage members, waive fines.',
              'System: send overdue reminders, expire reservations.']) +
          '<p>Grouping gives components such as: <b>Catalogue</b> (search, add/remove items), <b>Loans</b> (borrow, return, due dates), <b>Reservations</b>, <b>Membership</b> (accounts), <b>Fines & Payments</b>, <b>Notifications</b> (reminders). ' +
          'Then check against architectural characteristics, e.g. Catalogue search may need to scale separately.</p>',
        must: ['Actors identified', 'Actions per actor', 'Related actions grouped into named components', 'Mentioned refining / checking cohesion and coupling'] }
    ],

    styles: [
      { m: 4,
        q: 'A hospital system has the business domains <i>Patients</i>, <i>Appointments</i> and <i>Billing</i>, and the technical layers <i>Presentation</i>, <i>Business Logic</i> and <i>Data Access</i>.' +
          '<br>Describe how a <b>layered monolith</b> and a <b>modular monolith</b> would each organise this code, and explain which better isolates the changes needed to add a new <i>Telehealth</i> feature.',
        model: '<p><b>Layered monolith</b> (technical partitioning): top-level packages are the layers — ' + c('presentation/') + ', ' + c('business/') + ', ' + c('data/') + ' — and each contains code for every domain (PatientController, AppointmentController… in presentation; PatientService, AppointmentService… in business).</p>' +
          '<p><b>Modular monolith</b> (domain partitioning): top-level modules are the domains — ' + c('patients/') + ', ' + c('appointments/') + ', ' + c('billing/') + ' — each containing its own presentation, logic and data access, communicating with other modules through defined interfaces. It is still one deployment.</p>' +
          '<p>The <b>modular monolith</b> better isolates Telehealth: it becomes a new ' + c('telehealth/') + ' module, with small, explicit changes to the interfaces of Appointments. In the layered version, the change is spread across every layer, touching shared packages that other teams also edit.</p>',
        must: ['Layered: organised by technical layer, each layer spans all domains', 'Modular: organised by domain module, each with its own layers, single deployment',
               'Chose modular monolith', 'Justified: change contained in one new module vs spread across all layers'] },
      { m: 3,
        q: 'Explain which architectural style is most suitable, and justify it with reference to the style’s characteristics.<br><i>A ride-sharing company needs riders, drivers, pricing, and notifications to react in real time to location updates from 200,000 active phones. New features (driver rewards, fraud detection) are often added and should be able to react to the same updates without changing existing services.</i>',
        model: '<p><b>Event-driven architecture</b>, probably with a broker topology. Location updates are published as events; matching, pricing, notification and fraud services subscribe independently and react asynchronously.</p>' +
          ul(['High volume, real-time streams suit asynchronous processing that scales out by adding consumers.',
              'Loose coupling: publishers do not know subscribers, so driver rewards or fraud detection can be added as new subscribers with no change to existing services.',
              'Trade-off acknowledged: harder to trace and debug, eventual consistency.']),
        must: ['Chose event-driven', 'Asynchronous / real-time and scalable consumers', 'Decoupling lets new consumers be added without change', 'Acknowledged a trade-off'] },
      { m: 3,
        q: 'Explain which architectural style is most suitable, and justify it.<br><i>A photography site needs to create three thumbnail sizes and scan for inappropriate content whenever a user uploads an image. Uploads are unpredictable: near zero overnight and thousands per minute during big events. The company wants to minimise cost and not manage servers.</i>',
        model: '<p><b>Serverless</b> (functions-as-a-service). An upload to cloud storage triggers a function that resizes the image; another scans it.</p>' +
          ul(['Event-triggered, short-lived, stateless work is exactly what functions are for.',
              'Scales automatically from zero to thousands of parallel executions — elasticity for unpredictable bursts.',
              'Pay per execution: overnight near-zero load costs almost nothing, and there are no servers to manage.',
              'Trade-offs: cold-start latency (acceptable here, as processing is in the background), execution-time limits and vendor lock-in.']),
        must: ['Chose serverless', 'Event-triggered short tasks', 'Auto-scaling / scale to zero and pay per use', 'Acknowledged a trade-off'] },
      { m: 3,
        q: 'Explain which architectural style is most suitable, and justify it.<br><i>A school of 200 staff needs an internal tool to book meeting rooms. It will be built by two developers in six weeks, has modest, steady load, and a limited budget for hosting and operations.</i>',
        model: '<p><b>Layered monolith.</b></p>' +
          ul(['Simple: one codebase and one deployment, with a familiar structure (presentation, business, data) that two developers can build quickly.',
              'Cheap to host and operate — no service orchestration, message brokers or distributed monitoring.',
              'Load is modest and steady, so independent scaling and elasticity are not needed.',
              'Microservices or EDA would add distribution complexity (network failures, deployment pipelines) with no matching benefit.']),
        must: ['Chose layered monolith (or modular monolith with justification)', 'Small team / short time / simplicity', 'Low cost and operational overhead', 'Explained why distributed styles are overkill'] },
      { m: 3,
        q: 'Explain which architectural style is most suitable, and justify it.<br><i>A video-streaming company has 40 development teams. The recommendation engine needs heavy compute during evenings, the billing system changes rarely but must be extremely reliable, and teams want to release several times a day without coordinating with each other.</i>',
        model: '<p><b>Microservices.</b></p>' +
          ul(['Each team owns one or a few services aligned with a bounded context (recommendations, billing, catalogue, playback), with its own database.',
              'Independent deployability: teams release many times a day without coordinating a whole-system release.',
              'Independent scaling: recommendations scale out in the evenings without scaling billing.',
              'Fault isolation: a failure in recommendations need not take billing down.',
              'The cost — operational complexity, distributed data, network latency — is affordable for an organisation of this size.']),
        must: ['Chose microservices', 'Independent deployment by many teams', 'Independent scaling per service', 'Fault isolation or technology heterogeneity, and/or a trade-off'] },
      { m: 4,
        q: 'An e-commerce platform is rapidly gaining popularity. Its current system is small and cannot handle its traffic spikes, and the company wants to expand its features to meet the new demand.<br>' +
          'A consultant proposes moving straight from the current layered monolith to 30 microservices. Evaluate this proposal and suggest an alternative path.',
        model: '<p>Microservices would address the problems — independent scaling of hot services (catalogue, checkout) during spikes, and independent teams adding features — but a jump straight to 30 services is risky:</p>' +
          ul(['Service boundaries are guesses until the domain is well understood; wrong boundaries create chatty, coupled services (a distributed monolith).',
              'Large new operational burden: CI/CD per service, monitoring, distributed tracing, service discovery.',
              'Distributed data: cross-service transactions need sagas and eventual consistency.',
              'A big-bang rewrite stalls feature delivery while traffic is growing.']) +
          '<p><b>Alternative:</b> first restructure into a <b>modular monolith</b> partitioned by domain, scaling it horizontally behind a load balancer for the spikes. Then extract the modules that need independent scaling or deployment (e.g. catalogue search, checkout) into microservices one at a time (strangler fig), once boundaries have proven stable.</p>',
        must: ['Acknowledged what microservices would solve', 'At least two concrete risks of the big-bang move', 'Proposed an incremental path (modular monolith / strangler)', 'Justified why the path reduces risk'] },
      { m: 4,
        q: 'Four microservices — Orders, Inventory, Shipping and Billing — all read and write the same shared database, and Orders calls the other three synchronously over HTTP for every order. Evaluate this design and suggest two improvements.',
        model: '<p>Problems:</p>' +
          ul(['The <b>shared database</b> couples all services at the data layer: a schema change for one service can break the others, so they cannot be deployed independently — a distributed monolith.',
              '<b>Synchronous call chains</b>: Orders’ availability is the product of all four services’ availability; latency adds up; if Shipping is slow, orders hang (cascading failure).',
              'No clear ownership of data, so invariants are enforced inconsistently.']) +
          '<p>Improvements:</p>' +
          ul(['<b>Database per service</b>: each service owns its tables and exposes data only through its API or events.',
              '<b>Asynchronous events</b>: Orders publishes ' + c('OrderPlaced') + '; Inventory, Shipping and Billing subscribe. Orders no longer waits on them, and failures are isolated.',
              'Use a <b>saga</b> (with compensating actions) for the cross-service order workflow; add timeouts and circuit breakers on any remaining synchronous calls.']),
        must: ['Shared DB problem: coupling, no independent deployment', 'Synchronous chain problem: availability/latency/cascading failure', 'Improvement 1 with justification', 'Improvement 2 with justification'] },
      { m: 4,
        q: 'Compare the <b>broker</b> and <b>mediator</b> topologies of event-driven architecture, using an online order (validate, reserve stock, take payment, ship, email) as the example. Which would you choose, and why?',
        model: '<p><b>Broker</b>: no central coordinator. Order service publishes ' + c('OrderPlaced') + '; Inventory reacts and publishes ' + c('StockReserved') + '; Payment reacts and publishes ' + c('PaymentTaken') + '; and so on, like a chain reaction. ' +
          '+ Highly decoupled, scalable, easy to add new reactions. − No one knows the overall state of an order; error handling (payment failed after stock reserved) is hard; the workflow is implicit.</p>' +
          '<p><b>Mediator</b>: an order mediator/orchestrator receives the initial event and sends commands to each step in order, tracking state. ' +
          '+ Explicit workflow, central error handling and compensation, easy to see where an order is. − The mediator is coupled to every step and can become a bottleneck.</p>' +
          '<p>For this example, the <b>mediator</b> is a good choice: the steps are ordered and failures need compensation (release stock if payment fails). Broker suits simpler fan-out (e.g. analytics and email both reacting to OrderPlaced).</p>',
        must: ['Broker described with the example', 'Mediator described with the example', 'Trade-offs of each', 'A justified choice'] },
      { m: 4,
        q: 'Describe <b>four</b> limitations of serverless architecture that would make it a poor fit for some systems.',
        model: ul(['<b>Cold starts</b>: idle functions add initialisation latency, a problem for latency-sensitive user requests.',
                   '<b>Execution limits</b>: functions have maximum run times and memory, so long-running jobs (video transcoding for hours) do not fit.',
                   '<b>Statelessness</b>: no in-memory state between invocations; all state goes to external stores, adding latency and cost; long-lived connections (websockets, games) are awkward.',
                   '<b>Vendor lock-in</b>: code depends on the provider’s triggers, services and deployment model.',
                   '<b>Cost at sustained high load</b>: pay-per-invocation can cost more than reserved servers for constant heavy traffic.',
                   '<b>Observability and debugging</b>: many small functions make tracing and local testing harder.']),
        must: ['Four distinct limitations', 'Each explained, not just named', 'Each tied to a kind of system it hurts'] },
      { m: 4,
        q: 'In a layered architecture, explain what <b>closed</b> and <b>open</b> layers are, the <b>layers of isolation</b> concept, and the <b>architecture sinkhole</b> anti-pattern.',
        model: '<p>A request must pass through a <b>closed</b> layer — it cannot skip it — e.g. presentation must go through the business layer to reach persistence. An <b>open</b> layer may be bypassed, e.g. a shared-services layer the business layer can skip past.</p>' +
          '<p><b>Layers of isolation</b>: because layers are closed, a change in one layer (say, swapping the database) affects only the layer directly above it, not the whole system.</p>' +
          '<p>The <b>sinkhole</b> anti-pattern is when requests pass through layers that add no logic and simply forward the call. Some is normal; if most requests (as a rule of thumb, more than 20%) are pure pass-through, the layering costs more than it gives, and opening some layers or another style should be considered.</p>',
        must: ['Closed: must pass through', 'Open: may be bypassed', 'Layers of isolation explained', 'Sinkhole explained (pass-through with no logic)'] },
      { m: 3,
        q: 'Microservices can communicate <b>synchronously</b> (REST/HTTP) or <b>asynchronously</b> (messages/events). Give one advantage and one disadvantage of each.',
        model: '<p><b>Synchronous</b>: + simple request/response, immediate result and errors, easy to reason about. − Temporal coupling: the callee must be up and fast; failures and latency cascade along call chains.</p>' +
          '<p><b>Asynchronous</b>: + decoupled in time — the receiver can be down or slow and catch up later; easy to add consumers; absorbs load spikes in a queue. − Eventual consistency; harder to trace, debug and handle errors; no immediate response to the caller.</p>',
        must: ['Sync advantage', 'Sync disadvantage', 'Async advantage', 'Async disadvantage'] }
    ]
  };

  /* ==================================================================== */

  var SEQ_MUST_COMMON = ['Every participant declared, actors as actor', 'Messages in the right order, with calls (->>) and replies (-->>)'];

  D.SEQ = [
    { q: 'A customer orders food through a delivery app. The app sends the order to the Order Service, which checks with the Restaurant Service that every item is available. If all items are available, the Order Service asks the Payment Service to charge the customer’s card; if payment succeeds, the order is confirmed and the customer receives a notification. If an item is unavailable or payment is declined, the customer is told the order failed.',
      model: `sequenceDiagram
    actor Customer
    participant App as Mobile App
    participant OS as Order Service
    participant RS as Restaurant Service
    participant PS as Payment Service
    participant NS as Notification Service

    Customer->>App: Place order
    App->>OS: createOrder(items, card)
    OS->>RS: checkAvailability(items)
    RS-->>OS: availability
    alt all items available
        OS->>PS: charge(card, total)
        PS-->>OS: result
        alt payment approved
            OS->>OS: mark order confirmed
            OS-)NS: sendConfirmation(order)
            NS-)Customer: "Order confirmed" push
            OS-->>App: confirmed
        else payment declined
            OS-->>App: failed (payment declined)
        end
    else item unavailable
        OS-->>App: failed (item unavailable)
    end
    App-->>Customer: show result`,
      must: SEQ_MUST_COMMON.concat(['alt for availability, nested alt (or sequential alt) for payment', 'Both failure paths reach the customer', 'Notification sent only after successful payment']) },

    { q: 'A user withdraws cash from an ATM. The ATM reads the card and asks the user for a PIN. The ATM asks the Bank Server to verify the PIN; the user gets up to three attempts. Once verified, the user enters an amount and the bank checks the balance. If funds are sufficient, the bank debits the account and the ATM dispenses cash and returns the card. Otherwise the ATM shows "insufficient funds" and returns the card.',
      model: `sequenceDiagram
    actor User
    participant ATM
    participant Bank as Bank Server

    User->>ATM: Insert card
    ATM->>ATM: readCard()
    loop up to 3 attempts, until PIN valid
        ATM->>User: Request PIN
        User->>ATM: Enter PIN
        ATM->>Bank: verifyPin(card, pin)
        Bank-->>ATM: valid / invalid
    end
    User->>ATM: Enter amount
    ATM->>Bank: withdraw(account, amount)
    Bank->>Bank: checkBalance(account)
    alt sufficient funds
        Bank->>Bank: debit(account, amount)
        Bank-->>ATM: approved
        ATM->>User: Dispense cash
    else insufficient funds
        Bank-->>ATM: declined
        ATM->>User: Show "insufficient funds"
    end
    ATM->>User: Return card`,
      must: SEQ_MUST_COMMON.concat(['loop for PIN attempts with a stated condition', 'alt for sufficient / insufficient funds', 'Card returned in both cases (after the alt)']) },

    { q: 'A rider requests a trip in a ride-sharing app. The Trip Service asks the Matching Service for nearby drivers. The Matching Service offers the trip to the nearest driver; if that driver declines, it offers the trip to the next nearest, repeating until a driver accepts. The Trip Service then notifies the rider with the driver’s details and ETA.',
      model: `sequenceDiagram
    actor Rider
    participant App as Rider App
    participant Trip as Trip Service
    participant Match as Matching Service
    actor Driver

    Rider->>App: Request trip(pickup, destination)
    App->>Trip: requestTrip(pickup, destination)
    Trip->>Match: findDriver(pickup)
    Match->>Match: rank nearby drivers by distance
    loop until a driver accepts
        Match->>Driver: offerTrip(details)
        Driver-->>Match: accept / decline
    end
    Match-->>Trip: driver assigned
    Trip-->>App: driver details, ETA
    App-->>Rider: Show driver and ETA`,
      must: SEQ_MUST_COMMON.concat(['loop with the "until accepted" condition', 'Driver shown as a separate participant receiving offers', 'Rider receives driver and ETA at the end']) },

    { q: 'A student logs into a university portal with two-factor authentication. The portal sends the username and password to the Auth Service, which checks them against the User Database. If they are wrong, the portal shows an error. If they are correct, the Auth Service sends a one-time code by SMS and the student enters it; if the code is correct the Auth Service returns a session token and the portal shows the dashboard, otherwise it shows an error.',
      model: `sequenceDiagram
    actor Student
    participant Portal
    participant Auth as Auth Service
    participant DB as User Database
    participant SMS as SMS Gateway

    Student->>Portal: Enter username, password
    Portal->>Auth: login(username, password)
    Auth->>DB: getUser(username)
    DB-->>Auth: user record (password hash)
    Auth->>Auth: verify password hash
    alt credentials invalid
        Auth-->>Portal: error
        Portal-->>Student: "Invalid username or password"
    else credentials valid
        Auth->>SMS: sendCode(phone, code)
        SMS-)Student: SMS with code
        Auth-->>Portal: code required
        Student->>Portal: Enter code
        Portal->>Auth: verifyCode(username, code)
        alt code correct
            Auth-->>Portal: session token
            Portal-->>Student: Show dashboard
        else code wrong or expired
            Auth-->>Portal: error
            Portal-->>Student: "Invalid code"
        end
    end`,
      must: SEQ_MUST_COMMON.concat(['alt for wrong vs correct credentials', 'Nested alt for the code check', 'SMS gateway and database as participants', 'Session token returned only on full success']) },

    { q: 'A customer books cinema seats online. The Booking Service asks the Seat Service to hold the chosen seats for 10 minutes. If the seats are already taken, the customer is told to choose again. Otherwise the customer pays through the Payment Gateway. If payment succeeds within the 10 minutes, the seats are confirmed and an e-ticket is emailed. If payment fails or the hold expires, the seats are released.',
      model: `sequenceDiagram
    actor Customer
    participant Web as Cinema Website
    participant Book as Booking Service
    participant Seats as Seat Service
    participant Pay as Payment Gateway
    participant Email as Email Service

    Customer->>Web: Select seats
    Web->>Book: book(session, seats)
    Book->>Seats: hold(seats, 10 min)
    alt seats already taken
        Seats-->>Book: unavailable
        Book-->>Web: unavailable
        Web-->>Customer: "Seats taken, choose again"
    else seats held
        Seats-->>Book: hold id
        Book-->>Web: proceed to payment
        Customer->>Web: Enter payment details
        Web->>Pay: pay(amount, card)
        Pay-->>Web: result
        Web->>Book: paymentResult(hold id, result)
        alt payment succeeded within hold
            Book->>Seats: confirm(hold id)
            Book-)Email: sendTicket(customer, booking)
            Book-->>Web: booking confirmed
            Web-->>Customer: Show confirmation
        else payment failed or hold expired
            Book->>Seats: release(hold id)
            Book-->>Web: booking failed
            Web-->>Customer: "Payment failed, seats released"
        end
    end`,
      must: SEQ_MUST_COMMON.concat(['Seat hold happens before payment', 'alt for seats taken', 'alt for payment success vs failure/expiry', 'Seats released on failure; email only on success']) },

    { q: 'A student enrols in a course. The Enrolment Service asks the Academic Records Service whether the student has completed the prerequisites. If not, the enrolment is rejected. If so, it asks the Course Service whether there is space. If there is, the student is enrolled; if the class is full, the student is added to the waitlist and told their position.',
      model: `sequenceDiagram
    actor Student
    participant Portal
    participant Enrol as Enrolment Service
    participant Records as Academic Records Service
    participant Course as Course Service

    Student->>Portal: Enrol in COMP2511
    Portal->>Enrol: enrol(zid, course)
    Enrol->>Records: hasPrerequisites(zid, course)
    Records-->>Enrol: true / false
    alt prerequisites not met
        Enrol-->>Portal: rejected (missing prerequisites)
    else prerequisites met
        Enrol->>Course: hasCapacity(course)
        Course-->>Enrol: true / false
        alt space available
            Enrol->>Course: addStudent(zid)
            Course-->>Enrol: ok
            Enrol-->>Portal: enrolled
        else class full
            Enrol->>Course: addToWaitlist(zid)
            Course-->>Enrol: waitlist position
            Enrol-->>Portal: waitlisted (position)
        end
    end
    Portal-->>Student: Show result`,
      must: SEQ_MUST_COMMON.concat(['Prerequisite check before capacity check', 'alt for prerequisites', 'Nested alt for enrolled vs waitlisted', 'Waitlist position returned']) },

    { q: 'In an event-driven shop, when a customer places an order, the Order Service saves it and publishes an <i>OrderPlaced</i> event to a message broker, then immediately returns "order received" to the customer. The Inventory Service and the Email Service both consume the event asynchronously: Inventory reserves stock and publishes <i>StockReserved</i>; Email sends a receipt.',
      model: `sequenceDiagram
    actor Customer
    participant OS as Order Service
    participant Broker as Message Broker
    participant Inv as Inventory Service
    participant Email as Email Service

    Customer->>OS: placeOrder(items)
    OS->>OS: save order (PENDING)
    OS-)Broker: publish OrderPlaced
    OS-->>Customer: "Order received"
    par Inventory consumes
        Broker-)Inv: OrderPlaced
        Inv->>Inv: reserve stock
        Inv-)Broker: publish StockReserved
    and Email consumes
        Broker-)Email: OrderPlaced
        Email-)Customer: receipt email
    end`,
      must: SEQ_MUST_COMMON.concat(['Asynchronous messages shown with -) to and from the broker', 'Customer gets a response before the consumers run', 'par block (or separate flows) for the two consumers', 'Inventory publishes StockReserved back to the broker']),
      notes: 'The marks here are for showing <i>asynchrony</i>: the Order Service does not call Inventory or Email directly and does not wait for them.' },

    { q: 'A user uploads a profile photo. The web app requests an upload URL from the API, and uploads the image straight to cloud storage. The storage upload event triggers a serverless Resize Function, which creates a thumbnail, saves it back to storage and updates the user’s profile record in the database. The web app polls the API until the thumbnail is ready, then displays it.',
      model: `sequenceDiagram
    actor User
    participant Web as Web App
    participant API
    participant Store as Cloud Storage
    participant Fn as Resize Function
    participant DB as Profile Database

    User->>Web: Choose photo
    Web->>API: requestUploadUrl(userId)
    API-->>Web: signed upload URL
    Web->>Store: PUT image
    Store-->>Web: 200 OK
    Store-)Fn: ObjectCreated event
    Fn->>Store: get image
    Store-->>Fn: image
    Fn->>Fn: create thumbnail
    Fn->>Store: put thumbnail
    Fn->>DB: update profile(thumbnailUrl)
    loop until thumbnail ready
        Web->>API: getProfile(userId)
        API->>DB: read profile
        DB-->>API: profile
        API-->>Web: profile (thumbnailUrl or pending)
    end
    Web-->>User: Show new photo`,
      must: SEQ_MUST_COMMON.concat(['Storage event triggers the function asynchronously (-))', 'Function reads, resizes, writes thumbnail and updates DB', 'loop for polling with a stopping condition']) },

    { q: 'The library system lets users borrow books online. The system checks the book’s availability, updates the inventory, and sends a confirmation email. If the book is not available, the user may choose to join a reservation queue.',
      model: `sequenceDiagram
    actor User
    participant Web as Library Website
    participant Loan as Loan Service
    participant Inv as Inventory Service
    participant Email as Email Service

    User->>Web: Borrow book(bookId)
    Web->>Loan: borrow(userId, bookId)
    Loan->>Inv: checkAvailability(bookId)
    Inv-->>Loan: available / unavailable
    alt available
        Loan->>Inv: decrementCopies(bookId)
        Inv-->>Loan: ok
        Loan->>Loan: create loan record
        Loan-)Email: sendConfirmation(userId, loan)
        Loan-->>Web: loan confirmed (due date)
        Web-->>User: Show due date
    else unavailable
        Loan-->>Web: unavailable
        Web-->>User: Offer reservation
        opt user joins queue
            User->>Web: Reserve
            Web->>Loan: reserve(userId, bookId)
            Loan-->>Web: queue position
            Web-->>User: Show queue position
        end
    end`,
      must: SEQ_MUST_COMMON.concat(['Availability check before inventory update', 'alt for available vs unavailable', 'opt for the optional reservation', 'Email confirmation only on success']) }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
