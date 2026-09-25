// Turns "Plain *red phrase* plain" into SplitWords/ScrollWords segments,
// giving the *starred* parts the accent colour.
export function accentSegments(text = "") {
  return text
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((part) => (part.startsWith("*") && part.endsWith("*") ? { text: part.slice(1, -1), className: "accent" } : { text: part }));
}

// Same text without the asterisks (for meta descriptions, alt text…).
export const plainText = (text = "") => text.replace(/\*/g, "");
