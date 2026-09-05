/**
 * Toast & Swipe Animation Spring Standardization Tests (Phase 6 Task 5)
 * Verifies that toast animations and HabitCard pan gesture use
 * canonical spring presets from @/theme/animations instead of hardcoded spring configs.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), 'utf-8');
}

describe('useToastAnimations uses springs.standard', () => {
  const source = readSource('components/Toast/useToastAnimations.ts');

  it('imports springs from theme animations', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*springs[^}]*\}\s+from\s+['"](\.\.\/\.\.\/theme\/animations|@\/theme\/animations)['"]/
    );
  });

  it('uses springs.standard for dismiss animation', () => {
    expect(source).toContain('withSpring(100, springs.standard)');
  });

  it('uses springs.standard for enter animation', () => {
    expect(source).toContain('withSpring(0, springs.standard)');
  });

  it('does not have hardcoded spring configs', () => {
    expect(source).not.toMatch(/\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/);
  });

  it('does not define a local SPRING_CONFIG constant', () => {
    expect(source).not.toContain('SPRING_CONFIG');
  });
});

describe('useDeleteToastAnimations uses springs.standard', () => {
  const source = readSource(
    'components/DeleteUndoToast/useDeleteToastAnimations.ts'
  );

  it('imports springs from theme animations', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*springs[^}]*\}\s+from\s+['"](\.\.\/\.\.\/theme\/animations|@\/theme\/animations)['"]/
    );
  });

  it('uses springs.standard for dismiss animation', () => {
    expect(source).toContain('withSpring(100, springs.standard)');
  });

  it('uses springs.standard for enter animation', () => {
    expect(source).toContain('withSpring(0, springs.standard)');
  });

  it('does not have hardcoded spring configs', () => {
    expect(source).not.toMatch(/\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/);
  });

  it('does not define a local SPRING_CONFIG constant', () => {
    expect(source).not.toContain('SPRING_CONFIG');
  });
});

// `components/HabitCard/gestures/panGesture.ts` no longer exists: the swipe
// affordance moved to `DraggableHabitCard.tsx`, which wraps the row in
// `react-native-gesture-handler/ReanimatedSwipeable`. That library component
// owns the drag/snap-back physics internally — there is no longer a hand-rolled
// `springs.*`-driven pan gesture for HabitCard to assert on. The thing this
// describe block protected (a spring config for HabitCard's swipe) no longer
// exists in the app; `useSwipeActionsAnimation` only maps the library's
// reported `dragX` through `interpolate`, not through a spring.
describe('DraggableHabit swipe actions read dragX via interpolation, not a custom spring', () => {
  const source = readSource(
    'components/DraggableHabit/useSwipeActionsAnimation.ts'
  );
  const card = readSource('components/DraggableHabit/DraggableHabitCard.tsx');

  it('DraggableHabitCard delegates swipe gesture physics to ReanimatedSwipeable', () => {
    expect(card).toContain(
      "from 'react-native-gesture-handler/ReanimatedSwipeable'"
    );
    expect(card).toMatch(/<Swipeable/);
  });

  it('useSwipeActionsAnimation has no hardcoded or theme spring config', () => {
    expect(source).not.toMatch(/\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/);
    expect(source).not.toContain('springs.');
    expect(source).not.toContain('withSpring');
  });
});
