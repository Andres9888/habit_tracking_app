/* eslint-disable max-lines */
import { useCallback, useEffect } from 'react';
import { Modal, ScrollView } from 'react-native';
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
 * - Centered name input with prominent heading "What habit do you want to build?"
 * - "CUSTOMIZE (OPTIONAL)" section with emoji, color, reminder
 * - Smart defaults reduce cognitive load
 * - 2-tap creation flow (name → create)
 * - Swipe-to-dismiss gesture support
 * - Modal resets on open
 *
 * Layout:
 * 1. Header with title and close button
 * 2. Centered form component with progressive disclosure
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isEditMode]);

  const handleEmojiSelect = useCallback(
    (emoji: string | null) => {
      form.setSelectedEmoji(emoji);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      form.setSelectedColor(color);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleCustomColorPress = useCallback(() => {
    form.openColorPicker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNameChange = useCallback(
    (value: string) => {
      form.setHabitName(value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleReminderToggle = useCallback(
    (enabled: boolean) => {
      form.setRemindersEnabled(enabled);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleReminderTimeChange = useCallback(
    (time: Date) => {
      form.setReminderTime(time);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Wrap async handleCreate to satisfy void return type requirement
  const handleSubmit = useCallback(() => {
    void handleCreate();
  }, [handleCreate]);

  const handleSave = useCallback(() => {
    void handleCreate();
  }, [handleCreate]);

  return (
    <Modal
      animationType='slide'
      presentationStyle='pageSheet'
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View className='flex-1 bg-stone-50' style={animatedStyle}>
          {/* Header */}
          <ModalHeader
            habitName={form.habitName}
            isEditMode={isEditMode}
            onClose={onClose}
            onSave={handleSave}
          />

          {/* Scrollable Centered Form */}
          <ScrollView
            className='flex-1'
            contentContainerStyle={{ paddingBottom: 120 }}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <CreateHabitFormCentered
              autoFocus
              colors={HABIT_COLORS}
              habitName={form.habitName}
              reminderEnabled={form.remindersEnabled}
              reminderTime={form.reminderTime}
              selectedColor={form.selectedColor}
              selectedEmoji={form.selectedEmoji}
              onColorSelect={handleColorSelect}
              onCustomColorPress={handleCustomColorPress}
              onEmojiSelect={handleEmojiSelect}
              onHabitNameChange={handleNameChange}
              onReminderTimeChange={handleReminderTimeChange}
              onReminderToggle={handleReminderToggle}
              onSubmit={handleSubmit}
            />
          </ScrollView>

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
