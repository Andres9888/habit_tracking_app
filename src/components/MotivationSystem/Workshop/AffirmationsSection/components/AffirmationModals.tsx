/**
 * AffirmationModals Component
 * Container for Editor and Schedule modals
 */

import React from 'react';
import { AffirmationScheduleModal } from '../../AffirmationScheduleModal';
import type {
  AffirmationData,
  AffirmationType,
} from '../AffirmationsSection.types';
import type { AffirmationScheduleConfig } from '../AffirmationsSection.types';
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
  onSaveSchedule: (schedule: AffirmationScheduleConfig) => Promise<void>;
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
            frequency: schedulingAffirmation.frequency ?? 'daily',
            isScheduleEnabled: schedulingAffirmation.isScheduleEnabled ?? false,
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
