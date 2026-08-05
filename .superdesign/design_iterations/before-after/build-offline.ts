// Build a self-contained, synchronous-render offline version of the Before & After canvas
// so a plain CDP capture renders it deterministically (no network, no async transpile).
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
const DIR = import.meta.dir;
const SRC = `${DIR}/source`;
const VEN = `${SRC}/vendor`;
mkdirSync(VEN, { recursive: true });

async function dl(url: string, out: string) {
  if (existsSync(out)) return readFileSync(out, "utf8");
  const r = await fetch(url); if (!r.ok) throw new Error(`fetch ${url} -> ${r.status}`);
  const t = await r.text(); writeFileSync(out, t); return t;
}
await dl("https://unpkg.com/react@18.3.1/umd/react.production.min.js", `${VEN}/react.js`);
await dl("https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js", `${VEN}/react-dom.js`);
const babelSrc = await dl("https://unpkg.com/@babel/standalone@7.29.0/babel.min.js", `${VEN}/babel.js`);
(0, eval)(babelSrc);
// @ts-ignore
const Babel = (globalThis as any).Babel;
const transpile = (f: string) => Babel.transform(readFileSync(`${SRC}/${f}`, "utf8"), { presets: [["react", { runtime: "classic" }]] }).code;

const tokens = readFileSync(`${SRC}/tokens.js`, "utf8");
const reactJs = readFileSync(`${VEN}/react.js`, "utf8");
const reactDomJs = readFileSync(`${VEN}/react-dom.js`, "utf8");
// order mirrors the original HTML: design-canvas, habit-card, detail-screens, detail-fullscreen, main
const cDesign = transpile("design-canvas.jsx");
const cCard = transpile("habit-card.jsx");
const cScreens = transpile("detail-screens.jsx");
const cFull = transpile("detail-fullscreen.jsx");
const cMain = transpile("main.jsx");

// fonts (exact set used by this file — incl. Literata italic + DM Sans 800)
const FONT_URL = "https://fonts.googleapis.com/css2?family=Literata:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap";
let css = await (await fetch(FONT_URL, { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36" } })).text();
const uniq = [...new Set([...css.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)].map((m) => m[1]))];
for (const u of uniq) { const buf = Buffer.from(await (await fetch(u)).arrayBuffer()); css = css.split(u).join(`data:font/woff2;base64,${buf.toString("base64")}`); }
writeFileSync(`${SRC}/fonts-inline.css`, css);

// flat shim — ?flat=1 swaps the pan/zoom viewport for a normal-flow container so the whole canvas screenshots
const flatShim = `
(function(){ if (new URLSearchParams(location.search).get('flat')!=='1') return;
  var grid="url(\\"data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='rgba(0,0,0,0.06)' stroke-width='1'/%3E%3C/svg%3E\\")";
  window.DesignCanvas = function(props){
    return React.createElement('div',{style:{background:'#f0eee9',backgroundImage:grid,backgroundSize:'120px 120px',
      padding:'60px 0 80px',width:'max-content',minWidth:'100%',minHeight:'100vh',boxSizing:'border-box',
      fontFamily:'-apple-system,BlinkMacSystemFont,\\"Segoe UI\\",system-ui,sans-serif'}}, props.children);
  };
})();`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Habit Detail — Before & After (offline)</title>
<style>
${css}
html,body{margin:0;padding:0;background:#f0eee9;}
body{font-family:"DM Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased;}
#root{min-height:100vh;}
*::-webkit-scrollbar{width:0;height:0;}
</style></head>
<body>
<div id="root"></div>
<script>${reactJs}</script>
<script>${reactDomJs}</script>
<script>${tokens}</script>
<script>${cDesign}</script>
<script>${cCard}</script>
<script>${cScreens}</script>
<script>${cFull}</script>
<script>${flatShim}</script>
<script>${cMain}</script>
</body></html>`;
writeFileSync(`${DIR}/before-after.offline.html`, html);
console.log("OK before-after offline built; fonts inlined:", uniq.length, "bytes:", html.length);
