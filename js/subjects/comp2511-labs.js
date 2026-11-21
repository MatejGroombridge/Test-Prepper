/* subjects/comp2511-labs.js — design & programming problems based on the
   course's own exercises (TMS, Airline, Shipping Discounts, Business Rules,
   Shopping Refactor, Barbie, Engineering, Gardening).
   The specs follow the course's wording; where the course provides starter
   code we did not have, it is RECONSTRUCTED to match the spec, and the
   question says so. Load after comp2511-code.js, before comp2511.js.

   Refactor items with an explicit `parts` array are built part by part
   (like SCRATCH items) instead of the standard a) smells b) pattern c) code. */
(function (global) {
  'use strict';

  var D = global.COMP2511Data;
  var c = D.c;
  var PQ = 'course practice questions', LAB = 'course lab and revision exercises';
  var RECON = '<p class="small muted">The course supplies starter code for this exercise; the code here is reconstructed to match its spec, so details will differ from the original.</p>';

  function add(bank, src, items) {
    items.forEach(function (x) { x.src = src; bank.push(x); });
  }

  /* ============================ domain models ============================ */

  add(D.DOMAIN, PQ, [
    { title: 'TMS (Thesis Management System)',
      lead: 'TMS is a home-grown CSE system used to manage fourth-year undergraduate and postgraduate research projects. It is being rebuilt to improve its design and deal with technical debt, and you have been asked to design its current functionality.',
      spec: [
        'The system has a series of research <b>topics</b>.',
        'Each topic has a name, description, <b>supervisor</b> (who is a member of the academic staff) and status (available or unavailable).',
        'A <b>student</b> can apply for one or more topics.',
        'An <b>academic</b> can accept or reject a student’s <b>application</b> for a topic.'
      ],
      breakdown: 'modelling of entities (5) · aggregations, compositions and cardinalities (3) · modelling of functionality (2)',
      controller: `public interface TMSController {
    void createStudent(String zid, String name);
    void createAcademic(String zid, String name);
    void createTopic(String topicId, String name, String description, String supervisorZid);
    void setTopicAvailable(String topicId, boolean available);
    String applyForTopic(String studentZid, String topicId);
    void acceptApplication(String academicZid, String applicationId);
    void rejectApplication(String academicZid, String applicationId);
    List<String> getApplications(String topicId);
}`,
      model: `public class TMS {
    private List<Topic> topics;          // composition, 1 TMS ◆— 0..* Topic
    private List<User> users;            // aggregation, 0..* users
}

/** Students and academics share identity; both log in to TMS. */
public abstract class User {
    private String zid;
    private String name;
}

public class Student extends User {
    private List<Application> applications;   // 1 student — 0..* applications
    public Application apply(Topic topic) { ... }
}

public class Academic extends User {
    private List<Topic> supervising;          // 1 academic — 0..* topics
    public void accept(Application a) { ... } // only for topics they supervise
    public void reject(Application a) { ... }
}

public enum TopicStatus { AVAILABLE, UNAVAILABLE }

public class Topic {
    private String id, name, description;
    private Academic supervisor;              // exactly 1
    private TopicStatus status;
    private List<Application> applications;   // composition, 1 topic ◆— 0..* applications
    public boolean isAvailable() { ... }
    public void setStatus(TopicStatus s) { ... }
}

public enum ApplicationStatus { PENDING, ACCEPTED, REJECTED }

/** Association class: a student applying for a topic, with its own state.
 *  A student applies for 1..* topics over time; each application is for
 *  exactly one topic by exactly one student. */
public class Application {
    private String id;
    private Student student;                  // exactly 1
    private Topic topic;                      // exactly 1
    private ApplicationStatus status = ApplicationStatus.PENDING;
    private LocalDateTime submittedAt;
    /** @pre decidedBy is the topic's supervisor and status is PENDING */
    public void accept(Academic decidedBy) { ... }
    public void reject(Academic decidedBy) { ... }
}`,
      must: ['User abstract with Student and Academic (academic is a kind of staff/user)', 'Application as its own class with status, linking one student to one topic',
             'Topic → exactly 1 supervising Academic; status as an enum', 'Cardinalities/composition in comments (topic ◆ applications, student 0..* applications)',
             'Accept/reject placed so only the supervisor can decide'] },

    { title: 'Airline schedules',
      lead: 'Consider an airline booking system with the following requirements.',
      spec: [
        '<b>Passengers</b> have <b>schedules</b> that involve at least one and maybe several <b>flights</b>.',
        'Each flight has a departure date/time and an arrival date/time.',
        'Flights are identified by a name (e.g. QF1) that may be repeated for different days/times.',
        'Flights have a number of <b>seats</b> in several <b>sections</b>: first, business and economy class.',
        'Each flight in each passenger’s schedule includes the class of seat for that flight.',
        'Each flight has a seat allocated for each of its passengers.',
        'The seat allocated to a passenger on a flight must match the seat class in the schedule. Passengers may book, cancel or update flights and seat allocations in their schedule.'
      ],
      breakdown: 'modelling of entities (3) · inheritance and interface design (2) · aggregations, compositions and cardinalities (3) · modelling of functionality (2)',
      controller: `public interface AirlineBookingSystemController {
    String createFlight(String name, LocalDateTime departure, LocalDateTime arrival,
                        int firstSeats, int businessSeats, int economySeats);
    String createPassenger(String name);
    void book(String passengerId, String flightId, String seatClass);
    void cancel(String passengerId, String flightId);
    void changeSeatClass(String passengerId, String flightId, String newSeatClass);
    void changeSeat(String passengerId, String flightId, String seatNumber);
}`,
      model: `public enum SeatClass { FIRST, BUSINESS, ECONOMY }

public class Passenger {
    private String id, name;
    private Schedule schedule;              // composition, 1 passenger ◆— 1 schedule
}

/** A passenger's itinerary: at least one booking once anything is booked. */
public class Schedule {
    private Passenger owner;
    private List<Booking> bookings;         // composition, 1 schedule ◆— 1..* Booking
    public void add(Booking b) { ... }
    public void cancel(Flight f) { ... }    // also releases the seat
    public Booking bookingFor(Flight f) { ... }
}

/** A name like QF1 repeats across days, so the id is name + departure. */
public class Flight {
    private String id;                      // e.g. "QF1@2026-11-28T09:00"
    private String name;
    private LocalDateTime departure, arrival;
    private Map<SeatClass, Section> sections; // composition, 1 flight ◆— 1..3 sections
    public Seat allocate(SeatClass cls) { ... }   // a free seat in that section
    public void release(Seat seat) { ... }
}

public class Section {
    private SeatClass seatClass;
    private List<Seat> seats;               // composition, 1 section ◆— 1..* seats
    public Optional<Seat> firstFree() { ... }
}

public class Seat {
    private String number;
    private Section section;                // so seat.getSeatClass() is derived
    private Booking occupant;               // 0..1
    public boolean isFree() { ... }
}

/** One flight in one passenger's schedule. Invariant:
 *  seat == null || seat.getSeatClass() == seatClass. */
public class Booking {
    private Schedule schedule;              // exactly 1
    private Flight flight;                  // exactly 1 (a flight has 0..* bookings)
    private SeatClass seatClass;
    private Seat seat;                      // 1 once allocated
    public void changeClass(SeatClass c) { ... }  // re-allocates to keep the invariant
    public void changeSeat(Seat s) { ... }        // must match seatClass
}`,
      notes: 'Inheritance and interface marks: seat classes differ only in data here, so an enum (not FirstClassSeat / BusinessSeat subclasses) is the better design — say so in a comment. If classes had different behaviour (e.g. lounge access, baggage rules), an abstract class or a strategy per class would earn those marks.',
      must: ['Schedule as a class holding 1..* bookings', 'Booking links a flight to a seat class and an allocated seat, with the matching invariant documented',
             'Flight ◆ Section ◆ Seat compositions; flight identity handles repeated names', 'Seat class as an enum (or justified hierarchy) — inheritance decisions explained',
             'Book, cancel and update methods placed on the right classes'] }
  ]);

  /* =========================== refactor problems ========================== */

  add(D.REFACTOR, LAB, [
    /* ---------------------------------------------------------------- */
    { title: 'Shopping refactor',
      intro: '<p>A service provider offers checkout services to the two most popular supermarkets in Australia: Coles and Woolworths. The starter code models a fully correct checkout, but it has significant design flaws.</p>' +
        '<p>Describe the design smells you find, justify your refactoring choices at both a low level (code) and a high level (a suitable design pattern, if required), and refactor the code. <b>The behaviour must not change: the tests must pass unchanged</b> — including the constructor taking a supermarket name.</p>' + RECON,
      files: [
        { name: 'CheckoutSystem.java', text: `public class CheckoutSystem {
    private String supermarket;           // "Coles" or "Woolworths"
    private List<Item> cart = new ArrayList<>();
    private int points = 0;

    public CheckoutSystem(String supermarket) { this.supermarket = supermarket; }

    public void addItem(Item item) { cart.add(item); }
    public int getPoints() { return points; }

    public double checkout(String paymentMethod, boolean hasLoyaltyCard) {
        double total = 0;
        for (Item i : cart) {
            total += i.getPrice() * i.getQuantity();
        }
        if (supermarket.equals("Coles")) {
            if (paymentMethod.equals("card")) {
                total = total * 1.005;             // 0.5% card surcharge
            }
            if (hasLoyaltyCard) {
                points += (int) total;             // Flybuys: 1 point per dollar
                System.out.println("Flybuys points: " + points);
            }
        } else if (supermarket.equals("Woolworths")) {
            if (paymentMethod.equals("card")) {
                total = total * 1.005;             // 0.5% card surcharge
            }
            if (hasLoyaltyCard) {
                points += (int) total;             // Everyday Rewards: 1 point per dollar
                if (total > 100) {
                    points += 50;                  // bonus for big shops
                }
                System.out.println("Everyday Rewards points: " + points);
            }
        }
        System.out.println("Receipt for " + supermarket + ": $" + String.format("%.2f", total));
        cart.clear();
        return total;
    }
}` },
        { name: 'CheckoutTest.java', text: `@Test
public void testColesCardWithLoyalty() {
    CheckoutSystem c = new CheckoutSystem("Coles");
    c.addItem(new Item("Milk", 2.0, 50));
    assertEquals(100.5, c.checkout("card", true), 0.001);
    assertEquals(100, c.getPoints());
}

@Test
public void testWoolworthsBonus() {
    CheckoutSystem w = new CheckoutSystem("Woolworths");
    w.addItem(new Item("Bread", 4.0, 30));
    assertEquals(120.0, w.checkout("cash", true), 0.001);
    assertEquals(170, w.getPoints());
}` }
      ],
      smells: '<ul><li><b>Switch on a type code</b>: behaviour branches on the supermarket String; a third supermarket means editing the method (Open-Closed violation).</li>' +
        '<li><b>Duplicated code</b>: the card surcharge and "1 point per dollar" logic appear in both branches.</li>' +
        '<li><b>Long method / low cohesion</b>: one method totals the cart, applies surcharges, runs two loyalty schemes and prints a receipt.</li>' +
        '<li><b>Primitive obsession</b>: supermarket and payment method are Strings, and "card" is a magic value.</li></ul>',
      pattern: { options: ['Strategy', 'Observer', 'Composite', 'Decorator'], correct: 0,
                 why: 'The variation is an algorithm — how a supermarket’s loyalty scheme awards points — chosen per checkout and replaceable, behind one interface: Strategy. (Inheritance with a template method also works; Strategy keeps CheckoutSystem’s public API unchanged.)' },
      task: 'Refactor the code to remove the smells, using a design pattern where appropriate, without changing the tests. Write a short rationale (your "blog post") as a comment.',
      model: `/** Strategy: each supermarket's loyalty scheme. */
public interface LoyaltyProgram {
    String name();
    int pointsFor(double total);
}

public class Flybuys implements LoyaltyProgram {
    public String name() { return "Flybuys"; }
    public int pointsFor(double total) { return (int) total; }
}

public class EverydayRewards implements LoyaltyProgram {
    private static final double BONUS_THRESHOLD = 100;
    private static final int BONUS_POINTS = 50;
    public String name() { return "Everyday Rewards"; }
    public int pointsFor(double total) {
        return (int) total + (total > BONUS_THRESHOLD ? BONUS_POINTS : 0);
    }
}

public class CheckoutSystem {
    private static final double CARD_SURCHARGE = 1.005;

    private final String supermarket;
    private final LoyaltyProgram loyalty;
    private final List<Item> cart = new ArrayList<>();
    private int points = 0;

    /** Unchanged signature, so the tests still pass. */
    public CheckoutSystem(String supermarket) {
        this.supermarket = supermarket;
        this.loyalty = loyaltyFor(supermarket);
    }

    /** The one place a supermarket name is mapped to behaviour. */
    private static LoyaltyProgram loyaltyFor(String supermarket) {
        return switch (supermarket) {
            case "Coles" -> new Flybuys();
            case "Woolworths" -> new EverydayRewards();
            default -> throw new IllegalArgumentException(supermarket);
        };
    }

    public void addItem(Item item) { cart.add(item); }
    public int getPoints() { return points; }

    public double checkout(String paymentMethod, boolean hasLoyaltyCard) {
        double total = applySurcharge(subtotal(), paymentMethod);
        if (hasLoyaltyCard) {
            points += loyalty.pointsFor(total);
            System.out.println(loyalty.name() + " points: " + points);
        }
        System.out.println("Receipt for " + supermarket + ": $" + String.format("%.2f", total));
        cart.clear();
        return total;
    }

    private double subtotal() {
        return cart.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
    }

    private static double applySurcharge(double total, String paymentMethod) {
        return paymentMethod.equals("card") ? total * CARD_SURCHARGE : total;
    }
}

/* Blog: the supermarket switch duplicated the surcharge and points logic and
   forced edits for every new supermarket. Low level: Extract Method
   (subtotal, applySurcharge), named constants, one copy of the surcharge.
   High level: Strategy for loyalty schemes, so a new supermarket is a new
   LoyaltyProgram plus one line in loyaltyFor. Output and API are unchanged. */`,
      notes: 'Check the tests still pass by hand: Coles 50 × 2.0 = 100 × 1.005 = 100.5, 100 points; Woolworths 30 × 4.0 = 120 (cash), 120 + 50 = 170 points. The printed lines must stay identical, since the original behaviour includes them.',
      must: ['Supermarket-specific logic moved into strategy classes (no if/else on the name in checkout)', 'Duplicated surcharge/points logic exists once',
             'Long method split into well-named helpers; magic numbers named', 'Constructor and outputs unchanged so the tests pass', 'Rationale covers both low-level and high-level choices'] },

    /* ---------------------------------------------------------------- */
    { title: 'Barbie',
      intro: '<p>Following the release of the film <i>Barbie</i>, Mattel has hired you to build its platform for tracking product offerings. You have inherited code that represents dolls: Barbie and Ken dolls, and a box in which Barbies can be stored.</p>' +
        '<p>Barbie dolls specifically can come with zero or more <b>accessories</b>. Currently there is support for a <b>car</b> and a <b>dream house</b>, but more accessories may be added in the future. ' + c('App.java') + ' must still produce the correct output, and ' + c('testBarbie') + ' must pass after refactoring.</p>' + RECON,
      files: [
        { name: 'Barbie.java', text: `public class Barbie extends Doll {
    private List<String> accessories = new ArrayList<>();

    public Barbie() { super("Barbie"); }

    public void addAccessory(String accessory) { accessories.add(accessory); }

    @Override
    public double getPrice() {
        double price = 29.99;
        for (String a : accessories) {
            if (a.equals("car")) {
                price += 49.99;
            } else if (a.equals("dream house")) {
                price += 199.99;
            }
        }
        return price;
    }

    @Override
    public String describe() {
        String d = "Barbie";
        for (String a : accessories) {
            if (a.equals("car")) {
                d += " with a convertible car";
            } else if (a.equals("dream house")) {
                d += " with a dream house";
            }
        }
        return d;
    }
}` },
        { name: 'Doll.java / Ken.java', text: `public abstract class Doll {
    private String name;
    public Doll(String name) { this.name = name; }
    public String getName() { return name; }
    public abstract double getPrice();
    public abstract String describe();
}

public class Ken extends Doll {
    public Ken() { super("Ken"); }
    public double getPrice() { return 24.99; }
    public String describe() { return "Ken"; }
}` },
        { name: 'BarbieBox.java', text: `public class BarbieBox {
    private List<Barbie> barbies = new ArrayList<>();
    public void add(Barbie b) { barbies.add(b); }
    public double getPrice() {
        double total = 0;
        for (Barbie b : barbies) total += b.getPrice();
        return total;
    }
}` },
        { name: 'BarbieTest.java', text: `@Test
public void testBarbie() {
    BarbieDoll barbie = new DreamHouse(new Car(new Barbie()));
    assertEquals(279.97, barbie.getPrice(), 0.001);
    assertEquals("Barbie with a convertible car with a dream house", barbie.describe());

    BarbieBox box = new BarbieBox();
    box.add(barbie);
    box.add(new Barbie());
    assertEquals(309.96, box.getPrice(), 0.001);
}` }
      ],
      parts: [
        { kind: 'written', marks: 2,
          prompt: 'Identify one class where the code fails to satisfy the Open-Closed Principle, and explain how the principle is violated. Also name the design pattern you will use.',
          model: '<p><b>Barbie</b> violates the Open-Closed Principle. Accessories are Strings checked in an if/else chain in both ' + c('getPrice()') + ' and ' + c('describe()') + '. Adding a new accessory (e.g. a horse) means modifying Barbie — two methods, kept in sync — rather than extending the system with new code. An unknown string is also silently ignored.</p>' +
            '<p>Pattern: <b>Decorator</b> — each accessory wraps a Barbie and adds its price and description.</p>',
          checklist: ['Named Barbie (getPrice/describe)', 'Explained: new accessory requires modifying existing methods', 'Named Decorator'] },
        { kind: 'code', marks: 8, lang: 'Java',
          prompt: 'Using a design pattern of your choosing, refactor the code to improve its design so that ' + c('testBarbie') + ' passes. Accessories must only apply to Barbies, and a decorated Barbie must still fit in a BarbieBox.',
          prefill: 'FILES',
          model: `/** Component for anything Barbie-shaped: a Barbie, or a Barbie with accessories. */
public interface BarbieDoll {
    double getPrice();
    String describe();
}

public abstract class Doll {
    private final String name;
    protected Doll(String name) { this.name = name; }
    public String getName() { return name; }
    public abstract double getPrice();
    public abstract String describe();
}

/** Concrete component: a plain Barbie. */
public class Barbie extends Doll implements BarbieDoll {
    public Barbie() { super("Barbie"); }
    public double getPrice() { return 29.99; }
    public String describe() { return "Barbie"; }
}

public class Ken extends Doll {
    public Ken() { super("Ken"); }
    public double getPrice() { return 24.99; }
    public String describe() { return "Ken"; }
}

/** Abstract decorator: wraps a BarbieDoll, so accessories only go on Barbies
 *  and can be stacked in any combination. */
public abstract class Accessory implements BarbieDoll {
    private final BarbieDoll barbie;
    private final double price;
    private final String description;

    protected Accessory(BarbieDoll barbie, double price, String description) {
        this.barbie = barbie; this.price = price; this.description = description;
    }
    public double getPrice() { return barbie.getPrice() + price; }
    public String describe() { return barbie.describe() + " with " + description; }
}

public class Car extends Accessory {
    public Car(BarbieDoll b) { super(b, 49.99, "a convertible car"); }
}

public class DreamHouse extends Accessory {
    public DreamHouse(BarbieDoll b) { super(b, 199.99, "a dream house"); }
}

public class BarbieBox {
    private final List<BarbieDoll> barbies = new ArrayList<>();
    public void add(BarbieDoll b) { barbies.add(b); }
    public double getPrice() {
        return barbies.stream().mapToDouble(BarbieDoll::getPrice).sum();
    }
}

/* A new accessory is one new class; nothing existing changes (Open-Closed).
   BarbieDoll keeps the box type-safe: Ken cannot go in, decorated Barbies can.
   App.java changes from barbie.addAccessory("car") to new Car(barbie). */`,
          checklist: ['A shared BarbieDoll (component) interface', 'Abstract decorator holding a wrapped BarbieDoll; Car and DreamHouse as decorators',
                      'No string conditionals remain', 'BarbieBox accepts decorated Barbies but not Ken', 'Test values: 279.97 and 309.96'] }
      ] },

    /* ---------------------------------------------------------------- */
    { title: 'Engineering',
      intro: '<p>In the ' + c('engineering') + ' package, the classes ' + c('Employee') + ', ' + c('Engineer') + ', ' + c('SalesMan') + ' and ' + c('SalesHistory') + ' suffer from various code smells. Applying suitable refactoring techniques, modify the Java source to address each of these smells:</p>' +
        '<ul><li>Refused Bequest</li><li>Duplicated code</li><li>Excessive coupling between classes</li><li>Lazy class</li></ul>' +
        '<p>You <b>must</b> include brief comments in your code identifying each smell and the refactoring technique used. Behaviour must not change.</p>' + RECON,
      files: [
        { name: 'Employee.java', text: `public class Employee {
    protected String name;
    protected double baseSalary;

    public Employee(String name, double baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
    }

    public String getName() { return name; }

    /** Only salesmen have targets. */
    public double getSalesTarget() { return 0; }
}` },
        { name: 'Engineer.java', text: `public class Engineer extends Employee {
    private double bonus;

    public Engineer(String name, double baseSalary, double bonus) {
        super(name, baseSalary);
        this.bonus = bonus;
    }

    @Override
    public double getSalesTarget() {
        throw new UnsupportedOperationException("Engineers have no sales target");
    }

    public double netPay() {
        double gross = baseSalary + bonus;
        if (gross > 120000) {
            return 84000 + (gross - 120000) * 0.55;
        }
        return gross * 0.7;
    }
}` },
        { name: 'SalesMan.java', text: `public class SalesMan extends Employee {
    private double salesTarget;
    private SalesHistory history = new SalesHistory();

    public SalesMan(String name, double baseSalary, double salesTarget) {
        super(name, baseSalary);
        this.salesTarget = salesTarget;
    }

    @Override
    public double getSalesTarget() { return salesTarget; }

    public void recordSale(double amount) { history.sales.add(amount); }

    public boolean metTarget() {
        double total = 0;
        for (double s : history.sales) total += s;
        return total >= salesTarget;
    }

    public double netPay() {
        double commission = 0;
        for (double s : history.sales) commission += s * history.commissionRate;
        double gross = baseSalary + commission;
        if (gross > 120000) {
            return 84000 + (gross - 120000) * 0.55;
        }
        return gross * 0.7;
    }
}` },
        { name: 'SalesHistory.java', text: `public class SalesHistory {
    public List<Double> sales = new ArrayList<>();
    public double commissionRate = 0.05;
}` }
      ],
      parts: [
        { kind: 'written', marks: 3,
          prompt: 'For each of the four smells, say exactly where it occurs in the starter code and which refactoring technique you will use.',
          model: '<ul><li><b>Refused Bequest</b>: ' + c('Employee.getSalesTarget()') + ' only makes sense for salesmen, so ' + c('Engineer') + ' refuses it by throwing (also an LSP violation). <i>Push Down Method</i> into SalesMan.</li>' +
            '<li><b>Duplicated code</b>: the tax calculation in ' + c('netPay()') + ' is copied in Engineer and SalesMan. <i>Pull Up Method</i>: Employee computes ' + c('netPay()') + ' from an abstract ' + c('grossPay()') + ' that each subclass supplies.</li>' +
            '<li><b>Excessive coupling</b>: SalesMan reaches into SalesHistory’s public fields (' + c('history.sales') + ', ' + c('history.commissionRate') + ') and iterates them itself. <i>Encapsulate Field</i> + <i>Move Method</i>: SalesHistory offers ' + c('total()') + ' and ' + c('commission()') + '.</li>' +
            '<li><b>Lazy class</b>: SalesHistory does nothing but hold two public fields. Either <i>Inline Class</i> into SalesMan, or (as here) give it the behaviour that belongs to it, which also fixes the coupling.</li></ul>',
          checklist: ['Refused bequest located (getSalesTarget / Engineer throwing) with Push Down Method', 'Duplicated tax logic located with Pull Up Method',
                      'Coupling via SalesHistory public fields with Encapsulate/Move Method', 'Lazy class SalesHistory with Inline Class or move behaviour into it'] },
        { kind: 'code', marks: 12, lang: 'Java',
          prompt: 'Refactor the four classes to remove all four smells, with a comment at each change naming the smell and the technique.',
          prefill: 'FILES',
          model: `public abstract class Employee {
    private static final double TAX_THRESHOLD = 120000;
    private static final double BASE_RATE_KEPT = 0.7;
    private static final double TOP_RATE_KEPT = 0.55;

    private final String name;
    protected final double baseSalary;

    protected Employee(String name, double baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
    }

    public String getName() { return name; }

    // REFUSED BEQUEST: getSalesTarget() removed from Employee
    // (Push Down Method into SalesMan), so Engineer no longer refuses it.

    /** Each kind of employee knows its own gross pay. */
    protected abstract double grossPay();

    // DUPLICATED CODE: the tax calculation was copied in Engineer and
    // SalesMan. Pull Up Method: it now exists once, here.
    public double netPay() {
        double gross = grossPay();
        if (gross > TAX_THRESHOLD) {
            return TAX_THRESHOLD * BASE_RATE_KEPT + (gross - TAX_THRESHOLD) * TOP_RATE_KEPT;
        }
        return gross * BASE_RATE_KEPT;
    }
}

public class Engineer extends Employee {
    private final double bonus;

    public Engineer(String name, double baseSalary, double bonus) {
        super(name, baseSalary);
        this.bonus = bonus;
    }

    @Override
    protected double grossPay() { return baseSalary + bonus; }
}

public class SalesMan extends Employee {
    private final double salesTarget;
    private final SalesHistory history = new SalesHistory();

    public SalesMan(String name, double baseSalary, double salesTarget) {
        super(name, baseSalary);
        this.salesTarget = salesTarget;
    }

    // REFUSED BEQUEST: pushed down from Employee.
    public double getSalesTarget() { return salesTarget; }

    // EXCESSIVE COUPLING: SalesMan no longer touches SalesHistory's fields;
    // it asks SalesHistory to do the work (Move Method / Hide Delegate).
    public void recordSale(double amount) { history.record(amount); }
    public boolean metTarget() { return history.total() >= salesTarget; }

    @Override
    protected double grossPay() { return baseSalary + history.commission(); }
}

// LAZY CLASS: SalesHistory was just two public fields. Rather than inline
// it, its fields are now private (Encapsulate Field) and it owns the
// behaviour on its data (Move Method), so it earns its place.
public class SalesHistory {
    private static final double COMMISSION_RATE = 0.05;
    private final List<Double> sales = new ArrayList<>();

    public void record(double amount) { sales.add(amount); }
    public double total() { return sales.stream().mapToDouble(Double::doubleValue).sum(); }
    public double commission() { return total() * COMMISSION_RATE; }
}`,
          notes: 'Inlining SalesHistory into SalesMan is an equally valid fix for the lazy class, and also removes the coupling; say which you chose and why. Check the arithmetic is unchanged: 84000 = 120000 × 0.7, so the pulled-up formula gives identical results.',
          checklist: ['getSalesTarget no longer on Employee; Engineer no longer throws', 'Tax calculation exists once (pulled up), with subclasses supplying gross pay',
                      'SalesHistory fields private; SalesMan uses methods, not fields', 'SalesHistory given behaviour or inlined', 'Each change has a comment naming smell + technique'] }
      ] },

    /* ---------------------------------------------------------------- */
    { title: 'Gardening',
      intro: '<p>William is developing a system for his flower-selling business, and the code violates several design principles.</p>' +
        '<ul><li>He sells <b>Roses</b>, <b>Sunflowers</b> and <b>Daisies</b>. Before harvesting, he plants the matching <b>Seedling</b> in one of his <b>FlowerBeds</b>; a seedling always produces its own flower type.</li>' +
        '<li>Watering a seedling increases its age, which increases the value of the flower it produces. At harvest time, every seedling in every bed is harvested, and William can sell all harvested flowers at any time.</li>' +
        '<li>Sunflowers are only ever yellow. Roses and daisies come in red, pink, yellow and white; colour and age affect their price.</li>' +
        '<li>Roses and daisies are perennial: after harvest their age resets and they grow a new flower in a new random colour. Sunflowers are annual: harvesting one a second time returns a worthless <b>FlowerBud</b>.</li>' +
        '<li>A harvested sunflower has a random number of seeds from 0 to 20, which affects its price. Each rose is packaged with a message that depends on its colour.</li></ul>' + RECON,
      files: [
        { name: 'Flower.java', text: `public class Flower {
    protected Colour colour;
    protected int age;

    public Flower(Colour colour, int age) { this.colour = colour; this.age = age; }
    public Colour getColour() { return colour; }
    public void setColour(Colour colour) { this.colour = colour; }
    public double getPrice() { return age; }
    /** Perennials start growing a new flower after harvest. */
    public void regrow() { age = 0; }
}

public class Rose extends Flower {
    public Rose(Colour colour, int age) { super(colour, age); }
    public double getPrice() { return age * (colour == Colour.RED ? 3.0 : 2.0); }
    public String getMessage() { return colour == Colour.RED ? "I love you" : "Thinking of you"; }
}

public class Daisy extends Flower {
    public Daisy(Colour colour, int age) { super(colour, age); }
    public double getPrice() { return age * (colour == Colour.WHITE ? 1.5 : 1.0); }
}

public class Sunflower extends Flower {
    private int seeds;
    public Sunflower(int age, int seeds) { super(Colour.YELLOW, age); this.seeds = seeds; }
    @Override
    public void setColour(Colour colour) {
        throw new UnsupportedOperationException("Sunflowers are always yellow");
    }
    @Override
    public void regrow() {
        throw new UnsupportedOperationException("Sunflowers are annual");
    }
    public double getPrice() { return age * 0.5 + seeds * 0.2; }
}

public class FlowerBud extends Flower {
    public FlowerBud() { super(Colour.YELLOW, 0); }
    public double getPrice() { return 0; }
}` },
        { name: 'Seedlings.java', text: `public abstract class Seedling {
    protected int age = 0;
    public void water() { age++; }
    public abstract Flower harvest();
}

public class RoseSeedling extends Seedling {
    public Flower harvest() {
        Colour[] colours = Colour.values();
        Colour colour = colours[new Random().nextInt(colours.length)];
        Flower f = new Rose(colour, age);
        age = 0;
        return f;
    }
}

public class DaisySeedling extends Seedling {
    public Flower harvest() {
        Colour[] colours = Colour.values();
        Colour colour = colours[new Random().nextInt(colours.length)];
        Flower f = new Daisy(colour, age);
        age = 0;
        return f;
    }
}

public class SunflowerSeedling extends Seedling {
    private boolean harvested = false;
    public Flower harvest() {
        if (harvested) return new FlowerBud();
        harvested = true;
        return new Sunflower(age, new Random().nextInt(21));
    }
}` },
        { name: 'FlowerSystem.java', text: `public class FlowerBed {
    private List<Seedling> seedlings = new ArrayList<>();
    public void plant(Seedling s) { seedlings.add(s); }
    public List<Seedling> getSeedlings() { return seedlings; }
}

public class FlowerSystem {
    private List<FlowerBed> beds = new ArrayList<>();
    private List<Flower> harvested = new ArrayList<>();

    public void addBed() { beds.add(new FlowerBed()); }

    public void plant(int bed, String type) {
        if (type.equals("rose")) beds.get(bed).plant(new RoseSeedling());
        else if (type.equals("daisy")) beds.get(bed).plant(new DaisySeedling());
        else if (type.equals("sunflower")) beds.get(bed).plant(new SunflowerSeedling());
    }

    public void waterAll() {
        for (FlowerBed b : beds) {
            for (Seedling s : b.getSeedlings()) {
                s.water();
            }
        }
    }

    public void harvestAll() {
        for (FlowerBed b : beds) {
            for (Seedling s : b.getSeedlings()) {
                harvested.add(s.harvest());
            }
        }
    }

    public double sellAll() {
        double total = 0;
        for (Flower f : harvested) total += f.getPrice();
        harvested.clear();
        return total;
    }
}` }
      ],
      parts: [
        { kind: 'written', marks: 3,
          label: 'a) i)', prompt: 'There is a Liskov Substitution Principle violation. Identify which classes cause it, and give two instances where the principle is violated between them.',
          model: '<p>Between <b>Flower</b> and <b>Sunflower</b>. Flower’s contract says any flower can have its colour changed and can regrow after harvest; Sunflower inherits both but cannot honour them:</p>' +
            '<ul><li><b>' + c('setColour') + '</b>: Flower sets the colour; Sunflower throws ' + c('UnsupportedOperationException') + ' — a weakened postcondition (or strengthened precondition: "only YELLOW").</li>' +
            '<li><b>' + c('regrow') + '</b>: Flower resets the age; Sunflower throws — again it cannot do what the parent promises.</li></ul>' +
            '<p>Client code that calls ' + c('flower.regrow()') + ' or ' + c('flower.setColour(RED)') + ' on "a Flower" crashes when it is a Sunflower, so Sunflower is not substitutable. (FlowerBud similarly inherits meaningless colour and regrowth behaviour.)</p>',
          checklist: ['Named Flower and Sunflower', 'Instance 1: setColour throws', 'Instance 2: regrow throws', 'Explained why: a client of Flower breaks (substitutability)'] },
        { kind: 'code', marks: 4, lang: 'Java',
          label: 'a) ii)', prompt: 'Refactor the code to remove the LSP violation.',
          prefill: '// Restructure the Flower hierarchy here\n',
          model: `/** Every flower has a colour and an age, and can be priced.
 *  No colour-changing or regrowth promises here. */
public abstract class Flower {
    private final Colour colour;
    protected final int age;
    protected Flower(Colour colour, int age) { this.colour = colour; this.age = age; }
    public Colour getColour() { return colour; }
    public abstract double getPrice();
}

/** Perennials (roses, daisies) are the only flowers that regrow, so only
 *  they promise it. */
public abstract class PerennialFlower extends Flower {
    protected PerennialFlower(Colour colour, int age) { super(colour, age); }
}

public class Rose extends PerennialFlower { ... }   // getPrice, getMessage
public class Daisy extends PerennialFlower { ... }

public class Sunflower extends Flower {
    private final int seeds;
    public Sunflower(int age, int seeds) { super(Colour.YELLOW, age); this.seeds = seeds; }
    public double getPrice() { return age * 0.5 + seeds * 0.2; }
}

public class FlowerBud extends Flower {
    public FlowerBud() { super(Colour.YELLOW, 0); }
    public double getPrice() { return 0; }
}

/* Colour is now immutable (set at creation: a perennial produces a NEW
   flower in a new colour each harvest), and regrowth belongs to the
   perennial seedling, which resets its age. No subclass throws from an
   inherited method, so every Flower is substitutable. */`,
          checklist: ['No subclass overrides an inherited method to throw', 'Removed setColour/regrow from Flower (or moved to a perennial-only type)', 'Hierarchy reflects perennial vs annual', 'Behaviour preserved'] },
        { kind: 'code', marks: 4, lang: 'Java',
          label: 'b)', prompt: 'William noticed a Law of Demeter violation in ' + c('FlowerSystem') + '. Identify the method(s) where it occurs (in a comment) and refactor to remove it.',
          prefill: '// Which method violates the Law of Demeter, and why?\n\n',
          model: `// LAW OF DEMETER: waterAll() and harvestAll() call b.getSeedlings() and
// then call methods on the Seedlings — objects FlowerSystem got from
// another object's getter ("strangers"). FlowerSystem should only talk to
// its direct collaborators, the FlowerBeds.

public class FlowerBed {
    private final List<Seedling> seedlings = new ArrayList<>();
    public void plant(Seedling s) { seedlings.add(s); }
    public void waterAll() { seedlings.forEach(Seedling::water); }
    public List<Flower> harvestAll() {
        return seedlings.stream().map(Seedling::harvest).toList();
    }
    // getSeedlings() removed: nothing outside needs the internal list
}

public class FlowerSystem {
    ...
    public void waterAll() { beds.forEach(FlowerBed::waterAll); }
    public void harvestAll() {
        for (FlowerBed b : beds) harvested.addAll(b.harvestAll());
    }
}`,
          checklist: ['Identified waterAll (and harvestAll) reaching through getSeedlings()', 'FlowerBed gains waterAll/harvestAll methods', 'FlowerSystem talks only to FlowerBeds', 'Internal list no longer exposed'] },
        { kind: 'written', marks: 2,
          label: 'c)', prompt: 'William says: <i>"The logic for creating flowers is spread out across many different classes, which makes it very difficult to keep track of it all! I even duplicated some code when creating two different flowers!"</i> Which design pattern best solves this? Briefly justify.',
          model: '<p><b>Factory</b> (a simple factory / Factory Method). Creation is scattered: FlowerSystem.plant turns strings into seedlings, and each seedling builds its own flower, with the random-colour code duplicated in RoseSeedling and DaisySeedling. A ' + c('FlowerFactory') + ' centralises the creation of flowers (and seedlings) in one place: the shared random-colour logic exists once, and adding a flower type means changing one class rather than hunting through several.</p>',
          checklist: ['Named Factory', 'Justified: centralises scattered creation logic', 'Removes the duplicated random-colour code'] },
        { kind: 'code', marks: 7, lang: 'Java',
          label: 'd)', prompt: 'Refactor the code to implement your chosen pattern.',
          prefill: 'public class FlowerFactory {\n    // TODO\n}\n',
          model: `/** All flower and seedling creation lives here. */
public class FlowerFactory {
    private final Random random;
    public FlowerFactory(Random random) { this.random = random; }   // injectable for tests

    public Flower createRose(int age)  { return new Rose(randomColour(), age); }
    public Flower createDaisy(int age) { return new Daisy(randomColour(), age); }
    public Flower createSunflower(int age) { return new Sunflower(age, random.nextInt(21)); }
    public Flower createBud() { return new FlowerBud(); }

    /** Was duplicated in RoseSeedling and DaisySeedling. */
    private Colour randomColour() {
        Colour[] colours = Colour.values();
        return colours[random.nextInt(colours.length)];
    }

    public Seedling createSeedling(String type) {
        return switch (type) {
            case "rose" -> new PerennialSeedling(this::createRose);
            case "daisy" -> new PerennialSeedling(this::createDaisy);
            case "sunflower" -> new SunflowerSeedling(this);
            default -> throw new IllegalArgumentException(type);
        };
    }
}

public abstract class Seedling {
    protected int age = 0;
    public void water() { age++; }
    public abstract Flower harvest();
}

/** Roses and daisies behave identically apart from the flower they make,
 *  so one class replaces RoseSeedling and DaisySeedling. */
public class PerennialSeedling extends Seedling {
    private final IntFunction<Flower> grow;
    public PerennialSeedling(IntFunction<Flower> grow) { this.grow = grow; }
    public Flower harvest() {
        Flower f = grow.apply(age);
        age = 0;                       // perennial: starts a new flower
        return f;
    }
}

public class SunflowerSeedling extends Seedling {
    private final FlowerFactory factory;
    private boolean harvested = false;
    public SunflowerSeedling(FlowerFactory f) { this.factory = f; }
    public Flower harvest() {
        if (harvested) return factory.createBud();
        harvested = true;
        return factory.createSunflower(age);
    }
}

public class FlowerSystem {
    private final FlowerFactory factory = new FlowerFactory(new Random());
    ...
    public void plant(int bed, String type) {
        beds.get(bed).plant(factory.createSeedling(type));
    }
}`,
          checklist: ['A factory class owns flower (and seedling) creation', 'Random-colour logic exists once', 'Seedlings and FlowerSystem create through the factory, not with new/if chains',
                      'Behaviour preserved (annual vs perennial, seeds 0–20)'] }
      ] }
  ]);

  /* ========================= build-from-scratch ========================== */

  add(D.SCRATCH, LAB, [
    { title: 'Shipping discounts',
      intro: '<p>The class ' + c('Product') + ' represents a product in an online store with a price and a weight; the weight is used to calculate the shipping cost. Using the <b>Decorator</b> pattern:</p>' +
        '<ul><li>Implement ' + c('DiscountDecorator') + ', which discounts the price of a product by a given percentage. Multiple discounts are applied cumulatively: a 20% discount on $100 gives $80, and a further 20% discount gives $64.</li>' +
        '<li>Implement ' + c('FreeShippingDecorator') + ', which makes shipping free for products <b>over</b> a given price and <b>under</b> a given weight. If it is applied to a discounted product, whether it qualifies depends on the <i>discounted</i> price.</li></ul>' + RECON,
      files: [
        { name: 'Product.java', text: `public interface Product {
    double getPrice();
    double getWeight();          // kg
    double getShippingCost();
}

public class BasicProduct implements Product {
    private final String name;
    private final double price, weight;

    public BasicProduct(String name, double price, double weight) {
        this.name = name; this.price = price; this.weight = weight;
    }
    public double getPrice() { return price; }
    public double getWeight() { return weight; }
    public double getShippingCost() { return 5.0 + 1.0 * weight; }
}` },
        { name: 'ProductTest.java', text: `@Test
public void testCumulativeDiscounts() {
    Product p = new BasicProduct("Kettle", 100, 2);
    Product twice = new DiscountDecorator(new DiscountDecorator(p, 20), 20);
    assertEquals(64.0, twice.getPrice(), 0.001);
    assertEquals(7.0, twice.getShippingCost(), 0.001);   // shipping unchanged
}

@Test
public void testFreeShippingUsesDiscountedPrice() {
    Product p = new BasicProduct("Kettle", 100, 2);
    assertEquals(0.0, new FreeShippingDecorator(p, 50, 5).getShippingCost(), 0.001);

    Product cheap = new FreeShippingDecorator(new DiscountDecorator(p, 60), 50, 5);
    assertEquals(40.0, cheap.getPrice(), 0.001);
    assertEquals(7.0, cheap.getShippingCost(), 0.001);    // 40 is not over 50
}` }
      ],
      parts: [
        { kind: 'written', marks: 3,
          prompt: 'Explain how the Decorator pattern applies here, mapping each role to a class, and explain why the order in which decorators are applied matters.',
          model: '<p><b>Component</b>: ' + c('Product') + '. <b>Concrete component</b>: ' + c('BasicProduct') + '. <b>Abstract decorator</b>: ' + c('ProductDecorator implements Product') + ', holding a wrapped Product and delegating every method by default. <b>Concrete decorators</b>: ' + c('DiscountDecorator') + ' overrides ' + c('getPrice') + '; ' + c('FreeShippingDecorator') + ' overrides ' + c('getShippingCost') + '.</p>' +
            '<p>Decorators stack at runtime, and each sees only what it wraps. ' + c('FreeShipping(Discount(p))') + ' checks the discounted price, as the spec requires; ' + c('Discount(FreeShipping(p))') + ' checks the original price, so a heavily discounted product could still ship free. Cumulative discounts work because each discount multiplies whatever price the inner product reports.</p>',
          checklist: ['Roles mapped: component, concrete component, abstract and concrete decorators', 'Each decorator changes one behaviour and delegates the rest', 'Order explained with the discounted-price rule'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('DiscountDecorator') + ' (and any abstract decorator you need) so that ' + c('testCumulativeDiscounts') + ' passes.',
          prefill: 'public abstract class ProductDecorator implements Product {\n    // TODO\n}\n\npublic class DiscountDecorator extends ProductDecorator {\n    // TODO\n}',
          model: `/** Abstract decorator: passes everything through by default. */
public abstract class ProductDecorator implements Product {
    protected final Product inner;
    protected ProductDecorator(Product inner) { this.inner = inner; }
    public double getPrice() { return inner.getPrice(); }
    public double getWeight() { return inner.getWeight(); }
    public double getShippingCost() { return inner.getShippingCost(); }
}

public class DiscountDecorator extends ProductDecorator {
    private final double percent;
    public DiscountDecorator(Product inner, double percent) {
        super(inner);
        this.percent = percent;
    }
    @Override
    public double getPrice() {
        return inner.getPrice() * (1 - percent / 100);   // cumulative: applies to the inner price
    }
}`,
          checklist: ['Abstract decorator implementing Product and delegating', 'Discount multiplies the inner price (cumulative)', 'Shipping and weight untouched'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('FreeShippingDecorator') + ' so that ' + c('testFreeShippingUsesDiscountedPrice') + ' passes.',
          prefill: 'public class FreeShippingDecorator extends ProductDecorator {\n    // TODO\n}',
          model: `public class FreeShippingDecorator extends ProductDecorator {
    private final double minPrice, maxWeight;

    public FreeShippingDecorator(Product inner, double minPrice, double maxWeight) {
        super(inner);
        this.minPrice = minPrice;
        this.maxWeight = maxWeight;
    }

    private boolean qualifies() {
        // uses the wrapped product's price, so an inner discount counts
        return inner.getPrice() > minPrice && inner.getWeight() < maxWeight;
    }

    @Override
    public double getShippingCost() {
        return qualifies() ? 0.0 : inner.getShippingCost();
    }
}`,
          checklist: ['Strictly over the price and strictly under the weight', 'Uses the inner (possibly discounted) price', 'Otherwise delegates shipping to the inner product'] }
      ] },

    { title: 'Business rules',
      intro: '<p>Commercial programs often act only when a set of <b>business rules</b> is true. Available:</p>' +
        '<ul><li><b>Group operators</b>: ' + c('AND') + ', ' + c('OR') + ' — evaluate two rules and combine them.</li>' +
        '<li><b>Comparison operators</b>: ' + c('NOT BLANK') + ' (false if the value is null, empty or only whitespace; always true for numbers) and ' + c('GREATER THAN') + ' (A &gt; B for numbers; throws ' + c('BusinessRuleException("Both arguments have to be numeric")') + ' if either is not numeric or B is missing).</li>' +
        '<li><b>LOOKUP</b> values: a named variable looked up in a ' + c('Map<String, Object>') + ' (null if absent), of type Double or String. <b>CONSTANT</b> values: always numeric (doubles).</li></ul>' +
        '<p>Rules arrive as JSON and always evaluate to a boolean. Design a solution, using patterns from the course, that can easily be extended with more operators. Fill in ' + c('BusinessRuleMain.generateRule') + ', which takes the JSON string and returns a ' + c('BusinessRule') + '. JSON data must be extracted into classes; do not store JSON objects.</p>',
      files: [
        { name: 'Example rule (JSON)', text: `{
  "Operator": "AND",
  "Args": [
    {
      "Operator": "GREATER THAN",
      "Args": [
        { "Operator": "LOOKUP", "Arg": "responses" },
        { "Operator": "CONSTANT", "Arg": 2 }
      ]
    },
    {
      "Operator": "OR",
      "Args": [
        { "Operator": "NOT BLANK", "Arg": { "Operator": "LOOKUP", "Arg": "email" } },
        { "Operator": "NOT BLANK", "Arg": { "Operator": "LOOKUP", "Arg": "phoneNumber" } }
      ]
    }
  ]
}` },
        { name: 'BusinessRuleMain.java', text: `public interface BusinessRule {
    boolean evaluate(Map<String, Object> values);
}

public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String msg) { super(msg); }
}

public class BusinessRuleMain {
    /** Parses the JSON rule into objects (gson or org.json). */
    public static BusinessRule generateRule(String inputBusinessRule) {
        // TODO
    }
}` },
        { name: 'BusinessRuleTest.java', text: `@Test
public void testExampleRule() {
    BusinessRule rule = BusinessRuleMain.generateRule(EXAMPLE_JSON);
    assertTrue(rule.evaluate(Map.of("responses", 3.0, "email", "  ", "phoneNumber", "0412")));
    assertFalse(rule.evaluate(Map.of("responses", 3.0, "email", " ")));       // both blank/missing
    assertFalse(rule.evaluate(Map.of("responses", 2.0, "email", "a@b.com")));  // not > 2
}

@Test
public void testNonNumeric() {
    BusinessRule rule = BusinessRuleMain.generateRule(EXAMPLE_JSON);
    assertThrows(BusinessRuleException.class,
        () -> rule.evaluate(Map.of("responses", "lots", "email", "a@b.com")));
}` }
      ],
      parts: [
        { kind: 'written', marks: 3,
          prompt: 'Justify your design choices: which pattern(s) you use and how the problem maps onto them. (In the exercise this goes in Q1.txt; a paragraph is enough.)',
          model: '<p><b>Composite</b> is the core: a rule is a tree. ' + c('BusinessRule') + ' is the component with ' + c('evaluate(values)') + '. ' + c('AndRule') + ' and ' + c('OrRule') + ' are composites holding child rules and combining their results; ' + c('IsNotBlankRule') + ' and ' + c('GreaterThanRule') + ' are the leaves of the rule tree, which in turn hold ' + c('Value') + ' operands (' + c('Lookup') + ', ' + c('Constant') + '). Evaluating the root evaluates the whole tree recursively, and clients treat a single comparison and a complex group the same way.</p>' +
            '<p>A <b>Factory</b> (' + c('BusinessRuleFactory') + ') turns JSON into this object tree, so JSON handling lives in one place and no JSON objects are stored. A new operator is one new class plus one case in the factory, leaving existing rules untouched (Open-Closed).</p>',
          checklist: ['Composite: groups as composites, comparisons as leaves, recursive evaluate', 'Values (lookup/constant) modelled as objects', 'Factory for JSON → objects; no stored JSON', 'Extensibility for new operators'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement the rule and value classes so that a rule tree, built by hand, evaluates correctly (including the exception).',
          prefill: 'public interface Value {\n    // TODO\n}\n\n// Lookup, Constant, AndRule, OrRule, IsNotBlankRule, GreaterThanRule\n',
          model: `public interface Value {
    Object resolve(Map<String, Object> values);
}

public class Lookup implements Value {
    private final String name;
    public Lookup(String name) { this.name = name; }
    public Object resolve(Map<String, Object> values) { return values.get(name); }  // null if absent
}

public class Constant implements Value {
    private final double value;
    public Constant(double value) { this.value = value; }
    public Object resolve(Map<String, Object> values) { return value; }
}

/** Shared base for AND / OR. */
public abstract class GroupRule implements BusinessRule {
    protected final BusinessRule left, right;
    protected GroupRule(BusinessRule left, BusinessRule right) { this.left = left; this.right = right; }
}

public class AndRule extends GroupRule {
    public AndRule(BusinessRule l, BusinessRule r) { super(l, r); }
    public boolean evaluate(Map<String, Object> v) { return left.evaluate(v) && right.evaluate(v); }
}

public class OrRule extends GroupRule {
    public OrRule(BusinessRule l, BusinessRule r) { super(l, r); }
    public boolean evaluate(Map<String, Object> v) { return left.evaluate(v) || right.evaluate(v); }
}

public class IsNotBlankRule implements BusinessRule {
    private final Value arg;
    public IsNotBlankRule(Value arg) { this.arg = arg; }
    public boolean evaluate(Map<String, Object> values) {
        Object v = arg.resolve(values);
        if (v == null) return false;
        if (v instanceof String s) return !s.isBlank();
        return true;                              // numbers and booleans are never blank
    }
}

public class GreaterThanRule implements BusinessRule {
    private final Value a, b;                     // b may be null if not supplied
    public GreaterThanRule(Value a, Value b) { this.a = a; this.b = b; }
    public boolean evaluate(Map<String, Object> values) {
        Object x = a.resolve(values);
        Object y = b == null ? null : b.resolve(values);
        if (!(x instanceof Number) || !(y instanceof Number)) {
            throw new BusinessRuleException("Both arguments have to be numeric");
        }
        return ((Number) x).doubleValue() > ((Number) y).doubleValue();
    }
}`,
          checklist: ['BusinessRule implemented by composite AND/OR and leaf comparison rules', 'Lookup/Constant values; missing lookup → null', 'NOT BLANK: null/blank false, numbers true', 'GREATER THAN throws for non-numeric or missing B', 'No duplicated group logic'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('generateRule') + ', parsing the JSON into your classes (gson or org.json).',
          prefill: 'public class BusinessRuleMain {\n    public static BusinessRule generateRule(String inputBusinessRule) {\n        // TODO\n    }\n}',
          model: `public class BusinessRuleFactory {
    public static BusinessRule rule(JsonObject o) {
        String op = o.get("Operator").getAsString();
        switch (op) {
            case "AND":
            case "OR": {
                JsonArray args = o.getAsJsonArray("Args");
                BusinessRule l = rule(args.get(0).getAsJsonObject());
                BusinessRule r = rule(args.get(1).getAsJsonObject());
                return op.equals("AND") ? new AndRule(l, r) : new OrRule(l, r);
            }
            case "NOT BLANK":
                return new IsNotBlankRule(value(o.getAsJsonObject("Arg")));
            case "GREATER THAN": {
                JsonArray args = o.getAsJsonArray("Args");
                Value b = args.size() > 1 ? value(args.get(1).getAsJsonObject()) : null;
                return new GreaterThanRule(value(args.get(0).getAsJsonObject()), b);
            }
            default:
                throw new IllegalArgumentException("Unknown operator: " + op);
        }
    }

    static Value value(JsonObject o) {
        String op = o.get("Operator").getAsString();
        if (op.equals("LOOKUP")) return new Lookup(o.get("Arg").getAsString());
        if (op.equals("CONSTANT")) return new Constant(o.get("Arg").getAsDouble());
        throw new IllegalArgumentException("Unknown value: " + op);
    }
}

public class BusinessRuleMain {
    public static BusinessRule generateRule(String inputBusinessRule) {
        JsonObject root = JsonParser.parseString(inputBusinessRule).getAsJsonObject();
        return BusinessRuleFactory.rule(root);    // JSON is discarded after this
    }
}`,
          checklist: ['Recursive parsing of nested rules', 'Values parsed separately from rules', 'Missing second GREATER THAN argument handled', 'JSON only used during parsing (not stored)', 'Unknown operators rejected'] }
      ] }
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
