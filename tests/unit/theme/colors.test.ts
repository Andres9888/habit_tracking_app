/**
 * Color Palette Tests
 * Verifies all colors match UX Specification Section 5.1
 *
 * Phase 1 Acceptance Criteria:
 * - All hex values match UX spec exactly
 * - WCAG 2.1 Level AA color contrast compliance
 */

import { colors, milestoneColors, warmPalette } from '@/theme/colors';

describe('Theme Colors - Phase 1', () => {
  describe('Primary Colors (Growth & Progress)', () => {
    it('should match UX spec Primary-400 (#34D399)', () => {
      expect(colors.primary[400]).toBe('#34D399');
    });

    it('should match UX spec Primary-500 (#10B981) - main brand color', () => {
      expect(colors.primary[500]).toBe('#10B981');
    });

    it('should match UX spec Primary-600 (#059669)', () => {
      expect(colors.primary[600]).toBe('#059669');
    });

    it('should match UX spec Primary-700 (#047857)', () => {
      expect(colors.primary[700]).toBe('#047857');
    });
  });

  describe('Secondary Colors (Trust & Calm)', () => {
    it('should match UX spec Secondary-400 (#60A5FA)', () => {
      expect(colors.secondary[400]).toBe('#60A5FA');
    });

    it('should match UX spec Secondary-500 (#3B82F6)', () => {
      expect(colors.secondary[500]).toBe('#3B82F6');
    });

    it('should match UX spec Secondary-600 (#2563EB)', () => {
      expect(colors.secondary[600]).toBe('#2563EB');
    });
  });

  describe('Semantic Colors', () => {
    it('should match UX spec Success (#15793C)', () => {
      expect(colors.success).toBe('#15793C');
    });

    it('should match UX spec Warning (#9A5504)', () => {
      expect(colors.warning).toBe('#9A5504');
    });

    it('should match UX spec Error (#B53030)', () => {
      expect(colors.error).toBe('#B53030');
    });

    it('should match UX spec Info (#3872B8)', () => {
      expect(colors.info).toBe('#3872B8');
    });
  });

  describe('Neutral Grays (iOS-inspired)', () => {
    const grayValues = {
      50: '#FAF8F5',
      100: '#F5F1ED',
      200: '#DDD8D2',
      300: '#C4BFB7',
      400: '#6E6660',
      500: '#6B6560',
      600: '#524D47',
      700: '#3D3833',
      800: '#2D2A26',
      900: '#1A1816',
    };

    for (const [key, value] of Object.entries(grayValues)) {
      it(`should match UX spec Gray-${key} (${value})`, () => {
        expect(colors.gray[key as keyof typeof colors.gray]).toBe(value);
      });
    }
  });

  describe('Habit Strength Level Colors', () => {
    it('should match Starting (0-20%): #4D7A0A', () => {
      expect(colors.strength.starting).toBe('#4D7A0A');
    });

    it('should match Building (20-40%): #16a34a (green-600) 🌿', () => {
      expect(colors.strength.building).toBe('#16a34a');
    });

    it('should match Developing (40-60%): #0d9488 (teal-600) 🌳', () => {
      expect(colors.strength.developing).toBe('#0d9488');
    });

    it('should match Strong (60-80%): #0891b2 (cyan-600) 💪', () => {
      expect(colors.strength.strong).toBe('#0891b2');
    });

    it('should match Automatic (80-100%): #059669 (emerald-600) ⚡', () => {
      expect(colors.strength.automatic).toBe('#059669');
    });
  });

  describe('Background & Surfaces', () => {
    it('should match UX spec Light Background (#F5F1ED)', () => {
      expect(colors.light.background).toBe('#F5F1ED');
    });

    it('should match UX spec Light Surface (#EDEAE5)', () => {
      expect(colors.light.surface).toBe('#EDEAE5');
    });

    it('should match UX spec Light Card (#EDEAE5)', () => {
      expect(colors.light.card).toBe('#EDEAE5');
    });

    it('should match UX spec Dark Background (#111827)', () => {
      expect(colors.dark.background).toBe('#111827');
    });

    it('should match UX spec Dark Surface (#1F2937)', () => {
      expect(colors.dark.surface).toBe('#1F2937');
    });

    it('should match UX spec Dark Card (#374151)', () => {
      expect(colors.dark.card).toBe('#374151');
    });
  });

  describe('Text Colors', () => {
    it('should match UX spec Text Primary (#2D2A26)', () => {
      expect(colors.text.primary).toBe('#2D2A26');
    });

    it('should match UX spec Text Secondary (#6B6560)', () => {
      expect(colors.text.secondary).toBe('#6B6560');
    });

    it('should match UX spec Text Tertiary (#6E6660)', () => {
      expect(colors.text.tertiary).toBe('#6E6660');
    });

    it('should match UX spec Text Inverse (#FFFFFF)', () => {
      expect(colors.text.inverse).toBe('#FFFFFF');
    });
  });

  describe('Convenience Aliases', () => {
    it('should have background alias matching light.background', () => {
      expect(colors.background).toBe(colors.light.background);
    });

    it('should have surface alias matching light.surface', () => {
      expect(colors.surface).toBe(colors.light.surface);
    });

    it('should have border alias (#DDD8D2)', () => {
      expect(colors.border).toBe('#DDD8D2');
      expect(colors.border).toBe(colors.gray[200]);
    });
  });

  describe('WCAG 2.1 Level AA Compliance', () => {
    it('should use the AA warning token for text', () => {
      expect(colors.warning).toBe('#9A5504');
    });

    it('should use Primary-700 for text (not Primary-500)', () => {
      // Primary-500 has insufficient contrast for small text (2.9:1)
      // Primary-700 provides sufficient contrast
      expect(colors.primary[700]).toBe('#047857');
    });
  });

  describe('Color Object Structure', () => {
    it('should be immutable (const assertion)', () => {
      // TypeScript type check - if this compiles, const assertion works
      const testColor: '#10B981' = colors.primary[500];
      expect(testColor).toBe('#10B981');
    });

    it('should have all required color categories', () => {
      expect(colors).toHaveProperty('primary');
      expect(colors).toHaveProperty('secondary');
      expect(colors).toHaveProperty('success');
      expect(colors).toHaveProperty('warning');
      expect(colors).toHaveProperty('error');
      expect(colors).toHaveProperty('info');
      expect(colors).toHaveProperty('gray');
      expect(colors).toHaveProperty('strength');
      expect(colors).toHaveProperty('light');
      expect(colors).toHaveProperty('dark');
      expect(colors).toHaveProperty('text');
    });

    it('should export warmPalette separately from colors', () => {
      // warmPalette is a separate semantic group, not nested in colors
      expect(warmPalette).toBeDefined();
      expect(warmPalette.background).toBe('#F5F1ED');
    });
  });

  describe('Warm Stone Palette', () => {
    it('should export warmPalette from theme', () => {
      expect(warmPalette).toBeDefined();
    });

    it('should have background (#F5F1ED)', () => {
      expect(warmPalette.background).toBe('#F5F1ED');
    });

    it('should have foreground (#2D2A26)', () => {
      expect(warmPalette.foreground).toBe('#2D2A26');
    });

    it('should have neutral (#C4BFB7)', () => {
      expect(warmPalette.neutral).toBe('#C4BFB7');
    });

    it('should have border (#DDD8D2)', () => {
      expect(warmPalette.border).toBe('#DDD8D2');
    });

    it('should have cardBg (#EDEAE5)', () => {
      expect(warmPalette.cardBg).toBe('#EDEAE5');
    });

    it('should have all 5 warm palette keys', () => {
      const keys = Object.keys(warmPalette);
      expect(keys).toHaveLength(5);
      expect(keys).toEqual(
        expect.arrayContaining([
          'background',
          'border',
          'cardBg',
          'foreground',
          'neutral',
        ])
      );
    });
  });

  describe('Milestone Colors (Badge/Achievement)', () => {
    it('should export milestoneColors from theme', () => {
      expect(milestoneColors).toBeDefined();
    });

    it('should have amber (#F59E0B) for 7-day milestone', () => {
      expect(milestoneColors.amber).toBe('#F59E0B');
    });

    it('should have yellow (#EAB308) for 30-day milestone', () => {
      expect(milestoneColors.yellow).toBe('#EAB308');
    });

    it('should have violet (#8B5CF6) for 100-day milestone', () => {
      expect(milestoneColors.violet).toBe('#8B5CF6');
    });

    it('should have amberLight (#FEF9C3) for badge backgrounds', () => {
      expect(milestoneColors.amberLight).toBe('#FEF9C3');
    });

    it('should have amberBorder (#FCD34D) for badge borders', () => {
      expect(milestoneColors.amberBorder).toBe('#FCD34D');
    });

    it('should have amberDark (#78350F) for badge text', () => {
      expect(milestoneColors.amberDark).toBe('#78350F');
    });

    it('should have stone (#A8A29E) for unachieved state', () => {
      expect(milestoneColors.stone).toBe('#A8A29E');
    });

    it('should have amberText (#A16207) for text on amber backgrounds', () => {
      expect(milestoneColors.amberText).toBe('#A16207');
    });

    it('should have the milestone color keys', () => {
      const keys = Object.keys(milestoneColors);
      expect(keys).toEqual(
        expect.arrayContaining([
          'amber',
          'amberBorder',
          'amberDark',
          'amberLight',
          'amberText',
          'stone',
          'violet',
          'yellow',
        ])
      );
    });
  });
});
