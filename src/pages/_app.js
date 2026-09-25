// _app.js: loads the fonts and global CSS, starts Lenis smooth scroll, and
// wraps every page in the persistent shell: preloader, header, custom cursor
// and animated page transitions.
import { useCallback, useEffect, useMemo, useState } from "react";
import localFont from "next/font/local";
import { MotionConfig } from "framer-motion";
import clsx from "clsx";
import "lenis/dist/lenis.css";
import "@/styles/globals.css";
import { IntroContext } from "@/lib/intro";
import { SoundProvider } from "@/lib/sound/SoundProvider";
import useLenis from "@/hooks/useLenis";
import { CursorProvider } from "@/components/cursor/CursorContext";
import { LightboxProvider } from "@/components/lightbox/LightboxProvider";
import Cursor from "@/components/cursor/Cursor";
import Header from "@/components/layout/Header";
import Preloader from "@/components/layout/Preloader";
import PageTransition from "@/components/layout/PageTransition";
import Toaster from "@/components/ui/Toaster";
import ScrollProgress from "@/components/layout/ScrollProgress";

const display = localFont({
  src: "../fonts/SkyBoxed-Display.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-display",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

const sans = localFont({
  src: [
    { path: "../fonts/HelveticaNeueLight.woff2", weight: "300", style: "normal" },
    { path: "../fonts/HelveticaNeueRoman.woff2", weight: "400", style: "normal" },
    { path: "../fonts/HelveticaNeueMedium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/HelveticaNeueBold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

export default function App({ Component, pageProps }) {
  useLenis();

  // Portals (lightbox, toasts) render into <body>, outside .app, so the font
  // variables go on <body> too.
  useEffect(() => {
    document.body.classList.add(display.variable, sans.variable);
  }, []);

  const [introDone, setIntroDone] = useState(false);
  const finish = useCallback(() => setIntroDone(true), []);
  const intro = useMemo(() => ({ done: introDone, finish }), [introDone, finish]);

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={intro}>
        <SoundProvider>
          <CursorProvider>
            <LightboxProvider>
              <div className={clsx("app", display.variable, sans.variable)}>
                <a href="#main" className="skip-link">
                  Skip to content
                </a>
                <Preloader />
                <ScrollProgress />
                <Header />
                <PageTransition>
                  <Component {...pageProps} />
                </PageTransition>
                <div className="grain" aria-hidden="true" />
                <Cursor />
                <Toaster />
              </div>
            </LightboxProvider>
          </CursorProvider>
        </SoundProvider>
      </IntroContext.Provider>
    </MotionConfig>
  );
}
