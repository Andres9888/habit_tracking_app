/**
 * Primary-500 Text Contrast Tests (Phase 8 Task 3)
 * Verifies that readable text uses primary-700 (#047857, ~6.0:1 contrast)
 * instead of primary-500 (#10B981, 2.9:1 contrast) which fails WCAG AA.
 *
 * Primary-500 is acceptable for: icon fills, backgrounds, borders, decorative elements.
 * Primary-500 is NOT acceptable for: body text, labels, button text, stat numbers.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_ROOT = path.resolve(__dirname, '../../../src');

/**
 * StyleSheet-based components where colors.primary[500] was replaced
 * with colors.primary[700] for readable text.
 */
const STYLESHEET_TEXT_FILES = [
  {
    file: 'components/HabitRankingsList/itemStyles.ts',
    description: 'Strength percentage text',
    pattern: 'colors.primary[700]',
    antiPattern: 'colors.primary[500]',
  },
  {
    file: 'components/WeeklyInsightsCard/SuggestedActions.styles.ts',
    description: 'Action button text',
    pattern: 'colors.primary[700]',
    antiPattern: 'colors.primary[500]',
  },
  {
    file: 'components/MilestoneCelebration/StrengthDisplay.tsx',
    description: 'Strength percentage heading',
    pattern: 'colors.primary[700]',
    antiPattern: 'colors.primary[500]',
  },
  {
    file: 'components/ShareCardGenerator/components/ShareCardHeader.tsx',
    description: 'Done button text',
    pattern: 'colors.primary[700]',
    antiPattern: 'colors.primary[500]',
  },
];

/**
 * Button variant configurations where text uses primary-700.
 */
const BUTTON_CONFIG_FILE = {
  file: 'components/Button/useButtonConfig.ts',
  description: 'Secondary and ghost button text',
};
const BUTTON_VARIANT_STYLES_FILE =
  'components/Button/buttonVariantStyles.ts';

/**
 * Semantic success text tokens and hardcoded primary-700 values used for
 * readable text on light backgrounds.
 */
const TAILWIND_TEXT_FILES = [
  {
    file: 'components/HabitCalendarModal/StatsCard.tsx',
    description: 'Completion percentage stat',
    pattern: 'colors.status.successText',
    antiPattern: '#10b981',
  },
  {
    file: 'components/HabitCalendarModal/ActivityLog.tsx',
    description: 'Completed activity timestamp',
    pattern: '#047857',
    antiPattern: "style={{ color: activity.completed ? '#10b981'",
  },
  {
    file: 'components/CreateHabitModal/components/ReminderSelector/ReminderOptionButton.tsx',
    description: 'Enabled reminder time text',
    pattern: '#047857',
    antiPattern: "style={{ color: isSelected ? '#10B981'",
  },
  {
    file: 'components/QuickStatsStrip/QuickStatsStrip.tsx',
    description: 'Success rate stat card color',
    pattern: 'themeColors.status.successText',
    antiPattern: 'text-emerald-500',
  },
];

/**
 * Files where hardcoded #10B981 text color was replaced with
 * #047857 (primary-700) for WCAG AA compliance.
 */
const HARDCODED_HEX_FILES = [
  {
    file: 'components/FloatingXPText/FloatingXPText.tsx',
    description: 'XP floating text color',
    pattern: '#047857',
  },
  {
    file: 'components/CreateHabitModal/components/EnhancedReminderSelector/PresetButton.tsx',
    description: 'Selected preset time text',
    pattern: '#047857',
  },
];

describe('Primary-500 contrast: StyleSheet text uses primary-700', () => {
  for (const {
    file,
    description,
    pattern,
    antiPattern,
  } of STYLESHEET_TEXT_FILES) {
    it(`${description} in ${file} uses primary[700]`, () => {
      const content = fs.readFileSync(path.join(SRC_ROOT, file), 'utf-8');
      expect(content).toContain(pattern);
      expect(content).not.toContain(antiPattern);
    });
  }
});

describe('Primary-500 contrast: Button config uses primary-700 for text', () => {
  it('secondary variant text uses primary[700]', () => {
    const configContent = fs.readFileSync(
      path.join(SRC_ROOT, BUTTON_CONFIG_FILE.file),
      'utf-8'
    );
    const stylesContent = fs.readFileSync(
      path.join(SRC_ROOT, BUTTON_VARIANT_STYLES_FILE),
      'utf-8'
    );
    expect(configContent).toMatch(
      /primaryText:\s*mergedTheme\.colors\?\.primary\?\.\[700\]/
    );
    expect(stylesContent).toMatch(/text:\s*\{\s*color:\s*colors\.primaryText/);
  });

  it('primary variant container still uses primary[500] for background', () => {
    const configContent = fs.readFileSync(
      path.join(SRC_ROOT, BUTTON_CONFIG_FILE.file),
      'utf-8'
    );
    const stylesContent = fs.readFileSync(
      path.join(SRC_ROOT, BUTTON_VARIANT_STYLES_FILE),
      'utf-8'
    );
    expect(configContent).toMatch(
      /primary:\s*mergedTheme\.colors\?\.primary\?\.\[500\]/
    );
    expect(stylesContent).toMatch(
      /backgroundColor:\s*colors\.primary/
    );
  });

  it('secondary variant border still uses primary[500]', () => {
    const content = fs.readFileSync(
      path.join(SRC_ROOT, BUTTON_VARIANT_STYLES_FILE),
      'utf-8'
    );
    expect(content).toMatch(/borderColor:\s*colors\.primary/);
  });
});

describe('Primary-500 contrast: Tailwind text uses emerald-700', () => {
  for (const {
    file,
    description,
    pattern,
    antiPattern,
  } of TAILWIND_TEXT_FILES) {
    it(`${description} in ${file} uses ${pattern}`, () => {
      const content = fs.readFileSync(path.join(SRC_ROOT, file), 'utf-8');
      expect(content).toContain(pattern);
      expect(content).not.toContain(antiPattern);
    });
  }
});

describe('Primary-500 contrast: Hardcoded hex text uses #047857', () => {
  for (const { file, description, pattern } of HARDCODED_HEX_FILES) {
    it(`${description} in ${file} uses ${pattern}`, () => {
      const content = fs.readFileSync(path.join(SRC_ROOT, file), 'utf-8');
      expect(content).toContain(pattern);
    });
  }
});

describe('Primary-500 contrast: primary-700 token exists in theme', () => {
  it('colors.primary[700] is #047857', () => {
    const content = fs.readFileSync(
      path.join(SRC_ROOT, 'theme/colors/core.ts'),
      'utf-8'
    );
    expect(content).toMatch(/700:\s*'#047857'/);
  });

  it('primary-700 comment indicates high contrast text usage', () => {
    const content = fs.readFileSync(
      path.join(SRC_ROOT, 'theme/colors/core.ts'),
      'utf-8'
    );
    expect(content).toMatch(/700.*high contrast/i);
  });
});
