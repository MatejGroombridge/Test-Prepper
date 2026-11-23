/* subjects/comp1521-mips.js — MIPS questions for COMP1521.
   Each item becomes a runnable question: the student edits the starter file
   and it is autotested in the browser by js/mips.js. Expected output is
   computed by `ref` (a JavaScript model of the C program), not copied from
   the sample answer, so a wrong sample answer fails the build check.

   Item: { id, slot, title, file, task, c, starter, ref(stdin) -> stdout,
           cases: [stdin], hidden: [stdin], restrictions?, model, check?, notes?, src? }
   Slots follow the exam's order: q1 basics, q3 bits & conditions, q4 loops,
   q7 arrays & strings, q9 functions & recursion. */
(function (global) {
  'use strict';

  var D = global.COMP1521Data = global.COMP1521Data || {};
  var R = String.raw;
  D.MIPS = [];

  function ints(stdin) {
    return stdin.split('\n').filter(function (l) { return l.trim() !== ''; }).map(function (l) { return parseInt(l, 10); });
  }
  function lines(stdin) { return stdin.split('\n'); }
  function trunc(a, b) { return (a / b) | 0; }
  function cmod(a, b) { return a % b; }

  /* The usual exam starter: reads one number and prints it. */
  function readPrint(comment) {
    return R`# ` + comment + R`

main:
    li   $v0, 5         #   scanf("%d", &x);
    syscall             #
    move $t0, $v0

    move $a0, $t0       #   printf("%d\n", x);
    li   $v0, 1
    syscall

    li   $a0, '\n'      #   printf("%c", '\n');
    li   $v0, 11
    syscall

    li   $v0, 0         #   return 0
    jr   $ra
`;
  }

  function add(items) { items.forEach(function (it) { D.MIPS.push(it); }); }

  /* ================================ Q1: basics ================================ */

  add([
    {
      id: 'p20-q1', slot: 'q1', src: '20T2 final, question 1', title: 'Sum of two integers', file: 'practice_q1.s',
      task: '<p>You have been given <code>practice_q1.s</code>, a MIPS program that reads one number and then prints it. Add code to make it equivalent to this C program: it should read 2 numbers and print their sum.</p>',
      c: R`// print the sum of two integers
#include <stdio.h>

int main(void) {
    int x, y;
    scanf("%d", &x);
    scanf("%d", &y);
    printf("%d\n", x + y);
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to print the sum of two numbers'),
      ref: function (s) { var v = ints(s); return (v[0] + v[1]) + '\n'; },
      cases: ['5\n8\n', '118\n26\n', '42\n42\n'],
      hidden: ['-5\n3\n', '0\n0\n', '-100\n-23\n', '2147483600\n47\n'],
      restrictions: ['Your solution must be in MIPS assembler only.'],
      model: R`# print the sum of two integers

main:
    li   $v0, 5         #   scanf("%d", &x);
    syscall
    move $t0, $v0

    li   $v0, 5         #   scanf("%d", &y);
    syscall
    move $t1, $v0

    add  $a0, $t0, $t1  #   printf("%d\n", x + y);
    li   $v0, 1
    syscall

    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0         #   return 0
    jr   $ra
`
    },
    {
      id: 'm-temp', slot: 'q1', title: 'Celsius to Fahrenheit', file: 'temperature.s',
      task: '<p>Add code to <code>temperature.s</code> so it reads a temperature in degrees Celsius and prints it in Fahrenheit, exactly as this C program does (integer arithmetic, so the order of operations matters).</p>',
      c: R`#include <stdio.h>

int main(void) {
    int celsius;
    scanf("%d", &celsius);
    int fahrenheit = celsius * 9 / 5 + 32;
    printf("%d\n", fahrenheit);
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to convert Celsius to Fahrenheit'),
      ref: function (s) { var c = ints(s)[0]; return (trunc(c * 9, 5) + 32) + '\n'; },
      cases: ['100\n', '37\n', '-40\n'],
      hidden: ['-17\n', '0\n', '1\n', '-1\n', '1000\n'],
      model: R`# convert Celsius to Fahrenheit: f = c * 9 / 5 + 32

main:
    li   $v0, 5         #   scanf("%d", &celsius);
    syscall
    move $t0, $v0

    mul  $t1, $t0, 9    #   celsius * 9
    div  $t1, $t1, 5    #   ... / 5   (truncates towards zero, like C)
    addi $t1, $t1, 32   #   ... + 32

    move $a0, $t1       #   printf("%d\n", fahrenheit);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'Multiply before dividing: <code>celsius / 5 * 9</code> loses precision (37 gives 95 instead of 98). The three-operand <code>div</code> in mipsy truncates towards zero, exactly like C, so −17 → 2.',
      check: ['Multiplies by 9 before dividing by 5', 'Uses the three-operand div (or div + mflo)']
    },
    {
      id: 'm-max3', slot: 'q1', title: 'Largest of three', file: 'max3.s',
      task: '<p>Write a MIPS program <code>max3.s</code> that reads three integers and prints the largest, equivalent to this C program.</p>',
      c: R`#include <stdio.h>

int main(void) {
    int a, b, c;
    scanf("%d", &a);
    scanf("%d", &b);
    scanf("%d", &c);

    int max = a;
    if (b > max) {
        max = b;
    }
    if (c > max) {
        max = c;
    }
    printf("%d\n", max);
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to print the largest of three numbers'),
      ref: function (s) { var v = ints(s); return Math.max(v[0], v[1], v[2]) + '\n'; },
      cases: ['3\n9\n4\n', '-5\n-2\n-9\n', '7\n7\n7\n'],
      hidden: ['1\n2\n3\n', '3\n2\n1\n', '-1\n0\n-1\n', '-2147483648\n-2147483647\n-2147483648\n'],
      model: R`# print the largest of three integers

main:
    li   $v0, 5         #   scanf("%d", &a);
    syscall
    move $t0, $v0       #   max = a  (a is only needed as the first max)

    li   $v0, 5         #   scanf("%d", &b);
    syscall
    move $t1, $v0
    li   $v0, 5         #   scanf("%d", &c);
    syscall
    move $t2, $v0

    ble  $t1, $t0, check_c   #   if (b > max) max = b;
    move $t0, $t1
check_c:
    ble  $t2, $t0, print     #   if (c > max) max = c;
    move $t0, $t2
print:
    move $a0, $t0       #   printf("%d\n", max);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'Translate each <code>if (cond)</code> into a branch on the <i>opposite</i> condition that skips the body: <code>if (b &gt; max)</code> becomes <code>ble b, max, skip</code>.'
    },
    {
      id: 'm-leap', slot: 'q1', title: 'Leap year', file: 'leap.s',
      task: '<p>Write <code>leap.s</code>, equivalent to this C program. It reads a year and prints whether it is a leap year. Match the output format exactly.</p>',
      c: R`#include <stdio.h>

int main(void) {
    int year;
    scanf("%d", &year);

    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        printf("%d is a leap year\n", year);
    } else {
        printf("%d is not a leap year\n", year);
    }
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to report whether a year is a leap year'),
      ref: function (s) { var y = ints(s)[0]; var leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; return y + (leap ? ' is a leap year\n' : ' is not a leap year\n'); },
      cases: ['2024\n', '1900\n', '2000\n'],
      hidden: ['2023\n', '2100\n', '2400\n', '1996\n', '1\n'],
      model: R`# report whether a year is a leap year

    .data
leap_msg:     .asciiz " is a leap year\n"
not_leap_msg: .asciiz " is not a leap year\n"

    .text
main:
    li   $v0, 5             #   scanf("%d", &year);
    syscall
    move $t0, $v0

    move $a0, $t0           #   the year is printed either way
    li   $v0, 1
    syscall

    rem  $t1, $t0, 400      #   if (year % 400 == 0) goto leap;
    beqz $t1, leap
    rem  $t1, $t0, 4        #   if (year % 4 != 0) goto not_leap;
    bnez $t1, not_leap
    rem  $t1, $t0, 100      #   if (year % 100 != 0) goto leap;
    bnez $t1, leap

not_leap:
    la   $a0, not_leap_msg
    b    print_msg
leap:
    la   $a0, leap_msg
print_msg:
    li   $v0, 4
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'Break <code>&amp;&amp;</code> and <code>||</code> into separate branches. Checking <code>% 400</code> first leaves one simple chain for the rest.',
      check: ['Strings live in .data with .asciiz', 'Output matches exactly, including the space before "is"']
    },
    {
      id: 'm-grade', slot: 'q1', title: 'Mark to grade', file: 'grade.s',
      task: '<p>Write <code>grade.s</code>, equivalent to this C program. It reads a mark from 0 to 100 and prints the UNSW grade.</p>',
      c: R`#include <stdio.h>

int main(void) {
    int mark;
    scanf("%d", &mark);

    if (mark < 50) {
        printf("FL\n");
    } else if (mark < 65) {
        printf("PS\n");
    } else if (mark < 75) {
        printf("CR\n");
    } else if (mark < 85) {
        printf("DN\n");
    } else {
        printf("HD\n");
    }
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to print a grade'),
      ref: function (s) { var m = ints(s)[0]; return (m < 50 ? 'FL' : m < 65 ? 'PS' : m < 75 ? 'CR' : m < 85 ? 'DN' : 'HD') + '\n'; },
      cases: ['42\n', '65\n', '100\n'],
      hidden: ['0\n', '49\n', '50\n', '64\n', '74\n', '75\n', '84\n', '85\n'],
      model: R`# print the grade for a mark

    .data
fl: .asciiz "FL\n"
ps: .asciiz "PS\n"
cr: .asciiz "CR\n"
dn: .asciiz "DN\n"
hd: .asciiz "HD\n"

    .text
main:
    li   $v0, 5         #   scanf("%d", &mark);
    syscall
    move $t0, $v0

    la   $a0, fl
    blt  $t0, 50, print #   if (mark < 50) FL
    la   $a0, ps
    blt  $t0, 65, print #   else if (mark < 65) PS
    la   $a0, cr
    blt  $t0, 75, print
    la   $a0, dn
    blt  $t0, 85, print
    la   $a0, hd        #   else HD
print:
    li   $v0, 4
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'Boundaries are where marks go: 49/50, 64/65, 74/75 and 84/85 are exactly what unseen tests probe.'
    },
    {
      id: 'm-hms', slot: 'q1', title: 'Seconds to h:mm:ss', file: 'hms.s',
      task: '<p>Write <code>hms.s</code>, equivalent to this C program. It reads a number of seconds (0 or more) and prints it as hours, minutes and seconds. Note the <code>%02d</code>: minutes and seconds are always two digits.</p>',
      c: R`#include <stdio.h>

int main(void) {
    int seconds;
    scanf("%d", &seconds);

    int hours = seconds / 3600;
    int minutes = seconds / 60 % 60;
    int secs = seconds % 60;
    printf("%d:%02d:%02d\n", hours, minutes, secs);
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to print h:mm:ss'),
      ref: function (s) { var t = ints(s)[0]; var p = function (n) { return (n < 10 ? '0' : '') + n; }; return trunc(t, 3600) + ':' + p(trunc(t, 60) % 60) + ':' + p(t % 60) + '\n'; },
      cases: ['3725\n', '59\n', '86399\n'],
      hidden: ['0\n', '360000\n', '600\n', '3600\n', '61\n'],
      model: R`# print a number of seconds as h:mm:ss

main:
    li   $v0, 5             #   scanf("%d", &seconds);
    syscall
    move $t0, $v0

    div  $a0, $t0, 3600     #   hours = seconds / 3600
    li   $v0, 1
    syscall

    li   $a0, ':'
    li   $v0, 11
    syscall

    div  $t1, $t0, 60       #   minutes = seconds / 60 % 60
    rem  $t1, $t1, 60
    bge  $t1, 10, print_min #   %02d: a leading 0 below 10
    li   $a0, '0'
    li   $v0, 11
    syscall
print_min:
    move $a0, $t1
    li   $v0, 1
    syscall

    li   $a0, ':'
    li   $v0, 11
    syscall

    rem  $t2, $t0, 60       #   secs = seconds % 60
    bge  $t2, 10, print_sec
    li   $a0, '0'
    li   $v0, 11
    syscall
print_sec:
    move $a0, $t2
    li   $v0, 1
    syscall

    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'MIPS has no <code>printf</code>: <code>%02d</code> means printing a <code>\'0\'</code> character yourself when the value is below 10.'
    }
  ]);

  /* ======================= Q3: bits and conditions ======================= */

  add([
    {
      id: 'p20-q3', slot: 'q3', src: '20T2 final, question 3', title: 'Bottom two bytes equal', file: 'practice_q3.s',
      task: '<p>You have been given <code>practice_q3.s</code>, which reads an integer and prints it. Change it so it prints <code>1</code> iff the least significant (bottom) byte of the value equals the second least significant byte, and <code>0</code> otherwise.</p><p>For example 305419896 is 0x12345678: 0x78 ≠ 0x56, so print 0. 305419862 is 0x12345656, so print 1.</p>',
      c: R`#include <stdio.h>
#include <stdint.h>

int main(void) {
    int value;
    scanf("%d", &value);
    uint32_t u = value;
    printf("%d\n", (u & 0xFF) == ((u >> 8) & 0xFF));
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to compare its bottom two bytes'),
      ref: function (s) { var v = ints(s)[0]; return ((v & 255) === ((v >>> 8) & 255) ? 1 : 0) + '\n'; },
      cases: ['0\n', '1\n', '256\n', '257\n'],
      hidden: ['4626\n', '4627\n', '305419896\n', '305419862\n', '-1\n', '-256\n'],
      restrictions: ['It is recommended, but not required, that you use bitwise operators.'],
      model: R`# print 1 iff the bottom byte equals the second byte

main:
    li   $v0, 5
    syscall
    move $t0, $v0

    andi $t1, $t0, 0xFF     # bottom byte
    srl  $t2, $t0, 8
    andi $t2, $t2, 0xFF     # second byte

    seq  $a0, $t1, $t2      # 1 if equal, else 0
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0
    jr   $ra
`
    },
    {
      id: 'm-popcount', slot: 'q3', title: 'Count the 1 bits', file: 'count_bits.s',
      task: '<p>Write <code>count_bits.s</code>, equivalent to this C program. It reads an integer and prints how many bits are 1 in its 32-bit two\'s complement representation.</p>',
      c: R`#include <stdio.h>
#include <stdint.h>

int main(void) {
    int value;
    scanf("%d", &value);

    uint32_t u = value;
    int count = 0;
    while (u != 0) {
        count += u & 1;
        u = u >> 1;
    }
    printf("%d\n", count);
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to count its 1 bits'),
      ref: function (s) { var u = ints(s)[0] >>> 0, c = 0; while (u) { c += u & 1; u >>>= 1; } return c + '\n'; },
      cases: ['7\n', '255\n', '-1\n'],
      hidden: ['0\n', '1\n', '-2147483648\n', '1431655765\n', '-8\n'],
      restrictions: ['You must use bitwise operators.'],
      model: R`# count the 1 bits in a 32-bit value

main:
    li   $v0, 5
    syscall
    move $t0, $v0           # u = value

    li   $t1, 0             # count = 0
loop:
    beqz $t0, done          # while (u != 0) {
    andi $t2, $t0, 1        #     count += u & 1;
    add  $t1, $t1, $t2
    srl  $t0, $t0, 1        #     u = u >> 1;   (logical: u is unsigned)
    b    loop               # }
done:
    move $a0, $t1
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: '<code>u</code> is unsigned, so the shift must be <code>srl</code>. With <code>sra</code> a negative value copies its sign bit in forever, never reaches 0, and the program loops until it is killed: that is the −1 test.',
      check: ['Uses srl, not sra', 'Handles negative input (−1 has 32 one bits)']
    },
    {
      id: 'm-hex', slot: 'q3', title: 'Print in hexadecimal', file: 'print_hex.s',
      task: '<p>Write <code>print_hex.s</code>, equivalent to this C program: read an integer and print its 32-bit value as <code>0x</code> followed by exactly 8 lowercase hexadecimal digits.</p>',
      c: R`#include <stdio.h>

int main(void) {
    int value;
    scanf("%d", &value);

    printf("0x");
    for (int shift = 28; shift >= 0; shift -= 4) {
        int nibble = (value >> shift) & 0xF;
        if (nibble < 10) {
            putchar('0' + nibble);
        } else {
            putchar('a' + nibble - 10);
        }
    }
    putchar('\n');
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to print the value in hexadecimal'),
      ref: function (s) { return '0x' + ('00000000' + (ints(s)[0] >>> 0).toString(16)).slice(-8) + '\n'; },
      cases: ['255\n', '305419896\n', '-1\n'],
      hidden: ['0\n', '10\n', '-2147483648\n', '3054198\n', '-559038737\n'],
      restrictions: ['You must not use any syscall except 1, 5, 11 (print_int, read_int, print_char).'],
      model: R`# print a 32-bit value as 0x followed by 8 hex digits

main:
    li   $v0, 5
    syscall
    move $t0, $v0           # value

    li   $a0, '0'           # printf("0x");
    li   $v0, 11
    syscall
    li   $a0, 'x'
    syscall

    li   $t1, 28            # shift = 28
loop:
    bltz $t1, done          # while (shift >= 0) {
    srlv $t2, $t0, $t1      #     nibble = (value >> shift) & 0xF;
    andi $t2, $t2, 0xF
    bge  $t2, 10, letter
    addi $a0, $t2, '0'      #     '0' + nibble
    b    put
letter:
    addi $a0, $t2, 87       #     'a' + nibble - 10   ('a' is 97)
put:
    li   $v0, 11
    syscall
    addi $t1, $t1, -4       #     shift -= 4;
    b    loop               # }
done:
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'Variable shifts need <code>srlv</code>/<code>sllv</code> (or mipsy lets you write <code>srl $t2, $t0, $t1</code>). Digits 10–15 are letters: <code>\'a\' + nibble − 10</code>.'
    },
    {
      id: 'm-swaphalves', slot: 'q3', title: 'Swap the 16-bit halves', file: 'swap_halves.s',
      task: '<p>Write <code>swap_halves.s</code>, equivalent to this C program: read an integer, swap its top and bottom 16 bits, and print the result as a signed integer.</p><p>For example 65535 is 0x0000FFFF; swapped it is 0xFFFF0000, which is −65536.</p>',
      c: R`#include <stdio.h>
#include <stdint.h>

int main(void) {
    int value;
    scanf("%d", &value);

    uint32_t u = value;
    uint32_t swapped = (u << 16) | (u >> 16);
    printf("%d\n", (int32_t)swapped);
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to swap its 16-bit halves'),
      ref: function (s) { var u = ints(s)[0] >>> 0; return (((u << 16) | (u >>> 16)) | 0) + '\n'; },
      cases: ['1\n', '65536\n', '305419896\n'],
      hidden: ['-1\n', '65535\n', '0\n', '-65536\n', '-2147483648\n'],
      restrictions: ['You must use bitwise operators.'],
      model: R`# swap the top and bottom 16 bits of a value

main:
    li   $v0, 5
    syscall
    move $t0, $v0

    sll  $t1, $t0, 16       # u << 16
    srl  $t2, $t0, 16       # u >> 16   (logical: u is unsigned)
    or   $a0, $t1, $t2

    li   $v0, 1             # printed as a signed int
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'With <code>sra</code> instead of <code>srl</code>, a negative input smears 1s into the bottom half: −65536 would print −1 instead of 65535.'
    },
    {
      id: 'm-pow2', slot: 'q3', title: 'Power of two, no loops', file: 'power_of_two.s',
      task: '<p>Write <code>power_of_two.s</code>, equivalent to this C program. It prints <code>1</code> iff the input is a positive power of two.</p>',
      c: R`#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    if (n > 0 && (n & (n - 1)) == 0) {
        printf("1\n");
    } else {
        printf("0\n");
    }
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to test for a power of two'),
      ref: function (s) { var n = ints(s)[0]; return (n > 0 && (n & (n - 1)) === 0 ? 1 : 0) + '\n'; },
      cases: ['64\n', '96\n', '1\n'],
      hidden: ['0\n', '-8\n', '1073741824\n', '2147483647\n', '-2147483648\n'],
      restrictions: ['You must not use a loop: use the bit trick in the C program.'],
      model: R`# print 1 iff n is a positive power of two

main:
    li   $v0, 5
    syscall
    move $t0, $v0           # n

    li   $a0, 0
    blez $t0, print         # n > 0 is checked FIRST (&& short-circuits)
    addi $t1, $t0, -1       # n - 1 cannot overflow now
    and  $t1, $t0, $t1
    bnez $t1, print
    li   $a0, 1
print:
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'A power of two has one bit set, and <code>n − 1</code> flips that bit and every bit below it, so <code>n &amp; (n − 1)</code> is 0. Keep C\'s short-circuit order: computing <code>n − 1</code> with <code>addi</code> for n = −2147483648 overflows, and mipsy stops with an error.',
      check: ['No loop', 'Tests n > 0 before computing n - 1']
    },
    {
      id: 'm-bitfield', slot: 'q3', title: 'Extract a bit field', file: 'bit_field.s',
      task: '<p>Write <code>bit_field.s</code>, equivalent to this C program. It reads a value, then a low and a high bit position (0 ≤ low ≤ high ≤ 31, high − low ≤ 30), and prints the bits from low to high inclusive as a number.</p><p>For example 240 is 0xF0 = 1111 0000, so bits 4 to 7 are 1111 = 15.</p>',
      c: R`#include <stdio.h>
#include <stdint.h>

int main(void) {
    int value, low, high;
    scanf("%d", &value);
    scanf("%d", &low);
    scanf("%d", &high);

    uint32_t u = value;
    uint32_t width = high - low + 1;
    uint32_t mask = (1u << width) - 1;
    printf("%d\n", (int)((u >> low) & mask));
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to extract bits low..high'),
      ref: function (s) { var v = ints(s); var w = v[2] - v[1] + 1; var mask = ((1 << w) >>> 0) - 1; return (((v[0] >>> v[1]) & mask) | 0) + '\n'; },
      cases: ['240\n4\n7\n', '305419896\n8\n15\n', '-1\n0\n30\n'],
      hidden: ['-1\n31\n31\n', '5\n0\n0\n', '6\n0\n0\n', '-2147483648\n30\n31\n', '1000\n3\n9\n', '-1\n1\n31\n'],
      restrictions: ['You must use bitwise operators.'],
      model: R`# print bits low..high of a value

main:
    li   $v0, 5             # value
    syscall
    move $t0, $v0
    li   $v0, 5             # low
    syscall
    move $t1, $v0
    li   $v0, 5             # high
    syscall
    move $t2, $v0

    sub  $t3, $t2, $t1      # width = high - low + 1
    addi $t3, $t3, 1
    li   $t4, 1
    sllv $t4, $t4, $t3      # mask = (1 << width) - 1
    addiu $t4, $t4, -1     # addiu: for width 31, 1 << 31 is negative and addi overflows

    srlv $t5, $t0, $t1      # (u >> low) & mask
    and  $a0, $t5, $t4

    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'Build the mask from the width: <code>(1 &lt;&lt; width) − 1</code> is <code>width</code> one bits. Shift the value down to bit 0 first, then mask. For a 31-bit field <code>1 &lt;&lt; 31</code> is the most negative int, so <code>addi $t4, $t4, -1</code> overflows and mipsy stops: use <code>addiu</code> (no overflow check) for bit masks.'
    }
  ]);

  /* ================================ Q4: loops ================================ */

  add([
    {
      id: 'p20-q4', slot: 'q4', src: '20T2 final, question 4', title: 'Sum until at least 42', file: 'practice_q4.s',
      task: '<p>You have been given <code>practice_q4.s</code>, which reads 1 number and prints it. Change it to read numbers until their sum is ≥ 42, then print their sum.</p>',
      c: R`//  read numbers until their sum is >= 42, print their sum
#include <stdio.h>

int main(void) {
    int sum = 0;
    while (sum < 42) {
        int x;
        scanf("%d", &x);
        sum = sum + x;
    }
    printf("%d\n", sum);
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to sum numbers until the sum is >= 42'),
      ref: function (s) { var v = ints(s), sum = 0, i = 0; while (sum < 42) sum += v[i++]; return sum + '\n'; },
      cases: ['10\n20\n25\n', '20\n22\n', '100\n', '10\n10\n10\n10\n10\n'],
      hidden: ['-10\n50\n2\n', '41\n1\n', '43\n', '-100\n100\n42\n'],
      model: R`# read numbers until their sum is >= 42, print their sum

main:
    li   $t0, 0             # sum = 0
loop:
    bge  $t0, 42, done      # while (sum < 42) {
    li   $v0, 5             #     scanf("%d", &x);
    syscall
    add  $t0, $t0, $v0      #     sum = sum + x;
    b    loop               # }
done:
    move $a0, $t0           # printf("%d\n", sum);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0
    jr   $ra
`
    },
    {
      id: 'm-evens', slot: 'q4', title: 'Count evens until zero', file: 'count_even.s',
      task: '<p>Write <code>count_even.s</code>, equivalent to this C program. It reads integers until it reads 0, then prints how many were even. Input may be negative.</p>',
      c: R`#include <stdio.h>

int main(void) {
    int count = 0;
    int x;
    scanf("%d", &x);
    while (x != 0) {
        if (x % 2 == 0) {
            count++;
        }
        scanf("%d", &x);
    }
    printf("%d even\n", count);
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to count even numbers until 0'),
      ref: function (s) { var v = ints(s), c = 0; for (var i = 0; v[i] !== 0; i++) if (v[i] % 2 === 0) c++; return c + ' even\n'; },
      cases: ['1\n2\n3\n4\n0\n', '0\n', '-4\n-3\n6\n0\n'],
      hidden: ['7\n9\n0\n', '-1\n-2\n-3\n-4\n0\n', '2\n2\n2\n2\n2\n2\n0\n', '-7\n0\n'],
      model: R`# count the even numbers read before a 0

    .data
even_msg: .asciiz " even\n"

    .text
main:
    li   $t0, 0             # count = 0
    li   $v0, 5             # scanf("%d", &x);
    syscall
    move $t1, $v0
loop:
    beqz $t1, done          # while (x != 0) {
    rem  $t2, $t1, 2        #     if (x % 2 == 0) count++;
    bnez $t2, next
    addi $t0, $t0, 1
next:
    li   $v0, 5             #     scanf("%d", &x);
    syscall
    move $t1, $v0
    b    loop               # }
done:
    move $a0, $t0
    li   $v0, 1
    syscall
    la   $a0, even_msg
    li   $v0, 4
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'Test <code>x % 2 == 0</code>, not <code>x % 2 == 1</code> for odd: in C and MIPS, −3 % 2 is −1. Alternatively <code>andi $t2, $t1, 1</code> works for negatives too (two\'s complement).'
    },
    {
      id: 'm-triangle', slot: 'q4', title: 'Triangle of stars', file: 'triangle.s',
      task: '<p>Write <code>triangle.s</code>, equivalent to this C program. It reads n and prints a triangle of n rows: row i has i stars.</p>',
      c: R`#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    for (int row = 1; row <= n; row++) {
        for (int col = 0; col < row; col++) {
            putchar('*');
        }
        putchar('\n');
    }
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to print a triangle of stars'),
      ref: function (s) { var n = ints(s)[0], o = ''; for (var r = 1; r <= n; r++) o += new Array(r + 1).join('*') + '\n'; return o; },
      cases: ['3\n', '1\n', '5\n'],
      hidden: ['0\n', '8\n', '2\n'],
      model: R`# print a triangle of stars with n rows

main:
    li   $v0, 5
    syscall
    move $t0, $v0           # n

    li   $t1, 1             # row = 1
row_loop:
    bgt  $t1, $t0, done     # for (row = 1; row <= n; row++) {
    li   $t2, 0             #     col = 0
col_loop:
    bge  $t2, $t1, row_end  #     for (col = 0; col < row; col++)
    li   $a0, '*'           #         putchar('*');
    li   $v0, 11
    syscall
    addi $t2, $t2, 1
    b    col_loop
row_end:
    li   $a0, '\n'          #     putchar('\n');
    li   $v0, 11
    syscall
    addi $t1, $t1, 1
    b    row_loop           # }
done:
    li   $v0, 0
    jr   $ra
`,
      notes: 'Nested loops need their own counters and labels; reset the inner counter at the start of every outer iteration.'
    },
    {
      id: 'm-collatz', slot: 'q4', title: 'Collatz sequence', file: 'collatz.s',
      task: '<p>Write <code>collatz.s</code>, equivalent to this C program. It reads n ≥ 1 and prints the Collatz sequence from n down to 1, then the number of steps taken.</p>',
      c: R`#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int steps = 0;
    while (n != 1) {
        printf("%d\n", n);
        if (n % 2 == 0) {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }
        steps++;
    }
    printf("1\n");
    printf("%d steps\n", steps);
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to print the Collatz sequence'),
      ref: function (s) { var n = ints(s)[0], o = '', k = 0; while (n !== 1) { o += n + '\n'; n = n % 2 === 0 ? n / 2 : 3 * n + 1; k++; } return o + '1\n' + k + ' steps\n'; },
      cases: ['6\n', '1\n', '7\n'],
      hidden: ['27\n', '2\n', '3\n', '97\n'],
      model: R`# print the Collatz sequence from n to 1 and count the steps

    .data
steps_msg: .asciiz " steps\n"

    .text
main:
    li   $v0, 5
    syscall
    move $t0, $v0           # n
    li   $t1, 0             # steps = 0
loop:
    beq  $t0, 1, done       # while (n != 1) {
    move $a0, $t0           #     printf("%d\n", n);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    rem  $t2, $t0, 2        #     if (n % 2 == 0)
    bnez $t2, odd
    div  $t0, $t0, 2        #         n = n / 2;
    b    counted
odd:
    mul  $t0, $t0, 3        #     else n = 3 * n + 1;
    addi $t0, $t0, 1
counted:
    addi $t1, $t1, 1        #     steps++;
    b    loop               # }
done:
    li   $a0, 1             # printf("1\n");
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    move $a0, $t1           # printf("%d steps\n", steps);
    li   $v0, 1
    syscall
    la   $a0, steps_msg
    li   $v0, 4
    syscall

    li   $v0, 0
    jr   $ra
`
    },
    {
      id: 'm-digitalroot', slot: 'q4', title: 'Digital root', file: 'digital_root.s',
      task: '<p>Write <code>digital_root.s</code>, equivalent to this C program. It reads n ≥ 0 and keeps replacing n by the sum of its digits until it is a single digit, printing every value along the way.</p>',
      c: R`#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    printf("%d\n", n);

    while (n >= 10) {
        int sum = 0;
        while (n > 0) {
            sum += n % 10;
            n = n / 10;
        }
        n = sum;
        printf("%d\n", n);
    }
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to print its digital root chain'),
      ref: function (s) { var n = ints(s)[0], o = n + '\n'; while (n >= 10) { var sum = 0; while (n > 0) { sum += n % 10; n = trunc(n, 10); } n = sum; o += n + '\n'; } return o; },
      cases: ['9875\n', '7\n', '99\n'],
      hidden: ['0\n', '10\n', '2147483647\n', '1000000\n', '19\n'],
      model: R`# print the chain of digit sums down to a single digit

main:
    li   $v0, 5
    syscall
    move $t0, $v0           # n

    move $a0, $t0           # printf("%d\n", n);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall
outer:
    blt  $t0, 10, done      # while (n >= 10) {
    li   $t1, 0             #     sum = 0
inner:
    blez $t0, inner_done    #     while (n > 0) {
    rem  $t2, $t0, 10       #         sum += n % 10;
    add  $t1, $t1, $t2
    div  $t0, $t0, 10       #         n = n / 10;
    b    inner              #     }
inner_done:
    move $t0, $t1           #     n = sum;
    move $a0, $t0           #     printf("%d\n", n);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall
    b    outer              # }
done:
    li   $v0, 0
    jr   $ra
`
    },
    {
      id: 'm-gcd', slot: 'q4', title: 'Greatest common divisor', file: 'gcd.s',
      task: '<p>Write <code>gcd.s</code>, equivalent to this C program. It reads two non-negative integers (not both 0) and prints their GCD using Euclid\'s algorithm, in the format shown.</p>',
      c: R`#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d", &a);
    scanf("%d", &b);

    printf("gcd(%d, %d) = ", a, b);
    while (b != 0) {
        int t = a % b;
        a = b;
        b = t;
    }
    printf("%d\n", a);
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to print the gcd of two numbers'),
      ref: function (s) { var v = ints(s), a = v[0], b = v[1], o = 'gcd(' + a + ', ' + b + ') = '; while (b !== 0) { var t = a % b; a = b; b = t; } return o + a + '\n'; },
      cases: ['48\n18\n', '17\n5\n', '100\n75\n'],
      hidden: ['5\n0\n', '0\n9\n', '1071\n462\n', '7\n7\n'],
      model: R`# print gcd(a, b) using Euclid's algorithm

    .data
gcd_open:  .asciiz "gcd("
comma:     .asciiz ", "
gcd_close: .asciiz ") = "

    .text
main:
    li   $v0, 5
    syscall
    move $t0, $v0           # a
    li   $v0, 5
    syscall
    move $t1, $v0           # b

    la   $a0, gcd_open      # printf("gcd(%d, %d) = ", a, b);
    li   $v0, 4
    syscall
    move $a0, $t0
    li   $v0, 1
    syscall
    la   $a0, comma
    li   $v0, 4
    syscall
    move $a0, $t1
    li   $v0, 1
    syscall
    la   $a0, gcd_close
    li   $v0, 4
    syscall
loop:
    beqz $t1, done          # while (b != 0) {
    rem  $t2, $t0, $t1      #     t = a % b;
    move $t0, $t1           #     a = b;
    move $t1, $t2           #     b = t;
    b    loop               # }
done:
    move $a0, $t0
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'Print the header <i>before</i> the loop changes a and b. One printf with several values becomes several syscalls.'
    }
  ]);

  /* ========================= Q7: arrays and strings ========================= */

  add([
    {
      id: 'p20-q7', slot: 'q7', src: '20T2 final, question 7', title: 'Reverse until at least 42', file: 'practice_q7.s',
      task: '<p>You have been given <code>practice_q7.s</code>, which reads 1 number and prints it. Change it to read numbers into an array until their sum is ≥ 42, then print the numbers in reverse order. At most 1000 numbers are read.</p>',
      c: R`// Read numbers into an array until their sum is >= 42
// then print the numbers in reverse order
#include <stdio.h>

int numbers[1000];

int main(void) {
    int i = 0;
    int sum = 0;
    while (sum < 42) {
        int x;
        scanf("%d", &x);
        numbers[i] = x;
        i++;
        sum += x;
    }

    while (i > 0) {
        i--;
        printf("%d\n", numbers[i]);
    }
}`,
      starter: readPrint('read a number and print it — change it to print numbers in reverse'),
      ref: function (s) { var v = ints(s), sum = 0, got = []; while (sum < 42) { got.push(v[got.length]); sum += got[got.length - 1]; } return got.reverse().join('\n') + '\n'; },
      cases: ['11\n17\n3\n19\n', '10\n20\n30\n', '42\n'],
      hidden: [new Array(43).join('1\n'), '-5\n50\n', '41\n0\n0\n1\n'],
      model: R`# read numbers until their sum is >= 42, print them in reverse

    .data
numbers: .space 4000        # int numbers[1000];

    .text
main:
    li   $t0, 0             # i = 0
    li   $t1, 0             # sum = 0
read_loop:
    bge  $t1, 42, print_loop    # while (sum < 42) {
    li   $v0, 5                 #     scanf("%d", &x);
    syscall
    mul  $t2, $t0, 4            #     numbers[i] = x;
    sw   $v0, numbers($t2)
    addi $t0, $t0, 1            #     i++;
    add  $t1, $t1, $v0          #     sum += x;
    b    read_loop              # }
print_loop:
    blez $t0, done              # while (i > 0) {
    addi $t0, $t0, -1           #     i--;
    mul  $t2, $t0, 4
    lw   $a0, numbers($t2)      #     printf("%d\n", numbers[i]);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall
    b    print_loop             # }
done:
    li   $v0, 0
    jr   $ra
`,
      notes: 'Index × 4 gives the byte offset of an int. <code>sw $v0, numbers($t2)</code> uses the label as the base address plus the offset in the register.'
    },
    {
      id: 'm-sort', slot: 'q7', title: 'Insertion sort', file: 'sort.s',
      task: '<p>Write <code>sort.s</code>, equivalent to this C program. It reads n (1 ≤ n ≤ 100), then n integers, and prints them in ascending order using insertion sort.</p>',
      c: R`#include <stdio.h>

#define MAX 100
int numbers[MAX];

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &numbers[i]);
    }

    for (int i = 1; i < n; i++) {
        int key = numbers[i];
        int j = i - 1;
        while (j >= 0 && numbers[j] > key) {
            numbers[j + 1] = numbers[j];
            j--;
        }
        numbers[j + 1] = key;
    }

    for (int i = 0; i < n; i++) {
        printf("%d\n", numbers[i]);
    }
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to sort n numbers'),
      ref: function (s) { var v = ints(s), n = v[0]; return v.slice(1, n + 1).sort(function (a, b) { return a - b; }).join('\n') + '\n'; },
      cases: ['5\n3\n1\n4\n1\n5\n', '1\n42\n', '4\n-2\n10\n-30\n0\n'],
      hidden: ['6\n6\n5\n4\n3\n2\n1\n', '5\n1\n2\n3\n4\n5\n', '3\n7\n7\n7\n', '8\n100\n-100\n50\n-50\n0\n25\n-25\n75\n'],
      model: R`# read n numbers and print them sorted (insertion sort)

    .data
numbers: .space 400         # int numbers[100];

    .text
main:
    li   $v0, 5
    syscall
    move $s0, $v0           # n

    li   $t0, 0             # i = 0
read:
    bge  $t0, $s0, sort     # for (i = 0; i < n; i++)
    li   $v0, 5
    syscall
    mul  $t1, $t0, 4
    sw   $v0, numbers($t1)  #     scanf("%d", &numbers[i]);
    addi $t0, $t0, 1
    b    read

sort:
    li   $t0, 1             # i = 1
outer:
    bge  $t0, $s0, print    # for (i = 1; i < n; i++) {
    mul  $t1, $t0, 4
    lw   $t2, numbers($t1)  #     key = numbers[i];
    addi $t3, $t0, -1       #     j = i - 1;
inner:
    bltz $t3, place         #     while (j >= 0          <- checked first
    mul  $t4, $t3, 4
    lw   $t5, numbers($t4)  #            && numbers[j] > key) {
    ble  $t5, $t2, place
    sw   $t5, numbers+4($t4)    #     numbers[j + 1] = numbers[j];
    addi $t3, $t3, -1           #     j--;
    b    inner              #     }
place:
    addi $t4, $t3, 1        #     numbers[j + 1] = key;
    mul  $t4, $t4, 4
    sw   $t2, numbers($t4)
    addi $t0, $t0, 1
    b    outer              # }

print:
    li   $t0, 0
print_loop:
    bge  $t0, $s0, done     # for (i = 0; i < n; i++)
    mul  $t1, $t0, 4
    lw   $a0, numbers($t1)  #     printf("%d\n", numbers[i]);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall
    addi $t0, $t0, 1
    b    print_loop
done:
    li   $v0, 0
    jr   $ra
`,
      notes: 'Keep C\'s short-circuit: test <code>j &gt;= 0</code> before loading <code>numbers[j]</code>, or j = −1 reads outside the array (mipsy reports a bad address or uninitialised memory). <code>numbers+4($t4)</code> addresses element j + 1.',
      check: ['Implements insertion sort (or another in-place sort) rather than hard-coding output', 'Checks j >= 0 before reading numbers[j]']
    },
    {
      id: 'm-aboveavg', slot: 'q7', title: 'Above the average', file: 'above_average.s',
      task: '<p>Write <code>above_average.s</code>, equivalent to this C program. It reads 10 integers, computes their average with C integer division, and prints, in input order, those strictly greater than the average.</p>',
      c: R`#include <stdio.h>

#define N 10
int numbers[N];

int main(void) {
    int sum = 0;
    for (int i = 0; i < N; i++) {
        scanf("%d", &numbers[i]);
        sum += numbers[i];
    }

    int average = sum / N;
    for (int i = 0; i < N; i++) {
        if (numbers[i] > average) {
            printf("%d\n", numbers[i]);
        }
    }
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to print the numbers above the average'),
      ref: function (s) { var v = ints(s).slice(0, 10), sum = v.reduce(function (a, b) { return a + b; }, 0), avg = trunc(sum, 10); return v.filter(function (x) { return x > avg; }).map(function (x) { return x + '\n'; }).join(''); },
      cases: ['1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n', '5\n5\n5\n5\n5\n5\n5\n5\n5\n5\n', '-1\n-2\n-3\n-4\n-5\n-6\n-7\n-8\n-9\n-10\n'],
      hidden: ['100\n0\n0\n0\n0\n0\n0\n0\n0\n0\n', '-15\n0\n0\n0\n0\n0\n0\n0\n0\n14\n', '3\n1\n4\n1\n5\n9\n2\n6\n5\n3\n'],
      model: R`# print the numbers greater than the (integer) average of 10 numbers

N = 10

    .data
numbers: .space 4 * N

    .text
main:
    li   $t0, 0             # i = 0
    li   $t1, 0             # sum = 0
read:
    bge  $t0, N, average    # for (i = 0; i < N; i++) {
    li   $v0, 5
    syscall
    mul  $t2, $t0, 4
    sw   $v0, numbers($t2)  #     scanf("%d", &numbers[i]);
    add  $t1, $t1, $v0      #     sum += numbers[i];
    addi $t0, $t0, 1
    b    read               # }
average:
    div  $t3, $t1, N        # average = sum / N  (truncates towards zero)
    li   $t0, 0
print:
    bge  $t0, N, done       # for (i = 0; i < N; i++)
    mul  $t2, $t0, 4
    lw   $a0, numbers($t2)
    ble  $a0, $t3, next     #     if (numbers[i] > average)
    li   $v0, 1             #         printf("%d\n", numbers[i]);
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall
next:
    addi $t0, $t0, 1
    b    print
done:
    li   $v0, 0
    jr   $ra
`,
      notes: 'Constants like <code>N = 10</code> work in mipsy (and in <code>.space 4 * N</code>). Negative sums truncate towards zero: −55 / 10 is −5, so −1 to −4 are printed.'
    },
    {
      id: 'm-upper', slot: 'q7', title: 'Uppercase a line', file: 'upper.s',
      task: '<p>Write <code>upper.s</code>, equivalent to this C program. It reads one line (at most 255 characters) and prints it with lowercase letters changed to uppercase. Everything else is unchanged.</p>',
      c: R`#include <stdio.h>

#define MAX 256
char line[MAX];

int main(void) {
    fgets(line, MAX, stdin);
    for (int i = 0; line[i] != '\0'; i++) {
        if (line[i] >= 'a' && line[i] <= 'z') {
            line[i] = line[i] - 'a' + 'A';
        }
    }
    printf("%s", line);
    return 0;
}`,
      starter: R`# read a line and print it — change it to print the line in uppercase

    .data
line: .space 256

    .text
main:
    la   $a0, line      #   fgets(line, 256, stdin);
    li   $a1, 256
    li   $v0, 8
    syscall

    la   $a0, line      #   printf("%s", line);
    li   $v0, 4
    syscall

    li   $v0, 0
    jr   $ra
`,
      ref: function (s) { var l = s.slice(0, s.indexOf('\n') + 1 || s.length); return l.replace(/[a-z]/g, function (c) { return c.toUpperCase(); }); },
      cases: ['hello world\n', 'COMP1521 is Fun!\n', 'a{z}`\n'],
      hidden: ['\n', 'already UPPER\n', 'mixed-Case_123 xyz\n', 'abcdefghijklmnopqrstuvwxyz\n'],
      model: R`# read a line and print it in uppercase

    .data
line: .space 256

    .text
main:
    la   $a0, line          # fgets(line, 256, stdin);
    li   $a1, 256
    li   $v0, 8
    syscall

    la   $t0, line          # p = &line[0]
loop:
    lb   $t1, ($t0)         # while (*p != '\0') {
    beqz $t1, print
    blt  $t1, 'a', next     #     if (*p >= 'a' && *p <= 'z')
    bgt  $t1, 'z', next
    addi $t1, $t1, -32      #         *p = *p - 'a' + 'A';
    sb   $t1, ($t0)
next:
    addi $t0, $t0, 1        #     p++;
    b    loop               # }
print:
    la   $a0, line          # printf("%s", line);
    li   $v0, 4
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'Characters are bytes: <code>lb</code>/<code>sb</code>, and step the pointer by 1, not 4. <code>\'a\' − \'A\'</code> is 32. The characters either side of the range (<code>`</code> and <code>{</code>) must be left alone.'
    },
    {
      id: 'm-palindrome', slot: 'q7', title: 'Palindrome line', file: 'palindrome.s',
      task: '<p>Write <code>palindrome.s</code>, equivalent to this C program. It reads one line and prints whether it reads the same backwards, ignoring only the newline. Case and spaces count.</p>',
      c: R`#include <stdio.h>

#define MAX 256
char line[MAX];

int main(void) {
    fgets(line, MAX, stdin);

    int len = 0;
    while (line[len] != '\0' && line[len] != '\n') {
        len++;
    }

    int is_palindrome = 1;
    int i = 0;
    int j = len - 1;
    while (i < j) {
        if (line[i] != line[j]) {
            is_palindrome = 0;
            break;
        }
        i++;
        j--;
    }

    if (is_palindrome) {
        printf("palindrome\n");
    } else {
        printf("not palindrome\n");
    }
    return 0;
}`,
      starter: R`# read a line and print it — change it to test for a palindrome

    .data
line: .space 256

    .text
main:
    la   $a0, line      #   fgets(line, 256, stdin);
    li   $a1, 256
    li   $v0, 8
    syscall

    la   $a0, line      #   printf("%s", line);
    li   $v0, 4
    syscall

    li   $v0, 0
    jr   $ra
`,
      ref: function (s) { var l = s.split('\n')[0]; return (l === l.split('').reverse().join('') ? 'palindrome' : 'not palindrome') + '\n'; },
      cases: ['racecar\n', 'hello\n', 'abba\n'],
      hidden: ['a\n', '\n', 'Abba\n', 'never odd or even\n', 'step on no pets\n', 'ab\n'],
      model: R`# print whether a line is a palindrome

    .data
line:    .space 256
yes_msg: .asciiz "palindrome\n"
no_msg:  .asciiz "not palindrome\n"

    .text
main:
    la   $a0, line          # fgets(line, 256, stdin);
    li   $a1, 256
    li   $v0, 8
    syscall

    li   $t0, 0             # len = 0
length:
    lb   $t1, line($t0)     # while (line[len] != '\0' && line[len] != '\n')
    beqz $t1, compare
    beq  $t1, '\n', compare
    addi $t0, $t0, 1        #     len++;
    b    length

compare:
    li   $t2, 0             # i = 0
    addi $t3, $t0, -1       # j = len - 1
loop:
    bge  $t2, $t3, yes      # while (i < j) {
    lb   $t4, line($t2)
    lb   $t5, line($t3)
    bne  $t4, $t5, no       #     if (line[i] != line[j]) not a palindrome
    addi $t2, $t2, 1        #     i++;
    addi $t3, $t3, -1       #     j--;
    b    loop               # }
yes:
    la   $a0, yes_msg
    b    print
no:
    la   $a0, no_msg
print:
    li   $v0, 4
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'Stop the length at the newline that read_string keeps, or every line ending in \\n looks like a non-palindrome. An empty line (len 0, j = −1) is a palindrome.'
    },
    {
      id: 'm-colsums', slot: 'q7', title: 'Column sums of a 2D array', file: 'column_sums.s',
      task: '<p>Write <code>column_sums.s</code>, equivalent to this C program. It reads 12 integers into a 3 × 4 array, row by row, then prints the sum of each column on one line, separated by single spaces.</p>',
      c: R`#include <stdio.h>

#define ROWS 3
#define COLS 4
int matrix[ROWS][COLS];

int main(void) {
    for (int r = 0; r < ROWS; r++) {
        for (int c = 0; c < COLS; c++) {
            scanf("%d", &matrix[r][c]);
        }
    }

    for (int c = 0; c < COLS; c++) {
        int sum = 0;
        for (int r = 0; r < ROWS; r++) {
            sum += matrix[r][c];
        }
        printf("%d", sum);
        if (c < COLS - 1) {
            putchar(' ');
        }
    }
    putchar('\n');
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to print the column sums of a 3x4 array'),
      ref: function (s) { var v = ints(s), out = []; for (var c = 0; c < 4; c++) { var sum = 0; for (var r = 0; r < 3; r++) sum += v[r * 4 + c]; out.push(sum); } return out.join(' ') + '\n'; },
      cases: ['1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n', '0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n', '1\n-1\n1\n-1\n2\n-2\n2\n-2\n3\n-3\n3\n-3\n'],
      hidden: ['100\n0\n0\n0\n0\n100\n0\n0\n0\n0\n100\n0\n', '-5\n7\n9\n11\n13\n-15\n17\n19\n21\n23\n-25\n27\n'],
      restrictions: ['You must store the numbers in a 2D array (.space 48) and index it as matrix[r][c].'],
      model: R`# read a 3x4 array and print its column sums

ROWS = 3
COLS = 4

    .data
matrix: .space ROWS * COLS * 4

    .text
main:
    li   $t0, 0                 # r = 0
read_rows:
    bge  $t0, ROWS, sums        # for (r = 0; r < ROWS; r++)
    li   $t1, 0                 #     c = 0
read_cols:
    bge  $t1, COLS, next_row    #     for (c = 0; c < COLS; c++)
    li   $v0, 5
    syscall
    mul  $t2, $t0, COLS         #         &matrix[r][c] = matrix + (r * COLS + c) * 4
    add  $t2, $t2, $t1
    mul  $t2, $t2, 4
    sw   $v0, matrix($t2)
    addi $t1, $t1, 1
    b    read_cols
next_row:
    addi $t0, $t0, 1
    b    read_rows

sums:
    li   $t1, 0                 # c = 0
col_loop:
    bge  $t1, COLS, done        # for (c = 0; c < COLS; c++) {
    li   $t3, 0                 #     sum = 0
    li   $t0, 0                 #     r = 0
row_loop:
    bge  $t0, ROWS, print_sum   #     for (r = 0; r < ROWS; r++)
    mul  $t2, $t0, COLS
    add  $t2, $t2, $t1
    mul  $t2, $t2, 4
    lw   $t4, matrix($t2)       #         sum += matrix[r][c];
    add  $t3, $t3, $t4
    addi $t0, $t0, 1
    b    row_loop
print_sum:
    move $a0, $t3               #     printf("%d", sum);
    li   $v0, 1
    syscall
    bge  $t1, COLS - 1, no_space    # if (c < COLS - 1) putchar(' ');
    li   $a0, ' '
    li   $v0, 11
    syscall
no_space:
    addi $t1, $t1, 1
    b    col_loop               # }
done:
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'Row-major order: element [r][c] is at byte offset <code>(r × COLS + c) × 4</code>. Swapping r and c in that formula reads the wrong elements but can still pass a symmetric test.',
      check: ['Uses (r * COLS + c) * 4 for the offset', 'No trailing space after the last sum']
    }
  ]);

  /* ===================== Q9: functions and recursion ===================== */

  /* For "implement this function" questions the file's main is provided;
     the sample answer is the same file with the function filled in. */
  function withFn(header, mainPart, fnPart) { return header + mainPart + fnPart; }

  var POWER_HEAD = R`# power(x, n): x to the power n, by recursive squaring
# main is provided; implement power below it.
`;
  var POWER_MAIN = R`
    .data
open:  .asciiz "power("
comma: .asciiz ", "
close: .asciiz ") = "

    .text
main:
main__prologue:
    begin                   # save $ra, $s0, $s1
    push $ra
    push $s0
    push $s1
main__body:
    li   $v0, 5             # scanf("%d", &x);
    syscall
    move $s0, $v0
    li   $v0, 5             # scanf("%d", &n);
    syscall
    move $s1, $v0

    move $a0, $s0           # result = power(x, n);
    move $a1, $s1
    jal  power
    move $t0, $v0

    la   $a0, open          # printf("power(%d, %d) = %d\n", x, n, result);
    li   $v0, 4
    syscall
    move $a0, $s0
    li   $v0, 1
    syscall
    la   $a0, comma
    li   $v0, 4
    syscall
    move $a0, $s1
    li   $v0, 1
    syscall
    la   $a0, close
    li   $v0, 4
    syscall
    move $a0, $t0
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

main__epilogue:
    pop  $s1
    pop  $s0
    pop  $ra
    end
    li   $v0, 0
    jr   $ra

`;
  var STUB = function (name) {
    return R`# ` + name + R`: PUT YOUR CODE HERE
` + name + R`:
    li   $v0, 42
    jr   $ra
`;
  };

  var WAYS_HEAD = R`# ways(n): the number of ways to climb n stairs taking 1, 2 or 3 at a time
# main is provided; implement ways below it.
`;
  var WAYS_MAIN = R`
    .data
msg: .asciiz " stairs: "

    .text
main:
main__prologue:
    begin
    push $ra
    push $s0
main__body:
    li   $v0, 5             # scanf("%d", &n);
    syscall
    move $s0, $v0

    move $a0, $s0           # result = ways(n);
    jal  ways
    move $t0, $v0

    move $a0, $s0           # printf("%d stairs: %d\n", n, result);
    li   $v0, 1
    syscall
    la   $a0, msg
    li   $v0, 4
    syscall
    move $a0, $t0
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

main__epilogue:
    pop  $s0
    pop  $ra
    end
    li   $v0, 0
    jr   $ra

`;
  var MAX_HEAD = R`# max(a, n): the largest of a[0..n-1], recursively
# main is provided; implement max below it.
`;
  var MAX_MAIN = R`
    .data
numbers: .space 400         # int numbers[100];
msg:     .asciiz "max = "

    .text
main:
main__prologue:
    begin
    push $ra
    push $s0
main__body:
    li   $v0, 5             # scanf("%d", &n);
    syscall
    move $s0, $v0

    li   $t0, 0             # for (i = 0; i < n; i++)
read:
    bge  $t0, $s0, call
    li   $v0, 5             #     scanf("%d", &numbers[i]);
    syscall
    mul  $t1, $t0, 4
    sw   $v0, numbers($t1)
    addi $t0, $t0, 1
    b    read
call:
    la   $a0, numbers       # result = max(numbers, n);
    move $a1, $s0
    jal  max
    move $t0, $v0

    la   $a0, msg           # printf("max = %d\n", result);
    li   $v0, 4
    syscall
    move $a0, $t0
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

main__epilogue:
    pop  $s0
    pop  $ra
    end
    li   $v0, 0
    jr   $ra

`;

  add([
    {
      id: 'm-power', slot: 'q9', title: 'Recursive power', file: 'power.s',
      task: '<p>You have been given <code>power.s</code>, which contains <code>main</code> from the C program below. Implement the function <code>power</code> in MIPS. It must be recursive, as in the C, and follow the MIPS calling conventions.</p>',
      c: R`#include <stdio.h>

int power(int x, int n) {
    if (n == 0) {
        return 1;
    }
    int half = power(x, n / 2);
    if (n % 2 == 1) {
        return half * half * x;
    }
    return half * half;
}

int main(void) {
    int x, n;
    scanf("%d", &x);
    scanf("%d", &n);
    printf("power(%d, %d) = %d\n", x, n, power(x, n));
    return 0;
}`,
      starter: withFn(POWER_HEAD, POWER_MAIN, STUB('power')),
      ref: function (s) { var v = ints(s); var p = function (x, n) { if (n === 0) return 1; var h = p(x, trunc(n, 2)); return n % 2 === 1 ? Math.imul(Math.imul(h, h), x) : Math.imul(h, h); }; return 'power(' + v[0] + ', ' + v[1] + ') = ' + p(v[0], v[1]) + '\n'; },
      cases: ['2\n10\n', '3\n5\n', '-2\n3\n'],
      hidden: ['7\n0\n', '1\n1000\n', '2\n30\n', '-3\n7\n', '10\n9\n'],
      restrictions: ['power must be recursive, as in the C program.', 'You must follow the MIPS calling conventions: arguments in $a0/$a1, result in $v0, and $s registers and $ra preserved across calls.'],
      model: withFn(POWER_HEAD, POWER_MAIN, R`# power(x, n) — x in $a0, n in $a1, result in $v0
power:
power__prologue:
    begin                   # save $ra, $s0, $s1
    push $ra
    push $s0
    push $s1
power__body:
    move $s0, $a0           # x survives the recursive call in $s0
    move $s1, $a1           # n survives in $s1

    li   $v0, 1             # if (n == 0) return 1;
    beqz $s1, power__epilogue

    div  $a1, $s1, 2        # half = power(x, n / 2);   ($a0 is still x)
    jal  power
    mul  $v0, $v0, $v0      # half * half

    rem  $t0, $s1, 2        # if (n % 2 == 1) result *= x;
    bne  $t0, 1, power__epilogue
    mul  $v0, $v0, $s0

power__epilogue:
    pop  $s1
    pop  $s0
    pop  $ra
    end
    jr   $ra
`),
      notes: 'Anything needed <i>after</i> a <code>jal</code> must be in an <code>$s</code> register (saved in the prologue) or on the stack: <code>$t</code> and <code>$a</code> registers may be overwritten by the call. main keeps x and n in $s0/$s1, so a power that clobbers them without restoring prints the wrong header. Pop in the reverse order of the pushes: the stack is last in, first out.',
      check: ['Saves and restores $ra and every $s register it uses', 'Recursive, and every return path goes through the epilogue: pop in the reverse order of the pushes, then end']
    },
    {
      id: 'm-ways', slot: 'q9', title: 'Climbing stairs, recursively', file: 'ways.s',
      task: '<p>You have been given <code>ways.s</code>, which contains <code>main</code>. Implement the recursive function <code>ways</code> in MIPS, following the calling conventions. 0 ≤ n ≤ 15.</p>',
      c: R`#include <stdio.h>

// the number of ways to climb n stairs taking 1, 2 or 3 at a time
int ways(int n) {
    if (n < 0) {
        return 0;
    }
    if (n == 0) {
        return 1;
    }
    return ways(n - 1) + ways(n - 2) + ways(n - 3);
}

int main(void) {
    int n;
    scanf("%d", &n);
    printf("%d stairs: %d\n", n, ways(n));
    return 0;
}`,
      starter: withFn(WAYS_HEAD, WAYS_MAIN, STUB('ways')),
      ref: function (s) { var n = ints(s)[0]; var w = function (k) { return k < 0 ? 0 : k === 0 ? 1 : w(k - 1) + w(k - 2) + w(k - 3); }; return n + ' stairs: ' + w(n) + '\n'; },
      cases: ['3\n', '4\n', '0\n'],
      hidden: ['10\n', '1\n', '2\n', '15\n'],
      restrictions: ['ways must be recursive, as in the C program.', 'You must follow the MIPS calling conventions.'],
      model: withFn(WAYS_HEAD, WAYS_MAIN, R`# ways(n) — n in $a0, result in $v0
ways:
ways__prologue:
    begin                   # $s0 = n, $s1 = running total
    push $ra
    push $s0
    push $s1
ways__body:
    move $s0, $a0
    li   $v0, 0             # if (n < 0) return 0;
    bltz $s0, ways__epilogue
    li   $v0, 1             # if (n == 0) return 1;
    beqz $s0, ways__epilogue

    addi $a0, $s0, -1       # total = ways(n - 1);
    jal  ways
    move $s1, $v0
    addi $a0, $s0, -2       # total += ways(n - 2);
    jal  ways
    add  $s1, $s1, $v0
    addi $a0, $s0, -3       # total += ways(n - 3);
    jal  ways
    add  $v0, $s1, $v0      # return total;

ways__epilogue:
    pop  $s1
    pop  $s0
    pop  $ra
    end
    jr   $ra
`),
      notes: 'The running total must survive two more calls, so it lives in a saved register too. Keeping it in <code>$t0</code> works only by luck, and fails as soon as a call uses $t0.',
      check: ['Partial sums are kept in saved registers or on the stack, not $t registers', 'Every return path branches to ways__epilogue rather than returning early with jr']
    },
    {
      id: 'm-maxrec', slot: 'q9', title: 'Recursive array maximum', file: 'max.s',
      task: '<p>You have been given <code>max.s</code>, which contains <code>main</code>. Implement the recursive function <code>max</code> in MIPS. Its first argument is the address of the array. 1 ≤ n ≤ 100.</p>',
      c: R`#include <stdio.h>

#define MAX 100
int numbers[MAX];

int max(int a[], int n) {
    if (n == 1) {
        return a[0];
    }
    int rest = max(a, n - 1);
    if (a[n - 1] > rest) {
        return a[n - 1];
    }
    return rest;
}

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &numbers[i]);
    }
    printf("max = %d\n", max(numbers, n));
    return 0;
}`,
      starter: withFn(MAX_HEAD, MAX_MAIN, STUB('max')),
      ref: function (s) { var v = ints(s); return 'max = ' + Math.max.apply(null, v.slice(1, v[0] + 1)) + '\n'; },
      cases: ['5\n3\n9\n2\n7\n4\n', '1\n-6\n', '4\n-8\n-3\n-5\n-9\n'],
      hidden: ['3\n1\n2\n3\n', '3\n3\n2\n1\n', '6\n0\n0\n0\n0\n0\n1\n', '2\n-2147483648\n-2147483647\n'],
      restrictions: ['max must be recursive and take the array address in $a0, as in the C program.', 'You must follow the MIPS calling conventions.'],
      model: withFn(MAX_HEAD, MAX_MAIN, R`# max(a, n) — array address in $a0, n in $a1, result in $v0
max:
max__prologue:
    begin                   # $s0 = a, $s1 = n
    push $ra
    push $s0
    push $s1
max__body:
    move $s0, $a0
    move $s1, $a1

    lw   $v0, 0($s0)        # if (n == 1) return a[0];
    beq  $s1, 1, max__epilogue

    addi $a1, $s1, -1       # rest = max(a, n - 1);   ($a0 is still a)
    jal  max

    addi $t0, $s1, -1       # a[n - 1]
    mul  $t0, $t0, 4
    add  $t0, $t0, $s0
    lw   $t1, ($t0)
    ble  $t1, $v0, max__epilogue   # if (a[n - 1] > rest) return a[n - 1];
    move $v0, $t1

max__epilogue:
    pop  $s1
    pop  $s0
    pop  $ra
    end
    jr   $ra
`),
      notes: 'The array is passed by address, so elements are loaded relative to <code>$a0</code> (saved in $s0), not by the label <code>numbers</code>. Hard-coding the label passes the tests but breaks the restriction, and a marker will see it.',
      check: ['Indexes through the address argument, not the numbers label', 'Recursive']
    },
    {
      id: 'm-primes', slot: 'q9', title: 'Primes with a helper function', file: 'primes.s',
      task: '<p>Write <code>primes.s</code>, equivalent to this C program. Keep <code>is_prime</code> as a separate function called with <code>jal</code>.</p>',
      c: R`#include <stdio.h>

int is_prime(int n) {
    if (n < 2) {
        return 0;
    }
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    int limit;
    scanf("%d", &limit);

    int count = 0;
    for (int i = 2; i <= limit; i++) {
        if (is_prime(i)) {
            printf("%d\n", i);
            count++;
        }
    }
    printf("%d primes\n", count);
    return 0;
}`,
      starter: readPrint('read a number and print it — change it to print the primes up to that number'),
      ref: function (s) { var lim = ints(s)[0], o = '', c = 0; for (var i = 2; i <= lim; i++) { var p = true; for (var d = 2; d * d <= i; d++) if (i % d === 0) { p = false; break; } if (p) { o += i + '\n'; c++; } } return o + c + ' primes\n'; },
      cases: ['10\n', '2\n', '1\n'],
      hidden: ['30\n', '100\n', '3\n'],
      restrictions: ['is_prime must be a separate function, called with jal, as in the C program.', 'You must follow the MIPS calling conventions.'],
      model: R`# print the primes up to a limit, using an is_prime function

    .data
primes_msg: .asciiz " primes\n"

    .text
main:
main__prologue:
    begin                   # $s0 = limit, $s1 = count, $s2 = i
    push $ra
    push $s0
    push $s1
    push $s2
main__body:
    li   $v0, 5             # scanf("%d", &limit);
    syscall
    move $s0, $v0           # limit
    li   $s1, 0             # count = 0
    li   $s2, 2             # i = 2
loop:
    bgt  $s2, $s0, done     # for (i = 2; i <= limit; i++) {
    move $a0, $s2           #     if (is_prime(i)) {
    jal  is_prime
    beqz $v0, next
    move $a0, $s2           #         printf("%d\n", i);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall
    addi $s1, $s1, 1        #         count++;
next:
    addi $s2, $s2, 1
    b    loop               # }
done:
    move $a0, $s1           # printf("%d primes\n", count);
    li   $v0, 1
    syscall
    la   $a0, primes_msg
    li   $v0, 4
    syscall

main__epilogue:
    pop  $s2
    pop  $s1
    pop  $s0
    pop  $ra
    end
    li   $v0, 0
    jr   $ra

# is_prime(n) — n in $a0, returns 1 or 0 in $v0
# a leaf function: it calls nothing, so it may use $t registers freely
is_prime:
    li   $v0, 0
    blt  $a0, 2, is_prime_return    # if (n < 2) return 0;
    li   $t0, 2                     # d = 2
is_prime_loop:
    mul  $t1, $t0, $t0              # while (d * d <= n) {
    bgt  $t1, $a0, is_prime_yes
    rem  $t2, $a0, $t0              #     if (n % d == 0) return 0;
    beqz $t2, is_prime_return
    addi $t0, $t0, 1                #     d++;
    b    is_prime_loop              # }
is_prime_yes:
    li   $v0, 1                     # return 1;
is_prime_return:
    jr   $ra
`,
      notes: 'main calls a function, so main must save <code>$ra</code>, and its loop variables must be in <code>$s</code> registers. is_prime calls nothing, so it needs no stack frame and can use $t registers.',
      check: ['main saves $ra (it is overwritten by jal)', 'Loop variables in main are in $s registers']
    },
    {
      id: 'm-bsearch', slot: 'q9', title: 'Recursive binary search', file: 'bsearch.s',
      task: '<p>Write <code>bsearch.s</code>, equivalent to this C program. It reads n, then n targets, and prints the index of each in the sorted array (or −1). Keep <code>search</code> recursive.</p>',
      c: R`#include <stdio.h>

int sorted[16] = {-20, -7, -3, 0, 2, 5, 8, 13, 21, 34, 40, 55, 61, 77, 89, 100};

int search(int target, int lo, int hi) {
    if (lo > hi) {
        return -1;
    }
    int mid = (lo + hi) / 2;
    if (sorted[mid] == target) {
        return mid;
    }
    if (sorted[mid] < target) {
        return search(target, mid + 1, hi);
    }
    return search(target, lo, mid - 1);
}

int main(void) {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int target;
        scanf("%d", &target);
        printf("%d\n", search(target, 0, 15));
    }
    return 0;
}`,
      starter: R`# binary search — write main and a recursive search function

    .data
sorted: .word -20, -7, -3, 0, 2, 5, 8, 13, 21, 34, 40, 55, 61, 77, 89, 100

    .text
main:
    li   $v0, 0
    jr   $ra
`,
      ref: function (s) { var arr = [-20, -7, -3, 0, 2, 5, 8, 13, 21, 34, 40, 55, 61, 77, 89, 100]; var v = ints(s), o = ''; for (var i = 1; i <= v[0]; i++) o += arr.indexOf(v[i]) + '\n'; return o; },
      cases: ['3\n13\n-20\n100\n', '2\n4\n0\n', '1\n-21\n'],
      hidden: ['5\n55\n89\n101\n-7\n6\n', '4\n2\n5\n8\n21\n'],
      restrictions: ['search must be recursive, as in the C program.', 'You must follow the MIPS calling conventions.'],
      model: R`# binary search a sorted array for each target read

    .data
sorted: .word -20, -7, -3, 0, 2, 5, 8, 13, 21, 34, 40, 55, 61, 77, 89, 100

    .text
main:
main__prologue:
    begin                   # $s0 = n, $s1 = i
    push $ra
    push $s0
    push $s1
main__body:
    li   $v0, 5             # scanf("%d", &n);
    syscall
    move $s0, $v0
    li   $s1, 0             # i = 0
main_loop:
    bge  $s1, $s0, main__epilogue   # for (i = 0; i < n; i++) {
    li   $v0, 5                 #     scanf("%d", &target);
    syscall
    move $a0, $v0               #     search(target, 0, 15)
    li   $a1, 0
    li   $a2, 15
    jal  search
    move $a0, $v0               #     printf("%d\n", ...);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall
    addi $s1, $s1, 1
    b    main_loop              # }
main__epilogue:
    pop  $s1
    pop  $s0
    pop  $ra
    end
    li   $v0, 0
    jr   $ra

# search(target, lo, hi) — $a0, $a1, $a2; index or -1 in $v0
search:
search__prologue:
    begin                   # only $ra: nothing else is needed after the call
    push $ra
search__body:
    li   $v0, -1
    bgt  $a1, $a2, search__epilogue    # if (lo > hi) return -1;

    add  $t0, $a1, $a2      # mid = (lo + hi) / 2
    div  $t0, $t0, 2
    mul  $t1, $t0, 4
    lw   $t2, sorted($t1)   # sorted[mid]

    move $v0, $t0
    beq  $t2, $a0, search__epilogue    # if (sorted[mid] == target) return mid;

    blt  $t2, $a0, go_right
    addi $a2, $t0, -1       # return search(target, lo, mid - 1);
    jal  search
    b    search__epilogue
go_right:
    addi $a1, $t0, 1        # return search(target, mid + 1, hi);
    jal  search

search__epilogue:
    pop  $ra
    end
    jr   $ra
`,
      notes: 'The recursive call\'s result is returned unchanged, so nothing has to survive the call except <code>$ra</code>. That is why search saves only $ra. Making main a real function (saving $ra, keeping n and i in $s registers) is what the marker checks.'
    }
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
