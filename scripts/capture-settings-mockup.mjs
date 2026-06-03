#!/usr/bin/env node
/**
 * Capture settings before/after mockup screenshots via Playwright.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const htmlPath = path.join(
  root,
  '.superdesign/design_iterations/settings_improvements_before_after_1.html'
);
const outDir = path.join(root, 'docs/mockups/screenshots');

async function capture() {
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 2200 });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  await page.screenshot({
    path: path.join(outDir, 'settings-improvements-full.png'),
    fullPage: true,
  });

  const before = page.locator('#phone-before');
  await before.screenshot({
    path: path.join(outDir, 'settings-before.png'),
  });

  const after = page.locator('#phone-after');
  await after.screenshot({
    path: path.join(outDir, 'settings-after.png'),
  });

  await browser.close();
  console.log('Screenshots saved to', outDir);
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
