// LightboxProvider + useLightbox(): open the hanging lightbox from anywhere with
//   const openLightbox = useLightbox();
//   openLightbox({ items: [{ src, width, height, blurDataURL, alt, caption }], index });
// The Lightbox itself is only loaded (and mounted) while it's open.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCursorApi } from "@/components/cursor/CursorContext";

const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

const LightboxContext = createContext(() => {});

export function LightboxProvider({ children }) {
  const router = useRouter();
  const { resetCursor } = useCursorApi();
  const [state, setState] = useState(null);
  const opener = useRef(null);

  const openLightbox = useCallback(
    ({ items, index = 0 }) => {
      if (!items?.length) return;
      opener.current = document.activeElement;
      resetCursor();
      setState({ items, index, key: Date.now() });
    },
    [resetCursor]
  );

  const close = useCallback(() => {
    setState(null);
    resetCursor();
    opener.current?.focus?.({ preventScroll: true });
  }, [resetCursor]);

  useEffect(() => {
    const onRoute = () => setState(null);
    router.events.on("routeChangeStart", onRoute);
    return () => router.events.off("routeChangeStart", onRoute);
  }, [router.events]);

  return (
    <LightboxContext.Provider value={openLightbox}>
      {children}
      {state && <Lightbox key={state.key} items={state.items} startIndex={state.index} onClose={close} />}
    </LightboxContext.Provider>
  );
}

export const useLightbox = () => useContext(LightboxContext);
