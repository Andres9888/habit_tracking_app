// shot.ts — deterministic headless capture over Chrome DevTools Protocol (bun).
// Usage: bun shot.ts <url> <out.png> <width> <height> [scale] [settleMs]
// Launches Chrome-for-Testing with a debug port, navigates, waits for load + settle,
// captures via Page.captureScreenshot, writes PNG, then kills Chrome. Exits cleanly.
import { spawn } from "child_process";
import { writeFileSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const CFT =
  "/Users/andres/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";

const [, , url, out, wS, hS, scaleS, settleS] = process.argv;
const width = Number(wS || 460), height = Number(hS || 860);
const scale = Number(scaleS || 2), settle = Number(settleS || 500);
const port = 9300 + Math.floor((Date.now ? 0 : 0)) + Math.floor(width % 50) + Math.floor(height % 50) + (out.length % 97);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), "cft-"));

const chrome = spawn(CFT, [
  "--headless=old", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
  "--no-first-run", "--no-default-browser-check", "--disable-extensions",
  "--disable-sync", "--disable-background-networking", "--disable-component-update",
  "--disable-default-apps", "--disable-features=Translate,MediaRouter",
  "--mute-audio", `--user-data-dir=${profile}`,
  `--remote-debugging-port=${port}`, "about:blank",
], { stdio: "ignore" });

function cleanup() {
  try { chrome.kill("SIGKILL"); } catch {}
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}

async function getJSON(path: string): Promise<any> {
  const r = await fetch(`http://127.0.0.1:${port}${path}`);
  return r.json();
}

let msgId = 0;
function rpc(ws: WebSocket, method: string, params: any = {}): Promise<any> {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    const onMsg = (ev: MessageEvent) => {
      const m = JSON.parse(ev.data as string);
      if (m.id === id) { ws.removeEventListener("message", onMsg); m.error ? reject(new Error(m.error.message)) : resolve(m.result); }
    };
    ws.addEventListener("message", onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

try {
  // wait for debugger to come up
  let wsUrl = "";
  for (let i = 0; i < 80; i++) {
    try { const v = await getJSON("/json/version"); wsUrl = v.webSocketDebuggerUrl; if (wsUrl) break; } catch {}
    await sleep(150);
  }
  if (!wsUrl) throw new Error("debugger never came up");

  // use the existing about:blank page target (/json/new requires PUT in modern Chrome)
  let pageWs = "";
  for (let i = 0; i < 40; i++) {
    const list = await getJSON("/json/list");
    const page = Array.isArray(list) ? list.find((t: any) => t.type === "page") : null;
    if (page?.webSocketDebuggerUrl) { pageWs = page.webSocketDebuggerUrl; break; }
    await sleep(150);
  }
  if (!pageWs) throw new Error("no page target");
  const ws = new WebSocket(pageWs);
  await new Promise<void>((res, rej) => { ws.onopen = () => res(); ws.onerror = (e) => rej(new Error("ws err")); });

  await rpc(ws, "Page.enable");
  await rpc(ws, "Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: scale, mobile: false });

  const loaded = new Promise<void>((res) => {
    const onMsg = (ev: MessageEvent) => {
      const m = JSON.parse(ev.data as string);
      if (m.method === "Page.loadEventFired") { ws.removeEventListener("message", onMsg); res(); }
    };
    ws.addEventListener("message", onMsg);
  });
  await rpc(ws, "Page.navigate", { url });
  await Promise.race([loaded, sleep(8000)]);
  // wait for fonts + a settle beat
  try { await rpc(ws, "Runtime.evaluate", { expression: "document.fonts && document.fonts.ready", awaitPromise: true }); } catch {}
  await sleep(settle);

  const shot = await rpc(ws, "Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(out, Buffer.from(shot.data, "base64"));
  ws.close();
  console.log("OK", out);
} catch (e) {
  console.log("FAIL", out, (e as Error).message);
  process.exitCode = 1;
} finally {
  cleanup();
}
