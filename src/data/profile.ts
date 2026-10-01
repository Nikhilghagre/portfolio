// ─────────────────────────────────────────────────────────────
//  Single source of truth for the whole site.
//  Edit this file to update your portfolio — every section reads from here.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Nikhil Ghagre',
  handle: 'nikhil',
  role: 'Backend Developer',
  tagline:
    'I build scalable backend services with Node.js, TypeScript and PHP — from real-money gaming payouts to WhatsApp-powered support tools.',
  location: 'Mumbai, India',
  available: true,
  email: 'nikhilghagre123@gmail.com',
  phone: '+91 95271 78690',
  resume: `${import.meta.env.BASE_URL}resume.pdf`,
  about: [
    "I'm a backend developer with 4.5+ years of experience building scalable services using Node.js, PHP and TypeScript. I work across REST API development, cloud infrastructure on AWS and database design — with a track record of improving system performance, engineering velocity and business conversion rates.",
    "Today I'm a Software Engineer III at Shaadi.com, where I own backend and product features end to end — from WhatsApp calling inside our advisor panel to migrating a Laravel codebase to TypeScript. Before that I built prize-distribution and financial reporting logic for real-money games.",
    'I started as an Electrical Engineer building IoT devices, so I like understanding systems all the way down. I use AI-assisted tools like Claude Code and Cursor to ship faster, and I write teaching material on DSA, SOLID and design patterns to help others grow.',
  ],
  stats: [
    { value: 4.5, suffix: '+', label: 'years experience' },
    { value: 3, suffix: '', label: 'companies' },
    { value: 20, suffix: '+', label: 'technologies used' },
  ],
  socials: [
    { label: 'GitHub', url: 'https://github.com/nikhilghagre', icon: 'github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/nikhil-ghagre/', icon: 'linkedin' },
    { label: 'Email', url: 'mailto:nikhilghagre123@gmail.com', icon: 'mail' },
  ],
};

export const experience = [
  {
    role: 'Software Engineer III',
    company: 'People Interactive (Shaadi.com)',
    url: 'https://www.shaadi.com',
    location: 'Mumbai',
    period: 'May 2024 — Present',
    current: true,
    points: [
      'Own the design and development of key backend and product features, improving user experience, engagement and business conversion rates.',
      'Integrated end-to-end WhatsApp calling and messaging into the in-house Response Panel so advisors can reach users directly on WhatsApp.',
      'Migrated the existing Laravel codebase to TypeScript, improving maintainability, type safety and scalability.',
      'Built tracking and analytics reports that give stakeholders actionable, data-driven insights.',
      'Use AI-powered tools (Cursor, Claude Code) to automate repetitive workflows, raise unit-test coverage and increase sprint velocity.',
      'Contribute to backend architecture for scalable, reliable services that support high-traffic workloads.',
    ],
    stack: ['Node.js', 'TypeScript', 'AWS Lambda', 'PHP', 'Laravel', 'React', 'Docker'],
  },
  {
    role: 'Backend Developer',
    company: 'NileeGames Future And Technology',
    url: '',
    location: 'Mumbai',
    period: 'Aug 2022 — May 2024',
    points: [
      'Built prize-distribution logic for high-stakes real-money games like Quiz Time and Clubhouse (Taarak Mehta Ka Ooltah Chashmah), ensuring fair reward allocation.',
      'Created financial report pages with GST, TDS, prize-distribution and game-report logic to track transactions and performance.',
      'Shipped PHP APIs with the Unity team for the Clubhouse and Quiz Time platforms, and migrated the complete tmkocplay.com backend to a new frontend.',
      'Implemented secure file storage on AWS S3 for game images and APKs, plus Google & WhatsApp authentication for tmkocplay.com.',
      'Launched a dynamic web app for the Croma Store Event serving 200,000+ monthly visitors.',
      'Led development of "GullyTeam", an in-house sports tournament organizer app.',
    ],
    stack: ['Node.js', 'PHP', 'CodeIgniter', 'AWS S3', 'MySQL'],
  },
  {
    role: 'Intern',
    company: 'Take It Ideas Innovative Solutions',
    url: '',
    location: 'Nagpur',
    period: 'Jan 2022 — Aug 2022',
    points: [
      'Built a secure web-based voting portal for the RTMNU Nagpur University Senate elections.',
      'Engineered an RFID-based attendance system that automated attendance tracking.',
      'Led training and peer-mentoring sessions for graduate students.',
    ],
    stack: ['PHP', 'HTML', 'CSS', 'IoT'],
  },
];

export const projects = [
  // `featured` cards span two columns — keep featured cards followed by pairs so the grid stays even.
  {
    title: 'WhatsApp Calling & Messaging for Advisors',
    description:
      "End-to-end WhatsApp calling and messaging integrated into Shaadi.com's in-house Response Panel, letting advisors talk to users without leaving their workflow.",
    metric: 'calls + chat in one panel',
    stack: ['Node.js', 'TypeScript', 'AWS Lambda', 'WhatsApp API'],
    github: '',
    live: '',
    featured: true,
  },
  {
    title: 'Real-Money Prize Engine',
    description:
      'Prize-distribution logic and financial reporting (GST, TDS, payouts) for real-money games Quiz Time and Clubhouse.',
    metric: 'fair, auditable payouts',
    stack: ['PHP', 'CodeIgniter', 'Node.js', 'MySQL'],
    github: '',
    live: '',
  },
  {
    title: 'Laravel → TypeScript Migration',
    description: 'Moved an existing Laravel codebase to TypeScript for type safety, maintainability and long-term velocity.',
    metric: 'type-safe codebase',
    stack: ['TypeScript', 'Node.js', 'Laravel'],
    github: '',
    live: '',
  },
  {
    title: 'Croma Store Event Platform',
    description: 'A dynamic web application built and launched for the Croma Store Event, handling heavy event-day traffic.',
    metric: '200K+ monthly visitors',
    stack: ['PHP', 'MySQL', 'AWS'],
    github: '',
    live: '',
    featured: true,
  },
  {
    title: 'GullyTeam',
    description: 'In-house sports tournament organizer — create tournaments, manage participants and track records.',
    metric: 'led end to end',
    stack: ['PHP', 'MySQL'],
    github: '',
    live: '',
  },
  {
    title: 'University Senate Voting Portal',
    description: 'Secure web-based voting portal for RTMNU Nagpur University Senate elections, for students and faculty.',
    metric: 'transparent elections',
    stack: ['PHP', 'HTML', 'CSS'],
    github: '',
    live: '',
  },
];

// shown as a compact list under the project cards
export const sideProjects = [
  { title: 'Frontend practice — Day 1', note: 'web', url: 'https://nikhilghagre.github.io/day1/' },
  { title: 'Frontend practice — Day 2', note: 'web', url: 'https://nikhilghagre.github.io/day2/' },
  { title: 'RFID-based attendance system', note: 'IoT', url: '' },
  { title: 'Smart home switch controller (ESP32, Android-controlled)', note: 'IoT', url: '' },
  { title: 'Semi-automatic liquid dispenser for vendors (COVID-19)', note: 'hardware', url: '' },
  { title: '2D plotter with Arduino Uno + CNC Shield V3', note: 'hardware', url: '' },
];

export const skills = [
  { group: 'Backend', items: ['Node.js', 'TypeScript', 'JavaScript', 'Express.js', 'PHP', 'Laravel', 'CodeIgniter', 'REST APIs'] },
  { group: 'Cloud & DevOps', items: ['AWS S3', 'AWS EC2', 'AWS Lambda', 'CloudWatch', 'Docker', 'CI/CD'] },
  { group: 'Databases', items: ['MySQL', 'MongoDB'] },
  { group: 'Frontend', items: ['React', 'HTML', 'CSS', 'Bootstrap'] },
  { group: 'Testing & Tools', items: ['Unit Testing', 'Git', 'GitHub', 'Postman', 'Kafka', 'Jira'] },
  { group: 'AI-Assisted Dev', items: ['Claude Code', 'Cursor'] },
];

// Add real recommendations here (e.g. from LinkedIn). The section stays hidden while this is empty.
// { quote: '...', name: 'Full Name', title: 'Role, Company' }
export const testimonials: { quote: string; name: string; title: string }[] = [];

export const education = [
  { title: 'B.E. — Electrical Engineering', place: 'KDK College of Engineering, Nagpur', period: '2017 — 2021' },
];
