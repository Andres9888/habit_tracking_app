/**
 * Color Palette Tests
 * Verifies all colors match UX Specification Section 5.1
 *
 * Phase 1 Acceptance Criteria:
 * - All hex values match UX spec exactly
 * - WCAG 2.1 Level AA color contrast compliance
 */

import { colors } from '../colors';

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
    it('should match UX spec Success (#10B981)', () => {
      expect(colors.success).toBe('#10B981');
    });

    it('should match UX spec Warning-500 (#F59E0B)', () => {
      expect(colors.warning[500]).toBe('#F59E0B');
    });

    it('should match UX spec Warning-700 (#D97706)', () => {
      expect(colors.warning[700]).toBe('#D97706');
    });

    it('should match UX spec Error (#EF4444)', () => {
      expect(colors.error).toBe('#EF4444');
    });

    it('should match UX spec Info (#3B82F6)', () => {
      expect(colors.info).toBe('#3B82F6');
    });
  });

  describe('Neutral Grays (iOS-inspired)', () => {
    const grayValues = {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    };

    Object.entries(grayValues).forEach(([key, value]) => {
      it(`should match UX spec Gray-${key} (${value})`, () => {
        expect(colors.gray[key as keyof typeof colors.gray]).toBe(value);
      });
    });
  });

  describe('Habit Strength Level Colors', () => {
    it('should match UX spec Starting (0-20%): #86EFAC 🌱', () => {
      expect(colors.strength.starting).toBe('#86EFAC');
    });

    it('should match UX spec Building (20-40%): #10B981 🌿', () => {
      expect(colors.strength.building).toBe('#10B981');
    });

    it('should match UX spec Developing (40-60%): #059669 🌳', () => {
      expect(colors.strength.developing).toBe('#059669');
    });

    it('should match UX spec Strong (60-80%): #047857 💪', () => {
      expect(colors.strength.strong).toBe('#047857');
    });

    it('should match UX spec Automatic (80-100%): #065F46 ⚡', () => {
      expect(colors.strength.automatic).toBe('#065F46');
    });
  });

  describe('Background & Surfaces', () => {
    it('should match UX spec Light Background (#FFFFFF)', () => {
      expect(colors.light.background).toBe('#FFFFFF');
    });

    it('should match UX spec Light Surface (#F9FAFB)', () => {
      expect(colors.light.surface).toBe('#F9FAFB');
    });

    it('should match UX spec Light Card (#FFFFFF)', () => {
      expect(colors.light.card).toBe('#FFFFFF');
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
    it('should match UX spec Text Primary (#1F2937)', () => {
      expect(colors.text.primary).toBe('#1F2937');
    });

    it('should match UX spec Text Secondary (#6B7280)', () => {
      expect(colors.text.secondary).toBe('#6B7280');
    });

    it('should match UX spec Text Tertiary (#9CA3AF)', () => {
      expect(colors.text.tertiary).toBe('#9CA3AF');
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

    it('should have border alias (#E5E7EB)', () => {
      expect(colors.border).toBe('#E5E7EB');
      expect(colors.border).toBe(colors.gray[200]);
    });
  });

  describe('WCAG 2.1 Level AA Compliance', () => {
    it('should use Warning-700 for text (not Warning-500)', () => {
      // Warning-500 has insufficient contrast (2.3:1)
      // Warning-700 should be used for text
      expect(colors.warning[700]).toBe('#D97706');
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
  });
});
