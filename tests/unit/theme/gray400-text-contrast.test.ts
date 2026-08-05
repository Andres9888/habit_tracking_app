/**
 * Secondary-text contrast contracts for the current warm-stone theme.
 *
 * Components now consume semantic theme tokens instead of Tailwind's former
 * stone-400/stone-500 classes, so this suite follows the live source paths and
 * verifies readable text does not regress to raw legacy colors.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_ROOT = path.resolve(__dirname, '../../../src');

const THEMED_TEXT_FILES = [
  {
    file: 'components/TrendLineChart/styles.ts',
    description: 'Trend chart labels',
    pattern: 'colors.text.secondary',
  },
  {
    file: 'components/ProgressSection/PersonalBestsCard.tsx',
    description: 'Personal-best empty guidance',
    pattern: 'themeColors.text.secondary',
  },
  {
    file: 'components/ArchivedHabitsModal/components/EmptyState.tsx',
    description: 'Archive empty-state guidance',
    pattern: 'colors.text.tertiary',
  },
  {
    file: 'components/ArchivedHabitsModal/components/HabitCardHeader.tsx',
    description: 'Archive timestamps',
    pattern: 'colors.text.tertiary',
  },
  {
    file: 'screens/AnalyticsScreen/components/EmptyState.tsx',
    description: 'Analytics empty-state description',
    pattern: 'colors.text.secondary',
  },
  {
    file: 'components/StrengthProgressBar/StrengthProgressBar.styles.ts',
    description: 'Strength progress hints',
    pattern: 'colors.gray[500]',
  },
  {
    file: 'components/ProgressSectionConsolidated/MilestoneProgress/styles/progress.styles.ts',
    description: 'Milestone days-away label',
    pattern: 'colors.gray[500]',
  },
  {
    file: 'components/TrendLineChart/TrendLineChart.tsx',
    description: 'Trend chart axes',
    pattern: 'colors.text.tertiary',
  },
];

describe('Readable secondary text uses current semantic tokens', () => {
  for (const { file, description, pattern } of THEMED_TEXT_FILES) {
    it(`${description} in ${file} uses ${pattern}`, () => {
      const content = fs.readFileSync(path.join(SRC_ROOT, file), 'utf-8');
      expect(content).toContain(pattern);
      expect(content).not.toContain('text-stone-400');
    });
  }
});

describe('StyleSheet-based labels use centralized gray tokens', () => {
  it('StrengthProgressBar uses gray-500 for readable hints', () => {
    const content = fs.readFileSync(
      path.join(
        SRC_ROOT,
        'components/StrengthProgressBar/StrengthProgressBar.styles.ts'
      ),
      'utf-8'
    );
    expect(content).toContain('colors.gray[500]');
  });

  it('MilestoneProgress distinguishes secondary and tertiary labels', () => {
    const content = fs.readFileSync(
      path.join(
        SRC_ROOT,
        'components/ProgressSectionConsolidated/MilestoneProgress/styles/progress.styles.ts'
      ),
      'utf-8'
    );
    expect(content).toContain('colors.gray[500]');
    expect(content).toContain('colors.gray[400]');
  });
});

describe('Theme source documents the accessible warm-stone text tokens', () => {
  const core = fs.readFileSync(
    path.join(SRC_ROOT, 'theme/colors/core.ts'),
    'utf-8'
  );

  it('gray-400 is the accessible tertiary token', () => {
    expect(core).toMatch(/400:\s*'#6E6660'/);
    expect(core).toContain('WCAG AA 4.69:1');
  });

  it('gray-500 is the accessible secondary token', () => {
    expect(core).toMatch(/500:\s*'#6B6560'/);
    expect(core).toContain('Secondary text (5.1:1');
  });
});
