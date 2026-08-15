/**
 * EmojiPickerV2 spacing / radius tokens
 */

import { colors } from '@/theme/colors';
import { spacing, borderRadius, shadows } from '@/theme/spacing';
import { styles as categoryPillStyles } from '@/components/EmojiPickerV2/CategoryPills.styles';
import { styles as gridStyles } from '@/components/EmojiPickerV2/EmojiGrid/styles';
import { styles as sheetStyles } from '@/components/EmojiPickerV2/EmojiPickerSheet/EmojiPickerSheet.styles';
import { suggestionStyles } from '@/components/EmojiPickerV2/EmojiPickerSheet/SuggestionsSection';
import { suggestionCellStyles } from '@/components/EmojiPickerV2/EmojiPickerSheet/SuggestionEmojiCell';

describe('EmojiPickerV2 tokens', () => {
  it('uses spacing tokens on category pills', () => {
    expect(categoryPillStyles.categoriesContent.gap).toBe(spacing.sm);
    expect(categoryPillStyles.categoriesContent.paddingHorizontal).toBe(
      spacing.lg
    );
    expect(categoryPillStyles.container.marginBottom).toBe(spacing.md);
    expect(categoryPillStyles.categoryPill.backgroundColor).toBe(
      colors.gray[100]
    );
    expect(categoryPillStyles.categoryPill.borderRadius).toBe(borderRadius.full);
    expect(categoryPillStyles.categoryPillActive.backgroundColor).toBe(
      colors.gray[900]
    );
    expect(categoryPillStyles.categoryPillText.color).toBe(colors.gray[500]);
  });

  it('uses theme tokens on the emoji grid', () => {
    expect(gridStyles.categoryHeader.paddingHorizontal).toBe(spacing.lg);
    expect(gridStyles.container.backgroundColor).toBe(colors.light.surface);
    expect(gridStyles.emojiCell.backgroundColor).toBe(colors.light.surfaceMuted);
    expect(gridStyles.emojiCell.borderRadius).toBe(borderRadius.medium);
    expect(gridStyles.emojiCellSelected.borderColor).toBe(
      colors.secondary[500]
    );
    expect(gridStyles.emojiRow.gap).toBe(spacing.sm);
    expect(gridStyles.emptyStateTitle.color).toBe(colors.gray[900]);
  });

  it('uses theme tokens on the sheet', () => {
    expect(sheetStyles.handle.backgroundColor).toBe(colors.gray[300]);
    expect(sheetStyles.noIconButton.borderRadius).toBe(borderRadius.medium);
    expect(sheetStyles.searchBar.backgroundColor).toBe(
      colors.light.surfaceMuted
    );
    expect(sheetStyles.searchBar.borderRadius).toBe(borderRadius.large);
    expect(sheetStyles.sheet.backgroundColor).toBe(colors.light.surface);
    expect(sheetStyles.sheet.borderTopLeftRadius).toBe(borderRadius.xl);
    expect(sheetStyles.sheet.borderTopRightRadius).toBe(borderRadius.xl);
    expect(sheetStyles.sheet.shadowColor).toBe(shadows.modal.shadowColor);
  });

  it('uses theme tokens on suggestions', () => {
    expect(suggestionStyles.container.borderRadius).toBe(borderRadius.large);
    expect(suggestionStyles.container.marginBottom).toBe(spacing.md);
    expect(suggestionStyles.headerText.marginLeft).toBe(spacing.sm);
    expect(suggestionCellStyles.cell.backgroundColor).toBe(
      colors.light.surface
    );
    expect(suggestionCellStyles.cell.borderRadius).toBe(borderRadius.large);
    expect(suggestionCellStyles.cellSelected.borderColor).toBe(
      colors.secondary[500]
    );
  });
});
