/**
 * EmojiPickerV2 Color & Spacing Token Tests (Phase 3)
 * Verifies that EmojiPickerV2 component files use theme color,
 * spacing, and borderRadius tokens instead of hardcoded values.
 */

import { colors } from '@/theme/colors';
import { spacing, borderRadius, shadows } from '@/theme/spacing';
import { styles as categoryPillStyles } from '@/components/EmojiPickerV2/CategoryPills.styles';
import { styles as gridStyles } from '@/components/EmojiPickerV2/EmojiGrid/styles';
import { styles as sheetStyles } from '@/components/EmojiPickerV2/EmojiPickerSheet/EmojiPickerSheet.styles';
import { suggestionStyles } from '@/components/EmojiPickerV2/EmojiPickerSheet/SuggestionsSection';
import { suggestionCellStyles } from '@/components/EmojiPickerV2/EmojiPickerSheet/SuggestionEmojiCell';

describe('EmojiPickerV2 Token Migration - Phase 3', () => {
  describe('CategoryPills.styles uses theme tokens', () => {
    it('categoriesContent gap should use spacing.sm (8)', () => {
      expect(categoryPillStyles.categoriesContent.gap).toBe(spacing.sm);
      expect(categoryPillStyles.categoriesContent.gap).toBe(8);
    });

    it('categoriesContent paddingHorizontal should use spacing.lg (24)', () => {
      expect(categoryPillStyles.categoriesContent.paddingHorizontal).toBe(
        spacing.lg
      );
      expect(categoryPillStyles.categoriesContent.paddingHorizontal).toBe(24);
    });

    it('categoriesScroll marginBottom should use spacing.md (12)', () => {
      expect(categoryPillStyles.categoriesScroll.marginBottom).toBe(spacing.md);
      expect(categoryPillStyles.categoriesScroll.marginBottom).toBe(12);
    });

    it('categoryPill backgroundColor should use colors.gray[100]', () => {
      expect(categoryPillStyles.categoryPill.backgroundColor).toBe(
        colors.gray[100]
      );
    });

    it('categoryPill borderRadius should use borderRadius.full (9999)', () => {
      expect(categoryPillStyles.categoryPill.borderRadius).toBe(
        borderRadius.full
      );
      expect(categoryPillStyles.categoryPill.borderRadius).toBe(9999);
    });

    it('categoryPill paddingHorizontal should use spacing.base (16)', () => {
      expect(categoryPillStyles.categoryPill.paddingHorizontal).toBe(
        spacing.base
      );
      expect(categoryPillStyles.categoryPill.paddingHorizontal).toBe(16);
    });

    it('categoryPill paddingVertical should use spacing.sm (8)', () => {
      expect(categoryPillStyles.categoryPill.paddingVertical).toBe(spacing.sm);
      expect(categoryPillStyles.categoryPill.paddingVertical).toBe(8);
    });

    it('categoryPillActive backgroundColor should use colors.gray[900]', () => {
      expect(categoryPillStyles.categoryPillActive.backgroundColor).toBe(
        colors.gray[900]
      );
    });

    it('categoryPillText color should use colors.gray[500]', () => {
      expect(categoryPillStyles.categoryPillText.color).toBe(colors.gray[500]);
    });

    it('categoryPillText marginLeft should use spacing.xs (4)', () => {
      expect(categoryPillStyles.categoryPillText.marginLeft).toBe(spacing.xs);
      expect(categoryPillStyles.categoryPillText.marginLeft).toBe(4);
    });

    it('categoryPillTextActive color should use colors.text.inverse', () => {
      expect(categoryPillStyles.categoryPillTextActive.color).toBe(
        colors.text.inverse
      );
    });
  });

  describe('EmojiGrid/styles uses theme tokens', () => {
    it('categoryHeader paddingHorizontal should use spacing.lg (24)', () => {
      expect(gridStyles.categoryHeader.paddingHorizontal).toBe(spacing.lg);
      expect(gridStyles.categoryHeader.paddingHorizontal).toBe(24);
    });

    it('categoryHeader paddingVertical should use spacing.sm (8)', () => {
      expect(gridStyles.categoryHeader.paddingVertical).toBe(spacing.sm);
      expect(gridStyles.categoryHeader.paddingVertical).toBe(8);
    });

    it('categoryHeaderText color should use colors.gray[500]', () => {
      expect(gridStyles.categoryHeaderText.color).toBe(colors.gray[500]);
    });

    it('container backgroundColor should use colors.light.surface', () => {
      expect(gridStyles.container.backgroundColor).toBe(colors.light.surface);
    });

    it('emojiCell backgroundColor should use colors.light.surfaceMuted', () => {
      expect(gridStyles.emojiCell.backgroundColor).toBe(
        colors.light.surfaceMuted
      );
    });

    it('emojiCell borderRadius should use borderRadius.medium (12)', () => {
      expect(gridStyles.emojiCell.borderRadius).toBe(borderRadius.medium);
      expect(gridStyles.emojiCell.borderRadius).toBe(12);
    });

    it('emojiCellSelected borderColor should use colors.secondary[500]', () => {
      expect(gridStyles.emojiCellSelected.borderColor).toBe(
        colors.secondary[500]
      );
    });

    it('emojiRow gap should use spacing.sm (8)', () => {
      expect(gridStyles.emojiRow.gap).toBe(spacing.sm);
      expect(gridStyles.emojiRow.gap).toBe(8);
    });

    it('emojiRow marginBottom should use spacing.sm (8)', () => {
      expect(gridStyles.emojiRow.marginBottom).toBe(spacing.sm);
      expect(gridStyles.emojiRow.marginBottom).toBe(8);
    });

    it('emptyStateSubtitle color should use colors.gray[400]', () => {
      expect(gridStyles.emptyStateSubtitle.color).toBe(colors.gray[400]);
    });

    it('emptyStateSubtitle marginTop should use spacing.xs (4)', () => {
      expect(gridStyles.emptyStateSubtitle.marginTop).toBe(spacing.xs);
      expect(gridStyles.emptyStateSubtitle.marginTop).toBe(4);
    });

    it('emptyStateTitle color should use colors.gray[900]', () => {
      expect(gridStyles.emptyStateTitle.color).toBe(colors.gray[900]);
    });

    it('emptyStateTitle marginTop should use spacing.md (12)', () => {
      expect(gridStyles.emptyStateTitle.marginTop).toBe(spacing.md);
      expect(gridStyles.emptyStateTitle.marginTop).toBe(12);
    });

    it('gridContent paddingBottom should use spacing.base (16)', () => {
      expect(gridStyles.gridContent.paddingBottom).toBe(spacing.base);
      expect(gridStyles.gridContent.paddingBottom).toBe(16);
    });

    it('gridContent paddingHorizontal should use spacing.lg (24)', () => {
      expect(gridStyles.gridContent.paddingHorizontal).toBe(spacing.lg);
      expect(gridStyles.gridContent.paddingHorizontal).toBe(24);
    });
  });

  describe('EmojiPickerSheet.styles uses theme tokens', () => {
    it('handle backgroundColor should use colors.gray[300]', () => {
      expect(sheetStyles.handle.backgroundColor).toBe(colors.gray[300]);
    });

    it('handleContainer paddingBottom should use spacing.sm (8)', () => {
      expect(sheetStyles.handleContainer.paddingBottom).toBe(spacing.sm);
      expect(sheetStyles.handleContainer.paddingBottom).toBe(8);
    });

    it('handleContainer paddingTop should use spacing.md (12)', () => {
      expect(sheetStyles.handleContainer.paddingTop).toBe(spacing.md);
      expect(sheetStyles.handleContainer.paddingTop).toBe(12);
    });

    it('noIconButton backgroundColor should use colors.gray[100]', () => {
      expect(sheetStyles.noIconButton.backgroundColor).toBe(colors.gray[100]);
    });

    it('noIconButton borderRadius should use borderRadius.medium (12)', () => {
      expect(sheetStyles.noIconButton.borderRadius).toBe(borderRadius.medium);
      expect(sheetStyles.noIconButton.borderRadius).toBe(12);
    });

    it('noIconContainer borderTopColor should use colors.gray[100]', () => {
      expect(sheetStyles.noIconContainer.borderTopColor).toBe(colors.gray[100]);
    });

    it('noIconContainer paddingBottom should use spacing.lg (24)', () => {
      expect(sheetStyles.noIconContainer.paddingBottom).toBe(spacing.lg);
      expect(sheetStyles.noIconContainer.paddingBottom).toBe(24);
    });

    it('noIconContainer paddingHorizontal should use spacing.lg (24)', () => {
      expect(sheetStyles.noIconContainer.paddingHorizontal).toBe(spacing.lg);
    });

    it('noIconContainer paddingVertical should use spacing.md (12)', () => {
      expect(sheetStyles.noIconContainer.paddingVertical).toBe(spacing.md);
    });

    it('noIconText color should use colors.gray[500]', () => {
      expect(sheetStyles.noIconText.color).toBe(colors.gray[500]);
    });

    it('searchBar backgroundColor should use colors.light.surfaceMuted', () => {
      expect(sheetStyles.searchBar.backgroundColor).toBe(
        colors.light.surfaceMuted
      );
    });

    it('searchBar borderColor should use colors.border', () => {
      expect(sheetStyles.searchBar.borderColor).toBe(colors.border);
    });

    it('searchBar borderRadius should use borderRadius.large (16)', () => {
      expect(sheetStyles.searchBar.borderRadius).toBe(borderRadius.large);
      expect(sheetStyles.searchBar.borderRadius).toBe(16);
    });

    it('searchBar paddingHorizontal should use spacing.base (16)', () => {
      expect(sheetStyles.searchBar.paddingHorizontal).toBe(spacing.base);
      expect(sheetStyles.searchBar.paddingHorizontal).toBe(16);
    });

    it('searchContainer marginBottom should use spacing.md (12)', () => {
      expect(sheetStyles.searchContainer.marginBottom).toBe(spacing.md);
      expect(sheetStyles.searchContainer.marginBottom).toBe(12);
    });

    it('searchContainer marginHorizontal should use spacing.lg (24)', () => {
      expect(sheetStyles.searchContainer.marginHorizontal).toBe(spacing.lg);
    });

    it('searchInput color should use colors.gray[900]', () => {
      expect(sheetStyles.searchInput.color).toBe(colors.gray[900]);
    });

    it('searchInput marginLeft should use spacing.sm (8)', () => {
      expect(sheetStyles.searchInput.marginLeft).toBe(spacing.sm);
      expect(sheetStyles.searchInput.marginLeft).toBe(8);
    });

    it('sheet backgroundColor should use colors.light.surface', () => {
      expect(sheetStyles.sheet.backgroundColor).toBe(colors.light.surface);
    });

    it('sheet borderTopLeftRadius should use borderRadius.xl (20)', () => {
      expect(sheetStyles.sheet.borderTopLeftRadius).toBe(borderRadius.xl);
      expect(sheetStyles.sheet.borderTopLeftRadius).toBe(20);
    });

    it('sheet borderTopRightRadius should use borderRadius.xl (20)', () => {
      expect(sheetStyles.sheet.borderTopRightRadius).toBe(borderRadius.xl);
      expect(sheetStyles.sheet.borderTopRightRadius).toBe(20);
    });

    it('sheet should spread shadows.modal as base', () => {
      expect(sheetStyles.sheet.shadowColor).toBe(shadows.modal.shadowColor);
    });
  });

  describe('SuggestionsSection uses theme tokens', () => {
    it('container borderRadius should use borderRadius.large (16)', () => {
      expect(suggestionStyles.container.borderRadius).toBe(borderRadius.large);
      expect(suggestionStyles.container.borderRadius).toBe(16);
    });

    it('container marginBottom should use spacing.md (12)', () => {
      expect(suggestionStyles.container.marginBottom).toBe(spacing.md);
      expect(suggestionStyles.container.marginBottom).toBe(12);
    });

    it('container marginHorizontal should use spacing.lg (24)', () => {
      expect(suggestionStyles.container.marginHorizontal).toBe(spacing.lg);
      expect(suggestionStyles.container.marginHorizontal).toBe(24);
    });

    it('container padding should use spacing.base (16)', () => {
      expect(suggestionStyles.container.padding).toBe(spacing.base);
      expect(suggestionStyles.container.padding).toBe(16);
    });

    it('grid gap should use spacing.sm (8)', () => {
      expect(suggestionStyles.grid.gap).toBe(spacing.sm);
      expect(suggestionStyles.grid.gap).toBe(8);
    });

    it('header marginBottom should use spacing.md (12)', () => {
      expect(suggestionStyles.header.marginBottom).toBe(spacing.md);
      expect(suggestionStyles.header.marginBottom).toBe(12);
    });

    it('headerText color should use colors.warning[700]', () => {
      expect(suggestionStyles.headerText.color).toBe(colors.warning[700]);
    });

    it('headerText marginLeft should use spacing.sm (8)', () => {
      expect(suggestionStyles.headerText.marginLeft).toBe(spacing.sm);
      expect(suggestionStyles.headerText.marginLeft).toBe(8);
    });
  });

  describe('SuggestionEmojiCell uses theme tokens', () => {
    it('cell backgroundColor should use colors.light.surface', () => {
      expect(suggestionCellStyles.cell.backgroundColor).toBe(
        colors.light.surface
      );
    });

    it('cell borderRadius should use borderRadius.large (16)', () => {
      expect(suggestionCellStyles.cell.borderRadius).toBe(borderRadius.large);
      expect(suggestionCellStyles.cell.borderRadius).toBe(16);
    });

    it('cellSelected borderColor should use colors.secondary[500]', () => {
      expect(suggestionCellStyles.cellSelected.borderColor).toBe(
        colors.secondary[500]
      );
    });
  });
});
