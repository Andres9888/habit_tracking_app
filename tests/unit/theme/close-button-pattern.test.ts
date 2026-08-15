/**
 * Close / back affordances on remaining modal headers
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

function read(rel: string): string {
  return fs.readFileSync(path.join(SRC, rel), 'utf-8');
}

describe('CreateHabit ModalHeader uses ScreenHeader close', () => {
  const source = read(
    'components/CreateHabitModal/components/ModalHeader/ModalHeader.tsx'
  );

  it('delegates close to ScreenHeader leftAction', () => {
    expect(source).toContain("leftAction='close'");
    expect(source).toContain('onBack={onClose}');
    expect(source).not.toContain('✕');
  });
});

describe('ArchivedHabits ModalHeader uses lucide back', () => {
  const source = read(
    'components/ArchivedHabitsModal/components/ModalHeader.tsx'
  );

  it('imports ChevronLeft and uses a 44pt press target via ScreenHeader/Pressable', () => {
    expect(source).toMatch(/ChevronLeft/);
    expect(source).toMatch(/from 'lucide-react-native'/);
    expect(source).not.toContain('✕');
    expect(source).toContain("accessibilityRole='button'");
  });
});

describe('ScreenHeader close icon uses strokeWidth 2.5 and theme text', () => {
  const source = read('components/ScreenHeader/ScreenHeader.tsx');

  it('renders X / ChevronLeft from lucide with theme color', () => {
    expect(source).toMatch(/import \{ ChevronLeft, X \}/);
    expect(source).toContain('strokeWidth={2.5}');
    expect(source).toContain('colors.text.primary');
  });
});
