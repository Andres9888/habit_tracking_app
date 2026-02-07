/**
 * Loading/Empty State Pattern Tests (Phase 7 Task 5)
 * Verifies that screens handle missing data with appropriate loading states
 * rather than returning null when visible.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), 'utf-8');
}

describe('HabitDetailScreen loading state', () => {
  const source = readSource('screens/HabitDetailScreen/HabitDetailScreen.tsx');

  it('imports DetailLoadingState from components', () => {
    expect(source).toMatch(/DetailLoadingState/);
  });

  it('renders DetailLoadingState in the else branch (habit falsy)', () => {
    // Ternary: {habit ? <content> : <DetailLoadingState />}
    expect(source).toMatch(/\) : \([\s\S]*?<DetailLoadingState/);
  });

  it('wraps loading state inside a Modal via ternary', () => {
    expect(source).toMatch(
      /<Modal[\s\S]*?\{habit \?[\s\S]*?<DetailLoadingState[\s\S]*?<\/Modal>/
    );
  });

  it('does NOT return bare null when habit is missing', () => {
    // Should not have a plain "return null" for the !habit case
    expect(source).not.toMatch(/if\s*\(!habit\)\s*return\s+null/);
  });
});

describe('DetailLoadingState component', () => {
  const source = readSource(
    'screens/HabitDetailScreen/components/DetailLoadingState.tsx'
  );

  it('uses ActivityIndicator', () => {
    expect(source).toMatch(/ActivityIndicator/);
  });

  it('uses theme color for spinner', () => {
    expect(source).toMatch(/colors\.gray\[500\]/);
  });

  it('uses theme background color', () => {
    expect(source).toMatch(/colors\.light\.background/);
  });

  it('has accessibility role progressbar', () => {
    expect(source).toMatch(/accessibilityRole='progressbar'/);
  });

  it('has accessibility label', () => {
    expect(source).toMatch(/accessibilityLabel='Loading habit details'/);
  });
});

describe('DetailLoadingState barrel export', () => {
  const source = readSource('screens/HabitDetailScreen/components/index.ts');

  it('exports DetailLoadingState', () => {
    expect(source).toMatch(
      /export\s*\{.*DetailLoadingState.*\}\s*from\s*['"]\.\/DetailLoadingState['"]/
    );
  });
});

describe('HabitEditScreen modal null pattern (intentional)', () => {
  const source = readSource('screens/HabitEditScreen/HabitEditScreen.tsx');

  it('returns null when not visible (modal not mounted)', () => {
    expect(source).toMatch(
      /if\s*\(!visible\s*\|\|\s*!habitId\)\s*return\s+null/
    );
  });

  it('has documentation comment explaining the null pattern', () => {
    expect(source).toMatch(/Modal pattern.*return null.*modal.*doesn't mount/i);
  });
});

describe('CharacterScreen loading state documentation', () => {
  const source = readSource('screens/CharacterScreen/CharacterScreen.tsx');

  it('uses mock data (no async fetch yet)', () => {
    expect(source).toMatch(/MOCK_CHARACTER_DATA/);
  });

  it('has loading state documentation comment', () => {
    expect(source).toMatch(
      /Loading state.*mock data|When connected to real data.*ActivityIndicator/
    );
  });

  it('uses theme background color', () => {
    expect(source).toMatch(/colors\.light\.background/);
  });
});
