/* subjects/math2400.js — MATH2400 Finite Mathematics.
   Every answer is computed exactly by finite.js, so questions regenerate with
   fresh numbers and still mark correctly. Answers that are not plain numbers
   (polynomials, base expansions, continued fractions, fractions, code words)
   use the `text` part kind with the normalisers below, so any reasonable way of
   writing the same thing is accepted. */
(function (global) {
  'use strict';
  var F = global.Finite;

  /* ================= answer normalisers ================= */

  function clean(s) {
    return String(s).toLowerCase()
      .replace(/<sup>\s*(-?\d+)\s*<\/sup>/g, '^$1')   // pasted superscript markup
      .replace(/<sub>.*?<\/sub>/g, '').replace(/<[^>]*>/g, '')
      .replace(/−/g, '-')          // unicode minus
      .replace(/[²]/g, '^2').replace(/[³]/g, '^3')
      .replace(/\s+/g, '');
  }

  /* Polynomial in x over Z_p, given as text, canonicalised to "a,b,c" of
     coefficients low->high. Accepts x^2+x+1, 1+x+x², 2x^3 - x, X**2+X+1, … */
  function makePolyNorm(p) {
    return function (s) {
      var t = clean(s).replace(/\*\*/g, '^').replace(/\*/g, '')
        .replace(/α/g, 'x').replace(/\ba\b/g, 'x').replace(/a/g, 'x');
      if (t === '') return null;
      if (/^[01]$/.test(t) && p > 0) { /* fall through to parser */ }
      t = t.replace(/-/g, '+-');
      var terms = t.split('+').filter(function (x) { return x !== ''; });
      var co = [];
      for (var i = 0; i < terms.length; i++) {
        var m = /^(-?)(\d*)(x(\^(\d+))?)?$/.exec(terms[i]);
        if (!m) return null;
        if (!m[3] && m[2] === '') return null;            // stray sign
        var sign = m[1] === '-' ? -1 : 1;
        var mag = m[2] === '' ? 1 : parseInt(m[2], 10);
        var deg = m[3] ? (m[5] === undefined ? 1 : parseInt(m[5], 10)) : 0;
        if (deg > 64) return null;
        while (co.length <= deg) co.push(0);
        co[deg] += sign * mag;
      }
      var red = F.pMod(co, p);
      return red.length ? red.join(',') : '0';
    };
  }

  /* Exact rational: "13/30", "7 1/15", "7+1/15", "-3/4", "5".
     Spaces are significant here: "7 1/15" is a mixed number but "71/15" is not,
     so this must not run on a whitespace-stripped string. */
  function normFrac(s) {
    var t = String(s).toLowerCase().replace(/−/g, '-').trim().replace(/\s+/g, ' ');
    if (t === '') return null;
    var m = /^(-?\d+)\s*\+\s*(\d+)\s*\/\s*(\d+)$/.exec(t) ||
            /^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/.exec(t);          // mixed number
    if (m) {
      var whole = parseInt(m[1], 10), nm = parseInt(m[2], 10), den = parseInt(m[3], 10);
      if (!den) return null;
      var sgn = whole < 0 ? -1 : 1;
      var f2 = F.frac(whole * den + sgn * nm, den);
      return f2.n + '/' + f2.d;
    }
    m = /^(-?\d+)\s*\/\s*(-?\d+)$/.exec(t);
    if (m) {
      if (parseInt(m[2], 10) === 0) return null;
      var f3 = F.frac(parseInt(m[1], 10), parseInt(m[2], 10));
      return f3.n + '/' + f3.d;
    }
    if (/^-?\d+$/.test(t)) return F.frac(parseInt(t, 10), 1).n + '/1';
    return null;
  }

  /* Digit string of a base expansion: strips brackets, base subscripts and
     separators. "(101110111)_2" -> "101110111"; "10.021201" keeps the point. */
  function normDigits(s) {
    var t = clean(s).replace(/[()\[\]]/g, '').replace(/_[0-9]+$/, '');   // drop a "_b" subscript
    t = t.replace(/,/g, '');
    if (!/^[0-9a-z]*\.?[0-9a-z]*$/.test(t) || t === '') return null;
    return t.replace(/^\.+|\.+$/g, function (m3) { return m3.length ? '.' : ''; });
  }

  /* Sequence of integers: "[2; 4, 12, 4]", "2,4,12,4", "2;4 12 4". */
  function normSeq(s) {
    var t = clean(s).replace(/[\[\]()]/g, '').replace(/;/g, ',');
    if (t === '') return null;
    var parts = t.split(/[, ]+/).filter(function (x) { return x !== ''; });
    for (var i = 0; i < parts.length; i++) if (!/^-?\d+$/.test(parts[i])) return null;
    return parts.join(',');
  }
  /* Unordered set of integers, e.g. possible orders. */
  function normSet(s) {
    var q = normSeq(s);
    if (q === null) return null;
    var arr = q.split(',').map(Number);
    arr.sort(function (a, b) { return a - b; });
    var out = [];
    arr.forEach(function (v) { if (out[out.length - 1] !== v) out.push(v); });
    return out.join(',');
  }
  /* Binary code word: "(0,1,1,0,0,1,1)" or "0110011". */
  function normVec(s) {
    var t = clean(s).replace(/[\[\]()]/g, '').replace(/[, ]/g, '');
    if (!/^[01]+$/.test(t)) return null;
    return t.split('').join(',');
  }

  /* HTML rendering of a polynomial (real superscripts). The `answer` field keeps
     the plain x^2 form, which is what a student types. */
  function PS(co, v) { return F.pStr(co, v).replace(/\^(\d+)/g, '<sup>$1</sup>'); }
  function vecStr(v) { return '(' + v.join(', ') + ')'; }
  function polyDisp(co, v) { return PS(co, v || 'x'); }
  function polyCanon(co) { var r = F.pTrim(co); return r.length ? r.join(',') : '0'; }

  /* ================= small helpers ================= */

  function fmt(x, dp) {
    if (x === undefined || x === null) return '—';
    if (typeof x === 'string') return x;
    if (!isFinite(x)) return '—';
    return Number(x).toFixed(dp === undefined ? 4 : dp);
  }
  function tolerance(part) {
    var dp = part.dp === undefined ? 4 : part.dp;
    return Math.max(1e-9, 0.51 * Math.pow(10, -dp));
  }
  function shuffleChoice(rng, options, correctIdx) {
    var idx = rng.shuffle(options.map(function (_, i) { return i; }));
    return { options: idx.map(function (i) { return options[i]; }), correct: idx.indexOf(correctIdx) };
  }
  function shuffleMulti(rng, options, correctIdxs) {
    var idx = rng.shuffle(options.map(function (_, i) { return i; }));
    return {
      options: idx.map(function (i) { return options[i]; }),
      correct: idx.map(function (o, pos) { return correctIdxs.indexOf(o) >= 0 ? pos : -1; })
        .filter(function (v) { return v >= 0; })
    };
  }
  function sub(n) { return '<sub>' + n + '</sub>'; }
  function ov(s) { return '<span class="ovl">' + s + '</span>'; }   // overline = periodic part
  function factorStr(n) {
    return F.factorise(n).map(function (pe) {
      return pe[0] + (pe[1] > 1 ? '<sup>' + pe[1] + '</sup>' : '');
    }).join(' · ');
  }
  function num(o) { o.kind = 'numeric'; return o; }
  function txt(o) { o.kind = 'text'; return o; }
  function mc(o) { o.kind = 'choice'; return o; }
  function ms(o) { o.kind = 'multi'; return o; }
  function wr(o) { o.kind = 'written'; return o; }

  function euclidTable(a, b) {
    var e = F.euclidSteps(a, b);
    var rows = e.steps.map(function (s) {
      return s.a + ' = ' + s.q + ' × ' + s.b + ' + ' + s.r;
    });
    return rows.join('<br>') + '<br>so gcd = <b>' + e.g + '</b>';
  }

  /* ================= T1: Euclidean algorithm & divisibility ================= */

  var T_GCD = {
    id: 'gcd-euclid',
    topic: 'Divisibility & gcd',
    title: 'Euclidean algorithm, gcd and divisibility proofs',
    marks: 9,
    build: function (rng) {
      var a = rng.int(400, 1200), b = rng.int(300, 1100);
      if (a === b) return null;
      var g = F.gcd(a, b);
      if (g < 2 || g > 40) return null;

      // a gcd of two numbers presented in factored form
      var p1 = rng.pick([2, 3]), p2 = rng.pick([3, 5]), p3 = rng.pick([5, 7, 11, 13]);
      if (p1 === p2) return null;
      var e1 = rng.int(2, 4), e2 = rng.int(2, 4), e3 = rng.int(1, 2);
      var A = Math.pow(p1, e1 + rng.int(1, 2)) * Math.pow(p2, e2) * p3;
      var B = Math.pow(p1, e1) * Math.pow(p2, e2 + rng.int(1, 2));
      var G = F.gcd(A, B);
      if (G < 2 || A > 5e6 || B > 5e6) return null;

      var verifyChoice = shuffleChoice(rng, [
        g + ' divides both: ' + a + ' = ' + g + ' × ' + (a / g) + ' and ' + b + ' = ' + g + ' × ' + (b / g) + '.',
        g + ' divides ' + a + ' only, which is enough.',
        a + ' and ' + b + ' both divide ' + g + '.',
        g + ' is the remainder at the last step, so nothing needs checking.'
      ], 0);
      var k = rng.int(2, 9);
      var proofChoice = shuffleChoice(rng, [
        'Any common divisor of ' + k + 'n − 1 and ' + k + 'n + 1 divides their difference, which is 2; and both are odd, so the gcd is 1.',
        'They are consecutive integers, so their gcd is 1.',
        'Both are prime for every n, so their gcd is 1.',
        'Their gcd is ' + k + ', because ' + k + ' divides ' + k + 'n.'
      ], 0);

      return {
        intro: '<p>Work exactly — every answer here is an integer.</p>',
        data: [],
        parts: [
          num({
            label: 'i) a)', marks: 2,
            prompt: 'Use the Euclidean algorithm to find gcd(' + a + ', ' + b + ').',
            answer: g, dp: 0, integer: true,
            hint: 'Divide the larger by the smaller, then repeat with (divisor, remainder) until the remainder is 0.',
            solution: euclidTable(a, b)
          }),
          mc({
            label: 'i) b)', marks: 1,
            prompt: 'Verify your answer by a divisibility test: which statement confirms d = gcd(' + a + ', ' + b + ') = ' + g + '?',
            options: verifyChoice.options, correct: verifyChoice.correct,
            solution: 'A gcd must <b>divide</b> both numbers (and be the largest such). Here ' +
              a + ' ÷ ' + g + ' = ' + (a / g) + ' and ' + b + ' ÷ ' + g + ' = ' + (b / g) + ', both exact.'
          }),
          num({
            label: 'i) c)', marks: 2,
            prompt: 'Find the greatest common divisor of ' + factorStr(A) + ' and ' + factorStr(B) + '.',
            answer: G, dp: 0, integer: true,
            traps: [{ value: F.lcm(A, B), msg: 'That is the lowest common multiple — take the <b>minimum</b> exponent of each prime, not the maximum.' }],
            hint: 'For each prime, take the smaller of the two exponents.',
            solution: factorStr(A) + ' and ' + factorStr(B) + '<br>Taking the minimum exponent of each common prime: gcd = ' +
              factorStr(G) + ' = <b>' + G + '</b>'
          }),
          mc({
            label: 'ii)', marks: 2,
            prompt: 'Prove that gcd(' + k + 'n − 1, ' + k + 'n + 1) = 1 for every integer n. Which argument is correct?',
            options: proofChoice.options, correct: proofChoice.correct,
            solution: 'If d divides both then d divides (' + k + 'n + 1) − (' + k + 'n − 1) = 2, so d ∈ {1, 2}. ' +
              'Both numbers are odd (' + k + 'n ± 1 with ' + k + 'n even, or an odd ± 1), so d ≠ 2, leaving d = 1.'
          }),
          wr({
            label: 'iii)', marks: 2,
            prompt: 'Prove that if a | b and b | c then a | (' + rng.int(2, 5) + 'b − ' + rng.int(2, 5) + 'c + a).',
            placeholder: 'Start from the definition of divisibility…',
            checklist: [
              'Wrote b = a·s and c = b·t for integers s, t',
              'Deduced a | c by substitution (c = a·st)',
              'Expressed the whole combination as a × (an integer)',
              'Concluded with the definition of divisibility'
            ],
            model: 'a | b means b = as for some integer s. b | c means c = bt for some integer t, so c = ast, giving a | c. ' +
              'Then any integer combination λb + μc + νa = a(λs + μst + ν), which is a times an integer, so a divides it. ' +
              'The particular coefficients do not matter — this works for <i>any</i> integer combination of b, c and a.'
          })
        ]
      };
    }
  };

  /* ================= T2: base expansions ================= */

  var T_BASES = {
    id: 'bases',
    topic: 'Base expansions',
    title: 'Writing numbers in another base',
    marks: 8,
    build: function (rng) {
      var b = rng.pick([2, 3]);
      var bk = b * b;                       // the b^2 shortcut the papers always use
      var n = rng.int(120, 900);
      var d = rng.pick([5, 6, 7, 9, 11, 12, 13, 14]);
      var num = rng.int(d + 1, 6 * d);
      if (num % d === 0) return null;
      var expInt = F.toBase(n, b), expInt2 = F.toBase(n, bk);
      var fr = F.fracToBase(num, d, b);
      if (!fr.period || fr.period.length > 7) return null;
      var full = fr.int + '.' + fr.pre + fr.period;

      return {
        intro: '<p>Base expansions. Write digit strings without spaces; you may include the brackets and base subscript if you like — <code>(1011)_2</code> and <code>1011</code> are both accepted.</p>',
        data: [],
        parts: [
          txt({
            label: 'i) a)', marks: 2,
            prompt: 'Write ' + n + ' in base ' + b + '.',
            answer: expInt, normalise: normDigits, note: 'digits only',
            placeholder: '(…)' + sub(b),
            hint: 'Repeatedly divide by ' + b + ' and read the remainders from the bottom up.',
            solution: (function () {
              var rows = [], t = n;
              while (t > 0) { rows.push(t + ' = ' + b + ' × ' + Math.floor(t / b) + ' + ' + (t % b)); t = Math.floor(t / b); }
              return rows.join('<br>') + '<br>Reading remainders bottom-to-top: <b>' + expInt + '</b>' + sub(b);
            })()
          }),
          txt({
            label: 'i) b)', marks: 2,
            prompt: 'Using your answer to (a), write ' + n + ' in base ' + bk + '.',
            answer: expInt2, normalise: normDigits, note: 'digits only',
            placeholder: '(…)' + sub(bk),
            hint: 'Because ' + bk + ' = ' + b + '², group the base-' + b + ' digits in <b>pairs from the right</b>.',
            solution: 'Group the base-' + b + ' digits in pairs from the right: ' +
              (function () {
                var s2 = expInt, pad = s2.length % 2 ? '0' + s2 : s2, groups = [];
                for (var i = 0; i < pad.length; i += 2) groups.push(pad.substr(i, 2));
                return groups.join(' | ') + ' → ' + groups.map(function (gp) { return F.fromBase(gp, b); }).join('');
              })() +
              '<br>So ' + n + ' = <b>' + expInt2 + '</b>' + sub(bk) +
              '<br>This shortcut works whenever one base is a power of the other.'
          }),
          txt({
            label: 'ii)', marks: 4,
            prompt: 'Write ' + num + '/' + d + ' in base ' + b + '. Give the full expansion including the repeating block, e.g. <code>' +
              (b === 2 ? '10.011' : '10.021') + '</code> — write the digits in order and mark nothing; the repeating part is ' +
              fr.period.length + ' digit' + (fr.period.length > 1 ? 's' : '') + ' long.',
            answer: full, normalise: normDigits, note: 'e.g. ' + (b === 2 ? '10.0110' : '12.0212'),
            placeholder: 'digits with a point',
            hint: 'Integer part by division; then repeatedly multiply the remainder by ' + b + ', recording each whole part, until a remainder repeats.',
            solution: (function () {
              var ip = Math.floor(num / d), rem = num % d, rows = [], seen = {}, i = 0;
              while (rem !== 0 && i < 14) {
                if (seen[rem] !== undefined) { rows.push('remainder ' + rem + ' has appeared before — the block repeats from here'); break; }
                seen[rem] = i;
                var x = rem * b;
                rows.push(rem + '/' + d + ' × ' + b + ' = ' + Math.floor(x / d) + ' remainder ' + (x % d) + '/' + d);
                rem = x % d; i++;
              }
              return 'Integer part: ' + Math.floor(num / d) + ' = ' + F.toBase(ip, b) + sub(b) + '<br>' +
                rows.join('<br>') + '<br>So ' + num + '/' + d + ' = <b>' + fr.int + '.' + fr.pre + ov(fr.period) + '</b>' + sub(b) +
                ' (the overline marks the repeating block).';
            })()
          })
        ]
      };
    }
  };

  /* ================= T3: periodic expansion back to a rational ================= */

  var T_PERIODIC = {
    id: 'periodic-base',
    topic: 'Base expansions',
    title: 'Periodic base expansion as a rational',
    marks: 4,
    build: function (rng) {
      var b = rng.pick([3, 4, 5]);
      var intDigits = rng.int(1, 3), preLen = rng.int(0, 1), perLen = rng.int(2, 3);
      var mkDigits = function (len, allowLeadZero) {
        var s = '';
        for (var i = 0; i < len; i++) {
          var dgt = rng.int(0, b - 1);
          if (i === 0 && !allowLeadZero && dgt === 0) dgt = 1;
          s += String(dgt);
        }
        return s;
      };
      var intStr = mkDigits(intDigits, false);
      var preStr = preLen ? mkDigits(preLen, true) : '';
      var perStr = mkDigits(perLen, true);
      if (/^0+$/.test(perStr)) return null;                 // not actually periodic
      var val = F.baseToFrac(intStr, preStr, perStr, b);
      if (val.d === 1 || val.d > 400) return null;

      var shown = '(' + intStr + '.' + preStr + ov(perStr) + ')' + sub(b);
      return {
        intro: '<p>Here ' + ov('∗∗') + ' means the block ∗∗ repeats for ever.</p>',
        data: [],
        parts: [
          txt({
            label: 'i)', marks: 3,
            prompt: 'Write ' + shown + ' as a rational number in base 10, in lowest terms.',
            answer: F.fracStr(val), normalise: normFrac, note: 'a fraction such as 13/30',
            placeholder: 'p/q',
            hint: 'Split it as (integer part) + (non-repeating part) + (repeating tail). A repeating block of r digits starting after k digits contributes P / (' +
              b + '<sup>k</sup>(' + b + '<sup>r</sup> − 1)).',
            solution: (function () {
              var parts = [];
              parts.push('Integer part: (' + intStr + ')' + sub(b) + ' = ' + F.fromBase(intStr, b));
              if (preStr) parts.push('Non-repeating digits: (' + preStr + ')' + sub(b) + '/' + b + '<sup>' + preStr.length + '</sup> = ' +
                F.fromBase(preStr, b) + '/' + Math.pow(b, preStr.length));
              parts.push('Repeating block: (' + perStr + ')' + sub(b) + ' / (' + b + '<sup>' + preStr.length + '</sup>(' + b + '<sup>' +
                perStr.length + '</sup> − 1)) = ' + F.fromBase(perStr, b) + ' / ' +
                (Math.pow(b, preStr.length) * (Math.pow(b, perStr.length) - 1)));
              parts.push('Total = <b>' + F.fracStr(val) + '</b>' + (val.n > val.d ? ' = ' + F.fracMixedStr(val) : ''));
              return parts.join('<br>');
            })()
          }),
          num({
            label: 'ii)', marks: 1,
            prompt: 'Give that value as a decimal, correct to 4 decimal places.',
            answer: val.n / val.d, dp: 4,
            hint: 'Just divide — this is what the calculator is for.',
            solution: F.fracStr(val) + ' = <b>' + (val.n / val.d).toFixed(6) + '</b>'
          })
        ]
      };
    }
  };

  /* ================= T4: continued fractions ================= */

  var T_CF = {
    id: 'continued-fractions',
    topic: 'Continued fractions',
    title: 'Continued fraction expansions',
    marks: 8,
    build: function (rng) {
      var d = rng.int(20, 80), n = rng.int(d + 5, 6 * d);
      if (F.gcd(n, d) !== 1) return null;
      var cf = F.cfExpand(n, d);
      if (cf.length < 3 || cf.length > 6) return null;
      if (cf[cf.length - 1] === 1) return null;             // keep the canonical form unique

      // periodic continued fraction -> quadratic surd
      var preLen = rng.int(1, 2), perLen = rng.int(1, 2);
      var pre = [], per = [], i;
      for (i = 0; i < preLen; i++) pre.push(rng.int(i === 0 ? 0 : 1, 3));
      for (i = 0; i < perLen; i++) per.push(rng.int(1, 3));
      var s = F.periodicCf(pre, per);
      if (s.c === 1 || s.c > 60 || Math.abs(s.a) > 60 || Math.abs(s.d) > 60) return null;
      var sVal = (s.a + s.b * Math.sqrt(s.c)) / s.d;
      if (!isFinite(sVal) || sVal <= 0) return null;

      var cfStr = '[' + pre[0] + ';' + (pre.slice(1).length ? ' ' + pre.slice(1).join(', ') + ',' : '') +
        ' ' + ov(per.join(', ')) + ']';
      var surdHtml = function (o) {
        var top = (o.a === 0 ? '' : o.a) + (o.b < 0 ? ' − ' : (o.a === 0 ? '' : ' + ')) +
          (Math.abs(o.b) === 1 ? '' : Math.abs(o.b)) + '√' + o.c;
        return o.d === 1 ? top : '(' + top.trim() + ')/' + o.d;
      };
      var wrong1 = { a: s.a, b: -s.b, c: s.c, d: s.d };
      var wrong2 = { a: s.a, b: s.b, c: s.c * (s.c < 20 ? 4 : 1) + (s.c < 20 ? 0 : 1), d: s.d };
      var wrong3 = { a: s.a + s.d, b: s.b, c: s.c, d: s.d };
      var ch = shuffleChoice(rng, [surdHtml(s), surdHtml(wrong1), surdHtml(wrong2), surdHtml(wrong3)], 0);

      return {
        intro: '<p>Continued fractions. Write a finite expansion as a list, e.g. <code>[2; 4, 12, 4]</code> or just <code>2,4,12,4</code>.</p>',
        data: [],
        parts: [
          txt({
            label: 'i)', marks: 3,
            prompt: 'Expand ' + n + '/' + d + ' into a continued fraction.',
            answer: cf.join(','), normalise: normSeq, note: '[a₀; a₁, a₂, …]',
            placeholder: '[a0; a1, a2, ...]',
            hint: 'This is the Euclidean algorithm: at each step take the whole part, then invert the remainder.',
            solution: (function () {
              var rows = [], N = n, D = d;
              while (D !== 0) {
                var q = Math.floor(N / D), r = N - q * D;
                rows.push(N + '/' + D + ' = ' + q + (r ? ' + ' + r + '/' + D : ''));
                N = D; D = r;
              }
              return rows.join('<br>') + '<br>So ' + n + '/' + d + ' = <b>[' + cf[0] + '; ' + cf.slice(1).join(', ') + ']</b>' +
                '<br>The partial quotients are exactly the quotients in the Euclidean algorithm for gcd(' + n + ', ' + d + ').';
            })()
          }),
          mc({
            label: 'ii) a)', marks: 3,
            prompt: 'Express the periodic continued fraction ' + cfStr + ' in the form (a + b√c)/d.',
            options: ch.options, correct: ch.correct,
            hint: 'Let y be the value of the purely periodic tail; it satisfies a quadratic. Then substitute back through the non-repeating head.',
            solution: (function () {
              var conv = F.cfConvergents(per), m = per.length - 1;
              var P = conv.p[m], Q = conv.q[m];
              var Pp = m > 0 ? conv.p[m - 1] : 1, Qp = m > 0 ? conv.q[m - 1] : 0;
              return 'Let y = [' + ov(per.join(', ')) + ']. Then y = (' + P + 'y + ' + Pp + ')/(' + Q + 'y + ' + Qp + '), i.e. ' +
                Q + 'y² + ' + (Qp - P) + 'y − ' + Pp + ' = 0.<br>' +
                'Take the positive root, then substitute into the head [' + pre.join('; ') + ', y] and rationalise the denominator.<br>' +
                'Value = <b>' + surdHtml(s) + '</b> ≈ ' + sVal.toFixed(6);
            })()
          }),
          num({
            label: 'ii) b)', marks: 2,
            prompt: 'Give the value of that continued fraction as a decimal, correct to 4 decimal places.',
            answer: sVal, dp: 4,
            hint: 'Evaluate your surd numerically — or iterate the continued fraction a few times and watch it converge.',
            solution: surdHtml(s) + ' ≈ <b>' + sVal.toFixed(6) + '</b>. ' +
              'A good check: expand the continued fraction numerically a dozen levels deep and confirm it converges here.'
          })
        ]
      };
    }
  };

  /* ================= T5: linear Diophantine equations ================= */

  var T_DIO = {
    id: 'diophantine',
    topic: 'Diophantine equations',
    title: 'Linear Diophantine equations',
    marks: 7,
    build: function (rng) {
      var a = rng.int(3, 48), b = rng.int(3, 48);
      if (F.gcd(a, b) !== 1 || a === b) return null;
      /* Build c from a solution we know is positive, so the "both positive"
         part always has an answer rather than rejecting most random draws. */
      var c = a * rng.int(1, 5) + b * rng.int(1, 5);
      var e = F.egcd(a, b);
      var x0 = e.x * c, y0 = e.y * c;
      // normalise to the smallest non-negative x
      var xs = ((x0 % b) + b) % b;
      var ys = (c - a * xs) / b;
      if (!Number.isInteger(ys)) return null;
      // positive solutions: x > 0 and y > 0
      var pos = [];
      for (var k = -200; k <= 200; k++) {
        var X = xs + b * k, Y = ys - a * k;
        if (X > 0 && Y > 0) pos.push([X, Y]);
      }
      if (pos.length < 1 || pos.length > 6) return null;

      var genChoice = shuffleChoice(rng, [
        '(x, y) = (' + xs + ' + ' + b + 'k, ' + ys + ' − ' + a + 'k) for all k ∈ Z',
        '(x, y) = (' + xs + ' + ' + a + 'k, ' + ys + ' − ' + b + 'k) for all k ∈ Z',
        '(x, y) = (' + xs + ' − ' + b + 'k, ' + ys + ' + ' + a + 'k) for all k ∈ Z, k ≥ 0',
        '(x, y) = (' + xs + ', ' + ys + ') only'
      ], 0);

      return {
        intro: '<p>Consider the Diophantine equation</p><p class="model">' + a + 'x + ' + b + 'y = ' + c + '</p>',
        data: [],
        parts: [
          num({
            label: 'i) a)', marks: 2,
            prompt: 'Find the smallest non-negative integer x in a solution (x, y).',
            answer: xs, dp: 0, integer: true,
            hint: 'Run the extended Euclidean algorithm on ' + a + ' and ' + b + ' to solve ' + a + 'x + ' + b + 'y = 1, then scale by ' + c + ' and reduce x modulo ' + b + '.',
            solution: 'gcd(' + a + ', ' + b + ') = 1, and the extended Euclidean algorithm gives ' +
              a + '(' + e.x + ') + ' + b + '(' + e.y + ') = 1.<br>Multiplying by ' + c + ': x = ' + x0 + ', y = ' + y0 +
              '.<br>Reducing x modulo ' + b + ' gives the smallest non-negative x = <b>' + xs + '</b>.'
          }),
          num({
            label: 'i) b)', marks: 1,
            prompt: 'What is the corresponding value of y?',
            answer: ys, dp: 0, integer: true,
            solution: 'y = (' + c + ' − ' + a + '×' + xs + ')/' + b + ' = <b>' + ys + '</b>'
          }),
          mc({
            label: 'i) c)', marks: 2,
            prompt: 'Write down all integer solutions.',
            options: genChoice.options, correct: genChoice.correct,
            solution: 'From one solution, the general solution moves x by b/gcd = ' + b + ' and y by −a/gcd = −' + a +
              '.<br><b>(x, y) = (' + xs + ' + ' + b + 'k, ' + ys + ' − ' + a + 'k)</b>, k ∈ Z.<br>' +
              'Note the coefficients <b>swap</b>: x steps by the coefficient of y, and vice versa.'
          }),
          num({
            label: 'ii)', marks: 2,
            prompt: 'How many solutions have <b>both</b> x and y positive?',
            answer: pos.length, dp: 0, integer: true,
            hint: 'Require ' + xs + ' + ' + b + 'k > 0 and ' + ys + ' − ' + a + 'k > 0, then count the integers k in that range.',
            solution: 'Need ' + xs + ' + ' + b + 'k > 0 and ' + ys + ' − ' + a + 'k > 0, i.e. k > −' + xs + '/' + b +
              ' and k < ' + ys + '/' + a + '.<br>That gives <b>' + pos.length + '</b> value' + (pos.length > 1 ? 's' : '') + ' of k: ' +
              pos.map(function (P) { return '(' + P[0] + ', ' + P[1] + ')'; }).join(', ') + '.'
          })
        ]
      };
    }
  };

  /* ================= T6: simultaneous congruences ================= */

  var T_CRT = {
    id: 'congruences',
    topic: 'Congruences & CRT',
    title: 'Systems of simultaneous congruences',
    marks: 8,
    build: function (rng) {
      var mods = rng.shuffle([5, 7, 9, 11, 13]).slice(0, rng.int(2, 3));
      var eqs = mods.map(function (m) {
        var c = rng.int(1, m - 1);
        while (F.gcd(c, m) !== 1) c = rng.int(1, m - 1);
        return { c: c, a: rng.int(1, m - 1), m: m };
      });
      var sol = F.crt(eqs);
      if (!sol || sol.x === 0) return null;
      var lo = rng.int(2, 5) * sol.m, hi = lo + rng.int(2, 4) * sol.m;
      var inRange = [];
      for (var v = sol.x; v <= hi + sol.m; v += sol.m) if (v >= lo && v <= hi) inRange.push(v);
      if (!inRange.length) return null;

      var eqHtml = eqs.map(function (e) {
        return (e.c === 1 ? 'x' : e.c + 'x') + ' ≡ ' + e.a + ' (mod ' + e.m + ')';
      }).join(';<br>');

      return {
        intro: '<p>Solve the system of simultaneous congruences</p><p class="model">' + eqHtml + '</p>',
        data: [],
        parts: [
          num({
            label: 'i) a)', marks: 3,
            prompt: 'Find the solution as x ≡ r (mod m). What is r? (Give the smallest non-negative residue.)',
            answer: sol.x, dp: 0, integer: true,
            hint: 'First divide out each coefficient by multiplying by its inverse mod that modulus, then combine with the Chinese Remainder Theorem.',
            solution: (function () {
              var rows = eqs.map(function (e) {
                var inv = F.modinv(e.c, e.m);
                var r = (((e.a * inv) % e.m) + e.m) % e.m;
                return (e.c === 1 ? '' : 'Multiply by ' + e.c + '<sup>−1</sup> ≡ ' + inv + ' (mod ' + e.m + '): ') +
                  'x ≡ ' + r + ' (mod ' + e.m + ')';
              });
              return rows.join('<br>') + '<br>The moduli are pairwise coprime, so by CRT there is a unique solution modulo ' +
                mods.join('×') + ' = ' + sol.m + ':<br><b>x ≡ ' + sol.x + ' (mod ' + sol.m + ')</b>';
            })()
          }),
          num({
            label: 'i) b)', marks: 1,
            prompt: 'What is the modulus m of that combined solution?',
            answer: sol.m, dp: 0, integer: true,
            traps: [{ value: mods.reduce(function (s2, m) { return s2 + m; }, 0), msg: 'You added the moduli — for coprime moduli they <b>multiply</b>.' }],
            solution: 'The moduli are pairwise coprime, so m = ' + mods.join(' × ') + ' = <b>' + sol.m + '</b>.'
          }),
          num({
            label: 'ii)', marks: 2,
            prompt: 'Find the smallest strictly positive integer solution.',
            answer: sol.x === 0 ? sol.m : sol.x, dp: 0, integer: true,
            solution: 'The solutions are ' + sol.x + ' + ' + sol.m + 'k. The smallest positive one is <b>' + (sol.x === 0 ? sol.m : sol.x) + '</b>.'
          }),
          txt({
            label: 'iii)', marks: 2,
            prompt: 'Find all integers x satisfying the system with ' + lo + ' ≤ x ≤ ' + hi + '. List them separated by commas.',
            answer: inRange.join(','), normalise: normSet, note: 'comma separated',
            placeholder: 'e.g. 87, 142',
            hint: 'Add multiples of ' + sol.m + ' to ' + sol.x + ' until you land inside the range.',
            solution: 'x = ' + sol.x + ' + ' + sol.m + 'k. Taking k so that ' + lo + ' ≤ x ≤ ' + hi +
              ' gives <b>' + inRange.join(', ') + '</b>.'
          })
        ]
      };
    }
  };

  /* ================= T7: Euler phi, orders, existence of fields ================= */

  var T_PHI = {
    id: 'phi-orders',
    topic: 'Euler φ & orders',
    title: 'Euler’s function, element orders and finite fields',
    marks: 9,
    build: function (rng) {
      var n = rng.pick([180, 200, 240, 360, 600, 900, 1200, 2400, 3600]);
      var ph = F.phi(n);
      var m = rng.pick([25, 27, 32, 49, 81, 121]);
      var ordersRing = F.divisors(F.phi(m));
      var q = rng.pick([16, 25, 27, 32, 49, 81]);
      var ordersField = F.divisors(q - 1);

      // efficient modular exponentiation
      var base = rng.int(7, 40), mod = rng.pick([45, 63, 100, 77, 91]);
      if (F.gcd(base, mod) !== 1) return null;
      var expo = rng.int(1000, 5000);
      var val = F.modpow(base, expo, mod);

      // which n admit a finite field: prime powers only
      var cand = rng.shuffle([2, 4, 6, 7, 9, 10, 12, 15, 16, 19, 20, 25]).slice(0, 6)
        .sort(function (x, y) { return x - y; });
      var good = cand.filter(function (v) {
        var f = F.factorise(v);
        return f.length === 1;
      });
      if (!good.length || good.length === cand.length) return null;
      var fieldPick = shuffleMulti(rng, cand.map(function (v) { return String(v); }),
        cand.map(function (v, i) { return good.indexOf(v) >= 0 ? i : -1; }).filter(function (v) { return v >= 0; }));

      return {
        intro: '<p>Euler’s function counts the integers in {1, …, n} coprime to n. ' +
          'Recall that the order of an element divides the order of the group it lives in.</p>',
        data: [],
        parts: [
          num({
            label: 'i)', marks: 2,
            prompt: 'Compute φ(' + n + ').',
            answer: ph, dp: 0, integer: true,
            hint: 'Factor n, then φ(∏pᵉ) = ∏ pᵉ⁻¹(p − 1).',
            solution: n + ' = ' + factorStr(n) + '<br>φ(' + n + ') = ' +
              F.factorise(n).map(function (pe) {
                return (pe[1] > 1 ? pe[0] + '<sup>' + (pe[1] - 1) + '</sup>·' : '') + '(' + pe[0] + ' − 1)';
              }).join(' × ') + ' = <b>' + ph + '</b>'
          }),
          txt({
            label: 'ii)', marks: 2,
            prompt: 'What are the possible orders of elements of the group of units of Z' + sub(m) + '? List them, comma separated.',
            answer: ordersRing.join(','), normalise: normSet, note: 'comma separated',
            placeholder: '1, 2, …',
            hint: 'Orders divide the size of the group, which is φ(' + m + ') = ' + F.phi(m) + '.',
            solution: 'The units form a group of order φ(' + m + ') = ' + F.phi(m) +
              '. By Lagrange, every element order divides it: <b>' + ordersRing.join(', ') + '</b>.'
          }),
          txt({
            label: 'iii)', marks: 2,
            prompt: 'What are the possible orders of elements of F' + sub(q) + '<sup>∗</sup>, the multiplicative group of the field of ' + q + ' elements?',
            answer: ordersField.join(','), normalise: normSet, note: 'comma separated',
            placeholder: '1, 2, …',
            traps: [{ value: F.divisors(q).join(','), msg: 'You used the divisors of ' + q + '. The multiplicative group has ' + (q - 1) + ' elements, not ' + q + '.' }],
            hint: 'F* is cyclic of order q − 1 = ' + (q - 1) + '.',
            solution: 'F' + sub(q) + '<sup>∗</sup> is cyclic of order ' + q + ' − 1 = ' + (q - 1) +
              ', so the possible orders are exactly the divisors: <b>' + ordersField.join(', ') + '</b>.'
          }),
          num({
            label: 'iv)', marks: 2,
            prompt: 'Compute ' + base + '<sup>' + expo + '</sup> (mod ' + mod + ') efficiently.',
            answer: val, dp: 0, integer: true,
            hint: 'Euler: since gcd(' + base + ', ' + mod + ') = 1, ' + base + '<sup>φ(' + mod + ')</sup> ≡ 1, and φ(' + mod + ') = ' +
              F.phi(mod) + '. So reduce the exponent modulo ' + F.phi(mod) + '.',
            solution: 'φ(' + mod + ') = ' + F.phi(mod) + ' and gcd(' + base + ', ' + mod + ') = 1, so by Euler’s theorem ' +
              base + '<sup>' + F.phi(mod) + '</sup> ≡ 1 (mod ' + mod + ').<br>' +
              expo + ' ≡ ' + (expo % F.phi(mod)) + ' (mod ' + F.phi(mod) + '), so the answer is ' +
              base + '<sup>' + (expo % F.phi(mod)) + '</sup> ≡ <b>' + val + '</b> (mod ' + mod + ').'
          }),
          ms({
            label: 'v)', marks: 1,
            prompt: 'For which of these n does a finite field with exactly n elements exist?',
            options: fieldPick.options, correct: fieldPick.correct,
            solution: 'A field of n elements exists exactly when n is a <b>prime power</b>. Here: ' +
              good.map(function (v) { return v + ' = ' + factorStr(v); }).join(', ') + '. ' +
              'The others have at least two distinct prime factors.'
          })
        ]
      };
    }
  };

  /* ================= T8: RSA ================= */

  var T_RSA = {
    id: 'rsa',
    topic: 'RSA',
    title: 'RSA: modulus, exponents and decryption',
    marks: 10,
    build: function (rng) {
      var primes = [7, 11, 13, 17, 19, 23, 29, 31, 37];
      var p = rng.pick(primes), qq = rng.pick(primes);
      if (p === qq) return null;
      var N = p * qq, ph = (p - 1) * (qq - 1);
      var e = 2;
      while (F.gcd(e, ph) !== 1) e++;
      var d = F.modinv(e, ph);
      var msg = rng.int(2, N - 2);
      if (F.gcd(msg, N) !== 1) return null;
      var cipher = F.modpow(msg, e, N);
      // a second exponent that is NOT valid
      var bad = 2;
      while (F.gcd(bad, ph) === 1) bad++;

      var whyChoice = shuffleChoice(rng, [
        'It is a product of two distinct primes, ' + p + ' × ' + qq + ', so φ(N) is known and encryption is invertible.',
        'It is prime, so every exponent works.',
        'It is even, which makes modular arithmetic easier.',
        'It is a perfect square, so square roots exist modulo N.'
      ], 0);
      var validChoice = shuffleChoice(rng, [
        'No — gcd(' + bad + ', φ(' + N + ')) = ' + F.gcd(bad, ph) + ' ≠ 1, so the map is not invertible.',
        'Yes — every exponent gives a valid RSA encryption.',
        'No — because ' + bad + ' is smaller than ' + N + '.',
        'Yes — because ' + bad + ' is coprime to ' + N + '.'
      ], 0);

      return {
        intro: '<p>An RSA cryptosystem uses the modulus N = <b>' + N + '</b>.</p>',
        data: [],
        parts: [
          num({
            label: 'i) a)', marks: 1,
            prompt: 'Factor N: give the smaller prime factor.',
            answer: Math.min(p, qq), dp: 0, integer: true,
            solution: N + ' = ' + Math.min(p, qq) + ' × ' + Math.max(p, qq) + ', both prime.'
          }),
          mc({
            label: 'i) b)', marks: 1,
            prompt: 'Why is N a suitable modulus for RSA?',
            options: whyChoice.options, correct: whyChoice.correct,
            solution: 'RSA needs N = pq with p, q distinct primes. Then φ(N) = (p−1)(q−1) = ' + ph +
              ', which is what makes the decryption exponent computable — by anyone who can factor N.'
          }),
          num({
            label: 'ii) a)', marks: 2,
            prompt: 'Compute φ(' + N + ').',
            answer: ph, dp: 0, integer: true,
            traps: [{ value: N - 1, msg: 'N − 1 would be φ(N) if N were <b>prime</b>. Here N = pq, so φ(N) = (p−1)(q−1).' }],
            solution: 'φ(' + N + ') = (' + p + ' − 1)(' + qq + ' − 1) = ' + (p - 1) + ' × ' + (qq - 1) + ' = <b>' + ph + '</b>'
          }),
          num({
            label: 'ii) b)', marks: 2,
            prompt: 'Find the smallest encryption exponent e > 1 that is valid for this modulus.',
            answer: e, dp: 0, integer: true,
            hint: 'e must satisfy gcd(e, φ(N)) = 1.',
            solution: 'We need gcd(e, ' + ph + ') = 1. Testing e = 2, 3, … the first that works is <b>e = ' + e + '</b>.'
          }),
          num({
            label: 'ii) c)', marks: 2,
            prompt: 'For that e, find the decryption exponent d, i.e. the decryption function is c ↦ c<sup>d</sup> (mod ' + N + ').',
            answer: d, dp: 0, integer: true,
            hint: 'd ≡ e⁻¹ (mod φ(N)) — use the extended Euclidean algorithm.',
            solution: 'Solve ' + e + 'd ≡ 1 (mod ' + ph + ') with the extended Euclidean algorithm: <b>d = ' + d + '</b>.<br>' +
              'Check: ' + e + ' × ' + d + ' = ' + (e * d) + ' = ' + Math.round((e * d - 1) / ph) + ' × ' + ph + ' + 1. ✓'
          }),
          mc({
            label: 'iii)', marks: 1,
            prompt: 'Does m ↦ m<sup>' + bad + '</sup> (mod ' + N + ') give a valid RSA encryption?',
            options: validChoice.options, correct: validChoice.correct,
            solution: 'The exponent must be coprime to φ(N) = ' + ph + ', otherwise the map is not a bijection and cannot be inverted. ' +
              'Here gcd(' + bad + ', ' + ph + ') = ' + F.gcd(bad, ph) + '.'
          }),
          num({
            label: 'iv)', marks: 1,
            prompt: 'Using the exponent e = ' + e + ', the message m = ' + msg + ' is encrypted. What is the ciphertext c?',
            answer: cipher, dp: 0, integer: true,
            hint: 'c ≡ m^e (mod N). Square-and-multiply keeps the numbers small.',
            solution: 'c ≡ ' + msg + '<sup>' + e + '</sup> ≡ <b>' + cipher + '</b> (mod ' + N + ')<br>' +
              'And decrypting returns the message: ' + cipher + '<sup>' + d + '</sup> ≡ ' + msg + ' (mod ' + N + ').'
          })
        ]
      };
    }
  };

  /* ================= T9: primitive elements ================= */

  var T_PRIM = {
    id: 'primitive',
    topic: 'Primitive elements',
    title: 'Primitive roots and the order test',
    marks: 8,
    build: function (rng) {
      var p = rng.pick([19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 83]);
      var g = F.primitiveRoots(p)[0];
      var fac = F.factorise(p - 1).map(function (pe) { return pe[0]; });

      // candidate powers of g: primitive iff gcd(k, p-1) = 1
      var ks = rng.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).slice(0, 4).sort(function (a, b) { return a - b; });
      var cands = ks.map(function (k) { return { k: k, v: F.modpow(g, k, p), prim: F.gcd(k, p - 1) === 1 }; });
      if (!cands.some(function (c) { return c.prim; })) return null;
      if (cands.every(function (c) { return c.prim; })) return null;
      var pick = shuffleMulti(rng,
        cands.map(function (c) { return String(c.v) + ' (= ' + g + '<sup>' + c.k + '</sup>)'; }),
        cands.map(function (c, i) { return c.prim ? i : -1; }).filter(function (v) { return v >= 0; }));

      var testChoice = shuffleChoice(rng, [
        'Check that a<sup>(p−1)/q</sup> ≢ 1 (mod p) for every prime q dividing p − 1.',
        'Check that a<sup>p−1</sup> ≡ 1 (mod p).',
        'Check that a is prime.',
        'Check that a<sup>2</sup> ≢ 1 (mod p).'
      ], 0);

      var elt = rng.int(2, p - 1);
      var ord = F.orderMod(elt, p);

      return {
        intro: '<p>Work in Z<sup>∗</sup>' + sub(p) + ', the group of units modulo the prime ' + p +
          '. It is cyclic of order ' + (p - 1) + ' = ' + factorStr(p - 1) + '.</p>',
        data: [],
        parts: [
          mc({
            label: 'i)', marks: 2,
            prompt: 'What is the efficient test for deciding whether a is a primitive root modulo ' + p + '?',
            options: testChoice.options, correct: testChoice.correct,
            solution: 'a has order p − 1 exactly when a<sup>(p−1)/q</sup> ≠ 1 for every <b>prime</b> q | p − 1. ' +
              'Here p − 1 = ' + (p - 1) + ' = ' + factorStr(p - 1) + ', so you only check q = ' + fac.join(', ') + '. ' +
              'a<sup>p−1</sup> ≡ 1 holds for every unit by Fermat, so it tells you nothing.'
          }),
          num({
            label: 'ii)', marks: 2,
            prompt: 'Find the smallest primitive root modulo ' + p + '.',
            answer: g, dp: 0, integer: true,
            hint: 'Try a = 2, 3, 5, … and apply the test above.',
            solution: 'Testing a = 2, 3, … the first primitive root is <b>' + g + '</b>. Checks: ' +
              fac.map(function (q) { return g + '<sup>' + ((p - 1) / q) + '</sup> ≡ ' + F.modpow(g, (p - 1) / q, p); }).join(', ') +
              ' — none is 1, so the order is the full ' + (p - 1) + '.'
          }),
          ms({
            label: 'iii)', marks: 2,
            prompt: 'Given that ' + g + ' is a primitive root modulo ' + p + ', which of the following are also primitive roots?',
            options: pick.options, correct: pick.correct,
            hint: 'g<sup>k</sup> is primitive exactly when gcd(k, p − 1) = 1.',
            solution: 'g<sup>k</sup> has order (p−1)/gcd(k, p−1), so it is primitive exactly when gcd(k, ' + (p - 1) + ') = 1.<br>' +
              cands.map(function (c) {
                return g + '<sup>' + c.k + '</sup> = ' + c.v + ': gcd(' + c.k + ', ' + (p - 1) + ') = ' + F.gcd(c.k, p - 1) +
                  ' → ' + (c.prim ? '<b>primitive</b>' : 'not primitive (order ' + (p - 1) / F.gcd(c.k, p - 1) + ')');
              }).join('<br>') +
              '<br>There are φ(' + (p - 1) + ') = ' + F.phi(p - 1) + ' primitive roots in total.'
          }),
          num({
            label: 'iv)', marks: 2,
            prompt: 'What is the multiplicative order of ' + elt + ' modulo ' + p + '?',
            answer: ord, dp: 0, integer: true,
            hint: 'The order divides ' + (p - 1) + ' — test the divisors in increasing order.',
            solution: 'The order must divide ' + (p - 1) + '. Checking the divisors, the smallest k with ' +
              elt + '<sup>k</sup> ≡ 1 (mod ' + p + ') is <b>' + ord + '</b>' +
              (ord === p - 1 ? ', so ' + elt + ' is itself a primitive root.' : '.')
          })
        ]
      };
    }
  };

  /* ================= T10: Hamming codes ================= */

  var T_HAMMING = {
    id: 'hamming',
    topic: 'Coding theory',
    title: 'The (7,4) Hamming code',
    marks: 8,
    build: function (rng) {
      var msg = [rng.int(0, 1), rng.int(0, 1), rng.int(0, 1), rng.int(0, 1)];
      if (msg.every(function (v) { return v === 0; })) return null;
      var code = F.hammingEncode(msg);

      var msg2 = [rng.int(0, 1), rng.int(0, 1), rng.int(0, 1), rng.int(0, 1)];
      var code2 = F.hammingEncode(msg2);
      var errPos = rng.int(1, 7);
      var recv = code2.slice();
      recv[errPos - 1] = 1 - recv[errPos - 1];
      var dec = F.hammingDecode(recv);

      var r = rng.pick([[7, 4], [15, 11], [31, 26]]);
      var rate = F.frac(r[1], r[0]);

      return {
        intro: '<p>The standard (7,4) Hamming code uses</p><p class="model">H = ' +
          '[1 0 1 0 1 0 1 ; 0 1 1 0 0 1 1 ; 0 0 0 1 1 1 1]</p>' +
          '<p>A message (a, b, c, d) is encoded as (x, y, a, z, b, c, d) where</p>' +
          '<p class="model">x = a + b + d, &nbsp; y = a + c + d, &nbsp; z = b + c + d &nbsp; in Z' + sub(2) + '</p>',
        data: [],
        parts: [
          txt({
            label: 'i)', marks: 2,
            prompt: 'Encode the message (' + msg.join(', ') + ').',
            answer: code.join(','), normalise: normVec, note: '7 bits',
            placeholder: '(0, 1, 1, 0, 0, 1, 1)',
            hint: 'Compute the three check bits, then interleave: positions 1, 2, 4 are checks; positions 3, 5, 6, 7 carry a, b, c, d.',
            solution: 'a=' + msg[0] + ', b=' + msg[1] + ', c=' + msg[2] + ', d=' + msg[3] + '<br>' +
              'x = a+b+d = ' + msg[0] + '+' + msg[1] + '+' + msg[3] + ' = ' + code[0] + '<br>' +
              'y = a+c+d = ' + msg[0] + '+' + msg[2] + '+' + msg[3] + ' = ' + code[1] + '<br>' +
              'z = b+c+d = ' + msg[1] + '+' + msg[2] + '+' + msg[3] + ' = ' + code[3] + '<br>' +
              'Codeword = <b>' + vecStr(code) + '</b> (all arithmetic mod 2)'
          }),
          num({
            label: 'ii) a)', marks: 2,
            prompt: 'The word (' + recv.join(', ') + ') is received, with at most one error. In which position is the error? (Answer 0 if there is none.)',
            answer: errPos, dp: 0, integer: true,
            hint: 'Compute the syndrome Hc<sup>T</sup>; read as a binary number (bottom row is the most significant) it gives the position directly.',
            solution: (function () {
              var s = F.H74.map(function (row) {
                var t = 0;
                for (var i = 0; i < 7; i++) t += row[i] * recv[i];
                return t % 2;
              });
              return 'Syndrome: (' + s.join(', ') + ')<br>' +
                'Read as a binary number with the last row most significant: ' + s[2] + s[1] + s[0] +
                '<sub>2</sub> = <b>' + errPos + '</b>.<br>' +
                'That is the whole point of the column ordering — the i-th column of H is the binary representation of i.';
            })()
          }),
          txt({
            label: 'ii) b)', marks: 2,
            prompt: 'Correct the error and decode: what was the original 4-bit message (a, b, c, d)?',
            answer: dec.message.join(','), normalise: normVec, note: '4 bits',
            placeholder: '(1, 0, 0, 1)',
            traps: ([3, 5, 6, 7].indexOf(errPos) >= 0
              ? [{ value: [recv[2], recv[4], recv[5], recv[6]].join(','),
                   msg: 'You read the message positions straight off the received word without correcting the error first.' }]
              : []),
            solution: 'Flip position ' + errPos + ': corrected codeword = ' + vecStr(dec.codeword) + '<br>' +
              'The message sits in positions 3, 5, 6, 7: <b>' + vecStr(dec.message) + '</b>'
          }),
          txt({
            label: 'iii)', marks: 2,
            prompt: 'The information rate of a code is the number of information digits divided by the total number of digits. What is the information rate of the Hamming (' + r[0] + ', ' + r[1] + ') code?',
            answer: F.fracStr(rate), normalise: normFrac, note: 'a fraction',
            placeholder: 'p/q',
            solution: r[1] + ' information digits out of ' + r[0] + ' total, so the rate is <b>' + F.fracStr(rate) + '</b>' +
              ' ≈ ' + (rate.n / rate.d).toFixed(4) + '.<br>A Hamming code of length 2<sup>m</sup> − 1 has m check digits, so the rate rises towards 1 as m grows.'
          })
        ]
      };
    }
  };

  /* ================= T11: polynomial division & gcd ================= */

  var T_POLY = {
    id: 'poly-arith',
    topic: 'Polynomials',
    title: 'Division and gcd of polynomials over Z_p',
    marks: 6,
    build: function (rng) {
      var p = rng.pick([2, 2, 3]);
      var degA = rng.int(4, 6), degB = rng.int(2, 3);
      var mk = function (deg) {
        var c = [];
        for (var i = 0; i <= deg; i++) c.push(rng.int(0, p - 1));
        c[deg] = rng.int(1, p - 1);
        return c;
      };
      var A = mk(degA), B = mk(degB);
      var dm = F.pDivMod(A, B, p);
      if (!dm) return null;
      var g = F.pGcd(A, B, p);
      if (!F.pTrim(g).length) return null;

      var C = mk(rng.int(3, 4)), D = mk(rng.int(2, 3));
      var g2 = F.pGcd(C, D, p);
      if (F.pDeg(g2) < 1) return null;          // make the gcd interesting

      return {
        intro: '<p>All arithmetic below is in Z' + sub(p) + '[x] — coefficients are reduced mod ' + p + '.</p>' +
          '<p>Write polynomials like <code>x^3 + x + 1</code>. Any order of terms is accepted.</p>',
        data: [],
        parts: [
          txt({
            label: 'i)', marks: 3,
            prompt: 'Find the remainder when ' + PS(A) + ' is divided by ' + PS(B) + ' in Z' + sub(p) + '[x].',
            answer: F.pStr(dm.r), display: PS(dm.r), normalise: makePolyNorm(p),
            note: 'a polynomial in x', placeholder: 'x^2 + 1',
            hint: 'Long division. Remember every coefficient is reduced mod ' + p +
              (p === 2 ? ' — so subtraction is the same as addition.' : '.'),
            solution: 'Long division gives quotient ' + PS(dm.q) + ' and remainder <b>' + PS(dm.r) + '</b>.<br>' +
              'Check: (' + PS(B) + ')(' + PS(dm.q) + ') + ' + PS(dm.r) + ' = ' +
              PS(F.pAdd(F.pMul(B, dm.q, p), dm.r, p)) + ' ✓'
          }),
          txt({
            label: 'ii)', marks: 3,
            prompt: 'Use the Euclidean algorithm to find gcd(' + PS(C) + ', ' + PS(D) + ') in Z' + sub(p) + '[x]. Give the <b>monic</b> gcd.',
            answer: F.pStr(g2), display: PS(g2), normalise: makePolyNorm(p),
            note: 'a monic polynomial', placeholder: 'x + 1',
            hint: 'Same algorithm as for integers: divide, keep the remainder, repeat. Finally scale so the leading coefficient is 1.',
            solution: (function () {
              var rows = [], a = C.slice(), b = D.slice();
              while (F.pTrim(b).length) {
                var q2 = F.pDivMod(a, b, p);
                rows.push(PS(a) + ' = (' + PS(b) + ')(' + PS(q2.q) + ')' +
                  (F.pTrim(q2.r).length ? ' + ' + PS(q2.r) : ''));
                a = b; b = q2.r;
              }
              return rows.join('<br>') + '<br>The last non-zero remainder, made monic, is <b>' + PS(g2) + '</b>.';
            })()
          })
        ]
      };
    }
  };

  /* ================= T12: irreducibility ================= */

  var T_IRRED = {
    id: 'irreducibility',
    topic: 'Polynomials',
    title: 'Testing irreducibility',
    marks: 7,
    build: function (rng) {
      var p = rng.pick([2, 3, 5]);
      // a cubic (or quadratic) to test by looking for roots
      var deg = rng.int(2, 3);
      var f = null;
      for (var att = 0; att < 60 && !f; att++) {
        var c = [];
        for (var i = 0; i <= deg; i++) c.push(rng.int(0, p - 1));
        c[deg] = 1;
        c[0] = rng.int(1, p - 1);
        if (F.pIrreducible(c, p)) f = c;
      }
      if (!f) return null;
      var roots = [];
      for (var x = 0; x < p; x++) roots.push({ x: x, v: F.pEval(f, x, p) });

      var whyChoice = shuffleChoice(rng, [
        'It has degree ' + deg + ' and no roots in Z' + sub(p) + ', and for degree 2 or 3 that is enough.',
        'It has no roots in Z' + sub(p) + ', which proves irreducibility for a polynomial of any degree.',
        'Its coefficients are coprime.',
        'It is monic, so it cannot factor.'
      ], 0);

      // Eisenstein
      var q = rng.pick([2, 3, 5]);
      var lead = rng.int(2, 6);
      if (lead % q === 0) return null;
      var mid1 = q * rng.int(1, 6), mid2 = q * rng.int(1, 6);
      var aVal = rng.int(1, 5);
      var constTerm = q * aVal;
      if (constTerm % (q * q) === 0) return null;

      return {
        intro: '<p>Two standard irreducibility tests.</p>',
        data: [],
        parts: [
          txt({
            label: 'i) a)', marks: 2,
            prompt: 'Consider f(x) = ' + PS(f) + ' in Z' + sub(p) + '[x]. Evaluate f at every element of Z' + sub(p) +
              ' and list the values f(0), f(1), …, f(' + (p - 1) + ') in order.',
            answer: roots.map(function (r) { return r.v; }).join(','), normalise: normSeq,
            note: p + ' values, comma separated', placeholder: '1, 1, …',
            solution: roots.map(function (r) { return 'f(' + r.x + ') = ' + r.v; }).join(', ') +
              '<br>None is 0, so f has no roots in Z' + sub(p) + '.'
          }),
          mc({
            label: 'i) b)', marks: 2,
            prompt: 'Why does that show f(x) is irreducible over Z' + sub(p) + '?',
            options: whyChoice.options, correct: whyChoice.correct,
            solution: 'A factorisation of a degree-2 or degree-3 polynomial must include a <b>linear</b> factor, and a linear factor means a root. ' +
              'So for degrees 2 and 3 only, "no roots" is equivalent to irreducible. ' +
              'From degree 4 on this fails — e.g. (x²+x+1)² has no roots but is reducible.'
          }),
          num({
            label: 'ii)', marks: 3,
            prompt: 'Consider g(x) = ' + lead + 'x<sup>4</sup> + ' + mid1 + 'x<sup>3</sup> + ' + mid2 + 'x + 2a over Q. ' +
              'Using Eisenstein’s criterion with the prime ' + q + ', find a value of a that makes g irreducible. ' +
              'Give the smallest positive such a.',
            answer: (function () {
              for (var A = 1; A < 200; A++) {
                var ct = 2 * A;
                if (ct % q === 0 && ct % (q * q) !== 0) return A;
              }
              return 1;
            })(),
            dp: 0, integer: true,
            hint: 'Eisenstein with prime q needs: q ∤ (leading coefficient), q | (every other coefficient), and q² ∤ (constant term).',
            solution: 'Eisenstein at q = ' + q + ' requires ' + q + ' ∤ ' + lead + ' ✓, ' + q + ' | ' + mid1 + ' and ' + q + ' | ' + mid2 +
              ' ✓, and ' + q + ' | 2a but ' + q + '² ∤ 2a.<br>The smallest positive a with 2a divisible by ' + q + ' but not by ' + (q * q) +
              ' is <b>a = ' + (function () {
                for (var A = 1; A < 200; A++) { var ct = 2 * A; if (ct % q === 0 && ct % (q * q) !== 0) return A; }
                return 1;
              })() + '</b>.'
          })
        ]
      };
    }
  };

  /* ================= T13: finite field arithmetic ================= */

  var T_FIELD = {
    id: 'finite-field',
    topic: 'Finite fields',
    title: 'Arithmetic in a finite field',
    marks: 12,
    build: function (rng) {
      var setups = [
        { p: 2, f: [1, 0, 1, 1] },      // x^3 + x^2 + 1
        { p: 2, f: [1, 1, 0, 1] },      // x^3 + x + 1
        { p: 2, f: [1, 0, 0, 1, 1] },   // x^4 + x^3 + 1
        { p: 2, f: [1, 1, 0, 0, 1] },   // x^4 + x + 1
        { p: 3, f: [2, 1, 1] },         // x^2 + x + 2
        { p: 3, f: [2, 0, 1, 1] },      // x^3 + x^2 + 2
        { p: 5, f: [1, 1, 1] }          // x^2 + x + 1
      ];
      var st = rng.pick(setups);
      var p = st.p, f = st.f, deg = F.pDeg(f);
      if (!F.pIrreducible(f, p)) return null;
      var q = Math.pow(p, deg), N = q - 1;

      var alpha = [0, 1];
      var ordAlpha = F.ffOrder(alpha, f, p);
      var k = rng.int(deg, N - 1);
      var powK = F.ffPow(alpha, k, f, p);

      // an element to invert
      var inv = null, target = null;
      for (var att = 0; att < 40 && !inv; att++) {
        var t = [];
        for (var i = 0; i < deg; i++) t.push(rng.int(0, p - 1));
        if (!F.pTrim(t).length) continue;
        if (F.pDeg(t) < 1) continue;
        target = F.pMod(t, p);
        inv = F.ffInverse(target, f, p);
      }
      if (!inv) return null;

      var bigExp = rng.int(1500, 2500);
      var bigVal = F.ffPow(alpha, bigExp % ordAlpha, f, p);

      // a primitive-element question
      var cand = F.ffPow(alpha, rng.int(2, N - 1), f, p);
      var ordCand = F.ffOrder(cand, f, p);

      var whyField = shuffleChoice(rng, [
        'f(x) is irreducible over Z' + sub(p) + ', so the ideal ⟨f⟩ is maximal and the quotient is a field.',
        'f(x) is monic, so the quotient is a field.',
        'Z' + sub(p) + ' is a field, so every quotient of Z' + sub(p) + '[x] is a field.',
        'f(x) has a root in Z' + sub(p) + ', so the quotient is a field.'
      ], 0);

      var primChoice = shuffleChoice(rng, [
        ordCand === N ? 'Yes — its order is ' + N + ' = |F<sup>∗</sup>|.' : 'No — its order is ' + ordCand + ', not ' + N + '.',
        ordCand === N ? 'No — its order is ' + Math.max(1, Math.floor(N / 2)) + '.' : 'Yes — its order is ' + N + '.',
        'It cannot be decided without listing every power.',
        'Yes — every non-zero element of a finite field is primitive.'
      ], 0);

      return {
        intro: '<p>Let f(x) = ' + PS(f) + ' in Z' + sub(p) + '[x], and let F = Z' + sub(p) + '[x]/⟨f(x)⟩. ' +
          'Write α for the image of x in F, so f(α) = 0.</p>' +
          '<p>Give answers as a polynomial in α of degree less than ' + deg + ' — type <code>a</code> for α, e.g. <code>a^2 + a + 1</code>.</p>',
        data: [],
        parts: [
          mc({
            label: 'i)', marks: 1,
            prompt: 'Why is F a field?',
            options: whyField.options, correct: whyField.correct,
            solution: 'Z' + sub(p) + '[x] is a principal ideal domain, so ⟨f⟩ is maximal exactly when f is irreducible — and a quotient by a maximal ideal is a field. ' +
              'f has degree ' + deg + ' and no roots in Z' + sub(p) + (deg > 3 ? ', and no irreducible quadratic factor either' : '') + '.'
          }),
          num({
            label: 'ii)', marks: 1,
            prompt: 'How many elements does F have?',
            answer: q, dp: 0, integer: true,
            traps: [{ value: p * deg, msg: 'You multiplied. Each of the ' + deg + ' coefficients independently takes ' + p + ' values, so it is ' + p + '<sup>' + deg + '</sup>.' }],
            solution: 'Elements are polynomials of degree < ' + deg + ' with coefficients in Z' + sub(p) +
              ', so |F| = ' + p + '<sup>' + deg + '</sup> = <b>' + q + '</b>.'
          }),
          txt({
            label: 'iii) a)', marks: 2,
            prompt: 'Express α<sup>' + k + '</sup> in terms of 1, α' + (deg > 2 ? ', …, α^' + (deg - 1) : '') + '.',
            answer: F.pStr(powK), display: PS(powK, 'α'), normalise: makePolyNorm(p),
            note: 'polynomial in a', placeholder: 'a^2 + 1',
            hint: 'Use f(α) = 0 to rewrite α<sup>' + deg + '</sup>, then reduce repeatedly.',
            solution: 'From f(α) = 0 we get α<sup>' + deg + '</sup> = ' +
              PS(F.pMod(f.slice(0, deg).map(function (c) { return (p - c) % p; }), p), 'α') + '.<br>' +
              'Reducing step by step: α<sup>' + k + '</sup> = <b>' + PS(powK, 'α') + '</b>'
          }),
          txt({
            label: 'iii) b)', marks: 2,
            prompt: 'Compute α<sup>' + bigExp + '</sup>.',
            answer: F.pStr(bigVal), display: PS(bigVal, 'α'), normalise: makePolyNorm(p),
            note: 'polynomial in a', placeholder: 'a + 1',
            hint: 'α has order ' + ordAlpha + ', so reduce the exponent modulo ' + ordAlpha + ' first.',
            solution: 'The order of α is ' + ordAlpha + ', so α<sup>' + ordAlpha + '</sup> = 1 and only ' +
              bigExp + ' mod ' + ordAlpha + ' = ' + (bigExp % ordAlpha) + ' matters.<br>' +
              'α<sup>' + bigExp + '</sup> = α<sup>' + (bigExp % ordAlpha) + '</sup> = <b>' + PS(bigVal, 'α') + '</b>'
          }),
          txt({
            label: 'iv)', marks: 3,
            prompt: 'Find the inverse of ' + PS(target, 'α') + ' in F.',
            answer: F.pStr(inv), display: PS(inv, 'α'), normalise: makePolyNorm(p),
            note: 'polynomial in a', placeholder: 'a^2 + a',
            hint: 'Either run the extended Euclidean algorithm on f(x) and this polynomial, or write both as powers of α and subtract exponents.',
            solution: 'Extended Euclid on f(x) and ' + PS(target) + ' gives ' +
              '(' + PS(target, 'α') + ')(' + PS(inv, 'α') + ') ≡ 1.<br>' +
              'Check: the product reduces to ' + PS(F.ffMul(target, inv, f, p), 'α') + ' ✓<br>' +
              'Answer: <b>' + PS(inv, 'α') + '</b>'
          }),
          num({
            label: 'v) a)', marks: 2,
            prompt: 'What is the order of ' + PS(cand, 'α') + ' in F<sup>∗</sup>?',
            answer: ordCand, dp: 0, integer: true,
            hint: 'The order divides |F*| = ' + N + '. Check the divisors in increasing order.',
            solution: '|F<sup>∗</sup>| = ' + N + ', so the order divides ' + N + ' (divisors: ' + F.divisors(N).join(', ') + '). ' +
              'The smallest exponent giving 1 is <b>' + ordCand + '</b>.'
          }),
          mc({
            label: 'v) b)', marks: 1,
            prompt: 'Is ' + PS(cand, 'α') + ' a primitive element of F?',
            options: primChoice.options, correct: primChoice.correct,
            solution: 'Primitive means the order equals |F<sup>∗</sup>| = ' + N + '. Here the order is ' + ordCand +
              ', so it is ' + (ordCand === N ? '' : '<b>not</b> ') + 'primitive.'
          })
        ]
      };
    }
  };

  /* ================= registry ================= */

  var TEMPLATES = [T_GCD, T_BASES, T_PERIODIC, T_CF, T_DIO, T_CRT, T_PHI,
                   T_RSA, T_PRIM, T_HAMMING, T_POLY, T_IRRED, T_FIELD];


  /* ================= method guides =================
     Each is shown behind the "How to do this" toggle. Worked examples use real
     past-paper numbers, and every value in them is checked by the engine. */

  function WE(q, rows, ans) {
    var t = '<div class="wq">' + q + '</div><table>';
    rows.forEach(function (r) {
      t += '<tr><td>' + r[0] + '</td><td class="c">' + (r[1] || '') + '</td></tr>';
    });
    t += '</table>';
    return t + (ans ? '<div class="ans">' + ans + '</div>' : '');
  }

  var GUIDES = {

    'gcd-euclid': {
      idea: 'The gcd is the largest number dividing both. You need it two ways: the <b>Euclidean algorithm</b> when you are handed two plain numbers, and <b>comparing prime factorisations</b> when the numbers arrive already written as products.',
      steps: [
        'Divide the larger by the smaller and write it as <code>a = q·b + r</code>.',
        'Throw away <code>a</code>: the pair becomes <code>(b, r)</code>. Repeat.',
        'Stop when the remainder is 0. The gcd is the <b>last non-zero remainder</b> — not the last quotient.',
        'If instead the numbers are given as products of powers, factor each into primes and take the <b>minimum</b> exponent of every prime they share.',
        'Check: divide both original numbers by your answer and confirm both come out whole.'
      ],
      worked: WE('Find gcd(846, 402).  <span class="c">[2020 exam]</span>', [
        ['846 = <b>2</b> × 402 + <b>42</b>', 'divide, keep the remainder 42'],
        ['402 = <b>9</b> × 42 + <b>24</b>', 'now work with (402, 42)'],
        ['42 = <b>1</b> × 24 + <b>18</b>', ''],
        ['24 = <b>1</b> × 18 + <b>6</b>', ''],
        ['18 = <b>3</b> × 6 + <b>0</b>', 'remainder hits 0 — stop']
      ], 'The last non-zero remainder is 6, so gcd(846, 402) = 6. Check: 846 = 6×141 and 402 = 6×67. ✓') +
        WE('Find gcd(4<sup>3</sup>·9<sup>3</sup>·15, &nbsp; 3<sup>3</sup>·12<sup>2</sup>·13).  <span class="c">[2020 exam]</span>', [
          ['4<sup>3</sup>·9<sup>3</sup>·15 = (2<sup>2</sup>)<sup>3</sup>·(3<sup>2</sup>)<sup>3</sup>·(3·5) = 2<sup>6</sup>·3<sup>7</sup>·5', 'break everything down to primes'],
          ['3<sup>3</sup>·12<sup>2</sup>·13 = 3<sup>3</sup>·(2<sup>2</sup>·3)<sup>2</sup>·13 = 2<sup>4</sup>·3<sup>5</sup>·13', ''],
          ['shared primes: 2 and 3', '5 and 13 appear in only one, so they are out'],
          ['2: min(6, 4) = 4 &nbsp;&nbsp; 3: min(7, 5) = 5', 'minimum, because the gcd must divide both']
        ], 'gcd = 2<sup>4</sup>·3<sup>5</sup> = 3888'),
      traps: [
        'Taking the <b>maximum</b> exponent gives the lcm, not the gcd.',
        'The gcd is the last non-zero <b>remainder</b>. Reading off the last quotient instead is a classic slip.',
        'Never expand a factorised number into a single huge integer — you throw away the structure that makes the question easy.'
      ]
    },

    'bases': {
      idea: 'Base <i>b</i> just means "how many groups of <i>b</i>". For the whole part you repeatedly <b>divide</b> by b and collect remainders; for the fractional part you repeatedly <b>multiply</b> by b and collect whole parts.',
      steps: [
        'Whole part: divide by b, write down the remainder, keep the quotient. Repeat until the quotient is 0.',
        'Read the remainders <b>bottom to top</b> — the last one you found is the leading digit.',
        'To convert base b to base b<sup>2</sup> (or b<sup>k</sup>): group the base-b digits into pairs (k-tuples) <b>from the right</b>, padding with zeros on the left, and convert each group to one digit.',
        'Fractional part: multiply the remainder by b; the whole part of the result is the next digit; keep the new fractional part and repeat.',
        'When a remainder you have seen before comes back, the digits from that point on repeat for ever — mark that block with an overline.'
      ],
      worked: WE('Write 375 in base 2, then use that to write it in base 4.  <span class="c">[2017 exam]</span>', [
        ['375 = 2×187 + <b>1</b>', 'remainders, bottom-up, give the digits'],
        ['187 = 2×93 + <b>1</b>', ''],
        ['93 = 2×46 + <b>1</b>', ''],
        ['46 = 2×23 + <b>0</b>', ''],
        ['23 = 2×11 + <b>1</b>', ''],
        ['11 = 2×5 + <b>1</b>', ''],
        ['5 = 2×2 + <b>1</b>', ''],
        ['2 = 2×1 + <b>0</b>', ''],
        ['1 = 2×0 + <b>1</b>', 'quotient is 0 — stop'],
        ['375 = (101110111)<sub>2</sub>', 'reading upwards'],
        ['pair from the RIGHT: 01|01|11|01|11', 'pad the left with a 0 to make 10 digits'],
        ['01→1, 01→1, 11→3, 01→1, 11→3', 'each pair is one base-4 digit']
      ], '375 = (11313)<sub>4</sub>') +
        WE('Write 23/7 in base 3.  <span class="c">[2020 exam]</span>', [
          ['23 ÷ 7 = 3 remainder 2', 'whole part 3 = (10)<sub>3</sub>, fraction 2/7'],
          ['2/7 × 3 = 6/7 → digit <b>0</b>, left with 6/7', 'multiply, take the whole part'],
          ['6/7 × 3 = 18/7 = 2 + 4/7 → digit <b>2</b>, left with 4/7', ''],
          ['4/7 × 3 = 12/7 = 1 + 5/7 → digit <b>1</b>, left with 5/7', ''],
          ['5/7 × 3 = 15/7 = 2 + 1/7 → digit <b>2</b>, left with 1/7', ''],
          ['1/7 × 3 = 3/7 → digit <b>0</b>, left with 3/7', ''],
          ['3/7 × 3 = 9/7 = 1 + 2/7 → digit <b>1</b>, left with 2/7', 'the remainder 2/7 is back — everything repeats now']
        ], '23/7 = (10.<span class="ovl">021201</span>)<sub>3</sub>'),
      traps: [
        'Group digits from the <b>right</b>, not the left, when moving to a power base — pad the left with zeros.',
        'For fractions you multiply, not divide. Mixing the two up is the single most common error here.',
        'The period starts when a <b>remainder</b> repeats, which may be after a few non-repeating digits.'
      ]
    },

    'periodic-base': {
      idea: 'This is the previous question run backwards. A repeating block is an infinite geometric series, and summing it gives a clean fraction — you never need decimals.',
      steps: [
        'Split the number into three pieces: the whole part, the <b>non-repeating</b> digits after the point (say k of them), and the <b>repeating</b> block (say r digits).',
        'Whole part: convert normally.',
        'Non-repeating digits: their value as a base-b integer, divided by b<sup>k</sup>.',
        'Repeating block: its value as a base-b integer P, divided by <b>b<sup>k</sup>(b<sup>r</sup> − 1)</b>.',
        'Add the three pieces and reduce to lowest terms.'
      ],
      worked: WE('Write (0.2<span class="ovl">0121</span>)<sub>3</sub> as a rational.  <span class="c">[2020 exam]</span>', [
        ['whole part = 0', ''],
        ['non-repeating: "2", so k = 1', 'value (2)<sub>3</sub> = 2, giving 2/3<sup>1</sup> = 2/3'],
        ['repeating: "0121", so r = 4', 'value (0121)<sub>3</sub> = 0·27 + 1·9 + 2·3 + 1 = 16'],
        ['denominator = 3<sup>k</sup>(3<sup>r</sup> − 1) = 3(81 − 1) = 240', 'this is the geometric-series denominator'],
        ['repeating piece = 16/240 = 1/15', ''],
        ['total = 2/3 + 1/15 = 10/15 + 1/15', 'common denominator']
      ], '(0.2<span class="ovl">0121</span>)<sub>3</sub> = 11/15'),
      traps: [
        'k counts the digits <b>between the point and the start of the overline</b> — often 0, but not always.',
        'The denominator is b<sup>r</sup> − 1, not b<sup>r</sup>. For a pure decimal repeat of 3 digits in base 10 that is 999, which is the same rule you already know.',
        'Reduce at the end — an unreduced fraction is usually marked wrong.'
      ]
    },

    'continued-fractions': {
      idea: 'A continued fraction is the Euclidean algorithm wearing a different hat: the partial quotients <i>are</i> the quotients you get dividing. Rationals give a finite list; quadratic irrationals give an eventually repeating one.',
      steps: [
        'For a rational n/d: take the whole part, subtract it, invert what is left, repeat. The whole parts you collect are the answer [a<sub>0</sub>; a<sub>1</sub>, a<sub>2</sub>, …].',
        'Equivalently: run the Euclidean algorithm on (n, d) and read off the quotients in order.',
        'For a <b>periodic</b> continued fraction, call the repeating tail y and write y in terms of itself — this gives a quadratic equation.',
        'Solve it and keep the <b>positive</b> root.',
        'Substitute that y back through the non-repeating head, then rationalise the denominator to reach the form (a + b√c)/d.'
      ],
      worked: WE('Expand 119/65 as a continued fraction.  <span class="c">[2020 exam]</span>', [
        ['119/65 = <b>1</b> + 54/65', 'whole part 1, invert 54/65'],
        ['65/54 = <b>1</b> + 11/54', ''],
        ['54/11 = <b>4</b> + 10/11', ''],
        ['11/10 = <b>1</b> + 1/10', ''],
        ['10/1 = <b>10</b>', 'exact — stop']
      ], '119/65 = [1; 1, 4, 1, 10]') +
        WE('Evaluate [2; <span class="ovl">4, 1</span>].  <span class="c">[2020 exam]</span>', [
          ['let y = [<span class="ovl">4, 1</span>]', 'the purely repeating tail'],
          ['y = 4 + 1/(1 + 1/y)', 'one full period, ending in y again'],
          ['y = 4 + y/(y + 1) = (5y + 4)/(y + 1)', 'tidy up'],
          ['y(y + 1) = 5y + 4 → y<sup>2</sup> − 4y − 4 = 0', 'the quadratic'],
          ['y = (4 + √32)/2 = 2 + 2√2 ≈ 4.828', 'positive root only'],
          ['x = 2 + 1/y = 2 + 1/(2 + 2√2)', 'now the head'],
          ['1/(2 + 2√2) × (2 − 2√2)/(2 − 2√2) = (2 − 2√2)/(−4) = (√2 − 1)/2', 'rationalise'],
          ['x = 2 + (√2 − 1)/2 = (4 + √2 − 1)/2', '']
        ], '[2; <span class="ovl">4, 1</span>] = (3 + √2)/2 ≈ 2.2071'),
      traps: [
        'Read the overline carefully — it tells you exactly which terms repeat, and getting it wrong changes the answer entirely.',
        'A continued fraction value is positive, so discard the negative root of the quadratic.',
        'Do not stop before rationalising: the answer must have no surd in the denominator.'
      ]
    },

    'diophantine': {
      idea: 'ax + by = c asks for <b>integer</b> solutions. There are either none or infinitely many: none when gcd(a,b) does not divide c, otherwise a whole family you get by sliding one solution along.',
      steps: [
        'Compute g = gcd(a, b). If g does not divide c there are no solutions — say so and stop.',
        'Run the <b>extended</b> Euclidean algorithm to write a·x<sub>0</sub> + b·y<sub>0</sub> = g.',
        'Multiply through by c/g to get one actual solution.',
        'The general solution is x = x<sub>0</sub> + (b/g)k, &nbsp; y = y<sub>0</sub> − (a/g)k for every integer k. Note the coefficients <b>swap</b>, and one gets a minus sign.',
        'For positive solutions, impose x > 0 and y > 0 as two inequalities on k, and count the integers k in between.'
      ],
      worked: WE('Find all integer solutions of 5x + 7y = 31, then all positive ones.  <span class="c">[2020 exam]</span>', [
        ['gcd(5, 7) = 1, and 1 divides 31', 'so solutions exist'],
        ['extended Euclid: 5(3) + 7(−2) = 1', 'one combination giving the gcd'],
        ['× 31: 5(93) + 7(−62) = 31', 'so x = 93, y = −62 works'],
        ['reduce x modulo 7: 93 = 13×7 + 2 → x = 2', 'the smallest non-negative x'],
        ['y = (31 − 5×2)/7 = 21/7 = 3', 'the matching y'],
        ['general: (x, y) = (2 + 7k, 3 − 5k)', 'x steps by 7 (the y-coefficient), y by −5'],
        ['positive: 2 + 7k > 0 → k ≥ 0; &nbsp; 3 − 5k > 0 → k < 0.6', 'so k = 0 only']
      ], 'All solutions: (2 + 7k, 3 − 5k), k ∈ Z. &nbsp; Positive: (2, 3) only.'),
      traps: [
        'The step sizes swap: x moves by b/g and y by a/g. Writing (2 + 5k, 3 − 7k) is the commonest error.',
        'One of the two steps is <b>negative</b> — if both have the same sign, substitute back and you will see it fail.',
        'Always substitute your answer into the original equation. It takes five seconds and catches everything.'
      ]
    },

    'congruences': {
      idea: 'Each congruence pins x down modulo one number. The Chinese Remainder Theorem glues those partial descriptions into a single one, modulo the <b>product</b> of the moduli.',
      steps: [
        'Clear the coefficient in each congruence: to solve cx ≡ a (mod m), multiply both sides by c<sup>−1</sup> mod m. That inverse exists exactly when gcd(c, m) = 1.',
        'You now have x ≡ r<sub>1</sub> (mod m<sub>1</sub>), x ≡ r<sub>2</sub> (mod m<sub>2</sub>), …',
        'Take the largest modulus, write x = r + m·t, and substitute into the next congruence.',
        'Solve for t, substitute back, and repeat until every congruence is used.',
        'The final answer is a single congruence modulo m<sub>1</sub>m<sub>2</sub>… (valid because the moduli are coprime).'
      ],
      worked: WE('Solve 2x ≡ −1 (mod 5) and 3x ≡ 7 (mod 11).  <span class="c">[2020 exam]</span>', [
        ['−1 ≡ 4 (mod 5), so 2x ≡ 4 (mod 5)', 'make the right side positive first'],
        ['2<sup>−1</sup> mod 5 = 3, since 2×3 = 6 ≡ 1', 'find the inverse by inspection'],
        ['x ≡ 3×4 = 12 ≡ <b>2</b> (mod 5)', 'first congruence cleared'],
        ['3<sup>−1</sup> mod 11 = 4, since 3×4 = 12 ≡ 1', ''],
        ['x ≡ 4×7 = 28 ≡ <b>6</b> (mod 11)', 'second congruence cleared'],
        ['write x = 6 + 11t', 'start from the larger modulus'],
        ['6 + 11t ≡ 2 (mod 5) → 1 + t ≡ 2 → t ≡ 1 (mod 5)', '11 ≡ 1 and 6 ≡ 1 mod 5'],
        ['t = 1 → x = 6 + 11 = 17', '']
      ], 'x ≡ 17 (mod 55). &nbsp; Check: 2×17 = 34 ≡ 4 ≡ −1 (mod 5) ✓ and 3×17 = 51 ≡ 7 (mod 11) ✓'),
      traps: [
        'The combined modulus is the <b>product</b> 5×11 = 55. Adding the moduli is a surprisingly common slip.',
        'You cannot divide by the coefficient — you multiply by its inverse, which only exists when gcd(c, m) = 1.',
        'Substituting into the <b>largest</b> modulus first keeps the numbers small.'
      ]
    },

    'phi-orders': {
      idea: 'Two ideas that keep reappearing: φ(n) counts the numbers below n coprime to n (so it is the size of the unit group), and by Lagrange every element order must <b>divide</b> the size of the group it lives in.',
      steps: [
        'Factor n into prime powers.',
        'φ(n) = ∏ p<sup>e−1</sup>(p − 1) over those prime powers. Do it prime by prime and multiply.',
        'Possible orders of units modulo n: the divisors of φ(n).',
        'Possible orders in the field F<sub>q</sub><sup>∗</sup>: the divisors of <b>q − 1</b>, because the group has q − 1 elements and is cyclic.',
        'A field with exactly n elements exists precisely when n is a <b>prime power</b>.',
        'For a huge power a<sup>N</sup> mod n with gcd(a, n) = 1, use Euler: a<sup>φ(n)</sup> ≡ 1, so replace N by N mod φ(n).'
      ],
      worked: WE('Compute φ(2400), and list the possible element orders in Z<sub>27</sub><sup>∗</sup> and in F<sub>27</sub><sup>∗</sup>.  <span class="c">[2020 exam]</span>', [
        ['2400 = 2<sup>5</sup> · 3 · 5<sup>2</sup>', 'factor first, always'],
        ['φ(2<sup>5</sup>) = 2<sup>4</sup>(2 − 1) = 16', 'prime by prime'],
        ['φ(3) = 3<sup>0</sup>(3 − 1) = 2', ''],
        ['φ(5<sup>2</sup>) = 5<sup>1</sup>(5 − 1) = 20', ''],
        ['φ(2400) = 16 × 2 × 20 = <b>640</b>', 'φ is multiplicative over coprime factors'],
        ['Z<sub>27</sub><sup>∗</sup> has φ(27) = 3<sup>2</sup>·2 = 18 elements', 'so orders divide 18'],
        ['divisors of 18: <b>1, 2, 3, 6, 9, 18</b>', ''],
        ['F<sub>27</sub><sup>∗</sup> has 27 − 1 = 26 elements', 'note: 26, not 27'],
        ['divisors of 26: <b>1, 2, 13, 26</b>', '']
      ], 'φ(2400) = 640; orders in Z<sub>27</sub><sup>∗</sup> are 1,2,3,6,9,18; orders in F<sub>27</sub><sup>∗</sup> are 1,2,13,26.'),
      traps: [
        'For the multiplicative group of a field, use the divisors of <b>q − 1</b>. Using the divisors of q is the standard mistake.',
        'φ(N) = N − 1 only when N is <b>prime</b>. For N = pq it is (p−1)(q−1).',
        'Z<sub>27</sub> and F<sub>27</sub> are different objects: Z<sub>27</sub> is not a field (3 × 9 = 0), while F<sub>27</sub> is built as polynomials over Z<sub>3</sub>.'
      ]
    },

    'rsa': {
      idea: 'RSA encrypts with m ↦ m<sup>e</sup> mod N where N = pq. Decryption uses an exponent d with ed ≡ 1 (mod φ(N)) — and finding d needs φ(N), which needs the factorisation of N. That is the whole security story.',
      steps: [
        'Factor N = pq. (In the exam N is small, so trial division works.)',
        'φ(N) = (p − 1)(q − 1).',
        'A valid encryption exponent e must satisfy <b>gcd(e, φ(N)) = 1</b>. If asked for the smallest, test e = 2, 3, 5, … in turn.',
        'The decryption exponent is d ≡ e<sup>−1</sup> (mod φ(N)) — get it with the extended Euclidean algorithm.',
        'To decrypt a ciphertext c, compute c<sup>d</sup> mod N by square-and-multiply.',
        'Always check ed ≡ 1 (mod φ(N)) before using d.'
      ],
      worked: WE('N = 221 with encryption m ↦ m<sup>77</sup>. Find the decryption function, then decrypt c = 3.  <span class="c">[2020 exam]</span>', [
        ['221 = 13 × 17', 'trial division: not divisible by 2,3,5,7,11; 221/13 = 17'],
        ['φ(221) = 12 × 16 = <b>192</b>', '(p−1)(q−1), not 220'],
        ['gcd(77, 192) = 1', 'so 77 is a valid exponent'],
        ['solve 77d ≡ 1 (mod 192)', 'extended Euclid on 77 and 192'],
        ['192 = 2×77 + 38; 77 = 2×38 + 1', 'so 1 = 77 − 2×38 = 77 − 2(192 − 2×77) = 5×77 − 2×192'],
        ['d = <b>5</b>', 'check: 77×5 = 385 = 2×192 + 1 ✓'],
        ['decrypt: m = 3<sup>5</sup> mod 221 = 243 mod 221', '']
      ], 'Decryption is c ↦ c<sup>5</sup> mod 221, and c = 3 decrypts to m = 22.'),
      traps: [
        'φ(N) = (p−1)(q−1). Using N − 1 only works if N is prime, which it never is here.',
        'e must be coprime to <b>φ(N)</b>, not to N.',
        'If p and q have a special form (say both near a power of 2), N can be factored quickly — that is what the "break this scheme" questions are testing.'
      ]
    },

    'primitive': {
      idea: 'A primitive root modulo p is a generator: its powers run through every non-zero residue. Equivalently its multiplicative order is exactly p − 1. The efficient test only checks a handful of exponents.',
      steps: [
        'Factor p − 1 into primes. Suppose the distinct primes are q<sub>1</sub>, …, q<sub>k</sub>.',
        'a is a primitive root exactly when a<sup>(p−1)/q<sub>i</sub></sup> ≢ 1 (mod p) for <b>every</b> one of those primes.',
        'If any of them gives 1, the order is a proper divisor and a is not primitive.',
        'Once you know one primitive root g, the element g<sup>k</sup> is primitive exactly when <b>gcd(k, p − 1) = 1</b>.',
        'More generally g<sup>k</sup> has order (p − 1)/gcd(k, p − 1). There are φ(p − 1) primitive roots in total.'
      ],
      worked: WE('Prove 2 is a primitive root modulo 19.  <span class="c">[2020 exam]</span>', [
        ['19 − 1 = 18 = 2 · 3<sup>2</sup>', 'distinct primes: 2 and 3'],
        ['only two exponents to test: 18/2 = 9 and 18/3 = 6', 'not all of 1…18'],
        ['2<sup>9</sup> = 512 = 26×19 + 18 → 18 ≢ 1', 'passes'],
        ['2<sup>6</sup> = 64 = 3×19 + 7 → 7 ≢ 1', 'passes']
      ], 'Neither is 1, so the order of 2 is not a proper divisor of 18 — it is 18. So 2 is a primitive root.') +
        WE('Given 2 is a primitive root mod 83, which of 32 and 64 are primitive?  <span class="c">[2022 exam, adapted]</span>', [
          ['83 − 1 = 82 = 2 × 41', ''],
          ['32 = 2<sup>5</sup>, and gcd(5, 82) = 1', 'so it is primitive'],
          ['64 = 2<sup>6</sup>, and gcd(6, 82) = 2', 'not primitive — order 82/2 = 41']
        ], '32 is a primitive root; 64 is not.'),
      traps: [
        'a<sup>p−1</sup> ≡ 1 holds for <b>every</b> unit by Fermat, so checking it tells you nothing at all.',
        'Only test the exponents (p−1)/q for <b>prime</b> q. Testing every divisor wastes time; testing too few gives a wrong answer.',
        'When the question hands you a table of a<sup>(p−1)/q</sup> values, you are meant to read the answer off it — no computation needed.'
      ]
    },

    'hamming': {
      idea: 'Three check bits are placed so that the "syndrome" you compute on a received word, read as a binary number, <b>is the position of the corrupted bit</b>. That is why the columns of H are the binary numbers 1 to 7 in order.',
      steps: [
        'To encode (a, b, c, d): compute x = a+b+d, y = a+c+d, z = b+c+d, all mod 2.',
        'Assemble the codeword as (x, y, a, z, b, c, d) — check bits sit in positions 1, 2, 4 and the message in positions 3, 5, 6, 7.',
        'To decode: multiply the received word by H, i.e. compute three sums mod 2 (one per row).',
        'Read the syndrome as a binary number with the <b>first row as the least significant bit</b>: position = s<sub>1</sub> + 2s<sub>2</sub> + 4s<sub>3</sub>.',
        'If it is 0 there was no error. Otherwise flip that bit — <b>then</b> read the message off positions 3, 5, 6, 7.'
      ],
      worked: WE('Encode (1, 0, 0, 1).  <span class="c">[2020 exam]</span>', [
        ['a=1, b=0, c=0, d=1', ''],
        ['x = a+b+d = 1+0+1 = 2 ≡ <b>0</b>', 'everything mod 2'],
        ['y = a+c+d = 1+0+1 = 2 ≡ <b>0</b>', ''],
        ['z = b+c+d = 0+0+1 = <b>1</b>', ''],
        ['codeword = (x, y, a, z, b, c, d)', '']
      ], '(1,0,0,1) encodes to (0, 0, 1, 1, 0, 0, 1)') +
        WE('Decode (1, 1, 1, 0, 0, 0, 1), assuming at most one error.  <span class="c">[2020 exam]</span>', [
          ['row 1 covers positions 1,3,5,7: 1+1+0+1 = 3 ≡ <b>1</b>', 'the odd-numbered positions'],
          ['row 2 covers positions 2,3,6,7: 1+1+0+1 = 3 ≡ <b>1</b>', ''],
          ['row 3 covers positions 4,5,6,7: 0+0+0+1 = <b>1</b>', ''],
          ['syndrome (1, 1, 1) → 1 + 2 + 4 = <b>7</b>', 'so position 7 is wrong'],
          ['flip position 7: (1,1,1,0,0,0,<b>0</b>)', 'correct it FIRST'],
          ['message = positions 3, 5, 6, 7', '']
        ], 'The original message was (1, 0, 0, 0).'),
      traps: [
        'Correct the error <b>before</b> reading off the message digits. Reading them straight from the received word is the most common lost mark here.',
        'The syndrome bit order matters: the first row is the 1s bit, the third row is the 4s bit.',
        'A syndrome of (0,0,0) means no error was detected — not an error in position 0.'
      ]
    },

    'poly-arith': {
      idea: 'Polynomials over Z<sub>p</sub> behave just like integers: you can divide with remainder and run the Euclidean algorithm. The only new thing is that every coefficient is reduced mod p — and in Z<sub>2</sub>, subtracting is the same as adding.',
      steps: [
        'Long division: divide the leading term of the remainder by the leading term of the divisor to get the next quotient term.',
        'Multiply the divisor by that term and subtract, reducing coefficients mod p.',
        'Repeat while the remainder still has degree ≥ the divisor. What is left is the remainder.',
        'For a gcd, run the same algorithm repeatedly: (a, b) → (b, remainder), exactly as for integers.',
        'The gcd is the last non-zero remainder, scaled so its leading coefficient is 1 (<b>monic</b>).'
      ],
      worked: WE('Find the remainder of x<sup>5</sup> + x<sup>3</sup> + x<sup>2</sup> + 1 on division by x<sup>3</sup> + x + 1 in Z<sub>2</sub>[x].  <span class="c">[2019 exam]</span>', [
        ['x<sup>5</sup> ÷ x<sup>3</sup> = x<sup>2</sup>', 'first quotient term'],
        ['x<sup>2</sup>(x<sup>3</sup> + x + 1) = x<sup>5</sup> + x<sup>3</sup> + x<sup>2</sup>', ''],
        ['(x<sup>5</sup>+x<sup>3</sup>+x<sup>2</sup>+1) + (x<sup>5</sup>+x<sup>3</sup>+x<sup>2</sup>) = 1', 'in Z<sub>2</sub> subtracting is adding; everything cancels'],
        ['degree 0 < 3, so stop', '']
      ], 'Quotient x<sup>2</sup>, remainder <b>1</b>.') +
        WE('Find gcd(x<sup>3</sup> + 1, &nbsp; x<sup>5</sup> + x) in Z<sub>2</sub>[x].  <span class="c">[2020 exam]</span>', [
          ['x<sup>5</sup> + x = (x<sup>3</sup>+1)·x<sup>2</sup> + (x<sup>2</sup> + x)', 'since (x³+1)x² = x⁵+x², and x⁵+x + x⁵+x² = x²+x'],
          ['x<sup>3</sup> + 1 = (x<sup>2</sup>+x)(x + 1) + (x + 1)', '(x²+x)(x+1) = x³+x'],
          ['x<sup>2</sup> + x = (x + 1)·x + 0', 'remainder 0 — stop']
        ], 'The last non-zero remainder is <b>x + 1</b>, already monic.'),
      traps: [
        'In Z<sub>2</sub>, +1 and −1 are the same. Write everything as addition and terms cancel in pairs.',
        'Reduce every coefficient mod p at every step — do not let a 3 survive in Z<sub>3</sub>[x].',
        'The gcd must be made monic; leaving it as 2x + 2 in Z<sub>3</sub>[x] instead of x + 1 loses the mark.'
      ]
    },

    'irreducibility': {
      idea: 'Irreducible means "does not factor into smaller-degree polynomials". Which test to use depends entirely on the degree and on whether you are over Z<sub>p</sub> or over Q.',
      steps: [
        'Over Z<sub>p</sub>, degree 2 or 3 only: evaluate at every element of Z<sub>p</sub>. <b>No roots ⟺ irreducible.</b> This works because any factorisation of a quadratic or cubic must contain a linear factor.',
        'Degree 4 or more: no roots is <b>not</b> enough — you must also rule out factoring into two quadratics.',
        'Over Q, try <b>Eisenstein</b> with some prime q: it needs q ∤ (leading coefficient), q | (every other coefficient), and q<sup>2</sup> ∤ (constant term).',
        'If Eisenstein does not apply directly, substitute x + 1 (or x + a) and test the result — irreducibility is unchanged by that shift.'
      ],
      worked: WE('Show x<sup>3</sup> + x + 1 is irreducible in Z<sub>2</sub>[x].  <span class="c">[2019 exam]</span>', [
        ['f(0) = 0 + 0 + 1 = <b>1</b>', 'the only elements of Z₂ are 0 and 1'],
        ['f(1) = 1 + 1 + 1 = 3 ≡ <b>1</b> (mod 2)', ''],
        ['no roots in Z<sub>2</sub>', ''],
        ['degree 3, so any factorisation needs a linear factor', 'and a linear factor means a root']
      ], 'No roots and degree 3 ⟹ irreducible. Hence Z<sub>2</sub>[x]/⟨f⟩ is a field with 2<sup>3</sup> = 8 elements.') +
        WE('Use Eisenstein to find a with 3x<sup>5</sup> + 42x<sup>3</sup> + 140x + 2a irreducible over Q.  <span class="c">[2021 exam]</span>', [
          ['try the prime q = 2', ''],
          ['2 ∤ 3 (leading coefficient) ✓', 'condition 1'],
          ['2 | 42 and 2 | 140 ✓', 'condition 2: all non-leading coefficients'],
          ['need 2 | 2a ✓ but 4 ∤ 2a', 'condition 3: q² must NOT divide the constant'],
          ['4 ∤ 2a means a is odd', '']
        ], 'Any odd a works — the smallest positive is <b>a = 1</b>.'),
      traps: [
        'The no-roots test is valid <b>only</b> for degree 2 and 3. (x<sup>2</sup>+x+1)<sup>2</sup> has no roots in Z<sub>2</sub> but is obviously reducible.',
        'Eisenstein needs q to divide <b>every</b> non-leading coefficient — one exception kills it.',
        'Eisenstein failing does not prove reducibility; it just means that test is silent. Try a shift.'
      ]
    },

    'finite-field': {
      idea: 'To build a field with p<sup>n</sup> elements, take polynomials over Z<sub>p</sub> modulo an irreducible f of degree n. Writing α for the root of f, every element is a polynomial in α of degree < n, and the single relation f(α) = 0 lets you reduce anything.',
      steps: [
        'Confirm f is irreducible — that is what makes the quotient a field. Then |F| = p<sup>deg f</sup>.',
        'Rearrange f(α) = 0 to express α<sup>n</sup> in terms of lower powers. This is your reduction rule.',
        'Build the power table α<sup>0</sup>, α<sup>1</sup>, α<sup>2</sup>, … by multiplying by α and reducing each time. It closes when you reach 1 again.',
        'The exponent where it returns to 1 is the <b>order</b> of α. If that order is |F| − 1, α is primitive.',
        'For a huge power, reduce the exponent <b>modulo the order</b>, then read the table.',
        'For an inverse: if x = α<sup>k</sup>, then x<sup>−1</sup> = α<sup>(order − k)</sup>. Otherwise run extended Euclid on f and x.'
      ],
      worked: WE('F = Z<sub>2</sub>[x]/⟨x<sup>3</sup> + x + 1⟩. Build the power table, then find α<sup>2019</sup> and (1 + α)<sup>−1</sup>.  <span class="c">[2019 exam]</span>', [
        ['f(α) = α<sup>3</sup> + α + 1 = 0 → α<sup>3</sup> = α + 1', 'in Z₂, moving a term across does not change its sign'],
        ['|F| = 2<sup>3</sup> = <b>8</b>, so F<sup>∗</sup> has 7 elements', ''],
        ['α<sup>0</sup> = 1, &nbsp; α<sup>1</sup> = α, &nbsp; α<sup>2</sup> = α<sup>2</sup>', 'nothing to reduce yet'],
        ['α<sup>3</sup> = α + 1', 'the reduction rule'],
        ['α<sup>4</sup> = α·α<sup>3</sup> = α(α+1) = α<sup>2</sup> + α', ''],
        ['α<sup>5</sup> = α<sup>2</sup>+α → α<sup>3</sup>+α<sup>2</sup> = (α+1)+α<sup>2</sup> = α<sup>2</sup>+α+1', 'multiply by α, then reduce'],
        ['α<sup>6</sup> = α<sup>3</sup>+α<sup>2</sup>+α = (α+1)+α<sup>2</sup>+α = α<sup>2</sup>+1', ''],
        ['α<sup>7</sup> = α<sup>3</sup>+α = (α+1)+α = <b>1</b>', 'back to 1 — the order of α is 7'],
        ['order 7 = |F<sup>∗</sup>|, so α is <b>primitive</b>', ''],
        ['2019 = 7×288 + 3, so α<sup>2019</sup> = α<sup>3</sup>', 'reduce mod the ORDER, 7'],
        ['1 + α = α<sup>3</sup> from the table', 'to invert, look it up as a power'],
        ['(1+α)<sup>−1</sup> = α<sup>7−3</sup> = α<sup>4</sup>', 'exponents subtract']
      ], 'α<sup>2019</sup> = α + 1 &nbsp;and&nbsp; (1 + α)<sup>−1</sup> = α<sup>2</sup> + α.'),
      traps: [
        'Reduce big exponents modulo the <b>order of α</b> (here 7), not modulo |F| = 8.',
        'The power table is worth writing out once at the start — nearly every part of these questions is then a lookup.',
        'An element is primitive when its order is |F| − 1. Do not confuse that with being a root of f.'
      ]
    }
  };

  TEMPLATES.forEach(function (t) { if (GUIDES[t.id]) t.guide = GUIDES[t.id]; });

  function build(templateId, seed) {
    var tpl = null, i;
    for (i = 0; i < TEMPLATES.length; i++) if (TEMPLATES[i].id === templateId) tpl = TEMPLATES[i];
    if (!tpl) return null;
    for (var k = 0; k < 80; k++) {
      var rng = global.Stats.rng(seed + k * 7919);
      var q;
      try { q = tpl.build(rng); } catch (e) { q = null; }
      if (q) {
        q.parts.forEach(function (p) {
          if (p.kind === 'multi' && p.shuffleWith) {
            var sh = shuffleMulti(p.shuffleWith, p.options, p.correct);
            p.options = sh.options; p.correct = sh.correct; delete p.shuffleWith;
          }
        });
        q.id = tpl.id; q.topic = tpl.topic; q.title = tpl.title;
        q.marks = q.parts.reduce(function (s, p) { return s + (p.marks || 0); }, 0);
        q.seed = seed + k * 7919;
        return q;
      }
    }
    return null;
  }

  var COMMANDS = [
    { q: 'gcd of two integers', a: 'Euclidean algorithm: divide, keep the remainder, repeat', tag: 'Number theory' },
    { q: 'gcd from prime factorisations', a: 'take the MINIMUM exponent of each common prime (maximum gives the lcm)', tag: 'Number theory' },
    { q: 'Solve ax + by = c', a: 'extended Euclid for gcd, scale by c/gcd; general solution x + (b/g)k, y − (a/g)k', tag: 'Number theory' },
    { q: 'When does ax + by = c have a solution?', a: 'exactly when gcd(a, b) divides c', tag: 'Number theory' },
    { q: 'φ(n) for n = ∏ pᵉ', a: 'φ(n) = ∏ pᵉ⁻¹(p − 1)', tag: 'Number theory' },
    { q: 'Euler’s theorem', a: 'gcd(a, n) = 1 ⟹ a^φ(n) ≡ 1 (mod n) — use it to shrink big exponents', tag: 'Number theory' },
    { q: 'Fermat’s little theorem', a: 'p prime, p ∤ a ⟹ a^(p−1) ≡ 1 (mod p), so a^(p−2) ≡ a⁻¹', tag: 'Number theory' },
    { q: 'Solve cx ≡ a (mod m)', a: 'multiply by c⁻¹ mod m (exists iff gcd(c, m) = 1)', tag: 'Congruences' },
    { q: 'Chinese Remainder Theorem', a: 'coprime moduli ⟹ unique solution modulo the PRODUCT of the moduli', tag: 'Congruences' },
    { q: 'Integer n in base b', a: 'repeatedly divide by b; read remainders bottom-to-top', tag: 'Bases' },
    { q: 'Base b to base b² (or b^k)', a: 'group the base-b digits in pairs (k-tuples) from the RIGHT', tag: 'Bases' },
    { q: 'Fraction in base b', a: 'repeatedly multiply the remainder by b; a repeated remainder starts the period', tag: 'Bases' },
    { q: 'Periodic expansion back to a rational', a: 'period of r digits after k digits contributes P / (bᵏ(bʳ − 1))', tag: 'Bases' },
    { q: 'Continued fraction of a rational', a: 'the partial quotients are the quotients of the Euclidean algorithm', tag: 'Continued fractions' },
    { q: 'Value of a purely periodic CF', a: 'set y = [bar]; y = (Py + P′)/(Qy + Q′) gives a quadratic — take the positive root', tag: 'Continued fractions' },
    { q: 'RSA: valid modulus', a: 'N = pq with p, q distinct primes', tag: 'RSA' },
    { q: 'RSA: valid encryption exponent e', a: 'gcd(e, φ(N)) = 1', tag: 'RSA' },
    { q: 'RSA: decryption exponent', a: 'd ≡ e⁻¹ (mod φ(N)) by extended Euclid', tag: 'RSA' },
    { q: 'Breaking RSA', a: 'factor N; knowing p and q gives φ(N) and hence d', tag: 'RSA' },
    { q: 'Test whether a is a primitive root mod p', a: 'a^((p−1)/q) ≠ 1 for every PRIME q dividing p − 1', tag: 'Primitive elements' },
    { q: 'When is gᵏ primitive, given g primitive?', a: 'exactly when gcd(k, p − 1) = 1', tag: 'Primitive elements' },
    { q: 'How many primitive roots mod p?', a: 'φ(p − 1) of them', tag: 'Primitive elements' },
    { q: 'Order of gᵏ when g is primitive', a: '(p − 1)/gcd(k, p − 1)', tag: 'Primitive elements' },
    { q: 'Hamming (7,4): check bits', a: 'x = a+b+d, y = a+c+d, z = b+c+d; codeword (x, y, a, z, b, c, d)', tag: 'Coding' },
    { q: 'Hamming: locating an error', a: 'the syndrome read as a binary number IS the error position', tag: 'Coding' },
    { q: 'Why that column order in H?', a: 'the i-th column is the binary representation of i', tag: 'Coding' },
    { q: 'Information rate of a code', a: 'information digits ÷ total digits, e.g. Hamming(15,11) = 11/15', tag: 'Coding' },
    { q: 'Irreducible of degree 2 or 3 over Z_p', a: 'irreducible ⟺ no roots in Z_p (fails from degree 4 on)', tag: 'Polynomials' },
    { q: 'Eisenstein’s criterion', a: 'prime q: q ∤ leading, q | all others, q² ∤ constant ⟹ irreducible over Q', tag: 'Polynomials' },
    { q: 'Eisenstein does not apply directly?', a: 'try the shift f(x + 1) — irreducibility is preserved', tag: 'Polynomials' },
    { q: 'Size of Z_p[x]/⟨f⟩ with deg f = n', a: 'pⁿ elements (polynomials of degree < n)', tag: 'Finite fields' },
    { q: 'When is Z_p[x]/⟨f⟩ a field?', a: 'exactly when f is irreducible over Z_p', tag: 'Finite fields' },
    { q: 'Possible orders of elements of F_q*', a: 'the divisors of q − 1 (the group is cyclic)', tag: 'Finite fields' },
    { q: 'Computing α^huge in F', a: 'reduce the exponent mod the order of α (at most q − 1)', tag: 'Finite fields' },
    { q: 'Inverse in Z_p[x]/⟨f⟩', a: 'extended Euclid on f and the element, or subtract exponents as powers of α', tag: 'Finite fields' },
    { q: 'For which n does a field of n elements exist?', a: 'exactly the prime powers n = pᵏ', tag: 'Finite fields' }
  ];

  var CONCEPTS = [
    { q: 'Definition: d = gcd(a, b)', a: 'd | a and d | b, and every common divisor of a and b divides d (equivalently, d is the largest such).', tag: 'Definitions' },
    { q: 'Definition: a | b', a: 'there is an integer k with b = ak.', tag: 'Definitions' },
    { q: 'Definition: primitive element / primitive root', a: 'an element whose multiplicative order equals the size of the whole group (p − 1 in Z_p*, q − 1 in F_q*).', tag: 'Definitions' },
    { q: 'Why is "no roots" not enough for degree ≥ 4?', a: 'A degree-4 polynomial can factor into two irreducible quadratics with no linear factor — e.g. (x²+x+1)² over Z₂.', tag: 'Polynomials' },
    { q: 'Lagrange’s theorem, as used in this course', a: 'The order of any element divides the order of the group — this is why orders are always read off the divisor list.', tag: 'Definitions' },
    { q: 'Z_n is a field exactly when…', a: 'n is prime. For composite n there are zero divisors, so F_n = Z_n only for n prime.', tag: 'Finite fields' },
    { q: 'F_9 vs Z_9', a: 'They are different rings. F_9 = Z₃[x]/⟨irreducible quadratic⟩ is a field; Z₉ is not (3 × 3 = 0).', tag: 'Finite fields' },
    { q: 'Which n have primitive roots?', a: 'n = 1, 2, 4, pᵏ, 2pᵏ for odd prime p. So a field F_{2ᵏ} with k > 2 has a primitive element, but Z_{2ᵏ} has no primitive root.', tag: 'Primitive elements' },
    { q: 'Hamming (7,4) error-correcting capability', a: 'Minimum distance 3, so it corrects 1 error (or detects 2).', tag: 'Coding' },
    { q: 'How many errors does a code of minimum distance d correct?', a: 'floor((d − 1)/2).', tag: 'Coding' },
    { q: 'Why must the RSA exponent be coprime to φ(N)?', a: 'Otherwise m ↦ mᵉ is not injective on the units, so no decryption exponent exists.', tag: 'RSA' },
    { q: 'Why is RSA hard to break?', a: 'Recovering d needs φ(N), which needs the factorisation of N — believed hard for large N. Special forms of p and q break it.', tag: 'RSA' },
    { q: 'Rational vs irrational continued fractions', a: 'Rationals have finite expansions; quadratic irrationals have eventually periodic ones.', tag: 'Continued fractions' },
    { q: 'A number has a terminating base-b expansion iff…', a: 'in lowest terms, the denominator’s prime factors all divide b.', tag: 'Bases' },
    { q: 'Order of a product of coprime-order elements', a: 'If ord(a) = m, ord(b) = n and gcd(m, n) = 1, then ord(ab) = mn.', tag: 'Definitions' }
  ];

  var SUBJECT = {
    id: 'math2400',
    code: 'MATH2400',
    name: 'Finite Mathematics',
    tagline: 'Number theory, RSA, coding theory and finite fields. Every question regenerates with new numbers, ' +
      'and answers are checked exactly — polynomials, fractions and code words in any reasonable notation.',
    templates: TEMPLATES,
    build: build,
    fmt: fmt,
    tolerance: tolerance,
    drillBlurb: 'The methods and definitions these papers ask for every year.',
    drillSets: [
      { id: 'methods', label: 'Methods & algorithms', cards: COMMANDS },
      { id: 'concepts', label: 'Definitions & theory', cards: CONCEPTS }
    ],
    reference: {
      title: 'Method reference',
      blurb: 'What to reach for, and the traps that cost marks. Desmos is fine for the arithmetic — the method is what earns the marks.',
      fromDrill: 'methods',
      sections: [
        { heading: 'Things that cost marks', rows: [
          ['gcd from factorisations', 'MINIMUM exponent of each prime — maximum gives the lcm'],
          ['Diophantine general solution', 'x steps by b/g and y by −a/g — the coefficients swap'],
          ['CRT modulus', 'moduli multiply, they do not add'],
          ['Primitive root test', 'only check (p−1)/q for PRIME q; a^(p−1) ≡ 1 always holds and proves nothing'],
          ['φ(N) for RSA', '(p−1)(q−1), not N − 1 — that is only for prime N'],
          ['Orders in F_q*', 'divisors of q − 1, not of q'],
          ['Irreducibility by roots', 'valid only for degree 2 and 3'],
          ['Hamming decoding', 'correct the error BEFORE reading off the message digits'],
          ['α^huge', 'reduce the exponent modulo the ORDER of α, not modulo q'],
          ['Base b → base b²', 'group digits from the RIGHT, padding on the left']
        ] },
        { heading: 'In the exam', rows: [
          ['Show the working', 'every paper says unsubstantiated answers earn no marks — write the algorithm steps out'],
          ['Desmos', 'good for arithmetic checks and decimal values; it will not do modular inverses for you'],
          ['Check a gcd', 'divide both numbers by it and confirm both quotients are whole'],
          ['Check a decryption exponent', 'confirm ed ≡ 1 (mod φ(N)) before using it'],
          ['Check a Diophantine solution', 'substitute back into the original equation']
        ] }
      ]
    }
  };

  if (global.Subjects) global.Subjects.register(SUBJECT);
  global.MATH2400 = SUBJECT;
})(typeof window !== 'undefined' ? window : globalThis);

if (typeof module !== 'undefined') module.exports = (typeof window !== 'undefined' ? window : globalThis).MATH2400;
