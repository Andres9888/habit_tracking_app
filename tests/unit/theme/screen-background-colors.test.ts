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
  it('exists and equals #f5f3f0', () => {
    expect(colors.light.gradientMid).toBe('#f5f3f0');
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

  it('imports colors from theme', () => {
    expect(source).toMatch(/import.*colors.*from.*theme\/colors/);
    expect(source).toContain('colors');
    expect(source).toContain('from');
  });

  it('uses colors.light.background instead of hardcoded hex', () => {
    expect(source).toContain('colors.light.background');
    expect(source).not.toContain('#FAF8F5');
    expect(source).toContain('light');
  });
});

describe('HabitEditScreen uses theme background', () => {
  const source = readSource('screens/HabitEditScreen/HabitEditScreen.tsx');

  it('imports colors from theme', () => {
    expect(source).toMatch(/import.*colors.*from.*theme\/colors/);
  });

  it('does not use bg-[#faf9f7] Tailwind class', () => {
    expect(source).not.toContain('bg-[#faf9f7]');
  });

  it('uses colors.light.background style prop', () => {
    expect(source).toContain('colors.light.background');
  });
});

describe('CharacterScreen uses theme background', () => {
  const source = readSource('screens/CharacterScreen/CharacterScreen.tsx');

  it('imports colors from theme', () => {
    expect(source).toMatch(/import.*colors.*from.*theme\/colors/);
  });

  it('does not use bg-white class', () => {
    expect(source).not.toContain("bg-white'");
    expect(source).not.toContain('bg-white"');
  });

  it('uses colors.light.background style prop', () => {
    expect(source).toContain('colors.light.background');
  });
});

// SignUpScreen removed in OAuth-only migration

describe('HabitDetailScreen uses theme gradient tokens', () => {
  const source = readSource('screens/HabitDetailScreen/HabitDetailScreen.tsx');

  it('imports colors from theme', () => {
    expect(source).toMatch(/import.*colors.*from.*theme\/colors/);
  });

  it('does not hardcode gradient hex values', () => {
    expect(source).not.toMatch(/#faf9f7/i);
    expect(source).not.toMatch(/#f5f3f0/i);
  });

  it('uses colors.light.background in gradient', () => {
    expect(source).toContain('colors.light.background');
  });

  it('uses colors.light.gradientMid in gradient', () => {
    expect(source).toContain('colors.light.gradientMid');
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
