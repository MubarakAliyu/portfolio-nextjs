// _document.js: the HTML shell. The inline script runs before first paint to
// apply the saved theme (no flash) and to skip the preloader if it already
// played this session or the visitor prefers reduced motion.
import { Html, Head, Main, NextScript } from "next/document";

const bootScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){d.setAttribute('data-theme',t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='light'?'#EFEBE3':'#0B0B0C');}}catch(e){}try{if(sessionStorage.getItem('intro-seen')==='1'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('preloaded');}catch(e){}})();`;

export default function Document() {
  return (
    <Html lang="en" data-theme="dark">
      <Head>
        <meta name="theme-color" content="#0B0B0C" />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
