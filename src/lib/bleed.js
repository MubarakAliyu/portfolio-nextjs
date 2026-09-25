// Accent bleed: while a project card is hovered, the page background tints
// towards that project's colour (desktop only; see body.bleed in globals.css).
export function setBleed(color) {
  if (!color || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.body.style.setProperty("--accent-project", color);
  document.body.classList.add("bleed");
}

export function clearBleed() {
  document.body.classList.remove("bleed");
}
