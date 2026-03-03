/**
 * Remaining borderRadius Theme Token Migration Tests
 * Validates raw borderRadius values replaced with tokens in:
 * - CategoryChip, BinaryHeatmapNew, PredictionInsights, HeroAnimation, Modal
 */

import { borderRadius } from '../../../src/theme/spacing';
import { styles as categoryChipStyles } from '../../../src/components/CategoryChip/CategoryChip.styles';
import { styles as binaryHeatmapStyles } from '../../../src/components/BinaryHeatmap/BinaryHeatmapNew.styles';
import { styles as predictionStyles } from '../../../src/components/PredictionInsights/PredictionInsights.styles';
import { styles as heroAnimationStyles } from '../../../src/screens/auth/components/HeroAnimation/HeroAnimation.styles';
import { styles as modalStyles } from '../../../src/components/Modal/Modal.styles';

describe('Remaining files - borderRadius Token Migration', () => {
  describe('CategoryChip.styles', () => {
    it('uses borderRadius.full for countBadge (pill shape)', () => {
      expect(categoryChipStyles.countBadge.borderRadius).toBe(
        borderRadius.full
      );
    });

    it('borderRadius.full resolves to 9999', () => {
      expect(borderRadius.full).toBe(9999);
    });
  });

  describe('BinaryHeatmapNew.styles', () => {
    it('keeps sub-token borderRadius: 2 for micro heatmap cell', () => {
      expect(binaryHeatmapStyles.cell.borderRadius).toBe(2);
    });

    it('uses borderRadius.medium for container', () => {
      expect(binaryHeatmapStyles.container.borderRadius).toBe(
        borderRadius.medium
      );
    });

    it('borderRadius.medium resolves to 12', () => {
      expect(borderRadius.medium).toBe(12);
    });
  });

  describe('PredictionInsights.styles', () => {
    it('uses borderRadius.full for circular bulletPoint', () => {
      expect(predictionStyles.bulletPoint.borderRadius).toBe(borderRadius.full);
    });
  });

  describe('HeroAnimation.styles', () => {
    it('uses borderRadius.full for circular emojiContainer', () => {
      expect(heroAnimationStyles.emojiContainer.borderRadius).toBe(
        borderRadius.full
      );
    });
  });

  describe('Modal.styles', () => {
    it('keeps sub-token borderRadius: 2 for micro pull indicator', () => {
      expect(modalStyles.pullIndicator.borderRadius).toBe(2);
    });
  });
});
