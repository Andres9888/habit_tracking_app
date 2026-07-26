/**
 * White Color Replacement Tests (Part 1)
 * OfflinePendingBanner, UndoToasts, Theme Token Verification
 */

import { colors } from '@/theme/colors';
import { layoutStyles } from '@/components/OfflinePendingBanner/styles/layout.styles';
import { controlsStyles } from '@/components/OfflinePendingBanner/styles/controls.styles';
import * as fs from 'fs';
import * as path from 'path';

const SRC_ROOT = path.resolve(__dirname, '../../../src');
const archiveToastSource = fs.readFileSync(
  path.join(SRC_ROOT, 'components/ArchiveUndoToast/styles.ts'),
  'utf-8'
);
const deleteToastSource = fs.readFileSync(
  path.join(SRC_ROOT, 'components/DeleteUndoToast/styles.ts'),
  'utf-8'
);

describe('White Color Replacement - Banner & Toast', () => {
  describe('OfflinePendingBanner', () => {
    it('should use colors.light.card for iconContainer background', () => {
      expect(layoutStyles.iconContainer.backgroundColor).toBe(
        colors.light.card
      );
    });

    it('should use colors.text.inverse for syncButtonText', () => {
      expect(controlsStyles.syncButtonText.color).toBe(colors.text.inverse);
    });
  });

  describe('ArchiveUndoToast', () => {
    it('should use the theme-aware card token for toast background', () => {
      expect(archiveToastSource).toContain('backgroundColor: colors.card');
    });
  });

  describe('DeleteUndoToast', () => {
    it('should use the theme-aware card token for toast background', () => {
      expect(deleteToastSource).toContain('backgroundColor: colors.card');
    });
  });

  describe('Theme Token Verification', () => {
    it('colors.text.inverse should be #FFFFFF', () => {
      expect(colors.text.inverse.toLowerCase()).toBe('#ffffff');
    });

    it('colors.light.card should be the warm level-one surface', () => {
      expect(colors.light.card.toLowerCase()).toBe('#edeae5');
    });
  });

  describe('Style Object Integrity', () => {
    it('should maintain layout.styles structure', () => {
      expect(layoutStyles.iconContainer).toMatchObject({
        alignItems: 'center',
        height: 36,
        width: 36,
      });
    });

    it('should maintain controls.styles structure', () => {
      expect(controlsStyles.syncButtonText).toMatchObject({
        fontSize: 13,
        fontWeight: '600',
      });
    });

    it('should maintain ArchiveUndoToast structure', () => {
      expect(archiveToastSource).toMatch(
        /toast:\s*\{[\s\S]*?borderWidth:\s*1[\s\S]*?maxWidth:\s*400[\s\S]*?overflow:\s*'hidden'/
      );
    });

    it('should maintain DeleteUndoToast structure', () => {
      expect(deleteToastSource).toMatch(
        /toast:\s*\{[\s\S]*?borderWidth:\s*1[\s\S]*?maxWidth:\s*400[\s\S]*?overflow:\s*'hidden'/
      );
    });
  });
});
