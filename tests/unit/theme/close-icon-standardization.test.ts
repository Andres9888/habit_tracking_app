/**
 * Close/Dismiss Icon Standardization Tests (Phase 4)
 * Verifies that modal/sheet close buttons use the standard 24px icon size.
 * Tests read source files to check that X icon size props are 24.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_ROOT = path.resolve(__dirname, '../../../src');

/** Files that contain close/dismiss X icons in modal/sheet headers */
const CLOSE_BUTTON_FILES = [
  // Components with X close buttons (previously size={22})
  'components/FullsizeTemplatePreview/components/ModalHeader.tsx',
  'components/TemplateScienceModal/components/ModalHeader.tsx',
  'components/CreateHabitModal/components/ModalHeader/ModalHeader.tsx',
  'components/ArchivedHabitsModal/components/ModalHeader.tsx',
  'components/StatsNotesModal/NotesList/components/VisualizationModal.tsx',
  'components/VisionBoardPreview/components/PreviewHeader.tsx',
  // Consolidated into PremiumPaywall — close buttons are inline in variant components
  // Components with X close buttons (previously size={20})
  'components/QuickActionsSheet/SheetHeader.tsx',
  // Consolidated into PremiumPaywall — close buttons are inline in variant components
  'components/MotivationSystem/Reward/CelebrationScreen/components/ModalHeader.tsx',
  'components/MotivationSystem/Activation/ActivationModal/ActivationModalHeader.tsx',
  'components/MotivationSystem/Rescue/RescueMode/components/RescueModeHeader.tsx',
  'components/EmojiPicker/components/EmojiPickerHeader.tsx',
  // Components with X close buttons (previously size={16})
  'components/MotivationSystem/Workshop/WOOPSection/WOOPExplainerModal.tsx',
  'components/MotivationSystem/Workshop/DualVizSetup/components/ExplainerHeader.tsx',
  // Screens with X close buttons (previously size={22})
  'screens/templates/TemplatePreviewModal/ModalHeader.tsx',
  'screens/HabitEditScreen/EditHeader.tsx',
  'screens/HabitDetailScreen/components/DetailHeader.tsx',
  'screens/HabitDetailScreen/components/NotesListModal.tsx',
  'screens/HabitDetailScreen/components/NotesEditorModal.tsx',
];

/**
 * Matches `<X ... size={N}` patterns (with possible multiline props)
 * and extracts the size value.
 */
function findXIconSize(content: string): number | null {
  // Match <X with any props including size={N}
  const match = content.match(/<X[\s\S]*?size=\{(\d+)\}/);
  return match ? parseInt(match[1], 10) : null;
}

describe('Close/Dismiss Icon Standardization - size={24}', () => {
  for (const relPath of CLOSE_BUTTON_FILES) {
    const fullPath = path.join(SRC_ROOT, relPath);
    const fileName = relPath.split('/').pop();

    it(`${relPath} should have X icon at size={24}`, () => {
      expect(fs.existsSync(fullPath)).toBe(true);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const size = findXIconSize(content);
      expect(size).toBe(24);
    });
  }
});

describe('Search field X icons remain small (clear buttons)', () => {
  const SEARCH_CLEAR_FILES = [
    'components/EmojiPickerV2/EmojiPickerSheet/SearchBar.tsx',
    'components/EmojiPicker/components/EmojiPickerSearch.tsx',
  ];

  for (const relPath of SEARCH_CLEAR_FILES) {
    const fullPath = path.join(SRC_ROOT, relPath);

    it(`${relPath} X icon should be smaller than 24 (inline clear button)`, () => {
      expect(fs.existsSync(fullPath)).toBe(true);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const size = findXIconSize(content);
      expect(size).not.toBeNull();
      expect(size).toBeLessThan(24);
    });
  }
});
