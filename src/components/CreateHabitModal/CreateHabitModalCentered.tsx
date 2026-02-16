/**
 * CreateHabitModalCentered - Full-screen modal for habit creation and editing
 *
 * @description
 * Main entry point for the habit creation flow. Presents a full-screen modal with:
 * - Dark overlay background
 * - Rounded top container with swipe-to-dismiss
 * - Keyboard-aware layout that adjusts for on-screen keyboard
 * - Form sections for name, emoji, color, and reminders
 *
 * @flow
 * 1. User opens modal → `useCreateHabitModal` orchestrates initialization
 * 2. Form state managed by `useHabitForm` (name, emoji, color, reminders)
 * 3. User fills in fields → Callbacks from `useCenteredFormCallbacks`
 * 4. User saves → Validation → `handleCreate` → API mutation
 * 5. Success → Haptic feedback → Modal closes → Form resets
 *
 * @architecture
 * - Presentation: This component (modal shell + gesture handling)
 * - Form logic: `useHabitForm` (state management)
 * - Actions: `useCreateHabitHandlers` (create/edit mutations)
 * - Callbacks: `useCenteredFormCallbacks` (user interactions)
 *
 * @see {@link useCreateHabitModal} - Main orchestration hook
 * @see {@link useHabitForm} - Form state and validation
 * @see {@link CreateHabitScrollContent} - Scrollable form content
 */

import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, View } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';

import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useThemeColors } from '../../theme/ThemeContext';
import { CreateHabitScrollContent } from './components/CreateHabitScrollContent';
import { ModalHeader } from './components/ModalHeader';
import { useCenteredFormCallbacks } from './hooks/useCenteredFormCallbacks';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { useSwipeDismiss } from './hooks/useSwipeDismiss';
import type { CreateHabitModalProps } from './types';

export default function CreateHabitModalCentered(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, handleCreate } = useCreateHabitModal(props);
  const scrollViewRef = useRef<ScrollViewType>(null);
  const [showNameError, setShowNameError] = useState(false);
  const { colors } = useThemeColors();
  const { animatedStyle, panGesture } = useSwipeDismiss({ onClose });

  const callbacks = useCenteredFormCallbacks({
    form,
    handleCreate,
    scrollViewRef,
    setShowNameError,
  });

  // Reset form when modal opens (and not in edit mode)
  useEffect(() => {
    if (visible && !isEditMode) {
      form.resetForm();
      setShowNameError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isEditMode]);

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <View className='flex-1 bg-black/50'>
          <GestureDetector gesture={panGesture}>
            <Animated.View
              className='flex-1 overflow-hidden rounded-t-3xl shadow-2xl'
              style={[animatedStyle, { backgroundColor: colors.surface }]}
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
                scrollViewRef={scrollViewRef}
                showNameError={showNameError}
              />
            </Animated.View>
          </GestureDetector>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
