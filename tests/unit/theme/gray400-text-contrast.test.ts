/**
 * Gray-400 Text Contrast Tests (Phase 8 Task 2)
 * Verifies that readable text uses gray-500 (#78716c, 4.6:1 contrast)
 * instead of gray-400 (#6B7280, 3.0:1 contrast) which fails WCAG AA.
 *
 * Gray-400 is acceptable for: hint text, disabled states, icon fills.
 * Gray-400 is NOT acceptable for: labels, timestamps, descriptions, stat units.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_ROOT = path.resolve(__dirname, '../../../src');

/**
 * Readable secondary text should use semantic theme tokens or accessible
 * gray-500 equivalents instead of low-contrast gray-400 literals.
 */
const TAILWIND_FILES = [
  {
    file: 'components/InsightsSection/components/EmptyInsightsState.tsx',
    description: 'Empty insights title and days remaining',
    pattern: 'colors.text.secondary',
    antiPattern: 'colors.gray[400]',
  },
  {
    file: 'components/InsightsSection/components/TrendSection.tsx',
    description: 'Month comparison labels',
    pattern: 'colors.text.secondary',
    antiPattern: 'colors.gray[400]',
  },
  {
    file: 'components/ProgressSection/PersonalBestsCard.tsx',
    description: 'Empty state instructions',
    pattern: 'themeColors.text.secondary',
    antiPattern: 'colors.gray[400]',
  },
  {
    file: 'components/ArchivedHabitsModal/components/EmptyState.tsx',
    description: 'Archive description text',
    pattern: 'colors.text.secondary',
    antiPattern: '#6B7280',
  },
  {
    file: 'components/ArchivedHabitsModal/components/HabitCardHeader.tsx',
    description: 'Archive date timestamps',
    pattern: 'colors.text.secondary',
    antiPattern: '#6B7280',
  },
];

/**
 * StyleSheet-based components where colors.gray[400] or #6B7280 was
 * replaced with colors.gray[500] or #78716c for readable text labels.
 */
const STYLESHEET_FILES = [
  {
    file: 'components/StrengthProgressBar/StrengthProgressBar.styles.ts',
    description: 'Arrow and next-hint text color',
    pattern: 'colors.gray[500]',
    antiPattern: 'colors.gray[400]',
  },
  {
    file: 'components/ProgressSectionConsolidated/MilestoneProgress/styles/progress.styles.ts',
    description: 'Milestone name and progress label text',
    pattern: '#78716c',
    antiPattern: "'#6B7280'",
  },
];

describe('Gray-400 contrast: readable secondary text uses semantic tokens', () => {
  for (const { file, description, pattern, antiPattern } of TAILWIND_FILES) {
    it(`${description} in ${file} uses ${pattern}`, () => {
      const content = fs.readFileSync(path.join(SRC_ROOT, file), 'utf-8');
      expect(content).toContain(pattern);
      expect(content).not.toContain(antiPattern);
    });
  }
});

describe('Gray-400 contrast: StyleSheet readable text uses gray-500', () => {
  for (const { file, description, pattern } of STYLESHEET_FILES) {
    it(`${description} in ${file} uses gray-500`, () => {
      const content = fs.readFileSync(path.join(SRC_ROOT, file), 'utf-8');
      expect(content).toContain(pattern);
    });
  }
});

describe('Gray-400 contrast: StyleSheet files do not use gray-400 for text', () => {
  it('StrengthProgressBar styles use gray-500 not gray-400', () => {
    const content = fs.readFileSync(
      path.join(
        SRC_ROOT,
        'components/StrengthProgressBar/StrengthProgressBar.styles.ts'
      ),
      'utf-8'
    );
    expect(content).not.toContain('colors.gray[400]');
  });
});

describe('Gray-400 contrast: colors.gray values are correct', () => {
  it('gray-400 is #6E6660 for tertiary text', () => {
    const content = fs.readFileSync(
      path.join(SRC_ROOT, 'theme/colors/core.ts'),
      'utf-8'
    );
    expect(content).toMatch(/400:\s*'#6E6660'/);
    expect(content).toContain('400');
    expect(content).toContain('#6E6660');
  });

  it('gray-500 is #6B6560 for secondary text', () => {
    const content = fs.readFileSync(
      path.join(SRC_ROOT, 'theme/colors/core.ts'),
      'utf-8'
    );
    expect(content).toMatch(/500:\s*'#6B6560'/);
    expect(content).toContain('500');
    expect(content).toContain('#6B6560');
  });
});
