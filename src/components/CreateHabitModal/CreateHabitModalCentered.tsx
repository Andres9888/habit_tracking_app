/**
 * CreateHabitModalCentered Component
 * 
 * Full-screen modal for creating new habits or editing existing ones.
 * 
 * **Trigger:**
 * - Create: + button in main navigation
 * - Edit: Edit button in HabitCalendarModal or Settings
 * 
 * **Display:**
 * - Header with "Create Habit" or habit name (edit mode), close/save buttons
 * - Scrollable form with sections:
 *   - Habit name (required, validated)
 *   - Emoji picker button
 *   - Schedule selector (daily/custom days)
 *   - Reminder time picker
 *   - Template science info (if from template)
 * - Dark overlay backdrop
 * - Keyboard-aware layout
 * - Swipe-down to dismiss gesture
 * 
 * **Actions:**
 * - Enter habit name (validation on save)
 * - Select emoji (opens EmojiPickerSheet)
 * - Configure schedule
 * - Set reminder time (opens TimePickerModal)
 * - Save habit (validates, creates/updates)
 * - Close/cancel (discards changes)
 * 
 * **Modal Type:** React Native Modal (slide) with custom swipe-to-dismiss
 * 
 * **Lifecycle:**
 * - Opens: visible=true, form resets (create) or loads habit data (edit)
 * - Closes: onClose via X button, swipe gesture, or successful save
 * - Validation: Shows name error if empty on save attempt
 * 
 * **Pattern:** Transparent modal with dark overlay and rounded-top container
 * Uses KeyboardAvoidingView for iOS keyboard handling
 * GestureDetector for swipe-to-dismiss with Reanimated
 * Matches HabitEditScreen presentation style
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
