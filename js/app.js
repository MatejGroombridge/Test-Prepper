/* app.js — UI for the practice site. Subject-agnostic: everything it renders
   comes from the subject registry in subjects.js, so `Q` below is whichever
   subject is currently selected. */
(function () {
  'use strict';
  var S = window.Stats;
  var Q = null;              // active subject, set by setSubject()
  var SUBJECT_KEY = 'practice-subject';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };
  var el = function (tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  };
  // a subject may rename a few buttons to suit it (essays have no "numbers")
  var label = function (key, dflt) { return (Q && Q.labels && Q.labels[key]) || dflt; };

  /* ================= persistence ================= */

  /* Progress is stored per subject, so switching subjects never mixes scores. */
  var progress = blank();
  function storeKey() { return 'practice-progress-v2:' + (Q ? Q.id : 'none'); }
  function blank() {
    return { topics: {}, templates: {}, totals: { attempted: 0, correct: 0, marks: 0, marksAvail: 0 }, tests: [] };
  }
  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(storeKey()));
      if (raw && raw.topics && raw.templates) return raw;
      // one-time migration from the single-subject layout
      if (Q && Q.id === 'math2859') {
        var old = JSON.parse(localStorage.getItem('math2859-progress-v1'));
        if (old && old.topics && old.templates) return old;
      }
    } catch (e) { /* fall through */ }
    return blank();
  }
  function save() { try { localStorage.setItem(storeKey(), JSON.stringify(progress)); } catch (e) { /* quota */ } }
  function bump(bucket, key, correct, marks, marksAvail) {
    var b = progress[bucket];
    if (!b[key]) b[key] = { attempted: 0, correct: 0, marks: 0, marksAvail: 0 };
    b[key].attempted++; b[key].marksAvail += marksAvail;
    if (correct) { b[key].correct++; b[key].marks += marks; }
  }
  /* A part may carry its own topic/template (a mock-test section that mixes
     topics), so its result is filed where it belongs. */
  function record(question, part, correct) {
    var m = part.marks || 0;
    bump('topics', part.topic || question.topic, correct, m, m);
    bump('templates', part.tpl || question.id, correct, m, m);
    progress.totals.attempted++; progress.totals.marksAvail += m;
    if (correct) { progress.totals.correct++; progress.totals.marks += m; }
    save();
  }

  /* ================= safe arithmetic input ================= */

  /* Students compute in MATLAB and often paste an expression rather than a
     number. Accept simple arithmetic, but evaluate it ourselves — no eval. */
  function parseNumeric(raw) {
    if (raw === null || raw === undefined) return NaN;
    var s = String(raw).trim().replace(/,/g, '').replace(/\s+/g, '');
    if (!s) return NaN;
    if (!/^[-+*/^().0-9eE]+$/.test(s)) return NaN;
    if (/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s)) return Number(s);
    try { return evalExpr(s); } catch (e) { return NaN; }
  }
  // recursive-descent parser: expr → term → power → unary → atom
  function evalExpr(src) {
    var i = 0;
    function peek() { return src[i]; }
    function expr() {
      var v = term();
      while (peek() === '+' || peek() === '-') { var op = src[i++]; var r = term(); v = op === '+' ? v + r : v - r; }
      return v;
    }
    function term() {
      var v = unary();
      while (peek() === '*' || peek() === '/') { var op = src[i++]; var r = unary(); v = op === '*' ? v * r : v / r; }
      return v;
    }
    function unary() {
      if (peek() === '-') { i++; return -unary(); }
      if (peek() === '+') { i++; return unary(); }
      return power();
    }
    function power() {
      var base = atom();
      if (peek() === '^') { i++; return Math.pow(base, unary()); }
      return base;
    }
    function atom() {
      if (peek() === '(') {
        i++; var v = expr();
        if (src[i] !== ')') throw new Error('paren'); i++;
        return v;
      }
      var m = /^(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?/.exec(src.slice(i));
      if (!m) throw new Error('num');
      i += m[0].length;
      return Number(m[0]);
    }
    var out = expr();
    if (i !== src.length) throw new Error('trailing');
    if (!isFinite(out)) throw new Error('inf');
    return out;
  }

  /* ================= marking ================= */

  function markNumeric(part, value) {
    if (isNaN(value)) return { state: 'empty' };
    var tol = Q.tolerance(part);
    var d = Math.abs(value - part.answer);
    if (part.integer) {
      if (Math.abs(value - Math.round(value)) > 1e-9) return { state: 'bad', note: 'This answer must be a whole number.' };
      if (Math.round(value) === Math.round(part.answer)) return { state: 'ok' };
    } else if (d <= tol) {
      return { state: 'ok' };
    }
    // named diagnosis of a common mistake
    var traps = part.traps || [];
    for (var i = 0; i < traps.length; i++) {
      var ttol = part.integer ? 0.5 : Math.max(3e-3 * Math.abs(traps[i].value), 0.51 * Math.pow(10, -(part.dp === undefined ? 4 : part.dp)));
      if (Math.abs(value - traps[i].value) <= ttol) return { state: 'bad', note: traps[i].msg, trapped: true };
    }
    if (!part.integer && d <= Math.max(0.012 * Math.abs(part.answer), 6 * tol)) {
      return { state: 'near', note: 'Very close — this looks like rounding. Carry full precision through the intermediate steps (do not retype rounded values).' };
    }
    if (!part.integer && Math.abs(value + part.answer) <= tol) return { state: 'bad', note: 'Right magnitude, wrong sign.' };
    return { state: 'bad' };
  }

  function markInterval(part, lo, hi) {
    if (isNaN(lo) || isNaN(hi)) return { state: 'empty' };
    var t0 = Math.max(2e-3 * Math.abs(part.answer[0]), 0.51 * Math.pow(10, -(part.dp || 4)));
    var t1 = Math.max(2e-3 * Math.abs(part.answer[1]), 0.51 * Math.pow(10, -(part.dp || 4)));
    var okLo = Math.abs(lo - part.answer[0]) <= t0, okHi = Math.abs(hi - part.answer[1]) <= t1;
    if (okLo && okHi) return { state: 'ok' };
    if (lo > hi) return { state: 'bad', note: 'Lower and upper endpoints are the wrong way round.' };
    var traps = part.traps || [];
    for (var i = 0; i < traps.length; i++) {
      var w = traps[i].which === undefined ? 0 : traps[i].which;
      var v = w === 0 ? lo : hi;
      if (Math.abs(v - traps[i].value) <= Math.max(4e-3 * Math.abs(traps[i].value), 1e-3)) {
        return { state: 'bad', note: traps[i].msg, trapped: true };
      }
    }
    var w0 = part.answer[1] - part.answer[0], wg = hi - lo;
    if (Math.abs((lo + hi) / 2 - (part.answer[0] + part.answer[1]) / 2) <= Math.max(t0, t1)) {
      if (wg > w0 * 1.08) return { state: 'bad', note: 'Centre is right but the interval is too <b>wide</b> — check the critical value and the standard error.' };
      if (wg < w0 * 0.92) return { state: 'bad', note: 'Centre is right but the interval is too <b>narrow</b> — check the critical value and the standard error.' };
    }
    return { state: 'bad', note: (okLo || okHi) ? 'One endpoint is right and the other is not.' : null };
  }

  function markText(part, raw) {
    if (!raw || !String(raw).trim()) return { state: 'empty' };
    var norm = part.normalise || function (x) { return String(x).trim(); };
    var v;
    try { v = norm(raw); } catch (e) { v = null; }
    if (v === null || v === undefined || v === '') {
      return { state: 'bad', note: 'That could not be read as ' + (part.note || 'a valid answer') + '.' };
    }
    var ok = [part.answer].concat(part.accept || []);
    for (var i = 0; i < ok.length; i++) {
      var target;
      try { target = norm(ok[i]); } catch (e2) { target = ok[i]; }
      if (v === target) return { state: 'ok' };
    }
    var traps = part.traps || [];
    for (var j = 0; j < traps.length; j++) {
      var tv;
      try { tv = norm(traps[j].value); } catch (e3) { tv = traps[j].value; }
      if (v === tv) return { state: 'bad', note: traps[j].msg, trapped: true };
    }
    return { state: 'bad' };
  }

  /* ================= plots ================= */

  function svgScatter(p) {
    var W = 560, H = 300, m = { l: 52, r: 14, t: 12, b: 38 };
    var xs = p.x, ys = p.y;
    var xmin = Math.min.apply(null, xs), xmax = Math.max.apply(null, xs);
    var ymin = Math.min.apply(null, ys), ymax = Math.max.apply(null, ys);
    var padx = (xmax - xmin) * 0.08 || 1, pady = (ymax - ymin) * 0.12 || 1;
    xmin -= padx; xmax += padx; ymin -= pady; ymax += pady;
    var X = function (v) { return m.l + (v - xmin) / (xmax - xmin) * (W - m.l - m.r); };
    var Y = function (v) { return H - m.b - (v - ymin) / (ymax - ymin) * (H - m.t - m.b); };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg">';
    s += '<line class="axis" x1="' + m.l + '" y1="' + (H - m.b) + '" x2="' + (W - m.r) + '" y2="' + (H - m.b) + '"/>';
    s += '<line class="axis" x1="' + m.l + '" y1="' + m.t + '" x2="' + m.l + '" y2="' + (H - m.b) + '"/>';
    var i, tick;
    for (i = 0; i <= 4; i++) {
      tick = xmin + (xmax - xmin) * i / 4;
      s += '<text x="' + X(tick) + '" y="' + (H - m.b + 15) + '" text-anchor="middle">' + Q.fmt(tick, 1) + '</text>';
      tick = ymin + (ymax - ymin) * i / 4;
      s += '<text x="' + (m.l - 7) + '" y="' + (Y(tick) + 3.5) + '" text-anchor="end">' + Q.fmt(tick, 1) + '</text>';
    }
    if (p.b1 !== undefined) {
      s += '<line class="fitline" x1="' + X(xmin) + '" y1="' + Y(p.b0 + p.b1 * xmin) +
        '" x2="' + X(xmax) + '" y2="' + Y(p.b0 + p.b1 * xmax) + '"/>';
    }
    for (i = 0; i < xs.length; i++) s += '<circle class="pt" cx="' + X(xs[i]) + '" cy="' + Y(ys[i]) + '" r="3.6"/>';
    s += '<text x="' + ((W + m.l) / 2) + '" y="' + (H - 4) + '" text-anchor="middle">' + p.xlabel + '</text>';
    s += '<text transform="translate(12,' + ((H - m.b + m.t) / 2) + ') rotate(-90)" text-anchor="middle">' + p.ylabel + '</text>';
    return s + '</svg>';
  }

  function svgBox(p) {
    var W = 560, H = 300, m = { l: 58, r: 14, t: 14, b: 42 };
    var all = [];
    p.groups.forEach(function (g) { all = all.concat(g); });
    var ymin = Math.min.apply(null, all), ymax = Math.max.apply(null, all);
    var pad = (ymax - ymin) * 0.1 || 1; ymin -= pad; ymax += pad;
    var Y = function (v) { return H - m.b - (v - ymin) / (ymax - ymin) * (H - m.t - m.b); };
    var k = p.groups.length, slot = (W - m.l - m.r) / k, bw = Math.min(58, slot * 0.5);
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg">';
    s += '<line class="axis" x1="' + m.l + '" y1="' + m.t + '" x2="' + m.l + '" y2="' + (H - m.b) + '"/>';
    var i;
    for (i = 0; i <= 4; i++) {
      var tv = ymin + (ymax - ymin) * i / 4;
      s += '<text x="' + (m.l - 7) + '" y="' + (Y(tv) + 3.5) + '" text-anchor="end">' + Q.fmt(tv, 2) + '</text>';
    }
    p.groups.forEach(function (g, idx) {
      var cx = m.l + slot * (idx + 0.5);
      var q1 = S.quantile(g, 0.25), q2 = S.quantile(g, 0.5), q3 = S.quantile(g, 0.75);
      var iqr = q3 - q1;
      var lo = Math.min.apply(null, g.filter(function (v) { return v >= q1 - 1.5 * iqr; }));
      var hi = Math.max.apply(null, g.filter(function (v) { return v <= q3 + 1.5 * iqr; }));
      s += '<line class="whisk" x1="' + cx + '" y1="' + Y(lo) + '" x2="' + cx + '" y2="' + Y(hi) + '"/>';
      s += '<line class="whisk" x1="' + (cx - bw / 3) + '" y1="' + Y(lo) + '" x2="' + (cx + bw / 3) + '" y2="' + Y(lo) + '"/>';
      s += '<line class="whisk" x1="' + (cx - bw / 3) + '" y1="' + Y(hi) + '" x2="' + (cx + bw / 3) + '" y2="' + Y(hi) + '"/>';
      s += '<rect class="boxr" x="' + (cx - bw / 2) + '" y="' + Y(q3) + '" width="' + bw + '" height="' + Math.max(1, Y(q1) - Y(q3)) + '"/>';
      s += '<line class="med" x1="' + (cx - bw / 2) + '" y1="' + Y(q2) + '" x2="' + (cx + bw / 2) + '" y2="' + Y(q2) + '"/>';
      g.forEach(function (v) {
        if (v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr) s += '<circle class="pt" cx="' + cx + '" cy="' + Y(v) + '" r="2.8"/>';
      });
      s += '<text x="' + cx + '" y="' + (H - m.b + 16) + '" text-anchor="middle">' + p.names[idx] + '</text>';
    });
    s += '<text transform="translate(12,' + ((H - m.b + m.t) / 2) + ') rotate(-90)" text-anchor="middle">' + p.ylabel + '</text>';
    return s + '</svg>';
  }

  /* ================= question rendering ================= */

  var state = {
    mode: 'practice',
    topics: null,          // Set of enabled topics
    current: null,         // {question, node, results:[]}
    test: null             // {questions, nodes, endsAt, timerId, submitted}
  };

  function allTopics() {
    var t = [];
    Q.templates.forEach(function (tp) { if (t.indexOf(tp.topic) < 0) t.push(tp.topic); });
    return t;
  }

  function renderData(q) {
    var wrap = el('div');
    (q.data || []).forEach(function (d) {
      if (d.table) wrap.appendChild(el('div', '', d.table));
      var langs = d.langs && d.langs.length ? d.langs : [{ name: '', text: d.text || d.matlab || '' }];
      var box = el('div', 'datawrap');
      var top = el('div', 'datatop');
      top.appendChild(el('span', 'lbl', d.name));
      var pre = el('pre', 'code');
      pre.textContent = langs[0].text;
      if (langs.length > 1) {
        var tabs = el('div', 'langtabs');
        var btns = langs.map(function (lg, li) {
          var b = el('button', li === 0 ? 'on' : '', lg.name);
          b.onclick = function () {
            pre.textContent = lg.text;
            btns.forEach(function (x) { x.className = ''; });
            b.className = 'on';
          };
          tabs.appendChild(b);
          return b;
        });
        top.appendChild(tabs);
      }
      top.appendChild(el('div', 'spacer'));
      var copy = el('button', 'btn sm ghost', 'Copy');
      top.appendChild(copy);
      copy.onclick = function () {
        var text = pre.textContent;
        var done = function () { copy.textContent = 'Copied'; setTimeout(function () { copy.textContent = 'Copy'; }, 1200); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text); done(); });
        } else { legacyCopy(text); done(); }
      };
      box.appendChild(top); box.appendChild(pre);
      wrap.appendChild(box);
    });
    if (q.plot) {
      var btn = el('button', 'btn sm', q.plot.type === 'scatter' ? 'Show scatterplot' : 'Show boxplots');
      var host = el('div', 'plotbox hidden');
      btn.onclick = function () {
        if (!host.innerHTML) host.innerHTML = q.plot.type === 'scatter' ? svgScatter(q.plot) : svgBox(q.plot);
        host.classList.toggle('hidden');
        btn.textContent = host.classList.contains('hidden')
          ? (q.plot.type === 'scatter' ? 'Show scatterplot' : 'Show boxplots')
          : 'Hide plot';
      };
      var row = el('div', 'tools');
      row.appendChild(btn);
      row.appendChild(el('span', 'small muted', 'Drawn from the same data — the exam still expects you to produce it in MATLAB.'));
      wrap.appendChild(row);
      wrap.appendChild(host);
    }
    return wrap;
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* Render one part. `opts.exam` hides feedback until the test is submitted. */
  function renderPart(q, part, idx, opts) {
    opts = opts || {};
    var node = el('div', 'part');
    node._part = part;
    var head = el('div', 'plabel');
    head.appendChild(el('b', '', part.label || ''));
    if (part.marks) head.appendChild(el('span', 'marks', '[' + part.marks + ' mark' + (part.marks > 1 ? 's' : '') + ']'));
    node.appendChild(head);
    node.appendChild(el('div', 'prompt', part.prompt));

    var fb = el('div', 'fb hidden');
    var answered = false;

    /* `noRecord` is set when the student revealed an answer they never
       attempted while practising: it should teach, not count against them.
       In a mock test an unattempted part is still a lost mark. */
    function settle(ok, html, cls, noRecord) {
      fb.className = 'fb ' + (cls || (ok ? 'ok' : 'bad'));
      fb.innerHTML = html;
      fb.classList.remove('hidden');
      node.classList.add(ok ? 'done-ok' : 'done-bad');
      if (!answered) {
        answered = true;
        node._correct = !!ok;
        node._skipped = !!noRecord;
        if (!opts.exam && !noRecord) record(q, part, ok);
        if (opts.onAnswer) opts.onAnswer();
        if (node._onSettle) node._onSettle(!!ok);
      }
    }
    node._reveal = function () { /* replaced below per kind */ };

    /* ---- numeric ---- */
    if (part.kind === 'numeric') {
      var row = el('div', 'answerrow');
      var inp = el('input', 'ans');
      node._answerText = function () { return inp.value; };
      inp.type = 'text';
      inp.setAttribute('inputmode', 'decimal');
      inp.placeholder = part.integer ? 'whole number' : Q.fmt(0, part.dp === undefined ? 4 : part.dp);
      row.appendChild(inp);
      row.appendChild(el('span', 'hintdp', part.integer ? 'exact integer' :
        'to at least ' + (part.dp === undefined ? 4 : part.dp) + ' decimal places'));
      node.appendChild(row);

      var check = function () {
        if (answered) return;
        var v = parseNumeric(inp.value);
        var r = markNumeric(part, v);
        if (r.state === 'empty') { inp.focus(); return; }
        inp.readOnly = true;
        if (r.state === 'ok') {
          inp.classList.add('ok');
          settle(true, '<b>Correct.</b> ' + Q.fmt(part.answer, part.integer ? 0 : Math.max(4, part.dp || 4)) +
            (part.solution ? '<div class="sol">' + part.solution + '</div>' : ''));
        } else if (r.state === 'near') {
          inp.classList.add('bad');
          settle(false, '<b>Not quite.</b> ' + r.note + '<br>Correct answer: <b>' +
            Q.fmt(part.answer, part.integer ? 0 : Math.max(4, part.dp || 4)) + '</b>' +
            (part.solution ? '<div class="sol">' + part.solution + '</div>' : ''), 'warn');
        } else {
          inp.classList.add('bad');
          settle(false, '<b>Incorrect.</b> ' + (r.note ? r.note + '<br>' : '') + 'Correct answer: <b>' +
            Q.fmt(part.answer, part.integer ? 0 : Math.max(4, part.dp || 4)) + '</b>' +
            (part.solution ? '<div class="sol">' + part.solution + '</div>' : ''));
        }
      };
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); if (opts.exam) focusNext(node); else check(); }
      });
      node._reveal = function () {
        if (answered) return;
        var v = parseNumeric(inp.value);
        var r = isNaN(v) ? { state: 'empty' } : markNumeric(part, v);
        inp.readOnly = true;
        if (r.state === 'ok') { inp.classList.add('ok'); settle(true, '<b>Correct.</b>' + (part.solution ? '<div class="sol">' + part.solution + '</div>' : '')); }
        else {
          inp.classList.add('bad');
          settle(false, (isNaN(v) ? '<b>Not attempted.</b> ' : '<b>Incorrect.</b> ' + (r.note ? r.note + ' ' : '')) +
            'Correct answer: <b>' + Q.fmt(part.answer, part.integer ? 0 : Math.max(4, part.dp || 4)) + '</b>' +
            (part.solution ? '<div class="sol">' + part.solution + '</div>' : ''),
            null, isNaN(v) && !opts.exam);
        }
      };
      node.appendChild(buildTools(part, node, check, fb, opts));

    /* ---- interval ---- */
    } else if (part.kind === 'interval') {
      var row2 = el('div', 'answerrow');
      var lo = el('input', 'ans'), hi = el('input', 'ans');
      lo.type = hi.type = 'text'; lo.placeholder = 'lower'; hi.placeholder = 'upper';
      lo.style.width = hi.style.width = '150px';
      row2.appendChild(el('span', '', '['));
      row2.appendChild(lo); row2.appendChild(el('span', '', ','));
      row2.appendChild(hi); row2.appendChild(el('span', '', ']'));
      row2.appendChild(el('span', 'hintdp', 'to at least ' + (part.dp || 4) + ' decimal places'));
      node.appendChild(row2);

      var checkI = function () {
        if (answered) return;
        var a = parseNumeric(lo.value), b = parseNumeric(hi.value);
        var r = markInterval(part, a, b);
        if (r.state === 'empty') { (isNaN(a) ? lo : hi).focus(); return; }
        lo.readOnly = hi.readOnly = true;
        var target = '[' + Q.fmt(part.answer[0], Math.max(4, part.dp || 4)) + ', ' + Q.fmt(part.answer[1], Math.max(4, part.dp || 4)) + ']';
        if (r.state === 'ok') {
          lo.classList.add('ok'); hi.classList.add('ok');
          settle(true, '<b>Correct.</b> ' + target + (part.solution ? '<div class="sol">' + part.solution + '</div>' : ''));
        } else {
          lo.classList.add('bad'); hi.classList.add('bad');
          settle(false, '<b>Incorrect.</b> ' + (r.note ? r.note + '<br>' : '') + 'Correct interval: <b>' + target + '</b>' +
            (part.solution ? '<div class="sol">' + part.solution + '</div>' : ''));
        }
      };
      [lo, hi].forEach(function (f) {
        f.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (f === lo) hi.focus();
            else if (opts.exam) focusNext(node);
            else checkI();
          }
        });
      });
      node._reveal = function () {
        if (answered) return;
        var a = parseNumeric(lo.value), b = parseNumeric(hi.value);
        var r = markInterval(part, a, b);
        lo.readOnly = hi.readOnly = true;
        var target = '[' + Q.fmt(part.answer[0], Math.max(4, part.dp || 4)) + ', ' + Q.fmt(part.answer[1], Math.max(4, part.dp || 4)) + ']';
        if (r.state === 'ok') { lo.classList.add('ok'); hi.classList.add('ok'); settle(true, '<b>Correct.</b>' + (part.solution ? '<div class="sol">' + part.solution + '</div>' : '')); }
        else {
          lo.classList.add('bad'); hi.classList.add('bad');
          settle(false, (r.state === 'empty' ? '<b>Not attempted.</b> ' : '<b>Incorrect.</b> ' + (r.note ? r.note + ' ' : '')) +
            'Correct interval: <b>' + target + '</b>' + (part.solution ? '<div class="sol">' + part.solution + '</div>' : ''),
            null, r.state === 'empty' && !opts.exam);
        }
      };
      node.appendChild(buildTools(part, node, checkI, fb, opts));

    /* ---- free text (polynomials, base strings, sequences, fractions) ---- */
    } else if (part.kind === 'text') {
      var rowT = el('div', 'answerrow');
      var inpT = el('input', 'ans wide');
      node._answerText = function () { return inpT.value; };
      inpT.type = 'text';
      inpT.setAttribute('autocapitalize', 'off');
      inpT.setAttribute('autocorrect', 'off');
      inpT.setAttribute('spellcheck', 'false');
      inpT.placeholder = part.placeholder || '';
      rowT.appendChild(inpT);
      if (part.note) rowT.appendChild(el('span', 'hintdp', part.note));
      node.appendChild(rowT);

      var shownAnswer = function () { return part.display || part.answer; };
      var checkT = function () {
        if (answered) return;
        var r = markText(part, inpT.value);
        if (r.state === 'empty') { inpT.focus(); return; }
        inpT.readOnly = true;
        if (r.state === 'ok') {
          inpT.classList.add('ok');
          settle(true, '<b>Correct.</b> ' + shownAnswer() +
            (part.solution ? '<div class="sol">' + part.solution + '</div>' : ''));
        } else {
          inpT.classList.add('bad');
          settle(false, '<b>Incorrect.</b> ' + (r.note ? r.note + '<br>' : '') +
            'Correct answer: <b>' + shownAnswer() + '</b>' +
            (part.solution ? '<div class="sol">' + part.solution + '</div>' : ''));
        }
      };
      inpT.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); if (opts.exam) focusNext(node); else checkT(); }
      });
      node._reveal = function () {
        if (answered) return;
        var r = markText(part, inpT.value);
        inpT.readOnly = true;
        if (r.state === 'ok') {
          inpT.classList.add('ok');
          settle(true, '<b>Correct.</b>' + (part.solution ? '<div class="sol">' + part.solution + '</div>' : ''));
        } else {
          inpT.classList.add('bad');
          settle(false, (r.state === 'empty' ? '<b>Not attempted.</b> ' : '<b>Incorrect.</b> ' + (r.note ? r.note + ' ' : '')) +
            'Correct answer: <b>' + shownAnswer() + '</b>' +
            (part.solution ? '<div class="sol">' + part.solution + '</div>' : ''),
            null, r.state === 'empty' && !opts.exam);
        }
      };
      node.appendChild(buildTools(part, node, checkT, fb, opts));

    /* ---- single choice ---- */
    } else if (part.kind === 'choice') {
      var opts_ = el('div', 'opts');
      var chosen = -1;
      part.options.forEach(function (o, i) {
        var b = el('div', 'opt');
        b.appendChild(el('span', 'key', String(i + 1)));
        b.appendChild(el('div', '', o));
        b.onclick = function () {
          if (answered) return;
          $$('.opt', opts_).forEach(function (x) { x.classList.remove('sel'); });
          b.classList.add('sel'); chosen = i;
          if (!opts.exam) lockChoice();
        };
        opts_.appendChild(b);
      });
      node.appendChild(opts_);
      node._choose = function (i) { if (!answered && i < part.options.length) $$('.opt', opts_)[i].click(); };

      function lockChoice() {
        if (answered || chosen < 0) return;
        var nodes = $$('.opt', opts_);
        nodes.forEach(function (x, i) {
          x.classList.add('locked'); x.classList.remove('sel');
          if (i === part.correct) x.classList.add('correct');
          else if (i === chosen) x.classList.add('wrong');
        });
        var ok = chosen === part.correct;
        settle(ok, '<b>' + (ok ? 'Correct.' : 'Incorrect.') + '</b>' +
          (part.solution ? '<div class="sol">' + part.solution + '</div>' : ''));
      }
      node._reveal = function () {
        if (answered) return;
        var nodes = $$('.opt', opts_);
        nodes.forEach(function (x, i) {
          x.classList.add('locked'); x.classList.remove('sel');
          if (i === part.correct) x.classList.add('correct');
          else if (i === chosen) x.classList.add('wrong');
        });
        var ok = chosen === part.correct;
        settle(ok, '<b>' + (ok ? 'Correct.' : chosen < 0 ? 'Not attempted.' : 'Incorrect.') + '</b>' +
          (part.solution ? '<div class="sol">' + part.solution + '</div>' : ''),
          null, chosen < 0 && !opts.exam);
      };
      if (opts.exam) node.appendChild(buildTools(part, node, null, fb, opts));
      else node.appendChild(buildTools(part, node, lockChoice, fb, opts, true));

    /* ---- multi select ---- */
    } else if (part.kind === 'multi') {
      var optsM = el('div', 'opts');
      var picked = {};
      part.options.forEach(function (o, i) {
        var b = el('div', 'opt');
        b.appendChild(el('span', 'key', String(i + 1)));
        b.appendChild(el('div', '', o));
        b.onclick = function () {
          if (answered) return;
          picked[i] = !picked[i];
          b.classList.toggle('sel', !!picked[i]);
        };
        optsM.appendChild(b);
      });
      node.appendChild(el('div', 'small muted', 'Select all that apply.'));
      node.appendChild(optsM);
      node._choose = function (i) { if (!answered && i < part.options.length) $$('.opt', optsM)[i].click(); };

      var checkM = function (noRecord) {
        if (answered) return;
        var nodes = $$('.opt', optsM), ok = true, missed = 0, wrong = 0;
        nodes.forEach(function (x, i) {
          x.classList.add('locked'); x.classList.remove('sel');
          var should = part.correct.indexOf(i) >= 0, did = !!picked[i];
          if (should) x.classList.add('correct');
          if (did && !should) { x.classList.add('wrong'); wrong++; ok = false; }
          if (!did && should) { missed++; ok = false; }
        });
        var msg = ok ? '<b>Correct — all of them.</b>'
          : '<b>Incorrect.</b> ' + (missed ? 'Missed ' + missed + ' correct option' + (missed > 1 ? 's' : '') : '') +
            (missed && wrong ? ' and ' : '') + (wrong ? 'selected ' + wrong + ' that ' + (wrong > 1 ? 'are' : 'is') + ' not an assumption' : '') + '.';
        settle(ok, msg + (part.solution ? '<div class="sol">' + part.solution + '</div>' : ''), null, noRecord);
      };
      node._reveal = function () { checkM(!Object.keys(picked).some(function (k) { return picked[k]; }) && !opts.exam); };
      node.appendChild(buildTools(part, node, opts.exam ? null : function () { checkM(false); }, fb, opts));

    /* ---- written / code — both self-assessed against a sample answer ---- */
    } else if (part.kind === 'written' || part.kind === 'code') {
      var isCode = part.kind === 'code';
      var ta = el('textarea', 'ans' + (isCode ? ' codearea' : ''));
      /* Code answers start with the boilerplate already typed in, so you edit a
         skeleton instead of retyping it. Prose answers keep a grey hint. */
      var prefill = isCode ? (part.prefill || part.placeholder || '') : '';
      if (prefill) {
        ta.value = prefill;
        node._prefill = prefill;
      } else {
        ta.placeholder = part.placeholder || (isCode ? 'Write your code…' : 'Write your answer…');
      }
      if (isCode) {
        ta.setAttribute('spellcheck', 'false');
        ta.setAttribute('autocapitalize', 'off');
        ta.setAttribute('autocorrect', 'off');
        ta.rows = part.rows || 12;
        if (part.lang) node.appendChild(el('div', 'langtag', part.lang));
        // Tab indents rather than moving focus, so code is actually writable
        ta.addEventListener('keydown', function (ev) {
          if (ev.key === 'Tab') {
            ev.preventDefault();
            var st = ta.selectionStart, en = ta.selectionEnd;
            ta.value = ta.value.slice(0, st) + '    ' + ta.value.slice(en);
            ta.selectionStart = ta.selectionEnd = st + 4;
          }
        });
      }
      if (part.rows && !isCode) ta.rows = part.rows;
      node.appendChild(ta);
      node._answerText = function () { return ta.value; };
      if (part.wordLimit) {
        var wc = el('div', 'wordcount');
        var countWords = function () {
          var n = (ta.value.match(/\S+/g) || []).length;
          wc.textContent = n + ' / ' + part.wordLimit + ' words';
          wc.classList.toggle('over', n > part.wordLimit);
        };
        ta.addEventListener('input', countWords);
        countWords();
        node.appendChild(wc);
      }
      var attempted = function () {
        var v = ta.value.trim();
        return !!v && !(node._prefill && v === node._prefill.trim());
      };
      var showModel = function (selfOk) {
        if (answered) return;
        ta.readOnly = true;
        var label = isCode ? 'Sample answer' : 'Model answer';
        var body = isCode ? '<pre class="sample">' + esc(part.model) + '</pre>'
                          : '<div class="sol">' + part.model + '</div>';
        var html = '<b>' + label + '</b>' + body;
        if (part.notes) html += '<div class="sol small">' + part.notes + '</div>';
        if (part.checklist) {
          html += '<div class="small" style="margin-top:8px"><b>Did your answer cover:</b><ul class="checklist">' +
            part.checklist.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul></div>';
        }
        if (part.code) html += '<div class="sol"><code>' + part.code + '</code></div>';
        if (selfOk === undefined) {
          fb.className = 'fb info'; fb.innerHTML = html;
          fb.classList.remove('hidden');
          var rate = el('div', 'tools');
          var g = el('button', 'btn sm', 'I covered it'), b2 = el('button', 'btn sm', 'I missed things');
          g.onclick = function () { rate.remove(); settle(true, html + '<div class="small muted" style="margin-top:6px">Marked as covered.</div>'); };
          b2.onclick = function () { rate.remove(); settle(false, html + '<div class="small muted" style="margin-top:6px">Marked as missed — this will show up in your progress.</div>'); };
          rate.appendChild(el('span', 'small muted', 'Self-assess:'));
          rate.appendChild(g); rate.appendChild(b2);
          fb.appendChild(rate);
        } else settle(selfOk, html);
      };
      /* Prose and code cannot be auto-marked. In a mock test an attempted answer
         is handed back for self-assessment after submitting; a blank one is a
         lost mark. */
      node._reveal = function () {
        if (answered) return;
        if (opts.exam && attempted()) { node._pending = true; showModel(undefined); }
        else showModel(opts.exam ? false : undefined);
      };
      node.appendChild(buildTools(part, node, showModel, fb, opts, false,
        isCode ? 'Show sample answer' : 'Show model answer'));
    }

    node.appendChild(fb);
    return node;
  }

  function buildTools(part, node, checkFn, fb, opts, autoLock, checkLabel) {
    var tools = el('div', 'tools');
    if (checkFn && !opts.exam) {
      if (!autoLock) {
        var c = el('button', 'btn primary sm', checkLabel || 'Check');
        c.onclick = function () { checkFn(); };
        tools.appendChild(c);
      }
    }
    if (part.hint && !opts.exam) {
      var h = el('button', 'btn sm ghost', 'Hint');
      h.onclick = function () {
        h.disabled = true;
        var hd = el('div', 'fb warn', '<b>Hint.</b> ' + part.hint);
        node.insertBefore(hd, fb);
      };
      tools.appendChild(h);
    }
    // written/code parts already reveal the sample via their own button
    if (!opts.exam && node._reveal && part.kind !== 'written' && part.kind !== 'code') {
      var r = el('button', 'btn sm ghost', 'Show answer');
      r.onclick = function () { node._reveal(); };
      tools.appendChild(r);
    }
    return tools;
  }

  function focusNext(node) {
    var inputs = $$('input.ans, textarea.ans').filter(function (i) { return !i.readOnly; });
    var idx = inputs.indexOf(document.activeElement);
    if (idx >= 0 && idx < inputs.length - 1) inputs[idx + 1].focus();
  }

  function guidePanel(g) {
    var html = '';
    if (g.idea) html += '<p class="g-idea">' + g.idea + '</p>';
    if (g.steps && g.steps.length) {
      html += '<h4>' + (g.stepsTitle || 'The method') + '</h4><ol class="g-steps">' +
        g.steps.map(function (s2) { return '<li>' + s2 + '</li>'; }).join('') + '</ol>';
    }
    if (g.worked) html += '<h4>' + (g.workedTitle || 'Worked example') + '</h4><div class="g-worked">' + g.worked + '</div>';
    if (g.traps && g.traps.length) {
      html += '<h4>' + (g.trapsTitle || 'Where marks get lost') + '</h4><ul class="g-traps">' +
        g.traps.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>';
    }
    return html;
  }

  function plainText(html) {
    var d = document.createElement('div');
    d.innerHTML = html;
    d.querySelectorAll('sub').forEach(function (n) { n.textContent = '_' + n.textContent; });
    d.querySelectorAll('sup').forEach(function (n) { n.textContent = '^' + n.textContent; });
    return (d.innerText || d.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
  }

  /* Build a self-contained prompt: the question, the data, and whatever the
     student has typed so far — so an AI can give a hint on THEIR attempt
     rather than answering from scratch. */
  function buildAIPrompt(q, card) {
    var L = [];
    L.push('I am studying ' + (Q.code || '') + (Q.name ? ' (' + Q.name + ')' : '') +
      ' and working through this exam-style question.');
    L.push('Please give me a hint that gets me unstuck — point out what is wrong or what to try next.');
    L.push('Do not just give me the finished answer unless I ask for it.');
    L.push('');
    L.push('=== QUESTION: ' + q.title + ' ===');
    L.push(plainText(q.intro));
    (q.data || []).forEach(function (d) {
      var lang = d.langs && d.langs[0];
      if (lang && lang.text) {
        L.push('');
        L.push('--- ' + (d.name || 'Data') + ' ---');
        L.push(lang.text);
      }
      if (d.table) { L.push(''); L.push(plainText(d.table)); }
    });
    var nodes = card._partNodes || [];
    nodes.forEach(function (n) {
      var p = n._part;
      L.push('');
      L.push('--- ' + (p.label || 'Part') + (p.marks ? ' [' + p.marks + ' marks]' : '') + ' ---');
      L.push(plainText(p.prompt));
      if (p.kind === 'choice' || p.kind === 'multi') {
        p.options.forEach(function (o, i) { L.push('  ' + (i + 1) + '. ' + plainText(o)); });
      }
      var mine = n._answerText ? n._answerText() : '';
      var untouched = n._prefill && mine.trim() === n._prefill.trim();
      L.push('');
      L.push('My answer so far:');
      L.push((mine && mine.trim() && !untouched) ? mine : '(nothing yet)');
    });
    return L.join('\n');
  }

  function copyText(text, btn, okLabel) {
    var done = function () {
      var old = btn.textContent;
      btn.textContent = okLabel || 'Copied';
      btn.classList.add('on');
      setTimeout(function () { btn.textContent = old; btn.classList.remove('on'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text); done(); });
    } else { legacyCopy(text); done(); }
  }

  function renderQuestion(q, opts) {
    opts = opts || {};
    var card = el('div', 'card');
    var head = el('div', 'qhead');
    head.appendChild(el('h2', '', q.title));
    head.appendChild(el('span', 'pill', q.topic));
    head.appendChild(el('span', 'pill grey', q.marks + (q.marks === 1 ? ' mark' : ' marks')));
    card.appendChild(head);
    /* The method guide is teaching material, so it is hidden during a mock test
       for the same reason hints are. */
    var spacerAdded = false;
    if (q.guide && !opts.exam) {
      var gBtn = el('button', 'btn sm ghost guidebtn', label('guide', 'How to do this'));
      var gBox = el('div', 'guidebox hidden');
      gBox.innerHTML = guidePanel(q.guide);
      gBtn.onclick = function () {
        var open = gBox.classList.toggle('hidden');
        gBtn.textContent = open ? label('guide', 'How to do this') : label('guideOpen', 'Hide method');
        gBtn.classList.toggle('on', !open);
      };
      head.appendChild(el('div', 'spacer'));
      head.appendChild(gBtn);
      card.appendChild(gBox);
      spacerAdded = true;
    }
    if (!opts.exam) {
      if (!spacerAdded) head.appendChild(el('div', 'spacer'));
      var aiBtn = el('button', 'btn sm ghost aibtn', 'Copy for AI hint');
      aiBtn.title = 'Copies the question and your working, ready to paste into a chat';
      aiBtn.onclick = function () { copyText(buildAIPrompt(q, card), aiBtn, 'Copied — paste it in'); };
      head.appendChild(aiBtn);
    }
    card.appendChild(el('div', 'intro', q.intro));
    card.appendChild(renderData(q));
    var partNodes = [];
    q.parts.forEach(function (p, i) {
      var n = renderPart(q, p, i, opts);
      partNodes.push(n);
      card.appendChild(n);
    });
    card._question = q;
    card._partNodes = partNodes;
    return card;
  }

  /* ================= practice mode ================= */

  function enabledTemplates() {
    return Q.templates.filter(function (t) {
      return (!state.topics || state.topics[t.topic]) &&
        (!state.formats || !t.format || state.formats[t.format]);
    });
  }

  function newQuestion(sameTemplate) {
    var pool = enabledTemplates();
    if (!pool.length) pool = Q.templates;
    var tplId;
    if (sameTemplate && state.current) tplId = state.current.question.id;
    else tplId = pool[Math.floor(Math.random() * pool.length)].id;
    var q = Q.build(tplId, Math.floor(Math.random() * 1e9));
    if (!q) { q = Q.build(pool[0].id, Math.floor(Math.random() * 1e9)); }
    var host = $('#qhost');
    host.innerHTML = '';
    var card = renderQuestion(q, { onAnswer: updateFoot });
    host.appendChild(card);
    state.current = { question: q, card: card };
    updateFoot();
    $('#footbar').classList.remove('hidden');
    $('#footTools').innerHTML = '';
    var revealAll = el('button', 'btn sm ghost', 'Reveal all answers');
    revealAll.onclick = function () {
      card._partNodes.forEach(function (n) { if (n._reveal) n._reveal(); });
      updateFoot();
    };
    var again = el('button', 'btn sm', label('same', 'Same type, new numbers'));
    again.onclick = function () { newQuestion(true); };
    var next = el('button', 'btn primary sm', 'Next question');
    next.onclick = function () { newQuestion(false); };
    $('#footTools').appendChild(revealAll);
    $('#footTools').appendChild(again);
    $('#footTools').appendChild(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateFoot() {
    if (!state.current) return;
    var nodes = state.current.card._partNodes;
    var done = 0, ok = 0, marks = 0, avail = 0;
    nodes.forEach(function (n) {
      avail += n._part.marks || 0;
      if (n._correct !== undefined) { done++; if (n._correct) { ok++; marks += n._part.marks || 0; } }
    });
    $('#footScore').innerHTML = 'This question: <b>' + ok + '/' + done + '</b> parts correct' +
      (done ? ' · <b>' + marks + '/' + avail + '</b> marks' : '') +
      ' · <span class="muted">' + (nodes.length - done) + ' unanswered</span>';
  }

  /* ================= mock test ================= */

  function weakestOrder() {
    return Q.templates.slice().sort(function (a, b) {
      var pa = progress.templates[a.id], pb = progress.templates[b.id];
      var ra = pa && pa.attempted ? pa.correct / pa.attempted : -1;
      var rb = pb && pb.attempted ? pb.correct / pb.attempted : -1;
      return ra - rb;
    });
  }

  function fixedFormatTest() { return !!(Q.mockTest && Q.mockTest.build); }

  function startTest() {
    var mins = Math.max(5, Math.min(180, parseInt($('#testMins').value, 10) || 45));
    var questions;
    if (fixedFormatTest()) {
      // the subject assembles a paper in the exact shape of its real test
      questions = Q.mockTest.build().filter(Boolean);
    } else {
      var n = Math.max(2, Math.min(8, parseInt($('#testQs').value, 10) || 4));
      var mix = $('#testMix').value;
      var pool;
      if (mix === 'weak') pool = weakestOrder();
      else pool = Q.templates.slice().sort(function () { return Math.random() - 0.5; });
      if (mix === 'balanced') {
        // one per topic first, then fill
        var seen = {}, first = [], rest = [];
        pool.forEach(function (t) { if (!seen[t.topic]) { seen[t.topic] = 1; first.push(t); } else rest.push(t); });
        pool = first.concat(rest);
      }
      var chosen = [];
      for (var i = 0; i < n; i++) chosen.push(pool[i % pool.length]);
      questions = chosen.map(function (t) { return Q.build(t.id, Math.floor(Math.random() * 1e9)); }).filter(Boolean);
    }

    $('#testSetup').classList.add('hidden');
    var host = $('#testHost');
    host.innerHTML = '';
    var cards = questions.map(function (q, i) {
      var c = renderQuestion(q, { exam: true });
      var h = $('.qhead', c);
      h.insertBefore(el('span', 'pill', q.examLabel || 'Question ' + (i + 1)), h.firstChild);
      host.appendChild(c);
      return c;
    });
    state.test = { questions: questions, cards: cards, endsAt: Date.now() + mins * 60000, submitted: false };
    $('#timer').classList.remove('hidden');
    tick();
    state.test.timerId = setInterval(tick, 1000);
    $('#footbar').classList.remove('hidden');
    $('#footScore').innerHTML = 'Mock test in progress · <span class="muted">feedback is hidden until you submit</span>';
    $('#footTools').innerHTML = '';
    var sub = el('button', 'btn primary sm', 'Submit test');
    sub.onclick = submitTest;
    $('#footTools').appendChild(sub);
    window.scrollTo({ top: 0 });
  }

  function tick() {
    if (!state.test || state.test.submitted) return;
    var left = Math.max(0, state.test.endsAt - Date.now());
    var m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
    var t = $('#timer');
    t.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    t.classList.toggle('low', left < 120000);
    if (left <= 0) submitTest();
  }

  function submitTest() {
    if (!state.test || state.test.submitted) return;
    var t = state.test;
    t.submitted = true;
    clearInterval(t.timerId);
    var sc = { ok: 0, parts: 0, marks: 0, avail: 0, pending: 0 };
    var entry = { when: Date.now(), marks: 0, avail: 0 };
    var summaryBody = el('div');
    var paintSummary = function () {
      var pct = sc.avail ? Math.round(sc.marks / sc.avail * 100) : 0;
      summaryBody.innerHTML = '<div class="statgrid" style="margin-top:12px">' +
        '<div class="stat"><div class="n">' + sc.marks + '/' + sc.avail + '</div><div class="k">marks</div></div>' +
        '<div class="stat"><div class="n">' + pct + '%</div><div class="k">score</div></div>' +
        '<div class="stat"><div class="n">' + sc.ok + '/' + sc.parts + '</div><div class="k">parts correct</div></div>' +
        '</div><p class="small muted" style="margin-top:12px">' +
        (sc.pending
          ? '<b>' + sc.pending + ' written answer' + (sc.pending > 1 ? 's' : '') + ' still to self-assess</b> against the model answer below — the score updates as you mark ' + (sc.pending > 1 ? 'them' : 'it') + '.'
          : 'Full worked solutions are now shown against every part below.') + '</p>';
      $('#footScore').innerHTML = 'Submitted · <b>' + sc.marks + '/' + sc.avail + '</b> marks (' + pct + '%)' +
        (sc.pending ? ' · <span class="muted">' + sc.pending + ' to self-assess</span>' : '');
      entry.marks = sc.marks;
    };
    t.cards.forEach(function (card) {
      var q = card._question;
      card._partNodes.forEach(function (n) {
        if (n._reveal) n._reveal();
        sc.parts++;
        sc.avail += n._part.marks || 0;
        if (n._pending) {
          // written answer: scored once the student self-assesses it
          sc.pending++;
          n._onSettle = function (ok) {
            n._pending = false;
            sc.pending--;
            if (ok) { sc.ok++; sc.marks += n._part.marks || 0; }
            record(q, n._part, ok);
            paintSummary();
            save();
          };
          return;
        }
        if (n._correct) { sc.ok++; sc.marks += n._part.marks || 0; }
        record(q, n._part, !!n._correct);
      });
      card.classList.add('review');
    });
    entry.avail = sc.avail;
    progress.tests.push(entry);
    var summary = el('div', 'card');
    summary.innerHTML = '<h1 class="page">Test complete</h1>';
    summary.appendChild(summaryBody);
    paintSummary();
    save();
    var again = el('button', 'btn primary sm', 'New test');
    again.onclick = function () {
      $('#testHost').innerHTML = '';
      $('#testSetup').classList.remove('hidden');
      $('#timer').classList.add('hidden');
      state.test = null;
      $('#footbar').classList.add('hidden');
    };
    var tools = el('div', 'tools'); tools.appendChild(again);
    summary.appendChild(tools);
    $('#testHost').insertBefore(summary, $('#testHost').firstChild);
    $('#timer').classList.add('hidden');
    $('#footTools').innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ================= drill ================= */

  var drill = { queue: [], current: null, flipped: false, sets: {} };

  function drillPool() {
    var pool = [];
    (Q.drillSets || []).forEach(function (set) {
      if (drill.sets[set.id]) pool = pool.concat(set.cards);
    });
    return pool;
  }
  function initDrill() {
    drill.sets = {}; drill.queue = []; drill.current = null; drill.flipped = false;
    var host = $('#drillChips');
    host.innerHTML = '';
    (Q.drillSets || []).forEach(function (set) {
      drill.sets[set.id] = true;
      var c = el('button', 'chip on', set.label);
      c.onclick = function () {
        drill.sets[set.id] = !drill.sets[set.id];
        c.classList.toggle('on', drill.sets[set.id]);
        drill.queue = []; nextDrill();
      };
      host.appendChild(c);
    });
    $('#drillBlurb').textContent = (Q.drillBlurb || 'Rapid recall.') +
      ' Space to flip, 1 got it, 2 missed it.';
  }
  function nextDrill() {
    if (!drill.queue.length) {
      drill.queue = drillPool().sort(function () { return Math.random() - 0.5; });
    }
    drill.current = drill.queue.pop();
    drill.flipped = false;
    paintDrill();
  }
  function paintDrill() {
    var c = $('#drillCard');
    if (!drill.current) { c.innerHTML = '<p class="muted">Select at least one set above.</p>'; return; }
    var d = drill.current;
    var html = '<div class="small muted">' + d.tag + '</div><div class="drillq">' + d.q + '</div>';
    if (drill.flipped) {
      html += '<div class="drilla">' + d.a + '</div>';
      if (d.alt) html += '<div class="drillpy">' + (d.altLabel || 'Python') + ': ' + d.alt + '</div>';
      html += '<div class="tools" style="justify-content:center;margin-top:20px">' +
        '<button class="btn" id="dGot">1 · Got it</button>' +
        '<button class="btn" id="dMiss">2 · Missed it</button></div>';
    } else {
      html += '<div class="tools" style="justify-content:center"><button class="btn primary" id="dFlip">Show answer <kbd>space</kbd></button></div>';
    }
    c.innerHTML = html;
    if (drill.flipped) {
      $('#dGot').onclick = function () { drillScore(true); };
      $('#dMiss').onclick = function () { drillScore(false); };
    } else $('#dFlip').onclick = function () { drill.flipped = true; paintDrill(); };
  }
  function drillScore(ok) {
    bump('topics', 'Recall drill', ok, ok ? 1 : 0, 1);
    progress.totals.attempted++; progress.totals.marksAvail += 1;
    if (ok) { progress.totals.correct++; progress.totals.marks += 1; }
    else drill.queue.unshift(drill.current);   // missed cards come back
    save();
    nextDrill();
  }

  /* ================= stats ================= */

  function paintStats() {
    var t = progress.totals;
    var pct = t.attempted ? Math.round(t.correct / t.attempted * 100) : 0;
    $('#statTop').innerHTML =
      '<div class="stat"><div class="n">' + t.attempted + '</div><div class="k">parts attempted</div></div>' +
      '<div class="stat"><div class="n">' + pct + '%</div><div class="k">accuracy</div></div>' +
      '<div class="stat"><div class="n">' + t.marks + '</div><div class="k">marks earned</div></div>' +
      '<div class="stat"><div class="n">' + progress.tests.length + '</div><div class="k">mock tests</div></div>';

    function bars(bucket, nameFn, host) {
      var keys = Object.keys(progress[bucket]);
      if (!keys.length) { $(host).innerHTML = '<p class="muted small">Nothing recorded yet.</p>'; return; }
      keys.sort(function (a, b) {
        return (progress[bucket][a].correct / progress[bucket][a].attempted) -
               (progress[bucket][b].correct / progress[bucket][b].attempted);
      });
      $(host).innerHTML = keys.map(function (k) {
        var v = progress[bucket][k], r = v.attempted ? v.correct / v.attempted : 0;
        var cls = r >= 0.8 ? 'good' : r < 0.55 ? 'poor' : '';
        return '<div class="barrow"><div class="nm">' + nameFn(k) + '</div>' +
          '<div class="track"><div class="fill ' + cls + '" style="width:' + Math.round(r * 100) + '%"></div></div>' +
          '<div class="pc">' + Math.round(r * 100) + '% (' + v.correct + '/' + v.attempted + ')</div></div>';
      }).join('');
    }
    bars('topics', function (k) { return k; }, '#statTopics');
    bars('templates', function (k) {
      for (var i = 0; i < Q.templates.length; i++) if (Q.templates[i].id === k) return Q.templates[i].title;
      return k;
    }, '#statTemplates');
  }

  /* ================= reference drawer ================= */

  function paintCheat() {
    var ref = Q.reference || {};
    $('#cheatTitle').textContent = ref.title || 'Reference';
    $('#cheatBlurb').textContent = ref.blurb || '';
    var html = '';
    var src = (Q.drillSets || []).filter(function (s2) { return s2.id === ref.fromDrill; })[0];
    if (src) {
      var groups = {};
      src.cards.forEach(function (d) { (groups[d.tag] = groups[d.tag] || []).push(d); });
      Object.keys(groups).forEach(function (tag) {
        html += '<h3>' + tag + '</h3>';
        groups[tag].forEach(function (d) {
          html += '<div class="cheatrow"><div class="c-q">' + d.q + '</div><div class="c-a">' + d.a +
            (d.alt ? '<span class="muted">  ·  ' + (d.altLabel || 'py') + ': ' + d.alt + '</span>' : '') + '</div></div>';
        });
      });
    }
    (ref.sections || []).forEach(function (sec) {
      html += '<h3>' + sec.heading + '</h3>';
      sec.rows.forEach(function (r) {
        html += '<div class="cheatrow"><div class="c-q">' + r[0] + '</div><div class="c-a">' + r[1] + '</div></div>';
      });
    });
    $('#cheatBody').innerHTML = html;
  }


  /* ================= subjects ================= */

  function subjectOrder() {
    var all = window.Subjects.all();
    return all;
  }

  var defaultTestBlurb = null;

  function setSubject(id, opts) {
    opts = opts || {};
    var next = window.Subjects.get(id) || subjectOrder()[0];
    if (!next) return;
    if (Q && Q.id === next.id && !opts.force) return;
    Q = next;
    try { localStorage.setItem(SUBJECT_KEY, Q.id); } catch (e) { /* private mode */ }
    progress = load();

    // tear down anything belonging to the previous subject
    if (state.test && state.test.timerId) clearInterval(state.test.timerId);
    state.test = null;
    state.current = null;
    $('#qhost').innerHTML = '';
    $('#testHost').innerHTML = '';
    $('#testSetup').classList.remove('hidden');
    $('#timer').classList.add('hidden');
    $('#footbar').classList.add('hidden');

    $('#brandCode').textContent = Q.code;
    $('#practiceBlurb').textContent = Q.tagline || '';
    $('#sameQ').textContent = label('same', 'Same type, new numbers');
    $('#sameQ').title = label('same', 'Same question type, new numbers');
    document.title = Q.code + ' Practice';

    // a subject with a fixed test format builds its own paper
    var fixed = fixedFormatTest();
    if (defaultTestBlurb === null) defaultTestBlurb = $('#testBlurb').innerHTML;
    $('#testBlurb').innerHTML = (fixed && Q.mockTest.blurb) || defaultTestBlurb;
    $('#testQsWrap').classList.toggle('hidden', fixed);
    $('#testMixWrap').classList.toggle('hidden', fixed);
    $('#testMins').value = (Q.mockTest && Q.mockTest.minutes) || 45;
    $$('#subjectPicker option').forEach(function (o) { o.selected = o.value === Q.id; });

    initTopics();
    initDrill();
    paintCheat();
    if (state.mode === 'stats') paintStats();
    if (state.mode === 'drill') nextDrill();
    if (state.mode === 'practice') newQuestion(false);
  }

  function initSubjectPicker() {
    var all = subjectOrder();
    var sel = $('#subjectPicker');
    sel.innerHTML = '';
    all.forEach(function (sub) {
      var o = document.createElement('option');
      o.value = sub.id;
      o.textContent = sub.code + ' · ' + sub.name;
      sel.appendChild(o);
    });
    // With a single subject the picker is noise; keep the code in the header only.
    $('#subjectWrap').classList.toggle('hidden', all.length < 2);
    sel.onchange = function () { setSubject(sel.value); };
  }

  /* ================= mode switching ================= */

  function setMode(m) {
    state.mode = m;
    $$('#tabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.mode === m); });
    ['practice', 'test', 'drill', 'stats'].forEach(function (v) {
      $('#view-' + v).classList.toggle('hidden', v !== m);
    });
    $('#footbar').classList.toggle('hidden',
      !(m === 'practice' && state.current) && !(m === 'test' && state.test));
    if (m === 'stats') paintStats();
    if (m === 'drill' && !drill.current) nextDrill();
  }

  /* ================= init ================= */

  /* One toggle chip per name; at least one chip in a row always stays on. */
  function chipRow(host, names, store) {
    names.forEach(function (t) {
      store[t] = true;
      var c = el('button', 'chip on', t);
      c.onclick = function () {
        store[t] = !store[t];
        c.classList.toggle('on', store[t]);
        if (!Object.keys(store).some(function (k) { return store[k]; })) {
          store[t] = true; c.classList.add('on');
        }
      };
      host.appendChild(c);
    });
  }

  function initTopics() {
    var host = $('#topicChips');
    host.innerHTML = '';
    state.topics = {};
    chipRow(host, allTopics(), state.topics);

    // a second row when the subject tags its templates with a format
    var formats = [];
    Q.templates.forEach(function (tp) { if (tp.format && formats.indexOf(tp.format) < 0) formats.push(tp.format); });
    var fhost = $('#formatChips');
    fhost.innerHTML = '';
    state.formats = null;
    fhost.classList.toggle('hidden', formats.length < 2);
    if (formats.length >= 2) {
      state.formats = {};
      fhost.appendChild(el('span', 'chiplbl', 'Format'));
      chipRow(fhost, formats, state.formats);
    }
  }

  function init() {
    if (!window.Subjects || !window.Subjects.count()) {
      document.body.innerHTML = '<p style="padding:40px;font:16px system-ui">No subjects are registered. ' +
        'Add a subject module and include it in index.html.</p>';
      return;
    }
    initSubjectPicker();

    $$('#tabs button').forEach(function (b) { b.onclick = function () { setMode(b.dataset.mode); }; });
    $('#newQ').onclick = function () { newQuestion(false); };
    $('#sameQ').onclick = function () { newQuestion(true); };
    $('#startTest').onclick = startTest;
    $('#resetStats').onclick = function () {
      if (confirm('Erase all recorded progress for ' + Q.code + '? Other subjects are not affected.')) {
        progress = blank();
        save(); paintStats();
      }
    };

    var openDrawer = function (on) {
      $('#drawer').classList.toggle('open', on);
      $('#scrim').classList.toggle('open', on);
    };
    $('#cheatBtn').onclick = function () { openDrawer(!$('#drawer').classList.contains('open')); };
    $('#closeDrawer').onclick = function () { openDrawer(false); };
    $('#scrim').onclick = function () { openDrawer(false); };

    var theme = localStorage.getItem('practice-theme') || localStorage.getItem('math2859-theme') || 'light';
    document.documentElement.dataset.theme = theme;
    $('#themeBtn').onclick = function () {
      var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('practice-theme', next);
    };

    document.addEventListener('keydown', function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if (e.key === '?' && !typing) { e.preventDefault(); openDrawer(true); return; }
      if (e.key === 'Escape') { openDrawer(false); return; }
      if (typing) return;
      if (state.mode === 'drill') {
        if (e.key === ' ') { e.preventDefault(); if (!drill.flipped) { drill.flipped = true; paintDrill(); } }
        else if (e.key === '1' && drill.flipped) drillScore(true);
        else if (e.key === '2' && drill.flipped) drillScore(false);
        return;
      }
      if (state.mode === 'practice') {
        if (e.key === 'n') { e.preventDefault(); newQuestion(false); return; }
        if (e.key === 'c' && !e.metaKey && !e.ctrlKey) {
          var ab = $('.aibtn');
          if (ab) { e.preventDefault(); ab.click(); }
          return;
        }
        if (e.key === 'g') {
          var gb = $('.guidebtn');
          if (gb) { e.preventDefault(); gb.click(); gb.scrollIntoView({ block: 'nearest' }); }
          return;
        }
        if (/^[1-9]$/.test(e.key)) {
          // Apply to the unanswered choice part the reader is actually looking
          // at: prefer one on screen, and fall back to the first one below.
          var cands = $$('.part').filter(function (n) { return n._choose && n._correct === undefined; });
          var target = cands.filter(function (n) {
            var r = n.getBoundingClientRect();
            return r.bottom > 70 && r.top < window.innerHeight - 60;
          })[0] || cands.filter(function (n) { return n.getBoundingClientRect().top >= 0; })[0] || cands[0];
          if (target) {
            e.preventDefault();
            target._choose(parseInt(e.key, 10) - 1);
            target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
      }
    });

    var stored = null;
    try { stored = localStorage.getItem(SUBJECT_KEY); } catch (e) { /* private mode */ }
    setSubject(stored || subjectOrder()[0].id, { force: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
