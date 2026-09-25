// Tells components when the preloader has finished, so the hero can start its reveal.
import { createContext, useContext } from "react";

export const IntroContext = createContext({ done: true, finish: () => {} });

export const useIntro = () => useContext(IntroContext);

export const INTRO_KEY = "intro-seen";
