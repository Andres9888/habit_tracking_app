/**
 * HabitCard color tokens
 */

import { colors, milestoneColors } from '@/theme/colors';
import { statusStyles } from '@/components/HabitCard/HabitCard.statusStyles';
import { actionStyles } from '@/components/HabitCard/HabitCard.actionStyles';
import { streakStyles } from '@/components/HabitCard/HabitCard.streakStyles';

describe('HabitCard tokens', () => {
  it('uses inverse text on checkmarks and swipe actions', () => {
    expect(statusStyles.checkmarkText.color).toBe(colors.text.inverse);
    expect(actionStyles.actionText.color).toBe(colors.text.inverse);
  });

  it('uses burnished gold for the streak ripple', () => {
    expect(streakStyles.rippleOverlay.backgroundColor).toBe(colors.streak[500]);
    expect(streakStyles.rippleOverlay.backgroundColor).toBe('#8B6208');
  });

  it('keeps milestone amber text', () => {
    expect(milestoneColors.amberText).toBe('#A16207');
  });
});
