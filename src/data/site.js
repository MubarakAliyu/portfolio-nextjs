// Site-wide identity: name, role, contact details, intro copy and social links.

export const site = {
  name: "Aliyu Mubarak",
  firstName: "ALIYU",
  lastName: "MUBARAK",
  role: "Product Designer & Engineer",
  location: "Sokoto, Nigeria",
  timezone: "Africa/Lagos",
  clockLabel: "Sokoto",
  email: "aliyumubarak.ui@gmail.com",
  cv: "/cv/aliyu-mubarak-cv.pdf",
  url: "https://portfolio-nextjs-psi-liart.vercel.app",
  description:
    "Aliyu Mubarak is a product designer and software engineer in Sokoto, Nigeria, designing and building products people can actually use.",
  intro: {
    before: "A product designer and software engineer working at the intersection of ",
    highlight: "interfaces, brands, code and education",
    after: ". I don't just design screens. I design and build products people can actually use.",
  },
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aliyu-mubarak-a080b0196/" },
    { label: "Dribbble", href: "https://dribbble.com/BarackAli" },
    { label: "X", href: "https://x.com/aliyumubarak_ui" },
    { label: "Instagram", href: "https://www.instagram.com/aliyumubarak.ui/" },
    { label: "GitHub", href: "https://github.com/" }, // TODO: Mubarak to add his GitHub username
  ],
};

export const nav = [
  { label: "Work", href: "/projects", match: (path) => path === "/" || path.startsWith("/projects") },
  { label: "About", href: "/about", match: (path) => path.startsWith("/about") },
  { label: "Contact", href: "/contact", match: (path) => path.startsWith("/contact") },
];
