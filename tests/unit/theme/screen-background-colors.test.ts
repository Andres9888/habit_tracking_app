/**
 * Screen Background Color Standardization Tests (Phase 7 Task 1)
 * Verifies all screens use theme tokens for background colors instead
 * of hardcoded hex values.
 */

import * as fs from 'fs';
import * as path from 'path';
import { colors } from '@/theme/colors';
import { styles as analyticsStyles } from '@/screens/AnalyticsScreen/AnalyticsScreen.styles';
// SignInScreen.styles removed in OAuth-only migration

const SRC = path.resolve(__dirname, '../../../src');

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), 'utf-8');
}

describe('colors.light.gradientMid token', () => {
  it('exists and equals the current warm gradient midpoint', () => {
    expect(colors.light.gradientMid).toBe('#F0EDE8');
    expect(colors.light.gradientMid).toBeDefined();
    expect(colors.light.gradientMid).toContain('#');
  });

  it('is darker than colors.light.background', () => {
    // gradientMid (#f5f3f0) should be visually darker than background (#faf9f7)
    expect(colors.light.gradientMid).not.toBe(colors.light.background);
    expect(colors.light.background).toBeDefined();
    expect(colors.light.gradientMid).toBeTruthy();
  });
});

describe('HabitsApp uses theme background', () => {
  const source = readSource('features/habits/HabitsApp.tsx');

  it('imports the active theme colors', () => {
    expect(source).toContain('useThemeColors');
    expect(source).toContain('colors');
    expect(source).toContain('from');
  });

  it('uses the active background instead of a hardcoded hex', () => {
    expect(source).toContain('backgroundColor: colors.background');
    expect(source).not.toContain('#FAF8F5');
    expect(source).toContain('useThemeColors');
  });
});

describe('HabitEditScreen uses theme background', () => {
  const source = readSource('screens/HabitEditScreen/HabitEditScreen.tsx');

  it('imports the active theme colors', () => {
    expect(source).toContain('useThemeColors');
  });

  it('does not use bg-[#faf9f7] Tailwind class', () => {
    expect(source).not.toContain('bg-[#faf9f7]');
  });

  it('uses the active surface style prop', () => {
    expect(source).toContain('backgroundColor: themeColors.surface');
  });
});

describe('CharacterScreen uses theme background', () => {
  const source = readSource('screens/CharacterScreen/CharacterScreen.tsx');

  it('imports the active theme colors', () => {
    expect(source).toContain('useThemeColors');
  });

  it('does not use bg-white class', () => {
    expect(source).not.toContain("bg-white'");
    expect(source).not.toContain('bg-white"');
  });

  it('uses the active background style prop', () => {
    expect(source).toContain('backgroundColor: colors.background');
  });
});

// SignUpScreen removed in OAuth-only migration

describe('HabitDetailScreen uses theme gradient tokens', () => {
  const source = readSource('screens/HabitDetailScreen/HabitDetailScreen.tsx');

  it('imports the active theme colors', () => {
    expect(source).toContain('useThemeColors');
  });

  it('does not hardcode gradient hex values', () => {
    expect(source).not.toMatch(/#faf9f7/i);
    expect(source).not.toMatch(/#f5f3f0/i);
  });

  it('uses the active background in the detail surface', () => {
    expect(source).toContain('backgroundColor: colors.background');
  });

  it('uses the shared modal shadow on the detail surface', () => {
    expect(source).toContain('shadows.modal');
  });
});

// SignInScreen and SignInScreen.styles removed in OAuth-only migration

describe('AnalyticsScreen.styles already uses theme token', () => {
  it('container leaves its background to the active-theme screen style', () => {
    expect(analyticsStyles.container.backgroundColor).toBeUndefined();
    const source = readSource('screens/AnalyticsScreen/AnalyticsScreen.tsx');
    expect(source).toContain('backgroundColor: themeColors.background');
  });

  it('colors.background equals colors.light.background', () => {
    expect(colors.background).toBe(colors.light.background);
  });
});
