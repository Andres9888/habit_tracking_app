/**
 * HabitCard Style Token Migration Tests (Phase 2)
 * Verifies that HabitCard style files use theme tokens
 * instead of hardcoded hex values.
 */

import { colors, milestoneColors } from '@/theme/colors';
import { statusStyles } from '@/components/HabitCard/HabitCard.statusStyles';
import { actionStyles } from '@/components/HabitCard/HabitCard.actionStyles';
import { streakStyles } from '@/components/HabitCard/HabitCard.streakStyles';

describe('HabitCard Token Migration - Phase 2', () => {
  describe('statusStyles uses theme tokens', () => {
    it('checkmarkText should use colors.text.inverse for white', () => {
      expect(statusStyles.checkmarkText.color).toBe(colors.text.inverse);
      expect(statusStyles.checkmarkText.color).toBe('#FFFFFF');
    });
  });

  describe('actionStyles uses theme tokens', () => {
    it('actionText should use colors.text.inverse for white', () => {
      expect(actionStyles.actionText.color).toBe(colors.text.inverse);
      expect(actionStyles.actionText.color).toBe('#FFFFFF');
    });
  });

  describe('streakStyles uses theme tokens', () => {
    it('rippleOverlay should use the burnished-gold streak token', () => {
      expect(streakStyles.rippleOverlay.backgroundColor).toBe(
        colors.streak[500]
      );
      expect(streakStyles.rippleOverlay.backgroundColor).toBe('#8B6208');
    });
  });

  describe('milestoneColors has amberText token', () => {
    it('amberText should be #A16207', () => {
      expect(milestoneColors.amberText).toBe('#A16207');
    });
  });
});
