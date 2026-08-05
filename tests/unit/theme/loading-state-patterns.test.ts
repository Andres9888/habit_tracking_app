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

  it('uses HabitDetailSkeleton', () => {
    expect(source).toMatch(/HabitDetailSkeleton/);
  });

  it('keeps the loading component as a minimal skeleton wrapper', () => {
    expect(source).toMatch(/return <HabitDetailSkeleton \/>/);
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
      /if\s*\(!props\.visible\s*\|\|\s*!props\.habitId\)\s*return\s+null/
    );
  });

  it('wraps the mounted screen in ScreenErrorBoundary after the guard', () => {
    expect(source).toMatch(/<ScreenErrorBoundary/);
  });
});

describe('CharacterScreen data loading flow', () => {
  const source = readSource('screens/CharacterScreen/CharacterScreen.tsx');

  it('uses useHabitData for live habit and tracking data', () => {
    expect(source).toMatch(/useHabitData/);
  });

  it('derives the character summary from habit data', () => {
    expect(source).toMatch(/buildDateRange/);
    expect(source).toMatch(/buildCharacterData/);
  });

  it('uses theme background color', () => {
    expect(source).toMatch(/colors\.background/);
  });
});
