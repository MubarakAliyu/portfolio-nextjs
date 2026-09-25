// Reads and toggles the data-theme attribute on <html>. The inline script in
// _document.js sets it before paint, so this hook only mirrors and updates it.
import { useCallback, useSyncExternalStore } from "react";

const THEME_COLORS = { dark: "#0B0B0C", light: "#EFEBE3" };

function subscribe(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getTheme = () => document.documentElement.getAttribute("data-theme") || "dark";

export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark");

  const toggle = useCallback(() => {
    const next = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[next]);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked (private mode); the theme still switches.
    }
  }, []);

  return [theme, toggle];
}
