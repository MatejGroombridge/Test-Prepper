/* subjects/comp2511-code.js — COMP2511 final exam, Section 3 banks.
   DOMAIN    domain-modelling scenarios (10 marks): stubs, not implementations
   REFACTOR  starter code with smells → name the smells, pick a pattern,
             refactor and extend (15 marks)
   SCRATCH   build a solution from a spec with a pattern (15 marks)
   Code is not auto-marked: compare with the sample, or "Copy for AI hint". */
(function (global) {
  'use strict';

  var D = global.COMP2511Data;
  var c = D.c;

  /* ====================================================================
     Domain modelling
     ==================================================================== */

  D.DOMAIN = [
    { title: 'Airline bookings',
      spec: [
        'The airline operates <b>flights</b>. Each flight has a flight number, origin, destination and departure time, and is flown by one <b>aircraft</b>.',
        'Each aircraft has a fixed set of <b>seats</b>; each seat has a seat number and a class (economy, business or first).',
        'A <b>customer</b> makes <b>bookings</b>. A booking is for one flight and one or more <b>passengers</b>, each of whom is allocated a seat on that flight.',
        'Bookings can be cancelled, which frees their seats.',
        '<b>Crew members</b> are <b>pilots</b> or <b>flight attendants</b> and are assigned to flights. A flight must have at least two pilots before it can depart.'
      ],
      controller: `public interface AirlineController {
    void createAircraft(String aircraftId, List<String> seatNumbers, List<String> seatClasses);
    void createFlight(String flightNumber, String origin, String destination,
                      LocalDateTime departure, String aircraftId);
    String book(String customerId, String flightNumber,
                List<String> passengerNames, List<String> seatNumbers);
    void cancelBooking(String bookingId);
    void assignCrew(String flightNumber, String staffId);
    boolean canDepart(String flightNumber);
}`,
      model: `public enum SeatClass { ECONOMY, BUSINESS, FIRST }

public class Aircraft {
    private String id;
    private List<Seat> seats;          // composition, 1 aircraft ◆— 1..* Seat
    public Seat getSeat(String seatNumber) { ... }
}

public class Seat {
    private String seatNumber;
    private SeatClass seatClass;
}

public class Flight {
    private String flightNumber;
    private String origin, destination;
    private LocalDateTime departure;
    private Aircraft aircraft;          // association, many flights — 1 aircraft
    private List<Booking> bookings;     // aggregation, 1 flight — 0..* Booking
    private List<CrewMember> crew;      // aggregation, * flights — * crew

    public boolean isSeatFree(Seat seat) { ... }
    public void addBooking(Booking b) { ... }
    public void removeBooking(Booking b) { ... }
    public void assign(CrewMember c) { ... }
    /** at least two pilots assigned */
    public boolean canDepart() { ... }
}

public class Customer {
    private String id;
    private List<Booking> bookings;     // 1 customer — 0..* Booking
}

public class Booking {
    private String id;
    private Customer customer;          // exactly 1
    private Flight flight;              // exactly 1
    private List<Ticket> tickets;       // composition, 1 booking ◆— 1..* Ticket
    public void cancel() { ... }        // removes itself from the flight, freeing seats
}

/** One passenger in one seat for one booking. */
public class Ticket {
    private Passenger passenger;
    private Seat seat;
}

public class Passenger {
    private String name;
}

public abstract class CrewMember {
    private String staffId;
    private String name;
}
public class Pilot extends CrewMember { private String licenceNumber; }
public class FlightAttendant extends CrewMember { }`,
      must: ['Aircraft ◆ Seat composition; Booking ◆ Ticket/allocation composition', 'Seat allocation modelled per passenger (a ticket/allocation class or map), not a loose list',
             'CrewMember abstract with Pilot and FlightAttendant subclasses', 'Cardinalities written as comments, incl. 1..* tickets and many-to-many crew',
             'Methods for cancel, seat availability and canDepart placed on the right classes'] },

    { title: 'Music streaming',
      spec: [
        '<b>Users</b> have either a <b>Free</b> or a <b>Premium</b> subscription. Free users hear ads and may skip at most 6 tracks per hour; Premium users can download tracks. Users can upgrade or downgrade at any time.',
        '<b>Artists</b> release <b>albums</b>; an album contains one or more <b>tracks</b>. A track may feature several artists.',
        'Users create <b>playlists</b>. A playlist contains tracks and may also contain other playlists (e.g. a "Workout" folder containing "Running" and "Gym").',
        'The total duration of any playlist can be shown.',
        'Users can follow artists and other users.'
      ],
      controller: `public interface StreamingController {
    void createUser(String userId, String name);
    void upgrade(String userId);
    void downgrade(String userId);
    void createPlaylist(String userId, String playlistId, String name);
    void addTrackToPlaylist(String playlistId, String trackId);
    void addPlaylistToPlaylist(String parentId, String childId);
    int playlistDuration(String playlistId);
    boolean skip(String userId);
    void follow(String userId, String artistOrUserId);
}`,
      model: `public class User {
    private String id, name;
    private Subscription subscription;   // 1 user — 1 subscription (swappable state)
    private List<Playlist> playlists;    // composition, 1 user ◆— 0..* Playlist
    private List<Followable> following;  // aggregation, 0..* artists or users
    public void setSubscription(Subscription s) { ... }
    public boolean skip() { return subscription.trySkip(); }
}

/** A subscription changes at runtime, so it is a field (State/Strategy),
 *  not a FreeUser / PremiumUser subclass. */
public interface Subscription {
    boolean trySkip();
    boolean hasAds();
    boolean canDownload();
}
public class FreeSubscription implements Subscription {
    private List<LocalDateTime> recentSkips;  // to enforce 6 per hour
}
public class PremiumSubscription implements Subscription { }

/** Users and artists can both be followed. */
public interface Followable { String getId(); }

public class Artist implements Followable {
    private String id, name;
    private List<Album> albums;          // 1 artist — 0..* albums
}

public class Album {
    private String title;
    private Artist artist;
    private List<Track> tracks;          // composition, 1 album ◆— 1..* Track
}

/** Composite: tracks and playlists are both playable items. */
public interface PlaylistItem {
    int durationSeconds();
}

public class Track implements PlaylistItem {
    private String id, title;
    private int durationSeconds;
    private List<Artist> artists;        // 1..* (main + featured)
}

public class Playlist implements PlaylistItem {
    private String id, name;
    private List<PlaylistItem> items;    // aggregation: tracks are shared, not owned
    public void add(PlaylistItem item) { ... }
    public int durationSeconds() { ... } // sum over items, recursively
}`,
      must: ['Subscription as a swappable field/state, not User subclasses (it changes at runtime)', 'Composite for playlists containing tracks and playlists, with recursive duration',
             'Album ◆ Track composition; playlist holds tracks by aggregation', 'Followable (or equivalent) for following both artists and users',
             'Skip limit and download behaviour placed on the subscription'] },

    { title: 'Hospital wards',
      spec: [
        'The hospital has <b>wards</b>; each ward has a number of <b>beds</b>, and each bed holds at most one patient.',
        'A <b>patient</b> is <b>admitted</b> to a bed under an attending <b>doctor</b>, with an admission date and reason; later they are discharged. A patient may be admitted many times over the years, and the history must be kept.',
        '<b>Staff</b> are doctors (with a specialty) or <b>nurses</b>. Each nurse works on one ward; each ward has one nurse-in-charge.',
        'A doctor can prescribe <b>medications</b> (name, dose, frequency) to a currently admitted patient.'
      ],
      controller: `public interface HospitalController {
    void addWard(String wardId, int numBeds);
    void addDoctor(String staffId, String name, String specialty);
    void addNurse(String staffId, String name, String wardId);
    void setNurseInCharge(String wardId, String staffId);
    String admit(String patientId, String wardId, String doctorId, String reason);
    void discharge(String admissionId);
    void prescribe(String admissionId, String doctorId, String medication,
                   String dose, String frequency);
    List<String> freeBeds(String wardId);
}`,
      model: `public class Ward {
    private String id;
    private List<Bed> beds;              // composition, 1 ward ◆— 1..* Bed
    private List<Nurse> nurses;          // 1 ward — 0..* nurses
    private Nurse nurseInCharge;         // exactly 1 (once set); must be one of nurses
    public List<Bed> freeBeds() { ... }
}

public class Bed {
    private String id;
    private Admission current;           // 0..1 — null when free
    public boolean isFree() { ... }
}

public class Patient {
    private String id, name;
    private List<Admission> admissions;  // 1 patient — 0..* admissions (history kept)
    public Admission currentAdmission() { ... }
}

/** Association class between patient, bed and doctor. */
public class Admission {
    private String id;
    private Patient patient;
    private Bed bed;
    private Doctor attendingDoctor;
    private LocalDate admitted;
    private LocalDate discharged;        // null while admitted
    private String reason;
    private List<Prescription> prescriptions; // composition, ◆— 0..*
    public void discharge(LocalDate date) { ... } // frees the bed
    public void prescribe(Doctor d, Prescription p) { ... }
    public boolean isActive() { ... }
}

public class Prescription {
    private Doctor prescribedBy;
    private String medication, dose, frequency;
    private LocalDateTime prescribedAt;
}

public abstract class Staff {
    private String id, name;
}
public class Doctor extends Staff { private String specialty; }
public class Nurse extends Staff { private Ward ward; } // exactly 1 ward`,
      must: ['Admission as its own class (history, dates, reason, doctor, bed)', 'Ward ◆ Bed composition; Bed holds 0..1 current admission',
             'Staff abstract with Doctor and Nurse', 'Nurse-in-charge and nurse-to-ward cardinalities in comments',
             'Prescriptions attached to an admission, with methods to discharge and prescribe'] },

    { title: 'Library branches',
      spec: [
        'A library has several <b>branches</b>. Each branch holds physical <b>copies</b> of catalogue <b>items</b>.',
        'Items are <b>books</b> (author, ISBN), <b>DVDs</b> (runtime) or <b>magazines</b> (issue number). Books may be borrowed for 21 days, DVDs for 7, and magazines cannot be borrowed.',
        '<b>Members</b> borrow copies (at most 5 at a time) and return them to any branch. Overdue returns incur a <b>fine</b> of $0.50 per day.',
        'A member can <b>reserve</b> an item (not a specific copy); reservations are served first come, first served.'
      ],
      controller: `public interface LibraryController {
    void addBranch(String branchId, String name);
    void addBook(String itemId, String title, String author, String isbn);
    void addDvd(String itemId, String title, int runtimeMinutes);
    void addMagazine(String itemId, String title, int issue);
    void addCopy(String copyId, String itemId, String branchId);
    String borrow(String memberId, String copyId);
    void returnCopy(String loanId, String branchId);
    void reserve(String memberId, String itemId);
    double finesOwed(String memberId);
}`,
      model: `public class Branch {
    private String id, name;
    private List<Copy> copies;            // aggregation, 1 branch — 0..* copies (copies move)
}

public abstract class Item {
    private String id, title;
    private List<Copy> copies;            // 1 item — 0..* copies
    private Queue<Reservation> reservations; // FIFO
    public abstract boolean isBorrowable();
    public abstract int loanDays();
}
public class Book extends Item {
    private String author, isbn;
    public boolean isBorrowable() { return true; }
    public int loanDays() { return 21; }
}
public class Dvd extends Item {
    private int runtimeMinutes;
    public boolean isBorrowable() { return true; }
    public int loanDays() { return 7; }
}
public class Magazine extends Item {
    private int issue;
    public boolean isBorrowable() { return false; }
    public int loanDays() { return 0; }   // never called: not borrowable
}

public class Copy {
    private String id;
    private Item item;                    // exactly 1
    private Branch location;              // exactly 1, changes on return
    private Loan currentLoan;             // 0..1
}

public class Member {
    public static final int MAX_LOANS = 5;
    private String id;
    private List<Loan> loans;             // 0..* (history); at most 5 active
    private List<Fine> fines;             // 0..*
    public boolean canBorrow() { ... }
    public double finesOwed() { ... }
}

public class Loan {
    private Member member;
    private Copy copy;
    private LocalDate borrowed, due, returned; // returned null while active
    /** Creates a Fine if overdue (0.50 per day) and moves the copy. */
    public Fine returnTo(Branch branch, LocalDate date) { ... }
}

public class Fine {
    private Loan loan;
    private double amount;
    private boolean paid;
}

public class Reservation {
    private Member member;
    private Item item;                    // an item, not a copy
    private LocalDateTime placedAt;
}`,
      must: ['Item abstract with Book/Dvd/Magazine and polymorphic loan rules (no type switch)', 'Distinguished Item (catalogue entry) from Copy (physical)',
             'Loan class with dates; at most 5 active loans enforced/documented', 'Reservation on an Item, FIFO', 'Fines modelled with a method to compute what is owed'] },

    { title: 'Gym classes',
      spec: [
        'A gym chain has several <b>locations</b>; each location has <b>rooms</b> with a maximum capacity.',
        '<b>Instructors</b> run <b>classes</b> (yoga, spin, HIIT) at a scheduled time in a room. An instructor can work at several locations.',
        '<b>Members</b> hold a <b>membership</b>: casual (pay per class), monthly or annual. Monthly members may book 12 classes a month; annual members are unlimited.',
        'Members book classes. When a class is full, members join a <b>waitlist</b> and are booked automatically if someone cancels.'
      ],
      controller: `public interface GymController {
    void addLocation(String locationId, String name);
    void addRoom(String locationId, String roomId, int capacity);
    void addInstructor(String instructorId, String name);
    void scheduleClass(String classId, String type, String roomId,
                       String instructorId, LocalDateTime start, int minutes);
    void addMember(String memberId, String membershipType);
    String book(String memberId, String classId);   // "BOOKED" or "WAITLISTED"
    void cancel(String memberId, String classId);
}`,
      model: `public class Location {
    private String id, name;
    private List<Room> rooms;              // composition, 1 location ◆— 1..* Room
}

public class Room {
    private String id;
    private int capacity;
    private Location location;
}

public enum ClassType { YOGA, SPIN, HIIT }

public class Instructor {
    private String id, name;
    private List<GymClass> classes;        // 1 instructor — 0..* classes (any location)
}

public class GymClass {
    private String id;
    private ClassType type;
    private Room room;                     // exactly 1 — capacity comes from the room
    private Instructor instructor;         // exactly 1
    private LocalDateTime start;
    private int minutes;
    private List<Member> booked;           // 0..capacity
    private Queue<Member> waitlist;        // FIFO, 0..*
    public boolean isFull() { ... }
    public String book(Member m) { ... }   // books or waitlists
    public void cancel(Member m) { ... }   // promotes the head of the waitlist
}

public class Member {
    private String id;
    private Membership membership;         // 1, can change
    private List<GymClass> bookings;
}

/** Booking rules vary by membership: Strategy-like polymorphism. */
public interface Membership {
    boolean canBook(Member m, LocalDate date);
    double chargeForClass();
}
public class CasualMembership implements Membership { private double pricePerClass; }
public class MonthlyMembership implements Membership {
    public static final int CLASSES_PER_MONTH = 12;
}
public class AnnualMembership implements Membership { }`,
      must: ['Location ◆ Room composition; capacity on Room', 'GymClass links room, instructor, time, bookings and a FIFO waitlist',
             'Membership rules polymorphic (interface/abstract with subtypes), not a string switch', 'Cardinalities in comments, incl. instructors at many locations',
             'book/cancel behaviour on GymClass with waitlist promotion'] }
  ];

  /* ====================================================================
     Refactoring questions
     ==================================================================== */

  D.REFACTOR = [
    /* ---------------------------------------------------------------- */
    { title: 'Pizza pricing',
      intro: '<p>A pizza shop’s ordering system prices a pizza from its base plus any toppings. The current code is below.</p>' +
        '<p><b>New requirements:</b> customers can now add the same topping more than once (e.g. double olives, each charged and listed), and a new topping, <b>truffle oil</b> ($6.00), is being added. The shop adds new toppings every few months.</p>',
      files: [
        { name: 'Pizza.java', text: `public class Pizza {
    private String base;            // "margherita" or "marinara"
    private boolean extraCheese;
    private boolean olives;
    private boolean jalapenos;
    private boolean stuffedCrust;

    public Pizza(String base) { this.base = base; }

    public void setExtraCheese(boolean b) { extraCheese = b; }
    public void setOlives(boolean b) { olives = b; }
    public void setJalapenos(boolean b) { jalapenos = b; }
    public void setStuffedCrust(boolean b) { stuffedCrust = b; }

    public double price() {
        double p = base.equals("margherita") ? 12.0 : 10.0;
        if (extraCheese) p += 2.5;
        if (olives) p += 1.5;
        if (jalapenos) p += 1.0;
        if (stuffedCrust) p += 4.0;
        return p;
    }

    public String description() {
        String d = base.equals("margherita") ? "Margherita" : "Marinara";
        if (extraCheese) d += ", extra cheese";
        if (olives) d += ", olives";
        if (jalapenos) d += ", jalapenos";
        if (stuffedCrust) d += ", stuffed crust";
        return d;
    }
}` },
        { name: 'PizzaTest.java', text: `@Test
public void testDoubleOlives() {
    Pizza p = new Olives(new Olives(new Margherita()));
    assertEquals(15.0, p.price(), 0.001);
    assertEquals("Margherita, olives, olives", p.description());
}

@Test
public void testTruffle() {
    Pizza p = new TruffleOil(new ExtraCheese(new Marinara()));
    assertEquals(18.5, p.price(), 0.001);
    assertEquals("Marinara, extra cheese, truffle oil", p.description());
}` }
      ],
      smells: '<ul><li><b>Open-Closed violation / repeated conditionals</b>: every new topping means a new field, a new setter and edits to both ' + c('price()') + ' and ' + c('description()') + '.</li>' +
        '<li><b>Boolean flags cannot express the new requirement</b>: a flag is on or off, so "double olives" is impossible without more fields (a combinatorial explosion).</li>' +
        '<li><b>Type code / primitive obsession</b>: the base is a String compared in two places; an unknown base silently prices as marinara.</li>' +
        '<li><b>Duplicated structure</b>: price and description walk the same list of flags separately, so they can drift out of sync.</li></ul>',
      pattern: { options: ['Decorator', 'Composite', 'Strategy', 'Observer'], correct: 0,
                 why: 'Toppings wrap a pizza, add to its price and description, and can be stacked any number of times in any order: exactly Decorator.' },
      task: 'Refactor the code using your chosen pattern, so that the tests in ' + c('PizzaTest.java') + ' pass, and add the truffle-oil topping. Briefly justify your design in a comment.',
      model: `/** Component. Bases and toppings are all Pizzas, so toppings can wrap
 *  any pizza, including one that already has toppings (Decorator). */
public interface Pizza {
    double price();
    String description();
}

// ---- concrete components: the bases -------------------------------
public class Margherita implements Pizza {
    public double price() { return 12.0; }
    public String description() { return "Margherita"; }
}
public class Marinara implements Pizza {
    public double price() { return 10.0; }
    public String description() { return "Marinara"; }
}

// ---- abstract decorator ---------------------------------------------
public abstract class Topping implements Pizza {
    private final Pizza inner;
    private final String name;
    private final double cost;

    protected Topping(Pizza inner, String name, double cost) {
        this.inner = inner; this.name = name; this.cost = cost;
    }
    public double price() { return inner.price() + cost; }
    public String description() { return inner.description() + ", " + name; }
}

// ---- concrete decorators: one small class per topping ---------------
public class ExtraCheese extends Topping {
    public ExtraCheese(Pizza p) { super(p, "extra cheese", 2.5); }
}
public class Olives extends Topping {
    public Olives(Pizza p) { super(p, "olives", 1.5); }
}
public class Jalapenos extends Topping {
    public Jalapenos(Pizza p) { super(p, "jalapenos", 1.0); }
}
public class StuffedCrust extends Topping {
    public StuffedCrust(Pizza p) { super(p, "stuffed crust", 4.0); }
}
public class TruffleOil extends Topping {
    public TruffleOil(Pizza p) { super(p, "truffle oil", 6.0); }
}

/* Rationale: a new topping is one new class with no change to existing code
   (Open-Closed). Toppings can repeat and combine freely, which flags could
   not express. Price and description are computed in one place per layer,
   so they cannot drift apart. */`,
      notes: 'Pulling the shared "add my cost, append my name" logic into the abstract ' + c('Topping') + ' keeps each concrete decorator to one line. A single generic ' + c('Topping(pizza, name, cost)') + ' class is also defensible, but named classes match the tests and let a topping later override behaviour (e.g. stuffed crust priced by size).',
      must: ['Pizza interface implemented by bases and by an abstract decorator', 'Decorator holds a wrapped Pizza and delegates, adding its own cost/description',
             'Toppings can repeat (no boolean flags remain)', 'Truffle oil added as one new class with no edits elsewhere', 'Brief rationale referring to Open-Closed / runtime composition'] },

    /* ---------------------------------------------------------------- */
    { title: 'Order notifications',
      intro: '<p>When an order’s status changes, several parts of an online store must react. The current code is below.</p>' +
        '<p><b>New requirements:</b> staff want a <b>Slack</b> message whenever an order is CANCELLED, and customers must be able to switch SMS updates on and off at any time. More reactions (e.g. a loyalty-points service) are expected.</p>',
      files: [
        { name: 'Order.java', text: `public class Order {
    private String id;
    private String customerEmail;
    private String customerPhone;
    private boolean wantsSms;
    private String status = "NEW";

    public Order(String id, String email, String phone, boolean wantsSms) {
        this.id = id; this.customerEmail = email;
        this.customerPhone = phone; this.wantsSms = wantsSms;
    }

    public String getId() { return id; }
    public String getStatus() { return status; }

    public void setStatus(String newStatus) {
        this.status = newStatus;
        EmailService.getInstance().send(customerEmail,
                "Order " + id + " is now " + newStatus);
        if (wantsSms) {
            new SmsService().send(customerPhone, "Order " + id + ": " + newStatus);
        }
        if (newStatus.equals("PAID")) {
            new Warehouse().pick(id);
        }
        Analytics.log("status:" + id + ":" + newStatus);
    }
}` },
        { name: 'Services.java', text: `public class EmailService {      // a Singleton
    public static EmailService getInstance() { ... }
    public void send(String to, String msg) { ... }
}
public class SmsService { public void send(String phone, String msg) { ... } }
public class Warehouse  { public void pick(String orderId) { ... } }
public class Analytics  { public static void log(String event) { ... } }
public class SlackClient { public void post(String channel, String msg) { ... } }` }
      ],
      smells: '<ul><li><b>High coupling</b>: Order depends directly on five concrete classes (EmailService, SmsService, Warehouse, Analytics, and soon Slack).</li>' +
        '<li><b>SRP / low cohesion</b>: an order’s job is to hold its state; here it also decides who is told what, and how.</li>' +
        '<li><b>Open-Closed violation</b>: every new reaction means editing ' + c('setStatus') + '.</li>' +
        '<li><b>Hard to test</b>: services are constructed inside the method or reached through a Singleton, so a test cannot change status without sending real email and SMS.</li>' +
        '<li><b>Primitive obsession</b>: status is a free-form String ("PAID"), so typos compile.</li></ul>',
      pattern: { options: ['Observer', 'Decorator', 'Composite', 'Abstract Factory'], correct: 0,
                 why: 'One subject (the order) with many dependents that must react to its state changes, attached and detached at runtime: Observer.' },
      task: 'Refactor the code using your chosen pattern, add the Slack notification for cancelled orders, and support turning SMS updates on and off at runtime. Briefly justify your design.',
      model: `public enum OrderStatus { NEW, PAID, SHIPPED, CANCELLED }

/** Observer interface: push model — gives the order and the transition. */
public interface OrderObserver {
    void statusChanged(Order order, OrderStatus oldStatus, OrderStatus newStatus);
}

/** Subject. Knows nothing about email, SMS, the warehouse or Slack. */
public class Order {
    private final String id;
    private final String customerEmail, customerPhone;
    private OrderStatus status = OrderStatus.NEW;
    private final List<OrderObserver> observers = new ArrayList<>();

    public Order(String id, String email, String phone) { ... }

    public void attach(OrderObserver o) { observers.add(o); }
    public void detach(OrderObserver o) { observers.remove(o); }

    public void setStatus(OrderStatus newStatus) {
        OrderStatus old = status;
        status = newStatus;
        for (OrderObserver o : List.copyOf(observers)) {
            o.statusChanged(this, old, newStatus);
        }
    }
    // getters for id, email, phone, status
}

// ---- concrete observers ---------------------------------------------
public class EmailNotifier implements OrderObserver {
    private final EmailService email;
    public EmailNotifier(EmailService email) { this.email = email; }
    public void statusChanged(Order o, OrderStatus from, OrderStatus to) {
        email.send(o.getCustomerEmail(), "Order " + o.getId() + " is now " + to);
    }
}

public class SmsNotifier implements OrderObserver {
    private final SmsService sms;
    public SmsNotifier(SmsService sms) { this.sms = sms; }
    public void statusChanged(Order o, OrderStatus from, OrderStatus to) {
        sms.send(o.getCustomerPhone(), "Order " + o.getId() + ": " + to);
    }
}

public class WarehouseObserver implements OrderObserver {
    private final Warehouse warehouse;
    public WarehouseObserver(Warehouse w) { this.warehouse = w; }
    public void statusChanged(Order o, OrderStatus from, OrderStatus to) {
        if (to == OrderStatus.PAID) warehouse.pick(o.getId());
    }
}

public class AnalyticsObserver implements OrderObserver {
    public void statusChanged(Order o, OrderStatus from, OrderStatus to) {
        Analytics.log("status:" + o.getId() + ":" + to);
    }
}

public class SlackCancellationNotifier implements OrderObserver {
    private final SlackClient slack;
    public SlackCancellationNotifier(SlackClient slack) { this.slack = slack; }
    public void statusChanged(Order o, OrderStatus from, OrderStatus to) {
        if (to == OrderStatus.CANCELLED) {
            slack.post("#orders", "Order " + o.getId() + " was cancelled");
        }
    }
}

// ---- wiring, e.g. in the controller that creates orders --------------
public class OrderController {
    private final Map<String, Order> orders = new HashMap<>();
    private final Map<String, SmsNotifier> smsNotifiers = new HashMap<>();
    ...
    public void setSmsUpdates(String orderId, boolean on) {
        Order o = orders.get(orderId);
        SmsNotifier n = smsNotifiers.computeIfAbsent(orderId, k -> new SmsNotifier(sms));
        if (on) o.attach(n); else o.detach(n);
    }
}

/* Rationale: Order now has one job and depends only on the OrderObserver
   abstraction (DIP). New reactions are new observer classes (Open-Closed),
   SMS is switched at runtime by attaching/detaching, and tests can attach a
   fake observer instead of sending real messages. Status is an enum. */`,
      notes: 'Push vs pull: passing ' + c('oldStatus') + ' and ' + c('newStatus') + ' (push) saves each observer re-deriving the transition; passing the order too lets observers pull the id and contact details. Iterating over a copy of the list means an observer may safely detach itself during notification.',
      must: ['OrderObserver interface; Order keeps a list with attach/detach', 'Each existing reaction moved into its own observer class', 'Slack notifier reacts only to CANCELLED',
             'SMS switched at runtime by attaching/detaching (not a flag inside Order)', 'Order no longer references concrete services; rationale given'] },

    /* ---------------------------------------------------------------- */
    { title: 'Shipping costs',
      intro: '<p>An online store calculates shipping cost and delivery estimate for a parcel. The current code is below.</p>' +
        '<p><b>New requirements:</b> add <b>drone</b> delivery — a flat $15.00, delivered the same day (0 days), but only for parcels up to 2 kg (otherwise throw ' + c('IllegalArgumentException') + '). Customers can change the delivery method on the checkout page at any time before paying, and the totals must update.</p>',
      files: [
        { name: 'Checkout.java', text: `public class Checkout {
    private String method = "standard";
    private double weightKg;
    private double itemsTotal;

    public Checkout(double weightKg, double itemsTotal) {
        this.weightKg = weightKg; this.itemsTotal = itemsTotal;
    }

    public void setMethod(String method) { this.method = method; }

    public double shippingCost() {
        switch (method) {
            case "standard": return 5.0 + 1.2 * weightKg;
            case "express":  return 12.0 + 2.0 * weightKg;
            case "pickup":   return 0.0;
            default: throw new IllegalArgumentException(method);
        }
    }

    public int estimatedDays() {
        switch (method) {
            case "standard": return 5;
            case "express":  return 1;
            case "pickup":   return 2;
            default: throw new IllegalArgumentException(method);
        }
    }

    public double total() {
        double t = itemsTotal + shippingCost();
        if (method.equals("standard") && itemsTotal >= 100) {
            t -= shippingCost();          // free standard shipping over $100
        }
        return t;
    }
}` },
        { name: 'CheckoutTest.java', text: `@Test
public void testSwitchMethods() {
    Checkout c = new Checkout(1.5, 40.0);
    c.setMethod(new DroneShipping());
    assertEquals(55.0, c.total(), 0.001);
    assertEquals(0, c.estimatedDays());
    c.setMethod(new StandardShipping());
    assertEquals(46.8, c.total(), 0.001);
}` }
      ],
      smells: '<ul><li><b>Switch statements on a type code</b>, repeated in ' + c('shippingCost') + ', ' + c('estimatedDays') + ' and ' + c('total') + ': a new method means editing three places (shotgun surgery, Open-Closed violation).</li>' +
        '<li><b>Primitive obsession</b>: the method is a String, so a typo compiles and fails at runtime.</li>' +
        '<li><b>Misplaced rule</b>: the free-shipping-over-$100 rule belongs to standard shipping but lives in ' + c('total()') + '.</li>' +
        '<li><b>Low cohesion</b>: Checkout holds every carrier’s rates.</li></ul>',
      pattern: { options: ['Strategy', 'Observer', 'Decorator', 'Singleton'], correct: 0,
                 why: 'A family of interchangeable shipping algorithms behind one interface, selected and swapped at runtime by the checkout (the context).' },
      task: 'Refactor the code using your chosen pattern so that the test passes, and add drone delivery. Briefly justify your design.',
      model: `/** Strategy: each delivery method owns its cost and time rules. */
public interface ShippingMethod {
    double cost(double weightKg, double itemsTotal);
    int estimatedDays();
}

public class StandardShipping implements ShippingMethod {
    public static final double FREE_OVER = 100.0;
    public double cost(double weightKg, double itemsTotal) {
        return itemsTotal >= FREE_OVER ? 0.0 : 5.0 + 1.2 * weightKg;
    }
    public int estimatedDays() { return 5; }
}

public class ExpressShipping implements ShippingMethod {
    public double cost(double weightKg, double itemsTotal) { return 12.0 + 2.0 * weightKg; }
    public int estimatedDays() { return 1; }
}

public class PickupShipping implements ShippingMethod {
    public double cost(double weightKg, double itemsTotal) { return 0.0; }
    public int estimatedDays() { return 2; }
}

public class DroneShipping implements ShippingMethod {
    public static final double MAX_KG = 2.0;
    public double cost(double weightKg, double itemsTotal) {
        if (weightKg > MAX_KG) {
            throw new IllegalArgumentException("Drone delivery is limited to 2 kg");
        }
        return 15.0;
    }
    public int estimatedDays() { return 0; }
}

/** Context: delegates to whichever strategy is currently selected. */
public class Checkout {
    private ShippingMethod method = new StandardShipping();
    private final double weightKg, itemsTotal;

    public Checkout(double weightKg, double itemsTotal) {
        this.weightKg = weightKg; this.itemsTotal = itemsTotal;
    }
    public void setMethod(ShippingMethod method) { this.method = method; }

    public double shippingCost() { return method.cost(weightKg, itemsTotal); }
    public int estimatedDays()   { return method.estimatedDays(); }
    public double total()        { return itemsTotal + shippingCost(); }
}

/* Rationale: each method's rules live in one class; Checkout has no
   conditionals and is closed for modification. Drone delivery was added as
   a new class only. The method can be swapped at runtime via setMethod. */`,
      notes: 'Check the test arithmetic: drone 40 + 15 = 55; standard 40 + 5 + 1.2 × 1.5 = 46.8. The free-shipping rule moved into ' + c('StandardShipping') + ', which is why the strategy takes ' + c('itemsTotal') + '. A Factory (or a ' + c('Map<String, ShippingMethod>') + ') can still map the UI’s string choice to a strategy in one place.',
      must: ['ShippingMethod interface with cost and estimatedDays', 'One class per method, including DroneShipping with the 2 kg check',
             'Free-shipping rule moved into StandardShipping', 'Checkout delegates with no switch, and setMethod swaps at runtime', 'Rationale (Open-Closed, cohesion)'] },

    /* ---------------------------------------------------------------- */
    { title: 'Disk usage',
      intro: '<p>A file-browser utility reports the size of files and folders and prints a tree. The current code is below.</p>' +
        '<p><b>New requirements:</b> add <b>shortcuts</b>. A shortcut has a name and a target (another file or folder), occupies 1 byte itself, and is printed as ' + c('name -> targetName') + '. Also add a ' + c('fileCount()') + ' that counts the files (not folders or shortcuts) inside any item.</p>',
      files: [
        { name: 'Folder.java', text: `public class Folder {
    private String name;
    private List<Object> contents = new ArrayList<>();
    public Folder(String name) { this.name = name; }
    public String getName() { return name; }
    public void add(Object o) { contents.add(o); }
    public List<Object> getContents() { return contents; }
}` },
        { name: 'File.java', text: `public class File {
    private String name;
    private long size;
    public File(String name, long size) { this.name = name; this.size = size; }
    public String getName() { return name; }
    public long getSize() { return size; }
}` },
        { name: 'DiskUsage.java', text: `public class DiskUsage {
    public long size(Object item) {
        if (item instanceof File) {
            return ((File) item).getSize();
        } else if (item instanceof Folder) {
            long total = 0;
            for (Object o : ((Folder) item).getContents()) {
                total += size(o);
            }
            return total;
        }
        throw new IllegalArgumentException("unknown item");
    }

    public String tree(Object item, String indent) {
        if (item instanceof File) {
            File f = (File) item;
            return indent + f.getName() + " (" + f.getSize() + ")\\n";
        } else if (item instanceof Folder) {
            Folder d = (Folder) item;
            String out = indent + d.getName() + "/\\n";
            for (Object o : d.getContents()) {
                out += tree(o, indent + "  ");
            }
            return out;
        }
        throw new IllegalArgumentException("unknown item");
    }
}` }
      ],
      smells: '<ul><li><b>Type checking with instanceof and casts</b> (switch-statement smell): behaviour depends on the runtime type and is decided outside the classes.</li>' +
        '<li><b>Feature envy / data classes</b>: File and Folder are bags of getters; DiskUsage does all their work.</li>' +
        '<li><b>No type safety</b>: ' + c('List<Object>') + ' lets anything (a String, an Integer) be added to a folder and fail at runtime.</li>' +
        '<li><b>Shotgun surgery / Open-Closed</b>: a new item type means another branch in every method of DiskUsage.</li></ul>',
      pattern: { options: ['Composite', 'Decorator', 'Strategy', 'Observer'], correct: 0,
                 why: 'A part–whole tree of files and folders that clients treat uniformly, with folders recursing over children: Composite.' },
      task: 'Refactor using your chosen pattern, then add shortcuts and ' + c('fileCount()') + '. Keep the output of ' + c('tree') + ' identical for files and folders. Briefly justify your design.',
      model: `/** Component: files, folders and shortcuts are all FileSystemItems. */
public interface FileSystemItem {
    String getName();
    long size();
    int fileCount();
    String tree(String indent);
}

/** Leaf */
public class File implements FileSystemItem {
    private final String name;
    private final long size;
    public File(String name, long size) { this.name = name; this.size = size; }
    public String getName() { return name; }
    public long size() { return size; }
    public int fileCount() { return 1; }
    public String tree(String indent) {
        return indent + name + " (" + size + ")\\n";
    }
}

/** Composite */
public class Folder implements FileSystemItem {
    private final String name;
    private final List<FileSystemItem> contents = new ArrayList<>();
    public Folder(String name) { this.name = name; }
    public void add(FileSystemItem item) { contents.add(item); }
    public String getName() { return name; }
    public long size() {
        return contents.stream().mapToLong(FileSystemItem::size).sum();
    }
    public int fileCount() {
        return contents.stream().mapToInt(FileSystemItem::fileCount).sum();
    }
    public String tree(String indent) {
        StringBuilder out = new StringBuilder(indent + name + "/\\n");
        for (FileSystemItem item : contents) out.append(item.tree(indent + "  "));
        return out.toString();
    }
}

/** New leaf. Its size is its own 1 byte, not its target's, so that a
 *  shortcut to a parent folder cannot cause infinite recursion. */
public class Shortcut implements FileSystemItem {
    private final String name;
    private final FileSystemItem target;
    public Shortcut(String name, FileSystemItem target) { this.name = name; this.target = target; }
    public String getName() { return name; }
    public long size() { return 1; }
    public int fileCount() { return 0; }
    public String tree(String indent) {
        return indent + name + " -> " + target.getName() + "\\n";
    }
}

/** Kept as a thin facade so existing callers still work. */
public class DiskUsage {
    public long size(FileSystemItem item) { return item.size(); }
    public String tree(FileSystemItem item, String indent) { return item.tree(indent); }
}

/* Rationale: each type knows its own size, count and display, so there is
   no instanceof or casting; Folder is type-safe; Shortcut was added as one
   new class with no change to the others (Open-Closed). */`,
      notes: 'A common mistake is making ' + c('Shortcut.size()') + ' return ' + c('target.size()') + ': that double-counts, and a shortcut to an ancestor folder recurses forever. The spec says 1 byte for a reason.',
      must: ['FileSystemItem interface with size, fileCount and tree', 'File and Folder implement it; Folder holds List<FileSystemItem> and recurses',
             'No instanceof/casts remain', 'Shortcut added as a leaf: size 1, fileCount 0, "name -> target"', 'Tree output unchanged; rationale given'] },

    /* ---------------------------------------------------------------- */
    { title: 'Enemy waves',
      intro: '<p>A dungeon game spawns waves of enemies, which depend on the difficulty. The current code is below.</p>' +
        '<p><b>New requirements:</b> add a <b>nightmare</b> difficulty (flyers are Wraiths with 70 HP, ground enemies are Golems with 120 HP, and the boss is a Lich with 900 HP). The player may change the difficulty between waves, and enemies from different difficulties must never be mixed within a wave.</p>',
      files: [
        { name: 'Level.java', text: `public class Level {
    private String difficulty;      // "easy" or "hard"

    public Level(String difficulty) { this.difficulty = difficulty; }
    public void setDifficulty(String d) { this.difficulty = d; }

    /** Every third enemy is a flyer; the rest are ground enemies. */
    public List<Enemy> spawnWave(int n) {
        List<Enemy> wave = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (i % 3 == 2) {
                if (difficulty.equals("easy")) wave.add(new Bat(10));
                else wave.add(new Dragon(80));
            } else {
                if (difficulty.equals("easy")) wave.add(new Slime(20));
                else wave.add(new Ogre(60));
            }
        }
        return wave;
    }

    public Enemy spawnBoss() {
        if (difficulty.equals("easy")) return new SlimeKing(150);
        return new DragonLord(500);
    }
}` },
        { name: 'Enemies.java', text: `public abstract class Enemy {
    private int hp;
    public Enemy(int hp) { this.hp = hp; }
    public int getHp() { return hp; }
}
public class Bat extends Enemy { public Bat(int hp) { super(hp); } }
public class Dragon extends Enemy { ... }
public class Slime extends Enemy { ... }
public class Ogre extends Enemy { ... }
public class SlimeKing extends Enemy { ... }
public class DragonLord extends Enemy { ... }` }
      ],
      smells: '<ul><li><b>Repeated conditionals on a type code</b>: the difficulty string is checked three times; nightmare means editing every branch (Open-Closed violation, shotgun surgery).</li>' +
        '<li><b>Creation logic mixed with wave logic</b> (SRP): Level decides both the wave’s shape and which concrete classes to construct.</li>' +
        '<li><b>Magic numbers</b>: HP values are scattered literals.</li>' +
        '<li><b>Consistency is accidental</b>: nothing structurally prevents mixing families; it relies on every branch checking the same string.</li></ul>',
      pattern: { options: ['Abstract Factory', 'Singleton', 'Decorator', 'Observer'], correct: 0,
                 why: 'Each difficulty is a family of related products (flyer, ground, boss) that must be used together: one concrete factory per family.' },
      task: 'Refactor the creation logic using your chosen pattern, add the nightmare difficulty, and allow it to change between waves. Briefly justify your design.',
      model: `/** Abstract factory: one method per product in the family. */
public interface EnemyFactory {
    Enemy createFlyer();
    Enemy createGround();
    Enemy createBoss();
}

public class EasyEnemyFactory implements EnemyFactory {
    public Enemy createFlyer() { return new Bat(10); }
    public Enemy createGround() { return new Slime(20); }
    public Enemy createBoss()   { return new SlimeKing(150); }
}

public class HardEnemyFactory implements EnemyFactory {
    public Enemy createFlyer() { return new Dragon(80); }
    public Enemy createGround() { return new Ogre(60); }
    public Enemy createBoss()   { return new DragonLord(500); }
}

public class NightmareEnemyFactory implements EnemyFactory {
    public Enemy createFlyer() { return new Wraith(70); }
    public Enemy createGround() { return new Golem(120); }
    public Enemy createBoss()   { return new Lich(900); }
}

public class Wraith extends Enemy { public Wraith(int hp) { super(hp); } }
public class Golem  extends Enemy { public Golem(int hp)  { super(hp); } }
public class Lich   extends Enemy { public Lich(int hp)   { super(hp); } }

/** Client: only knows the factory interface. */
public class Level {
    private EnemyFactory factory;

    public Level(EnemyFactory factory) { this.factory = factory; }
    /** Changing difficulty between waves = swapping the factory. */
    public void setDifficulty(EnemyFactory factory) { this.factory = factory; }

    public List<Enemy> spawnWave(int n) {
        EnemyFactory f = factory;           // one family for the whole wave
        List<Enemy> wave = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            wave.add(i % 3 == 2 ? f.createFlyer() : f.createGround());
        }
        return wave;
    }

    public Enemy spawnBoss() { return factory.createBoss(); }
}

/* Rationale: Level no longer names concrete enemy classes or checks a
   difficulty string. Each difficulty is one factory, so families cannot be
   mixed within a wave, and nightmare was added without changing Level or
   the other factories (Open-Closed). */`,
      notes: 'If the UI still passes a difficulty string, map it to a factory once (e.g. a ' + c('Map<String, EnemyFactory>') + ' or a small static factory method), rather than letting the string leak back into Level.',
      must: ['EnemyFactory interface with flyer/ground/boss methods', 'One concrete factory per difficulty, including Nightmare and the new enemy classes',
             'Level depends only on the factory interface; no difficulty conditionals remain', 'Difficulty change = factory swap; a wave uses one factory', 'Rationale given'] }
  ];

  /* ====================================================================
     From-scratch programming questions
     ==================================================================== */

  D.SCRATCH = [
    /* ---------------------------------------------------------------- */
    { title: 'Calculator expressions',
      intro: '<p>You are building <b>MathBook</b>, which stores arithmetic expressions and can evaluate and display them. Expressions are made of:</p>' +
        '<ul><li><b>Num</b>: an integer constant, e.g. 7.</li><li><b>Add</b>: the sum of two or more sub-expressions.</li><li><b>Multiply</b>: the product of two or more sub-expressions.</li><li><b>Negate</b>: the negative of one sub-expression.</li></ul>' +
        '<p>Every sub-expression can itself be any kind of expression, nested to any depth. There are no other kinds of expression, but more operators will be added later.</p>',
      files: [
        { name: 'MathBookTest.java', text: `@Test
public void testEvaluate() {
    Expression e = new Add(List.of(
            new Num(2),
            new Multiply(List.of(new Num(3), new Num(4))),
            new Negate(new Num(5))));
    MathBook book = new MathBook(e);
    assertEquals(9, book.evaluate());          // 2 + 12 - 5
}

@Test
public void testDisplay() {
    Expression e = new Multiply(List.of(
            new Add(List.of(new Num(1), new Num(2))),
            new Negate(new Num(3))));
    assertEquals("((1 + 2) * -3)", new MathBook(e).display());
}` }
      ],
      parts: [
        { kind: 'written', marks: 3,
          prompt: 'What design pattern can be used to model this scenario? Justify your choice by explaining how the scenario maps to the key characteristics of the pattern.',
          model: '<p><b>Composite.</b></p><ul>' +
            '<li>Component: an ' + c('Expression') + ' interface with ' + c('evaluate()') + ' and ' + c('display()') + '.</li>' +
            '<li>Leaf: ' + c('Num') + ' — no children, returns its own value.</li>' +
            '<li>Composites: ' + c('Add') + ' and ' + c('Multiply') + ' (a list of children) and ' + c('Negate') + ' (one child) — they compute their result from their children’s results, recursively.</li>' +
            '<li>Expressions form a tree of arbitrary depth, and MathBook treats a single number and a whole nested expression uniformly through the one interface. A new operator is a new class.</li></ul>',
          checklist: ['Named Composite', 'Leaf vs composite roles mapped to Num vs Add/Multiply/Negate', 'Recursive tree / uniform treatment', 'Extensible for new operators'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('evaluate()') + ' in ' + c('MathBook') + ', creating the expression classes it needs.',
          prefill: `public interface Expression {
    // ...
}

public class Num implements Expression {
    // ...
}

// Add, Multiply, Negate ...

public class MathBook {
    private Expression expression;
    public MathBook(Expression expression) { this.expression = expression; }

    public int evaluate() {
        // TODO
    }
}`,
          model: `public interface Expression {
    int evaluate();
    String display();
}

public class Num implements Expression {
    private final int value;
    public Num(int value) { this.value = value; }
    public int evaluate() { return value; }
    public String display() { return String.valueOf(value); }
}

/** Shared logic for operators with two or more operands. */
public abstract class NaryOperator implements Expression {
    private final List<Expression> operands;
    protected NaryOperator(List<Expression> operands) {
        if (operands.size() < 2) throw new IllegalArgumentException("need 2+ operands");
        this.operands = List.copyOf(operands);
    }
    protected List<Expression> getOperands() { return operands; }
}

public class Add extends NaryOperator {
    public Add(List<Expression> operands) { super(operands); }
    public int evaluate() {
        return getOperands().stream().mapToInt(Expression::evaluate).sum();
    }
    public String display() { ... }   // part c
}

public class Multiply extends NaryOperator {
    public Multiply(List<Expression> operands) { super(operands); }
    public int evaluate() {
        return getOperands().stream().mapToInt(Expression::evaluate)
                            .reduce(1, (a, b) -> a * b);
    }
    public String display() { ... }
}

public class Negate implements Expression {
    private final Expression operand;
    public Negate(Expression operand) { this.operand = operand; }
    public int evaluate() { return -operand.evaluate(); }
    public String display() { ... }
}

public class MathBook {
    private final Expression expression;
    public MathBook(Expression expression) { this.expression = expression; }
    public int evaluate() { return expression.evaluate(); }
}`,
          checklist: ['Expression interface; each class implements evaluate itself', 'Composites recurse over their children', 'MathBook just delegates — no instanceof or type switch', 'Shared n-ary logic abstracted rather than duplicated'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('display()') + ' in ' + c('MathBook') + '. A Num displays as its value; Add and Multiply display their operands joined by " + " or " * ", wrapped in one pair of parentheses; Negate displays as "-" followed by its operand. The test shows the expected output.',
          prefill: `public class MathBook {
    // ...
    public String display() {
        // TODO
    }
}`,
          model: `// In NaryOperator — Template Method style: subclasses only supply the symbol
public abstract class NaryOperator implements Expression {
    ...
    protected abstract String symbol();

    public String display() {
        return "(" + operands.stream()
                             .map(Expression::display)
                             .collect(Collectors.joining(" " + symbol() + " "))
               + ")";
    }
}

public class Add extends NaryOperator {
    ...
    protected String symbol() { return "+"; }
}

public class Multiply extends NaryOperator {
    ...
    protected String symbol() { return "*"; }
}

public class Negate implements Expression {
    ...
    public String display() { return "-" + operand.display(); }
}

public class MathBook {
    ...
    public String display() { return expression.display(); }
}`,
          checklist: ['display() added to the Expression interface and implemented per class', 'Joining with the right symbol and one pair of parentheses per operator', 'No duplicated join logic between Add and Multiply', 'Output matches "((1 + 2) * -3)" exactly'] }
      ] },

    /* ---------------------------------------------------------------- */
    { title: 'Cloud storage plans',
      intro: '<p>A cloud storage company sells plans built from a base plan plus optional add-ons.</p>' +
        '<ul><li><b>Basic</b> plan: 100 GB, $2.00 a month. <b>Pro</b> plan: 2000 GB, $10.00 a month.</li>' +
        '<li><b>extra</b> add-on: +1000 GB, +$5.00. Can be added several times.</li>' +
        '<li><b>backup</b> add-on: +$3.00, adds the feature "daily backup".</li>' +
        '<li><b>family</b> add-on: multiplies the cost of <i>everything added before it</i> by 1.5, and adds the feature "family sharing".</li></ul>' +
        '<p>Add-ons are applied in the order given. You must implement the methods of ' + c('CloudController') + '.</p>',
      files: [
        { name: 'CloudController.java', text: `public class CloudController {
    /** base is "basic" or "pro"; addOns are applied in order. Returns a plan id. */
    public String createPlan(String base, List<String> addOns) { ... }
    public double monthlyCost(String planId) { ... }
    public int storageGb(String planId) { ... }
    public String describe(String planId) { ... }
}` },
        { name: 'CloudControllerTest.java', text: `@Test
public void testCostAndStorage() {
    CloudController c = new CloudController();
    String id = c.createPlan("pro", List.of("extra", "family", "backup"));
    assertEquals(25.5, c.monthlyCost(id), 0.001);   // (10 + 5) * 1.5 + 3
    assertEquals(3000, c.storageGb(id));
}

@Test
public void testDescribe() {
    CloudController c = new CloudController();
    String id = c.createPlan("basic", List.of("backup", "extra"));
    assertEquals("Basic plan (1100 GB): daily backup", c.describe(id));
}` }
      ],
      parts: [
        { kind: 'written', marks: 3,
          prompt: 'Which design pattern best fits the add-ons? Justify by mapping the scenario to the pattern’s key characteristics, and explain why the order of add-ons matters in your design.',
          model: '<p><b>Decorator.</b> ' + c('Plan') + ' is the component interface (' + c('cost()') + ', ' + c('storageGb()') + ', ' + c('features()') + '); ' + c('BasicPlan') + ' and ' + c('ProPlan') + ' are concrete components; each add-on is a decorator that wraps a Plan, delegates to it and adjusts the result. ' +
            'Add-ons stack at runtime in any combination and repeat (extra × 2), with no subclass per combination, and a new add-on is one new class.</p>' +
            '<p>Order matters because each decorator only sees what it wraps: ' + c('Family') + ' multiplies the cost of the inner chain, so add-ons applied after it (outside it) are not multiplied — exactly the "everything added before it" rule.</p>',
          checklist: ['Named Decorator', 'Component, concrete components and decorators mapped', 'Runtime stacking and repetition without class explosion', 'Order explained: family wraps only the inner chain'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('createPlan') + ', ' + c('monthlyCost') + ' and ' + c('storageGb') + ' so that ' + c('testCostAndStorage') + ' passes.',
          prefill: `public interface Plan {
    // ...
}

public class CloudController {
    private Map<String, Plan> plans = new HashMap<>();

    public String createPlan(String base, List<String> addOns) {
        // TODO
    }
    public double monthlyCost(String planId) {
        // TODO
    }
    public int storageGb(String planId) {
        // TODO
    }
}`,
          model: `public interface Plan {
    double cost();
    int storageGb();
    List<String> features();
    String baseName();
}

public class BasicPlan implements Plan {
    public double cost() { return 2.0; }
    public int storageGb() { return 100; }
    public List<String> features() { return List.of(); }
    public String baseName() { return "Basic"; }
}

public class ProPlan implements Plan {
    public double cost() { return 10.0; }
    public int storageGb() { return 2000; }
    public List<String> features() { return List.of(); }
    public String baseName() { return "Pro"; }
}

/** Abstract decorator: by default, everything passes straight through. */
public abstract class AddOn implements Plan {
    protected final Plan inner;
    protected AddOn(Plan inner) { this.inner = inner; }
    public double cost() { return inner.cost(); }
    public int storageGb() { return inner.storageGb(); }
    public List<String> features() { return inner.features(); }
    public String baseName() { return inner.baseName(); }
}

public class ExtraStorage extends AddOn {
    public ExtraStorage(Plan p) { super(p); }
    public double cost() { return inner.cost() + 5.0; }
    public int storageGb() { return inner.storageGb() + 1000; }
}

public class Backup extends AddOn {
    public Backup(Plan p) { super(p); }
    public double cost() { return inner.cost() + 3.0; }
    public List<String> features() { return with(inner.features(), "daily backup"); }
}

public class FamilySharing extends AddOn {
    public FamilySharing(Plan p) { super(p); }
    public double cost() { return inner.cost() * 1.5; }
    public List<String> features() { return with(inner.features(), "family sharing"); }
}
// helper in AddOn:
//   protected static List<String> with(List<String> xs, String x) {
//       List<String> r = new ArrayList<>(xs); r.add(x); return r; }

public class CloudController {
    private final Map<String, Plan> plans = new HashMap<>();
    private int nextId = 0;

    public String createPlan(String base, List<String> addOns) {
        Plan plan = switch (base) {
            case "basic" -> new BasicPlan();
            case "pro"   -> new ProPlan();
            default -> throw new IllegalArgumentException(base);
        };
        for (String a : addOns) plan = wrap(plan, a);
        String id = "plan" + (nextId++);
        plans.put(id, plan);
        return id;
    }

    /** The one place strings become objects (a simple factory). */
    private Plan wrap(Plan p, String addOn) {
        return switch (addOn) {
            case "extra"  -> new ExtraStorage(p);
            case "backup" -> new Backup(p);
            case "family" -> new FamilySharing(p);
            default -> throw new IllegalArgumentException(addOn);
        };
    }

    public double monthlyCost(String planId) { return plans.get(planId).cost(); }
    public int storageGb(String planId) { return plans.get(planId).storageGb(); }
}`,
          checklist: ['Plan interface; Basic and Pro as concrete components', 'Abstract decorator delegating to the wrapped plan', 'Add-ons applied in order by wrapping in a loop', 'Family multiplies only the inner cost (test gives 25.5)', 'String-to-object mapping isolated in one factory method'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('describe') + ': "<i>Base</i> plan (<i>storage</i> GB): <i>features in order, comma-separated</i>", or just "<i>Base</i> plan (<i>storage</i> GB)" if there are no features. Then add an <b>encryption</b> add-on (+$1.00, feature "encryption") and explain in a comment what you had to change.',
          prefill: `public class CloudController {
    // ...
    public String describe(String planId) {
        // TODO
    }
}`,
          model: `public class CloudController {
    ...
    public String describe(String planId) {
        Plan p = plans.get(planId);
        String head = p.baseName() + " plan (" + p.storageGb() + " GB)";
        List<String> features = p.features();
        return features.isEmpty() ? head : head + ": " + String.join(", ", features);
    }

    private Plan wrap(Plan p, String addOn) {
        return switch (addOn) {
            ...
            case "encryption" -> new Encryption(p);
            ...
        };
    }
}

public class Encryption extends AddOn {
    public Encryption(Plan p) { super(p); }
    public double cost() { return inner.cost() + 1.0; }
    public List<String> features() { return with(inner.features(), "encryption"); }
}

/* Adding encryption needed one new decorator class and one line in the
   factory method. No existing plan or add-on class changed (Open-Closed). */`,
          checklist: ['describe built from the decorator chain (baseName, storage, features)', 'Correct format with and without features', 'Encryption added as one new decorator', 'Change limited to the new class plus the factory mapping'] }
      ] },

    /* ---------------------------------------------------------------- */
    { title: 'Stock alerts',
      intro: '<p>A trading app tracks stock prices. Users set <b>price alerts</b> and hold <b>portfolios</b>, and both must react whenever a price changes. Implement the methods in ' + c('Market') + '.</p>' +
        '<ul><li>An <b>above</b> alert on a stock with threshold T fires when the price moves from ≤ T to &gt; T; a <b>below</b> alert fires when it moves from ≥ T to &lt; T. An alert can fire many times, each time the price crosses.</li>' +
        '<li>Each firing appends a message to the user’s alert list, e.g. ' + c('"ACME rose above 50.00"') + ' or ' + c('"ACME fell below 40.00"') + ' (two decimal places).</li>' +
        '<li>A user’s portfolio holds quantities of stocks. Its value is the sum of quantity × latest price, and its value history records the new value every time a price of a stock it holds changes.</li></ul>',
      files: [
        { name: 'Market.java', text: `public class Market {
    public void addStock(String symbol, double price) { ... }
    public void updatePrice(String symbol, double price) { ... }
    public void addAlert(String userId, String symbol, double threshold, boolean above) { ... }
    public List<String> getAlerts(String userId) { ... }
    public void buy(String userId, String symbol, int qty) { ... }
    public List<Double> valueHistory(String userId) { ... }
}` },
        { name: 'MarketTest.java', text: `@Test
public void testAlerts() {
    Market m = new Market();
    m.addStock("ACME", 45);
    m.addAlert("u1", "ACME", 50, true);
    m.updatePrice("ACME", 52);     // crosses above
    m.updatePrice("ACME", 55);     // still above: no new alert
    m.updatePrice("ACME", 48);
    m.updatePrice("ACME", 51);     // crosses above again
    assertEquals(List.of("ACME rose above 50.00", "ACME rose above 50.00"),
                 m.getAlerts("u1"));
}

@Test
public void testPortfolio() {
    Market m = new Market();
    m.addStock("ACME", 10);
    m.addStock("BOLT", 5);
    m.buy("u1", "ACME", 3);
    m.buy("u1", "BOLT", 2);
    m.updatePrice("ACME", 12);     // 36 + 10
    m.updatePrice("BOLT", 4);      // 36 + 8
    assertEquals(List.of(46.0, 44.0), m.valueHistory("u1"));
}` }
      ],
      parts: [
        { kind: 'written', marks: 3,
          prompt: 'What design pattern fits this problem? Justify by mapping the scenario to the pattern’s key characteristics, and state whether you will use push or pull and why.',
          model: '<p><b>Observer.</b> Each ' + c('Stock') + ' is a subject that keeps a list of observers; ' + c('PriceAlert') + ' and ' + c('Portfolio') + ' are concrete observers implementing a ' + c('StockObserver') + ' interface. ' +
            'When ' + c('updatePrice') + ' changes a stock’s price, the stock notifies every registered observer, without knowing what they are. Alerts and portfolios subscribe at runtime (on ' + c('addAlert') + ' / ' + c('buy') + '), and a new kind of reaction is a new observer class.</p>' +
            '<p>Push the old and new price, e.g. ' + c('priceChanged(Stock s, double oldPrice, double newPrice)') + ': alerts need the old price to detect a crossing, and passing the stock lets observers pull its symbol (a hybrid).</p>',
          checklist: ['Named Observer', 'Stock as subject; alerts and portfolios as observers', 'Runtime subscription; subject decoupled from observer types', 'Push/pull choice justified (old price needed for crossing)'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('addStock') + ', ' + c('updatePrice') + ', ' + c('addAlert') + ' and ' + c('getAlerts') + ' so that ' + c('testAlerts') + ' passes.',
          prefill: `public interface StockObserver {
    // ...
}

public class Stock {
    // ...
}

public class Market {
    // ...
}`,
          model: `public interface StockObserver {
    void priceChanged(Stock stock, double oldPrice, double newPrice);
}

public class Stock {
    private final String symbol;
    private double price;
    private final List<StockObserver> observers = new ArrayList<>();

    public Stock(String symbol, double price) { this.symbol = symbol; this.price = price; }
    public String getSymbol() { return symbol; }
    public double getPrice() { return price; }

    public void attach(StockObserver o) { observers.add(o); }
    public void detach(StockObserver o) { observers.remove(o); }

    public void setPrice(double newPrice) {
        double old = price;
        price = newPrice;
        for (StockObserver o : List.copyOf(observers)) o.priceChanged(this, old, newPrice);
    }
}

public class PriceAlert implements StockObserver {
    private final double threshold;
    private final boolean above;
    private final List<String> inbox;   // the owning user's alert list

    public PriceAlert(double threshold, boolean above, List<String> inbox) {
        this.threshold = threshold; this.above = above; this.inbox = inbox;
    }

    public void priceChanged(Stock s, double oldPrice, double newPrice) {
        if (above && oldPrice <= threshold && newPrice > threshold) {
            inbox.add(String.format("%s rose above %.2f", s.getSymbol(), threshold));
        } else if (!above && oldPrice >= threshold && newPrice < threshold) {
            inbox.add(String.format("%s fell below %.2f", s.getSymbol(), threshold));
        }
    }
}

public class Market {
    private final Map<String, Stock> stocks = new HashMap<>();
    private final Map<String, List<String>> alerts = new HashMap<>();

    public void addStock(String symbol, double price) {
        stocks.put(symbol, new Stock(symbol, price));
    }
    public void updatePrice(String symbol, double price) {
        stocks.get(symbol).setPrice(price);
    }
    public void addAlert(String userId, String symbol, double threshold, boolean above) {
        List<String> inbox = alerts.computeIfAbsent(userId, k -> new ArrayList<>());
        stocks.get(symbol).attach(new PriceAlert(threshold, above, inbox));
    }
    public List<String> getAlerts(String userId) {
        return List.copyOf(alerts.getOrDefault(userId, List.of()));
    }
}`,
          checklist: ['Observer interface; Stock keeps observers and notifies on setPrice', 'Crossing logic uses old and new price (no alert while staying above)', 'Message format with two decimals', 'Market only wires things up — no alert logic in the controller'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('buy') + ' and ' + c('valueHistory') + ' so that ' + c('testPortfolio') + ' passes. A portfolio must not record a value when a stock it does not hold changes.',
          prefill: `public class Portfolio implements StockObserver {
    // ...
}

public class Market {
    // ...
    public void buy(String userId, String symbol, int qty) {
        // TODO
    }
    public List<Double> valueHistory(String userId) {
        // TODO
    }
}`,
          model: `public class Portfolio implements StockObserver {
    private final Map<Stock, Integer> holdings = new LinkedHashMap<>();
    private final List<Double> history = new ArrayList<>();

    public void add(Stock stock, int qty) {
        if (!holdings.containsKey(stock)) stock.attach(this);   // subscribe once
        holdings.merge(stock, qty, Integer::sum);
    }

    public double value() {
        return holdings.entrySet().stream()
                .mapToDouble(e -> e.getKey().getPrice() * e.getValue())
                .sum();
    }

    public void priceChanged(Stock s, double oldPrice, double newPrice) {
        history.add(value());   // only subscribed to stocks it holds
    }

    public List<Double> getHistory() { return List.copyOf(history); }
}

public class Market {
    ...
    private final Map<String, Portfolio> portfolios = new HashMap<>();

    public void buy(String userId, String symbol, int qty) {
        portfolios.computeIfAbsent(userId, k -> new Portfolio())
                  .add(stocks.get(symbol), qty);
    }

    public List<Double> valueHistory(String userId) {
        Portfolio p = portfolios.get(userId);
        return p == null ? List.of() : p.getHistory();
    }
}`,
          checklist: ['Portfolio implements the same observer interface', 'Subscribes only to stocks it holds, and only once per stock', 'Records value after each relevant change', 'Pulls the latest prices from the stocks to compute value'] }
      ] },

    /* ---------------------------------------------------------------- */
    { title: 'Ride fares',
      intro: '<p>A ride-hailing app prices trips. Implement ' + c('RideApp') + '.</p>' +
        '<ul><li><b>standard</b>: $3.50 + $1.80 per km + $0.40 per minute.</li>' +
        '<li><b>surge</b>: the standard fare × the current surge multiplier (set with ' + c('setSurgeMultiplier') + ', default 1.0).</li>' +
        '<li><b>shared</b>: 70% of the standard fare, but never less than $5.00.</li></ul>' +
        '<p>Operations staff switch the active pricing with ' + c('setPricing') + ' at any time. A ride’s fare is fixed by the pricing (and multiplier) active when it was <b>requested</b>. More pricing schemes are expected.</p>',
      files: [
        { name: 'RideApp.java', text: `public class RideApp {
    public void setPricing(String mode) { ... }         // "standard", "surge", "shared"
    public void setSurgeMultiplier(double m) { ... }
    public void requestRide(String rideId, String riderId, double km, int minutes) { ... }
    public double fare(String rideId) { ... }
    public void buyRidePass(String riderId) { ... }      // part c
}` },
        { name: 'RideAppTest.java', text: `@Test
public void testFaresLockedAtRequest() {
    RideApp app = new RideApp();
    app.requestRide("r1", "ann", 10, 20);        // standard: 3.5 + 18 + 8
    app.setPricing("surge");
    app.setSurgeMultiplier(2.0);
    app.requestRide("r2", "ann", 10, 20);
    app.setSurgeMultiplier(3.0);
    assertEquals(29.5, app.fare("r1"), 0.001);
    assertEquals(59.0, app.fare("r2"), 0.001);   // the multiplier at request time
}

@Test
public void testRidePass() {
    RideApp app = new RideApp();
    app.setPricing("shared");
    app.buyRidePass("bo");
    app.requestRide("r1", "bo", 10, 20);         // 0.7 * 29.5 = 20.65, then 15% off
    assertEquals(17.5525, app.fare("r1"), 0.001);
}` }
      ],
      parts: [
        { kind: 'written', marks: 3,
          prompt: 'What design pattern fits the pricing schemes? Justify by mapping the scenario to the pattern, and explain how your design fixes each ride’s fare at request time.',
          model: '<p><b>Strategy.</b> A ' + c('PricingStrategy') + ' interface with ' + c('fare(km, minutes)') + '; ' + c('StandardPricing') + ', ' + c('SurgePricing') + ' and ' + c('SharedPricing') + ' are interchangeable concrete strategies; ' + c('RideApp') + ' is the context, holding the current strategy and swapping it in ' + c('setPricing') + ' at runtime. New schemes are new classes (Open-Closed), with no switch inside fare calculation.</p>' +
            '<p>To fix fares at request time, ' + c('requestRide') + ' computes the fare with the current strategy immediately and stores it on the ' + c('Ride') + ' (or stores an immutable strategy snapshot, e.g. a ' + c('SurgePricing') + ' holding its own multiplier value). Later changes to the app’s strategy or multiplier do not affect existing rides.</p>',
          checklist: ['Named Strategy', 'Interface + concrete strategies + context mapped', 'Swapped at runtime by setPricing', 'Fare (or strategy snapshot) captured at request time'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Implement ' + c('setPricing') + ', ' + c('setSurgeMultiplier') + ', ' + c('requestRide') + ' and ' + c('fare') + ' so that ' + c('testFaresLockedAtRequest') + ' passes.',
          prefill: `public interface PricingStrategy {
    // ...
}

public class RideApp {
    // ...
}`,
          model: `public interface PricingStrategy {
    double fare(double km, int minutes);
}

public class StandardPricing implements PricingStrategy {
    public double fare(double km, int minutes) { return 3.5 + 1.8 * km + 0.4 * minutes; }
}

public class SurgePricing implements PricingStrategy {
    private final double multiplier;
    private final PricingStrategy base = new StandardPricing();
    public SurgePricing(double multiplier) { this.multiplier = multiplier; }
    public double fare(double km, int minutes) { return base.fare(km, minutes) * multiplier; }
}

public class SharedPricing implements PricingStrategy {
    public static final double MIN_FARE = 5.0;
    private final PricingStrategy base = new StandardPricing();
    public double fare(double km, int minutes) {
        return Math.max(MIN_FARE, 0.7 * base.fare(km, minutes));
    }
}

public class Ride {
    private final String id, riderId;
    private final double fare;          // fixed at request time
    public Ride(String id, String riderId, double fare) { ... }
    public double getFare() { return fare; }
}

public class RideApp {
    private String mode = "standard";
    private double surgeMultiplier = 1.0;
    private final Map<String, Ride> rides = new HashMap<>();

    public void setPricing(String mode) { this.mode = mode; }
    public void setSurgeMultiplier(double m) { this.surgeMultiplier = m; }

    /** Builds the strategy for the current settings: the one place modes are named. */
    private PricingStrategy currentStrategy() {
        return switch (mode) {
            case "standard" -> new StandardPricing();
            case "surge"    -> new SurgePricing(surgeMultiplier);
            case "shared"   -> new SharedPricing();
            default -> throw new IllegalArgumentException(mode);
        };
    }

    public void requestRide(String rideId, String riderId, double km, int minutes) {
        double fare = currentStrategy().fare(km, minutes);
        rides.put(rideId, new Ride(rideId, riderId, fare));
    }

    public double fare(String rideId) { return rides.get(rideId).getFare(); }
}`,
          checklist: ['PricingStrategy interface with three implementations', 'Surge and shared reuse standard rather than duplicating the formula', 'Fare computed and stored at request time', 'String modes mapped to strategies in exactly one place'] },
        { kind: 'code', marks: 6, lang: 'Java',
          prompt: 'Riders can buy a <b>RidePass</b>, which takes 15% off whatever fare their pricing gives. Implement ' + c('buyRidePass') + ' so that ' + c('testRidePass') + ' passes, without modifying any existing pricing class.',
          prefill: `public class RideApp {
    // ...
    public void buyRidePass(String riderId) {
        // TODO
    }
}`,
          model: `/** A strategy that wraps another strategy (a Decorator over Strategy),
 *  so the discount works with any current or future pricing scheme. */
public class RidePassDiscount implements PricingStrategy {
    public static final double DISCOUNT = 0.15;
    private final PricingStrategy inner;
    public RidePassDiscount(PricingStrategy inner) { this.inner = inner; }
    public double fare(double km, int minutes) {
        return inner.fare(km, minutes) * (1 - DISCOUNT);
    }
}

public class RideApp {
    ...
    private final Set<String> passHolders = new HashSet<>();

    public void buyRidePass(String riderId) { passHolders.add(riderId); }

    public void requestRide(String rideId, String riderId, double km, int minutes) {
        PricingStrategy s = currentStrategy();
        if (passHolders.contains(riderId)) s = new RidePassDiscount(s);
        rides.put(rideId, new Ride(rideId, riderId, s.fare(km, minutes)));
    }
}

/* Check: shared = max(5, 0.7 * 29.5) = 20.65; with pass 20.65 * 0.85 = 17.5525. */`,
          checklist: ['Discount implemented by wrapping a strategy (no change to existing pricing classes)', 'Works for any pricing scheme', 'Pass holders tracked per rider', 'Fare still locked at request time'] }
      ] }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
