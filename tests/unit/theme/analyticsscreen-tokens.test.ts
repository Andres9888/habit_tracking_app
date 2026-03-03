/**
 * AnalyticsScreen styles Theme Token Migration Tests
 * Validates raw borderRadius values were replaced with borderRadius tokens.
 */

import { borderRadius } from '../../../src/theme/spacing';
import { styles as analyticsStyles } from '../../../src/screens/AnalyticsScreen/AnalyticsScreen.styles';
import { styles as statCardStyles } from '../../../src/screens/AnalyticsScreen/components/StatCard.styles';

describe('AnalyticsScreen styles - Theme Token Migration', () => {
  describe('AnalyticsScreen.styles', () => {
    it('uses borderRadius.medium for exportButton', () => {
      expect(analyticsStyles.exportButton.borderRadius).toBe(
        borderRadius.medium
      );
    });

    it('borderRadius.medium resolves to 12', () => {
      expect(borderRadius.medium).toBe(12);
    });
  });

  describe('StatCard.styles', () => {
    it('uses borderRadius.xs for skeletonSubtitle', () => {
      expect(statCardStyles.skeletonSubtitle.borderRadius).toBe(
        borderRadius.xs
      );
    });

    it('uses borderRadius.xs for skeletonTitle', () => {
      expect(statCardStyles.skeletonTitle.borderRadius).toBe(borderRadius.xs);
    });

    it('uses borderRadius.xs for skeletonValue', () => {
      expect(statCardStyles.skeletonValue.borderRadius).toBe(borderRadius.xs);
    });

    it('uses borderRadius.large for statCard', () => {
      expect(statCardStyles.statCard.borderRadius).toBe(borderRadius.large);
    });

    it('borderRadius.xs resolves to 4', () => {
      expect(borderRadius.xs).toBe(4);
    });

    it('borderRadius.large resolves to 16', () => {
      expect(borderRadius.large).toBe(16);
    });
  });
});
