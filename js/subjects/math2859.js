/* subjects/math2859.js — MATH2859 question templates.
   Each template takes a seeded RNG and returns a fully-specified question with
   computed answers, so every attempt gets fresh numbers but exact marking. */
(function (global) {
  'use strict';
  var S = global.Stats;

  /* ================= helpers ================= */

  function fmt(x, dp) {
    if (x === undefined || x === null || !isFinite(x)) return '—';
    return Number(x).toFixed(dp === undefined ? 4 : dp);
  }
  function sig(x, n) { return Number(x).toPrecision(n === undefined ? 6 : n); }
  function mlVec(a, dp) { return '[' + a.map(function (v) { return fmt(v, dp); }).join(', ') + ']'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  // signed term for writing "b0 + b1 x" nicely
  function signed(v, dp) { return (v < 0 ? '− ' : '+ ') + fmt(Math.abs(v), dp); }

  /* Marking tolerance for a numeric part. Integers (sample sizes, degrees of
     freedom) must be exact; everything else allows honest rounding slack but
     stays far tighter than any method error. */
  function tolerance(part) {
    if (part.integer) return 0;
    var dp = part.dp === undefined ? 4 : part.dp;
    return Math.max(2e-3 * Math.abs(part.answer), 0.51 * Math.pow(10, -dp));
  }

  function num(o) { o.kind = 'numeric'; return o; }
  function iv(o) { o.kind = 'interval'; return o; }
  function mc(o) { o.kind = 'choice'; return o; }
  function ms(o) { o.kind = 'multi'; return o; }
  function wr(o) { o.kind = 'written'; return o; }

  // Build a choice part whose options get shuffled, tracking the right index.
  function shuffleChoice(rng, options, correctIdx) {
    var idx = options.map(function (_, i) { return i; });
    idx = rng.shuffle(idx);
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

  function confPct(c) { return fmt(c * 100, c * 100 % 1 === 0 ? 0 : 1) + '%'; }

  function dataBlock(name, matlab, python, table) {
    return { name: name, matlab: matlab, python: python, table: table || null };
  }

  function tableHtml(rows) {
    var h = '<table class="dtable"><tbody>';
    rows.forEach(function (r) {
      h += '<tr><th>' + r[0] + '</th>';
      r[1].forEach(function (v) { h += '<td>' + v + '</td>'; });
      h += '</tr>';
    });
    return h + '</tbody></table>';
  }

  /* strength-of-evidence wording used in this course */
  function evidenceLabel(p) {
    if (p < 0.01) return 'strong evidence';
    if (p < 0.1) return 'some or moderate evidence';
    return 'weak or no evidence';
  }

  /* ================= shared option sets ================= */

  var REG_ASSUMPTIONS = [
    'The mean of the response is a <em>linear</em> function of the predictor',
    'The errors ε are <em>independent</em> of one another',
    'The errors have <em>constant variance</em> σ² for every value of x (homoscedasticity)',
    'The errors are <em>normally distributed</em>',
    'The predictor variable x is normally distributed',
    'The response values y are all equal to one another on average',
    'The sample size must be at least 30',
    'The predictor and the response must have the same units'
  ];
  var REG_ASSUMPTIONS_CORRECT = [0, 1, 2, 3];

  var ANOVA_ASSUMPTIONS = [
    'The observations are <em>independent</em> — random samples, independent within and between groups',
    'The response is <em>normally distributed</em> within each group',
    'The groups have a <em>common variance</em> σ² (homoscedasticity)',
    'All groups must have the same sample size',
    'The group means must all be equal',
    'Each group must contain at least 30 observations',
    'The response variable must be categorical'
  ];
  var ANOVA_ASSUMPTIONS_CORRECT = [0, 1, 2];

  var MATLAB_FN_OPTIONS = [
    'MATLAB: <code>fitlm()</code> &nbsp;|&nbsp; Python: <code>ols().fit()</code>',
    'MATLAB: <code>ttest2()</code> &nbsp;|&nbsp; Python: <code>stats.ttest_ind()</code>',
    'MATLAB: <code>ttest()</code> &nbsp;|&nbsp; Python: <code>stats.ttest_rel()</code>',
    'MATLAB: <code>anova1()</code> &nbsp;|&nbsp; Python: <code>stats.f_oneway()</code>',
    'MATLAB: <code>ztest()</code> &nbsp;|&nbsp; Python: <code>stats.norm()</code>'
  ];

  /* ================= T1: simple linear regression (full workup) ================= */

  var SLR_CONTEXTS = [
    {
      key: 'cars',
      intro: function (c) {
        return 'The following table shows how many weeks a random sample of ' + c.n +
          ' people have worked at a car inspection station, and the number of cars each one inspected between noon and 2&nbsp;pm on a given day.';
      },
      xlabel: 'Number of weeks employed', ylabel: 'Number of cars inspected',
      xshort: 'the number of weeks employed', yshort: 'the number of cars inspected',
      xvar: 'weeks', yvar: 'cars', xunit: 'weeks', yunit: 'cars',
      n: [6, 8], xlo: 1, xhi: 14, xdp: 0, ydp: 0,
      b0: [11, 14], b1: [0.7, 1.1], sigma: [1.2, 2.6],
      model: 'Number of cars inspected = β₀ + β₁ (Number of weeks employed) + ε',
      x0: [7, 10], dx: [3, 5]
    },
    {
      key: 'weight',
      intro: function (c) {
        return 'The weights (kg) and heights (cm) of a random sample of ' + c.n + ' adults are given in the table below.';
      },
      xlabel: 'Weight (kg)', ylabel: 'Height (cm)',
      xshort: "a person's weight", yshort: "a person's height",
      xvar: 'weight', yvar: 'height', xunit: 'kg', yunit: 'cm',
      n: [7, 9], xlo: 45, xhi: 99, xdp: 2, ydp: 1,
      b0: [140, 152], b1: [0.35, 0.55], sigma: [3.5, 7.5],
      model: 'Height = β₀ + β₁ (Weight) + ε',
      x0: [85, 95], dx: [4, 8]
    },
    {
      key: 'yield',
      intro: function (c) {
        return 'A chemical engineer recorded the reaction temperature (°C) and the resulting product yield (g) for ' + c.n + ' independent runs of a process.';
      },
      xlabel: 'Temperature (°C)', ylabel: 'Yield (g)',
      xshort: 'the reaction temperature', yshort: 'the product yield',
      xvar: 'temp', yvar: 'yield', xunit: '°C', yunit: 'g',
      n: [7, 10], xlo: 100, xhi: 180, xdp: 0, ydp: 2,
      b0: [20, 35], b1: [0.28, 0.45], sigma: [4.5, 10.0],
      model: 'Yield = β₀ + β₁ (Temperature) + ε',
      x0: [130, 165], dx: [5, 12]
    },
    {
      key: 'study',
      intro: function (c) {
        return 'A tutor recorded the number of hours ' + c.n + ' randomly chosen students spent on an assignment and the mark (out of 100) each student received.';
      },
      xlabel: 'Hours spent', ylabel: 'Mark (/100)',
      xshort: 'the number of hours spent', yshort: 'the mark obtained',
      xvar: 'hours', yvar: 'mark', xunit: 'hours', yunit: 'marks',
      n: [6, 9], xlo: 2, xhi: 20, xdp: 1, ydp: 1,
      b0: [42, 55], b1: [1.8, 2.9], sigma: [6.0, 13.0],
      model: 'Mark = β₀ + β₁ (Hours spent) + ε',
      x0: [10, 17], dx: [2, 5]
    },
    {
      key: 'ozone',
      intro: function (c) {
        return 'An environmental scientist measured daily maximum temperature (°C) and the daily peak ozone concentration (ppb) on ' + c.n + ' randomly selected days.';
      },
      xlabel: 'Max temperature (°C)', ylabel: 'Ozone (ppb)',
      xshort: 'the maximum temperature', yshort: 'the peak ozone concentration',
      xvar: 'temp', yvar: 'ozone', xunit: '°C', yunit: 'ppb',
      n: [7, 10], xlo: 14, xhi: 38, xdp: 1, ydp: 1,
      b0: [8, 18], b1: [1.1, 2.0], sigma: [5.0, 11.0],
      model: 'Ozone = β₀ + β₁ (Max temperature) + ε',
      x0: [22, 34], dx: [3, 6]
    }
  ];

  function rnd(rng, range, dp) { return S.round(rng.uniform(range[0], range[1]), dp === undefined ? 3 : dp); }

  /* Generate (x, y) for a regression question. The acceptance filter keeps the
     relationship clearly significant but not absurdly so: a p-value of 1e-17
     is useless when the exam asks for four decimal places. */
  function genXY(rng, ctx, opts) {
    opts = opts || {};
    var pMin = opts.pMin === undefined ? 1e-5 : opts.pMin;
    var pMax = opts.pMax === undefined ? 0.03 : opts.pMax;
    for (var attempt = 0; attempt < 400; attempt++) {
      var n = rng.int(ctx.n[0], ctx.n[1]);
      var b1true = rnd(rng, ctx.b1) * (opts.negative ? -1 : 1);
      var b0true = rnd(rng, ctx.b0);
      var sg = rnd(rng, ctx.sigma);
      var x = [], y = [], i, ok = true;
      for (i = 0; i < n; i++) x.push(S.round(rng.uniform(ctx.xlo, ctx.xhi), ctx.xdp));
      for (i = 0; i < n; i++) for (var j = i + 1; j < n; j++) if (x[i] === x[j]) ok = false;
      if (!ok) continue;
      for (i = 0; i < n; i++) y.push(S.round(b0true + b1true * x[i] + rng.normal(0, sg), ctx.ydp));
      var L = S.linreg(x, y);
      if (!isFinite(L.b1) || L.s <= 0) continue;
      // keep the relationship clearly visible but not perfect
      if (Math.abs(L.r) < 0.6 || Math.abs(L.r) > 0.99) continue;
      if (opts.negative && L.b1 >= 0) continue;
      if (!opts.negative && L.b1 <= 0) continue;
      if (L.pTwoSided < pMin || L.pTwoSided > pMax) continue;
      return { x: x, y: y, L: L, n: n };
    }
    return null;
  }

  function slrDataBlocks(ctx, x, y) {
    return [dataBlock(
      'Data',
      ctx.xvar + ' = ' + mlVec(x, ctx.xdp) + ';\n' + ctx.yvar + ' = ' + mlVec(y, ctx.ydp) + ';',
      'import numpy as np\n' + ctx.xvar + ' = np.array(' + mlVec(x, ctx.xdp) + ')\n' +
        ctx.yvar + ' = np.array(' + mlVec(y, ctx.ydp) + ')',
      tableHtml([
        [ctx.xlabel + ' <i>x<sub>i</sub></i>', x.map(function (v) { return fmt(v, ctx.xdp); })],
        [ctx.ylabel + ' <i>y<sub>i</sub></i>', y.map(function (v) { return fmt(v, ctx.ydp); })]
      ])
    )];
  }

  function regSolutionCode(ctx, extra) {
    return '% MATLAB\nmdl = fitlm(' + ctx.xvar + "', " + ctx.yvar + "');\n" +
      'disp(mdl)                 % coefficients, SEs, t stats, p-values\n' +
      'mdl.Rsquared.Ordinary     % R^2\n' +
      'corr(' + ctx.xvar + "', " + ctx.yvar + "')      % sample correlation r\n" + (extra || '');
  }

  var T_SLR = {
    id: 'slr-full',
    topic: 'Linear regression',
    title: 'Simple linear regression: fit, intervals and inference',
    marks: 21,
    build: function (rng) {
      var ctx = rng.pick(SLR_CONTEXTS);
      var g = genXY(rng, ctx, { pMin: 1e-3, pMax: 0.03 });
      if (!g) return null;
      var L = g.L, x = g.x, y = g.y, n = g.n;
      var conf = rng.pick([0.90, 0.95, 0.97, 0.98, 0.99]);
      var confB = rng.pick([0.90, 0.95, 0.99]);
      var x0 = S.round(rng.uniform(ctx.x0[0], ctx.x0[1]), ctx.xdp);
      var dx = rng.int(ctx.dx[0], ctx.dx[1]);
      var ci = L.ciMean(x0, conf), pi = L.piPred(x0, conf);
      var tcB = S.tInv(1 - (1 - confB) / 2, L.df);
      var chg = L.b1 * dx;
      var chgCI = [chg - tcB * dx * L.seB1, chg + tcB * dx * L.seB1];
      var tcMean = S.tInv(1 - (1 - conf) / 2, L.df);

      var plotChoice = shuffleChoice(rng, [
        'A scatterplot of the response against the predictor',
        'A histogram of the response values',
        'A boxplot of the predictor values',
        'A normal Q–Q plot of the predictor',
        'A bar chart of the response totals'
      ], 0);
      var hypChoice = shuffleChoice(rng, [
        'H₀: β₁ = 0 &nbsp; vs &nbsp; H₁: β₁ ≠ 0',
        'H₀: β₀ = 0 &nbsp; vs &nbsp; H₁: β₀ ≠ 0',
        'H₀: β₁ ≠ 0 &nbsp; vs &nbsp; H₁: β₁ = 0',
        'H₀: ρ = 1 &nbsp; vs &nbsp; H₁: ρ ≠ 1',
        'H₀: β̂₁ = 0 &nbsp; vs &nbsp; H₁: β̂₁ ≠ 0'
      ], 0);
      var concChoice = shuffleChoice(rng, [
        'The p-value is ' + fmt(L.pTwoSided, 4) + ', so we reject H₀ at the 5% level: there is ' +
          evidenceLabel(L.pTwoSided) + ' that ' + ctx.xshort + ' is a significant predictor of ' + ctx.yshort + '.',
        'The p-value is ' + fmt(L.pTwoSided, 4) + ', so we accept H₀ and conclude that β₁ is exactly 0.',
        'The p-value is ' + fmt(L.pTwoSided, 4) + ', which proves the true slope equals ' + fmt(L.b1, 3) + '.',
        'The p-value is ' + fmt(L.pTwoSided, 4) + ', so there is no evidence of any relationship between the two variables.',
        'Because R² = ' + fmt(L.R2, 3) + ' is not 1, the predictor cannot be significant.'
      ], 0);

      var codeChoice = shuffleChoice(rng, [
        '<code>mdl = fitlm(x\', y\'); disp(mdl)</code>',
        '<code>[h,p] = ttest2(x, y)</code>',
        '<code>anova1([x; y]\')</code>',
        '<code>p = polyfit(y, x, 1)</code>',
        '<code>corrcoef(x, y)</code>'
      ], 0);

      return {
        intro: '<p>' + ctx.intro({ n: n }) + '</p>' +
          '<p>The following linear regression model is to be fitted to these data:</p>' +
          '<p class="model">' + ctx.model + '</p>',
        data: slrDataBlocks(ctx, x, y),
        plot: { type: 'scatter', x: x, y: y, xlabel: ctx.xlabel, ylabel: ctx.ylabel, b0: L.b0, b1: L.b1 },
        parts: [
          mc({
            label: 'a) i)', marks: 1,
            prompt: 'What is a suitable plot to verify that it is reasonable to assume the regression of the response on the predictor is linear?',
            options: plotChoice.options, correct: plotChoice.correct,
            solution: 'A <b>scatterplot</b> of y against x. If the points scatter about a straight line (no curvature, no fanning out) the linear model is reasonable.<br><code>scatter(' + ctx.xvar + ', ' + ctx.yvar + ')</code>'
          }),
          wr({
            label: 'a) ii)', marks: 2,
            prompt: 'Make the plot and comment on the relationship between ' + ctx.xshort + ' and ' + ctx.yshort + '.',
            placeholder: 'Direction, strength, form, any outliers…',
            checklist: [
              'Named the <b>direction</b> (' + (L.b1 > 0 ? 'positive' : 'negative') + ' association)',
              'Named the <b>strength</b> (r = ' + fmt(L.r, 3) + ', so ' +
                (Math.abs(L.r) > 0.9 ? 'very strong' : Math.abs(L.r) > 0.8 ? 'strong' : 'moderately strong') + ')',
              'Named the <b>form</b> (roughly linear — no obvious curvature)',
              'Commented on outliers / unusual points'
            ],
            model: 'The scatterplot shows a ' + (Math.abs(L.r) > 0.9 ? 'very strong' : Math.abs(L.r) > 0.8 ? 'strong' : 'moderately strong') +
              ' ' + (L.b1 > 0 ? 'positive' : 'negative') + ' linear relationship: as ' + ctx.xshort +
              ' increases, ' + ctx.yshort + ' tends to ' + (L.b1 > 0 ? 'increase' : 'decrease') +
              '. The points lie close to a straight line with no obvious curvature and no clear outliers, so fitting a simple linear regression model is reasonable (r = ' + fmt(L.r, 3) + ').'
          }),
          mc({
            label: 'a) iii)', marks: 1,
            prompt: 'Which MATLAB command fits this model?',
            options: codeChoice.options, correct: codeChoice.correct,
            solution: '<code>fitlm(x\', y\')</code> fits y = β₀ + β₁x. Note <code>fitlm</code> wants <b>column</b> vectors, hence the transposes.'
          }),
          num({
            label: 'b) i)', marks: 2, prompt: 'Intercept β̂₀ of the fitted line ŷ(x) = β̂₀ + β̂₁x',
            answer: L.b0, dp: 3,
            hint: 'Read the <i>(Intercept)</i> row of the <code>fitlm</code> Estimate column.',
            solution: 'β̂₀ = ȳ − β̂₁x̄ = ' + fmt(L.b0, 4) + '<br>' + regSolutionCode(ctx)
          }),
          num({
            label: 'b) i)', marks: 0, prompt: 'Slope β̂₁ of the fitted line',
            answer: L.b1, dp: 3,
            traps: [{ value: 1 / L.b1, msg: 'That is the slope of x on y — you have regressed the wrong way round.' }],
            hint: 'β̂₁ = S<sub>xy</sub> / S<sub>xx</sub>; it is the second Estimate in <code>fitlm</code>.',
            solution: 'S<sub>xx</sub> = ' + sig(L.Sxx) + ', S<sub>xy</sub> = ' + sig(L.Sxy) +
              ', so β̂₁ = S<sub>xy</sub>/S<sub>xx</sub> = ' + fmt(L.b1, 4) +
              '.<br>Fitted line: ŷ(x) = ' + fmt(L.b0, 3) + ' ' + signed(L.b1, 3) + 'x'
          }),
          num({
            label: 'b) ii)', marks: 1, prompt: 'What proportion of the variability in the response is explained by the predictor?',
            answer: L.R2, dp: 3,
            traps: [{ value: L.r, msg: 'That is r, not R². Square it.' }],
            hint: 'That is R² — <code>mdl.Rsquared.Ordinary</code>.',
            solution: 'R² = 1 − SSE/SST = ' + fmt(L.R2, 4) + ' (SSE = ' + sig(L.SSE) + ', SST = ' + sig(L.SST) + '). ' +
              'So ' + fmt(L.R2 * 100, 1) + '% of the variability in ' + ctx.yshort + ' is explained by ' + ctx.xshort + '.'
          }),
          num({
            label: 'b) iii)', marks: 1, prompt: 'What is the observed sample correlation between ' + ctx.xshort + ' and ' + ctx.yshort + '?',
            answer: L.r, dp: 3,
            traps: [{ value: L.R2, msg: 'That is R², not r. Take the square root and keep the sign of the slope.' },
                    { value: -L.r, msg: 'Right magnitude, wrong sign — r takes the sign of β̂₁.' }],
            hint: '<code>corr(x\', y\')</code>, or r = ±√R² with the sign of the slope.',
            solution: 'r = S<sub>xy</sub>/√(S<sub>xx</sub>S<sub>yy</sub>) = ' + fmt(L.r, 4) + ' = ' +
              (L.b1 > 0 ? '+' : '−') + '√R².'
          }),
          num({
            label: 'c)', marks: 1,
            prompt: 'Use the fitted model to estimate ' + ctx.yshort + ' when ' + ctx.xlabel.toLowerCase() + ' is ' + fmt(x0, ctx.xdp) + '.',
            answer: L.fit(x0), dp: 4,
            hint: 'Substitute x₀ = ' + fmt(x0, ctx.xdp) + ' into the fitted line.',
            solution: 'ŷ(' + fmt(x0, ctx.xdp) + ') = ' + fmt(L.b0, 4) + ' ' + signed(L.b1, 4) + '×' + fmt(x0, ctx.xdp) +
              ' = <b>' + fmt(L.fit(x0), 4) + '</b><br><code>predict(mdl, ' + fmt(x0, ctx.xdp) + ')</code>'
          }),
          iv({
            label: 'd)', marks: 2,
            prompt: 'Determine a ' + confPct(conf) + ' confidence interval for the <b>average</b> response when x = ' + fmt(x0, ctx.xdp) + '.',
            answer: ci, dp: 4,
            traps: [{ value: pi[0], msg: 'That is the prediction interval. A CI for the <i>mean</i> response omits the extra “1 +” inside the square root.', which: 0 }],
            hint: 'ŷ₀ ± t<sub>' + fmt(1 - (1 - conf) / 2, 4) + ', ' + L.df + '</sub> · s · √(1/n + (x₀−x̄)²/S<sub>xx</sub>)',
            solution: 's = ' + sig(L.s) + ', t<sub>crit</sub> = ' + fmt(tcMean, 4) + ' on ' + L.df + ' df, ' +
              'SE(mean) = ' + sig(L.seMean(x0)) + '.<br>CI = ' + fmt(L.fit(x0), 4) + ' ± ' + fmt(tcMean * L.seMean(x0), 4) +
              ' = [' + fmt(ci[0], 4) + ', ' + fmt(ci[1], 4) + ']' +
              '<br><code>[yhat, ci] = predict(mdl, ' + fmt(x0, ctx.xdp) + ", 'Alpha', " + fmt(1 - conf, 3) + ")</code>"
          }),
          iv({
            label: 'e)', marks: 2,
            prompt: 'Compute a ' + confPct(conf) + ' prediction interval for a <b>single new</b> observation at x = ' + fmt(x0, ctx.xdp) + '.',
            answer: pi, dp: 4,
            traps: [{ value: ci[0], msg: 'That is the confidence interval for the mean. A prediction interval adds the variability of a new observation: √(1 + 1/n + …).', which: 0 }],
            hint: 'Same as (d) but with √(1 + 1/n + (x₀−x̄)²/S<sub>xx</sub>).',
            solution: 'SE(pred) = ' + sig(L.sePred(x0)) + ', so PI = ' + fmt(L.fit(x0), 4) + ' ± ' +
              fmt(tcMean * L.sePred(x0), 4) + ' = [' + fmt(pi[0], 4) + ', ' + fmt(pi[1], 4) + ']' +
              "<br><code>[yhat, pi] = predict(mdl, " + fmt(x0, ctx.xdp) + ", 'Alpha', " + fmt(1 - conf, 3) +
              ", 'Prediction', 'observation')</code>"
          }),
          num({
            label: 'f)', marks: 1,
            prompt: 'If ' + ctx.xlabel.toLowerCase() + ' increased by ' + dx + ' ' + ctx.xunit + ', what is the expected change in the response?',
            answer: chg, dp: 3,
            traps: [{ value: L.b1, msg: 'That is the change for a <b>one-unit</b> increase — multiply by ' + dx + '.' }],
            hint: 'The expected change is β̂₁ × Δx.',
            solution: 'Δŷ = β̂₁ × ' + dx + ' = ' + fmt(L.b1, 4) + ' × ' + dx + ' = <b>' + fmt(chg, 4) + '</b> ' + ctx.yunit + '.'
          }),
          iv({
            label: 'g)', marks: 2,
            prompt: 'Compute a two-sided ' + confPct(confB) + ' confidence interval for that expected change (an increase of ' + dx + ' ' + ctx.xunit + ').',
            answer: chgCI, dp: 3,
            hint: 'Build the CI for β₁ and multiply both endpoints by ' + dx + ': Δx·β̂₁ ± t·Δx·SE(β̂₁).',
            solution: 'SE(β̂₁) = ' + sig(L.seB1) + ', t<sub>' + fmt(1 - (1 - confB) / 2, 4) + ', ' + L.df + '</sub> = ' + fmt(tcB, 4) +
              '.<br>CI for β₁: [' + fmt(L.ciSlope(confB)[0], 5) + ', ' + fmt(L.ciSlope(confB)[1], 5) + ']; multiply by ' + dx +
              ' → [' + fmt(chgCI[0], 4) + ', ' + fmt(chgCI[1], 4) + ']' +
              '<br><code>coefCI(mdl, ' + fmt(1 - confB, 3) + ')</code>'
          }),
          mc({
            label: 'h) i)', marks: 1,
            prompt: 'To test whether the predictor is significant in this model, the hypotheses are:',
            options: hypChoice.options, correct: hypChoice.correct,
            solution: 'Significance of a predictor is a test on the <b>true slope</b>: H₀: β₁ = 0 vs H₁: β₁ ≠ 0. Hypotheses are always about parameters, never estimates.'
          }),
          num({
            label: 'h) ii)', marks: 2, prompt: 'Observed test statistic t =',
            answer: L.t, dp: 3,
            hint: 't = β̂₁ / SE(β̂₁), read straight off the <code>fitlm</code> table.',
            solution: 't = ' + fmt(L.b1, 5) + ' / ' + sig(L.seB1) + ' = <b>' + fmt(L.t, 4) + '</b>'
          }),
          num({
            label: 'h) iii)', marks: 1, prompt: 'The test statistic follows a t distribution on how many degrees of freedom?',
            answer: L.df, dp: 0, integer: true,
            traps: [{ value: n - 1, msg: 'n − 1 is for a one-sample t. Simple regression estimates <b>two</b> parameters, so df = n − 2.' }],
            solution: 'df = n − 2 = ' + n + ' − 2 = <b>' + L.df + '</b> (two parameters β₀, β₁ estimated).'
          }),
          num({
            label: 'h) iv)', marks: 2, prompt: 'The p-value is',
            answer: L.pTwoSided, dp: 4,
            traps: [{ value: L.pTwoSided / 2, msg: 'That is the one-sided p-value. This alternative is two-sided, so double it.' }],
            hint: 'p = 2·P(T<sub>' + L.df + '</sub> > |t|) = <code>2*(1 - tcdf(abs(t), ' + L.df + '))</code>',
            solution: 'p = 2(1 − F<sub>t,' + L.df + '</sub>(' + fmt(Math.abs(L.t), 4) + ')) = <b>' + fmt(L.pTwoSided, 6) + '</b>' +
              '<br><code>p = 2*(1 - tcdf(abs(' + fmt(L.t, 4) + '), ' + L.df + '))</code>'
          }),
          mc({
            label: 'h) v)', marks: 2, prompt: 'State the conclusion of the test in plain language.',
            options: concChoice.options, correct: concChoice.correct,
            solution: 'p = ' + fmt(L.pTwoSided, 4) + ' < 0.05, so reject H₀. We never “accept” or “prove” H₀, and a p-value says nothing about the <i>value</i> of the slope — only about evidence against β₁ = 0.'
          }),
          ms({
            label: 'i)', marks: 3,
            prompt: 'Select <b>all</b> assumptions of the simple linear regression model.',
            options: REG_ASSUMPTIONS, correct: REG_ASSUMPTIONS_CORRECT,
            shuffleWith: rng,
            solution: 'L-I-N-E: <b>L</b>inear mean, <b>I</b>ndependent errors, <b>N</b>ormal errors, <b>E</b>qual variance. ' +
              'Check them with a residuals-vs-fitted plot (linearity + constant spread) and a normal Q–Q plot of residuals. ' +
              'Nothing is assumed about the distribution of x.'
          })
        ]
      };
    }
  };

  /* ================= T2: regression, one-sided test + reverse-engineering α ================= */

  var T_SLR_ONESIDED = {
    id: 'slr-onesided',
    topic: 'Linear regression',
    title: 'Regression with a one-sided test and a rejection rule',
    marks: 13,
    build: function (rng) {
      var ctx = rng.pick([
        {
          key: 'resist',
          intro: function (c) {
            return 'A research group measured total respiratory resistance and height in a group of ' + c.n +
              ' children with asthma. They wish to know whether respiratory resistance is related to height.';
          },
          xlabel: 'Height (cm)', ylabel: 'Total respiratory resistance',
          xshort: 'the height of the children', yshort: 'resistance to breathing',
          xvar: 'height', yvar: 'resistance', xunit: 'cm', yunit: 'units',
          n: [20, 26], xlo: 90, xhi: 150, xdp: 0, ydp: 1,
          b0: [40, 52], b1: [0.20, 0.32], sigma: [3.5, 8.0],
          model: 'Resistance = β₀ + β₁ (Height) + ε',
          x0: [95, 108], dx: [10, 10], direction: 'decreases'
        },
        {
          key: 'wear',
          intro: function (c) {
            return 'An engineer recorded the cutting speed (m/min) and the resulting tool life (minutes) for ' + c.n + ' independent test runs.';
          },
          xlabel: 'Cutting speed (m/min)', ylabel: 'Tool life (min)',
          xshort: 'cutting speed', yshort: 'tool life',
          xvar: 'speed', yvar: 'life', xunit: 'm/min', yunit: 'min',
          n: [18, 24], xlo: 60, xhi: 200, xdp: 0, ydp: 2,
          b0: [95, 130], b1: [0.28, 0.42], sigma: [11.0, 24.0],
          model: 'Tool life = β₀ + β₁ (Cutting speed) + ε',
          x0: [70, 95], dx: [10, 20], direction: 'decreases'
        }
      ]);
      var g = genXY(rng, ctx, { negative: true, pMin: 2e-5, pMax: 0.04 });
      if (!g) return null;
      var L = g.L, x = g.x, y = g.y, n = g.n;
      var pOne = S.tCdf(L.t, L.df);
      var dx = rng.int(ctx.dx[0], ctx.dx[1]);
      var conf95 = 0.95, conf99 = 0.99;
      var tc95 = S.tInv(0.975, L.df), tc99 = S.tInv(0.995, L.df);
      var chg = L.b1 * dx;
      var chgCI = [chg - tc95 * dx * L.seB1, chg + tc95 * dx * L.seB1];
      var x0 = S.round(rng.uniform(ctx.x0[0], ctx.x0[1]), ctx.xdp);
      var me99 = tc99 * L.seMean(x0);

      // reverse-engineered rejection rule: |b1hat| > c  =>  alpha
      var c = S.round(Math.abs(L.b1) * rng.uniform(0.75, 1.35), 3);
      var alpha = 2 * (1 - S.tCdf(c / L.seB1, L.df));

      var haChoice = shuffleChoice(rng, [
        'H₁: β₁ < 0', 'H₁: β₁ ≠ 0', 'H₁: β₁ > 0', 'H₁: β̂₁ < 0', 'H₁: β₁ = 0'
      ], 0);
      var haRuleChoice = shuffleChoice(rng, [
        'H₁: β₁ ≠ 0', 'H₁: β₁ < 0', 'H₁: β₁ > 0', 'H₁: β₁ = 0'
      ], 0);
      var evid = evidenceLabel(pOne);
      var evChoice = shuffleChoice(rng,
        ['strong evidence', 'some or moderate evidence', 'weak or no evidence'],
        ['strong evidence', 'some or moderate evidence', 'weak or no evidence'].indexOf(evid));

      return {
        intro: '<p>' + ctx.intro({ n: n }) + '</p><p class="model">' + ctx.model + '</p>',
        data: slrDataBlocks(ctx, x, y),
        plot: { type: 'scatter', x: x, y: y, xlabel: ctx.xlabel, ylabel: ctx.ylabel, b0: L.b0, b1: L.b1 },
        parts: [
          num({ label: 'a) i)', marks: 1, prompt: 'Intercept β̂₀ of the least-squares line', answer: L.b0, dp: 2,
            solution: 'ŷ(x) = ' + fmt(L.b0, 3) + ' ' + signed(L.b1, 3) + 'x<br>' + regSolutionCode(ctx) }),
          num({ label: 'a) i)', marks: 1, prompt: 'Slope β̂₁ of the least-squares line', answer: L.b1, dp: 3,
            solution: 'β̂₁ = S<sub>xy</sub>/S<sub>xx</sub> = ' + fmt(L.b1, 5) }),
          mc({ label: 'a) ii)', marks: 1,
            prompt: 'Is there evidence that the average ' + ctx.yshort + ' <b>' + ctx.direction +
              '</b> as ' + ctx.xshort + ' increases? Choose the alternative hypothesis (against H₀: β₁ = 0).',
            options: haChoice.options, correct: haChoice.correct,
            solution: '“Decreases as x increases” is a claim about the direction of the slope, so the test is one-sided: H₁: β₁ &lt; 0.' }),
          num({ label: 'a) ii)', marks: 1, prompt: 'Observed value of the test statistic', answer: L.t, dp: 3,
            solution: 't = β̂₁/SE(β̂₁) = ' + fmt(L.b1, 5) + '/' + sig(L.seB1) + ' = <b>' + fmt(L.t, 4) + '</b> on ' + L.df + ' df.' }),
          num({ label: 'a) ii)', marks: 1, prompt: 'Degrees of freedom of the null distribution', answer: L.df, dp: 0, integer: true,
            solution: 'df = n − 2 = ' + L.df }),
          num({ label: 'a) ii)', marks: 2, prompt: 'One-sided p-value', answer: pOne, dp: 6,
            traps: [{ value: 2 * pOne, msg: 'That is the two-sided p-value that MATLAB reports. Halve it for a one-sided alternative (the estimate is on the H₁ side).' }],
            hint: 'MATLAB’s <code>fitlm</code> p-value is two-sided. For H₁: β₁ &lt; 0 use <code>tcdf(t, df)</code>.',
            solution: 'p = P(T<sub>' + L.df + '</sub> &lt; ' + fmt(L.t, 4) + ') = <b>' + fmt(pOne, 8) + '</b>' +
              '<br><code>p = tcdf(' + fmt(L.t, 4) + ', ' + L.df + ')</code> &nbsp;(= half the two-sided p-value here)' }),
          mc({ label: 'a) ii)', marks: 1, prompt: 'Conclusion: we have … that the average ' + ctx.yshort + ' ' + ctx.direction + ' as ' + ctx.xshort + ' increases.',
            options: evChoice.options, correct: evChoice.correct,
            solution: 'p = ' + fmt(pOne, 6) + '. Convention used in this course: p &lt; 0.01 → strong evidence; 0.01 ≤ p &lt; 0.1 → some or moderate evidence; p ≥ 0.1 → weak or no evidence.' }),
          iv({ label: 'a) iii)', marks: 1,
            prompt: 'Two-sided 95% confidence interval for the average change in the response for an increase of ' + dx + ' ' + ctx.xunit + '.',
            answer: chgCI, dp: 3,
            solution: 'Δx·β̂₁ ± t<sub>0.975,' + L.df + '</sub>·Δx·SE(β̂₁) = ' + fmt(chg, 4) + ' ± ' + fmt(tc95 * dx * L.seB1, 4) +
              ' = [' + fmt(chgCI[0], 4) + ', ' + fmt(chgCI[1], 4) + ']' }),
          num({ label: 'a) iv)', marks: 1, prompt: 'Predict the average response at x = ' + fmt(x0, ctx.xdp) + '.',
            answer: L.fit(x0), dp: 3,
            solution: 'ŷ = ' + fmt(L.fit(x0), 4) }),
          num({ label: 'a) iv)', marks: 1, prompt: 'Margin of error of the 99% CI for the average response at x = ' + fmt(x0, ctx.xdp),
            answer: me99, dp: 3,
            traps: [{ value: tc99 * L.sePred(x0), msg: 'You used the prediction SE. For the <i>average</i> response drop the “1 +”.' }],
            hint: 't<sub>0.995,' + L.df + '</sub> · s · √(1/n + (x₀−x̄)²/S<sub>xx</sub>)',
            solution: 't<sub>0.995,' + L.df + '</sub> = ' + fmt(tc99, 4) + ', SE = ' + sig(L.seMean(x0)) +
              ' → margin = <b>' + fmt(me99, 4) + '</b>' }),
          mc({ label: 'a) v) 1.', marks: 1,
            prompt: 'A student tested H₀: β₁ = 0 and obtained the rejection rule { reject H₀ if |β̂₁| &gt; ' + fmt(c, 3) + ' }. What was their alternative hypothesis?',
            options: haRuleChoice.options, correct: haRuleChoice.correct,
            solution: 'The rule rejects for <b>large absolute</b> values of β̂₁ — deviations in either direction — so the alternative is two-sided: H₁: β₁ ≠ 0.' }),
          num({ label: 'a) v) 2.', marks: 2, prompt: 'Determine the value of α for that rejection rule.',
            answer: alpha, dp: 4,
            hint: '|β̂₁| > c ⇔ |t| > c/SE(β̂₁). Then α = 2·P(T<sub>' + L.df + '</sub> > c/SE(β̂₁)).',
            solution: 'c/SE(β̂₁) = ' + fmt(c, 3) + '/' + sig(L.seB1) + ' = ' + fmt(c / L.seB1, 4) + '.<br>' +
              'α = 2(1 − F<sub>t,' + L.df + '</sub>(' + fmt(c / L.seB1, 4) + ')) = <b>' + fmt(alpha, 6) + '</b>' +
              '<br><code>alpha = 2*(1 - tcdf(' + fmt(c, 3) + '/' + sig(L.seB1, 6) + ', ' + L.df + '))</code>' }),
          ms({ label: 'b)', marks: 3, prompt: 'Select <b>all</b> assumptions of the linear regression model.',
            options: REG_ASSUMPTIONS, correct: REG_ASSUMPTIONS_CORRECT, shuffleWith: rng,
            solution: 'Linear mean, independent errors, constant variance, normal errors. Justify them with (i) a scatterplot with the fitted line, (ii) residuals vs fitted values, (iii) a normal Q–Q plot of the residuals.' })
        ]
      };
    }
  };

  /* ================= T3: one proportion — test, sample size, power, exact p ================= */

  var T_PROP = {
    id: 'proportion',
    topic: 'Proportions & binomial',
    title: 'Inference for a proportion: z-test, sample size, power, exact p-value',
    marks: 11,
    build: function (rng) {
      var ctx = rng.pick([
        { intro: 'A new method of seeding clouds was successful in <b>{x}</b> of <b>{n}</b> attempts, while the old method is known to be successful in <b>{p0}%</b> of attempts. Can we conclude that the new method is better than the old one?', thing: 'successful seeding attempts' },
        { intro: 'A quality engineer finds that <b>{x}</b> of <b>{n}</b> randomly inspected components pass a new tolerance test, whereas the historical pass rate is <b>{p0}%</b>. Is the new process better?', thing: 'components that pass' },
        { intro: 'In a clinical trial, a new treatment produced remission in <b>{x}</b> of <b>{n}</b> patients. The standard treatment is known to produce remission in <b>{p0}%</b> of patients. Does the new treatment do better?', thing: 'patients in remission' }
      ]);
      var p0 = rng.pick([0.25, 0.30, 0.35, 0.40, 0.45]);
      var n = rng.int(120, 260);
      var pTrue = p0 + rng.uniform(0.05, 0.12);
      var xObs = Math.max(1, Math.min(n - 1, Math.round(n * pTrue + rng.normal(0, 3))));
      var res = S.propZTest(xObs, n, p0, 'greater');
      if (res.p > 0.15 || res.p < 5e-4) return null;
      var E = rng.pick([0.02, 0.03, 0.04, 0.05]);
      var confSS = rng.pick([0.90, 0.95, 0.98, 0.99]);
      var nReq = S.propSampleSize(E, confSS);
      var alpha = rng.pick([0.05, 0.01, 0.10]);
      var p1 = S.round(p0 + rng.pick([0.05, 0.06, 0.08, 0.10]), 3);
      var power = S.propPower(n, p0, p1, alpha);
      var exactP = S.binomSf(xObs, n, p0);
      var zc = S.normInv(1 - (1 - confSS) / 2);
      var crit = p0 + S.normInv(1 - alpha) * Math.sqrt(p0 * (1 - p0) / n);

      var hypChoice = shuffleChoice(rng, [
        'H₀: π = ' + p0 + ' &nbsp; vs &nbsp; H₁: π &gt; ' + p0,
        'H₀: π = ' + p0 + ' &nbsp; vs &nbsp; H₁: π ≠ ' + p0,
        'H₀: p̂ = ' + p0 + ' &nbsp; vs &nbsp; H₁: p̂ &gt; ' + p0,
        'H₀: π &gt; ' + p0 + ' &nbsp; vs &nbsp; H₁: π = ' + p0,
        'H₀: π = ' + fmt(xObs / n, 3) + ' &nbsp; vs &nbsp; H₁: π &gt; ' + fmt(xObs / n, 3)
      ], 0);
      var conc = shuffleChoice(rng, [
        'p = ' + fmt(res.p, 4) + ' &lt; 0.05, so we reject H₀: there is ' + evidenceLabel(res.p) +
          ' that the true long-run proportion exceeds ' + p0 + '.',
        'p = ' + fmt(res.p, 4) + ', so we have proved that the new method is better.',
        'p = ' + fmt(res.p, 4) + ' &lt; 0.05, so the probability that H₀ is true is ' + fmt(res.p, 4) + '.',
        'Since p̂ = ' + fmt(res.phat, 4) + ' &gt; ' + p0 + ', the new method is better regardless of the p-value.'
      ], 0);

      return {
        intro: '<p>' + ctx.intro.replace('{x}', xObs).replace('{n}', n).replace('{p0}', fmt(p0 * 100, 0)) + '</p>',
        data: [dataBlock('Counts',
          'x = ' + xObs + '; n = ' + n + '; p0 = ' + p0 + ';',
          'x, n, p0 = ' + xObs + ', ' + n + ', ' + p0)],
        parts: [
          mc({ label: 'a) i)', marks: 1, prompt: 'State the hypotheses for a one-sided test that the true long-run proportion π exceeds ' + p0 + '.',
            options: hypChoice.options, correct: hypChoice.correct,
            solution: 'Hypotheses concern the <b>parameter</b> π, not the statistic p̂, and “exceeds” makes it upper-tailed.' }),
          num({ label: 'a) ii)', marks: 2, prompt: 'Observed test statistic (normal approximation)',
            answer: res.z, dp: 4,
            traps: [{ value: (res.phat - p0) / Math.sqrt(res.phat * (1 - res.phat) / n), msg: 'You used p̂ in the standard error. For a hypothesis test the SE uses the <b>null</b> value π₀.' }],
            hint: 'z = (p̂ − π₀)/√(π₀(1−π₀)/n) with p̂ = ' + xObs + '/' + n,
            solution: 'p̂ = ' + fmt(res.phat, 6) + ', SE₀ = √(' + p0 + '×' + fmt(1 - p0, 2) + '/' + n + ') = ' + sig(res.se) +
              '<br>z = <b>' + fmt(res.z, 4) + '</b><br><code>phat = ' + xObs + '/' + n + '; z = (phat - ' + p0 + ')/sqrt(' + p0 + '*' + fmt(1 - p0, 2) + '/' + n + ')</code>' }),
          num({ label: 'a) iii)', marks: 1, prompt: 'p-value (normal approximation)',
            answer: res.p, dp: 4,
            traps: [{ value: 2 * res.p, msg: 'Two-sided p-value — this alternative is one-sided.' },
                    { value: 1 - res.p, msg: 'You took the lower tail. For H₁: π > π₀ the p-value is the <b>upper</b> tail.' }],
            hint: 'p = P(Z &gt; z) = <code>1 - normcdf(z)</code>',
            solution: 'p = 1 − Φ(' + fmt(res.z, 4) + ') = <b>' + fmt(res.p, 6) + '</b><br><code>p = 1 - normcdf(' + fmt(res.z, 4) + ')</code>' }),
          mc({ label: 'a) iv)', marks: 1, prompt: 'Write the conclusion of the test in plain language.',
            options: conc.options, correct: conc.correct,
            solution: 'A p-value is P(data this extreme | H₀ true) — not the probability that H₀ is true, and never a proof.' }),
          num({ label: 'b)', marks: 2,
            prompt: 'How large a sample is required to be at least ' + confPct(confSS) + ' confident that p̂ differs from π by at most ' + E + ', <b>regardless of the value of π</b>?',
            answer: nReq, dp: 0, integer: true,
            traps: [{ value: Math.ceil(zc * zc * res.phat * (1 - res.phat) / (E * E)), msg: 'You used the observed p̂. “Regardless of π” means the worst case π = 0.5.' },
                    { value: Math.floor(zc * zc * 0.25 / (E * E)), msg: 'Round <b>up</b> — rounding down gives less than the required confidence.' }],
            hint: 'n ≥ z²<sub>1−α/2</sub> π(1−π)/E², maximised at π = 0.5, then round up.',
            solution: 'z<sub>' + fmt(1 - (1 - confSS) / 2, 3) + '</sub> = ' + fmt(zc, 4) + '. Worst case π(1−π) = 0.25.<br>' +
              'n ≥ ' + fmt(zc, 4) + '² × 0.25 / ' + E + '² = ' + fmt(zc * zc * 0.25 / (E * E), 3) + ' → <b>' + nReq + '</b>' +
              '<br><code>n = ceil(norminv(' + fmt(1 - (1 - confSS) / 2, 3) + ')^2*0.25/' + E + '^2)</code>' }),
          num({ label: 'c)', marks: 3,
            prompt: 'Suppose the true proportion is π = ' + p1 + '. Compute the power of the test in (a) at significance level α = ' + alpha + '.',
            answer: power, dp: 4,
            traps: [{ value: 1 - power, msg: 'That is β = P(type II error). Power = 1 − β.' }],
            hint: 'Find the critical p̂ under H₀, then compute P(p̂ &gt; critical) when π = ' + p1 + ' (using the SE at π = ' + p1 + ').',
            solution: 'Reject when p̂ &gt; π₀ + z<sub>' + fmt(1 - alpha, 2) + '</sub>√(π₀(1−π₀)/n) = ' + p0 + ' + ' +
              fmt(S.normInv(1 - alpha), 4) + '×' + sig(Math.sqrt(p0 * (1 - p0) / n)) + ' = ' + fmt(crit, 6) + '.<br>' +
              'Power = P(p̂ &gt; ' + fmt(crit, 6) + ' | π = ' + p1 + ') = 1 − Φ((' + fmt(crit, 5) + ' − ' + p1 + ')/√(' + p1 + '×' + fmt(1 - p1, 3) + '/' + n + ')) = <b>' + fmt(power, 6) + '</b>' +
              '<br><code>crit = ' + p0 + ' + norminv(' + fmt(1 - alpha, 3) + ')*sqrt(' + p0 + '*' + fmt(1 - p0, 2) + '/' + n + ');<br>' +
              'power = 1 - normcdf((crit - ' + p1 + ')/sqrt(' + p1 + '*' + fmt(1 - p1, 3) + '/' + n + '))</code>' }),
          num({ label: 'd)', marks: 2, prompt: 'The p-value above is only approximate. Calculate the <b>exact</b> p-value.',
            answer: exactP, dp: 4,
            traps: [{ value: 1 - S.binomCdf(xObs, n, p0), msg: 'Off by one: P(X ≥ x) = 1 − P(X ≤ x−1), so use <code>binocdf(x-1, …)</code>.' }],
            hint: 'Under H₀, X ~ Bin(' + n + ', ' + p0 + '). You want P(X ≥ ' + xObs + ').',
            solution: 'p = P(X ≥ ' + xObs + ') = 1 − P(X ≤ ' + (xObs - 1) + ') = <b>' + fmt(exactP, 6) + '</b>' +
              '<br><code>p = 1 - binocdf(' + (xObs - 1) + ', ' + n + ', ' + p0 + ')</code>' +
              '<br>Python: <code>1 - stats.binom.cdf(' + (xObs - 1) + ', ' + n + ', ' + p0 + ')</code>' })
        ]
      };
    }
  };

  /* ================= T4: one-way ANOVA from raw data ================= */

  var T_ANOVA_DATA = {
    id: 'anova-data',
    topic: 'ANOVA',
    title: 'One-way ANOVA from raw data',
    marks: 15,
    build: function (rng) {
      var ctx = rng.pick([
        { intro: 'Several aluminium alloys are under consideration for heavy-duty circuit wiring. Specimens of each wire are tested by applying a fixed voltage and measuring the current (amps) passing through the wire. Would you conclude that the alloys differ in resistance?',
          groupName: 'Alloy', unit: 'amps', names: ['1', '2', '3', '4'], varName: 'Current', base: 1.01, spread: 0.03, noise: 0.025, dp: 3, ns: [4, 3, 5, 4] },
        { intro: 'Plasma bradykininogen levels (mcg/mL) were measured in normal patients, patients with active Hodgkin’s disease, and patients with inactive Hodgkin’s disease. Would you conclude the mean levels are the same for all three groups?',
          groupName: 'Patients', unit: 'mcg/mL', names: ['normal', 'activeH', 'inactiveH'], varName: 'levels', base: 5.6, spread: 1.6, noise: 1.5, dp: 2, ns: [13, 13, 13] },
        { intro: 'A food scientist measured the vitamin C content (mg/100 g) of a fruit stored under four different packaging conditions. Do the packaging methods differ in mean vitamin C content?',
          groupName: 'Packaging', unit: 'mg/100g', names: ['A', 'B', 'C', 'D'], varName: 'vitC', base: 28, spread: 3.0, noise: 2.4, dp: 1, ns: [6, 6, 5, 6] },
        { intro: 'Three suppliers provide the same steel component. A batch from each supplier was tested and the breaking strength (MPa) recorded. Do the suppliers differ in mean breaking strength?',
          groupName: 'Supplier', unit: 'MPa', names: ['S1', 'S2', 'S3'], varName: 'strength', base: 420, spread: 14, noise: 11, dp: 1, ns: [7, 8, 7] }
      ]);
      var k = ctx.names.length;
      var groups = [], i, j, mus = [];
      for (i = 0; i < k; i++) mus.push(ctx.base + rng.normal(0, ctx.spread));
      for (i = 0; i < k; i++) {
        var g = [];
        for (j = 0; j < ctx.ns[i]; j++) g.push(S.round(mus[i] + rng.normal(0, ctx.noise), ctx.dp));
        groups.push(g);
      }
      var A = S.anova1(groups);
      if (!isFinite(A.F) || A.p > 0.30 || A.p < 1e-4) return null;
      var conf = rng.pick([0.90, 0.95, 0.99]);
      var alphaPair = rng.pick([0.01, 0.05]);
      // pick the two most separated groups for the follow-up comparison
      var ia = 0, ib = 1, best = -1;
      for (i = 0; i < k; i++) for (j = i + 1; j < k; j++) {
        var d = Math.abs(A.means[i] - A.means[j]);
        if (d > best) { best = d; ia = i; ib = j; }
      }
      var ciD = A.ciDiff(ia, ib, conf);
      var tD = A.tDiff(ia, ib);
      var pD = 2 * (1 - S.tCdf(Math.abs(tD), A.dfE));

      var h0 = shuffleChoice(rng, [
        'H₀: μ₁ = μ₂ = … = μ<sub>' + k + '</sub>',
        'H₀: μ₁ = 0 and μ₂ = 0 and … and μ<sub>' + k + '</sub> = 0',
        'H₀: μ₁ = 0 or μ₂ = 0 or … or μ<sub>' + k + '</sub> = 0',
        'H₀: at least one μ<sub>i</sub> differs from the others'
      ], 0);
      var ha = shuffleChoice(rng, [
        'H₁: at least one pair of means differs (μ<sub>i</sub> ≠ μ<sub>j</sub> for some i ≠ j)',
        'H₁: μ₁ ≠ μ₂ ≠ … ≠ μ<sub>' + k + '</sub>',
        'H₁: μ₁ ≠ 0 and μ₂ ≠ 0 and … and μ<sub>' + k + '</sub> ≠ 0',
        'H₁: all of the means differ from one another'
      ], 0);
      var pcode = shuffleChoice(rng, [
        '<code>p = 1 - fcdf(F, ' + A.dfTr + ', ' + A.dfE + ')</code>',
        '<code>p = fcdf(F, ' + A.dfTr + ', ' + A.dfE + ')</code>',
        '<code>p = 2*(1 - fcdf(F, ' + A.dfTr + ', ' + A.dfE + '))</code>',
        '<code>p = 1 - tcdf(F, ' + A.dfE + ')</code>',
        '<code>p = 1 - fcdf(F, ' + A.dfE + ', ' + A.dfTr + ')</code>'
      ], 0);
      var conc = shuffleChoice(rng, [
        (A.p < 0.05
          ? 'p = ' + fmt(A.p, 4) + ' &lt; 0.05, so we reject H₀ — there is ' + evidenceLabel(A.p) + ' that the true group means are not all equal.'
          : 'p = ' + fmt(A.p, 4) + ' &gt; 0.05, so we do not reject H₀ — there is ' + evidenceLabel(A.p) + ' of a difference between the true group means.'),
        'p = ' + fmt(A.p, 4) + ', so all of the group means are different from one another.',
        'p = ' + fmt(A.p, 4) + ', so H₀ is true and the groups are identical.',
        'The largest sample mean is ' + fmt(Math.max.apply(null, A.means), 3) + ', which proves that group is best.'
      ], 0);

      var mlGroups = ctx.names.map(function (nm, idx) {
        return '"' + nm + '"'; });
      var allVals = [], labels = [];
      groups.forEach(function (g, idx) {
        g.forEach(function (v) { allVals.push(v); labels.push('"' + ctx.names[idx] + '"'); });
      });

      return {
        intro: '<p>' + ctx.intro + '</p><p>Let μ₁, …, μ<sub>' + k + '</sub> denote the true mean ' +
          ctx.varName.toLowerCase() + ' (' + ctx.unit + ') for the ' + k + ' groups.</p>' +
          tableHtml([['<b>' + ctx.groupName + '</b>', ['<b>' + ctx.varName + ' (' + ctx.unit + ')</b>']]].concat(
            groups.map(function (g, idx) { return [ctx.names[idx], [g.map(function (v) { return fmt(v, ctx.dp); }).join(', ')]]; }))),
        data: [dataBlock('MATLAB / Python',
          ctx.varName + ' = ' + mlVec(allVals, ctx.dp) + ';\n' +
          ctx.groupName.toLowerCase() + ' = categorical([' + labels.join(', ') + ']);\n' +
          '[p, tbl, stats] = anova1(' + ctx.varName + ', ' + ctx.groupName.toLowerCase() + ');',
          'import numpy as np\nfrom scipy import stats\n' +
          groups.map(function (g, idx) { return 'g' + (idx + 1) + ' = np.array(' + mlVec(g, ctx.dp) + ')'; }).join('\n') +
          '\nF, p = stats.f_oneway(' + groups.map(function (_, idx) { return 'g' + (idx + 1); }).join(', ') + ')')],
        plot: { type: 'box', groups: groups, names: ctx.names, ylabel: ctx.varName + ' (' + ctx.unit + ')' },
        parts: [
          wr({ label: 'a)', marks: 2,
            prompt: 'Construct comparative boxplots. What do they tell you about the ' + ctx.varName.toLowerCase() + ' for the different groups? Comment on location, spread and shape.',
            placeholder: 'Location (centres), spread (box widths / whiskers), shape (skew), outliers…',
            checklist: ['Compared <b>location</b> (medians)', 'Compared <b>spread</b> (IQR / whisker length)',
              'Commented on <b>shape</b> (symmetry or skew)', 'Noted outliers', 'Linked spread to the equal-variance assumption'],
            model: 'Group medians: ' + groups.map(function (g, idx) { return ctx.names[idx] + ' ≈ ' + fmt(S.quantile(g, 0.5), ctx.dp); }).join(', ') +
              '. Sample means: ' + A.means.map(function (m, idx) { return ctx.names[idx] + ' = ' + fmt(m, ctx.dp); }).join(', ') +
              '. Sample SDs: ' + groups.map(function (g, idx) { return ctx.names[idx] + ' = ' + fmt(S.sd(g), ctx.dp + 1); }).join(', ') +
              '. A good answer says which group sits highest/lowest, whether the boxes overlap, whether the spreads are comparable (the equal-variance assumption) and whether any group looks skewed or has outliers.',
            code: 'boxplot(' + ctx.varName + ', ' + ctx.groupName.toLowerCase() + ')' }),
          ms({ label: 'b) i)', marks: 3, prompt: 'Select <b>all</b> assumptions that must hold for a one-way ANOVA.',
            options: ANOVA_ASSUMPTIONS, correct: ANOVA_ASSUMPTIONS_CORRECT, shuffleWith: rng,
            solution: 'Independence, normality within groups, and a common variance. Equal sample sizes are <i>not</i> required (though they make the test more robust).' }),
          wr({ label: 'b) ii)', marks: 2, prompt: 'Comment on the suitability of these assumptions for these data.',
            placeholder: 'Address each assumption in turn…',
            checklist: ['Addressed independence (study design / random sampling)',
              'Addressed normality (boxplot symmetry, Q–Q plot; small n means limited power to check)',
              'Addressed equal variance (compare spreads; largest SD ÷ smallest SD)'],
            model: 'Independence: the specimens/subjects are separate units chosen at random, so this is plausible from the design. ' +
              'Normality: with n<sub>i</sub> = ' + A.ns.join(', ') + ' there is little power to detect non-normality; the boxplots are the practical check. ' +
              'Equal variance: sample SDs are ' + groups.map(function (g) { return fmt(S.sd(g), ctx.dp + 1); }).join(', ') +
              ' (ratio of largest to smallest ≈ ' + fmt(Math.max.apply(null, groups.map(function (g) { return S.sd(g); })) /
                Math.min.apply(null, groups.map(function (g) { return S.sd(g); })), 2) +
              '). A rule of thumb is that a ratio under about 2 is acceptable.' }),
          mc({ label: 'c) i)', marks: 1, prompt: 'The null hypothesis is:', options: h0.options, correct: h0.correct,
            solution: 'ANOVA tests whether all group means are <b>equal to each other</b> — not whether they equal zero.' }),
          mc({ label: 'c) ii)', marks: 1, prompt: 'The alternative hypothesis is:', options: ha.options, correct: ha.correct,
            solution: 'The negation of “all equal” is “<b>at least one pair</b> differs” — not “all differ”.' }),
          num({ label: 'd) i)', marks: 1, prompt: 'Observed F test statistic', answer: A.F, dp: 4,
            hint: 'F = MS<sub>Tr</sub>/MS<sub>Er</sub>',
            solution: 'SS<sub>Tr</sub> = ' + sig(A.SSTr) + ' on ' + A.dfTr + ' df → MS<sub>Tr</sub> = ' + sig(A.MSTr) + '<br>' +
              'SS<sub>Er</sub> = ' + sig(A.SSE) + ' on ' + A.dfE + ' df → MS<sub>Er</sub> = ' + sig(A.MSE) + '<br>' +
              'F = <b>' + fmt(A.F, 4) + '</b>' }),
          num({ label: 'd) ii)', marks: 1, prompt: 'First (numerator) degrees of freedom', answer: A.dfTr, dp: 0, integer: true,
            solution: 'df₁ = k − 1 = ' + A.k + ' − 1 = ' + A.dfTr }),
          num({ label: 'd) iii)', marks: 1, prompt: 'Second (denominator) degrees of freedom', answer: A.dfE, dp: 0, integer: true,
            traps: [{ value: A.N - 1, msg: 'N − 1 is the total df. The error df is N − k = ' + A.N + ' − ' + A.k + '.' }],
            solution: 'df₂ = N − k = ' + A.N + ' − ' + A.k + ' = ' + A.dfE }),
          num({ label: 'd) iv)', marks: 1, prompt: 'p-value', answer: A.p, dp: 4,
            hint: 'Upper tail of the F distribution: <code>1 - fcdf(F, df1, df2)</code>',
            solution: 'p = P(F<sub>' + A.dfTr + ',' + A.dfE + '</sub> &gt; ' + fmt(A.F, 4) + ') = <b>' + fmt(A.p, 6) + '</b>' }),
          mc({ label: 'd) v)', marks: 1, prompt: 'Which MATLAB line computes that p-value from the null distribution?',
            options: pcode.options, correct: pcode.correct,
            solution: 'The ANOVA F test is always <b>upper-tailed</b>, with numerator df first: <code>1 - fcdf(F, ' + A.dfTr + ', ' + A.dfE + ')</code>.' }),
          mc({ label: 'e)', marks: 2, prompt: 'What is your conclusion from the analysis?', options: conc.options, correct: conc.correct,
            solution: 'A significant F says <b>at least one</b> mean differs; it does not identify which, and it never proves H₀.' }),
          iv({ label: 'f)', marks: 2,
            prompt: 'Construct a two-sided ' + confPct(conf) + ' confidence interval for μ<sub>' + (ia + 1) + '</sub> − μ<sub>' + (ib + 1) +
              '</sub> (groups “' + ctx.names[ia] + '” and “' + ctx.names[ib] + '”), using the ANOVA MS<sub>Er</sub> as the variance estimate.',
            answer: ciD, dp: 4,
            traps: [{ value: (A.means[ia] - A.means[ib]) - S.tInv(1 - (1 - conf) / 2, A.ns[ia] + A.ns[ib] - 2) * Math.sqrt(A.MSE * (1 / A.ns[ia] + 1 / A.ns[ib])), msg: 'You used n₁+n₂−2 df. When the variance comes from MS<sub>Er</sub>, use the ANOVA error df, N − k = ' + A.dfE + '.', which: 0 }],
            hint: '(x̄ᵢ − x̄ⱼ) ± t<sub>1−α/2, N−k</sub> · √(MS<sub>Er</sub>(1/nᵢ + 1/nⱼ))',
            solution: 'x̄<sub>' + ctx.names[ia] + '</sub> − x̄<sub>' + ctx.names[ib] + '</sub> = ' + fmt(A.means[ia] - A.means[ib], 5) +
              ', MS<sub>Er</sub> = ' + sig(A.MSE) + ', t<sub>' + fmt(1 - (1 - conf) / 2, 3) + ',' + A.dfE + '</sub> = ' +
              fmt(S.tInv(1 - (1 - conf) / 2, A.dfE), 4) + ', SE = ' + sig(Math.sqrt(A.MSE * (1 / A.ns[ia] + 1 / A.ns[ib]))) +
              '<br>CI = [' + fmt(ciD[0], 4) + ', ' + fmt(ciD[1], 4) + ']' }),
          num({ label: 'g) i)', marks: 2,
            prompt: 'Test H₀: μ<sub>' + (ia + 1) + '</sub> = μ<sub>' + (ib + 1) + '</sub> vs H₁: μ<sub>' + (ia + 1) + '</sub> ≠ μ<sub>' + (ib + 1) +
              '</sub> at α = ' + alphaPair + ' using MS<sub>Er</sub>. Observed test statistic =',
            answer: tD, dp: 4,
            hint: 't = (x̄ᵢ − x̄ⱼ)/√(MS<sub>Er</sub>(1/nᵢ + 1/nⱼ)) on N − k df.',
            solution: 't = ' + fmt(A.means[ia] - A.means[ib], 5) + ' / ' + sig(Math.sqrt(A.MSE * (1 / A.ns[ia] + 1 / A.ns[ib]))) +
              ' = <b>' + fmt(tD, 4) + '</b>, null distribution t on ' + A.dfE + ' df.' }),
          num({ label: 'g) ii)', marks: 1, prompt: 'p-value for that pairwise comparison', answer: pD, dp: 4,
            traps: [{ value: pD / 2, msg: 'The alternative is ≠, so the p-value is two-sided.' }],
            solution: 'p = 2(1 − F<sub>t,' + A.dfE + '</sub>(|' + fmt(tD, 4) + '|)) = <b>' + fmt(pD, 6) + '</b>' +
              '<br><code>p = 2*(1 - tcdf(abs(' + fmt(tD, 4) + '), ' + A.dfE + '))</code>' +
              '<br>At α = ' + alphaPair + ' we ' + (pD < alphaPair ? '<b>reject</b>' : '<b>do not reject</b>') + ' H₀.' })
        ]
      };
    }
  };

  /* ================= T5: ANOVA table completion + Bonferroni ================= */

  var T_ANOVA_TABLE = {
    id: 'anova-table',
    topic: 'ANOVA',
    title: 'Completing an ANOVA table and post-hoc corrections',
    marks: 11,
    build: function (rng) {
      var ctx = rng.pick([
        { intro: 'A researcher is studying the effect of {k} different diets on weight loss (kg) over 6 weeks. {N} participants were randomly assigned to the diet groups.', factor: 'Diet', unitName: 'weight loss' },
        { intro: 'An agronomist compares {k} fertiliser blends on plot yield (t/ha). {N} plots were randomly allocated to the blends.', factor: 'Fertiliser', unitName: 'yield' },
        { intro: 'A psychologist compares {k} training programs on reaction time (ms). {N} volunteers were randomly assigned to the programs.', factor: 'Program', unitName: 'reaction time' }
      ]);
      var k = rng.int(3, 5);
      var perGroup = rng.int(4, 7);
      var N = k * perGroup;
      var dfTr = k - 1, dfE = N - k;
      var MSE = S.round(rng.uniform(0.3, 1.4), 4);
      var F = rng.uniform(1.2, 9);
      var MSTr = MSE * F;
      var SSTr = S.round(MSTr * dfTr, 3), SSE = S.round(MSE * dfE, 3);
      MSTr = SSTr / dfTr; MSE = SSE / dfE; F = MSTr / MSE;
      var alpha = rng.pick([0.01, 0.05, 0.06, 0.10]);
      var crit = S.fInv(1 - alpha, dfTr, dfE);
      var p = 1 - S.fCdf(F, dfTr, dfE);
      var nPairs = k * (k - 1) / 2;
      var bonf = alpha / nPairs;

      var h0 = shuffleChoice(rng, [
        'H₀: μ₁ = μ₂ = … = μ<sub>' + k + '</sub> (all ' + k + ' true mean ' + ctx.unitName + 's are equal)',
        'H₀: μ₁ = μ₂ = … = μ<sub>' + k + '</sub> = 0',
        'H₀: at least two of the means differ',
        'H₀: x̄₁ = x̄₂ = … = x̄<sub>' + k + '</sub>'
      ], 0);
      var decision = shuffleChoice(rng,
        [F > crit ? 'rejected' : 'not rejected', F > crit ? 'not rejected' : 'rejected'], 0);

      return {
        intro: '<p>' + ctx.intro.replace('{k}', k).replace('{N}', N) + ' The researcher tests at the <b>' +
          fmt(alpha * 100, alpha * 100 % 1 === 0 ? 0 : 1) + '%</b> significance level. You are given the following partial ANOVA output.</p>' +
          tableHtml([
            ['Source', ['<b>SS</b>', '<b>df</b>']],
            [ctx.factor, [fmt(SSTr, 3), String(dfTr)]],
            ['Residual', [fmt(SSE, 3), String(dfE)]]
          ]),
        data: [],
        parts: [
          mc({ label: '(a)', marks: 2, prompt: 'The null hypothesis H₀ is:', options: h0.options, correct: h0.correct,
            solution: 'All ' + k + ' population means equal one another. Hypotheses are about population parameters μ, not sample means x̄.' }),
          num({ label: '(b)', marks: 1, prompt: 'Treatment mean square MS<sub>tr</sub>', answer: MSTr, dp: 3,
            solution: 'MS<sub>tr</sub> = SS<sub>tr</sub>/df<sub>tr</sub> = ' + fmt(SSTr, 3) + '/' + dfTr + ' = <b>' + fmt(MSTr, 4) + '</b>' }),
          num({ label: '(c)', marks: 1, prompt: 'Mean square error MS<sub>Er</sub>', answer: MSE, dp: 3,
            traps: [{ value: SSE / (N - 1), msg: 'Divide by N − k = ' + dfE + ', not N − 1.' }],
            solution: 'MS<sub>Er</sub> = SS<sub>Er</sub>/(N − k) = ' + fmt(SSE, 3) + '/' + dfE + ' = <b>' + fmt(MSE, 4) + '</b>' }),
          num({ label: '(d)', marks: 1, prompt: 'Observed F test statistic', answer: F, dp: 3,
            traps: [{ value: MSE / MSTr, msg: 'Upside down — F = MS<sub>tr</sub>/MS<sub>Er</sub>.' }],
            solution: 'F = ' + fmt(MSTr, 4) + '/' + fmt(MSE, 4) + ' = <b>' + fmt(F, 4) + '</b>' }),
          num({ label: '(e) i)', marks: 1, prompt: 'First degrees of freedom of the null distribution', answer: dfTr, dp: 0, integer: true,
            solution: 'k − 1 = ' + dfTr }),
          num({ label: '(e) ii)', marks: 1, prompt: 'Second degrees of freedom of the null distribution', answer: dfE, dp: 0, integer: true,
            solution: 'N − k = ' + N + ' − ' + k + ' = ' + dfE }),
          num({ label: '(f)', marks: 1,
            prompt: 'Rejection region: H₀ is rejected at the ' + fmt(alpha * 100, alpha * 100 % 1 === 0 ? 0 : 1) + '% level if the observed F exceeds',
            answer: crit, dp: 3,
            traps: [{ value: S.fInv(1 - alpha / 2, dfTr, dfE), msg: 'The ANOVA F test is one-tailed — do not split α.' },
                    { value: S.fInv(alpha, dfTr, dfE), msg: 'You took the lower tail; the rejection region is the <b>upper</b> tail.' }],
            hint: '<code>finv(1 - alpha, df1, df2)</code>',
            solution: 'F<sub>' + fmt(1 - alpha, 3) + ', ' + dfTr + ', ' + dfE + '</sub> = <b>' + fmt(crit, 4) + '</b>' +
              '<br><code>finv(' + fmt(1 - alpha, 3) + ', ' + dfTr + ', ' + dfE + ')</code>' }),
          num({ label: '(f) ii)', marks: 1, prompt: 'p-value for this F statistic', answer: p, dp: 4,
            solution: 'p = 1 − F<sub>cdf</sub>(' + fmt(F, 4) + ', ' + dfTr + ', ' + dfE + ') = <b>' + fmt(p, 6) + '</b>' }),
          mc({ label: '(g)', marks: 1, prompt: 'Therefore H₀ at that significance level is:', options: decision.options, correct: decision.correct,
            solution: 'F<sub>obs</sub> = ' + fmt(F, 4) + (F > crit ? ' &gt; ' : ' &lt; ') + fmt(crit, 4) + ' = F<sub>crit</sub> (equivalently p = ' +
              fmt(p, 5) + (p < alpha ? ' &lt; ' : ' &gt; ') + 'α), so H₀ is <b>' + (F > crit ? 'rejected' : 'not rejected') + '</b>.' }),
          num({ label: '(h)', marks: 1, prompt: 'How many pairwise comparisons are there between the ' + k + ' groups?',
            answer: nPairs, dp: 0, integer: true,
            traps: [{ value: k * (k - 1), msg: 'That counts each pair twice — divide by 2.' }],
            solution: 'C(' + k + ',2) = ' + k + '×' + (k - 1) + '/2 = <b>' + nPairs + '</b>' }),
          num({ label: '(i)', marks: 1,
            prompt: 'Using the Bonferroni correction to control the family-wise error rate at α = ' +
              fmt(alpha * 100, alpha * 100 % 1 === 0 ? 0 : 1) + '%, the adjusted significance level for each comparison is',
            answer: bonf, dp: 4,
            traps: [{ value: alpha * nPairs, msg: 'Bonferroni <b>divides</b> α by the number of comparisons.' }],
            solution: 'α* = α/m = ' + alpha + '/' + nPairs + ' = <b>' + fmt(bonf, 6) + '</b>. ' +
              'Each comparison is judged against α*, which keeps the family-wise error rate at most α.' })
        ]
      };
    }
  };

  /* ================= T6: linear combinations of normal random variables ================= */

  var T_NORMAL_COMBO = {
    id: 'normal-combo',
    topic: 'Normal distribution',
    title: 'Sums of normal random variables (independent and correlated)',
    marks: 6,
    build: function (rng) {
      var muX = rng.int(35, 60);
      var sdX = rng.pick([4, 5, 6, 7]);
      var sdY = rng.pick([1.5, 2, 2.5, 3]);
      var slack = rng.int(15, 30);
      var deadline = muX + slack;
      var prob = rng.pick([0.95, 0.975, 0.98, 0.99]);
      var rho = rng.pick([-0.4, -0.3, -0.25, 0.25, 0.3, 0.4]);
      var z = S.normInv(prob);
      var sdIndep = Math.sqrt(sdX * sdX + sdY * sdY);
      var muY1 = deadline - muX - z * sdIndep;
      var varCorr = sdX * sdX + sdY * sdY + 2 * rho * sdX * sdY;
      var sdCorr = Math.sqrt(varCorr);
      var muY2 = deadline - muX - z * sdCorr;

      var startH = 7, startM = 45;
      var endTotal = startH * 60 + startM + deadline;
      var endStr = Math.floor(endTotal / 60) + ':' + String(endTotal % 60).padStart(2, '0');

      var varChoice = shuffleChoice(rng, [
        'Var(X + Y) = σ²<sub>X</sub> + σ²<sub>Y</sub> + 2ρσ<sub>X</sub>σ<sub>Y</sub>',
        'Var(X + Y) = σ²<sub>X</sub> + σ²<sub>Y</sub>',
        'Var(X + Y) = σ²<sub>X</sub> + σ²<sub>Y</sub> − 2ρσ<sub>X</sub>σ<sub>Y</sub>',
        'Var(X + Y) = (σ<sub>X</sub> + σ<sub>Y</sub>)²',
        'Var(X + Y) = σ²<sub>X</sub> + σ²<sub>Y</sub> + ρ'
      ], 0);
      var whyChoice = shuffleChoice(rng, [
        rho < 0 ? 'A negative correlation reduces the variance of the total, so the same probability is achieved with more slack in the mean.'
                : 'A positive correlation increases the variance of the total, so less slack is available in the mean.',
        'Correlation changes the mean of the total but not its variance.',
        'Correlation makes the total non-normal, so the calculation is only approximate.',
        'The required μ<sub>Y</sub> never depends on the correlation.'
      ], 0);

      return {
        intro: '<p>A group of students travel to campus by train and then on foot. Their train leaves at <b>' +
          startH + ':' + String(startM).padStart(2, '0') + ' a.m.</b> precisely. The train journey time <i>X</i> is normally distributed with mean μ<sub>X</sub> = ' +
          muX + ' minutes and standard deviation σ<sub>X</sub> = ' + sdX + ' minutes. The time <i>Y</i> to walk from the terminal to the lecture room is normally distributed with mean μ<sub>Y</sub> and standard deviation σ<sub>Y</sub> = ' +
          sdY + ' minutes. The total travel time is X + Y minutes.</p>' +
          '<p>It is desired to have probability <b>' + prob + '</b> of arriving at the lecture room before <b>' + endStr + ' a.m.</b> (i.e. within ' + deadline + ' minutes).</p>',
        data: [],
        parts: [
          num({ label: 'a)', marks: 2, prompt: 'Assuming X and Y are independent, what should μ<sub>Y</sub> be?',
            answer: muY1, dp: 4,
            traps: [{ value: deadline - muX - z * (sdX + sdY), msg: 'Standard deviations do not add — <b>variances</b> do. Use √(σ²<sub>X</sub> + σ²<sub>Y</sub>).' }],
            hint: 'X + Y ~ N(μ<sub>X</sub> + μ<sub>Y</sub>, σ²<sub>X</sub> + σ²<sub>Y</sub>). Require P(X + Y ≤ ' + deadline + ') = ' + prob + '.',
            solution: 'SD(X+Y) = √(' + sdX + '² + ' + sdY + '²) = ' + sig(sdIndep) + '. Need μ<sub>X</sub> + μ<sub>Y</sub> + z<sub>' + prob +
              '</sub>·SD = ' + deadline + ', with z = ' + fmt(z, 5) + '.<br>μ<sub>Y</sub> = ' + deadline + ' − ' + muX + ' − ' +
              fmt(z, 5) + '×' + sig(sdIndep) + ' = <b>' + fmt(muY1, 5) + '</b>' +
              '<br><code>muY = ' + deadline + ' - ' + muX + ' - norminv(' + prob + ')*sqrt(' + sdX + '^2 + ' + sdY + '^2)</code>' }),
          mc({ label: 'b) i)', marks: 1, prompt: 'If X and Y have correlation ρ, the variance of the total is:',
            options: varChoice.options, correct: varChoice.correct,
            solution: 'Var(X+Y) = Var(X) + Var(Y) + 2Cov(X,Y), and Cov(X,Y) = ρσ<sub>X</sub>σ<sub>Y</sub>.' }),
          num({ label: 'b) ii)', marks: 2,
            prompt: 'Now suppose the walking time has correlation ρ = ' + rho + ' with the train journey time. What should μ<sub>Y</sub> be?',
            answer: muY2, dp: 4,
            traps: [{ value: muY1, msg: 'You ignored the covariance term 2ρσ<sub>X</sub>σ<sub>Y</sub>.' },
                    { value: deadline - muX - z * Math.sqrt(sdX * sdX + sdY * sdY - 2 * rho * sdX * sdY), msg: 'Sign error: for a <b>sum</b> the covariance term is +2ρσ<sub>X</sub>σ<sub>Y</sub> (the minus sign is for a difference).' }],
            hint: 'Var = σ²<sub>X</sub> + σ²<sub>Y</sub> + 2ρσ<sub>X</sub>σ<sub>Y</sub> = ' + sig(varCorr),
            solution: 'Cov = ' + rho + '×' + sdX + '×' + sdY + ' = ' + fmt(rho * sdX * sdY, 4) + '.<br>' +
              'Var(X+Y) = ' + sdX + '² + ' + sdY + '² + 2(' + fmt(rho * sdX * sdY, 4) + ') = ' + sig(varCorr) + ', SD = ' + sig(sdCorr) + '.<br>' +
              'μ<sub>Y</sub> = ' + deadline + ' − ' + muX + ' − ' + fmt(z, 5) + '×' + sig(sdCorr) + ' = <b>' + fmt(muY2, 5) + '</b>' +
              '<br><code>v = ' + sdX + '^2 + ' + sdY + '^2 + 2*' + rho + '*' + sdX + '*' + sdY + ';<br>muY = ' +
              deadline + ' - ' + muX + ' - norminv(' + prob + ')*sqrt(v)</code>' }),
          mc({ label: 'b) iii)', marks: 1,
            prompt: 'Compared with the independent case, the required μ<sub>Y</sub> here is ' + (rho < 0 ? 'larger' : 'smaller') + '. Why?',
            options: whyChoice.options, correct: whyChoice.correct,
            solution: 'Only the <b>variance</b> of the sum changes: means always add regardless of dependence, and a linear combination of jointly normal variables is still normal.' })
        ]
      };
    }
  };

  /* ================= T7: two-sample t ================= */

  var T_TTEST2 = {
    id: 'ttest2',
    topic: 'Two-sample t',
    title: 'Comparing two independent means',
    marks: 9,
    build: function (rng) {
      var ctx = rng.pick([
        { intro: 'In a survey of guests, a resort recorded overall satisfaction scores (out of 100) during one weekend. The hotel wishes to compare the ratings of overseas visitors with those of Australian visitors.',
          n1: 'overseas', n2: 'australians', g1: 'overseas visitors', g2: 'Australians', unit: 'points',
          mu1: 76, mu2: 63, sd: 11, dp: 0, n: [14, 18] },
        { intro: 'Two petrol stations were monitored over several weeks and the price of unleaded fuel (cents per litre) was recorded at each.',
          n1: 'caltex', n2: 'metro', g1: 'Caltex', g2: 'Metro Petroleum', unit: 'cents/L',
          mu1: 243, mu2: 228, sd: 6, dp: 2, n: [12, 14] },
        { intro: 'A materials lab compared the tensile strength (MPa) of specimens produced by two different curing processes.',
          n1: 'processA', n2: 'processB', g1: 'process A', g2: 'process B', unit: 'MPa',
          mu1: 318, mu2: 305, sd: 12, dp: 1, n: [12, 16] }
      ]);
      var n1 = rng.int(ctx.n[0], ctx.n[1]), n2 = rng.int(ctx.n[0], ctx.n[1]);
      var a = [], b = [], i;
      for (i = 0; i < n1; i++) a.push(S.round(rng.normal(ctx.mu1, ctx.sd), ctx.dp));
      for (i = 0; i < n2; i++) b.push(S.round(rng.normal(ctx.mu2, ctx.sd), ctx.dp));
      var conf = rng.pick([0.95, 0.97, 0.98, 0.99]);
      var T = S.tTest2(a, b, 'two', conf);
      if (!isFinite(T.t)) return null;
      var alpha = 1 - conf;
      var ciExcludesZero = (T.lo > 0 || T.hi < 0);

      var hyp = shuffleChoice(rng, [
        'H₀: μ₁ = μ₂ &nbsp; vs &nbsp; H₁: μ₁ ≠ μ₂',
        'H₀: μ₁ ≠ μ₂ &nbsp; vs &nbsp; H₁: μ₁ = μ₂',
        'H₀: x̄₁ = x̄₂ &nbsp; vs &nbsp; H₁: x̄₁ ≠ x̄₂',
        'H₀: μ₁ − μ₂ = ' + fmt(T.diff, 2) + ' &nbsp; vs &nbsp; H₁: μ₁ − μ₂ ≠ ' + fmt(T.diff, 2)
      ], 0);
      var fn = shuffleChoice(rng, MATLAB_FN_OPTIONS, 1);
      var logic = shuffleChoice(rng, [
        (ciExcludesZero
          ? 'Yes — the ' + confPct(conf) + ' CI does not contain 0, so at the ' + fmt(alpha * 100, 1) + '% level we reject H₀: μ₁ = μ₂.'
          : 'Yes — the ' + confPct(conf) + ' CI contains 0, so at the ' + fmt(alpha * 100, 1) + '% level we do not reject H₀: μ₁ = μ₂.'),
        'No — a confidence interval and a hypothesis test are unrelated procedures.',
        'Yes — the CI gives the exact p-value of the test.',
        'No — the CI is two-sided and the test is one-sided, so they can never be compared.'
      ], 0);

      return {
        intro: '<p>' + ctx.intro + ' You may assume both populations are normal, with means μ₁ for ' +
          ctx.g1 + ' and μ₂ for ' + ctx.g2 + ', and a common variance.</p>',
        data: [dataBlock('Data',
          ctx.n1 + ' = ' + mlVec(a, ctx.dp) + ';\n' + ctx.n2 + ' = ' + mlVec(b, ctx.dp) + ';',
          'import numpy as np\n' + ctx.n1 + ' = np.array(' + mlVec(a, ctx.dp) + ')\n' +
          ctx.n2 + ' = np.array(' + mlVec(b, ctx.dp) + ')')],
        plot: { type: 'box', groups: [a, b], names: [ctx.g1, ctx.g2], ylabel: ctx.unit },
        parts: [
          iv({ label: 'a)', marks: 2,
            prompt: 'Compute a ' + confPct(conf) + ' two-sided confidence interval for the true difference in means μ₁ − μ₂ (' + ctx.g1 + ' minus ' + ctx.g2 + ').',
            answer: [T.lo, T.hi], dp: 4,
            hint: '(x̄₁ − x̄₂) ± t<sub>1−α/2, n₁+n₂−2</sub> · s<sub>p</sub>√(1/n₁ + 1/n₂)',
            solution: 'x̄₁ = ' + fmt(T.m1, 4) + ', x̄₂ = ' + fmt(T.m2, 4) + ', s₁ = ' + fmt(T.s1, 4) + ', s₂ = ' + fmt(T.s2, 4) + '<br>' +
              's²<sub>p</sub> = ((n₁−1)s₁² + (n₂−1)s₂²)/(n₁+n₂−2) = ' + sig(T.sp2) + ', s<sub>p</sub> = ' + sig(T.sp) + '<br>' +
              'SE = ' + sig(T.se) + ', t<sub>' + fmt(1 - alpha / 2, 4) + ',' + T.df + '</sub> = ' + fmt(T.tcrit, 4) + '<br>' +
              'CI = ' + fmt(T.diff, 4) + ' ± ' + fmt(T.tcrit * T.se, 4) + ' = [<b>' + fmt(T.lo, 4) + ', ' + fmt(T.hi, 4) + '</b>]' +
              "<br><code>[h,p,ci] = ttest2(" + ctx.n1 + ", " + ctx.n2 + ", 'Alpha', " + fmt(alpha, 3) + ")</code>" }),
          mc({ label: 'b) i)', marks: 1, prompt: 'Identify the null and alternative hypotheses for testing whether the two groups differ.',
            options: hyp.options, correct: hyp.correct,
            solution: 'Hypotheses are statements about the population means μ, and “differ” is two-sided.' }),
          mc({ label: 'b) ii)', marks: 1, prompt: 'Select the MATLAB / Python function that performs this hypothesis test.',
            options: fn.options, correct: fn.correct,
            solution: 'Two <b>independent</b> samples with a common variance → <code>ttest2</code> / <code>stats.ttest_ind</code>. ' +
              '<code>ttest</code>/<code>ttest_rel</code> is for one sample or paired data; <code>anova1</code>/<code>f_oneway</code> generalises to ≥ 3 groups (and for 2 groups gives F = t²).' }),
          num({ label: 'b) iii)', marks: 1, prompt: 'Observed test statistic t =', answer: T.t, dp: 4,
            solution: 't = (x̄₁ − x̄₂)/(s<sub>p</sub>√(1/n₁+1/n₂)) = ' + fmt(T.diff, 4) + '/' + sig(T.se) + ' = <b>' + fmt(T.t, 4) + '</b>' }),
          num({ label: 'b) iv)', marks: 1, prompt: 'Degrees of freedom', answer: T.df, dp: 0, integer: true,
            traps: [{ value: Math.min(n1, n2) - 1, msg: 'That is the Welch-style shortcut. With a pooled variance, df = n₁ + n₂ − 2.' }],
            solution: 'df = n₁ + n₂ − 2 = ' + n1 + ' + ' + n2 + ' − 2 = ' + T.df }),
          num({ label: 'b) v)', marks: 1, prompt: 'Two-sided p-value', answer: T.p, dp: 4,
            solution: 'p = 2(1 − F<sub>t,' + T.df + '</sub>(|' + fmt(T.t, 4) + '|)) = <b>' + fmt(T.p, 6) + '</b>' }),
          mc({ label: 'c)', marks: 2,
            prompt: 'Based <b>only</b> on the confidence interval in (a), without further calculation, can you conclude the outcome of the two-sided test at the ' +
              fmt(alpha * 100, 1) + '% significance level?',
            options: logic.options, correct: logic.correct,
            solution: 'A two-sided level-α test and a 100(1−α)% CI are exactly equivalent: reject H₀: μ₁ − μ₂ = 0 iff 0 lies outside the interval. ' +
              'Here the CI is [' + fmt(T.lo, 4) + ', ' + fmt(T.hi, 4) + '], which ' + (ciExcludesZero ? 'excludes' : 'contains') + ' 0, and indeed p = ' + fmt(T.p, 5) + '. ' +
              'Note this only works when the CI’s confidence level matches the test’s α and both are two-sided.' })
        ]
      };
    }
  };

  /* ================= T8: CLT / sampling distribution ================= */

  var T_CLT = {
    id: 'clt',
    topic: 'CLT & sampling distributions',
    title: 'Central Limit Theorem and the sampling distribution of X̄',
    marks: 8,
    build: function (rng) {
      var d = rng.pick([120, 180, 240, 280, 300, 360]);
      var n1 = rng.pick([16, 25, 36, 49]);
      var n2 = rng.pick([100, 144, 156, 225]);
      var mu = d / 2, varX = d * d / 12;
      var se1 = Math.sqrt(varX / n1), se2 = Math.sqrt(varX / n2);
      var bound = S.round(mu + rng.uniform(3, 14), 0);
      var pAbove = 1 - S.normCdf((bound - mu) / se1);

      var cltChoice = shuffleChoice(rng, [
        'X̄ is approximately N(μ, σ²/n) for large n, where μ = E(X) and σ² = Var(X)',
        'X̄ is approximately N(μ, σ²) for large n',
        'X is approximately N(μ, σ²/n) for large n',
        'X̄ is exactly N(μ, σ²/n) for every n, whatever the parent distribution',
        'The sample values X₁, …, X<sub>n</sub> become normally distributed as n grows'
      ], 0);
      var condChoice = shuffleChoice(rng, ['True', 'False'], 0);
      var moreChoice = shuffleChoice(rng, [
        'More normal — the approximation in the CLT improves as n increases',
        'Less normal — a larger sample makes the histogram more skewed',
        'Unchanged — the shape of the sampling distribution does not depend on n',
        'Less normal — the standard deviation of X̄ shrinks, which makes it less bell-shaped'
      ], 0);

      return {
        intro: '<p>It is often postulated that insurance claims over a period follow a Uniform distribution. Suppose X ~ Uniform(0, d), with density f(x) = 1/d for 0 ≤ x ≤ d, so that E(X) = d/2 and Var(X) = d²/12.</p>' +
          '<p>For a particular insurance product, d = <b>' + d + '</b>. You are interested in the sampling distribution of the sample mean X̄ for different sample sizes.</p>',
        data: [dataBlock('Simulation',
          'samples = unifrnd(0, ' + d + ', ' + n1 + ', 1000);\n' +
          'sampleMeans = mean(samples);\n' +
          "histogram(sampleMeans, 'Normalization', 'pdf')\n" +
          "xlabel('Sample Mean'); ylabel('Density')",
          'import numpy as np, matplotlib.pyplot as plt\n' +
          'samples = np.random.uniform(0, ' + d + ', (1000, ' + n1 + '))\n' +
          'sampleMeans = samples.mean(axis=1)\n' +
          'plt.hist(sampleMeans, density=True)')],
        parts: [
          mc({ label: '(a)', marks: 2, prompt: 'Select the correct statement of the Central Limit Theorem for a random sample X₁, …, X<sub>n</sub>.',
            options: cltChoice.options, correct: cltChoice.correct,
            solution: 'The CLT is about the distribution of the <b>sample mean</b> (or sum), it is <b>approximate</b>, and the variance is divided by n. The individual X<sub>i</sub> keep their original distribution forever.' }),
          mc({ label: '(b)(i)', marks: 1, prompt: 'For a random sample from U(0, ' + d + '), the conditions of the CLT are satisfied. True or False?',
            options: condChoice.options, correct: condChoice.correct,
            solution: 'True — the observations are i.i.d. with finite mean and finite variance, which is all the CLT requires. The parent distribution does not need to be normal (or even symmetric).' }),
          num({ label: '(b)(iii)', marks: 1, prompt: 'Theoretical expected value E(X̄) for n = ' + n1, answer: mu, dp: 3,
            solution: 'E(X̄) = E(X) = d/2 = ' + d + '/2 = <b>' + fmt(mu, 3) + '</b> — it does not depend on n.' }),
          num({ label: '(b)(iv)', marks: 1, prompt: 'Theoretical standard deviation √Var(X̄) for n = ' + n1, answer: se1, dp: 3,
            traps: [{ value: Math.sqrt(varX), msg: 'That is the SD of a single observation. Divide the <b>variance</b> by n first: σ/√n.' },
                    { value: varX / n1, msg: 'You gave the variance, not the standard deviation.' }],
            hint: '√(σ²/n) with σ² = d²/12',
            solution: 'Var(X̄) = (d²/12)/n = ' + sig(varX) + '/' + n1 + ' = ' + sig(varX / n1) +
              ', so SD = <b>' + fmt(se1, 4) + '</b><br><code>sqrt((' + d + '^2/12)/' + n1 + ')</code>' }),
          num({ label: '(c)(i)', marks: 1, prompt: 'Theoretical standard deviation √Var(X̄) when the sample size is n = ' + n2,
            answer: se2, dp: 3,
            solution: 'SD = √((' + d + '²/12)/' + n2 + ') = <b>' + fmt(se2, 4) + '</b> — a factor of √(' + n2 + '/' + n1 + ') = ' +
              fmt(Math.sqrt(n2 / n1), 3) + ' smaller than for n = ' + n1 + '.' }),
          mc({ label: '(c)(ii)', marks: 2, prompt: 'Would the sampling distribution of X̄ become more or less normal with the larger sample? Why?',
            options: moreChoice.options, correct: moreChoice.correct,
            solution: 'More normal. The CLT’s approximation error decreases with n; the smaller spread is a separate effect and has nothing to do with shape.' }),
          num({ label: '(d)', marks: 1, prompt: 'Using the CLT, approximate P(X̄ &gt; ' + bound + ') for a sample of size n = ' + n1 + '.',
            answer: pAbove, dp: 4,
            hint: 'X̄ ≈ N(' + fmt(mu, 1) + ', ' + sig(se1 * se1) + '); standardise.',
            solution: 'z = (' + bound + ' − ' + fmt(mu, 1) + ')/' + sig(se1) + ' = ' + fmt((bound - mu) / se1, 4) +
              ', so P = 1 − Φ(z) = <b>' + fmt(pAbove, 6) + '</b>' +
              '<br><code>1 - normcdf(' + bound + ', ' + fmt(mu, 1) + ', sqrt((' + d + '^2/12)/' + n1 + '))</code>' }),
          wr({ label: '(b)(ii)', marks: 2,
            prompt: 'Run the simulation code above and produce the histogram. Is it consistent with what you expect from the CLT? Comment on central location, spread and shape.',
            placeholder: 'Centre ≈ …, spread ≈ …, shape …',
            checklist: ['Gave the expected <b>centre</b> (' + fmt(mu, 1) + ')',
              'Gave the expected <b>spread</b> (SD ≈ ' + fmt(se1, 3) + ')',
              'Said the shape is approximately <b>normal / bell-shaped and symmetric</b>',
              'Noted this happens even though the parent distribution is flat (uniform)'],
            model: 'The histogram should be centred near E(X̄) = ' + fmt(mu, 1) + ', have a spread of roughly SD = ' + fmt(se1, 3) +
              ' (so almost all values lie within ' + fmt(mu - 3 * se1, 1) + ' to ' + fmt(mu + 3 * se1, 1) +
              '), and be approximately bell-shaped and symmetric. This is consistent with the CLT: even though the parent U(0, ' + d +
              ') distribution is flat, the sampling distribution of the mean of n = ' + n1 + ' observations is close to normal.' })
        ]
      };
    }
  };

  /* ================= T9: binomial — exact, approximation, sums ================= */

  var T_BINOM = {
    id: 'binomial',
    topic: 'Proportions & binomial',
    title: 'Binomial distribution: exact and normal-approximation probabilities',
    marks: 11,
    build: function (rng) {
      var p = rng.pick([0.35, 0.4, 0.45, 0.55, 0.6]);
      var n = rng.pick([20, 25, 30, 40]);
      var n2 = rng.pick([100, 120, 125, 150]);
      var mu = n * p, sdv = Math.sqrt(n * p * (1 - p));
      var half = Math.floor(n / 2);
      var exactHalf = 1 - S.binomCdf(half, n, p);        // P(X > n/2)
      var approxHalf = 1 - S.normCdf((half + 0.5 - mu) / sdv); // with continuity correction
      var approxNoCC = 1 - S.normCdf((half - mu) / sdv);
      var nTot = n + n2, muTot = nTot * p, varTot = nTot * p * (1 - p);
      var k = rng.pick([4, 5, 6, 8]);
      var centre = Math.round(muTot);
      var exactTail = 1 - (S.binomCdf(centre + k, nTot, p) - S.binomCdf(centre - k - 1, nTot, p));

      return {
        intro: '<p>Suppose that <b>' + fmt(p * 100, 0) + '%</b> of the population favours a certain candidate in an upcoming election. ' +
          'In one study a random sample of size <b>' + n + '</b> is chosen. Let X₁ be the number in this sample who favour the candidate.</p>',
        data: [dataBlock('Parameters', 'n1 = ' + n + '; n2 = ' + n2 + '; p = ' + p + ';', 'n1, n2, p = ' + n + ', ' + n2 + ', ' + p)],
        parts: [
          num({ label: 'a) i)', marks: 1, prompt: 'Expected number in the sample who favour the candidate, E(X₁)',
            answer: mu, dp: 4,
            solution: 'X₁ ~ Bin(' + n + ', ' + p + '), so E(X₁) = np = ' + n + '×' + p + ' = <b>' + fmt(mu, 4) + '</b>' }),
          num({ label: 'a) ii)', marks: 1, prompt: 'Standard deviation of X₁', answer: sdv, dp: 4,
            traps: [{ value: n * p * (1 - p), msg: 'That is the variance — take the square root.' },
                    { value: Math.sqrt(p * (1 - p) / n), msg: 'That is the SD of the sample <b>proportion</b> p̂, not of the count X.' }],
            solution: 'SD = √(np(1−p)) = √(' + n + '×' + p + '×' + fmt(1 - p, 2) + ') = <b>' + fmt(sdv, 5) + '</b>' }),
          num({ label: 'b)', marks: 2, prompt: 'Calculate the <b>exact</b> probability that more than half the members of the sample favour the candidate.',
            answer: exactHalf, dp: 4,
            traps: [{ value: 1 - S.binomCdf(half - 1, n, p), msg: '“More than half” of ' + n + ' means X ≥ ' + (half + 1) + ', i.e. 1 − P(X ≤ ' + half + ').' }],
            hint: 'More than half of ' + n + ' means X ≥ ' + (half + 1) + '. Use <code>binocdf</code>.',
            solution: 'P(X &gt; ' + (n / 2) + ') = P(X ≥ ' + (half + 1) + ') = 1 − P(X ≤ ' + half + ') = <b>' + fmt(exactHalf, 6) + '</b>' +
              '<br><code>1 - binocdf(' + half + ', ' + n + ', ' + p + ')</code>' }),
          num({ label: 'c)', marks: 2, prompt: 'Approximate the probability in (b) using the Central Limit Theorem, <b>with</b> a continuity correction.',
            answer: approxHalf, dp: 4,
            traps: [{ value: approxNoCC, msg: 'That is the answer without the continuity correction — use ' + (half + 0.5) + ' rather than ' + half + '.' }],
            hint: 'X ≈ N(np, np(1−p)); P(X ≥ ' + (half + 1) + ') ≈ P(Z &gt; (' + (half + 0.5) + ' − μ)/σ).',
            solution: 'μ = ' + fmt(mu, 3) + ', σ = ' + fmt(sdv, 4) + '. With the continuity correction, ' +
              'z = (' + (half + 0.5) + ' − ' + fmt(mu, 3) + ')/' + fmt(sdv, 4) + ' = ' + fmt((half + 0.5 - mu) / sdv, 4) + '<br>' +
              'P ≈ 1 − Φ(z) = <b>' + fmt(approxHalf, 6) + '</b> (exact value ' + fmt(exactHalf, 6) + ')' +
              '<br><code>1 - normcdf(' + (half + 0.5) + ', ' + n + '*' + p + ', sqrt(' + n + '*' + p + '*' + fmt(1 - p, 2) + '))</code>' }),
          num({ label: 'd) i)', marks: 1,
            prompt: 'A second independent sample of size ' + n2 + ' is taken; X₂ is the number in it favouring the candidate. Compute E(X₁ + X₂).',
            answer: muTot, dp: 4,
            solution: 'E(X₁ + X₂) = (n₁ + n₂)p = ' + nTot + '×' + p + ' = <b>' + fmt(muTot, 4) + '</b>' }),
          num({ label: 'd) ii)', marks: 1, prompt: 'Compute Var(X₁ + X₂).', answer: varTot, dp: 4,
            traps: [{ value: Math.sqrt(varTot), msg: 'That is the standard deviation; the question asks for the variance.' }],
            hint: 'Independence means the variances add — and X₁ + X₂ ~ Bin(' + nTot + ', ' + p + ').',
            solution: 'Because the samples are independent, Var(X₁+X₂) = Var(X₁) + Var(X₂) = (n₁+n₂)p(1−p) = ' +
              nTot + '×' + p + '×' + fmt(1 - p, 2) + ' = <b>' + fmt(varTot, 4) + '</b>' }),
          num({ label: 'e)', marks: 3, prompt: 'Compute the exact probability P(|(X₁ + X₂) − ' + centre + '| &gt; ' + k + ').',
            answer: exactTail, dp: 4,
            traps: [{ value: S.binomCdf(centre + k, nTot, p) - S.binomCdf(centre - k - 1, nTot, p), msg: 'That is P(|S − ' + centre + '| ≤ ' + k + '). Subtract it from 1.' }],
            hint: 'X₁ + X₂ ~ Bin(' + nTot + ', ' + p + '). The event is S ≤ ' + (centre - k - 1) + ' or S ≥ ' + (centre + k + 1) + '.',
            solution: 'S = X₁+X₂ ~ Bin(' + nTot + ', ' + p + ') because the samples are independent with the same p.<br>' +
              'P(|S − ' + centre + '| &gt; ' + k + ') = 1 − P(' + (centre - k) + ' ≤ S ≤ ' + (centre + k) + ') = 1 − [P(S ≤ ' + (centre + k) +
              ') − P(S ≤ ' + (centre - k - 1) + ')] = <b>' + fmt(exactTail, 6) + '</b>' +
              '<br><code>1 - (binocdf(' + (centre + k) + ', ' + nTot + ', ' + p + ') - binocdf(' + (centre - k - 1) + ', ' + nTot + ', ' + p + '))</code>' })
        ]
      };
    }
  };

  /* ================= T10: one-sample t — CI, one-sided test, CI/test logic ================= */

  var T_TTEST1 = {
    id: 'ttest1',
    topic: 'Two-sample t',
    title: 'One-sample confidence interval and one-sided t test',
    marks: 10,
    build: function (rng) {
      var ctx = rng.pick([
        { intro: 'Patrick noted the following unleaded fuel prices (cents per litre) at his local Caltex station over several weeks.',
          name: 'caltex', unit: 'cents per litre', claimName: 'Fuel Check NSW', mu: 243, sd: 6, dp: 2, n: [10, 14], what: 'the mean price at Caltex' },
        { intro: 'A bottling line is supposed to fill containers to a nominal volume. A quality inspector measured the contents (mL) of a random sample of bottles.',
          name: 'volume', unit: 'mL', claimName: 'The manufacturer', mu: 502, sd: 3.2, dp: 1, n: [10, 16], what: 'the mean fill volume' },
        { intro: 'A gym recorded the resting heart rate (bpm) of a random sample of members after a 12-week program.',
          name: 'hr', unit: 'bpm', claimName: 'A health guideline', mu: 68, sd: 5, dp: 0, n: [12, 18], what: 'the mean resting heart rate' }
      ]);
      var n = rng.int(ctx.n[0], ctx.n[1]);
      var data = [], i;
      for (i = 0; i < n; i++) data.push(S.round(rng.normal(ctx.mu, ctx.sd), ctx.dp));
      var conf = rng.pick([0.95, 0.97, 0.98, 0.99]);
      var C = S.tCI1(data, conf);
      var mu0 = S.round(C.mean - rng.uniform(0.6, 2.4) * C.s / Math.sqrt(n), ctx.dp);
      var alpha = rng.pick([0.01, 0.015, 0.025, 0.05]);
      var TT = S.tTest1(data, mu0, 'greater');
      if (!isFinite(TT.t)) return null;
      var oneSidedBelow = C.lo > mu0;

      var hyp = shuffleChoice(rng, [
        'H₀: μ = ' + fmt(mu0, ctx.dp) + ' &nbsp; vs &nbsp; H₁: μ &gt; ' + fmt(mu0, ctx.dp),
        'H₀: μ = ' + fmt(mu0, ctx.dp) + ' &nbsp; vs &nbsp; H₁: μ ≠ ' + fmt(mu0, ctx.dp),
        'H₀: x̄ = ' + fmt(mu0, ctx.dp) + ' &nbsp; vs &nbsp; H₁: x̄ &gt; ' + fmt(mu0, ctx.dp),
        'H₀: μ &gt; ' + fmt(mu0, ctx.dp) + ' &nbsp; vs &nbsp; H₁: μ = ' + fmt(mu0, ctx.dp)
      ], 0);
      var dist = shuffleChoice(rng, [
        't distribution on ' + C.df + ' degrees of freedom',
        't distribution on ' + n + ' degrees of freedom',
        'standard normal distribution N(0,1)',
        'F distribution on 1 and ' + C.df + ' degrees of freedom'
      ], 0);
      var logic = shuffleChoice(rng, [
        (oneSidedBelow
          ? 'Yes — the whole ' + confPct(conf) + ' CI lies above ' + fmt(mu0, ctx.dp) + ', so the two-sided test at α = ' + fmt(1 - conf, 3) +
            ' would reject H₀; since the estimate is on the H₁ side, the one-sided test at α = ' + fmt((1 - conf) / 2, 4) + ' also rejects.'
          : 'No — the ' + confPct(conf) + ' CI contains ' + fmt(mu0, ctx.dp) + ', so the two-sided test at α = ' + fmt(1 - conf, 3) +
            ' does not reject; that does not settle a one-sided test at α = ' + alpha + ', whose critical value is different.'),
        'Yes — a confidence interval always gives the same answer as any hypothesis test at any level.',
        'No — confidence intervals and hypothesis tests are entirely unrelated.',
        'Yes — because the sample mean is different from ' + fmt(mu0, ctx.dp) + ', H₀ must be rejected.'
      ], 0);

      return {
        intro: '<p>' + ctx.intro + ' Assume the measurements are normally distributed with mean μ and unknown variance σ².</p>',
        data: [dataBlock('Data',
          ctx.name + ' = ' + mlVec(data, ctx.dp) + ';',
          'import numpy as np\n' + ctx.name + ' = np.array(' + mlVec(data, ctx.dp) + ')')],
        parts: [
          num({ label: 'a) i)', marks: 1, prompt: 'Sample mean x̄', answer: C.mean, dp: 4,
            solution: 'x̄ = <b>' + fmt(C.mean, 5) + '</b> &nbsp;<code>mean(' + ctx.name + ')</code>' }),
          num({ label: 'a) ii)', marks: 1, prompt: 'Sample standard deviation s', answer: C.s, dp: 4,
            traps: [{ value: Math.sqrt(S.variance(data) * (n - 1) / n), msg: 'You divided by n. The sample SD divides by n − 1 (<code>std</code> in MATLAB already does).' }],
            solution: 's = <b>' + fmt(C.s, 5) + '</b> &nbsp;<code>std(' + ctx.name + ')</code>' }),
          iv({ label: 'a) iii)', marks: 2, prompt: 'Calculate a two-sided ' + confPct(conf) + ' confidence interval for μ.',
            answer: [C.lo, C.hi], dp: 4,
            traps: [{ value: C.mean - S.normInv(1 - (1 - conf) / 2) * C.s / Math.sqrt(n), msg: 'You used z. With σ unknown and n small, use the t distribution on ' + C.df + ' df.', which: 0 }],
            hint: 'x̄ ± t<sub>1−α/2, n−1</sub> · s/√n',
            solution: 't<sub>' + fmt(1 - (1 - conf) / 2, 4) + ',' + C.df + '</sub> = ' + fmt(C.tcrit, 4) + ', s/√n = ' + sig(C.s / Math.sqrt(n)) +
              '<br>CI = ' + fmt(C.mean, 4) + ' ± ' + fmt(C.me, 4) + ' = [<b>' + fmt(C.lo, 4) + ', ' + fmt(C.hi, 4) + '</b>]' +
              "<br><code>[h,p,ci] = ttest(" + ctx.name + ", 0, 'Alpha', " + fmt(1 - conf, 3) + ")</code>" }),
          mc({ label: 'b) i)', marks: 1,
            prompt: ctx.claimName + ' claims that ' + ctx.what + ' is ' + fmt(mu0, ctx.dp) + ' ' + ctx.unit +
              '. Test at α = ' + alpha + ' whether it is <b>greater</b> than this. The hypotheses are:',
            options: hyp.options, correct: hyp.correct,
            solution: '“Greater than” gives an upper-tailed alternative about the population mean μ.' }),
          mc({ label: 'b) ii)', marks: 1, prompt: 'Under H₀ the test statistic follows a:', options: dist.options, correct: dist.correct,
            solution: 'σ is unknown and estimated by s, so the statistic is t on n − 1 = ' + C.df + ' df — not N(0,1).' }),
          num({ label: 'b) iii)', marks: 1, prompt: 'Observed test statistic', answer: TT.t, dp: 4,
            solution: 't = (x̄ − μ₀)/(s/√n) = (' + fmt(C.mean, 4) + ' − ' + fmt(mu0, ctx.dp) + ')/' + sig(C.s / Math.sqrt(n)) +
              ' = <b>' + fmt(TT.t, 4) + '</b>' }),
          num({ label: 'b) iv)', marks: 1, prompt: 'p-value', answer: TT.p, dp: 4,
            traps: [{ value: 2 * TT.p, msg: 'This alternative is one-sided — do not double.' }],
            solution: 'p = P(T<sub>' + C.df + '</sub> &gt; ' + fmt(TT.t, 4) + ') = <b>' + fmt(TT.p, 6) + '</b>' +
              '<br><code>p = 1 - tcdf(' + fmt(TT.t, 4) + ', ' + C.df + ')</code>' +
              '<br>At α = ' + alpha + ' we ' + (TT.p < alpha ? '<b>reject</b>' : '<b>do not reject</b>') + ' H₀.' }),
          mc({ label: 'c)', marks: 2,
            prompt: 'Without doing additional calculations, and using your answer to (a) only, can you conclude the outcome of the test in (b)?',
            options: logic.options, correct: logic.correct,
            solution: 'The CI is [' + fmt(C.lo, 4) + ', ' + fmt(C.hi, 4) + '] and μ₀ = ' + fmt(mu0, ctx.dp) + '. ' +
              'A two-sided 100(1−α)% CI answers a two-sided test at level α. It can settle a one-sided question only when the interval lies entirely on one side of μ₀ ' +
              '(then the one-sided test at α/2 rejects too). Here p = ' + fmt(TT.p, 5) + '.' })
        ]
      };
    }
  };

  /* ================= T11: paired data ================= */

  var T_PAIRED = {
    id: 'paired-t',
    topic: 'Paired data',
    title: 'Paired samples: analysing the differences',
    marks: 12,
    build: function (rng) {
      var ctx = rng.pick([
        { intro: 'A sports scientist measured the resting heart rate (bpm) of {n} athletes before a 12-week training program and again after it. Each athlete is measured twice.',
          n1: 'before', n2: 'after', unit: 'bpm', label1: 'Before', label2: 'After',
          base: 70, between: 7, within: 2.2, delta: [-5.5, -2.5], dp: 0,
          claim: 'the program reduces resting heart rate', side: 'greater', what: 'before − after' },
        { intro: 'Two different tyre types, A and B, were each fitted to the same {n} cars and the tread loss (mm) recorded after a fixed distance. Both tyre types are tested on every car.',
          n1: 'typeA', n2: 'typeB', unit: 'mm', label1: 'Type A', label2: 'Type B',
          base: 12, between: 2.5, within: 0.5, delta: [0.5, 1.4], dp: 2,
          claim: 'type A wears more than type B', side: 'greater', what: 'A − B' },
        { intro: 'A lab compared two instruments for measuring blood glucose (mmol/L). Each of {n} blood samples was split and measured once on each instrument.',
          n1: 'instrX', n2: 'instrY', unit: 'mmol/L', label1: 'Instrument X', label2: 'Instrument Y',
          base: 5.5, between: 1.2, within: 0.16, delta: [0.15, 0.45], dp: 2,
          claim: 'the two instruments give different readings on average', side: 'two', what: 'X − Y' },
        { intro: 'A reading intervention was trialled on {n} students. Each student sat a comprehension test before the intervention and an equivalent test after it.',
          n1: 'pre', n2: 'post', unit: 'marks', label1: 'Pre', label2: 'Post',
          base: 62, between: 9, within: 2.6, delta: [-6, -3], dp: 1,
          claim: 'the intervention improves comprehension scores', side: 'less', what: 'pre − post' }
      ]);
      var n = rng.int(9, 14);
      var delta = S.round(rng.uniform(ctx.delta[0], ctx.delta[1]), 3);
      var a = [], b = [], i;
      for (i = 0; i < n; i++) {
        var subject = rng.normal(ctx.base, ctx.between);      // person/car/sample effect
        a.push(S.round(subject + rng.normal(0, ctx.within), ctx.dp));
        b.push(S.round(subject - delta + rng.normal(0, ctx.within), ctx.dp));
      }
      var side = ctx.side === 'two' ? 'two' : ctx.side;
      var P = S.tTestPaired(a, b, side, 0.95);
      var indep = S.tTest2(a, b, side, 0.95);   // the wrong analysis, for contrast
      if (!isFinite(P.t)) return null;
      if (P.p < 1e-5 || P.p > 0.03) return null;
      // the pairing must visibly matter, otherwise the teaching point is lost
      if (!(indep.p > 6 * P.p)) return null;
      var conf = rng.pick([0.95, 0.98, 0.99]);
      var Pc = S.tTestPaired(a, b, side, conf);

      var method = shuffleChoice(rng, [
        'A paired t test — apply a one-sample t test to the ' + n + ' differences (MATLAB <code>ttest(' + ctx.n1 + ', ' + ctx.n2 + ')</code>)',
        'A two-sample t test (MATLAB <code>ttest2(' + ctx.n1 + ', ' + ctx.n2 + ')</code>)',
        'A one-way ANOVA (MATLAB <code>anova1</code>)',
        'A one-sample test of a proportion',
        'A simple linear regression of one variable on the other'
      ], 0);
      var whyPair = shuffleChoice(rng, [
        'The two measurements on the same unit are <b>not independent</b>, and differencing removes the unit-to-unit variability, which shrinks the standard error.',
        'Pairing is only a convention; the two-sample test would give an identical answer.',
        'Pairing is used because the two samples have different sizes.',
        'Pairing makes the data normally distributed.'
      ], 0);
      var hyp = shuffleChoice(rng, (function () {
        var d0 = 'μ<sub>d</sub>';
        if (side === 'two') return ['H₀: ' + d0 + ' = 0 vs H₁: ' + d0 + ' ≠ 0',
          'H₀: ' + d0 + ' = 0 vs H₁: ' + d0 + ' > 0', 'H₀: ' + d0 + ' = 0 vs H₁: ' + d0 + ' < 0',
          'H₀: d̄ = 0 vs H₁: d̄ ≠ 0'];
        if (side === 'greater') return ['H₀: ' + d0 + ' = 0 vs H₁: ' + d0 + ' > 0',
          'H₀: ' + d0 + ' = 0 vs H₁: ' + d0 + ' ≠ 0', 'H₀: ' + d0 + ' = 0 vs H₁: ' + d0 + ' < 0',
          'H₀: d̄ = 0 vs H₁: d̄ > 0'];
        return ['H₀: ' + d0 + ' = 0 vs H₁: ' + d0 + ' < 0',
          'H₀: ' + d0 + ' = 0 vs H₁: ' + d0 + ' ≠ 0', 'H₀: ' + d0 + ' = 0 vs H₁: ' + d0 + ' > 0',
          'H₀: d̄ = 0 vs H₁: d̄ < 0'];
      })(), 0);

      var rows = [[ctx.label1, a.map(function (v) { return fmt(v, ctx.dp); })],
                  [ctx.label2, b.map(function (v) { return fmt(v, ctx.dp); })]];

      return {
        intro: '<p>' + ctx.intro.replace('{n}', n) + '</p>' + tableHtml(rows) +
          '<p>Let μ<sub>d</sub> be the true mean of the differences (' + ctx.what + '). ' +
          'Test at the 5% level whether ' + ctx.claim + '.</p>',
        data: [dataBlock('Data',
          ctx.n1 + ' = ' + mlVec(a, ctx.dp) + ';\n' + ctx.n2 + ' = ' + mlVec(b, ctx.dp) + ';\n' +
          'd = ' + ctx.n1 + ' - ' + ctx.n2 + ';',
          'import numpy as np\n' + ctx.n1 + ' = np.array(' + mlVec(a, ctx.dp) + ')\n' +
          ctx.n2 + ' = np.array(' + mlVec(b, ctx.dp) + ')\nd = ' + ctx.n1 + ' - ' + ctx.n2)],
        parts: [
          mc({ label: 'a)', marks: 2, prompt: 'Which procedure is appropriate for these data?',
            options: method.options, correct: method.correct,
            solution: 'Each unit is measured <b>twice</b>, so the two columns are not independent samples. ' +
              'Reduce to the ' + n + ' differences and run a one-sample t test on them. In MATLAB, <code>ttest(x, y)</code> with two arguments is exactly the paired test; ' +
              '<code>ttest2</code> would be wrong here.' }),
          mc({ label: 'b)', marks: 1, prompt: 'Why does pairing matter?', options: whyPair.options, correct: whyPair.correct,
            solution: 'Here the independent-samples test would have given p = ' + fmt(indep.p, 4) + ' against the paired p = ' + fmt(P.p, 4) +
              '. The between-unit spread swamps the effect until differencing removes it.' }),
          mc({ label: 'c)', marks: 1, prompt: 'State the hypotheses.', options: hyp.options, correct: hyp.correct,
            solution: 'Hypotheses are about the population mean difference μ<sub>d</sub>, not the sample mean d̄.' }),
          num({ label: 'd) i)', marks: 1, prompt: 'Mean of the differences d̄', answer: P.dbar, dp: 4,
            solution: 'd̄ = mean(' + ctx.what + ') = <b>' + fmt(P.dbar, 5) + '</b> &nbsp;<code>mean(d)</code>' }),
          num({ label: 'd) ii)', marks: 1, prompt: 'Standard deviation of the differences s<sub>d</sub>', answer: P.sd, dp: 4,
            traps: [{ value: Math.sqrt(S.variance(a) + S.variance(b)), msg: 'You combined the two sample SDs. Compute the SD <b>of the differences</b> — the pairing is exactly what makes that smaller.' }],
            solution: 's<sub>d</sub> = <b>' + fmt(P.sd, 5) + '</b> &nbsp;<code>std(d)</code>' }),
          num({ label: 'd) iii)', marks: 1, prompt: 'Observed test statistic', answer: P.t, dp: 4,
            traps: [{ value: indep.t, msg: 'That is the two-sample statistic. The paired statistic is d̄/(s<sub>d</sub>/√n).' }],
            solution: 't = d̄/(s<sub>d</sub>/√n) = ' + fmt(P.dbar, 5) + '/' + sig(P.se) + ' = <b>' + fmt(P.t, 4) + '</b>' }),
          num({ label: 'd) iv)', marks: 1, prompt: 'Degrees of freedom', answer: P.df, dp: 0, integer: true,
            traps: [{ value: 2 * n - 2, msg: 'n₁+n₂−2 is the two-sample df. A paired test has only ' + n + ' differences, so df = n − 1.' }],
            solution: 'df = n − 1 = ' + n + ' − 1 = <b>' + P.df + '</b> (there are ' + n + ' differences, not ' + (2 * n) + ' independent observations).' }),
          num({ label: 'd) v)', marks: 2, prompt: 'p-value', answer: P.p, dp: 4,
            traps: [{ value: indep.p, msg: 'That is the p-value from the (incorrect) two-sample test.' },
                    { value: side === 'two' ? P.p / 2 : 2 * P.p, msg: side === 'two' ? 'The alternative is two-sided — do not halve.' : 'The alternative is one-sided — do not double.' }],
            hint: side === 'two' ? '<code>2*(1 - tcdf(abs(t), ' + P.df + '))</code>'
              : (side === 'greater' ? '<code>1 - tcdf(t, ' + P.df + ')</code>' : '<code>tcdf(t, ' + P.df + ')</code>'),
            solution: 'p = <b>' + fmt(P.p, 6) + '</b><br><code>[h, p] = ttest(' + ctx.n1 + ', ' + ctx.n2 +
              (side === 'two' ? ')' : ", 'Tail', '" + (side === 'greater' ? 'right' : 'left') + "')") + '</code>' +
              '<br>At the 5% level we ' + (P.p < 0.05 ? '<b>reject</b>' : '<b>do not reject</b>') + ' H₀: there is ' +
              evidenceLabel(P.p) + ' that ' + ctx.claim + '.' }),
          iv({ label: 'e)', marks: 2, prompt: 'Compute a two-sided ' + confPct(conf) + ' confidence interval for μ<sub>d</sub>.',
            answer: [Pc.lo, Pc.hi], dp: 4,
            hint: 'd̄ ± t<sub>1−α/2, n−1</sub> · s<sub>d</sub>/√n',
            solution: 't<sub>' + fmt(1 - (1 - conf) / 2, 4) + ',' + P.df + '</sub> = ' + fmt(Pc.tcrit, 4) + ', s<sub>d</sub>/√n = ' + sig(P.se) +
              '<br>CI = ' + fmt(P.dbar, 4) + ' ± ' + fmt(Pc.tcrit * P.se, 4) + ' = [<b>' + fmt(Pc.lo, 4) + ', ' + fmt(Pc.hi, 4) + '</b>]' +
              "<br><code>[h, p, ci] = ttest(d, 0, 'Alpha', " + fmt(1 - conf, 3) + ')</code>' })
        ]
      };
    }
  };

  /* ================= T12: power and rejection region, one-sample z ================= */

  var T_POWER_Z = {
    id: 'power-z',
    topic: 'Power & errors',
    title: 'Rejection region and power for a one-sample z test',
    marks: 10,
    build: function (rng) {
      var ctx = rng.pick([
        { intro: 'A manufacturer claims the mean lifetime of its bearings is {mu0} thousand hours. A buyer suspects it is lower and will test {n} bearings. The population standard deviation is known to be σ = {sd}.',
          unit: 'thousand hours', side: 'less', quantity: 'mean lifetime', mu0: [7, 10, 12, 20] },
        { intro: 'A water utility states that the mean level of a contaminant is {mu0} µg/L. An inspector suspects the true mean is higher and will take {n} independent samples. The standard deviation is known to be σ = {sd}.',
          unit: 'µg/L', side: 'greater', quantity: 'mean contaminant level', mu0: [12, 20, 50, 100] },
        { intro: 'A cereal packer claims a mean fill weight of {mu0} g. A consumer group suspects underfilling and will weigh {n} boxes. The filling process has a known standard deviation of σ = {sd}.',
          unit: 'g', side: 'less', quantity: 'mean fill weight', mu0: [250, 375, 500, 750] }
      ]);
      var mu0 = rng.pick(ctx.mu0);
      var sd = S.round(mu0 * rng.uniform(0.06, 0.16), 2);
      var n = rng.pick([25, 40, 60, 100, 150, 185]);
      var alpha = rng.pick([0.01, 0.05, 0.10]);
      var shift = sd / Math.sqrt(n) * rng.uniform(1.0, 2.6);
      var mu1 = S.round(ctx.side === 'less' ? mu0 - shift : mu0 + shift, 3);
      var R = S.meanZPower(n, mu0, mu1, sd, alpha, ctx.side);
      if (R.power < 0.25 || R.power > 0.97) return null;
      var nBigger = n * 2;
      var powerBigger = S.meanZPower(nBigger, mu0, mu1, sd, alpha, ctx.side).power;

      var rrChoice = shuffleChoice(rng, [
        'Reject H₀ when x̄ ' + (ctx.side === 'less' ? '&lt; ' : '&gt; ') + fmt(R.crit, 4),
        'Reject H₀ when x̄ ' + (ctx.side === 'less' ? '&gt; ' : '&lt; ') + fmt(R.crit, 4),
        'Reject H₀ when |x̄ − ' + mu0 + '| &gt; ' + fmt(Math.abs(R.crit - mu0), 4),
        'Reject H₀ when μ ' + (ctx.side === 'less' ? '&lt; ' : '&gt; ') + fmt(R.crit, 4)
      ], 0);
      var effect = shuffleChoice(rng, [
        'Power increases, because the standard error σ/√n shrinks, so the sampling distributions under H₀ and under the alternative overlap less.',
        'Power decreases, because a larger sample makes the test more conservative.',
        'Power is unchanged, because α is unchanged.',
        'Power increases, because α automatically increases with n.'
      ], 0);
      var defn = shuffleChoice(rng, [
        'P(reject H₀ | H₀ is false) — the chance of detecting a real departure from H₀',
        'P(reject H₀ | H₀ is true)',
        'P(H₀ is false | we rejected H₀)',
        'The probability that the null hypothesis is true'
      ], 0);

      return {
        intro: '<p>' + ctx.intro.replace('{mu0}', mu0).replace('{n}', n).replace('{sd}', sd) + '</p>' +
          '<p>The test is H₀: μ = ' + mu0 + ' against H₁: μ ' + (ctx.side === 'less' ? '&lt;' : '&gt;') + ' ' + mu0 +
          ', carried out at significance level α = ' + alpha + '. Because σ is known, the test statistic is ' +
          'Z = (X̄ − μ₀)/(σ/√n), which is standard normal under H₀.</p>',
        data: [dataBlock('Parameters',
          'mu0 = ' + mu0 + '; sigma = ' + sd + '; n = ' + n + '; alpha = ' + alpha + '; mu1 = ' + mu1 + ';',
          'mu0, sigma, n, alpha, mu1 = ' + mu0 + ', ' + sd + ', ' + n + ', ' + alpha + ', ' + mu1)],
        parts: [
          mc({ label: 'a)', marks: 1, prompt: 'What does the <b>power</b> of a test mean?',
            options: defn.options, correct: defn.correct,
            solution: 'Power = P(reject H₀ | H₀ false) = 1 − β, where β = P(type II error).' }),
          num({ label: 'b) i)', marks: 1, prompt: 'Standard error of X̄, that is σ/√n', answer: R.se, dp: 4,
            solution: 'σ/√n = ' + sd + '/√' + n + ' = <b>' + fmt(R.se, 5) + '</b>' }),
          num({ label: 'b) ii)', marks: 2,
            prompt: 'Find the critical value of x̄: the boundary of the rejection region at α = ' + alpha + '.',
            answer: R.crit, dp: 4,
            traps: [{ value: ctx.side === 'less' ? mu0 - S.normInv(1 - alpha / 2) * R.se : mu0 + S.normInv(1 - alpha / 2) * R.se,
                      msg: 'You split α between two tails. This alternative is one-sided, so use z<sub>1−α</sub>, not z<sub>1−α/2</sub>.' },
                    { value: ctx.side === 'less' ? mu0 + S.normInv(1 - alpha) * R.se : mu0 - S.normInv(1 - alpha) * R.se,
                      msg: 'Wrong side — for H₁: μ ' + (ctx.side === 'less' ? '<' : '>') + ' μ₀ the rejection region is on the ' + (ctx.side === 'less' ? 'low' : 'high') + ' side of μ₀.' }],
            hint: 'x̄ = μ₀ ' + (ctx.side === 'less' ? '−' : '+') + ' z<sub>' + fmt(1 - alpha, 3) + '</sub> · σ/√n',
            solution: 'z<sub>' + fmt(1 - alpha, 3) + '</sub> = ' + fmt(R.zcrit, 4) + ', so the boundary is<br>' +
              mu0 + ' ' + (ctx.side === 'less' ? '−' : '+') + ' ' + fmt(R.zcrit, 4) + '×' + fmt(R.se, 5) + ' = <b>' + fmt(R.crit, 5) + '</b>' +
              '<br><code>crit = ' + mu0 + ' ' + (ctx.side === 'less' ? '-' : '+') + ' norminv(' + fmt(1 - alpha, 3) + ')*' + sd + '/sqrt(' + n + ')</code>' }),
          mc({ label: 'b) iii)', marks: 1, prompt: 'State the rejection region.', options: rrChoice.options, correct: rrChoice.correct,
            solution: 'The rejection region is a statement about the <b>statistic</b> x̄, not about the parameter μ, and it is one-sided here.' }),
          num({ label: 'c)', marks: 3,
            prompt: 'Suppose the true mean is actually μ = ' + mu1 + ' ' + ctx.unit + '. Compute the power of the test.',
            answer: R.power, dp: 4,
            traps: [{ value: R.beta, msg: 'That is β = P(type II error). Power = 1 − β.' },
                    { value: alpha, msg: 'α is the type I error rate — the chance of rejecting when H₀ is <i>true</i>. Power concerns the case where H₀ is false.' }],
            hint: 'Power = P(x̄ ' + (ctx.side === 'less' ? '&lt;' : '&gt;') + ' ' + fmt(R.crit, 4) + ' | μ = ' + mu1 +
              '), where X̄ ~ N(' + mu1 + ', (σ/√n)²). The standard error does not change.',
            solution: 'Under μ = ' + mu1 + ', X̄ ~ N(' + mu1 + ', ' + fmt(R.se, 5) + '²).<br>' +
              'Power = P(X̄ ' + (ctx.side === 'less' ? '&lt;' : '&gt;') + ' ' + fmt(R.crit, 5) + ') = ' +
              (ctx.side === 'less' ? 'Φ' : '1 − Φ') + '((' + fmt(R.crit, 5) + ' − ' + mu1 + ')/' + fmt(R.se, 5) + ') = ' +
              (ctx.side === 'less' ? 'Φ' : '1 − Φ') + '(' + fmt((R.crit - mu1) / R.se, 4) + ') = <b>' + fmt(R.power, 6) + '</b>' +
              '<br><code>power = ' + (ctx.side === 'less' ? '' : '1 - ') + 'normcdf(crit, ' + mu1 + ', ' + sd + '/sqrt(' + n + '))</code>' }),
          num({ label: 'd)', marks: 1, prompt: 'What is P(type II error) for this alternative?', answer: R.beta, dp: 4,
            traps: [{ value: R.power, msg: 'That is the power. β = 1 − power.' }],
            solution: 'β = 1 − power = 1 − ' + fmt(R.power, 5) + ' = <b>' + fmt(R.beta, 6) + '</b>' }),
          mc({ label: 'e)', marks: 1,
            prompt: 'If the sample size were doubled to ' + nBigger + ' with everything else unchanged, what happens to the power?',
            options: effect.options, correct: effect.correct,
            solution: 'Power would rise from ' + fmt(R.power, 4) + ' to ' + fmt(powerBigger, 4) +
              '. Larger n shrinks σ/√n, separating the two sampling distributions; α is fixed by choice and does not change.' })
        ]
      };
    }
  };

  /* ================= T13: choosing the right procedure ================= */

  var METHOD_SCENARIOS = [
    { s: 'You have exam marks for a random sample of students and want a confidence interval for the true mean mark.',
      a: 'One-sample t: <code>ttest(Y)</code> for the CI', w: ['<code>ttest2(Y1, Y2)</code>', '<code>anova1(Y, group)</code>', '<code>fitlm(X, Y)</code>', 'One-sample test of a proportion'],
      why: 'One quantitative variable, inference about its mean → one-sample t.' },
    { s: 'You want to know whether the mean satisfaction score differs between two independent groups of customers.',
      a: 'Two-sample t: <code>ttest2(Y1, Y2)</code>', w: ['<code>ttest(Y1, Y2)</code> (paired)', '<code>fitlm(X, Y)</code>', '<code>crosstab(Y, X)</code>', '<code>coefCI(mdl)</code>'],
      why: 'X categorical with two levels, Y quantitative, independent samples → two-sample t (or equivalently a one-way ANOVA with k = 2).' },
    { s: 'Each of 15 patients has their blood pressure measured before and after taking a drug, and you want to know whether it changed.',
      a: 'Paired t: <code>ttest(before, after)</code> on the differences', w: ['<code>ttest2(before, after)</code>', '<code>anova1</code>', '<code>fitlm(before, after)</code>', 'Two-sample test of proportions'],
      why: 'The same patients are measured twice, so the samples are not independent — analyse the differences.' },
    { s: 'You want to compare the mean yield across four different fertiliser blends.',
      a: 'One-way ANOVA: <code>anova1(Y, group)</code>', w: ['<code>ttest2</code> on each pair with no adjustment', '<code>fitlm(X, Y)</code>', '<code>ttest(Y, mu0)</code>', '<code>crosstab(Y, X)</code>'],
      why: 'X categorical with more than two levels, Y quantitative → one-way ANOVA. Running all pairwise t tests unadjusted inflates the family-wise error rate.' },
    { s: 'You want to describe the relationship between two quantitative variables and estimate how much the response changes per unit of the predictor.',
      a: 'Simple linear regression: <code>fitlm(X, Y)</code>', w: ['<code>anova1(Y, X)</code>', '<code>ttest2(X, Y)</code>', '<code>boxplot(Y, X)</code>', '<code>crosstab(X, Y)</code>'],
      why: 'Both variables quantitative → correlation / regression.' },
    { s: 'After fitting a regression you want an interval estimate for the true slope β₁.',
      a: '<code>coefCI(mdl, 0.05)</code>', w: ['<code>predict(mdl, x0)</code>', '<code>ttest2</code>', '<code>anova1</code>', '<code>corrcoef(x, y)</code>'],
      why: 'coefCI returns CIs for the fitted coefficients; predict returns intervals for the response, which is a different thing.' },
    { s: 'You want a graphical comparison of a quantitative response across several categories.',
      a: 'Comparative boxplots: <code>boxplot(Y, X)</code>', w: ['<code>histogram(Y)</code>', '<code>scatter(X, Y)</code>', '<code>crosstab(Y, X)</code>', '<code>qqplot(Y)</code>'],
      why: 'X categorical, Y quantitative, graphical → comparative boxplots.' },
    { s: 'You have two categorical variables and want to summarise them numerically.',
      a: 'A two-way table: <code>crosstab(Y, X)</code>', w: ['<code>boxplot(Y, X)</code>', '<code>fitlm(X, Y)</code>', '<code>grpstats(Y, X)</code>', '<code>ttest2(Y, X)</code>'],
      why: 'Both variables categorical → two-way table (graphically, a clustered bar chart).' },
    { s: 'You want to test whether the proportion of defective items differs from a claimed value of 0.05.',
      a: 'One-sample test of a proportion (normal approximation, z statistic)',
      w: ['<code>ttest(Y, 0.05)</code>', '<code>anova1</code>', '<code>fitlm</code>', '<code>ttest2</code>'],
      why: 'One categorical variable, inference about a proportion → z = (p̂ − π₀)/√(π₀(1−π₀)/n).' },
    { s: 'A one-way ANOVA was significant and you now want to know which pairs of group means differ.',
      a: 'Multiple comparisons: <code>multcompare(stats)</code>', w: ['<code>anova1</code> again', '<code>ttest(Y, mu0)</code>', '<code>fitlm(X, Y)</code>', '<code>histogram(Y)</code>'],
      why: 'ANOVA only says "at least one differs". Post-hoc comparisons (with an adjustment such as Bonferroni or LSD) identify which.' },
    { s: 'You want the mean and standard deviation of a quantitative response separately for each level of a categorical variable.',
      a: '<code>grpstats(Y, X)</code>', w: ['<code>summary(Y)</code>', '<code>crosstab(Y, X)</code>', '<code>coefCI(mdl)</code>', '<code>quantile(Y, p)</code>'],
      why: 'X categorical, Y quantitative, numerical summary → group statistics.' }
  ];

  var T_METHOD = {
    id: 'method-choice',
    topic: 'Choosing a method',
    title: 'Choosing the appropriate procedure',
    marks: 6,
    build: function (rng) {
      var picked = rng.shuffle(METHOD_SCENARIOS).slice(0, 6);
      var labels = ['a)', 'b)', 'c)', 'd)', 'e)', 'f)'];
      return {
        intro: '<p>For each scenario below, select the appropriate analysis. These follow the decision tree used in lectures: ' +
          'first ask <b>how many variables</b>, then <b>what type</b> they are, then whether you want a graph, a numerical summary, a hypothesis test or a confidence interval.</p>',
        data: [],
        parts: picked.map(function (sc, i) {
          var ch = shuffleChoice(rng, [sc.a].concat(sc.w), 0);
          return mc({
            label: labels[i], marks: 1, prompt: sc.s,
            options: ch.options, correct: ch.correct,
            solution: sc.why
          });
        })
      };
    }
  };

  /* ================= T14: reading fitlm output ================= */

  var T_FITLM_OUT = {
    id: 'fitlm-output',
    topic: 'Linear regression',
    title: 'Reading MATLAB regression output',
    marks: 12,
    build: function (rng) {
      var ctx = rng.pick([
        { y: 'oxygen', x: 'hydrocarbon', ylab: 'oxygen purity (%)', xlab: 'hydrocarbon level (%)' },
        { y: 'strength', x: 'cement', ylab: 'concrete strength (MPa)', xlab: 'cement content (kg/m³)' },
        { y: 'mpg', x: 'weight', ylab: 'fuel economy (mpg)', xlab: 'vehicle weight (100 kg)' },
        { y: 'sales', x: 'adspend', ylab: 'weekly sales ($000)', xlab: 'advertising spend ($000)' }
      ]);
      var n = rng.int(15, 30), df = n - 2;
      /* The question says "answer from the output", so the PRINTED (rounded)
         numbers are the source of truth. Round first, then derive every answer
         from the rounded values — otherwise a student who reads the table
         correctly is marked wrong for our own hidden precision. */
      var b0 = S.round(rng.uniform(20, 120), 4);
      var b1 = S.round(rng.uniform(2, 18) * (rng.next() < 0.25 ? -1 : 1), 4);
      var s = S.round(rng.uniform(0.6, 3.2), 3);              // RMSE, printed to 3 dp
      var Sxx = rng.uniform(0.4, 4) * df;
      var seB1 = S.round(s / Math.sqrt(Sxx), 4);              // printed to 4 dp
      if (seB1 <= 0) return null;
      var t1 = b1 / seB1;
      var R2 = t1 * t1 / (t1 * t1 + df);
      // keep R^2 away from 1, or SSt = SSe/(1-R^2) becomes badly conditioned
      if (R2 < 0.45 || R2 > 0.93) return null;
      R2 = S.round(R2, 4);                                    // printed to 4 dp
      var R2adj = S.round(1 - (1 - R2) * (n - 1) / df, 4);
      var p1 = 2 * S.tSf(Math.abs(t1), df);
      var SSe = df * s * s;                                   // from printed RMSE
      var SSt = SSe / (1 - R2);                               // from printed R^2
      var SSr = SSt - SSe;
      var F = t1 * t1;
      var mx = S.round(rng.uniform(1, 3), 3);
      var seB0 = S.round(s * Math.sqrt(1 / n + mx * mx / Sxx), 4);
      var t0 = b0 / seB0, p0 = 2 * S.tSf(Math.abs(t0), df);
      var conf = rng.pick([0.90, 0.95, 0.99]);
      var tc = S.tInv(1 - (1 - conf) / 2, df);
      var ciSlope = [b1 - tc * seB1, b1 + tc * seB1];
      var dx = rng.int(2, 6);

      var rmseChoice = shuffleChoice(rng, [
        'σ, the standard deviation of the errors about the regression line',
        'the standard deviation of the response values y',
        'the standard error of the slope β̂₁',
        'the average of the residuals'
      ], 0);
      var fChoice = shuffleChoice(rng, [
        'They test the same thing: in simple linear regression F = t², and the two p-values are identical.',
        'The F test is more powerful because it uses both coefficients.',
        'The F test is one-sided and the t test is two-sided, so their p-values differ by a factor of 2.',
        'They are unrelated tests.'
      ], 0);
      var assumpChoice = shuffleChoice(rng, [
        'Normality — the Central Limit Theorem gives robustness, so it matters most at small sample sizes (but it is critical when predicting a new observation).',
        'Linearity — violating it makes the whole analysis meaningless.',
        'Independence of the errors — violating it distorts the standard errors.',
        'Equal variance — violating it distorts the standard errors.'
      ], 0);

      var out =
        '<pre class="code">Linear regression model:\n' +
        '    ' + ctx.y + ' ~ 1 + ' + ctx.x + '\n\n' +
        'Estimated Coefficients:\n' +
        '                   Estimate      SE        tStat      pValue\n' +
        '                   ________   ________   ________   __________\n\n' +
        '    (Intercept)    ' + fmt(b0, 4) + '   ' + fmt(seB0, 4) + '   ' + fmt(t0, 3) + '   ' + p0.toExponential(4) + '\n' +
        '    ' + ctx.x + (ctx.x.length < 12 ? new Array(13 - ctx.x.length).join(' ') : ' ') +
        fmt(b1, 4) + '   ' + fmt(seB1, 4) + '   ' + fmt(t1, 3) + '   ' + p1.toExponential(4) + '\n\n' +
        'Number of observations: ' + n + ', Error degrees of freedom: ' + df + '\n' +
        'Root Mean Squared Error: ' + fmt(s, 3) + '\n' +
        'R-squared: ' + fmt(R2, 4) + ',  Adjusted R-Squared: ' + fmt(R2adj, 4) + '\n' +
        'F-statistic vs. constant model: ' + fmt(F, 3) + ', p-value = ' + p1.toExponential(4) + '</pre>';

      return {
        intro: '<p>A simple linear regression of ' + ctx.ylab + ' on ' + ctx.xlab +
          ' was fitted in MATLAB with <code>mdl = fitlm(' + ctx.x + ', ' + ctx.y + ')</code>. The output is below. ' +
          'Answer the questions <b>from the output</b> — the raw data are not given.</p>' + out,
        data: [],
        parts: [
          num({ label: 'a)', marks: 1, prompt: 'What is the estimated slope β̂₁?', answer: b1, dp: 3,
            solution: 'Read the Estimate column of the <code>' + ctx.x + '</code> row: <b>' + fmt(b1, 4) + '</b>. ' +
              'The fitted line is ŷ(x) = ' + fmt(b0, 3) + ' ' + signed(b1, 3) + 'x.' }),
          num({ label: 'b)', marks: 1,
            prompt: 'By how much does ' + ctx.ylab + ' change, on average, for an increase of ' + dx + ' units in ' + ctx.xlab + '?',
            answer: b1 * dx, dp: 3,
            traps: [{ value: b1, msg: 'That is the change per <b>one</b> unit — multiply by ' + dx + '.' }],
            solution: 'Δŷ = β̂₁ × ' + dx + ' = <b>' + fmt(b1 * dx, 4) + '</b>' }),
          num({ label: 'c)', marks: 1, prompt: 'Verify the t statistic for the slope from the Estimate and SE columns.',
            answer: t1, dp: 3,
            solution: 't = Estimate/SE = ' + fmt(b1, 4) + '/' + fmt(seB1, 4) + ' = <b>' + fmt(t1, 3) + '</b>, matching the tStat column.' }),
          num({ label: 'd)', marks: 1, prompt: 'How many degrees of freedom does that t statistic have?',
            answer: df, dp: 0, integer: true,
            traps: [{ value: n - 1, msg: 'n − 1 is for a one-sample t. Here it is n − 2 = ' + df + ', shown as “Error degrees of freedom”.' }],
            solution: 'df = n − 2 = ' + n + ' − 2 = <b>' + df + '</b>, reported directly as “Error degrees of freedom”.' }),
          iv({ label: 'e)', marks: 2, prompt: 'Construct a ' + confPct(conf) + ' confidence interval for the true slope β₁.',
            answer: ciSlope, dp: 4,
            traps: [{ value: b1 - S.normInv(1 - (1 - conf) / 2) * seB1, msg: 'You used a z critical value. With σ estimated by the RMSE, use t on ' + df + ' df.', which: 0 }],
            hint: 'β̂₁ ± t<sub>' + fmt(1 - (1 - conf) / 2, 4) + ', ' + df + '</sub> × SE(β̂₁), reading both numbers off the table.',
            solution: 't<sub>' + fmt(1 - (1 - conf) / 2, 4) + ',' + df + '</sub> = ' + fmt(tc, 4) + ', SE = ' + fmt(seB1, 4) +
              '<br>CI = ' + fmt(b1, 4) + ' ± ' + fmt(tc * seB1, 4) + ' = [<b>' + fmt(ciSlope[0], 4) + ', ' + fmt(ciSlope[1], 4) + '</b>]' +
              '<br><code>coefCI(mdl, ' + fmt(1 - conf, 3) + ')</code>' }),
          mc({ label: 'f)', marks: 1, prompt: 'What does the Root Mean Squared Error estimate?',
            options: rmseChoice.options, correct: rmseChoice.correct,
            solution: 'RMSE = s = √(SS<sub>e</sub>/(n−2)) = ' + fmt(s, 4) + ' estimates σ, the SD of the errors about the line. ' +
              'It is the s that appears in every standard error in this table.' }),
          num({ label: 'g)', marks: 2, prompt: 'Compute the error sum of squares SS<sub>e</sub> from the output.',
            answer: SSe, dp: 3,
            traps: [{ value: s * s, msg: 'That is the mean square (s²). Multiply by the error degrees of freedom to get the sum of squares.' }],
            hint: 'RMSE² = SS<sub>e</sub>/(n−2)',
            solution: 'SS<sub>e</sub> = (n−2) × RMSE² = ' + df + ' × ' + fmt(s, 4) + '² = <b>' + fmt(SSe, 4) + '</b>' }),
          num({ label: 'h)', marks: 1,
            prompt: 'Using R² and SS<sub>e</sub>, compute the total sum of squares SS<sub>t</sub>.',
            answer: SSt, dp: 3,
            hint: 'R² = 1 − SS<sub>e</sub>/SS<sub>t</sub>, so SS<sub>t</sub> = SS<sub>e</sub>/(1 − R²).',
            solution: 'SS<sub>t</sub> = SS<sub>e</sub>/(1 − R²) = ' + fmt(SSe, 4) + '/(1 − ' + fmt(R2, 4) + ') = <b>' + fmt(SSt, 4) + '</b>' +
              ' &nbsp;(and SS<sub>r</sub> = SS<sub>t</sub> − SS<sub>e</sub> = ' + fmt(SSr, 4) + ')' }),
          mc({ label: 'i)', marks: 1,
            prompt: 'The output reports an F statistic of ' + fmt(F, 3) + ' “vs. constant model”, and a t statistic of ' +
              fmt(t1, 3) + ' for the slope. How are the two tests related here?',
            options: fChoice.options, correct: fChoice.correct,
            solution: 'In simple linear regression there is only one predictor, so the two tests are equivalent: t² = ' +
              fmt(t1, 3) + '² = ' + fmt(t1 * t1, 3) + ' = F, and the p-values agree exactly.' }),
          mc({ label: 'j)', marks: 1,
            prompt: 'Of the four regression assumptions, which one is the Central Limit Theorem said to make the analysis most robust against?',
            options: assumpChoice.options, correct: assumpChoice.correct,
            solution: 'Normality of the errors is the least critical for inference about the line, because the CLT protects the coefficient estimates — ' +
              'though it becomes critical again when predicting an individual new observation. Linearity, independence and equal variance are not rescued by the CLT.' })
        ]
      };
    }
  };

  /* ================= command drill (flashcards) ================= */

  var COMMAND_DRILL = [
    { q: 'Fit a simple linear regression of y on x', a: 'fitlm(x\', y\')', py: 'sm.OLS(y, sm.add_constant(x)).fit()', tag: 'Regression' },
    { q: 'Get R² from a fitted model <code>mdl</code>', a: 'mdl.Rsquared.Ordinary', py: 'res.rsquared', tag: 'Regression' },
    { q: 'Sample correlation between x and y', a: 'corr(x\', y\')', py: 'np.corrcoef(x, y)[0,1]', tag: 'Regression' },
    { q: 'Confidence interval for the mean response at x₀', a: "predict(mdl, x0, 'Alpha', 0.05)", py: "res.get_prediction([1,x0]).conf_int()", tag: 'Regression' },
    { q: 'Prediction interval for a new observation at x₀', a: "predict(mdl, x0, 'Alpha', 0.05, 'Prediction', 'observation')", py: "res.get_prediction([1,x0]).conf_int(obs=True)", tag: 'Regression' },
    { q: 'Confidence intervals for the regression coefficients', a: 'coefCI(mdl, 0.05)', py: 'res.conf_int(0.05)', tag: 'Regression' },
    { q: 'Upper-tail probability of a t distribution: P(T_v > t)', a: '1 - tcdf(t, v)', py: '1 - stats.t.cdf(t, v)', tag: 'Distributions' },
    { q: 'Two-sided p-value from a t statistic', a: '2*(1 - tcdf(abs(t), v))', py: '2*(1 - stats.t.cdf(abs(t), v))', tag: 'Distributions' },
    { q: 'Critical value t with area 1−α/2 to its left', a: 'tinv(1 - alpha/2, v)', py: 'stats.t.ppf(1 - alpha/2, v)', tag: 'Distributions' },
    { q: 'p-value for an ANOVA F statistic', a: '1 - fcdf(F, df1, df2)', py: '1 - stats.f.cdf(F, df1, df2)', tag: 'Distributions' },
    { q: 'Critical value of the F distribution at level α', a: 'finv(1 - alpha, df1, df2)', py: 'stats.f.ppf(1 - alpha, df1, df2)', tag: 'Distributions' },
    { q: 'Standard normal CDF Φ(z)', a: 'normcdf(z)', py: 'stats.norm.cdf(z)', tag: 'Distributions' },
    { q: 'Standard normal quantile z with area p to its left', a: 'norminv(p)', py: 'stats.norm.ppf(p)', tag: 'Distributions' },
    { q: 'P(X ≤ k) for X ~ Bin(n, p)', a: 'binocdf(k, n, p)', py: 'stats.binom.cdf(k, n, p)', tag: 'Distributions' },
    { q: 'P(X ≥ k) for X ~ Bin(n, p)', a: '1 - binocdf(k-1, n, p)', py: '1 - stats.binom.cdf(k-1, n, p)', tag: 'Distributions' },
    { q: 'Exactly P(X = k) for X ~ Bin(n, p)', a: 'binopdf(k, n, p)', py: 'stats.binom.pmf(k, n, p)', tag: 'Distributions' },
    { q: 'One-way ANOVA on a response with a grouping variable', a: '[p, tbl, stats] = anova1(y, group)', py: 'stats.f_oneway(g1, g2, g3)', tag: 'ANOVA' },
    { q: 'Comparative boxplots by group', a: 'boxplot(y, group)', py: 'plt.boxplot([g1, g2, g3])', tag: 'ANOVA' },
    { q: 'Post-hoc multiple comparisons after anova1', a: 'multcompare(stats)', py: 'pairwise_tukeyhsd(y, group)', tag: 'ANOVA' },
    { q: 'Two-sample pooled t test', a: '[h, p, ci] = ttest2(a, b)', py: 'stats.ttest_ind(a, b)', tag: 'Tests' },
    { q: 'One-sample t test against μ₀', a: '[h, p, ci] = ttest(x, mu0)', py: 'stats.ttest_1samp(x, mu0)', tag: 'Tests' },
    { q: 'Paired t test (two arguments = paired!)', a: '[h, p] = ttest(before, after)', py: 'stats.ttest_rel(before, after)', tag: 'Tests' },
    { q: 'Paired t test on the differences directly', a: 'd = before - after; [h,p,ci] = ttest(d)', py: 'stats.ttest_1samp(before-after, 0)', tag: 'Tests' },
    { q: 'One-sample z test statistic when σ is KNOWN', a: 'z = (mean(x) - mu0)/(sigma/sqrt(n))', py: '(x.mean()-mu0)/(sigma/np.sqrt(n))', tag: 'Tests' },
    { q: 'Post-hoc pairwise comparisons after anova1 (LSD)', a: "multcompare(stats, 'CType', 'lsd')", py: 'pairwise_tukeyhsd(y, group)', tag: 'ANOVA' },
    { q: 'Mean / SD of a response for each level of a factor', a: 'grpstats(y, group, @std)', py: 'df.groupby(g)[y].std()', tag: 'Descriptive' },
    { q: 'Two-way table of two categorical variables', a: 'crosstab(Y, X)', py: 'pd.crosstab(Y, X)', tag: 'Descriptive' },
    { q: 'Pull the F statistic out of the anova1 table', a: '[~, tbl] = anova1(y, g); F = tbl{2, 5}', py: 'F, p = stats.f_oneway(*groups)', tag: 'ANOVA' },
    { q: 'One-sided (upper) two-sample t test', a: "ttest2(a, b, 'Tail', 'right')", py: "stats.ttest_ind(a, b, alternative='greater')", tag: 'Tests' },
    { q: 'Change the confidence level of a t test to 99%', a: "ttest(x, mu0, 'Alpha', 0.01)", py: 'use stats.t.interval(0.99, df, …)', tag: 'Tests' },
    { q: 'Sample standard deviation (divides by n−1)', a: 'std(x)', py: 'np.std(x, ddof=1)', tag: 'Descriptive' },
    { q: 'Scatterplot of y against x', a: 'scatter(x, y)', py: 'plt.scatter(x, y)', tag: 'Descriptive' },
    { q: 'Residuals vs fitted plot for a model <code>mdl</code>', a: "plotResiduals(mdl, 'fitted')", py: 'plt.scatter(res.fittedvalues, res.resid)', tag: 'Regression' },
    { q: 'Normal Q–Q plot of residuals', a: 'qqplot(mdl.Residuals.Raw)', py: 'sm.qqplot(res.resid, line="s")', tag: 'Regression' },
    { q: 'Generate 1000 samples of size 25 from U(0, d)', a: 'unifrnd(0, d, 25, 1000)', py: 'np.random.uniform(0, d, (1000, 25))', tag: 'Simulation' },
    { q: 'Histogram scaled as a density', a: "histogram(x, 'Normalization', 'pdf')", py: 'plt.hist(x, density=True)', tag: 'Simulation' }
  ];

  var CONCEPT_DRILL = [
    { q: 'Degrees of freedom for the t test on a slope in simple linear regression', a: 'n − 2', tag: 'Regression' },
    { q: 'Degrees of freedom for a pooled two-sample t test', a: 'n₁ + n₂ − 2', tag: 'Tests' },
    { q: 'Degrees of freedom of the ANOVA F statistic', a: 'k − 1 (numerator) and N − k (denominator)', tag: 'ANOVA' },
    { q: 'What does R² mean in words?', a: 'The proportion of the total variability in the response explained by the linear regression on the predictor.', tag: 'Regression' },
    { q: 'Relation between r and R² in simple linear regression', a: 'R² = r², and r takes the sign of the fitted slope.', tag: 'Regression' },
    { q: 'Difference between a confidence interval and a prediction interval', a: 'The CI is for the mean response at x₀ (SE uses 1/n + (x₀−x̄)²/Sxx); the PI is for one new observation and adds 1 inside the square root, so it is always wider.', tag: 'Regression' },
    { q: 'The four assumptions of the linear regression model', a: 'Linear mean, independent errors, constant error variance, normally distributed errors.', tag: 'Regression' },
    { q: 'The three assumptions of one-way ANOVA', a: 'Independent observations, normality within each group, common variance across groups.', tag: 'ANOVA' },
    { q: 'What is a p-value?', a: 'The probability, computed assuming H₀ is true, of observing a test statistic at least as extreme as the one observed.', tag: 'Concepts' },
    { q: 'Type I vs Type II error', a: 'Type I: reject H₀ when it is true (probability α). Type II: fail to reject H₀ when it is false (probability β).', tag: 'Concepts' },
    { q: 'Definition of the power of a test', a: 'Power = P(reject H₀ | H₀ is false) = 1 − β.', tag: 'Concepts' },
    { q: 'Sample size for a proportion, valid regardless of π', a: 'n ≥ z²₁₋α/₂ × 0.25 / E², rounded up (worst case π = 0.5).', tag: 'Proportions' },
    { q: 'Statement of the Central Limit Theorem', a: 'For i.i.d. X₁…Xₙ with mean μ and finite variance σ², X̄ is approximately N(μ, σ²/n) for large n, regardless of the parent distribution.', tag: 'Concepts' },
    { q: 'Var(X + Y) when X and Y are correlated', a: 'Var(X) + Var(Y) + 2ρσ_Xσ_Y', tag: 'Concepts' },
    { q: 'Var(X − Y) when X and Y are correlated', a: 'Var(X) + Var(Y) − 2ρσ_Xσ_Y', tag: 'Concepts' },
    { q: 'Mean and variance of U(0, d)', a: 'E(X) = d/2, Var(X) = d²/12', tag: 'Concepts' },
    { q: 'When does a two-sided CI answer a hypothesis test?', a: 'A 100(1−α)% two-sided CI rejects H₀: θ = θ₀ at level α exactly when θ₀ lies outside the interval — provided the levels match and both are two-sided.', tag: 'Concepts' },
    { q: 'Bonferroni-adjusted significance level for m comparisons', a: 'α* = α/m', tag: 'ANOVA' },
    { q: 'Why is the ANOVA F test always upper-tailed?', a: 'Differences among group means only inflate MS_tr, so evidence against H₀ appears as a large F.', tag: 'ANOVA' },
    { q: 'Continuity correction when approximating Bin(n,p) by a normal', a: 'P(X ≥ k) ≈ P(Z > (k − 0.5 − np)/√(np(1−p)))', tag: 'Proportions' },
    { q: 'When is the normal approximation for a proportion test valid?', a: 'nπ₀(1−π₀) > 5 (checked at the NULL value π₀), plus a random sample.', tag: 'Proportions' },
    { q: 'How do you spot paired data?', a: 'The same unit (person, car, sample) is measured twice. The columns are matched row by row — analyse the differences, df = n − 1.', tag: 'Paired data' },
    { q: 'Why does pairing help?', a: 'Differencing removes the unit-to-unit variability, so the standard error is much smaller than a two-sample test would give.', tag: 'Paired data' },
    { q: 'Rejection region for a one-sample z test, H₁: μ < μ₀', a: 'reject when x̄ < μ₀ − z₁₋α·σ/√n (one-sided, so z₁₋α, not z₁₋α/₂)', tag: 'Power' },
    { q: 'Power of a z test at a specific alternative μ₁', a: 'Find the critical x̄ under H₀, then compute P(x̄ in the rejection region) using N(μ₁, σ²/n). The SE does not change.', tag: 'Power' },
    { q: 'Three ways to raise the power of a test', a: 'increase n, increase α, or a larger true effect (μ₁ further from μ₀). A smaller σ also helps.', tag: 'Power' },
    { q: 'Which regression assumption does the CLT protect you against?', a: 'Normality of the errors — so it matters most at small n. Exception: predicting a NEW observation still needs normality. Linearity, independence and equal variance get no such protection.', tag: 'Regression' },
    { q: 'Relation between the t test on β₁ and the F test in simple regression', a: 'F = t² and the p-values are identical (only one predictor).', tag: 'Regression' },
    { q: 'What does Root Mean Squared Error in fitlm output estimate?', a: 'σ, the SD of the errors about the line: s = √(SSe/(n−2)).', tag: 'Regression' },
    { q: 'Sum of squares identity in regression', a: 'SSt = SSr + SSe, and R² = SSr/SSt = 1 − SSe/SSt.', tag: 'Regression' },
    { q: 'Decision tree: X categorical, Y quantitative, 3+ groups', a: 'comparative boxplots / grpstats; one-way ANOVA; then multcompare for which pairs differ.', tag: 'Choosing a method' },
    { q: 'Decision tree: both variables quantitative', a: 'scatterplot; correlation or regression (fitlm); coefCI for the slope.', tag: 'Choosing a method' },
    { q: 'Decision tree: both variables categorical', a: 'clustered bar chart; two-way table (crosstab).', tag: 'Choosing a method' }
  ];

  /* ================= registry ================= */

  var TEMPLATES = [T_SLR, T_SLR_ONESIDED, T_FITLM_OUT, T_PROP, T_ANOVA_DATA, T_ANOVA_TABLE,
                   T_NORMAL_COMBO, T_TTEST2, T_TTEST1, T_PAIRED, T_POWER_Z, T_CLT, T_BINOM,
                   T_METHOD];

  // Build a question, retrying with new seeds when the random data is rejected.
  function build(templateId, seed) {
    var tpl = null;
    for (var i = 0; i < TEMPLATES.length; i++) if (TEMPLATES[i].id === templateId) tpl = TEMPLATES[i];
    if (!tpl) return null;
    for (var k = 0; k < 60; k++) {
      var rng = S.rng(seed + k * 7919);
      var q;
      try { q = tpl.build(rng); } catch (e) { q = null; }
      if (q) {
        q.parts.forEach(function (p) {
          // apply deferred shuffles for multi-select parts
          if (p.kind === 'multi' && p.shuffleWith) {
            var sh = shuffleMulti(p.shuffleWith, p.options, p.correct);
            p.options = sh.options; p.correct = sh.correct; delete p.shuffleWith;
          }
          // a trap that lands inside the marking tolerance would contradict
          // itself — drop it rather than tell a correct answer it is wrong
          if (p.kind === 'numeric' && p.traps) {
            var tol = tolerance(p);
            p.traps = p.traps.filter(function (t) {
              return isFinite(t.value) && Math.abs(t.value - p.answer) > 2 * tol + 1e-12;
            });
          }
          if (p.kind === 'interval' && p.traps) {
            p.traps = p.traps.filter(function (t) {
              var a = p.answer[t.which === undefined ? 0 : t.which];
              return isFinite(t.value) && Math.abs(t.value - a) > 4e-3 * Math.abs(a) + 1e-9;
            });
          }
        });
        q.id = tpl.id; q.topic = tpl.topic; q.title = tpl.title;
        q.marks = q.parts.reduce(function (s2, p) { return s2 + (p.marks || 0); }, 0);
        q.seed = seed + k * 7919;
        return q;
      }
    }
    return null;
  }

  var SUBJECT = {
    id: 'math2859',
    code: 'MATH2859',
    name: 'Probability & Statistics',
    tagline: 'Every question regenerates with new data, so you can repeat a type until it is automatic. ' +
      'Answers are marked instantly and common mistakes are diagnosed by name.',
    templates: TEMPLATES,
    build: build,
    tolerance: tolerance,
    fmt: fmt,
    drillBlurb: 'Low-friction recall of the MATLAB commands and the definitions that get asked every paper.',
    drillSets: [
      { id: 'commands', label: 'MATLAB / Python commands', cards: COMMAND_DRILL },
      { id: 'concepts', label: 'Definitions & formulas', cards: CONCEPT_DRILL }
    ],
    reference: {
      title: 'Command reference',
      blurb: 'The commands these papers actually require. Nothing here is a substitute for knowing which one to reach for.',
      fromDrill: 'commands',
      sections: [
        { heading: 'First thing in the exam', rows: [
          ['format long', 'run it once — MATLAB shows only 4 decimals by default, and these papers ask for 6'],
          ['Read values from the model, not the screen', 'mdl.Coefficients.pValue(2), mdl.Coefficients.tStat(2), mdl.DFE'],
          ['One-off full precision', "fprintf('%.8f\\n', z)"],
          ['Never retype a rounded number', 'carry the variable into the next step instead']
        ] },
        { heading: 'Things that cost marks', rows: [
          ['Regression slope test df', 'n − 2, never n − 1'],
          ['MATLAB p-values from fitlm', 'always two-sided — halve for a one-sided alternative'],
          ['CI vs prediction interval', 'the PI has the extra “1 +” inside the square root'],
          ['ANOVA denominator df', 'N − k, not N − 1'],
          ['Sample size answers', 'always round up'],
          ['“Regardless of π”', 'use the worst case π = 0.5'],
          ['Hypotheses', 'about parameters (μ, β₁, π), never about x̄, β̂₁ or p̂'],
          ['Conclusions', 'never “accept H₀” and never “proves”'],
          ['P(X ≥ k) for a binomial', '1 − binocdf(k−1, n, p) — mind the −1'],
          ['Var(X + Y) when correlated', 'add 2ρσ_Xσ_Y; subtract it for X − Y']
        ] }
      ]
    }
  };

  if (global.Subjects) global.Subjects.register(SUBJECT);
  global.MATH2859 = SUBJECT;
})(typeof window !== 'undefined' ? window : globalThis);

if (typeof module !== 'undefined') module.exports = (typeof window !== 'undefined' ? window : globalThis).MATH2859;
