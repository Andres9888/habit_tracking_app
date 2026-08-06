/**
 * SettingsRow Press Feedback Tests (Phase 6 Task 4)
 * Verifies that TouchableOpacity has been replaced with
 * AnimatedPressable for consistent scale-based press feedback.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), 'utf-8');
}

describe('SettingsRow uses AnimatedPressable', () => {
  const source = readSource('components/SettingsModal/SettingsRow.tsx');

  it('imports AnimatedPressable from ui/AnimatedPressable', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*AnimatedPressable[^}]*\}\s+from\s+['"]\.\.\/ui\/AnimatedPressable['"]/
    );
  });

  it('does not import TouchableOpacity from react-native', () => {
    expect(source).not.toMatch(/TouchableOpacity/);
  });

  it('uses AnimatedPressable for pressable rows', () => {
    expect(source).toContain('<AnimatedPressable');
    expect(source).toContain('</AnimatedPressable>');
  });

  it('has exactly 1 AnimatedPressable wrapper', () => {
    const openTags = source.match(/<AnimatedPressable[\s>]/g);
    const closeTags = source.match(/<\/AnimatedPressable>/g);
    expect(openTags).toHaveLength(1);
    expect(closeTags).toHaveLength(1);
  });

  it('does not use activeOpacity prop', () => {
    expect(source).not.toContain('activeOpacity');
  });

  it('preserves accessibilityRole on AnimatedPressable', () => {
    expect(source).toContain("accessibilityRole='button'");
    const roleIndex = source.indexOf("accessibilityRole='button'");
    const precedingChunk = source.slice(
      Math.max(0, roleIndex - 100),
      roleIndex
    );
    expect(precedingChunk).toContain('<AnimatedPressable');
  });

  it('preserves onPress handler on AnimatedPressable', () => {
    expect(source).toContain('onPress={handleNavPress}');
  });

  it('still returns non-pressable content for toggle type', () => {
    expect(source).toMatch(/type\s*===\s*['"]toggle['"]/);
    expect(source).toMatch(
      /if\s*\(\s*type\s*===\s*['"]toggle['"]\s*\|\|\s*type\s*===\s*['"]info['"]\s*\)/
    );
  });

  it('still returns non-pressable content for info type', () => {
    expect(source).toMatch(/type\s*===\s*['"]info['"]/);
  });

  it('still uses haptic feedback on press', () => {
    expect(source).toContain('Haptics.impactAsync');
    expect(source).toContain('Haptics.ImpactFeedbackStyle.Light');
  });
});
