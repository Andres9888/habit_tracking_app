/**
 * Grid Theme Interface Tests
 *
 * Tests for the theme system including:
 * - Theme preset validation
 * - Theme utility functions
 * - Type safety and structure
 */

import {
  GITHUB_THEME,
  TILES_THEME,
  DOTS_THEME,
  PIXELS_THEME,
  GRID_THEMES,
  DEFAULT_THEME,
  getTheme,
  mergeThemeOverrides,
  type GridTheme,
  type GridThemeName,
  type GridThemeOverrides,
  type CellShape,
  type CompletionIndicator,
  type CellBorderStyle,
} from '../types';

describe('Grid Theme Interface', () => {
  describe('Theme Presets', () => {
    const allThemes: GridTheme[] = [
      GITHUB_THEME,
      TILES_THEME,
      DOTS_THEME,
      PIXELS_THEME,
    ];
    const themeNames: GridThemeName[] = ['github', 'tiles', 'dots', 'pixels'];

    describe.each(allThemes)('Theme: $name', (theme) => {
      it('has required id property', () => {
        expect(theme.id).toBeDefined();
        expect(themeNames).toContain(theme.id);
      });

      it('has required name and description', () => {
        expect(theme.name).toBeDefined();
        expect(typeof theme.name).toBe('string');
        expect(theme.name.length).toBeGreaterThan(0);

        expect(theme.description).toBeDefined();
        expect(typeof theme.description).toBe('string');
        expect(theme.description.length).toBeGreaterThan(0);
      });

      it('has valid cell shape', () => {
        const validShapes: CellShape[] = [
          'rounded-sm',
          'rounded-md',
          'rounded-lg',
          'rounded-full',
          'rounded-none',
        ];
        expect(validShapes).toContain(theme.cellShape);
      });

      it('has valid cell size configuration', () => {
        expect(theme.cellSize).toBeDefined();
        expect(typeof theme.cellSize.standard).toBe('number');
        expect(typeof theme.cellSize.large).toBe('number');
        expect(theme.cellSize.standard).toBeGreaterThan(0);
        expect(theme.cellSize.large).toBeGreaterThan(0);
        expect(theme.cellSize.large).toBeGreaterThan(theme.cellSize.standard);
      });

      it('has valid cell gap', () => {
        expect(typeof theme.cellGap).toBe('number');
        expect(theme.cellGap).toBeGreaterThanOrEqual(0);
      });

      it('has valid completion indicator', () => {
        const validIndicators: CompletionIndicator[] = [
          'checkmark',
          'fill-only',
          'dot',
          'glow',
        ];
        expect(validIndicators).toContain(theme.completionIndicator);
      });

      it('has valid streak colors', () => {
        expect(theme.streakColors).toBeDefined();
        expect(theme.streakColors.level1).toBeDefined();
        expect(theme.streakColors.level2).toBeDefined();
        expect(theme.streakColors.level3).toBeDefined();
        expect(theme.streakColors.level4).toBeDefined();

        // All colors should be valid hex colors
        const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        expect(theme.streakColors.level1).toMatch(hexColorRegex);
        expect(theme.streakColors.level2).toMatch(hexColorRegex);
        expect(theme.streakColors.level3).toMatch(hexColorRegex);
        expect(theme.streakColors.level4).toMatch(hexColorRegex);
      });

      it('has valid checkmark configuration', () => {
        expect(typeof theme.showCheckmark).toBe('boolean');
        expect(typeof theme.checkmarkScale).toBe('number');
        expect(theme.checkmarkScale).toBeGreaterThanOrEqual(0);
        expect(theme.checkmarkScale).toBeLessThanOrEqual(1);
      });

      it('has valid incomplete cell styling', () => {
        const validBorderStyles: CellBorderStyle[] = [
          'none',
          'solid',
          'dashed',
        ];
        expect(validBorderStyles).toContain(theme.incompleteBorder);
        expect(typeof theme.incompleteBorderWidth).toBe('number');
        expect(theme.incompleteBorderWidth).toBeGreaterThanOrEqual(0);
        expect(typeof theme.incompleteBackground).toBe('string');
      });

      it('has valid today indicator configuration', () => {
        expect(typeof theme.todayBorderColor).toBe('string');
        expect([0, 1, 2]).toContain(theme.todayPulseIntensity);
      });

      it('has valid future/before-creation styling', () => {
        expect(typeof theme.futureBackground).toBe('string');
        const validBorderStyles: CellBorderStyle[] = [
          'none',
          'solid',
          'dashed',
        ];
        expect(validBorderStyles).toContain(theme.futureBorder);
        expect(typeof theme.beforeCreationBackground).toBe('string');
      });

      it('has valid visual effects configuration', () => {
        expect(typeof theme.enableShadow).toBe('boolean');
        expect(typeof theme.shadowColor).toBe('string');
        expect(typeof theme.enableStreakGlow).toBe('boolean');
      });
    });

    it('GRID_THEMES contains all preset themes', () => {
      expect(Object.keys(GRID_THEMES)).toHaveLength(4);
      expect(GRID_THEMES.github).toBe(GITHUB_THEME);
      expect(GRID_THEMES.tiles).toBe(TILES_THEME);
      expect(GRID_THEMES.dots).toBe(DOTS_THEME);
      expect(GRID_THEMES.pixels).toBe(PIXELS_THEME);
    });

    it('DEFAULT_THEME is a valid theme name', () => {
      expect(themeNames).toContain(DEFAULT_THEME);
      expect(DEFAULT_THEME).toBe('github');
    });
  });

  describe('GitHub Theme (default)', () => {
    it('uses rounded-sm cell shape', () => {
      expect(GITHUB_THEME.cellShape).toBe('rounded-sm');
    });

    it('uses checkmark completion indicator', () => {
      expect(GITHUB_THEME.completionIndicator).toBe('checkmark');
      expect(GITHUB_THEME.showCheckmark).toBe(true);
    });

    it('uses emerald color gradient', () => {
      expect(GITHUB_THEME.streakColors.level1).toBe('#6ee7b7');
      expect(GITHUB_THEME.streakColors.level4).toBe('#059669');
    });

    it('has prominent today pulse', () => {
      expect(GITHUB_THEME.todayPulseIntensity).toBe(2);
      expect(GITHUB_THEME.todayBorderColor).toBe('#fbbf24');
    });
  });

  describe('Tiles Theme', () => {
    it('uses rounded-md cell shape', () => {
      expect(TILES_THEME.cellShape).toBe('rounded-md');
    });

    it('uses fill-only completion indicator', () => {
      expect(TILES_THEME.completionIndicator).toBe('fill-only');
      expect(TILES_THEME.showCheckmark).toBe(false);
    });

    it('has shadows enabled', () => {
      expect(TILES_THEME.enableShadow).toBe(true);
      expect(TILES_THEME.shadowColor).toBeTruthy();
    });

    it('has larger cell sizes', () => {
      expect(TILES_THEME.cellSize.standard).toBeGreaterThan(
        GITHUB_THEME.cellSize.standard
      );
    });
  });

  describe('Dots Theme', () => {
    it('uses rounded-full (circular) cell shape', () => {
      expect(DOTS_THEME.cellShape).toBe('rounded-full');
    });

    it('uses dot completion indicator', () => {
      expect(DOTS_THEME.completionIndicator).toBe('dot');
      expect(DOTS_THEME.showCheckmark).toBe(false);
    });

    it('uses green color gradient (different from GitHub)', () => {
      expect(DOTS_THEME.streakColors.level1).toBe('#86efac');
      expect(DOTS_THEME.streakColors.level4).toBe('#16a34a');
    });

    it('has transparent backgrounds for minimalism', () => {
      expect(DOTS_THEME.incompleteBackground).toBe('transparent');
      expect(DOTS_THEME.futureBackground).toBe('transparent');
    });

    it('has streak glow enabled', () => {
      expect(DOTS_THEME.enableStreakGlow).toBe(true);
    });
  });

  describe('Pixels Theme', () => {
    it('uses rounded-none (sharp) cell shape', () => {
      expect(PIXELS_THEME.cellShape).toBe('rounded-none');
    });

    it('has tighter cell gap for pixel effect', () => {
      expect(PIXELS_THEME.cellGap).toBeLessThan(GITHUB_THEME.cellGap);
    });

    it('uses lime color gradient for retro feel', () => {
      expect(PIXELS_THEME.streakColors.level1).toBe('#bef264');
      expect(PIXELS_THEME.streakColors.level4).toBe('#65a30d');
    });

    it('uses dark backgrounds', () => {
      expect(PIXELS_THEME.incompleteBackground).toBe('#1c1917');
      expect(PIXELS_THEME.futureBackground).toBe('#292524');
    });
  });

  describe('getTheme utility', () => {
    it('returns correct theme for valid name', () => {
      expect(getTheme('github')).toBe(GITHUB_THEME);
      expect(getTheme('tiles')).toBe(TILES_THEME);
      expect(getTheme('dots')).toBe(DOTS_THEME);
      expect(getTheme('pixels')).toBe(PIXELS_THEME);
    });

    it('returns default theme for invalid name', () => {
      // @ts-expect-error Testing invalid theme name
      const theme = getTheme('invalid-theme');
      expect(theme).toBe(GITHUB_THEME);
    });
  });

  describe('mergeThemeOverrides utility', () => {
    it('returns base theme when no overrides provided', () => {
      const result = mergeThemeOverrides(GITHUB_THEME, {});
      expect(result).toEqual(GITHUB_THEME);
    });

    it('overrides simple properties', () => {
      const overrides: GridThemeOverrides = {
        cellGap: 10,
        showCheckmark: false,
      };
      const result = mergeThemeOverrides(GITHUB_THEME, overrides);

      expect(result.cellGap).toBe(10);
      expect(result.showCheckmark).toBe(false);
      // Other properties unchanged
      expect(result.cellShape).toBe(GITHUB_THEME.cellShape);
      expect(result.id).toBe(GITHUB_THEME.id);
    });

    it('deep merges cellSize configuration', () => {
      const overrides: GridThemeOverrides = {
        cellSize: { standard: 25 },
      };
      const result = mergeThemeOverrides(GITHUB_THEME, overrides);

      expect(result.cellSize.standard).toBe(25);
      // Large should remain unchanged
      expect(result.cellSize.large).toBe(GITHUB_THEME.cellSize.large);
    });

    it('deep merges streakColors configuration', () => {
      const overrides: GridThemeOverrides = {
        streakColors: { level4: '#ff0000' },
      };
      const result = mergeThemeOverrides(GITHUB_THEME, overrides);

      expect(result.streakColors.level4).toBe('#ff0000');
      // Other levels unchanged
      expect(result.streakColors.level1).toBe(GITHUB_THEME.streakColors.level1);
      expect(result.streakColors.level2).toBe(GITHUB_THEME.streakColors.level2);
      expect(result.streakColors.level3).toBe(GITHUB_THEME.streakColors.level3);
    });

    it('preserves id and name from base theme', () => {
      const overrides: GridThemeOverrides = {
        description: 'Custom description',
      };
      const result = mergeThemeOverrides(GITHUB_THEME, overrides);

      expect(result.id).toBe(GITHUB_THEME.id);
      expect(result.name).toBe(GITHUB_THEME.name);
      expect(result.description).toBe('Custom description');
    });

    it('can completely override nested objects', () => {
      const overrides: GridThemeOverrides = {
        cellSize: { standard: 30, large: 80 },
        streakColors: {
          level1: '#aaa',
          level2: '#bbb',
          level3: '#ccc',
          level4: '#ddd',
        },
      };
      const result = mergeThemeOverrides(GITHUB_THEME, overrides);

      expect(result.cellSize).toEqual({ standard: 30, large: 80 });
      expect(result.streakColors).toEqual({
        level1: '#aaa',
        level2: '#bbb',
        level3: '#ccc',
        level4: '#ddd',
      });
    });

    it('does not mutate the base theme', () => {
      const originalGap = GITHUB_THEME.cellGap;
      const overrides: GridThemeOverrides = { cellGap: 100 };

      mergeThemeOverrides(GITHUB_THEME, overrides);

      expect(GITHUB_THEME.cellGap).toBe(originalGap);
    });
  });

  describe('Theme Consistency', () => {
    it('all themes have unique ids', () => {
      const ids = Object.values(GRID_THEMES).map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all themes have unique names', () => {
      const names = Object.values(GRID_THEMES).map((t) => t.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('large cell size is always greater than standard', () => {
      Object.values(GRID_THEMES).forEach((theme) => {
        expect(theme.cellSize.large).toBeGreaterThan(theme.cellSize.standard);
      });
    });

    it('streak colors progress in intensity', () => {
      // This is a visual design check - darker colors should come later in the gradient
      // We can verify the colors are all different (representing progression)
      Object.values(GRID_THEMES).forEach((theme) => {
        const colors = Object.values(theme.streakColors);
        const uniqueColors = new Set(colors);
        expect(uniqueColors.size).toBe(4);
      });
    });
  });

  describe('Type Safety', () => {
    it('GridThemeOverrides excludes id and name', () => {
      // GridThemeOverrides should allow cellGap but not id or name
      // This is validated at compile time - if id or name were allowed,
      // the Omit<GridTheme, 'id' | 'name'> type would be incorrect
      const overrides: GridThemeOverrides = {
        cellGap: 5,
      };
      // If this compiles without allowing id/name, the test passes
      expect(overrides.cellGap).toBe(5);
      // Verify id and name are not in the type by checking they're undefined
      expect('id' in overrides).toBe(false);
      expect('name' in overrides).toBe(false);
    });

    it('GridThemeName is a valid union type', () => {
      const validNames: GridThemeName[] = ['github', 'tiles', 'dots', 'pixels'];
      validNames.forEach((name) => {
        expect(GRID_THEMES[name]).toBeDefined();
      });
    });
  });
});
