/**
 * Security guard (P2): entitlement writes must stay webhook-only.
 *
 * `hasPremium` on `userSettings` is the premium entitlement source of truth
 * (see subscriptions/premiumCheck.ts). It must be written ONLY by the
 * RevenueCat webhook path (subscriptions/helpers.ts::updateUserSettingsPremium).
 * Any other write site is a premium self-grant vector (the P0 class).
 *
 * This test scans the Convex source tree and fails if `hasPremium` appears
 * inside a `ctx.db.patch(...)` / `ctx.db.insert(...)` call anywhere except the
 * allowed writer. It keys on proximity to an actual DB write, so read shapes
 * (settings/getResponse.ts), defaults (settings/types.ts), and schema/validator
 * declarations do NOT trip it — only real persistence does.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CONVEX_ROOT = join(__dirname, '..');
const ALLOWED_WRITERS = ['subscriptions/helpers.ts'];
const DB_WRITE = /ctx\.db\.(patch|insert|replace)\(/g;
// How far past the write call to look for the field (covers a multi-line arg object).
const WINDOW = 400;

function collectTsFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === '_generated' || entry === 'node_modules') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectTsFiles(full, acc);
    } else if (entry.endsWith('.ts') && !entry.endsWith('.test.ts')) {
      acc.push(full);
    }
  }
  return acc;
}

function writesHasPremium(source: string): boolean {
  for (const match of source.matchAll(DB_WRITE)) {
    const window = source.slice(match.index, match.index + WINDOW);
    // Written as an object property/shorthand, not the defensive `'hasPremium'` guard string.
    if (/[{,]\s*hasPremium\s*[},:]/.test(window)) return true;
  }
  return false;
}

describe('SEC: hasPremium entitlement writes are webhook-only', () => {
  it('is persisted via ctx.db writes only in the allowed webhook writer', () => {
    const offenders = collectTsFiles(CONVEX_ROOT)
      .filter((file) => writesHasPremium(readFileSync(file, 'utf8')))
      .map((file) => file.slice(CONVEX_ROOT.length + 1))
      .filter((rel) => !ALLOWED_WRITERS.includes(rel));

    expect(offenders).toEqual([]);
  });
});
