/**
 * Debug Endpoint Removal Tests (SEC-001)
 *
 * Tests that the unauthenticated debug endpoints have been removed:
 * - convex/debugHabitStrength.ts (exposed ALL users' habit data)
 * - convex/diagnose.ts (exposed/modified ALL users' data)
 * - convex/quickFix.ts (modified arbitrary users' habits)
 *
 * These files had zero authentication and were marked as temporary.
 */

import * as fs from 'fs';
import * as path from 'path';
import { describe, expect, it } from 'vitest';

const CONVEX_DIR = path.resolve(__dirname);
const SRC_DIR = path.resolve(__dirname, '..', 'src');

describe('Debug endpoint removal: files deleted', () => {
  it('debugHabitStrength.ts should not exist', () => {
    const filePath = path.join(CONVEX_DIR, 'debugHabitStrength.ts');
    expect(fs.existsSync(filePath)).toBe(false);
  });

  it('diagnose.ts should not exist', () => {
    const filePath = path.join(CONVEX_DIR, 'diagnose.ts');
    expect(fs.existsSync(filePath)).toBe(false);
  });

  it('quickFix.ts should not exist', () => {
    const filePath = path.join(CONVEX_DIR, 'quickFix.ts');
    expect(fs.existsSync(filePath)).toBe(false);
  });
});

describe('Debug endpoint removal: no client references', () => {
  function findReferencesInDir(
    dir: string,
    patterns: string[]
  ): { file: string; pattern: string }[] {
    const matches: { file: string; pattern: string }[] = [];
    if (!fs.existsSync(dir)) return matches;

    function walk(currentDir: string) {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name === 'node_modules' || entry.name === '_generated')
            continue;
          walk(fullPath);
        } else if (
          /\.(ts|tsx|js|jsx)$/.test(entry.name) &&
          !entry.name.endsWith('.test.ts')
        ) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          for (const pattern of patterns) {
            if (content.includes(pattern)) {
              matches.push({ file: fullPath, pattern });
            }
          }
        }
      }
    }

    walk(dir);
    return matches;
  }

  it('no src/ files should import debugHabitStrength', () => {
    const refs = findReferencesInDir(SRC_DIR, ['debugHabitStrength']);
    expect(refs).toEqual([]);
  });

  it('no src/ files should import diagnose', () => {
    const refs = findReferencesInDir(SRC_DIR, [
      'diagnose:show',
      'diagnose:fix',
      "from 'diagnose'",
      'from "diagnose"',
    ]);
    expect(refs).toEqual([]);
  });

  it('no src/ files should import quickFix', () => {
    const refs = findReferencesInDir(SRC_DIR, [
      'quickFix:testDisplay',
      'quickFix:checkToggle',
      "from 'quickFix'",
      'from "quickFix"',
    ]);
    expect(refs).toEqual([]);
  });

  it('no convex/ files should import from deleted debug modules', () => {
    const refs = findReferencesInDir(CONVEX_DIR, [
      "from './debugHabitStrength'",
      'from "./debugHabitStrength"',
      "from './diagnose'",
      'from "./diagnose"',
      "from './quickFix'",
      'from "./quickFix"',
    ]);
    expect(refs).toEqual([]);
  });
});
