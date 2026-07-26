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
    expect(source).toContain('<Modal');
    expect(source).toContain('<DetailLoadingState />');
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
  const skeletonSource = readSource(
    'components/SkeletonLoader/HabitDetailSkeleton.tsx'
  );

  it('uses the current habit-detail skeleton', () => {
    expect(source).toMatch(/HabitDetailSkeleton/);
  });

  it('uses the skeleton theme', () => {
    expect(skeletonSource).toMatch(/useSkeletonTheme/);
  });

  it('uses the skeleton theme background color', () => {
    expect(skeletonSource).toMatch(/backgroundColor: pageBg/);
  });

  it('has accessibility role progressbar', () => {
    expect(skeletonSource).toMatch(/accessibilityRole='progressbar'/);
  });

  it('has accessibility label', () => {
    expect(skeletonSource).toMatch(
      /accessibilityLabel='Loading your habit details\.\.\.'/
    );
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
      /if\s*\(!shouldRender\s*\|\|\s*!renderedHabitId\)\s*return\s+null/
    );
  });

  it('has documentation comment explaining the null pattern', () => {
    expect(source).toMatch(/reverse before unmount/i);
  });
});

describe('CharacterScreen loading state documentation', () => {
  const source = readSource('screens/CharacterScreen/CharacterScreen.tsx');

  it('uses live habit data', () => {
    expect(source).toMatch(/useHabitData/);
  });

  it('documents and renders the live-data skeleton state', () => {
    expect(source).toMatch(/Show the skeleton during the initial Convex fetch/);
    expect(source).toMatch(/CharacterScreenSkeleton/);
  });

  it('uses theme background color', () => {
    expect(source).toMatch(/backgroundColor: colors\.background/);
  });
});
