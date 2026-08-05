/**
 * RewardCelebrationToast Press Feedback Tests (Phase 6 Task 3)
 * Verifies that all Pressable buttons have been replaced with
 * AnimatedPressable for consistent scale-based press feedback.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), 'utf-8');
}

describe('RewardCelebrationToast uses AnimatedPressable', () => {
  const source = readSource(
    'components/RewardCelebrationToast/RewardCelebrationToast.tsx'
  );

  it('imports AnimatedPressable from ui/AnimatedPressable', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*AnimatedPressable[^}]*\}\s+from\s+['"]\.\.\/ui\/AnimatedPressable['"]/
    );
  });

  it('does not import Pressable from react-native', () => {
    // Should import Animated, Text, View but NOT Pressable
    expect(source).not.toMatch(
      /import\s+\{[^}]*Pressable[^}]*\}\s+from\s+['"]react-native['"]/
    );
  });

  it('uses AnimatedPressable for Share button', () => {
    expect(source).toContain("accessibilityLabel='Share streak'");
    const shareIndex = source.indexOf("accessibilityLabel='Share streak'");
    const precedingChunk = source.slice(
      Math.max(0, shareIndex - 200),
      shareIndex
    );
    expect(precedingChunk).toContain('<AnimatedPressable');
  });

  it('uses AnimatedPressable for primary CTA button', () => {
    expect(source).toContain('accessibilityLabel={premiumCTA.text}');
    const ctaIndex = source.indexOf('accessibilityLabel={premiumCTA.text}');
    const precedingChunk = source.slice(Math.max(0, ctaIndex - 200), ctaIndex);
    expect(precedingChunk).toContain('<AnimatedPressable');
  });

  it('uses AnimatedPressable for dismiss button', () => {
    expect(source).toContain("accessibilityLabel='Dismiss reward toast'");
    const dismissIndex = source.indexOf(
      "accessibilityLabel='Dismiss reward toast'"
    );
    const precedingChunk = source.slice(
      Math.max(0, dismissIndex - 200),
      dismissIndex
    );
    expect(precedingChunk).toContain('<AnimatedPressable');
  });

  it('does not use plain <Pressable> elements', () => {
    // AnimatedContainer is fine (Animated.createAnimatedComponent(View))
    // But no plain <Pressable should remain
    expect(source).not.toMatch(/<Pressable[\s>]/);
    expect(source).not.toMatch(/<\/Pressable>/);
  });

  it('does not use active: Tailwind press classes', () => {
    expect(source).not.toContain('active:opacity');
    expect(source).not.toContain('active:bg-');
  });

  it('has exactly 3 AnimatedPressable opening tags', () => {
    const matches = source.match(/<AnimatedPressable[\s>]/g);
    expect(matches).toHaveLength(3);
  });

  it('has exactly 3 AnimatedPressable closing tags', () => {
    const matches = source.match(/<\/AnimatedPressable>/g);
    expect(matches).toHaveLength(3);
  });

  it('still uses Animated.createAnimatedComponent for container', () => {
    expect(source).toContain('Animated.createAnimatedComponent(View)');
  });
});
