/**
 * CreateHabitModalCentered - Full-screen modal for habit creation
 *
 * Native iOS slide animation (`animationType='slide'`) — matches Settings and
 * Templates so all three bottom-bar actions feel identical. No custom Reanimated
 * sheet needed; the OS handles the transition.
 */

import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  View,
} from 'react-native';
import type { ScrollView as ScrollViewType, View as ViewType } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
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

  // Reset form when modal opens (and not in edit mode)
  useEffect(() => {
    if (visible && !isEditMode) {
      form.resetForm();
      setShowNameError(false);
    }
  }, [visible, isEditMode]);

  // Flash the native scroll indicator on open so users see the form is scrollable.
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => {
      scrollViewRef.current?.flashScrollIndicators();
    }, 350);
    return () => clearTimeout(id);
  }, [visible]);

  return (
    <Modal
      accessibilityViewIsModal
      animationType='slide'
      presentationStyle='overFullScreen'
      transparent
      visible={visible}
      onRequestClose={onClose}
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
