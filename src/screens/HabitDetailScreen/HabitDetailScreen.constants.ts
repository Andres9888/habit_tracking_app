/** Constants and helpers for HabitDetailScreen */
import { darkColors, lightColors } from '../../theme/darkColors';

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
    pendingArchive: boolean;
    pendingDelete: boolean;
    setPendingDelete: (v: boolean) => void;
  },
  calendarHandlers: {
    handleConfirmArchive: () => void;
    handleConfirmDelete: () => void;
    handleUndoArchive: () => void;
    handleUndoDelete: () => void;
  }
) {
  return {
    handleConfirmArchive: calendarHandlers.handleConfirmArchive,
    handleConfirmDelete: calendarHandlers.handleConfirmDelete,
    handleUndoArchive: calendarHandlers.handleUndoArchive,
    handleUndoDelete: calendarHandlers.handleUndoDelete,
    pendingArchive: screenState.pendingArchive,
    pendingDelete: screenState.pendingDelete,
    setPendingDelete: screenState.setPendingDelete,
  };
}
