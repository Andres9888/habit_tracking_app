/**
 * WriteLetterModal Component
 * Modal for writing a new letter to self
 */

import React from 'react';
import { Modal, KeyboardAvoidingView, Platform } from 'react-native';
import type { WriteLetterModalProps } from './WriteLetterModal.types';
import { useWriteLetterModal } from './useWriteLetterModal';
import { WriteLetterHeader } from './WriteLetterHeader';
import { WriteLetterFooter } from './WriteLetterFooter';
import { useThemeColors } from '../../../../../../theme/ThemeContext';
import { WriteStep } from './WriteStep';
import { ScheduleStep } from './ScheduleStep';

export function WriteLetterModal({
  visible,
  onClose,
  onSave,
  isSaving,
}: WriteLetterModalProps) {
  const { colors } = useThemeColors();
  const hook = useWriteLetterModal({ isSaving, onClose, onSave, visible });

  return (
    <Modal
      animationType='slide'
      presentationStyle='pageSheet'
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
        style={{ backgroundColor: colors.background }}
      >
        <WriteLetterHeader step={hook.step} onClose={onClose} />

        {hook.step === 'write' ? (
          <WriteStep
            content={hook.content}
            title={hook.title}
            onContentChange={hook.setContent}
            onTitleChange={hook.setTitle}
          />
        ) : (
          <ScheduleStep
            content={hook.content}
            title={hook.title}
            unlockDateString={hook.unlockDateString}
            unlockDays={hook.unlockDays}
            onBack={hook.handleBack}
            onSelectDays={hook.setUnlockDays}
          />
        )}

        <WriteLetterFooter
          canProceed={hook.canProceedToSchedule}
          canSave={hook.canSave}
          isSaving={isSaving}
          step={hook.step}
          onNext={hook.handleNext}
          onSave={hook.handleSave}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}
