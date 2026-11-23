/* subjects/comp1521.js — COMP1521 Computer Systems Fundamentals, final exam.
   Questions live in comp1521-mips.js and comp1521-c.js (load those first);
   this file turns them into templates, assembles the mock exam, and holds
   the topic primers, drills and the reference drawer.

   Exam shape (26T2): 3 hours plus 10 minutes reading, 10 practical
   questions, easiest first, not equal marks, each a C (.c) or MIPS (.s)
   program in its own file, autotested and hand-checked against the
   question's restrictions. The mock follows the 20T2 paper's order:
     Q1 MIPS basics          Q6 C: files and bytes
     Q2 C: bitwise function  Q7 MIPS arrays and strings
     Q3 MIPS bits/conditions Q8 C: UTF-8, floats, two's complement
     Q4 MIPS loops           Q9 MIPS functions and recursion
     Q5 C: args/env/stat     Q10 C: directories, processes, threads
   The real paper's marks per question are not published; the mock weights
   later (harder) questions more, totalling 100. */
(function (global) {
  'use strict';

  var D = global.COMP1521Data;
  if (!D || !D.MIPS || !D.C) throw new Error('load comp1521-mips.js and comp1521-c.js before comp1521.js');

  var SLOTS = [
    { key: 'q1', name: 'MIPS basics', lang: 'MIPS', marks: 6 },
    { key: 'q2', name: 'Bitwise C functions', lang: 'C', marks: 7 },
    { key: 'q3', name: 'MIPS bits & conditions', lang: 'MIPS', marks: 8 },
    { key: 'q4', name: 'MIPS loops', lang: 'MIPS', marks: 9 },
    { key: 'q5', name: 'Arguments, environment & stat', lang: 'C', marks: 10 },
    { key: 'q6', name: 'Files & bytes', lang: 'C', marks: 10 },
    { key: 'q7', name: 'MIPS arrays & strings', lang: 'MIPS', marks: 11 },
    { key: 'q8', name: 'UTF-8, floats & two\'s complement', lang: 'C', marks: 12 },
    { key: 'q9', name: 'MIPS functions & recursion', lang: 'MIPS', marks: 13 },
    { key: 'q10', name: 'Directories, processes & threads', lang: 'C', marks: 14 }
  ];
  var SLOT = {};
  SLOTS.forEach(function (s, i) { s.n = i + 1; SLOT[s.key] = s; });

  var ITEMS = D.MIPS.map(function (q) { q.lang = 'MIPS'; return q; })
    .concat(D.C.map(function (q) { q.lang = 'C'; return q; }));
  function pool(slotKey) { return ITEMS.filter(function (q) { return q.slot === slotKey; }); }
  var PAST = ITEMS.filter(function (q) { return /^p20-/.test(q.id); })
    .sort(function (a, b) { return SLOT[a.slot].n - SLOT[b.slot].n; });

  /* ------------------------------ helpers ------------------------------ */

  function c(s) { return '<code>' + s + '</code>'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function pre(s) { return '<pre class="code">' + esc(s) + '</pre>'; }
  function ul(items) { return '<ul>' + items.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>'; }
  function gtable(head, rows) {
    return '<table class="gt"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) {
        if (r.group) return '<tr class="grp"><td colspan="' + head.length + '">' + r.group + '</td></tr>';
        return '<tr>' + r.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>';
      }).join('') + '</table>';
  }
  function srcNote(q) { return q.src ? '<p class="small muted">Source: ' + q.src + ' (the past paper you were given).</p>' : ''; }

  /* Draw without repeats until a pool is exhausted, then reshuffle. */
  var decks = {};
  function deal(key, list, rng) {
    if (!decks[key] || !decks[key].length) decks[key] = rng.shuffle(list.map(function (_, i) { return i; }));
    return list[decks[key].pop()];
  }

  /* The example transcript for a MIPS question, built from its tests. */
  function mipsExamples(q) {
    return q.cases.map(function (stdin) {
      var input = stdin.replace(/\n$/, '');
      var out = q.ref(stdin).replace(/\n$/, '');
      return '1521 mipsy ' + q.file + (input ? '\n' + input : '') + (out ? '\n' + out : '');
    }).join('\n\n');
  }

  var C_SKELETON = '#include <stdio.h>\n#include <stdlib.h>\n\nint main(int argc, char *argv[]) {\n\n    return 0;\n}\n';

  /* Turn an item into a question card worth `marks`. */
  function card(q, marks) {
    var s = SLOT[q.slot];
    var restr = q.restrictions || [];
    var intro = q.task + srcNote(q);
    var part;
    if (q.lang === 'MIPS') {
      restr = restr.concat(['Your solution must be in MIPS assembler only.']);
      intro += '<p class="small"><b>Restrictions:</b></p>' + ul(restr);
      part = {
        kind: 'mips', label: '', marks: marks, file: q.file, rows: 20,
        prompt: 'Edit <code>' + q.file + '</code>. Use <b>Run</b> to try your own input and <b>Run autotests</b> as you would <code>1521 autotest</code>. <b>Mark it</b> also runs unseen tests.',
        prefill: q.starter,
        tests: q.cases.map(function (st) { return { stdin: st, stdout: q.ref(st) }; }),
        hidden: q.hidden.map(function (st) { return { stdin: st, stdout: q.ref(st) }; }),
        model: q.model, notes: q.notes,
        checklist: restr.slice(0, -1).concat(q.check || [])
      };
    } else {
      intro += '<p class="small"><b>Restrictions:</b></p>' + ul(restr.length ? restr : ['Your solution must be in C only.']);
      part = {
        kind: 'code', label: '', marks: marks, lang: 'C · ' + q.file, rows: 22,
        prompt: 'Write <code>' + q.file + '</code>. This app can\'t compile C: build it with <code>dcc</code> on CSE (or gcc on any Linux machine), check it against the examples and your own edge cases, then compare with the sample answer.',
        prefill: q.starter || C_SKELETON,
        model: q.model, notes: q.notes,
        checklist: ['Output matches the examples exactly (spacing, newlines, wording)'].concat(restr, q.check || [])
      };
    }
    var data = [];
    if (q.c) data.push({ name: 'C program (equivalent behaviour)', langs: [{ name: q.file.replace(/\.s$/, '.c'), text: q.c }] });
    if (q.files) data.push({ name: 'Provided files', langs: q.files.map(function (f) { return { name: f.name, text: f.text }; }) });
    data.push({ name: 'Examples', langs: [{ name: '', text: q.lang === 'MIPS' ? mipsExamples(q) : q.examples }] });
    return { intro: intro, data: data, parts: [part], item: q, slot: s };
  }

  /* ------------------------------- primers ------------------------------ */

  var SYSCALLS = gtable(['Service', '$v0', 'Arguments', 'Result'], [
    ['print_int', '1', '$a0 = integer', ''],
    ['print_string', '4', '$a0 = address of a 0-terminated string', ''],
    ['read_int', '5', '', '$v0 = integer read'],
    ['read_string', '8', '$a0 = buffer, $a1 = size', 'like fgets: keeps the \\n, adds a 0'],
    ['sbrk', '9', '$a0 = bytes', '$v0 = address (like malloc)'],
    ['exit', '10', '', ''],
    ['print_char', '11', '$a0 = character', ''],
    ['read_char', '12', '', '$v0 = character']
  ]);
  var REGS = gtable(['Register', 'Use', 'Preserved across a call?'], [
    ['$zero', 'always 0', '—'],
    ['$v0, $v1', 'return values; syscall number', 'no'],
    ['$a0–$a3', 'first four arguments', 'no'],
    ['$t0–$t9', 'temporaries', 'no: the callee may overwrite them'],
    ['$s0–$s7', 'saved values', 'yes: a function that uses one must save and restore it'],
    ['$sp', 'stack pointer (stack grows down)', 'yes'],
    ['$ra', 'return address, set by jal', 'no: save it if your function calls anything']
  ]);
  var UTF8_TABLE = gtable(['Code points', 'Bytes', 'Byte 1', 'Byte 2', 'Byte 3', 'Byte 4'], [
    ['U+0000 – U+007F', '1', '0xxxxxxx', '', '', ''],
    ['U+0080 – U+07FF', '2', '110xxxxx', '10xxxxxx', '', ''],
    ['U+0800 – U+FFFF', '3', '1110xxxx', '10xxxxxx', '10xxxxxx', ''],
    ['U+10000 – U+10FFFF', '4', '11110xxx', '10xxxxxx', '10xxxxxx', '10xxxxxx']
  ]);

  var GUIDES = {
    q1: {
      idea: 'Translate the C line by line. Every value lives in a register, every printf becomes one syscall per value or string, and every <code>if</code> becomes a branch on the <i>opposite</i> condition that jumps past the body.',
      steps: [
        'Read: ' + c('li $v0, 5') + ', ' + c('syscall') + ', then ' + c('move $t0, $v0') + ' straight away (the next syscall overwrites $v0).',
        'Compute with ' + c('add/sub/mul/div/rem') + '. mipsy accepts a constant as the third operand: ' + c('mul $t1, $t0, 9') + '.',
        'Print a number with syscall 1, a character with 11 (' + c("li $a0, '\\n'") + '), and a string from .data with 4.',
        'For ' + c('if (a > b) {body}') + ' write ' + c('ble a, b, skip') + ', then the body, then ' + c('skip:') + '.',
        'End main with ' + c('li $v0, 0') + ' and ' + c('jr $ra') + '.'
      ],
      sections: [{ title: 'mipsy syscalls', html: SYSCALLS }],
      worked: '<p>C: ' + c('printf("%d is big\\n", x);') + '</p>' + pre('    .data\nbig_msg: .asciiz " is big\\n"\n    .text\n    move $a0, $t0      # the number\n    li   $v0, 1\n    syscall\n    la   $a0, big_msg  # then the rest of the text\n    li   $v0, 4\n    syscall'),
      traps: [
        'Forgetting the final ' + c('\\n') + ': autotests compare output exactly (a whitespace-only difference costs a little, not everything).',
        'Using $v0 after another syscall: copy read values out of $v0 immediately.',
        'mipsy stops on reading a register you never set. That is usually a typo ($t1 vs $t0).',
        ' ' + c('div $t0, $t1, $t2') + ' truncates towards zero and ' + c('rem') + ' can be negative, both exactly like C.'
      ]
    },
    q2: {
      idea: 'Isolate bits with masks, move them with shifts, combine with OR. Work on <code>uint32_t</code> so every shift is a logical shift.',
      steps: [
        'Test bit k: ' + c('(value >> k) & 1') + '. Set it: ' + c('value | (1u << k)') + '. Clear it: ' + c('value & ~(1u << k)') + '. Flip it: ' + c('value ^ (1u << k)') + '.',
        'A field of w bits starting at bit k: ' + c('(value >> k) & ((1u << w) - 1)') + '.',
        'Byte i: ' + c('(value >> (8 * i)) & 0xFF') + '. You may not use *, so write the shift as a constant (8, 16, 24) or ' + c('i << 3') + '.',
        'Check the edge cases a marker will: 0, 0xFFFFFFFF, the top bit alone (0x80000000), and any shift amount of 0 or 32.'
      ],
      sections: [{ title: 'Undefined behaviour to avoid', html: gtable(['Code', 'Why it is wrong'], [
        [c('x >> 32') + ', ' + c('1u << 32'), 'shifting by the width or more is undefined, not 0'],
        [c('1 << 31'), 'signed overflow: write ' + c('1u << 31')],
        [c('int x; x >> 1'), 'on a negative int this copies the sign bit in: use uint32_t']
      ]) }],
      worked: '<p>Swap the two 16-bit halves:</p>' + pre('uint32_t swap_halves(uint32_t value) {\n    return (value << 16) | (value >> 16);\n}'),
      traps: [
        'Using / * % or library calls when the question bans them: a human marker checks.',
        'Changing main or the prototype in the provided file.',
        'Shifting a signed int: use ' + c('uint32_t') + ' and ' + c('1u') + '.',
        'Returning 42 (the starter value) earns nothing, even if a test happens to pass.'
      ]
    },
    q3: {
      idea: 'MIPS has the same bit operations as C: ' + c('and/or/xor/nor') + ', the immediate forms ' + c('andi/ori/xori') + ', and shifts ' + c('sll/srl/sra') + ' (with v versions for a shift amount in a register).',
      steps: [
        'Mask with ' + c('andi $t1, $t0, 0xFF') + '. andi zero-extends its 16-bit constant; for wider masks, ' + c('li') + ' the mask and use ' + c('and') + '.',
        'Unsigned (logical) right shift is ' + c('srl') + '; ' + c('sra') + ' copies the sign bit. If the C uses uint32_t, use srl.',
        'Shift by a variable amount: ' + c('srlv $t2, $t0, $t1') + ' (mipsy also accepts srl with a register).',
        'Get 0/1 results without branches: ' + c('seq') + ', ' + c('sne') + ', ' + c('slt') + '.',
        'For bit masks, use ' + c('addiu') + '/' + c('addu') + ': they never trap on overflow, but ' + c('addi') + '/' + c('add') + ' do.'
      ],
      worked: '<p>Count the 1 bits (u is unsigned):</p>' + pre('    li   $t1, 0          # count\nloop:\n    beqz $t0, done\n    andi $t2, $t0, 1\n    add  $t1, $t1, $t2\n    srl  $t0, $t0, 1     # srl, not sra\n    b    loop\ndone:'),
      traps: [
        'sra on a negative value never reaches 0, so the loop spins until killed.',
        c('addi') + ' overflows on 0x80000000 − 1 and mipsy stops with an error. Keep C\'s && order (test n &gt; 0 first) or use addiu.',
        'print_int prints signed: 0xFFFF0000 prints as −65536, which is exactly what %d in the C does.'
      ]
    },
    q4: {
      idea: 'A loop is a label, a test that branches <i>out</i>, the body, and a branch back. Write the C loop\'s condition as the exit test at the top.',
      steps: [
        c('while (cond) { body }') + ' → ' + c('loop: branch-if-not-cond to end; body; b loop; end:') + '.',
        c('for (i = 0; i < n; i++)') + ' → initialise before the label, test at the top, ' + c('addi $i, $i, 1') + ' just before ' + c('b loop') + '.',
        'Nested loops: separate labels and registers, and reset the inner counter inside the outer loop.',
        'Put every C variable in its own register and write the mapping in a comment (# $t0 = sum).'
      ],
      worked: pre('# while (sum < 42) { scanf x; sum += x; }\n    li   $t0, 0\nloop:\n    bge  $t0, 42, done   # exit when NOT (sum < 42)\n    li   $v0, 5\n    syscall\n    add  $t0, $t0, $v0\n    b    loop\ndone:'),
      traps: [
        'Off-by-one exit tests: ' + c('<') + ' in C exits on ' + c('bge') + ', ' + c('<=') + ' exits on ' + c('bgt') + '.',
        'Testing x % 2 == 1 for odd fails for negatives (−3 % 2 is −1): test == 0 instead.',
        'A read inside the loop must happen where the C reads, or the final value is processed twice.'
      ]
    },
    q5: {
      idea: 'Small programs over the process\'s environment and the file system\'s metadata: ' + c('argv') + ', ' + c('getenv') + '/' + c('environ') + ', and ' + c('stat') + '.',
      steps: [
        c('getenv("NAME")') + ' returns the value or NULL. Never modify that string; ' + c('strdup') + ' it first if you need to split it.',
        c('extern char **environ;') + ' is a NULL-terminated array of "NAME=value" strings.',
        c('struct stat s; stat(path, &s)') + ' returns 0 on success: then ' + c('s.st_size') + ', ' + c('s.st_mode') + ', ' + c('s.st_mtime') + '.',
        'Type: ' + c('S_ISDIR(s.st_mode)') + ', ' + c('S_ISREG(s.st_mode)') + '. Permissions: ' + c('s.st_mode & S_IRUSR') + ' … ' + c('S_IXOTH') + '. ' + c('lstat') + ' does not follow symbolic links.',
        'Report failures with ' + c('perror(path)') + ' and return a non-zero status.'
      ],
      sections: [{ title: 'Permission bits', html: gtable(['', 'read', 'write', 'execute'], [
        ['owner', c('S_IRUSR') + ' 0400', c('S_IWUSR') + ' 0200', c('S_IXUSR') + ' 0100'],
        ['group', c('S_IRGRP') + ' 0040', c('S_IWGRP') + ' 0020', c('S_IXGRP') + ' 0010'],
        ['other', c('S_IROTH') + ' 0004', c('S_IWOTH') + ' 0002', c('S_IXOTH') + ' 0001']
      ]) }],
      worked: pre('struct stat s;\nif (stat(argv[1], &s) != 0) {\n    perror(argv[1]);\n    return 1;\n}\nprintf("%lld bytes, %s\\n", (long long)s.st_size,\n       S_ISDIR(s.st_mode) ? "directory" : "not a directory");'),
      traps: [
        'strcmp a NULL from getenv: check for NULL first.',
        'Comparing strings with ==, which compares addresses.',
        'Passing a struct stat pointer you never pointed at anything: declare the struct, pass its address.',
        'Printing off_t (st_size) with %d: cast to long long and use %lld.'
      ]
    },
    q6: {
      idea: 'Treat files as streams of bytes: ' + c('fgetc') + '/' + c('fputc') + ' for one at a time, ' + c('fread') + '/' + c('fwrite') + ' for blocks, ' + c('fseek') + '/' + c('ftell') + ' to move around.',
      steps: [
        'Open with ' + c('fopen(name, "rb")') + ' / ' + c('"wb"') + '; check for NULL and perror.',
        'Loop: ' + c('int c; while ((c = fgetc(f)) != EOF)') + '. c must be an int.',
        'Size: ' + c('fseek(f, 0, SEEK_END); long size = ftell(f);') + ' (or stat). Jump: ' + c('fseek(f, pos, SEEK_SET)') + '.',
        'Write binary data with fputc/fwrite, never with string functions: data may contain 0 bytes.',
        'fclose every file you write, or buffered output can be lost.'
      ],
      sections: [{ title: 'fseek whence', html: gtable(['whence', 'offset is measured from'], [
        [c('SEEK_SET'), 'the start of the file'], [c('SEEK_CUR'), 'the current position'], [c('SEEK_END'), 'the end (use a negative offset to go back)']
      ]) }],
      worked: pre('FILE *in = fopen(argv[1], "rb");\nif (in == NULL) {\n    perror(argv[1]);\n    return 1;\n}\nlong count = 0;\nint c;\nwhile ((c = fgetc(in)) != EOF) {\n    if (c >= 128) count++;\n}\nfclose(in);'),
      traps: [
        c('char c = fgetc(f)') + ': byte 0xFF then equals EOF, and bytes ≥ 0x80 go negative.',
        'Reading into a fixed array when the file "may be any size".',
        c('fputs') + ' / ' + c('%s') + ' on binary data stops at the first 0 byte.',
        'Forgetting the final line has no newline, or that a file can be empty.'
      ]
    },
    q7: {
      idea: 'Arrays are blocks of memory in .data. Element i of an int array is at <code>base + i × 4</code>; of a char array, <code>base + i</code>.',
      steps: [
        'Declare: ' + c('numbers: .space 4000') + ' (int[1000]), ' + c('line: .space 256') + ' (char[256]), or ' + c('.word 1, 2, 3') + ' for initial values.',
        'Index: ' + c('mul $t1, $t0, 4') + ' then ' + c('lw $t2, numbers($t1)') + ' (label + register). Bytes: ' + c('lb') + '/' + c('lbu') + '/' + c('sb') + ' with no ×4.',
        '2D ' + c('int m[R][C]') + ': element [r][c] is at offset ' + c('(r * C + c) * 4') + '.',
        'Strings: read_string (syscall 8) behaves like fgets and keeps the newline. Loop until the 0 byte.',
        'Pointer style: ' + c('la $t0, line') + ', then ' + c('lb $t1, ($t0)') + ' and ' + c('addi $t0, $t0, 1') + '.'
      ],
      worked: pre('# numbers[i] = x;   ($t0 = i, $v0 = x)\n    mul  $t1, $t0, 4\n    sw   $v0, numbers($t1)\n# matrix[r][c]       ($t0 = r, $t1 = c, COLS = 4)\n    mul  $t2, $t0, 4      # r * COLS\n    add  $t2, $t2, $t1\n    mul  $t2, $t2, 4      # * sizeof(int)\n    lw   $t3, matrix($t2)'),
      traps: [
        'Forgetting ×4 for ints, or using lw on chars.',
        'Short-circuit order: ' + c('j >= 0 && a[j] > key') + ' must test j first, or you read a[−1].',
        'read_string keeps the \\n: stop at \\n as well as 0 when finding a length.',
        'Reading .space memory before writing it: mipsy reports uninitialised memory.'
      ]
    },
    q8: {
      idea: 'Everything is bits with an agreed meaning. UTF-8 spreads a code point over 1–4 bytes, IEEE 754 splits a float into sign/exponent/fraction, and two\'s complement makes the top bit worth −2ⁿ⁻¹.',
      steps: [
        'UTF-8 lead byte: classify with mask-and-compare: ' + c('(b & 0xE0) == 0xC0') + ' means a 2-byte character. Continuation bytes satisfy ' + c('(b & 0xC0) == 0x80') + '.',
        'Encode: lead prefix | top payload bits, then ' + c('0x80 | ((cp >> 6k) & 0x3F)') + ' for each continuation byte.',
        'Decode: keep the lead\'s payload, then ' + c('cp = (cp << 6) | (b & 0x3F)') + ' for each continuation.',
        'Float bits: ' + c('union { float f; uint32_t u; }') + ' (or memcpy). sign = u >> 31, exponent = (u >> 23) & 0xFF (bias 127), fraction = u & 0x7FFFFF.',
        'n-bit two\'s complement → int: if bit n−1 is set, OR in ' + c('~0u << n') + ' (when n &lt; 32).'
      ],
      sections: [
        { title: 'UTF-8', html: UTF8_TABLE },
        { title: 'IEEE 754 single precision', html: gtable(['Field', 'Bits', 'Meaning'], [
          ['sign', '31', '0 positive, 1 negative'],
          ['exponent', '30–23', 'stored = actual + 127; 0 and 255 are special (zero/denormal, inf/NaN)'],
          ['fraction', '22–0', 'value = (−1)ˢ × 1.fraction × 2^(exponent − 127)']
        ]) }
      ],
      worked: '<p>€ is U+20AC = 0010 0000 1010 1100 (16 bits → 3 bytes):</p>' + pre('1110 0010   10 000010   10 101100\n   0xE2        0x82        0xAC'),
      traps: [
        'Testing one bit (b & 0x40) instead of mask-and-compare can\'t tell 110xxxxx from 1110xxxx.',
        'Reversing or splitting UTF-8 text byte by byte breaks multi-byte characters.',
        'Casting a float to uint32_t converts the value; reinterpret the bits instead.',
        'Masking a signed char without casting to unsigned char first.'
      ]
    },
    q9: {
      idea: 'Functions follow the calling convention: arguments in $a0–$a3, result in $v0, and anything you need after a ' + c('jal') + ' must be in a saved ($s) register or on the stack.',
      steps: [
        'Prologue: ' + c('addi $sp, $sp, -N') + ', then ' + c('sw $ra') + ' and every $s register you will use.',
        'Copy arguments you need later into $s registers (they survive calls; $a and $t do not).',
        'Call: set $a0…, ' + c('jal f') + ', result in $v0.',
        'Epilogue (one exit label, so every path restores): ' + c('lw') + ' them back, ' + c('addi $sp, $sp, N') + ', ' + c('jr $ra') + '.',
        'A leaf function (calls nothing) needs no frame and can use $t registers. main calls things, so main saves $ra.'
      ],
      sections: [{ title: 'Registers and the calling convention', html: REGS }],
      worked: pre('# int sum_to(int n) { if (n == 0) return 0; return n + sum_to(n - 1); }\nsum_to:\n    addi $sp, $sp, -8\n    sw   $ra, 4($sp)\n    sw   $s0, 0($sp)\n    move $s0, $a0          # n is needed after the call\n    li   $v0, 0\n    beqz $s0, sum_to_ret\n    addi $a0, $s0, -1\n    jal  sum_to\n    add  $v0, $v0, $s0\nsum_to_ret:\n    lw   $s0, 0($sp)\n    lw   $ra, 4($sp)\n    addi $sp, $sp, 8\n    jr   $ra'),
      traps: [
        'Keeping a value in $t0 across a jal: it works until the callee uses $t0.',
        'Returning early without restoring $sp and $ra: use a single exit label.',
        'Using a $s register without saving it: the caller\'s value is destroyed (the provided mains check this).',
        'Ignoring "must be recursive" or "must call is_prime": autotests pass, the human marker gives 0.'
      ]
    },
    q10: {
      idea: 'The hardest questions combine system calls: walk a directory tree recursively, run another program connected by a pipe, or split work across threads.',
      steps: [
        'Directories: ' + c('opendir') + ' → loop ' + c('readdir') + ' → ' + c('closedir') + '. Skip "." and "..". d_name is only the last component: build ' + c('path/name') + ' with malloc + sprintf.',
        'Recursion: ' + c('lstat') + ' each child; recurse if ' + c('S_ISDIR') + '. Sort names yourself (collect, then qsort with strcmp) when order matters.',
        'Processes: ' + c('pipe(fds)') + ', a ' + c('posix_spawn_file_actions_t') + ' with adddup2(fds[1], 1) and addclose, ' + c('posix_spawnp') + ', the parent closes fds[1], reads fds[0] to EOF, then ' + c('waitpid') + ' and ' + c('WEXITSTATUS') + '.',
        'Threads: ' + c('pthread_create(&t, NULL, fn, arg)') + ' with fn ' + c('void *fn(void *arg)') + '; give each thread its own argument struct; create all, then ' + c('pthread_join') + ' all.',
        'Shared counters need a ' + c('pthread_mutex_t') + ' (lock/unlock), or avoid sharing by giving each thread its own result slot.'
      ],
      worked: pre('DIR *dir = opendir(path);\nstruct dirent *e;\nwhile ((e = readdir(dir)) != NULL) {\n    if (strcmp(e->d_name, ".") == 0 || strcmp(e->d_name, "..") == 0) continue;\n    char *child = malloc(strlen(path) + strlen(e->d_name) + 2);\n    sprintf(child, "%s/%s", path, e->d_name);\n    struct stat s;\n    if (lstat(child, &s) == 0 && S_ISDIR(s.st_mode)) walk(child);\n    free(child);\n}\nclosedir(dir);'),
      traps: [
        'Not skipping "." and "..", which recurses forever.',
        'Calling stat on d_name alone (it is relative to the wrong directory).',
        'Forgetting to close the parent\'s copy of the pipe\'s write end, so the read never sees EOF.',
        'Passing every thread the address of the same loop variable or struct.',
        'Using system/popen/fork/exec when only posix_spawn is allowed (or nothing is).'
      ]
    }
  };
  GUIDES.past = {
    idea: 'The nine questions from the 20T2 final you were given (questions 9 and 11 were advanced MIPS and are not in the paper). Each also appears in its topic. The MIPS ones run against the original examples plus extra unseen tests.',
    steps: ['Do them in order under time pressure: the real exam also starts easy and gets harder.', 'For C questions, compile on CSE with dcc and run the examples before comparing with the sample answer.'],
    traps: ['Matching only the given examples: the real automarker runs unseen tests, and a human checks the restrictions.']
  };

  /* ------------------------------ templates ----------------------------- */

  var TEMPLATES = SLOTS.map(function (s) {
    return {
      id: s.key, topic: s.name, title: s.name, format: s.lang, guide: GUIDES[s.key],
      build: function (rng) {
        var q = deal(s.key, pool(s.key), rng);
        var cd = card(q, s.marks);
        return { intro: cd.intro, data: cd.data, parts: cd.parts, subtitle: q.title };
      }
    };
  });
  TEMPLATES.push({
    id: 'past', topic: '20T2 past paper', title: '20T2 past paper', guide: GUIDES.past,
    build: function (rng) {
      var q = deal('past', PAST, rng);
      var cd = card(q, SLOT[q.slot].marks);
      cd.parts[0].tpl = q.slot;
      return { intro: cd.intro, data: cd.data, parts: cd.parts, subtitle: q.title };
    }
  });

  function build(templateId, seed) {
    var tpl = null;
    for (var i = 0; i < TEMPLATES.length; i++) if (TEMPLATES[i].id === templateId) tpl = TEMPLATES[i];
    if (!tpl) return null;
    var rng = global.Stats.rng(seed);
    var q = tpl.build(rng);
    q.id = tpl.id; q.topic = tpl.topic;
    q.title = tpl.id === 'past' ? q.subtitle : tpl.title + ': ' + q.subtitle;
    q.marks = q.parts.reduce(function (s, p) { return s + (p.marks || 0); }, 0);
    q.seed = seed;
    return q;
  }

  /* ------------------------------ mock exam ----------------------------- */

  function buildMock() {
    var rng = global.Stats.rng(Math.floor(Math.random() * 1e9));
    return SLOTS.map(function (s) {
      var item = deal('mock-' + s.key, pool(s.key), rng);
      var cd = card(item, s.marks);
      cd.parts.forEach(function (p) { p.topic = s.name; p.tpl = s.key; });
      return {
        id: s.key, topic: s.name, title: item.title, examLabel: 'Q' + s.n, seed: 0,
        intro: cd.intro, data: cd.data, parts: cd.parts, marks: s.marks
      };
    });
  }

  /* -------------------------------- drills ------------------------------ */

  var MIPS_CARDS = [
    { q: 'Read an int into $t0', a: 'li $v0, 5 · syscall · move $t0, $v0', tag: 'Syscalls' },
    { q: 'Print the int in $t0', a: 'move $a0, $t0 · li $v0, 1 · syscall', tag: 'Syscalls' },
    { q: 'Print a newline', a: "li $a0, '\\n' · li $v0, 11 · syscall", tag: 'Syscalls' },
    { q: 'Print a string labelled msg', a: 'la $a0, msg · li $v0, 4 · syscall', alt: 'msg: .asciiz "text\\n" in .data', altLabel: 'declare', tag: 'Syscalls' },
    { q: 'Read a line into buf (256 bytes)', a: 'la $a0, buf · li $a1, 256 · li $v0, 8 · syscall', alt: 'keeps the newline, like fgets', altLabel: 'note', tag: 'Syscalls' },
    { q: 'Read one character', a: 'li $v0, 12 · syscall (char in $v0)', tag: 'Syscalls' },
    { q: 'End main', a: 'li $v0, 0 · jr $ra', alt: 'or li $v0, 10 · syscall', altLabel: 'also', tag: 'Syscalls' },
    { q: 'if (x > y) { … } with x=$t0, y=$t1', a: 'ble $t0, $t1, skip · … · skip:', alt: 'branch on the opposite condition', altLabel: 'why', tag: 'Control flow' },
    { q: 'while (i < n) loop, i=$t0, n=$t1', a: 'loop: bge $t0, $t1, end · body · b loop · end:', tag: 'Control flow' },
    { q: 'for (i = 0; i < 10; i++)', a: 'li $t0, 0 · loop: bge $t0, 10, end · … · addi $t0, $t0, 1 · b loop', tag: 'Control flow' },
    { q: 'x % 2 == 0 test', a: 'rem $t1, $t0, 2 · bnez $t1, odd', alt: 'or andi $t1, $t0, 1', altLabel: 'also', tag: 'Arithmetic' },
    { q: 'Integer division in C vs mipsy', a: 'Both truncate towards zero: −7 / 2 = −3, −7 % 2 = −1', tag: 'Arithmetic' },
    { q: 'Which instructions trap on overflow?', a: 'add, addi, sub (mipsy stops)', alt: 'addu, addiu, subu, mul never trap', altLabel: 'safe', tag: 'Arithmetic' },
    { q: 'Logical vs arithmetic right shift', a: 'srl fills with 0s (unsigned); sra copies the sign bit (signed)', tag: 'Bits' },
    { q: 'Bottom byte of $t0 into $t1', a: 'andi $t1, $t0, 0xFF', tag: 'Bits' },
    { q: 'Shift by a register amount', a: 'sllv / srlv / srav $d, $s, $amount', tag: 'Bits' },
    { q: 'Load numbers[i] (int), i in $t0', a: 'mul $t1, $t0, 4 · lw $t2, numbers($t1)', tag: 'Memory' },
    { q: 'Store a byte to line[i], i in $t0', a: 'sb $t2, line($t0)', alt: 'no ×4 for chars', altLabel: 'note', tag: 'Memory' },
    { q: 'Offset of m[r][c] in int m[R][C]', a: '(r × C + c) × 4', tag: 'Memory' },
    { q: 'Reserve space for int a[100]', a: 'a: .space 400', tag: 'Memory' },
    { q: 'Unsigned vs signed byte load', a: 'lbu zero-extends (0..255); lb sign-extends (−128..127)', tag: 'Memory' },
    { q: 'Function prologue saving $ra and $s0', a: 'addi $sp, $sp, -8 · sw $ra, 4($sp) · sw $s0, 0($sp)', tag: 'Functions' },
    { q: 'Matching epilogue', a: 'lw $s0, 0($sp) · lw $ra, 4($sp) · addi $sp, $sp, 8 · jr $ra', tag: 'Functions' },
    { q: 'Which registers survive a jal?', a: '$s0–$s7, $sp (and $ra only if you saved it)', alt: '$t, $a, $v may all change', altLabel: 'not', tag: 'Functions' },
    { q: 'Why does main save $ra?', a: 'Every jal overwrites $ra; main needs it to return to the code that called main', tag: 'Functions' },
    { q: 'Leaf function', a: 'Calls nothing, so no stack frame needed and $t registers are fine', tag: 'Functions' }
  ];

  var BIT_CARDS = [
    { q: 'Test bit k of x', a: '(x >> k) & 1', tag: 'Idioms' },
    { q: 'Set bit k', a: 'x | (1u << k)', tag: 'Idioms' },
    { q: 'Clear bit k', a: 'x & ~(1u << k)', tag: 'Idioms' },
    { q: 'Toggle bit k', a: 'x ^ (1u << k)', tag: 'Idioms' },
    { q: 'Mask of the low w bits', a: '(1u << w) - 1   (w < 32)', tag: 'Idioms' },
    { q: 'Field of w bits starting at bit k', a: '(x >> k) & ((1u << w) - 1)', tag: 'Idioms' },
    { q: 'Is x a power of two?', a: 'x != 0 && (x & (x - 1)) == 0', tag: 'Idioms' },
    { q: 'Lowest set bit of x', a: 'x & -x', tag: 'Idioms' },
    { q: 'Clear the lowest set bit', a: 'x & (x - 1)', tag: 'Idioms' },
    { q: 'Byte i of x', a: '(x >> (8 * i)) & 0xFF', tag: 'Idioms' },
    { q: 'Hex digit → bits', a: 'Each hex digit is exactly 4 bits: 0xA = 1010', tag: 'Representation' },
    { q: 'Range of an n-bit two\'s complement number', a: '−2ⁿ⁻¹ to 2ⁿ⁻¹ − 1  (8 bits: −128..127)', tag: 'Representation' },
    { q: 'Negate in two\'s complement', a: 'Flip all bits, add 1: −x == ~x + 1', tag: 'Representation' },
    { q: '0xFFFFFFFF as int32_t / uint32_t', a: '−1 / 4294967295', tag: 'Representation' },
    { q: 'Sign-extend an n-bit field', a: 'if bit n−1 set: x |= ~0u << n', tag: 'Representation' },
    { q: 'Little-endian', a: 'Least significant byte at the lowest address (x86, mipsy)', tag: 'Representation' },
    { q: 'Undefined shifts in C', a: 'Shift ≥ width, negative shift, or shifting a 1 into a signed int\'s sign bit', tag: 'Representation' }
  ];

  var SYS_CARDS = [
    { q: 'Read every byte of a file', a: 'int c; while ((c = fgetc(f)) != EOF) { … }', alt: 'c must be int, not char', altLabel: 'why', tag: 'Files' },
    { q: 'File size without reading it', a: 'fseek(f, 0, SEEK_END); long n = ftell(f);', alt: 'or stat(path, &s); s.st_size', altLabel: 'also', tag: 'Files' },
    { q: 'Write raw bytes', a: 'fputc(c, f) or fwrite(buf, 1, n, f)', alt: 'never fputs/%s: they stop at a 0 byte', altLabel: 'trap', tag: 'Files' },
    { q: 'fopen modes', a: '"r" read, "w" truncate/create, "a" append; add "b" for binary', tag: 'Files' },
    { q: 'Get an environment variable', a: 'char *v = getenv("NAME");  NULL if unset', tag: 'Environment' },
    { q: 'All environment variables', a: 'extern char **environ;  "NAME=value" strings, NULL-terminated', tag: 'Environment' },
    { q: 'Is a path a directory?', a: 'stat(path, &s) == 0 && S_ISDIR(s.st_mode)', tag: 'Metadata' },
    { q: 'stat vs lstat', a: 'lstat describes a symbolic link itself; stat follows it', tag: 'Metadata' },
    { q: 'Owner can execute?', a: 's.st_mode & S_IXUSR', tag: 'Metadata' },
    { q: 'Last modification time', a: 's.st_mtime (a time_t)', tag: 'Metadata' },
    { q: 'Create a directory', a: 'mkdir(path, 0755)', tag: 'Metadata' },
    { q: 'List a directory', a: 'opendir → while ((e = readdir(d))) → closedir', alt: 'skip "." and ".."', altLabel: 'trap', tag: 'Directories' },
    { q: 'Child path from a dirent', a: 'sprintf(child, "%s/%s", path, e->d_name)', tag: 'Directories' },
    { q: 'Run a program found on PATH', a: 'posix_spawnp(&pid, argv[0], actions_or_NULL, NULL, argv, environ)', tag: 'Processes' },
    { q: 'Wait for a child and get its exit status', a: 'waitpid(pid, &status, 0); WEXITSTATUS(status)', tag: 'Processes' },
    { q: 'Capture a child\'s stdout', a: 'pipe(fds); adddup2(fds[1], 1); addclose fds[0] and fds[1]; parent closes fds[1], reads fds[0]', tag: 'Processes' },
    { q: 'Why does reading a pipe hang?', a: 'A write end is still open somewhere, usually the parent\'s fds[1]', tag: 'Processes' },
    { q: 'Start a thread', a: 'pthread_create(&tid, NULL, fn, arg);  void *fn(void *arg)', tag: 'Threads' },
    { q: 'Wait for a thread', a: 'pthread_join(tid, &result_or_NULL)', tag: 'Threads' },
    { q: 'Protect a shared counter', a: 'pthread_mutex_lock(&m); counter++; pthread_mutex_unlock(&m);', tag: 'Threads' },
    { q: 'Data race', a: 'Two threads access the same memory, at least one writes, with no synchronisation', tag: 'Threads' }
  ];

  var ENC_CARDS = [
    { q: 'UTF-8 lead byte for 2 / 3 / 4 bytes', a: '110xxxxx / 1110xxxx / 11110xxx', tag: 'UTF-8' },
    { q: 'UTF-8 continuation byte', a: '10xxxxxx: test (b & 0xC0) == 0x80', tag: 'UTF-8' },
    { q: 'Code points per UTF-8 length', a: '1: ≤ 0x7F · 2: ≤ 0x7FF · 3: ≤ 0xFFFF · 4: ≤ 0x10FFFF', tag: 'UTF-8' },
    { q: 'Encode € (U+20AC)', a: 'E2 82 AC', tag: 'UTF-8' },
    { q: 'Is ASCII valid UTF-8?', a: 'Yes: bytes 0x00–0x7F are 1-byte UTF-8', tag: 'UTF-8' },
    { q: 'float layout', a: '1 sign · 8 exponent (bias 127) · 23 fraction', tag: 'Floats' },
    { q: 'double layout', a: '1 sign · 11 exponent (bias 1023) · 52 fraction', tag: 'Floats' },
    { q: 'Value of a normal float', a: '(−1)ˢ × 1.f × 2^(e − 127)', tag: 'Floats' },
    { q: 'Exponent bits all 1', a: 'Infinity (fraction 0) or NaN', tag: 'Floats' },
    { q: 'Exponent bits all 0', a: 'Zero or a denormal: 0.f × 2^−126', tag: 'Floats' },
    { q: '1.0f in hex', a: '0x3F800000', tag: 'Floats' },
    { q: 'Read a float\'s bits', a: 'union { float f; uint32_t u; } or memcpy(&u, &f, 4)', tag: 'Floats' }
  ];

  /* ------------------------------ subject ------------------------------- */

  var SUBJECT = {
    id: 'comp1521',
    code: 'COMP1521',
    name: 'Computer Systems Fundamentals',
    tagline: 'Practical C and MIPS questions in the final exam\'s style. MIPS answers run in the browser.',
    templates: TEMPLATES,
    build: build,
    labels: { guide: 'Topic primer', guideOpen: 'Hide primer', same: 'Another from this topic' },

    mockTest: {
      minutes: 180,
      blurb: 'The final exam\'s shape: <b>10 practical questions in 3 hours</b>, easiest first, alternating MIPS and C in the order of the 20T2 paper (C bitwise, args/env/stat, files, UTF-8, directories/processes/threads; MIPS basics, bits, loops, arrays, functions). ' +
        'Marks rise from 6 to 14 (100 total); the real paper\'s split isn\'t published. MIPS answers can be run and autotested during the test, and are marked on all tests, including unseen ones, when you submit. C answers are self-assessed against the sample. ' +
        'The real exam adds 10 minutes of reading time: take it before you press start.',
      build: buildMock
    },

    drillBlurb: 'MIPS idioms and the calling convention, bit tricks and representation, C file and system calls, UTF-8 and floats.',
    drillSets: [
      { id: 'mips', label: 'MIPS', cards: MIPS_CARDS },
      { id: 'bits', label: 'Bits & representation', cards: BIT_CARDS },
      { id: 'sys', label: 'C files & system calls', cards: SYS_CARDS },
      { id: 'enc', label: 'UTF-8 & floats', cards: ENC_CARDS }
    ],

    reference: {
      title: 'COMP1521 reference',
      blurb: 'mipsy syscalls and registers, MIPS idioms, the C system calls the exam uses, and how answers are marked.',
      fromDrill: 'mips',
      sections: [
        { heading: 'mipsy syscalls', rows: [
          ['1 print_int', '$a0 = integer'], ['4 print_string', '$a0 = address'], ['5 read_int', 'result in $v0'],
          ['8 read_string', '$a0 = buffer, $a1 = size (keeps \\n)'], ['9 sbrk', '$a0 = bytes, address in $v0'],
          ['10 exit', ''], ['11 print_char', '$a0 = char'], ['12 read_char', 'result in $v0']
        ] },
        { heading: 'Registers', rows: [
          ['$v0–$v1', 'results, syscall number'], ['$a0–$a3', 'arguments'], ['$t0–$t9', 'temporaries: not preserved by calls'],
          ['$s0–$s7', 'saved: a function must restore any it uses'], ['$sp', 'stack pointer, grows down'], ['$ra', 'return address (set by jal)']
        ] },
        { heading: 'C system calls & library', rows: [
          ['getenv / environ', 'environment variables'], ['stat / lstat', 'st_size, st_mode (S_ISDIR, S_ISREG, S_IRUSR…), st_mtime'],
          ['fopen / fgetc / fputc / fread / fwrite / fseek / ftell / fclose', 'byte-level file I/O'],
          ['opendir / readdir / closedir', 'list a directory (skip . and ..)'], ['mkdir(path, 0755)', 'create a directory'],
          ['posix_spawnp + pipe + waitpid', 'run a program and read its output'],
          ['pthread_create / pthread_join / mutex', 'threads']
        ] },
        { heading: 'How the exam is marked', rows: [
          ['Automarking', 'Supplied autotests plus unseen tests. Passing the examples does not guarantee marks.'],
          ['Hand marking', 'Answers failing tests are hand-marked; small errors (e.g. whitespace) cost little.'],
          ['Threshold', 'No marks without substantial progress (more than about a third of a solution); none for starter code.'],
          ['Restrictions', 'Every question\'s restrictions are checked by a human: breaking one can mean 0.'],
          ['Style', 'Not marked, but the marker must be able to follow your program.']
        ] }
      ]
    }
  };

  if (global.Subjects) global.Subjects.register(SUBJECT);
  global.COMP1521_SUBJECT = SUBJECT;
})(typeof window !== 'undefined' ? window : globalThis);
