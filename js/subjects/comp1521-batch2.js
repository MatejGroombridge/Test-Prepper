/* subjects/comp1521-batch2.js — COMP1521 Batch 2: the 20T3, 22T2 and 22T3
   final exams (20T3 Q8 is left out: the paper itself says its content is no
   longer in the course). Question text, examples and restrictions are the
   papers'; sample answers are ours.

   The papers' starter files and test harnesses were not provided, so the
   ones here are reconstructed to fit each question and are flagged as such
   in the question. MIPS answers run in the browser simulator against tests
   whose expected output is computed by `ref`, a JavaScript model of the C
   reference, so they never depend on the sample answer being right.

   Items use the same shapes as comp1521-mips.js and comp1521-c.js, plus
   `paper` ('20T3' | '22T2' | '22T3'), `batch: 2`, and for MIPS optionally
   `link` (another provided .s file assembled with the answer, for questions
   run as `1521 mipsy main.s answer.s`) and `cmd` (the command line shown in
   the examples). Load after comp1521-c.js, before comp1521.js. */
(function (global) {
  'use strict';

  var D = global.COMP1521Data;
  if (!D || !D.MIPS || !D.C) throw new Error('load comp1521-mips.js and comp1521-c.js before comp1521-batch2.js');
  var R = String.raw;

  /* A note for questions whose provided files are reconstructed. */
  function recon(what, extra) {
    return '<p class="small muted"><b>Reconstructed:</b> ' + what + ' did not come with the paper, so the version here is written to fit the question and may differ in detail from the original.' + (extra ? ' ' + extra : '') + '</p>';
  }
  var RECON = recon('The provided starter file');

  /* Marks as printed on each paper: 20T3 gives Q1 10 and the rest 9;
     22T2 and 22T3 give every question 10. */
  function paperMarks(paper, qn) { return paper === '20T3' ? (qn === 1 ? 10 : 9) : 10; }
  function tag(paper, it) {
    it.paper = paper; it.batch = 2;
    it.paperMarks = paperMarks(paper, it.qn);
    it.src = paper + ' final, question ' + it.qn + ' (' + it.paperMarks + ' marks)';
  }
  function mips(paper, items) { items.forEach(function (it) { tag(paper, it); D.MIPS.push(it); }); }
  function cq(paper, items) { items.forEach(function (it) { tag(paper, it); D.C.push(it); }); }

  function ints(stdin) {
    return stdin.split('\n').filter(function (l) { return l.trim() !== ''; }).map(function (l) { return parseInt(l, 10); });
  }

  /* The papers' usual MIPS starters. */
  function readPrint(comment) {
    return R`# ` + comment + R`

main:
    li   $v0, 5         #   scanf("%d", &x);
    syscall
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
  function readPrint42(comment) {
    return R`# ` + comment + R`

main:
    li   $v0, 5         #   scanf("%d", &x);
    syscall
    move $t0, $v0

    li   $a0, 42        #   printf("%d\n", 42);
    li   $v0, 1
    syscall

    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0         #   return 0
    jr   $ra
`;
  }

  /* Common restriction lines. */
  var MIPS_ONLY = 'Your solution must be in MIPS assembler only.';
  var NO_EXEC = 'You are not permitted to run external programs: no system, popen, posix_spawn, fork or exec.';
  var NO_EXEC22 = 'Your program cannot call external programs, or use any of: fork()/exec(), posix_spawn(), system(), or any other similar functions.';

  /* ===================================================================== */
  /*                            20T3 — MIPS                                 */
  /* ===================================================================== */

  /* 20T3 Q7 and Q9 give a whole program with one or more functions missing.
     The arrays are C variable-length arrays, so main allocates them on the
     stack. */
  var Q7_HEAD = R`# COMP1521 20T3 final exam Q7
# main, read_array and print_array are supplied; implement reflect.
`;
  var Q7_MAIN = R`
# void reflect(int rows, int cols, int a[rows][cols], int b[cols][rows]);
#   rows in $a0, cols in $a1, a in $a2, b in $a3

main:
main__prologue:
    begin
    push $ra
    push $s0
    push $s1
    push $s2
    push $s3
main__body:
    li   $v0, 5                 # scanf("%d", &rows);
    syscall
    move $s0, $v0
    li   $v0, 5                 # scanf("%d", &cols);
    syscall
    move $s1, $v0

    mul  $t0, $s0, $s1          # int array1[rows][cols];  (on the stack)
    mul  $t0, $t0, 4
    sub  $sp, $sp, $t0
    move $s2, $sp
    sub  $sp, $sp, $t0          # int array2[cols][rows];
    move $s3, $sp

    move $a0, $s0               # read_array(rows, cols, array1);
    move $a1, $s1
    move $a2, $s2
    jal  read_array

    move $a0, $s0               # reflect(rows, cols, array1, array2);
    move $a1, $s1
    move $a2, $s2
    move $a3, $s3
    jal  reflect

    move $a0, $s0               # print_array(rows, cols, array1);
    move $a1, $s1
    move $a2, $s2
    jal  print_array

    li   $a0, '\n'              # printf("\n");
    li   $v0, 11
    syscall

    move $a0, $s1               # print_array(cols, rows, array2);
    move $a1, $s0
    move $a2, $s3
    jal  print_array

main__epilogue:
    addi $sp, $fp, -20          # free the arrays: back to the saved registers
    pop  $s3
    pop  $s2
    pop  $s1
    pop  $s0
    pop  $ra
    end
    li   $v0, 0
    jr   $ra


# void read_array(int rows, int cols, int a[rows][cols])
read_array:
    li   $t0, 0                 # r = 0
read_array__rows:
    bge  $t0, $a0, read_array__end
    li   $t1, 0                 # c = 0
read_array__cols:
    bge  $t1, $a1, read_array__next
    move $t2, $a0               # scanf("%d", &a[r][c]);  ($a0 is needed by the syscall)
    li   $v0, 5
    syscall
    mul  $t3, $t0, $a1          # &a[r][c] = a + (r * cols + c) * 4
    add  $t3, $t3, $t1
    mul  $t3, $t3, 4
    add  $t3, $t3, $a2
    sw   $v0, ($t3)
    move $a0, $t2
    addi $t1, $t1, 1
    b    read_array__cols
read_array__next:
    addi $t0, $t0, 1
    b    read_array__rows
read_array__end:
    jr   $ra


# void print_array(int rows, int cols, int a[rows][cols])
print_array:
    move $t9, $a0               # rows ($a0 is needed by the syscalls)
    li   $t0, 0                 # r = 0
print_array__rows:
    bge  $t0, $t9, print_array__end
    li   $t1, 0                 # c = 0
print_array__cols:
    bge  $t1, $a1, print_array__next
    mul  $t3, $t0, $a1          # printf("%d ", a[r][c]);
    add  $t3, $t3, $t1
    mul  $t3, $t3, 4
    add  $t3, $t3, $a2
    lw   $a0, ($t3)
    li   $v0, 1
    syscall
    li   $a0, ' '
    li   $v0, 11
    syscall
    addi $t1, $t1, 1
    b    print_array__cols
print_array__next:
    li   $a0, '\n'              # printf("\n");
    li   $v0, 11
    syscall
    addi $t0, $t0, 1
    b    print_array__rows
print_array__end:
    jr   $ra

`;
  var Q7_STUB = R`
# void reflect(int rows, int cols, int a[rows][cols], int b[cols][rows])
reflect:
    # PUT YOUR CODE FOR reflect HERE

    jr   $ra
`;

  var Q9_HEAD = R`# COMP1521 20T3 final exam Q9
# main, read_array and print_array are supplied;
# implement sort, partition and swap.
`;
  var Q9_MAIN = R`
main:
main__prologue:
    begin
    push $ra
    push $s0
    push $s1
main__body:
    li   $v0, 5                 # scanf("%d", &size);
    syscall
    move $s0, $v0

    mul  $t0, $s0, 4            # int array[size];  (on the stack)
    sub  $sp, $sp, $t0
    move $s1, $sp

    move $a0, $s0               # read_array(size, array);
    move $a1, $s1
    jal  read_array

    move $a0, $s0               # sort(size, array);
    move $a1, $s1
    jal  sort

    move $a0, $s0               # print_array(size, array);
    move $a1, $s1
    jal  print_array

main__epilogue:
    addi $sp, $fp, -12          # free the array: back to the saved registers
    pop  $s1
    pop  $s0
    pop  $ra
    end
    li   $v0, 0
    jr   $ra


# void read_array(int n, int a[])
read_array:
    move $t9, $a0
    li   $t0, 0                 # i = 0
read_array__loop:
    bge  $t0, $t9, read_array__end
    li   $v0, 5                 # scanf("%d", &a[i]);
    syscall
    mul  $t1, $t0, 4
    add  $t1, $t1, $a1
    sw   $v0, ($t1)
    addi $t0, $t0, 1
    b    read_array__loop
read_array__end:
    jr   $ra


# void print_array(int n, int a[])
print_array:
    move $t9, $a0
    li   $t0, 0                 # i = 0
print_array__loop:
    bge  $t0, $t9, print_array__end
    mul  $t1, $t0, 4            # printf("%d ", a[i]);
    add  $t1, $t1, $a1
    lw   $a0, ($t1)
    li   $v0, 1
    syscall
    li   $a0, ' '
    li   $v0, 11
    syscall
    addi $t0, $t0, 1
    b    print_array__loop
print_array__end:
    li   $a0, '\n'              # printf("\n");
    li   $v0, 11
    syscall
    jr   $ra

`;
  var Q9_STUBS = R`
# void sort(int n, int a[])
sort:
    # PUT YOUR CODE FOR sort HERE
    jr   $ra


# int partition(int n, int a[])
partition:
    # PUT YOUR CODE FOR partition HERE
    jr   $ra


# void swap(int *x, int *y)
swap:
    # PUT YOUR CODE FOR swap HERE
    jr   $ra
`;

  mips('20T3', [
    {
      id: 'p20t3-q1', qn: 1, slot: 'q1', title: '(x + y) * (x − y)', file: '20t3final_q1.s',
      task: '<p>You have been given <code>20t3final_q1.s</code>, a MIPS assembler program that reads one number and then prints it.</p><p>Add code to <code>20t3final_q1.s</code> to make it equivalent to this C program. In other words, it should read two numbers, x and y, and print (x + y) * (x − y).</p>',
      c: R`// COMP1521 20T3 final exam Q1 C reference

// print (x + y) * (x - y)

#include <stdio.h>

int main(void) {
    int x, y;

    scanf("%d", &x);
    scanf("%d", &y);
    printf("%d\n", (x + y) * (x - y));

    return 0;
}`,
      starter: readPrint('COMP1521 20T3 final exam Q1: read a number and print it'),
      ref: function (s) { var v = ints(s); return Math.imul(v[0] + v[1], v[0] - v[1]) + '\n'; },
      cases: ['5\n8\n', '6\n5\n', '5\n6\n', '42\n42\n'],
      hidden: ['-3\n7\n', '0\n0\n', '1000\n-1\n', '-20\n-30\n'],
      restrictions: ['No error checking is required.', 'Your program can assume its input always contains two integers, and only two integers.', 'Your program should print one and only one line of output: one integer, a newline, and nothing else.', 'You can assume overflow/underflow does not occur.', 'Your solution must be in 20t3final_q1.s.'],
      model: R`# COMP1521 20T3 final exam Q1: print (x + y) * (x - y)

main:
    li   $v0, 5             # scanf("%d", &x);
    syscall
    move $t0, $v0

    li   $v0, 5             # scanf("%d", &y);
    syscall
    move $t1, $v0

    add  $t2, $t0, $t1      # x + y
    sub  $t3, $t0, $t1      # x - y
    mul  $a0, $t2, $t3      # printf("%d\n", (x + y) * (x - y));
    li   $v0, 1
    syscall

    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0             # return 0
    jr   $ra
`,
      notes: 'The second read overwrites <code>$v0</code>, so move the first number somewhere safe before reading again.'
    },
    {
      id: 'p20t3-q4', qn: 4, slot: 'q4', title: 'Low and high meet', file: '20t3final_q4.s',
      task: '<p>You have been given <code>20t3final_q4.s</code>, a MIPS assembler program that reads one number and then prints it.</p><p>Add code to <code>20t3final_q4.s</code> to make it equivalent to this C program. In other words, it should read numbers until low is greater or equal to high, and print low − high.</p>',
      c: R`// COMP1521 20T3 final exam Q4 C reference

// print low - high

#include <stdio.h>

int main(void) {
    int low = 0;
    int high = 100;
    while (low < high) {
        int x;
        scanf("%d", &x);
        low = low + x;
        high = high - x;
    }
    printf("%d\n", low - high);
    return 0;
}`,
      starter: readPrint('COMP1521 20T3 final exam Q4: read a number and print it'),
      ref: function (s) { var v = ints(s), low = 0, high = 100, i = 0; while (low < high) { low += v[i]; high -= v[i]; i++; } return (low - high) + '\n'; },
      cases: ['10\n20\n25\n', '1\n2\n4\n8\n16\n32\n', '100\n', '10\n10\n10\n10\n10\n'],
      hidden: ['50\n', '49\n1\n', '-10\n80\n', '3\n3\n3\n3\n3\n3\n3\n3\n3\n3\n3\n3\n3\n3\n3\n3\n3\n'],
      restrictions: ['No error checking is required.', 'Your program can assume its input contains only integers, one per line.', 'Your program can assume these integers will result in the program terminating.', 'You can assume overflow/underflow does not occur.'],
      model: R`# COMP1521 20T3 final exam Q4: read numbers until low >= high, print low - high

main:
    li   $t0, 0             # low = 0
    li   $t1, 100           # high = 100
loop:
    bge  $t0, $t1, end      # while (low < high) {
    li   $v0, 5             #     scanf("%d", &x);
    syscall
    add  $t0, $t0, $v0      #     low = low + x;
    sub  $t1, $t1, $v0      #     high = high - x;
    b    loop               # }
end:
    sub  $a0, $t0, $t1      # printf("%d\n", low - high);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0             # return 0
    jr   $ra
`,
      notes: 'Test the condition at the top of the loop, as the C does: branch out on the opposite condition (<code>bge</code> for <code>low &lt; high</code>).'
    },
    {
      id: 'p20t3-q7', qn: 7, slot: 'q7', title: 'Reflect a 2D array', file: '20t3final_q7.s',
      task: '<p>You have been given <code>20t3final_q7.s</code>, a MIPS assembler program which implements all but one function of this C program.</p><p>The function which has not been implemented is named <code>reflect</code>. Add MIPS instructions for the function reflect to <code>20t3final_q7.s</code>. There are comments in <code>20t3final_q7.s</code> which indicate where the MIPS instructions should be added. <code>20t3final_q7.s</code> should then be equivalent to the C program.</p>' + RECON,
      c: R`// COMP1521 20T3 final exam Q7 C reference

#include <stdio.h>

void read_array(int rows, int cols, int a[rows][cols]);
void reflect(int rows, int cols, int a[rows][cols], int b[cols][rows]);
void print_array(int rows, int cols, int a[rows][cols]);

int main(void) {
    int rows;
    int cols;
    scanf("%d", &rows);
    scanf("%d", &cols);
    int array1[rows][cols];
    int array2[cols][rows];
    read_array(rows, cols, array1);
    reflect(rows, cols, array1, array2);
    print_array(rows, cols, array1);
    printf("\n");
    print_array(cols, rows, array2);
}

void read_array(int rows, int cols, int a[rows][cols]) {
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            scanf("%d", &a[r][c]);
        }
    }
}

void reflect(int rows, int cols, int a[rows][cols], int b[cols][rows]) {
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            b[c][r] = a[r][c];
        }
    }
}

void print_array(int rows, int cols, int a[rows][cols]) {
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            printf("%d ", a[r][c]);
        }
        printf("\n");
    }
}`,
      starter: Q7_HEAD + Q7_MAIN + Q7_STUB,
      ref: function (s) {
        var v = ints(s), rows = v[0], cols = v[1], a = v.slice(2), out = '', r, c;
        for (r = 0; r < rows; r++) { for (c = 0; c < cols; c++) out += a[r * cols + c] + ' '; out += '\n'; }
        out += '\n';
        for (c = 0; c < cols; c++) { for (r = 0; r < rows; r++) out += a[r * cols + c] + ' '; out += '\n'; }
        return out;
      },
      cases: ['1\n2\n45\n37\n', '3\n2\n14\n15\n16\n17\n18\n19\n', '5\n2\n0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n'],
      hidden: ['1\n1\n7\n', '2\n3\n1\n2\n3\n4\n5\n6\n', '4\n4\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n', '3\n1\n-1\n0\n-5\n'],
      restrictions: ['No error checking is required.', 'DO NOT CHANGE the supplied code for the functions: main, read_array, or print_array.', 'You only have to implement the function reflect.', 'You can assume the supplied code works.'],
      model: Q7_HEAD + Q7_MAIN + R`
# void reflect(int rows, int cols, int a[rows][cols], int b[cols][rows])
#   rows in $a0, cols in $a1, a in $a2, b in $a3
# A leaf function (it calls nothing), so $t registers are enough.
reflect:
    li   $t0, 0                 # r = 0
reflect__rows:
    bge  $t0, $a0, reflect__end # for (r = 0; r < rows; r++)
    li   $t1, 0                 #     c = 0
reflect__cols:
    bge  $t1, $a1, reflect__next    # for (c = 0; c < cols; c++)

    mul  $t2, $t0, $a1          #         &a[r][c] = a + (r * cols + c) * 4
    add  $t2, $t2, $t1
    mul  $t2, $t2, 4
    add  $t2, $t2, $a2
    lw   $t3, ($t2)

    mul  $t4, $t1, $a0          #         &b[c][r] = b + (c * rows + r) * 4
    add  $t4, $t4, $t0
    mul  $t4, $t4, 4
    add  $t4, $t4, $a3
    sw   $t3, ($t4)             #         b[c][r] = a[r][c];

    addi $t1, $t1, 1
    b    reflect__cols
reflect__next:
    addi $t0, $t0, 1
    b    reflect__rows
reflect__end:
    jr   $ra
`,
      notes: 'b is a <code>cols × rows</code> array, so a row of b is <code>rows</code> ints long: <code>b[c][r]</code> is at offset <code>(c × rows + r) × 4</code>. Using <code>cols</code> there works only for square arrays, which is why the 1×2, 3×2 and 5×2 tests matter.',
      check: ['b indexed with rows as its row length', 'Leaf function: no stack frame needed, and no $s registers clobbered']
    },
    {
      id: 'p20t3-q9', qn: 9, slot: 'q9', title: 'Quicksort: sort, partition and swap', file: '20t3final_q9.s',
      task: '<p>You have been given <code>20t3final_q9.s</code>, a MIPS assembler program which implements all but 3 functions of this C program.</p><p>The functions which have not been implemented are named <code>sort</code>, <code>partition</code> and <code>swap</code>. Add MIPS instructions for the functions sort, partition and swap to <code>20t3final_q9.s</code>. There are comments in <code>20t3final_q9.s</code> which indicate where the MIPS instructions should be added. <code>20t3final_q9.s</code> should then be equivalent to the above C program.</p>' + RECON,
      c: R`// COMP1521 20T3 final exam Q9 C reference

#include <stdio.h>

void sort(int n, int a[]);
int partition(int n, int a[]);
void swap(int *x, int *y);
void read_array(int n, int a[n]);
void print_array(int n, int a[n]);

int main(void) {
    int size;
    scanf("%d", &size);
    int array[size];
    read_array(size, array);
    sort(size, array);
    print_array(size, array);
}

void sort(int n, int a[]) {
    if (n > 1) {
        int p = partition(n, a);
        sort(p, a);
        sort(n - (p + 1), a + p + 1);
    }
}

int partition(int n, int a[]) {
    int pivot_value = a[n - 1];
    int i = 0;
    for (int j = 0; j < n; j++) {
        if (a[j] < pivot_value) {
            swap(&a[i], &a[j]);
            i = i + 1;
        }
    }
    swap(&a[i], &a[n - 1]);
    return i;
}

void swap(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}

void read_array(int n, int a[]) {
    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }
}

void print_array(int n, int a[]) {
    for (int i = 0; i < n; i++) {
        printf("%d ", a[i]);
    }
    printf("\n");
}`,
      starter: Q9_HEAD + Q9_MAIN + Q9_STUBS,
      ref: function (s) { var v = ints(s), a = v.slice(1, 1 + v[0]).sort(function (x, y) { return x - y; }); return a.map(function (x) { return x + ' '; }).join('') + '\n'; },
      cases: ['3\n15\n18\n9\n', '4\n19\n4\n81\n1\n', '5\n9\n4\n8\n1\n7\n'],
      hidden: ['1\n42\n', '6\n3\n3\n1\n1\n2\n2\n', '8\n8\n7\n6\n5\n4\n3\n2\n1\n', '7\n-5\n10\n0\n-20\n10\n3\n-5\n', '10\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n'],
      restrictions: ['You must implement functions sort, partition, and swap equivalent to the supplied C.', 'No marks will be given for implementing other functions.', 'No marks will be given for implementing other sorting algorithms.', 'No error checking is required.', 'DO NOT CHANGE the supplied code for main, read_array, and print_array.', 'You can assume the supplied code works.'],
      model: Q9_HEAD + Q9_MAIN + R`
# void sort(int n, int a[])  —  n in $a0, a in $a1
sort:
sort__prologue:
    begin
    push $ra
    push $s0
    push $s1
    push $s2
sort__body:
    move $s0, $a0               # n and a are needed after the calls
    move $s1, $a1
    ble  $s0, 1, sort__epilogue # if (n > 1) {

    jal  partition              #     p = partition(n, a);   ($a0, $a1 unchanged)
    move $s2, $v0

    move $a0, $s2               #     sort(p, a);
    move $a1, $s1
    jal  sort

    addi $t0, $s2, 1            #     sort(n - (p + 1), a + p + 1);
    sub  $a0, $s0, $t0
    mul  $t0, $t0, 4            #     (a + p + 1 is a byte address: scale by 4)
    add  $a1, $s1, $t0
    jal  sort                   # }

sort__epilogue:
    pop  $s2
    pop  $s1
    pop  $s0
    pop  $ra
    end
    jr   $ra


# int partition(int n, int a[])  —  n in $a0, a in $a1, result in $v0
partition:
partition__prologue:
    begin
    push $ra
    push $s0
    push $s1
    push $s2
    push $s3
    push $s4
partition__body:
    move $s0, $a0               # n
    move $s1, $a1               # a
    addi $t0, $s0, -1           # pivot_value = a[n - 1];
    mul  $t0, $t0, 4
    add  $t0, $t0, $s1
    lw   $s2, ($t0)
    li   $s3, 0                 # i = 0
    li   $s4, 0                 # j = 0
partition__loop:
    bge  $s4, $s0, partition__done  # for (j = 0; j < n; j++) {
    mul  $t1, $s4, 4
    add  $t1, $t1, $s1          #     &a[j]
    lw   $t2, ($t1)
    bge  $t2, $s2, partition__next  # if (a[j] < pivot_value) {
    mul  $a0, $s3, 4            #         swap(&a[i], &a[j]);
    add  $a0, $a0, $s1
    move $a1, $t1
    jal  swap
    addi $s3, $s3, 1            #         i = i + 1;
partition__next:                #     }
    addi $s4, $s4, 1
    b    partition__loop        # }
partition__done:
    mul  $a0, $s3, 4            # swap(&a[i], &a[n - 1]);
    add  $a0, $a0, $s1
    addi $a1, $s0, -1
    mul  $a1, $a1, 4
    add  $a1, $a1, $s1
    jal  swap
    move $v0, $s3               # return i;

partition__epilogue:
    pop  $s4
    pop  $s3
    pop  $s2
    pop  $s1
    pop  $s0
    pop  $ra
    end
    jr   $ra


# void swap(int *x, int *y)  —  x in $a0, y in $a1 (a leaf: no frame needed)
swap:
    lw   $t0, ($a0)             # temp = *x;
    lw   $t1, ($a1)
    sw   $t1, ($a0)             # *x = *y;
    sw   $t0, ($a1)             # *y = temp;
    jr   $ra
`,
      notes: 'Everything partition uses after calling swap (n, a, the pivot, i and j) must survive the call, so it lives in <code>$s</code> registers saved in the prologue. Pointer arithmetic in C counts elements, so <code>a + p + 1</code> is <code>a + (p + 1) × 4</code> bytes in MIPS. sort returns early through the epilogue so every path pops what it pushed.',
      check: ['sort and partition save and restore $ra and every $s register they use', 'sort is recursive, as in the C; partition calls swap', 'a + p + 1 scaled by 4', 'swap is a leaf function']
    }
  ]);

  /* ===================================================================== */
  /*                            22T2 — MIPS                                 */
  /* ===================================================================== */

  function zeroBits(x) { var n = 0; for (var i = 0; i < 32; i++) if (((x >>> i) & 1) === 0) n++; return n; }

  var Q4_22T2_STARTER = R`# COMP1521 22T2 ... final exam, question 4
# Reads 10 numbers into an array, then prints 42.

    .data
numbers: .word 0, 0, 0, 0, 0, 0, 0, 0, 0, 0     # int numbers[10] = { 0 };

    .text
main:
    li   $t0, 0             # i = 0;
scan_loop:
    bge  $t0, 10, scan_end  # while (i < 10) {
    li   $v0, 5             #     scanf("%d", &numbers[i]);
    syscall
    mul  $t1, $t0, 4
    sw   $v0, numbers($t1)
    addi $t0, $t0, 1        #     i++;
    b    scan_loop          # }
scan_end:

    li   $a0, 42            # printf("%d\n", 42);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0             # return 0;
    jr   $ra
`;

  /* 22T2 Q8 is assembled with a provided 22t2final_q8_main.s. That file was
     not included with the paper; this reconstruction reads the number of
     disks (the original always uses 7) so it can be tested with several
     sizes. Each tower is 7 slots plus a spare space and a 0 terminator. */
  var HANOI_MAIN = R`# 22t2final_q8_main.s — DO NOT CHANGE (reconstructed)
# main, swap and print_towers for the Towers of Hanoi.
# Each tower is a string of 7 slots (disks 'a'..'g' or ' ' for empty),
# bottom first, plus a spare ' ' and a 0 terminator.

    .data
tower1: .space 9
tower2: .space 9
tower3: .space 9
border: .asciiz "================\n"

    .text
main:
main__prologue:
    begin
    push $ra
    push $s0
main__body:
    li   $v0, 5                 # scanf("%d", &n);   (1 <= n <= 7)
    syscall
    move $s0, $v0

    li   $t0, 0                 # for (i = 0; i < 8; i++) {
main__fill:
    bge  $t0, 8, main__filled
    li   $t1, ' '               #     tower1[i] = i < n ? 'a' + n - 1 - i : ' ';
    bge  $t0, $s0, main__space
    li   $t1, 'a'
    add  $t1, $t1, $s0
    addi $t1, $t1, -1
    sub  $t1, $t1, $t0
main__space:
    sb   $t1, tower1($t0)
    li   $t1, ' '               #     tower2[i] = tower3[i] = ' ';
    sb   $t1, tower2($t0)
    sb   $t1, tower3($t0)
    addi $t0, $t0, 1
    b    main__fill             # }
main__filled:
    li   $t1, 8
    sb   $zero, tower1($t1)     # terminate the strings
    sb   $zero, tower2($t1)
    sb   $zero, tower3($t1)

    jal  print_towers           # print_towers();

    li   $a0, 'a'               # move_disks('a' + n - 1, tower2, tower1, tower3);
    add  $a0, $a0, $s0
    addi $a0, $a0, -1
    la   $a1, tower2
    la   $a2, tower1
    la   $a3, tower3
    jal  move_disks

main__epilogue:
    pop  $s0
    pop  $ra
    end
    li   $v0, 0
    jr   $ra


# void swap(char *a, char *b)
swap:
    lb   $t0, ($a0)
    lb   $t1, ($a1)
    sb   $t1, ($a0)
    sb   $t0, ($a1)
    jr   $ra


# void print_towers(void)
print_towers:
print_towers__prologue:
    begin
    push $ra
print_towers__body:
    la   $a0, border            # printf("================\n");
    li   $v0, 4
    syscall
    la   $a0, tower1            # print_tower(tower1); ... tower3
    jal  print_tower
    la   $a0, tower2
    jal  print_tower
    la   $a0, tower3
    jal  print_tower
    la   $a0, border
    li   $v0, 4
    syscall
print_towers__epilogue:
    pop  $ra
    end
    jr   $ra

# void print_tower(char *tower): "|" then 7 slots, each followed by ' ', then "|\n"
print_tower:
    move $t2, $a0
    li   $a0, '|'
    li   $v0, 11
    syscall
    li   $t3, 0
print_tower__slot:
    bge  $t3, 7, print_tower__end
    add  $t4, $t2, $t3
    lb   $a0, ($t4)
    li   $v0, 11
    syscall
    li   $a0, ' '
    syscall
    addi $t3, $t3, 1
    b    print_tower__slot
print_tower__end:
    li   $a0, '|'
    syscall
    li   $a0, '\n'
    syscall
    jr   $ra
`;

  var HANOI_STARTER = R`# COMP1521 22T2 ... final exam, question 8

	.data

# char default_char = ' ';
default_char:	.byte ' '


	.text
# void move_disks(char size, char *target, char *peg1, char *peg2) {
move_disks:
	# TODO: Complete this function
	jr	$ra


	.text
# char *find_lowest_target(char *target) {
find_lowest_target:
	# TODO: Complete this function
	jr	$ra
`;

  /* JavaScript model of 22t2final_q8.c plus the reconstructed main. */
  function hanoiRef(stdin) {
    var n = ints(stdin)[0], mem = [], out = '';
    var T1 = 0, T2 = 9, T3 = 18, DEF = 27;
    for (var i = 0; i < 8; i++) { mem[T1 + i] = i < n ? 97 + n - 1 - i : 32; mem[T2 + i] = 32; mem[T3 + i] = 32; }
    mem[T1 + 8] = mem[T2 + 8] = mem[T3 + 8] = 0; mem[DEF] = 32;
    function swap(a, b) { var t = mem[a]; mem[a] = mem[b]; mem[b] = t; }
    function line(t) { var s = '|'; for (var k = 0; k < 7; k++) s += String.fromCharCode(mem[t + k]) + ' '; return s + '|\n'; }
    function print() { out += '================\n' + line(T1) + line(T2) + line(T3) + '================\n'; }
    function lowest(t) { return mem[t] === 32 ? t : lowest(t + 1); }
    function move(size, target, peg1, peg2) {
      var pegMax = DEF, source = -1, other = -1;
      for (var i = 0; mem[peg1 + i] !== 0; i++) {
        if (mem[peg1 + i] > mem[pegMax] && mem[peg1 + i] <= size) { pegMax = peg1 + i; source = peg1; other = peg2; }
        if (mem[peg2 + i] > mem[pegMax] && mem[peg2 + i] <= size) { pegMax = peg2 + i; source = peg2; other = peg1; }
      }
      if (mem[pegMax] === 32) return;
      move(size - 1, other, source, target);
      swap(pegMax, lowest(target));
      while (mem[pegMax] !== mem[pegMax + 1]) { swap(pegMax, pegMax + 1); pegMax++; }
      print();
      move(size - 1, target, source, other);
    }
    print();
    move(97 + n - 1, T2, T1, T3);
    return out;
  }

  mips('22T2', [
    {
      id: 'p22t2-q2', qn: 2, slot: 'q3', title: 'Count zero bits in MIPS', file: '22t2final_q2.s',
      task: '<p>You have been given <code>22t2final_q2.s</code>, a MIPS assembler program that reads an integer and then prints 42.</p><p>Add code to <code>22t2final_q2.s</code> so that it prints the amount of zero bits in the integer that was read in. In other words, it should behave the same as question 1 (count the zero bits of a 32-bit value).</p>' + RECON,
      starter: readPrint42('COMP1521 22T2 ... final exam, question 2: read an integer, print 42'),
      ref: function (s) { return zeroBits(ints(s)[0]) + '\n'; },
      cases: ['0\n', '1\n', '100000\n', '-1\n'],
      hidden: ['305419896\n', '-2147483648\n', '2147483647\n', '-1431655766\n', '255\n'],
      restrictions: ['Your program can assume its input only contains only 1 integer.', 'Your program can assume that the integer will fit in a MIPS register.', 'No error checking is necessary or required.'],
      model: R`# COMP1521 22T2 final exam, question 2: count the zero bits of an integer

main:
    li   $v0, 5             # scanf("%d", &x);
    syscall
    move $t0, $v0

    li   $t1, 0             # count = 0
    li   $t2, 0             # for (i = 0; i < 32; i++) {
loop:
    bge  $t2, 32, end
    srlv $t3, $t0, $t2      #     if (((x >> i) & 1) == 0) count++;
    andi $t3, $t3, 1
    bnez $t3, next
    addi $t1, $t1, 1
next:
    addi $t2, $t2, 1
    b    loop               # }
end:
    move $a0, $t1           # printf("%d\n", count);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'Loop exactly 32 times rather than "while x != 0": a loop that stops when the remaining bits are zero never counts the leading zeros. Use <code>srlv</code> (logical), so the sign bit of a negative input does not spread.',
      check: ['Counts all 32 bits, including leading zeros', 'Logical shift (srl/srlv), not sra']
    },
    {
      id: 'p22t2-q4', qn: 4, slot: 'q7', title: 'Longest increasing run', file: '22t2final_q4.s',
      task: '<p>You have been given <code>22t2final_q4.s</code>, a MIPS program that currently reads 10 numbers and then prints 42.</p><p>Your task is to modify <code>22t2final_q4.s</code> so that it is equivalent to this C program, which prints the length of the longest consecutive sequence of strictly increasing numbers.</p>' + RECON,
      c: R`// Reads 10 numbers into an array
// Prints the length of the longest sequence
// of strictly increasing numbers in the array.

#include <stdio.h>

int main(void) {
	int i;
	int numbers[10] = { 0 };

	i = 0;
	while (i < 10) {
		scanf("%d", &numbers[i]);
		i++;
	}

	int max_run = 1;
	int current_run = 1;
	i = 1;
	while (i < 10) {
		if (numbers[i] > numbers[i - 1]) {
			current_run++;
		} else {
			current_run = 1;
		}

		if (current_run > max_run) {
			max_run = current_run;
		}

		i++;
	}

	printf("%d\n", max_run);

	return 0;
}`,
      starter: Q4_22T2_STARTER,
      ref: function (s) { var v = ints(s), best = 1, cur = 1; for (var i = 1; i < 10; i++) { cur = v[i] > v[i - 1] ? cur + 1 : 1; if (cur > best) best = cur; } return best + '\n'; },
      cases: ['1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n', '1\n2\n3\n4\n5\n6\n7\n7\n8\n9\n', '1\n2\n3\n1\n2\n4\n5\n5\n6\n6\n', '10\n9\n8\n7\n6\n5\n4\n3\n2\n1\n'],
      hidden: ['5\n5\n5\n5\n5\n5\n5\n5\n5\n5\n', '-5\n-4\n-3\n0\n1\n0\n1\n2\n3\n4\n', '9\n1\n2\n3\n4\n5\n6\n7\n8\n9\n', '1\n0\n1\n0\n1\n0\n1\n0\n1\n0\n'],
      restrictions: ['Your program can assume that all integers will fit in a MIPS register.', 'You may define and call your own functions if you wish.', 'No error checking is necessary or required.'],
      model: R`# COMP1521 22T2 final exam, question 4:
# print the length of the longest strictly increasing run in 10 numbers

    .data
numbers: .word 0, 0, 0, 0, 0, 0, 0, 0, 0, 0     # int numbers[10] = { 0 };

    .text
main:
    li   $t0, 0             # i = 0;
scan_loop:
    bge  $t0, 10, scan_end  # while (i < 10) {
    li   $v0, 5             #     scanf("%d", &numbers[i]);
    syscall
    mul  $t1, $t0, 4
    sw   $v0, numbers($t1)
    addi $t0, $t0, 1        #     i++;
    b    scan_loop          # }
scan_end:

    li   $t2, 1             # max_run = 1;
    li   $t3, 1             # current_run = 1;
    li   $t0, 1             # i = 1;
run_loop:
    bge  $t0, 10, run_end   # while (i < 10) {
    mul  $t1, $t0, 4
    lw   $t4, numbers($t1)          # numbers[i]
    lw   $t5, numbers - 4($t1)      # numbers[i - 1]
    ble  $t4, $t5, run_reset        # if (numbers[i] > numbers[i - 1]) {
    addi $t3, $t3, 1                #     current_run++;
    b    run_max
run_reset:                          # } else {
    li   $t3, 1                     #     current_run = 1;
run_max:                            # }
    ble  $t3, $t2, run_next         # if (current_run > max_run)
    move $t2, $t3                   #     max_run = current_run;
run_next:
    addi $t0, $t0, 1        #     i++;
    b    run_loop           # }
run_end:

    move $a0, $t2           # printf("%d\n", max_run);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0             # return 0;
    jr   $ra
`,
      notes: '<code>numbers - 4($t1)</code> uses an expression as the offset: the address of numbers[i − 1] is 4 bytes before numbers[i]. Computing (i − 1) × 4 in another register works just as well. "Strictly increasing" means equal neighbours reset the run: use <code>ble</code>, not <code>blt</code>.',
      check: ['Equal neighbours reset the run (strictly increasing)', 'Both array elements indexed ×4']
    },
    {
      id: 'p22t2-q8', qn: 8, slot: 'q9', title: 'Towers of Hanoi: move_disks', file: '22t2final_q8.s',
      cmd: '22t2final_q8_main.s 22t2final_q8.s',
      task: '<p>You have been given <code>22t2final_q8.s</code>. Add code to it to make it equivalent to <code>22t2final_q8.c</code>, below: part of a larger program that helps solve the "Towers of Hanoi" problem.</p>' +
        '<p>You must translate both functions, <code>move_disks</code> and <code>find_lowest_target</code>, to MIPS assembler, following the standard calling conventions used in lectures.</p>' +
        '<p>You have been provided a <code>22t2final_q8_main.s</code> file, which includes a main function to help test your code, along with a complete implementation of the <code>swap</code> function (and <code>print_towers</code>) used in the C code. Here it is assembled with your file, as with <code>1521 mipsy 22t2final_q8_main.s 22t2final_q8.s</code>.</p>' +
        recon('<code>22t2final_q8_main.s</code>', 'Our <code>main</code> reads the number of disks (1–7) so it can be tested with several sizes; the original always uses 7.'),
      c: R`// // // // // // // // DO NOT CHANGE THIS FILE! // // // // // // // //
// COMP1521 22T2 ... final exam, question 8

#include <stdlib.h>

#include "22t2final_q8.h"

char default_char = ' ';

void move_disks(char size, char *target, char *peg1, char *peg2) {
    char *peg_max = &default_char;
    char *source = NULL;
    char *other = NULL;

    for (int i = 0; peg1[i] != '\0'; i++) {
        if (peg1[i] > *peg_max && peg1[i] <= size) {
            peg_max = peg1 + i;
            source = peg1;
            other = peg2;
        }
        if (peg2[i] > *peg_max && peg2[i] <= size) {
            peg_max = peg2 + i;
            source = peg2;
            other = peg1;
        }
    }

    if (*peg_max == ' ') return;

    move_disks(size - 1, other, source, target);
    char *lowest_target = find_lowest_target(target);
    swap(peg_max, lowest_target);

    while (*peg_max != *(peg_max + 1)) {
        swap(peg_max, peg_max + 1);
        peg_max++;
    }

    print_towers();
    move_disks(size - 1, target, source, other);
}

char *find_lowest_target(char *target) {
    if (*target == ' ') return target;
    return find_lowest_target(target + 1);
}`,
      files: [{ name: '22t2final_q8_main.s', text: HANOI_MAIN }],
      link: HANOI_MAIN,
      starter: HANOI_STARTER,
      ref: hanoiRef,
      cases: ['1\n', '2\n', '3\n'],
      hidden: ['4\n', '5\n', '7\n'],
      maxSteps: 20000000,
      restrictions: ['You must translate both functions to MIPS assembler and follow the standard calling conventions used in lectures.', 'No error checking is necessary or required.'],
      model: R`# COMP1521 22T2 ... final exam, question 8

	.data

# char default_char = ' ';
default_char:	.byte ' '


	.text
# void move_disks(char size, char *target, char *peg1, char *peg2) {
#   size in $a0, target in $a1, peg1 in $a2, peg2 in $a3
move_disks:
move_disks__prologue:
	begin
	push	$ra
	push	$s0
	push	$s1
	push	$s2
	push	$s3
	push	$s4
move_disks__body:
	move	$s0, $a0		# size
	move	$s1, $a1		# target
	la	$s2, default_char	# char *peg_max = &default_char;
	li	$s3, 0			# char *source = NULL;
	li	$s4, 0			# char *other = NULL;

	li	$t0, 0			# for (int i = 0; peg1[i] != '\0'; i++) {
move_disks__loop:
	add	$t1, $a2, $t0		#     &peg1[i]
	lb	$t2, ($t1)
	beqz	$t2, move_disks__loop_end
	lb	$t3, ($s2)		#     if (peg1[i] > *peg_max && peg1[i] <= size) {
	ble	$t2, $t3, move_disks__check_peg2
	bgt	$t2, $s0, move_disks__check_peg2
	move	$s2, $t1		#         peg_max = peg1 + i;
	move	$s3, $a2		#         source = peg1;
	move	$s4, $a3		#         other = peg2;
move_disks__check_peg2:			#     }
	add	$t1, $a3, $t0		#     &peg2[i]
	lb	$t2, ($t1)
	lb	$t3, ($s2)		#     if (peg2[i] > *peg_max && peg2[i] <= size) {
	ble	$t2, $t3, move_disks__next
	bgt	$t2, $s0, move_disks__next
	move	$s2, $t1		#         peg_max = peg2 + i;
	move	$s3, $a3		#         source = peg2;
	move	$s4, $a2		#         other = peg1;
move_disks__next:			#     }
	addi	$t0, $t0, 1
	b	move_disks__loop	# }
move_disks__loop_end:

	lb	$t2, ($s2)		# if (*peg_max == ' ') return;
	beq	$t2, ' ', move_disks__epilogue

	addi	$a0, $s0, -1		# move_disks(size - 1, other, source, target);
	move	$a1, $s4
	move	$a2, $s3
	move	$a3, $s1
	jal	move_disks

	move	$a0, $s1		# lowest_target = find_lowest_target(target);
	jal	find_lowest_target

	move	$a0, $s2		# swap(peg_max, lowest_target);
	move	$a1, $v0
	jal	swap

move_disks__bubble:			# while (*peg_max != *(peg_max + 1)) {
	lb	$t0, ($s2)
	lb	$t1, 1($s2)
	beq	$t0, $t1, move_disks__bubbled
	move	$a0, $s2		#     swap(peg_max, peg_max + 1);
	addi	$a1, $s2, 1
	jal	swap
	addi	$s2, $s2, 1		#     peg_max++;
	b	move_disks__bubble	# }
move_disks__bubbled:

	jal	print_towers		# print_towers();

	addi	$a0, $s0, -1		# move_disks(size - 1, target, source, other);
	move	$a1, $s1
	move	$a2, $s3
	move	$a3, $s4
	jal	move_disks

move_disks__epilogue:
	pop	$s4
	pop	$s3
	pop	$s2
	pop	$s1
	pop	$s0
	pop	$ra
	end
	jr	$ra


	.text
# char *find_lowest_target(char *target) {
#   target in $a0, result in $v0
find_lowest_target:
find_lowest_target__prologue:
	begin
	push	$ra
find_lowest_target__body:
	move	$v0, $a0		# if (*target == ' ') return target;
	lb	$t0, ($a0)
	beq	$t0, ' ', find_lowest_target__epilogue
	addi	$a0, $a0, 1		# return find_lowest_target(target + 1);
	jal	find_lowest_target
find_lowest_target__epilogue:
	pop	$ra
	end
	jr	$ra
`,
      notes: 'Six values are live across calls (size, target, peg_max, source, other and $ra), so they go in $s0–$s4 and are saved in the prologue. The loop reads peg1 and peg2 through $a2/$a3, which is safe because it makes no calls; after the first <code>jal</code> they are gone, which is why source and other are copied into $s registers. Chars are signed, so load them with <code>lb</code>; size − 1 is ordinary integer arithmetic. find_lowest_target must stay recursive, as in the C.',
      check: ['Every value needed after a jal is in a saved $s register', 'Saves and restores $ra and each $s register used; pops in reverse order', 'find_lowest_target recursive, as in the C', 'Byte loads (lb) for the chars']
    }
  ]);

  /* ===================================================================== */
  /*                            22T3 — MIPS                                 */
  /* ===================================================================== */

  function longestOnes(x) { var best = 0, cur = 0; for (var i = 0; i < 32; i++) { if ((x >>> i) & 1) { cur++; if (cur > best) best = cur; } else cur = 0; } return best; }

  function boolRef(stdin) {
    var s = stdin.split('\n')[0] + '\n', i = 0;
    function value() { var r = s[i] === 'T'; i++; return r; }
    function term() { var l = value(); if (s[i] !== '&') return l; i++; var r = term(); return l && r; }
    function expression() { var l = term(); if (s[i] !== '|') return l; i++; var r = expression(); return l || r; }
    return (expression() ? 'T' : 'F') + '\n';
  }

  function bigRef(stdin) {
    var line = stdin.split('\n')[0];
    return line.split('+').map(function (t) {
      return t.split('*').reduce(function (p, f) { return p * BigInt(f); }, BigInt(1));
    }).reduce(function (a, b) { return a + b; }, BigInt(0)).toString() + '\n';
  }

  var LINE_T_STARTER = R`# COMP1521 22T3 ... final exam, question 8
# Reads a line of input, then prints 'T' on a new line.

    .data
buffer: .space 10000        # char buffer[10000];
s:      .word 0             # char *s;

    .text
main:
    la   $a0, buffer        # fgets(buffer, 10000, stdin);
    li   $a1, 10000
    li   $v0, 8
    syscall
    la   $t0, buffer        # s = buffer;
    sw   $t0, s

    li   $a0, 'T'           # printf("T\n");
    li   $v0, 11
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0             # return 0;
    jr   $ra
`;

  var LINE_42_STARTER = R`# COMP1521 22T3 ... final exam, question 10
# Reads a line of input, then prints 42.

    .data
line:   .space 10000        # char line[10000];

    .text
main:
    la   $a0, line          # fgets(line, 10000, stdin);
    li   $a1, 10000
    li   $v0, 8
    syscall

    li   $a0, 42            # printf("%d\n", 42);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0             # return 0;
    jr   $ra
`;

  mips('22T3', [
    {
      id: 'p22t3-q2', qn: 2, slot: 'q1', title: 'Sum of squares', file: '22t3final_q2.s',
      task: '<p>You have been given <code>22t3final_q2.s</code>, a MIPS assembler program that reads a number and then prints the number.</p><p>Add code to <code>22t3final_q2.s</code> so that it is equivalent to this C program. In other words, it should read two numbers and print the sum of their squares.</p>',
      c: R`// // // // // // // // DO NOT CHANGE THIS FILE! // // // // // // // //
// COMP1521 22T3 ... final exam, question 2
// Modify 22t3final_q2.s so that its behaviour
// matches the following C code.

#include <stdio.h>

int main(void) {
    int a, b;

    scanf("%d", &a);
    scanf("%d", &b);

    printf("%d\n", a * a + b * b);

    return 0;
}`,
      starter: readPrint('COMP1521 22T3 ... final exam, question 2: read a number and print it'),
      ref: function (s) { var v = ints(s); return (Math.imul(v[0], v[0]) + Math.imul(v[1], v[1])) + '\n'; },
      cases: ['3\n4\n', '6\n5\n', '5\n6\n', '42\n42\n'],
      hidden: ['0\n0\n', '-3\n-4\n', '-7\n2\n', '1000\n1\n'],
      restrictions: ['No error checking is required.', 'Your program can assume its input always contains two integers, and only two integers.', 'Your program should print one and only one line of output: one integer, a newline, and nothing else.', 'You can assume overflow/underflow does not occur.'],
      model: R`# COMP1521 22T3 final exam, question 2: print a * a + b * b

main:
    li   $v0, 5             # scanf("%d", &a);
    syscall
    move $t0, $v0

    li   $v0, 5             # scanf("%d", &b);
    syscall
    move $t1, $v0

    mul  $t2, $t0, $t0      # a * a
    mul  $t3, $t1, $t1      # b * b
    add  $a0, $t2, $t3      # printf("%d\n", a * a + b * b);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0             # return 0;
    jr   $ra
`
    },
    {
      id: 'p22t3-q3', qn: 3, slot: 'q4', title: 'Read until the sum reaches 42', file: '22t3final_q3.s',
      task: '<p>You have been given <code>22t3final_q3.s</code>, a MIPS assembler program that reads 1 number and then prints it.</p><p>Add code to <code>22t3final_q3.s</code> to make it equivalent to this C program. In other words, it should read numbers until their sum is ≥ 42 and then print their sum.</p>',
      c: R`//  read numbers until their sum is >= 42, print their sum

#include <stdio.h>

int main(void) {
    int sum = 0;
    while (sum < 42) {
        int x;
        scanf("%d", &x);
        sum += x;
    }
    printf("%d\n", sum);
    return 0;
}`,
      starter: readPrint('COMP1521 22T3 ... final exam, question 3: read a number and print it'),
      ref: function (s) { var v = ints(s), sum = 0, i = 0; while (sum < 42) sum += v[i++]; return sum + '\n'; },
      cases: ['10\n20\n25\n', '20\n22\n', '100\n', '10\n10\n10\n10\n10\n'],
      hidden: ['42\n', '41\n1\n', '-10\n50\n3\n', '1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n'],
      restrictions: ['No error checking is required.', 'Your program can assume its input contains only integers.', 'Your program can assume these integers sum to at least 42.', 'Your program should print one and only one line of output: one integer, a newline, and nothing else.', 'You can assume overflow/underflow does not occur.'],
      model: R`# COMP1521 22T3 final exam, question 3: read numbers until their sum is >= 42

main:
    li   $t0, 0             # sum = 0;
loop:
    bge  $t0, 42, end       # while (sum < 42) {
    li   $v0, 5             #     scanf("%d", &x);
    syscall
    add  $t0, $t0, $v0      #     sum += x;
    b    loop               # }
end:
    move $a0, $t0           # printf("%d\n", sum);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0             # return 0;
    jr   $ra
`
    },
    {
      id: 'p22t3-q5', qn: 5, slot: 'q3', title: 'Longest run of 1 bits in MIPS', file: '22t3final_q5.s',
      task: '<p>You have been given <code>22t3final_q5.s</code>, a MIPS assembler program that reads an integer and then prints 42.</p><p>Add code to <code>22t3final_q5.s</code> so that it prints the length of the longest sequence of consecutive bits set to 1 in the supplied 32 bit integer. In other words, it should behave the same as question 4.</p>' +
        '<p>mipsy input is signed, so it won’t accept some of the input used in question 4. For example, mipsy won’t accept 4294967295 as input. You get the same bit pattern (0xFFFFFFFF) by using −1 as input. This doesn’t affect the code you need to write.</p>' + RECON,
      starter: readPrint42('COMP1521 22T3 ... final exam, question 5: read an integer, print 42'),
      ref: function (s) { return longestOnes(ints(s)[0]) + '\n'; },
      cases: ['305419896\n', '0\n', '4\n', '15\n', '-1\n', '-1431655766\n', '268566401\n'],
      hidden: ['-2147483648\n', '2147483647\n', '-16\n', '1\n', '-65536\n'],
      restrictions: ['Your program can assume its input only contains only 1 integer.', 'Your program can assume that the integer will fit in a MIPS register.', 'Your program can assume that MIPS will accept the integer as valid input.', 'No error checking is necessary or required.'],
      model: R`# COMP1521 22T3 final exam, question 5:
# print the length of the longest run of 1 bits in an integer

main:
    li   $v0, 5             # scanf("%d", &x);
    syscall
    move $t0, $v0

    li   $t1, 0             # best = 0
    li   $t2, 0             # current = 0
    li   $t3, 0             # for (i = 0; i < 32; i++) {
loop:
    bge  $t3, 32, end
    srlv $t4, $t0, $t3      #     if ((x >> i) & 1) {
    andi $t4, $t4, 1
    beqz $t4, zero_bit
    addi $t2, $t2, 1        #         current++;
    ble  $t2, $t1, next     #         if (current > best) best = current;
    move $t1, $t2
    b    next
zero_bit:                   #     } else {
    li   $t2, 0             #         current = 0;
next:                       #     }
    addi $t3, $t3, 1
    b    loop               # }
end:
    move $a0, $t1           # printf("%d\n", best);
    li   $v0, 1
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall

    li   $v0, 0
    jr   $ra
`,
      notes: 'Look at all 32 bits with a logical shift (<code>srlv</code>), so −1 gives 32. Updating best inside the 1-bit branch, rather than only when a 0 ends a run, handles a run that reaches bit 31.',
      check: ['Handles a run reaching the top bit (e.g. −1 → 32, −65536 → 16)', 'Logical shift, not sra']
    },
    {
      id: 'p22t3-q8', qn: 8, slot: 'q9', title: 'Evaluate a boolean expression', file: '22t3final_q8.s',
      task: '<p>You have been given <code>22t3final_q8.s</code>, a MIPS assembler program that reads a line of input and then prints \'T\' on a new line.</p><p>Add code to <code>22t3final_q8.s</code> to make it equivalent to this C program, which reads a line containing a boolean expression and evaluates it. The expression only contains the characters <code>T</code> and <code>F</code> (true and false) and the operators <code>&amp;</code> and <code>|</code> (logical AND and OR).</p>' + RECON,
      c: R`// // // // // // // // DO NOT CHANGE THIS FILE! // // // // // // // //
// COMP1521 22T3 ... final exam, question 8
// Modify 22t3final_q8.s so that its behaviour
// matches the following C code.

#include <stdio.h>

char *s;

int expression(void);
int term(void);
int value(void);

int main(void) {
    char buffer[10000];
    fgets(buffer, 10000, stdin);
    s = buffer;

    if (expression()) {
        printf("T\n");
    } else {
        printf("F\n");
    }

    return 0;
}

int expression(void) {
    int lhs = term();
    if (*s != '|') {
        return lhs;
    }
    s++;
    int rhs = expression();
    return lhs || rhs;
}

int term(void) {
    int lhs = value();
    if (*s != '&') {
        return lhs;
    }
    s++;
    int rhs = term();
    return lhs && rhs;
}

int value(void) {
    int retval = *s == 'T';
    s++;
    return retval;
}`,
      starter: LINE_T_STARTER,
      ref: boolRef,
      cases: ['T&F\n', 'T|F\n', 'F|T&F\n'],
      hidden: ['T\n', 'F\n', 'T|F&F\n', 'F&T|T\n', 'T&T&T&T&F|F|F&T\n', 'F|F|F|F|F|F|F|F|T\n', 'T&T&T&T&T&T&T&T&T&T&T&T\n'],
      restrictions: ['No error checking is required.', 'Your program can assume it is given exactly one line of input.', 'Your program can assume this line contains only these 4 characters: TF&|', 'You can assume the line contains less than 10,000 characters.', 'Your program can assume that these characters form a valid boolean expression.'],
      model: R`# COMP1521 22T3 final exam, question 8: evaluate a boolean expression

    .data
buffer: .space 10000        # char buffer[10000];
s:      .word 0             # char *s;

    .text
main:
main__prologue:
    begin
    push $ra
main__body:
    la   $a0, buffer        # fgets(buffer, 10000, stdin);
    li   $a1, 10000
    li   $v0, 8
    syscall
    la   $t0, buffer        # s = buffer;
    sw   $t0, s

    jal  expression         # if (expression())
    li   $a0, 'T'           #     printf("T\n");
    bnez $v0, main__print
    li   $a0, 'F'           # else printf("F\n");
main__print:
    li   $v0, 11
    syscall
    li   $a0, '\n'
    li   $v0, 11
    syscall
main__epilogue:
    pop  $ra
    end
    li   $v0, 0             # return 0;
    jr   $ra


# int expression(void)
expression:
expression__prologue:
    begin
    push $ra
    push $s0
expression__body:
    jal  term               # lhs = term();
    move $s0, $v0
    lw   $t0, s             # if (*s != '|') return lhs;
    lb   $t1, ($t0)
    move $v0, $s0
    bne  $t1, '|', expression__epilogue
    addi $t0, $t0, 1        # s++;
    sw   $t0, s
    jal  expression         # rhs = expression();
    or   $v0, $s0, $v0      # return lhs || rhs;
    sne  $v0, $v0, 0
expression__epilogue:
    pop  $s0
    pop  $ra
    end
    jr   $ra


# int term(void)
term:
term__prologue:
    begin
    push $ra
    push $s0
term__body:
    jal  value              # lhs = value();
    move $s0, $v0
    lw   $t0, s             # if (*s != '&') return lhs;
    lb   $t1, ($t0)
    move $v0, $s0
    bne  $t1, '&', term__epilogue
    addi $t0, $t0, 1        # s++;
    sw   $t0, s
    jal  term               # rhs = term();
    sne  $t2, $s0, 0        # return lhs && rhs;
    sne  $t3, $v0, 0
    and  $v0, $t2, $t3
term__epilogue:
    pop  $s0
    pop  $ra
    end
    jr   $ra


# int value(void) — a leaf: no frame needed
value:
    lw   $t0, s             # retval = *s == 'T';
    lb   $t1, ($t0)
    seq  $v0, $t1, 'T'
    addi $t0, $t0, 1        # s++;
    sw   $t0, s
    jr   $ra                # return retval;
`,
      notes: '<code>s</code> is a global pointer, so load it from memory, advance it and store it back: a copy kept in a register goes stale as soon as a nested call moves it. lhs must survive the recursive call, so it lives in $s0 (saved in the prologue). The C evaluates rhs even when lhs already decides the answer, which matters here because the call also advances <code>s</code>.',
      check: ['expression and term are recursive, as in the C', 's read from and written back to memory around each call', 'lhs kept in a saved $s register across the recursive call']
    },
    {
      id: 'p22t3-q10', qn: 10, slot: 'q7', title: 'Arbitrary-precision + and *', file: '22t3final_q10.s',
      task: '<p>You have been given <code>22t3final_q10.s</code>, a MIPS assembler program that reads a line of input and then prints 42.</p>' +
        '<p>Add code to <code>22t3final_q10.s</code> to evaluate the line as an arithmetic expression and print its value. The arithmetic expression will contain only positive integers, the addition (<code>+</code>) operator and the multiply (<code>*</code>) operator.</p>' +
        '<p>The integers may be arbitrarily large, except they must fit on a line of less than 10,000 characters.</p>' +
        '<p>Partial marks will be given for solutions which handle only positive integers and addition but not multiplication. There are no marks for approaches which handle only smaller integers; for example, those small enough to be represented in only 32 or 64 bits and stored in a register. There are no marks for approaches which use floating point arithmetic or other methods to produce approximate results.</p>' + RECON,
      starter: LINE_42_STARTER,
      ref: bigRef,
      cases: ['982451653*961748941*472882027*452390477\n', '2*100000000000000000000000000000000000000000000000000000000000000000000000000+3*4\n'],
      hidden: ['1+1\n', '7\n', '999999999999999999999*999999999999999999999\n', '12345678901234567890+98765432109876543210*2\n',
        '1*1*1*1*1+1+1+1\n', '99999999999999999999999999999999999999999999999999+1\n',
        '31415926535897932384626433832795028841971693993751*27182818284590452353602874713526624977572470936999+16180339887498948482045868343656381177203091798057628621354486227\n'],
      maxSteps: 20000000,
      restrictions: ['No error checking is required.', 'Your program can assume it is given exactly one line of input.', 'Your program can assume this line is made up of only these 12 characters: 0123456789+*', 'You can assume the line contains less than 10,000 characters.', 'Your program can assume that these characters form a valid arithmetic expression.', 'You are not permitted to use floating point operations or registers.'],
      model: R`# COMP1521 22T3 final exam, question 10:
# evaluate an expression of arbitrarily large positive integers, + and *
#
# Numbers are arrays of decimal digits, least significant first (one digit
# per byte), with their lengths in words. The expression is a sum of terms,
# each a product of factors, so * binds tighter than +:
#   sum = 0
#   for each term:   prod = 1; for each factor: prod = prod * factor
#                    sum = sum + prod

MAX = 10004

    .data
line:       .space 10000    # the input line
sum:        .space MAX      # running total
prod:       .space MAX      # product of the current term
factor:     .space MAX      # the number just read
temp:       .space 2 * MAX  # prod * factor, before it is copied back
sum_len:    .word 0
prod_len:   .word 0
factor_len: .word 0

    .text
main:
main__prologue:
    begin
    push $ra
    push $s0
main__body:
    la   $a0, line              # fgets(line, 10000, stdin);
    li   $a1, 10000
    li   $v0, 8
    syscall

    li   $t0, 1                 # sum = 0  (one digit, 0)
    sw   $t0, sum_len
    sb   $zero, sum

    la   $s0, line              # p = line
main__term:
    li   $t0, 1                 # prod = 1
    sw   $t0, prod_len
    sb   $t0, prod
main__factor:
    move $t0, $s0               # start = p
main__digits:                   # while ('0' <= *p && *p <= '9') p++;
    lbu  $t1, ($s0)
    blt  $t1, '0', main__got_number
    bgt  $t1, '9', main__got_number
    addi $s0, $s0, 1
    b    main__digits
main__got_number:
    sub  $t2, $s0, $t0          # factor_len = p - start
    sw   $t2, factor_len
    li   $t3, 0                 # for (k = 0; k < factor_len; k++)
main__copy_digits:
    bge  $t3, $t2, main__multiply
    addi $t4, $s0, -1           #     factor[k] = p[-1 - k] - '0';
    sub  $t4, $t4, $t3
    lbu  $t5, ($t4)
    addi $t5, $t5, -48
    sb   $t5, factor($t3)
    addi $t3, $t3, 1
    b    main__copy_digits
main__multiply:
    jal  multiply               # prod = prod * factor
    lbu  $t1, ($s0)             # if (*p == '*') { p++; next factor }
    bne  $t1, '*', main__end_term
    addi $s0, $s0, 1
    b    main__factor
main__end_term:
    jal  add_prod               # sum = sum + prod
    lbu  $t1, ($s0)             # if (*p == '+') { p++; next term }
    bne  $t1, '+', main__print
    addi $s0, $s0, 1
    b    main__term

main__print:                    # print sum, most significant digit first
    lw   $t0, sum_len
main__print_digit:
    addi $t0, $t0, -1
    bltz $t0, main__newline
    lbu  $a0, sum($t0)
    addi $a0, $a0, 48
    li   $v0, 11
    syscall
    b    main__print_digit
main__newline:
    li   $a0, '\n'
    li   $v0, 11
    syscall

main__epilogue:
    pop  $s0
    pop  $ra
    end
    li   $v0, 0
    jr   $ra


# multiply: prod = prod * factor (schoolbook, one row per factor digit).
# A leaf function: uses only $t registers and the globals.
multiply:
    lw   $t0, prod_len          # lp
    lw   $t1, factor_len        # lf

    li   $t2, 0                 # for (k = 0; k < lp; k++) temp[k] = 0;
multiply__clear:
    bge  $t2, $t0, multiply__rows
    sb   $zero, temp($t2)
    addi $t2, $t2, 1
    b    multiply__clear

multiply__rows:
    li   $t2, 0                 # for (i = 0; i < lf; i++) {
multiply__row:
    bge  $t2, $t1, multiply__trim
    lbu  $t3, factor($t2)       #     d = factor[i]
    li   $t4, 0                 #     carry = 0
    li   $t5, 0                 #     for (j = 0; j < lp; j++) {
multiply__col:
    bge  $t5, $t0, multiply__row_end
    add  $t6, $t2, $t5          #         t = temp[i + j] + d * prod[j] + carry
    lbu  $t7, temp($t6)
    lbu  $t8, prod($t5)
    mul  $t8, $t8, $t3
    add  $t7, $t7, $t8
    add  $t7, $t7, $t4
    rem  $t8, $t7, 10           #         temp[i + j] = t % 10
    sb   $t8, temp($t6)
    div  $t4, $t7, 10           #         carry = t / 10
    addi $t5, $t5, 1
    b    multiply__col          #     }
multiply__row_end:
    add  $t6, $t2, $t0          #     temp[i + lp] = carry   (a fresh position)
    sb   $t4, temp($t6)
    addi $t2, $t2, 1
    b    multiply__row          # }

multiply__trim:
    add  $t2, $t0, $t1          # len = lp + lf, then drop leading zeros
multiply__trim_loop:
    ble  $t2, 1, multiply__copy
    addi $t3, $t2, -1
    lbu  $t4, temp($t3)
    bnez $t4, multiply__copy
    move $t2, $t3
    b    multiply__trim_loop
multiply__copy:
    sw   $t2, prod_len          # prod = temp[0 .. len - 1]
    li   $t3, 0
multiply__copy_loop:
    bge  $t3, $t2, multiply__end
    lbu  $t4, temp($t3)
    sb   $t4, prod($t3)
    addi $t3, $t3, 1
    b    multiply__copy_loop
multiply__end:
    jr   $ra


# add_prod: sum = sum + prod. A leaf function.
add_prod:
    lw   $t0, sum_len           # ls
    lw   $t1, prod_len          # lp
    move $t2, $t0               # n = max(ls, lp)
    bge  $t0, $t1, add_prod__go
    move $t2, $t1
add_prod__go:
    li   $t3, 0                 # carry = 0
    li   $t4, 0                 # for (k = 0; k < n; k++) {
add_prod__loop:
    bge  $t4, $t2, add_prod__carry
    move $t5, $t3               #     d = carry
    bge  $t4, $t0, add_prod__no_sum
    lbu  $t6, sum($t4)          #     if (k < ls) d += sum[k]
    add  $t5, $t5, $t6
add_prod__no_sum:
    bge  $t4, $t1, add_prod__no_prod
    lbu  $t6, prod($t4)         #     if (k < lp) d += prod[k]
    add  $t5, $t5, $t6
add_prod__no_prod:
    rem  $t6, $t5, 10           #     sum[k] = d % 10
    sb   $t6, sum($t4)
    div  $t3, $t5, 10           #     carry = d / 10
    addi $t4, $t4, 1
    b    add_prod__loop         # }
add_prod__carry:
    beqz $t3, add_prod__end     # if (carry) sum[n++] = carry;
    sb   $t3, sum($t2)
    addi $t2, $t2, 1
add_prod__end:
    sw   $t2, sum_len
    jr   $ra
`,
      notes: 'Store digits least significant first, so adding and multiplying both start at index 0 and carries move upwards. Each schoolbook row writes one fresh position (temp[i + lp]), so only the first lp bytes of temp need zeroing, and nothing is read before it is written. Doing the products first and adding each finished term gives * its precedence over + without a parser. For partial marks, the same code without multiply handles + only.',
      check: ['No fixed-size (32/64-bit) or floating-point arithmetic for the values', '* binds tighter than +', 'Leading zeros trimmed from products']
    }
  ]);

  /* ===================================================================== */
  /*                              C questions                               */
  /* ===================================================================== */

  var NO_LIBC = 'You are not permitted to call any functions from the C standard library.';
  var C_ONLY = 'Your solution must be in C only.';
  var DEFAULT_LIBS = 'You may only use the default C libraries (no dcc -l flags).';

  cq('20T3', [
    {
      id: 'p20t3-q2', qn: 2, slot: 'q2', title: 'Bottom bit equals top bit', file: '20t3final_q2.c',
      task: '<p>You have been given <code>20t3final_q2.c</code>, a stub of a C program. Add code to the function <code>final_q2</code> so that, given a <code>uint32_t</code> value, it returns 1 iff the least significant (bottom) bit of <code>value</code> is equal to the most significant (top) bit of <code>value</code>. <code>final_q2</code> should return 0 otherwise.</p>' +
        '<p>For example, given the hexadecimal value 0x12345678, which is 00010010001101000101011001111000 in binary, <code>final_q2</code> should return 1, because the least significant bit is 0 and the most significant bit is 0. Given 0x12345679 (00010010001101000101011001111001), it should return 0, because the least significant bit is 1 and the most significant bit is 0.</p>' +
        '<p>You must only use bitwise operators to implement it.</p>' + recon('The test file, <code>test_20t3final_q2.c</code>,'),
      files: [{ name: '20t3final_q2.c', text: R`#include <stdint.h>

// given a uint32_t,
// return 1 iff the least significant bit
// is equal to the most significant bit
// return 0 otherwise
int final_q2(uint32_t value) {
    (void) value; // REPLACE ME WITH YOUR CODE
    return 42;    // REPLACE ME WITH YOUR CODE
}
` }, { name: 'test_20t3final_q2.c', text: R`// test_20t3final_q2.c — DO NOT CHANGE (reconstructed)
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int final_q2(uint32_t value);

int main(int argc, char *argv[]) {
    for (int arg = 1; arg < argc; arg++) {
        uint32_t value = strtoul(argv[arg], NULL, 0);
        printf("20t3final_q2(0x%08x) returned %d\n", value, final_q2(value));
    }
    return 0;
}
` }],
      starter: R`#include <stdint.h>

// given a uint32_t,
// return 1 iff the least significant bit
// is equal to the most significant bit
// return 0 otherwise
int final_q2(uint32_t value) {
    (void) value; // REPLACE ME WITH YOUR CODE
    return 42;    // REPLACE ME WITH YOUR CODE
}
`,
      examples: R`dcc 20t3final_q2.c test_20t3final_q2.c -o 20t3final_q2
./20t3final_q2 0x00000000
20t3final_q2(0x00000000) returned 1
./20t3final_q2 0x00000001
20t3final_q2(0x00000001) returned 0
./20t3final_q2 0x00000100
20t3final_q2(0x00000100) returned 1
./20t3final_q2 0x00000101
20t3final_q2(0x00000101) returned 0
./20t3final_q2 0x12345656
20t3final_q2(0x12345656) returned 1
./20t3final_q2 0x12345657
20t3final_q2(0x12345657) returned 0
./20t3final_q2 0xffffffff
20t3final_q2(0xffffffff) returned 1
./20t3final_q2 0xfffffffe
20t3final_q2(0xfffffffe) returned 0
./20t3final_q2 0x7fffffff
20t3final_q2(0x7fffffff) returned 0
./20t3final_q2 0x7ffffffe
20t3final_q2(0x7ffffffe) returned 1`,
      restrictions: ['You must only use bitwise operators.', 'No error checking is necessary.', NO_LIBC, 'You are not permitted to use division (/), multiplication (*), or modulus (%).', 'You are not permitted to change the main function you have been given (it is in test_20t3final_q2.c), or final_q2\'s prototype.', 'You may define and call your own functions if you wish.'],
      model: R`#include <stdint.h>

// given a uint32_t,
// return 1 iff the least significant bit
// is equal to the most significant bit
// return 0 otherwise
int final_q2(uint32_t value) {
    uint32_t top = value >> 31;     // the most significant bit, moved to bit 0
    uint32_t bottom = value & 1;    // the least significant bit
    // top ^ bottom is 0 when they are equal; flip it with ^ 1
    return (top ^ bottom ^ 1) & 1;
}
`,
      notes: '<code>value &gt;&gt; 31</code> on a <code>uint32_t</code> is a logical shift, so it leaves exactly the top bit in bit 0. XOR is 0 when two bits are equal, and <code>^ 1</code> turns that into the 1 the question wants. <code>!</code> and <code>==</code> are not bitwise operators, so <code>return top == bottom;</code> breaks the restriction.',
      check: ['Only bitwise operators (no ==, !, ?:)', 'Logical shift on the unsigned value']
    },
    {
      id: 'p20t3-q3', qn: 3, slot: 'q5', title: 'Similar environment variables', file: '20t3final_q3.c',
      task: '<p>Write a C program, <code>20t3final_q3.c</code>, which takes two names of environment variables as arguments. It should print 1 iff both environment variables are set to a similar integer value, and print 0 otherwise.</p>' +
        '<p>Two integer values are similar if they differ by, strictly, less than 10. So 37 and 42 are similar; 52 and 42 are not similar. An unset environment variable should be assumed to have value 42.</p>' +
        '<p>The shell command <code>export</code> sets an environment variable to a value; the shell command <code>unset</code> unsets an environment variable.</p>',
      examples: R`export VAR1=40
export VAR2=45
export VAR3=55
unset VAR4
dcc 20t3final_q3.c -o 20t3final_q3
./20t3final_q3 VAR1 VAR2
1
./20t3final_q3 VAR3 VAR2
0
./20t3final_q3 VAR2 VAR4
1
./20t3final_q3 VAR4 VAR3
0`,
      restrictions: ['There is no supplied code for this question.', 'Your program can assume it is always given 2 arguments.', 'Your program can assume that if an environment variable is set it contains a valid integer and nothing else.', 'Your program should always print one line of output to stdout: a single character, 0 or 1, and a newline.', C_ONLY, NO_EXEC],
      model: R`#include <stdio.h>
#include <stdlib.h>

// The value of environment variable name, or 42 if it is not set.
static int env_value(char *name) {
    char *value = getenv(name);
    if (value == NULL) {
        return 42;
    }
    return atoi(value);
}

int main(int argc, char *argv[]) {
    int a = env_value(argv[1]);
    int b = env_value(argv[2]);
    int difference = a - b;
    if (difference < 0) {
        difference = -difference;
    }
    printf("%d\n", difference < 10);
    return 0;
}
`,
      notes: '<code>getenv</code> returns NULL for an unset variable: test for it before calling <code>atoi</code>, which would crash on NULL. "Strictly less than 10" means a difference of exactly 10 prints 0.',
      check: ['Unset variable treated as 42 (NULL checked before atoi)', 'Absolute difference, strictly less than 10']
    },
    {
      id: 'p20t3-q5', qn: 5, slot: 'q6', title: 'Copy all but the last n bytes', file: '20t3final_q5.c',
      task: '<p>We need to copy a file without some of the bytes at the end of the file. Write a C program, <code>20t3final_q5.c</code>, which takes 3 arguments: an integer n, the number of bytes not to be included; the name of an existing file; and the name of the file to be created.</p>' +
        '<p>It should copy the bytes of the existing file to the new file except for the last n bytes. If the existing file has n bytes or less, the new file should still be created, but with zero bytes.</p>' +
        '<p>In the example, new.txt has the same contents as hello.txt except it is 2 bytes shorter: the last two bytes of hello.txt (ASCII <code>\'o\'</code> and <code>\'\\n\'</code>) were not copied.</p>',
      examples: R`dcc 20t3final_q5.c -o 20t3final_q5
echo hello >hello.txt
./20t3final_q5 2 hello.txt new.txt
ls -l hello.txt new.txt
-rw-r--r-- 1 z5555555 z5555555 6 Nov 26 16:28 hello.txt
-rw-r--r-- 1 z5555555 z5555555 4 Nov 26 16:29 new.txt
xxd hello.txt
00000000: 6865 6c6c 6f0a                           hello.
xxd new.txt
00000000: 6865 6c6c                                hell
./20t3final_q5 2000 hello.txt file.txt
ls -l hello.txt file.txt
-rw-r--r-- 1 z5555555 z5555555 0 Nov 26 16:30 file.txt
-rw-r--r-- 1 z5555555 z5555555 6 Nov 26 16:28 hello.txt
xxd file.txt`,
      restrictions: ['There is no supplied code for this question.', 'No error checking is required.', 'Your program can assume it is always given 3 arguments; the first is a non-negative integer, the second an existing ordinary file, the third a file that can be created.', 'The file may contain any byte.', 'Your program should produce no output on stdout or stderr, create a single file, and overwrite an existing file if there is one.', 'Your program can assume all calculations can be done with int variables without overflow.', C_ONLY, NO_EXEC],
      model: R`#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>

int main(int argc, char *argv[]) {
    int n = atoi(argv[1]);

    struct stat s;
    stat(argv[2], &s);
    int keep = s.st_size - n;           // bytes to copy; may be <= 0

    FILE *in = fopen(argv[2], "rb");
    FILE *out = fopen(argv[3], "wb");   // created (or truncated) even if keep <= 0
    for (int i = 0; i < keep; i++) {
        fputc(fgetc(in), out);
    }
    fclose(in);
    fclose(out);
    return 0;
}
`,
      notes: 'Find the size first (<code>stat</code>, or <code>fseek</code> to the end and <code>ftell</code>), then copy exactly size − n bytes. Opening the output with "w" before the loop creates the empty file even when there is nothing to copy. Copy with <code>fgetc</code>/<code>fputc</code> (or <code>fread</code>/<code>fwrite</code>), never string functions: the file may contain 0 bytes.',
      check: ['Output file created even when n ≥ size', 'Byte-by-byte (binary-safe) copy, no string functions']
    },
    {
      id: 'p20t3-q6', qn: 6, slot: 'q6', title: 'Count the bits set in a file', file: '20t3final_q6.c',
      task: '<p>We need to count the number of bits which are set in a file. A bit is said to be set if it is 1.</p><p>Write a C program, <code>20t3final_q6.c</code>, which takes a single filename as its argument. It should read the bytes of the file, counting the number of bits that are set (1) in each byte, and print one line of output containing the total number of bits which were set. You must match the output format in the example exactly.</p>',
      examples: R`dcc 20t3final_q6.c -o 20t3final_q6
echo > file0
xxd file0
00000000: 0a                                       .
./20t3final_q6 file0
file0 has 2 bits set
echo hello world > file1
xxd file1
00000000: 6865 6c6c 6f20 776f 726c 640a            hello world.
./20t3final_q6 file1
file1 has 47 bits set
./20t3final_q6 20t3final_q6.0.bin
20t3final_q6.0.bin has 1024 bits set
./20t3final_q6 20t3final_q6.1.bin
20t3final_q6.1.bin has 8084 bits set
./20t3final_q6 20t3final_q6.2.bin
20t3final_q6.2.bin has 9720 bits set`,
      restrictions: ['There is no supplied code for this question.', 'No error checking is required.', 'Your program can assume it is always given one argument: the name of a file.', 'The file may contain any byte.', 'Your program can assume the number of bits set can be stored in an int variable without overflow.', C_ONLY, NO_EXEC],
      model: R`#include <stdio.h>

int main(int argc, char *argv[]) {
    FILE *f = fopen(argv[1], "rb");
    int count = 0;
    int c;                              // int, not char: it must hold EOF too
    while ((c = fgetc(f)) != EOF) {
        for (int bit = 0; bit < 8; bit++) {
            count += (c >> bit) & 1;
        }
    }
    fclose(f);
    printf("%s has %d bits set\n", argv[1], count);
    return 0;
}
`,
      notes: 'Keep the byte from <code>fgetc</code> in an <code>int</code>: it returns 0–255, or EOF (−1) at the end. In a signed <code>char</code>, the byte 0xFF would look like EOF and stop the count early, and shifting a negative char would count extra bits.',
      check: ['c is an int, compared with EOF', 'All 8 bits of every byte counted']
    },
    {
      id: 'p20t3-q10', qn: 10, slot: 'q10', title: 'Run a command once per line (posix_spawnp)', file: '20t3final_q10.c',
      task: '<p>Write a program named <code>20t3final_q10.c</code> which executes a specified command with arguments it reads from standard input. Your program should read lines of input from stdin until end-of-file and execute the command once for each line of input.</p>' +
        '<p>The command to execute will be specified as your program’s first command line argument. Each line will contain the arguments to execute the command with, separated by one or more spaces. You must execute the command with <code>posix_spawnp</code>.</p>' +
        '<p>If your program is given more than one command-line argument, any additional arguments should be passed as the first arguments to the command, followed by any arguments in each line read from standard input. You should ignore any spaces at the start and finish of lines; there may be more than one space between arguments. If your program is given no arguments it should run the command <code>echo</code> for each line of input.</p>' +
        '<p>For example, <code>./20t3final_q10 cp</code> given the lines <code>file1 file1.backup</code>, <code>file2 file2.backup</code> and <code>file3 file3.backup</code> calls posix_spawnp 3 times, to run <code>cp file1 file1.backup</code> and so on. <code>./20t3final_q10 cp file</code> given <code>file.backup1</code> … <code>file.backup4</code> runs <code>cp file file.backup1</code> … <code>cp file file.backup4</code>.</p>',
      examples: R`dcc 20t3final_q10.c -o 20t3final_q10
./20t3final_q10 ls -l -a
  20t3final_q1.s
   20t3final_q2.c   20t3final_q3.c      20t3final_q4.s

-rw-r--r-- 1 z5555555 z5555555 42 Nov 28 13:08 20t3final_q1.s
-rw-r--r-- 1 z5555555 z5555555 42 Nov 28 13:21 20t3final_q2.c
-rw-r--r-- 1 z5555555 z5555555 42 Nov 28 13:39 20t3final_q3.c
-rw-r--r-- 1 z5555555 z5555555 42 Nov 28 13:58 20t3final_q4.s
# posix_spawnp was called twice, to run:
#   ls -l -a 20t3final_q1.s
#   ls -l -a 20t3final_q2.c 20t3final_q3.c 20t3final_q4.s

./20t3final_q10
   This is   a  difficult exam   question!

This is a difficult exam question!
# posix_spawnp was called once, to run:
#   echo This is a difficult exam question!
# (the output is from echo, not 20t3final_q10)`,
      restrictions: ['There is no supplied code for this question.', 'Your solution must be written in C only.', 'The only external program you may run is the specified command, and you must run it with posix_spawnp. You are not permitted to use system, popen, fork or exec.', 'No error checking is necessary.', 'Your program should produce no output; the commands it runs may or may not.', 'Your program should run the specified command once for every line of input.', 'You can assume that each line of input will not exceed 65536 bytes.'],
      model: R`#include <stdio.h>
#include <string.h>
#include <spawn.h>
#include <sys/wait.h>

#define MAX_LINE 65538
#define MAX_ARGS 32770              // a 65536-byte line has at most 32768 words

extern char **environ;

int main(int argc, char *argv[]) {
    static char line[MAX_LINE];
    static char *args[MAX_ARGS];

    // the command and any extra arguments come first; echo by default
    int fixed = 0;
    if (argc < 2) {
        args[fixed++] = "echo";
    } else {
        for (int i = 1; i < argc; i++) {
            args[fixed++] = argv[i];
        }
    }

    while (fgets(line, sizeof line, stdin) != NULL) {
        int n = fixed;
        // strtok skips leading, trailing and repeated spaces (and the newline)
        for (char *word = strtok(line, " \n"); word != NULL; word = strtok(NULL, " \n")) {
            args[n++] = word;
        }
        args[n] = NULL;

        pid_t pid;
        if (posix_spawnp(&pid, args[0], NULL, NULL, args, environ) == 0) {
            int status;
            waitpid(pid, &status, 0);   // one command at a time, in order
        }
    }
    return 0;
}
`,
      notes: '<code>strtok(line, " \\n")</code> splits on runs of spaces and drops leading and trailing ones (and the newline) for free. Build argv as the command, then any extra command-line arguments, then the words from the line, ending with NULL. <code>waitpid</code> after each spawn keeps the commands in order, so their outputs do not interleave. The line and argv arrays are big (65 KB), so they are <code>static</code> rather than on the stack.',
      check: ['argv[0] is the command; extra arguments come before each line’s words; NULL-terminated', 'Defaults to echo with no arguments', 'posix_spawnp (searches PATH), then waitpid', 'Repeated, leading and trailing spaces ignored']
    },
    {
      id: 'p20t3-q11', qn: 11, slot: 'q10', title: 'Compare two directory trees', file: '20t3final_q11.c',
      task: '<p>We need a program to check if the same files are present in two directory trees. Write a C program, <code>20t3final_q11.c</code>, which is given 2 arguments, the pathnames of directories. It should print a single line of output containing 4 integers:</p>' +
        '<ul><li>the number of files which are present at the same position in both directory trees and are the same size;</li><li>the number present at the same position in both trees but with different sizes;</li><li>the number present only in the first directory tree;</li><li>the number present only in the second directory tree.</li></ul>' +
        '<p>A file needs to be present in both trees at the same relative pathname to be counted: if dir1/1521/lab09/main.c exists, it is present in the second tree only if dir2/1521/lab09/main.c exists, not some other main.c elsewhere such as dir2/2521/lab05/main.c. When a file is present in both trees, you need only check whether both files are the same size (number of bytes), not that they hold the same bytes.</p>' +
        '<p>Autotest will only be of limited assistance in debugging this program; you will need to debug it yourself.</p>',
      examples: R`mkdir -p d1/b/c
echo hello andrew > d1/file1
echo bye andrew > d1/b/file2
echo 1 > d1/b/c/one
mkdir -p d2/b/c
echo HELLO andrew > d2/file1
echo Bye Andrew > d2/b/file2
echo 2 > d2/b/c/one
find d1 d2 -type f | xargs stat -c '%3s %n'
 13 d1/file1
 11 d1/b/file2
  2 d1/b/c/one
 13 d2/file1
 11 d2/b/file2
  2 d2/b/c/one
dcc 20t3final_q11.c -o 20t3final_q11
./20t3final_q11 d1 d2
3 0 0 0
echo hello everyone >d1/file1
./20t3final_q11 d1 d2
2 1 0 0
echo 3 > d2/b/c/three
./20t3final_q11 d1 d2
2 1 0 1
echo 3 > d1/b/three
./20t3final_q11 d1 d2
2 1 1 1
# d1 has b/three and d2 has b/c/three: different relative paths,
# so neither counts as present in both trees`,
      restrictions: ['There is no supplied code for this question.', C_ONLY, NO_EXEC, DEFAULT_LIBS, 'No error checking is necessary.', 'You can assume the trees contain only directories and regular files: no links, special files or sparse files.', 'You can not assume anything about the size or contents of files; they may contain any byte and be any size.', 'Your program does not have to consider permissions, modification times, or other file metadata.', 'You can assume the maximum absolute pathname length will not exceed 65536 bytes.'],
      model: R`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <sys/stat.h>

#define MAX_PATH 65537

// counts[0] same size in both, [1] both but different sizes,
// [2] only in the first tree, [3] only in the second tree
static int counts[4];

// Walk the tree rooted at root, visiting every regular file by its path
// relative to the root. For each, look for the same relative path under
// other. If first is set we are walking tree 1, so files found in both
// are counted here; when walking tree 2 only the missing ones are counted.
// Path buffers are static or malloc'd: 64KB arrays on the stack at every
// level of recursion would overflow it on a deep tree.
static char path[MAX_PATH], here[MAX_PATH], there[MAX_PATH];

static void walk(char *root, char *other, char *relative, int first) {
    snprintf(path, sizeof path, "%s/%s", root, relative);
    DIR *dir = opendir(path);
    if (dir == NULL) {
        return;
    }
    char *child = malloc(MAX_PATH);     // this level's relative path: the
    struct dirent *entry;               // recursive call reads it as relative
    while ((entry = readdir(dir)) != NULL) {
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0) {
            continue;
        }
        if (relative[0] == '\0') {
            snprintf(child, MAX_PATH, "%s", entry->d_name);
        } else {
            snprintf(child, MAX_PATH, "%s/%s", relative, entry->d_name);
        }

        snprintf(here, sizeof here, "%s/%s", root, child);
        snprintf(there, sizeof there, "%s/%s", other, child);
        struct stat s;
        if (stat(here, &s) != 0) {
            continue;
        }
        if (S_ISDIR(s.st_mode)) {
            walk(root, other, child, first);
            continue;
        }

        struct stat t;
        int in_other = stat(there, &t) == 0 && S_ISREG(t.st_mode);
        if (!in_other) {
            counts[first ? 2 : 3]++;
        } else if (first) {
            counts[s.st_size == t.st_size ? 0 : 1]++;
        }
    }
    free(child);
    closedir(dir);
}

int main(int argc, char *argv[]) {
    walk(argv[1], argv[2], "", 1);
    walk(argv[2], argv[1], "", 0);
    printf("%d %d %d %d\n", counts[0], counts[1], counts[2], counts[3]);
    return 0;
}
`,
      notes: 'Walk each tree once, carrying the path <i>relative</i> to its root, and look up the same relative path under the other root with <code>stat</code>. Walking the first tree counts the first three numbers; walking the second only needs to count files missing from the first. Skip "." and "..", or the recursion never ends. 64 KB path buffers on the stack at every level would overflow it on a deep tree, so they are static, except each level’s own relative path, which is malloc’d because the recursive call still reads it.',
      check: ['Compares relative paths, not just names', 'Skips . and .. when recursing', 'Sizes compared with stat (st_size), not by reading the files', 'Each file counted exactly once across the four numbers']
    }
  ]);

  cq('22T2', [
    {
      id: 'p22t2-q1', qn: 1, slot: 'q2', title: 'Count zero bits', file: '22t2final_q1.c',
      task: '<p>Count zero bits is an operation on a list of bits that counts how many zero-bits are present. For example, for an 8-bit number:</p>' +
        '<pre class="code">count_zero_bits(0b11111111) == 0\ncount_zero_bits(0b11101111) == 1\ncount_zero_bits(0b10011111) == 2\ncount_zero_bits(0b00011001) == 5\ncount_zero_bits(0b00010000) == 7\ncount_zero_bits(0b00000000) == 8</pre>' +
        '<p>You must implement this operation for 32-bit values. Add code to the function <code>count_zero_bits</code> in <code>22t2final_q1.c</code> so that it counts and returns the number of zero bits in a 32-bit unsigned integer x.</p>' + recon('The file holding <code>main</code> (here <code>22t2final_q1_main.c</code>)'),
      files: [{ name: '22t2final_q1.c', text: R`// COMP1521 22T2 ... final exam, question 1

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int count_zero_bits(uint32_t x) {
	// TODO
	return 42;
}
` }, { name: '22t2final_q1_main.c', text: R`// 22t2final_q1_main.c — DO NOT CHANGE (reconstructed)
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int count_zero_bits(uint32_t x);

int main(int argc, char *argv[]) {
	uint32_t x = strtoul(argv[1], NULL, 0);
	printf("%d\n", count_zero_bits(x));
	return 0;
}
` }],
      starter: R`// COMP1521 22T2 ... final exam, question 1

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int count_zero_bits(uint32_t x) {
	// TODO
	return 42;
}
`,
      examples: R`make 22t2final_q1
# 0 == 0x00000000
./22t2final_q1 0
32
# 305419896 == 0x12345678
./22t2final_q1 305419896
19
# 4294967295 == 0xFFFFFFFF
./22t2final_q1 4294967295
0`,
      restrictions: [C_ONLY, 'No error checking is necessary or required.'],
      model: R`// COMP1521 22T2 ... final exam, question 1

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int count_zero_bits(uint32_t x) {
	int count = 0;
	for (int i = 0; i < 32; i++) {
		if (((x >> i) & 1) == 0) {
			count++;
		}
	}
	return count;
}
`,
      notes: 'Test all 32 positions. A loop that stops when x becomes 0 never sees the leading zeros (0 would give 0 instead of 32).',
      check: ['All 32 bits examined, including leading zeros']
    },
    {
      id: 'p22t2-q3', qn: 3, slot: 'q2', title: 'Reverse the bytes', file: '22t2final_q3.c',
      task: '<p>You have been given <code>22t2final_q3.c</code>, which contains a C function <code>_22t2final_q3</code> that currently takes one integer value and returns it unchanged. Add code so that, given a <code>uint32_t</code> value, it returns the provided value but with its bytes reversed. For example, 0x12345678 becomes 0x78563412.</p><p>Note that your task is to reverse the order of bytes, not to reverse the order of bits.</p>' + RECON,
      files: [{ name: '22t2final_q3.c', text: R`#include <stdint.h>

uint32_t _22t2final_q3(uint32_t value) {
	return value;
}
` }, { name: '22t2final_q3_main.c', text: R`// 22t2final_q3_main.c — DO NOT CHANGE (reconstructed)
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

uint32_t _22t2final_q3(uint32_t value);

int main(int argc, char *argv[]) {
	for (int arg = 1; arg < argc; arg++) {
		uint32_t value = strtoul(argv[arg], NULL, 0);
		printf("22t2final_q3(0x%08X) returned 0x%08X\n", value, _22t2final_q3(value));
	}
	return 0;
}
` }],
      starter: R`#include <stdint.h>

uint32_t _22t2final_q3(uint32_t value) {
	return value;
}
`,
      examples: R`make 22t2final_q3
./22t2final_q3 0x12345678
22t2final_q3(0x12345678) returned 0x78563412
./22t2final_q3 0x43000090
22t2final_q3(0x43000090) returned 0x90000043
./22t2final_q3 0x55001248
22t2final_q3(0x55001248) returned 0x48120055
./22t2final_q3 0x55000001
22t2final_q3(0x55000001) returned 0x01000055
./22t2final_q3 0x10000080
22t2final_q3(0x10000080) returned 0x80000010
./22t2final_q3 0xFF00FF00
22t2final_q3(0xFF00FF00) returned 0x00FF00FF
./22t2final_q3 0xFF0000FF
22t2final_q3(0xFF0000FF) returned 0xFF0000FF
./22t2final_q3 0x00000001
22t2final_q3(0x00000001) returned 0x01000000
./22t2final_q3 0x10000000
22t2final_q3(0x10000000) returned 0x00000010
./22t2final_q3 0x00000000
22t2final_q3(0x00000000) returned 0x00000000
./22t2final_q3 0xFFFFFFFF
22t2final_q3(0xFFFFFFFF) returned 0xFFFFFFFF`,
      restrictions: [NO_LIBC, 'You may not change the provided 22t2final_q3_main.c file, or _22t2final_q3\'s prototype.', 'You may define and call your own functions if you wish.', C_ONLY, NO_EXEC22, 'No error checking is necessary or required.'],
      model: R`#include <stdint.h>

uint32_t _22t2final_q3(uint32_t value) {
	uint32_t byte0 = value & 0xFF;
	uint32_t byte1 = (value >> 8) & 0xFF;
	uint32_t byte2 = (value >> 16) & 0xFF;
	uint32_t byte3 = (value >> 24) & 0xFF;
	return (byte0 << 24) | (byte1 << 16) | (byte2 << 8) | byte3;
}
`,
      notes: 'Mask each byte out before moving it, and keep the value unsigned: shifting a signed int right copies the sign bit, which would smear 1s into the result for 0xFF000000.',
      check: ['Each byte masked with 0xFF and shifted to its mirror position', 'Unsigned arithmetic throughout']
    },
    {
      id: 'p22t2-q5', qn: 5, slot: 'q6', title: 'Print the first n (or all but the last |n|) bytes', file: '22t2final_q5.c',
      task: '<p>You have been given <code>22t2final_q5.c</code>: a C program with an empty implementation of the function <code>print_bytes</code>. Add code so that, if n is positive (or zero), it prints the first n bytes from the provided file. If n is negative, it should instead print all but the last |n| bytes of the file, where |n| is the absolute value of n; e.g. if n is −5, then |n| is 5.</p>' +
        '<p>If n extends outside the range of the file (e.g. n = 50 or n = −50 in a 10 byte file), your program should behave as if n was 10 in the first case, and as if n was −10 in the second case: extending outside the range of the file has no additional effect.</p>' +
        '<p>You cannot assume that the provided file is an ASCII text file. In particular it may contain NUL bytes (zero bytes), so you cannot use string-based functions such as <code>fgets</code> to read it. You may find the functions <code>fgetc</code>, <code>fseek</code>, <code>ftell</code> and <code>putchar</code> useful.</p>' + recon('The file holding <code>main</code> (here <code>22t2final_q5_main.c</code>)'),
      files: [{ name: '22t2final_q5.c', text: R`// COMP1521 22T2 ... final exam, question 5

#include <stdio.h>

void print_bytes(FILE *file, long n) {
	// TODO
}
` }, { name: '22t2final_q5_main.c', text: R`// 22t2final_q5_main.c — DO NOT CHANGE (reconstructed)
#include <stdio.h>
#include <stdlib.h>

void print_bytes(FILE *file, long n);

int main(int argc, char *argv[]) {
	FILE *file = fopen(argv[1], "rb");
	print_bytes(file, strtol(argv[2], NULL, 10));
	fclose(file);
	return 0;
}
` }],
      starter: R`// COMP1521 22T2 ... final exam, question 5

#include <stdio.h>

void print_bytes(FILE *file, long n) {
	// TODO
}
`,
      examples: R`make 22t2final_q5
echo 'you are doing great, keep it up!' >my_file
./22t2final_q5 my_file 19
you are doing great
# ^^^ no terminating newline
./22t2final_q5 my_file 7
you are
# ^^^ no terminating newline
./22t2final_q5 my_file 10000
you are doing great, keep it up!
./22t2final_q5 my_file -14
you are doing great
# ^^^ no terminating newline`,
      restrictions: [C_ONLY, 'You cannot use string-based functions such as fgets to read the file: it may contain NUL bytes.', 'No error checking is necessary or required.'],
      model: R`// COMP1521 22T2 ... final exam, question 5

#include <stdio.h>

void print_bytes(FILE *file, long n) {
	fseek(file, 0, SEEK_END);           // how long is the file?
	long size = ftell(file);
	fseek(file, 0, SEEK_SET);

	long count;
	if (n >= 0) {
		count = n < size ? n : size;            // the first n bytes
	} else {
		count = size + n > 0 ? size + n : 0;    // all but the last |n|
	}

	for (long i = 0; i < count; i++) {
		putchar(fgetc(file));                   // byte by byte: NUL bytes too
	}
}
`,
      notes: 'Both cases come down to one count of bytes from the start: min(n, size) when n ≥ 0, and max(size + n, 0) when n &lt; 0. <code>fseek</code> to the end and <code>ftell</code> give the size; seek back to the start before reading. <code>putchar</code> writes NUL bytes too, unlike <code>printf("%s")</code>.',
      check: ['Clamps n to the file size in both directions', 'Seeks back to the start after measuring', 'Byte-by-byte output (NUL-safe)']
    },
    {
      id: 'p22t2-q6', qn: 6, slot: 'q8', title: 'Slice a UTF-8 string by characters', file: '22t2final_q6.c',
      task: '<p>You have been given <code>22t2final_q6.c</code>, which contains a C function <code>_22t2final_q6</code> that takes a UTF-8 encoded string, an inclusive starting index <code>range_start</code> and an exclusive ending index <code>range_end</code>, and returns a <code>char *</code>.</p>' +
        '<p>Add code so that it returns a new string made of the UTF-8 code points that lie in the range range_start to range_end of the provided string. The returned string must be a new string: you must not modify the provided <code>utf8_string</code>, but instead use <code>malloc</code> (or <code>strdup</code>) to allocate new memory that you then return; main will free it. You can assume the given string is valid UTF-8.</p>' +
        '<table class="dtable"><tr><th>#bytes</th><th>#bits</th><th>Byte 1</th><th>Byte 2</th><th>Byte 3</th><th>Byte 4</th></tr><tr><td>1</td><td>7</td><td>0xxxxxxx</td><td>-</td><td>-</td><td>-</td></tr><tr><td>2</td><td>11</td><td>110xxxxx</td><td>10xxxxxx</td><td>-</td><td>-</td></tr><tr><td>3</td><td>16</td><td>1110xxxx</td><td>10xxxxxx</td><td>10xxxxxx</td><td>-</td></tr><tr><td>4</td><td>21</td><td>11110xxx</td><td>10xxxxxx</td><td>10xxxxxx</td><td>10xxxxxx</td></tr></table>' + recon('<code>22t2final_q6_main.c</code>'),
      files: [{ name: '22t2final_q6.c', text: R`#include <string.h>
#include <stdlib.h>

/**
 * given a UTF-8 encoded string,
 * return a new string that is only
 * the characters within the provided range.
 *
 * Note:
 * range_start is INCLUSIVE
 * range_end   is EXCLUSIVE
 *
 * eg:
 * "hello world", 0, 5
 * would return "hello"
 *
 * "🍓🍇🍈🍍🍐", 2, 5
 * would return "🍈🍍🍐"
**/

char *_22t2final_q6(char *utf8_string, unsigned int range_start, unsigned int range_end) {
	char *new_string = strdup(utf8_string);

	return new_string;
}
` }, { name: '22t2final_q6_main.c', text: R`// 22t2final_q6_main.c — DO NOT CHANGE (reconstructed)
#include <stdio.h>
#include <stdlib.h>

char *_22t2final_q6(char *utf8_string, unsigned int range_start, unsigned int range_end);

int main(int argc, char *argv[]) {
	unsigned int start = strtoul(argv[2], NULL, 10);
	unsigned int end = strtoul(argv[3], NULL, 10);
	char *result = _22t2final_q6(argv[1], start, end);
	printf("22t2final_q6(\"%s\", %u, %u) returned \"%s\"\n", argv[1], start, end, result);
	free(result);
	return 0;
}
` }],
      starter: R`#include <string.h>
#include <stdlib.h>

char *_22t2final_q6(char *utf8_string, unsigned int range_start, unsigned int range_end) {
	char *new_string = strdup(utf8_string);

	return new_string;
}
`,
      examples: R`make 22t2final_q6
./22t2final_q6 "hello world" 3 8
22t2final_q6("hello world", 3, 8) returned "lo wo"
./22t2final_q6 "🍓🍇🍈🍍🍐🍖🍧🍆🍊🍞" 2 4
22t2final_q6("🍓🍇🍈🍍🍐🍖🍧🍆🍊🍞", 2, 4) returned "🍈🍍"
./22t2final_q6 "⇜⇿↴↛⇳⇙↜↧⇥↖⇸⇋⇈⇘↟↹⇝↩↥⇊⇇⇓⇟⇬⇩" 22 25
22t2final_q6("⇜⇿↴↛⇳⇙↜↧⇥↖⇸⇋⇈⇘↟↹⇝↩↥⇊⇇⇓⇟⇬⇩", 22, 25) returned "⇟⇬⇩"`,
      restrictions: ['You may not change the provided 22t2final_q6_main.c file, or _22t2final_q6\'s prototype.', 'You must return newly allocated memory and must not modify utf8_string.', C_ONLY, NO_EXEC22, 'You may call any functions from the C standard library available by default on CSE Linux systems.', 'No error checking is necessary or required.'],
      model: R`#include <string.h>
#include <stdlib.h>

// The number of bytes in the UTF-8 character starting with byte b.
static int utf8_length(unsigned char b) {
	if ((b & 0x80) == 0x00) return 1;   // 0xxxxxxx
	if ((b & 0xE0) == 0xC0) return 2;   // 110xxxxx
	if ((b & 0xF0) == 0xE0) return 3;   // 1110xxxx
	return 4;                           // 11110xxx
}

char *_22t2final_q6(char *utf8_string, unsigned int range_start, unsigned int range_end) {
	// walk the string one character (code point) at a time, remembering
	// the byte offsets where character range_start and range_end begin
	size_t i = 0;
	unsigned int index = 0;
	int found_start = 0;
	size_t start = 0;
	while (index < range_end && utf8_string[i] != '\0') {
		if (index == range_start) {
			start = i;
			found_start = 1;
		}
		i += utf8_length((unsigned char)utf8_string[i]);
		index++;
	}
	size_t end = i;
	if (!found_start) start = end;      // nothing in range: return ""

	char *new_string = malloc(end - start + 1);
	memcpy(new_string, utf8_string + start, end - start);
	new_string[end - start] = '\0';
	return new_string;
}
`,
      notes: 'Indexes count characters, not bytes, so walk the string a whole character at a time, reading each length from its lead byte, and note the byte offsets where characters range_start and range_end begin. Then copy that byte range. Cast to <code>unsigned char</code> before testing the high bits. A start beyond the end of the string returns "", not the whole string.',
      check: ['Walks by character using the lead-byte length', 'Copies a byte range into newly malloc’d memory, NUL-terminated', 'Handles ranges running past the end of the string']
    },
    {
      id: 'p22t2-q7', qn: 7, slot: 'q10', title: 'find with name and depth limits', file: '22t2final_q7.c',
      task: '<p>You have been given <code>22t2final_q7.c</code>: a C program with an empty implementation of the function <code>_22t2final_q7(char *directory, char *name, int min_depth, int max_depth)</code>. Add code so that it recursively looks through the provided directory for files and directories that match the given criteria, printing the path of each one that matches. If you find a directory that does not match, you should still recursively search inside it; just don’t print it.</p>' +
        '<ul><li><b>name</b>: if NULL, this restriction does not apply. Otherwise the file or directory’s name (the <code>d_name</code> field of the <code>struct dirent</code> from <code>readdir</code>) must exactly match name.</li>' +
        '<li><b>min_depth</b>: if −1, this restriction does not apply. Otherwise the search must be at least min_depth directories deep.</li>' +
        '<li><b>max_depth</b>: if −1, this restriction does not apply. Otherwise the search must be at most max_depth directories deep.</li></ul>' +
        '<p>Keep track of the current depth through a recursive parameter. Files directly inside the provided directory are at depth 0. The order you print in does not matter: the output is sorted before autotest checks it. You may find <code>opendir</code>, <code>readdir</code> and <code>closedir</code> useful. You may assume you have read and execute permission on every directory and read permission on every file.</p>' +
        recon('<code>22t2final_q7_main.c</code> (where an empty name means NULL) and the example directory tree'),
      files: [{ name: '22t2final_q7.c', text: R`void _22t2final_q7(char *directory, char *name, int min_depth, int max_depth) {
    // TODO
}
` }, { name: '22t2final_q7_main.c', text: R`// 22t2final_q7_main.c — DO NOT CHANGE (reconstructed)
// usage: 22t2final_q7 <directory> [name [min_depth [max_depth]]]
// An empty or missing name means "any name"; a missing depth means -1.
#include <stdio.h>
#include <stdlib.h>

void _22t2final_q7(char *directory, char *name, int min_depth, int max_depth);

int main(int argc, char *argv[]) {
	char *name = argc > 2 && argv[2][0] != '\0' ? argv[2] : NULL;
	int min_depth = argc > 3 ? atoi(argv[3]) : -1;
	int max_depth = argc > 4 ? atoi(argv[4]) : -1;
	_22t2final_q7(argv[1], name, min_depth, max_depth);
	return 0;
}
` }, { name: 'make_dirs.sh', text: R`# builds a 22t2final_q7_dirs that matches the examples (reconstructed)
mkdir -p 22t2final_q7_dirs && cd 22t2final_q7_dirs
touch a e
for d in a b c; do
    mkdir -p dir1/$d
    for f in a b c d e; do touch dir1/$d/$f; done
done
rm dir1/a/a && mkdir dir1/a/a
mkdir -p dir4 dir2/deep/deep/deep/deep/deep/deep/deep/deep/deep/deep
touch dir2/a dir2/deep/deep/deep/deep/deep/deep/deep/deep/deep/deep/a dir4/a dir4/e` }],
      starter: R`#include <stdio.h>
#include <string.h>
#include <dirent.h>
#include <sys/stat.h>

void _22t2final_q7(char *directory, char *name, int min_depth, int max_depth) {
    // TODO
}
`,
      examples: R`make 22t2final_q7
unzip 22t2final_q7_dirs.zip
./22t2final_q7 22t2final_q7_dirs 'a' 1 3 | sort
22t2final_q7_dirs/dir1/a
22t2final_q7_dirs/dir1/a/a
22t2final_q7_dirs/dir1/b/a
22t2final_q7_dirs/dir1/c/a
22t2final_q7_dirs/dir2/a
22t2final_q7_dirs/dir4/a
./22t2final_q7 22t2final_q7_dirs 'a' -1 1 | sort
22t2final_q7_dirs/a
22t2final_q7_dirs/dir1/a
22t2final_q7_dirs/dir2/a
22t2final_q7_dirs/dir4/a
./22t2final_q7 22t2final_q7_dirs 'a' 5 -1 | sort
22t2final_q7_dirs/dir2/deep/deep/deep/deep/deep/deep/deep/deep/deep/deep/a
./22t2final_q7 22t2final_q7_dirs 'e' | sort
22t2final_q7_dirs/dir1/a/e
22t2final_q7_dirs/dir1/b/e
22t2final_q7_dirs/dir1/c/e
22t2final_q7_dirs/dir4/e
22t2final_q7_dirs/e
./22t2final_q7 22t2final_q7_dirs '' 2 2 | sort
22t2final_q7_dirs/dir1/a/.
22t2final_q7_dirs/dir1/a/..
22t2final_q7_dirs/dir1/a/a
22t2final_q7_dirs/dir1/a/b
22t2final_q7_dirs/dir1/a/c
22t2final_q7_dirs/dir1/a/d
22t2final_q7_dirs/dir1/a/e
22t2final_q7_dirs/dir1/b/.
22t2final_q7_dirs/dir1/b/..
22t2final_q7_dirs/dir1/b/a
22t2final_q7_dirs/dir1/b/b
22t2final_q7_dirs/dir1/b/c
22t2final_q7_dirs/dir1/b/d
22t2final_q7_dirs/dir1/b/e
22t2final_q7_dirs/dir1/c/.
22t2final_q7_dirs/dir1/c/..
22t2final_q7_dirs/dir1/c/a
22t2final_q7_dirs/dir1/c/b
22t2final_q7_dirs/dir1/c/c
22t2final_q7_dirs/dir1/c/d
22t2final_q7_dirs/dir1/c/e
22t2final_q7_dirs/dir2/deep/.
22t2final_q7_dirs/dir2/deep/..
22t2final_q7_dirs/dir2/deep/deep`,
      restrictions: ['You may not change the provided 22t2final_q7_main.c file, or _22t2final_q7\'s prototype.', 'You may define and call your own functions if you wish.', C_ONLY, NO_EXEC22, 'No error checking is necessary or required.'],
      model: R`#include <stdio.h>
#include <string.h>
#include <dirent.h>
#include <sys/stat.h>

#define MAX_PATH 4096

static void search(char *directory, char *name, int min_depth, int max_depth, int depth) {
	DIR *dir = opendir(directory);
	if (dir == NULL) {
		return;
	}
	struct dirent *entry;
	while ((entry = readdir(dir)) != NULL) {
		char path[MAX_PATH];
		snprintf(path, sizeof path, "%s/%s", directory, entry->d_name);

		int name_ok = name == NULL || strcmp(entry->d_name, name) == 0;
		int min_ok = min_depth == -1 || depth >= min_depth;
		int max_ok = max_depth == -1 || depth <= max_depth;
		if (name_ok && min_ok && max_ok) {
			printf("%s\n", path);
		}

		// recurse into every subdirectory, whether or not it matched,
		// but never back into . or ..
		struct stat s;
		if (strcmp(entry->d_name, ".") != 0 && strcmp(entry->d_name, "..") != 0 &&
		    stat(path, &s) == 0 && S_ISDIR(s.st_mode)) {
			search(path, name, min_depth, max_depth, depth + 1);
		}
	}
	closedir(dir);
}

void _22t2final_q7(char *directory, char *name, int min_depth, int max_depth) {
	search(directory, name, min_depth, max_depth, 0);
}
`,
      notes: 'The public function cannot carry a depth, so it calls a recursive helper that takes one more parameter. Every entry, "." and ".." included, is a candidate for printing (the last example prints them), but the search never recurses into "." or "..". Test each entry with <code>stat</code> (or <code>d_type</code>) to decide whether to recurse, independently of whether it matched.',
      check: ['Depth tracked through a recursive parameter, starting at 0', 'Recurses into non-matching directories too', 'Never recurses into . or ..', 'Each restriction skipped when it is NULL / −1']
    },
    {
      id: 'p22t2-q9', qn: 9, slot: 'q10', title: 'Watch files against a quota (threads)', file: '22t2final_q9.c',
      task: '<p>Write <code>22t2final_q9.c</code>, a program which spawns threads to watch multiple files and keep track of the files’ collective size. Each file must be watched by its own thread: if the user wants to watch foo, bar and baz, your program has four threads, the initial main thread waiting for further input, and one for each of the three files. The main thread reads the names of files to watch from standard input, one per line.</p>' +
        '<p>If the files’ combined size exceeds a (#define’d) quota, a single warning should be printed. When the user fixes the issue, a single message should be printed, to let the user know the problem is solved. Each thread should continue watching its file until it is deleted; the overall program should terminate when all files are deleted.</p>' +
        '<p>You must not get the size of files yourself: use the provided (thread-safe) function <code>file_size</code>, which returns the size, or <code>FILE_NOT_FOUND</code> once the file has been deleted. It will be changed during testing, so do not rely on how it works.</p>' +
        '<p>This is a concurrency exercise, solvable with mutexes, atomics, or both. All submissions are hand-marked: solutions with possible race conditions lose marks, and solutions with no attempt to solve the concurrency issues get zero. Each file must be checked at least once every 250 milliseconds.</p>' +
        '<p>The example shows one user in two terminals; the quota there is 10 bytes.</p>' +
        recon('The helper files, <code>22t2final_q9_helper.h</code> and <code>22t2final_q9_helper.c</code>,'),
      files: [{ name: '22t2final_q9_helper.h', text: R`// 22t2final_q9_helper.h (reconstructed)
// You may change QUOTA while testing; autotest uses the original file.
#ifndef QUOTA_HELPER_H
#define QUOTA_HELPER_H

#define QUOTA 10                        // bytes (10 in the paper's example)
#define QUOTA_EXCEEDED_MESSAGE "Quota exceeded!\n"
#define QUOTA_RESOLVED_MESSAGE "Quota resolved!\n"

#define FILE_NOT_FOUND (-1)
#define MAX_WATCHED_FILES 64
#define PATH_SIZE 256                   // including the terminating '\0'

// The size of the file at path, or FILE_NOT_FOUND once it has been deleted.
// Thread-safe, but each thread may only ever ask about one file.
int file_size(char *path);

#endif
` }, { name: '22t2final_q9_helper.c', text: R`// 22t2final_q9_helper.c (reconstructed) — DO NOT CHANGE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include "22t2final_q9_helper.h"

static __thread char watched[PATH_SIZE];     // the one file this thread may ask about

int file_size(char *path) {
    if (watched[0] == '\0') {
        snprintf(watched, sizeof watched, "%s", path);
    } else if (strcmp(watched, path) != 0) {
        fprintf(stderr, "file_size: this thread already watches %s, not %s\n", watched, path);
        exit(1);
    }
    struct stat s;
    if (stat(path, &s) != 0) {
        return FILE_NOT_FOUND;
    }
    return (int)s.st_size;
}
` }],
      starter: R`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <unistd.h>

#include "22t2final_q9_helper.h"

int main(void) {
    // TODO: read file names, one per line, and watch each from its own thread

    return 0;
}
`,
      examples: R`make 22t2final_q9
touch file1
echo "abcdefg" >file2
./22t2final_q9                      # TERMINAL 1
file1
file2
                                    # TERMINAL 2: echo "abcdefg" >> file1
Quota exceeded!
                                    # TERMINAL 2: rm file1   (file1 no longer watched)
Quota resolved!
                                    # TERMINAL 2: echo "abcdefg" > file1   (no effect)
                                    # TERMINAL 2: echo "abcdefg" > file3
file3
Quota exceeded!
                                    # TERMINAL 2: rm file2 file3
Quota resolved!
[program exited with return code 0]`,
      restrictions: ['Each file must be watched from its own thread (file_size fails if one thread asks about two files).', 'You must not get file sizes yourself; use file_size.', 'Solutions with possible race conditions will lose marks; no attempt at synchronisation gets zero.', 'Each file must be checked at least once every 250 milliseconds.', 'You will never be asked to watch more than MAX_WATCHED_FILES files; paths are at most PATH_SIZE chars including the terminator.', 'You may change QUOTA while testing, but autotest uses the original 22t2final_q9_helper.h.', C_ONLY, 'No error checking is necessary, except that needed for the functionality described.'],
      model: R`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <unistd.h>

#include "22t2final_q9_helper.h"

// State shared by every watcher thread. Every access holds the lock.
struct shared {
    pthread_mutex_t lock;
    long total;         // combined size of the watched files
    int watching;       // threads still watching a file
    int exceeded;       // 1 while the quota is exceeded (so each message prints once)
};

struct watch {
    char path[PATH_SIZE];
    struct shared *shared;
};

// Print a message only when the state changes. Call with the lock held.
static void check_quota(struct shared *sh) {
    if (!sh->exceeded && sh->total > QUOTA) {
        printf(QUOTA_EXCEEDED_MESSAGE);
        fflush(stdout);
        sh->exceeded = 1;
    } else if (sh->exceeded && sh->total <= QUOTA) {
        printf(QUOTA_RESOLVED_MESSAGE);
        fflush(stdout);
        sh->exceeded = 0;
    }
}

static void *watcher(void *arg) {
    struct watch *w = arg;
    struct shared *sh = w->shared;
    int counted = 0;                    // this file's size, as included in total

    while (1) {
        int size = file_size(w->path);  // outside the lock: it may be slow

        pthread_mutex_lock(&sh->lock);
        if (size == FILE_NOT_FOUND) {
            sh->total -= counted;       // the file is gone: stop counting it
            check_quota(sh);
            sh->watching--;
            if (sh->watching == 0) {
                // Every file deleted: end the program. Not exit(): it flushes
                // every stdio stream, including stdin, whose lock main's
                // blocked fgets holds, so it can hang. Flush stdout, then _exit.
                fflush(stdout);
                _exit(0);
            }
            pthread_mutex_unlock(&sh->lock);
            free(w);
            return NULL;
        }
        sh->total += size - counted;    // add only the change since last time
        counted = size;
        check_quota(sh);
        pthread_mutex_unlock(&sh->lock);

        usleep(50 * 1000);              // check each file every 50 ms (< 250 ms)
    }
}

int main(void) {
    // static: it must outlive main's frame, since main exits with pthread_exit
    static struct shared sh = { PTHREAD_MUTEX_INITIALIZER, 0, 0, 0 };

    char line[PATH_SIZE + 2];          // a path, the newline and the 0
    while (fgets(line, sizeof line, stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        if (line[0] == '\0') {
            continue;
        }
        struct watch *w = malloc(sizeof *w);
        strncpy(w->path, line, PATH_SIZE - 1);
        w->path[PATH_SIZE - 1] = '\0';
        w->shared = &sh;

        pthread_mutex_lock(&sh.lock);   // count it before the thread can finish
        sh.watching++;
        pthread_mutex_unlock(&sh.lock);

        pthread_t thread;
        pthread_create(&thread, NULL, watcher, w);
        pthread_detach(thread);
    }

    // End of input: the watchers carry on; the last one exits the program.
    pthread_exit(NULL);
}
`,
      notes: 'Each thread keeps the size it last added to the shared total and adds only the change, so the total stays right as files grow, shrink and disappear. One mutex guards the total, the "exceeded" flag and the count of live watchers, and the quota check happens under the same lock as the update, so two threads cannot both print "exceeded". file_size is called <i>outside</i> the lock so a slow check does not block the others. The last watcher to see its file deleted ends the program; it uses <code>_exit</code> after flushing stdout, because <code>exit</code> flushes every stdio stream, including stdin, whose lock main’s blocked <code>fgets</code> is holding, and can hang.',
      check: ['One thread per file; each thread only ever asks file_size about its own file', 'Every access to shared state is under a lock (or atomic)', 'Messages print once per change of state, not on every check', 'Program ends when the last watched file is deleted', 'Each file checked well within 250 ms']
    },
    {
      id: 'p22t2-q10', qn: 10, slot: 'q10', title: 'rush: a very simple shell', file: '22t2final_q10.c',
      task: '<p>Create a very simple shell, <b>rush</b>, that lets the user enter commands and displays their output. You are given a program that prints the <code>[rush]</code> prompt and reads input, but currently prints a TODO message after every line. Its features, worth these shares of the marks, depend on the previous ones, so complete them in order:</p>' +
        '<table class="dtable"><tr><th>mark</th><th>feature</th></tr><tr><td>10%</td><td>exit</td></tr><tr><td>20%</td><td>cd and pwd</td></tr><tr><td>25%</td><td>executing fully qualified commands</td></tr><tr><td>25%</td><td>executing commands from the PATH</td></tr><tr><td>20%</td><td>globbing arguments</td></tr></table>' +
        '<p><b>1. exit</b> exits the shell with no additional output, ignoring any arguments.</p>' +
        '<p><b>2. cd and pwd.</b> <code>cd</code> changes the working directory with <code>chdir</code>, to the user’s home directory (<code>getenv("HOME")</code>) if it has no argument. If chdir fails, print <code>fprintf(stderr, "cannot cd to %s\\n", directory);</code>. <code>pwd</code> prints the current working directory. Both ignore extra arguments.</p>' +
        '<p><b>3. Qualified commands.</b> Tokenise the input on spaces with <code>strtok</code>. The first token is the command; the rest are its arguments, with the command name prepended as argv[0]. Check the command is executable with <code>is_executable</code>; if not, print <code>fprintf(stderr, "%s: cannot execute command\\n", command);</code> and wait for more input. Otherwise run it with <code>posix_spawn</code> (file_actions and attrp may be NULL), then <code>waitpid</code> for it.</p>' +
        '<p><b>4. Commands from the PATH.</b> A command with no <code>/</code> in it (check with <code>strchr</code>) is unqualified: split <code>getenv("PATH")</code> on <code>:</code> with strtok, and use the first directory in which <code>is_executable</code> finds the command (<code>snprintf</code> helps join the strings). If none, print the same error. You are <b>not</b> allowed to use <code>posix_spawnp</code> for this: search the PATH yourself and use posix_spawn.</p>' +
        '<p><b>5. Globbing.</b> Feed every argument to commands (cd, qualified and unqualified commands), but not the command itself, through <code>do_glob</code>, which returns a <code>glob_t</code>. <code>gl_pathc</code> is the number of expansions and <code>gl_pathv</code> the list of them, so one argument may become several: a program may get more arguments than you expected.</p>' +
        '<p>Limits: a line is at most 1023 characters, the working directory at most 1023, a command at most 127; at most 32 arguments, each at most 127 characters. The reference solution is <code>1521 rush</code>; if it crashes with an assertion failure, you need not handle that case.</p>' + recon('The starter code'),
      starter: R`// COMP1521 22T2 ... final exam, question 10: rush, a very simple shell
// (reconstructed starter)

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <spawn.h>
#include <glob.h>
#include <sys/stat.h>
#include <sys/wait.h>

#define MAX_LINE 1024       // a line of input, including the '\0'
#define MAX_CWD 1024        // the current working directory
#define MAX_COMMAND 128     // exit, cd, pwd, or a command's name or path
#define MAX_ARGS 32         // arguments to one command (before globbing)
#define MAX_ARG 128         // one argument
#define MAX_PATH 4096       // a directory from PATH joined to a command

extern char **environ;

// 1 iff path names a regular file that this user can execute.
int is_executable(char *path) {
    struct stat s;
    return stat(path, &s) == 0 && S_ISREG(s.st_mode) && access(path, X_OK) == 0;
}

// Expand ~ and wildcards in text, as a shell would. If nothing matches,
// the result holds text itself. Free the result with globfree.
glob_t do_glob(char *text) {
    glob_t result;
    glob(text, GLOB_NOCHECK | GLOB_TILDE, NULL, &result);
    return result;
}

int main(void) {
    char cwd[MAX_CWD];
    getcwd(cwd, sizeof cwd);

    char line[MAX_LINE];
    while (1) {
        printf("[rush] ");
        fflush(stdout);
        if (fgets(line, sizeof line, stdin) == NULL) {
            break;
        }
        line[strcspn(line, "\n")] = '\0';

        // TODO: add your code here
        printf("TODO: add your code here\n");
    }
    return 0;
}
`,
      examples: R`dcc 22t2final_q10.c -o 22t2final_q10
./22t2final_q10
[rush] cd /home/zac/stuff/
[rush] pwd
/home/zac/stuff
[rush] cd ..
[rush] pwd
/home/zac
[rush] cd hdhhfdhjf
cannot cd to hdhhfdhjf
[rush] /bin/echo hello world!
hello world!
[rush] /bin/file 22t2final_q10.c
22t2final_q10.c: C source, ASCII text
[rush] ./22t2final_q10.c
./22t2final_q10.c: cannot execute command
[rush] ls -l
total 132
-rwxrwxr-x 1 zac zac 123192 Jan 01 12:00 22t2final_q10
-rw-rw-r-- 1 zac zac   5004 Jan 01 12:00 22t2final_q10.c
[rush] hdhhfdhjf
hdhhfdhjf: cannot execute command
[rush] echo my files are *
my files are 22t2final_q10 22t2final_q10.c
[rush] cd ~/stuff
[rush] pwd
/home/zac/stuff
[rush] exit foo bar baz`,
      restrictions: [C_ONLY, 'You must use posix_spawn to run commands: no system or exec-style functions, and no posix_spawnp for feature 4.', 'Your program cannot call external programs, except those requested by the user’s input.', 'You may call functions from any C library available by default on CSE Linux systems.', 'No error checking is necessary, except that required to implement the features (e.g. checking a program is executable).'],
      model: R`// COMP1521 22T2 ... final exam, question 10: rush, a very simple shell

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <spawn.h>
#include <glob.h>
#include <sys/stat.h>
#include <sys/wait.h>

#define MAX_LINE 1024       // a line of input, including the '\0'
#define MAX_CWD 1024        // the current working directory
#define MAX_COMMAND 128     // exit, cd, pwd, or a command's name or path
#define MAX_ARGS 32         // arguments to one command (before globbing)
#define MAX_ARG 128         // one argument
#define MAX_PATH 4096       // a directory from PATH joined to a command

extern char **environ;

// 1 iff path names a regular file that this user can execute.
int is_executable(char *path) {
    struct stat s;
    return stat(path, &s) == 0 && S_ISREG(s.st_mode) && access(path, X_OK) == 0;
}

// Expand ~ and wildcards in text, as a shell would. If nothing matches,
// the result holds text itself. Free the result with globfree.
glob_t do_glob(char *text) {
    glob_t result;
    glob(text, GLOB_NOCHECK | GLOB_TILDE, NULL, &result);
    return result;
}

int main(void) {
    char cwd[MAX_CWD];
    getcwd(cwd, sizeof cwd);

    char line[MAX_LINE];
    while (1) {
        printf("[rush] ");
        fflush(stdout);
        if (fgets(line, sizeof line, stdin) == NULL) {
            break;
        }
        line[strcspn(line, "\n")] = '\0';

        // Split the line into words; the first is the command.
        char *words[MAX_ARGS + 2];
        int n_words = 0;
        for (char *w = strtok(line, " "); w != NULL && n_words < MAX_ARGS + 1; w = strtok(NULL, " ")) {
            words[n_words++] = w;
        }
        if (n_words == 0) {
            continue;
        }
        char *command = words[0];

        // Feature 1: exit, ignoring any arguments.
        if (strcmp(command, "exit") == 0) {
            break;
        }

        // Feature 5: glob every argument (not the command itself).
        // One argument may expand to many words, so collect them in a
        // heap array that grows as needed.
        glob_t globs[MAX_ARGS + 1];
        int n_globs = 0;
        int n_args = 1, capacity = 64;
        char **args = malloc(capacity * sizeof *args);
        args[0] = command;                      // argv[0] is the command name
        for (int i = 1; i < n_words; i++) {
            globs[n_globs] = do_glob(words[i]);
            for (size_t k = 0; k < globs[n_globs].gl_pathc; k++) {
                if (n_args + 1 >= capacity) {
                    capacity *= 2;
                    args = realloc(args, capacity * sizeof *args);
                }
                args[n_args++] = globs[n_globs].gl_pathv[k];
            }
            n_globs++;
        }
        args[n_args] = NULL;

        if (strcmp(command, "cd") == 0) {
            // Feature 2: cd [directory], defaulting to $HOME
            char *directory = n_args > 1 ? args[1] : getenv("HOME");
            if (chdir(directory) != 0) {
                fprintf(stderr, "cannot cd to %s\n", directory);
            } else {
                getcwd(cwd, sizeof cwd);
            }
        } else if (strcmp(command, "pwd") == 0) {
            printf("%s\n", cwd);
        } else {
            // Features 3 and 4: find the program, then run it and wait.
            char program[MAX_PATH];
            int found = 0;
            if (strchr(command, '/') != NULL) {
                // qualified: the command is a path
                snprintf(program, sizeof program, "%s", command);
                found = is_executable(program);
            } else {
                // unqualified: try each directory on PATH in turn.
                // strtok changes its string, so work on a copy of PATH.
                char *path_env = getenv("PATH");
                char *path = strdup(path_env != NULL ? path_env : "");
                for (char *dir = strtok(path, ":"); dir != NULL && !found; dir = strtok(NULL, ":")) {
                    snprintf(program, sizeof program, "%s/%s", dir, command);
                    found = is_executable(program);
                }
                free(path);
            }

            if (!found) {
                fprintf(stderr, "%s: cannot execute command\n", command);
            } else {
                pid_t pid;
                if (posix_spawn(&pid, program, NULL, NULL, args, environ) == 0) {
                    int status;
                    waitpid(pid, &status, 0);
                }
            }
        }

        for (int i = 0; i < n_globs; i++) {
            globfree(&globs[i]);
        }
        free(args);
    }
    return 0;
}
`,
      notes: 'Tokenise the whole line into an array before searching PATH: <code>strtok</code> keeps one hidden position, so starting a second strtok on PATH in the middle of tokenising the line would lose your place. For the same reason, and because strtok writes into its string, split a <i>copy</i> of PATH (getenv returns the real environment). Globbed arguments point into the glob_t, so free the globs only after the command has run. Example output in the paper shows "hdhhfdhjf: cannot execute command" for <code>./hdhhfdhjf</code>; following the stated format, this answer prints the command as typed.',
      check: ['Features in order: exit, cd/pwd, qualified, PATH, globbing', 'PATH searched manually with posix_spawn (no posix_spawnp); a copy of PATH is tokenised', 'Arguments globbed, the command is not; expansions may add arguments', 'waitpid after each spawn; error messages exactly as specified']
    }
  ]);

  cq('22T3', [
    {
      id: 'p22t3-q1', qn: 1, slot: 'q2', title: 'The middle 8 bits', file: '22t3final_q1.c',
      task: '<p>You have been given <code>22t3final_q1.c</code>, a stub of a C program. Add code to the function <code>_22t3final_q1</code> so that, given a <code>uint32_t</code> value, it returns the middle 8 bits of the number. In other words, if we number the bit positions as usual 0..31, your function should return bits 12..19 as an unsigned integer between 0 and 255 (inclusive).</p><p>Your function should not print anything.</p>' + recon('The test file, <code>test_22t3final_q1.c</code>,'),
      files: [{ name: '22t3final_q1.c', text: R`#include <stdint.h>

uint32_t _22t3final_q1(uint32_t x) {
    // ADD YOUR CODE HERE
    return 42;
}
` }, { name: 'test_22t3final_q1.c', text: R`// test_22t3final_q1.c — DO NOT CHANGE (reconstructed)
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

uint32_t _22t3final_q1(uint32_t x);

int main(int argc, char *argv[]) {
    uint32_t x = strtoul(argv[1], NULL, 0);
    printf("%u\n", _22t3final_q1(x));
    return 0;
}
` }],
      starter: R`#include <stdint.h>

uint32_t _22t3final_q1(uint32_t x) {
    // ADD YOUR CODE HERE
    return 42;
}
`,
      examples: R`make 22t3final_q1
# 0 == 0x00000000, bits 12..19 0x00 == 0
./22t3final_q1 0
0
# 42 == 0x0000003A, bits 12..19 0x00 == 0
./22t3final_q1 42
0
# 270336 == 0x00042000, bits 12..19 0x42 == 66
./22t3final_q1 270336
66
# 305419896 == 0x12345678, bits 12..19 0x45 == 69
./22t3final_q1 305419896
69
# 4294967295 == 0xFFFFFFFF, bits 12..19 0xFF == 255
./22t3final_q1 4294967295
255`,
      restrictions: [NO_LIBC, 'You may not change the provided test_22t3final_q1.c file, or _22t3final_q1\'s prototype.', 'You may define and call your own functions if you wish.', C_ONLY, NO_EXEC22, 'No error checking is necessary or required.'],
      model: R`#include <stdint.h>

uint32_t _22t3final_q1(uint32_t x) {
    // bits 12..19: shift them down to bits 0..7, then keep only those 8
    return (x >> 12) & 0xFF;
}
`,
      notes: 'A field of w bits starting at bit k is <code>(x &gt;&gt; k) &amp; ((1u &lt;&lt; w) − 1)</code>; here k = 12, w = 8. Each hex digit is 4 bits, so bits 12..19 are the 4th and 5th hex digits from the right: 0x12345678 → 0x45.',
      check: ['Shift right by 12, then mask with 0xFF']
    },
    {
      id: 'p22t3-q4', qn: 4, slot: 'q2', title: 'Longest run of 1 bits', file: '22t3final_q4.c',
      task: '<p>Your task in this question is to find the length of the longest consecutive sequence of bits set to 1 in an integer. For example, in 305419896 == 0b00010010001101000101011001111000, the longest consecutive sequence of bits set to 1 is 4 long.</p><p>Add code to the function <code>_22t3final_q4</code> in <code>22t3final_q4.c</code> so that it counts and returns the length of the longest sequence of bits set to 1 in a 32-bit unsigned integer x. Your function should not print anything, and should return an integer 0..32 inclusive.</p>' + recon('The test file, <code>test_22t3final_q4.c</code>,'),
      files: [{ name: '22t3final_q4.c', text: R`// COMP1521 22T3 ... final exam, question 4

#include <stdint.h>

int _22t3final_q4(uint32_t x) {
    // TODO: complete this function
    return 42;
}
` }, { name: 'test_22t3final_q4.c', text: R`// test_22t3final_q4.c — DO NOT CHANGE (reconstructed)
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int _22t3final_q4(uint32_t x);

int main(int argc, char *argv[]) {
    uint32_t x = strtoul(argv[1], NULL, 0);
    printf("%d\n", _22t3final_q4(x));
    return 0;
}
` }],
      starter: R`// COMP1521 22T3 ... final exam, question 4

#include <stdint.h>

int _22t3final_q4(uint32_t x) {
    // TODO: complete this function
    return 42;
}
`,
      examples: R`make 22t3final_q4
# 305419896 == 0x12345678
./22t3final_q4 305419896
4
# 0 == 0x00000000
./22t3final_q4 0
0
# 4 == 0x00000004
./22t3final_q4 4
1
# 15 == 0x0000000F
./22t3final_q4 15
4
# 4294967295 == 0xFFFFFFFF
./22t3final_q4 4294967295
32
# 2863311530 == 0xAAAAAAAA
./22t3final_q4 2863311530
1
# 268566401 == 0x1001FF81
./22t3final_q4 268566401
10`,
      restrictions: [NO_LIBC, 'You may not change the provided test_22t3final_q4.c file, or _22t3final_q4\'s prototype.', 'You may define and call your own functions if you wish.', C_ONLY, NO_EXEC22, 'No error checking is necessary or required.'],
      model: R`// COMP1521 22T3 ... final exam, question 4

#include <stdint.h>

int _22t3final_q4(uint32_t x) {
    int longest = 0;
    int current = 0;
    for (int i = 0; i < 32; i++) {
        if ((x >> i) & 1) {
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
      notes: 'Update the longest run as soon as the current run grows, not only when a 0 ends it: otherwise a run that reaches bit 31 (0xFFFFFFFF → 32) is never recorded. Question 5 asks for the same thing in MIPS, so this loop translates directly.',
      check: ['Runs reaching bit 31 are counted', 'Returns 0 for 0']
    },
    {
      id: 'p22t3-q6', qn: 6, slot: 'q6', title: 'Delete the n-th line of a file', file: '22t3final_q6.c',
      task: '<p>Write a C program, <code>22t3final_q6.c</code>, which takes two arguments, a filename and an integer n. Your program should delete the n-th line from the file. Lines are numbered starting at 1. If the file has fewer than n lines, your program should do nothing.</p>' +
        '<p>Your program should print nothing on stdout: it should only modify the file. Assume a line is zero or more characters followed by a <code>\'\\n\'</code> character. Reading and writing a single file simultaneously can cause a range of tricky issues, so you may find creating an extra (temporary) file helpful.</p>',
      examples: R`printf 'Hello\nhow\nare\nyou\n' > hello.txt
./22t3final_q6 hello.txt 3
cat hello.txt
Hello
how
you
printf 'I\nam\nreally great thank you\n' > answer.txt
./22t3final_q6 answer.txt 5
cat answer.txt
I
am
really great thank you
./22t3final_q6 answer.txt 1
cat answer.txt
am
really great thank you
seq 7 15 > numbers.txt
./22t3final_q6 numbers.txt 5
cat numbers.txt
7
8
9
10
12
13
14
15`,
      restrictions: ['Your program should not produce any output on stdout or stderr.', 'Your program can assume it is always given the name of an existing file and a positive integer.', 'You are permitted to create extra (temporary) files in the current directory.', C_ONLY, NO_EXEC22, 'No error checking is necessary or required.'],
      model: R`#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    int n = atoi(argv[2]);

    // Copy every line except line n into a temporary file...
    FILE *in = fopen(argv[1], "r");
    FILE *temp = tmpfile();             // deleted automatically when closed
    int line = 1;
    int c;
    while ((c = fgetc(in)) != EOF) {
        if (line != n) {
            fputc(c, temp);
        }
        if (c == '\n') {
            line++;
        }
    }
    fclose(in);

    // ...then copy it back over the original. (Reading and writing the same
    // file at once would overwrite bytes before they had been read.)
    rewind(temp);
    FILE *out = fopen(argv[1], "w");
    while ((c = fgetc(temp)) != EOF) {
        fputc(c, out);
    }
    fclose(out);
    fclose(temp);
    return 0;
}
`,
      notes: 'Copy every byte except those of line n into a temporary file, counting newlines as you go, then copy the result back over the original. Opening the original for writing at the start would truncate it before you had read it. <code>tmpfile()</code> gives an anonymous file that is deleted when closed; a named file in the current directory followed by <code>rename</code> also works (though it replaces the original file rather than rewriting it).',
      check: ['Line counting by \\n, numbered from 1', 'Original not truncated before it has been read', 'A file with fewer than n lines is left unchanged']
    },
    {
      id: 'p22t3-q7', qn: 7, slot: 'q8', title: 'Replace invalid UTF-8 with ?', file: '22t3final_q7.c',
      task: '<p>You have been given <code>22t3final_q7.c</code>, which contains a C function <code>_22t3final_q7</code> that takes a string and returns it unmodified. Add code so that, given a UTF-8 encoded string, it returns a new string that has any invalid UTF-8 sequences replaced with the character <code>\'?\'</code>.</p>' +
        '<p>The string may be of any length and contains no NUL bytes except its terminator. Each occurrence of a continuation byte outside a sequence should be replaced with a <code>\'?\'</code>. If a valid starting byte occurs within another UTF-8 sequence, it should be considered part of that sequence, thus rendering the sequence invalid: it should not be considered the start of a new sequence.</p>' +
        '<table class="dtable"><tr><th>#bytes</th><th>#bits</th><th>Byte 1</th><th>Byte 2</th><th>Byte 3</th><th>Byte 4</th></tr><tr><td>1</td><td>7</td><td>0xxxxxxx</td><td>-</td><td>-</td><td>-</td></tr><tr><td>2</td><td>11</td><td>110xxxxx</td><td>10xxxxxx</td><td>-</td><td>-</td></tr><tr><td>3</td><td>16</td><td>1110xxxx</td><td>10xxxxxx</td><td>10xxxxxx</td><td>-</td></tr><tr><td>4</td><td>21</td><td>11110xxx</td><td>10xxxxxx</td><td>10xxxxxx</td><td>10xxxxxx</td></tr></table>' +
        recon('<code>22t3final_q7_main.c</code>'),
      files: [{ name: '22t3final_q7.c', text: R`char *_22t3final_q7(char *string) {
    return string;
}
` }, { name: '22t3final_q7_main.c', text: R`// 22t3final_q7_main.c — DO NOT CHANGE (reconstructed)
#include <stdio.h>
#include <stdlib.h>

char *_22t3final_q7(char *string);

int main(void) {
    size_t size = 0, capacity = 1024;
    char *input = malloc(capacity);
    int c;
    while ((c = getchar()) != EOF) {
        if (size + 1 >= capacity) {
            capacity *= 2;
            input = realloc(input, capacity);
        }
        input[size++] = c;
    }
    input[size] = '\0';

    char *result = _22t3final_q7(input);
    printf("%s\n", result);
    free(result);
    free(input);
    return 0;
}
` }],
      starter: R`#include <stdlib.h>
#include <string.h>

char *_22t3final_q7(char *string) {
    return string;
}
`,
      examples: R`make 22t3final_q7
xxd 22t3final_q7_examples/hello_world.txt
00000000: 6865 6c6c 6f20 776f 726c 64              hello world
./22t3final_q7 < 22t3final_q7_examples/hello_world.txt
hello world
xxd 22t3final_q7_examples/bad_hello_world.txt
00000000: 6865 6c6c 6fa1 776f 726c 64              hello.world
./22t3final_q7 < 22t3final_q7_examples/bad_hello_world.txt
hello?world
xxd 22t3final_q7_examples/valid_with_emoji.txt
00000000: 796f 7520 6172 6520 646f 696e 6720 6772  you are doing gr
00000010: 6561 7420 f09f 918d f09f 918d f09f 918d  eat ............
./22t3final_q7 < 22t3final_q7_examples/valid_with_emoji.txt
you are doing great 👍👍👍
xxd 22t3final_q7_examples/invalid_with_emoji.txt
00000000: 7468 6973 f0a1 3923 7374 7269 6e67 a269  this..9#string.i
00000010: 73e7 8936 6e6f 74a0 646f 696e 67c2 c273  s..6not.doing..s
00000020: 6fa0 6772 6561 74f1 3242 a068 6f77 6576  o.great.2B.howev
00000030: 6572 20f0 9f98 ad91                      er .....
./22t3final_q7 < 22t3final_q7_examples/invalid_with_emoji.txt
this?string?is?not?doing?so?great?however 😭?`,
      restrictions: ['You may not change the provided 22t3final_q7_main.c file, or _22t3final_q7\'s prototype.', 'You may define and call your own functions if you wish.', C_ONLY, NO_EXEC22, 'You may call any functions from the C standard library available by default on CSE Linux systems.'],
      model: R`#include <stdlib.h>
#include <string.h>

// How many bytes a sequence starting with lead byte b should have,
// or 0 if b cannot start a sequence (a continuation byte, or 0xF8..0xFF).
static int sequence_length(unsigned char b) {
    if ((b & 0x80) == 0x00) return 1;   // 0xxxxxxx
    if ((b & 0xE0) == 0xC0) return 2;   // 110xxxxx
    if ((b & 0xF0) == 0xE0) return 3;   // 1110xxxx
    if ((b & 0xF8) == 0xF0) return 4;   // 11110xxx
    return 0;
}

static int is_continuation(unsigned char b) {
    return (b & 0xC0) == 0x80;          // 10xxxxxx
}

char *_22t3final_q7(char *string) {
    // the result is never longer than the input
    char *result = malloc(strlen(string) + 1);
    size_t in = 0, out = 0;
    while (string[in] != '\0') {
        unsigned char b = string[in];
        int length = sequence_length(b);
        if (length == 0) {              // stray continuation (or invalid) byte
            result[out++] = '?';
            in++;
            continue;
        }

        // The sequence claims all its bytes, whatever they are: a lead byte
        // inside it makes it invalid, it does not start a new sequence.
        // Stop early only at the end of the string.
        int valid = 1, k;
        for (k = 1; k < length && string[in + k] != '\0'; k++) {
            if (!is_continuation((unsigned char)string[in + k])) {
                valid = 0;
            }
        }
        if (k < length) {
            valid = 0;                  // the string ended mid-sequence
        }

        if (valid) {
            memcpy(result + out, string + in, length);
            out += length;
        } else {
            result[out++] = '?';
        }
        in += k;
    }
    result[out] = '\0';
    return result;
}
`,
      notes: 'The last example pins down the rule: a lead byte claims its full length whatever follows. <code>f0 a1 39 23</code> becomes one ?, swallowing the 9 and #, and <code>f1 32 42 a0</code> swallows 2B and the a0. Only the end of the string can cut a sequence short. A stray continuation byte (<code>a1</code>, <code>a2</code>, <code>a0</code>, the final <code>91</code>) becomes its own ?. The output is never longer than the input, so one malloc of strlen + 1 is enough.',
      check: ['A lead byte consumes its whole claimed length, valid or not', 'Stray continuation bytes each become ?', 'Never reads past the terminating NUL', 'Returns newly allocated memory']
    },
    {
      id: 'p22t3-q9', qn: 9, slot: 'q10', title: 'Split the work across five threads', file: '22t3final_q9.c',
      task: '<p>In Sydney, every train carriage has a unique numeric identifier. A popular game is to insert the four operators +, −, *, / between its digits so that the expression evaluates to 10. Here there are five digits, each operator is used exactly once, and expressions are evaluated left to right without order of operations, giving 2880 possible expressions.</p>' +
        '<p>You have been given <code>22t3final_q9.c</code>, which is supplied a file containing all 2880 expressions (one per line) for a five-digit value, and prints how many evaluate to 10, using a single thread. Modify it so that it creates five new threads that evenly split the work and evaluate the expressions in parallel.</p>' +
        '<ul><li>You must not use any global variables, locks or mutexes: pass data to each thread and return data from it.</li><li>You must not load the whole file into memory: read it line by line, and read each byte of the file at most once. A file descriptor (FILE) per thread and <code>fseek</code> may help.</li><li>Every new thread must call <code>compute_thread_hello</code>.</li><li>All submissions are hand-marked: solutions that do not split the work evenly lose marks.</li></ul>' +
        '<p>Each line of the input file is 10 characters long, including the newline. Don’t modify <code>22t3final_q9.h</code> or <code>22t3final_q9_main.c</code>, or <code>my_main</code>’s prototype.</p>' +
        recon('The provided files and example inputs', 'The example files are regenerated (the 5 digits in every order × the 4 operators in every order); evaluating them with real division reproduces the paper’s counts of 288, 32 and 62 exactly.'),
      files: [{ name: '22t3final_q9.h', text: R`// 22t3final_q9.h — DO NOT CHANGE (reconstructed)
#ifndef Q9_H
#define Q9_H

#define LINE_LENGTH 10      // every line is 10 characters, including '\n'
#define N_THREADS 5         // the number of compute threads to create

// Every new thread you create must call this, passing its number 0..4.
void compute_thread_hello(int thread_number);

// 1 iff expression (e.g. "1+5*2-1/1"), evaluated left to right with no
// order of operations, equals 10.
int evaluates_to_ten(char *expression);

// Your program: return the number of expressions in the file argv[1]
// that evaluate to 10.
int my_main(int argc, char *argv[]);

#endif
` }, { name: '22t3final_q9_main.c', text: R`// 22t3final_q9_main.c — DO NOT CHANGE (reconstructed)
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <stdatomic.h>
#include "22t3final_q9.h"

static atomic_int hellos;

void compute_thread_hello(int thread_number) {
    printf("Hello from compute thread %d!\n", thread_number);
    atomic_fetch_add(&hellos, 1);
}

int evaluates_to_ten(char *expression) {
    double value = expression[0] - '0';
    for (int i = 1; i + 1 < 9; i += 2) {
        double digit = expression[i + 1] - '0';
        switch (expression[i]) {
        case '+': value += digit; break;
        case '-': value -= digit; break;
        case '*': value *= digit; break;
        case '/': value /= digit; break;
        }
    }
    return fabs(value - 10) < 1e-9;
}

int main(int argc, char *argv[]) {
    int results = my_main(argc, argv);
    printf("%d results found!\n", results);
    if (atomic_load(&hellos) == N_THREADS) {
        printf("Your program created enough threads!\n");
    } else {
        printf("Your program created %d compute threads, not %d.\n", atomic_load(&hellos), N_THREADS);
    }
    return 0;
}
` }, { name: 'make_examples.py', text: R`# writes 22t3final_q9_examples/<digits>.txt as in the paper (reconstructed)
import os
from itertools import permutations
os.makedirs('22t3final_q9_examples', exist_ok=True)
for digits in ['15211', '54321', '69913']:
    with open(f'22t3final_q9_examples/{digits}.txt', 'w') as f:
        for ds in permutations(digits):
            for ops in permutations('+-*/'):
                f.write(ds[0] + ''.join(o + d for o, d in zip(ops, ds[1:])) + '\n')` }],
      starter: R`// COMP1521 22T3 ... final exam, question 9
// Counts the expressions that evaluate to 10, using only the main thread.

#include <stdio.h>
#include "22t3final_q9.h"

int my_main(int argc, char *argv[]) {
    FILE *file = fopen(argv[1], "r");
    char line[LINE_LENGTH + 1];
    int count = 0;
    while (fgets(line, sizeof line, file) != NULL) {
        if (evaluates_to_ten(line)) {
            count++;
        }
    }
    fclose(file);
    return count;
}
`,
      examples: R`make
dcc -pthreads    22t3final_q9.c 22t3final_q9_main.c   -o 22t3final_q9
./22t3final_q9 22t3final_q9_examples/15211.txt
Hello from compute thread 0!
Hello from compute thread 1!
Hello from compute thread 2!
Hello from compute thread 3!
Hello from compute thread 4!
288 results found!
Your program created enough threads!
./22t3final_q9 22t3final_q9_examples/54321.txt
Hello from compute thread 0!
Hello from compute thread 1!
Hello from compute thread 2!
Hello from compute thread 3!
Hello from compute thread 4!
32 results found!
Your program created enough threads!
./22t3final_q9 22t3final_q9_examples/69913.txt
Hello from compute thread 0!
Hello from compute thread 1!
Hello from compute thread 2!
Hello from compute thread 3!
Hello from compute thread 4!
62 results found!
Your program created enough threads!`,
      restrictions: ['No global variables, and no locks or mutexes.', 'Do not load the entire file into memory; read each byte at most once.', 'Every new thread you create must call compute_thread_hello.', 'Solutions that do not evenly split the work between the threads lose marks.', 'You may not change 22t3final_q9_main.c, or my_main\'s prototype.', C_ONLY, NO_EXEC22],
      model: R`// COMP1521 22T3 ... final exam, question 9

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <pthread.h>
#include "22t3final_q9.h"

// Everything a thread needs is passed in; no globals, so no locks.
struct job {
    char *filename;
    int thread_number;
    long first_line;        // the first line this thread reads
    long n_lines;           // how many lines it reads
};

static void *count_lines(void *arg) {
    struct job *job = arg;
    compute_thread_hello(job->thread_number);

    // each thread has its own FILE, so its position is its own
    FILE *file = fopen(job->filename, "r");
    fseek(file, job->first_line * LINE_LENGTH, SEEK_SET);

    char line[LINE_LENGTH + 1];
    intptr_t count = 0;
    for (long i = 0; i < job->n_lines && fgets(line, sizeof line, file) != NULL; i++) {
        if (evaluates_to_ten(line)) {
            count++;
        }
    }
    fclose(file);
    return (void *)count;   // returned through pthread_join
}

int my_main(int argc, char *argv[]) {
    // how many lines? every line is LINE_LENGTH bytes
    FILE *file = fopen(argv[1], "r");
    fseek(file, 0, SEEK_END);
    long n_lines = ftell(file) / LINE_LENGTH;
    fclose(file);

    // split them as evenly as possible: the first (n_lines % N_THREADS) threads take one more
    struct job jobs[N_THREADS];
    pthread_t threads[N_THREADS];
    long base = n_lines / N_THREADS, extra = n_lines % N_THREADS, next = 0;
    for (int t = 0; t < N_THREADS; t++) {
        jobs[t].filename = argv[1];
        jobs[t].thread_number = t;
        jobs[t].first_line = next;
        jobs[t].n_lines = base + (t < extra ? 1 : 0);
        next += jobs[t].n_lines;
        pthread_create(&threads[t], NULL, count_lines, &jobs[t]);
    }

    int total = 0;
    for (int t = 0; t < N_THREADS; t++) {
        void *result;
        pthread_join(threads[t], &result);
        total += (intptr_t)result;
    }
    return total;
}
`,
      notes: 'Because every line is exactly LINE_LENGTH bytes, line k starts at byte k × 10, so each thread can <code>fseek</code> straight to its share and read only those lines. Each thread opens its own FILE (one shared FILE would have one shared position and race). Each job struct lives in my_main’s array until pthread_join, so passing its address is safe; the count comes back through pthread_join’s return value (an <code>intptr_t</code> cast to <code>void *</code>), so no shared variable or lock is needed. Splitting with base + 1 for the first n % 5 threads also copes with files whose line count is not a multiple of five.',
      check: ['Five threads, each calling compute_thread_hello', 'Each thread reads only its own lines through its own FILE and fseek', 'Results returned via pthread_join; no globals, locks or mutexes', 'Work split evenly (576 lines each for 2880)']
    }
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
