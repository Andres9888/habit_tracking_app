/**
 * Close/Dismiss Button Pattern Tests (Phase 4 Task 4)
 * Verifies that modal close buttons use consistent:
 * - Icon: X from lucide-react-native (not unicode ✕)
 * - Color: colors.gray[500] theme token
 * - Size: 24px icon
 * - Hit target: 44x44pt minimum (Apple HIG)
 * - strokeWidth: 2
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_ROOT = path.resolve(__dirname, '../../../src');

/** Modal files with close/dismiss buttons that should follow the standard pattern */
const STANDARD_CLOSE_BUTTON_FILES = [
  'components/CreateHabitModal/components/ModalHeader/ModalHeader.tsx',
  'components/ArchivedHabitsModal/components/ModalHeader.tsx',
  'components/TemplateScienceModal/components/ModalHeader.tsx',
  'components/StatsNotesModal/StatsNotesModal.tsx',
  'components/PausedHabitsModal/PausedHabitsModal.tsx',
];

describe('Close button uses theme color token (colors.gray[500])', () => {
  for (const relPath of STANDARD_CLOSE_BUTTON_FILES) {
    const fullPath = path.join(SRC_ROOT, relPath);

    it(`${relPath} uses colors.gray[500] for X icon`, () => {
      const content = fs.readFileSync(fullPath, 'utf-8');
      // Should use theme token, not hardcoded hex
      expect(content).toContain('colors.gray[500]');
      // Should NOT have hardcoded close icon colors
      expect(content).not.toMatch(/<X\s[^>]*color='#/);
    });
  }
});

describe('Close button uses lucide X icon (not unicode)', () => {
  for (const relPath of STANDARD_CLOSE_BUTTON_FILES) {
    const fullPath = path.join(SRC_ROOT, relPath);

    it(`${relPath} imports X from lucide-react-native`, () => {
      const content = fs.readFileSync(fullPath, 'utf-8');
      expect(content).toMatch(
        /import\s*{[^}]*\bX\b[^}]*}\s*from\s*'lucide-react-native'/
      );
    });

    it(`${relPath} does not use unicode ✕ for close`, () => {
      const content = fs.readFileSync(fullPath, 'utf-8');
      expect(content).not.toContain('✕');
    });
  }
});

describe('Close button has 44x44pt hit target', () => {
  const TAILWIND_44_FILES = [
    'components/CreateHabitModal/components/ModalHeader/ModalHeader.tsx',
    'components/ArchivedHabitsModal/components/ModalHeader.tsx',
    'components/StatsNotesModal/StatsNotesModal.tsx',
    'components/PausedHabitsModal/PausedHabitsModal.tsx',
  ];

  for (const relPath of TAILWIND_44_FILES) {
    const fullPath = path.join(SRC_ROOT, relPath);

    it(`${relPath} has h-11 w-11 (44x44pt) hit target`, () => {
      const content = fs.readFileSync(fullPath, 'utf-8');
      // h-11 = 44px, w-11 = 44px in Tailwind
      expect(content).toMatch(/h-11.*w-11|w-11.*h-11/);
    });
  }

  it('TemplateScienceModal close button has 44x44pt via StyleSheet', () => {
    const stylesPath = path.join(
      SRC_ROOT,
      'components/TemplateScienceModal/styles/header.styles.ts'
    );
    const content = fs.readFileSync(stylesPath, 'utf-8');
    expect(content).toMatch(/height:\s*44/);
    expect(content).toMatch(/width:\s*44/);
  });
});

describe('Close button uses strokeWidth 2', () => {
  for (const relPath of STANDARD_CLOSE_BUTTON_FILES) {
    const fullPath = path.join(SRC_ROOT, relPath);

    it(`${relPath} X icon has strokeWidth={2}`, () => {
      const content = fs.readFileSync(fullPath, 'utf-8');
      // Match <X ... strokeWidth={2} (exactly 2, not 2.5)
      const xMatch = content.match(/<X[\s\S]*?strokeWidth=\{([\d.]+)\}/);
      expect(xMatch).not.toBeNull();
      expect(parseFloat(xMatch![1])).toBe(2);
    });
  }
});

describe('TemplateScienceModal header styles use theme tokens', () => {
  const stylesPath = path.join(
    SRC_ROOT,
    'components/TemplateScienceModal/styles/header.styles.ts'
  );

  it('imports colors from theme', () => {
    const content = fs.readFileSync(stylesPath, 'utf-8');
    expect(content).toMatch(/import.*colors.*from.*theme\/colors/);
  });

  it('uses colors.gray[100] for button background (not hardcoded #F3F4F6)', () => {
    const content = fs.readFileSync(stylesPath, 'utf-8');
    expect(content).not.toContain('#F3F4F6');
    expect(content).toContain('colors.gray[100]');
  });

  it('uses colors.gray[900] for header title (not hardcoded #111827)', () => {
    const content = fs.readFileSync(stylesPath, 'utf-8');
    expect(content).not.toContain('#111827');
    expect(content).toContain('colors.gray[900]');
  });
});

describe('PausedHabitsModal back button also standardized', () => {
  const filePath = path.join(
    SRC_ROOT,
    'components/PausedHabitsModal/PausedHabitsModal.tsx'
  );

  it('imports ChevronLeft from lucide (not unicode ←)', () => {
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toMatch(/import.*ChevronLeft.*from.*lucide-react-native/);
    expect(content).not.toContain('←');
  });

  it('back button has 44x44pt hit target', () => {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Both back and close buttons should have h-11 w-11
    const matches = content.match(/h-11 w-11/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBeGreaterThanOrEqual(2);
  });
});
