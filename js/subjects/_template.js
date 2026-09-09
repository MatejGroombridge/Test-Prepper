/* subjects/_template.js — copy this to start a new subject.

   Three steps to add a subject:
     1. copy this file to js/subjects/<yourid>.js
     2. add <script src="js/subjects/<yourid>.js"></script> to index.html
        (after subjects.js, before app.js)
     3. fill in TEMPLATES below

   Nothing else changes: the topic filter, mock test, drill, progress tracking
   and reference drawer all build themselves from what you register here.
   This file is NOT loaded by index.html — it is a reference, not a subject.

   ---- part kinds ----------------------------------------------------------
   numeric   { kind:'numeric',  prompt, answer: 12.34, dp: 3, integer?: true,
               traps?: [{value, msg}], hint?, solution? }
   interval  { kind:'interval', prompt, answer: [lo, hi], dp: 4,
               traps?: [{value, msg, which: 0|1}] }
   choice    { kind:'choice',   prompt, options: ['a','b',...], correct: 0 }
   multi     { kind:'multi',    prompt, options: [...], correct: [0,2] }
   written   { kind:'written',  prompt, model: 'model answer',
               checklist?: ['point 1', ...], placeholder?, code? }
   Every part also takes: label ('a)'), marks, prompt (HTML allowed).

   `traps` are the payoff of this format: give the value a common mistake
   produces and the message naming it, and the student gets told which error
   they made rather than just "wrong".
*/
(function (global) {
  'use strict';

  var TEMPLATES = [
    {
      id: 'example',
      topic: 'Example topic',
      title: 'An example question',
      marks: 3,
      /* `rng` is seeded, so the same seed always rebuilds the same question.
         rng.int(lo,hi) rng.uniform(lo,hi) rng.pick(arr) rng.shuffle(arr) rng.normal(mu,sd)
         Return null to reject a bad random draw — the builder retries. */
      build: function (rng) {
        var a = rng.int(2, 9), b = rng.int(2, 9);
        return {
          intro: '<p>A worked scenario goes here, with the numbers ' + a + ' and ' + b + '.</p>',
          data: [
            // { name: 'Data', langs: [{name:'MATLAB', text:'x = [...]'}, {name:'Python', text:'x = [...]'}] }
            // or simply { name: 'Data', text: 'anything copy-pasteable' }
          ],
          parts: [
            {
              kind: 'numeric', label: 'a)', marks: 1,
              prompt: 'What is ' + a + ' × ' + b + '?',
              answer: a * b, dp: 0, integer: true,
              traps: [{ value: a + b, msg: 'You added instead of multiplying.' }],
              hint: 'Multiply the two numbers.',
              solution: a + ' × ' + b + ' = <b>' + (a * b) + '</b>'
            },
            {
              kind: 'choice', label: 'b)', marks: 1,
              prompt: 'Which operation did you just perform?',
              options: ['Multiplication', 'Addition', 'Division'],
              correct: 0,
              solution: 'Multiplication — repeated addition of equal groups.'
            },
            {
              kind: 'written', label: 'c)', marks: 1,
              prompt: 'Explain your reasoning.',
              model: 'A model answer the student self-assesses against.',
              checklist: ['Stated the operation', 'Showed the working']
            }
          ]
        };
      }
    }
  ];

  /* Standard builder: retries a template with fresh seeds when build() returns
     null, then stamps on the bookkeeping the app expects. Copy as-is. */
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

  var SUBJECT = {
    id: 'example',
    code: 'EXAM101',
    name: 'Example Subject',
    tagline: 'Shown under the heading on the practice tab.',
    templates: TEMPLATES,
    build: build,

    drillBlurb: 'Rapid recall for this subject.',
    drillSets: [
      { id: 'facts', label: 'Key facts', cards: [
        { q: 'Front of the card', a: 'Back of the card', tag: 'Group name' },
        { q: 'Another prompt', a: 'Its answer', alt: 'optional second line', altLabel: 'also', tag: 'Group name' }
      ] }
    ],

    reference: {
      title: 'Reference',
      blurb: 'One line describing what is in the drawer.',
      fromDrill: 'facts',                       // auto-lists that drill set, grouped by tag
      sections: [
        { heading: 'Things that cost marks', rows: [['Mistake', 'How to avoid it']] }
      ]
    }
  };

  if (global.Subjects) global.Subjects.register(SUBJECT);
  global.EXAMPLE_SUBJECT = SUBJECT;
})(typeof window !== 'undefined' ? window : globalThis);
