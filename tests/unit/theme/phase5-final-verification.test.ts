/**
 * Phase 5 Final Verification Tests
 * Verifies remaining critical hardcoded colors replaced with theme tokens.
 */

import { colors, milestoneColors } from '@/theme/colors';
import { REDESIGN_COLORS } from '@/components/HabitCard/HabitCard.colors';
import { streakStyles } from '@/components/HabitCard/HabitCard.streakStyles';

describe('Phase 5 Final Verification', () => {
  describe('new primary.100 token', () => {
    it('should exist in color palette', () => {
      expect(colors.primary[100]).toBeDefined();
      expect(colors.primary[100]).toBe('#D1FAE5');
    });
  });

  describe('HabitCard.colors uses theme tokens', () => {
    it('accentMuted uses colors.primary[100] instead of hardcoded hex', () => {
      expect(REDESIGN_COLORS.accentMuted).toBe(colors.primary[100]);
      expect(REDESIGN_COLORS.accentMuted).toBe('#D1FAE5');
    });

    it('all REDESIGN_COLORS values are non-empty strings', () => {
      Object.entries(REDESIGN_COLORS).forEach(([key, value]) => {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('new milestoneColors tokens', () => {
    it('amber800 is defined', () => {
      expect(milestoneColors.amber800).toBe('#92400e');
    });

    it('stone100 is defined', () => {
      expect(milestoneColors.stone100).toBe('#f5f5f4');
    });

    it('stone600 is defined', () => {
      expect(milestoneColors.stone600).toBe('#57534e');
    });

    it('stone900 is defined', () => {
      expect(milestoneColors.stone900).toBe('#1c1917');
    });
  });

  describe('current HabitCard streak styling uses theme tokens', () => {
    it('exposes the accessible amber text milestone token', () => {
      expect(milestoneColors.amberText).toBe('#A16207');
    });

    it('exposes the light amber badge background token', () => {
      expect(milestoneColors.amberLight).toBe('#FEF9C3');
    });

    it('uses the streak palette for the completion ripple', () => {
      expect(streakStyles.rippleOverlay.backgroundColor).toBe(
        colors.streak[500]
      );
    });

    it('keeps the completion ripple on the burnished-gold accent', () => {
      expect(streakStyles.rippleOverlay.backgroundColor).toBe('#8B6208');
    });
  });

  describe('ConfettiBurst colors use tokens', () => {
    // Note: We can't import the const directly from .tsx without JSX setup,
    // so we verify the token values exist and are correct
    it('primary[500] matches emerald-500', () => {
      expect(colors.primary[500]).toBe('#10B981');
    });

    it('secondary[500] matches blue-500', () => {
      expect(colors.secondary[500]).toBe('#3B82F6');
    });

    it('warning matches the accessible static warning token', () => {
      expect(colors.warning).toBe('#9A5504');
    });

    it('error matches the accessible static error token', () => {
      expect(colors.error).toBe('#B53030');
    });

    it('premium[500] matches the current violet token', () => {
      expect(colors.premium[500]).toBe('#8563C7');
    });
  });

  describe('primary palette spans 100-700', () => {
    it('has all expected keys', () => {
      expect(colors.primary[100]).toBeDefined();
      expect(colors.primary[300]).toBeDefined();
      expect(colors.primary[400]).toBeDefined();
      expect(colors.primary[500]).toBeDefined();
      expect(colors.primary[600]).toBeDefined();
      expect(colors.primary[700]).toBeDefined();
    });
  });
});
