/**
 * Screen Safe Area Inset Standardization Tests (Phase 7 Task 2)
 * Verifies screens use useSafeAreaInsets() with consistent formulas
 * instead of hardcoded top padding values.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), 'utf-8');
}

describe('CharacterScreen safe area handling', () => {
  const source = readSource('screens/CharacterScreen/CharacterScreen.tsx');

  it('uses the shared ScreenHeader', () => {
    expect(source).toContain('ScreenHeader');
  });

  it('delegates safe-area handling to ScreenHeader', () => {
    expect(source).not.toContain('useSafeAreaInsets');
  });

  it('does not use hardcoded pt-[60px]', () => {
    expect(source).not.toContain('pt-[60px]');
  });

  it('does not use any hardcoded pt-[...] Tailwind class', () => {
    expect(source).not.toMatch(/pt-\[\d+px\]/);
  });

  it('renders the canonical header for the Character screen', () => {
    expect(source).toContain("<ScreenHeader title='Character'");
  });
});

describe('ScreenHeader safe area handling', () => {
  const source = readSource('components/ScreenHeader/ScreenHeader.tsx');

  it('imports useSafeAreaInsets', () => {
    expect(source).toContain('useSafeAreaInsets');
  });

  it('calls useSafeAreaInsets hook', () => {
    expect(source).toMatch(/const\s+insets\s*=\s*useSafeAreaInsets\(\)/);
  });

  it('uses Math.max pattern for paddingTop', () => {
    expect(source).toMatch(/Math\.max\(insets\.top\s*\+\s*8,\s*16\)/);
  });

  it('does not use static spacing.xl for paddingTop', () => {
    expect(source).not.toMatch(/paddingTop:\s*spacing\.xl/);
  });
});

describe('Consistent safe area formula across shared components', () => {
  const screenHeaderSource = readSource(
    'components/ScreenHeader/ScreenHeader.tsx'
  );

  it('ScreenHeader owns the canonical formula', () => {
    const formula = /Math\.max/;
    expect(screenHeaderSource).toMatch(formula);
    expect(screenHeaderSource).toContain('insets.top');
  });
});

describe('HabitDetailScreen retains its existing inset pattern', () => {
  const source = readSource('screens/HabitDetailScreen/HabitDetailScreen.tsx');

  it('uses ScreenHeader for safe-area handling', () => {
    expect(source).toContain('ScreenHeader');
  });

  it('does not duplicate the shared inset formula', () => {
    expect(source).not.toContain('useSafeAreaInsets');
  });
});

describe('HabitEditScreen retains its existing inset pattern', () => {
  const source = readSource('screens/HabitEditScreen/HabitEditScreen.tsx');

  it('uses useSafeAreaInsets', () => {
    expect(source).toContain('useSafeAreaInsets');
  });

  it('uses Math.max(insets.top + 4, 12) for header', () => {
    expect(source).toMatch(/Math\.max\(insets\.top\s*\+\s*4,\s*12\)/);
  });
});

describe('ScreenHeader component exists with correct defaults', () => {
  const source = readSource('components/ScreenHeader/ScreenHeader.tsx');

  it('exports ScreenHeader component', () => {
    expect(source).toMatch(/export\s+(function|const)\s+ScreenHeader/);
  });

  it('uses useSafeAreaInsets', () => {
    expect(source).toContain('useSafeAreaInsets');
  });

  it('adds 8 points to the top inset', () => {
    expect(source).toMatch(/insets\.top\s*\+\s*8/);
  });

  it('uses a minimum padding of 16', () => {
    expect(source).toMatch(/,\s*16\)/);
  });

  it('uses Math.max pattern', () => {
    expect(source).toContain('Math.max');
  });
});
