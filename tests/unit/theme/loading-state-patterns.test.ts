/**
 * Loading / empty states on remaining screens
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

function read(rel: string): string {
  return fs.readFileSync(path.join(SRC, rel), 'utf-8');
}

describe('HabitDetailScreen loading state', () => {
  const source = read('screens/HabitDetailScreen/HabitDetailScreen.tsx');

  it('renders DetailLoadingState when habit is missing', () => {
    expect(source).toMatch(/DetailLoadingState/);
    expect(source).toMatch(/<DetailLoadingState\s*\/>/);
    expect(source).not.toMatch(/if\s*\(!habit\)\s*return\s+null/);
  });
});

describe('DetailLoadingState', () => {
  const source = read(
    'screens/HabitDetailScreen/components/DetailLoadingState.tsx'
  );
  const barrel = read('screens/HabitDetailScreen/components/index.ts');

  it('uses HabitDetailSkeleton and is barrel-exported', () => {
    expect(source).toMatch(/HabitDetailSkeleton/);
    expect(barrel).toMatch(/DetailLoadingState/);
  });
});

describe('HabitEditScreen unmount pattern', () => {
  const source = read('screens/HabitEditScreen/HabitEditScreen.tsx');

  it('returns null when the modal should not render', () => {
    expect(source).toMatch(/if\s*\(!shouldRender\s*\|\|\s*!renderedHabitId\)\s*return\s+null/);
  });
});

describe('CharacterScreen loading', () => {
  const source = read('screens/CharacterScreen/CharacterScreen.tsx');

  it('shows a skeleton while habits load and uses theme background', () => {
    expect(source).toMatch(/CharacterScreenSkeleton/);
    expect(source).toMatch(/isHabitsLoading/);
    expect(source).toContain('colors.background');
  });
});
