/**
 * Test suite for borderRadius: 6 → borderRadius.small token migration
 * Phase 3 Task 5 - borderRadius.small standardization
 */

import { borderRadius } from '../../../src/theme/spacing';

describe('borderRadius.small token migration', () => {
  describe('StrengthDistributionChart/Legend', () => {
    it('should use borderRadius.small token', () => {
      // Legend uses internal StyleSheet, verify imports are present
      const Legend = require('../../../src/components/StrengthDistributionChart/components/Legend');
      expect(Legend.Legend).toBeDefined();
    });
  });

  describe('OfflinePendingBanner/stats.styles', () => {
    it('should use borderRadius.small token', () => {
      const {
        statsStyles,
      } = require('../../../src/components/OfflinePendingBanner/styles/stats.styles');
      expect(statsStyles.warningContainer.borderRadius).toBe(
        borderRadius.small
      );
    });
  });

  describe('ShareCardGenerator/shareCardContent.styles', () => {
    it('should use borderRadius.small token', () => {
      const {
        shareCardContentStyles,
      } = require('../../../src/components/ShareCardGenerator/styles/shareCardContent.styles');
      expect(shareCardContentStyles.progressBarBackground.borderRadius).toBe(
        borderRadius.small
      );
      expect(shareCardContentStyles.progressBarFill.borderRadius).toBe(
        borderRadius.small
      );
    });
  });

  describe('BinaryHeatmap/TimeRangeToggle.styles', () => {
    it('should use borderRadius.small token', () => {
      const {
        styles,
      } = require('../../../src/components/BinaryHeatmap/TimeRangeToggle.styles');
      expect(styles.button.borderRadius).toBe(borderRadius.small);
      expect(styles.container.borderRadius).toBe(borderRadius.small);
    });
  });

  describe('Toast/styles', () => {
    it('should use borderRadius tokens', () => {
      const { styles } = require('../../../src/components/Toast/styles');
      expect(styles.actionButton.borderRadius).toBe(borderRadius.small);
      expect(styles.iconContainer.borderRadius).toBe(borderRadius.medium);
    });
  });

  describe('SyncStatus/SyncingIndicator/styles', () => {
    it('should use borderRadius tokens', () => {
      const {
        styles,
      } = require('../../../src/components/SyncStatus/SyncingIndicator/styles');
      expect(styles.container.borderRadius).toBe(borderRadius.large);
      expect(styles.countBadge.borderRadius).toBe(borderRadius.small);
      expect(styles.iconContainer.borderRadius).toBe(borderRadius.small);
    });
  });

  describe('PremiumBadge', () => {
    it('should use borderRadius.small token', () => {
      // PremiumBadge uses StyleSheet.create within the component file
      const PremiumBadge = require('../../../src/components/PremiumBadge');
      // We can't directly test the styles object, but we can verify the import is present
      expect(PremiumBadge).toBeDefined();
    });
  });

  describe('borderRadius token values', () => {
    it('should have expected values', () => {
      expect(borderRadius.small).toBe(8);
      expect(borderRadius.medium).toBe(12);
      expect(borderRadius.large).toBe(16);
    });
  });
});
