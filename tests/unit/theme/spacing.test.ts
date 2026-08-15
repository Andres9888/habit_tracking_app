/**
 * Spacing, radius, and shadow tokens
 */

import {
  spacing,
  screenMargins,
  componentSpacing,
  borderRadius,
  shadows,
  getSpacing,
  createSpacing,
  createPadding,
} from '@/theme/spacing';

describe('Theme Spacing', () => {
  describe('8pt grid', () => {
    it('has xs/sm/md/base/lg/xl/2xl/3xl and no xxs alias', () => {
      expect(spacing.xs).toBe(4);
      expect(spacing.sm).toBe(8);
      expect(spacing.md).toBe(12);
      expect(spacing.base).toBe(16);
      expect(spacing.lg).toBe(24);
      expect(spacing.xl).toBe(32);
      expect(spacing['2xl']).toBe(48);
      expect(spacing['3xl']).toBe(64);
      expect(spacing).not.toHaveProperty('xxs');
      expect(spacing).not.toHaveProperty('xxl');
    });

    it('uses multiples of 4pt', () => {
      for (const value of Object.values(spacing)) {
        expect(value % 4).toBe(0);
      }
    });
  });

  describe('Screen and component spacing', () => {
    it('uses the current screen margins', () => {
      expect(screenMargins.horizontal).toBe(spacing.base);
      expect(screenMargins.verticalTop).toBe(spacing.sm);
      expect(screenMargins.verticalBottom).toBe(spacing.base);
    });

    it('keeps card/list/button/input/modal/tabBar sizes', () => {
      expect(componentSpacing.card.padding).toBe(16);
      expect(componentSpacing.listItem.height).toBe(72);
      expect(componentSpacing.button.height).toBe(44);
      expect(componentSpacing.input.height).toBe(44);
      expect(componentSpacing.modal.padding).toBe(24);
      expect(componentSpacing.tabBar.height).toBe(49);
    });
  });

  describe('Border radius (airy scale)', () => {
    it('matches airy chip/button/card/modal radii', () => {
      expect(borderRadius.xs).toBe(4);
      expect(borderRadius.small).toBe(10);
      expect(borderRadius.medium).toBe(14);
      expect(borderRadius.large).toBe(24);
      expect(borderRadius.xl).toBe(28);
      expect(borderRadius.full).toBe(9999);
    });
  });

  describe('Shadows', () => {
    it('uses warm #2D2A26 shadow color', () => {
      expect(shadows.card.shadowColor).toBe('#2D2A26');
      expect(shadows.modal.shadowColor).toBe('#2D2A26');
      expect(shadows.floatingActionButton.shadowColor).toBe('#2D2A26');
    });

    it('matches current elevation tokens', () => {
      expect(shadows.card).toMatchObject({
        elevation: 3,
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      });
      expect(shadows.modal).toMatchObject({
        elevation: 8,
        shadowOffset: { height: 8, width: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      });
      expect(shadows.floatingActionButton).toMatchObject({
        elevation: 6,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      });
    });
  });

  describe('Helpers', () => {
    it('getSpacing / createSpacing / createPadding', () => {
      expect(getSpacing('base')).toBe(16);
      expect(createSpacing(16, 8)).toEqual({
        marginHorizontal: 8,
        marginVertical: 16,
      });
      expect(createPadding(12, 16)).toEqual({
        paddingHorizontal: 16,
        paddingVertical: 12,
      });
    });
  });
});
