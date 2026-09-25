// Project data for the Work section, /projects and the /projects/[slug] case studies.
// Each case-study section only renders when its field has content.
// Images come from public/images/projects/<slug>/ via media.generated.json
// (see PROJECT-MEDIA-GUIDE.md); `cover` below is only the fallback.
//
// Shape: slug, title, year, category, tags[] (shown on cards), filters[] (for /projects),
// status, client, summary, roles, description[], team[], timeline,
// links { live, prototype, github }, accent, palette[], typefaces[], stack[],
// challenge, process[{ title, text }], solution, outcome { text, metrics[{ value, label }] }.
// In challenge/solution, wrap key phrases in *asterisks* to colour them red.
import media from "./media.generated.json";
import life from "./life.generated.json";

export const FILTERS = ["All", "Product", "Brand", "Web", "EdTech", "Mobile", "Systems"];

export const STATUS = {
  live: "Live",
  "in-progress": "In progress",
  complete: "Complete",
  concept: "Concept",
  confidential: "On request",
};

const FALLBACK_COVER = "/images/life/float5.jpg";

const me = (role) => [{ name: "Aliyu Mubarak (me)", role }];

export const projects = [
  // TODO: Mubarak to confirm
  {
    slug: "hi-b-greenbox",
    title: "Hi B Greenbox",
    year: "2024",
    category: "Agri-tech",
    tags: ["Agri-tech", "Product Design", "E-commerce"],
    filters: ["Product", "Web"],
    status: "live",
    client: "Hafiz Integrated Farms Limited",
    summary: "A marketplace and farm-management platform connecting farmers, buyers, logistics and training.",
    roles:
      "Product Design | Brand Identity Design, Design Strategy, User Research, User Flows, Usability Testing, UI Design & Hi-Fidelity Mockups and Prototyping.",
    description: [
      'Hafiz Integrated Farms Limited, also known as "Hi B Greenbox," aims to create a virtual platform for trading farms, farm produce, services, logistics, and training. "Hi B Greenbox" is an e-commerce web app that allows users to browse services and farm products offered by farmers, facilitating buying and selling activities. Additionally, it includes an administrative role for managing, adding and deleting farm products.',
      '"Hi B Greenbox" serves as a farm management platform designed to help farmers optimize their operations and increase their yields. The platform addresses the challenge that many farmers face in effectively managing their farms due to difficulties in organizing essential information. This can result in inefficiencies, lower yields, and reduced profitability.',
    ],
    team: [
      { name: "Aliyu Mubarak (me)", role: "Product Designer" },
      { name: "Hafiz Ibrahim Bello", role: "Product Owner" },
      { name: "Abubakar Mukhtar", role: "Backend Developer" },
      { name: "Muhammad Sani Haruna", role: "Frontend Developer" },
    ],
    timeline: "Feb 2024 – Ongoing",
    links: { live: "https://hibgreenbox.com" },
    accent: "#6b8c2e", // matches the cover tile, which has transparent rounded corners
    palette: ["#6B8C2E", "#2D341F", "#E9F5E9", "#F9F7F1", "#FAFAFA"],
    typefaces: ["Figtree"],
    stack: ["Figma", "Illustrator", "Maze"], // TODO: confirm the research/testing tool
    challenge:
      "Farmers were losing time and money because *essential information was scattered*: produce, orders, buyers and logistics lived in notebooks and chats, which meant *inefficiency, lower yields and less profit*.",
    process: [
      { title: "Research", text: "Interviews and user stories with farmers, buyers and the product owner to map how produce, services and training change hands today." },
      { title: "Flows", text: "User flows for buying, selling and admin management, tested on paper before a single screen was drawn." },
      { title: "Identity", text: "A brand identity built around the Greenbox mark, so the platform feels trustworthy to farmers and buyers alike." },
      { title: "Interface & testing", text: "Hi-fi mockups and prototypes for the marketplace, wallet and dashboards, refined through usability testing." },
    ],
    solution:
      "An e-commerce web app where farmers *list produce and services*, buyers *browse and order in a few taps*, and admins *manage the catalogue*, with farm-management tools that keep the essentials in one place.",
    outcome: { text: "Live at hibgreenbox.com and still growing.", metrics: [] },
  },
  // TODO: Mubarak to confirm
  {
    slug: "kids-in-tech",
    title: "Kids in Tech",
    year: "2025", // TODO: confirm year
    category: "EdTech",
    tags: ["EdTech", "Brand", "Web"],
    filters: ["EdTech", "Brand", "Web"],
    // TODO: kidsintech.school is down (expired domain), so this is marked complete rather than live.
    // Flip back to "live" and restore links.live once the domain is renewed.
    status: "complete",
    client: "Starnova Labs",
    summary:
      "Starnova Labs' flagship coding bootcamp for children aged 8–18: brand, website and the KITOS learning platform.",
    roles: "Brand, Web Design & Development | Identity, Website, Learning Platform (KITOS)", // TODO: confirm roles
    description: [
      "Kids in Tech is Starnova Labs' coding bootcamp for children aged 8 to 18. The work covered the whole experience: the brand parents meet first, the website that explains the programme, and KITOS, the platform students learn on.",
      "The goal was to make learning to code feel like play for kids and like a safe, serious investment for their parents.",
    ],
    team: me("Designer & Developer"),
    timeline: "", // TODO: add timeline
    // TODO: kidsintech.school showed "Your domain is expired" on 19 Sep 2026 (HTTPS fails).
    // Add the live link (https://kidsintech.school) back once the domain is renewed, then run `npm run capture -- kids-in-tech`.
    links: {},
    accent: "#e0b43a",
    palette: ["#E0B43A", "#4E252F", "#F6F1E4"],
    typefaces: [], // TODO: add the brand typefaces
    stack: ["Figma", "Illustrator", "React", "Next.js"], // TODO: confirm the KITOS stack
    challenge:
      "Coding classes for children often feel like *school with extra homework*. Parents need to trust the programme, and kids need something *exciting enough to come back to*.",
    process: [
      { title: "Brand", text: "A bright, confident identity that speaks to kids without talking down to their parents." },
      { title: "Website", text: "A site that explains the tracks, ages and outcomes clearly and makes enrolling simple." },
      { title: "KITOS", text: "A learning platform where students follow lessons, submit projects and see their progress." },
    ],
    solution:
      "One connected experience: a brand that *earns parents' trust*, a website that *turns curiosity into enrolment*, and KITOS, where students *build real projects* week by week.",
    outcome: { text: "Launched at kidsintech.school, with bootcamp cohorts running in Sokoto.", metrics: [] }, // TODO: update once the domain is renewed
  },
  // TODO: Mubarak to confirm
  // TODO: confirm client is happy to be featured
  {
    slug: "cuzoo",
    title: "Cuzoo",
    year: "2025", // TODO: confirm year
    category: "Product",
    tags: ["Product", "Mobile", "Systems"],
    filters: ["Product", "Mobile", "Systems"],
    status: "live",
    client: "Cuzoo", // TODO: confirm how the client should be credited
    summary:
      "A Nigerian merchant OS and delivery platform across five surfaces: user app, vendor interface, rider app, fleet management and the public website.",
    roles: "Product Designer | Research, Flows, Design System, UI across five surfaces", // TODO: confirm roles
    description: [
      "Cuzoo is a merchant operating system and delivery platform built for how Nigerian businesses actually sell. It connects customers, vendors, riders and fleet managers in one system, live across 50+ Nigerian cities.",
      "The design challenge was consistency: five products for five very different users, all needing to feel like one brand.",
    ],
    team: me("Product Designer"),
    timeline: "",
    links: { live: "https://cuzooapp.com" },
    accent: "#7B5CF6",
    palette: ["#6E56CF", "#7B5CF6", "#17122A", "#F4EEFB"],
    typefaces: ["Syne", "Quicksand"],
    stack: ["Figma", "Design tokens", "Illustrator"],
    challenge:
      "Merchants juggle *orders on WhatsApp, stock in notebooks and deliveries by phone call*. Every new customer adds more chaos, not more profit.",
    process: [
      { title: "Map the surfaces", text: "Defined who uses each of the five surfaces, what they need in the moment, and where the handoffs happen." },
      { title: "One design system", text: "A shared component library so the user app, vendor tools and rider app speak the same language." },
      { title: "Flows per role", text: "Ordering, fulfilment, dispatch and fleet flows designed end to end, not screen by screen." },
      { title: "Prototype & test", text: "Clickable prototypes tested with merchants and riders before engineering." },
      { title: "Vendor discovery", text: "A six-screen discovery flow — search, filters, location and a no-results recovery screen that offers a way out instead of an apology — shipped with its own tokens and icon set." },
    ],
    solution:
      "One system across the *user app, vendor interface, rider app, fleet management and website*, built on a single design language so every handoff feels seamless.",
    outcome: { text: "Live at cuzooapp.com, with the apps in both stores.", metrics: [] },
  },
  // TODO: Mubarak to confirm
  {
    slug: "zariya",
    title: "Zariya",
    year: "2026", // TODO: confirm year
    category: "Product",
    tags: ["Product", "Web"],
    filters: ["Product", "Web"],
    status: "in-progress",
    client: "",
    summary: "A booking and discovery platform for Nigeria: find, compare and book places and services in one flow.",
    roles: "Product Designer & Frontend Engineer | UX, UI Design, Frontend", // TODO: confirm roles
    description: [
      "Zariya brings discovery and booking together for Nigerian venues and services. Instead of calling around or sliding into DMs, people can find a place, compare options and book in one flow.",
      "It's designed mobile-first for real network conditions, with clear prices and availability up front.",
    ],
    team: me("Product Designer & Engineer"),
    timeline: "",
    links: {},
    accent: "#0080F0",
    palette: ["#0080F0", "#0035A0", "#060A1F"],
    typefaces: ["Caudex", "Manrope"],
    stack: ["Next.js"],
    challenge:
      "Booking a venue or service in Nigeria usually means *calls, DMs and guesswork about price and availability*. Good places are hard to find and harder to book.",
    process: [
      { title: "Discovery", text: "Researched how people search for venues and services today, and where the process breaks down." },
      { title: "Compare", text: "Designed listing and comparison patterns that put price, location and availability first." },
      { title: "Book", text: "A single booking flow with clear steps, confirmations and reminders." },
    ],
    solution:
      "A platform where you can *find, compare and book in one flow*, with honest prices and availability shown before you commit.",
    outcome: { text: "In progress.", metrics: [] },
    // TODO: replace the placeholder cover with real work images in public/images/projects/zariya/
  },
  // TODO: Mubarak to confirm
  {
    slug: "hausalearn",
    title: "HausaLearn",
    year: "2026", // TODO: confirm year
    category: "EdTech",
    tags: ["EdTech", "Brand", "Web"],
    filters: ["EdTech", "Brand", "Web"],
    status: "in-progress",
    client: "",
    summary: "Digital skills training in the Hausa language, with a bilingual EN/HA website and a redesigned identity.",
    roles: "Designer & Developer | Identity Redesign, Bilingual Website", // TODO: confirm roles
    description: [
      "HausaLearn teaches digital skills in Hausa, so learners can grow in the language they think in. The project covered a refreshed identity and a website that works equally well in English and Hausa.",
      "A single toggle switches the whole site between languages without losing your place.",
    ],
    team: me("Designer & Developer"),
    timeline: "",
    links: {},
    accent: "#35A07E",
    palette: ["#35A07E", "#14304A", "#35608C", "#F6F8FA"],
    typefaces: ["Montserrat"],
    stack: ["Next.js"],
    challenge:
      "Most digital skills training is *only in English*, which quietly shuts out millions of capable Hausa speakers.",
    process: [
      { title: "Identity", text: "Redesigned the identity to feel modern and credible while staying rooted in Hausa culture." },
      { title: "Bilingual system", text: "Designed layouts that hold up in both English and Hausa, where text lengths differ." },
      { title: "Website", text: "Built the EN/HA website with a language toggle that keeps you on the same page." },
    ],
    solution:
      "A *bilingual EN/HA website* and a refreshed brand that make digital skills training feel *made for Hausa speakers*, not translated for them.",
    outcome: { text: "In progress.", metrics: [] },
    // TODO: replace the placeholder cover with real work images in public/images/projects/hausalearn/
  },
  // TODO: Mubarak to confirm
  {
    slug: "edustack",
    title: "EduStack",
    year: "2026", // TODO: confirm year
    category: "Product",
    tags: ["Product", "Systems", "Web"],
    filters: ["Product", "Systems", "Web"],
    status: "live",
    client: "Starnova Labs",
    summary: "A school management system covering admissions, classes, results and administration, built in Next.js.",
    roles: "Product Designer & Engineer | Systems Design, UI, Frontend", // TODO: confirm roles
    description: [
      "EduStack brings a Nigerian school's day-to-day into one system: admissions, students, attendance, results, fees, timetables, report cards and the parent portal — twelve modules on shared data.",
      "It's designed for the staff who use it every day, so the most common tasks take the fewest steps: mark once and track forever, upload once and let the results compile themselves.",
    ],
    team: me("Product Designer & Engineer"),
    timeline: "",
    links: { live: "https://edustack-rho.vercel.app" },
    accent: "#B8A678",
    palette: ["#2D3A1F", "#B8A678", "#F4F1E8", "#1A2212"],
    typefaces: ["Fraunces", "Sora"],
    stack: ["Next.js"],
    challenge:
      "Schools run on *spreadsheets, paper forms and end-of-term panic*. Results are slow, records get lost, and admin work crowds out teaching.",
    process: [
      { title: "Map the school year", text: "Followed a term from admission to results to find where time and data get lost." },
      { title: "Modules", text: "Designed admissions, classes, results and admin as connected modules on shared data." },
      { title: "Build", text: "Built the system in Next.js with role-based views for admins, teachers and staff." },
      { title: "The promotion engine", text: "Automated end-of-year promotion: the system recommends, the admin decides — the step that used to eat a whole week." },
    ],
    solution:
      "One system where *records live in one place*, results are *ready on time*, and every role sees exactly what it needs.",
    outcome: { text: "Live, with a marketing site, docs and help centre alongside the platform.", metrics: [] },
  },
  // TODO: Mubarak to confirm
  // TODO: confirm the client is happy with the public case study (this was NDA-only until Sep 2026)
  {
    slug: "nexora",
    title: "Nexora",
    year: "2026", // TODO: confirm year
    category: "Product",
    tags: ["Product", "Systems", "Web"],
    filters: ["Product", "Systems", "Web"],
    status: "live",
    client: "Nexora Property Management, Kampala",
    summary:
      "A property management platform for a Kampala company: the public site plus role-based dashboards and thirteen admin modules. Lead design + frontend.",
    roles: "Lead Designer & Frontend Engineer | Design System, UI, Frontend",
    description: [
      "Nexora manages rentals, condominiums and facilities in Kampala for owners who often live on another continent. The platform pairs a public site that has to earn an investor's trust with the software the team runs the business on.",
      "I led the design and built the frontend: the marketing site, the services and portfolio sections, and behind the login, three role-based dashboards and thirteen admin modules. The dashboards stay private, so the case study shows the public platform.",
    ],
    team: me("Lead Designer & Frontend Engineer"),
    timeline: "",
    links: { live: "https://nexora-web-seven.vercel.app" },
    accent: "#E08A20",
    palette: ["#E08A20", "#232220", "#F5F5F5", "#565655"],
    typefaces: ["Cinzel", "Montserrat"],
    stack: ["Next.js"],
    challenge:
      "Half of Nexora's owners are *thousands of miles from the building they own*. Trust has to be built by the interface: *reporting they can check at 2am*, in a market where paper receipts are still normal.",
    process: [
      { title: "Two audiences", text: "Separated what a resident needs from what a diaspora investor needs, and gave each its own path through the site." },
      { title: "Design system", text: "Cinzel and Montserrat over a charcoal-and-amber palette, built as components so thirteen admin modules stay consistent." },
      { title: "Dashboards", text: "Designed role-based dashboards for owners, residents and staff around the daily jobs: occupancy, maintenance, statements." },
      { title: "Build", text: "Built the frontend in Next.js, from the public pages to the dashboard screens." },
    ],
    solution:
      "A public platform that reads as *international standards, locally run*, and dashboards where *every property, payment and repair has one record* the whole team works from.",
    outcome: { text: "Live, managing residential, commercial and condominium properties across Kampala.", metrics: [] },
  },
  // TODO: Mubarak to confirm
  // TODO: confirm client is happy to be featured
  {
    slug: "iwan-buy",
    title: "I Wan Buy Gadgets",
    year: "2026", // TODO: confirm year
    category: "Brand",
    tags: ["Brand", "Systems"],
    filters: ["Brand", "Systems"],
    status: "in-progress",
    client: "I Wan Buy Gadgets",
    summary:
      "A brand identity and inventory management system for a phones and gadgets retailer, tracking every device by IMEI from stock to sale.",
    roles: "Brand Designer & Engineer | Identity, Systems Design, Full-stack", // TODO: confirm roles
    description: [
      "I Wan Buy Gadgets sells phones and gadgets, where every device is valuable and every sale needs a paper trail. The project covered a new brand identity and an inventory system built around the IMEI.",
      "Every phone is tracked from the moment it arrives to the moment it's sold.",
    ],
    team: me("Designer & Engineer"),
    timeline: "",
    links: {},
    accent: "#156FBF",
    palette: ["#156FBF", "#1E2A35", "#88939E", "#FFFFFF"],
    typefaces: ["Montserrat"],
    stack: ["Next.js", "Prisma"],
    challenge:
      "When stock lives in notebooks, *a missing phone is a missing month of profit*. The shop needed to know where every device was, at every moment.",
    process: [
      { title: "Identity", text: "A clear, trustworthy brand for a shop that sells high-value devices." },
      { title: "IMEI-first data", text: "Designed the system around the IMEI, so each device has one record from stock to sale." },
      { title: "Build", text: "Built the dashboard, stock, sales and reporting screens with role-based access." },
    ],
    solution:
      "A brand customers trust and a system that *tracks every device by IMEI*, from delivery to sale, with *nothing left to guesswork*.",
    outcome: { text: "In progress.", metrics: [] },
    // TODO: replace the placeholder cover with real work images in public/images/projects/iwan-buy/
  },
  // TODO: Mubarak to confirm
  // TODO: confirm client is happy to be featured
  {
    slug: "savera",
    title: "Savéra",
    year: "2026",
    category: "Brand",
    tags: ["Brand"],
    filters: ["Brand"],
    status: "complete",
    client: "Savéra",
    summary:
      'The brand identity for a Nigerian modest fashion label: a signet "S" emblem, a 19-page guide and a 122-file asset pack.',
    roles: "Brand Designer | Strategy, Identity, Guidelines",
    description: [
      'Savéra is a Nigerian modest fashion label. The identity centres on a signet "S" emblem, supported by a 19-page brand guide and a 122-file asset pack: logo suite, cards, merch illustrations, twelve icons and ten ready-to-post social designs.',
      "The aim was quiet luxury: elegant, warm and confident without being loud.",
    ],
    team: me("Brand Designer"),
    timeline: "",
    links: {},
    accent: "#CBA9A2",
    palette: ["#6E3B3B", "#3E211F", "#B6A184", "#CBA9A2", "#E7D9BF", "#F7F1E7"],
    typefaces: ["Cormorant Garamond", "Jost"],
    stack: ["Illustrator", "Figma", "InDesign"],
    challenge:
      "Modest fashion is often branded as *either traditional or trendy*. Savéra wanted to feel *timeless, elegant and modern* at once.",
    process: [
      { title: "Strategy", text: "Defined the brand's voice and positioning: quiet luxury for modest fashion." },
      { title: "The signet", text: 'Drew the signet "S" emblem, built to work stitched on a label as well as on screen.' },
      { title: "System", text: "A 19-page guide and a 122-file asset pack so the brand stays consistent everywhere." },
    ],
    solution:
      'A complete identity: the *signet "S"*, a warm palette of wine, sand and rose, and *a guide the team can actually use*.',
    outcome: { text: "Delivered: brand guide and full asset pack.", metrics: [] },
  },
  // TODO: Mubarak to confirm
  // TODO: confirm client is happy to be featured
  {
    slug: "inner-mirror",
    title: "Inner Mirror",
    year: "2026",
    category: "Brand",
    tags: ["Brand"],
    filters: ["Brand"],
    status: "complete",
    client: "Inner Mirror",
    summary: 'A three-part identity system (LLC, Coaching, Circle) built around a typographic "im" mark.',
    roles: "Brand Designer | Identity System",
    description: [
      'Inner Mirror needed one identity that could stretch across three offers: the LLC, Coaching and Circle. The system is built around a typographic "im" mark with a gold point held inside the "i" — the answer within.',
      "Each sub-brand has its own voice: neutral charcoal and ivory for the LLC and coaching practice, warm plum, mauve and gold for the women's Circle. Ivory and gold are the constants that hold the family together.",
    ],
    team: me("Brand Designer"),
    timeline: "",
    links: {},
    accent: "#C9A84C",
    palette: ["#6D3B47", "#C4847A", "#C9A84C", "#262322", "#8A7C6E", "#F5EFE6"],
    typefaces: ["Fraunces", "Jost", "Pinyon Script"],
    stack: ["Illustrator", "Figma", "InDesign"],
    challenge:
      "Three offers under one name risked feeling like *three different companies*. The brand needed *one family with three voices*.",
    process: [
      { title: "Architecture", text: "Mapped the LLC, Coaching and Circle and how they relate to each other." },
      { title: 'The "im" mark', text: "A typographic mark that works on its own and as the root of each sub-brand." },
      { title: "System", text: "Colour, type and layout rules that let each offer feel distinct but connected — plus illustrations, fourteen icons and eighteen social posts." },
    ],
    solution: 'A three-part identity system held together by *a single typographic "im" mark*, with *gold as a constant, never a fill*.',
    outcome: { text: "Delivered: three brand guides, a revised logo suite and a full asset pack.", metrics: [] },
  },
  // TODO: Mubarak to confirm
  // TODO: confirm client is happy to be featured
  {
    slug: "ekobuja",
    title: "EkoBuja",
    year: "2024",
    category: "Fintech",
    tags: ["Brand", "Product", "Mobile"],
    filters: ["Brand", "Product", "Mobile", "Web"],
    status: "live",
    client: "EkoBuja Real Estate Investments",
    summary:
      "Brand identity and product design for a fractional real-estate platform: own a share of Nigerian property from ₦10,000.",
    roles: "Brand & Product Designer | Naming Story, Identity, Brand Guidelines, App & Web UI",
    description: [
      "EkoBuja is a digital real-estate investment platform that lets Nigerians buy into high-income properties through fractional ownership, opening up investments that used to be reserved for institutions and the wealthy.",
      'The name joins "Eko", the nickname for Lagos, and "Buja", short for Abuja, so the brand reads as national from the first syllable. The mark folds the roofline of the National Theatre in Lagos into the letter E: a landmark everyone recognises, turned into a sign of solid foundations.',
    ],
    team: me("Brand & Product Designer"),
    timeline: "Nov 2024 – 2026", // TODO: confirm the dates
    links: { live: "https://www.ekobuja.com" },
    accent: "#C2DF93",
    palette: ["#1D3638", "#C2DF93", "#F8F7F5"],
    typefaces: ["Raleway"],
    stack: ["Figma", "Illustrator"],
    challenge:
      "Property is how Nigerians save, but a whole unit costs *more than most people will ever have at once*. A platform selling shares of a building has to feel *like a bank, not a punt*.",
    process: [
      { title: "Positioning", text: "Wrote the brand strategy: accessible, trustworthy, growth-minded — a platform for first-time investors, not speculators." },
      { title: "The name", text: 'Built the story around "Eko" and "Buja" so the name carries national reach before a word of copy is read.' },
      { title: "The mark", text: "Sketched the National Theatre's architecture down to three stacked blocks, then cut the letter E into them from a perspective view." },
      { title: "The system", text: "Deep teal and lime with Raleway, written up as brand guidelines with stationery, social templates and app icons." },
      { title: "Product", text: "Designed the app and store screens: browse listings, buy shares, track earnings, fund the wallet and cash out." },
    ],
    solution:
      "A brand that reads as *solid and national*, a mark built from *a landmark everyone knows*, and product screens that make buying a share *as ordinary as topping up a wallet*.",
    outcome: { text: "Identity, guidelines and asset pack delivered; the platform is live at ekobuja.com.", metrics: [] },
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug) || null;

const describeLocal = (src) => life[src] ?? { src, width: 1600, height: 2000 };

// Merges the drop-in folder media over the data. Cover preference:
// folder cover -> the `cover` field -> the first life-photo fallback.
export function getProjectMedia(slug) {
  const project = getProject(slug);
  const found = media[slug] ?? {};
  return {
    cover: found.cover ?? describeLocal(project?.cover ?? FALLBACK_COVER),
    gallery: found.gallery ?? [],
    screens: found.screens ?? {},
  };
}

// A project plus its media, ready to pass as props.
export const withMedia = (project) => ({ ...project, media: getProjectMedia(project.slug) });

export const allProjectsWithMedia = () => projects.map(withMedia);
