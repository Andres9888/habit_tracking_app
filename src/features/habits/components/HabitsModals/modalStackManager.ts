/**
 * Modal Stack Manager
 * Prevents overlapping modals and manages modal hierarchy/priority
 *
 * Modal Priority (highest to lowest):
 * 1. Confirmation/Alert modals (PauseModal, DeleteConfirm)
 * 2. Full-screen modals (HabitDetail, Edit, Templates)
 * 3. Bottom sheets (QuickActions, Sort)
 * 4. Settings modal (lowest priority - can be behind other modals)
 */

export interface ModalStackState {
  activeModals: Set<string>;
  modalPriority: Record<string, number>;
}

const MODAL_PRIORITIES = {
  pauseModal: 1000,
  deleteConfirm: 1000,
  habitDetail: 900,
  editScreen: 900,
  templatesScreen: 900,
  visualizationExercise: 900,
  quickActions: 500,
  sortSheet: 500,
  settings: 100,
  createHabit: 800,
  shareCard: 950,
  habiCalendar: 900,
  hapticTest: 100,
} as const;

/**
 * Determines if a modal can open based on current stack state
 * High-priority modals can open even if lower-priority ones are open
 * Same-priority modals cannot be open simultaneously
 */
export function canOpenModal(
  modalKey: keyof typeof MODAL_PRIORITIES,
  activeModals: Set<string>
): boolean {
  if (activeModals.size === 0) return true;

  const incomingPriority = MODAL_PRIORITIES[modalKey];

  // Check if any modal with higher or equal priority is already open
  return ![...activeModals].some((activeModal) => {
    const activePriority =
      MODAL_PRIORITIES[activeModal as keyof typeof MODAL_PRIORITIES] ?? 0;
    return activePriority >= incomingPriority;
  });
}

/**
 * Get all modals that should be closed when opening a new modal
 * Closes lower-priority modals to prevent overlap
 */
export function getModalsToClose(
  modalKey: keyof typeof MODAL_PRIORITIES,
  activeModals: Set<string>
): string[] {
  const incomingPriority = MODAL_PRIORITIES[modalKey];
  const toClose: string[] = [];

  for (const activeModal of activeModals) {
    const activePriority =
      MODAL_PRIORITIES[activeModal as keyof typeof MODAL_PRIORITIES] ?? 0;
    // Close modals with lower priority than the incoming one
    if (activePriority < incomingPriority) {
      toClose.push(activeModal);
    }
  }

  return toClose;
}

/**
 * Get the Z-index for a modal based on its priority
 * Used for proper layering in case multiple modals need to be visible
 */
export function getModalZIndex(
  modalKey: keyof typeof MODAL_PRIORITIES
): number {
  return MODAL_PRIORITIES[modalKey] ?? 0;
}
