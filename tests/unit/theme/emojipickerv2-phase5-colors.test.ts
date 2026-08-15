/**
 * EmojiPickerV2 selected-state colors
 */

import fs from 'fs';
import path from 'path';
import { colors } from '@/theme/colors';
import { styles as gridStyles } from '@/components/EmojiPickerV2/EmojiGrid/styles';
import { suggestionCellStyles } from '@/components/EmojiPickerV2/EmojiPickerSheet/SuggestionEmojiCell';

const SRC = path.resolve(__dirname, '../../../src/components/EmojiPickerV2');

describe('EmojiPickerV2 phase 5 colors', () => {
  it('keeps secondary.100 for selected cells', () => {
    expect(colors.secondary[100]).toBe('#dbeafe');
    expect(gridStyles.emojiCellSelected.backgroundColor).toBe(
      colors.secondary[100]
    );
    expect(suggestionCellStyles.cellSelected.backgroundColor).toBe(
      colors.secondary[100]
    );
  });

  it('treats warning as a single hex token', () => {
    expect(colors.warning).toBe('#9A5504');
    expect(typeof colors.warning).toBe('string');
    expect(colors.warningLight).toBe('#FEF3CD');
  });

  it('keeps selected-state tokens in source (not hardcoded hex)', () => {
    const grid = fs.readFileSync(path.join(SRC, 'EmojiGrid/styles.ts'), 'utf8');
    const cell = fs.readFileSync(
      path.join(SRC, 'EmojiPickerSheet/SuggestionEmojiCell.tsx'),
      'utf8'
    );
    const sheetStyles = fs.readFileSync(
      path.join(SRC, 'EmojiPickerSheet/useSheetStyles.ts'),
      'utf8'
    );
    expect(grid).toContain('colors.secondary[100]');
    expect(cell).toContain('colors.secondary[100]');
    expect(sheetStyles).toContain('colors.secondary[500]');
    expect(sheetStyles).toContain('colors.border');
  });
});
