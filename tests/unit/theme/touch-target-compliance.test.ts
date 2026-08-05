/**
 * Touch Target Compliance Tests (Phase 8 Task 1)
 * Verifies that interactive elements meet Apple HIG 44x44pt minimum.
 * Elements below 44x44pt must have hitSlop to compensate.
 *
 * Formula: visual_size + (hitSlop.top + hitSlop.bottom) >= 44
 *          visual_size + (hitSlop.left + hitSlop.right) >= 44
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_ROOT = path.resolve(__dirname, '../../../src');

/**
 * Files with small buttons (h-7 = 28pt) that need hitSlop >= 10 per side
 * to reach 48pt effective touch target.
 */
const SMALL_BUTTON_FILES = [
  {
    file: 'components/ProgressSection/YourProgressCard/YourProgressCard.tsx',
    description: 'Info button (28pt visual)',
    minHitSlop: 10,
  },
  {
    file: 'components/DraftRecoveryBanner/DraftRecoveryBanner.tsx',
    description: 'Close button (28pt visual)',
    minHitSlop: 10,
  },
];

/**
 * Files with h-6 (24pt) buttons that need hitSlop >= 12 per side
 * to reach 48pt effective touch target.
 */
const TINY_BUTTON_FILES = [
  {
    file: 'components/MotivationSystem/Workshop/WOOPSection/WOOPSectionHeader.tsx',
    description: 'Help button (24pt visual)',
    minHitSlop: 12,
  },
  {
    file: 'components/MotivationSystem/Workshop/DualVizSetup/components/DualVizHeader.tsx',
    description: 'Help button (24pt visual)',
    minHitSlop: 12,
  },
];

/**
 * Files with medium buttons (h-9 = 36pt) that need hitSlop >= 6 per side
 * to reach 48pt effective touch target.
 */
const MEDIUM_BUTTON_FILES = [
  {
    file: 'components/BinaryHeatmap/StatsRow.tsx',
    description: 'Settings button (36pt visual)',
    minHitSlop: 8,
  },
];

const ALL_FILES = [
  ...SMALL_BUTTON_FILES,
  ...TINY_BUTTON_FILES,
  ...MEDIUM_BUTTON_FILES,
];

describe('Touch target: hitSlop is present', () => {
  for (const { file, description } of ALL_FILES) {
    it(`${description} in ${file} has hitSlop`, () => {
      const content = fs.readFileSync(path.join(SRC_ROOT, file), 'utf-8');
      expect(content).toContain('hitSlop=');
    });
  }
});

describe('Touch target: hitSlop uses object form (not number shorthand)', () => {
  for (const { file, description } of ALL_FILES) {
    it(`${description} in ${file} uses object-form hitSlop`, () => {
      const content = fs.readFileSync(path.join(SRC_ROOT, file), 'utf-8');
      expect(content).toMatch(/hitSlop=\{\{/);
    });
  }
});

describe('Touch target: hitSlop values meet minimum threshold', () => {
  for (const { file, description, minHitSlop } of ALL_FILES) {
    it(`${description} in ${file} has hitSlop >= ${minHitSlop} on all sides`, () => {
      const content = fs.readFileSync(path.join(SRC_ROOT, file), 'utf-8');

      const hitSlopMatch = content.match(
        /hitSlop=\{\{\s*bottom:\s*(\d+),\s*left:\s*(\d+),\s*right:\s*(\d+),\s*top:\s*(\d+)\s*\}\}/
      );
      expect(hitSlopMatch).not.toBeNull();

      const [, bottom, left, right, top] = hitSlopMatch!.map(Number);
      expect(bottom).toBeGreaterThanOrEqual(minHitSlop);
      expect(left).toBeGreaterThanOrEqual(minHitSlop);
      expect(right).toBeGreaterThanOrEqual(minHitSlop);
      expect(top).toBeGreaterThanOrEqual(minHitSlop);
    });
  }
});

describe('Touch target: no undersized hitSlop=8 shorthand remains', () => {
  for (const { file, description } of TINY_BUTTON_FILES) {
    it(`${description} in ${file} does not use hitSlop={8}`, () => {
      const content = fs.readFileSync(path.join(SRC_ROOT, file), 'utf-8');
      expect(content).not.toMatch(/hitSlop=\{8\}/);
    });
  }
});
