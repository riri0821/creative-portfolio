// Single content source read by both the Desktop view and the Normal View.
// Everything here is placeholder copy. Replace it section by section.

export const profile = {
  name: "Tamara",
  handle: "@lorem_ipsum",
  role: "Full-Stack Developer",
  // Cut-out photo (transparent background) shown in front of the stream room.
  portrait: "/stream/me.webp",
  // Pixel-art room behind the portrait in the LIVE_STREAM window.
  streamBg: "/stream/room.png",
  streamTitle: "Hi! I'm Tamara",
  // Day 1 of the "stream"; the taskbar shows how many days since this date.
  startedOn: "2026-01-01",
  // Video subtitles, typed out one line at a time and looped.
  intro: [
    "Hi! I'm Tamara!",
    "I'm an Information Systems student at UST.",
    "I build full-stack apps with the PERN stack.",
    "Right now I'm leveling up in cybersecurity.",
    "Check out my projects, and say hi in Contact!",
  ],
  about:
    "I'm an Information Systems student at the University of Santo Tomas. I have 6 years of hands-on experience and skills in PERN stack development, JavaScript, Python, and game development, and I'm self-studying cybersecurity. I'm looking for opportunities where I can apply my experience to systems work.",
};

export const links = {
  github: "https://github.com/riri0821",
  linkedin: "https://www.linkedin.com/in/tamara-valencia01",
  resume: "#", // e.g. "/resume.pdf" once the file is in /public
  email: "lorem@example.com",
};

export type Stat = {
  id: string;
  label: string;
  value: string;
  max?: string;
  // Small word shown right after the value, e.g. "6 Terms"
  suffix?: string;
  unit?: string;
  percent: number;
  // Square image in /public shown in the My Achievements window
  icon?: string;
};

export const stats: Stat[] = [
  { id: "deans", label: "Dean's Lister", value: "6", suffix: "Terms", unit: "AY 2023-2026", percent: 100, icon: "/achievements/deans.png" },
  { id: "iss", label: "Information Systems Society", value: "Member", unit: "AY 2024-2025", percent: 100, icon: "/achievements/iss.png" },
  { id: "nihongo", label: "Unmei Nihongo Center", value: "N5", unit: "Japanese Course", percent: 100, icon: "/achievements/nihongo.png" },
];

export type Project = {
  slot: string;
  file: string;
  title: string;
  description: string;
  tags: string[];
  demo: string;
  source: string;
  accent: string;
  // Screenshot in /public shown on hover and in the details panel, e.g. "/projects/j1spa-dss.png".
  preview?: string;
  // Optional different screenshot for the hover popup on the file icon.
  hoverPreview?: string;
};

export const projects: Project[] = [
  {
    slot: "Data1",
    file: "J1SPA_DSS.exe",
    title: "J1SPA-DSS",
    description:
      "Analytics and decision support web app for J1 Scooter Parts and Accessories. It replaces manual sales and stock tracking with a live owner dashboard, five-model demand forecasting and automatic low-stock, demand-spike and overstock alerts, so the shop knows what to restock before it runs out.",
    tags: ["Next.js", "Supabase", "PostgreSQL", "FastAPI", "Python", "Recharts"],
    demo: "https://j1spa-dss.vercel.app/login",
    source: "https://github.com/riri0821/j1spa-dss",
    accent: "#22c55e",
    preview: "/projects/j1spa-dss.jpg",
    hoverPreview: "/projects/j1spa-dss-login.jpg",
  },
  {
    slot: "Data2",
    file: "Project_Ipsum.exe",
    title: "Dolor Sit Dashboard",
    description:
      "Aenean lacinia bibendum nulla sed consectetur. Nullam quis risus eget urna mollis ornare vel eu leo. Donec sed odio dui.",
    tags: ["React", "Node.js", "Express"],
    demo: "#",
    source: "#",
    accent: "#70e6ff",
  },
  {
    slot: "Data3",
    file: "Project_Dolor.exe",
    title: "Amet Consectetur App",
    description:
      "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
    tags: ["TypeScript", "Supabase"],
    demo: "#",
    source: "#",
    accent: "#cfa8f5",
  },
  {
    slot: "Data4",
    file: "Project_Sit.exe",
    title: "Adipiscing Elit Tool",
    description:
      "Curabitur blandit tempus porttitor. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo.",
    tags: ["Python", "Security", "CLI"],
    demo: "#",
    source: "#",
    accent: "#93ecdf",
  },
];

export type Post = {
  id: number;
  title: string;
  dates: string;
  text: string;
  tags: string[];
  likes: number;
  retweets: number;
};

// Work Experience posts in the WORK_EXPERIENCE window, newest role first.
export const posts: Post[] = [
  {
    id: 1,
    title: "Business Systems Developer and Operations Associate",
    dates: "2023 - 2026",
    text: "Built and managed the business's analytics and sales tracking system using the PERN stack (PostgreSQL, Express, React, Node.js).\n\nCleaned and migrated up to 11 years of historical Excel sales records into the system using Python.\n\nHandled daily sales entry and record maintenance, and produced daily sales and operational reports for management with zero data mishandling incidents.",
    tags: [],
    likes: 1204,
    retweets: 88,
  },
  {
    id: 2,
    title: "Freelance Full Stack Developer",
    dates: "2023 - 2025",
    text: "Designed, built, and deployed full stack websites for clients using PostgreSQL, Express, React, and Node.js.",
    tags: [],
    likes: 932,
    retweets: 41,
  },
  {
    id: 3,
    title: "Sales Data Analyst",
    dates: "2020 - 2023",
    text: "Processed raw transaction logs and created dynamic Excel reports to track sales performance, spot key revenue trends, and support management decision-making.",
    tags: [],
    likes: 777,
    retweets: 63,
  },
  {
    id: 4,
    title: "Roblox Clothing Store Founder and Developer",
    dates: "2020 - Present",
    text: "In 2020, I built a Roblox homestore, designed the clothing, and scripted the Robux purchase prompts in Luau. It reached 300,000 Robux in sales and is still selling today.",
    tags: ["#passive"],
    likes: 2048,
    retweets: 128,
  },
];

// Shown one by one in the LIVE_STREAM "My Bio" panel, in this order.
export const bioHighlights = [
  { label: "Stack", text: "PERN (PostgreSQL, Express, React, Node.js), JavaScript, Python" },
  { label: "Education", text: "BS Information Systems, UST (10-year Thomasian)" },
  { label: "Operations", text: "6 Years, Retail Sales to Operations and Business Systems Associate" },
  { label: "Enrollment", text: "UTokyo Matsuo-Iwasawa Lab (GCI World), AI Systems and Data Engineering" },
  { label: "Upskilling", text: "Cybersecurity and Web Vulnerability Assessment (TryHackMe)" },
  { label: "Game Dev", text: "Luau and Roblox Studio" },
  { label: "Language", text: "Nihongo Language Training" },
];

export const chatUsers = [
  "lorem_fan", "ipsum99", "dolor.exe", "sit_amet", "consect3tur",
  "adipiscing", "elit_chan", "tempor_kun", "magna.aliqua", "veniam",
];

export const chatLines = [
  "lorem ipsum!!",
  "dolor sit amet",
  "first time here, hi",
  "what stack is this?",
  "!projects",
  "consectetur adipiscing",
  "so cute omg",
  "sed do eiusmod",
  "React + Tailwind?",
  "!contact",
  "tempor incididunt",
  "pog",
  "ut labore et dolore",
  "!skills",
  "magna aliqua <3",
];

// CONTACT window: the intro card and the "what is this about" choices.
export const contact = {
  heading: "Let's work together",
  intro:
    "Have a project, an opportunity, or just want to say hi? Pick what fits, send me a message, and I'll get back to you.",
};

export const contactTopics = [
  { id: "message", label: "Message", color: "#f2559b" },
  { id: "connect", label: "Connect", color: "#93ecdf" },
  { id: "collaborate", label: "Collaborate", color: "#ffd166" },
] as const;

// EXPERTISE window: categories on the left, skill tiles on the right.
// icon is a file in /public/skills (.svg unless an extension is given); leave it out to show the name's first letters instead.
export type Skill = { name: string; icon?: string };
export type SkillGroup = { id: string; label: string; skills: Skill[] };

const s = (name: string, file?: string): Skill => ({ name, icon: file ? `/skills/${file.includes(".") ? file : `${file}.svg`}` : undefined });

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    skills: [s("HTML5", "html5"), s("CSS3", "css3"), s("JavaScript", "javascript"), s("React.js", "react"), s("Next.js", "nextjs"), s("Bootstrap", "bootstrap")],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [s("PHP", "php"), s("Laravel", "laravel"), s("Next.js", "nextjs"), s("Supabase", "supabase"), s("MySQL", "mysql"), s("PostgreSQL", "postgresql")],
  },
  {
    id: "languages",
    label: "Languages",
    skills: [s("Java", "java"), s("HTML", "html5"), s("PHP", "php"), s("PowerShell", "powershell"), s("Python", "python"), s("Swift", "swift")],
  },
  {
    id: "design",
    label: "Design & Editing",
    skills: [s("Figma", "figma"), s("Canva", "canva"), s("CapCut", "capcut.png")],
  },
  {
    id: "tools",
    label: "Tools & AI",
    skills: [s("Git", "git"), s("GitHub", "github"), s("VS Code", "vscode"), s("Vercel", "vercel"), s("Postman", "postman"), s("Roblox Studio", "robloxstudio.png"), s("ChatGPT", "chatgpt"), s("Claude", "claude.png")],
  },
];

// GUIDE.exe: a scripted chat that helps visitors find their way around.
// Each choice shows its answer and can open a window ("open" is a window id).
export const guide = {
  greeting: [
    "Hi! I'm Tamara's guide.",
    "This portfolio works like a little desktop. What would you like to see?",
  ],
  choices: [
    {
      ask: "What is this site?",
      answer:
        "It's my portfolio, styled like a retro desktop. Double-click the icons on the left, or use the buttons in the Introduction window.",
    },
    {
      ask: "Show me your projects",
      answer: "Here's my save file! Hover a file to peek at it, then click it to load the details.",
      open: "projects",
    },
    {
      ask: "What's your experience?",
      answer: "I've worked in business systems, freelance web development and sales data. Scroll the timeline to see it all.",
      open: "tweeter",
    },
    {
      ask: "What's your tech stack?",
      answer: "My main stack is PERN: PostgreSQL, Express, React and Node.js. Open the folders to see the rest.",
      open: "expertise",
    },
    {
      ask: "How do I contact you?",
      answer: "Send me a message here, or find me on GitHub and LinkedIn. I'd love to hear from you!",
      open: "contact",
    },
    {
      ask: "Is there a simpler view?",
      answer: "Yes! Click Normal View in the taskbar for a quick scroll version of everything.",
    },
  ],
} as const;
