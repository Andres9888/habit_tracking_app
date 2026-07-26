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
    expect(source).toContain('withSpring(CARD_PRESS_SCALE, springs.button)');
  });

  it('uses springs.button for press-out', () => {
    expect(source).toContain('withSpring(1, springs.button)');
  });

  it('does not have hardcoded spring configs', () => {
    expect(source).not.toMatch(/\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/);
  });

  it('uses the shared card press scale target', () => {
    expect(source).toContain(
      "import { CARD_PRESS_SCALE } from '@/utils/animations/cardPressAnimation'"
    );
    expect(source).not.toContain('0.95');
  });
});

describe('CategoryPill uses springs.button', () => {
  const source = readSource('components/EmojiPickerV2/CategoryPill.tsx');

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

describe('FullsizeTemplatePreview button handlers use the canonical button spring', () => {
  const source = readSource(
    'components/FullsizeTemplatePreview/hooks/useButtonAnimations.ts'
  );

  it('imports Springs from the shared motion constants', () => {
    expect(source).toMatch(
      /import\s+\{[^}]*Springs[^}]*\}\s+from\s+['"]\.\.\/\.\.\/\.\.\/constants\/motion['"]/
    );
  });

  it('uses springs.button for press-in', () => {
    expect(source).toContain('withSpring(scale, Springs.button)');
  });

  it('uses springs.button for press-out', () => {
    expect(source).toContain('withSpring(1, Springs.button)');
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

  it('preserves the scale-down then spring-to-rest press pattern', () => {
    expect(source).toContain('withTiming(0.97, { duration: 50 })');
    expect(source).toContain('withSpring(1, springs.standard)');
  });

  it('does not have hardcoded spring payload objects', () => {
    expect(source).not.toMatch(/\{\s*damping:\s*\d+,\s*stiffness:\s*\d+\s*\}/);
  });
});
