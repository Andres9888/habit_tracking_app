/**
 * borderRadius standardization on remaining StyleSheet exports
 */

import { borderRadius } from '@/theme/spacing';

describe('borderRadius token scale', () => {
  it('uses airy values', () => {
    expect(borderRadius.xs).toBe(4);
    expect(borderRadius.small).toBe(10);
    expect(borderRadius.medium).toBe(14);
    expect(borderRadius.large).toBe(24);
    expect(borderRadius.xl).toBe(28);
    expect(borderRadius.full).toBe(9999);
  });
});

describe('xs / small / medium / full usage', () => {
  it('HabitRankingsList riskBadge uses xs', () => {
    const { itemStyles } = require('@/components/HabitRankingsList/itemStyles');
    expect(itemStyles.riskBadge.borderRadius).toBe(borderRadius.xs);
  });

  it('HabitStrengthIndicator bars use xs', () => {
    const { styles } = require('@/components/HabitStrengthIndicator/styles');
    expect(styles.fullBar.borderRadius).toBe(borderRadius.xs);
    expect(styles.fullBarContainer.borderRadius).toBe(borderRadius.xs);
  });

  it('MilestoneProgress bars use xs', () => {
    const {
      progressStyles,
    } = require('@/components/ProgressSectionConsolidated/MilestoneProgress/styles/progress.styles');
    expect(progressStyles.progressBarFill.borderRadius).toBe(borderRadius.xs);
    expect(progressStyles.progressBarTrack.borderRadius).toBe(borderRadius.xs);
  });

  it('PendingSyncBadge uses xs/small', () => {
    const {
      styles,
    } = require('@/components/SyncStatus/PendingSyncBadge/styles');
    expect(styles.badgeSmall.borderRadius).toBe(borderRadius.xs);
    expect(styles.badge.borderRadius).toBe(borderRadius.small);
  });

  it('WeeklySummaryStrip perfectBadge uses medium', () => {
    const {
      headerStyles,
    } = require('@/components/ProgressSectionConsolidated/WeeklySummaryStrip/headerStyles');
    expect(headerStyles.perfectBadge.borderRadius).toBe(borderRadius.medium);
  });

  it('SyncedToast icon uses medium', () => {
    const { styles } = require('@/components/SyncStatus/SyncedToast/styles');
    expect(styles.iconContainer.borderRadius).toBe(borderRadius.medium);
  });

  it('circular elements use full', () => {
    const {
      dayCellStyles,
    } = require('@/components/ProgressSectionConsolidated/WeeklySummaryStrip/dayCellStyles');
    const {
      elementStyles,
    } = require('@/components/ProgressSectionConsolidated/TodaysFocusCard/styles/elementStyles');
    expect(dayCellStyles.dayCircle.borderRadius).toBe(borderRadius.full);
    expect(elementStyles.badgeContainer.borderRadius).toBe(borderRadius.full);
  });

  it('TodaysFocusCard icon uses xl', () => {
    const {
      elementStyles,
    } = require('@/components/ProgressSectionConsolidated/TodaysFocusCard/styles/elementStyles');
    expect(elementStyles.iconContainer.borderRadius).toBe(borderRadius.xl);
  });
});
