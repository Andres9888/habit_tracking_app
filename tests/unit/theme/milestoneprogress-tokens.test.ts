/**
 * MilestoneProgress Theme Token Migration Tests
 * Validates hardcoded hex values were replaced with theme tokens.
 */

import { colors, milestoneColors } from '../../../src/theme/colors';
import { borderRadius, spacing } from '../../../src/theme/spacing';
import { progressStyles } from '../../../src/components/ProgressSectionConsolidated/MilestoneProgress/styles/progress.styles';
import { celebrationStyles } from '../../../src/components/ProgressSectionConsolidated/MilestoneProgress/styles/celebration.styles';
import { noStreakStyles } from '../../../src/components/ProgressSectionConsolidated/MilestoneProgress/styles/noStreak.styles';

describe('MilestoneProgress - Theme Token Migration', () => {
  describe('progress.styles', () => {
    it('uses colors.text.inverse for container background', () => {
      expect(progressStyles.container.backgroundColor).toBe(
        colors.text.inverse
      );
    });

    it('uses colors.gray[200] for container border and progress track', () => {
      expect(progressStyles.container.borderColor).toBe(colors.gray[200]);
      expect(progressStyles.progressBarTrack.backgroundColor).toBe(
        colors.gray[200]
      );
    });

    it('uses colors.text.primary for headerTitle', () => {
      expect(progressStyles.headerTitle.color).toBe(colors.text.primary);
    });

    it('uses colors.gray[500] for secondary text', () => {
      expect(progressStyles.daysAway.color).toBe(colors.gray[500]);
      expect(progressStyles.milestoneName.color).toBe(colors.gray[500]);
      expect(progressStyles.progressLabelText.color).toBe(colors.gray[500]);
    });

    it('uses colors.warning tokens for amber UI elements', () => {
      expect(progressStyles.progressBadge.backgroundColor).toBe(
        colors.warning[100]
      );
      expect(progressStyles.progressBarFill.backgroundColor).toBe(
        colors.warning[500]
      );
    });

    it('uses borderRadius tokens', () => {
      expect(progressStyles.container.borderRadius).toBe(borderRadius.medium);
      expect(progressStyles.progressBadge.borderRadius).toBe(
        borderRadius.medium
      );
      expect(progressStyles.progressBarFill.borderRadius).toBe(borderRadius.xs);
      expect(progressStyles.progressBarTrack.borderRadius).toBe(
        borderRadius.xs
      );
    });

    it('uses spacing tokens for layout', () => {
      expect(progressStyles.container.marginTop).toBe(spacing.md);
      expect(progressStyles.container.padding).toBe(spacing.md);
      expect(progressStyles.header.marginBottom).toBe(spacing.xs);
      expect(progressStyles.badgeIcon.marginLeft).toBe(spacing.xs);
      expect(progressStyles.progressBadge.marginLeft).toBe(spacing.sm);
      expect(progressStyles.progressBarTrack.height).toBe(spacing.sm);
    });
  });

  describe('celebration.styles', () => {
    it('uses milestoneColors.amber800 for subtext and milestone text', () => {
      expect(celebrationStyles.celebrationSubtext.color).toBe(
        milestoneColors.amber800
      );
      expect(celebrationStyles.nextMilestoneText.color).toBe(
        milestoneColors.amber800
      );
    });

    it('uses milestoneColors.amberDark for title', () => {
      expect(celebrationStyles.celebrationTitle.color).toBe(
        milestoneColors.amberDark
      );
    });

    it('uses spacing tokens for layout', () => {
      expect(celebrationStyles.celebrationContent.padding).toBe(spacing.sm);
      expect(celebrationStyles.celebrationEmoji.marginBottom).toBe(spacing.xs);
      expect(celebrationStyles.nextMilestoneText.marginTop).toBe(spacing.sm);
    });
  });

  describe('noStreak.styles', () => {
    it('uses colors.gray[500] for subtext', () => {
      expect(noStreakStyles.noStreakSubtext.color).toBe(colors.gray[500]);
    });

    it('uses colors.gray[700] for title', () => {
      expect(noStreakStyles.noStreakTitle.color).toBe(colors.gray[700]);
    });

    it('uses spacing tokens for layout', () => {
      expect(noStreakStyles.noStreakContainer.paddingVertical).toBe(spacing.xs);
      expect(noStreakStyles.noStreakIcon.marginRight).toBe(spacing.md);
    });
  });
});
