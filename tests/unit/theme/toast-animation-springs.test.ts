/**
 * Toast & Swipe Animation Spring Standardization Tests (Phase 6 Task 5)
 * Verifies that toast animations and HabitCard pan gesture use
 * springs.snappy from @/theme/animations instead of hardcoded spring configs.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), 'utf-8');
}

describe('useToastAnimations uses springs.snappy', () => {
  const source = readSource('components/Toast/useToastAnimations.ts');

  it('imports springs from theme animations', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*springs[^}]*\}\s+from\s+['"](\.\.\/\.\.\/theme\/animations|@\/theme\/animations)['"]/
    );
    expect(source).toContain('springs');
    expect(source).toContain('theme/animations');
  });

  it('uses springs.snappy for dismiss animation', () => {
    expect(source).toContain('withSpring(100, springs.snappy)');
    expect(source).toContain('springs.snappy');
    expect(source).not.toContain('damping');
  });

  it('uses springs.snappy for enter animation', () => {
    expect(source).toContain('withSpring(0, springs.snappy)');
    expect(source).toContain('springs.snappy');
  });

  it('does not have hardcoded spring configs', () => {
    expect(source).not.toMatch(/\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/);
    expect(source).not.toContain('damping:');
    expect(source).not.toContain('stiffness:');
  });

  it('does not define a local SPRING_CONFIG constant', () => {
    expect(source).not.toContain('SPRING_CONFIG');
    expect(source).not.toContain('const SPRING_CONFIG');
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
    expect(source).toContain('import');
    expect(source).toContain('springs');
  });

  it('uses springs.snappy for dismiss animation', () => {
    expect(source).toContain('withSpring(100, springs.snappy)');
    expect(source).toContain('snappy');
    expect(source).toContain('100');
  });

  it('uses springs.snappy for enter animation', () => {
    expect(source).toContain('withSpring(0, springs.snappy)');
    expect(source).toContain('withSpring');
  });

  it('does not have hardcoded spring configs', () => {
    expect(source).not.toMatch(/\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/);
    expect(source).not.toContain('damping:');
  });

  it('does not define a local SPRING_CONFIG constant', () => {
    expect(source).not.toContain('SPRING_CONFIG');
    expect(source).not.toContain('const SPRING_CONFIG =');
  });
});

describe('panGesture uses springs.snappy', () => {
  const source = readSource('components/HabitCard/gestures/panGesture.ts');

  it('imports springs from theme animations', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*springs[^}]*\}\s+from\s+['"](\.\.\/\.\.\/\.\.\/theme\/animations|@\/theme\/animations)['"]/
    );
    expect(source).toContain('springs');
    expect(source).toContain('animations');
  });

  it('uses springs.snappy for swipe-open', () => {
    expect(source).toContain('springs.snappy');
    expect(source).toContain('.snappy');
    expect(source).not.toContain('hardcoded');
  });

  it('uses springs.snappy for snap-back', () => {
    expect(source).toContain('withSpring(0, springs.snappy)');
    expect(source).toContain('withSpring');
    expect(source).toContain('springs');
  });

  it('does not have hardcoded spring configs', () => {
    expect(source).not.toMatch(/\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/);
    expect(source).not.toContain('stiffness:');
    expect(source).not.toContain('damping:');
  });
});
