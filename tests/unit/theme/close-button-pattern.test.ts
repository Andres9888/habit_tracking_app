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

  describe('Habit Detail navigation uses shared ScreenHeader behavior', () => {
    const detailHeader = read(
      'screens/HabitDetailScreen/components/DetailBandHeader.tsx'
    );
    const flowHeader = read(
      'screens/HabitDetailScreen/components/FlowHeader.tsx'
    );
    const screenHeader = read('components/ScreenHeader/ScreenHeader.tsx');
    const screenHeaderStyles = read(
      'components/ScreenHeader/ScreenHeader.styles.ts'
    );
    const detailScreen = read(
      'screens/HabitDetailScreen/HabitDetailScreen.tsx'
    );

    it('keeps close and back semantics while removing bespoke controls', () => {
      expect(detailHeader).toContain("leftAction='close'");
      expect(flowHeader).toContain("leftAction='back'");
      expect(flowHeader).toContain('leftActionAccessibilityLabel');
      expect(detailHeader).not.toContain('BandCloseButton');
      expect(flowHeader).not.toContain('FlowBack');
    });

    it('uses a 44pt slot, 40pt circle, semantic colors and RTL mirroring', () => {
      expect(screenHeaderStyles).toMatch(
        /actionSlot:[\s\S]*height: 44[\s\S]*width: 44/
      );
      expect(screenHeaderStyles).toMatch(
        /iconButton:[\s\S]*height: 40[\s\S]*width: 40/
      );
      expect(screenHeader).toContain(
        'mixHex(colors.gray[900], colors.background'
      );
      expect(screenHeader).toContain('I18nManager.isRTL');
    });

    it('does not flatten header controls and exposes accessibility escape', () => {
      expect(screenHeader).not.toMatch(/<Animated\.View\s+accessible/);
      expect(screenHeader).toMatch(/accessibilityRole=['"]header['"]/);
      expect(detailScreen).toContain(
        'onAccessibilityEscape={handleRequestClose}'
      );
    });

    it('uses the neutral Edit treatment and shared press behavior', () => {
      expect(detailHeader).toContain("tone='subtle'");
      expect(screenHeader).toContain('usePressAnimation');
      expect(screenHeader).toContain("hapticStyle: 'light'");
    });
  });
});
