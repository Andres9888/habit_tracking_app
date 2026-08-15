/**
 * Test suite for borderRadius standardization across all components
 * Phase 3 Task 5 - Non-standard borderRadius values → theme tokens
 *
 * Token scale: xs(4), small(8), medium(12), large(16), xl(20), full(9999)
 */

import { borderRadius } from '@/theme/spacing';

describe('borderRadius token scale', () => {
  it('should include xs token', () => {
    expect(borderRadius.xs).toBe(4);
  });

  it('should have correct token values', () => {
    expect(borderRadius.xs).toBe(4);
    expect(borderRadius.small).toBe(8);
    expect(borderRadius.medium).toBe(12);
    expect(borderRadius.large).toBe(16);
    expect(borderRadius.xl).toBe(20);
    expect(borderRadius.full).toBe(9999);
  });
});

describe('borderRadius: 4 → borderRadius.xs', () => {
  it('HabitRankingsList/itemStyles uses xs for riskBadge', () => {
    const { itemStyles } = require('@/components/HabitRankingsList/itemStyles');
    expect(itemStyles.riskBadge.borderRadius).toBe(borderRadius.xs);
  });

  it('HabitStrengthIndicator/styles uses xs for full variant', () => {
    const { styles } = require('@/components/HabitStrengthIndicator/styles');
    expect(styles.fullBar.borderRadius).toBe(borderRadius.xs);
    expect(styles.fullBarContainer.borderRadius).toBe(borderRadius.xs);
  });

  it('MilestoneProgress/progress.styles uses xs for progress bars', () => {
    const {
      progressStyles,
    } = require('@/components/ProgressSectionConsolidated/MilestoneProgress/styles/progress.styles');
    expect(progressStyles.progressBarFill.borderRadius).toBe(borderRadius.xs);
    expect(progressStyles.progressBarTrack.borderRadius).toBe(borderRadius.xs);
  });

  it('SyncStatus/PendingSyncBadge uses xs for badgeSmall', () => {
    const {
      styles,
    } = require('@/components/SyncStatus/PendingSyncBadge/styles');
    expect(styles.badgeSmall.borderRadius).toBe(borderRadius.xs);
  });

  it('TemplateScienceModal/science.styles uses xs for citationDot', () => {
    const {
      scienceStyles,
    } = require('@/components/TemplateScienceModal/styles/science.styles');
    expect(scienceStyles.citationDot.borderRadius).toBe(borderRadius.xs);
  });
});

describe('borderRadius: 6 → borderRadius.small', () => {
  it('SyncStatus/PendingSyncBadge uses small for badge', () => {
    const {
      styles,
    } = require('@/components/SyncStatus/PendingSyncBadge/styles');
    expect(styles.badge.borderRadius).toBe(borderRadius.small);
  });

  it('OfflinePendingBanner/stats.styles uses small for warningContainer', () => {
    const {
      statsStyles,
    } = require('@/components/OfflinePendingBanner/styles/stats.styles');
    expect(statsStyles.warningContainer.borderRadius).toBe(borderRadius.small);
  });
});

describe('borderRadius: 10 → borderRadius.medium', () => {
  it('ArchiveUndoToast uses medium for iconContainer and undoButton', () => {
    const { styles } = require('@/components/ArchiveUndoToast/styles');
    expect(styles.iconContainer.borderRadius).toBe(borderRadius.medium);
    expect(styles.undoButton.borderRadius).toBe(borderRadius.medium);
  });

  it('DeleteUndoToast uses medium for iconContainer and undoButton', () => {
    const { styles } = require('@/components/DeleteUndoToast/styles');
    expect(styles.iconContainer.borderRadius).toBe(borderRadius.medium);
    expect(styles.undoButton.borderRadius).toBe(borderRadius.medium);
  });

  it('WeeklySummaryStrip/headerStyles uses medium for perfectBadge', () => {
    const {
      headerStyles,
    } = require('@/components/ProgressSectionConsolidated/WeeklySummaryStrip/headerStyles');
    expect(headerStyles.perfectBadge.borderRadius).toBe(borderRadius.medium);
  });

  it('TipQuickActionsSheet uses medium for iconContainer', () => {
    const {
      styles,
    } = require('@/components/ProgressSectionConsolidated/TipQuickActionsSheet/styles');
    expect(styles.iconContainer.borderRadius).toBe(borderRadius.medium);
  });

  it('SyncStatus/SyncedToast uses medium for iconContainer', () => {
    const { styles } = require('@/components/SyncStatus/SyncedToast/styles');
    expect(styles.iconContainer.borderRadius).toBe(borderRadius.medium);
  });

  it('FullsizeTemplatePreview/tips uses medium for tipIconContainer', () => {
    const {
      tipsStyles,
    } = require('@/components/FullsizeTemplatePreview/styles/tips.styles');
    expect(tipsStyles.tipIconContainer.borderRadius).toBe(borderRadius.medium);
  });

  it('FullsizeTemplatePreview/science uses medium for researchLinkButton', () => {
    const {
      scienceStyles,
    } = require('@/components/FullsizeTemplatePreview/styles/science.styles');
    expect(scienceStyles.researchLinkButton.borderRadius).toBe(
      borderRadius.medium
    );
  });
});

describe('borderRadius: 18 → borderRadius.full (circular 36px elements)', () => {
  it('OfflinePendingBanner/layout uses full for circular iconContainer', () => {
    const {
      layoutStyles,
    } = require('@/components/OfflinePendingBanner/styles/layout.styles');
    expect(layoutStyles.iconContainer.borderRadius).toBe(borderRadius.full);
  });

  it('WeeklySummaryStrip/dayCellStyles uses full for circular dayCircle', () => {
    const {
      dayCellStyles,
    } = require('@/components/ProgressSectionConsolidated/WeeklySummaryStrip/dayCellStyles');
    expect(dayCellStyles.dayCircle.borderRadius).toBe(borderRadius.full);
  });
});

describe('borderRadius: 24 → borderRadius.xl', () => {
  it('ArchiveUndoToast uses xl for toast', () => {
    const { styles } = require('@/components/ArchiveUndoToast/styles');
    expect(styles.toast.borderRadius).toBe(borderRadius.xl);
  });

  it('DeleteUndoToast uses xl for toast', () => {
    const { styles } = require('@/components/DeleteUndoToast/styles');
    expect(styles.toast.borderRadius).toBe(borderRadius.xl);
  });

  it('FullsizeTemplatePreview/hero uses xl for iconContainer', () => {
    const {
      heroStyles,
    } = require('@/components/FullsizeTemplatePreview/styles/hero.styles');
    expect(heroStyles.iconContainer.borderRadius).toBe(borderRadius.xl);
  });

  it('FullsizeTemplatePreview/footer uses xl for successButtonGlow', () => {
    const {
      footerStyles,
    } = require('@/components/FullsizeTemplatePreview/styles/footer.styles');
    expect(footerStyles.successButtonGlow.borderRadius).toBe(borderRadius.xl);
  });

  it('TodaysFocusCard/elementStyles uses xl for iconContainer', () => {
    const {
      elementStyles,
    } = require('@/components/ProgressSectionConsolidated/TodaysFocusCard/styles/elementStyles');
    expect(elementStyles.iconContainer.borderRadius).toBe(borderRadius.xl);
  });
});

describe('borderRadius: 28/32/48 → borderRadius.full (circular glows)', () => {
  it('TodaysFocusCard uses full for circular badgeContainer (56/2=28)', () => {
    const {
      elementStyles,
    } = require('@/components/ProgressSectionConsolidated/TodaysFocusCard/styles/elementStyles');
    expect(elementStyles.badgeContainer.borderRadius).toBe(borderRadius.full);
  });

  it('FullsizeTemplatePreview/hero uses full for circular iconGlow (96/2=48)', () => {
    const {
      heroStyles,
    } = require('@/components/FullsizeTemplatePreview/styles/hero.styles');
    expect(heroStyles.iconGlow.borderRadius).toBe(borderRadius.full);
  });
});

describe('corner-specific borderRadius tokenized', () => {
  it('ArchiveUndoToast uses xl for bottom corner radii', () => {
    const { styles } = require('@/components/ArchiveUndoToast/styles');
    expect(styles.progressContainer.borderBottomLeftRadius).toBe(
      borderRadius.xl
    );
    expect(styles.progressContainer.borderBottomRightRadius).toBe(
      borderRadius.xl
    );
  });

  it('DeleteUndoToast uses xl for bottom corner radii', () => {
    const { styles } = require('@/components/DeleteUndoToast/styles');
    expect(styles.progressContainer.borderBottomLeftRadius).toBe(
      borderRadius.xl
    );
    expect(styles.progressContainer.borderBottomRightRadius).toBe(
      borderRadius.xl
    );
  });
});
