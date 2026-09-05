/**
 * Button press springs on remaining hooks / chips
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

function read(rel: string): string {
  return fs.readFileSync(path.join(SRC, rel), 'utf-8');
}

describe('useButtonAnimation uses springs.button', () => {
  const source = read('components/Button/useButtonAnimation.ts');

  it('springs to CARD_PRESS_SCALE (0.97) and back', () => {
    expect(source).toMatch(/from\s+['"]@\/theme\/animations['"]/);
    expect(source).toContain('withSpring(CARD_PRESS_SCALE, springs.button)');
    expect(source).toContain('withSpring(1, springs.button)');
    expect(source).toContain('0.97');
  });
});

describe('useToastButtonAnimation uses springs.button', () => {
  const source = read('components/Toast/useToastButtonAnimation.ts');

  it('uses springs.button for press-in/out', () => {
    expect(source).toMatch(/from\s+['"]@\/theme\/animations['"]/);
    expect(source).toContain('withSpring(pressedScale, springs.button)');
    expect(source).toContain('withSpring(1, springs.button)');
    expect(source).not.toContain('SPRING_CONFIG');
  });
});

describe('EmojiChip uses the shared press primitive (springs.standard by default)', () => {
  const source = read(
    'components/CreateHabitModal/components/EmojiPicker/EmojiChip.tsx'
  );

  it('presses via usePressAnimation instead of a bespoke spring/timing pair', () => {
    expect(source).toMatch(/from\s+['"]@\/hooks\/usePressAnimation['"]/);
    expect(source).toContain('usePressAnimation()');
    expect(source).not.toContain('withTiming(0.97');
    expect(source).not.toContain('withSpring(1, springs.standard)');
  });
});
