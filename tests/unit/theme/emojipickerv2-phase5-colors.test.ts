/**
 * EmojiPickerV2 Color Token Tests (Phase 5)
 * Verifies that remaining hardcoded hex colors in EmojiPickerV2
 * have been replaced with theme tokens.
 *
 * Covers:
 * - New color tokens: secondary.100, warning.100, warning.300
 * - EmojiGrid selected state background → colors.secondary[100]
 * - SuggestionEmojiCell selected state → colors.secondary[100]
 * - SuggestionsSection container → colors.warning[100]/[300]
 * - useSheetAnimations search bar colors → colors.secondary[500]/colors.border
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

    it('colors.warning[100] should be #fef3c7 (amber-100)', () => {
      expect(colors.warning[100]).toBe('#fef3c7');
    });

    it('colors.warning[300] should be #fcd34d (amber-300)', () => {
      expect(colors.warning[300]).toBe('#fcd34d');
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

  describe('SuggestionsSection container uses warning tokens', () => {
    it('container backgroundColor should be colors.warning[100]', () => {
      expect(suggestionStyles.container.backgroundColor).toBe(
        colors.warning[100]
      );
    });

    it('container backgroundColor should be #fef3c7', () => {
      expect(suggestionStyles.container.backgroundColor).toBe('#fef3c7');
    });

    it('container borderColor should be colors.warning[300]', () => {
      expect(suggestionStyles.container.borderColor).toBe(colors.warning[300]);
    });

    it('container borderColor should be #fcd34d', () => {
      expect(suggestionStyles.container.borderColor).toBe('#fcd34d');
    });
  });

  describe('Source files use theme imports (not hardcoded literals)', () => {
    it('useSheetAnimations.ts should import colors from theme', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/EmojiPickerV2/EmojiPickerSheet/useSheetAnimations.ts'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain("from '../../../theme/colors'");
      expect(content).toContain('colors.secondary[500]');
      expect(content).toContain('colors.border');
      expect(content).not.toContain("'#3b82f6'");
      expect(content).not.toContain("'#e7e5e4'");
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

    it('SuggestionsSection.tsx should not contain hardcoded #fef3c7 or #fcd34d', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/EmojiPickerV2/EmojiPickerSheet/SuggestionsSection.tsx'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).not.toContain("'#fef3c7'");
      expect(content).not.toContain("'#fcd34d'");
      expect(content).toContain('colors.warning[100]');
      expect(content).toContain('colors.warning[300]');
    });
  });
});
