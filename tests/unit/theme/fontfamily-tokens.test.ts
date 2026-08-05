/**
 * Font Family Token Migration Tests (Phase 4)
 * Verifies that component style files use fontFamilies tokens
 * from @/theme/typography instead of hardcoded font family strings.
 */

import { fontFamilies } from '@/theme/typography';
import { statusStyles } from '@/components/HabitCard/HabitCard.statusStyles';
import { styles } from '@/components/HabitCard/HabitCard.styles';

describe('Font Family Token Migration - Phase 4', () => {
  describe('HabitCard.statusStyles uses fontFamilies tokens', () => {
    it('streakText fontFamily should use fontFamilies.primary.text', () => {
      expect(statusStyles.streakText.fontFamily).toBe(
        fontFamilies.primary.text
      );
      expect(statusStyles.streakText.fontFamily).toBe('DMSans');
    });
  });

  describe('HabitCard.styles uses fontFamilies tokens', () => {
    it('habitMeta fontFamily should use fontFamilies.primary.text', () => {
      expect(styles.habitMeta.fontFamily).toBe(fontFamilies.primary.text);
      expect(styles.habitMeta.fontFamily).toBe('DMSans');
    });

    it('habitName fontFamily should use fontFamilies.primary.text', () => {
      expect(styles.habitName.fontFamily).toBe(fontFamilies.primary.text);
      expect(styles.habitName.fontFamily).toBe('DMSans');
    });

    it('streakText fontFamily should use fontFamilies.primary.text', () => {
      expect(styles.streakText.fontFamily).toBe(fontFamilies.primary.text);
      expect(styles.streakText.fontFamily).toBe('DMSans');
    });

    it('should not contain any hardcoded System or Roboto font families', () => {
      const allFontFamilies = [
        styles.habitMeta.fontFamily,
        styles.habitName.fontFamily,
        styles.streakText.fontFamily,
        styles.streakText.fontFamily,
      ];

      for (const ff of allFontFamilies) {
        expect(ff).not.toBe('System');
        expect(ff).not.toBe('Roboto');
        expect(ff).not.toContain('System');
        expect(ff).not.toContain('Roboto');
      }
    });
  });

  describe('fontFamilies theme tokens exist', () => {
    it('primary.text should be DM Sans', () => {
      expect(fontFamilies.primary.text).toBe('DMSans');
    });

    it('primary.display should be Literata', () => {
      expect(fontFamilies.primary.display).toBe('Literata');
    });

    it('monospace should be JetBrains Mono', () => {
      expect(fontFamilies.monospace).toBe('JetBrainsMono');
    });

    it('serif should be Literata', () => {
      expect(fontFamilies.serif).toBe('Literata');
    });

    it('system should be -apple-system', () => {
      expect(fontFamilies.system).toBe('-apple-system');
    });
  });
});
