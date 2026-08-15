/**
 * RewardCelebrationToast was removed — press feedback lives on AnimatedPressable
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

describe('RewardCelebrationToast removed', () => {
  it('does not ship the deleted toast component', () => {
    const toastPath = path.join(
      SRC,
      'components/RewardCelebrationToast/RewardCelebrationToast.tsx'
    );
    expect(fs.existsSync(toastPath)).toBe(false);
  });

  it('still exports AnimatedPressable for scale press feedback', () => {
    const pressable = path.join(SRC, 'components/ui/AnimatedPressable.tsx');
    expect(fs.existsSync(pressable)).toBe(true);
    const source = fs.readFileSync(pressable, 'utf-8');
    expect(source).toMatch(/export function AnimatedPressable|export \{ AnimatedPressable/);
  });
});
