/**
 * Screens use theme background / surface tokens
 */

import * as fs from 'fs';
import * as path from 'path';
import { colors } from '@/theme/colors';

const SRC = path.resolve(__dirname, '../../../src');

function read(rel: string): string {
  return fs.readFileSync(path.join(SRC, rel), 'utf-8');
}

describe('Canvas tokens', () => {
  it('background / gradientMid match the warm paper palette', () => {
    expect(colors.light.background).toBe('#F5F1ED');
    expect(colors.light.gradientMid).toBe('#F0EDE8');
    expect(colors.background).toBe(colors.light.background);
  });
});

describe('HabitsApp', () => {
  const source = read('features/habits/HabitsApp.tsx');

  it('uses useThemeColors().colors.background', () => {
    expect(source).toMatch(/useThemeColors/);
    expect(source).toContain('colors.background');
    expect(source).not.toContain('#FAF8F5');
  });
});

describe('HabitEditScreen', () => {
  const source = read('screens/HabitEditScreen/HabitEditScreen.tsx');

  it('uses themeColors.surface', () => {
    expect(source).toMatch(/useThemeColors/);
    expect(source).toContain('themeColors.surface');
    expect(source).not.toContain('bg-[#faf9f7]');
  });
});

describe('CharacterScreen', () => {
  const source = read('screens/CharacterScreen/CharacterScreen.tsx');

  it('uses colors.background from useThemeColors', () => {
    expect(source).toMatch(/useThemeColors/);
    expect(source).toContain('colors.background');
    expect(source).not.toContain("bg-white'");
  });
});

describe('HabitDetailScreen', () => {
  const source = read('screens/HabitDetailScreen/HabitDetailScreen.tsx');

  it('uses theme background + overlay scrim', () => {
    expect(source).toMatch(/useThemeColors/);
    expect(source).toContain('colors.background');
    expect(source).toContain('overlays.scrim');
  });
});

describe('AnalyticsScreen', () => {
  const source = read('screens/AnalyticsScreen/AnalyticsScreen.tsx');

  it('applies themeColors.background on the container', () => {
    expect(source).toContain('themeColors.background');
  });
});
