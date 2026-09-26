// About page content: story, life chapters, stats, polaroids, inspirations,
// "Now" cards and the toolkit. Photos come from public/images/life/ for now.
// Everything marked TODO is a draft for Mubarak to replace with the real thing.
import { projects } from "./projects";

// TODO: Mubarak review
export const story = [
  "I'm Aliyu Mubarak, a product designer and software engineer from Sokoto, Nigeria. I design and build digital products end to end: the research, the flows, the identity, the interface, and the code that ships it.",
  "I run Starnova Labs, a tech studio making products, brands and digital experiences for startups and institutions, and I teach Software Engineering at Usmanu Danfodiyo University Sokoto, where I lecture Python programming and software construction. I'm finishing an M.Sc. in Computer Science, specialising in Software Engineering, at Woolf through GMC School of Technology.",
  "The work travels further than I do: clients in Nigeria, Uganda, the United Kingdom and the United States — marketplaces, property platforms, fashion labels and creator tools.",
  "Design and engineering aren't two jobs to me. They're one practice. The medium changes; the goal doesn't: products that feel simple, human and genuinely useful to the people who rely on them.",
];

const life = (n) => `/images/life/float${n}.jpg`;

// TODO: Mubarak to supply real years, photos and text for each chapter.
export const chapters = [
  {
    year: "2000s", // TODO: real year
    title: "Sokoto",
    text: "Where it started: curiosity, drawing, and taking things apart to see how they work.",
    photos: [life(9), life(12), life(14)],
  },
  {
    year: "2015", // TODO: real year
    title: "First pixels",
    text: "Discovering design: the first logos, the first interfaces, the first late nights.",
    photos: [life(11), life(5), "/images/life/float4a.png"],
  },
  {
    year: "2021",
    title: "B.Sc. Computer Science",
    text: "Graduated from Usmanu Danfodiyo University Sokoto, having learned to build what I design — and found out I loved both halves.",
    photos: [life(3), life(20), life(18)],
  },
  {
    year: "2022", // TODO: real year
    title: "Starnova Labs",
    text: "Founding a studio: products, brands and the teams that make them.",
    photos: [life(1), life(8), life(7)],
  },
  {
    year: "2025",
    title: "M.Sc., online",
    text: "Started a Master's in Computer Science, specialising in Software Engineering, with Woolf through GMC School of Technology.",
    photos: [life(21), life(22), life(13)],
  },
  {
    year: "Now",
    title: "Teaching",
    text: "Lecturing, bootcamps and Kids in Tech, where the next generation builds.",
    photos: [life(23), life(24), life(17)],
  },
];

export const stats = [
  { value: projects.length, label: "Projects featured" },
  { value: 2, label: "Courses taught (COS102, SWE306)" },
  { value: 1, label: "Studio founded" },
  { value: 5, suffix: "+", label: "Years designing" }, // TODO: confirm number
];

// Polaroids for the "Life lately" pile. TODO: Mubarak to swap in real photos + captions.
export const polaroids = [
  { src: life(4), caption: "Deep in the work" },
  { src: "/images/life/float5b.png", caption: "Say cheese" },
  { src: life(15), caption: "Notes before pixels" },
  { src: life(16), caption: "Currently reading" },
  { src: life(9), caption: "Golden hour" },
  { src: life(13), caption: "Night drive" },
  { src: "/images/life/float6c.png", caption: "Studio day" },
  { src: life(19), caption: "Chapter by chapter" },
  { src: life(12), caption: "Early start" },
  { src: life(8), caption: "Pair design" },
  { src: life(3), caption: "Quiet hours" },
  { src: life(17), caption: "Class is in" },
  { src: life(21), caption: "TODO: caption" }, // TODO: Mubarak to caption the four newest photos
  { src: life(22), caption: "TODO: caption" }, // TODO
  { src: life(23), caption: "TODO: caption" }, // TODO
  { src: life(24), caption: "TODO: caption" }, // TODO
];

// Quotes for the rotator above the inspirations. TODO: swap for Mubarak's favourites.
export const quotes = [
  { text: "Less, but better.", by: "Dieter Rams" },
  { text: "Design is not just what it looks like and feels like. Design is how it works.", by: "Steve Jobs" },
  { text: "Good design is obvious. Great design is transparent.", by: "Joe Sparano" },
];

// TODO: Mubarak to replace these with his real inspirations.
// The kinds of entries that fit: a designer or studio he admires, a book that
// changed how he works, a city or place, an idea such as "Less, but better".
// Shape: { name, category: "People" | "Books" | "Places" | "Ideas", note, image }.
export const inspirations = [
  { name: "My students", category: "People", note: "Every “why?” in class makes me explain things more simply.", image: life(17) },
  { name: "The Starnova Labs team", category: "People", note: "Building with people who care makes the work better.", image: life(8) },
  { name: "Books on craft & mindset", category: "Books", note: "The shelf I keep going back to between projects.", image: life(16) },
  { name: "Sokoto", category: "Places", note: "Home. It taught me to build with what's there.", image: life(12) },
  { name: "Less, but better", category: "Ideas", note: "Remove everything that doesn't help the person using it.", image: life(5) },
  { name: "Design is how it works", category: "Ideas", note: "If it only looks good, it isn't finished.", image: life(11) },
];

// TODO: Mubarak to update these every few months.
export const now = {
  updated: "Sep 2026",
  items: [
    { label: "Building", text: "Kids in Tech & client platforms at Starnova Labs" },
    { label: "Teaching", text: "COS102 & SWE306 at UDUS" },
    { label: "Studying", text: "M.Sc. Computer Science — Software Engineering (Woolf · GMC)" },
    { label: "Listening", text: "Design and business podcasts" }, // TODO
  ],
};

export const toolkit = [
  "Figma",
  "Framer",
  "Illustrator",
  "Photoshop",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Tailwind",
  "Git",
  "Vercel",
  "Notion",
];
