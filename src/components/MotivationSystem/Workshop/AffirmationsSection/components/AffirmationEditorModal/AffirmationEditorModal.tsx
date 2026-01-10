/**
 * AffirmationEditorModal Component
 * Modal for writing/editing an affirmation
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { View } from 'react-native';
import type { AffirmationType } from '../../AffirmationsSection.types';
import { MAX_TEXT_LENGTH } from '../../AffirmationsSection.constants';
import { TypeSelector } from '../TypeSelector';
import { EditorHeader } from './EditorHeader';
import { ScienceCallout } from './ScienceCallout';
import { TextInputSection } from './TextInputSection';
import { ExamplesSection } from './ExamplesSection';
import { SaveButton } from './SaveButton';
import type { AffirmationEditorModalProps } from './AffirmationEditorModal.types';

export function AffirmationEditorModal({
  visible,
  onClose,
  onSave,
  initialText,
  initialType,
  isEditing,
  isSaving,
  isPremium,
}: AffirmationEditorModalProps) {
  const [text, setText] = useState(initialText ?? '');
  const [type, setType] = useState<AffirmationType | undefined>(initialType);

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setText(initialText ?? '');
      setType(initialType);
    }
  }, [visible, initialText, initialType]);

  const canSave =
    text.trim().length >= 3 && text.trim().length <= MAX_TEXT_LENGTH;

  const handleSave = useCallback(async () => {
    if (!canSave || isSaving) return;
    Keyboard.dismiss();
    try {
      await onSave(text.trim(), isPremium ? type : undefined);
      onClose();
    } catch (error) {
      console.error('Failed to save affirmation:', error);
    }
  }, [canSave, isSaving, text, type, isPremium, onSave, onClose]);

  return (
    <Modal
      animationType='slide'
      presentationStyle='pageSheet'
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 bg-white'
      >
        <EditorHeader isEditing={isEditing} onClose={onClose} />

        <ScrollView
          className='flex-1'
          contentContainerClassName='p-4 pb-8'
          keyboardShouldPersistTaps='handled'
        >
          <ScienceCallout />
          <TextInputSection text={text} onChangeText={setText} />

          <View className='mb-4'>
            <TypeSelector
              isPremium={isPremium}
              selectedType={type}
              onSelectType={setType}
            />
          </View>

          <ExamplesSection onSelectExample={setText} />
        </ScrollView>

        <SaveButton
          canSave={canSave}
          isEditing={isEditing}
          isSaving={isSaving}
          onSave={handleSave}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}
