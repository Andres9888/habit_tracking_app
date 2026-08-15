/**
 * HabitCard spacing / radius tokens
 */

import { spacing, borderRadius } from '@/theme/spacing';
import { airy } from '@/theme/airyScale';
import { streakStyles } from '@/components/HabitCard/HabitCard.streakStyles';
import { styles } from '@/components/HabitCard/HabitCard.styles';

describe('HabitCard spacing tokens', () => {
  it('uses airy card radius and home-list padding', () => {
    expect(styles.card.borderRadius).toBe(borderRadius.large);
    expect(styles.cardsContainer.borderRadius).toBe(borderRadius.xl);
    expect(styles.cardsContainer.marginHorizontal).toBe(spacing.md);
    expect(styles.cardsContainer.padding).toBe(spacing.md);
    expect(styles.container.marginVertical).toBe(spacing.sm);
    expect(styles.content.padding).toBe(airy.habitCardPadding);
    expect(styles.habitInfo.gap).toBe(spacing.md);
  });

  it('uses full/large/medium radii on status chrome', () => {
    expect(styles.checkCircle.borderRadius).toBe(borderRadius.full);
    expect(styles.checkmark.borderRadius).toBe(borderRadius.full);
    expect(styles.statusContainer.gap).toBe(spacing.sm);
    expect(styles.streakBadge.borderRadius).toBe(borderRadius.large);
    expect(styles.warningBadge.borderRadius).toBe(borderRadius.medium);
  });

  it('uses spacing tokens on streak badges', () => {
    expect(streakStyles.bestStreakBadge.borderRadius).toBe(borderRadius.small);
    expect(streakStyles.bestStreakBadge.gap).toBe(spacing.xs);
    expect(streakStyles.rippleOverlay.borderRadius).toBe(borderRadius.xl);
    expect(streakStyles.streakBadge.borderRadius).toBe(borderRadius.medium);
    expect(streakStyles.streakRow.gap).toBe(spacing.sm);
    expect(streakStyles.streakRow.marginTop).toBe(spacing.xs);
  });
});
