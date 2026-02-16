/**
 * WriteLetterModal Component
 * 
 * Multi-step modal for writing and scheduling future letters to self.
 * 
 * **Trigger:** "Write New Letter" button in Letters section
 * 
 * **Display:**
 * Step 1 - Write:
 * - Header with step indicator, close button
 * - Letter title input
 * - Letter content textarea (multi-line)
 * - "Next" button (enabled when content entered)
 * 
 * Step 2 - Schedule:
 * - Review title and content
 * - Unlock date selector (days in future: 7, 30, 90, 180, 365)
 * - Calculated unlock date preview
 * - Back/Save buttons
 * 
 * **Actions:**
 * - Write letter content and title
 * - Navigate between write/schedule steps
 * - Select unlock date (days in future)
 * - Save letter (scheduled for future delivery)
 * - Cancel/close (discards draft)
 * 
 * **Modal Type:** React Native Modal (slide, pageSheet) with KeyboardAvoidingView
 * 
 * **Lifecycle:**
 * - Opens: visible=true, starts on write step
 * - Step navigation: Next advances to schedule, Back returns to write
 * - Closes: onClose via cancel, or onSave after successful save
 * - Form resets on close
 * 
 * **Pattern:** Uses RN Modal with custom multi-step form
 * Keyboard-aware for text input
 * Two-step wizard: Write → Schedule
 * Letters unlock after specified days for future motivation
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
