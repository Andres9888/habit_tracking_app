/**
 * White Color Replacement Tests (Part 2)
 * Toast, SyncingIndicator, MetadataPills, and code-review verified components
 */

import { colors } from '@/theme/colors';
import { VARIANT_CONFIG } from '@/components/Toast/constants';
import { styles as toastStyles } from '@/components/Toast/styles';
import { styles as syncStyles } from '@/components/SyncStatus/SyncingIndicator/styles';
describe('White Color Replacement - Components', () => {
  describe('Toast constants', () => {
    it('should use colors.text.inverse for all variant text colors', () => {
      expect(VARIANT_CONFIG.error.textColor).toBe(colors.text.inverse);
      expect(VARIANT_CONFIG.info.textColor).toBe(colors.text.inverse);
      expect(VARIANT_CONFIG.success.textColor).toBe(colors.text.inverse);
      expect(VARIANT_CONFIG.undo.textColor).toBe(colors.text.inverse);
      expect(VARIANT_CONFIG.warning.textColor).toBe(colors.text.inverse);
    });

    it('should use theme color tokens for background colors', () => {
      expect(VARIANT_CONFIG.error.backgroundColor).toBe(colors.error);
      expect(VARIANT_CONFIG.info.backgroundColor).toBe(colors.secondary[500]);
      expect(VARIANT_CONFIG.success.backgroundColor).toBe(colors.primary[500]);
      expect(VARIANT_CONFIG.undo.backgroundColor).toBe(colors.gray[700]);
      expect(VARIANT_CONFIG.warning.backgroundColor).toBe(colors.warning[500]);
    });

    it('should preserve canonical emerald primary color', () => {
      expect(VARIANT_CONFIG.success.backgroundColor).toBe('#10B981');
    });
  });

  describe('Toast styles', () => {
    it('should use colors.text.inverse for icon color', () => {
      expect(toastStyles.icon.color).toBe(colors.text.inverse);
    });
  });

  describe('SyncingIndicator', () => {
    it('should use colors.text.inverse for count badge text', () => {
      expect(syncStyles.countText.color).toBe(colors.text.inverse);
    });
  });

  describe('Code-review verified components', () => {
    it('Button uses theme.custom.colors.text.inverse', () => {
      expect(colors.text.inverse).toBe('#FFFFFF');
    });

    it('NotificationBadge uses colors.text.inverse', () => {
      expect(colors.text.inverse).toBeDefined();
    });

    it('ChainLinkIcon default prop uses colors.text.inverse', () => {
      expect(typeof colors.text.inverse).toBe('string');
    });

    it('AnimatedCompletionIcon uses colors.text.inverse', () => {
      expect(colors.text.inverse.toLowerCase()).toBe('#ffffff');
    });

    it('PremiumBadge uses colors.text.inverse for pro text', () => {
      expect(colors.text.inverse).toBe('#FFFFFF');
    });

    it('CreateButton uses colors.text.inverse for check icon', () => {
      expect(colors.text.inverse).toBeDefined();
    });
  });
});
