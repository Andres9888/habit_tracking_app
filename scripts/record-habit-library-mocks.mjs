#!/usr/bin/env node
/**
 * Record Habit Library mock HTML pages to MP4 via Puppeteer frame capture + ffmpeg.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MOCKS_DIR = path.join(ROOT, '.superdesign/design_iterations/habit_library_mocks');
const OUT_VIDEO = path.join('/opt/cursor/artifacts/videos');
const OUT_MOCK = path.join('/opt/cursor/artifacts/mocks');
const CHROME = process.env.CHROME_PATH || '/usr/local/bin/google-chrome';
const FPS = 24;

const JOBS = [
  { html: 'returning_user_flow.html', video: 'habit_library_returning_user_flow.mp4', durationMs: 8000, animated: true },
  { html: 'first_time_user_flow.html', video: 'habit_library_first_time_user_flow.mp4', durationMs: 7000, animated: true },
  { html: 'returning_user_collapsed.html', png: 'habit_library_returning_collapsed.png' },
  { html: 'returning_user_expanded.html', png: 'habit_library_returning_expanded.png' },
  { html: 'first_time_user_static.html', png: 'habit_library_first_time_static.png' },
  {
    html: '../habit_library_ux_improvements_1.html',
    png: 'habit_library_side_by_side.png',
    viewport: { width: 1400, height: 900 },
  },
];

async function capturePng(page, filePath, viewport) {
  if (viewport) await page.setViewport({ ...viewport, deviceScaleFactor: 2 });
  else await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.screenshot({ path: filePath, type: 'png' });
}

async function recordVideo(page, filePath, durationMs) {
  const framesDir = path.join(OUT_VIDEO, `.frames_${path.basename(filePath, '.mp4')}`);
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  const totalFrames = Math.ceil((durationMs / 1000) * FPS);

  await page.evaluate(() => {
    if (typeof window.advanceFrame === 'function') window.advanceFrame(0);
  });

  for (let i = 0; i < totalFrames; i += 1) {
    await new Promise((r) => setTimeout(r, 1000 / FPS));
    const framePath = path.join(framesDir, `frame_${String(i).padStart(5, '0')}.png`);
    await page.screenshot({ path: framePath, type: 'png' });
  }

  spawnSync('ffmpeg', [
    '-y', '-framerate', String(FPS),
    '-i', path.join(framesDir, 'frame_%05d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    filePath,
  ], { stdio: 'inherit' });

  fs.rmSync(framesDir, { recursive: true, force: true });
}

async function main() {
  fs.mkdirSync(OUT_VIDEO, { recursive: true });
  fs.mkdirSync(OUT_MOCK, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    for (const job of JOBS) {
      const htmlPath = path.join(MOCKS_DIR, job.html);
      const fileUrl = `file://${htmlPath}`;
      const page = await browser.newPage();

      if (job.animated) {
        await page.evaluateOnNewDocument(() => { window.__RECORDING__ = true; });
      }

      console.log(`Loading ${job.html}`);
      await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });

      if (job.video) {
        const out = path.join(OUT_VIDEO, job.video);
        console.log(`Recording video: ${job.video}`);
        await recordVideo(page, out, job.durationMs);
        console.log(`  → ${out}`);
      }

      if (job.png) {
        const out = path.join(OUT_MOCK, job.png);
        console.log(`Capturing PNG: ${job.png}`);
        await capturePng(page, out, job.viewport);
        console.log(`  → ${out}`);
      }

      await page.close();
    }
  } finally {
    await browser.close();
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
