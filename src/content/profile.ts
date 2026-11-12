/* =====================================================================
   EDIT THIS FILE TO CHANGE THE WEBSITE TEXT
   ---------------------------------------------------------------------
   - Everything the visitor reads comes from here.
   - Text inside [BRACKETS] is a placeholder. Replace it with real info.
   - To hide an item, delete it from its list.
   - Images go in the /public/images folder. Use the same file name
     written here, or change the path to match your file.
   ===================================================================== */

export const profile = {
  name: "Miguelito Chester Pawig",
  shortName: "Miguelito",
  initials: "MCP",
  title: "Back-end Developer & Systems Analyst",
  tagline: "I build the logic behind systems, and I map them before I code them.",
  location: "South Caloocan City, Philippines",
  status: "Open to internships, OJT and junior roles",
  photo: "/images/profile.png",
  cv: "/curriculum-vitae.pdf", // put your Curriculum Vitae in /public/curriculum-vitae.pdf

  about: [
    "I'm an IT student at Global Reciprocal Colleges who enjoys the part of software most people never see: the back-end logic, the data, and how everything flows together.",
    "Before I write code, I like to draw it out. Flowcharts, system flows and diagrams help me catch problems early and explain ideas clearly to a team.",
    "I'm a full (100%) scholar of the Motortrade Life and Livelihood Assistance Foundation (MLALAF), and also a working student and freelance artist, so I know how to manage my time, deal with clients, and keep learning on my own.",
  ],

  // Short facts shown beside the About text
  quickFacts: [
    { label: "Course", value: "BS Information Technology" }, // [CHANGE if different]
    { label: "School", value: "Global Reciprocal Colleges" },
    { label: "Year", value: "4th Year" },
    { label: "Based in", value: "South Caloocan City, PH" },
  ],

  links: {
    email: "miguelitochesterpawig@gmail.com",
    github: "https://github.com/MiguelitoChesterPawig",
    linkedin: "https://www.linkedin.com/in/miguelito-chester-pawig-28aa7144a/",
    phone: "0991 150 3855", // shown as written; the call link uses +63
    instagram: "https://www.instagram.com/chstr_._/",
    facebook: "https://www.facebook.com/share/1KTVfASat8/", // leave empty to hide
  },
};

/* ---------------- SKILLS ----------------
   level: 1 = learning, 2 = basic, 3 = intermediate, 4 = strong */
export const skillGroups = [
  {
    name: "Back-end & Logic",
    icon: "process",
    skills: [
      { name: "PHP", level: 3 },
      { name: "MySQL", level: 3 },
      { name: "C#", level: 3 },
      { name: "Python", level: 2 },
      { name: "JavaScript", level: 2 },
    ],
  },
  {
    name: "Systems Analysis",
    icon: "decision",
    skills: [
      { name: "Flowcharts", level: 4 },
      { name: "System Flow / DFD", level: 3 },
      { name: "ERD & Database Design", level: 3 },
      { name: "Requirements Gathering", level: 3 },
    ],
  },
  {
    name: "Mobile & Front-end",
    icon: "io",
    skills: [
      { name: "Flutter", level: 2 },
      { name: "Dart", level: 2 },
      { name: "HTML & CSS", level: 3 },
    ],
  },
  {
    name: "IT Support",
    icon: "data",
    skills: [
      { name: "Hardware Cleaning", level: 2 },
      { name: "App & System Updates", level: 3 },
      { name: "OS Installation", level: 1 },
    ],
  },
  {
    name: "Tools & Soft Skills",
    icon: "terminal",
    skills: [
      { name: "Git & GitHub", level: 3 },
      { name: "Canva / Photoshop", level: 3 },
      { name: "Public Speaking", level: 3 },
      { name: "Team Leadership", level: 3 },
    ],
  },
];

/* ---------------- PROJECTS ----------------
   featured: true shows the big card at the top */
export const projects = [
  {
    featured: true,
    name: "TechWorld — ETPCP-AI",
    subtitle:
      "E-commerce (B2C) Technology Product Configuration Platform with AI-Based Recommendation System for TechWorld Computer Store",
    role: "Lead Programmer · Systems Analyst · Back-end Developer",
    period: "Jan 2026 – Present",
    problem:
      "TechWorld Computer Store sold hardware in person only. Customers had no easy way to browse products, check compatibility or get recommendations online.",
    solution:
      "A full e-commerce platform where customers configure and buy tech products, get AI-based recommendations, and pick up orders with a QR code. Staff and owners manage stock, orders and deliveries from their own dashboards.",
    features: [
      "AI-based product recommendations (machine learning)",
      "Product configuration and compatibility",
      "OTP email verification on sign-up",
      "QR code order pickup and verification",
      "4 user roles: Customer, Admin (Manager), Super Admin (Owner), Delivery Personnel",
      "Per-unit serial / IMEI tracking for returns",
    ],
    tech: ["PHP", "MySQL", "JavaScript", "HTML/CSS", "XAMPP", "[ML library / tool]"],
    results: [
      "Defended as a capstone in Oct 2026 — candidate for Best Capstone",
      "Evaluated by 37 respondents: 30 customers, 2 managers, 5 IT experts",
    ],
    // Real bugs you solved — recruiters love these
    challenges: [
      "As lead developer, designed the system flow, business logic, DFDs and other diagrams for the whole platform before coding began",
      "Planned the security layer: multi-factor authentication (MFA) and Google sign-in for safer logins",
      "Added account auto-lock to block unauthorized access",
      "Built product identity tracking (unique serial / IMEI per unit) to verify genuine items and secure returns",
    ],
    images: [
      "/images/projects/ETPCP-AI(Customer Landing Page).jpg",
      "/images/projects/ETPCP-AI(Admin Dashboard).jpg",
      "/images/projects/ETPCP-AI(SuperAdmin Dashboard).jpg",
    ],
    // Add your flowchart / ERD / DFD images here — they show your analyst side
    diagrams: [],
    links: { live: "", github: "" }, // add links when ready
  },
  {
    featured: false,
    name: "Student Concern Management System",
    subtitle: "Hackathon build (team CTRL+ALT+DEFEAT): students submit concerns, AI routes them to the right office.",
    role: "Team member — CTRL+ALT+DEFEAT",
    period: "2026",
    problem: "Student concerns (academic, financial, welfare) get lost between offices, and nobody can see how long they take to resolve.",
    solution:
      "A three-portal web system: students submit and track concerns with a tracking code, AI routes each one to the right department, staff screen and resolve it, and admins watch analytics and a full audit trail.",
    features: [
      "AI smart routing (Hugging Face zero-shot classification)",
      "Concern tracking by code",
      "Forward-only workflow: Routed → Read → Screened → Resolved",
      "SLA auto-escalation of overdue concerns",
      "Admin analytics with CSV / PDF export",
      "Full audit trail of every action",
      "Student, Staff and Admin portals",
    ],
    tech: ["PHP", "MySQL", "Tailwind CSS", "Hugging Face API", "TCPDF"],
    results: [],
    challenges: [],
    images: [
      "/images/projects/CTRL_ALT_DEFEAT(Admin Dashboard).jpg",
      "/images/projects/CTRL_ALT_DEFEAT(Analytics).jpg",
      "/images/projects/CTRL_ALT_DEFEAT(Audit Trail).jpg",
      "/images/projects/CTRL_ALT_DEFEAT(Track Concern).jpg",
      "/images/projects/CTRL_ALT_DEFEAT(Student Login).jpg",
      "/images/projects/CTRL_ALT_DEFEAT(Staff Admin Login).jpg",
    ],
    diagrams: [],
    links: { live: "", github: "https://github.com/rhuel01/CTRL_ALT_DEFEAT_HackathonApp" },
  },
  {
    featured: false,
    name: "Don't Blame The Kids — Apparel Shop App",
    subtitle: "A Flutter + Firebase mobile shop for a clothing brand, with an admin side and live chat.",
    role: "Developer",
    period: "2025",
    problem: "A small apparel brand needed a way to sell online, manage orders and answer customers without separate tools.",
    solution:
      "A cross-platform shopping app: customers browse products, pick sizes, add to cart or wishlist, check out with GCash or card and track their orders; the admin uploads products, updates order status and chats with customers in real time.",
    features: [
      "Firebase email sign-up / login",
      "Product details with size and quantity",
      "Cart and wishlist synced to the cloud",
      "Checkout with GCash or credit/debit card",
      "Order tracking: Pending → Processing → Shipped → Delivered",
      "Admin panel: upload products, manage all orders",
      "Real-time customer ↔ admin chat",
      "In-app notifications on order updates",
    ],
    tech: ["Flutter", "Dart", "Firebase Auth", "Cloud Firestore", "Provider"],
    results: [],
    challenges: [],
    mobile: true, // phone screenshots → shown in a phone-shaped frame
    images: [
      "/images/projects/DBTK(Home).jpg",
      "/images/projects/DBTK(Product Details).jpg",
      "/images/projects/DBTK(Side Menu).jpg",
      "/images/projects/DBTK(Cart).jpg",
      "/images/projects/DBTK(Admin Panel).jpg",
      "/images/projects/DBTK(Admin Manage Orders).jpg",
      "/images/projects/DBTK(Login).jpg",
    ],
    diagrams: [],
    links: { live: "", github: "https://github.com/MiguelitoGuerrero/BMCFinalProjectFinalProject" },
  },
  {
    featured: false,
    name: "This Portfolio",
    subtitle: "A flowchart-themed portfolio with an AI assistant that answers questions about me.",
    role: "Designer & Developer",
    period: "2026",
    problem: "Most student portfolios look the same and don't show how a person thinks.",
    solution:
      "A site built like a flowchart, with a built-in AI chat, a working contact form and personalized greetings for recruiters.",
    features: ["AI chat assistant", "Contact form with email alerts", "Personalized greeting links"],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Vercel"],
    results: [],
    challenges: [],
    images: ["/images/projects/placeholder.svg"],
    diagrams: [],
    links: { live: "", github: "" },
  },
];

/* ---------------- EXPERIENCE ---------------- */
export const experience = [
  {
    role: "Freelance Computer Shop Attendant",
    org: "M&M Secret Computer Shop",
    period: "Oct 2025 – Jul 2026",
    points: [
      "Troubleshot common hardware, software and application errors on my own",
      "Monitored system health and reported server issues and unusual behavior to the owner",
      "Cleaned and maintained system units to keep them running reliably",
      "Assisted customers and kept daily shop operations running smoothly",
    ],
  },
  {
    role: "Freelance Clown / Party Host",
    org: "PotPot Clowns, Zia's Clown & other agencies",
    period: "2015 – Present",
    points: [
      "Host and perform at children's parties and events",
      "Built confidence and public speaking skills",
      "Handle clients and adjust to their requests on the spot",
    ],
  },
  {
    role: "Freelance Body & Face Painter",
    org: "PotPot Clowns, Zia's Clown & other agencies",
    period: "2018 – Present",
    points: ["Face and body painting for birthdays and events", "Create designs based on client requests"],
  },
  {
    role: "Freelance Assistant",
    org: "Poor Boiz Auto Repair",
    period: "2020 – 2023",
    points: [
      "Assisted with bumper lifters, car painting and roof repairs",
      "Hands-on troubleshooting, repairs and maintenance",
      "Organized materials and helped with customer service",
    ],
  },
  // Add OJT / internship here when you have one:
  // { role: "[IT Intern]", org: "[Company]", period: "[2027]", points: ["[What you did]"] },
];

/* ---------------- EDUCATION ---------------- */
export const education = [
  { level: "College", school: "Global Reciprocal Colleges", detail: "BS Information Technology", period: "2023 – Present", honor: "100% Scholar · MLALAF" },
  { level: "Senior High School", school: "Arellano University (Jose Rizal Campus)", detail: "HUMSS", period: "2021 – 2023" },
  { level: "High School", school: "Ramon Magsaysay (Cubao) High School", detail: "", period: "2017 – 2021" },
];

/* ---------------- CERTIFICATES & SEMINARS ---------------- */
export const certificates = [
  {
    title: "Python Essentials 1",
    issuer: "Cisco Networking Academy and OpenEDG Python Institute",
    date: "Nov 2024",
    image: "/images/certificates/python-essentials-1.jpg",
    link: "",
  },
  {
    title: "Python Essentials 2",
    issuer: "Cisco Networking Academy and OpenEDG Python Institute",
    date: "Nov 2024",
    image: "/images/certificates/python-essentials-2.jpg",
    link: "",
  },
  {
    // seminar with no certificate: the photo is the event's official class picture
    title: "ASEAN Data Science Explorers Seminar",
    issuer: "Break The Fake Movement, at Global Reciprocal Colleges",
    date: "Jul 2026",
    image: "/images/certificates/asean-data-science-explorers.jpg",
    link: "",
  },
];

/* ---------------- AI CHAT ----------------
   Extra facts the AI assistant can use when visitors ask questions.
   Keep it honest — the AI will only answer from what's in this file. */
export const aiExtraNotes = [
  "Miguelito is interested in back-end development, systems analysis and IT support, but he is not limited to back-end. He is open to front-end, mobile, IT support and other roles, and loves exploring new things as he learns.",
  "He is willing to learn new tools and is currently learning OS installation.",
  "He is a full (100%) scholar of the Motortrade Life and Livelihood Assistance Foundation (MLALAF) in college.",
  "[Add anything else you want the AI to know, e.g. availability, preferred work setup]",
];

export const chatSuggestions = [
  "What did he build for TechWorld?",
  "What are his strongest skills?",
  "Is he open to internships?",
];
