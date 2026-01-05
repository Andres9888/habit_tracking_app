import { useCallback, useEffect } from 'react';
import { Modal, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ColorPickerSheet } from './ColorPickerSheet';
import { HABIT_COLORS } from './constants';
import type { CreateHabitModalProps } from './types';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { ModalHeader } from './components/ModalHeader';
import { CreateHabitFormCentered } from './components/CreateHabitFormCentered';

// V11: Swipe dismissal constants
const SWIPE_DISMISS_THRESHOLD = 100; // pixels
const SWIPE_VELOCITY_THRESHOLD = 500; // pixels per second

/**
 * CreateHabitModalCentered - Centered layout version of the habit creation modal
 *
 * Features:
 * - Centered name input with prominent heading
 * - "CUSTOMIZE (OPTIONAL)" section with emoji, color, reminder
 * - Smart defaults reduce cognitive load
 * - 2-tap creation flow (name → create)
 * - Swipe-to-dismiss gesture support
 * - KeyboardAvoidingView for proper iOS/Android keyboard handling
 * - Modal resets on open
 *
 * Layout:
 * 1. Header with title and close button
 * 2. Form component with centered layout
 * 3. Submit button in footer (part of form component)
 */
export default function CreateHabitModalCentered(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, handleCreate } = useCreateHabitModal(props);

  // Swipe dismissal gesture state
  const translateY = useSharedValue(0);
  const context = useSharedValue({ startY: 0 });

  // Pan gesture for swipe-to-dismiss
  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { startY: translateY.value };
    })
    .onUpdate((event) => {
      // Only allow downward swipes
      const newTranslateY = context.value.startY + event.translationY;
      if (newTranslateY >= 0) {
        translateY.value = newTranslateY;
      }
    })
    .onEnd((event) => {
      const shouldDismiss =
        translateY.value > SWIPE_DISMISS_THRESHOLD ||
        event.velocityY > SWIPE_VELOCITY_THRESHOLD;

      if (shouldDismiss) {
        // Dismiss modal
        runOnJS(onClose)();
        // Reset position for next open
        translateY.value = 0;
      } else {
        // Spring back to original position
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
        });
      }
    });

  // Animated style for swipe translation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Reset form when modal opens (and not in edit mode)
  useEffect(() => {
    if (visible && !isEditMode) {
      form.resetForm();
    }
  }, [visible, isEditMode, form]);

  const handleEmojiSelect = useCallback(
    (emoji: string | null) => {
      form.setSelectedEmoji(emoji);
    },
    [form]
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      form.setSelectedColor(color);
    },
    [form]
  );

  const handleCustomColorPress = useCallback(() => {
    form.openColorPicker();
  }, [form]);

  const handleNameChange = useCallback(
    (value: string) => {
      form.setHabitName(value);
    },
    [form]
  );

  return (
    <Modal
      animationType='slide'
      presentationStyle='pageSheet'
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          className='flex-1 bg-stone-50'
          style={animatedStyle}
        >
          {/* Header */}
          <ModalHeader
            habitName={form.habitName}
            isEditMode={isEditMode}
            onClose={onClose}
            onSave={handleCreate}
          />

          {/* Centered Form */}
          <CreateHabitFormCentered
            autoFocus
            colors={HABIT_COLORS}
            habitName={form.habitName}
            reminderOption={form.reminderOption}
            selectedColor={form.selectedColor}
            selectedEmoji={form.selectedEmoji}
            onColorSelect={handleColorSelect}
            onCustomColorPress={handleCustomColorPress}
            onEmojiSelect={handleEmojiSelect}
            onHabitNameChange={handleNameChange}
            onReminderOptionSelect={form.setReminderOption}
            onSubmit={handleCreate}
          />

          {/* Custom Color Picker Modal */}
          <ColorPickerSheet
            selectedColor={form.selectedColor}
            visible={form.isColorPickerVisible}
            onClose={form.closeColorPicker}
            onSelectColor={handleColorSelect}
          />
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}
