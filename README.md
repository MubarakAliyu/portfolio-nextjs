# Next.js Portfolio Website

## Front End Development — React with Next.js Checkpoint

A responsive personal portfolio website built with **Next.js** to showcase my skills, projects, experience, and contact information.

This project was created as part of the **React with Next.js Checkpoint** and demonstrates Next.js fundamentals including component-based development, styling, image optimization, and file-based page routing.

---

## 🎯 Checkpoint Objective

The objective of this checkpoint is to build a portfolio website using Next.js that demonstrates:

- Next.js project setup
- Component-based development
- Styling components
- Displaying images
- Page-based routing
- Multiple portfolio pages
- Server-side rendering
- A structured and responsive user interface

---

## ✨ Features

- Responsive portfolio design
- Personal introduction and hero section
- About page
- Projects/portfolio page
- Contact page
- Reusable React components
- Next.js file-based routing
- CSS-based component styling
- Project and profile images
- Server-side rendering with Next.js
- Responsive navigation
- Clean and accessible user interface

---

## 📄 Pages

The portfolio contains multiple pages using Next.js file-based routing.

### Home

```text
/
```

The homepage introduces the portfolio and provides an overview of my work.

### About

```text
/about
```

Contains information about my background, skills, and experience.

### Projects

```text
/projects
```

Showcases selected projects and provides information about the work completed.

### Contact

```text
/contact
```

Provides contact information and a way for visitors to get in touch.

---

## 🗂️ Project Structure

```text
nextjs-portfolio/
│
├── components/
│   ├── Navbar.js
│   ├── Hero.js
│   ├── ProjectCard.js
│   └── Footer.js
│
├── pages/
│   ├── index.js
│   ├── about.js
│   ├── projects.js
│   ├── contact.js
│   └── _app.js
│
├── public/
│   └── images/
│
├── styles/
│   ├── globals.css
│   └── Home.module.css
│
├── package.json
├── package-lock.json
└── README.md
```

---

## 🧩 Components

The application uses reusable React components to keep the code organized and maintainable.

### Navbar

Provides navigation between the different pages of the portfolio.

### Hero

Displays the main introduction and call-to-action section on the homepage.

### ProjectCard

Reusable component used to display individual projects.

### Footer

Contains additional information and links at the bottom of the website.

---

## 🎨 Styling

The portfolio uses CSS to style the components and pages.

Global styles are defined in:

```text
styles/globals.css
```

Page-specific styles can be defined using CSS Modules.

For example:

```text
styles/Home.module.css
```

This keeps styles organized and helps prevent unnecessary styling conflicts.

---

## 🖼️ Images

Images are stored inside the Next.js `public` directory:

```text
public/
└── images/
```

They can be displayed using the Next.js Image component:

```jsx
import Image from "next/image";

<Image
  src="/images/profile.jpg"
  alt="Profile"
  width={400}
  height={400}
/>
```

Using Next.js's `Image` component provides image optimization and responsive image handling.

---

## 🛣️ Page-Based Routing

This project uses Next.js's built-in file-system-based routing.

Each file inside the `pages` directory automatically becomes a route.

For example:

```text
pages/index.js       → /
pages/about.js       → /about
pages/projects.js    → /projects
pages/contact.js     → /contact
```

No additional routing library such as React Router is required.

---

## 🖥️ Server-Side Rendering

The project demonstrates Next.js server-side rendering using Next.js data-fetching functionality.

For example:

```jsx
export async function getServerSideProps() {
  return {
    props: {},
  };
}
```

`getServerSideProps()` allows data to be fetched on the server before a page is rendered.

---

## ⚙️ Technologies Used

- Next.js
- React
- JavaScript
- CSS
- HTML
- Next.js Image Component
- Next.js Pages Router

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MubarakAliyu/nextjs-portfolio.git
```

### 2. Navigate into the project

```bash
cd nextjs-portfolio
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

---

## 🏗️ Production Build

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

The production build is generated in the:

```text
.next
```

directory.

---

## 📚 Learning Outcomes

Through this checkpoint, I practiced:

- Creating a Next.js application
- Understanding Next.js project structure
- Building reusable React components
- Using Next.js file-based routing
- Creating multiple pages
- Styling React components
- Displaying and optimizing images
- Understanding server-side rendering
- Creating production builds
- Preparing a Next.js project for deployment

---

## 👨‍💻 Author

**Aliyu Mubarak**

Product Designer & Frontend Developer

### Technologies

React • Next.js • TypeScript • JavaScript • UI/UX Design