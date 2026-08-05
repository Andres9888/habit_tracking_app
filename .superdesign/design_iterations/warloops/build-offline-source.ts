// Build a fully self-contained, synchronous-render version of the source screen so a
// plain headless --screenshot (no virtual-time, no network wait) captures it faithfully.
// - React/ReactDOM/Babel UMD downloaded locally (blocking scripts)
// - JSX pre-transpiled to JS via Babel (classic runtime, global React)
// - Google fonts fetched + woff2 inlined as base64 @font-face (no network at render)
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";

const DIR = import.meta.dir;
const SRC = `${DIR}/source`;
const VEN = `${SRC}/vendor`;
mkdirSync(VEN, { recursive: true });

async function dl(url: string, out: string) {
  if (existsSync(out)) return readFileSync(out, "utf8");
  const r = await fetch(url);
  if (!r.ok) throw new Error(`fetch ${url} -> ${r.status}`);
  const t = await r.text();
  writeFileSync(out, t);
  return t;
}

// 1. vendor JS
await dl("https://unpkg.com/react@18.3.1/umd/react.production.min.js", `${VEN}/react.js`);
await dl("https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js", `${VEN}/react-dom.js`);
const babelSrc = await dl("https://unpkg.com/@babel/standalone@7.29.0/babel.min.js", `${VEN}/babel.js`);

// 2. transpile jsx -> js using the babel standalone we just downloaded
//    (eval into a sandboxed global; Babel attaches to globalThis.Babel)
// deno-lint-ignore no-explicit-any
(0, eval)(babelSrc);
// @ts-ignore
const Babel = (globalThis as any).Babel;
function transpile(file: string) {
  const code = readFileSync(`${SRC}/${file}`, "utf8");
  const out = Babel.transform(code, { presets: [["react", { runtime: "classic" }]] }).code;
  writeFileSync(`${SRC}/${file.replace(/\.jsx$/, ".compiled.js")}`, out);
  return out;
}
const jsxFiles = ["habit-card.jsx", "detail-deps.jsx", "habit-detail-live.jsx"];
const compiled = jsxFiles.map(transpile);
const tokens = readFileSync(`${SRC}/tokens.js`, "utf8");
const reactJs = readFileSync(`${VEN}/react.js`, "utf8");
const reactDomJs = readFileSync(`${VEN}/react-dom.js`, "utf8");

// 3. fonts -> inline woff2 as base64
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Literata:ital,wght@0,400;0,500;0,600;0,700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap";
let css = await (await fetch(FONT_URL, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
  },
})).text();
const urls = [...css.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)].map((m) => m[1]);
const uniq = [...new Set(urls)];
for (const u of uniq) {
  const buf = Buffer.from(await (await fetch(u)).arrayBuffer());
  css = css.split(u).join(`data:font/woff2;base64,${buf.toString("base64")}`);
}
writeFileSync(`${SRC}/fonts-inline.css`, css);

// 4. assemble self-contained offline html (render synchronous, no network)
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Source · Habit Detail (offline)</title>
<style>
${css}
html,body{margin:0;padding:0;background:#e9e5df;}
body{font-family:"DM Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased;}
.frame-wrap{position:relative;width:460px;height:860px;}
.frame-wrap>.phone-slot{position:absolute;left:35px;top:40px;}
body.stg{display:flex;align-items:center;justify-content:center;min-height:100vh;width:100vw;overflow:hidden;}
body.stg .frame-wrap{position:static;flex:0 0 auto;}
*::-webkit-scrollbar{width:0;height:0;}
@keyframes hd-pulse{0%{box-shadow:0 0 0 0 rgba(5,150,105,0.34);}70%{box-shadow:0 0 0 13px rgba(5,150,105,0);}100%{box-shadow:0 0 0 0 rgba(5,150,105,0);}}
@keyframes hd-confetti{to{transform:translate(var(--tx),var(--ty)) rotate(var(--rot));opacity:0;}}
@keyframes hd-pop{0%{transform:scale(0.4);}60%{transform:scale(1.28);}100%{transform:scale(1);}}
@keyframes hd-tick{0%{transform:translateY(0);}38%{transform:translateY(-7px);opacity:.45;}100%{transform:translateY(0);opacity:1;}}
@keyframes hd-arrow{0%,100%{transform:translateY(0);}50%{transform:translateY(4px);}}
/* frozen capture: kill every animation so first paint is the settled state */
html.freeze *,html.freeze *::before,html.freeze *::after{animation:none !important;}
</style></head>
<body>
<div class="frame-wrap"><div class="phone-slot"><div id="root"></div></div></div>
<script>
(function(){var q=new URLSearchParams(location.search);var st=q.get('state')||'idle';
try{localStorage.setItem('hd_done',JSON.stringify(st==='done'));}catch(e){}
if(q.get('freeze')!=='0')document.documentElement.classList.add('freeze');
if(q.get('stage')==='1')document.body.classList.add('stg');})();
</script>
<script>${reactJs}</script>
<script>${reactDomJs}</script>
<script>${tokens}</script>
<script>${compiled[0]}</script>
<script>${compiled[1]}</script>
<script>${compiled[2]}</script>
<script>
(function(){
  function App(){return React.createElement(Phone,{width:390,height:780},
    React.createElement(HabitDetailLive,{feel:'celebrate',affordance:'arrow',undoHint:true}));}
  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
})();
</script>
</body></html>`;
writeFileSync(`${SRC}/source-screen.offline.html`, html);
console.log("OK offline source built; fonts inlined:", uniq.length, "html bytes:", html.length);
