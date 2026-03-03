/**
 * OfflinePendingBanner Theme Token Migration Tests
 * Validates hardcoded hex values were replaced with theme tokens.
 */

import { colors } from '../../../src/theme/colors';
import { borderRadius } from '../../../src/theme/spacing';
import { controlsStyles } from '../../../src/components/OfflinePendingBanner/styles/controls.styles';
import { statsStyles } from '../../../src/components/OfflinePendingBanner/styles/stats.styles';
import { layoutStyles } from '../../../src/components/OfflinePendingBanner/styles/layout.styles';

describe('OfflinePendingBanner - Theme Token Migration', () => {
  describe('controls.styles', () => {
    it('uses colors.info for progressBar and syncButton', () => {
      expect(controlsStyles.progressBar.backgroundColor).toBe(colors.info);
      expect(controlsStyles.syncButton.backgroundColor).toBe(colors.info);
    });

    it('uses colors.gray[200] for progressContainer', () => {
      expect(controlsStyles.progressContainer.backgroundColor).toBe(
        colors.gray[200]
      );
    });

    it('uses colors.text.secondary for subtitle', () => {
      expect(controlsStyles.subtitle.color).toBe(colors.text.secondary);
    });

    it('uses colors.text.primary for title', () => {
      expect(controlsStyles.title.color).toBe(colors.text.primary);
    });

    it('uses borderRadius.large for syncButton', () => {
      expect(controlsStyles.syncButton.borderRadius).toBe(borderRadius.large);
    });
  });

  describe('stats.styles', () => {
    it('uses colors.text.secondary for ageText', () => {
      expect(statsStyles.ageText.color).toBe(colors.text.secondary);
    });

    it('uses colors.gray[400] for statsDot', () => {
      expect(statsStyles.statsDot.backgroundColor).toBe(colors.gray[400]);
    });

    it('uses colors.gray[600] for statsHeader', () => {
      expect(statsStyles.statsHeader.color).toBe(colors.gray[600]);
    });

    it('uses colors.gray[700] for statsText', () => {
      expect(statsStyles.statsText.color).toBe(colors.gray[700]);
    });

    it('uses colors.warning tokens for warning styles', () => {
      expect(statsStyles.warningContainer.backgroundColor).toBe(
        colors.warning[100]
      );
      expect(statsStyles.warningText.color).toBe(colors.warning[700]);
    });
  });

  describe('layout.styles', () => {
    it('uses colors.light.gradientMid for container background', () => {
      expect(layoutStyles.container.backgroundColor).toBe(
        colors.light.gradientMid
      );
    });

    it('uses borderRadius.medium for container', () => {
      expect(layoutStyles.container.borderRadius).toBe(borderRadius.medium);
    });
  });
});
