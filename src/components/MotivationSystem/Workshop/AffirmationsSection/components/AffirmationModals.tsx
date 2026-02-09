/**
 * AffirmationModals Component
 * Container for Editor and Schedule modals
 */

import React from 'react';
import { AffirmationScheduleModal } from '../../AffirmationScheduleModal';
import type { AffirmationScheduleData } from '../../AffirmationScheduleModal/types';
import type {
  AffirmationData,
  AffirmationType,
} from '../AffirmationsSection.types';
import { AffirmationEditorModal } from './AffirmationEditorModal';

interface AffirmationModalsProps {
  // Editor modal
  isEditorOpen: boolean;
  editingAffirmation: AffirmationData | null;
  isSaving: boolean;
  isPremium: boolean;
  onCloseEditor: () => void;
  onSave: (text: string, type?: AffirmationType) => Promise<void>;
  // Schedule modal
  isScheduleModalOpen: boolean;
  schedulingAffirmation: AffirmationData | null;
  isScheduleSaving: boolean;
  onCloseScheduleModal: () => void;
  onSaveSchedule: (schedule: AffirmationScheduleData) => Promise<void>;
  onCancelSchedule: () => Promise<void>;
}

export function AffirmationModals({
  isEditorOpen,
  editingAffirmation,
  isSaving,
  isPremium,
  onCloseEditor,
  onSave,
  isScheduleModalOpen,
  schedulingAffirmation,
  isScheduleSaving,
  onCloseScheduleModal,
  onSaveSchedule,
  onCancelSchedule,
}: AffirmationModalsProps) {
  return (
    <>
      <AffirmationEditorModal
        initialText={editingAffirmation?.text}
        initialType={editingAffirmation?.type}
        isEditing={!!editingAffirmation}
        isPremium={isPremium}
        isSaving={isSaving}
        visible={isEditorOpen}
        onClose={onCloseEditor}
        onSave={onSave}
      />

      {schedulingAffirmation && (
        <AffirmationScheduleModal
          affirmationText={schedulingAffirmation.text}
          initialSchedule={{
            daysOfWeek: schedulingAffirmation.daysOfWeek,
            frequency: schedulingAffirmation.frequency,
            isScheduleEnabled: schedulingAffirmation.isScheduleEnabled,
            scheduledTime: schedulingAffirmation.scheduledTime,
          }}
          isSaving={isScheduleSaving}
          visible={isScheduleModalOpen}
          onCancel={onCancelSchedule}
          onClose={onCloseScheduleModal}
          onSave={onSaveSchedule}
        />
      )}
    </>
  );
}
