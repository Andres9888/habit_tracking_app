/**
 * WeeklyInsightsCard Token Migration Tests (Phase 3)
 * Verifies that WeeklyInsightsCard styles use borderRadius tokens
 * instead of hardcoded values.
 */

import { suggestedActionsStyles } from '@/components/WeeklyInsightsCard/SuggestedActions.styles';
import { summaryStyles } from '@/components/WeeklyInsightsCard/SummarySection.styles';
import { borderRadius } from '@/theme/spacing';

describe('WeeklyInsightsCard Token Migration - Phase 3', () => {
  describe('SuggestedActions uses borderRadius tokens', () => {
    it('suggestedActions uses borderRadius.small', () => {
      expect(suggestedActionsStyles.suggestedActions.borderRadius).toBe(
        borderRadius.small
      );
      expect(suggestedActionsStyles.suggestedActions.borderRadius).toBe(8);
    });
  });

  describe('SummarySection uses borderRadius tokens', () => {
    it('summaryCard uses borderRadius.small', () => {
      expect(summaryStyles.summaryCard.borderRadius).toBe(borderRadius.small);
      expect(summaryStyles.summaryCard.borderRadius).toBe(8);
    });
  });

  describe('No hardcoded borderRadius values remain', () => {
    it('all SuggestedActions borderRadius values use tokens', () => {
      const allStyles = Object.values(suggestedActionsStyles);
      for (const style of allStyles) {
        if (style && typeof style === 'object' && 'borderRadius' in style) {
          const value = (style as Record<string, unknown>).borderRadius;
          expect([
            borderRadius.xs,
            borderRadius.small,
            borderRadius.medium,
            borderRadius.large,
            borderRadius.xl,
            borderRadius.full,
          ]).toContain(value);
        }
      }
    });

    it('all SummarySection borderRadius values use tokens', () => {
      const allStyles = Object.values(summaryStyles);
      for (const style of allStyles) {
        if (style && typeof style === 'object' && 'borderRadius' in style) {
          const value = (style as Record<string, unknown>).borderRadius;
          expect([
            borderRadius.xs,
            borderRadius.small,
            borderRadius.medium,
            borderRadius.large,
            borderRadius.xl,
            borderRadius.full,
          ]).toContain(value);
        }
      }
    });
  });
});
