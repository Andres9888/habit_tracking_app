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

describe('useDeleteToastAnimations uses springs.snappy', () => {
  const source = readSource(
    'components/DeleteUndoToast/useDeleteToastAnimations.ts'
  );

  it('imports springs from theme animations', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*springs[^}]*\}\s+from\s+['"](\.\.\/\.\.\/theme\/animations|@\/theme\/animations)['"]/
    );
  });

  it('uses springs.snappy for dismiss animation', () => {
    expect(source).toContain('withSpring(100, springs.snappy)');
  });

  it('uses springs.snappy for enter animation', () => {
    expect(source).toContain('withSpring(0, springs.snappy)');
  });

  it('does not have hardcoded spring configs', () => {
    expect(source).not.toMatch(/\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/);
  });

  it('does not define a local SPRING_CONFIG constant', () => {
    expect(source).not.toContain('SPRING_CONFIG');
  });
});

describe('panGesture uses springs.snappy', () => {
  const source = readSource('components/HabitCard/gestures/panGesture.ts');

  it('imports springs from theme animations', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*springs[^}]*\}\s+from\s+['"](\.\.\/\.\.\/\.\.\/theme\/animations|@\/theme\/animations)['"]/
    );
  });

  it('uses springs.snappy for swipe-open', () => {
    expect(source).toContain('springs.snappy');
  });

  it('uses springs.snappy for snap-back', () => {
    // Code uses snap(0) where snap = (v) => withSpring(v, springs.snappy)
    expect(source).toContain('snap(0)');
  });

  it('does not have hardcoded spring configs', () => {
    expect(source).not.toMatch(/\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/);
  });
});
