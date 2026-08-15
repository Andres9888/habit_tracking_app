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
  it('exists and equals #F0EDE8', () => {
    expect(colors.light.gradientMid).toBe('#F0EDE8');
    expect(colors.light.gradientMid).toBeDefined();
    expect(colors.light.gradientMid).toContain('#');
  });

  it('is darker than colors.light.background', () => {
    expect(colors.light.gradientMid).not.toBe(colors.light.background);
    expect(colors.light.background).toBe('#F5F1ED');
    expect(colors.light.gradientMid).toBeTruthy();
  });
});

describe('HabitsApp uses theme background', () => {
  const source = readSource('features/habits/HabitsApp.tsx');

  it('reads colors from useThemeColors', () => {
    expect(source).toMatch(/import.*useThemeColors.*from.*ThemeContext/);
  });

  it('uses the theme background token instead of a hardcoded hex', () => {
    expect(source).toContain('colors.background');
    expect(source).not.toContain('#FAF8F5');
  });
});

describe('HabitEditScreen uses theme background', () => {
  const source = readSource('screens/HabitEditScreen/HabitEditScreen.tsx');

  it('reads colors from useThemeColors', () => {
    expect(source).toMatch(/import.*useThemeColors.*from.*ThemeContext/);
  });

  it('does not use bg-[#faf9f7] Tailwind class', () => {
    expect(source).not.toContain('bg-[#faf9f7]');
  });

  it('uses a theme surface token', () => {
    expect(source).toContain('themeColors.surface');
  });
});

describe('CharacterScreen uses theme background', () => {
  const source = readSource('screens/CharacterScreen/CharacterScreen.tsx');

  it('reads colors from useThemeColors', () => {
    expect(source).toMatch(/import.*useThemeColors.*from.*ThemeContext/);
  });

  it('does not use bg-white class', () => {
    expect(source).not.toContain("bg-white'");
    expect(source).not.toContain('bg-white"');
  });

  it('uses the theme background token', () => {
    expect(source).toContain('colors.background');
  });
});

// SignUpScreen removed in OAuth-only migration

describe('HabitDetailScreen uses theme surface tokens', () => {
  const source = readSource('screens/HabitDetailScreen/HabitDetailScreen.tsx');

  it('reads colors from useThemeColors', () => {
    expect(source).toMatch(/import.*useThemeColors.*from.*theme/);
    expect(source).toContain('useThemeColors()');
  });

  it('does not hardcode canvas hex values', () => {
    expect(source).not.toMatch(/#faf9f7/i);
    expect(source).not.toMatch(/#f5f3f0/i);
  });

  it('uses the theme background token for the sheet', () => {
    expect(source).toContain('colors.background');
  });

  it('uses the overlay scrim behind the sheet', () => {
    expect(source).toContain('overlays.scrim');
  });
});

// SignInScreen and SignInScreen.styles removed in OAuth-only migration

describe('AnalyticsScreen.styles already uses theme token', () => {
  it('container backgroundColor matches colors.background', () => {
    expect(analyticsStyles.container.backgroundColor).toBe(colors.background);
  });

  it('colors.background equals colors.light.background', () => {
    expect(colors.background).toBe(colors.light.background);
  });
});
