/**
 * Font sizes on remaining StyleSheet components
 */

import { typography } from '@/theme/typography';
import { streakStyles } from '@/components/HabitCard/HabitCard.streakStyles';
import { styles as toastStyles } from '@/components/Toast/styles';
import { styles as swipeStyles } from '@/components/SwipeableActionButton/styles';
import { styles as heatmapToggleStyles } from '@/components/BinaryHeatmap/TimeRangeToggle.styles';
import { dayCellStyles } from '@/components/ProgressSectionConsolidated/WeeklySummaryStrip/dayCellStyles';
import { headerStyles } from '@/components/ProgressSectionConsolidated/WeeklySummaryStrip/headerStyles';
import { progressStyles } from '@/components/ProgressSectionConsolidated/MilestoneProgress/styles/progress.styles';
import { SIZE_CONFIG } from '@/components/StrengthProgressBar/StrengthProgressBar.constants';
import { statusStyles } from '@/components/HabitCard/HabitCard.statusStyles';

const STANDARD_SIZES = new Set([10, 13, 14, 17, 20, 22, 34]);

describe('Font size standardization', () => {
  it('maps small chrome to tabBar / caption / bodySmall', () => {
    expect(streakStyles.bestStreakText.fontSize).toBe(typography.tabBar.fontSize);
    expect(swipeStyles.swipeLabel.fontSize).toBe(typography.tabBar.fontSize);
    expect(heatmapToggleStyles.buttonText.fontSize).toBe(
      typography.tabBar.fontSize
    );
    expect(dayCellStyles.dayLabel.fontSize).toBe(typography.tabBar.fontSize);
    expect(headerStyles.perfectBadgeText.fontSize).toBe(
      typography.tabBar.fontSize
    );
    expect(progressStyles.progressLabelText.fontSize).toBe(
      typography.tabBar.fontSize
    );
    expect(streakStyles.streakText.fontSize).toBe(typography.caption.fontSize);
    expect(statusStyles.warningText.fontSize).toBe(typography.caption.fontSize);
    expect(progressStyles.milestoneName.fontSize).toBe(
      typography.caption.fontSize
    );
    expect(streakStyles.streakFireIcon.fontSize).toBe(
      typography.bodySmall.fontSize
    );
    expect(statusStyles.checkmarkText.fontSize).toBe(
      typography.bodySmall.fontSize
    );
    expect(toastStyles.icon.fontSize).toBe(typography.bodySmall.fontSize);
    expect(headerStyles.sparkleEmoji.fontSize).toBe(
      typography.bodySmall.fontSize
    );
  });

  it('maps body-sized chrome to body (17)', () => {
    expect(headerStyles.headerTitle.fontSize).toBe(typography.button.fontSize);
    expect(toastStyles.dismissIcon.fontSize).toBe(typography.body.fontSize);
  });

  it('StrengthProgressBar SIZE_CONFIG uses caption / bodySmall', () => {
    expect(SIZE_CONFIG.compact.fontSize).toBe(typography.caption.fontSize);
    expect(SIZE_CONFIG.default.fontSize).toBe(typography.caption.fontSize);
    expect(SIZE_CONFIG.large.fontSize).toBe(typography.bodySmall.fontSize);
  });

  it('typography scale matches current tokens', () => {
    expect(typography.tabBar.fontSize).toBe(10);
    expect(typography.caption.fontSize).toBe(13);
    expect(typography.bodySmall.fontSize).toBe(14);
    expect(typography.body.fontSize).toBe(17);
    expect(typography.heading3.fontSize).toBe(20);
    expect(typography.heading2.fontSize).toBe(22);
  });

  it('HabitCard streak + Toast sizes stay on the scale', () => {
    const collect = (obj: Record<string, { fontSize?: number }>) =>
      Object.values(obj)
        .map((v) => v?.fontSize)
        .filter((n): n is number => typeof n === 'number');
    for (const size of [...collect(streakStyles), ...collect(toastStyles)]) {
      expect(STANDARD_SIZES.has(size)).toBe(true);
    }
  });
});
