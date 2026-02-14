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

    handleCancelSchedule: schedule.handleCancelSchedule,

    handleCloseEditor: editor.handleCloseEditor,

    handleCloseScheduleModal: schedule.handleCloseScheduleModal,

    handleDelete: editor.handleDelete,

    
    handleEditAffirmation: editor.handleEditAffirmation,

    
// Editor handlers
handleOpenEditor: editor.handleOpenEditor,

    

// Schedule handlers
handleOpenScheduleModal: schedule.handleOpenScheduleModal,

    
    

handleSave: editor.handleSave,

    
    

handleSaveSchedule: schedule.handleSaveSchedule,

    
    

// Computed values
hasAffirmations: editor.hasAffirmations,

    

// Editor state
isEditorOpen: editor.isEditorOpen,

    

isSaving: editor.isSaving,

    
// Schedule modal state
isScheduleModalOpen: schedule.isScheduleModalOpen,

    
isScheduleSaving: schedule.isScheduleSaving,
    
    schedulingAffirmation: schedule.schedulingAffirmation,
  };
}
