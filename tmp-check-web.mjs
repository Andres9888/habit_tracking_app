import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const logs = [];
page.on('console', (msg) => {
  logs.push({ type: 'console', level: msg.type(), text: msg.text() });
});
page.on('pageerror', (error) => {
  logs.push({ type: 'pageerror', text: String(error) });
});

await page.goto('http://localhost:8088', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(8000);
console.log('bodyTextLength', await page.locator('body').innerText().then((v) => v.length));
console.log('screenshot', await page.screenshot({ path: '/Users/andres/Code/habit_tracking_app/tmp/check-page.png' }) && 'saved');
console.log('console logs', logs.slice(0, 50));
await browser.close();
