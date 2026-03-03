/**
 * TemplateScienceModal Theme Token Migration Tests
 * Validates hardcoded hex values were replaced with theme tokens.
 */

import { colors } from '../../../src/theme/colors';
import { borderRadius } from '../../../src/theme/spacing';
import { scienceStyles } from '../../../src/components/TemplateScienceModal/styles/science.styles';
import { youtubeStyles } from '../../../src/components/TemplateScienceModal/styles/youtube.styles';
import { badgeStyles } from '../../../src/components/TemplateScienceModal/styles/badge.styles';
import { heroStyles } from '../../../src/components/TemplateScienceModal/styles/hero.styles';
import { skeletonStyles } from '../../../src/components/TemplateScienceModal/styles/skeleton.styles';

describe('TemplateScienceModal - Theme Token Migration', () => {
  describe('science.styles', () => {
    it('uses colors.primary[500] for citationDot', () => {
      expect(scienceStyles.citationDot.backgroundColor).toBe(
        colors.primary[500]
      );
    });

    it('uses colors.gray[500] for citationLabel', () => {
      expect(scienceStyles.citationLabel.color).toBe(colors.gray[500]);
    });

    it('uses colors.gray[700] for citationText', () => {
      expect(scienceStyles.citationText.color).toBe(colors.gray[700]);
    });

    it('uses colors.secondary tokens for link button', () => {
      expect(scienceStyles.linkButton.backgroundColor).toBe(
        colors.secondary[100]
      );
      expect(scienceStyles.linkText.color).toBe(colors.secondary[600]);
    });

    it('uses colors.primary tokens for whyItWorks section', () => {
      expect(scienceStyles.whyItWorksContainer.backgroundColor).toBe(
        colors.primary[100]
      );
      expect(scienceStyles.whyItWorksContainer.borderColor).toBe(
        colors.primary[300]
      );
      expect(scienceStyles.whyItWorksText.color).toBe(colors.primary[700]);
      expect(scienceStyles.whyItWorksTitle.color).toBe(colors.primary[700]);
    });
  });

  describe('youtube.styles', () => {
    it('uses borderRadius.large for youtubeButton', () => {
      expect(youtubeStyles.youtubeButton.borderRadius).toBe(borderRadius.large);
    });

    it('uses borderRadius.medium for youtubeGradient', () => {
      expect(youtubeStyles.youtubeGradient.borderRadius).toBe(
        borderRadius.medium
      );
    });

    it('uses colors.gray[900] for youtubeTitle', () => {
      expect(youtubeStyles.youtubeTitle.color).toBe(colors.gray[900]);
    });
  });

  describe('badge.styles', () => {
    it('uses borderRadius.medium for popularBadge', () => {
      expect(badgeStyles.popularBadge.borderRadius).toBe(borderRadius.medium);
    });

    it('uses colors.gray[200] for readingTimePill background', () => {
      expect(badgeStyles.readingTimePill.backgroundColor).toBe(
        colors.gray[200]
      );
    });

    it('uses borderRadius.xl for readingTimePill', () => {
      expect(badgeStyles.readingTimePill.borderRadius).toBe(borderRadius.xl);
    });

    it('uses colors.gray[500] for readingTimePillText', () => {
      expect(badgeStyles.readingTimePillText.color).toBe(colors.gray[500]);
    });

    it('uses colors.gray[900] for templateName', () => {
      expect(badgeStyles.templateName.color).toBe(colors.gray[900]);
    });
  });

  describe('hero.styles', () => {
    it('uses colors.gray[200] for frequencyPill background', () => {
      expect(heroStyles.frequencyPill.backgroundColor).toBe(colors.gray[200]);
    });

    it('uses colors.gray[500] for frequencyPillText', () => {
      expect(heroStyles.frequencyPillText.color).toBe(colors.gray[500]);
    });
  });

  describe('skeleton.styles', () => {
    it('uses colors.light.card for skeletonCard background', () => {
      expect(skeletonStyles.skeletonCard.backgroundColor).toBe(
        colors.light.card
      );
    });

    it('uses colors.border for skeletonCard border', () => {
      expect(skeletonStyles.skeletonCard.borderColor).toBe(colors.border);
    });

    it('uses borderRadius.xl for skeletonCard', () => {
      expect(skeletonStyles.skeletonCard.borderRadius).toBe(borderRadius.xl);
    });

    it('uses colors.light.surfaceMuted for skeletonFooter', () => {
      expect(skeletonStyles.skeletonFooter.backgroundColor).toBe(
        colors.light.surfaceMuted
      );
    });

    it('uses colors.border for skeletonFooter border', () => {
      expect(skeletonStyles.skeletonFooter.borderTopColor).toBe(colors.border);
    });
  });
});
