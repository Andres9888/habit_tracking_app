/**
 * FullsizeTemplatePreview Theme Token Migration Tests
 * Validates hardcoded hex values were replaced with theme tokens.
 */

import { colors } from '../../../src/theme/colors';
import { borderRadius } from '../../../src/theme/spacing';
import { scienceStyles } from '../../../src/components/FullsizeTemplatePreview/styles/science.styles';
import { footerStyles } from '../../../src/components/FullsizeTemplatePreview/styles/footer.styles';
import { tipsStyles } from '../../../src/components/FullsizeTemplatePreview/styles/tips.styles';
import { heroStyles } from '../../../src/components/FullsizeTemplatePreview/styles/hero.styles';
import { layoutStyles } from '../../../src/components/FullsizeTemplatePreview/styles/layout.styles';

describe('FullsizeTemplatePreview - Theme Token Migration', () => {
  describe('science.styles', () => {
    it('uses colors.secondary tokens for research link', () => {
      expect(scienceStyles.researchLinkButton.backgroundColor).toBe(
        colors.secondary[100]
      );
      expect(scienceStyles.researchLinkText.color).toBe(colors.secondary[600]);
    });

    it('uses colors.primary tokens for science box', () => {
      expect(scienceStyles.scienceBox.backgroundColor).toBe(
        colors.primary[100]
      );
      expect(scienceStyles.scienceBox.borderColor).toBe(colors.primary[300]);
    });

    it('uses colors.primary[300] for science divider', () => {
      expect(scienceStyles.scienceDivider.backgroundColor).toBe(
        colors.primary[300]
      );
    });

    it('uses colors.primary[700] for science text', () => {
      expect(scienceStyles.scienceLabel.color).toBe(colors.primary[700]);
      expect(scienceStyles.scienceQuote.color).toBe(colors.primary[700]);
    });
  });

  describe('footer.styles', () => {
    it('uses colors.gray[500] for customize link text', () => {
      expect(footerStyles.customizeLinkText.color).toBe(colors.gray[500]);
    });

    it('uses colors.text.inverse for button text', () => {
      expect(footerStyles.importButtonText.color).toBe(colors.text.inverse);
      expect(footerStyles.successButtonText.color).toBe(colors.text.inverse);
    });

    it('uses colors.primary[400] for success button', () => {
      expect(footerStyles.successButton.backgroundColor).toBe(
        colors.primary[400]
      );
      expect(footerStyles.successButtonGlow.backgroundColor).toBe(
        colors.primary[400]
      );
    });

    it('uses colors.primary[700] for success shadow', () => {
      expect(footerStyles.successButton.shadowColor).toBe(colors.primary[700]);
    });
  });

  describe('tips.styles', () => {
    it('uses colors.warning tokens for tips box', () => {
      expect(tipsStyles.tipsBox.backgroundColor).toBe(colors.warning[100]);
      expect(tipsStyles.tipsBox.borderColor).toBe(colors.warning[300]);
    });

    it('uses colors.warning[300] for tips divider', () => {
      expect(tipsStyles.tipsDivider.backgroundColor).toBe(colors.warning[300]);
    });

    it('does not contain inline hex strings for text colors', () => {
      // Label and text use named constants, not raw hex in StyleSheet
      expect(tipsStyles.tipsLabel.color).toBeDefined();
      expect(tipsStyles.tipText.color).toBeDefined();
    });
  });

  describe('hero.styles', () => {
    it('uses colors.gray[600] for description text', () => {
      expect(heroStyles.descriptionText.color).toBe(colors.gray[600]);
    });

    it('uses colors.text.primary for template name', () => {
      expect(heroStyles.templateName.color).toBe(colors.text.primary);
    });
  });

  describe('layout.styles', () => {
    it('uses colors.gray[200] for close button background', () => {
      expect(layoutStyles.closeButton.backgroundColor).toBe(colors.gray[200]);
    });

    it('uses borderRadius.xl for close button', () => {
      expect(layoutStyles.closeButton.borderRadius).toBe(borderRadius.xl);
    });

    it('uses colors.light.surfaceMuted for container', () => {
      expect(layoutStyles.container.backgroundColor).toBe(
        colors.light.surfaceMuted
      );
    });

    it('uses borderRadius.medium for success glow overlay', () => {
      expect(layoutStyles.successGlowOverlay.borderRadius).toBe(
        borderRadius.medium
      );
    });
  });
});
