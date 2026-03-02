/**
 * CreateHabitModalCentered - Full-screen modal for habit creation
 *
 * Matches HabitEditScreen presentation: transparent modal with dark overlay,
 * rounded top container, KeyboardAvoidingView, and swipe-to-dismiss.
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
      accessibilityViewIsModal
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
