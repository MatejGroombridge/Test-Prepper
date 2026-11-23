/* subjects/comp1521-c.js — C questions for COMP1521.
   C cannot run in the browser, so these are written answers checked against
   a sample solution and the marker's checklist. For the bitwise-function
   questions the example transcript is generated from `ref` (a JavaScript
   model of the function) so the examples are always right.

   Item: { id, slot, title, file, task, files?: [{name, text}], examples,
           restrictions, model, check?, notes?, src? }
   Slots: q2 bitwise functions, q5 argv/env/stat, q6 file bytes,
          q8 encodings (UTF-8, floats, two's complement), q10 directories,
          processes and threads. */
(function (global) {
  'use strict';

  var D = global.COMP1521Data = global.COMP1521Data || {};
  var R = String.raw;
  D.C = [];
  function add(items) { items.forEach(function (it) { D.C.push(it); }); }

  function hex8(n) { return '0x' + ('00000000' + (n >>> 0).toString(16)).slice(-8); }

  var NO_LIBS = [
    'You must use bitwise operators.',
    'You are not permitted to call any functions from the C standard library.',
    'You are not permitted to use division (/), multiplication (*), or modulus (%).',
    'You are not permitted to change the main function you have been given, or the function\'s prototype.'
  ];
  var NO_EXEC = 'You are not permitted to run external programs: no system, popen, posix_spawn, fork or exec.';

  /* A bitwise-function question in the 20T2 style: a provided test file
     calls the function on each command-line argument. */
  function bitFn(o) {
    var argTypes = o.extra ? ', ' + o.extra.type + ' ' + o.extra.name : '';
    var proto = o.ret + ' ' + o.fn + '(uint32_t value' + argTypes + ')';
    var fmt = o.ret === 'uint32_t' ? '0x%08x' : '%d';
    var harness = R`// test_` + o.fn + R`.c — DO NOT CHANGE
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

` + proto + R`;

int main(int argc, char *argv[]) {
` + (o.extra
      ? R`    for (int arg = 1; arg + 1 < argc; arg += 2) {
        uint32_t value = strtoul(argv[arg], NULL, 0);
        ` + o.extra.type + R` ` + o.extra.name + R` = strtol(argv[arg + 1], NULL, 0);
        printf("` + o.fn + R`(0x%08x, %d) returned ` + fmt + R`\n", value, ` + o.extra.name + R`, ` + o.fn + R`(value, ` + o.extra.name + R`));
    }`
      : R`    for (int arg = 1; arg < argc; arg++) {
        uint32_t value = strtoul(argv[arg], NULL, 0);
        printf("` + o.fn + R`(0x%08x) returned ` + fmt + R`\n", value, ` + o.fn + R`(value));
    }`) + R`
    return 0;
}`;
    var starter = R`#include <stdint.h>

` + o.doc + R`
` + proto + R` {
    // PUT YOUR CODE HERE

    return 42;
}
`;
    var lines = ['dcc ' + o.fn + '.c test_' + o.fn + '.c -o ' + o.fn];
    o.args.forEach(function (a) {
      var v = (typeof a === 'object' ? a[0] : a) >>> 0, x = typeof a === 'object' ? a[1] : undefined;
      lines.push('./' + o.fn + ' ' + hex8(v) + (x !== undefined ? ' ' + x : ''));
      var r = o.ref(v, x);
      lines.push(o.fn + '(' + hex8(v) + (x !== undefined ? ', ' + x : '') + ') returned ' + (o.ret === 'uint32_t' ? hex8(r) : String(r | 0)));
    });
    return {
      id: o.id, slot: 'q2', title: o.title, file: o.fn + '.c', src: o.src,
      task: o.task,
      files: [{ name: o.fn + '.c', text: starter }, { name: 'test_' + o.fn + '.c', text: harness }],
      starter: starter,
      examples: lines.join('\n'),
      restrictions: (o.restrictions || []).concat(NO_LIBS),
      model: R`#include <stdint.h>

` + o.doc + R`
` + o.model,
      check: o.check, notes: o.notes, ref: o.ref, fn: o.fn
    };
  }

  /* ========================== Q2: bitwise functions ========================== */

  add([
    bitFn({
      id: 'p20-q2', src: '20T2 final, question 2', fn: 'practice_q2', ret: 'int', title: 'Bottom two bytes equal (C)',
      task: '<p>Add code to <code>practice_q2</code> so that, given a <code>uint32_t</code> value, it returns 1 iff the least significant (bottom) byte of value equals the second least significant byte, and 0 otherwise.</p>',
      doc: R`// given a uint32_t value,
// return 1 iff the least significant (bottom) byte
// is equal to the 2nd least significant byte; and
// return 0 otherwise`,
      ref: function (v) { return (v & 255) === ((v >>> 8) & 255) ? 1 : 0; },
      args: [0, 1, 0x100, 0x101, 0x1212, 0x1213, 0x12345678, 0x12345656, 0x12345634, 0x12345666, 0x12121212, 0x37861212, 0x12121221],
      model: R`int practice_q2(uint32_t value) {
    uint32_t byte0 = value & 0xFF;
    uint32_t byte1 = (value >> 8) & 0xFF;
    return byte0 == byte1;
}
`
    }),
    bitFn({
      id: 'c-parity', fn: 'odd_parity', ret: 'int', title: 'Odd parity without loops',
      task: '<p>Implement <code>odd_parity</code>: return 1 iff <code>value</code> has an odd number of 1 bits. <b>You may not use any loops or recursion</b>, so use a constant number of bitwise operations.</p>',
      doc: R`// return 1 iff value contains an odd number of 1 bits`,
      ref: function (v) { var c = 0; while (v) { c ^= v & 1; v >>>= 1; } return c; },
      args: [0, 1, 3, 7, 0x80000000, 0xFFFFFFFF, 0x12345678, 0x80000001, 0x00010000],
      restrictions: ['You may not use any loops (for, while, do) or recursion.'],
      model: R`int odd_parity(uint32_t value) {
    // fold the word onto itself: each step XORs pairs of bits together,
    // so after 5 steps bit 0 is the XOR of all 32 bits
    value ^= value >> 16;
    value ^= value >> 8;
    value ^= value >> 4;
    value ^= value >> 2;
    value ^= value >> 1;
    return value & 1;
}
`,
      notes: 'XOR of all bits is 1 exactly when the number of 1s is odd. Each fold halves the number of bits still to combine: 32 → 16 → 8 → 4 → 2 → 1.',
      check: ['No loops', 'Uses >> on the unsigned value']
    }),
    bitFn({
      id: 'c-revbytes', fn: 'reverse_bytes', ret: 'uint32_t', title: 'Reverse the byte order',
      task: '<p>Implement <code>reverse_bytes</code>: return <code>value</code> with its four bytes in reverse order, converting between little- and big-endian.</p>',
      doc: R`// return value with its 4 bytes in reverse order
// e.g. 0x12345678 -> 0x78563412`,
      ref: function (v) { return ((v & 255) << 24 | (v >>> 8 & 255) << 16 | (v >>> 16 & 255) << 8 | v >>> 24) >>> 0; },
      args: [0x12345678, 0x000000FF, 0xFF000000, 0x00000000, 0xDEADBEEF, 0x01020304, 0x80000001],
      model: R`uint32_t reverse_bytes(uint32_t value) {
    uint32_t b0 = value & 0xFF;
    uint32_t b1 = (value >> 8) & 0xFF;
    uint32_t b2 = (value >> 16) & 0xFF;
    uint32_t b3 = (value >> 24) & 0xFF;
    return (b0 << 24) | (b1 << 16) | (b2 << 8) | b3;
}
`,
      notes: 'Mask each byte <i>after</i> shifting it down, then shift it into its new place. Use unsigned types throughout: shifting a byte into bit 31 of a signed int is undefined behaviour.'
    }),
    bitFn({
      id: 'c-rotl', fn: 'rotate_left', ret: 'uint32_t', title: 'Rotate left', extra: { type: 'int', name: 'n' },
      task: '<p>Implement <code>rotate_left</code>: return <code>value</code> rotated left by <code>n</code> bits (0 ≤ n ≤ 31). Bits shifted out of the top come back in at the bottom.</p>',
      doc: R`// return value rotated left by n bits, 0 <= n <= 31`,
      ref: function (v, n) { return n ? ((v << n) | (v >>> (32 - n))) >>> 0 : v >>> 0; },
      args: [[0x12345678, 4], [0x12345678, 8], [0x80000000, 1], [0x00000001, 31], [0xF0000000, 4], [0xDEADBEEF, 0], [0xABCDEF01, 16]],
      model: R`uint32_t rotate_left(uint32_t value, int n) {
    if (n == 0) {
        return value;       // value >> 32 would be undefined behaviour
    }
    return (value << n) | (value >> (32 - n));
}
`,
      notes: 'In C, shifting a 32-bit value by 32 or more is <b>undefined</b>, not 0. With n = 0 the naive <code>value &gt;&gt; (32 − n)</code> shifts by 32: on x86 it often returns value unchanged (so the OR still looks right), but it is a bug a marker checks. Test n = 0 explicitly.',
      check: ['Handles n == 0 without shifting by 32']
    }),
    bitFn({
      id: 'c-signext', fn: 'sign_extend', ret: 'int32_t', title: 'Sign-extend an n-bit value', extra: { type: 'int', name: 'bits' },
      task: '<p>Implement <code>sign_extend</code>: the bottom <code>bits</code> bits of <code>value</code> (1 ≤ bits ≤ 32) hold a two\'s complement number. Ignore the other bits and return that number as an <code>int32_t</code>.</p><p>For example the 12-bit pattern 0xFFF is −1, and 0x7FF is 2047.</p>',
      doc: R`// the bottom bits bits of value are a two's complement number:
// return it as an int32_t (1 <= bits <= 32)`,
      ref: function (v, b) { if (b === 32) return v | 0; var m = ((1 << b) >>> 0) - 1; v = (v & m) >>> 0; if (v & (1 << (b - 1))) v = (v | ~m) >>> 0; return v | 0; },
      args: [[0xFFF, 12], [0x7FF, 12], [0x800, 12], [0xABC00F, 4], [0x1, 1], [0x0, 1], [0xFFFFFFFF, 32], [0x12345678, 16], [0x80000000, 31]],
      model: R`int32_t sign_extend(uint32_t value, int bits) {
    if (bits < 32) {
        uint32_t mask = (1u << bits) - 1;       // the bottom bits bits
        value = value & mask;                   // drop the other bits
        uint32_t sign_bit = 1u << (bits - 1);
        if (value & sign_bit) {
            value = value | ~mask;              // negative: copy 1s upwards
        }
    }
    return (int32_t)value;
}
`,
      notes: 'Two steps: mask away the unused high bits, then, if the sign bit of the field is set, fill everything above it with 1s. bits = 32 is its own case because <code>1u &lt;&lt; 32</code> is undefined.'
    }),
    bitFn({
      id: 'c-run', fn: 'longest_run', ret: 'int', title: 'Longest run of 1 bits',
      task: '<p>Implement <code>longest_run</code>: return the length of the longest run of consecutive 1 bits in <code>value</code>.</p>',
      doc: R`// return the length of the longest run of consecutive 1 bits in value`,
      ref: function (v) { var best = 0, cur = 0; for (var i = 0; i < 32; i++) { if (v >>> i & 1) { cur++; if (cur > best) best = cur; } else cur = 0; } return best; },
      args: [0, 1, 0xF0, 0x0F0F00FF, 0xFFFFFFFF, 0x80000001, 0xEFFFFFFE, 0x55555555],
      model: R`int longest_run(uint32_t value) {
    int longest = 0;
    int current = 0;
    for (int i = 0; i < 32; i++) {
        if ((value >> i) & 1) {
            current++;
            if (current > longest) {
                longest = current;
            }
        } else {
            current = 0;
        }
    }
    return longest;
}
`,
      notes: 'A neat alternative: <code>value &amp;= value &lt;&lt; 1</code> shortens every run by one, so the number of times you can do it before value is 0 is the longest run.'
    }),
    bitFn({
      id: 'c-revbits', fn: 'reverse_bits', ret: 'uint32_t', title: 'Mirror all 32 bits',
      task: '<p>Implement <code>reverse_bits</code>: return <code>value</code> with its 32 bits in reverse order, so bit 0 becomes bit 31 and bit 31 becomes bit 0.</p>',
      doc: R`// return value with the order of its 32 bits reversed`,
      ref: function (v) { var r = 0; for (var i = 0; i < 32; i++) r = (r << 1) | (v >>> i & 1); return r >>> 0; },
      args: [0x00000001, 0x80000000, 0x0000000F, 0x12345678, 0xFFFF0000, 0x00000000, 0xA5A5A5A5],
      model: R`uint32_t reverse_bits(uint32_t value) {
    uint32_t result = 0;
    for (int i = 0; i < 32; i++) {
        result = (result << 1) | (value & 1);   // take bits from the bottom...
        value = value >> 1;                     // ...and push them in from the bottom
    }
    return result;
}
`
    })
  ]);

  /* ===================== Q5: arguments, environment, stat ===================== */

  add([
    {
      id: 'p20-q5', slot: 'q5', src: '20T2 final, question 5', title: 'Two environment variables equal', file: 'practice_q5.c',
      task: '<p>Write a C program, <code>practice_q5.c</code>, which takes two names of environment variables as arguments. It should print 1 iff both environment variables are set to the same value. Otherwise, if the values differ or either variable is not set, it should print 0.</p><p>It can assume it is always given 2 arguments, and should always print exactly one line containing only 0 or 1.</p>',
      examples: R`export VAR1=hello
export VAR2=good-bye
export VAR3=hello
unset VAR4
unset VAR5
./practice_q5 VAR1 VAR2
0
./practice_q5 VAR3 VAR1
1
./practice_q5 VAR2 VAR4
0
./practice_q5 VAR4 VAR5
0`,
      restrictions: ['There is no supplied code for this question.', NO_EXEC],
      model: R`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[]) {
    char *value1 = getenv(argv[1]);
    char *value2 = getenv(argv[2]);

    if (value1 != NULL && value2 != NULL && strcmp(value1, value2) == 0) {
        printf("1\n");
    } else {
        printf("0\n");
    }
    return 0;
}
`,
      notes: '<code>getenv</code> returns NULL for an unset variable: check before <code>strcmp</code>, or two unset variables crash the program instead of printing 0. Compare strings with strcmp, not <code>==</code> (that compares addresses).',
      check: ['Checks both getenv results for NULL', 'Uses strcmp, not ==']
    },
    {
      id: 'c-sizes', slot: 'q5', title: 'File sizes and total', file: 'file_sizes.c',
      task: '<p>Write <code>file_sizes.c</code>. It is given one or more pathnames as arguments. For each, print its size in bytes (from <code>stat</code>), then print the total. If a pathname can\'t be accessed, print an error with <code>perror</code> and exit with status 1.</p>',
      examples: R`echo hello world >a.txt
echo -n abc >b.txt
./file_sizes a.txt b.txt
a.txt: 12 bytes
b.txt: 3 bytes
total: 15 bytes
./file_sizes a.txt missing.txt
a.txt: 12 bytes
missing.txt: No such file or directory`,
      restrictions: [NO_EXEC, 'You must not read the files: use stat.'],
      model: R`#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>

int main(int argc, char *argv[]) {
    long long total = 0;
    for (int i = 1; i < argc; i++) {
        struct stat s;
        if (stat(argv[i], &s) != 0) {
            perror(argv[i]);
            return 1;
        }
        printf("%s: %lld bytes\n", argv[i], (long long)s.st_size);
        total += s.st_size;
    }
    printf("total: %lld bytes\n", total);
    return 0;
}
`,
      notes: '<code>st_size</code> is an <code>off_t</code>, which is 64 bits: cast it to <code>long long</code> for <code>%lld</code> (or use <code>%jd</code> with <code>intmax_t</code>). <code>perror(name)</code> prints "name: " followed by the reason, to stderr.'
    },
    {
      id: 'c-perms', slot: 'q5', title: 'Permission strings like ls -l', file: 'permissions.c',
      task: '<p>Write <code>permissions.c</code>. For each pathname argument, print its type and permissions in the same 10-character form as <code>ls -l</code>, then a space and the pathname. The first character is <code>d</code> for a directory and <code>-</code> otherwise. Assume every argument exists.</p>',
      examples: R`touch notes.txt
chmod 640 notes.txt
mkdir tools
chmod 755 tools
echo 'echo hi' >run.sh
chmod 711 run.sh
./permissions notes.txt tools run.sh
-rw-r----- notes.txt
drwxr-xr-x tools
-rwx--x--x run.sh`,
      restrictions: [NO_EXEC],
      model: R`#include <stdio.h>
#include <sys/stat.h>

int main(int argc, char *argv[]) {
    // the nine permission bits in ls order, with their letters
    mode_t bits[] = { S_IRUSR, S_IWUSR, S_IXUSR,
                      S_IRGRP, S_IWGRP, S_IXGRP,
                      S_IROTH, S_IWOTH, S_IXOTH };
    char letters[] = "rwxrwxrwx";

    for (int i = 1; i < argc; i++) {
        struct stat s;
        if (stat(argv[i], &s) != 0) {
            perror(argv[i]);
            return 1;
        }
        char mode[11];
        mode[0] = S_ISDIR(s.st_mode) ? 'd' : '-';
        for (int b = 0; b < 9; b++) {
            mode[b + 1] = (s.st_mode & bits[b]) ? letters[b] : '-';
        }
        mode[10] = '\0';
        printf("%s %s\n", mode, argv[i]);
    }
    return 0;
}
`,
      notes: 'Test each bit with <code>st_mode &amp; S_IRUSR</code> etc. (or shift a 0400 mask right). Use <code>S_ISDIR(st_mode)</code> for the type: do not compare st_mode with a constant, because it holds the permission bits too.'
    },
    {
      id: 'c-which', slot: 'q5', title: 'Find a program on $PATH', file: 'which.c',
      task: '<p>Write <code>which.c</code>, given one program name. Search each directory listed in the <code>PATH</code> environment variable, in order, and print the pathname <code>dir/name</code> of every <b>regular file</b> with that name that the <b>owner can execute</b>. If there are none, print <code>NAME not found</code>.</p><p>PATH is a <code>:</code>-separated list of directories. You may assume it has no empty entries.</p>',
      examples: R`mkdir d1 d2 d3
echo 'echo hi' >d1/hello
chmod 755 d1/hello
echo 'some data' >d2/hello
chmod 644 d2/hello
mkdir d3/hello
PATH=d1:d2:d3 ./which hello
d1/hello
PATH=d3:d2:d1 ./which hello
d1/hello
cp d1/hello d3/hi
PATH=d1:d2:d3 ./which hi
d3/hi
PATH=d1:d2 ./which hi
hi not found`,
      restrictions: [NO_EXEC],
      model: R`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>

int main(int argc, char *argv[]) {
    char *name = argv[1];
    char *path = getenv("PATH");
    int found = 0;

    if (path != NULL) {
        // strtok writes into the string it splits: never give it getenv's
        // string directly, split a copy
        char *copy = strdup(path);
        for (char *dir = strtok(copy, ":"); dir != NULL; dir = strtok(NULL, ":")) {
            int length = strlen(dir) + 1 + strlen(name) + 1;
            char *pathname = malloc(length);
            snprintf(pathname, length, "%s/%s", dir, name);

            struct stat s;
            if (stat(pathname, &s) == 0 && S_ISREG(s.st_mode) && (s.st_mode & S_IXUSR)) {
                printf("%s\n", pathname);
                found = 1;
            }
            free(pathname);
        }
        free(copy);
    }
    if (!found) {
        printf("%s not found\n", name);
    }
    return 0;
}
`,
      notes: 'Three checks per candidate: it exists (stat succeeds), it is a regular file (<code>S_ISREG</code>, so the directory d3/hello is skipped), and the owner-execute bit is set (d2/hello is skipped). Build each pathname with <code>snprintf</code> into a big-enough buffer.',
      check: ['Does not modify the string getenv returned', 'Skips directories and non-executable files']
    },
    {
      id: 'c-newest', slot: 'q5', title: 'Most recently modified', file: 'newest.c',
      task: '<p>Write <code>newest.c</code>. Given one or more pathnames, print the one most recently modified (largest <code>st_mtime</code>). If several share the newest time, print the first of them. Assume every argument exists.</p>',
      examples: R`touch -d '2024-01-01' old.txt
touch -d '2025-06-30' mid.txt
touch -d '2026-03-15' new.txt
./newest old.txt new.txt mid.txt
new.txt
./newest mid.txt old.txt
mid.txt
touch -d '2026-03-15' same.txt
./newest same.txt new.txt
same.txt`,
      restrictions: [NO_EXEC],
      model: R`#include <stdio.h>
#include <sys/stat.h>
#include <time.h>

int main(int argc, char *argv[]) {
    char *newest = NULL;
    time_t newest_time = 0;

    for (int i = 1; i < argc; i++) {
        struct stat s;
        if (stat(argv[i], &s) != 0) {
            perror(argv[i]);
            return 1;
        }
        // strictly greater, so the first of several equal times wins
        if (newest == NULL || s.st_mtime > newest_time) {
            newest = argv[i];
            newest_time = s.st_mtime;
        }
    }
    printf("%s\n", newest);
    return 0;
}
`,
      notes: 'Initialise from the first file (the NULL check), not from time 0, so files dated before 1970 still work. Use <code>&gt;</code>, not <code>&gt;=</code>, to keep the first of equal times.'
    },
    {
      id: 'c-envcount', slot: 'q5', title: 'Count environment values', file: 'count_env.c',
      task: '<p>Write <code>count_env.c</code>, given one string. Print how many environment variables have a <b>value</b> that contains that string. Variable names do not count, and matching is case-sensitive.</p><p>Look at every variable: use <code>environ</code>, not getenv.</p>',
      examples: R`env -i A=apple B=banana C=cherry ./count_env e
2
env -i A=apple B=banana C=cherry ./count_env an
1
env -i HOME=x EDITOR=vim ./count_env E
0
env -i X=aaa ./count_env aa
1`,
      restrictions: [NO_EXEC],
      model: R`#include <stdio.h>
#include <string.h>

extern char **environ;

int main(int argc, char *argv[]) {
    int count = 0;
    for (int i = 0; environ[i] != NULL; i++) {
        // each entry is "NAME=value": search only after the first '='
        char *equals = strchr(environ[i], '=');
        if (equals != NULL && strstr(equals + 1, argv[1]) != NULL) {
            count++;
        }
    }
    printf("%d\n", count);
    return 0;
}
`,
      notes: '<code>environ</code> is a NULL-terminated array of <code>"NAME=value"</code> strings (or use main\'s third parameter, <code>char *envp[]</code>). Searching the whole entry would wrongly count EDITOR when looking for "E".'
    }
  ]);

  /* ============================ Q6: file bytes ============================ */

  add([
    {
      id: 'p20-q6', slot: 'q6', src: '20T2 final, question 6', title: 'Count ASCII bytes', file: 'practice_q6.c',
      task: '<p>Write a C program, <code>practice_q6.c</code>, which takes a single filename as its argument, counts the bytes in the file that are valid ASCII (value 0 to 127 inclusive), and prints one line containing that count in exactly the format below.</p>',
      examples: R`dcc practice_q6.c -o practice_q6
echo hello world >file1
./practice_q6 file1
file1 contains 12 ASCII bytes
echo -e 'hello\xBAworld' >file2
./practice_q6 file2
file2 contains 11 ASCII bytes
echo -n -e '\x80\x81' >file3
./practice_q6 file3
file3 contains 0 ASCII bytes`,
      restrictions: ['There is no supplied code for this question.', NO_EXEC],
      model: R`#include <stdio.h>

int main(int argc, char *argv[]) {
    FILE *stream = fopen(argv[1], "rb");
    if (stream == NULL) {
        perror(argv[1]);
        return 1;
    }

    int count = 0;
    int c;                  // int, not char: it must hold every byte AND EOF
    while ((c = fgetc(stream)) != EOF) {
        if (c <= 127) {
            count++;
        }
    }
    fclose(stream);

    printf("%s contains %d ASCII bytes\n", argv[1], count);
    return 0;
}
`,
      notes: '<code>fgetc</code> returns 0–255 or EOF (−1). Storing it in a <code>char</code> breaks both ways: on most machines char is signed, so 0xBA becomes negative and counts as ASCII, and the byte 0xFF looks like EOF.',
      check: ['c is an int', 'Counts 0..127 inclusive (the NUL byte is ASCII)']
    },
    {
      id: 'c-compare', slot: 'q6', title: 'First differing byte', file: 'compare.c',
      task: '<p>Write <code>compare.c</code>, given two filenames. Read both files byte by byte. If they are identical, print <code>identical</code>. Otherwise print <code>differ at byte N</code>, where N is the 0-based offset of the first difference. If one file is a prefix of the other, the difference is where the shorter file ends.</p>',
      examples: R`echo hello >a
echo hello >b
./compare a b
identical
echo help >c
./compare a c
differ at byte 3
echo -n abc >d
echo -n abcdef >e
./compare d e
differ at byte 3
./compare e d
differ at byte 3
touch empty1 empty2
./compare empty1 empty2
identical`,
      restrictions: [NO_EXEC, 'The files may contain any bytes and may be any size: do not read them into a fixed-size array.'],
      model: R`#include <stdio.h>

int main(int argc, char *argv[]) {
    FILE *f1 = fopen(argv[1], "rb");
    FILE *f2 = fopen(argv[2], "rb");
    if (f1 == NULL || f2 == NULL) {
        perror("fopen");
        return 1;
    }

    long offset = 0;
    while (1) {
        int c1 = fgetc(f1);
        int c2 = fgetc(f2);
        if (c1 != c2) {             // includes one file reaching EOF first
            printf("differ at byte %ld\n", offset);
            break;
        }
        if (c1 == EOF) {            // both ended together
            printf("identical\n");
            break;
        }
        offset++;
    }
    fclose(f1);
    fclose(f2);
    return 0;
}
`,
      notes: 'Comparing the two <code>fgetc</code> results as ints handles end-of-file for free: EOF (−1) never equals a byte (0–255). Check for a difference before checking for EOF.'
    },
    {
      id: 'c-byteat', slot: 'q6', title: 'Bytes at offsets (fseek)', file: 'byte_at.c',
      task: '<p>Write <code>byte_at.c</code>, given a filename and then one or more offsets. For each offset print the byte at that position as two lowercase hex digits. A negative offset counts from the end: −1 is the last byte. Print <code>out of range</code> for an offset outside the file.</p><p>Use <code>fseek</code>: do not read the whole file.</p>',
      examples: R`echo -n ABCDEF >letters
./byte_at letters 0 2 -1 -6
byte 0: 0x41
byte 2: 0x43
byte -1: 0x46
byte -6: 0x41
./byte_at letters 6 -7 5
byte 6: out of range
byte -7: out of range
byte 5: 0x46`,
      restrictions: [NO_EXEC, 'You must use fseek (or lseek) to reach each byte.'],
      model: R`#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    FILE *stream = fopen(argv[1], "rb");
    if (stream == NULL) {
        perror(argv[1]);
        return 1;
    }
    fseek(stream, 0, SEEK_END);
    long size = ftell(stream);

    for (int i = 2; i < argc; i++) {
        long offset = strtol(argv[i], NULL, 10);
        long position = offset >= 0 ? offset : size + offset;
        if (position < 0 || position >= size) {
            printf("byte %ld: out of range\n", offset);
            continue;
        }
        fseek(stream, position, SEEK_SET);
        int c = fgetc(stream);
        printf("byte %ld: 0x%02x\n", offset, c);
    }
    fclose(stream);
    return 0;
}
`,
      notes: 'The file size comes from <code>fseek(f, 0, SEEK_END)</code> then <code>ftell</code> (or from stat). You could also <code>fseek(f, offset, SEEK_END)</code> for negative offsets, but the range check is easier with an absolute position.'
    },
    {
      id: 'c-reverse', slot: 'q6', title: 'Reverse a file', file: 'reverse.c',
      task: '<p>Write <code>reverse.c</code>, given a source and a destination filename. Create the destination containing the bytes of the source in reverse order. The source may be any size and may contain any bytes.</p>',
      examples: R`echo -n hello >in1
./reverse in1 out1
cat out1
olleh
echo hello >in2
./reverse in2 out2
od -c out2
0000000  \n   o   l   l   e   h
0000006
./reverse out2 back
cmp in2 back && echo same
same`,
      restrictions: [NO_EXEC, 'The file may be larger than memory: do not read it all into an array.'],
      model: R`#include <stdio.h>

int main(int argc, char *argv[]) {
    FILE *in = fopen(argv[1], "rb");
    if (in == NULL) {
        perror(argv[1]);
        return 1;
    }
    FILE *out = fopen(argv[2], "wb");
    if (out == NULL) {
        perror(argv[2]);
        return 1;
    }

    fseek(in, 0, SEEK_END);
    long size = ftell(in);

    // walk backwards: seek to each byte from the last to the first
    for (long position = size - 1; position >= 0; position--) {
        fseek(in, position, SEEK_SET);
        int c = fgetc(in);
        fputc(c, out);
    }

    fclose(in);
    fclose(out);
    return 0;
}
`,
      notes: 'One fseek per byte is slow but correct for any size. A faster version reads blocks from the end, reverses each block in memory and writes it. Use <code>fputc</code>/<code>fwrite</code>, never <code>fputs</code> or <code>%s</code>, which stop at a zero byte.'
    },
    {
      id: 'c-xor', slot: 'q6', title: 'Repeating-key XOR', file: 'xor.c',
      task: '<p>Write <code>xor.c</code>, given a key string, a source file and a destination file. Byte i of the destination is byte i of the source XORed with byte <code>i % strlen(key)</code> of the key. Running it twice with the same key gives back the original.</p>',
      examples: R`echo -n Hello >plain
./xor key plain secret
od -An -tx1 secret
 23 00 15 07 0a
./xor key secret again
cat again
Hello`,
      restrictions: [NO_EXEC, 'The files may contain any bytes, including 0, and may be any size.'],
      model: R`#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[]) {
    char *key = argv[1];
    size_t key_length = strlen(key);

    FILE *in = fopen(argv[2], "rb");
    if (in == NULL) {
        perror(argv[2]);
        return 1;
    }
    FILE *out = fopen(argv[3], "wb");
    if (out == NULL) {
        perror(argv[3]);
        return 1;
    }

    long i = 0;
    int c;
    while ((c = fgetc(in)) != EOF) {
        fputc(c ^ (unsigned char)key[i % key_length], out);
        i++;
    }
    fclose(in);
    fclose(out);
    return 0;
}
`,
      notes: 'The output can contain 0 bytes (e ^ e = 0 above), so anything string-based (<code>fputs</code>, <code>%s</code>, <code>strlen</code> on the data) loses bytes. Cast key bytes to <code>unsigned char</code> so a non-ASCII key is not sign-extended.'
    },
    {
      id: 'c-longest', slot: 'q6', title: 'Longest line', file: 'longest_line.c',
      task: '<p>Write <code>longest_line.c</code>, given a filename. Print which line is longest, in bytes, not counting its newline. Lines are numbered from 1, ties go to the first, and the last line counts even without a trailing newline. An empty file has no lines.</p>',
      examples: R`printf 'one\nthree\nfive\n' >f1
./longest_line f1
line 2 is the longest with 5 bytes
printf 'abc\nxyz' >f2
./longest_line f2
line 1 is the longest with 3 bytes
printf '\n\n' >f3
./longest_line f3
line 1 is the longest with 0 bytes
printf '' >f4
./longest_line f4
no lines`,
      restrictions: [NO_EXEC, 'Lines may be any length: do not use a fixed-size line buffer.'],
      model: R`#include <stdio.h>

int main(int argc, char *argv[]) {
    FILE *stream = fopen(argv[1], "rb");
    if (stream == NULL) {
        perror(argv[1]);
        return 1;
    }

    long line = 1, length = 0;
    long best_line = 0, best_length = -1;
    int c, last = '\n';
    while ((c = fgetc(stream)) != EOF) {
        if (c == '\n') {
            if (length > best_length) {
                best_line = line;
                best_length = length;
            }
            line++;
            length = 0;
        } else {
            length++;
        }
        last = c;
    }
    // a final line without a newline still counts
    if (last != '\n' && length > best_length) {
        best_line = line;
        best_length = length;
    }
    fclose(stream);

    if (best_line == 0) {
        printf("no lines\n");
    } else {
        printf("line %ld is the longest with %ld bytes\n", best_line, best_length);
    }
    return 0;
}
`,
      notes: 'Counting bytes with fgetc avoids any line-length limit. Two edge cases are worth checking: a last line with no newline, and an empty file (no lines at all, which is different from one empty line). Initialising best_length to −1 lets an empty line win.'
    }
  ]);

  /* ======================= Q8: UTF-8, floats, two's complement ======================= */

  function utf8Bytes(cp) {
    if (cp < 0x80) return [cp];
    if (cp < 0x800) return [0xC0 | cp >> 6, 0x80 | cp & 63];
    if (cp < 0x10000) return [0xE0 | cp >> 12, 0x80 | cp >> 6 & 63, 0x80 | cp & 63];
    return [0xF0 | cp >> 18, 0x80 | cp >> 12 & 63, 0x80 | cp >> 6 & 63, 0x80 | cp & 63];
  }
  function uplus(cp) { var h = cp.toString(16).toUpperCase(); while (h.length < 4) h = '0' + h; return 'U+' + h; }
  var encodeArgs = [0x24, 0xA2, 0x939, 0x20AC, 0x10348, 0x7F, 0x80, 0x7FF, 0x800, 0xFFFF, 0x10000, 0x10FFFF, 0x110000];
  var encodeTranscript = (function () {
    var first = encodeArgs.slice(0, 5), second = encodeArgs.slice(5);
    function block(list) {
      return ['./utf8_encode ' + list.map(function (c) { return '0x' + c.toString(16).toUpperCase(); }).join(' ')].concat(list.map(function (cp) {
        if (cp > 0x10FFFF) return uplus(cp) + ': invalid code point';
        return uplus(cp) + ': ' + utf8Bytes(cp).map(function (b) { return '0x' + ('0' + b.toString(16)).slice(-2); }).join(' ');
      }));
    }
    return block(first).concat(block(second)).join('\n');
  })();

  add([
    {
      id: 'p20-q8', slot: 'q8', src: '20T2 final, question 8', title: 'Count UTF-8 characters', file: 'practice_q8.c',
      task: '<p>Write a C program, <code>practice_q8.c</code>, which takes a single filename as its argument, counts the UTF-8 characters in the file, and prints one line containing that count.</p>' +
        '<p>If it reads a byte that is not valid UTF-8, it should stop and print an error that includes how many valid characters were read before it. Reaching end of file in the middle of a character is the same error.</p>' +
        '<table class="gt"><tr><th>#bytes</th><th>#bits</th><th>Byte 1</th><th>Byte 2</th><th>Byte 3</th><th>Byte 4</th></tr>' +
        '<tr><td>1</td><td>7</td><td>0xxxxxxx</td><td>-</td><td>-</td><td>-</td></tr><tr><td>2</td><td>11</td><td>110xxxxx</td><td>10xxxxxx</td><td>-</td><td>-</td></tr>' +
        '<tr><td>3</td><td>16</td><td>1110xxxx</td><td>10xxxxxx</td><td>10xxxxxx</td><td>-</td></tr><tr><td>4</td><td>21</td><td>11110xxx</td><td>10xxxxxx</td><td>10xxxxxx</td><td>10xxxxxx</td></tr></table>',
      examples: R`echo hello world >file1
./practice_q8 file1
file1: 12 UTF-8 characters
echo -e -n '\xF0\x90\x8D\x88' >file2
./practice_q8 file2
file2: 1 UTF-8 characters
echo -e -n '\x24\xC2\xA2\xE0\xA4\xB9' >file3
./practice_q8 file3
file3: 3 UTF-8 characters
echo -e -n '\x24\xC2\xA2\xE0\xA4\x09' >file4
./practice_q8 file4
file4: invalid UTF-8 after 2 valid UTF-8 characters
echo -e -n '\x24\xC2\xA2\xE0\xA4' >file5
./practice_q8 file5
file5: invalid UTF-8 after 2 valid UTF-8 characters`,
      restrictions: ['There is no supplied code for this question.', 'Only the specified error checking is required.', NO_EXEC],
      model: R`#include <stdio.h>

int main(int argc, char *argv[]) {
    FILE *stream = fopen(argv[1], "rb");
    if (stream == NULL) {
        perror(argv[1]);
        return 1;
    }

    int count = 0;
    int c;
    while ((c = fgetc(stream)) != EOF) {
        int continuation;               // how many 10xxxxxx bytes follow
        if ((c & 0x80) == 0x00) {
            continuation = 0;           // 0xxxxxxx
        } else if ((c & 0xE0) == 0xC0) {
            continuation = 1;           // 110xxxxx
        } else if ((c & 0xF0) == 0xE0) {
            continuation = 2;           // 1110xxxx
        } else if ((c & 0xF8) == 0xF0) {
            continuation = 3;           // 11110xxx
        } else {
            printf("%s: invalid UTF-8 after %d valid UTF-8 characters\n", argv[1], count);
            return 0;
        }

        for (int i = 0; i < continuation; i++) {
            int next = fgetc(stream);
            if (next == EOF || (next & 0xC0) != 0x80) {
                printf("%s: invalid UTF-8 after %d valid UTF-8 characters\n", argv[1], count);
                return 0;
            }
        }
        count++;
    }
    fclose(stream);
    printf("%s: %d UTF-8 characters\n", argv[1], count);
    return 0;
}
`,
      notes: 'Classify the first byte with a <b>mask and compare</b>: <code>(c &amp; 0xE0) == 0xC0</code> checks the top three bits are 110. Testing a single bit, like <code>c &amp; 0x40</code>, can\'t tell 110xxxxx from 1110xxxx. A stray continuation byte (10xxxxxx) as a first byte is invalid.',
      check: ['Masks the leading bits exactly (0x80/0xE0/0xF0/0xF8)', 'Checks every continuation byte is 10xxxxxx', 'Treats EOF mid-character as invalid']
    },
    {
      id: 'c-encode', slot: 'q8', title: 'Encode code points as UTF-8', file: 'utf8_encode.c',
      task: '<p>Write <code>utf8_encode.c</code>. Each argument is a Unicode code point in hexadecimal. For each, print it as <code>U+</code> with at least 4 uppercase hex digits, then the bytes of its UTF-8 encoding. Code points above 0x10FFFF are invalid.</p>',
      examples: encodeTranscript,
      restrictions: [NO_EXEC, 'You must compute the encoding with bitwise operators.'],
      model: R`#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int main(int argc, char *argv[]) {
    for (int i = 1; i < argc; i++) {
        uint32_t code_point = strtoul(argv[i], NULL, 16);
        printf("U+%04X:", code_point);

        uint8_t bytes[4];
        int n;
        if (code_point < 0x80) {
            bytes[0] = code_point;
            n = 1;
        } else if (code_point < 0x800) {
            bytes[0] = 0xC0 | (code_point >> 6);
            bytes[1] = 0x80 | (code_point & 0x3F);
            n = 2;
        } else if (code_point < 0x10000) {
            bytes[0] = 0xE0 | (code_point >> 12);
            bytes[1] = 0x80 | ((code_point >> 6) & 0x3F);
            bytes[2] = 0x80 | (code_point & 0x3F);
            n = 3;
        } else if (code_point <= 0x10FFFF) {
            bytes[0] = 0xF0 | (code_point >> 18);
            bytes[1] = 0x80 | ((code_point >> 12) & 0x3F);
            bytes[2] = 0x80 | ((code_point >> 6) & 0x3F);
            bytes[3] = 0x80 | (code_point & 0x3F);
            n = 4;
        } else {
            printf(" invalid code point\n");
            continue;
        }
        for (int b = 0; b < n; b++) {
            printf(" 0x%02x", bytes[b]);
        }
        printf("\n");
    }
    return 0;
}
`,
      notes: 'Each continuation byte carries 6 bits: <code>0x80 | ((cp &gt;&gt; 6k) &amp; 0x3F)</code>. The lead byte\'s prefix also says how many bytes follow. Boundary values (0x7F/0x80, 0x7FF/0x800, 0xFFFF/0x10000) are what unseen tests try. <code>strtoul(s, NULL, 16)</code> accepts the 0x prefix.'
    },
    {
      id: 'c-u8rev', slot: 'q8', title: 'Reverse UTF-8 characters', file: 'utf8_reverse.c',
      task: '<p>Write <code>utf8_reverse.c</code>. It reads lines from stdin (each at most 1024 bytes, valid UTF-8) and prints each line with its <b>characters</b> in reverse order. The newline stays at the end. Multi-byte characters must stay intact.</p>',
      examples: R`echo 'héllo wörld' | ./utf8_reverse
dlröw olléh
printf 'a€b\n😀x\nabc\n' | ./utf8_reverse
b€a
x😀
cba`,
      restrictions: [NO_EXEC],
      model: R`#include <stdio.h>
#include <string.h>

#define MAX_LINE 1026

int main(void) {
    char line[MAX_LINE];
    while (fgets(line, MAX_LINE, stdin) != NULL) {
        int end = strlen(line);
        int newline = end > 0 && line[end - 1] == '\n';
        if (newline) {
            end--;
        }

        // walk backwards one character at a time: a character starts at the
        // first byte that is not a continuation byte (10xxxxxx)
        while (end > 0) {
            int start = end - 1;
            while (start > 0 && ((unsigned char)line[start] & 0xC0) == 0x80) {
                start--;
            }
            fwrite(&line[start], 1, end - start, stdout);
            end = start;
        }
        if (newline) {
            putchar('\n');
        }
    }
    return 0;
}
`,
      notes: 'Reversing bytes would scramble multi-byte characters into invalid UTF-8. Going backwards, skip continuation bytes (<code>(b &amp; 0xC0) == 0x80</code>) to find each character\'s first byte. Cast to <code>unsigned char</code> before masking, because char may be signed.'
    },
    {
      id: 'c-float', slot: 'q8', title: 'Pull apart a float', file: 'float_parts.c',
      task: '<p>Write <code>float_parts.c</code>. Each argument is a (normalised, non-zero) number. Convert it with <code>strtof</code> and print its IEEE 754 single-precision fields: the sign bit, the <b>unbiased</b> exponent (stored exponent − 127), and the 23-bit fraction as 6 hex digits.</p>',
      examples: R`./float_parts 1.5 -0.75 1 0.1 100
1.5: sign 0, exponent 0, fraction 0x400000
-0.75: sign 1, exponent -1, fraction 0x400000
1: sign 0, exponent 0, fraction 0x000000
0.1: sign 0, exponent -4, fraction 0x4ccccd
100: sign 0, exponent 6, fraction 0x480000`,
      restrictions: [NO_EXEC, 'You must extract the fields from the float\'s bits with bitwise operators (no frexp or log).'],
      model: R`#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

union float_bits {
    float f;
    uint32_t u;
};

int main(int argc, char *argv[]) {
    for (int i = 1; i < argc; i++) {
        union float_bits bits;
        bits.f = strtof(argv[i], NULL);

        uint32_t sign = bits.u >> 31;
        uint32_t exponent = (bits.u >> 23) & 0xFF;
        uint32_t fraction = bits.u & 0x7FFFFF;

        printf("%s: sign %u, exponent %d, fraction 0x%06x\n",
               argv[i], sign, (int)exponent - 127, fraction);
    }
    return 0;
}
`,
      notes: 'A union (or <code>memcpy</code> into a uint32_t) reinterprets the same 32 bits. Casting <code>(uint32_t)f</code> would <i>convert</i> the value (1.5 → 1) instead. Layout: 1 sign bit, 8 exponent bits with bias 127, 23 fraction bits. 0.1 cannot be represented exactly, so its fraction is rounded (…cccd).'
    },
    {
      id: 'c-twos', slot: 'q8', title: 'Two\'s complement bit strings', file: 'twos.c',
      task: '<p>Write <code>twos.c</code>. Each argument is a string of 1 to 32 binary digits: an n-bit two\'s complement number, where n is the string\'s length. Print its decimal value.</p>',
      examples: R`./twos 0111 1000 11111111 1 0
0111 = 7
1000 = -8
11111111 = -1
1 = -1
0 = 0
./twos 01111111111111111111111111111111 10000000000000000000000000000000 0000000001
01111111111111111111111111111111 = 2147483647
10000000000000000000000000000000 = -2147483648
0000000001 = 1`,
      restrictions: [NO_EXEC, 'You must build the value and sign-extend it with bitwise operators (no strtol with base 2).'],
      model: R`#include <stdio.h>
#include <stdint.h>
#include <string.h>

int main(int argc, char *argv[]) {
    for (int arg = 1; arg < argc; arg++) {
        char *bits = argv[arg];
        int width = strlen(bits);

        uint32_t value = 0;
        for (int i = 0; i < width; i++) {
            value = (value << 1) | (bits[i] - '0');
        }

        // if the top bit of the n-bit field is set, the number is negative:
        // fill every bit above the field with 1s
        if (width < 32 && (value & (1u << (width - 1)))) {
            value = value | (~0u << width);
        }
        printf("%s = %d\n", bits, (int32_t)value);
    }
    return 0;
}
`,
      notes: 'An n-bit pattern with its top bit set means value − 2ⁿ. Sign extension does that by filling the higher bits with 1s. At width 32 there is nothing to fill, and <code>~0u &lt;&lt; 32</code> would be undefined, hence the width &lt; 32 guard.'
    },
    {
      id: 'c-decode', slot: 'q8', title: 'Decode UTF-8 to code points', file: 'codepoints.c',
      task: '<p>Write <code>codepoints.c</code>, given a filename of valid UTF-8 text. Print the Unicode code point of every character, one per line, as <code>U+</code> followed by at least 4 uppercase hex digits.</p>',
      examples: R`printf 'A\xc2\xa2\xe2\x82\xac\xf0\x9f\x98\x80' >chars
./codepoints chars
U+0041
U+00A2
U+20AC
U+1F600
echo hi >two
./codepoints two
U+0068
U+0069
U+000A`,
      restrictions: [NO_EXEC, 'You must decode with bitwise operators.'],
      model: R`#include <stdio.h>
#include <stdint.h>

int main(int argc, char *argv[]) {
    FILE *stream = fopen(argv[1], "rb");
    if (stream == NULL) {
        perror(argv[1]);
        return 1;
    }

    int c;
    while ((c = fgetc(stream)) != EOF) {
        uint32_t code_point;
        int continuation;
        if ((c & 0x80) == 0) {
            code_point = c;
            continuation = 0;
        } else if ((c & 0xE0) == 0xC0) {
            code_point = c & 0x1F;          // 5 payload bits
            continuation = 1;
        } else if ((c & 0xF0) == 0xE0) {
            code_point = c & 0x0F;          // 4 payload bits
            continuation = 2;
        } else {
            code_point = c & 0x07;          // 3 payload bits
            continuation = 3;
        }
        for (int i = 0; i < continuation; i++) {
            int next = fgetc(stream);
            code_point = (code_point << 6) | (next & 0x3F);
        }
        printf("U+%04X\n", code_point);
    }
    fclose(stream);
    return 0;
}
`,
      notes: 'Decoding is encoding backwards: keep the payload bits of the lead byte, then for each continuation byte shift left 6 and OR in its low 6 bits. <code>%04X</code> pads to 4 digits but prints more when needed (1F600).'
    }
  ]);

  /* ================== Q10: directories, processes, threads ================== */

  add([
    {
      id: 'p20-q10', slot: 'q10', src: '20T2 final, question 10', title: 'Save and restore a directory tree', file: 'practice_q10.c',
      task: '<p>Write a C program, <code>practice_q10.c</code>, given 1 or 2 arguments.</p>' +
        '<p>With 2 arguments, the first is the pathname of a file to create and the second is a directory: save the entire directory tree into that file. With 1 argument, it is a file holding a saved tree: re-create all its directories and files (relative to the current directory).</p>' +
        '<p>The tree contains only directories and regular files (no links), at most 10000 of them, at most 1000 levels deep. Files may contain any bytes and be any size. You need not save permissions or times. You may choose any format for the saved file, and you may assume nothing being restored already exists.</p>',
      examples: R`mkdir -p a/b/c
echo hello andrew >a/file1
echo bye andrew >a/b/file2
echo 1 >a/b/c/one
echo 2 >a/b/c/two
dcc practice_q10.c -o practice_q10
./practice_q10 data a
rm -rf a
./practice_q10 data
cat a/file1
hello andrew
cat a/b/file2
bye andrew
mkdir new_directory
cd new_directory
../practice_q10 ../data
cat a/b/c/two
2`,
      restrictions: ['Your solution must be in C only.', NO_EXEC, 'You may only use the default C libraries (no -l flags).'],
      model: R`#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <dirent.h>
#include <sys/stat.h>

// Saved format, one record per directory or file, parents before children:
//   'd' <uint32 path length> <path bytes>
//   'f' <uint32 path length> <path bytes> <uint64 size> <size bytes of content>

static void write_header(FILE *out, char type, const char *path) {
    uint32_t length = strlen(path);
    fputc(type, out);
    fwrite(&length, sizeof length, 1, out);
    fwrite(path, 1, length, out);
}

static void copy_bytes(FILE *from, FILE *to, uint64_t size) {
    char buffer[4096];
    while (size > 0) {
        size_t want = size < sizeof buffer ? size : sizeof buffer;
        size_t got = fread(buffer, 1, want, from);
        if (got == 0) {
            break;
        }
        fwrite(buffer, 1, got, to);
        size -= got;
    }
}

static char *join(const char *dir, const char *name) {
    char *path = malloc(strlen(dir) + 1 + strlen(name) + 1);
    sprintf(path, "%s/%s", dir, name);
    return path;
}

static void save(FILE *out, const char *path) {
    struct stat s;
    if (lstat(path, &s) != 0) {
        perror(path);
        exit(1);
    }

    if (S_ISREG(s.st_mode)) {
        write_header(out, 'f', path);
        uint64_t size = s.st_size;
        fwrite(&size, sizeof size, 1, out);
        FILE *in = fopen(path, "rb");
        copy_bytes(in, out, size);
        fclose(in);
        return;
    }

    write_header(out, 'd', path);

    // Read every name first and close the directory before recursing, so a
    // 1000-deep tree never has 1000 directories open at once.
    DIR *dir = opendir(path);
    char **names = NULL;
    int n = 0;
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0) {
            continue;
        }
        names = realloc(names, (n + 1) * sizeof *names);
        names[n++] = strdup(entry->d_name);
    }
    closedir(dir);

    for (int i = 0; i < n; i++) {
        char *child = join(path, names[i]);
        save(out, child);
        free(child);
        free(names[i]);
    }
    free(names);
}

static void restore(FILE *in) {
    int type;
    while ((type = fgetc(in)) != EOF) {
        uint32_t length;
        fread(&length, sizeof length, 1, in);
        char *path = malloc(length + 1);
        fread(path, 1, length, in);
        path[length] = '\0';

        if (type == 'd') {
            mkdir(path, 0755);
        } else {
            uint64_t size;
            fread(&size, sizeof size, 1, in);
            FILE *out = fopen(path, "wb");
            copy_bytes(in, out, size);
            fclose(out);
        }
        free(path);
    }
}

int main(int argc, char *argv[]) {
    if (argc == 3) {
        FILE *out = fopen(argv[1], "wb");
        save(out, argv[2]);
        fclose(out);
    } else {
        FILE *in = fopen(argv[1], "rb");
        restore(in);
        fclose(in);
    }
    return 0;
}
`,
      notes: 'The format decisions that matter: store each path\'s <b>length</b> before it (names can contain any byte except / and 0), store each file\'s size before its content (content can contain anything, including your record markers), and write directories before their contents so <code>mkdir</code> happens first. Pathnames are stored as given, so restoring elsewhere just works.',
      check: ['Handles binary content (fread/fwrite with explicit sizes)', 'Skips . and ..', 'Recurses into subdirectories', 'Directories are created before their contents']
    },
    {
      id: 'c-du', slot: 'q10', title: 'Total size of a tree', file: 'tree_size.c',
      task: '<p>Write <code>tree_size.c</code>, given a directory. Recursively find every regular file below it and print how many there are and their total size in bytes. Ignore anything that is neither a directory nor a regular file (symbolic links included).</p>',
      examples: R`mkdir -p t/x/y
echo hello >t/a
echo -n 12345678 >t/x/b
echo >t/x/y/c
./tree_size t
3 files, 15 bytes
mkdir empty
./tree_size empty
0 files, 0 bytes`,
      restrictions: [NO_EXEC, 'You must not use nftw or ftw: walk the tree with opendir/readdir.'],
      model: R`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <sys/stat.h>

static long long files = 0;
static long long bytes = 0;

static void walk(const char *path) {
    DIR *dir = opendir(path);
    if (dir == NULL) {
        perror(path);
        return;
    }
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0) {
            continue;       // without this, the walk never ends
        }
        char *child = malloc(strlen(path) + strlen(entry->d_name) + 2);
        sprintf(child, "%s/%s", path, entry->d_name);

        struct stat s;
        if (lstat(child, &s) == 0) {        // lstat: do not follow links
            if (S_ISDIR(s.st_mode)) {
                walk(child);
            } else if (S_ISREG(s.st_mode)) {
                files++;
                bytes += s.st_size;
            }
        }
        free(child);
    }
    closedir(dir);
}

int main(int argc, char *argv[]) {
    walk(argv[1]);
    printf("%lld files, %lld bytes\n", files, bytes);
    return 0;
}
`,
      notes: '<code>d_name</code> is only the last component: stat must be given <code>path/name</code>. Skipping "." and ".." is essential. <code>lstat</code> reports a link as a link, so links are neither followed nor counted.',
      check: ['Builds path/name before calling stat', 'Skips . and ..', 'Uses lstat (links are not followed)']
    },
    {
      id: 'c-largest', slot: 'q10', title: 'Largest file in a tree', file: 'largest.c',
      task: '<p>Write <code>largest.c</code>, given a directory. Print the pathname and size of the largest regular file anywhere below it. If several are equally largest, print the one whose pathname is smallest by <code>strcmp</code>. If there are no regular files, print <code>no files</code>.</p>',
      examples: R`mkdir -p t/x/y
echo hello >t/a
echo -n 12345678 >t/x/b
echo >t/x/y/c
./largest t
t/x/b 8
echo -n abcdefgh >t/0
./largest t
t/0 8
mkdir empty
./largest empty
no files`,
      restrictions: [NO_EXEC],
      model: R`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <sys/stat.h>

static char *best_path = NULL;
static long long best_size = -1;

static void walk(const char *path) {
    DIR *dir = opendir(path);
    if (dir == NULL) {
        perror(path);
        return;
    }
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0) {
            continue;
        }
        char *child = malloc(strlen(path) + strlen(entry->d_name) + 2);
        sprintf(child, "%s/%s", path, entry->d_name);

        struct stat s;
        if (lstat(child, &s) == 0) {
            if (S_ISDIR(s.st_mode)) {
                walk(child);
            } else if (S_ISREG(s.st_mode)) {
                long long size = s.st_size;
                if (size > best_size || (size == best_size && strcmp(child, best_path) < 0)) {
                    free(best_path);
                    best_path = strdup(child);      // child is freed below: keep a copy
                    best_size = size;
                }
            }
        }
        free(child);
    }
    closedir(dir);
}

int main(int argc, char *argv[]) {
    walk(argv[1]);
    if (best_path == NULL) {
        printf("no files\n");
    } else {
        printf("%s %lld\n", best_path, best_size);
        free(best_path);
    }
    return 0;
}
`,
      notes: 'readdir returns entries in no particular order, so a tie-break rule is needed for the output to be deterministic. Keep a <b>copy</b> of the best pathname (strdup): storing the pointer to a buffer you free or reuse is a classic dangling-pointer bug.'
    },
    {
      id: 'c-tree', slot: 'q10', title: 'Print a sorted tree', file: 'print_tree.c',
      task: '<p>Write <code>print_tree.c</code>, given a directory name (without a trailing slash). Print the directory, then everything below it, indented 4 spaces per level. At each level, entries are sorted by name with <code>strcmp</code>, and directories are shown with a trailing <code>/</code>.</p>',
      examples: R`mkdir -p t/x/y t/B
echo hello >t/a
echo -n 12345678 >t/x/b
echo >t/x/y/c
./print_tree t
t/
    B/
    a
    x/
        b
        y/
            c`,
      restrictions: [NO_EXEC, 'You must not use nftw, ftw or scandir: read each directory with readdir and sort it yourself (qsort is fine).'],
      model: R`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <sys/stat.h>

static int compare_names(const void *a, const void *b) {
    return strcmp(*(char *const *)a, *(char *const *)b);
}

static void print_dir(const char *path, int depth) {
    DIR *dir = opendir(path);
    if (dir == NULL) {
        perror(path);
        return;
    }
    char **names = NULL;
    int n = 0;
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0) {
            continue;
        }
        names = realloc(names, (n + 1) * sizeof *names);
        names[n++] = strdup(entry->d_name);
    }
    closedir(dir);

    qsort(names, n, sizeof *names, compare_names);

    for (int i = 0; i < n; i++) {
        char *child = malloc(strlen(path) + strlen(names[i]) + 2);
        sprintf(child, "%s/%s", path, names[i]);

        struct stat s;
        int is_dir = lstat(child, &s) == 0 && S_ISDIR(s.st_mode);
        printf("%*s%s%s\n", 4 * depth, "", names[i], is_dir ? "/" : "");
        if (is_dir) {
            print_dir(child, depth + 1);
        }
        free(child);
        free(names[i]);
    }
    free(names);
}

int main(int argc, char *argv[]) {
    printf("%s/\n", argv[1]);
    print_dir(argv[1], 1);
    return 0;
}
`,
      notes: 'qsort sorts an array of <code>char *</code>, so the comparison function receives pointers <i>to</i> those pointers. <code>%*s</code> with an empty string prints a given number of spaces. strcmp puts uppercase before lowercase (B before a).',
      check: ['Sorts with strcmp (qsort comparator dereferences char **)', 'Indents 4 spaces per level']
    },
    {
      id: 'c-spawn', slot: 'q10', title: 'Run a command and count its lines', file: 'count_output.c',
      task: '<p>Write <code>count_output.c</code>. Its arguments are a command and that command\'s arguments. Run the command (searching PATH) with its standard output connected to a pipe. Count the newline characters it writes, wait for it to finish, then print the count and its exit status.</p><p><b>For this question</b> you may use <code>posix_spawnp</code> and <code>pipe</code>, but not system, popen, fork or exec.</p>',
      examples: R`./count_output echo hello
1 lines, exit status 0
./count_output seq 5
5 lines, exit status 0
./count_output printf 'a\nb'
1 lines, exit status 0
./count_output ls /no/such/dir
ls: cannot access '/no/such/dir': No such file or directory
0 lines, exit status 2`,
      restrictions: ['You may use posix_spawn or posix_spawnp. You must not use system, popen, fork or exec.'],
      model: R`#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <spawn.h>
#include <sys/wait.h>

extern char **environ;

int main(int argc, char *argv[]) {
    int pipe_fds[2];
    if (pipe(pipe_fds) != 0) {
        perror("pipe");
        return 1;
    }

    // in the child: stdout becomes the pipe's write end; close the read end
    posix_spawn_file_actions_t actions;
    posix_spawn_file_actions_init(&actions);
    posix_spawn_file_actions_addclose(&actions, pipe_fds[0]);
    posix_spawn_file_actions_adddup2(&actions, pipe_fds[1], STDOUT_FILENO);
    posix_spawn_file_actions_addclose(&actions, pipe_fds[1]);

    pid_t pid;
    if (posix_spawnp(&pid, argv[1], &actions, NULL, &argv[1], environ) != 0) {
        perror("posix_spawnp");
        return 1;
    }
    posix_spawn_file_actions_destroy(&actions);

    // the parent must close its copy of the write end, or the read below
    // never sees end-of-file
    close(pipe_fds[1]);

    FILE *output = fdopen(pipe_fds[0], "r");
    int lines = 0;
    int c;
    while ((c = fgetc(output)) != EOF) {
        if (c == '\n') {
            lines++;
        }
    }
    fclose(output);

    int status;
    waitpid(pid, &status, 0);
    printf("%d lines, exit status %d\n", lines, WEXITSTATUS(status));
    return 0;
}
`,
      notes: 'The most common bug is forgetting to close the parent\'s write end. EOF on a pipe only arrives when <i>every</i> write end is closed, so the program hangs forever. <code>&amp;argv[1]</code> is already a NULL-terminated argument array for the child. Read the output <i>before</i> waitpid, or a command with lots of output fills the pipe and both processes wait forever.',
      check: ['Closes the write end in the parent', 'Reads all output before waitpid', 'Uses WEXITSTATUS on the wait status']
    },
    {
      id: 'c-threads', slot: 'q10', title: 'Count primes with threads', file: 'count_primes.c',
      task: '<p>Write <code>count_primes.c</code>, given a limit L and a thread count T (1 ≤ T ≤ 64). Count the primes below L using T threads that run concurrently. Split [0, L) into T contiguous ranges, one per thread, then combine the counts.</p>',
      examples: R`./count_primes 100 4
25 primes below 100
./count_primes 100 1
25 primes below 100
./count_primes 1000000 8
78498 primes below 1000000
./count_primes 2 3
0 primes below 2`,
      restrictions: [NO_EXEC, 'You must use pthreads, with all T threads created before any is joined.', 'Threads must not update a shared counter without synchronisation.'],
      model: R`#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

struct range {
    long start;     // inclusive
    long end;       // exclusive
    long count;     // result, written only by this range's thread
};

static int is_prime(long n) {
    if (n < 2) {
        return 0;
    }
    for (long d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            return 0;
        }
    }
    return 1;
}

static void *count_range(void *argument) {
    struct range *r = argument;
    r->count = 0;
    for (long n = r->start; n < r->end; n++) {
        r->count += is_prime(n);
    }
    return NULL;
}

int main(int argc, char *argv[]) {
    long limit = strtol(argv[1], NULL, 10);
    int n_threads = strtol(argv[2], NULL, 10);

    pthread_t threads[64];
    struct range ranges[64];
    long chunk = limit / n_threads;

    for (int i = 0; i < n_threads; i++) {
        ranges[i].start = i * chunk;
        ranges[i].end = (i == n_threads - 1) ? limit : (i + 1) * chunk;  // last takes the rest
        pthread_create(&threads[i], NULL, count_range, &ranges[i]);
    }

    long total = 0;
    for (int i = 0; i < n_threads; i++) {
        pthread_join(threads[i], NULL);
        total += ranges[i].count;   // safe: the thread has finished
    }
    printf("%ld primes below %ld\n", total, limit);
    return 0;
}
`,
      notes: 'Give each thread its <b>own</b> struct (an array of them, not one reused variable whose address every thread sees) and its own result field. That way there is no shared counter and no lock is needed. Creating and joining in the same loop runs the threads one after another, which defeats the point. The last range must take the remainder when L is not divisible by T.',
      check: ['Each thread gets its own argument struct', 'All threads created before joining', 'Last range covers the remainder']
    }
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
