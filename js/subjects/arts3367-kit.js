/* subjects/arts3367-kit.js — shared builders for the ARTS3367 in-class tests.
   Each test file supplies its own content (primers, topics, question banks,
   essays) and calls ARTS3367Kit.make() to get templates, a builder and a
   mock test in the real test's shape. Load after subjects.js and before the
   ARTS3367 test files. */
(function (global) {
  'use strict';

  var I_II = ['I only', 'II only', 'Both I and II', 'Neither I nor II'];

  /* An "I / II / both / neither" question. Options keep their order
     (`fixed`), and `a` gives the correct index. */
  function twoStatements(q, s1, s2, correct, why) {
    return { q: q + '<br><br><b>I.</b> ' + s1 + '<br><b>II.</b> ' + s2,
             o: I_II.slice(), a: correct, why: why, fixed: true };
  }

  function shuffleChoice(rng, options, correctIdx) {
    var idx = rng.shuffle(options.map(function (_, i) { return i; }));
    return { options: idx.map(function (i) { return options[i]; }), correct: idx.indexOf(correctIdx) };
  }

  function mcPart(rng, item, label) {
    var sh = item.fixed ? { options: item.o.slice(), correct: item.a }
                        : shuffleChoice(rng, item.o, item.a || 0);
    return { kind: 'choice', label: label || '', marks: 1, prompt: item.q,
             options: sh.options, correct: sh.correct, solution: item.why };
  }

  var PROSE_NOTE = '<p><i>Dot-point plan for learning. In the test, write it as connected prose — the handout says it expects coherent philosophical writing, not a list of bullet points.</i></p>';

  function planHtml(plan) {
    return plan.map(function (sec) {
      return '<h5>' + sec[0] + '</h5><ul>' +
        sec[1].map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>';
    }).join('');
  }

  var ESSAY_PROMPT = 'Write a mini-essay of up to 500 words. Aim for a clear thesis, an explanation of the view, an objection or complication, and a reasoned verdict. (Or sketch a plan first, then compare it with the model.)';

  function essayPart(e, label) {
    return { kind: 'written', label: label || '', marks: 10, prompt: ESSAY_PROMPT,
             model: PROSE_NOTE + planHtml(e.plan), checklist: e.must,
             wordLimit: 500, rows: 14, placeholder: 'Write your answer here, in prose…' };
  }

  /* cfg: { GUIDES, TOPICS, MCQ, HARD, ESSAYS, testName, scopeLabel }
       TOPICS  [{ key, name }] in course order
       MCQ / HARD  { key: [{ q, o, why, a?, fixed? }] }  (o[0] correct unless `a`)
       ESSAYS  { key: [{ q, plan: [[heading, [points]]], must: [..], sample? }] }
       testName    e.g. 'In-class Test 1' (used to flag handout questions)
       scopeLabel  e.g. 'Weeks 1–4' (the mock test's Section A topic) */
  function make(cfg) {
    var TOPICS = cfg.TOPICS, MCQ = cfg.MCQ, HARD = cfg.HARD, ESSAYS = cfg.ESSAYS, GUIDES = cfg.GUIDES;

    /* Deal questions from a shuffled deck per bank, so practice works through
       every question before any repeats. */
    var decks = {};
    function deal(key, n, rng) {
      if (!decks[key] || !decks[key].length) {
        var all = [];
        for (var i = 0; i < n; i++) all.push(i);
        decks[key] = rng.shuffle(all);
      }
      return decks[key].pop();
    }

    function sampleTag(e) {
      return e.sample ? '<p class="small muted">Sample question ' + e.sample + ' from the ' + cfg.testName + ' handout.</p>' : '';
    }

    var TEMPLATES = [];
    TOPICS.forEach(function (t) {
      TEMPLATES.push({
        id: 'mc-' + t.key, topic: t.name, format: 'Multiple choice',
        title: t.name + ': multiple choice', marks: 1, guide: GUIDES[t.key],
        build: function (rng) {
          var bank = MCQ[t.key];
          return { intro: '', data: [], parts: [mcPart(rng, bank[deal('mc-' + t.key, bank.length, rng)])] };
        }
      });
      TEMPLATES.push({
        id: 'mch-' + t.key, topic: t.name, format: 'Hard multiple choice',
        title: t.name + ': hard multiple choice', marks: 1, guide: GUIDES[t.key],
        build: function (rng) {
          var bank = HARD[t.key];
          return { intro: '', data: [], parts: [mcPart(rng, bank[deal('mch-' + t.key, bank.length, rng)])] };
        }
      });
      TEMPLATES.push({
        id: 'er-' + t.key, topic: t.name, format: 'Extended response',
        title: t.name + ': extended response', marks: 10, guide: GUIDES[t.key],
        build: function (rng) {
          var bank = ESSAYS[t.key];
          var e = bank[deal('er-' + t.key, bank.length, rng)];
          return { intro: '<p>' + e.q + '</p>' + sampleTag(e), data: [], parts: [essayPart(e)] };
        }
      });
    });

    /* Standard builder from _template.js. */
    function build(templateId, seed) {
      var tpl = null, i;
      for (i = 0; i < TEMPLATES.length; i++) if (TEMPLATES[i].id === templateId) tpl = TEMPLATES[i];
      if (!tpl) return null;
      for (var k = 0; k < 60; k++) {
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

    /* The real test's shape: Section A, ten multiple-choice questions (one
       from every topic plus one extra, in course order, about 60% from the
       hard bank); Section B, one mini-essay chosen from three, drawn from
       three different topics. */
    function buildMock() {
      var rng = global.Stats.rng(Math.floor(Math.random() * 1e9));

      var order = TOPICS.slice();
      while (order.length < 10) {
        var extra = rng.pick(TOPICS);
        order.splice(order.lastIndexOf(extra) + 1, 0, extra);
      }
      order = order.slice(0, 10);
      var used = {};
      var mcParts = order.map(function (t, i) {
        var hard = rng.next() < 0.6;
        var tpl = (hard ? 'mch-' : 'mc-') + t.key;
        var bank = (hard ? HARD : MCQ)[t.key], idx;
        for (var tries = 0; tries < 8; tries++) {
          idx = deal(tpl, bank.length, rng);
          if (!used[tpl + idx]) break;
        }
        used[tpl + idx] = true;
        var p = mcPart(rng, bank[idx], (i + 1) + '.');
        p.topic = t.name; p.tpl = tpl;   // file the result under its own topic
        return p;
      });
      var sectionA = {
        id: 'mock-mc', topic: cfg.scopeLabel, title: 'Multiple choice', examLabel: 'Section A',
        marks: mcParts.length, intro: '<p>Answer all ten questions. Each is worth 1 mark.</p>',
        data: [], parts: mcParts, seed: 0
      };

      var topics = rng.shuffle(TOPICS).slice(0, 3).sort(function (a, b) {
        return TOPICS.indexOf(a) - TOPICS.indexOf(b);
      });
      var essays = topics.map(function (t) {
        var bank = ESSAYS[t.key];
        return bank[deal('er-' + t.key, bank.length, rng)];
      });
      var model = PROSE_NOTE + essays.map(function (e, i) {
        return '<p style="margin-top:14px"><b>If you answered question ' + (i + 1) + '</b></p>' + planHtml(e.plan) +
          '<p><b>A marker would look for:</b></p><ul>' + e.must.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul>';
      }).join('');
      var part = {
        kind: 'written', label: '', marks: 10, wordLimit: 500, rows: 16,
        prompt: 'Write a mini-essay of up to 500 words answering <b>one</b> of the three questions. Start by noting which one you chose.',
        placeholder: 'Question 2. …', model: model,
        topic: 'Mock test essay', tpl: 'Mock test essay'
      };
      var sectionB = {
        id: 'mock-essay', topic: 'Mock test essay', title: 'Extended response', examLabel: 'Section B',
        marks: 10,
        intro: '<p>Answer <b>one</b> of the following three questions. The marker expects coherent philosophical writing, not a list of bullet points or disconnected statements.</p><ol>' +
          essays.map(function (e) { return '<li style="margin:6px 0">' + e.q + '</li>'; }).join('') + '</ol>',
        data: [], parts: [part], seed: 0
      };
      return [sectionA, sectionB];
    }

    var counts = { mc: 0, hard: 0, essay: 0, sample: 0 };
    TOPICS.forEach(function (t) {
      counts.mc += MCQ[t.key].length;
      counts.hard += HARD[t.key].length;
      counts.essay += ESSAYS[t.key].length;
      ESSAYS[t.key].forEach(function (e) { if (e.sample) counts.sample++; });
    });

    return { templates: TEMPLATES, build: build, buildMock: buildMock, counts: counts };
  }

  global.ARTS3367Kit = { make: make, twoStatements: twoStatements };
})(typeof window !== 'undefined' ? window : globalThis);
