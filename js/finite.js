/* finite.js — exact arithmetic engine for MATH2400 Finite Mathematics.
   Integer number theory, rationals, base expansions, continued fractions,
   polynomials over Z_p, finite fields, and Hamming codes. Everything is exact:
   modular exponentiation goes through BigInt, and rationals are kept reduced. */
(function (global) {
  'use strict';

  /* ================= integers ================= */

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = a % b; a = b; b = t; }
    return a;
  }
  function lcm(a, b) { return Math.abs(a / gcd(a, b) * b); }

  // extended Euclid: returns {g, x, y} with a*x + b*y = g
  function egcd(a, b) {
    var old_r = a, r = b, old_s = 1, s = 0, old_t = 0, t = 1;
    while (r !== 0) {
      var q = Math.floor(old_r / r);
      var tmp = old_r - q * r; old_r = r; r = tmp;
      tmp = old_s - q * s; old_s = s; s = tmp;
      tmp = old_t - q * t; old_t = t; t = tmp;
    }
    if (old_r < 0) { old_r = -old_r; old_s = -old_s; old_t = -old_t; }
    return { g: old_r, x: old_s, y: old_t };
  }

  // Steps of the Euclidean algorithm, for showing working.
  function euclidSteps(a, b) {
    var steps = [];
    a = Math.abs(a); b = Math.abs(b);
    if (b > a) { var t = a; a = b; b = t; }
    while (b) {
      var q = Math.floor(a / b), r = a - q * b;
      steps.push({ a: a, b: b, q: q, r: r });
      a = b; b = r;
    }
    return { steps: steps, g: a };
  }

  function isPrime(n) {
    if (n < 2) return false;
    if (n % 2 === 0) return n === 2;
    for (var i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
    return true;
  }

  function factorise(n) {
    var out = [], d = 2;
    n = Math.abs(n);
    while (d * d <= n) {
      if (n % d === 0) {
        var e = 0;
        while (n % d === 0) { n /= d; e++; }
        out.push([d, e]);
      }
      d += (d === 2 ? 1 : 2);
    }
    if (n > 1) out.push([n, 1]);
    return out;
  }

  function phi(n) {
    if (n <= 0) return 0;
    var f = factorise(n), r = 1;
    f.forEach(function (pe) { r *= Math.pow(pe[0], pe[1] - 1) * (pe[0] - 1); });
    return Math.round(r);
  }

  function divisors(n) {
    var out = [];
    for (var i = 1; i * i <= n; i++) {
      if (n % i === 0) { out.push(i); if (i !== n / i) out.push(n / i); }
    }
    return out.sort(function (a, b) { return a - b; });
  }

  /* Modular exponentiation via BigInt so nothing silently loses precision. */
  function modpow(a, e, m) {
    if (m === 1) return 0;
    var A = BigInt(a) % BigInt(m), E = BigInt(e), M = BigInt(m), R = 1n;
    if (A < 0n) A += M;
    while (E > 0n) {
      if (E & 1n) R = (R * A) % M;
      A = (A * A) % M;
      E >>= 1n;
    }
    return Number(R);
  }

  function modinv(a, m) {
    var r = egcd(((a % m) + m) % m, m);
    if (r.g !== 1) return null;
    return ((r.x % m) + m) % m;
  }

  // multiplicative order of a modulo n (null if gcd(a,n) != 1)
  function orderMod(a, n) {
    if (gcd(a, n) !== 1) return null;
    var t = phi(n), ds = divisors(t);
    for (var i = 0; i < ds.length; i++) if (modpow(a, ds[i], n) === 1) return ds[i];
    return null;
  }

  function isPrimitiveRoot(a, n) { return orderMod(a, n) === phi(n); }

  function primitiveRoots(n) {
    var out = [];
    for (var a = 1; a < n; a++) if (gcd(a, n) === 1 && isPrimitiveRoot(a, n)) out.push(a);
    return out;
  }

  /* Solve a system x ≡ a_i (mod m_i). Each entry may be {c, a, m} meaning
     c·x ≡ a (mod m); c defaults to 1. Returns {x, m} or null if inconsistent. */
  function crt(list) {
    var X = 0, M = 1;
    for (var i = 0; i < list.length; i++) {
      var c = list[i].c === undefined ? 1 : list[i].c;
      var a = list[i].a, m = list[i].m;
      var inv = modinv(c, m);
      if (inv === null) return null;                 // not uniquely solvable
      var ai = (((a * inv) % m) + m) % m;
      // combine x ≡ X (mod M) with x ≡ ai (mod m)
      var g = gcd(M, m);
      if ((ai - X) % g !== 0) return null;
      var lcmM = M / g * m;
      var diff = ((ai - X) / g) % (m / g);
      var invM = modinv((M / g) % (m / g), m / g);
      if (invM === null) { if (m / g === 1) invM = 0; else return null; }
      var k = (((diff * invM) % (m / g)) + (m / g)) % (m / g);
      X = ((X + M * k) % lcmM + lcmM) % lcmM;
      M = lcmM;
    }
    return { x: X, m: M };
  }

  /* ================= rationals ================= */

  function frac(n, d) {
    if (d === undefined) d = 1;
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d) || 1;
    return { n: n / g, d: d / g };
  }
  function fracAdd(a, b) { return frac(a.n * b.d + b.n * a.d, a.d * b.d); }
  function fracSub(a, b) { return frac(a.n * b.d - b.n * a.d, a.d * b.d); }
  function fracMul(a, b) { return frac(a.n * b.n, a.d * b.d); }
  function fracDiv(a, b) { return frac(a.n * b.d, a.d * b.n); }
  function fracStr(f) { return f.d === 1 ? String(f.n) : f.n + '/' + f.d; }
  function fracMixedStr(f) {
    if (f.d === 1) return String(f.n);
    var whole = Math.trunc(f.n / f.d), rem = Math.abs(f.n % f.d);
    if (whole === 0) return fracStr(f);
    return whole + ' ' + rem + '/' + f.d;
  }

  /* ================= base expansions ================= */

  var DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

  function toBase(n, b) {
    if (n === 0) return '0';
    var neg = n < 0, s = '';
    n = Math.abs(n);
    while (n > 0) { s = DIGITS[n % b] + s; n = Math.floor(n / b); }
    return (neg ? '-' : '') + s;
  }
  /* Exact digit-string parsing. A long period (say 20 base-9 digits) overflows a
     double, so parse in BigInt and only narrow when the value is safe. */
  function fromBaseBig(str, b) {
    var B = BigInt(b), v = 0n;
    str = String(str).toLowerCase();
    for (var i = 0; i < str.length; i++) v = v * B + BigInt(DIGITS.indexOf(str[i]));
    return v;
  }
  function fromBase(str, b) { return Number(fromBaseBig(str, b)); }

  /* Expand a rational n/d in base b. Returns
     {int, pre, period} where the expansion is (int . pre <period repeated>)_b */
  function fracToBase(n, d, b) {
    var neg = n < 0; n = Math.abs(n);
    var ip = Math.floor(n / d), rem = n % d;
    var seen = {}, digits = [], pos = 0, start = -1;
    while (rem !== 0) {
      if (seen[rem] !== undefined) { start = seen[rem]; break; }
      seen[rem] = pos;
      rem *= b;
      digits.push(Math.floor(rem / d));
      rem = rem % d;
      pos++;
    }
    var pre, period;
    if (start < 0) { pre = digits; period = []; }
    else { pre = digits.slice(0, start); period = digits.slice(start); }
    return {
      neg: neg,
      int: toBase(ip, b),
      pre: pre.map(function (x) { return DIGITS[x]; }).join(''),
      period: period.map(function (x) { return DIGITS[x]; }).join('')
    };
  }

  /* Inverse: (int . pre <period>)_b as an exact rational.
     Done in BigInt — b^k overflows a double once the period runs long, which
     silently corrupted the result for periods of more than a dozen digits. */
  function baseToFrac(intStr, preStr, periodStr, b) {
    intStr = intStr || '0'; preStr = preStr || ''; periodStr = periodStr || '';
    var B = BigInt(b);
    var k = BigInt(preStr.length), r = BigInt(periodStr.length);
    var N = fromBaseBig(intStr, b), D = 1n;
    if (preStr.length) {
      var pk = B ** k;
      N = N * pk + fromBaseBig(preStr, b);
      D = pk;
    }
    if (periodStr.length) {
      var span = B ** r - 1n;
      N = N * span + fromBaseBig(periodStr, b);
      D = D * span;
    }
    var g = bigGcd(N < 0n ? -N : N, D) || 1n;
    N /= g; D /= g;
    return { n: Number(N), d: Number(D) };
  }
  function bigGcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }

  /* ================= continued fractions ================= */

  // finite expansion of a rational
  function cfExpand(n, d) {
    var out = [];
    while (d !== 0) {
      var q = Math.floor(n / d);
      out.push(q);
      var r = n - q * d;
      n = d; d = r;
    }
    return out;
  }
  function cfValue(list) {
    var v = frac(list[list.length - 1], 1);
    for (var i = list.length - 2; i >= 0; i--) v = fracAdd(frac(list[i], 1), frac(v.d, v.n));
    return v;
  }
  // convergents p_i/q_i of a finite list
  function cfConvergents(list) {
    var p = [1, list[0]], q = [0, 1];
    for (var i = 1; i < list.length; i++) {
      p.push(list[i] * p[i] + p[i - 1]);
      q.push(list[i] * q[i] + q[i - 1]);
    }
    return { p: p.slice(1), q: q.slice(1) };   // index i -> convergent i
  }

  function squarefree(D) {
    // D = f^2 * c ; return {c, f}
    var f = 1;
    for (var i = 2; i * i <= D; i++) {
      while (D % (i * i) === 0) { D /= (i * i); f *= i; }
    }
    return { c: D, f: f };
  }

  /* Value of a periodic continued fraction [pre; <period>] as (a + b√c)/d.
     Pure-periodic tail y satisfies y = (P y + P')/(Q y + Q'), i.e.
     Q y² + (Q' − P) y − P' = 0, then the pre-period is applied by
     back-substitution and the result rationalised. */
  function periodicCf(pre, period) {
    var conv = cfConvergents(period);
    var m = period.length - 1;
    var P = conv.p[m], Q = conv.q[m];
    var Pp = m > 0 ? conv.p[m - 1] : 1, Qp = m > 0 ? conv.q[m - 1] : 0;
    // Q y^2 + (Qp - P) y - Pp = 0  ->  y = ((P - Qp) + sqrt((P-Qp)^2 + 4 Q Pp)) / (2Q)
    var A = P - Qp, D = A * A + 4 * Q * Pp, B = 2 * Q;
    // y = (A + sqrt(D)) / B
    if (pre.length) {
      var c2 = cfConvergents(pre);
      var k = pre.length - 1;
      var p1 = c2.p[k], q1 = c2.q[k];
      var p0 = k > 0 ? c2.p[k - 1] : 1, q0 = k > 0 ? c2.q[k - 1] : 0;
      // x = (p1 y + p0)/(q1 y + q0) with y = (A + sqrt D)/B
      // numerator   = (p1 A + p0 B) + p1 sqrt D
      // denominator = (q1 A + q0 B) + q1 sqrt D
      var nA = p1 * A + p0 * B, nB = p1;
      var dA = q1 * A + q0 * B, dB = q1;
      // rationalise: multiply by conjugate (dA - dB sqrt D)
      var den = dA * dA - dB * dB * D;
      var rA = nA * dA - nB * dB * D;
      var rB = nB * dA - nA * dB;
      A = rA; B = den;
      // rB is the coefficient of sqrt(D)
      var sf = squarefree(D);
      var bcoef = rB * sf.f, c = sf.c;
      var g = gcd(gcd(Math.abs(A), Math.abs(bcoef)), Math.abs(B)) || 1;
      A /= g; bcoef /= g; B /= g;
      if (B < 0) { A = -A; bcoef = -bcoef; B = -B; }
      return { a: A, b: bcoef, c: c, d: B };
    }
    var sf2 = squarefree(D);
    var bc = sf2.f, cc = sf2.c;
    var g2 = gcd(gcd(Math.abs(A), Math.abs(bc)), Math.abs(B)) || 1;
    A /= g2; bc /= g2; B /= g2;
    if (B < 0) { A = -A; bc = -bc; B = -B; }
    return { a: A, b: bc, c: cc, d: B };
  }

  function surdStr(s) {
    if (s.c === 1) return fracStr(frac(s.a + s.b, s.d));
    var top = (s.a === 0 ? '' : s.a) +
      (s.b < 0 ? ' - ' : (s.a === 0 ? '' : ' + ')) +
      (Math.abs(s.b) === 1 ? '' : Math.abs(s.b)) + 'sqrt(' + s.c + ')';
    return s.d === 1 ? top : '(' + top.trim() + ')/' + s.d;
  }

  /* ================= polynomials over Z_p ================= */
  /* coefficient arrays, index = degree, entries in [0, p) */

  function pTrim(a) {
    var b = a.slice();
    while (b.length && b[b.length - 1] === 0) b.pop();
    return b;
  }
  function pMod(a, p) { return pTrim(a.map(function (c) { return ((c % p) + p) % p; })); }
  function pDeg(a) { return pTrim(a).length - 1; }
  function pAdd(a, b, p) {
    var out = [];
    for (var i = 0; i < Math.max(a.length, b.length); i++) out.push(((a[i] || 0) + (b[i] || 0)) % p);
    return pMod(out, p);
  }
  function pSub(a, b, p) {
    var out = [];
    for (var i = 0; i < Math.max(a.length, b.length); i++) out.push((a[i] || 0) - (b[i] || 0));
    return pMod(out, p);
  }
  function pMul(a, b, p) {
    a = pTrim(a); b = pTrim(b);
    if (!a.length || !b.length) return [];
    var out = new Array(a.length + b.length - 1).fill(0);
    for (var i = 0; i < a.length; i++)
      for (var j = 0; j < b.length; j++) out[i + j] = (out[i + j] + a[i] * b[j]) % p;
    return pMod(out, p);
  }
  function pDivMod(a, b, p) {
    a = pMod(a, p); b = pMod(b, p);
    if (!b.length) return null;
    var q = new Array(Math.max(0, a.length - b.length + 1)).fill(0);
    var r = a.slice();
    var lead = modinv(b[b.length - 1], p);
    while (pTrim(r).length >= b.length && pTrim(r).length) {
      r = pTrim(r);
      var shift = r.length - b.length;
      var factor = (r[r.length - 1] * lead) % p;
      q[shift] = factor;
      for (var i = 0; i < b.length; i++) {
        r[shift + i] = ((r[shift + i] - factor * b[i]) % p + p) % p;
      }
      r = pTrim(r);
      if (shift === 0) break;
    }
    return { q: pMod(q, p), r: pMod(r, p) };
  }
  function pGcd(a, b, p) {
    a = pMod(a, p); b = pMod(b, p);
    while (pTrim(b).length) {
      var r = pDivMod(a, b, p).r;
      a = b; b = r;
    }
    a = pTrim(a);
    if (a.length) {  // make monic
      var inv = modinv(a[a.length - 1], p);
      a = pMod(a.map(function (c) { return c * inv; }), p);
    }
    return a;
  }
  function pEval(a, x, p) {
    var v = 0;
    for (var i = a.length - 1; i >= 0; i--) v = (v * x + a[i]) % p;
    return ((v % p) + p) % p;
  }
  function pRoots(a, p) {
    var out = [];
    for (var x = 0; x < p; x++) if (pEval(a, x, p) === 0) out.push(x);
    return out;
  }
  function pIrreducible(a, p) {
    a = pTrim(pMod(a, p));
    var d = a.length - 1;
    if (d < 1) return false;
    if (d === 1) return true;
    if (d <= 3) return pRoots(a, p).length === 0;
    // trial division by every monic polynomial of degree 2..d/2
    if (pRoots(a, p).length) return false;
    for (var deg = 2; deg * 2 <= d; deg++) {
      var count = Math.pow(p, deg);
      for (var idx = 0; idx < count; idx++) {
        var c = [], t = idx;
        for (var i = 0; i < deg; i++) { c.push(t % p); t = Math.floor(t / p); }
        c.push(1);                                    // monic
        if (!pTrim(pDivMod(a, c, p).r).length) return false;
      }
    }
    return true;
  }
  function pStr(a, v) {
    v = v || 'x';
    a = pTrim(a);
    if (!a.length) return '0';
    var parts = [];
    for (var i = a.length - 1; i >= 0; i--) {
      if (!a[i]) continue;
      var co = a[i], term;
      if (i === 0) term = String(co);
      else {
        var cs = co === 1 ? '' : String(co);
        term = cs + v + (i === 1 ? '' : '^' + i);
      }
      parts.push(term);
    }
    return parts.join(' + ');
  }

  /* ================= finite field Z_p[x]/<f> ================= */

  function ffMul(a, b, f, p) { return pDivMod(pMul(a, b, p), f, p).r; }
  function ffPow(a, e, f, p) {
    var r = [1], base = a.slice();
    while (e > 0) {
      if (e & 1) r = ffMul(r, base, f, p);
      base = ffMul(base, base, f, p);
      e = Math.floor(e / 2);
    }
    return r;
  }
  function ffEq(a, b) {
    a = pTrim(a); b = pTrim(b);
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }
  function ffInverse(a, f, p) {
    // extended Euclid on polynomials
    var r0 = pMod(f, p), r1 = pMod(a, p);
    var s0 = [], s1 = [1];
    while (pTrim(r1).length) {
      var dm = pDivMod(r0, r1, p);
      var r2 = dm.r;
      var s2 = pSub(s0, pMul(dm.q, s1, p), p);
      r0 = r1; r1 = r2; s0 = s1; s1 = s2;
    }
    if (pDeg(r0) !== 0) return null;             // not invertible
    var inv = modinv(r0[0], p);
    return pMod(s0.map(function (c) { return c * inv; }), p);
  }
  function ffOrder(a, f, p) {
    var q = Math.pow(p, pDeg(f)), N = q - 1;
    var ds = divisors(N);
    for (var i = 0; i < ds.length; i++) if (ffEq(ffPow(a, ds[i], f, p), [1])) return ds[i];
    return null;
  }
  // table of alpha^k for k = 0 .. q-2, where alpha = x
  function ffPowerTable(f, p) {
    var q = Math.pow(p, pDeg(f)), out = [];
    for (var k = 0; k < q - 1; k++) out.push(ffPow([0, 1], k, f, p));
    return out;
  }
  /* Minimal polynomial of a over Z_p: least-degree monic poly with a as root,
     found by row-reducing the powers of a. */
  function ffMinPoly(a, f, p) {
    var n = pDeg(f);
    var rows = [], i, j, k;
    for (k = 0; k <= n; k++) {
      var v = ffPow(a, k, f, p);
      var row = [];
      for (i = 0; i < n; i++) row.push(v[i] || 0);
      rows.push(row);
      // is rows[k] a combination of rows[0..k-1]? solve by elimination
      var M = [], rhs = [];
      for (i = 0; i < n; i++) {
        M.push(rows.slice(0, k).map(function (r) { return r[i]; }));
        rhs.push(row[i]);
      }
      var sol = solveModp(M, rhs, p, k);
      if (sol) {
        var coeffs = sol.slice();
        coeffs.push(1);                    // monic leading term x^k
        for (i = 0; i < k; i++) coeffs[i] = ((-coeffs[i] % p) + p) % p;
        return pMod(coeffs, p);
      }
    }
    return null;
  }
  // solve M x = rhs over Z_p (M is rows x cols); returns x or null
  function solveModp(M, rhs, p, cols) {
    if (cols === 0) {
      for (var i = 0; i < rhs.length; i++) if (rhs[i] % p !== 0) return null;
      return [];
    }
    var A = M.map(function (r, i) { return r.slice(0, cols).concat([rhs[i]]); });
    var rows = A.length, piv = [], r = 0, c;
    for (c = 0; c < cols && r < rows; c++) {
      var sel = -1;
      for (var i2 = r; i2 < rows; i2++) if (A[i2][c] % p !== 0) { sel = i2; break; }
      if (sel < 0) continue;
      var tmp = A[r]; A[r] = A[sel]; A[sel] = tmp;
      var inv = modinv(A[r][c], p);
      A[r] = A[r].map(function (v) { return (v * inv % p + p) % p; });
      for (var i3 = 0; i3 < rows; i3++) {
        if (i3 === r || A[i3][c] === 0) continue;
        var fct = A[i3][c];
        A[i3] = A[i3].map(function (v, j) { return ((v - fct * A[r][j]) % p + p) % p; });
      }
      piv.push(c); r++;
    }
    for (var i4 = r; i4 < rows; i4++) if (A[i4][cols] % p !== 0) return null;   // inconsistent
    var x = new Array(cols).fill(0);
    piv.forEach(function (cc, idx) { x[cc] = A[idx][cols]; });
    return x;
  }

  /* ================= Hamming codes ================= */

  /* Standard (7,4): codeword (x, y, a, z, b, c, d) with
     x = a+b+d, y = a+c+d, z = b+c+d  (positions 1,2,4 are checks). */
  function hammingEncode(msg) {
    var a = msg[0], b = msg[1], c = msg[2], d = msg[3];
    var x = (a + b + d) % 2, y = (a + c + d) % 2, z = (b + c + d) % 2;
    return [x, y, a, z, b, c, d];
  }
  var H74 = [
    [1, 0, 1, 0, 1, 0, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 1, 1, 1, 1]
  ];
  function hammingSyndrome(recv) {
    var s = H74.map(function (row) {
      var t = 0;
      for (var i = 0; i < 7; i++) t += row[i] * recv[i];
      return t % 2;
    });
    return s[0] + 2 * s[1] + 4 * s[2];       // position of the error, 0 = none
  }
  function hammingDecode(recv) {
    var pos = hammingSyndrome(recv);
    var fixed = recv.slice();
    if (pos) fixed[pos - 1] = 1 - fixed[pos - 1];
    return { errorPos: pos, codeword: fixed, message: [fixed[2], fixed[4], fixed[5], fixed[6]] };
  }

  global.Finite = {
    gcd: gcd, lcm: lcm, egcd: egcd, euclidSteps: euclidSteps,
    isPrime: isPrime, factorise: factorise, phi: phi, divisors: divisors,
    modpow: modpow, modinv: modinv, orderMod: orderMod,
    isPrimitiveRoot: isPrimitiveRoot, primitiveRoots: primitiveRoots, crt: crt,
    frac: frac, fracAdd: fracAdd, fracSub: fracSub, fracMul: fracMul, fracDiv: fracDiv,
    fracStr: fracStr, fracMixedStr: fracMixedStr,
    toBase: toBase, fromBase: fromBase, fromBaseBig: fromBaseBig, fracToBase: fracToBase, baseToFrac: baseToFrac,
    cfExpand: cfExpand, cfValue: cfValue, cfConvergents: cfConvergents,
    periodicCf: periodicCf, surdStr: surdStr, squarefree: squarefree,
    pTrim: pTrim, pMod: pMod, pDeg: pDeg, pAdd: pAdd, pSub: pSub, pMul: pMul,
    pDivMod: pDivMod, pGcd: pGcd, pEval: pEval, pRoots: pRoots,
    pIrreducible: pIrreducible, pStr: pStr,
    ffMul: ffMul, ffPow: ffPow, ffEq: ffEq, ffInverse: ffInverse, ffOrder: ffOrder,
    ffPowerTable: ffPowerTable, ffMinPoly: ffMinPoly,
    hammingEncode: hammingEncode, hammingDecode: hammingDecode, hammingSyndrome: hammingSyndrome, H74: H74
  };
})(typeof window !== 'undefined' ? window : globalThis);

if (typeof module !== 'undefined') module.exports = (typeof window !== 'undefined' ? window : globalThis).Finite;
