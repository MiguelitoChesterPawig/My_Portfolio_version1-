/* =====================================================================
   TECHWORLD (ETPCP-AI) CASE STUDY — text for /projects/techworld
   Every fact here comes from the team's approved capstone documentation
   (Global Reciprocal Colleges, November 2026). Keep it that way: recruiters
   or teammates may compare this page with the paper.
   ===================================================================== */

const img = (name: string) => `/images/projects/${name}`;

export const techworld = {
  kicker: "Case study · Capstone project · 2026",
  title: "TechWorld (ETPCP-AI)",
  fullTitle:
    "An E-Commerce (B2C) Technology Product Configuration Platform with AI-Based Recommendation System for TechWorld Computer Store",
  summary:
    "A web platform that replaced a computer store's spreadsheets, paper receipts and Messenger inquiries. Its AI Builder gives customers a complete, compatible PC build from what is actually in stock, in one step.",
  cover: img("ETPCP-AI(Customer Landing Page).jpg"),
  // full walkthrough of the running system, shown right under the hero
  video: "/ETPCP-AI_System_Video_Full_v7.mp4",

  meta: [
    { label: "My role", value: "Lead Developer, System Analyst, Back-end Developer" },
    { label: "Team", value: "5 student researchers" },
    { label: "Client", value: "TechWorld Computer Store, Caloocan City" },
    { label: "Method", value: "Rapid Application Development (RAD)" },
  ],

  stats: [
    { value: "64/64", label: "unit & integration tests passed" },
    { value: "100%", label: "user acceptance (350 of 350)" },
    { value: "4.49", label: "out of 5, ISO/IEC 25010 rating" },
    { value: "37", label: "people evaluated it, incl. 5 IT experts" },
  ],

  // Before → after. Each "fix" is a feature described further down the page.
  problem: {
    intro: "We interviewed the store's officer-in-charge and staff. Everything ran on manual tools.",
    points: [
      { icon: "fi-rr-box-open", title: "Stock didn't match", text: "Inventory lived in Excel or Google Sheets, so the sheet and the shelf often disagreed.", fix: "Live inventory with automatic stock deduction" },
      { icon: "fi-rr-receipt", title: "Paper receipts", text: "Sales were written on carbon-duplicate receipts, and reports were made by hand.", fix: "Every order recorded and moved along by QR scan" },
      { icon: "fi-rr-comment-alt", title: "One chat at a time", text: "Questions came through Messenger and walk-ins, so customers had to wait their turn.", fix: "The AI Builder answers every customer at once" },
      { icon: "fi-rr-shuffle", title: "Advice depended on who answered", text: "Two staff members could suggest two different builds for the same customer.", fix: "The same compatibility check on every build" },
      { icon: "fi-rr-chart-histogram", title: "No data to decide with", text: "No central record of orders or returns, of who changed what, or of what to reorder.", fix: "Audit trail, serial tracking and demand forecasting" },
    ],
  },

  role: {
    intro:
      "Lead Developer and one of the System Analysts. Most of my work was the part users never see: the server-side logic every portal depends on.",
    points: [
      { icon: "fi-rr-database", title: "Back-end architecture", text: "Server-side logic and processing flow for the Customer, Admin (Manager) and Super Admin (Owner) portals." },
      { icon: "fi-rr-diagram-project", title: "First system flow", text: "Mapped the first flowchart and process flow with Mr. Ravelo, before any formal diagram or code. Mr. Pelayo turned them into the final DFDs, ERD and activity diagram." },
      { icon: "fi-rr-list-check", title: "Feature review", text: "Checked every proposed feature, including my own, for need and feasibility before we built it." },
      { icon: "fi-rr-users-alt", title: "Team coordination", text: "Kept the shared task list, and rotated back-end work with Mr. Go and Mr. Cerda so every server-side part was checked by at least two people." },
    ],
  },

  team: [
    { name: "Raphael Luther L. Ravelo", role: "Team Leader, Front-end Developer, Technical Writer" },
    { name: "Miguelito Chester Pawig", role: "Lead Developer, System Analyst, Back-end Developer", me: true },
    { name: "Niño Angelo M. Go", role: "System Analyst, Back-end Developer, QA Tester" },
    { name: "Rhuel A. Cerda", role: "Database Designer, Back-end Developer, QA Tester" },
    { name: "Marc Adrian A. Pelayo", role: "Front-end Developer, Diagrams, Technical Writer" },
  ],

  // The AI Builder, step by step. shape = flowchart symbol shown on the step.
  builder: {
    intro:
      "The main feature. A customer answers three questions, and the system returns a full build they can add to the cart in one click.",
    steps: [
      { shape: "io", title: "Customer input", text: "Budget, intended use (gaming, office, school) and performance preference." },
      { shape: "process", title: "In-stock parts only", text: "Candidates come from the store's live inventory, so every suggestion can actually be bought." },
      { shape: "decision", title: "Asked before?", text: "Repeated requests are answered from a cache, so no new paid AI call is made." },
      { shape: "process", title: "Google Gemini builds it", text: "Gemini picks a complete set of parts. Every call is logged with its tokens and cost." },
      { shape: "decision", title: "Compatibility check", text: "CPU socket matches the motherboard, RAM type matches, the power supply is strong enough, and the total fits the budget." },
      { shape: "terminator", title: "Build shown", text: "With the estimated total. The customer can adjust and regenerate, save it, or add all parts to the cart." },
    ],
    fallback: "If Gemini is unavailable or its answer fails the check, a rule-based engine builds the PC instead, so the customer always gets an answer.",
  },

  highlights: [
    {
      icon: "process",
      title: "No two buyers for the last unit",
      text: "Stock is held for a customer while they check out, and the hold expires on its own. Two people can't buy the same last item at the same time.",
    },
    {
      icon: "decision",
      title: "No double orders",
      text: "A short per-customer order lock stops the same order from being submitted twice by a double-click or a slow connection.",
    },
    {
      icon: "data",
      title: "AI cost under control",
      text: "Cached answers for repeated requests, plus a usage log the owner can read: who asked, how many tokens, and what it cost.",
    },
    {
      icon: "terminal",
      title: "Account security",
      text: "OTP email verification, multi-factor authentication, Google sign-in, account auto-lock, and rate limits on login codes and support forms.",
    },
    {
      icon: "io",
      title: "QR order flow",
      text: "Orders move through each stage by QR scan. Pickup orders use a code valid for 60 minutes, and every delivery needs a proof photo.",
    },
    {
      icon: "data",
      title: "Every unit is traceable",
      text: "Per-unit serial / IMEI tracking for warranties and returns, automatic stock deduction, demand forecasting and a full audit trail.",
    },
  ],

  stack: ["PHP", "MySQL", "JavaScript", "HTML/CSS", "Google Gemini API", "Xendit (payments)", "OpenStreetMap", "XAMPP"],

  screens: [
    img("ETPCP-AI(Customer Landing Page).jpg"),
    img("ETPCP-AI(Admin Dashboard).jpg"),
    img("ETPCP-AI(SuperAdmin Dashboard).jpg"),
  ],

  diagrams: {
    credit:
      "Formal diagrams drawn by Marc Adrian A. Pelayo from the system flow that Mr. Ravelo and I first mapped out. From the team's approved documentation.",
    images: [
      img("ETPCP-AI(Context Diagram).webp"),
      img("ETPCP-AI(Use Case Diagram).webp"),
      img("ETPCP-AI(DFD Level 2 - AI Builder).webp"),
      img("ETPCP-AI(Activity Diagram - Old Manual Process).webp"),
      img("ETPCP-AI(ERD - AI Builder).webp"),
      img("ETPCP-AI(ERD - Race Condition Prevention).webp"),
    ],
  },

  fieldwork: {
    intro:
      "We built it with the store, not just for it: on-site visits and interviews with the staff, an online interview, and demos of the working system to the client.",
    images: [
      img("techworld/ETPCP-AI(Fieldwork - Team at TechWorld).webp"),
      img("techworld/ETPCP-AI(Fieldwork - Interview with staff).webp"),
      img("techworld/ETPCP-AI(Fieldwork - Online interview).webp"),
      img("techworld/ETPCP-AI(Fieldwork - System demo).webp"),
    ],
  },

  // Best Capstone nomination: public post by the college's CCS page, with our journey video
  recognition: {
    title: "Nominated for Best Capstone",
    text: "Our college's College of Computer Studies featured ETPCP-AI as a Best Capstone nominee. The post includes the video we made about our journey, from SysArch 1 and 2 through Capstone 1 and 2, working with TechWorld Computer Store in Caloocan.",
    source: "GRC College of Computer Studies (Facebook)",
    post: "https://www.facebook.com/grc.ccs/posts/pfbid0BHjCj3sCxQWub2csq3thzFMS7NJ3rZhh4TzvqwYGjq4FFbgaWJaUgkDpT7wLn5ggl",
    journey: ["SysArch 1", "SysArch 2", "Capstone 1", "Capstone 2", "Best Capstone nominee"],
  },

  // ISO/IEC 25010 evaluation, 37 respondents, 5-point scale
  scores: [
    { name: "Functional Suitability", value: 4.56 },
    { name: "Performance Efficiency", value: 4.5 },
    { name: "Security", value: 4.5 },
    { name: "Reliability", value: 4.49 },
    { name: "Compatibility", value: 4.48 },
    { name: "Usability", value: 4.4 },
  ],
  overall: 4.49,

  testing: [
    { label: "Customer portal", value: "20 tests" },
    { label: "Admin (Manager) portal", value: "18 tests" },
    { label: "Super Admin (Owner) portal", value: "8 tests" },
    { label: "Delivery Personnel portal", value: "6 tests" },
    { label: "Integration", value: "12 tests" },
  ],

  next: {
    intro:
      "Usability scored lowest (4.40). The three weakest answers point straight at what I would build next:",
    points: [
      { score: "4.24", item: "\"Easy to learn without training\"", fix: "A short first-time guide inside the system." },
      { score: "4.30", item: "\"Works well on computers and phones\"", fix: "A better mobile layout for every portal." },
      { score: "4.32", item: "\"Messages tell me what to do\"", fix: "Clearer error and instruction messages." },
    ],
    later: [
      "Train a real recommendation model on sales data (collaborative filtering), on top of the Gemini builder.",
      "Dedicated spec fields per product category, instead of reading specs from product names.",
      "A supplier module that turns reorder suggestions into purchase orders.",
    ],
  },
};
