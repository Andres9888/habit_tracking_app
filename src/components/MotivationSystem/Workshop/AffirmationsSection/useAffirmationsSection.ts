/**
 * Custom hook for AffirmationsSection business logic
 * Composes editor and schedule hooks
 */

import type { AffirmationsSectionProps } from './AffirmationsSection.types';
import { useAffirmationEditor } from './useAffirmationEditor';
import { useAffirmationSchedule } from './useAffirmationSchedule';

interface UseAffirmationsSectionProps {
  affirmationCount: number;
  isPremium: boolean;
  onSaveAffirmation: AffirmationsSectionProps['onSaveAffirmation'];
  onUpdateAffirmation: AffirmationsSectionProps['onUpdateAffirmation'];
  onDeleteAffirmation: AffirmationsSectionProps['onDeleteAffirmation'];
  onScheduleAffirmation?: AffirmationsSectionProps['onScheduleAffirmation'];
  onCancelSchedule?: AffirmationsSectionProps['onCancelSchedule'];
  onPremiumRequired: () => void;
}

export function useAffirmationsSection({
  affirmationCount,
  isPremium,
  onSaveAffirmation,
  onUpdateAffirmation,
  onDeleteAffirmation,
  onScheduleAffirmation,
  onCancelSchedule,
  onPremiumRequired,
}: UseAffirmationsSectionProps) {
  const editor = useAffirmationEditor({
    affirmationCount,
    isPremium,
    onDeleteAffirmation,
    onPremiumRequired,
    onSaveAffirmation,
    onUpdateAffirmation,
  });

  const schedule = useAffirmationSchedule({
    isPremium,
    onCancelSchedule,
    onPremiumRequired,
    onScheduleAffirmation,
  });

  return {
    canAddMore: editor.canAddMore,

    editingAffirmation: editor.editingAffirmation,

    handleCloseEditor: editor.handleCloseEditor,

    handleDelete: editor.handleDelete,

    handleEditAffirmation: editor.handleEditAffirmation,

    handleCloseScheduleModal: schedule.handleCloseScheduleModal,

    // Editor state
    isEditorOpen: editor.isEditorOpen,

    handleCancelSchedule: schedule.handleCancelSchedule,

    isSaving: editor.isSaving,

    // Editor handlers
    handleOpenEditor: editor.handleOpenEditor,

    // Schedule modal state
    isScheduleModalOpen: schedule.isScheduleModalOpen,

    // Schedule handlers
    handleOpenScheduleModal: schedule.handleOpenScheduleModal,

    isScheduleSaving: schedule.isScheduleSaving,

    handleSave: editor.handleSave,

    schedulingAffirmation: schedule.schedulingAffirmation,

    handleSaveSchedule: schedule.handleSaveSchedule,
    // Computed values
    hasAffirmations: editor.hasAffirmations,
  };
}
