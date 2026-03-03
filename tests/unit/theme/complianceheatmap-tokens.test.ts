/**
 * ComplianceHeatmap styles Theme Token Migration Tests
 * Validates raw borderRadius values were replaced with borderRadius tokens.
 */

import { borderRadius } from '../../../src/theme/spacing';
import { gridStyles } from '../../../src/components/ComplianceHeatmap/styles/grid.styles';
import { auxiliaryStyles } from '../../../src/components/ComplianceHeatmap/styles/auxiliary.styles';

describe('ComplianceHeatmap styles - Theme Token Migration', () => {
  describe('grid.styles', () => {
    it('keeps sub-token borderRadius: 2 for micro cell elements', () => {
      expect(gridStyles.cell.borderRadius).toBe(2);
    });
  });

  describe('auxiliary.styles', () => {
    it('uses borderRadius.medium for container', () => {
      expect(auxiliaryStyles.container.borderRadius).toBe(borderRadius.medium);
    });

    it('uses borderRadius.medium for emptyContainer', () => {
      expect(auxiliaryStyles.emptyContainer.borderRadius).toBe(
        borderRadius.medium
      );
    });

    it('keeps sub-token borderRadius: 2 for legendCell', () => {
      expect(auxiliaryStyles.legendCell.borderRadius).toBe(2);
    });

    it('borderRadius.medium resolves to 12', () => {
      expect(borderRadius.medium).toBe(12);
    });
  });
});
