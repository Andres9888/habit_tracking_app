// motion.ts — prove the Forge build animates: load idle (no freeze), click the button via CDP,
// capture a mid-transition frame (~260ms in: confetti aloft, button filling, numeral ticking).
import { spawn } from "child_process";
import { writeFileSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
const CFT = "/Users/andres/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const [, , url, out, delayS] = process.argv;
const delay = Number(delayS || 260);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), "cft-"));
const port = 9400 + (out.length % 90);
const chrome = spawn(CFT, ["--headless=old","--disable-gpu","--no-sandbox","--hide-scrollbars","--no-first-run",
  "--no-default-browser-check","--disable-extensions","--disable-sync","--disable-background-networking",
  "--disable-component-update","--mute-audio",`--user-data-dir=${profile}`,`--remote-debugging-port=${port}`,"about:blank"],{stdio:"ignore"});
let id=0;
function rpc(ws:WebSocket,method:string,params:any={}):Promise<any>{const i=++id;return new Promise((res,rej)=>{const h=(e:MessageEvent)=>{const m=JSON.parse(e.data as string);if(m.id===i){ws.removeEventListener("message",h);m.error?rej(new Error(m.error.message)):res(m.result);}};ws.addEventListener("message",h);ws.send(JSON.stringify({id:i,method,params}));});}
try{
  let v:any;for(let i=0;i<80;i++){try{v=await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();if(v.webSocketDebuggerUrl)break;}catch{}await sleep(150);}
  let pageWs="";for(let i=0;i<40;i++){const l=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();const pg=l.find((t:any)=>t.type==="page");if(pg?.webSocketDebuggerUrl){pageWs=pg.webSocketDebuggerUrl;break;}await sleep(150);}
  const ws=new WebSocket(pageWs);await new Promise<void>((r,j)=>{ws.onopen=()=>r();ws.onerror=()=>j(new Error("ws"));});
  await rpc(ws,"Page.enable");await rpc(ws,"Emulation.setDeviceMetricsOverride",{width:460,height:860,deviceScaleFactor:2,mobile:false});
  const loaded=new Promise<void>((res)=>{const h=(e:MessageEvent)=>{const m=JSON.parse(e.data as string);if(m.method==="Page.loadEventFired"){ws.removeEventListener("message",h);res();}};ws.addEventListener("message",h);});
  await rpc(ws,"Page.navigate",{url});await Promise.race([loaded,sleep(8000)]);
  try{await rpc(ws,"Runtime.evaluate",{expression:"document.fonts&&document.fonts.ready",awaitPromise:true});}catch{}
  await sleep(400);
  await rpc(ws,"Runtime.evaluate",{expression:"document.getElementById('btn').click()"});
  await sleep(delay);
  const shot=await rpc(ws,"Page.captureScreenshot",{format:"png"});
  writeFileSync(out,Buffer.from(shot.data,"base64"));console.log("OK",out);
}catch(e){console.log("FAIL",out,(e as Error).message);process.exitCode=1;}
finally{try{chrome.kill("SIGKILL");}catch{}try{rmSync(profile,{recursive:true,force:true});}catch{}}
