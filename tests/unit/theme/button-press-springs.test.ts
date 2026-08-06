/**
 * Button Press Spring Standardization Tests (Phase 6 Task 2)
 * Verifies that all press animation hooks use springs.button
 * from @/theme/animations instead of hardcoded spring configs.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), 'utf-8');
}

describe('useButtonAnimation uses springs.button', () => {
  const source = readSource('components/Button/useButtonAnimation.ts');

  it('imports springs from @/theme/animations', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*springs[^}]*\}\s+from\s+['"]@\/theme\/animations['"]/
    );
  });

  it('uses springs.button for press-in', () => {
    expect(source).toContain('withSpring(0.96, springs.button)');
  });

  it('uses springs.button for press-out', () => {
    expect(source).toContain('withSpring(1, springs.button)');
  });

  it('does not have hardcoded spring configs', () => {
    expect(source).not.toMatch(/\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/);
  });

  it('uses 0.96 scale target (matches AnimatedPressable)', () => {
    expect(source).toContain('0.96');
    expect(source).not.toContain('0.95');
  });
});

describe('useCategoryChipHandlers uses springs.button', () => {
  const source = readSource(
    'components/CategoryChip/useCategoryChipHandlers.ts'
  );

  it('imports springs from @/theme/animations', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*springs[^}]*\}\s+from\s+['"]@\/theme\/animations['"]/
    );
  });

  it('uses springs.button for press-in', () => {
    expect(source).toContain('withSpring(CARD_PRESS_SCALE, springs.button)');
  });

  it('uses springs.button for press-out', () => {
    expect(source).toContain('withSpring(CARD_REST_SCALE, springs.button)');
  });

  it('does not have hardcoded spring configs', () => {
    expect(source).not.toMatch(/\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/);
  });
});

describe('ScienceBox uses springs.button', () => {
  const source = readSource(
    'components/FullsizeTemplatePreview/components/ScienceBox.tsx'
  );

  it('imports springs from @/theme/animations', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*springs[^}]*\}\s+from\s+['"]@\/theme\/animations['"]/
    );
  });

  it('uses springs.button for press-in', () => {
    expect(source).toContain('withSpring(0.95, springs.button)');
  });

  it('uses springs.button for press-out', () => {
    expect(source).toContain('withSpring(1, springs.button)');
  });

  it('does not have hardcoded spring configs', () => {
    expect(source).not.toMatch(/\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/);
  });
});

describe('useToastButtonAnimation uses springs.button', () => {
  const source = readSource('components/Toast/useToastButtonAnimation.ts');

  it('imports springs from @/theme/animations', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*springs[^}]*\}\s+from\s+['"]@\/theme\/animations['"]/
    );
  });

  it('uses springs.button for press-in', () => {
    expect(source).toContain('withSpring(pressedScale, springs.button)');
  });

  it('uses springs.button for press-out', () => {
    expect(source).toContain('withSpring(1, springs.button)');
  });

  it('does not have hardcoded spring configs', () => {
    expect(source).not.toMatch(/\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/);
  });

  it('does not define a local SPRING_CONFIG constant', () => {
    expect(source).not.toContain('SPRING_CONFIG');
  });
});

describe('EmojiChip uses canonical premium spring for press-out', () => {
  const source = readSource(
    'components/CreateHabitModal/components/EmojiPicker/EmojiChip.tsx'
  );

  it('imports springs from @/theme/animations', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*springs[^}]*\}\s+from\s+['"]@\/theme\/animations['"]/
    );
  });

  it('uses springs.standard in handlePressOut spring settle', () => {
    expect(source).toContain('withSpring(1, springs.standard)');
  });

  it('preserves 1 → 1.08 → 1 press timing pattern', () => {
    expect(source).toContain('withSequence');
    expect(source).toContain('withTiming(1.08, { duration: 100 })');
    expect(source).toContain('withSpring(1, springs.standard)');
  });

  it('does not have hardcoded spring payload objects', () => {
    expect(source).not.toMatch(
      /\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/
    );
  });
});
