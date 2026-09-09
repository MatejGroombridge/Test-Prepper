/* subjects/comp3311.js — COMP3311 Database Systems.
   Questions cover every question type across the 20T3, 21T3, 22T3 and 23T1
   papers, re-based on the Classes database.
   Code answers are not auto-marked: you write your attempt, then compare it
   against the sample answer, or use "Copy for AI hint" for feedback on it. */
(function (global) {
  'use strict';

  /* ======================== the Classes schema ========================= */

  var SCHEMA_SUMMARY = [
    'Students(id, name, d_o_birth)',
    'Rooms(id, name, rtype, capacity)',
    'Classes(id, course, ctype, held_in -> Rooms.id, day_of_week, start_time, end_time)',
    'Facilities(id, name)',
    'Has(room_id -> Rooms.id, facility_id -> Facilities.id, nitems)',
    'Attends(student_id -> Students.id, class_id -> Classes.id)',
    '',
    'RoomType  = Lecture Theatre | Tutorial Room | Computer Lab | Meeting Room',
    'ClassType = Lecture | Tutorial | Seminar | Lab Class | Tute-Lab',
    'Weekday   = Mon | Tue | Wed | Thu | Fri',
    '',
    'start_time / end_time are whole hours (9..20 and 10..21)',
    'course is an 8-character code such as COMP3311',
    'id values are not contiguous'
  ].join('\n');

  var SCHEMA_DDL =
    'create table Students (\n' +
    '    id          integer,\n' +
    '    name        text not null,\n' +
    '    d_o_birth   date not null,\n' +
    '    primary key (id)\n' +
    ');\n\n' +
    "create type RoomType as enum\n" +
    "    ('Lecture Theatre','Tutorial Room','Computer Lab','Meeting Room');\n\n" +
    'create table Rooms (\n' +
    '    id          integer,\n' +
    '    name        text not null,\n' +
    '    rtype       RoomType not null,\n' +
    '    capacity    integer not null check (capacity > 0),\n' +
    '    primary key (id)\n' +
    ');\n\n' +
    "create type ClassType as enum\n" +
    "    ('Lecture','Tutorial','Seminar','Lab Class','Tute-Lab');\n" +
    "create type Weekday as enum ('Mon','Tue','Wed','Thu','Fri');\n\n" +
    'create table Classes (\n' +
    '    id          integer,\n' +
    "    course      char(8) not null check (course ~ '[A-Z]{4}[0-9]{4}'),\n" +
    '    ctype       ClassType not null,\n' +
    '    held_in     integer not null references Rooms(id),\n' +
    '    day_of_week Weekday not null,\n' +
    '    start_time  integer not null check (start_time between 9 and 20),\n' +
    '    end_time    integer not null check (end_time between 10 and 21),\n' +
    '    primary key (id)\n' +
    ');\n\n' +
    'create table Facilities (\n' +
    '    id          integer,\n' +
    '    name        text not null,\n' +
    '    primary key (id)\n' +
    ');\n\n' +
    'create table Has (\n' +
    '    room_id     integer references Rooms(id),\n' +
    '    facility_id integer references Facilities(id),\n' +
    '    nitems      integer not null check (nitems > 0),\n' +
    '    primary key (room_id,facility_id)\n' +
    ');\n\n' +
    'create table Attends (\n' +
    '    student_id  integer references Students(id),\n' +
    '    class_id    integer references Classes(id),\n' +
    '    primary key (student_id,class_id)\n' +
    ');';

  function schemaBlock() {
    return {
      name: 'Classes schema',
      langs: [
        { name: 'Summary', text: SCHEMA_SUMMARY },
        { name: 'Full DDL', text: SCHEMA_DDL }
      ]
    };
  }

  /* ============================== helpers ============================== */

  function code(o) { o.kind = 'code'; return o; }
  function wr(o) { o.kind = 'written'; return o; }
  function mc(o) { o.kind = 'choice'; return o; }

  function shuffleChoice(rng, options, correctIdx) {
    var idx = rng.shuffle(options.map(function (_, i) { return i; }));
    return { options: idx.map(function (i) { return options[i]; }), correct: idx.indexOf(correctIdx) };
  }

  function bankTemplate(meta, variants, makeParts) {
    return {
      id: meta.id, topic: meta.topic, title: meta.title, marks: meta.marks,
      guide: meta.guide,
      build: function (rng) {
        var v = rng.pick(variants);
        return {
          intro: meta.introFor ? meta.introFor(v) : '<p>' + v.task + '</p>',
          data: meta.withSchema ? [schemaBlock()].concat(v.data || []) : (v.data || []),
          parts: makeParts(v, rng)
        };
      }
    };
  }

  var SQL_CHECKLIST = [
    'Joined on the right foreign keys',
    'Every non-aggregated column appears in the GROUP BY (if grouping)',
    'Handled NULLs / missing rows where the question implies them',
    'The view has exactly the required attributes, in order'
  ];

  /* ==================== 1. SQL: joins and filtering ==================== */

  var SQL_BASIC = [
    { task: 'List the course, class type and day of every class held in the room named <b>Ainsworth G03</b>, ordered by day and start time.',
      view: 'q(course, ctype, day_of_week, start_time)',
      tail: 'where  ...',
      sample:
'create or replace view q(course, ctype, day_of_week, start_time)\n' +
'as\n' +
'select c.course, c.ctype, c.day_of_week, c.start_time\n' +
'from   Classes c join Rooms r on c.held_in = r.id\n' +
"where  r.name = 'Ainsworth G03'\n" +
'order  by c.day_of_week, c.start_time;',
      notes: 'The join is the whole question: <code>Classes.held_in</code> is a foreign key to <code>Rooms.id</code>, and you are given the room <i>name</i> rather than its id. Ordering by <code>day_of_week</code> works sensibly because it is an enum — PostgreSQL orders enums by their declaration order, so Mon comes before Tue.' },

    { task: 'List the name and date of birth of every student who attends at least one class in the course <b>COMP3311</b>. Each student should appear once.',
      view: 'q(name, d_o_birth)',
      tail: 'where  ...',
      sample:
'create or replace view q(name, d_o_birth)\n' +
'as\n' +
'select distinct s.name, s.d_o_birth\n' +
'from   Students s\n' +
'       join Attends a on a.student_id = s.id\n' +
'       join Classes c on a.class_id = c.id\n' +
"where  c.course = 'COMP3311';",
      notes: 'A student attends several COMP3311 classes (a lecture and a tutorial, say), so without <code>distinct</code> they appear once per class. The three-table chain Students → Attends → Classes is the shape almost every query in this schema uses.' },

    { task: 'List the name, type and capacity of every room that can seat more than 100 people, largest first.',
      view: 'q(name, rtype, capacity)',
      tail: 'where  ...',
      sample:
'create or replace view q(name, rtype, capacity)\n' +
'as\n' +
'select name, rtype, capacity\n' +
'from   Rooms\n' +
'where  capacity > 100\n' +
'order  by capacity desc;',
      notes: 'A single-table query. Worth doing quickly and moving on — not every question needs a join.' },

    { task: 'List the name of every facility available in the room named <b>Quadrangle G040</b>, together with how many of each there are.',
      view: 'q(facility, nitems)',
      tail: 'where  ...',
      sample:
'create or replace view q(facility, nitems)\n' +
'as\n' +
'select f.name, h.nitems\n' +
'from   Facilities f\n' +
'       join Has h   on h.facility_id = f.id\n' +
'       join Rooms r on h.room_id = r.id\n' +
"where  r.name = 'Quadrangle G040'\n" +
'order  by f.name;',
      notes: '<code>Has</code> is the many-to-many table between rooms and facilities, and it carries its own attribute <code>nitems</code>. Attributes of a relationship live in the relationship table.' },

    { task: 'List every class scheduled on <b>Wednesday</b> that starts at or after 6pm, showing the course, the class type and the room name.',
      view: 'q(course, ctype, room, start_time)',
      tail: 'where  ...',
      sample:
'create or replace view q(course, ctype, room, start_time)\n' +
'as\n' +
'select c.course, c.ctype, r.name, c.start_time\n' +
'from   Classes c join Rooms r on c.held_in = r.id\n' +
"where  c.day_of_week = 'Wed' and c.start_time >= 18\n" +
'order  by c.start_time;',
      notes: '<code>start_time</code> is a plain integer hour on a 24-hour clock, so 6pm is 18. Enum values are compared against string literals.' },

    { task: 'List the course and day of every <b>Tute-Lab</b> class that is <i>not</i> held in a Computer Lab, with the room name and its type.',
      view: 'q(course, day_of_week, room, rtype)',
      tail: 'where  ...',
      sample:
'create or replace view q(course, day_of_week, room, rtype)\n' +
'as\n' +
'select c.course, c.day_of_week, r.name, r.rtype\n' +
'from   Classes c join Rooms r on c.held_in = r.id\n' +
"where  c.ctype = 'Tute-Lab' and r.rtype <> 'Computer Lab';",
      notes: 'Two conditions on two different tables — both go in the same WHERE clause after the join. A Tute-Lab is meant to run in a lab, so this finds the scheduling anomalies.' },

    { task: 'List the name of every student born before 2004, together with how their name reads in the form "Name (born YYYY)".',
      view: 'q(name, description)',
      tail: 'where  ...',
      sample:
'create or replace view q(name, description)\n' +
'as\n' +
'select name,\n' +
"       name || ' (born ' || extract(year from d_o_birth)::text || ')'\n" +
'from   Students\n' +
"where  d_o_birth < '2004-01-01'\n" +
'order  by d_o_birth;',
      notes: '<code>||</code> concatenates; anything non-text needs a cast, hence <code>::text</code>. <code>extract(year from ...)</code> pulls a component out of a date.' },

    { task: 'List every distinct course that has at least one class scheduled, in alphabetical order.',
      view: 'q(course)',
      tail: '',
      sample:
'create or replace view q(course)\n' +
'as\n' +
'select distinct course\n' +
'from   Classes\n' +
'order  by course;',
      notes: 'Note <code>course</code> is <code>char(8)</code>, which is blank-padded. That rarely matters here, but it is why comparisons sometimes surprise people — cast to <code>text</code> if you need exact string behaviour.' }
  ];

  /* ================= 2. SQL: grouping and aggregates ================== */

  var SQL_GROUP = [
    { task: 'For each course, report how many classes are scheduled.',
      view: 'q(course, nclasses)',
      tail: 'group  by ...',
      sample:
'create or replace view q(course, nclasses)\n' +
'as\n' +
'select course, count(*)\n' +
'from   Classes\n' +
'group  by course\n' +
'order  by count(*) desc;',
      notes: 'The simplest possible grouping. Everything in the SELECT list is either grouped or aggregated.' },

    { task: 'For each class, report how many students attend it. Classes with no students enrolled must appear with a count of 0.',
      view: 'q(class_id, course, ctype, nstudents)',
      tail: 'group  by ...',
      sample:
'create or replace view q(class_id, course, ctype, nstudents)\n' +
'as\n' +
'select c.id, c.course, c.ctype, count(a.student_id)\n' +
'from   Classes c left outer join Attends a on a.class_id = c.id\n' +
'group  by c.id, c.course, c.ctype;',
      notes: 'Two traps in one question. The <b>left outer join</b> keeps classes nobody attends, and you must count <code>a.student_id</code> rather than <code>*</code> — <code>count(*)</code> counts the row the outer join manufactures and returns 1 instead of 0.' },

    { task: 'For each room, report how many classes are held in it and the total number of hours it is occupied per week.',
      view: 'q(room, nclasses, hours)',
      tail: 'group  by ...',
      sample:
'create or replace view q(room, nclasses, hours)\n' +
'as\n' +
'select r.name, count(c.id), coalesce(sum(c.end_time - c.start_time), 0)\n' +
'from   Rooms r left outer join Classes c on c.held_in = r.id\n' +
'group  by r.id, r.name\n' +
'order  by 3 desc;',
      notes: 'Duration is just <code>end_time - start_time</code> because the times are whole hours. <code>sum</code> over an empty group returns NULL, not 0 — <code>coalesce</code> fixes that. Grouping by <code>r.id</code> as well as the name keeps two rooms with the same name apart.' },

    { task: 'For each room type, report the number of rooms, and the smallest, largest and average capacity.',
      view: 'q(rtype, nrooms, smallest, largest, avg_capacity)',
      tail: 'group  by ...',
      sample:
'create or replace view q(rtype, nrooms, smallest, largest, avg_capacity)\n' +
'as\n' +
'select rtype, count(*), min(capacity), max(capacity), round(avg(capacity), 1)\n' +
'from   Rooms\n' +
'group  by rtype;',
      notes: 'Several aggregates over the same group. <code>avg</code> returns a numeric with a long tail of decimals, so round it.' },

    { task: 'For each student, report how many classes they attend and how many distinct courses those classes belong to.',
      view: 'q(student, nclasses, ncourses)',
      tail: 'group  by ...',
      sample:
'create or replace view q(student, nclasses, ncourses)\n' +
'as\n' +
'select s.name, count(a.class_id), count(distinct c.course)\n' +
'from   Students s\n' +
'       join Attends a on a.student_id = s.id\n' +
'       join Classes c on a.class_id = c.id\n' +
'group  by s.id, s.name;',
      notes: 'The <code>distinct</code> inside the second count is the point: a student attending a lecture and a tutorial for the same course is taking one course, not two.' },

    { task: 'Report every course that has more than 4 classes scheduled, with the number of classes.',
      view: 'q(course, nclasses)',
      tail: 'group  by ...',
      sample:
'create or replace view q(course, nclasses)\n' +
'as\n' +
'select course, count(*)\n' +
'from   Classes\n' +
'group  by course\n' +
'having count(*) > 4;',
      notes: 'A condition on an aggregate belongs in <code>HAVING</code>. <code>WHERE</code> filters rows before grouping happens, so it cannot see a count.' },

    { task: 'For each day of the week, report how many classes run and how many different rooms are in use.',
      view: 'q(day_of_week, nclasses, nrooms)',
      tail: 'group  by ...',
      sample:
'create or replace view q(day_of_week, nclasses, nrooms)\n' +
'as\n' +
'select day_of_week, count(*), count(distinct held_in)\n' +
'from   Classes\n' +
'group  by day_of_week\n' +
'order  by day_of_week;',
      notes: 'Ordering by the enum gives Mon…Fri rather than alphabetical order, which is one of the reasons the schema uses an enum instead of text.' },

    { task: 'For each facility, report how many rooms have it and the total number of items across all rooms.',
      view: 'q(facility, nrooms, total_items)',
      tail: 'group  by ...',
      sample:
'create or replace view q(facility, nrooms, total_items)\n' +
'as\n' +
'select f.name, count(h.room_id), sum(h.nitems)\n' +
'from   Facilities f left outer join Has h on h.facility_id = f.id\n' +
'group  by f.id, f.name\n' +
'order  by 2 desc;',
      notes: 'The outer join keeps facilities that no room has. As always with an outer join, count the child key rather than <code>*</code>.' }
  ];

  /* ============ 3. SQL: subqueries, division and harder patterns ======= */

  var SQL_ADV = [
    { task: 'Report the course(s) with the <b>most</b> scheduled classes. There may be ties.',
      view: 'q(course, nclasses)',
      sample:
'create or replace view ClassCounts(course, n)\n' +
'as\n' +
'select course, count(*)\n' +
'from   Classes\n' +
'group  by course;\n' +
'\n' +
'create or replace view q(course, nclasses)\n' +
'as\n' +
'select course, n\n' +
'from   ClassCounts\n' +
'where  n = (select max(n) from ClassCounts);',
      notes: 'The standard "maximum" pattern: aggregate into a helper view, then compare against the max of that view. <code>order by n desc limit 1</code> is <b>wrong</b> whenever ties are possible — it silently drops all but one.' },

    { task: 'Report every room in which no class is ever held.',
      view: 'q(room, rtype, capacity)',
      sample:
'create or replace view q(room, rtype, capacity)\n' +
'as\n' +
'select r.name, r.rtype, r.capacity\n' +
'from   Rooms r\n' +
'where  not exists (select 1 from Classes c where c.held_in = r.id);',
      notes: 'Three ways to say "none": <code>not exists</code> (shown), <code>left outer join Classes ... where c.id is null</code>, or <code>where r.id not in (select held_in from Classes)</code>. The last is risky in general — if the column could be NULL, <code>NOT IN</code> returns nothing at all. Here <code>held_in</code> is <code>not null</code>, so it happens to be safe.' },

    { task: 'For each room, report a single comma-separated list of the facilities it has, in alphabetical order. Rooms with no facilities should show an empty string.',
      view: 'q(room, facilities)',
      sample:
'create or replace view q(room, facilities)\n' +
'as\n' +
'select r.name,\n' +
"       coalesce(string_agg(f.name, ',' order by f.name), '')\n" +
'from   Rooms r\n' +
'       left outer join Has h on h.room_id = r.id\n' +
'       left outer join Facilities f on h.facility_id = f.id\n' +
'group  by r.id, r.name;',
      notes: '<code>string_agg(expr, sep order by ...)</code> builds the list and controls its order in one step — the ORDER BY goes <i>inside</i> the aggregate call. Over an empty group it returns NULL, so wrap it in <code>coalesce</code> when the question asks for an empty string. This is the SQL alternative to writing a PL/pgSQL loop that concatenates strings.' },

    { task: 'Report every course whose classes are held <b>only</b> in Computer Labs.',
      view: 'q(course)',
      sample:
'-- "all classes are in labs" = "no class is anywhere else"\n' +
'create or replace view q(course)\n' +
'as\n' +
'select distinct c.course\n' +
'from   Classes c\n' +
'where  not exists (\n' +
'           select 1\n' +
'           from   Classes c2 join Rooms r on c2.held_in = r.id\n' +
"           where  c2.course = c.course and r.rtype <> 'Computer Lab'\n" +
'       );\n' +
'\n' +
'-- alternatively, count the room types used by each course:\n' +
'-- create or replace view CourseRoomTypes(course, rtype) as\n' +
'-- select distinct c.course, r.rtype\n' +
'-- from   Classes c join Rooms r on c.held_in = r.id;\n' +
'--\n' +
'-- create or replace view q(course) as\n' +
'-- select course from CourseRoomTypes\n' +
'-- group by course\n' +
"-- having count(*) = 1 and min(rtype) = 'Computer Lab';",
      notes: 'Two idioms for "only". The double negative — there is no class that breaks the rule — generalises to any condition. The second builds the set of distinct room types per course and insists it contains exactly one, which is the "mono-group" pattern (<code>group by ... having count(*) = 1</code>).' },

    { task: 'Report every room that has <b>every</b> facility listed in the Facilities table.',
      view: 'q(room)',
      sample:
'-- relational division: no facility is missing from this room\n' +
'create or replace view q(room)\n' +
'as\n' +
'select r.name\n' +
'from   Rooms r\n' +
'where  not exists (\n' +
'           (select f.id from Facilities f)\n' +
'           except\n' +
'           (select h.facility_id from Has h where h.room_id = r.id)\n' +
'       );\n' +
'\n' +
'-- alternatively, by counting:\n' +
'-- create or replace view q(room) as\n' +
'-- select r.name\n' +
'-- from   Rooms r join Has h on h.room_id = r.id\n' +
'-- group  by r.id, r.name\n' +
'-- having count(distinct h.facility_id) = (select count(*) from Facilities);',
      notes: 'This is <b>relational division</b>, and the <code>NOT EXISTS ( A EXCEPT B )</code> shape is the one to memorise: "there is nothing in A that is not in B". The counting version is shorter but only works because <code>Has</code> has a primary key on (room, facility), so no duplicates can inflate the count.' },

    { task: 'Report every student who attends <b>more than half</b> of all the classes scheduled for the course COMP3311. Do not hard-code the number of classes.',
      view: 'q(student, nattended)',
      sample:
'create or replace view CompClasses(n)\n' +
'as\n' +
"select count(*) from Classes where course = 'COMP3311';\n" +
'\n' +
'create or replace view StudentComp(sid, name, n)\n' +
'as\n' +
'select s.id, s.name, count(*)\n' +
'from   Students s\n' +
'       join Attends a on a.student_id = s.id\n' +
'       join Classes c on a.class_id = c.id\n' +
"where  c.course = 'COMP3311'\n" +
'group  by s.id, s.name;\n' +
'\n' +
'create or replace view q(student, nattended)\n' +
'as\n' +
'select name, n\n' +
'from   StudentComp\n' +
'where  n > (select n from CompClasses) / 2.0;',
      notes: 'Computing the total instead of writing a literal is what the marks are for — the real paper caps hard-coded answers at half marks. Divide by <code>2.0</code>, not <code>2</code>: integer division truncates, so with 7 classes the threshold would become 3 instead of 3.5.' },

    { task: 'Report every pair of classes that <b>clash</b>: held in the same room on the same day with overlapping times. List each clashing pair once.',
      view: 'q(room, day_of_week, class1, class2)',
      sample:
'create or replace view q(room, day_of_week, class1, class2)\n' +
'as\n' +
'select r.name, c1.day_of_week, c1.id, c2.id\n' +
'from   Classes c1\n' +
'       join Classes c2 on c1.held_in = c2.held_in\n' +
'                      and c1.day_of_week = c2.day_of_week\n' +
'                      and c1.id < c2.id\n' +
'       join Rooms r on c1.held_in = r.id\n' +
'where  c1.start_time < c2.end_time\n' +
'       and c2.start_time < c1.end_time;',
      notes: 'A <b>self-join</b>: the same table twice under two aliases. <code>c1.id &lt; c2.id</code> does two jobs — it stops a class clashing with itself, and it reports each pair once instead of twice. Two intervals overlap exactly when each starts before the other ends.' },

    { task: 'Report every class whose enrolment exceeds the capacity of the room it is held in.',
      view: 'q(course, ctype, room, capacity, nstudents)',
      sample:
'create or replace view ClassSizes(cid, nstudents)\n' +
'as\n' +
'select class_id, count(*)\n' +
'from   Attends\n' +
'group  by class_id;\n' +
'\n' +
'create or replace view q(course, ctype, room, capacity, nstudents)\n' +
'as\n' +
'select c.course, c.ctype, r.name, r.capacity, z.nstudents\n' +
'from   Classes c\n' +
'       join Rooms r on c.held_in = r.id\n' +
'       join ClassSizes z on z.cid = c.id\n' +
'where  z.nstudents > r.capacity;',
      notes: 'Aggregate first into a helper view, then join and compare. Trying to write <code>where count(*) &gt; r.capacity</code> directly does not work — an aggregate cannot appear in WHERE.' }
  ];

  /* ===================== 4. PL/pgSQL and SQL functions ================= */

  var PLPGSQL = [
    { task: 'Write a function that takes a class id and returns a one-line description of it, in the form <code>"COMP3311 Lecture, Mon 14-16 in Ainsworth G03"</code>. Return <code>"No such class"</code> if the id does not exist.',
      sig: 'create or replace function class_desc(cid integer) returns text',
      sample:
'create or replace function class_desc(cid integer) returns text\n' +
'as $$\n' +
'declare\n' +
'    c record;\n' +
'begin\n' +
'    select cl.course, cl.ctype, cl.day_of_week,\n' +
'           cl.start_time, cl.end_time, r.name as room\n' +
'    into   c\n' +
'    from   Classes cl join Rooms r on cl.held_in = r.id\n' +
'    where  cl.id = cid;\n' +
'\n' +
'    if not found then\n' +
"        return 'No such class';\n" +
'    end if;\n' +
'\n' +
"    return trim(c.course) || ' ' || c.ctype || ', ' || c.day_of_week\n" +
"           || ' ' || c.start_time || '-' || c.end_time\n" +
"           || ' in ' || c.room;\n" +
'end;\n' +
'$$ language plpgsql;',
      notes: '<code>if not found</code> immediately after a <code>select ... into</code> is the idiomatic existence check — every "return an error string for a bad id" question uses it. <code>trim()</code> removes the blank padding that <code>char(8)</code> adds to the course code.' },

    { task: 'Write a function returning a set of tuples giving, for each course, how many lectures, tutorials and lab-style classes it has. Lab-style means <code>Lab Class</code> or <code>Tute-Lab</code>.',
      sig: 'create type CourseMix as (course text, nlec integer, ntut integer, nlab integer);\ncreate or replace function q() returns setof CourseMix',
      sample:
'create type CourseMix as (course text, nlec integer, ntut integer, nlab integer);\n' +
'\n' +
'create or replace function q() returns setof CourseMix\n' +
'as $$\n' +
'declare\n' +
'    res CourseMix;\n' +
'begin\n' +
'    for res in\n' +
'        select trim(course),\n' +
"               count(case when ctype = 'Lecture' then 1 end),\n" +
"               count(case when ctype = 'Tutorial' then 1 end),\n" +
"               count(case when ctype in ('Lab Class','Tute-Lab') then 1 end)\n" +
'        from   Classes\n' +
'        group  by course\n' +
'    loop\n' +
'        return next res;\n' +
'    end loop;\n' +
'end;\n' +
'$$ language plpgsql;',
      notes: 'Two things worth keeping. <code>count(case when cond then 1 end)</code> counts only the matching rows, because <code>count</code> ignores NULLs — that is the conditional-count idiom. And <code>for res in select ...</code> assigns straight into the record variable when the query columns line up with the type, so you do not have to set each field by hand.' },

    { task: 'Write a function that takes a <b>partial course code</b> and returns every matching class, as tuples of (course, class type, day, room). The match should be case-insensitive and anywhere in the code.',
      sig: 'create type ClassInfo as (course text, ctype text, day text, room text);\ncreate or replace function find_classes(partial text) returns setof ClassInfo',
      sample:
'create type ClassInfo as (course text, ctype text, day text, room text);\n' +
'\n' +
'create or replace function find_classes(partial text) returns setof ClassInfo\n' +
'as $$\n' +
'declare\n' +
'    res ClassInfo;\n' +
'begin\n' +
'    for res in\n' +
'        select trim(c.course), c.ctype::text, c.day_of_week::text, r.name\n' +
'        from   Classes c join Rooms r on c.held_in = r.id\n' +
"        where  c.course ilike '%' || partial || '%'\n" +
'        order  by c.course, c.day_of_week, c.start_time\n' +
'    loop\n' +
'        return next res;\n' +
'    end loop;\n' +
'end;\n' +
'$$ language plpgsql;',
      notes: 'A set-returning function <b>with a parameter</b>. <code>ilike</code> is the case-insensitive match, and the wildcards are concatenated around the argument rather than written inside the literal. The enum columns need <code>::text</code> casts to fit the declared <code>text</code> fields of the type.' },

    { task: 'Write the same "find classes matching a partial course code" function using <code>language sql</code> instead of PL/pgSQL.',
      sig: 'create type ClassInfo as (course text, ctype text, day text, room text);\ncreate or replace function find_classes(partial text) returns setof ClassInfo',
      sample:
'create type ClassInfo as (course text, ctype text, day text, room text);\n' +
'\n' +
'create or replace function find_classes(partial text) returns setof ClassInfo\n' +
'as $$\n' +
'    select trim(c.course), c.ctype::text, c.day_of_week::text, r.name\n' +
'    from   Classes c join Rooms r on c.held_in = r.id\n' +
"    where  c.course ilike '%' || $1 || '%'\n" +
'    order  by c.course, c.day_of_week, c.start_time;\n' +
'$$ language sql;',
      notes: 'When the function body is a single query, <code>language sql</code> is much shorter: no declare, no begin/end, no loop, no <code>return next</code>. Parameters are referred to positionally as <code>$1</code>, <code>$2</code> (you may also use the parameter name in modern PostgreSQL). Use PL/pgSQL only when you genuinely need control flow.' },

    { task: 'Write a function that takes a room id and checks whether it is over-booked: for each class in that room, compare the number of students attending with the room capacity. Return <code>"OK"</code>, or a message naming the first class that exceeds capacity. Return <code>"No such room"</code> for an unknown id.',
      sig: 'create or replace function check_room(rid integer) returns text',
      sample:
'create or replace function check_room(rid integer) returns text\n' +
'as $$\n' +
'declare\n' +
'    cap   integer;\n' +
'    t     record;\n' +
'    nstud integer;\n' +
'begin\n' +
'    select capacity into cap from Rooms where id = rid;\n' +
'    if not found then\n' +
"        return 'No such room';\n" +
'    end if;\n' +
'\n' +
'    for t in\n' +
'        select id, course, ctype from Classes where held_in = rid order by id\n' +
'    loop\n' +
'        select count(*) into nstud from Attends where class_id = t.id;\n' +
'\n' +
'        if nstud > cap then\n' +
"            return 'Over capacity: class ' || t.id || ' (' || trim(t.course)\n" +
"                   || ' ' || t.ctype || ') has ' || nstud\n" +
"                   || ' students but the room seats ' || cap;\n" +
'        end if;\n' +
'    end loop;\n' +
'\n' +
"    return 'OK';\n" +
'end;\n' +
'$$ language plpgsql;',
      notes: 'The shape to learn: fetch a value, check <code>not found</code>, loop over related rows doing a per-row query, branch, and return a built-up message. Returning from inside the loop stops at the first offender — if the question wanted all of them you would accumulate into a text variable instead.' },

    { task: 'Write a function that takes a student id and returns their weekly timetable as a single text value, one line per class, ordered by day and start time. Return <code>"No such student"</code> for an unknown id.',
      sig: 'create or replace function timetable(sid integer) returns text',
      sample:
'create or replace function timetable(sid integer) returns text\n' +
'as $$\n' +
'declare\n' +
'    sname text;\n' +
'    t     record;\n' +
"    out   text := '';\n" +
'begin\n' +
'    select name into sname from Students where id = sid;\n' +
'    if not found then\n' +
"        return 'No such student';\n" +
'    end if;\n' +
'\n' +
'    for t in\n' +
'        select c.course, c.ctype, c.day_of_week, c.start_time, c.end_time, r.name as room\n' +
'        from   Attends a\n' +
'               join Classes c on a.class_id = c.id\n' +
'               join Rooms r   on c.held_in = r.id\n' +
'        where  a.student_id = sid\n' +
'        order  by c.day_of_week, c.start_time\n' +
'    loop\n' +
"        out := out || t.day_of_week || ' ' || t.start_time || '-' || t.end_time\n" +
"               || '  ' || trim(t.course) || ' ' || t.ctype\n" +
"               || '  (' || t.room || ')' || E'\\n';\n" +
'    end loop;\n' +
'\n' +
'    return out;\n' +
'end;\n' +
'$$ language plpgsql;',
      notes: 'Initialising <code>out</code> to the empty string handles "attends nothing" for free — starting from NULL would make every concatenation NULL. <code>E\'\\n\'</code> is PostgreSQL escape-string syntax for a newline.' }
  ];

  /* ========================= 5. Writing triggers ======================= */

  var TRIGGERS = [
    { task: 'Write a <b>checking</b> trigger on <code>Classes</code> that rejects an invalid class. It must ensure the class ends after it starts, that it runs for at most 4 hours, and that the room it is held in exists.',
      sample:
'create or replace function class_checker() returns trigger\n' +
'as $$\n' +
'declare\n' +
'    rcap integer;\n' +
'begin\n' +
'    if new.end_time <= new.start_time then\n' +
"        raise exception 'Class must end after it starts (% to %)',\n" +
'              new.start_time, new.end_time;\n' +
'    end if;\n' +
'\n' +
'    if new.end_time - new.start_time > 4 then\n' +
"        raise exception 'Class is longer than 4 hours';\n" +
'    end if;\n' +
'\n' +
'    select capacity into rcap from Rooms where id = new.held_in;\n' +
'    if not found then\n' +
"        raise exception 'No such room: %', new.held_in;\n" +
'    end if;\n' +
'\n' +
'    return new;\n' +
'end;\n' +
'$$ language plpgsql;\n' +
'\n' +
'create trigger class_checker\n' +
'before insert or update on Classes\n' +
'for each row execute procedure class_checker();',
      notes: 'A validation trigger must be <b>before</b> insert or update, so the bad row never reaches the table. Returning <code>new</code> lets it through; <code>raise exception</code> aborts the whole statement. The <code>%</code> in the message is filled by the arguments that follow.' },

    { task: 'Write a trigger that stops a student being enrolled in a class that <b>clashes</b> with another class they already attend (same day, overlapping times).',
      sample:
'create or replace function no_clash() returns trigger\n' +
'as $$\n' +
'declare\n' +
'    newc  record;\n' +
'    clash record;\n' +
'begin\n' +
'    select day_of_week, start_time, end_time into newc\n' +
'    from   Classes where id = new.class_id;\n' +
'    if not found then\n' +
"        raise exception 'No such class: %', new.class_id;\n" +
'    end if;\n' +
'\n' +
'    select c.id into clash\n' +
'    from   Attends a join Classes c on a.class_id = c.id\n' +
'    where  a.student_id = new.student_id\n' +
'           and c.day_of_week = newc.day_of_week\n' +
'           and c.start_time  < newc.end_time\n' +
'           and newc.start_time < c.end_time\n' +
'    limit  1;\n' +
'\n' +
'    if found then\n' +
"        raise exception 'Clashes with class % already attended', clash.id;\n" +
'    end if;\n' +
'\n' +
'    return new;\n' +
'end;\n' +
'$$ language plpgsql;\n' +
'\n' +
'create trigger no_clash\n' +
'before insert on Attends\n' +
'for each row execute procedure no_clash();',
      notes: 'The overlap test is the same two-inequality condition as the clash query. Because this is a <b>before insert</b> trigger, the new row is not in <code>Attends</code> yet, so the search cannot accidentally find the row being inserted.' },

    { task: 'Assume <code>Rooms</code> gains a column <code>nclasses</code> recording how many classes are held in that room. Write triggers to keep it correct as classes are inserted, deleted, or moved to a different room.',
      sample:
'create or replace function fix_room_count() returns trigger\n' +
'as $$\n' +
'begin\n' +
"    if TG_OP = 'INSERT' then\n" +
'        update Rooms set nclasses = nclasses + 1 where id = new.held_in;\n' +
"    elsif TG_OP = 'DELETE' then\n" +
'        update Rooms set nclasses = nclasses - 1 where id = old.held_in;\n' +
'    else  -- UPDATE\n' +
'        if new.held_in <> old.held_in then\n' +
'            update Rooms set nclasses = nclasses - 1 where id = old.held_in;\n' +
'            update Rooms set nclasses = nclasses + 1 where id = new.held_in;\n' +
'        end if;\n' +
'    end if;\n' +
'    return null;   -- after trigger: the return value is ignored\n' +
'end;\n' +
'$$ language plpgsql;\n' +
'\n' +
'create trigger fix_room_count\n' +
'after insert or update of held_in or delete on Classes\n' +
'for each row execute procedure fix_room_count();',
      notes: 'Maintaining a <b>derived attribute</b> needs an <code>after</code> trigger and must handle all three operations. <code>TG_OP</code> says which one fired. On DELETE there is no <code>new</code>; on INSERT there is no <code>old</code>. The UPDATE case is the one people forget — moving a class must decrement the old room as well as increment the new one.' },

    { task: 'Write a trigger that prevents enrolling a student in a class once the room is full, and also refuses to enrol the same student twice.',
      sample:
'create or replace function enrol_checker() returns trigger\n' +
'as $$\n' +
'declare\n' +
'    cap   integer;\n' +
'    nstud integer;\n' +
'begin\n' +
'    -- duplicate enrolment is already prevented by the primary key on\n' +
'    -- Attends(student_id, class_id), but an explicit check gives a\n' +
'    -- better message\n' +
'    perform 1 from Attends\n' +
'    where  student_id = new.student_id and class_id = new.class_id;\n' +
'    if found then\n' +
"        raise exception 'Student % is already in class %',\n" +
'              new.student_id, new.class_id;\n' +
'    end if;\n' +
'\n' +
'    select r.capacity into cap\n' +
'    from   Classes c join Rooms r on c.held_in = r.id\n' +
'    where  c.id = new.class_id;\n' +
'    if not found then\n' +
"        raise exception 'No such class: %', new.class_id;\n" +
'    end if;\n' +
'\n' +
'    select count(*) into nstud from Attends where class_id = new.class_id;\n' +
'    if nstud >= cap then\n' +
"        raise exception 'Class % is full (capacity %)', new.class_id, cap;\n" +
'    end if;\n' +
'\n' +
'    return new;\n' +
'end;\n' +
'$$ language plpgsql;\n' +
'\n' +
'create trigger enrol_checker\n' +
'before insert on Attends\n' +
'for each row execute procedure enrol_checker();',
      notes: '<code>perform</code> runs a query for its side effect when you only care whether it found anything — it sets <code>found</code> without needing a target variable. Counting <i>before</i> the insert is why <code>&gt;=</code> is the right comparison here rather than <code>&gt;</code>.' }
  ];

  /* ==================== 6. Trigger analysis (21T3 Q9) ================== */

  var TRIGGER_ANALYSIS = [
    { intro: 'Assume <code>Classes</code> has an extra attribute <code>nenrolled</code>, maintained by the triggers below, recording how many students are enrolled in that class. Rows in <code>Attends</code> are only ever inserted or deleted, never updated.',
      codeShown:
'create trigger pre_attend before insert or delete on Attends\n' +
'for each row execute procedure pre_attend_check();\n' +
'\n' +
'create function pre_attend_check() returns trigger\n' +
'as $$\n' +
'declare\n' +
'    cid integer;\n' +
'    cl  record;\n' +
'begin\n' +
"    if TG_OP = 'INSERT' then\n" +
'        cid := new.class_id;\n' +
'    else\n' +
'        cid := old.class_id;\n' +
'    end if;\n' +
'\n' +
'    select c.*, r.capacity into cl\n' +
'    from   Classes c join Rooms r on c.held_in = r.id\n' +
'    where  c.id = cid;\n' +
'\n' +
'    if not found then\n' +
"        raise exception 'Enrolment error';\n" +
'    end if;\n' +
'\n' +
"    if TG_OP = 'DELETE' then\n" +
'        return old;\n' +
'    else\n' +
'        if cl.nenrolled = cl.capacity then\n' +
"            raise exception 'Enrolment error';\n" +
'        end if;\n' +
'        return new;\n' +
'    end if;\n' +
'end;\n' +
'$$ language plpgsql;\n' +
'\n' +
'create trigger post_attend after insert or delete on Attends\n' +
'for each row execute procedure post_attend_update();\n' +
'\n' +
'create function post_attend_update() returns trigger\n' +
'as $$\n' +
'begin\n' +
"    if TG_OP = 'INSERT' then\n" +
'        update Classes set nenrolled = nenrolled + 1 where id = new.class_id;\n' +
'    else\n' +
'        update Classes set nenrolled = nenrolled - 1 where id = old.class_id;\n' +
'    end if;\n' +
'end;\n' +
'$$ language plpgsql;',
      parts: [
        { q: 'Describe what conditions are being checked in <code>pre_attend_check()</code>.',
          a: 'Two things. First, that the class being enrolled in (or unenrolled from) actually exists — the <code>select ... into</code> followed by <code>if not found</code>. Second, on an INSERT only, that the class is not already at the capacity of its room, i.e. <code>nenrolled = capacity</code>. Deletes skip the capacity check and simply return <code>old</code>.' },
        { q: 'Suggest other conditions that could usefully be checked in <code>pre_attend_check()</code>.',
          a: 'That the student exists in <code>Students</code>. That the student is not already enrolled in this class (though the primary key on <code>Attends</code> covers that). That the new class does not clash with another class the student already attends. On a delete, that the enrolment being removed actually exists. You could also check <code>nenrolled</code> never goes negative.' },
        { q: 'Describe what happens when a student is inserted into a class that is <b>not</b> full.',
          a: 'The before trigger fires, finds the class, sees <code>nenrolled &lt; capacity</code> and returns <code>new</code>, so the insert proceeds. The row is added to <code>Attends</code>. The after trigger then fires and increments <code>Classes.nenrolled</code> by one. Net effect: the enrolment is recorded and the counter stays correct.' },
        { q: 'Describe what happens when a student is inserted into a class that is already <b>full</b>.',
          a: 'The before trigger finds <code>nenrolled = capacity</code> and raises an exception. That aborts the whole statement, so no row is inserted into <code>Attends</code>, the after trigger never fires, and <code>nenrolled</code> is unchanged. The user sees the error "Enrolment error".' },
        { q: 'Describe what happens when an existing enrolment is deleted.',
          a: 'The before trigger runs, takes the class id from <code>old</code>, confirms the class exists, and because <code>TG_OP</code> is DELETE it returns <code>old</code> without any capacity check. The row is removed. The after trigger then decrements <code>nenrolled</code>. Note that if the class row did not exist the delete would fail with "Enrolment error", which is arguably wrong behaviour for a delete.' }
      ] }
  ];

  /* ====================== 7. Python / psycopg2 ========================= */

  var PYTHON = [
    { task: 'Write a Python/psycopg2 script that takes a student id on the command line and prints their weekly timetable, grouped by day, with the class details and room for each.',
      sample:
'#!/usr/bin/python3\n' +
'import sys\n' +
'import psycopg2\n' +
'\n' +
'usage = f"Usage: {sys.argv[0]} StudentID"\n' +
'if len(sys.argv) < 2 or not sys.argv[1].isnumeric():\n' +
'    print(usage)\n' +
'    exit(1)\n' +
'sid = sys.argv[1]\n' +
'\n' +
'studentQ = "select name from Students where id = %s"\n' +
'classesQ = """\n' +
'select c.day_of_week, c.start_time, c.end_time,\n' +
'       trim(c.course), c.ctype, r.name\n' +
'from   Attends a\n' +
'       join Classes c on a.class_id = c.id\n' +
'       join Rooms r   on c.held_in = r.id\n' +
'where  a.student_id = %s\n' +
'order  by c.day_of_week, c.start_time\n' +
'"""\n' +
'\n' +
'db = cur = None\n' +
'try:\n' +
'    db = psycopg2.connect("dbname=classes")\n' +
'    cur = db.cursor()\n' +
'\n' +
'    cur.execute(studentQ, [sid])\n' +
'    student = cur.fetchone()\n' +
'    if student is None:\n' +
'        print("No such student")\n' +
'        exit(1)\n' +
'    print(f"Timetable for {student[0]}")\n' +
'\n' +
'    cur.execute(classesQ, [sid])\n' +
'    rows = cur.fetchall()\n' +
'    if not rows:\n' +
'        print("   attends no classes")\n' +
'    last_day = None\n' +
'    for day, start, end, course, ctype, room in rows:\n' +
'        if day != last_day:\n' +
'            print(f"{day}:")\n' +
'            last_day = day\n' +
'        print(f"   {start:2d}-{end:2d}  {course} {ctype} in {room}")\n' +
'\n' +
'except psycopg2.Error as err:\n' +
'    print("DB error: ", err)\n' +
'finally:\n' +
'    if cur: cur.close()\n' +
'    if db:  db.close()',
      notes: 'One query, ordered by day, with a <code>last_day</code> variable to print each day heading once. That is far better than running a separate query per day. Validate the argument, use <code>%s</code> placeholders, and close things in <code>finally</code>.' },

    { task: 'Write a Python/psycopg2 script that takes a room name and prints a usage report: the room type and capacity, its facilities, and every class held in it with the number of students enrolled.',
      sample:
'#!/usr/bin/python3\n' +
'import sys\n' +
'import psycopg2\n' +
'\n' +
'if len(sys.argv) < 2:\n' +
'    print(f"Usage: {sys.argv[0]} \'Room Name\'")\n' +
'    exit(1)\n' +
'rname = sys.argv[1]\n' +
'\n' +
'roomQ = "select id, rtype, capacity from Rooms where name = %s"\n' +
'facQ  = """select f.name, h.nitems\n' +
'           from   Has h join Facilities f on h.facility_id = f.id\n' +
'           where  h.room_id = %s order by f.name"""\n' +
'classQ = """select c.id, trim(c.course), c.ctype, c.day_of_week,\n' +
'                   c.start_time, c.end_time\n' +
'            from   Classes c where c.held_in = %s\n' +
'            order  by c.day_of_week, c.start_time"""\n' +
'countQ = "select count(*) from Attends where class_id = %s"\n' +
'\n' +
'db = cur = None\n' +
'try:\n' +
'    db = psycopg2.connect("dbname=classes")\n' +
'    cur = db.cursor()\n' +
'\n' +
'    cur.execute(roomQ, [rname])\n' +
'    room = cur.fetchone()\n' +
'    if room is None:\n' +
'        print("No such room")\n' +
'        exit(1)\n' +
'    rid, rtype, cap = room\n' +
'    print(f"{rname}: {rtype}, seats {cap}")\n' +
'\n' +
'    cur.execute(facQ, [rid])\n' +
'    facs = cur.fetchall()\n' +
'    print("Facilities: " + (", ".join(f"{n} x{k}" for n, k in facs) if facs else "none"))\n' +
'\n' +
'    inner = db.cursor()\n' +
'    cur.execute(classQ, [rid])\n' +
'    for cid, course, ctype, day, start, end in cur.fetchall():\n' +
'        inner.execute(countQ, [cid])\n' +
'        n = inner.fetchone()[0]\n' +
'        flag = "  OVER CAPACITY" if n > cap else ""\n' +
'        print(f"  {day} {start:2d}-{end:2d}  {course} {ctype}  {n} students{flag}")\n' +
'    inner.close()\n' +
'\n' +
'except psycopg2.Error as err:\n' +
'    print("DB error: ", err)\n' +
'finally:\n' +
'    if cur: cur.close()\n' +
'    if db:  db.close()',
      notes: 'Two cursors: one holds the outer result set while the other runs the per-class count. Reusing a single cursor for the inner query would destroy the outer result mid-loop. In practice you could avoid the inner query entirely with a GROUP BY join — worth saying so.' },

    { task: 'Write a Python/psycopg2 script that finds classes matching criteria given on the command line: <code>argv[1]</code> = course code, <code>argv[2]</code> = day (or <code>any</code>), <code>argv[3]</code> = minimum free seats. List matching classes cheapest-on-the-eye: day, time, type, room, free seats.',
      sample:
'#!/usr/bin/python3\n' +
'import sys\n' +
'import psycopg2\n' +
'\n' +
'usage = f"Usage: {sys.argv[0]} Course Day|any MinFreeSeats"\n' +
'if len(sys.argv) < 4 or not sys.argv[3].isnumeric():\n' +
'    print(usage)\n' +
'    exit(1)\n' +
'course, day, minfree = sys.argv[1], sys.argv[2], int(sys.argv[3])\n' +
'\n' +
'query = """\n' +
'select c.day_of_week, c.start_time, c.end_time, c.ctype, r.name,\n' +
'       r.capacity - count(a.student_id) as free\n' +
'from   Classes c\n' +
'       join Rooms r on c.held_in = r.id\n' +
'       left outer join Attends a on a.class_id = c.id\n' +
'where  c.course = %s\n' +
'       and (%s = \'any\' or c.day_of_week::text = %s)\n' +
'group  by c.id, c.day_of_week, c.start_time, c.end_time, c.ctype,\n' +
'          r.name, r.capacity\n' +
'having r.capacity - count(a.student_id) >= %s\n' +
'order  by c.day_of_week, c.start_time\n' +
'"""\n' +
'\n' +
'db = cur = None\n' +
'try:\n' +
'    db = psycopg2.connect("dbname=classes")\n' +
'    cur = db.cursor()\n' +
'    cur.execute(query, [course, day, day, minfree])\n' +
'    rows = cur.fetchall()\n' +
'    if not rows:\n' +
'        print("No matching classes")\n' +
'    for d, s, e, ctype, room, free in rows:\n' +
'        print(f"{d} {s:2d}-{e:2d}  {ctype:10s} {room:20s} {free} free")\n' +
'\n' +
'except psycopg2.Error as err:\n' +
'    print("DB error: ", err)\n' +
'finally:\n' +
'    if cur: cur.close()\n' +
'    if db:  db.close()',
      notes: 'The <code>(%s = \'any\' or col = %s)</code> trick handles an optional filter without building the SQL string by hand — which would be the injection-prone approach. Do the filtering in SQL, not by fetching everything and testing in Python.' }
  ];

  /* ================= 8. Python code analysis (22T3 Q8) ================= */

  var PY_ANALYSIS = [
    { intro: 'Consider the following Python/psycopg2 fragment. Assume the queries are syntactically correct and the database connection succeeds.',
      codeShown:
'query  = "select distinct course from Classes order by course"\n' +
'query2 = """\n' +
'select c.ctype, count(a.student_id)\n' +
'from   Classes c left outer join Attends a on a.class_id = c.id\n' +
'where  c.course = %s\n' +
'group  by c.id, c.ctype\n' +
'"""\n' +
'\n' +
'db  = psycopg2.connect("dbname=classes")\n' +
'cur = db.cursor()\n' +
'cur2 = db.cursor()\n' +
'\n' +
'tot1, tot2 = (0, 0)\n' +
'cur.execute(query)\n' +
'for (course,) in cur.fetchall():\n' +
'    print(f"Course {course}")\n' +
'    cur2.execute(query2, [course])\n' +
'    for (ctype, n) in cur2.fetchall():\n' +
'        print(f"   {ctype}: {n} students")\n' +
'        tot1 = tot1 + 1\n' +
'        tot2 = tot2 + n\n' +
'print(f"Average class size: {tot2 / tot1}")',
      parts: [
        { q: 'Describe what this code does.',
          a: 'It lists every distinct course in the database in alphabetical order. For each course it prints a heading, then one line per class of that course giving the class type and how many students attend it. While doing so it counts the classes seen (<code>tot1</code>) and sums their enrolments (<code>tot2</code>), and finally prints the average class size across the whole database.' },
        { q: 'Under what circumstances does this code fail, and why?',
          a: 'If the database contains no classes at all, the first query returns no rows, the loop never runs, and <code>tot1</code> stays 0 — so the final line raises <code>ZeroDivisionError</code>. The same happens if every course somehow has no classes. The fix is to guard the division: <code>print(... if tot1 else "no classes")</code>.' },
        { q: 'If the database contains 12 distinct courses, how many <code>execute()</code> calls are made?',
          a: '13. One for the outer query that fetches the list of courses, then one more inside the loop for each of the 12 courses. This is the classic N+1 query problem: the number of round trips to the server grows with the data.' },
        { q: 'Rewrite this as a single query, and show the Python loop that uses it.',
          a:
'query = """\n' +
'select trim(c.course), c.ctype, count(a.student_id)\n' +
'from   Classes c left outer join Attends a on a.class_id = c.id\n' +
'group  by c.id, c.course, c.ctype\n' +
'order  by c.course, c.ctype\n' +
'"""\n' +
'\n' +
'cur.execute(query)\n' +
'tot1, tot2 = (0, 0)\n' +
'last = None\n' +
'for (course, ctype, n) in cur.fetchall():\n' +
'    if course != last:\n' +
'        print(f"Course {course}")\n' +
'        last = course\n' +
'    print(f"   {ctype}: {n} students")\n' +
'    tot1 += 1\n' +
'    tot2 += n\n' +
'print(f"Average class size: {tot2 / tot1}" if tot1 else "No classes")' }
      ] }
  ];

  /* ============ 9. ER -> schema, both mapping approaches ============== */

  var ER = [
    { task: 'An entity <b>A</b>(<u>id</u>, x) has two subclasses: <b>B</b> with attribute y, and <b>C</b> with a multi-valued attribute z. C also participates in a many-to-many relationship <b>R</b> with entity <b>D</b>(<u>id</u>, w). Participation of A in the B/C hierarchy is total.',
      erMap:
'create table A (\n' +
'    id  integer primary key,\n' +
'    x   text\n' +
');\n' +
'\n' +
'create table B (\n' +
'    a   integer primary key references A(id),\n' +
'    y   text\n' +
');\n' +
'\n' +
'create table C (\n' +
'    a   integer primary key references A(id)\n' +
');\n' +
'\n' +
'create table Z (\n' +
'    c   integer references C(a),\n' +
'    z   text,\n' +
'    primary key (c, z)\n' +
');\n' +
'\n' +
'create table D (\n' +
'    id  integer primary key,\n' +
'    w   text\n' +
');\n' +
'\n' +
'create table R (\n' +
'    c   integer references C(a),\n' +
'    d   integer references D(id),\n' +
'    primary key (c, d)\n' +
');\n' +
'\n' +
'-- Cannot be enforced: total participation of A in B/C, because the\n' +
'-- constraint spans several tables. Nor can disjointness be enforced\n' +
'-- (nothing stops one A being both a B and a C).',
      singleTable:
'create table A (\n' +
'    id  integer primary key,\n' +
'    b   boolean not null,   -- true if this A is a B\n' +
'    c   boolean not null,   -- true if this A is a C\n' +
'    x   text,\n' +
'    y   text,               -- only meaningful when b is true\n' +
'    constraint subclasses check (b or c)   -- total participation\n' +
');\n' +
'\n' +
'create table Z (\n' +
'    a   integer references A(id),\n' +
'    z   text,\n' +
'    primary key (a, z)\n' +
');\n' +
'\n' +
'create table D (\n' +
'    id  integer primary key,\n' +
'    w   text\n' +
');\n' +
'\n' +
'create table R (\n' +
'    a   integer references A(id),\n' +
'    d   integer references D(id),\n' +
'    primary key (a, d)\n' +
');\n' +
'\n' +
'-- Now total participation IS enforceable, by the check constraint.\n' +
'-- But nothing stops a row of Z or R referring to an A whose c is false,\n' +
'-- i.e. to something that is not a C at all.',
      notes: 'The two approaches trade different things. ER mapping keeps each subclass in its own table, so subclass-only attributes cannot be NULL and relationships genuinely point at the right subclass — but total participation is unenforceable. Single-table mapping puts everything in one table with boolean discriminators, which makes total participation a simple check constraint and makes "list all Bs" trivial, at the cost of NULLable columns and no way to stop a relationship pointing at the wrong subclass.' },

    { task: 'A <b>Room</b>(<u>id</u>, name, capacity) may contain many <b>Facilities</b>(<u>id</u>, name), and a facility may be in many rooms. Each pairing records how many items there are. Every room must have at least one facility.',
      erMap:
'create table Rooms (\n' +
'    id        integer primary key,\n' +
'    name      text not null,\n' +
'    capacity  integer not null check (capacity > 0)\n' +
');\n' +
'\n' +
'create table Facilities (\n' +
'    id    integer primary key,\n' +
'    name  text not null\n' +
');\n' +
'\n' +
'create table Has (\n' +
'    room_id      integer references Rooms(id),\n' +
'    facility_id  integer references Facilities(id),\n' +
'    nitems       integer not null check (nitems > 0),\n' +
'    primary key (room_id, facility_id)\n' +
');\n' +
'\n' +
'-- Cannot be enforced: "every room has at least one facility". The\n' +
'-- constraint spans Rooms and Has, so no single-table check can express it.\n' +
'-- It would need a trigger or a deferred assertion.',
      singleTable: null,
      notes: 'A many-to-many relationship always becomes its own table, keyed on the pair of foreign keys, and any attribute <i>of the relationship</i> (here <code>nitems</code>) lives there. Total participation on the "many" side of an M:N relationship is the classic unenforceable constraint — say so explicitly, it is worth marks.' },

    { task: 'A <b>Class</b>(<u>id</u>, course, type) is held in exactly one <b>Room</b>(<u>id</u>, name), and a room may host many classes. Students(<u>id</u>, name) attend many classes and a class has many students.',
      erMap:
'create table Rooms (\n' +
'    id    integer primary key,\n' +
'    name  text not null\n' +
');\n' +
'\n' +
'create table Classes (\n' +
'    id       integer primary key,\n' +
'    course   char(8) not null,\n' +
'    ctype    text not null,\n' +
'    held_in  integer not null references Rooms(id)   -- total participation\n' +
');\n' +
'\n' +
'create table Students (\n' +
'    id    integer primary key,\n' +
'    name  text not null\n' +
');\n' +
'\n' +
'create table Attends (\n' +
'    student_id  integer references Students(id),\n' +
'    class_id    integer references Classes(id),\n' +
'    primary key (student_id, class_id)\n' +
');',
      singleTable: null,
      notes: 'One-to-many needs no extra table — put the foreign key on the <b>many</b> side. Making it <code>not null</code> is exactly how you express "every class is in exactly one room", and it is the one participation constraint SQL gives you directly. Many-to-many still needs its own table.' },

    { task: 'A <b>Person</b>(<u>id</u>, name, address) is either a <b>Student</b> (with attribute program) or a <b>Staff</b> member (with attribute salary, and works in exactly one <b>Department</b>). Every person is at least one of the two.',
      erMap:
'create table People (\n' +
'    id       integer primary key,\n' +
'    name     text not null,\n' +
'    address  text not null\n' +
');\n' +
'\n' +
'create table Students (\n' +
'    id       integer primary key references People(id),\n' +
'    program  text not null\n' +
');\n' +
'\n' +
'create table Departments (\n' +
'    id    integer primary key,\n' +
'    name  text not null\n' +
');\n' +
'\n' +
'create table Staff (\n' +
'    id        integer primary key references People(id),\n' +
'    salary    integer not null check (salary > 0),\n' +
'    works_in  integer not null references Departments(id)\n' +
');\n' +
'\n' +
'-- Cannot be enforced: that every person is a Student or Staff,\n' +
'-- since that spans three tables.',
      singleTable:
'create table People (\n' +
'    id           integer primary key,\n' +
'    name         text not null,\n' +
'    address      text not null,\n' +
'\n' +
'    is_student   boolean not null,\n' +
'    is_staff     boolean not null,\n' +
'\n' +
'    program      text,\n' +
'    salary       integer,\n' +
'    works_in     integer references Departments(id),\n' +
'\n' +
'    constraint total_participation check (is_student or is_staff),\n' +
'    constraint student_data check (\n' +
'        (is_student = false and program is null)\n' +
'        or (is_student = true and program is not null)\n' +
'    ),\n' +
'    constraint staff_data check (\n' +
'        (is_staff = false and salary is null and works_in is null)\n' +
'        or (is_staff = true and salary > 0 and works_in is not null)\n' +
'    )\n' +
');',
      notes: 'The single-table version can enforce total participation and can even police which columns must be NULL for each kind of person, all with check constraints — because everything is in one row. The cost is a wide table full of NULLs, and it scales badly once subclasses have many attributes of their own.' }
  ];

  /* ================ 10. Functional dependencies / BCNF ================ */

  var FD = [
    { rel: 'ClassInfo(class_id, course, room_name, room_capacity, day, start_time)',
      extra: '<code>class_id</code> is the primary key. Each room has exactly one capacity.',
      fds: 'class_id -> course, room_name, room_capacity, day, start_time\nroom_name -> room_capacity',
      violator: 'room_name -> room_capacity',
      why: '<code>room_name</code> is not a superkey of ClassInfo, but it determines <code>room_capacity</code>.',
      fix: 'Classes(class_id, course, room_name, day, start_time)\nRooms(room_name, room_capacity)' },

    { rel: 'Enrolment(student_id, student_name, class_id, course, mark)',
      extra: 'The key is (student_id, class_id). Each student has exactly one name and each class belongs to exactly one course.',
      fds: 'student_id, class_id -> mark\nstudent_id -> student_name\nclass_id -> course',
      violator: 'student_id -> student_name',
      why: '<code>student_id</code> is not a superkey of Enrolment, but it determines <code>student_name</code>.',
      fix: 'Enrolment(student_id, class_id, mark)\nStudents(student_id, student_name)\nClasses(class_id, course)' },

    { rel: 'Booking(booking_id, room_id, room_type, booked_by, staff_email)',
      extra: '<code>booking_id</code> is the primary key. Each room has one type and each staff member has one email.',
      fds: 'booking_id -> room_id, room_type, booked_by, staff_email\nroom_id -> room_type\nbooked_by -> staff_email',
      violator: 'room_id -> room_type',
      why: '<code>room_id</code> is not a superkey of Booking, but it determines <code>room_type</code>.',
      fix: 'Booking(booking_id, room_id, booked_by)\nRooms(room_id, room_type)\nStaff(booked_by, staff_email)' }
  ];

  /* --- BCNF decomposition algorithm, worked step by step (21T3 Q10) --- */

  var BCNF_STEPS = [
    { intro: 'A spreadsheet records information about students and the classes they attend. The columns are:',
      cols: [
        ['A', 'Student ID'],
        ['B', 'Student name'],
        ['C', 'Student date of birth'],
        ['D', 'Class ID'],
        ['E', 'Course code'],
        ['F', 'Room name']
      ],
      note: 'A student may attend many classes, and a class has many students. Students never change their name or date of birth, and a class is always the same course in the same room.',
      fds: 'A -> BC     (a student determines their name and date of birth)\nD -> EF     (a class determines its course and its room)',
      key: 'AD',
      work:
'Attrs ABCDEF, FDs A -> BC and D -> EF, candidate key AD\n' +
'  A -> BC violates BCNF, because A is not a superkey of ABCDEF\n' +
'  split on A -> BC:  ABC  and  ADEF\n' +
'\n' +
'Attrs ABC, FD A -> BC, key A\n' +
'  A IS the key here, so no violation. ABC is in BCNF.\n' +
'\n' +
'Attrs ADEF, FD D -> EF, key AD\n' +
'  D -> EF violates BCNF, because D is not a superkey of ADEF\n' +
'  split on D -> EF:  DEF  and  AD\n' +
'\n' +
'Attrs DEF, FD D -> EF, key D    -> in BCNF\n' +
'Attrs AD,  no non-trivial FDs   -> in BCNF\n' +
'\n' +
'Final schema: ABC, DEF, AD',
      meaning:
'ABC = Students: one row per student, with their name and date of birth.\n' +
'DEF = Classes:  one row per class, with its course code and room.\n' +
'AD  = Attends:  one row per (student, class) pair — who attends what.' }
  ];

  /* ================ 11. Relational algebra: write it =================== */

  var RA_WRITE = [
    { sql: 'select * from Rooms;',
      sample: 'Res = Rooms',
      notes: 'Selecting everything needs no operator at all.' },
    { sql: "select name, capacity from Rooms where rtype = 'Computer Lab';",
      sample: "Tmp(name,capacity) = Sel[rtype = 'Computer Lab'] Rooms\nRes = Tmp\n\n-- or in one step, with implicit projection:\nRes(name,capacity) = Sel[rtype = 'Computer Lab'] Rooms",
      notes: 'Select first, then project. Writing the attribute list on the left-hand side is the implicit-projection notation the course uses.' },
    { sql: "select c.course, r.name\nfrom   Classes c join Rooms r on c.held_in = r.id\nwhere  c.day_of_week = 'Mon';",
      sample: "Tmp1        = Sel[day_of_week = 'Mon'] Classes\nTmp2        = Tmp1 Join[held_in = id] Rooms\nRes(course,name) = Tmp2",
      notes: 'Pushing the selection before the join is preferred — there is less data to join — but joining first and selecting afterwards is also correct.' },
    { sql: 'select s.name, c.course\nfrom   Students s\n       join Attends a on a.student_id = s.id\n       join Classes c on a.class_id = c.id;',
      sample: 'Tmp1          = Students Join[id = student_id] Attends\nTmp2          = Tmp1 Join[class_id = id] Classes\nRes(name,course) = Tmp2',
      notes: 'A three-table chain becomes two joins. The order of the relations does not matter to correctness.' },
    { sql: "select distinct r.name\nfrom   Rooms r join Has h on h.room_id = r.id\n       join Facilities f on h.facility_id = f.id\nwhere  f.name = 'Projector';",
      sample: "Tmp1     = Sel[name = 'Projector'] Facilities\nTmp2     = Has Join[facility_id = id] Tmp1\nTmp3     = Rooms Join[id = room_id] Tmp2\nRes(name) = Tmp3",
      notes: 'Projection in relational algebra removes duplicates automatically, so <code>distinct</code> needs nothing extra.' },
    { sql: 'select s.name\nfrom   Students s\nwhere  s.id not in (select student_id from Attends);',
      sample: 'Tmp1(id) = Proj[student_id] Attends\nTmp2(id) = Proj[id] Students\nTmp3     = Tmp2 - Tmp1\nRes(name) = Students Join[id = id] Tmp3',
      notes: 'Set difference is how "not in" is expressed. Project both sides down to the same single attribute so the difference is between compatible relations.' }
  ];

  /* ============ 12. Relational algebra: evaluate it (22T3 Q7) ========== */

  var RA_EVAL = [
    { tables:
'R                S                T\n' +
' a | b | c        e | d | c        b\n' +
'-----------      -----------      ---\n' +
' x | 1 | a        6 | 9 | a        1\n' +
' y | 2 | b        7 | 8 | b        4\n' +
' z | 3 | a\n' +
' x | 4 | b\n' +
' y | 5 | a',
      parts: [
        { q: 'Proj[a] R',
          a: ' a\n---\n x\n y\n z',
          why: 'Projection keeps only column a and <b>removes duplicates</b> — x and y each appear twice in R but once in the result.' },
        { q: 'Sel[e > d] S',
          a: ' e | d | c\n-----------\n(no rows)',
          why: 'Selection keeps rows where the condition holds. Row 1 has 6 > 9 false; row 2 has 7 > 8 false. So the result is empty, but it still has the schema of S.' },
        { q: 'R Join S',
          a: ' a | b | c | e | d\n-------------------\n x | 1 | a | 6 | 9\n y | 2 | b | 7 | 8\n z | 3 | a | 6 | 9\n x | 4 | b | 7 | 8\n y | 5 | a | 6 | 9',
          why: 'With no condition written this is a <b>natural</b> join: it matches on the shared attribute name c, and the shared column appears once in the result.' },
        { q: 'R Join[b = e] S',
          a: ' a | b | R.c | e | d | S.c\n---------------------------\n(no rows)',
          why: 'A theta join on b = e. R has b values 1..5 and S has e values 6 and 7, so nothing matches. Because it is not a natural join, the two c columns both survive and must be disambiguated as R.c and S.c.' },
        { q: 'R Div T',
          a: ' a | c\n-------\n(depends — see explanation)',
          why: 'Division answers "which a,c pairs appear in R with <b>every</b> b value in T?" T holds b = 1 and 4. Looking at R: the pair (x, a) appears with b = 1, and (x, b) appears with b = 4 — but no single (a, c) pair appears with both 1 and 4. So the result is empty. Division is the algebra equivalent of the SQL "has all of them" pattern.' }
      ] }
  ];

  /* ================ 13. Transactions and locking ====================== */

  var TXN = [
    { sched: 'T1:  R(X)              R(Y)  W(Y)\nT2:        R(X)  W(X)',
      conflict: true,
      conflictWhy: 'The only conflict is on X: T1 reads X before T2 writes X, giving an edge T1 → T2. Nothing else conflicts (Y is touched only by T1). The precedence graph has one edge and no cycle, so the schedule IS conflict serializable, equivalent to T1; T2.',
      view: true,
      viewWhy: 'Every conflict-serializable schedule is also view serializable, so yes. Concretely, consider the serial schedule T1; T2. In both schedules R(X) in T1 and R(X) in T2 read the original X, T2 performs the final write on X, and Y is touched only by T1. The two are view equivalent.' },

    { sched: 'T1:  R(X)              W(Y)\nT2:        R(Y)  W(X)',
      conflict: false,
      conflictWhy: 'On X: T1 reads X before T2 writes it, so T1 → T2. On Y: T2 reads Y before T1 writes it, so T2 → T1. Those two edges form a cycle, so the schedule is NOT conflict serializable.',
      view: false,
      viewWhy: 'Try both serial orders. In T1; T2, the R(Y) in T2 would read the Y that T1 wrote, but in the actual schedule it reads the initial Y — not equivalent. In T2; T1, the R(X) in T1 would read the X that T2 wrote, but in the actual schedule it reads the initial X — not equivalent either. No serial schedule is view equivalent, so it is NOT view serializable.' },

    { sched: 'T1:        W(Y)  W(X)\nT2:  R(Y)              W(X)\nT3:                          W(X)',
      conflict: false,
      conflictWhy: 'On Y: T2 reads Y before T1 writes it, so T2 → T1. On X: T1 writes before T2 writes, so T1 → T2 (and both before T3). T2 → T1 together with T1 → T2 is a cycle, so it is NOT conflict serializable.',
      view: true,
      viewWhy: 'Consider T2; T1; T3. Because every transaction writes X and T3 writes it last in the schedule, any equivalent serial order must end with T3. Because T2 reads the initial Y and T1 later writes Y, T2 must come before T1. That leaves exactly T2; T1; T3. In both schedules: T2 reads the initial value of Y, the final write of Y is by T1, and the final write of X is by T3. So it IS view serializable — the writes to X by T1 and T2 are blind writes that nobody reads, which is exactly when view serializability is weaker than conflict serializability.' }
  ];

  var LOCKING = [
    { sched: 'T1:  R(X)  W(X)\nT2:        R(Y)  W(Y)',
      sample:
'T1:  Lw(X) R(X) W(X) U(X)\n' +
'T2:              Lw(Y) R(Y) W(Y) U(Y)\n' +
'\n' +
'-- Lw = write (exclusive) lock, Lr = read (shared) lock, U = unlock\n' +
'-- Two-phase: every lock is taken before any unlock in that transaction.',
      notes: 'Each transaction only touches its own item, so the locks never contend. Two-phase locking requires a growing phase (all locks acquired) followed by a shrinking phase (all locks released) — you may not take a new lock after releasing one.' },
    { sched: 'T1:  R(X)              W(Y)\nT2:        R(Y)  W(X)',
      sample:
'T1:  Lr(X) Lw(Y) R(X) W(Y) U(X) U(Y)\n' +
'T2:  Lr(Y) Lw(X) R(Y) W(X) U(Y) U(X)\n' +
'\n' +
'-- Both transactions must hold all their locks before releasing any.\n' +
'-- Note that if T1 gets Lr(X) and T2 gets Lr(Y) first, then T1 waits\n' +
'-- for Lw(Y) and T2 waits for Lw(X) => deadlock.',
      notes: 'This is the schedule that was not conflict serializable, and 2PL will not permit it to run concurrently — one transaction must wait. Written naively it deadlocks, which is precisely the price 2PL pays for guaranteeing serializability.' }
  ];

  var LOCKING_PROBLEMS = [
    'Deadlock — two transactions each hold a lock the other needs and both wait for ever. The system must detect it (a cycle in the waits-for graph) and abort one of them.',
    'Starvation — a transaction repeatedly loses out to others and never acquires the lock it needs.',
    'Reduced concurrency and throughput — holding locks until the shrinking phase serialises work that could have overlapped, so the system behaves more like serial execution under load.',
    'Cascading rollback — with basic 2PL, a transaction can read data written by one that later aborts, forcing it to abort too. Strict 2PL (hold write locks until commit) avoids this at a further cost in concurrency.'
  ];

  /* =========================== 14. Concepts =========================== */

  var CONCEPTS = [
    { q: 'The first run of <code>select name from Students where id = 3312345;</code> takes 1.24 ms; every later run takes about 0.28 ms. Why is the first so much slower?',
      opts: [
        'The first run must read the data pages from disk; afterwards they are in the buffer pool, so later runs are served from memory.',
        'The query is compiled to machine code the first time and cached.',
        'The database rebuilds the index on the first query.',
        'The first query has to establish the network connection.'
      ], correct: 0,
      why: 'The dominant cost is disk I/O. Once the pages are in the buffer cache the query avoids that entirely. Plan caching exists but is a much smaller effect.' },
    { q: '<code>select max(id) from Students;</code> is fast but <code>select max(d_o_birth) from Students;</code> is much slower. Why?',
      opts: [
        '<code>id</code> is the primary key so it has an index — the maximum is the last entry. <code>d_o_birth</code> has no index, so every row must be scanned.',
        'Dates are inherently slower to compare than integers.',
        'The <code>d_o_birth</code> column contains NULLs, which slows the aggregate.',
        'The table is physically sorted by id on disk.'
      ], correct: 0,
      why: 'With a B-tree index, <code>max</code> is a single descent to the rightmost entry. Without one it is a full sequential scan.' },
    { q: 'Fragment A runs one query per course inside a Python loop; fragment B runs a single query with a join and loops over the result. Which is better?',
      opts: [
        'B — one query means one round trip and lets the optimiser choose a join strategy; A pays query overhead once per course.',
        'A — smaller queries are always faster because they touch less data.',
        'They are equivalent; the database does the same work either way.',
        'A — it uses less memory in Python, which dominates the run time.'
      ], correct: 0,
      why: 'The N+1 query problem. Each <code>execute</code> is a separate round trip and a separate planning step.' },
    { q: 'Why does adding an index speed up queries but slow down updates?',
      opts: [
        'The index gives a fast lookup path for reads, but every insert, update or delete must also maintain the index.',
        'Indexes lock the table during reads.',
        'Indexes are stored on slower disks than tables.',
        'Indexes must be rebuilt from scratch after every update.'
      ], correct: 0,
      why: 'An index is a redundant, sorted copy of some of the data. Redundancy trades read speed for write cost and storage.' },
    { q: 'What does the PostgreSQL system catalogue store?',
      opts: [
        'Metadata — definitions of tables, columns, types, indexes, views and constraints — itself held in tables you can query.',
        'A backup copy of every table.',
        'The results most recently returned to clients.',
        'The transaction log used for crash recovery.'
      ], correct: 0,
      why: 'The database describing itself. <code>\\d</code> in psql is really a query over <code>pg_class</code>, <code>pg_attribute</code> and friends.' },
    { q: 'You define <code>create view v as select ... from Classes where ...</code>. What happens when you query the view?',
      opts: [
        'The view definition is substituted into your query and the whole thing is optimised and run — nothing is stored.',
        'The rows were computed and stored when the view was created.',
        'The view is recomputed on a schedule and cached.',
        'The view stores a copy that updates when the base table changes.'
      ], correct: 0,
      why: 'A plain view is a stored query. A <b>materialized</b> view stores rows and must be refreshed explicitly.' },
    { q: 'Why does <code>where lower(name) = \'smith\'</code> typically not use an index on <code>name</code>?',
      opts: [
        'The index stores raw values, not the result of a function applied to them, so it cannot be searched by <code>lower(name)</code> unless a matching expression index exists.',
        'String comparisons never use indexes.',
        '<code>lower()</code> is not deterministic.',
        'The optimiser refuses to use an index when a function appears anywhere in the query.'
      ], correct: 0,
      why: 'Fix it with an expression index: <code>create index on Students (lower(name));</code>.' },
    { q: 'Why use <code>%s</code> placeholders in psycopg2 rather than building SQL with f-strings?',
      opts: [
        'The driver escapes the values, preventing SQL injection and handling quoting and types correctly.',
        'It makes the query run faster.',
        'It is the only way to pass integers.',
        'It allows multiple result sets.'
      ], correct: 0,
      why: 'Correct quoting and injection safety. The placeholder is always <code>%s</code> whatever the type, and parameters go in a list.' },
    { q: 'Why does the schema declare <code>day_of_week</code> as an enum rather than <code>text</code>?',
      opts: [
        'It restricts the values to the five valid days and gives a sensible sort order (Mon before Tue) rather than alphabetical.',
        'Enums are stored more compactly than any text value.',
        'Enums allow foreign keys to be declared against them.',
        'Enums are required for any column used in a GROUP BY.'
      ], correct: 0,
      why: 'Enums order by declaration order, which is why <code>order by day_of_week</code> gives Mon…Fri. They also act as a built-in domain constraint.' }
  ];

  /* --- extra variants appended to the existing banks --- */

  SQL_ADV.push(
    { task: 'Report the room(s) with the <b>second largest</b> capacity. Ties at the top must not hide the answer.',
      view: 'q(room, capacity)',
      sample:
'create or replace view q(room, capacity)\n' +
'as\n' +
'select name, capacity\n' +
'from   Rooms\n' +
'where  capacity = (select max(capacity) from Rooms\n' +
'                   where capacity < (select max(capacity) from Rooms));',
      notes: 'Nested max is the tie-safe way to say "second largest": the inner query finds the largest, the outer finds the largest of everything strictly below it. <code>order by capacity desc limit 1 offset 1</code> gives the wrong answer as soon as two rooms tie for largest — it returns the second copy of the largest.' },

    { task: 'Report every student who attends at least one class of <b>every</b> class type that exists in the database.',
      view: 'q(student)',
      sample:
'create or replace view q(student)\n' +
'as\n' +
'select s.name\n' +
'from   Students s\n' +
'where  not exists (\n' +
'           (select distinct ctype from Classes)\n' +
'           except\n' +
'           (select distinct c.ctype\n' +
'            from   Attends a join Classes c on a.class_id = c.id\n' +
'            where  a.student_id = s.id)\n' +
'       );',
      notes: 'Division again, and worth recognising as the same shape as "rooms that have every facility": <code>NOT EXISTS ( everything EXCEPT what this one has )</code>. Note it divides by the class types that actually occur in <code>Classes</code>, not by the five values the enum allows — read the wording carefully, because those are different questions.' }
  );

  PLPGSQL.push(
    { task: 'Write a function that enrols a student in a class, returning a message rather than crashing. It must cope with a non-existent student or class, and with the student already being enrolled.',
      sig: 'create or replace function enrol(sid integer, cid integer) returns text',
      sample:
'create or replace function enrol(sid integer, cid integer) returns text\n' +
'as $$\n' +
'begin\n' +
'    perform 1 from Students where id = sid;\n' +
'    if not found then\n' +
"        return 'No such student';\n" +
'    end if;\n' +
'\n' +
'    perform 1 from Classes where id = cid;\n' +
'    if not found then\n' +
"        return 'No such class';\n" +
'    end if;\n' +
'\n' +
'    insert into Attends(student_id, class_id) values (sid, cid);\n' +
"    return 'Enrolled';\n" +
'\n' +
'exception\n' +
'    when unique_violation then\n' +
"        return 'Already enrolled';\n" +
'    when foreign_key_violation then\n' +
"        return 'Invalid student or class';\n" +
'end;\n' +
'$$ language plpgsql;',
      notes: 'An <code>exception</code> block goes at the end of the <code>begin … end</code>, after the normal code. Catching <code>unique_violation</code> is more robust than checking first: between your check and your insert another session could insert the same row, so the check alone has a race. Note that entering an exception handler rolls back everything the block did.' }
  );

  ER.push(
    { task: 'A <b>Student</b>(<u>id</u>, name) may have several <b>phone numbers</b> and several <b>email addresses</b> (both multi-valued attributes). Write the SQL schema.',
      erMap:
'create table Students (\n' +
'    id    integer primary key,\n' +
'    name  text not null\n' +
');\n' +
'\n' +
'create table StudentPhones (\n' +
'    student  integer references Students(id),\n' +
'    phone    text,\n' +
'    primary key (student, phone)\n' +
');\n' +
'\n' +
'create table StudentEmails (\n' +
'    student  integer references Students(id),\n' +
'    email    text,\n' +
'    primary key (student, email)\n' +
');',
      singleTable: null,
      notes: 'A multi-valued attribute always becomes its own table keyed on (owner, value) — you cannot store a list in a column. Two independent multi-valued attributes need two separate tables: combining them into one would produce a spurious cross product of phones and emails.' },

    { task: 'A <b>Building</b>(<u>code</u>, address) contains <b>Rooms</b>, whose room number is only unique <i>within</i> a building, so a room cannot be identified without knowing its building. Write the SQL schema.',
      erMap:
'create table Buildings (\n' +
'    code     text primary key,\n' +
'    address  text not null\n' +
');\n' +
'\n' +
'create table Rooms (\n' +
'    building  text references Buildings(code) on delete cascade,\n' +
'    number    text,\n' +
'    capacity  integer not null check (capacity > 0),\n' +
'    primary key (building, number)\n' +
');',
      singleTable: null,
      notes: 'This is a <b>weak entity</b>: its key is the owner\'s key plus its own partial key, here (building, number). The composite primary key is what makes it weak. <code>on delete cascade</code> is appropriate because a room cannot exist without its building — that is exactly the identifying relationship.' }
  );

  /* ================= 15. SQL set operations (UNION etc.) ============== */

  var SQL_SETOPS = [
    { task: 'Report every student who attends at least one <b>COMP3311</b> class but does <b>not</b> attend any <b>MATH1131</b> class.',
      view: 'q(student)',
      sample:
'create or replace view q(student)\n' +
'as\n' +
'select s.name\n' +
'from   Students s join Attends a on a.student_id = s.id\n' +
'       join Classes c on a.class_id = c.id\n' +
"where  c.course = 'COMP3311'\n" +
'except\n' +
'select s.name\n' +
'from   Students s join Attends a on a.student_id = s.id\n' +
'       join Classes c on a.class_id = c.id\n' +
"where  c.course = 'MATH1131';",
      notes: '<code>EXCEPT</code> removes duplicates automatically, so no <code>distinct</code> is needed. Careful though: this compares on <i>name</i>, so two different students with the same name would interfere. Selecting <code>s.id, s.name</code> on both sides is safer.' },

    { task: 'Report every room that is used for <b>both</b> a Lecture and a Tutorial at some point in the week.',
      view: 'q(room)',
      sample:
'create or replace view q(room)\n' +
'as\n' +
'select r.name\n' +
"from   Rooms r join Classes c on c.held_in = r.id where c.ctype = 'Lecture'\n" +
'intersect\n' +
'select r.name\n' +
"from   Rooms r join Classes c on c.held_in = r.id where c.ctype = 'Tutorial';",
      notes: '<code>INTERSECT</code> is the natural reading of "both". The same thing can be done with two <code>EXISTS</code> subqueries, or by grouping and checking <code>count(distinct ctype)</code> — all three are acceptable.' },

    { task: 'Report every room that is either a Computer Lab <b>or</b> hosts at least one Tute-Lab class, listed once each.',
      view: 'q(room)',
      sample:
'create or replace view q(room)\n' +
'as\n' +
"select name from Rooms where rtype = 'Computer Lab'\n" +
'union\n' +
'select r.name\n' +
'from   Rooms r join Classes c on c.held_in = r.id\n' +
"where  c.ctype = 'Tute-Lab';",
      notes: '<code>UNION</code> removes duplicates; <code>UNION ALL</code> keeps them and is faster when you know there are none. A room that is both a lab and hosts a Tute-Lab appears once either way here, because UNION deduplicates.' },

    { task: 'Report the facilities that room <b>K17 401</b> has but room <b>K17 402</b> does not.',
      view: 'q(facility)',
      sample:
'create or replace view q(facility)\n' +
'as\n' +
'select f.name\n' +
'from   Has h join Facilities f on h.facility_id = f.id\n' +
"       join Rooms r on h.room_id = r.id where r.name = 'K17 401'\n" +
'except\n' +
'select f.name\n' +
'from   Has h join Facilities f on h.facility_id = f.id\n' +
"       join Rooms r on h.room_id = r.id where r.name = 'K17 402';",
      notes: 'The two sides of a set operation must have the same number of columns and compatible types. Any <code>ORDER BY</code> goes at the very end and applies to the whole result, not to either side.' }
  ];

  /* ============ 16. NULLs and three-valued logic ====================== */

  var NULL_Q = [
    { setup:
'Consider this query, which lists every room with the number of classes held in it:\n' +
'\n' +
'    select r.name, count(*), count(c.id), sum(c.end_time - c.start_time)\n' +
'    from   Rooms r left outer join Classes c on c.held_in = r.id\n' +
'    group  by r.id, r.name;\n' +
'\n' +
'Room "K17 401" hosts 3 classes. Room "Meeting Room 2" hosts none.',
      parts: [
        { q: 'For "Meeting Room 2", what does <code>count(*)</code> return, and why?',
          opts: [
            '1 — the outer join manufactures one row for the room with NULLs in the Classes columns, and count(*) counts rows regardless of NULLs.',
            '0 — there are no matching classes.',
            'NULL — because the Classes columns are NULL.',
            'It raises an error, because you cannot count over an empty group.'
          ], correct: 0,
          why: 'This is the single most punished mistake in these papers. The left outer join keeps the room by inventing a row whose Classes columns are all NULL. <code>count(*)</code> counts that row.' },
        { q: 'For "Meeting Room 2", what does <code>count(c.id)</code> return?',
          opts: [
            '0 — count(expr) skips NULLs, and c.id is NULL in the manufactured row.',
            '1 — same as count(*).',
            'NULL.',
            'An error, since c.id does not exist for that room.'
          ], correct: 0,
          why: 'Counting a column from the <i>child</i> table is the fix: every aggregate except <code>count(*)</code> ignores NULLs.' },
        { q: 'For "Meeting Room 2", what does the <code>sum(...)</code> return?',
          opts: [
            'NULL — sum over a group with no non-NULL values returns NULL, not 0.',
            '0 — an empty sum is zero.',
            '1.',
            'An error.'
          ], correct: 0,
          why: 'Wrap it in <code>coalesce(sum(...), 0)</code> whenever the question wants a number for empty groups.' }
      ],
      written: {
        q: 'Explain in two or three sentences where NULLs come from in this schema, given that every column is declared <code>not null</code>.',
        a: 'No base table can contain a NULL — every column is declared not null. NULLs appear only as a by-product of query evaluation: an outer join manufactures rows whose columns from the unmatched side are all NULL, and an aggregate such as sum, avg, min or max over a group with no rows returns NULL. That is why count(*) and count(col) differ after an outer join, and why sums need coalesce.'
      } },

    { setup:
'Suppose a query uses a subquery that can return NULL:\n' +
'\n' +
'    select s.name from Students s\n' +
'    where  s.id not in (select a.student_id\n' +
'                        from   Attends a left outer join Classes c\n' +
'                               on a.class_id = c.id);\n' +
'\n' +
'Assume the subquery returns the values 1001, 1002 and NULL.',
      parts: [
        { q: 'How many rows does the outer query return?',
          opts: [
            'None at all — NOT IN with a NULL in the list can never be true.',
            'Every student except 1001 and 1002.',
            'Only students 1001 and 1002.',
            'It raises an error.'
          ], correct: 0,
          why: 'For NOT IN to be true, the value must differ from <b>every</b> element. Comparing anything to NULL yields unknown, so the whole condition is unknown rather than true — and WHERE only keeps rows that are true.' },
        { q: 'What is the safe way to write this?',
          opts: [
            'Use <code>NOT EXISTS</code> with a correlated subquery, which is unaffected by NULLs.',
            'Add <code>distinct</code> to the subquery.',
            'Wrap the subquery in <code>coalesce</code>.',
            'Nothing is needed — NOT IN is always safe.'
          ], correct: 0,
          why: '<code>where not exists (select 1 from Attends a where a.student_id = s.id)</code> means "no matching row", which behaves correctly regardless of NULLs. Alternatively add <code>where a.student_id is not null</code> to the subquery.' },
        { q: 'What does <code>where c.end_time = NULL</code> match?',
          opts: [
            'Nothing — the comparison is unknown for every row; you must write IS NULL.',
            'Every row where end_time has no value.',
            'Every row.',
            'It is a syntax error.'
          ], correct: 0,
          why: 'Equality with NULL is never true. <code>IS NULL</code> and <code>IS NOT NULL</code> are the only tests that work.' }
      ],
      written: {
        q: 'A colleague says "an outer join is always safer than an inner join, so just use it everywhere". Give a short response.',
        a: 'An outer join is only right when the question wants rows that have no match — for example "every room, including those with no classes". Used carelessly it changes the answer: it manufactures NULL-filled rows, which inflates count(*), can make WHERE conditions on the outer side silently drop those rows again (turning it back into an inner join), and forces coalesce around aggregates. Choose the join that matches the question.'
      } }
  ];

  /* ============ 17. DDL, constraints and referential integrity ======== */

  var DDL_Q = [
    { task: 'The schema records which facilities a room has. Add a table recording <b>bookings</b> of a room by a student for a given date and hour, with the constraints you would expect.',
      sample:
'create table Bookings (\n' +
'    id          integer,\n' +
'    room_id     integer not null references Rooms(id),\n' +
'    student_id  integer not null references Students(id),\n' +
'    booked_for  date not null,\n' +
'    start_time  integer not null check (start_time between 9 and 20),\n' +
'    end_time    integer not null check (end_time between 10 and 21),\n' +
'    primary key (id),\n' +
'    constraint sensible_times check (end_time > start_time),\n' +
'    constraint one_booking unique (room_id, booked_for, start_time)\n' +
');',
      notes: 'Three kinds of constraint are worth showing: <b>column</b> checks on individual values, a <b>table</b> check that relates two columns (<code>end_time &gt; start_time</code> cannot be a column check because it mentions two columns), and a <b>unique</b> constraint expressing "one booking per room per slot". Naming constraints gives you readable error messages.',
      mcq: {
        q: 'Why must <code>check (end_time &gt; start_time)</code> be written as a table-level constraint rather than beside the column?',
        opts: [
          'A column constraint may only refer to its own column; this one refers to two columns.',
          'Table constraints are checked faster.',
          'Column constraints cannot use comparison operators.',
          'It could be written either way with no difference.'
        ], correct: 0,
        why: 'A column-level check is syntactically attached to one column and may only mention that column. Anything relating two columns of the same row becomes a table-level constraint. Anything relating two <i>tables</i> cannot be a check constraint at all — it needs a trigger.'
      } },

    { task: 'Explain what each constraint in the given <code>Classes</code> table definition enforces, and give an example of a row each one would reject.',
      sample:
"course      char(8) not null check (course ~ '[A-Z]{4}[0-9]{4}')\n" +
'    Rejects a course code that is not four capital letters followed by four\n' +
"    digits, e.g. 'comp3311' or 'COMP331'. The ~ operator is a regular\n" +
'    expression match. It does NOT check that the course actually exists.\n' +
'\n' +
'ctype       ClassType not null\n' +
"    An enum: only the five listed values are allowed, so 'Workshop' is\n" +
'    rejected. Enums also give a sensible sort order (declaration order).\n' +
'\n' +
'held_in     integer not null references Rooms(id)\n' +
'    Referential integrity: the room must already exist in Rooms. Being\n' +
'    not null as well means every class is in exactly one room, which is\n' +
'    how total participation is expressed.\n' +
'\n' +
'start_time  integer not null check (start_time between 9 and 20)\n' +
'    A domain restriction: a class cannot start at 8 or at 21.\n' +
'\n' +
'primary key (id)\n' +
'    Unique and not null: no two classes share an id.',
      notes: 'Note what is <i>not</i> enforced: nothing stops <code>end_time</code> being earlier than <code>start_time</code>, and nothing stops two classes being scheduled in the same room at the same time. Those need a table-level check and a trigger respectively — a good thing to point out for marks.',
      mcq: {
        q: 'Which of these is <b>not</b> enforced by the given Classes definition?',
        opts: [
          'That two classes cannot be scheduled in the same room at the same time.',
          'That the course code has the form ABCD1234.',
          'That the room a class is held in exists.',
          'That start_time is between 9 and 20.'
        ], correct: 0,
        why: 'A clash involves two <i>rows</i>, and a check constraint can only see one row at a time. Preventing clashes needs a trigger (or a unique constraint on a slot column, if the design allowed one).'
      } },

    { task: 'A room is about to be demolished and its row deleted from <code>Rooms</code>, but classes still reference it. Explain what happens by default, and how the schema could be changed to handle it.',
      sample:
'By default a foreign key is NO ACTION / RESTRICT, so:\n' +
'\n' +
'    delete from Rooms where id = 42;\n' +
'    ERROR: update or delete on table "rooms" violates foreign key\n' +
'           constraint on table "classes"\n' +
'\n' +
'The delete is refused because Classes rows still reference that room.\n' +
'The options are:\n' +
'\n' +
'  on delete cascade\n' +
'      held_in integer not null references Rooms(id) on delete cascade\n' +
'      Deleting the room deletes every class held in it. Simple, but\n' +
'      destructive - you lose the classes, and Attends rows referencing\n' +
'      them would also need cascading.\n' +
'\n' +
'  on delete set null\n' +
'      Not possible here: held_in is declared not null.\n' +
'      It would require dropping the not null, weakening the model.\n' +
'\n' +
'  on delete restrict (the sensible default here)\n' +
'      Force the classes to be moved to another room first.\n' +
'\n' +
'The right answer for this schema is to keep RESTRICT and reschedule the\n' +
'classes before deleting the room.',
      notes: 'The exam wants you to notice the interaction: <code>on delete set null</code> is impossible while the column is <code>not null</code>, and cascading through <code>Classes</code> would also orphan <code>Attends</code> rows unless that foreign key cascades too. Say which option you would choose and why.',
      mcq: {
        q: 'If <code>Classes.held_in</code> were declared <code>on delete cascade</code>, what happens to <code>Attends</code> rows for classes in a deleted room?',
        opts: [
          'The delete fails unless Attends.class_id also cascades, because those rows would be left referencing classes that no longer exist.',
          'They are deleted automatically regardless.',
          'They are silently set to NULL.',
          'Nothing — Attends does not reference Classes.'
        ], correct: 0,
        why: 'Cascades do not propagate on their own through a second foreign key. <code>Attends.class_id references Classes(id)</code> defaults to RESTRICT, so the cascading delete of a class would itself be blocked.'
      } }
  ];

  /* ============ 18. ACID, isolation levels and anomalies ============== */

  var ISOLATION = [
    { q: 'A transaction transfers a student from one class to another: it deletes one <code>Attends</code> row and inserts another. The system crashes between the two. Which ACID property guarantees the database does not end up with the student in neither class?',
      opts: ['Atomicity — the transaction is all-or-nothing, so the completed delete is rolled back.',
             'Consistency — the database moves from one valid state to another.',
             'Isolation — other transactions do not see partial work.',
             'Durability — committed changes survive a crash.'], correct: 0,
      why: 'Atomicity is about the transaction as an indivisible unit. Consistency is the related but distinct claim that constraints still hold afterwards; durability is about surviving a crash <i>after</i> commit.' },

    { q: 'T1 updates a room capacity but has not committed. T2 reads that new capacity, then T1 aborts. What is this anomaly called?',
      opts: ['A dirty read — reading uncommitted data that is later rolled back.',
             'A non-repeatable read.',
             'A phantom read.',
             'A lost update.'], correct: 0,
      why: 'T2 has acted on a value that never really existed. This is prevented by any isolation level of READ COMMITTED or above.' },

    { q: 'T1 reads the capacity of a room, T2 updates and commits it, then T1 reads the same row again and sees a different value. What is this?',
      opts: ['A non-repeatable read — the same row gives different values within one transaction.',
             'A dirty read.',
             'A phantom read.',
             'A deadlock.'], correct: 0,
      why: 'Prevented by REPEATABLE READ and above. The distinction from a phantom is that this concerns a <i>row that already existed</i>.' },

    { q: 'T1 counts the classes in COMP3311, T2 inserts another COMP3311 class and commits, and T1 repeats the count and gets a bigger number. What is this?',
      opts: ['A phantom read — a new row appears that matches a condition the transaction already evaluated.',
             'A non-repeatable read.',
             'A dirty read.',
             'A cascading rollback.'], correct: 0,
      why: 'Phantoms concern rows that did not exist at the first read, so row-level locks do not prevent them. Only SERIALIZABLE rules them out.' },

    { q: 'Which isolation level prevents dirty reads, non-repeatable reads and phantoms?',
      opts: ['SERIALIZABLE.', 'READ COMMITTED.', 'REPEATABLE READ.', 'READ UNCOMMITTED.'], correct: 0,
      why: 'The levels form a ladder: READ UNCOMMITTED allows everything, READ COMMITTED stops dirty reads, REPEATABLE READ also stops non-repeatable reads, and SERIALIZABLE additionally stops phantoms. PostgreSQL\'s default is READ COMMITTED.' },

    { q: 'Why not simply run everything at SERIALIZABLE?',
      opts: ['It reduces concurrency: transactions block or abort and retry more often, cutting throughput.',
             'It is not supported by PostgreSQL.',
             'It uses more disk space.',
             'It disables constraint checking.'], correct: 0,
      why: 'Serializability is the strongest guarantee and the most expensive. The isolation levels exist precisely so an application can trade correctness guarantees it does not need for throughput it does.' },

    { q: 'What does the D in ACID guarantee, in practical terms?',
      opts: ['Once a transaction has committed, its changes survive a subsequent crash — normally via a write-ahead log.',
             'The database is never left in an invalid state.',
             'Transactions cannot see each other\'s uncommitted work.',
             'Deadlocks are automatically resolved.'], correct: 0,
      why: 'Durability is why the log is written and flushed before commit is acknowledged: the data pages themselves may still be dirty in memory.' }
  ];

  /* ================== 19. Query tuning and indexes ==================== */

  var TUNING = [
    { query:
'select s.name, c.course\n' +
'from   Students s\n' +
'       join Attends a on a.student_id = s.id\n' +
'       join Classes c on a.class_id = c.id\n' +
"where  c.course = 'COMP3311';",
      q: 'This query is slow on a large database. Which index would help most?',
      opts: ['An index on <code>Classes(course)</code>, so the small set of COMP3311 classes is found without scanning every class.',
             'An index on <code>Students(name)</code>, since that column is in the SELECT list.',
             'An index on <code>Attends(student_id, class_id)</code>, which the primary key already provides.',
             'No index can help a three-table join.'], correct: 0,
      why: 'Index the column in the <b>WHERE</b> clause with the highest selectivity. <code>course</code> filters the result down hardest, and the join columns are already indexed because they are primary and foreign keys. Columns that only appear in the SELECT list gain nothing from an index.',
      followup: {
        q: 'Suggest one further change that could speed this query up, and one reason an index might not be used even when it exists.',
        a: 'A covering index on Classes(course, id) would let the planner answer the Classes side from the index alone without touching the table. As for why an index may be ignored: if the condition matches a large fraction of the table, a sequential scan is genuinely cheaper than an index scan plus a random heap fetch per row, so the planner picks it. An index is also unusable if the condition wraps the column in a function (lower(course) = ...) unless a matching expression index exists, or if the statistics are stale and the planner misjudges selectivity — ANALYZE fixes that.'
      } },

    { query:
'select r.name, count(a.student_id)\n' +
'from   Rooms r\n' +
'       left outer join Classes c on c.held_in = r.id\n' +
'       left outer join Attends a on a.class_id = c.id\n' +
'group  by r.id, r.name;',
      q: 'This aggregate over the whole database is slow. What is the most likely reason?',
      opts: ['It has to read every row of Attends and Classes — no WHERE clause means no index can reduce the work.',
             'The outer joins force a sequential scan that an inner join would avoid.',
             'GROUP BY always requires a full sort of the base tables.',
             'count() is inherently slow on large tables.'], correct: 0,
      why: 'An index helps you <i>find rows</i>. A query with no filter genuinely needs all of them, so the cost is inherent. If this report is run often, a materialized view refreshed periodically is the usual answer.',
      followup: {
        q: 'The report above is displayed on a dashboard refreshed every minute. Suggest how to make it fast, and what you give up.',
        a: 'Use a materialized view: create materialized view room_usage as (the query), then refresh it on a schedule. Reads become a single scan of a small pre-computed table. What you give up is freshness — the figures are as old as the last refresh — plus the storage and the cost of refreshing. The alternative is maintaining a counter column with triggers, which is always current but adds work to every insert and delete and is easy to get wrong.'
      } },

    { query:
"select * from Classes where course = 'COMP3311' and day_of_week = 'Mon';",
      q: 'You already have an index on <code>Classes(course)</code>. Would adding an index on <code>Classes(day_of_week)</code> help this query much?',
      opts: ['Probably not much — day_of_week has only five possible values, so it is not selective; a composite index on (course, day_of_week) would be better.',
             'Yes, a separate index on each condition always doubles the speed.',
             'Yes, because enum columns index better than text.',
             'No, because PostgreSQL cannot index enum columns.'], correct: 0,
      why: 'Selectivity is what makes an index worth using. A column with five distinct values matches roughly a fifth of the table, which is usually cheaper to scan than to index. A <b>composite</b> index on (course, day_of_week) is the right answer when both conditions appear together — note the column order matters: it can serve a query on course alone, but not one on day_of_week alone.',
      followup: {
        q: 'Explain how you would confirm your reasoning rather than guessing.',
        a: 'Run EXPLAIN ANALYZE on the query. It shows the plan the optimiser actually chose (sequential scan vs index scan vs bitmap scan), its estimated cost, and — because of ANALYZE — the real time and row counts. A big gap between estimated and actual row counts points at stale statistics, which ANALYZE on the table fixes. Then add the candidate index and compare the plans.'
      } }
  ];

  /* ============================== templates ============================ */

  function sqlPartsFor(marks) {
    return function (v, rng) {
      return [
        code({
          label: 'i)', marks: marks, lang: 'SQL',
          prompt: 'Write the view. Define it as <code>' + v.view + '</code>.',
          prefill: 'create or replace view ' + v.view + '\n' +
                   'as\n' +
                   'select ...\n' +
                   'from   ...\n' +
                   (v.tail ? v.tail + '\n' : '') +
                   ';',
          rows: 12, model: v.sample, notes: v.notes, checklist: SQL_CHECKLIST
        })
      ];
    };
  }

  var T_SQL_BASIC = bankTemplate(
    { id: 'sql-basic', topic: 'SQL queries', title: 'SQL: joins and filtering', marks: 5, withSchema: true },
    SQL_BASIC, sqlPartsFor(5));

  var T_SQL_GROUP = bankTemplate(
    { id: 'sql-group', topic: 'SQL queries', title: 'SQL: grouping and aggregates', marks: 5, withSchema: true },
    SQL_GROUP, sqlPartsFor(5));

  var T_SQL_ADV = bankTemplate(
    { id: 'sql-advanced', topic: 'SQL queries', title: 'SQL: subqueries, division and harder patterns', marks: 7, withSchema: true },
    SQL_ADV, function (v, rng) {
      return [
        code({
          label: 'i)', marks: 7, lang: 'SQL',
          prompt: 'Write the view. Define it as <code>' + v.view + '</code>. You may define helper views first.',
          prefill: '-- helper views go here, before the view that uses them:\n' +
                   '-- create or replace view Helper(...)\n' +
                   '-- as\n' +
                   '-- select ...;\n' +
                   '\n' +
                   'create or replace view ' + v.view + '\n' +
                   'as\n' +
                   'select ...\n' +
                   'from   ...\n' +
                   ';',
          rows: 16, model: v.sample, notes: v.notes,
          checklist: [
            'Helper views defined before the view that uses them',
            'Ties handled (no ORDER BY ... LIMIT 1 where ties are possible)',
            'Nothing hard-coded that the question said to compute',
            'Correct handling of groups or rows with no matching data'
          ]
        })
      ];
    });

  var T_PLPGSQL = bankTemplate(
    { id: 'plpgsql', topic: 'PL/pgSQL', title: 'Writing a database function', marks: 8, withSchema: true,
      introFor: function (v) {
        return '<p>' + v.task + '</p><p class="model">' + v.sig.replace(/\n/g, '<br>') + '</p>';
      } },
    PLPGSQL, function (v, rng) {
      var isSql = /language sql/.test(v.sample);
      return [
        code({
          label: 'i)', marks: 8, lang: isSql ? 'SQL function' : 'PL/pgSQL',
          prompt: 'Write the function.',
          prefill: isSql
            ? v.sig + '\nas $$\n    select ...\n$$ language sql;'
            : v.sig + '\nas $$\ndeclare\n    ...\nbegin\n    ...\nend;\n$$ language plpgsql;',
          rows: 18, model: v.sample, notes: v.notes,
          checklist: [
            'declare block for every local variable',
            'begin … end; with the $$ delimiters and the language declared',
            'Used select … into, and if not found where an id might not exist',
            'return next inside the loop for a setof function, not a single return'
          ]
        })
      ];
    });

  var T_TRIGGER = bankTemplate(
    { id: 'triggers', topic: 'Triggers', title: 'Writing a trigger', marks: 8, withSchema: true },
    TRIGGERS, function (v, rng) {
      var tim = shuffleChoice(rng, [
        'It depends on the task: <b>before</b> to validate or alter the row, <b>after</b> to react once the change is in the table.',
        'Always before — it is faster.',
        'Always after — otherwise the data is inconsistent.',
        'It makes no difference in PostgreSQL.'
      ], 0);
      return [
        code({
          label: 'i)', marks: 6, lang: 'PL/pgSQL',
          prompt: 'Write the trigger function and the CREATE TRIGGER statement.',
          prefill: 'create or replace function ...() returns trigger\n' +
                   'as $$\ndeclare\n    ...\nbegin\n    ...\n    return new;\nend;\n' +
                   '$$ language plpgsql;\n\n' +
                   'create trigger ...\n' +
                   'after ... on ...          -- before or after? which operation?\n' +
                   'for each row execute procedure ...();',
          rows: 18, model: v.sample, notes: v.notes,
          checklist: [
            'A function returning trigger, plus a separate CREATE TRIGGER',
            'Stated before or after, and which operation(s)',
            'Used new / old correctly (no old on INSERT, no new on DELETE)',
            'Avoided a trigger cycle by restricting to update of <column>'
          ]
        }),
        mc({
          label: 'ii)', marks: 2,
          prompt: 'How do you decide whether a trigger should be BEFORE or AFTER?',
          options: tim.options, correct: tim.correct,
          solution: 'Use <b>before</b> when you need to check or modify the row on its way in — you can reject it or rewrite <code>new</code>. Use <b>after</b> when the change must already be visible in the table, for example when counting the rows that now exist.'
        })
      ];
    });

  var T_TRIGGER_ANALYSIS = bankTemplate(
    { id: 'trigger-analysis', topic: 'Triggers', title: 'Reading and tracing triggers', marks: 7,
      introFor: function (v) {
        return '<p>' + v.intro + '</p><pre class="code">' + esc(v.codeShown) + '</pre>' +
          '<p class="small muted">Assume the code above is syntactically correct.</p>';
      } },
    TRIGGER_ANALYSIS, function (v, rng) {
      var labels = ['i)', 'ii)', 'iii)', 'iv)', 'v)'];
      return v.parts.map(function (p, i) {
        return wr({
          label: labels[i], marks: i < 2 ? 2 : 1, prompt: p.q,
          placeholder: 'Two to four sentences…',
          model: p.a,
          checklist: ['Said what the code actually does, not what it should do',
                      'Distinguished the before trigger from the after trigger',
                      'Said whether the row change goes ahead or is aborted']
        });
      });
    });

  var T_PYTHON = bankTemplate(
    { id: 'psycopg2', topic: 'Python / psycopg2', title: 'Database access from Python', marks: 9, withSchema: true },
    PYTHON, function (v, rng) {
      return [
        code({
          label: 'i)', marks: 9, lang: 'Python',
          prompt: 'Write the script.',
          prefill: '#!/usr/bin/python3\n' +
                   'import sys\n' +
                   'import psycopg2\n' +
                   '\n' +
                   'usage = f"Usage: {sys.argv[0]} ..."\n' +
                   'if len(sys.argv) < 2:\n' +
                   '    print(usage)\n' +
                   '    exit(1)\n' +
                   '\n' +
                   '# SQL\n' +
                   '\n' +
                   'query = "select ..."\n' +
                   '\n' +
                   'db = cur = None\n' +
                   'try:\n' +
                   '    db = psycopg2.connect("dbname=classes")\n' +
                   '    cur = db.cursor()\n' +
                   '\n' +
                   '    ...\n' +
                   '\n' +
                   'except psycopg2.Error as err:\n' +
                   '    print("DB error: ", err)\n' +
                   'finally:\n' +
                   '    if cur: cur.close()\n' +
                   '    if db:  db.close()',
          rows: 22, model: v.sample, notes: v.notes,
          checklist: [
            'Validated the command-line arguments and printed a usage message',
            'Used %s placeholders with a parameter list, never string concatenation',
            'try / except psycopg2.Error / finally, closing cursor and connection',
            'Did the filtering and joining in SQL rather than in Python',
            'Handled the "nothing found" case'
          ]
        })
      ];
    });

  var T_PY_ANALYSIS = bankTemplate(
    { id: 'python-analysis', topic: 'Python / psycopg2', title: 'Analysing psycopg2 code', marks: 8,
      introFor: function (v) {
        return '<p>' + v.intro + '</p><pre class="code">' + esc(v.codeShown) + '</pre>';
      } },
    PY_ANALYSIS, function (v, rng) {
      var labels = ['i)', 'ii)', 'iii)', 'iv)'];
      return v.parts.map(function (p, i) {
        var isCode = i === 3;
        return isCode
          ? code({ label: labels[i], marks: 3, lang: 'Python', prompt: p.q,
                   prefill: 'query = """\nselect ...\n"""\n\ncur.execute(query)\nfor ... in cur.fetchall():\n    ...',
                   rows: 14, model: p.a,
                   notes: 'One query replaces N+1 round trips. Keep a "last value seen" variable to print group headings.',
                   checklist: ['Single query with a join and GROUP BY',
                               'Ordered so grouped output stays together',
                               'Guarded the division against zero'] })
          : wr({ label: labels[i], marks: i === 2 ? 2 : 3, prompt: p.q,
                 placeholder: 'Two to four sentences…', model: p.a,
                 checklist: ['Answered what the code does, not what it ought to do',
                             'Named the specific failure condition where relevant'] });
      });
    });

  var T_ER = bankTemplate(
    { id: 'er-schema', topic: 'ER → schema', title: 'Mapping an ER design to SQL', marks: 8,
      introFor: function (v) {
        return '<p>' + v.task + '</p>' +
          '<p class="small muted">Show all primary key and foreign key constraints, and document anything the ER design implies that the relational schema cannot enforce.</p>';
      } },
    ER, function (v, rng) {
      var parts = [
        code({
          label: v.singleTable ? '(A)' : 'i)', marks: v.singleTable ? 5 : 8, lang: 'SQL DDL',
          prompt: v.singleTable
            ? 'Map the design using the standard <b>ER mapping</b> of subclasses (a table per class).'
            : 'Write the CREATE TABLE statements.',
          prefill: 'create table ... (\n' +
                   '    id      integer primary key,\n' +
                   '    ...\n' +
                   ');\n' +
                   '\n' +
                   'create table ... (\n' +
                   '    ...\n' +
                   '    primary key (...),\n' +
                   '    foreign key (...) references ...(...)\n' +
                   ');\n' +
                   '\n' +
                   '-- cannot be enforced in standard SQL:\n' +
                   '--   ...',
          rows: 18, model: v.erMap, notes: v.notes,
          checklist: [
            'Every entity became a table with a primary key',
            'Foreign keys declared with references',
            'not null used where the ER design requires a value',
            'Documented any constraint SQL cannot express'
          ]
        })
      ];
      if (v.singleTable) {
        parts.push(code({
          label: '(B)', marks: 3, lang: 'SQL DDL',
          prompt: 'Now map the same design using the <b>single-table mapping</b> of subclasses, and comment on what this version can and cannot enforce.',
          prefill: 'create table ... (\n' +
                   '    id      integer primary key,\n' +
                   '    ...\n' +
                   '    is_...  boolean not null,\n' +
                   '    ...\n' +
                   '    constraint ... check (...)\n' +
                   ');\n' +
                   '\n' +
                   '-- what this version can / cannot enforce:\n' +
                   '--   ...',
          rows: 16, model: v.singleTable,
          notes: 'The trade-off is the answer: single-table can enforce total participation with a check constraint, but allows relationships to point at rows that are not really that subclass, and leaves NULLable columns.',
          checklist: ['One table with boolean discriminators',
                      'A check constraint for total participation',
                      'Said what each approach can and cannot enforce']
        }));
      }
      return parts;
    });

  var T_FD = bankTemplate(
    { id: 'fd-bcnf', topic: 'Normalisation', title: 'Functional dependencies and BCNF', marks: 6,
      introFor: function (v) {
        return '<p>Consider the relation</p><p class="model">' + v.rel + '</p><p>' + v.extra + '</p>';
      } },
    FD, function (v, rng) {
      var whyC = shuffleChoice(rng, [
        v.why,
        'It has a composite left-hand side, which BCNF forbids.',
        'It is a trivial dependency.',
        'Its right-hand side is part of the primary key.'
      ], 0);
      return [
        wr({ label: 'i)', marks: 2, prompt: 'List the functional dependencies that hold in this relation.',
          placeholder: 'X -> Y\n...', model: v.fds.replace(/\n/g, '<br>'),
          checklist: ['Included the dependency from the primary key',
                      'Included every non-key dependency implied by the description'] }),
        mc({ label: 'ii)', marks: 2,
          prompt: 'The dependency <code>' + v.violator + '</code> violates BCNF. Why?',
          options: whyC.options, correct: whyC.correct,
          solution: 'BCNF requires that for every non-trivial dependency X → Y, X is a <b>superkey</b>. Here it is not, so the same fact is repeated in every row sharing that left-hand side.' }),
        wr({ label: 'iii)', marks: 2, prompt: 'Give a decomposition of the schema that is in BCNF.',
          placeholder: 'Table1(...)\nTable2(...)', model: v.fix.replace(/\n/g, '<br>'),
          checklist: ['Split off the offending dependency into its own table',
                      'Kept the determinant in the original table as a foreign key',
                      'The decomposition is lossless'] })
      ];
    });

  var T_BCNF_ALGO = bankTemplate(
    { id: 'bcnf-algorithm', topic: 'Normalisation', title: 'BCNF decomposition, step by step', marks: 6,
      introFor: function (v) {
        var rows = v.cols.map(function (c) {
          return '<tr><th>' + c[0] + '</th><td>' + c[1] + '</td></tr>';
        }).join('');
        return '<p>' + v.intro + '</p><table class="dtable"><tbody>' + rows + '</tbody></table>' +
          '<p>' + v.note + '</p>';
      } },
    BCNF_STEPS, function (v, rng) {
      return [
        wr({ label: 'i)', marks: 2,
          prompt: 'Identify the functional dependencies that hold, based on the meaning of the columns.',
          placeholder: 'A -> ...\nD -> ...',
          model: v.fds.replace(/\n/g, '<br>'),
          checklist: ['One dependency per real-world entity described',
                      'Did not invent dependencies the description does not support'] }),
        wr({ label: 'ii)', marks: 3,
          prompt: 'Using the BCNF decomposition algorithm, convert ABCDEF into a BCNF schema. At each step show the relevant dependencies and the key of each table.',
          placeholder: 'Attrs ABCDEF, FDs ..., key ...\n  ... violates BCNF\n  split into ... and ...',
          model: '<pre class="sample">' + esc(v.work) + '</pre>',
          checklist: ['Stated the candidate key of the original relation (' + v.key + ')',
                      'At each step named the violating dependency and why',
                      'Recursed into both halves until every table is in BCNF',
                      'Stated the final set of tables'] }),
        wr({ label: 'iii)', marks: 1,
          prompt: 'Describe briefly, in English, what each table in the final schema represents.',
          placeholder: 'ABC = ...\n...',
          model: '<pre class="sample">' + esc(v.meaning) + '</pre>',
          checklist: ['Gave each table a real-world name, not just its attributes'] })
      ];
    });

  var T_RA_WRITE = bankTemplate(
    { id: 'rel-algebra', topic: 'Relational algebra', title: 'SQL to relational algebra', marks: 4,
      withSchema: true,
      introFor: function (v) {
        return '<p>Write a relational algebra equivalent of the following SQL, using the Classes schema:</p>' +
          '<pre class="code">' + esc(v.sql) + '</pre>' +
          '<p class="small muted">Use the notation with implicit projection, e.g. <code>Tmp1(a,b) = Sel[c=5] R</code>. ' +
          'The final step must produce a relation called <code>Res</code>.</p>';
      } },
    RA_WRITE, function (v, rng) {
      return [
        code({
          label: 'i)', marks: 4, lang: 'Relational algebra',
          prompt: 'Write the relational algebra expression.',
          prefill: 'Tmp1(...) = ...\nRes(...)  = ...',
          rows: 8, model: v.sample, notes: v.notes,
          checklist: ['One operation per step', 'Final relation is called Res',
                      'Attribute lists on the left-hand side where projection is needed']
        })
      ];
    });

  var T_RA_EVAL = bankTemplate(
    { id: 'rel-algebra-eval', topic: 'Relational algebra', title: 'Evaluating relational algebra',
      marks: 5,
      introFor: function (v) {
        return '<p>Given the following relations, work out the result of each expression. ' +
          'Give the resulting table, including its attribute names.</p>' +
          '<pre class="code">' + esc(v.tables) + '</pre>';
      } },
    RA_EVAL, function (v, rng) {
      var labels = ['(A)', '(B)', '(C)', '(D)', '(E)'];
      return v.parts.map(function (p, i) {
        return wr({
          label: labels[i], marks: 1, prompt: 'Evaluate <code>' + p.q + '</code>',
          placeholder: ' a | b\n-------\n ...',
          model: '<pre class="sample">' + esc(p.a) + '</pre>' + p.why,
          checklist: ['Gave the attribute names of the result',
                      'Removed duplicates where projection requires it',
                      'Wrote "no rows" rather than leaving it blank if the result is empty']
        });
      });
    });

  var T_TXN = bankTemplate(
    { id: 'transactions', topic: 'Transactions', title: 'Serializability of a schedule', marks: 7,
      introFor: function (v) {
        return '<p>Consider the following schedule from the concurrent execution of several transactions:</p>' +
          '<pre class="code">' + esc(v.sched) + '</pre>';
      } },
    TXN, function (v, rng) {
      var c1 = shuffleChoice(rng, ['Yes', 'No'], v.conflict ? 0 : 1);
      var c2 = shuffleChoice(rng, ['Yes', 'No'], v.view ? 0 : 1);
      return [
        mc({ label: 'i) a)', marks: 1, prompt: 'Is the schedule conflict serializable?',
          options: c1.options, correct: c1.correct, solution: v.conflictWhy }),
        wr({ label: 'i) b)', marks: 3, prompt: 'Show your working: list the conflicts and what they imply.',
          placeholder: 'Conflict on X: ...\nConflict on Y: ...\nPrecedence graph: ...',
          model: v.conflictWhy,
          checklist: ['Identified each conflicting pair (same item, different transactions, at least one write)',
                      'Gave the direction of each precedence edge',
                      'Stated whether the precedence graph has a cycle'] }),
        mc({ label: 'ii) a)', marks: 1, prompt: 'Is the schedule view serializable?',
          options: c2.options, correct: c2.correct, solution: v.viewWhy }),
        wr({ label: 'ii) b)', marks: 2, prompt: 'Justify your answer, giving an equivalent serial schedule if one exists.',
          placeholder: 'Consider the serial schedule ...\nFor X: ...\nFor Y: ...',
          model: v.viewWhy,
          checklist: ['Named a candidate serial order, or argued that none can work',
                      'Compared initial reads, final writes and read-from relationships',
                      'Remembered that every conflict-serializable schedule is view serializable'] })
      ];
    });

  var T_LOCKING = bankTemplate(
    { id: 'locking', topic: 'Transactions', title: 'Two-phase locking', marks: 6,
      introFor: function (v) {
        return '<p>Consider the following schedule:</p><pre class="code">' + esc(v.sched) + '</pre>' +
          '<p>Rewrite it showing the lock and unlock operations required by <b>two-phase locking</b>. ' +
          'Use <code>Lr(X)</code> for a read (shared) lock, <code>Lw(X)</code> for a write (exclusive) lock, ' +
          'and <code>U(X)</code> to unlock.</p>';
      } },
    LOCKING, function (v, rng) {
      var probs = rng.shuffle(LOCKING_PROBLEMS).slice(0, 3);
      return [
        code({
          label: 'i)', marks: 4, lang: 'Locking schedule',
          prompt: 'Write the schedule with locking operations added.',
          prefill: 'T1:  ...\nT2:  ...',
          rows: 8, model: v.sample, notes: v.notes,
          checklist: ['Every item read or written is locked first',
                      'All locks acquired before any is released (the two-phase rule)',
                      'Write locks used where the transaction writes',
                      'Every lock is eventually released']
        }),
        wr({
          label: 'ii)', marks: 2,
          prompt: 'What problems can two-phase locking cause?',
          placeholder: 'One per line…',
          model: probs.map(function (p) { return '• ' + p; }).join('<br>'),
          checklist: ['Named at least two distinct problems', 'Explained why each arises from holding locks']
        })
      ];
    });

  var T_CONCEPTS = {
    id: 'db-concepts', topic: 'Performance & concepts', title: 'Database concepts and performance',
    marks: 6,
    build: function (rng) {
      var picked = rng.shuffle(CONCEPTS).slice(0, 3);
      var labels = ['i)', 'ii)', 'iii)'];
      return {
        intro: '<p>Short-answer questions on how the database system behaves. In the real exam you explain each in two to four sentences — here, pick the best explanation.</p>',
        data: [],
        parts: picked.map(function (c, i) {
          var ch = shuffleChoice(rng, c.opts, c.correct);
          return mc({ label: labels[i], marks: 2, prompt: c.q,
                      options: ch.options, correct: ch.correct, solution: c.why });
        })
      };
    }
  };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }


  var T_SETOPS = bankTemplate(
    { id: 'sql-setops', topic: 'SQL queries', title: 'SQL: set operations', marks: 5, withSchema: true },
    SQL_SETOPS, function (v, rng) {
      return [
        code({
          label: 'i)', marks: 5, lang: 'SQL',
          prompt: 'Write the view using a set operation. Define it as <code>' + v.view + '</code>.',
          prefill: 'create or replace view ' + v.view + '\n' +
                   'as\n' +
                   'select ...\n' +
                   'from   ...\n' +
                   'where  ...\n' +
                   'union | intersect | except\n' +
                   'select ...\n' +
                   'from   ...\n' +
                   'where  ...\n' +
                   ';',
          rows: 16, model: v.sample, notes: v.notes,
          checklist: ['Both sides return the same number of columns, with compatible types',
                      'Chose the right operator for the wording (both / or / but not)',
                      'Remembered UNION and EXCEPT remove duplicates',
                      'Any ORDER BY placed at the very end']
        })
      ];
    });

  var T_NULLS = bankTemplate(
    { id: 'null-logic', topic: 'SQL queries', title: 'NULLs and three-valued logic', marks: 6,
      introFor: function (v) {
        return '<pre class="code">' + esc(v.setup) + '</pre>';
      } },
    NULL_Q, function (v, rng) {
      var labels = ['i)', 'ii)', 'iii)'];
      var parts = v.parts.map(function (p, i) {
        var ch = shuffleChoice(rng, p.opts, p.correct);
        return mc({ label: labels[i], marks: 1, prompt: p.q,
                    options: ch.options, correct: ch.correct, solution: p.why });
      });
      parts.push(wr({
        label: 'iv)', marks: 3, prompt: v.written.q,
        placeholder: 'Two or three sentences…', model: v.written.a,
        checklist: ['Said where the NULLs actually come from',
                    'Named the concrete consequence for a query',
                    'Gave the fix (coalesce, count(col), NOT EXISTS, IS NULL)']
      }));
      return parts;
    });

  var T_DDL = bankTemplate(
    { id: 'ddl-constraints', topic: 'Schema & constraints', title: 'DDL, constraints and referential integrity',
      marks: 8, withSchema: true },
    DDL_Q, function (v, rng) {
      var ch = shuffleChoice(rng, v.mcq.opts, v.mcq.correct);
      return [
        code({
          label: 'i)', marks: 6, lang: 'SQL DDL',
          prompt: 'Write your answer.',
          prefill: 'create table ... (\n' +
                   '    id      integer,\n' +
                   '    ...     integer not null references ...(...),\n' +
                   '    ...\n' +
                   '    primary key (...),\n' +
                   '    constraint ... check (...)\n' +
                   ');',
          rows: 16, model: v.sample, notes: v.notes,
          checklist: ['Primary key declared',
                      'Foreign keys declared with references, and not null where participation is total',
                      'Check constraints for value ranges, named where useful',
                      'Said which constraints cannot be expressed this way']
        }),
        mc({ label: 'ii)', marks: 2, prompt: v.mcq.q,
             options: ch.options, correct: ch.correct, solution: v.mcq.why })
      ];
    });

  var T_ISOLATION = {
    id: 'isolation', topic: 'Transactions', title: 'ACID, isolation levels and anomalies', marks: 8,
    build: function (rng) {
      var picked = rng.shuffle(ISOLATION).slice(0, 4);
      var labels = ['i)', 'ii)', 'iii)', 'iv)'];
      return {
        intro: '<p>Questions on transaction guarantees and the anomalies that isolation levels are designed to prevent.</p>',
        data: [],
        parts: picked.map(function (c, i) {
          var ch = shuffleChoice(rng, c.opts, c.correct);
          return mc({ label: labels[i], marks: 2, prompt: c.q,
                      options: ch.options, correct: ch.correct, solution: c.why });
        })
      };
    }
  };

  var T_QUERY_TUNING = bankTemplate(
    { id: 'query-tuning', topic: 'Performance & concepts', title: 'Indexes and query tuning', marks: 6,
      withSchema: true,
      introFor: function (v) {
        return '<p>Consider the following query on the Classes database:</p>' +
          '<pre class="code">' + esc(v.query) + '</pre>';
      } },
    TUNING, function (v, rng) {
      var ch = shuffleChoice(rng, v.opts, v.correct);
      return [
        mc({ label: 'i)', marks: 2, prompt: v.q,
             options: ch.options, correct: ch.correct, solution: v.why }),
        wr({ label: 'ii)', marks: 4, prompt: v.followup.q,
             placeholder: 'Two to four sentences…', model: v.followup.a,
             checklist: ['Named a specific change, not just "add an index"',
                         'Said what it costs as well as what it gains',
                         'Mentioned how you would verify it (EXPLAIN ANALYZE)'] })
      ];
    });

  /* ============================== registry ============================= */

  var TEMPLATES = [T_SQL_BASIC, T_SQL_GROUP, T_SQL_ADV, T_SETOPS, T_NULLS,
                   T_PLPGSQL, T_TRIGGER, T_TRIGGER_ANALYSIS, T_PYTHON, T_PY_ANALYSIS,
                   T_ER, T_DDL, T_FD, T_BCNF_ALGO, T_RA_WRITE, T_RA_EVAL,
                   T_TXN, T_LOCKING, T_ISOLATION, T_QUERY_TUNING, T_CONCEPTS];

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

  var METHODS = [
    { q: 'Rows from two tables, matched on a foreign key', a: 'join B on A.fk = B.id', tag: 'SQL' },
    { q: 'Keep rows from the left table even with no match', a: 'left outer join', tag: 'SQL' },
    { q: 'Count per group, including groups with zero', a: 'left outer join + count(child.key), never count(*)', tag: 'SQL' },
    { q: 'Filter on an aggregate', a: 'having, not where', tag: 'SQL' },
    { q: 'Every non-aggregated select column must…', a: 'appear in the GROUP BY', tag: 'SQL' },
    { q: '"the maximum", tie-safe', a: 'helper view, then where x = (select max(x) from helper)', tag: 'SQL' },
    { q: '"has none"', a: 'not exists (...), or left join ... where child.key is null', tag: 'SQL' },
    { q: '"only / all of them" for one group', a: 'not exists (a counterexample), or group by ... having count(distinct t) = 1', tag: 'SQL' },
    { q: '"has every one of them" (division)', a: 'not exists ( (select all) except (select the ones it has) )', tag: 'SQL' },
    { q: 'Comma-separated list per group', a: "string_agg(col, ',' order by col), wrapped in coalesce for empty groups", tag: 'SQL' },
    { q: 'Count only rows meeting a condition', a: 'count(case when cond then 1 end)', tag: 'SQL' },
    { q: 'Two time intervals overlap when…', a: 'a.start < b.end and b.start < a.end', tag: 'SQL' },
    { q: 'Report each pair once in a self-join', a: 'join the table to itself with a.id < b.id', tag: 'SQL' },
    { q: 'Beware: integer division', a: '5/2 = 2 in SQL; divide by 2.0 when you mean a half', tag: 'SQL' },
    { q: 'char(8) column compared to a string', a: 'it is blank-padded; trim() it when concatenating', tag: 'SQL' },
    { q: 'Get one value out of a query in PL/pgSQL', a: 'select ... into var from ...', tag: 'PL/pgSQL' },
    { q: 'Check the previous select found a row', a: 'if not found then ... end if;', tag: 'PL/pgSQL' },
    { q: 'Run a query only to set found', a: 'perform 1 from ... where ...;', tag: 'PL/pgSQL' },
    { q: 'Loop over a query result', a: 'for r in select ... loop ... end loop;', tag: 'PL/pgSQL' },
    { q: 'Return a set of tuples', a: 'returns setof T, then return next res inside the loop', tag: 'PL/pgSQL' },
    { q: 'Function body is a single query', a: 'use language sql, refer to args as $1 — no declare/begin/loop', tag: 'PL/pgSQL' },
    { q: 'Case-insensitive partial match', a: "col ilike '%' || arg || '%'", tag: 'PL/pgSQL' },
    { q: 'Trigger that validates or rewrites a row', a: 'before insert or update ... return new', tag: 'Triggers' },
    { q: 'Trigger that reacts to a committed change', a: 'after insert/update/delete', tag: 'Triggers' },
    { q: 'Which operation fired the trigger?', a: "TG_OP = 'INSERT' / 'UPDATE' / 'DELETE'", tag: 'Triggers' },
    { q: 'Which record exists in which trigger?', a: 'INSERT: new only. DELETE: old only. UPDATE: both.', tag: 'Triggers' },
    { q: 'Avoid a trigger firing itself', a: 'after update of <column> — restrict to the column that matters', tag: 'Triggers' },
    { q: 'Maintaining a derived count', a: 'after trigger handling INSERT, DELETE and the UPDATE that moves the row', tag: 'Triggers' },
    { q: 'psycopg2: pass a value into a query', a: 'cur.execute(q, [val]) with %s in the SQL — never an f-string', tag: 'Python' },
    { q: 'psycopg2: required structure', a: 'connect, cursor, execute, fetch, try/except psycopg2.Error/finally, close', tag: 'Python' },
    { q: 'psycopg2: nested loops over results', a: 'use a second cursor — reusing one destroys the outer result set', tag: 'Python' },
    { q: 'N+1 query problem', a: 'one query per row of an outer result; replace with a single join', tag: 'Python' },
    { q: 'ER: one-to-many', a: 'foreign key on the MANY side, no extra table', tag: 'ER mapping' },
    { q: 'ER: many-to-many', a: 'a new table, PK = both foreign keys, plus any relationship attributes', tag: 'ER mapping' },
    { q: 'ER: multi-valued attribute', a: 'its own table, PK = (owner, value)', tag: 'ER mapping' },
    { q: 'ER: subclass, ER mapping', a: 'child table whose PK is also a FK to the parent', tag: 'ER mapping' },
    { q: 'ER: subclass, single-table mapping', a: 'one table with boolean discriminators + check constraints', tag: 'ER mapping' },
    { q: 'ER: total participation', a: 'not null on the FK — but across tables it cannot be enforced; say so', tag: 'ER mapping' },
    { q: 'BCNF condition', a: 'for every non-trivial X → Y, X must be a superkey', tag: 'Normalisation' },
    { q: 'BCNF decomposition step', a: 'on violation X → Y, split into XY and (R − Y); recurse on both', tag: 'Normalisation' },
    { q: 'Conflict serializable?', a: 'build the precedence graph from conflicting pairs; serializable iff no cycle', tag: 'Transactions' },
    { q: 'When do two operations conflict?', a: 'same item, different transactions, at least one is a write', tag: 'Transactions' },
    { q: 'View serializable but not conflict serializable', a: 'usually involves a blind write nobody reads', tag: 'Transactions' },
    { q: 'Two-phase locking rule', a: 'all locks acquired (growing) before any released (shrinking)', tag: 'Transactions' },
    { q: 'Problems 2PL causes', a: 'deadlock, starvation, reduced concurrency, cascading rollback', tag: 'Transactions' },
    { q: 'Relational algebra: division', a: 'R Div T = the R-values paired with EVERY value in T', tag: 'Relational algebra' },
    { q: 'Relational algebra: projection', a: 'removes duplicates automatically', tag: 'Relational algebra' },
    { q: 'Natural join vs theta join', a: 'natural matches all shared names and merges them; theta keeps both columns', tag: 'Relational algebra' }
  ];

  var SUBJECT = {
    id: 'comp3311',
    code: 'COMP3311',
    name: 'Database Systems',
    tagline: 'SQL, PL/pgSQL, triggers, psycopg2, ER mapping, normalisation, relational algebra and transactions, ' +
      'on the Classes database. Code is not auto-marked — write your attempt, then compare it with the sample answer ' +
      'or use "Copy for AI hint" for feedback on what you wrote.',
    templates: TEMPLATES,
    build: build,
    drillBlurb: 'The patterns and idioms these papers use over and over.',
    drillSets: [
      { id: 'methods', label: 'Patterns & idioms', cards: METHODS }
    ],
    reference: {
      title: 'SQL & schema reference',
      blurb: 'The patterns these papers keep asking for, and the mistakes that cost marks.',
      fromDrill: 'methods',
      sections: [
        { heading: 'The Classes schema', rows: [
          ['Students', 'id, name, d_o_birth'],
          ['Rooms', 'id, name, rtype (enum), capacity'],
          ['Classes', 'id, course char(8), ctype (enum), held_in → Rooms, day_of_week (enum), start_time, end_time'],
          ['Facilities', 'id, name'],
          ['Has', 'room_id → Rooms, facility_id → Facilities, nitems'],
          ['Attends', 'student_id → Students, class_id → Classes']
        ] },
        { heading: 'Things that cost marks', rows: [
          ['count(*) with an outer join', 'returns 1 for empty groups — count the child key instead'],
          ['Aggregate in WHERE', 'must be HAVING; WHERE runs before grouping'],
          ['ORDER BY … LIMIT 1 for "the maximum"', 'silently drops ties — compare against (select max(...)) instead'],
          ['NOT IN with a nullable column', 'returns no rows at all; prefer NOT EXISTS'],
          ['= null', 'always unknown — use IS NULL'],
          ['Integer division', '5/2 is 2; use 2.0 when you want a half'],
          ['Hard-coding a count the question said to compute', 'capped at half marks in the real paper'],
          ['GROUP BY name only', 'group by the id too, in case two rows share a name'],
          ['string_agg over an empty group', 'returns NULL, not an empty string — wrap in coalesce'],
          ['f-strings in psycopg2', 'use %s placeholders and a parameter list'],
          ['Reusing one cursor for a nested loop', 'the outer result set is destroyed — use two cursors'],
          ['Forgetting unenforceable ER constraints', 'total participation and disjointness are usually worth marks']
        ] },
        { heading: 'In the exam', rows: [
          ['Helper views are allowed', 'define them before the view that uses them, in the same file'],
          ['Check the required attribute list', 'the view name and its column names are specified exactly'],
          ['Enums sort by declaration order', 'order by day_of_week gives Mon…Fri, not alphabetical'],
          ['course is char(8)', 'blank-padded — trim() before concatenating'],
          ['Triggers are marked on structure', 'function returning trigger + CREATE TRIGGER + before/after choice'],
          ['Show your working on serializability', 'the conflicts and the cycle are worth more than the yes/no']
        ] }
      ]
    }
  };

  if (global.Subjects) global.Subjects.register(SUBJECT);
  global.COMP3311 = SUBJECT;
})(typeof window !== 'undefined' ? window : globalThis);

if (typeof module !== 'undefined') module.exports = (typeof window !== 'undefined' ? window : globalThis).COMP3311;
