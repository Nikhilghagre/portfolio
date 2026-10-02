// Learning Hub content map. Lesson text lives in learning/<track>/**/NOTES.md.

export const tracks = [
  {
    id: 'solid',
    title: 'SOLID in Node.js',
    blurb: 'Refactor one real Order Checkout System from a 150-line god class into clean, testable code — one principle at a time.',
    tags: ['OOP', 'Clean Architecture', 'Design Patterns'],
    status: 'live' as const,
    lessons: 6,
  },
  {
    id: 'dsa',
    title: 'DSA Interview Roadmap',
    blurb: 'Pattern-first interview prep: own every distinct pattern, then stop. 140 problems ranked into tiers.',
    tags: ['Algorithms', 'Interviews', 'JavaScript'],
    status: 'soon' as const,
    lessons: 0,
  },
  {
    id: 'js',
    title: 'JavaScript Core',
    blurb: 'Closures, hoisting, scope and the gotchas interviewers love — with small runnable exercises.',
    tags: ['JavaScript', 'Fundamentals'],
    status: 'soon' as const,
    lessons: 0,
  },
  {
    id: 'patterns',
    title: 'Design Patterns',
    blurb: 'Strategy, Factory, Template Method, Module and more — each one shown solving a real problem.',
    tags: ['Patterns', 'Architecture'],
    status: 'soon' as const,
    lessons: 0,
  },
];

// One entry per step folder. `id` matches the folder name in learning/solid.
export const solidSteps = [
  {
    id: '00-bad-design',
    letter: '∅',
    name: 'The God Class',
    short: 'Bad design',
    summary: 'One method, nine jobs. Meet the code we are going to fix — and why it hurts.',
    run: ['node 00-bad-design/run.js'],
  },
  {
    id: '01-srp',
    letter: 'S',
    name: 'Single Responsibility',
    short: 'SRP',
    summary: 'A class should have only one reason to change. Split the god class into ten focused owners.',
    run: ['node 01-srp/run.js', 'node --test 01-srp/test.js'],
  },
  {
    id: '02-ocp',
    letter: 'O',
    name: 'Open / Closed',
    short: 'OCP',
    summary: 'Open for extension, closed for modification. Kill the if/else chains with the Strategy pattern.',
    run: ['node 02-ocp/run.js', 'node 02-ocp/extend-demo.js', 'node --test 02-ocp/test.js'],
  },
  {
    id: '03-lsp',
    letter: 'L',
    name: 'Liskov Substitution',
    short: 'LSP',
    summary: 'Require no more, promise no less. Catch the subclasses that compile, pass review — and lie.',
    run: ['node 03-lsp/bad/demo-broken.js', 'node 03-lsp/good/demo-fixed.js', 'node --test 03-lsp/contract-test.js'],
  },
  {
    id: '04-isp',
    letter: 'I',
    name: 'Interface Segregation',
    short: 'ISP',
    summary: 'No client should depend on methods it does not use. Many small interfaces beat one fat one.',
    run: ['node 04-isp/simple/1-problem.js', 'node 04-isp/simple/2-fix.js', 'node 04-isp/app/demo.js'],
  },
  {
    id: '05-dip',
    letter: 'D',
    name: 'Dependency Inversion',
    short: 'DIP',
    summary: 'Business logic must not know your database or email vendor. Depend on abstractions you own.',
    run: ['node 05-dip/simple/1-problem.js', 'node 05-dip/simple/3-the-inversion.js', 'node 05-dip/simple/4-composition-root.js'],
  },
];

export const solidUpcoming = [
  { letter: '★', name: 'SOLID final', summary: 'All five principles together in one working app.' },
  { letter: '◇', name: 'Patterns on top', summary: 'Design patterns built on the SOLID base.' },
];

export const sourceRepo = 'https://github.com/Nikhilghagre/portfolio/tree/main/learning/solid';
