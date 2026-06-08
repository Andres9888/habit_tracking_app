/**
 * CreateHabitModalCentered - Full-screen modal for habit creation
 *
 * Full-screen modal for habit creation/editing. Uses the app modal animator so
 * dismissals can play the same slide path as entrances in reverse.
 */

import { useEffect, useRef, useState } from 'react';
import { EXIT_DURATIONS } from '../Modal/Modal.constants';
import { createHabitMotion } from './createHabitMotion';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import type {
  ScrollView as ScrollViewType,
  View as ViewType,
} from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import Modal from '../Modal';
import { CreateHabitScrollContent } from './components/CreateHabitScrollContent';
import { ModalHeader } from './components/ModalHeader';
import { useCenteredFormCallbacks } from './hooks/useCenteredFormCallbacks';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import type { CreateHabitModalProps } from './types';

export default function CreateHabitModalCentered(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, handleCreate } = useCreateHabitModal(props);
  const scrollViewRef = useRef<ScrollViewType>(null);
  const scrollContentRef = useRef<ViewType>(null);
  const reminderSectionRef = useRef<ViewType>(null);
  const [showNameError, setShowNameError] = useState(false);
  const { colors } = useThemeColors();

  const callbacks = useCenteredFormCallbacks({
    form,
    handleCreate,
    reminderSectionRef,
    scrollContentRef,
    scrollViewRef,
    setShowNameError,
  });

  useEffect(() => {
    if (visible || isEditMode) return;
    const timeout = setTimeout(
      () => setShowNameError(false),
      EXIT_DURATIONS.fullScreen
    );
    return () => clearTimeout(timeout);
  }, [visible, isEditMode]);

  // Flash the native scroll indicator on open so users see the form is scrollable.
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => {
      scrollViewRef.current?.flashScrollIndicators();
    }, createHabitMotion.contentReadyMs);
    return () => clearTimeout(id);
  }, [visible]);

  return (
    <Modal
      disableBackdropClose
      disableGestureClose
      backdropOpacity={0}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <View className='flex-1' style={{ backgroundColor: colors.surface }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='flex-1'
        >
          <ModalHeader
            habitName={form.habitName}
            isEditMode={isEditMode}
            onClose={onClose}
            onSave={callbacks.handleSave}
            onValidationError={callbacks.handleValidationError}
          />
          <CreateHabitScrollContent
            active={!isEditMode}
            visible={visible}
            callbacks={callbacks}
            form={form}
            reminderSectionRef={reminderSectionRef}
            scrollContentRef={scrollContentRef}
            scrollViewRef={scrollViewRef}
            showNameError={showNameError}
          />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
