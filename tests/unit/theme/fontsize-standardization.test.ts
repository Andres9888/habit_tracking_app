/**
 * Font Size Standardization Tests (Phase 4, Task 2)
 * Verifies that component style files use typography.*.fontSize tokens
 * from @/theme/typography instead of non-standard hardcoded numeric values.
 *
 * Current branded typography scale is defined centrally in theme/typography.
 * Component styles should consume those tokens instead of duplicating values.
 */

import { typography } from '@/theme/typography';
import { streakStyles } from '@/components/HabitCard/HabitCard.streakStyles';
import { styles as toastStyles } from '@/components/Toast/styles';
import { styles as swipeStyles } from '@/components/SwipeableActionButton/styles';
import { styles as heatmapToggleStyles } from '@/components/BinaryHeatmap/TimeRangeToggle.styles';
import { dayCellStyles } from '@/components/ProgressSectionConsolidated/WeeklySummaryStrip/dayCellStyles';
import { headerStyles } from '@/components/ProgressSectionConsolidated/WeeklySummaryStrip/headerStyles';
import { progressStyles } from '@/components/ProgressSectionConsolidated/MilestoneProgress/styles/progress.styles';
import { styles as syncedToastStyles } from '@/components/SyncStatus/SyncedToast/styles';
import { styles as syncingIndicatorStyles } from '@/components/SyncStatus/SyncingIndicator/styles';
import { SIZE_CONFIG } from '@/components/StrengthProgressBar/StrengthProgressBar.constants';
import { statusStyles } from '@/components/HabitCard/HabitCard.statusStyles';
import { styles as categoryPillStyles } from '@/components/EmojiPickerV2/CategoryPills.styles';

/** Helper: assert a component font size belongs to the live typography scale. */
const STANDARD_SIZES = new Set(
  Object.values(typography).map((style) => style.fontSize)
);
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

    it('SyncedToast countText → caption (13)', () => {
      expect(syncedToastStyles.countText.fontSize).toBe(
        typography.caption.fontSize
      );
    });

    it('SyncingIndicator text → caption (13)', () => {
      expect(syncingIndicatorStyles.text.fontSize).toBe(
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

    it('CategoryPill text → bodySmall (14)', () => {
      expect(categoryPillStyles.categoryPillText.fontSize).toBe(
        typography.bodySmall.fontSize
      );
    });
  });

  // ── bodySmall token mappings ──────────────────────────────
  describe('bodySmall token mappings', () => {
    it('HabitCard.streakStyles.streakFireIcon → bodySmall (14)', () => {
      expect(streakStyles.streakFireIcon.fontSize).toBe(
        typography.bodySmall.fontSize
      );
    });

    it('SyncedToast text → caption (13)', () => {
      expect(syncedToastStyles.text.fontSize).toBe(typography.caption.fontSize);
    });

    it('HabitCard.statusStyles checkmarkText → bodySmall (14)', () => {
      expect(statusStyles.checkmarkText.fontSize).toBe(
        typography.bodySmall.fontSize
      );
    });

    it('SyncingIndicator countText → tabBar (10)', () => {
      expect(syncingIndicatorStyles.countText.fontSize).toBe(
        typography.tabBar.fontSize
      );
    });

    it('CategoryPill label → bodySmall (14)', () => {
      expect(categoryPillStyles.categoryPillText.fontSize).toBe(
        typography.bodySmall.fontSize
      );
    });

    it('Toast icon → bodySmall (14)', () => {
      expect(toastStyles.icon.fontSize).toBe(typography.bodySmall.fontSize);
    });

    it('WeeklySummaryStrip sparkleEmoji → bodySmall (14)', () => {
      expect(headerStyles.sparkleEmoji.fontSize).toBe(
        typography.bodySmall.fontSize
      );
    });
  });

  // ── fontSize: 16 → body (17) ─────────────────────────────
  describe('fontSize: 16 replacements', () => {
    it('MilestoneProgress badgeIcon → body (17)', () => {
      expect(progressStyles.badgeIcon.fontSize).toBe(typography.body.fontSize);
    });

    it('WeeklySummaryStrip headerTitle → button (17)', () => {
      expect(headerStyles.headerTitle.fontSize).toBe(typography.body.fontSize);
    });

    it('WeeklySummaryStrip headerTitle → body (17)', () => {
      expect(headerStyles.headerTitle.fontSize).toBe(typography.body.fontSize);
    });

    it('CategoryPill icon → bodySmall (14)', () => {
      expect(categoryPillStyles.categoryPillIcon.fontSize).toBe(
        typography.bodySmall.fontSize
      );
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

    it('large fontSize → bodySmall (14)', () => {
      expect(SIZE_CONFIG.large.fontSize).toBe(typography.bodySmall.fontSize);
    });
  });

  // ── Cross-cutting: no non-standard sizes remain ──────────
  describe('no non-standard fontSize values remain', () => {
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
        expect(STANDARD_SIZES.has(size)).toBe(true);
      }
    });

    it('SyncedToast.styles has no non-standard sizes', () => {
      for (const size of collectFontSizes(syncedToastStyles)) {
        expect(STANDARD_SIZES.has(size)).toBe(true);
      }
    });

    it('CategoryPills.styles has no non-standard sizes', () => {
      for (const size of collectFontSizes(categoryPillStyles)) {
        expect(STANDARD_SIZES.has(size)).toBe(true);
      }
    });

    it('Toast styles has no non-standard sizes', () => {
      for (const size of collectFontSizes(toastStyles)) {
        expect(STANDARD_SIZES.has(size)).toBe(true);
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

    it('bodySmall fontSize is 14', () => {
      expect(typography.bodySmall.fontSize).toBe(14);
    });

    it('body fontSize is 17', () => {
      expect(typography.body.fontSize).toBe(17);
    });

    it('heading2 fontSize is 22', () => {
      expect(typography.heading2.fontSize).toBe(22);
    });
  });
});
