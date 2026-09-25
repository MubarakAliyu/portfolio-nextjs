// Cursor state. Most elements set it declaratively with data attributes:
//   data-cursor="label" data-cursor-label="Open case study" -> red disc with text
//   data-cursor="big"                                       -> red disc, no text
//   data-cursor="link"                                      -> 40px translucent dot
// Components can also call useCursorApi().setCursor({ variant, label }).
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const CursorStateContext = createContext({ variant: "default", label: "", lastLabel: "" });
const CursorApiContext = createContext({ setCursor: () => {}, resetCursor: () => {} });

export function CursorProvider({ children }) {
  const [cursor, setState] = useState({ variant: "default", label: "", lastLabel: "" });

  const setCursor = useCallback(({ variant = "default", label = "" } = {}) => {
    setState((prev) =>
      prev.variant === variant && prev.label === label
        ? prev
        : { variant, label, lastLabel: label || prev.lastLabel }
    );
  }, []);

  const resetCursor = useCallback(() => setCursor(), [setCursor]);
  const api = useMemo(() => ({ setCursor, resetCursor }), [setCursor, resetCursor]);

  return (
    <CursorApiContext.Provider value={api}>
      <CursorStateContext.Provider value={cursor}>{children}</CursorStateContext.Provider>
    </CursorApiContext.Provider>
  );
}

export const useCursorState = () => useContext(CursorStateContext);
export const useCursorApi = () => useContext(CursorApiContext);
