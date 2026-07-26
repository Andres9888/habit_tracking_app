/**
 * Milestone reward action press-feedback contract.
 *
 * RewardCelebrationToast was removed after its UI became dead code. The live
 * reward surface is StreakMilestoneCelebration, whose action buttons retain
 * the animated scale-feedback contract this suite was created to protect.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');
const source = fs.readFileSync(
  path.join(
    SRC,
    'components/StreakMilestoneCelebration/ActionButtons.tsx'
  ),
  'utf-8'
);

describe('Milestone reward actions use AnimatedPressable', () => {
  it('imports Animated and Pressable to build the animated control', () => {
    expect(source).toContain(
      "import { View, Text, Pressable } from 'react-native'"
    );
    expect(source).toContain(
      "import Animated, { type AnimatedStyle } from 'react-native-reanimated'"
    );
  });

  it('creates AnimatedPressable from the native Pressable', () => {
    expect(source).toContain(
      'const AnimatedPressable = Animated.createAnimatedComponent(Pressable)'
    );
  });

  it('uses AnimatedPressable for the share action', () => {
    const shareIndex = source.indexOf(
      'accessibilityLabel="Share your achievement"'
    );
    expect(shareIndex).toBeGreaterThan(0);
    expect(source.slice(shareIndex - 200, shareIndex)).toContain(
      '<AnimatedPressable'
    );
  });

  it('uses AnimatedPressable for the continue action', () => {
    const continueIndex = source.indexOf('accessibilityLabel="Keep going"');
    expect(continueIndex).toBeGreaterThan(0);
    expect(source.slice(continueIndex - 200, continueIndex)).toContain(
      '<AnimatedPressable'
    );
  });

  it('does not render plain Pressable elements', () => {
    expect(source).not.toMatch(/<Pressable[\s>]/);
    expect(source).not.toMatch(/<\/Pressable>/);
  });

  it('has exactly 2 AnimatedPressable opening tags', () => {
    expect(source.match(/<AnimatedPressable[\s>]/g)).toHaveLength(2);
  });

  it('has exactly 2 AnimatedPressable closing tags', () => {
    expect(source.match(/<\/AnimatedPressable>/g)).toHaveLength(2);
  });

  it('keeps accessible labels on both reward actions', () => {
    expect(source).toContain('accessibilityLabel="Share your achievement"');
    expect(source).toContain('accessibilityLabel="Keep going"');
  });

  it('triggers tap feedback before sharing', () => {
    expect(source).toMatch(
      /const handleShare[\s\S]*?triggerHaptic\('tap'\)[\s\S]*?onShare\?\.\(\)/
    );
  });

  it('triggers tap feedback before continuing', () => {
    expect(source).toMatch(
      /const handleContinue[\s\S]*?triggerHaptic\('tap'\)[\s\S]*?onClose\(\)/
    );
  });
});
