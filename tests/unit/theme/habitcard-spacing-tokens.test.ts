/**
 * HabitCard spacing / radius tokens
 */

import { spacing, borderRadius } from '@/theme/spacing';
import { airy } from '@/theme/airyScale';
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

  // Dropped: streak-badge spacing assertions — their only subject
  // (HabitCard.streakStyles.ts) was deleted as dead code.
});
