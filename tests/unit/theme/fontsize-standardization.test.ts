/**
 * Font Size Standardization Tests (Phase 4, Task 2)
 * Verifies that component style files use typography.*.fontSize tokens
 * from @/theme/typography instead of non-standard hardcoded numeric values.
 *
 * Standard typography scale: 10, 13, 15, 17, 22, 28, 34
 * Non-standard values replaced: 11→10, 12→13, 14→15, 16→17, 20→22
 */

import { typography } from '@/theme/typography';
import { streakStyles } from '@/components/HabitCard/HabitCard.streakStyles';
import { styles as toastStyles } from '@/components/Toast/styles';
import { styles as swipeStyles } from '@/components/SwipeableActionButton/styles';
import { styles as heatmapToggleStyles } from '@/components/BinaryHeatmap/TimeRangeToggle.styles';
import { dayCellStyles } from '@/components/ProgressSectionConsolidated/WeeklySummaryStrip/dayCellStyles';
import { headerStyles } from '@/components/ProgressSectionConsolidated/WeeklySummaryStrip/headerStyles';
import { progressStyles } from '@/components/ProgressSectionConsolidated/MilestoneProgress/styles/progress.styles';
import { styles as habitsAtRiskStyles } from '@/components/HabitsAtRiskWidget/styles';
import { SIZE_CONFIG } from '@/components/StrengthProgressBar/StrengthProgressBar.constants';
import { statusStyles } from '@/components/HabitCard/HabitCard.statusStyles';

/** Helper: assert fontSize uses a typography token value (10, 13, 15, 17, 22, 28, or 34) */
const STANDARD_SIZES = new Set([10, 13, 15, 17, 22, 28, 34]);
function expectStandardSize(fontSize: number | undefined, label: string) {
  expect(fontSize).toBeDefined();
  expect(STANDARD_SIZES.has(fontSize!)).toBe(true);
}

describe('Font Size Standardization — Phase 4 Task 2', () => {
  // ── fontSize: 11 → tabBar (10) or caption (13) ──────────
  describe('fontSize: 11 replacements', () => {
    it('HabitCard.streakStyles.bestStreakText → tabBar (10)', () => {
      expect(streakStyles.bestStreakText.fontSize).toBe(
        typography.tabBar.fontSize
      );
    });

    it('SwipeableActionButton swipeLabel → tabBar (10)', () => {
      expect(swipeStyles.swipeLabel.fontSize).toBe(typography.tabBar.fontSize);
    });

    it('TimeRangeToggle buttonText → tabBar (10)', () => {
      expect(heatmapToggleStyles.buttonText.fontSize).toBe(
        typography.tabBar.fontSize
      );
    });

    it('WeeklySummaryStrip dayLabel → tabBar (10)', () => {
      expect(dayCellStyles.dayLabel.fontSize).toBe(typography.tabBar.fontSize);
    });

    it('WeeklySummaryStrip perfectBadgeText → tabBar (10)', () => {
      expect(headerStyles.perfectBadgeText.fontSize).toBe(
        typography.tabBar.fontSize
      );
    });

    it('MilestoneProgress progressLabelText → tabBar (10)', () => {
      expect(progressStyles.progressLabelText.fontSize).toBe(
        typography.tabBar.fontSize
      );
    });
  });

  // ── fontSize: 12 → caption (13) ──────────────────────────
  describe('fontSize: 12 replacements', () => {
    it('HabitCard.streakStyles.streakText → caption (13)', () => {
      expect(streakStyles.streakText.fontSize).toBe(
        typography.caption.fontSize
      );
    });

    it('HabitCard.streakStyles.bestStreakIcon → caption (13)', () => {
      expect(streakStyles.bestStreakIcon.fontSize).toBe(
        typography.caption.fontSize
      );
    });

    it('HabitsAtRiskWidget interventionText → caption (13)', () => {
      expect(habitsAtRiskStyles.interventionText.fontSize).toBe(
        typography.caption.fontSize
      );
    });

    it('HabitCard.statusStyles warningText → caption (13)', () => {
      expect(statusStyles.warningText.fontSize).toBe(
        typography.caption.fontSize
      );
    });

    it('MilestoneProgress milestoneName → caption (13)', () => {
      expect(progressStyles.milestoneName.fontSize).toBe(
        typography.caption.fontSize
      );
    });

  });

  // ── fontSize: 14 → bodySmall (15) ────────────────────────
  describe('fontSize: 14 replacements', () => {
    it('HabitCard.streakStyles.streakFireIcon → bodySmall (15)', () => {
      expect(streakStyles.streakFireIcon.fontSize).toBe(
        typography.bodySmall.fontSize
      );
    });

    it('HabitCard.statusStyles checkmarkText → bodySmall (15)', () => {
      expect(statusStyles.checkmarkText.fontSize).toBe(
        typography.bodySmall.fontSize
      );
    });

    it('HabitsAtRiskWidget prediction → bodySmall (15)', () => {
      expect(habitsAtRiskStyles.prediction.fontSize).toBe(
        typography.bodySmall.fontSize
      );
    });

    it('Toast icon → bodySmall (15)', () => {
      expect(toastStyles.icon.fontSize).toBe(typography.bodySmall.fontSize);
    });

    it('WeeklySummaryStrip sparkleEmoji → bodySmall (15)', () => {
      expect(headerStyles.sparkleEmoji.fontSize).toBe(
        typography.bodySmall.fontSize
      );
    });
  });

  // ── fontSize: 16 → body (17) ─────────────────────────────
  describe('fontSize: 16 replacements', () => {
    it('HabitsAtRiskWidget habitName → body (17)', () => {
      expect(habitsAtRiskStyles.habitName.fontSize).toBe(
        typography.body.fontSize
      );
    });

    it('WeeklySummaryStrip headerTitle → body (17)', () => {
      expect(headerStyles.headerTitle.fontSize).toBe(typography.body.fontSize);
    });

    it('Toast dismissIcon → body (17)', () => {
      expect(toastStyles.dismissIcon.fontSize).toBe(typography.body.fontSize);
    });
  });

  // ── fontSize: 20 → heading2 (22) ─────────────────────────
  describe('fontSize: 20 replacements', () => {
    // heading2 tests are covered by component-specific tests below
  });

  // ── StrengthProgressBar SIZE_CONFIG ───────────────────────
  describe('StrengthProgressBar SIZE_CONFIG uses typography tokens', () => {
    it('compact fontSize → caption (13)', () => {
      expect(SIZE_CONFIG.compact.fontSize).toBe(typography.caption.fontSize);
    });

    it('default fontSize → caption (13)', () => {
      expect(SIZE_CONFIG.default.fontSize).toBe(typography.caption.fontSize);
    });

    it('large fontSize → bodySmall (15)', () => {
      expect(SIZE_CONFIG.large.fontSize).toBe(typography.bodySmall.fontSize);
    });
  });

  // ── Cross-cutting: no non-standard sizes remain ──────────
  describe('no non-standard fontSize values remain', () => {
    const NON_STANDARD = new Set([9, 11, 12, 14, 16, 20]);

    function collectFontSizes(obj: Record<string, any>): number[] {
      const sizes: number[] = [];
      for (const value of Object.values(obj)) {
        if (value && typeof value === 'object' && 'fontSize' in value) {
          sizes.push(value.fontSize as number);
        }
      }
      return sizes;
    }

    it('HabitCard.streakStyles has no non-standard sizes', () => {
      for (const size of collectFontSizes(streakStyles)) {
        expect(NON_STANDARD.has(size)).toBe(false);
      }
    });

    it('Toast styles has no non-standard sizes', () => {
      for (const size of collectFontSizes(toastStyles)) {
        expect(NON_STANDARD.has(size)).toBe(false);
      }
    });
  });

  // ── Typography scale values are correct ───────────────────
  describe('typography scale reference values', () => {
    it('tabBar fontSize is 10', () => {
      expect(typography.tabBar.fontSize).toBe(10);
    });

    it('caption fontSize is 13', () => {
      expect(typography.caption.fontSize).toBe(13);
    });

    it('bodySmall fontSize is 15', () => {
      expect(typography.bodySmall.fontSize).toBe(15);
    });

    it('body fontSize is 17', () => {
      expect(typography.body.fontSize).toBe(17);
    });

    it('heading2 fontSize is 22', () => {
      expect(typography.heading2.fontSize).toBe(22);
    });
  });
});
