/* stats.js — distribution + inference engine for MATH2859 practice.
   No dependencies. Everything is double precision; inverse CDFs use
   bracketed bisection to ~1e-12 so generated answers match MATLAB/scipy. */
(function (global) {
  'use strict';

  var LOG_SQRT_2PI = 0.9189385332046727;

  /* ---------- gamma / beta primitives ---------- */

  var LANCZOS = [
    676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012,
    9.9843695780195716e-6, 1.5056327351493116e-7
  ];

  function logGamma(x) {
    if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
    x -= 1;
    var a = 0.99999999999980993, t = x + 7.5;
    for (var i = 0; i < 8; i++) a += LANCZOS[i] / (x + i + 1);
    return LOG_SQRT_2PI + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }

  function logBeta(a, b) { return logGamma(a) + logGamma(b) - logGamma(a + b); }

  // Regularised lower incomplete gamma P(a,x), Numerical Recipes series/CF.
  function gammaP(a, x) {
    if (x < 0 || a <= 0) return NaN;
    if (x === 0) return 0;
    if (x < a + 1) {
      var ap = a, sum = 1 / a, del = sum;
      for (var n = 1; n < 500; n++) {
        ap++; del *= x / ap; sum += del;
        if (Math.abs(del) < Math.abs(sum) * 1e-16) break;
      }
      return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
    }
    // continued fraction for Q(a,x)
    var FPMIN = 1e-300;
    var b = x + 1 - a, c = 1 / FPMIN, d = 1 / b, h = d;
    for (var i = 1; i < 500; i++) {
      var an = -i * (i - a);
      b += 2; d = an * d + b; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = b + an / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; var delt = d * c; h *= delt;
      if (Math.abs(delt - 1) < 1e-16) break;
    }
    return 1 - Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
  }

  // Continued fraction for the incomplete beta function.
  function betacf(a, b, x) {
    var FPMIN = 1e-300, qab = a + b, qap = a + 1, qam = a - 1;
    var c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d;
    var h = d;
    for (var m = 1; m <= 500; m++) {
      var m2 = 2 * m;
      var aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      var del = d * c; h *= del;
      if (Math.abs(del - 1) < 1e-16) break;
    }
    return h;
  }

  // Regularised incomplete beta I_x(a,b)
  function ibeta(a, b, x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var front = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - logBeta(a, b));
    if (x < (a + 1) / (a + b + 2)) return front * betacf(a, b, x) / a;
    return 1 - Math.exp(b * Math.log(1 - x) + a * Math.log(x) - logBeta(b, a)) * betacf(b, a, 1 - x) / b;
  }

  /* ---------- normal ---------- */

  function normPdf(z, mu, sd) {
    mu = mu || 0; sd = (sd === undefined ? 1 : sd);
    var t = (z - mu) / sd;
    return Math.exp(-0.5 * t * t) / (sd * Math.sqrt(2 * Math.PI));
  }

  function normCdf(z, mu, sd) {
    mu = mu || 0; sd = (sd === undefined ? 1 : sd);
    var t = (z - mu) / sd;
    if (t === 0) return 0.5;
    var p = 0.5 * gammaP(0.5, t * t / 2);
    return t > 0 ? 0.5 + p : 0.5 - p;
  }

  // Acklam's inverse normal, refined by one Halley step against normCdf.
  function normInv(p, mu, sd) {
    mu = mu || 0; sd = (sd === undefined ? 1 : sd);
    if (p <= 0 || p >= 1) return p <= 0 ? -Infinity : Infinity;
    var a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
             1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    var b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
             6.680131188771972e+01, -1.328068155288572e+01];
    var c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
             -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    var d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00,
             3.754408661907416e+00];
    var pl = 0.02425, q, r, x;
    if (p < pl) {
      q = Math.sqrt(-2 * Math.log(p));
      x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
          ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    } else if (p <= 1 - pl) {
      q = p - 0.5; r = q * q;
      x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
          (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
           ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    for (var i = 0; i < 3; i++) {
      var e = normCdf(x) - p, u = e * Math.sqrt(2 * Math.PI) * Math.exp(x * x / 2);
      x = x - u / (1 + x * u / 2);
    }
    return mu + sd * x;
  }

  /* ---------- generic inverse by bisection ---------- */

  function invByBisect(cdf, p, lo, hi) {
    var flo = cdf(lo), fhi = cdf(hi), i;
    for (i = 0; i < 200 && flo > p; i++) { lo = lo - (hi - lo); flo = cdf(lo); }
    for (i = 0; i < 200 && fhi < p; i++) { hi = hi + (hi - lo); fhi = cdf(hi); }
    for (i = 0; i < 300; i++) {
      var mid = 0.5 * (lo + hi);
      if (cdf(mid) < p) lo = mid; else hi = mid;
      if (hi - lo < 1e-13 * Math.max(1, Math.abs(hi))) break;
    }
    return 0.5 * (lo + hi);
  }

  /* ---------- Student t ---------- */

  function tCdf(t, v) {
    var x = v / (v + t * t);
    var p = 0.5 * ibeta(v / 2, 0.5, x);
    return t > 0 ? 1 - p : p;
  }
  function tInv(p, v) { return invByBisect(function (t) { return tCdf(t, v); }, p, -10, 10); }
  /* Upper tail P(T_v > t) computed directly. `1 - tCdf` underflows to exactly 0
     for large |t|, which would print a p-value of 0.0000e+0 where MATLAB shows
     something like 3.4451e-25. */
  function tSf(t, v) {
    if (t < 0) return 1 - tSf(-t, v);
    return 0.5 * ibeta(v / 2, 0.5, v / (v + t * t));
  }
  function tPdf(t, v) {
    return Math.exp(logGamma((v + 1) / 2) - logGamma(v / 2)) /
      Math.sqrt(v * Math.PI) * Math.pow(1 + t * t / v, -(v + 1) / 2);
  }

  /* ---------- F ---------- */

  function fCdf(f, d1, d2) {
    if (f <= 0) return 0;
    return ibeta(d1 / 2, d2 / 2, d1 * f / (d1 * f + d2));
  }
  function fInv(p, d1, d2) { return invByBisect(function (f) { return fCdf(f, d1, d2); }, p, 1e-9, 10); }

  /* ---------- chi-square ---------- */

  function chi2Cdf(x, v) { return x <= 0 ? 0 : gammaP(v / 2, x / 2); }
  function chi2Inv(p, v) { return invByBisect(function (x) { return chi2Cdf(x, v); }, p, 1e-9, 2 * v + 10); }

  /* ---------- binomial ---------- */

  function logChoose(n, k) {
    return logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
  }
  function binomPmf(k, n, p) {
    if (k < 0 || k > n) return 0;
    if (p === 0) return k === 0 ? 1 : 0;
    if (p === 1) return k === n ? 1 : 0;
    return Math.exp(logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
  }
  function binomCdf(k, n, p) {
    k = Math.floor(k);
    if (k < 0) return 0;
    if (k >= n) return 1;
    // regularised incomplete beta identity: P(X<=k) = I_{1-p}(n-k, k+1)
    return ibeta(n - k, k + 1, 1 - p);
  }
  // P(X >= k)
  function binomSf(k, n, p) { return 1 - binomCdf(k - 1, n, p); }

  function poissPmf(k, l) { return Math.exp(-l + k * Math.log(l) - logGamma(k + 1)); }

  /* ---------- descriptive ---------- */

  function sum(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; }
  function mean(a) { return sum(a) / a.length; }
  function variance(a) {
    var m = mean(a), s = 0;
    for (var i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m);
    return s / (a.length - 1);
  }
  function sd(a) { return Math.sqrt(variance(a)); }
  function quantileT(a, q) { // linear interpolation (MATLAB-ish for boxplots)
    var b = a.slice().sort(function (x, y) { return x - y; }), n = b.length;
    var pos = q * n - 0.5;
    if (pos <= 0) return b[0];
    if (pos >= n - 1) return b[n - 1];
    var lo = Math.floor(pos), frac = pos - lo;
    return b[lo] + frac * (b[lo + 1] - b[lo]);
  }

  /* ---------- simple linear regression ---------- */

  function linreg(x, y) {
    var n = x.length, mx = mean(x), my = mean(y);
    var Sxx = 0, Sxy = 0, Syy = 0, i;
    for (i = 0; i < n; i++) {
      Sxx += (x[i] - mx) * (x[i] - mx);
      Sxy += (x[i] - mx) * (y[i] - my);
      Syy += (y[i] - my) * (y[i] - my);
    }
    var b1 = Sxy / Sxx, b0 = my - b1 * mx;
    var SSE = 0;
    for (i = 0; i < n; i++) { var e = y[i] - (b0 + b1 * x[i]); SSE += e * e; }
    var df = n - 2, MSE = SSE / df, s = Math.sqrt(MSE);
    var seB1 = s / Math.sqrt(Sxx);
    var seB0 = s * Math.sqrt(1 / n + mx * mx / Sxx);
    var r = Sxy / Math.sqrt(Sxx * Syy);
    var R2 = r * r;
    return {
      n: n, mx: mx, my: my, Sxx: Sxx, Sxy: Sxy, Syy: Syy,
      b0: b0, b1: b1, SSE: SSE, SSR: Syy - SSE, SST: Syy,
      df: df, MSE: MSE, s: s, seB0: seB0, seB1: seB1, r: r, R2: R2,
      t: b1 / seB1,
      pTwoSided: 2 * (1 - tCdf(Math.abs(b1 / seB1), df)),
      fit: function (x0) { return b0 + b1 * x0; },
      seMean: function (x0) { return s * Math.sqrt(1 / n + (x0 - mx) * (x0 - mx) / Sxx); },
      sePred: function (x0) { return s * Math.sqrt(1 + 1 / n + (x0 - mx) * (x0 - mx) / Sxx); },
      ciMean: function (x0, conf) {
        var tc = tInv(1 - (1 - conf) / 2, df), f = b0 + b1 * x0, m = tc * this.seMean(x0);
        return [f - m, f + m];
      },
      piPred: function (x0, conf) {
        var tc = tInv(1 - (1 - conf) / 2, df), f = b0 + b1 * x0, m = tc * this.sePred(x0);
        return [f - m, f + m];
      },
      ciSlope: function (conf) {
        var tc = tInv(1 - (1 - conf) / 2, df);
        return [b1 - tc * seB1, b1 + tc * seB1];
      }
    };
  }

  /* ---------- one-way ANOVA ---------- */

  function anova1(groups) {
    var k = groups.length, N = 0, grand = 0, i, j;
    for (i = 0; i < k; i++) { N += groups[i].length; grand += sum(groups[i]); }
    grand /= N;
    var SSTr = 0, SSE = 0, means = [], ns = [];
    for (i = 0; i < k; i++) {
      var m = mean(groups[i]);
      means.push(m); ns.push(groups[i].length);
      SSTr += groups[i].length * (m - grand) * (m - grand);
      for (j = 0; j < groups[i].length; j++) SSE += (groups[i][j] - m) * (groups[i][j] - m);
    }
    var dfTr = k - 1, dfE = N - k;
    var MSTr = SSTr / dfTr, MSE = SSE / dfE, F = MSTr / MSE;
    return {
      k: k, N: N, ns: ns, means: means, grand: grand,
      SSTr: SSTr, SSE: SSE, SST: SSTr + SSE,
      dfTr: dfTr, dfE: dfE, MSTr: MSTr, MSE: MSE, F: F,
      p: 1 - fCdf(F, dfTr, dfE),
      // CI for mu_i - mu_j using pooled MSE
      ciDiff: function (i, j, conf) {
        var tc = tInv(1 - (1 - conf) / 2, dfE);
        var d = means[i] - means[j];
        var se = Math.sqrt(MSE * (1 / ns[i] + 1 / ns[j]));
        return [d - tc * se, d + tc * se];
      },
      tDiff: function (i, j) {
        return (means[i] - means[j]) / Math.sqrt(MSE * (1 / ns[i] + 1 / ns[j]));
      }
    };
  }

  /* ---------- t procedures ---------- */

  function tCI1(data, conf) {
    var n = data.length, m = mean(data), s = sd(data);
    var tc = tInv(1 - (1 - conf) / 2, n - 1), me = tc * s / Math.sqrt(n);
    return { mean: m, s: s, n: n, df: n - 1, tcrit: tc, me: me, lo: m - me, hi: m + me };
  }

  function tTest1(data, mu0, side) {
    var n = data.length, m = mean(data), s = sd(data), df = n - 1;
    var t = (m - mu0) / (s / Math.sqrt(n)), p;
    if (side === 'greater') p = 1 - tCdf(t, df);
    else if (side === 'less') p = tCdf(t, df);
    else p = 2 * (1 - tCdf(Math.abs(t), df));
    return { mean: m, s: s, n: n, df: df, t: t, p: p };
  }

  /* Paired samples: reduce to a one-sample analysis of the differences. */
  function tTestPaired(a, b, side, conf) {
    var d = [], i;
    for (i = 0; i < a.length; i++) d.push(a[i] - b[i]);
    var n = d.length, m = mean(d), s = sd(d), df = n - 1;
    var se = s / Math.sqrt(n), t = m / se, p;
    if (side === 'greater') p = 1 - tCdf(t, df);
    else if (side === 'less') p = tCdf(t, df);
    else p = 2 * (1 - tCdf(Math.abs(t), df));
    var tc = tInv(1 - (1 - (conf === undefined ? 0.95 : conf)) / 2, df);
    return {
      d: d, n: n, dbar: m, sd: s, se: se, df: df, t: t, p: p,
      tcrit: tc, lo: m - tc * se, hi: m + tc * se
    };
  }

  /* Power of a one-sample z test for a mean with sigma known.
     side 'less'  : reject when xbar < mu0 - z_{1-alpha} sigma/sqrt(n)
     side 'greater': reject when xbar > mu0 + z_{1-alpha} sigma/sqrt(n) */
  function meanZPower(n, mu0, mu1, sigma, alpha, side) {
    var se = sigma / Math.sqrt(n), z = normInv(1 - alpha), crit, power;
    if (side === 'greater') {
      crit = mu0 + z * se;
      power = 1 - normCdf((crit - mu1) / se);
    } else {
      crit = mu0 - z * se;
      power = normCdf((crit - mu1) / se);
    }
    return { se: se, zcrit: z, crit: crit, power: power, beta: 1 - power };
  }

  function tTest2(a, b, side, conf) {
    var n1 = a.length, n2 = b.length;
    var m1 = mean(a), m2 = mean(b), v1 = variance(a), v2 = variance(b);
    var df = n1 + n2 - 2;
    var sp2 = ((n1 - 1) * v1 + (n2 - 1) * v2) / df, sp = Math.sqrt(sp2);
    var se = sp * Math.sqrt(1 / n1 + 1 / n2);
    var t = (m1 - m2) / se, p;
    if (side === 'greater') p = 1 - tCdf(t, df);
    else if (side === 'less') p = tCdf(t, df);
    else p = 2 * (1 - tCdf(Math.abs(t), df));
    var tc = tInv(1 - (1 - (conf === undefined ? 0.95 : conf)) / 2, df);
    return {
      n1: n1, n2: n2, m1: m1, m2: m2, s1: Math.sqrt(v1), s2: Math.sqrt(v2),
      sp: sp, sp2: sp2, se: se, df: df, t: t, p: p,
      diff: m1 - m2, lo: (m1 - m2) - tc * se, hi: (m1 - m2) + tc * se, tcrit: tc
    };
  }

  /* ---------- proportions ---------- */

  function propZTest(x, n, p0, side) {
    var ph = x / n, se = Math.sqrt(p0 * (1 - p0) / n), z = (ph - p0) / se, p;
    if (side === 'greater') p = 1 - normCdf(z);
    else if (side === 'less') p = normCdf(z);
    else p = 2 * (1 - normCdf(Math.abs(z)));
    return { phat: ph, se: se, z: z, p: p };
  }

  // Power of an upper-tailed proportion test at true proportion p1.
  function propPower(n, p0, p1, alpha) {
    var zc = normInv(1 - alpha);
    var crit = p0 + zc * Math.sqrt(p0 * (1 - p0) / n);
    return 1 - normCdf((crit - p1) / Math.sqrt(p1 * (1 - p1) / n));
  }

  // Worst-case sample size so that |phat - pi| <= E with confidence `conf`.
  function propSampleSize(E, conf) {
    var z = normInv(1 - (1 - conf) / 2);
    return Math.ceil(z * z * 0.25 / (E * E));
  }

  /* ---------- seeded RNG (mulberry32) ---------- */

  function rng(seed) {
    var a = seed >>> 0;
    function next() {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    return {
      next: next,
      uniform: function (lo, hi) { return lo + (hi - lo) * next(); },
      int: function (lo, hi) { return lo + Math.floor(next() * (hi - lo + 1)); },
      pick: function (arr) { return arr[Math.floor(next() * arr.length)]; },
      normal: function (mu, s) {
        var u = 1 - next(), v = next();
        return mu + s * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      },
      shuffle: function (arr) {
        var a2 = arr.slice();
        for (var i = a2.length - 1; i > 0; i--) {
          var j = Math.floor(next() * (i + 1)), t = a2[i]; a2[i] = a2[j]; a2[j] = t;
        }
        return a2;
      }
    };
  }

  function round(x, dp) { var f = Math.pow(10, dp); return Math.round(x * f) / f; }

  global.Stats = {
    logGamma: logGamma, ibeta: ibeta, gammaP: gammaP,
    normPdf: normPdf, normCdf: normCdf, normInv: normInv,
    tCdf: tCdf, tInv: tInv, tPdf: tPdf, tSf: tSf,
    fCdf: fCdf, fInv: fInv,
    chi2Cdf: chi2Cdf, chi2Inv: chi2Inv,
    binomPmf: binomPmf, binomCdf: binomCdf, binomSf: binomSf, poissPmf: poissPmf,
    sum: sum, mean: mean, variance: variance, sd: sd, quantile: quantileT,
    linreg: linreg, anova1: anova1,
    tCI1: tCI1, tTest1: tTest1, tTest2: tTest2,
    tTestPaired: tTestPaired, meanZPower: meanZPower,
    propZTest: propZTest, propPower: propPower, propSampleSize: propSampleSize,
    rng: rng, round: round
  };
})(typeof window !== 'undefined' ? window : globalThis);

if (typeof module !== 'undefined') module.exports = (typeof window !== 'undefined' ? window : globalThis).Stats;
