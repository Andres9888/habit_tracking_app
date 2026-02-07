/**
 * HabitCard Spacing & Border Radius Token Tests (Phase 3)
 * Verifies that HabitCard style files use theme spacing and
 * borderRadius tokens instead of hardcoded numeric values.
 */

import { spacing, borderRadius } from '@/theme/spacing';
import { statusStyles } from '@/components/HabitCard/HabitCard.statusStyles';
import { streakStyles } from '@/components/HabitCard/HabitCard.streakStyles';
import { styles } from '@/components/HabitCard/HabitCard.styles';

describe('HabitCard Spacing Token Migration - Phase 3', () => {
  describe('core styles use spacing tokens', () => {
    it('card borderRadius should use borderRadius.medium (12)', () => {
      expect(styles.card.borderRadius).toBe(borderRadius.medium);
      expect(styles.card.borderRadius).toBe(12);
    });

    it('cardsContainer borderRadius should use borderRadius.xl (20)', () => {
      expect(styles.cardsContainer.borderRadius).toBe(borderRadius.xl);
      expect(styles.cardsContainer.borderRadius).toBe(20);
    });

    it('cardsContainer marginHorizontal should use spacing.md (12)', () => {
      expect(styles.cardsContainer.marginHorizontal).toBe(spacing.md);
      expect(styles.cardsContainer.marginHorizontal).toBe(12);
    });

    it('cardsContainer padding should use spacing.md (12)', () => {
      expect(styles.cardsContainer.padding).toBe(spacing.md);
      expect(styles.cardsContainer.padding).toBe(12);
    });

    it('container marginVertical should use spacing.xs (4)', () => {
      expect(styles.container.marginVertical).toBe(spacing.xs);
      expect(styles.container.marginVertical).toBe(4);
    });

    it('content padding should use spacing.base (16)', () => {
      expect(styles.content.padding).toBe(spacing.base);
      expect(styles.content.padding).toBe(16);
    });

    it('habitInfo gap should use spacing.md (12)', () => {
      expect(styles.habitInfo.gap).toBe(spacing.md);
      expect(styles.habitInfo.gap).toBe(12);
    });
  });

  describe('statusStyles use spacing/borderRadius tokens', () => {
    it('checkCircle borderRadius should use borderRadius.full (9999)', () => {
      expect(styles.checkCircle.borderRadius).toBe(borderRadius.full);
      expect(styles.checkCircle.borderRadius).toBe(9999);
    });

    it('checkmark borderRadius should use borderRadius.full (9999)', () => {
      expect(styles.checkmark.borderRadius).toBe(borderRadius.full);
      expect(styles.checkmark.borderRadius).toBe(9999);
    });

    it('statusContainer gap should use spacing.sm (8)', () => {
      expect(styles.statusContainer.gap).toBe(spacing.sm);
      expect(styles.statusContainer.gap).toBe(8);
    });

    it('statusContainer marginLeft should use spacing.sm (8)', () => {
      expect(styles.statusContainer.marginLeft).toBe(spacing.sm);
      expect(styles.statusContainer.marginLeft).toBe(8);
    });

    it('streakBadge borderRadius should use borderRadius.large (16)', () => {
      expect(styles.streakBadge.borderRadius).toBe(borderRadius.large);
      expect(styles.streakBadge.borderRadius).toBe(16);
    });

    it('streakBadge paddingHorizontal should use spacing.sm (8)', () => {
      expect(styles.streakBadge.paddingHorizontal).toBe(spacing.sm);
      expect(styles.streakBadge.paddingHorizontal).toBe(8);
    });

    it('streakBadge paddingVertical should use spacing.xs (4)', () => {
      expect(styles.streakBadge.paddingVertical).toBe(spacing.xs);
      expect(styles.streakBadge.paddingVertical).toBe(4);
    });

    it('warningBadge borderRadius should use borderRadius.medium (12)', () => {
      expect(styles.warningBadge.borderRadius).toBe(borderRadius.medium);
      expect(styles.warningBadge.borderRadius).toBe(12);
    });
  });

  describe('streakStyles use spacing/borderRadius tokens', () => {
    it('bestStreakBadge borderRadius should use borderRadius.small (8)', () => {
      expect(streakStyles.bestStreakBadge.borderRadius).toBe(
        borderRadius.small
      );
      expect(streakStyles.bestStreakBadge.borderRadius).toBe(8);
    });

    it('bestStreakBadge gap should use spacing.xs (4)', () => {
      expect(streakStyles.bestStreakBadge.gap).toBe(spacing.xs);
      expect(streakStyles.bestStreakBadge.gap).toBe(4);
    });

    it('bestStreakBadge paddingHorizontal should use spacing.sm (8)', () => {
      expect(streakStyles.bestStreakBadge.paddingHorizontal).toBe(spacing.sm);
      expect(streakStyles.bestStreakBadge.paddingHorizontal).toBe(8);
    });

    it('bestStreakBadge paddingVertical should use spacing.xs (4)', () => {
      expect(streakStyles.bestStreakBadge.paddingVertical).toBe(spacing.xs);
      expect(streakStyles.bestStreakBadge.paddingVertical).toBe(4);
    });

    it('rippleOverlay borderRadius should use borderRadius.xl (20)', () => {
      expect(streakStyles.rippleOverlay.borderRadius).toBe(borderRadius.xl);
      expect(streakStyles.rippleOverlay.borderRadius).toBe(20);
    });

    it('streakBadge borderRadius should use borderRadius.medium (12)', () => {
      expect(streakStyles.streakBadge.borderRadius).toBe(borderRadius.medium);
      expect(streakStyles.streakBadge.borderRadius).toBe(12);
    });

    it('streakBadge gap should use spacing.xs (4)', () => {
      expect(streakStyles.streakBadge.gap).toBe(spacing.xs);
      expect(streakStyles.streakBadge.gap).toBe(4);
    });

    it('streakBadge paddingHorizontal should use spacing.sm (8)', () => {
      expect(streakStyles.streakBadge.paddingHorizontal).toBe(spacing.sm);
      expect(streakStyles.streakBadge.paddingHorizontal).toBe(8);
    });

    it('streakBadge paddingVertical should use spacing.xs (4)', () => {
      expect(streakStyles.streakBadge.paddingVertical).toBe(spacing.xs);
      expect(streakStyles.streakBadge.paddingVertical).toBe(4);
    });

    it('streakRow gap should use spacing.sm (8)', () => {
      expect(streakStyles.streakRow.gap).toBe(spacing.sm);
      expect(streakStyles.streakRow.gap).toBe(8);
    });

    it('streakRow marginTop should use spacing.xs (4)', () => {
      expect(streakStyles.streakRow.marginTop).toBe(spacing.xs);
      expect(streakStyles.streakRow.marginTop).toBe(4);
    });
  });
});
