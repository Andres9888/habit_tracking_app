/**
 * StatsNotesModal Token Migration Tests (Phase 2)
 * Verifies that StatsNotesModal files use theme tokens
 * instead of hardcoded hex values.
 */

import fs from 'fs';
import path from 'path';
import { colors } from '@/theme/colors';

const STATS_DIR = path.resolve(
  __dirname,
  '../../../src/components/StatsNotesModal'
);

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(STATS_DIR, relativePath), 'utf-8');
}

describe('StatsNotesModal Token Migration - Phase 2', () => {
  describe('WeeklyBarChart uses theme tokens', () => {
    let source: string;

    beforeAll(() => {
      source = readSource('HabitStats/WeeklyBarChart.tsx');
    });

    it('imports colors from @/theme/colors', () => {
      expect(source).toContain("from '@/theme/colors'");
    });

    it('does not contain hardcoded #48bb78 (green)', () => {
      expect(source).not.toContain('#48bb78');
    });

    it('does not contain hardcoded #dde3ed (gray fill)', () => {
      expect(source).not.toContain('#dde3ed');
    });

    it('does not contain hardcoded #78716c (stone-500)', () => {
      expect(source).not.toContain('#78716c');
    });

    it('uses colors.primary[400] for completed bars', () => {
      expect(source).toContain('colors.primary[400]');
    });

    it('uses colors.gray[200] for incomplete bars', () => {
      expect(source).toContain('colors.gray[200]');
    });

    it('uses colors.gray[500] for label text', () => {
      expect(source).toContain('colors.gray[500]');
    });
  });

  describe('TrendLineChart uses theme tokens', () => {
    let source: string;

    beforeAll(() => {
      source = readSource('HabitStats/TrendLineChart.tsx');
    });

    it('imports colors from @/theme/colors', () => {
      expect(source).toContain("from '@/theme/colors'");
    });

    it('does not contain hardcoded #48bb78 (green)', () => {
      expect(source).not.toContain('#48bb78');
    });

    it('does not contain hardcoded #dde3ed (gray fill)', () => {
      expect(source).not.toContain('#dde3ed');
    });

    it('does not contain hardcoded #78716c (stone-500)', () => {
      expect(source).not.toContain('#78716c');
    });

    it('does not contain hardcoded #e7e5e4 (border)', () => {
      expect(source).not.toContain('#e7e5e4');
    });

    it('does not contain hardcoded #d6d3d1 (stone-300)', () => {
      expect(source).not.toContain('#d6d3d1');
    });

    it('does not contain hardcoded #a8a29e (stone-400)', () => {
      expect(source).not.toContain('#a8a29e');
    });

    it('uses colors.border for grid line stroke', () => {
      expect(source).toContain('colors.border');
    });

    it('uses colors.gray[300] for trend line stroke', () => {
      expect(source).toContain('colors.gray[300]');
    });

    it('uses colors.primary[400] for completed points', () => {
      expect(source).toContain('colors.primary[400]');
    });

    it('uses colors.gray[400] for incomplete point stroke', () => {
      expect(source).toContain('colors.gray[400]');
    });
  });

  describe('StreakCards uses theme tokens', () => {
    let source: string;

    beforeAll(() => {
      source = readSource('HabitStats/StreakCards.tsx');
    });

    it('imports colors from @/theme/colors', () => {
      expect(source).toContain("from '@/theme/colors'");
    });

    it('does not contain hardcoded #48bb78 (green)', () => {
      expect(source).not.toContain('#48bb78');
    });

    it('uses colors.primary[400] via style prop', () => {
      expect(source).toContain('colors.primary[400]');
    });
  });

  describe('NoteEditor uses theme tokens', () => {
    let source: string;

    beforeAll(() => {
      source = readSource('NoteEditor/NoteEditor.tsx');
    });

    it('imports colors from @/theme/colors', () => {
      expect(source).toContain("from '@/theme/colors'");
    });

    it('does not contain hardcoded #a8a29e (stone-400)', () => {
      expect(source).not.toContain('#a8a29e');
    });

    it('uses colors.gray[400] for hint text color', () => {
      expect(source).toContain('colors.gray[400]');
    });
  });

  describe('Theme token values are correct', () => {
    it('primary[400] is emerald-400', () => {
      expect(colors.primary[400]).toBe('#34D399');
    });

    it('gray[200] is a light border gray', () => {
      expect(colors.gray[200]).toBe('#E5E7EB');
    });

    it('gray[300] is disabled gray', () => {
      expect(colors.gray[300]).toBe('#D1D5DB');
    });

    it('gray[400] is hint gray', () => {
      expect(colors.gray[400]).toBe('#6B7280');
    });

    it('gray[500] is stone-500 secondary text', () => {
      expect(colors.gray[500]).toBe('#78716c');
    });

    it('border is stone-200', () => {
      expect(colors.border).toBe('#e7e5e4');
    });
  });
});
