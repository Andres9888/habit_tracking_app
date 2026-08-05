/**
 * EmojiPickerV2 Color Token Tests (Phase 5)
 * Verifies that remaining hardcoded hex colors in EmojiPickerV2
 * have been replaced with theme tokens.
 *
 * Covers:
 * - Current semantic tokens: secondary.100, warningLight, streak.300
 * - EmojiGrid selected state background → colors.secondary[100]
 * - SuggestionEmojiCell selected state → colors.secondary[100]
 * - SuggestionsSection container → colors.warningLight/colors.streak[300]
 * - Sheet styling stays delegated to useSheetStyles
 */

import { colors } from '@/theme/colors';
import { styles as gridStyles } from '@/components/EmojiPickerV2/EmojiGrid/styles';
import { suggestionCellStyles } from '@/components/EmojiPickerV2/EmojiPickerSheet/SuggestionEmojiCell';
import { suggestionStyles } from '@/components/EmojiPickerV2/EmojiPickerSheet/SuggestionsSection';

describe('EmojiPickerV2 Color Token Migration - Phase 5', () => {
  describe('New color tokens exist in theme', () => {
    it('colors.secondary[100] should be #dbeafe (blue-100)', () => {
      expect(colors.secondary[100]).toBe('#dbeafe');
    });

    it('colors.warningLight should provide the warm warning surface', () => {
      expect(colors.warningLight).toBe('#FEF3CD');
    });

    it('colors.streak[300] should provide the warning border accent', () => {
      expect(colors.streak[300]).toBe('#E8B94D');
    });
  });

  describe('EmojiGrid selected state uses secondary.100', () => {
    it('emojiCellSelected backgroundColor should be colors.secondary[100]', () => {
      expect(gridStyles.emojiCellSelected.backgroundColor).toBe(
        colors.secondary[100]
      );
    });

    it('emojiCellSelected backgroundColor should be #dbeafe', () => {
      expect(gridStyles.emojiCellSelected.backgroundColor).toBe('#dbeafe');
    });
  });

  describe('SuggestionEmojiCell selected state uses secondary.100', () => {
    it('cellSelected backgroundColor should be colors.secondary[100]', () => {
      expect(suggestionCellStyles.cellSelected.backgroundColor).toBe(
        colors.secondary[100]
      );
    });

    it('cellSelected backgroundColor should be #dbeafe', () => {
      expect(suggestionCellStyles.cellSelected.backgroundColor).toBe('#dbeafe');
    });
  });

  describe('SuggestionsSection container uses semantic warning tokens', () => {
    it('container backgroundColor should be colors.warningLight', () => {
      expect(suggestionStyles.container.backgroundColor).toBe(
        colors.warningLight
      );
    });

    it('container backgroundColor should be the warm warning tint', () => {
      expect(suggestionStyles.container.backgroundColor).toBe('#FEF3CD');
    });

    it('container borderColor should be colors.streak[300]', () => {
      expect(suggestionStyles.container.borderColor).toBe(colors.streak[300]);
    });

    it('container borderColor should be the burnished-gold accent', () => {
      expect(suggestionStyles.container.borderColor).toBe('#E8B94D');
    });
  });

  describe('Source files use theme imports (not hardcoded literals)', () => {
    it('useSheetAnimations.ts should delegate visual tokens to useSheetStyles', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/EmojiPickerV2/EmojiPickerSheet/useSheetAnimations.ts'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain("from './useSheetStyles'");
      expect(content).toContain('useSheetStyles(');
      expect(content).not.toContain('backgroundColor:');
    });

    it('EmojiGrid/styles.ts should not contain hardcoded #dbeafe', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/EmojiPickerV2/EmojiGrid/styles.ts'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).not.toContain("'#dbeafe'");
      expect(content).toContain('colors.secondary[100]');
    });

    it('SuggestionEmojiCell.tsx should not contain hardcoded #dbeafe', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/EmojiPickerV2/EmojiPickerSheet/SuggestionEmojiCell.tsx'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).not.toContain("'#dbeafe'");
      expect(content).toContain('colors.secondary[100]');
    });

    it('SuggestionsSection.tsx should use current semantic warning tokens', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/EmojiPickerV2/EmojiPickerSheet/SuggestionsSection.tsx'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).not.toContain("'#FEF3CD'");
      expect(content).not.toContain("'#E8B94D'");
      expect(content).toContain('colors.warningLight');
      expect(content).toContain('colors.streak[300]');
    });
  });
});
