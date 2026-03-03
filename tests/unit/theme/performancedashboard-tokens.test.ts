/**
 * PerformanceDashboard Theme Token Migration Tests
 * Validates hardcoded hex values were replaced with theme tokens.
 */

import { colors } from '../../../src/theme/colors';
import { borderRadius, shadows, spacing } from '../../../src/theme/spacing';
import { dashboardStyles } from '../../../src/components/PerformanceDashboard/PerformanceDashboard.styles';
import { rendersStyles } from '../../../src/components/PerformanceDashboard/components/RendersTab.styles';
import { networkStyles } from '../../../src/components/PerformanceDashboard/components/NetworkTab.styles';

describe('PerformanceDashboard - Theme Token Migration', () => {
  describe('dashboardStyles', () => {
    it('uses borderRadius.medium for dashboard panel', () => {
      expect(dashboardStyles.dashboard.borderRadius).toBe(borderRadius.medium);
    });

    it('uses spacing.md for dashboard padding', () => {
      expect(dashboardStyles.dashboard.padding).toBe(spacing.md);
    });

    it('uses spacing.sm for content gap', () => {
      expect(dashboardStyles.content.gap).toBe(spacing.sm);
    });

    it('uses spacing tokens for miniMetrics', () => {
      expect(dashboardStyles.miniMetrics.gap).toBe(spacing.sm);
      expect(dashboardStyles.miniMetrics.paddingTop).toBe(spacing.xs);
    });

    it('uses shadows.modal canonical preset for dashboard panel', () => {
      expect(dashboardStyles.dashboard.shadowColor).toBe(
        shadows.modal.shadowColor
      );
      expect(dashboardStyles.dashboard.shadowOffset).toEqual(
        shadows.modal.shadowOffset
      );
      expect(dashboardStyles.dashboard.shadowOpacity).toBe(
        shadows.modal.shadowOpacity
      );
      expect(dashboardStyles.dashboard.shadowRadius).toBe(
        shadows.modal.shadowRadius
      );
      expect(dashboardStyles.dashboard.elevation).toBe(shadows.modal.elevation);
    });
  });

  describe('rendersStyles', () => {
    it('uses colors.success for compDuration', () => {
      expect(rendersStyles.compDuration.color).toBe(colors.success);
    });

    it('uses colors.warning[500] for slow indicators', () => {
      expect(rendersStyles.slowDuration.color).toBe(colors.warning[500]);
      expect(rendersStyles.slowLabel.color).toBe(colors.warning[500]);
    });

    it('uses spacing tokens for layout', () => {
      expect(rendersStyles.compRow.gap).toBe(spacing.sm);
      expect(rendersStyles.compStats.gap).toBe(spacing.sm);
      expect(rendersStyles.list.gap).toBe(spacing.xs);
    });
  });

  describe('networkStyles', () => {
    it('uses colors.success for requestMethod', () => {
      expect(networkStyles.requestMethod.color).toBe(colors.success);
    });

    it('uses colors.warning[500] for slowRequest', () => {
      expect(networkStyles.slowRequest.color).toBe(colors.warning[500]);
    });

    it('uses spacing tokens for layout', () => {
      expect(networkStyles.requestRow.gap).toBe(spacing.sm);
      expect(networkStyles.requestRow.paddingVertical).toBe(spacing.xs);
      expect(networkStyles.requests.gap).toBe(spacing.xs);
    });
  });
});
