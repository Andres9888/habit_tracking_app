/** Constants and helpers for HabitDetailScreen */
import { darkColors, lightColors } from '../../theme/darkColors';
import type { EdgeInsets } from 'react-native-safe-area-context';
import type { Doc } from '../../../convex/_generated/dataModel';

export const DETAIL_BG_GRADIENT_LIGHT = [
  lightColors.background,
  lightColors.gray[50],
  lightColors.background,
] as const;

export const DETAIL_BG_GRADIENT_DARK = [
  darkColors.background,
  darkColors.surface,
  darkColors.background,
] as const;

/** @deprecated Use DETAIL_BG_GRADIENT_LIGHT/DARK with useThemeColors instead */
export const DETAIL_BG_GRADIENT = DETAIL_BG_GRADIENT_LIGHT;

/** Assemble props for HabitDetailModals from hook return values */
export function buildModalsProps(
  screenState: {
    editingNote: Doc<'notes'> | null | undefined;
    isNotesEditorOpen: boolean;
    isNotesListOpen: boolean;
    pendingArchive: boolean;
    pendingDelete: boolean;
    setIsNotesListOpen: (v: boolean) => void;
    setPendingDelete: (v: boolean) => void;
  },
  calendarHandlers: {
    handleConfirmArchive: () => void;
    handleConfirmDelete: () => void;
    handleUndoArchive: () => void;
    handleUndoDelete: () => void;
  },
  notesHandlers: { handleCloseNotesEditor: () => void },
  insets: EdgeInsets
) {
  return {
    editingNote: screenState.editingNote,
    handleCloseNotesEditor: notesHandlers.handleCloseNotesEditor,
    handleConfirmArchive: calendarHandlers.handleConfirmArchive,
    handleConfirmDelete: calendarHandlers.handleConfirmDelete,
    handleUndoArchive: calendarHandlers.handleUndoArchive,
    handleUndoDelete: calendarHandlers.handleUndoDelete,
    insets,
    isNotesEditorOpen: screenState.isNotesEditorOpen,
    isNotesListOpen: screenState.isNotesListOpen,
    pendingArchive: screenState.pendingArchive,
    pendingDelete: screenState.pendingDelete,
    setIsNotesListOpen: screenState.setIsNotesListOpen,
    setPendingDelete: screenState.setPendingDelete,
  };
}
