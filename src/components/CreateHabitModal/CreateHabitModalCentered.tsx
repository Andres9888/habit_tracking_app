/**
 * CreateHabitModalCentered - Centered layout version of the habit creation modal
 *
 * Features:
 * - Centered name input with prominent heading "What habit do you want to build?"
 * - "CUSTOMIZE (OPTIONAL)" section with emoji, color, reminder
 * - Smart defaults reduce cognitive load
 * - 2-tap creation flow (name -> create)
 * - Swipe-to-dismiss gesture support
 * - Modal resets on open
 */

import { useEffect, useRef, useState } from 'react';
import { Keyboard, Modal, Pressable, ScrollView } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';

import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { CreateHabitFormCentered } from './components/CreateHabitFormCentered';
import { ModalHeader } from './components/ModalHeader';
import { HABIT_COLORS } from './constants';
import { useCenteredFormCallbacks } from './hooks/useCenteredFormCallbacks';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { useSwipeDismiss } from './hooks/useSwipeDismiss';
import type { CreateHabitModalProps } from './types';

export default function CreateHabitModalCentered(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, handleCreate } = useCreateHabitModal(props);

  // ScrollView ref for auto-scrolling to reminder section
  const scrollViewRef = useRef<ScrollViewType>(null);

  // Validation error state
  const [showNameError, setShowNameError] = useState(false);

  // Swipe dismissal gesture
  const { animatedStyle, panGesture } = useSwipeDismiss({ onClose });

  // Form callbacks
  const {
    handleColorSelect,
    handleEmojiSelect,
    handleNameChange,
    handleReminderTimeChange,
    handleReminderToggle,
    handleSave,
    handleSubmit,
    handleValidationError,
  } = useCenteredFormCallbacks({
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
            onValidationError={handleValidationError}
          />

          {/* Scrollable Centered Form */}
          <ScrollView
            ref={scrollViewRef}
            className='flex-1'
            contentContainerStyle={{ paddingBottom: 120 }}
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <Pressable onPress={Keyboard.dismiss}>
              <CreateHabitFormCentered
                autoFocus
                colors={HABIT_COLORS}
                habitName={form.habitName}
                reminderEnabled={form.remindersEnabled}
                reminderTime={form.reminderTime}
                selectedColor={form.selectedColor}
                selectedEmoji={form.selectedEmoji}
                showNameError={showNameError}
                onColorSelect={handleColorSelect}
                onEmojiSelect={handleEmojiSelect}
                onHabitNameChange={handleNameChange}
                onReminderTimeChange={handleReminderTimeChange}
                onReminderToggle={handleReminderToggle}
                onSubmit={handleSubmit}
              />
            </Pressable>
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}
