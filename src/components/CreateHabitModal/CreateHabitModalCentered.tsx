/**
 * CreateHabitModalCentered - Full-screen modal for habit creation
 *
 * Spring-based sheet transition with animated backdrop.
 * Enter: spring slide-up + fade. Exit: spring slide-down + fade, then unmount.
 */

import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';

import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '../../theme/spacing';
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
  const { animateOut, backdropStyle, panGesture, sheetStyle } = useSwipeDismiss(
    { visible, onClose }
  );

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
  }, [visible, isEditMode]);

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      animationType='none'
      visible={visible}
      onRequestClose={animateOut}
    >
      <View className='flex-1'>
        <Pressable style={StyleSheet.absoluteFill} onPress={animateOut}>
          <Animated.View className='flex-1 bg-black' style={backdropStyle} />
        </Pressable>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className='overflow-hidden rounded-t-3xl shadow-2xl'
            style={[
              styles.sheet,
              sheetStyle,
              { backgroundColor: colors.surface },
            ]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className='flex-1'
            >
              <View style={styles.dragHandleRow}>
                <View
                  style={[
                    styles.dragHandle,
                    { backgroundColor: colors.gray[300] },
                  ]}
                />
              </View>
              <ModalHeader
                habitName={form.habitName}
                isEditMode={isEditMode}
                onClose={animateOut}
                onSave={callbacks.handleSave}
                onValidationError={callbacks.handleValidationError}
              />
              <CreateHabitScrollContent
                callbacks={callbacks}
                form={form}
                scrollViewRef={scrollViewRef}
                showNameError={showNameError}
              />
            </KeyboardAvoidingView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dragHandle: { borderRadius: borderRadius.xs, height: 5, width: 36 },
  dragHandleRow: { alignItems: 'center', paddingBottom: 4, paddingTop: 8 },
  sheet: StyleSheet.absoluteFillObject,
});
