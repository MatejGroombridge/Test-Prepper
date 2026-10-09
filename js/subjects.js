/* subjects.js — registry of practice subjects.
   Load this BEFORE any subject module. Each subject module calls
   Subjects.register({...}) at load time; the app renders whatever is registered,
   so adding a subject means adding one file and one <script> tag.

   A subject definition:
   {
     id:        'math2859',              // storage key, must be stable
     code:      'MATH2859',              // shown in the header
     name:      'Statistics',            // shown in the subject picker
     tagline:   'short line under the title on the practice tab',

     templates: [ {id, topic, title, marks, format?, build(rng)}, ... ],
     build:     function (templateId, seed) -> question | null,

     // optional, sensible defaults supplied below
     fmt:       function (x, dp) -> string,
     tolerance: function (part) -> number,     // numeric marking tolerance
     drillSets: [ {id, label, cards: [{q, a, alt, tag}]} ],
     reference: { title, blurb, fromDrill: 'setId', sections: [{heading, rows}] },
     // per-template teaching panel, shown behind a "How to do this" toggle:
     //   guide: { idea, steps: [...], worked: html, traps: [...],
     //            stepsTitle?, workedTitle?, trapsTitle? }
     drillBlurb: 'line shown on the drill tab',
     // rename buttons: { guide, guideOpen, same }
     labels:    { guide: 'Topic primer', ... },
     // a fixed-format paper instead of "N questions, mixed": build() returns
     // the questions; the question-count and mix fields are then hidden
     mockTest:  { minutes, blurb, build: function () -> [question] }
   }
   Templates that set `format` get a second row of filter chips (e.g. multiple
   choice vs extended response).

   A question returned by build():
   { id, topic, title, marks, seed, intro, data: [block], parts: [part], plot?, examLabel? }
   A data block: { name, text }  or  { name, langs: [{name, text}] }
                 (legacy: { name, matlab, python })
   A part: { kind: numeric|interval|choice|multi|written, label, marks, prompt, ... }
           topic?, tpl?   file the result under a different topic/template
           wordLimit?     written parts: live word count against a limit
*/
(function (global) {
  'use strict';

  var list = [];

  function defaultFmt(x, dp) {
    if (x === undefined || x === null || (typeof x === 'number' && !isFinite(x))) return '—';
    return Number(x).toFixed(dp === undefined ? 4 : dp);
  }

  function defaultTolerance(part) {
    var dp = part.dp === undefined ? 4 : part.dp;
    return Math.max(2e-3 * Math.abs(part.answer), 0.51 * Math.pow(10, -dp));
  }

  /* Normalise a data block so the renderer only deals with one shape. */
  function normaliseBlock(d) {
    if (d.langs && d.langs.length) return d;
    var langs = [];
    if (d.matlab) langs.push({ name: 'MATLAB', text: d.matlab });
    if (d.python) langs.push({ name: 'Python', text: d.python });
    if (!langs.length && d.text) langs.push({ name: '', text: d.text });
    d.langs = langs;
    return d;
  }

  function register(def) {
    if (!def || !def.id) throw new Error('subject needs an id');
    if (get(def.id)) throw new Error('duplicate subject id: ' + def.id);

    def.code = def.code || def.id.toUpperCase();
    def.name = def.name || def.code;
    def.fmt = def.fmt || defaultFmt;
    def.tolerance = def.tolerance || defaultTolerance;
    def.templates = def.templates || [];

    // Legacy shape: commandDrill / conceptDrill become two named sets.
    if (!def.drillSets) {
      def.drillSets = [];
      if (def.commandDrill) def.drillSets.push({ id: 'commands', label: 'Commands', cards: def.commandDrill });
      if (def.conceptDrill) def.drillSets.push({ id: 'concepts', label: 'Definitions & formulas', cards: def.conceptDrill });
    }
    def.drillSets.forEach(function (s) {
      s.cards = (s.cards || []).map(function (c) {
        if (c.alt === undefined && c.py !== undefined) c.alt = c.py;
        return c;
      });
    });

    def.reference = def.reference || {};
    def.reference.title = def.reference.title || 'Reference';
    def.reference.sections = def.reference.sections || [];

    // Wrap build() so every question is normalised and tagged with its subject.
    var rawBuild = def.build;
    def.build = function (templateId, seed) {
      var q = rawBuild.call(def, templateId, seed);
      if (!q) return null;
      q.subject = def.id;
      (q.data || []).forEach(normaliseBlock);
      // carry the template's method guide onto the question, if it has one
      if (!q.guide) {
        for (var i = 0; i < def.templates.length; i++) {
          if (def.templates[i].id === q.id && def.templates[i].guide) {
            q.guide = def.templates[i].guide;
            break;
          }
        }
      }
      return q;
    };

    def.topics = function () {
      var t = [];
      def.templates.forEach(function (tp) { if (t.indexOf(tp.topic) < 0) t.push(tp.topic); });
      return t;
    };

    list.push(def);
    return def;
  }

  function get(id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  global.Subjects = {
    register: register,
    get: get,
    all: function () { return list.slice(); },
    count: function () { return list.length; },
    defaultFmt: defaultFmt,
    defaultTolerance: defaultTolerance
  };
})(typeof window !== 'undefined' ? window : globalThis);

if (typeof module !== 'undefined') module.exports = (typeof window !== 'undefined' ? window : globalThis).Subjects;
