/**
 * Current close/dismiss button contract.
 *
 * Close buttons were centralized in ModalCloseButton and ScreenHeader; this
 * suite verifies those implementations and their live consumers instead of
 * reaching into deleted modal implementations.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_ROOT = path.resolve(__dirname, '../../../src');

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(SRC_ROOT, relativePath), 'utf-8');
}

const modalCloseButtonSource = readSource('components/ui/ModalCloseButton.tsx');
const screenHeaderSource = readSource(
  'components/ScreenHeader/ScreenHeader.tsx'
);
const screenHeaderStylesSource = readSource(
  'components/ScreenHeader/ScreenHeader.styles.ts'
);

const MODAL_CLOSE_BUTTON_CONSUMERS = [
  'components/HabitCalendarModal/ModalHeader.tsx',
  'components/SettingsModal/CalendarLookPage.tsx',
  'components/SettingsModal/SettingsHeader.tsx',
  'components/FullsizeTemplatePreview/components/ModalHeader.tsx',
  'components/SettingsModal/AccountPage.tsx',
];

describe('ModalCloseButton shared close control', () => {
  it('imports X from lucide-react-native', () => {
    expect(modalCloseButtonSource).toMatch(
      /import\s*{\s*X\s*}\s*from\s*'lucide-react-native'/
    );
  });

  it('does not use a unicode close glyph', () => {
    expect(modalCloseButtonSource).not.toContain('✕');
  });

  it('uses theme-aware text and surface colors', () => {
    expect(modalCloseButtonSource).toContain('useThemeColors()');
    expect(modalCloseButtonSource).toContain('colors.text.secondary');
    expect(modalCloseButtonSource).toContain('colors.surface');
  });

  it('has a 44pt minimum height', () => {
    expect(modalCloseButtonSource).toMatch(/height:\s*44/);
  });

  it('has a 44pt minimum width', () => {
    expect(modalCloseButtonSource).toMatch(/width:\s*44/);
  });

  it('exposes button semantics', () => {
    expect(modalCloseButtonSource).toContain('accessibilityRole="button"');
  });

  it('uses AnimatedPressable for press feedback', () => {
    expect(modalCloseButtonSource).toContain('<AnimatedPressable');
    expect(modalCloseButtonSource).not.toMatch(/<Pressable[\s>]/);
  });

  it('uses the current solid and subtle stroke widths', () => {
    expect(modalCloseButtonSource).toContain(
      'strokeWidth={isSubtle ? 2 : 2.5}'
    );
  });
});

describe('ScreenHeader close action', () => {
  it('imports the lucide X icon', () => {
    expect(screenHeaderSource).toMatch(
      /import\s*{[^}]*\bX\b[^}]*}\s*from\s*'lucide-react-native'/
    );
  });

  it('does not use a unicode close glyph', () => {
    expect(screenHeaderSource).not.toContain('✕');
  });

  it('selects X for the close action', () => {
    expect(screenHeaderSource).toContain(
      "const Icon = leftAction === 'close' ? X : ChevronLeft"
    );
  });

  it('labels the close action for assistive technology', () => {
    expect(screenHeaderSource).toContain(
      "const label = leftAction === 'close' ? 'Close' : 'Go back'"
    );
  });

  it('exposes button semantics', () => {
    expect(screenHeaderSource).toContain('accessibilityRole="button"');
  });

  it('uses the current 2.5 stroke width', () => {
    expect(screenHeaderSource).toContain('strokeWidth={2.5}');
  });

  it('uses a 40pt visual icon button', () => {
    expect(screenHeaderStylesSource).toMatch(
      /iconButton:\s*\{[\s\S]*?height:\s*40[\s\S]*?width:\s*40/
    );
  });

  it('expands the touch target with hitSlop', () => {
    expect(screenHeaderSource).toContain('hitSlop={8}');
  });
});

describe('Live modal headers use the shared close control', () => {
  for (const relativePath of MODAL_CLOSE_BUTTON_CONSUMERS) {
    it(`${relativePath} imports ModalCloseButton`, () => {
      const source = readSource(relativePath);
      expect(source).toMatch(/import\s*{\s*ModalCloseButton\s*}/);
    });

    it(`${relativePath} renders ModalCloseButton`, () => {
      const source = readSource(relativePath);
      expect(source).toContain('<ModalCloseButton');
    });
  }
});

describe('Archived habits back control', () => {
  const source = readSource(
    'components/ArchivedHabitsModal/components/ModalHeader.tsx'
  );

  it('uses ChevronLeft for back navigation', () => {
    expect(source).toMatch(
      /import\s*{[^}]*ChevronLeft[^}]*}\s*from\s*'lucide-react-native'/
    );
  });

  it('does not use unicode navigation glyphs', () => {
    expect(source).not.toContain('←');
    expect(source).not.toContain('✕');
  });

  it('exposes button semantics and an accessibility label', () => {
    expect(source).toContain("accessibilityLabel='Back to settings'");
    expect(source).toContain("accessibilityRole='button'");
  });

  it('uses a 40pt control with a 24pt theme-aware icon', () => {
    expect(source).toMatch(/width:\s*40[\s\S]*?height:\s*40/);
    expect(source).toContain('color={colors.text.primary}');
    expect(source).toContain('size={iconSizes.large}');
  });
});
