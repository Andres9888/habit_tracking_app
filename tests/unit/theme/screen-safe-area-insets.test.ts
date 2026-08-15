/**
 * Safe-area insets on remaining screens / headers
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

function read(rel: string): string {
  return fs.readFileSync(path.join(SRC, rel), 'utf-8');
}

describe('CharacterScreen defers insets to ScreenHeader', () => {
  const source = read('screens/CharacterScreen/CharacterScreen.tsx');

  it('renders ScreenHeader and does not hardcode pt-[60px]', () => {
    expect(source).toContain('ScreenHeader');
    expect(source).not.toContain('pt-[60px]');
    expect(source).not.toMatch(/pt-\[\d+px\]/);
  });
});

describe('ScreenHeader safe area', () => {
  const source = read('components/ScreenHeader/ScreenHeader.tsx');

  it('uses Math.max(insets.top + 8, 16)', () => {
    expect(source).toContain('useSafeAreaInsets');
    expect(source).toMatch(/const\s+insets\s*=\s*useSafeAreaInsets\(\)/);
    expect(source).toMatch(/Math\.max\(insets\.top\s*\+\s*8,\s*16\)/);
  });
});

describe('HabitEditScreen header inset', () => {
  const source = read('screens/HabitEditScreen/HabitEditScreen.tsx');

  it('uses Math.max(insets.top + 4, 12)', () => {
    expect(source).toContain('useSafeAreaInsets');
    expect(source).toMatch(/Math\.max\(insets\.top\s*\+\s*4,\s*12\)/);
  });
});
