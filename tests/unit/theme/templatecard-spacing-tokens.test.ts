/**
 * TemplateCard Spacing & Border Radius Token Tests (Phase 3)
 * Verifies that TemplateCard component files use theme spacing and
 * borderRadius tokens instead of hardcoded numeric values.
 */

import { spacing, borderRadius } from '@/theme/spacing';
import { styles as cardStyles } from '@/components/TemplateCard/TemplateCard.styles';
import { styles as categoryBadgeStyles } from '@/components/TemplateCard/components/CategoryBadge';
import { styles as metadataPillsStyles } from '@/components/TemplateCard/components/MetadataPills';
import { styles as actionButtonsStyles } from '@/components/TemplateCard/components/ActionButtons';
import { styles as scienceBoxStyles } from '@/components/TemplateCard/components/ScienceBox';
import { styles as templateIconStyles } from '@/components/TemplateCard/components/TemplateIcon';
import { styles as contentStyles } from '@/components/TemplateCard/components/TemplateCardContent';

describe('TemplateCard Spacing Token Migration - Phase 3', () => {
  describe('TemplateCard.styles uses spacing/borderRadius tokens', () => {
    it('card borderRadius should use borderRadius.large (16)', () => {
      expect(cardStyles.card.borderRadius).toBe(borderRadius.large);
      expect(cardStyles.card.borderRadius).toBe(16);
    });

    it('card marginHorizontal should use spacing.lg (24)', () => {
      expect(cardStyles.card.marginHorizontal).toBe(spacing.lg);
      expect(cardStyles.card.marginHorizontal).toBe(24);
    });

    it('card marginVertical should use spacing.sm (8)', () => {
      expect(cardStyles.card.marginVertical).toBe(spacing.sm);
      expect(cardStyles.card.marginVertical).toBe(8);
    });

    it('accentBar borderRadii should use borderRadius.large (16)', () => {
      expect(cardStyles.accentBar.borderBottomLeftRadius).toBe(
        borderRadius.large
      );
      expect(cardStyles.accentBar.borderTopLeftRadius).toBe(borderRadius.large);
    });

    it('accentBar width should use spacing.xs (4)', () => {
      expect(cardStyles.accentBar.width).toBe(spacing.xs);
      expect(cardStyles.accentBar.width).toBe(4);
    });

    it('glowOverlay borderRadius should use borderRadius.large (16)', () => {
      expect(cardStyles.glowOverlay.borderRadius).toBe(borderRadius.large);
      expect(cardStyles.glowOverlay.borderRadius).toBe(16);
    });
  });

  describe('CategoryBadge uses spacing/borderRadius tokens', () => {
    it('badgeRow gap should use spacing.sm (8)', () => {
      expect(categoryBadgeStyles.badgeRow.gap).toBe(spacing.sm);
      expect(categoryBadgeStyles.badgeRow.gap).toBe(8);
    });

    it('badgeRow marginLeft should use spacing.sm (8)', () => {
      expect(categoryBadgeStyles.badgeRow.marginLeft).toBe(spacing.sm);
      expect(categoryBadgeStyles.badgeRow.marginLeft).toBe(8);
    });

    it('categoryBadge borderRadius should use borderRadius.small (8)', () => {
      expect(categoryBadgeStyles.categoryBadge.borderRadius).toBe(
        borderRadius.small
      );
      expect(categoryBadgeStyles.categoryBadge.borderRadius).toBe(8);
    });

    it('categoryBadge paddingHorizontal should use spacing.sm (8)', () => {
      expect(categoryBadgeStyles.categoryBadge.paddingHorizontal).toBe(
        spacing.sm
      );
      expect(categoryBadgeStyles.categoryBadge.paddingHorizontal).toBe(8);
    });

    it('categoryBadge paddingVertical should use spacing.xs (4)', () => {
      expect(categoryBadgeStyles.categoryBadge.paddingVertical).toBe(
        spacing.xs
      );
      expect(categoryBadgeStyles.categoryBadge.paddingVertical).toBe(4);
    });

    it('inlinePremiumBadge borderRadius should use borderRadius.small (8)', () => {
      expect(categoryBadgeStyles.inlinePremiumBadge.borderRadius).toBe(
        borderRadius.small
      );
      expect(categoryBadgeStyles.inlinePremiumBadge.borderRadius).toBe(8);
    });

    it('inlinePremiumBadge paddingHorizontal should use spacing.sm (8)', () => {
      expect(categoryBadgeStyles.inlinePremiumBadge.paddingHorizontal).toBe(
        spacing.sm
      );
    });

    it('inlinePremiumBadge paddingVertical should use spacing.xs (4)', () => {
      expect(categoryBadgeStyles.inlinePremiumBadge.paddingVertical).toBe(
        spacing.xs
      );
    });
  });

  describe('MetadataPills uses spacing/borderRadius tokens', () => {
    it('metadataPill borderRadius should use borderRadius.full (9999)', () => {
      expect(metadataPillsStyles.metadataPill.borderRadius).toBe(
        borderRadius.full
      );
      expect(metadataPillsStyles.metadataPill.borderRadius).toBe(9999);
    });

    it('metadataPill paddingHorizontal should use spacing.sm (8)', () => {
      expect(metadataPillsStyles.metadataPill.paddingHorizontal).toBe(
        spacing.sm
      );
      expect(metadataPillsStyles.metadataPill.paddingHorizontal).toBe(8);
    });

    it('metadataPill paddingVertical should use spacing.xs (4)', () => {
      expect(metadataPillsStyles.metadataPill.paddingVertical).toBe(spacing.xs);
      expect(metadataPillsStyles.metadataPill.paddingVertical).toBe(4);
    });

    it('metadataRow gap should use spacing.sm (8)', () => {
      expect(metadataPillsStyles.metadataRow.gap).toBe(spacing.sm);
      expect(metadataPillsStyles.metadataRow.gap).toBe(8);
    });

    it('metadataRow marginTop should use spacing.sm (8)', () => {
      expect(metadataPillsStyles.metadataRow.marginTop).toBe(spacing.sm);
      expect(metadataPillsStyles.metadataRow.marginTop).toBe(8);
    });
  });

  describe('ActionButtons uses spacing/borderRadius tokens', () => {
    it('buttonRow gap should use spacing.sm (8)', () => {
      expect(actionButtonsStyles.buttonRow.gap).toBe(spacing.sm);
      expect(actionButtonsStyles.buttonRow.gap).toBe(8);
    });

    it('importButton borderRadius should use borderRadius.medium (12)', () => {
      expect(actionButtonsStyles.importButton.borderRadius).toBe(
        borderRadius.medium
      );
      expect(actionButtonsStyles.importButton.borderRadius).toBe(12);
    });

    it('importButton paddingVertical should use spacing.md (12)', () => {
      expect(actionButtonsStyles.importButton.paddingVertical).toBe(spacing.md);
      expect(actionButtonsStyles.importButton.paddingVertical).toBe(12);
    });

    it('previewButton borderRadius should use borderRadius.medium (12)', () => {
      expect(actionButtonsStyles.previewButton.borderRadius).toBe(
        borderRadius.medium
      );
    });

    it('previewButton paddingVertical should use spacing.md (12)', () => {
      expect(actionButtonsStyles.previewButton.paddingVertical).toBe(
        spacing.md
      );
    });

    it('successButton borderRadius should use borderRadius.medium (12)', () => {
      expect(actionButtonsStyles.successButton.borderRadius).toBe(
        borderRadius.medium
      );
    });

    it('successButton gap should use spacing.sm (8)', () => {
      expect(actionButtonsStyles.successButton.gap).toBe(spacing.sm);
    });

    it('successButton paddingHorizontal should use spacing.base (16)', () => {
      expect(actionButtonsStyles.successButton.paddingHorizontal).toBe(
        spacing.base
      );
      expect(actionButtonsStyles.successButton.paddingHorizontal).toBe(16);
    });

    it('successButton paddingVertical should use spacing.md (12)', () => {
      expect(actionButtonsStyles.successButton.paddingVertical).toBe(
        spacing.md
      );
    });
  });

  describe('ScienceBox uses spacing/borderRadius tokens', () => {
    it('scienceBox borderRadius should use borderRadius.medium (12)', () => {
      expect(scienceBoxStyles.scienceBox.borderRadius).toBe(
        borderRadius.medium
      );
      expect(scienceBoxStyles.scienceBox.borderRadius).toBe(12);
    });

    it('scienceBox gap should use spacing.sm (8)', () => {
      expect(scienceBoxStyles.scienceBox.gap).toBe(spacing.sm);
    });

    it('scienceBox marginTop should use spacing.md (12)', () => {
      expect(scienceBoxStyles.scienceBox.marginTop).toBe(spacing.md);
      expect(scienceBoxStyles.scienceBox.marginTop).toBe(12);
    });

    it('scienceBox padding should use spacing.md (12)', () => {
      expect(scienceBoxStyles.scienceBox.padding).toBe(spacing.md);
    });

    it('scienceHeader gap should use spacing.sm (8)', () => {
      expect(scienceBoxStyles.scienceHeader.gap).toBe(spacing.sm);
    });

    it('scienceHeader marginBottom should use spacing.sm (8)', () => {
      expect(scienceBoxStyles.scienceHeader.marginBottom).toBe(spacing.sm);
    });
  });

  describe('TemplateIcon uses borderRadius tokens', () => {
    it('iconContainer borderRadius should use borderRadius.medium (12)', () => {
      expect(templateIconStyles.iconContainer.borderRadius).toBe(
        borderRadius.medium
      );
      expect(templateIconStyles.iconContainer.borderRadius).toBe(12);
    });

    it('iconGlow borderRadius should use borderRadius.full (9999)', () => {
      expect(templateIconStyles.iconGlow.borderRadius).toBe(borderRadius.full);
      expect(templateIconStyles.iconGlow.borderRadius).toBe(9999);
    });
  });

  describe('TemplateCardContent uses spacing tokens', () => {
    it('content padding should use spacing.base (16)', () => {
      expect(contentStyles.content.padding).toBe(spacing.base);
      expect(contentStyles.content.padding).toBe(16);
    });

    it('content paddingLeft should use spacing.base (16)', () => {
      expect(contentStyles.content.paddingLeft).toBe(spacing.base);
    });

    it('descriptionText marginTop should use spacing.sm (8)', () => {
      expect(contentStyles.descriptionText.marginTop).toBe(spacing.sm);
      expect(contentStyles.descriptionText.marginTop).toBe(8);
    });

    it('footer marginTop should use spacing.base (16)', () => {
      expect(contentStyles.footer.marginTop).toBe(spacing.base);
      expect(contentStyles.footer.marginTop).toBe(16);
    });

    it('header gap should use spacing.sm (8)', () => {
      expect(contentStyles.header.gap).toBe(spacing.sm);
    });

    it('nameText marginTop should use spacing.md (12)', () => {
      expect(contentStyles.nameText.marginTop).toBe(spacing.md);
      expect(contentStyles.nameText.marginTop).toBe(12);
    });
  });
});
