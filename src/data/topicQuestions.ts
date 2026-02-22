import type { IRTItem } from './questionBank';

export interface TopicDef {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const LANGUAGE_TOPICS: Record<string, TopicDef[]> = {
  javascript: [
    { id: 'js-basics', label: 'Syntax & Basics', icon: '📝', color: '#f7df1e' },
    { id: 'js-async', label: 'Async & Promises', icon: '⏳', color: '#3b82f6' },
    { id: 'js-dom', label: 'DOM & Browser', icon: '🌐', color: '#10b981' },
    { id: 'js-functions', label: 'Functions & Closures', icon: '🔧', color: '#a855f7' },
    { id: 'js-es6', label: 'ES6+ Features', icon: '✨', color: '#ef4444' },
  ],
  python: [
    { id: 'py-basics', label: 'Syntax & Types', icon: '🐍', color: '#3776ab' },
    { id: 'py-ds', label: 'Data Structures', icon: '📊', color: '#10b981' },
    { id: 'py-oop', label: 'OOP & Classes', icon: '🏗️', color: '#a855f7' },
    { id: 'py-funcs', label: 'Functions & Decorators', icon: '🎯', color: '#f59e0b' },
    { id: 'py-advanced', label: 'Advanced Python', icon: '🚀', color: '#ef4444' },
  ],
  cpp: [
    { id: 'cpp-basics', label: 'Syntax & Types', icon: '⚙️', color: '#00599c' },
    { id: 'cpp-memory', label: 'Memory & Pointers', icon: '🧠', color: '#ef4444' },
    { id: 'cpp-oop', label: 'OOP & Classes', icon: '🏗️', color: '#a855f7' },
    { id: 'cpp-stl', label: 'STL Containers', icon: '📦', color: '#10b981' },
    { id: 'cpp-advanced', label: 'Advanced C++', icon: '🚀', color: '#f59e0b' },
  ],
  go: [
    { id: 'go-basics', label: 'Syntax & Types', icon: '🐹', color: '#00add8' },
    { id: 'go-concurrency', label: 'Goroutines & Channels', icon: '⚡', color: '#f59e0b' },
    { id: 'go-interfaces', label: 'Interfaces & Structs', icon: '🧩', color: '#a855f7' },
    { id: 'go-errors', label: 'Error Handling', icon: '🛡️', color: '#ef4444' },
    { id: 'go-packages', label: 'Packages & Modules', icon: '📦', color: '#10b981' },
  ],
};

export const TOPIC_QUESTIONS: Record<string, IRTItem[]> = {
  // ═══ JAVASCRIPT ═══
  'js-basics': [
    { id: 'jsb1', domainId: 'syntax', stem: 'What is the result of typeof null in JavaScript?', options: ['"null"', '"object"', '"undefined"', '"boolean"'], correctIndex: 1, explanation: 'typeof null returns "object" due to a legacy bug in JavaScript.', difficulty: -0.5, discrimination: 1.1, tags: ['js'] },
    { id: 'jsb2', domainId: 'syntax', stem: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'function', 'define'], correctIndex: 1, explanation: 'let declares a block-scoped variable, unlike var which is function-scoped.', difficulty: -1.5, discrimination: 1.0, tags: ['js'] },
    { id: 'jsb3', domainId: 'syntax', stem: 'What does === check in JavaScript?', options: ['Value only', 'Type only', 'Value and type', 'Reference'], correctIndex: 2, explanation: 'Strict equality === checks both value and type without coercion.', difficulty: -1.8, discrimination: 0.9, tags: ['js'] },
    { id: 'jsb4', domainId: 'syntax', stem: 'What is NaN === NaN?', options: ['true', 'false', 'undefined', 'Error'], correctIndex: 1, explanation: 'NaN is not equal to anything, including itself. Use Number.isNaN() instead.', difficulty: -0.3, discrimination: 1.2, tags: ['js'] },
    { id: 'jsb5', domainId: 'syntax', stem: 'What does "use strict" do?', options: ['Enables strict mode with extra error checking', 'Makes code run faster', 'Disables console output', 'Locks all variables'], correctIndex: 0, explanation: 'Strict mode catches common mistakes and prevents unsafe actions.', difficulty: -1.0, discrimination: 1.0, tags: ['js'] },
  ],
  'js-async': [
    { id: 'jsa1', domainId: 'logic', stem: 'What does async/await simplify?', options: ['DOM manipulation', 'Promise-based asynchronous code', 'CSS styling', 'Variable declarations'], correctIndex: 1, explanation: 'async/await is syntactic sugar over Promises for cleaner async code.', difficulty: -0.8, discrimination: 1.1, tags: ['js'] },
    { id: 'jsa2', domainId: 'logic', stem: 'What does Promise.all() do?', options: ['Runs promises sequentially', 'Waits for all promises to resolve', 'Cancels all promises', 'Returns the fastest promise'], correctIndex: 1, explanation: 'Promise.all() waits for all promises and returns an array of results.', difficulty: -0.5, discrimination: 1.2, tags: ['js'] },
    { id: 'jsa3', domainId: 'logic', stem: 'What happens if you forget to await a promise?', options: ['Code crashes', 'You get a pending Promise object', 'It auto-resolves', 'Nothing happens'], correctIndex: 1, explanation: 'Without await, you get the Promise object, not the resolved value.', difficulty: -0.3, discrimination: 1.1, tags: ['js'] },
    { id: 'jsa4', domainId: 'logic', stem: 'Which method runs when a Promise is rejected?', options: ['.then()', '.catch()', '.finally()', '.resolve()'], correctIndex: 1, explanation: '.catch() handles rejected promises, similar to a try-catch block.', difficulty: -1.2, discrimination: 1.0, tags: ['js'] },
    { id: 'jsa5', domainId: 'logic', stem: 'What is the event loop in JavaScript?', options: ['A for-loop construct', 'Mechanism that handles async callbacks', 'A debugging tool', 'A testing framework'], correctIndex: 1, explanation: 'The event loop processes callbacks from the task queue when the call stack is empty.', difficulty: 0.3, discrimination: 1.3, tags: ['js'] },
  ],
  'js-dom': [
    { id: 'jsd1', domainId: 'syntax', stem: 'What does document.getElementById() return if no match?', options: ['undefined', 'null', 'false', 'Error'], correctIndex: 1, explanation: 'getElementById returns null when no element with that ID exists.', difficulty: -1.0, discrimination: 1.0, tags: ['js'] },
    { id: 'jsd2', domainId: 'syntax', stem: 'What is event bubbling?', options: ['Events go from parent to child', 'Events go from child to parent', 'Events fire twice', 'Events are cancelled'], correctIndex: 1, explanation: 'Bubbling means events propagate up from the target element to its ancestors.', difficulty: -0.3, discrimination: 1.2, tags: ['js'] },
    { id: 'jsd3', domainId: 'syntax', stem: 'How do you prevent the default action of an event?', options: ['event.stop()', 'event.preventDefault()', 'event.cancel()', 'return false'], correctIndex: 1, explanation: 'preventDefault() stops the browser\'s default behavior for that event.', difficulty: -0.8, discrimination: 1.1, tags: ['js'] },
    { id: 'jsd4', domainId: 'syntax', stem: 'What does querySelector() return?', options: ['All matching elements', 'First matching element', 'Last matching element', 'Element count'], correctIndex: 1, explanation: 'querySelector returns the first element matching the CSS selector.', difficulty: -1.2, discrimination: 1.0, tags: ['js'] },
    { id: 'jsd5', domainId: 'syntax', stem: 'What is the purpose of addEventListener?', options: ['To create elements', 'To attach event handlers', 'To style elements', 'To remove elements'], correctIndex: 1, explanation: 'addEventListener attaches an event handler function to an element.', difficulty: -1.5, discrimination: 0.9, tags: ['js'] },
  ],
  'js-functions': [
    { id: 'jsf1', domainId: 'advanced', stem: 'What is a closure?', options: ['A function with no parameters', 'A function that retains access to its outer scope', 'A self-executing function', 'A class method'], correctIndex: 1, explanation: 'Closures allow inner functions to access variables from their enclosing scope.', difficulty: 0.0, discrimination: 1.2, tags: ['js'] },
    { id: 'jsf2', domainId: 'advanced', stem: 'What does Function.prototype.bind() do?', options: ['Calls a function immediately', 'Creates a new function with a fixed this', 'Deletes a function', 'Clones the function body'], correctIndex: 1, explanation: 'bind() creates a new function with this permanently set to the provided value.', difficulty: 0.2, discrimination: 1.3, tags: ['js'] },
    { id: 'jsf3', domainId: 'logic', stem: 'What is an IIFE?', options: ['A loop construct', 'An Immediately Invoked Function Expression', 'An interface definition', 'An import statement'], correctIndex: 1, explanation: 'IIFE runs immediately after being defined: (function(){})().', difficulty: -0.5, discrimination: 1.1, tags: ['js'] },
    { id: 'jsf4', domainId: 'logic', stem: 'Arrow functions do NOT have their own:', options: ['Parameters', 'Return values', 'this binding', 'Function body'], correctIndex: 2, explanation: 'Arrow functions inherit this from their enclosing lexical scope.', difficulty: -0.3, discrimination: 1.2, tags: ['js'] },
    { id: 'jsf5', domainId: 'advanced', stem: 'What is currying?', options: ['Error handling', 'Transforming a function to take arguments one at a time', 'Caching results', 'Async processing'], correctIndex: 1, explanation: 'Currying transforms f(a,b,c) into f(a)(b)(c).', difficulty: 0.5, discrimination: 1.3, tags: ['js'] },
  ],
  'js-es6': [
    { id: 'jse1', domainId: 'syntax', stem: 'What does the spread operator (...) do?', options: ['Deletes items', 'Expands an iterable into individual elements', 'Creates a loop', 'Defines a class'], correctIndex: 1, explanation: 'The spread operator unpacks elements from arrays, objects, or iterables.', difficulty: -0.8, discrimination: 1.1, tags: ['js'] },
    { id: 'jse2', domainId: 'syntax', stem: 'What are template literals delimited by?', options: ['Single quotes', 'Double quotes', 'Backticks', 'Parentheses'], correctIndex: 2, explanation: 'Template literals use backticks (`) and support ${expression} interpolation.', difficulty: -1.5, discrimination: 0.9, tags: ['js'] },
    { id: 'jse3', domainId: 'syntax', stem: 'What does destructuring assignment do?', options: ['Destroys objects', 'Unpacks values from arrays/objects into variables', 'Creates deep copies', 'Validates data'], correctIndex: 1, explanation: 'Destructuring extracts values into distinct variables in a concise way.', difficulty: -0.5, discrimination: 1.1, tags: ['js'] },
    { id: 'jse4', domainId: 'data-structures', stem: 'What is a Map different from a plain object?', options: ['Maps are faster', 'Maps allow any type as keys', 'Maps are immutable', 'Maps are arrays'], correctIndex: 1, explanation: 'Unlike objects (string keys only), Maps can use any value as a key.', difficulty: 0.0, discrimination: 1.2, tags: ['js'] },
    { id: 'jse5', domainId: 'syntax', stem: 'What does the optional chaining operator (?.) do?', options: ['Throws an error', 'Returns undefined if a property is null/undefined', 'Creates optional params', 'Defines nullable types'], correctIndex: 1, explanation: 'Optional chaining short-circuits to undefined instead of throwing on null/undefined.', difficulty: -0.3, discrimination: 1.2, tags: ['js'] },
  ],

  // ═══ PYTHON ═══
  'py-basics': [
    { id: 'pyb1', domainId: 'syntax', stem: 'What is the output of type([]) in Python?', options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'set'>"], correctIndex: 0, explanation: '[] creates a list in Python.', difficulty: -1.5, discrimination: 1.0, tags: ['python'] },
    { id: 'pyb2', domainId: 'syntax', stem: 'How do you create an f-string in Python?', options: ['f"Hello {name}"', '"Hello {name}".format()', '%s % name', 'str(name)'], correctIndex: 0, explanation: 'f-strings (f"...{expr}...") allow inline expressions in strings.', difficulty: -1.2, discrimination: 1.0, tags: ['python'] },
    { id: 'pyb3', domainId: 'syntax', stem: 'What does // operator do in Python?', options: ['Comment', 'Float division', 'Floor division', 'Exponentiation'], correctIndex: 2, explanation: '// performs floor (integer) division, rounding down the result.', difficulty: -1.0, discrimination: 1.1, tags: ['python'] },
    { id: 'pyb4', domainId: 'syntax', stem: 'Which keyword is used for nothing/empty block in Python?', options: ['void', 'null', 'pass', 'skip'], correctIndex: 2, explanation: 'pass is a no-op placeholder used when a statement is syntactically required.', difficulty: -1.8, discrimination: 0.9, tags: ['python'] },
    { id: 'pyb5', domainId: 'syntax', stem: 'What is None in Python?', options: ['Zero', 'Empty string', 'The null/nothing value', 'False'], correctIndex: 2, explanation: 'None is Python\'s singleton object representing the absence of a value.', difficulty: -1.5, discrimination: 1.0, tags: ['python'] },
  ],
  'py-ds': [
    { id: 'pyd1', domainId: 'data-structures', stem: 'What is the difference between a list and a tuple?', options: ['No difference', 'Tuples are mutable, lists are not', 'Lists are mutable, tuples are not', 'Lists are faster'], correctIndex: 2, explanation: 'Lists are mutable (can be changed), tuples are immutable (fixed after creation).', difficulty: -1.0, discrimination: 1.1, tags: ['python'] },
    { id: 'pyd2', domainId: 'data-structures', stem: 'What does dict.get(key, default) do?', options: ['Raises error if missing', 'Returns default if key not found', 'Always returns None', 'Deletes the key'], correctIndex: 1, explanation: '.get() returns a default value instead of raising KeyError.', difficulty: -0.8, discrimination: 1.1, tags: ['python'] },
    { id: 'pyd3', domainId: 'data-structures', stem: 'What does a set guarantee?', options: ['Order', 'Uniqueness', 'Sorting', 'Immutability'], correctIndex: 1, explanation: 'Sets store only unique elements and do not maintain order.', difficulty: -1.2, discrimination: 1.0, tags: ['python'] },
    { id: 'pyd4', domainId: 'data-structures', stem: 'What is a list comprehension?', options: ['A loop that prints items', 'Concise syntax to create lists from iterables', 'A sorting method', 'A class definition'], correctIndex: 1, explanation: 'List comprehensions like [x*2 for x in range(5)] create lists concisely.', difficulty: -0.5, discrimination: 1.2, tags: ['python'] },
    { id: 'pyd5', domainId: 'data-structures', stem: 'How do you check if a key exists in a dict?', options: ['dict.has(key)', 'key in dict', 'dict.exists(key)', 'dict.find(key)'], correctIndex: 1, explanation: 'The "in" operator checks for key membership in dictionaries.', difficulty: -1.2, discrimination: 1.0, tags: ['python'] },
  ],
  'py-oop': [
    { id: 'pyo1', domainId: 'advanced', stem: 'What is self in Python classes?', options: ['A keyword', 'Reference to the class', 'Reference to the current instance', 'A built-in function'], correctIndex: 2, explanation: 'self refers to the current instance of the class in methods.', difficulty: -1.0, discrimination: 1.1, tags: ['python'] },
    { id: 'pyo2', domainId: 'advanced', stem: 'What is __init__ in Python?', options: ['Destructor', 'Constructor/initializer method', 'Static method', 'Class method'], correctIndex: 1, explanation: '__init__ initializes a new instance when the class is called.', difficulty: -1.2, discrimination: 1.0, tags: ['python'] },
    { id: 'pyo3', domainId: 'advanced', stem: 'How does Python support multiple inheritance?', options: ['It does not', 'Using the "extends" keyword', 'Class can inherit from multiple parent classes', 'Only through interfaces'], correctIndex: 2, explanation: 'Python allows a class to inherit from multiple parents using MRO.', difficulty: 0.0, discrimination: 1.2, tags: ['python'] },
    { id: 'pyo4', domainId: 'advanced', stem: 'What does @property decorator do?', options: ['Makes attribute private', 'Defines a getter method for an attribute', 'Deletes an attribute', 'Creates a static method'], correctIndex: 1, explanation: '@property lets you access a method like an attribute.', difficulty: 0.2, discrimination: 1.2, tags: ['python'] },
    { id: 'pyo5', domainId: 'advanced', stem: 'What are dunder methods?', options: ['Debug methods', 'Double-underscore special methods like __str__', 'Private methods', 'Async methods'], correctIndex: 1, explanation: 'Dunder (double underscore) methods like __str__, __repr__ define object behavior.', difficulty: -0.3, discrimination: 1.1, tags: ['python'] },
  ],
  'py-funcs': [
    { id: 'pyf1', domainId: 'logic', stem: 'What does *args do in a function?', options: ['Defines keyword args', 'Accepts variable positional arguments as tuple', 'Creates a generator', 'Unpacks a dict'], correctIndex: 1, explanation: '*args collects extra positional arguments into a tuple.', difficulty: -0.5, discrimination: 1.1, tags: ['python'] },
    { id: 'pyf2', domainId: 'logic', stem: 'What is a lambda function?', options: ['A named function', 'A small anonymous function', 'A class method', 'A generator'], correctIndex: 1, explanation: 'Lambda creates a small anonymous function: lambda x: x * 2.', difficulty: -0.8, discrimination: 1.1, tags: ['python'] },
    { id: 'pyf3', domainId: 'advanced', stem: 'What does a decorator do?', options: ['Adds CSS styling', 'Wraps a function with additional behavior', 'Deletes a function', 'Creates a thread'], correctIndex: 1, explanation: 'Decorators wrap functions to extend their behavior without modifying code.', difficulty: -0.3, discrimination: 1.2, tags: ['python'] },
    { id: 'pyf4', domainId: 'logic', stem: 'What does **kwargs collect?', options: ['Positional args', 'Keyword arguments as a dictionary', 'List items', 'Errors'], correctIndex: 1, explanation: '**kwargs collects extra keyword arguments into a dictionary.', difficulty: -0.5, discrimination: 1.1, tags: ['python'] },
    { id: 'pyf5', domainId: 'logic', stem: 'What does yield do in a function?', options: ['Returns and terminates', 'Produces a value and pauses the function', 'Throws an error', 'Imports a module'], correctIndex: 1, explanation: 'yield makes a function a generator, producing values lazily.', difficulty: 0.0, discrimination: 1.2, tags: ['python'] },
  ],
  'py-advanced': [
    { id: 'pya1', domainId: 'advanced', stem: 'What is a context manager (with statement)?', options: ['A loop construct', 'Manages resource acquisition and release automatically', 'A decorator', 'A testing tool'], correctIndex: 1, explanation: 'Context managers ensure resources like files are properly closed.', difficulty: 0.0, discrimination: 1.2, tags: ['python'] },
    { id: 'pya2', domainId: 'advanced', stem: 'What does GIL stand for?', options: ['General Import Lock', 'Global Interpreter Lock', 'Generic Instance Loader', 'Grand Iteration Limit'], correctIndex: 1, explanation: 'The GIL prevents multiple threads from executing Python bytecode simultaneously.', difficulty: 0.5, discrimination: 1.3, tags: ['python'] },
    { id: 'pya3', domainId: 'advanced', stem: 'What is the purpose of __slots__?', options: ['Add more methods', 'Restrict attributes and save memory', 'Create slots in a queue', 'Define interfaces'], correctIndex: 1, explanation: '__slots__ prevents dynamic attribute creation and reduces memory usage.', difficulty: 0.8, discrimination: 1.4, tags: ['python'] },
    { id: 'pya4', domainId: 'advanced', stem: 'What is a metaclass?', options: ['A subclass', 'A class that creates classes', 'A mixin', 'An abstract method'], correctIndex: 1, explanation: 'Metaclasses define how classes themselves are constructed.', difficulty: 1.0, discrimination: 1.4, tags: ['python'] },
    { id: 'pya5', domainId: 'advanced', stem: 'What does asyncio module provide?', options: ['File I/O', 'Async event loop for concurrent code', 'Database ORM', 'Unit testing'], correctIndex: 1, explanation: 'asyncio provides infrastructure for writing async/concurrent code with coroutines.', difficulty: 0.3, discrimination: 1.2, tags: ['python'] },
  ],

  // ═══ C++ ═══
  'cpp-basics': [
    { id: 'cb1', domainId: 'syntax', stem: 'What is the size of int on most 64-bit systems?', options: ['2 bytes', '4 bytes', '8 bytes', '1 byte'], correctIndex: 1, explanation: 'int is typically 4 bytes (32 bits) even on 64-bit systems.', difficulty: -1.2, discrimination: 1.0, tags: ['cpp'] },
    { id: 'cb2', domainId: 'syntax', stem: 'What does const mean in C++?', options: ['Variable can be changed', 'Variable cannot be modified after init', 'Variable is deleted', 'Variable is global'], correctIndex: 1, explanation: 'const makes a variable read-only after initialization.', difficulty: -1.5, discrimination: 0.9, tags: ['cpp'] },
    { id: 'cb3', domainId: 'syntax', stem: 'What does auto keyword do in C++11?', options: ['Creates automatic variable', 'Deduces type automatically', 'Makes variable global', 'Allocates on heap'], correctIndex: 1, explanation: 'auto lets the compiler deduce the variable type from the initializer.', difficulty: -0.8, discrimination: 1.1, tags: ['cpp'] },
    { id: 'cb4', domainId: 'syntax', stem: 'What is the :: operator called?', options: ['Arrow operator', 'Scope resolution operator', 'Dereference operator', 'Assignment operator'], correctIndex: 1, explanation: ':: is the scope resolution operator, used to access namespace/class members.', difficulty: -1.0, discrimination: 1.0, tags: ['cpp'] },
    { id: 'cb5', domainId: 'syntax', stem: 'What does #include do?', options: ['Links a library', 'Includes header file content', 'Imports a module', 'Defines a macro'], correctIndex: 1, explanation: '#include copies the contents of the specified header file into the source.', difficulty: -1.8, discrimination: 0.9, tags: ['cpp'] },
  ],
  'cpp-memory': [
    { id: 'cm1', domainId: 'advanced', stem: 'What does new and delete do?', options: ['Create/destroy files', 'Allocate/deallocate heap memory', 'Define/undefine macros', 'Start/stop threads'], correctIndex: 1, explanation: 'new allocates memory on the heap, delete frees it.', difficulty: -0.8, discrimination: 1.1, tags: ['cpp'] },
    { id: 'cm2', domainId: 'advanced', stem: 'What is a dangling pointer?', options: ['A null pointer', 'A pointer to freed memory', 'A void pointer', 'A function pointer'], correctIndex: 1, explanation: 'A dangling pointer references memory that has been deallocated.', difficulty: 0.0, discrimination: 1.2, tags: ['cpp'] },
    { id: 'cm3', domainId: 'advanced', stem: 'What does std::unique_ptr guarantee?', options: ['Shared ownership', 'Single ownership with auto cleanup', 'No ownership', 'Thread safety'], correctIndex: 1, explanation: 'unique_ptr ensures only one pointer owns the resource and auto-deletes it.', difficulty: 0.3, discrimination: 1.3, tags: ['cpp'] },
    { id: 'cm4', domainId: 'advanced', stem: 'What is RAII?', options: ['A design pattern for UI', 'Resource Acquisition Is Initialization', 'A testing framework', 'A build system'], correctIndex: 1, explanation: 'RAII ties resource lifetime to object lifetime for automatic cleanup.', difficulty: 0.5, discrimination: 1.3, tags: ['cpp'] },
    { id: 'cm5', domainId: 'advanced', stem: 'What is a memory leak?', options: ['Fast memory access', 'Allocated memory never freed', 'Memory corruption', 'Stack overflow'], correctIndex: 1, explanation: 'Memory leaks occur when allocated memory is never deallocated.', difficulty: -0.5, discrimination: 1.1, tags: ['cpp'] },
  ],
  'cpp-oop': [
    { id: 'co1', domainId: 'advanced', stem: 'What is the difference between public and private?', options: ['No difference', 'public: accessible everywhere, private: class only', 'private is faster', 'public is deprecated'], correctIndex: 1, explanation: 'Public members are accessible anywhere, private only within the class.', difficulty: -1.2, discrimination: 1.0, tags: ['cpp'] },
    { id: 'co2', domainId: 'advanced', stem: 'What does virtual keyword enable?', options: ['Virtual memory', 'Runtime polymorphism', 'Static binding', 'Memory virtualization'], correctIndex: 1, explanation: 'virtual enables function overriding and late binding via vtable.', difficulty: 0.0, discrimination: 1.2, tags: ['cpp'] },
    { id: 'co3', domainId: 'advanced', stem: 'What is a pure virtual function?', options: ['A function with no body (= 0)', 'A fast function', 'A private function', 'A template function'], correctIndex: 0, explanation: 'Pure virtual functions (= 0) make a class abstract, forcing derived classes to implement them.', difficulty: 0.3, discrimination: 1.3, tags: ['cpp'] },
    { id: 'co4', domainId: 'advanced', stem: 'What is the diamond problem?', options: ['A syntax error', 'Ambiguity in multiple inheritance', 'Memory leak pattern', 'A sorting issue'], correctIndex: 1, explanation: 'Diamond problem occurs when two parent classes inherit from the same grandparent.', difficulty: 0.5, discrimination: 1.3, tags: ['cpp'] },
    { id: 'co5', domainId: 'advanced', stem: 'What is a destructor?', options: ['A constructor helper', 'Called when objects are destroyed to clean up', 'A factory method', 'An operator overload'], correctIndex: 1, explanation: 'Destructors (~ClassName) are called automatically when an object goes out of scope.', difficulty: -0.5, discrimination: 1.1, tags: ['cpp'] },
  ],
  'cpp-stl': [
    { id: 'cs1', domainId: 'data-structures', stem: 'What is the time complexity of std::vector push_back (amortized)?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], correctIndex: 1, explanation: 'push_back is amortized O(1) due to exponential capacity growth.', difficulty: -0.3, discrimination: 1.2, tags: ['cpp'] },
    { id: 'cs2', domainId: 'data-structures', stem: 'When should you use std::map vs std::unordered_map?', options: ['Map for random, unordered for sorted', 'Map for sorted keys, unordered for O(1) lookup', 'No difference', 'Map is newer'], correctIndex: 1, explanation: 'std::map keeps keys sorted (O(log n)), unordered_map uses hashing (O(1) avg).', difficulty: 0.0, discrimination: 1.2, tags: ['cpp'] },
    { id: 'cs3', domainId: 'data-structures', stem: 'What iterator does std::vector provide?', options: ['Forward only', 'Random access', 'Bidirectional only', 'Input only'], correctIndex: 1, explanation: 'Vector provides random access iterators supporting +, -, [] operations.', difficulty: -0.5, discrimination: 1.1, tags: ['cpp'] },
    { id: 'cs4', domainId: 'data-structures', stem: 'What does std::sort require?', options: ['A linked list', 'Random access iterators', 'A sorted container', 'A comparator only'], correctIndex: 1, explanation: 'std::sort needs random access iterators (works on vectors, arrays, deques).', difficulty: 0.0, discrimination: 1.2, tags: ['cpp'] },
    { id: 'cs5', domainId: 'data-structures', stem: 'What is std::pair used for?', options: ['Storing three values', 'Storing two heterogeneous values together', 'Creating arrays', 'Sorting elements'], correctIndex: 1, explanation: 'std::pair holds two values of potentially different types.', difficulty: -1.0, discrimination: 1.0, tags: ['cpp'] },
  ],
  'cpp-advanced': [
    { id: 'ca1', domainId: 'advanced', stem: 'What are templates in C++?', options: ['HTML templates', 'Generic programming with type parameters', 'Design patterns', 'Preprocessor macros'], correctIndex: 1, explanation: 'Templates enable writing generic code that works with any type.', difficulty: 0.0, discrimination: 1.2, tags: ['cpp'] },
    { id: 'ca2', domainId: 'advanced', stem: 'What is move semantics?', options: ['Moving files', 'Transferring resources instead of copying them', 'Animation', 'Thread migration'], correctIndex: 1, explanation: 'Move semantics transfer ownership of resources, avoiding expensive copies.', difficulty: 0.5, discrimination: 1.3, tags: ['cpp'] },
    { id: 'ca3', domainId: 'advanced', stem: 'What does constexpr do?', options: ['Runtime constant', 'Compile-time evaluation', 'Thread-safe constant', 'External constant'], correctIndex: 1, explanation: 'constexpr enables computation at compile time for better performance.', difficulty: 0.3, discrimination: 1.2, tags: ['cpp'] },
    { id: 'ca4', domainId: 'advanced', stem: 'What is SFINAE?', options: ['A library', 'Substitution Failure Is Not An Error', 'A build tool', 'A memory model'], correctIndex: 1, explanation: 'SFINAE allows template overload resolution to silently skip invalid substitutions.', difficulty: 1.0, discrimination: 1.4, tags: ['cpp'] },
    { id: 'ca5', domainId: 'advanced', stem: 'What are lambda expressions in C++11?', options: ['Named functions', 'Anonymous function objects', 'Macros', 'Type aliases'], correctIndex: 1, explanation: 'Lambdas create anonymous callable objects with capture lists.', difficulty: 0.0, discrimination: 1.2, tags: ['cpp'] },
  ],

  // ═══ GO ═══
  'go-basics': [
    { id: 'gb1', domainId: 'syntax', stem: 'What is the zero value of a string in Go?', options: ['null', 'nil', '""(empty string)', 'undefined'], correctIndex: 2, explanation: 'The zero value for strings in Go is the empty string "".', difficulty: -1.2, discrimination: 1.0, tags: ['go'] },
    { id: 'gb2', domainId: 'syntax', stem: 'How do you declare a short variable in Go?', options: ['var x = 5', 'x := 5', 'let x = 5', 'int x = 5'], correctIndex: 1, explanation: ':= is the short variable declaration operator in Go.', difficulty: -1.5, discrimination: 0.9, tags: ['go'] },
    { id: 'gb3', domainId: 'syntax', stem: 'Does Go have classes?', options: ['Yes', 'No, it uses structs and methods', 'Only abstract classes', 'Yes, with inheritance'], correctIndex: 1, explanation: 'Go uses structs with methods instead of classes and inheritance.', difficulty: -1.0, discrimination: 1.1, tags: ['go'] },
    { id: 'gb4', domainId: 'syntax', stem: 'What happens to unused imports in Go?', options: ['Warning', 'Compilation error', 'Ignored', 'Auto-removed'], correctIndex: 1, explanation: 'Go treats unused imports as compilation errors to keep code clean.', difficulty: -0.8, discrimination: 1.1, tags: ['go'] },
    { id: 'gb5', domainId: 'syntax', stem: 'What is a slice in Go?', options: ['A fixed array', 'A dynamic array-like reference type', 'A string', 'A map'], correctIndex: 1, explanation: 'Slices are dynamic, flexible views into arrays with length and capacity.', difficulty: -0.5, discrimination: 1.1, tags: ['go'] },
  ],
  'go-concurrency': [
    { id: 'gc1', domainId: 'logic', stem: 'What is a goroutine?', options: ['A thread', 'A lightweight concurrent function', 'A process', 'A callback'], correctIndex: 1, explanation: 'Goroutines are lightweight functions managed by the Go runtime, not OS threads.', difficulty: -0.8, discrimination: 1.1, tags: ['go'] },
    { id: 'gc2', domainId: 'logic', stem: 'How do you start a goroutine?', options: ['thread.start()', 'go functionName()', 'async functionName()', 'spawn functionName()'], correctIndex: 1, explanation: 'The go keyword before a function call starts it as a goroutine.', difficulty: -1.2, discrimination: 1.0, tags: ['go'] },
    { id: 'gc3', domainId: 'logic', stem: 'What is a channel used for?', options: ['File I/O', 'Communication between goroutines', 'Network requests', 'Database queries'], correctIndex: 1, explanation: 'Channels enable safe communication and synchronization between goroutines.', difficulty: -0.5, discrimination: 1.2, tags: ['go'] },
    { id: 'gc4', domainId: 'logic', stem: 'What does select statement do with channels?', options: ['Selects a database', 'Waits on multiple channel operations', 'Sorts channels', 'Creates channels'], correctIndex: 1, explanation: 'select blocks until one of its channel cases can proceed.', difficulty: 0.3, discrimination: 1.3, tags: ['go'] },
    { id: 'gc5', domainId: 'logic', stem: 'What is a buffered channel?', options: ['A faster channel', 'A channel with a fixed-size buffer', 'A read-only channel', 'A closed channel'], correctIndex: 1, explanation: 'Buffered channels hold a fixed number of values without blocking until full.', difficulty: 0.0, discrimination: 1.2, tags: ['go'] },
  ],
  'go-interfaces': [
    { id: 'gi1', domainId: 'advanced', stem: 'How are interfaces implemented in Go?', options: ['With "implements" keyword', 'Implicitly by having the required methods', 'Through inheritance', 'By registering with runtime'], correctIndex: 1, explanation: 'Go uses structural typing—any type with the right methods satisfies an interface.', difficulty: -0.3, discrimination: 1.2, tags: ['go'] },
    { id: 'gi2', domainId: 'advanced', stem: 'What is the empty interface (interface{})?', options: ['An error', 'Accepts any type', 'A nil interface', 'Deprecated syntax'], correctIndex: 1, explanation: 'interface{} (or "any") has no methods, so every type satisfies it.', difficulty: -0.5, discrimination: 1.1, tags: ['go'] },
    { id: 'gi3', domainId: 'advanced', stem: 'What is embedding in Go structs?', options: ['Adding comments', 'Composing types by including one struct within another', 'Encrypting data', 'Creating aliases'], correctIndex: 1, explanation: 'Embedding promotes the methods and fields of the embedded type.', difficulty: 0.0, discrimination: 1.2, tags: ['go'] },
    { id: 'gi4', domainId: 'advanced', stem: 'What is a type assertion?', options: ['Checking type at compile time', 'Extracting the concrete type from an interface', 'Creating a new type', 'Asserting not nil'], correctIndex: 1, explanation: 'Type assertions (val.(Type)) extract the concrete value from an interface.', difficulty: 0.2, discrimination: 1.2, tags: ['go'] },
    { id: 'gi5', domainId: 'advanced', stem: 'What is a pointer receiver vs value receiver?', options: ['No difference', 'Pointer can modify the struct, value makes a copy', 'Value is faster', 'Pointer is deprecated'], correctIndex: 1, explanation: 'Pointer receivers can modify the original struct; value receivers work on a copy.', difficulty: 0.0, discrimination: 1.2, tags: ['go'] },
  ],
  'go-errors': [
    { id: 'ge1', domainId: 'logic', stem: 'How does Go handle errors idiomatically?', options: ['try-catch', 'Returning error as last return value', 'Global error handler', 'Exceptions'], correctIndex: 1, explanation: 'Go returns errors explicitly as values to be checked by the caller.', difficulty: -0.8, discrimination: 1.1, tags: ['go'] },
    { id: 'ge2', domainId: 'logic', stem: 'What does errors.Is() do?', options: ['Creates errors', 'Checks if an error matches a target error in the chain', 'Ignores errors', 'Logs errors'], correctIndex: 1, explanation: 'errors.Is() unwraps the error chain to check for a specific error.', difficulty: 0.0, discrimination: 1.2, tags: ['go'] },
    { id: 'ge3', domainId: 'logic', stem: 'What does panic() do?', options: ['Logs a warning', 'Stops normal execution and starts unwinding', 'Returns an error', 'Retries the operation'], correctIndex: 1, explanation: 'panic stops normal flow, runs deferred functions, and crashes if not recovered.', difficulty: -0.3, discrimination: 1.2, tags: ['go'] },
    { id: 'ge4', domainId: 'logic', stem: 'What does recover() do?', options: ['Restarts the program', 'Catches a panic and resumes normal execution', 'Retries a function', 'Closes channels'], correctIndex: 1, explanation: 'recover() captures a panic value inside a deferred function.', difficulty: 0.3, discrimination: 1.3, tags: ['go'] },
    { id: 'ge5', domainId: 'logic', stem: 'What does fmt.Errorf() do?', options: ['Prints an error', 'Creates a formatted error value', 'Catches an error', 'Ignores an error'], correctIndex: 1, explanation: 'fmt.Errorf creates a new error with a formatted message string.', difficulty: -0.5, discrimination: 1.1, tags: ['go'] },
  ],
  'go-packages': [
    { id: 'gp1', domainId: 'syntax', stem: 'What does "go mod init" do?', options: ['Starts a server', 'Initializes a new Go module', 'Installs Go', 'Creates a main.go file'], correctIndex: 1, explanation: 'go mod init creates a go.mod file defining the module path.', difficulty: -1.0, discrimination: 1.0, tags: ['go'] },
    { id: 'gp2', domainId: 'syntax', stem: 'How do you export a function in Go?', options: ['Using export keyword', 'Capitalizing the first letter', 'Using public keyword', 'Adding @export annotation'], correctIndex: 1, explanation: 'In Go, identifiers starting with uppercase are exported (public).', difficulty: -1.2, discrimination: 1.0, tags: ['go'] },
    { id: 'gp3', domainId: 'syntax', stem: 'What is go.sum file for?', options: ['Source code', 'Cryptographic checksums of dependencies', 'Build configuration', 'Test results'], correctIndex: 1, explanation: 'go.sum contains expected hashes of module dependencies for verification.', difficulty: 0.0, discrimination: 1.2, tags: ['go'] },
    { id: 'gp4', domainId: 'syntax', stem: 'What does "go get" do?', options: ['Downloads a Go file', 'Adds/updates dependencies', 'Gets user input', 'Starts a REPL'], correctIndex: 1, explanation: 'go get adds or updates module dependencies in go.mod.', difficulty: -0.8, discrimination: 1.1, tags: ['go'] },
    { id: 'gp5', domainId: 'syntax', stem: 'What package must every Go executable have?', options: ['package app', 'package main', 'package go', 'package exec'], correctIndex: 1, explanation: 'Every executable Go program must start with package main and a main() function.', difficulty: -1.5, discrimination: 0.9, tags: ['go'] },
  ],
};
