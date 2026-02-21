export interface IRTItem {
  id: string;
  domainId: string;
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: number;
  discrimination: number;
  tags: string[];
}

export const DOMAINS = [
  { id: 'syntax', label: 'Syntax & Types', icon: '📝', color: '#3b82f6' },
  { id: 'logic', label: 'Control Logic', icon: '🧠', color: '#a855f7' },
  { id: 'data-structures', label: 'Data Structures', icon: '🧊', color: '#10b981' },
  { id: 'algorithms', label: 'Algorithms', icon: '⚡', color: '#f59e0b' },
  { id: 'advanced', label: 'Advanced Concepts', icon: '🚀', color: '#ef4444' },
] as const;

export const QUESTION_BANK: IRTItem[] = [
  // ═══════════ SYNTAX & TYPES ═══════════
  {
    id: 'syn-01', domainId: 'syntax',
    stem: 'What is the result of typeof NaN in JavaScript?',
    options: ['"number"', '"nan"', '"undefined"', '"object"'],
    correctIndex: 0,
    explanation: 'Confusingly, NaN stands for "Not a Number" but its type is "number".',
    difficulty: -0.8, discrimination: 1.1, tags: ['js', 'basics']
  },
  {
    id: 'syn-02', domainId: 'syntax',
    stem: 'What will "1" + 1 result in in JavaScript?',
    options: ['2', '"11"', 'NaN', 'Error'],
    correctIndex: 1,
    explanation: 'JavaScript performs string concatenation when one operand is a string, resulting in the string "11".',
    difficulty: -1.8, discrimination: 1.0, tags: ['js', 'basics']
  },
  {
    id: 'syn-03', domainId: 'syntax',
    stem: 'What is the size of a char in C++?',
    options: ['1 bit', '1 byte', '2 bytes', '4 bytes'],
    correctIndex: 1,
    explanation: 'The C++ standard guarantees that sizeof(char) is always 1 (typically 8 bits).',
    difficulty: -2.0, discrimination: 0.9, tags: ['cpp', 'basics']
  },
  {
    id: 'syn-04', domainId: 'syntax',
    stem: 'What is the result of type(1 / 2) in Python 3?',
    options: ['int', 'float', 'decimal', 'error'],
    correctIndex: 1,
    explanation: 'In Python 3, the / operator performs float division, so 1 / 2 is 0.5 (a float).',
    difficulty: -1.5, discrimination: 1.0, tags: ['python', 'basics']
  },
  {
    id: 'syn-05', domainId: 'syntax',
    stem: 'In Rust, what does the "mut" keyword do?',
    options: [
      'Makes a variable immutable',
      'Declares a mutable variable that can be changed',
      'Speeds up the compiler',
      'Defines a multi-threaded variable'
    ],
    correctIndex: 1,
    explanation: 'By default, variables in Rust are immutable. "mut" allows them to be changed.',
    difficulty: -1.5, discrimination: 1.1, tags: ['rust', 'basics']
  },

  // ═══════════ CONTROL LOGIC ═══════════
  {
    id: 'log-01', domainId: 'logic',
    stem: 'What will be the output of [i**2 for i in range(3)] in Python?',
    options: ['[0, 1, 4]', '[1, 4, 9]', '[0, 1, 2]', '[0, 1, 8]'],
    correctIndex: 0,
    explanation: 'range(3) produces 0, 1, 2. The squares are 0, 1, 4.',
    difficulty: -1.2, discrimination: 1.1, tags: ['python', 'list', 'intermediate']
  },
  {
    id: 'log-02', domainId: 'logic',
    stem: 'How can you prevent a Promise from staying in "pending" status forever in JS?',
    options: [
      'By calling .stop()',
      'By ensuring either resolve() or reject() is eventually called',
      'By using a while loop',
      'Promises automatically timeout after 10 seconds'
    ],
    correctIndex: 1,
    explanation: 'A Promise remains pending until it is either fulfilled (resolve) or rejected (reject).',
    difficulty: -1.0, discrimination: 1.2, tags: ['js', 'async', 'intermediate']
  },
  {
    id: 'log-03', domainId: 'logic',
    stem: 'In Go, how do you handle errors idiomaticly?',
    options: [
      'Using try-catch blocks',
      'Returning an error as the last return value',
      'Using global error variables',
      'Throwing exceptions'
    ],
    correctIndex: 1,
    explanation: 'Go uses explicit error checking by returning an error value that must be checked by the caller.',
    difficulty: -0.8, discrimination: 1.1, tags: ['go', 'basics']
  },
  {
    id: 'log-04', domainId: 'logic',
    stem: 'What happens if you send a value to a closed channel in Go?',
    options: [
      'The value is ignored',
      'The program panics',
      'The channel reopens',
      'The sender blocks forever'
    ],
    correctIndex: 1,
    explanation: 'Sending to a closed channel causes a runtime panic. Receiving from one returns the zero value.',
    difficulty: 0.8, discrimination: 1.4, tags: ['go', 'concurrency', 'intermediate']
  },

  // ═══════════ DATA STRUCTURES ═══════════
  {
    id: 'ds-01', domainId: 'data-structures',
    stem: 'Which data structure uses FIFO (First In, First Out) ordering?',
    options: ['Stack', 'Queue', 'Heap', 'Binary Tree'],
    correctIndex: 1,
    explanation: 'A Queue processes elements in FIFO order — the first element enqueued is the first dequeued.',
    difficulty: -1.5, discrimination: 0.9, tags: ['data-structures']
  },
  {
    id: 'ds-02', domainId: 'data-structures',
    stem: 'What is the purpose of a hash table?',
    options: [
      'Sorting data efficiently',
      'Providing O(1) average-case key-value lookups',
      'Storing data in sorted order',
      'Compressing data'
    ],
    correctIndex: 1,
    explanation: 'Hash tables use a hash function to map keys to indices, enabling constant-time average lookups.',
    difficulty: -0.5, discrimination: 1.0, tags: ['data-structures', 'hashing']
  },
  {
    id: 'ds-03', domainId: 'data-structures',
    stem: 'How do you initialize a slice with a length of 5 and capacity of 10 in Go?',
    options: [
      's := []int{5, 10}',
      's := make([]int, 5, 10)',
      's := new([]int, 5, 10)',
      's := slice(5, 10)'
    ],
    correctIndex: 1,
    explanation: 'The make() function is used to create slices, maps, and channels with specific dimensions.',
    difficulty: -0.5, discrimination: 1.1, tags: ['go', 'basics', 'intermediate']
  },
  {
    id: 'ds-04', domainId: 'data-structures',
    stem: 'Which STL container is best for frequent insertions/deletions at both ends but not in the middle?',
    options: ['std::vector', 'std::list', 'std::deque', 'std::stack'],
    correctIndex: 2,
    explanation: 'std::deque (double-ended queue) is optimized for adding/removing from both the front and back.',
    difficulty: 0.0, discrimination: 1.2, tags: ['cpp', 'stl', 'intermediate']
  },

  // ═══════════ ALGORITHMS ═══════════
  {
    id: 'alg-01', domainId: 'algorithms',
    stem: 'What is the time complexity of binary search on a sorted array?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correctIndex: 1,
    explanation: 'Binary search halves the search space with each comparison, resulting in O(log n) time complexity.',
    difficulty: -1.0, discrimination: 1.1, tags: ['algorithms', 'search']
  },
  {
    id: 'alg-02', domainId: 'algorithms',
    stem: 'What is the worst-case time complexity of quicksort?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
    correctIndex: 3,
    explanation: 'Quicksort degrades to O(n²) when the pivot consistently results in highly unbalanced partitions.',
    difficulty: 0.3, discrimination: 1.2, tags: ['algorithms', 'sorting']
  },
  {
    id: 'alg-03', domainId: 'algorithms',
    stem: 'What is memoization?',
    options: [
      'A technique to sort data in memory',
      'Caching the results of expensive function calls based on their inputs',
      'A method for compressing code',
      'A pattern for lazy loading modules'
    ],
    correctIndex: 1,
    explanation: 'Memoization stores previously computed results so that identical calls return the cached result instead of re-computing.',
    difficulty: 0.2, discrimination: 1.2, tags: ['optimization', 'dynamic-programming']
  },

  // ═══════════ ADVANCED CONCEPTS ═══════════
  {
    id: 'adv-01', domainId: 'advanced',
    stem: 'What is a "Smart Pointer" in C++ (like std::unique_ptr)?',
    options: [
      'A pointer that knows the value of its data',
      'An object that acts like a pointer but provides automatic memory management',
      'A pointer that can only point to integers',
      'A hardware-level optimization'
    ],
    correctIndex: 1,
    explanation: 'Smart pointers use RAII to ensure memory is automatically freed when the pointer goes out of scope.',
    difficulty: 0.5, discrimination: 1.4, tags: ['cpp', 'memory', 'intermediate']
  },
  {
    id: 'adv-02', domainId: 'advanced',
    stem: 'What is "Ownership" in Rust designed to prevent?',
    options: [
      'Slow execution times',
      'Memory leaks and data races',
      'Long compilation times',
      'Syntax errors'
    ],
    correctIndex: 1,
    explanation: 'Rust\'s ownership system manages memory at compile-time, eliminating common bugs like double-frees and data races.',
    difficulty: 0.5, discrimination: 1.5, tags: ['rust', 'basics']
  },
  {
    id: 'adv-03', domainId: 'advanced',
    stem: 'What is a closure in programming?',
    options: [
      'A function that has access to variables from its outer scope even after the outer function returns',
      'A method to close database connections',
      'A design pattern for terminating processes',
      'A way to seal an object from modification'
    ],
    correctIndex: 0,
    explanation: 'A closure captures and retains access to variables from its enclosing lexical scope.',
    difficulty: 0.0, discrimination: 1.2, tags: ['concepts', 'functions']
  },
  {
    id: 'adv-04', domainId: 'advanced',
    stem: 'In Go, how are interfaces implemented?',
    options: [
      'Using the "implements" keyword',
      'Explicitly in the struct definition',
      'Implicitly — a type implements an interface by providing the required methods',
      'By inheriting from an interface class'
    ],
    correctIndex: 2,
    explanation: 'Go uses structural typing. If a type has the methods required by an interface, it implements it — no keywords needed.',
    difficulty: 0.3, discrimination: 1.3, tags: ['go', 'intermediate']
  }
];
