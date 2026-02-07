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

  it('imports useSafeAreaInsets', () => {
    expect(source).toContain('useSafeAreaInsets');
  });

  it('calls useSafeAreaInsets hook', () => {
    expect(source).toMatch(/const\s+insets\s*=\s*useSafeAreaInsets\(\)/);
  });

  it('does not use hardcoded pt-[60px]', () => {
    expect(source).not.toContain('pt-[60px]');
  });

  it('does not use any hardcoded pt-[...] Tailwind class', () => {
    expect(source).not.toMatch(/pt-\[\d+px\]/);
  });

  it('uses Math.max pattern for paddingTop', () => {
    expect(source).toMatch(/Math\.max\(insets\.top\s*\+\s*8,\s*16\)/);
  });

  it('uses paddingTop style prop (not Tailwind)', () => {
    expect(source).toContain('paddingTop');
  });
});

describe('AnalyticsHeader safe area handling', () => {
  const source = readSource(
    'screens/AnalyticsScreen/components/AnalyticsHeader.tsx'
  );

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
    // The header styles should not have paddingTop: spacing.xl anymore
    expect(source).not.toMatch(/paddingTop:\s*spacing\.xl/);
  });

  it('applies dynamic paddingTop via style array', () => {
    expect(source).toMatch(/style=\{\[styles\.header.*paddingTop/);
  });
});

describe('Consistent safe area formula across screens', () => {
  const characterSource = readSource(
    'screens/CharacterScreen/CharacterScreen.tsx'
  );
  const analyticsSource = readSource(
    'screens/AnalyticsScreen/components/AnalyticsHeader.tsx'
  );

  it('CharacterScreen and AnalyticsHeader use same formula', () => {
    const formula = /Math\.max\(insets\.top\s*\+\s*8,\s*16\)/;
    expect(characterSource).toMatch(formula);
    expect(analyticsSource).toMatch(formula);
  });
});

describe('HabitDetailScreen retains its existing inset pattern', () => {
  const source = readSource('screens/HabitDetailScreen/HabitDetailScreen.tsx');

  it('uses useSafeAreaInsets', () => {
    expect(source).toContain('useSafeAreaInsets');
  });

  it('uses Math.max(insets.top + 4, 12) for header', () => {
    expect(source).toMatch(/Math\.max\(insets\.top\s*\+\s*4,\s*12\)/);
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

describe('SafeHeader component exists with correct defaults', () => {
  const source = readSource('components/SafeHeader/SafeHeader.tsx');

  it('exports SafeHeader component', () => {
    expect(source).toMatch(/export\s+(function|const)\s+SafeHeader/);
  });

  it('uses useSafeAreaInsets', () => {
    expect(source).toContain('useSafeAreaInsets');
  });

  it('has additionalPadding default of 8', () => {
    expect(source).toMatch(/additionalPadding\s*=\s*8/);
  });

  it('has minPadding default of 16', () => {
    expect(source).toMatch(/minPadding\s*=\s*16/);
  });

  it('uses Math.max pattern', () => {
    expect(source).toContain('Math.max');
  });
});
