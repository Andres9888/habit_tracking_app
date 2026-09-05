/**
 * HabitCard color tokens
 */

import { colors, milestoneColors } from '@/theme/colors';
import { statusStyles } from '@/components/HabitCard/HabitCard.statusStyles';

describe('HabitCard tokens', () => {
  it('uses inverse text on checkmarks', () => {
    expect(statusStyles.checkmarkText.color).toBe(colors.text.inverse);
  });

  // Dropped: swipe-action text + streak-ripple colour assertions — their only
  // subjects (HabitCard.actionStyles/streakStyles) were deleted as dead code.

  it('keeps milestone amber text', () => {
    expect(milestoneColors.amberText).toBe('#A16207');
  });
});
