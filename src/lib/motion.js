// Shared motion language: one easing curve and the reusable framer-motion variants.

export const ease = [0.22, 1, 0.36, 1]; // expo-out, used everywhere

export const duration = { fast: 0.6, base: 0.9, slow: 1.2 };

// Default whileInView settings for scroll reveals.
export const viewport = { once: true, amount: 0.3 };

// Parent that staggers its children (words, lines, rows).
export const stagger = (each = 0.04, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren } },
});

// A word/line/letter sliding up out of an overflow:hidden mask.
export const maskUp = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: duration.base, ease } },
};

// Simple fade-up for paragraphs and blocks.
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease } },
};

// Divider that draws from the left (pair with transform-origin: left).
export const lineDraw = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: duration.slow, ease } },
};

// Image wipe used by project cards.
export const clipReveal = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease } },
};
