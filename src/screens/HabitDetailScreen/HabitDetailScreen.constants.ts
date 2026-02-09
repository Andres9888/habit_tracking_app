/** Constants and helpers for HabitDetailScreen */
import { colors } from '../../theme/colors';
import type { EdgeInsets } from 'react-native-safe-area-context';
import type { Doc } from '../../../convex/_generated/dataModel';

export const DETAIL_BG_GRADIENT = [
  colors.light.background,
  colors.light.gradientMid,
  colors.light.background,
] as const;

/** Assemble props for HabitDetailModals from hook return values */
export function buildModalsProps(
  s: {
    editingNote: Doc<'notes'> | null | undefined;
    isNotesEditorOpen: boolean;
    isNotesListOpen: boolean;
    pendingArchive: boolean;
    pendingDelete: boolean;
    setIsNotesListOpen: (v: boolean) => void;
    setPendingDelete: (v: boolean) => void;
  },
  c: {
    handleConfirmArchive: () => void;
    handleConfirmDelete: () => void;
    handleUndoArchive: () => void;
    handleUndoDelete: () => void;
  },
  n: { handleCloseNotesEditor: () => void },
  insets: EdgeInsets
) {
  return {
    editingNote: s.editingNote,
    handleCloseNotesEditor: n.handleCloseNotesEditor,
    handleConfirmArchive: c.handleConfirmArchive,
    handleConfirmDelete: c.handleConfirmDelete,
    handleUndoArchive: c.handleUndoArchive,
    handleUndoDelete: c.handleUndoDelete,
    insets,
    isNotesEditorOpen: s.isNotesEditorOpen,
    isNotesListOpen: s.isNotesListOpen,
    pendingArchive: s.pendingArchive,
    pendingDelete: s.pendingDelete,
    setIsNotesListOpen: s.setIsNotesListOpen,
    setPendingDelete: s.setPendingDelete,
  };
}
