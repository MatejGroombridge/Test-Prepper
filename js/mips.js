/* mips.js — a small MIPS assembler and simulator in the style of mipsy,
   the simulator COMP1521 uses. It runs the subset of MIPS that the course
   teaches, so exam-style answers can be autotested in the browser.

   Mips.run(source, stdin, opts?) -> { stdout, error, line, steps }
     error is null on a clean exit, otherwise a message (with the source line).
   Mips.test(source, [{stdin, stdout}], opts?) -> [{pass, near, got, expected, error}]

   Like mipsy, it treats these as errors rather than carrying on silently:
     - using a register that was never given a value (saving and restoring
       one on the stack is fine; doing arithmetic with it, or printing it, is not)
     - using memory that was never written (.space, the stack, sbrk)
     - signed overflow in add / addi / sub, division by zero
     - unaligned word/half accesses, jumping outside the program
   It does not model branch delay slots (mipsy does not either), floating
   point, or the kernel. The program starts at `main`; returning from main
   with `jr $ra` ends it, as does syscall 10. */
(function (global) {
  'use strict';

  var TEXT_BASE = 0x00400000, DATA_BASE = 0x10010000, STACK_TOP = 0x7FFFFF00;
  var KERNEL_RETURN = 0x80000180;
  var DEFAULT_MAX_STEPS = 5000000;

  var REG_NAMES = ['zero', 'at', 'v0', 'v1', 'a0', 'a1', 'a2', 'a3',
    't0', 't1', 't2', 't3', 't4', 't5', 't6', 't7',
    's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7',
    't8', 't9', 'k0', 'k1', 'gp', 'sp', 'fp', 'ra'];
  var REG = {};
  REG_NAMES.forEach(function (n, i) { REG[n] = i; REG[String(i)] = i; });
  REG.s8 = 30;

  function MipsError(msg, line) { this.message = msg; this.line = line; }

  function regName(i) { return '$' + REG_NAMES[i]; }
  function hex(n) { return ('00000000' + (n >>> 0).toString(16)).slice(-8); }

  /* ---------------------------- lexing ---------------------------- */

  /* Remove a # comment, ignoring # inside quotes. */
  function stripComment(s) {
    var q = null;
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (q) {
        if (ch === '\\') { i++; continue; }
        if (ch === q) q = null;
      } else if (ch === '"' || ch === "'") q = ch;
      else if (ch === '#') return s.slice(0, i);
    }
    return s;
  }

  /* Split operands on commas that are not inside quotes or parentheses. */
  function splitOperands(s) {
    var out = [], cur = '', q = null, depth = 0;
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (q) {
        cur += ch;
        if (ch === '\\') { cur += s[++i] || ''; continue; }
        if (ch === q) q = null;
        continue;
      }
      if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    if (cur.trim() !== '') out.push(cur.trim());
    return out;
  }

  var ESC = { n: 10, t: 9, r: 13, '0': 0, '\\': 92, '"': 34, "'": 39, a: 7, b: 8, f: 12, v: 11, e: 27 };

  function utf8(cp) {
    if (cp < 0x80) return [cp];
    if (cp < 0x800) return [0xC0 | cp >> 6, 0x80 | cp & 63];
    if (cp < 0x10000) return [0xE0 | cp >> 12, 0x80 | cp >> 6 & 63, 0x80 | cp & 63];
    return [0xF0 | cp >> 18, 0x80 | cp >> 12 & 63, 0x80 | cp >> 6 & 63, 0x80 | cp & 63];
  }

  function parseString(tok, line) {
    if (tok.length < 2 || tok[0] !== '"' || tok[tok.length - 1] !== '"') throw new MipsError('expected a "string"', line);
    var body = tok.slice(1, -1), bytes = [];
    for (var i = 0; i < body.length; i++) {
      var ch = body[i];
      if (ch === '\\') {
        var e = body[++i];
        if (e === 'x') { bytes.push(parseInt(body.substr(i + 1, 2), 16)); i += 2; }
        else if (ESC[e] !== undefined) bytes.push(ESC[e]);
        else throw new MipsError('unknown escape \\' + e, line);
      } else {
        // encode as UTF-8 so non-ASCII text behaves as it would on Linux
        var cp = body.codePointAt(i);
        if (cp > 0xFFFF) i++;
        utf8(cp).forEach(function (b) { bytes.push(b); });
      }
    }
    return bytes;
  }

  /* Evaluate an integer expression: numbers, 'c' chars, constants, labels,
     + - * / % << >> & | ^ ~ and parentheses. */
  function evalExpr(src, env, line) {
    var s = src.trim(), pos = 0;
    function peek() { while (s[pos] === ' ' || s[pos] === '\t') pos++; return s[pos]; }
    function fail(msg) { throw new MipsError(msg || ('cannot understand "' + src + '"'), line); }
    function primary() {
      var c = peek();
      if (c === '(') { pos++; var v = expr(); if (peek() !== ')') fail(); pos++; return v; }
      if (c === '-') { pos++; return -primary() | 0; }
      if (c === '+') { pos++; return primary(); }
      if (c === '~') { pos++; return ~primary(); }
      if (c === "'") {
        var end = s[pos + 1] === '\\' ? s.indexOf("'", pos + 3) : s.indexOf("'", pos + 1);
        if (end < 0) fail();
        var body = s.slice(pos + 1, end); pos = end + 1;
        if (body[0] === '\\') { if (ESC[body[1]] === undefined) fail('unknown escape in ' + src); return ESC[body[1]]; }
        if (body.length !== 1) fail('a character literal holds one character');
        return body.charCodeAt(0);
      }
      var m = /^(0x[0-9a-fA-F]+|0b[01]+|[0-9]+|[A-Za-z_.][A-Za-z0-9_.]*)/.exec(s.slice(pos));
      if (!m) fail();
      pos += m[0].length;
      var t = m[0];
      if (/^0x/i.test(t)) return parseInt(t.slice(2), 16) | 0;
      if (/^0b/i.test(t)) return parseInt(t.slice(2), 2) | 0;
      if (/^[0-9]/.test(t)) return parseInt(t, 10) | 0;
      if (env && Object.prototype.hasOwnProperty.call(env, t)) return env[t];
      throw new MipsError('unknown label or constant "' + t + '"', line);
    }
    function term() {
      var v = primary();
      for (;;) {
        var c = peek();
        if (c === '*') { pos++; v = Math.imul(v, primary()); }
        else if (c === '/') { pos++; var d = primary(); if (!d) fail('division by zero'); v = (v / d) | 0; }
        else if (c === '%') { pos++; var d2 = primary(); if (!d2) fail('division by zero'); v = (v % d2) | 0; }
        else return v;
      }
    }
    function sum() {
      var v = term();
      for (;;) {
        var c = peek();
        if (c === '+') { pos++; v = (v + term()) | 0; }
        else if (c === '-') { pos++; v = (v - term()) | 0; }
        else return v;
      }
    }
    function shift() {
      var v = sum();
      for (;;) {
        peek();
        if (s.substr(pos, 2) === '<<') { pos += 2; v = v << sum(); }
        else if (s.substr(pos, 2) === '>>') { pos += 2; v = v >> sum(); }
        else return v;
      }
    }
    function expr() {
      var v = shift();
      for (;;) {
        var c = peek();
        if (c === '&') { pos++; v &= shift(); }
        else if (c === '|') { pos++; v |= shift(); }
        else if (c === '^') { pos++; v ^= shift(); }
        else return v;
      }
    }
    var v = expr();
    if (peek() !== undefined) fail();
    return v;
  }

  /* ---------------------------- memory ---------------------------- */

  function Memory() { this.pages = {}; }
  Memory.prototype.page = function (addr, create) {
    var k = addr >>> 12, p = this.pages[k];
    if (!p && create) p = this.pages[k] = { d: new Uint8Array(4096), init: new Uint8Array(4096) };
    return p;
  };
  Memory.prototype.setByte = function (addr, v, init) {
    addr >>>= 0;
    var p = this.page(addr, true), o = addr & 4095;
    p.d[o] = v & 255;
    p.init[o] = init === false ? 0 : 1;
  };
  Memory.prototype.getByte = function (addr) {
    addr >>>= 0;
    var p = this.page(addr, false), o = addr & 4095;
    if (!p) return { mapped: false };
    return { mapped: true, init: !!p.init[o], v: p.d[o] };
  };

  /* -------------------------- assembling -------------------------- */

  var BRANCH2 = { beq: 1, bne: 1, blt: 1, bgt: 1, ble: 1, bge: 1, bltu: 1, bgtu: 1, bleu: 1, bgeu: 1 };
  var BRANCH1 = { beqz: 1, bnez: 1, bltz: 1, bgtz: 1, blez: 1, bgez: 1, bltzal: 1, bgezal: 1 };
  var ALU3 = { add: 1, addu: 1, sub: 1, subu: 1, and: 1, or: 1, xor: 1, nor: 1, slt: 1, sltu: 1,
    sllv: 1, srlv: 1, srav: 1, mul: 1, rem: 1, remu: 1, seq: 1, sne: 1, sgt: 1, sgtu: 1,
    sge: 1, sgeu: 1, sle: 1, sleu: 1, rol: 1, ror: 1 };
  var ALUI = { addi: 1, addiu: 1, andi: 1, ori: 1, xori: 1, slti: 1, sltiu: 1 };
  var SHIFT = { sll: 1, srl: 1, sra: 1 };
  var MEM = { lw: 1, lh: 1, lhu: 1, lb: 1, lbu: 1, sw: 1, sh: 1, sb: 1, la: 1 };

  function isReg(t) { return /^\$[a-z0-9]+$/i.test(t) && REG[t.slice(1).toLowerCase()] !== undefined; }

  function assemble(src) {
    var lines = String(src).replace(/\r\n?/g, '\n').split('\n');
    var mem = new Memory();
    var labels = {}, consts = {}, instrs = [], dataItems = [];
    var seg = 'text', dataPtr = DATA_BASE;
    var pendingLabels = [];

    function align(n) { while (dataPtr % n) dataPtr++; }
    function constEnv() {
      var env = {};
      Object.keys(consts).forEach(function (k) { if (typeof consts[k] === 'number') env[k] = consts[k]; });
      return env;
    }

    /* Pass 1: lay out labels, collect instructions and data directives. */
    lines.forEach(function (raw, li) {
      var lineNo = li + 1;
      var s = stripComment(raw).trim();
      if (!s) return;
      var m;
      // constant definition: NAME = expr
      if ((m = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/.exec(s))) {
        try { consts[m[1]] = evalExpr(m[2], constEnv(), lineNo); }
        catch (e) { consts[m[1]] = { expr: m[2], line: lineNo }; }
        return;
      }
      // labels (possibly several on one line)
      while ((m = /^([A-Za-z_.][A-Za-z0-9_.]*)\s*:\s*/.exec(s))) {
        var name = m[1];
        if (labels[name] !== undefined) throw new MipsError('label "' + name + '" is defined twice', lineNo);
        labels[name] = null;
        pendingLabels.push(name);
        s = s.slice(m[0].length);
      }
      if (!s) return;
      var sp = s.search(/\s/);
      var op = (sp < 0 ? s : s.slice(0, sp)).toLowerCase();
      var rest = sp < 0 ? '' : s.slice(sp + 1).trim();

      if (op[0] === '.') {
        if (op === '.text') { seg = 'text'; return; }
        if (op === '.data') { seg = 'data'; return; }
        if (op === '.globl' || op === '.global' || op === '.extern' || op === '.set') return;
        if (seg !== 'data') {
          if (/^\.(word|space|asciiz|ascii|byte|half|align)$/.test(op))
            throw new MipsError(op + ' must be in the .data section', lineNo);
          throw new MipsError('unknown directive ' + op, lineNo);
        }
        var size = { '.word': 4, '.half': 2, '.byte': 1 }[op];
        if (op === '.align') align(1 << evalExpr(rest, constEnv(), lineNo));
        else if (size) align(size);
        pendingLabels.forEach(function (l) { labels[l] = dataPtr; });
        pendingLabels = [];
        if (size) {
          splitOperands(rest).forEach(function (tok) {
            var rep = /^(.+?)\s*:\s*(.+)$/.exec(tok);
            var count = 1, valTok = tok;
            if (rep && tok[0] !== "'") { valTok = rep[1]; count = evalExpr(rep[2], constEnv(), lineNo); }
            for (var c = 0; c < count; c++) {
              dataItems.push({ addr: dataPtr, size: size, expr: valTok, line: lineNo });
              dataPtr += size;
            }
          });
        } else if (op === '.asciiz' || op === '.ascii') {
          var bytes = parseString(rest, lineNo);
          if (op === '.asciiz') bytes.push(0);
          bytes.forEach(function (b) { mem.setByte(dataPtr++, b); });
        } else if (op === '.space') {
          var n = evalExpr(rest, constEnv(), lineNo);
          if (n < 0) throw new MipsError('.space needs a non-negative size', lineNo);
          for (var k = 0; k < n; k++) mem.setByte(dataPtr++, 0, false);
        } else if (op !== '.align') {
          throw new MipsError('unsupported directive ' + op, lineNo);
        }
        return;
      }

      if (seg !== 'text') throw new MipsError('instruction "' + op + '" found in the .data section', lineNo);
      pendingLabels.forEach(function (l) { labels[l] = TEXT_BASE + instrs.length * 4; });
      pendingLabels = [];
      instrs.push({ op: op, args: splitOperands(rest), line: lineNo });
    });
    pendingLabels.forEach(function (l) { labels[l] = seg === 'data' ? dataPtr : TEXT_BASE + instrs.length * 4; });

    // constants defined in terms of later constants
    for (var guard = 0; guard < 20; guard++) {
      Object.keys(consts).forEach(function (k) {
        if (typeof consts[k] === 'number') return;
        try { consts[k] = evalExpr(consts[k].expr, constEnv(), consts[k].line); } catch (e) { /* retry */ }
      });
    }
    Object.keys(consts).forEach(function (k) {
      if (typeof consts[k] !== 'number') evalExpr(consts[k].expr, constEnv(), consts[k].line);
    });

    var env = constEnv();
    Object.keys(labels).forEach(function (k) { env[k] = labels[k]; });

    dataItems.forEach(function (it) {
      var v = evalExpr(it.expr, env, it.line);
      for (var b = 0; b < it.size; b++) mem.setByte(it.addr + b, (v >>> (8 * b)) & 255);
    });

    /* Pass 2: decode operands. */
    function reg(t, ins) {
      if (!isReg(t)) throw new MipsError('expected a register, got "' + t + '"', ins.line);
      return REG[t.slice(1).toLowerCase()];
    }
    function imm(t, ins) { return evalExpr(t, env, ins.line); }
    function target(t, ins) {
      if (labels[t] === undefined) {
        if (isReg(t)) throw new MipsError('expected a label, got register ' + t, ins.line);
        throw new MipsError('unknown label "' + t + '"', ins.line);
      }
      return labels[t];
    }
    function memOperand(t, ins) {
      // forms: off($r)  ($r)  label  label+off  label($r)  label+off($r)
      var m = /^(.*?)\(\s*(\$[a-z0-9]+)\s*\)$/i.exec(t);
      if (m) return { base: reg(m[2], ins), off: m[1].trim() ? imm(m[1], ins) : 0 };
      return { base: -1, off: imm(t, ins) };
    }
    function need(ins, n) {
      if (ins.args.length !== n) throw new MipsError(ins.op + ' expects ' + n + ' operand' + (n === 1 ? '' : 's') + ', got ' + ins.args.length, ins.line);
    }
    function regOrImm(ins, t) {
      if (isReg(t)) ins.rt = reg(t, ins); else { ins.rt = -1; ins.imm = imm(t, ins); }
    }

    instrs.forEach(function (ins) {
      var op = ins.op, a = ins.args;
      if (ALU3[op]) {
        need(ins, 3); ins.rd = reg(a[0], ins); ins.rs = reg(a[1], ins); regOrImm(ins, a[2]);
      } else if (ALUI[op]) {
        need(ins, 3); ins.rd = reg(a[0], ins); ins.rs = reg(a[1], ins); ins.imm = imm(a[2], ins);
      } else if (SHIFT[op]) {
        need(ins, 3); ins.rd = reg(a[0], ins); ins.rs = reg(a[1], ins);
        if (isReg(a[2])) ins.rt = reg(a[2], ins); else { ins.rt = -1; ins.imm = imm(a[2], ins) & 31; }
      } else if (MEM[op]) {
        need(ins, 2); ins.rd = reg(a[0], ins);
        var mo = memOperand(a[1], ins);
        ins.base = mo.base; ins.imm = mo.off;
      } else if (BRANCH2[op]) {
        need(ins, 3); ins.rs = reg(a[0], ins); regOrImm(ins, a[1]); ins.target = target(a[2], ins);
      } else if (BRANCH1[op]) {
        need(ins, 2); ins.rs = reg(a[0], ins); ins.target = target(a[1], ins);
      } else if (op === 'li' || op === 'lui') {
        need(ins, 2); ins.rd = reg(a[0], ins); ins.imm = imm(a[1], ins);
      } else if (op === 'move' || op === 'neg' || op === 'negu' || op === 'not' || op === 'abs') {
        need(ins, 2); ins.rd = reg(a[0], ins); ins.rs = reg(a[1], ins);
      } else if (op === 'b' || op === 'j' || op === 'jal') {
        need(ins, 1); ins.target = target(a[0], ins);
      } else if (op === 'jr') {
        need(ins, 1); ins.rs = reg(a[0], ins);
      } else if (op === 'jalr') {
        if (a.length === 1) { ins.rd = 31; ins.rs = reg(a[0], ins); }
        else { need(ins, 2); ins.rd = reg(a[0], ins); ins.rs = reg(a[1], ins); }
      } else if (op === 'mult' || op === 'multu') {
        need(ins, 2); ins.rs = reg(a[0], ins); ins.rt = reg(a[1], ins);
      } else if (op === 'div' || op === 'divu') {
        if (a.length === 2) { ins.rs = reg(a[0], ins); ins.rt = reg(a[1], ins); ins.two = true; }
        else { need(ins, 3); ins.rd = reg(a[0], ins); ins.rs = reg(a[1], ins); regOrImm(ins, a[2]); }
      } else if (op === 'mfhi' || op === 'mflo') {
        need(ins, 1); ins.rd = reg(a[0], ins);
      } else if (op === 'mthi' || op === 'mtlo') {
        need(ins, 1); ins.rs = reg(a[0], ins);
      } else if (op === 'syscall' || op === 'nop' || op === 'break') {
        need(ins, 0);
      } else {
        throw new MipsError('unknown instruction "' + op + '"', ins.line);
      }
    });

    if (labels.main === undefined) throw new MipsError('no main label: the program must define main:', 1);
    if (labels.main < TEXT_BASE || labels.main >= DATA_BASE)
      throw new MipsError('main must label an instruction in the .text section', 1);

    return { instrs: instrs, mem: mem, labels: labels, heap: (dataPtr + 7) & ~7 };
  }

  /* --------------------------- executing --------------------------- */

  function run(src, stdin, opts) {
    opts = opts || {};
    var out = [], steps = 0, curLine = 0;
    function result(e) {
      return { stdout: out.join(''), error: e ? 'error on line ' + e.line + ': ' + e.message : null, line: e ? e.line : null, steps: steps };
    }
    var prog;
    try { prog = assemble(src); } catch (e) {
      if (e instanceof MipsError) return result(e);
      throw e;
    }
    var instrs = prog.instrs, mem = prog.mem, heap = prog.heap;
    var r = new Int32Array(32), set = new Uint8Array(32);
    var hi = 0, lo = 0, hiSet = false, loSet = false;
    /* where each uninitialised register's value came from, for messages */
    var taintFrom = {};
    r[29] = STACK_TOP; r[30] = STACK_TOP; r[28] = 0x10008000; r[31] = KERNEL_RETURN | 0;
    r[4] = 1; r[5] = 0; r[6] = 0;
    [0, 4, 5, 6, 28, 29, 30, 31].forEach(function (i) { set[i] = 1; });

    var input = String(stdin || ''), inPos = 0;
    var maxSteps = opts.maxSteps || DEFAULT_MAX_STEPS;
    var maxOut = opts.maxOutput || 200000, outLen = 0;

    function err(msg) { throw new MipsError(msg, curLine); }
    function get(i) {
      if (!set[i]) {
        if (taintFrom[i] !== undefined)
          err('your program used ' + regName(i) + ', which was loaded from uninitialised memory at address 0x' + hex(taintFrom[i]));
        err('your program tried to read uninitialised register ' + regName(i));
      }
      return r[i];
    }
    function put(i, v) { if (i !== 0) { r[i] = v | 0; set[i] = 1; delete taintFrom[i]; } }
    function emit(s) {
      outLen += s.length;
      if (outLen > maxOut) err('too much output (is there an infinite loop?)');
      out.push(s);
    }
    function checkAlign(addr, size) {
      if (addr % size) err('unaligned ' + (size === 4 ? 'word' : 'half-word') + ' access at address 0x' + hex(addr) +
        ' (the address must be a multiple of ' + size + ')');
    }
    function checkWritable(addr) {
      if (!(addr >= DATA_BASE && addr < 0x7FFFFFFF)) err('your program tried to write to address 0x' + hex(addr) + ', which is not writable (bad pointer?)');
    }
    function readByte(addr) {
      var b = mem.getByte(addr);
      if (!b.mapped) err('your program tried to read from address 0x' + hex(addr) + ', which is not mapped (bad pointer or array index?)');
      return b;
    }
    /* Loading uninitialised memory is not an error by itself (a function
       restoring a saved register does it): the register becomes
       uninitialised, and using it later is the error. */
    function loadInto(rd, addr, size, signed) {
      addr >>>= 0;
      checkAlign(addr, size);
      var v = 0, clean = true;
      for (var b = size - 1; b >= 0; b--) {
        var byte = readByte(addr + b);
        if (!byte.init) clean = false;
        v = (v << 8) | byte.v;
      }
      if (size === 4) v = v | 0;
      else if (signed) v = size === 1 ? (v << 24) >> 24 : (v << 16) >> 16;
      if (rd === 0) return;
      r[rd] = v;
      set[rd] = clean ? 1 : 0;
      if (clean) delete taintFrom[rd]; else taintFrom[rd] = addr;
    }
    function storeFrom(rs, addr, size) {
      addr >>>= 0;
      checkAlign(addr, size);
      checkWritable(addr);
      var v = r[rs], init = !!set[rs];
      for (var b = 0; b < size; b++) mem.setByte(addr + b, (v >>> (8 * b)) & 255, init);
    }
    function readLine() {
      if (inPos >= input.length) return null;
      var nl = input.indexOf('\n', inPos);
      var line = nl < 0 ? input.slice(inPos) : input.slice(inPos, nl + 1);
      inPos += line.length;
      return line;
    }
    function syscall() {
      var code = get(2);
      switch (code) {
        case 1: emit(String(get(4))); break;
        case 4: {
          var a = get(4) >>> 0, s = [], guard = 0;
          for (;;) {
            var b = readByte(a++);
            if (!b.init) err('print_string: the string runs into uninitialised memory (missing 0 terminator?)');
            if (b.v === 0) break;
            s.push(b.v);
            if (++guard > 1e6) err('print_string: no terminating 0 byte');
          }
          emit(bytesToString(s)); break;
        }
        case 5: {
          var line = readLine();
          if (line === null) err('read_int: there is no more input');
          var t = line.trim();
          if (!/^[+-]?\d+$/.test(t)) err('read_int: "' + t + '" is not an integer');
          put(2, parseInt(t, 10)); break;
        }
        case 8: {
          var buf = get(4) >>> 0, len = get(5), i = 0;
          if (len < 1) break;
          while (i < len - 1 && inPos < input.length) {
            var ch = input.charCodeAt(inPos++) & 255;
            checkWritable(buf + i); mem.setByte(buf + i, ch); i++;
            if (ch === 10) break;
          }
          checkWritable(buf + i); mem.setByte(buf + i, 0);
          break;
        }
        case 9: {
          var n = get(4), addr = heap;
          heap = (heap + n + 7) & ~7;
          for (var q = addr; q < heap; q++) mem.setByte(q, 0, false);
          put(2, addr); break;
        }
        case 10: return 'exit';
        case 11: emit(String.fromCharCode(get(4) & 255)); break;
        case 12: put(2, inPos >= input.length ? -1 : input.charCodeAt(inPos++) & 255); break;
        case 17: return 'exit';
        default: err('syscall ' + code + ' is not one mipsy supports here (1 print_int, 4 print_string, 5 read_int, 8 read_string, 9 sbrk, 10 exit, 11 print_char, 12 read_char)');
      }
      return null;
    }
    function addrOf(ins) { return ((ins.base >= 0 ? get(ins.base) : 0) + ins.imm) >>> 0; }
    function u(x) { return x >>> 0; }

    var pc = prog.labels.main;
    try {
      for (;;) {
        if (pc === KERNEL_RETURN) break;
        var idx = (pc - TEXT_BASE) / 4;
        if (idx < 0 || idx >= instrs.length || idx !== Math.floor(idx)) {
          if (idx === instrs.length) err('execution ran off the end of the program (missing jr $ra or exit syscall?)');
          err('jumped to address 0x' + hex(pc) + ', which is not an instruction');
        }
        var ins = instrs[idx];
        curLine = ins.line;
        if (++steps > maxSteps) err('stopped after ' + maxSteps + ' instructions: infinite loop?');
        var next = pc + 4, op = ins.op;
        // operand 3 (register or immediate) is read lazily so unused ones are never checked
        var R = function () { return ins.rt < 0 ? ins.imm : get(ins.rt); };
        switch (op) {
          case 'add': { var s1 = get(ins.rs) + R(); if (s1 !== (s1 | 0)) err('arithmetic overflow in add'); put(ins.rd, s1); break; }
          case 'addi': { var a1 = get(ins.rs) + ins.imm; if (a1 !== (a1 | 0)) err('arithmetic overflow in addi'); put(ins.rd, a1); break; }
          case 'addu': put(ins.rd, get(ins.rs) + R()); break;
          case 'addiu': put(ins.rd, get(ins.rs) + ins.imm); break;
          case 'sub': { var d1 = get(ins.rs) - R(); if (d1 !== (d1 | 0)) err('arithmetic overflow in sub'); put(ins.rd, d1); break; }
          case 'subu': put(ins.rd, get(ins.rs) - R()); break;
          case 'mul': put(ins.rd, Math.imul(get(ins.rs), R())); break;
          case 'and': put(ins.rd, get(ins.rs) & R()); break;
          case 'andi': put(ins.rd, get(ins.rs) & (ins.imm & 0xFFFF)); break;
          case 'or': put(ins.rd, get(ins.rs) | R()); break;
          case 'ori': put(ins.rd, get(ins.rs) | (ins.imm & 0xFFFF)); break;
          case 'xor': put(ins.rd, get(ins.rs) ^ R()); break;
          case 'xori': put(ins.rd, get(ins.rs) ^ (ins.imm & 0xFFFF)); break;
          case 'nor': put(ins.rd, ~(get(ins.rs) | R())); break;
          case 'slt': put(ins.rd, get(ins.rs) < R() ? 1 : 0); break;
          case 'slti': put(ins.rd, get(ins.rs) < ins.imm ? 1 : 0); break;
          case 'sltu': put(ins.rd, u(get(ins.rs)) < u(R()) ? 1 : 0); break;
          case 'sltiu': put(ins.rd, u(get(ins.rs)) < u(ins.imm) ? 1 : 0); break;
          case 'seq': put(ins.rd, get(ins.rs) === R() ? 1 : 0); break;
          case 'sne': put(ins.rd, get(ins.rs) !== R() ? 1 : 0); break;
          case 'sgt': put(ins.rd, get(ins.rs) > R() ? 1 : 0); break;
          case 'sgtu': put(ins.rd, u(get(ins.rs)) > u(R()) ? 1 : 0); break;
          case 'sge': put(ins.rd, get(ins.rs) >= R() ? 1 : 0); break;
          case 'sgeu': put(ins.rd, u(get(ins.rs)) >= u(R()) ? 1 : 0); break;
          case 'sle': put(ins.rd, get(ins.rs) <= R() ? 1 : 0); break;
          case 'sleu': put(ins.rd, u(get(ins.rs)) <= u(R()) ? 1 : 0); break;
          case 'sll': put(ins.rd, get(ins.rs) << (ins.rt < 0 ? ins.imm : get(ins.rt) & 31)); break;
          case 'srl': put(ins.rd, get(ins.rs) >>> (ins.rt < 0 ? ins.imm : get(ins.rt) & 31)); break;
          case 'sra': put(ins.rd, get(ins.rs) >> (ins.rt < 0 ? ins.imm : get(ins.rt) & 31)); break;
          case 'sllv': put(ins.rd, get(ins.rs) << (R() & 31)); break;
          case 'srlv': put(ins.rd, get(ins.rs) >>> (R() & 31)); break;
          case 'srav': put(ins.rd, get(ins.rs) >> (R() & 31)); break;
          case 'rol': { var x = get(ins.rs), n = R() & 31; put(ins.rd, n ? (x << n) | (x >>> (32 - n)) : x); break; }
          case 'ror': { var y = get(ins.rs), m = R() & 31; put(ins.rd, m ? (y >>> m) | (y << (32 - m)) : y); break; }
          case 'div': case 'divu': {
            var nu = get(ins.rs), de = ins.two ? get(ins.rt) : R(), qv, rv;
            if (de === 0) err('division by zero');
            if (op === 'divu') { qv = (u(nu) / u(de)) | 0; rv = (u(nu) % u(de)) | 0; }
            else { qv = (nu / de) | 0; rv = (nu % de) | 0; }
            if (ins.two) { lo = qv; hi = rv; loSet = hiSet = true; } else put(ins.rd, qv);
            break;
          }
          case 'rem': case 'remu': {
            var n2 = get(ins.rs), d2 = R();
            if (d2 === 0) err('division by zero');
            put(ins.rd, op === 'remu' ? (u(n2) % u(d2)) | 0 : (n2 % d2) | 0);
            break;
          }
          case 'mult': case 'multu': {
            var A = op === 'mult' ? get(ins.rs) : u(get(ins.rs));
            var B = op === 'mult' ? get(ins.rt) : u(get(ins.rt));
            var P = BigInt(A) * BigInt(B);
            lo = Number(BigInt.asIntN(32, P)); hi = Number(BigInt.asIntN(32, P >> BigInt(32)));
            loSet = hiSet = true; break;
          }
          case 'mfhi': if (!hiSet) err('your program tried to read hi before any mult or div'); put(ins.rd, hi); break;
          case 'mflo': if (!loSet) err('your program tried to read lo before any mult or div'); put(ins.rd, lo); break;
          case 'mthi': hi = get(ins.rs); hiSet = true; break;
          case 'mtlo': lo = get(ins.rs); loSet = true; break;
          case 'li': put(ins.rd, ins.imm); break;
          case 'lui': put(ins.rd, ins.imm << 16); break;
          case 'la': put(ins.rd, (ins.base >= 0 ? get(ins.base) : 0) + ins.imm); break;
          case 'move': put(ins.rd, get(ins.rs)); break;
          case 'neg': { var ng = get(ins.rs); if (ng === -2147483648) err('arithmetic overflow in neg'); put(ins.rd, -ng); break; }
          case 'negu': put(ins.rd, -get(ins.rs)); break;
          case 'not': put(ins.rd, ~get(ins.rs)); break;
          case 'abs': put(ins.rd, Math.abs(get(ins.rs))); break;
          case 'lw': loadInto(ins.rd, addrOf(ins), 4); break;
          case 'lh': loadInto(ins.rd, addrOf(ins), 2, true); break;
          case 'lhu': loadInto(ins.rd, addrOf(ins), 2, false); break;
          case 'lb': loadInto(ins.rd, addrOf(ins), 1, true); break;
          case 'lbu': loadInto(ins.rd, addrOf(ins), 1, false); break;
          case 'sw': storeFrom(ins.rd, addrOf(ins), 4); break;
          case 'sh': storeFrom(ins.rd, addrOf(ins), 2); break;
          case 'sb': storeFrom(ins.rd, addrOf(ins), 1); break;
          case 'beq': if (get(ins.rs) === R()) next = ins.target; break;
          case 'bne': if (get(ins.rs) !== R()) next = ins.target; break;
          case 'blt': if (get(ins.rs) < R()) next = ins.target; break;
          case 'bgt': if (get(ins.rs) > R()) next = ins.target; break;
          case 'ble': if (get(ins.rs) <= R()) next = ins.target; break;
          case 'bge': if (get(ins.rs) >= R()) next = ins.target; break;
          case 'bltu': if (u(get(ins.rs)) < u(R())) next = ins.target; break;
          case 'bgtu': if (u(get(ins.rs)) > u(R())) next = ins.target; break;
          case 'bleu': if (u(get(ins.rs)) <= u(R())) next = ins.target; break;
          case 'bgeu': if (u(get(ins.rs)) >= u(R())) next = ins.target; break;
          case 'beqz': if (get(ins.rs) === 0) next = ins.target; break;
          case 'bnez': if (get(ins.rs) !== 0) next = ins.target; break;
          case 'bltz': if (get(ins.rs) < 0) next = ins.target; break;
          case 'bgtz': if (get(ins.rs) > 0) next = ins.target; break;
          case 'blez': if (get(ins.rs) <= 0) next = ins.target; break;
          case 'bgez': if (get(ins.rs) >= 0) next = ins.target; break;
          case 'bltzal': if (get(ins.rs) < 0) { put(31, pc + 4); next = ins.target; } break;
          case 'bgezal': if (get(ins.rs) >= 0) { put(31, pc + 4); next = ins.target; } break;
          case 'b': case 'j': next = ins.target; break;
          case 'jal': put(31, pc + 4); next = ins.target; break;
          case 'jr': next = get(ins.rs) >>> 0; break;
          case 'jalr': { var dest = get(ins.rs) >>> 0; put(ins.rd, pc + 4); next = dest; break; }
          case 'syscall': if (syscall() === 'exit') return result(null); break;
          case 'nop': break;
          case 'break': err('break instruction executed'); break;
          default: err('unknown instruction ' + op);
        }
        pc = next;
      }
    } catch (e) {
      if (e instanceof MipsError) return result(e);
      throw e;
    }
    return result(null);
  }

  /* Decode bytes as UTF-8 where valid, so printed strings look right. */
  function bytesToString(bytes) {
    try {
      if (typeof TextDecoder !== 'undefined') return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
    } catch (e) { /* fall through */ }
    return String.fromCharCode.apply(null, bytes);
  }

  /* Run a list of tests: [{stdin, stdout}] -> [{pass, near, got, expected, error}] */
  function test(src, tests, opts) {
    return tests.map(function (t) {
      var res = run(src, t.stdin, opts);
      var pass = !res.error && res.stdout === t.stdout;
      var squash = function (s) { return s.replace(/\s+/g, ' ').trim(); };
      var near = !pass && !res.error && squash(res.stdout) === squash(t.stdout);
      return { pass: pass, near: near, got: res.stdout, expected: t.stdout, error: res.error, stdin: t.stdin, steps: res.steps };
    });
  }

  global.Mips = { run: run, test: test, assemble: assemble };
})(typeof window !== 'undefined' ? window : globalThis);

if (typeof module !== 'undefined') module.exports = (typeof window !== 'undefined' ? window : globalThis).Mips;
