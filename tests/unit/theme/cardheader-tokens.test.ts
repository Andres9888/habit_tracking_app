/**
 * CardHeader.styles Theme Token Migration Tests
 * Validates hardcoded hex values were replaced with theme tokens.
 */

import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import {
  getIconContainerStyle,
  getChevronColor,
  TITLE_OVERLAY_STYLE,
} from '../../../src/components/DraggableHabit/CardHeader.styles';

describe('CardHeader.styles - Theme Token Migration', () => {
  describe('getIconContainerStyle', () => {
    it('uses colors.gray[900] for high-contrast border', () => {
      const style = getIconContainerStyle('#fff', '#10b981', true);
      expect(style.borderColor).toBe(colors.gray[900]);
    });

    it('uses rgba border for non-high-contrast mode', () => {
      const style = getIconContainerStyle('#fff', '#10b981', false);
      expect(style.borderColor).toBe('rgba(0,0,0,0.04)');
    });

    it('preserves dynamic accentColor for shadowColor', () => {
      const accent = '#10b981';
      const style = getIconContainerStyle('#fff', accent, false);
      expect(style.shadowColor).toBe(accent);
    });
  });

  describe('TITLE_OVERLAY_STYLE', () => {
    it('uses spacing.sm for paddingLeft', () => {
      expect(TITLE_OVERLAY_STYLE.paddingLeft).toBe(spacing.sm);
    });

    it('uses spacing.md for paddingRight', () => {
      expect(TITLE_OVERLAY_STYLE.paddingRight).toBe(spacing.md);
    });

    it('uses spacing.md for right offset', () => {
      expect(TITLE_OVERLAY_STYLE.right).toBe(spacing.md);
    });
  });

  describe('getChevronColor', () => {
    it('uses named constant for high-contrast chevron', () => {
      // HIGH_CONTRAST_CHEVRON (#facc15) - yellow-400 for accessibility
      expect(getChevronColor(true)).toBe('#facc15');
    });

    it('uses colors.text.tertiary for normal chevron', () => {
      expect(getChevronColor(false)).toBe(colors.text.tertiary);
    });
  });
});
