/**
 * CreateHabitModal Token Migration Tests (Phase 2, Task 2)
 * Verifies that CreateHabitModal component files use theme tokens
 * instead of hardcoded #3b82f6 hex values for styling.
 */

import { colors } from '@/theme/colors';
import { CATEGORY_COLORS } from '@/components/CreateHabitModal/components/CategoryFilters/CategoryFilters.colors';
import { CONFETTI_COLORS } from '@/components/CreateHabitModal/components/SuccessAnimation/constants';
import { QUICK_PICK_TEMPLATES } from '@/components/CreateHabitModal/components/QuickPicksRow/constants';
import { SUGGESTIONS as NAME_SUGGESTIONS } from '@/components/CreateHabitModal/components/nameSuggestions.constants';
import { SUGGESTIONS as SMART_SUGGESTIONS } from '@/components/CreateHabitModal/components/SmartSuggestions/suggestions.data';

describe('CreateHabitModal Token Migration - Phase 2', () => {
  describe('colors.secondary[500] equals #3B82F6', () => {
    it('theme token should resolve to expected blue hex', () => {
      expect(colors.secondary[500]).toBe('#3B82F6');
    });
  });

  describe('CategoryFilters.colors uses theme token', () => {
    it('productivity bgSelected should use colors.secondary[500]', () => {
      expect(CATEGORY_COLORS.productivity.bgSelected).toBe(
        colors.secondary[500]
      );
    });
  });

  describe('SuccessAnimation confetti uses theme token', () => {
    it('confetti colors should include colors.secondary[500]', () => {
      expect(CONFETTI_COLORS).toContain(colors.secondary[500]);
    });

    it('confetti colors should include colors.primary[500]', () => {
      expect(CONFETTI_COLORS).toContain(colors.primary[500]);
    });
  });

  describe('QuickPicksRow uses theme token', () => {
    it('Read template should use colors.secondary[500]', () => {
      const readTemplate = QUICK_PICK_TEMPLATES.find((t) => t.id === 'read');
      expect(readTemplate?.color).toBe(colors.secondary[500]);
    });
  });

  describe('nameSuggestions uses theme token', () => {
    it('Learn something new should use colors.secondary[500]', () => {
      const learnSuggestion = NAME_SUGGESTIONS.find(
        (s) => s.name === 'Learn something new'
      );
      expect(learnSuggestion?.color).toBe(colors.secondary[500]);
    });
  });

  describe('SmartSuggestions data uses theme token', () => {
    it('Learn something new should use colors.secondary[500]', () => {
      const learnSuggestion = SMART_SUGGESTIONS.find(
        (s) => s.name === 'Learn something new'
      );
      expect(learnSuggestion?.color).toBe(colors.secondary[500]);
    });
  });
});
