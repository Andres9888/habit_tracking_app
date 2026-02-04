/**
 * SingleScreenCreateHabitModal
 * Redesigned habit creation flow - single screen with collapsible customize
 * Based on habit-creation-redesign-spec.md
 *
 * Features:
 * - Single screen (no multi-step)
 * - Smart defaults: random icon, sage green, no reminder, Anytime phase
 * - Collapsible "Customize" row
 * - Auto-focus name field on open
 * - Minimal cognitive load (2-3 focal points max)
 */

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

import { memo, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { useCreateHabitHandlers } from '../hooks/useCreateHabitHandlers';
import { CreateButton } from './CreateButton';
import { CustomizePanel } from './CustomizePanel';
import { CustomizeRow } from './CustomizeRow';
import { NameInput } from './NameInput';
import { useSingleScreenHabitForm } from './useSingleScreenHabitForm';
import { ANIMATION, COLORS, DIMENSIONS, SPACING, TYPOGRAPHY } from './constants';
import type { CreateHabitModalProps } from '../types';

function SingleScreenCreateHabitModalComponent({
  habitToEdit,
  onClose,
  visible,
}: CreateHabitModalProps) {
  const insets = useSafeAreaInsets();
  const { triggerSuccess } = useHapticFeedback();
  const { handleCreate: createHabit, handleEdit: editHabit } =
    useCreateHabitHandlers();

  const {
    canCreate,
    getFormData,
    habitName,
    habitNameError,
    handleColorSelect,
    handleEmojiSelect,
    handleReminderTimeChange,
    isCustomizeExpanded,
    isEditMode,
    onHabitNameBlur,
    reminderEnabled,
    reminderTime,
    selectedColor,
    selectedEmoji,
    setHabitName,
    toggleCustomize,
    toggleReminder,
  } = useSingleScreenHabitForm({ habitToEdit: habitToEdit || undefined, visible });

  const handleSubmit = useCallback(async () => {
    if (!canCreate) return;
    const formData = getFormData();
    try {
      await (isEditMode && habitToEdit
        ? editHabit({
            ...formData,
            habitToEdit: {
              _id: habitToEdit._id,
              notes: habitToEdit.notes || '',
            },
          })
        : createHabit(formData));
      triggerSuccess();
      onClose();
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to save habit:', error);
      }
    }
  }, [
    canCreate,
    createHabit,
    editHabit,
    getFormData,
    habitToEdit,
    isEditMode,
    onClose,
    triggerSuccess,
  ]);

  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <Pressable
          className='flex-1'
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onPress={onClose}
        />

        <Animated.View
          entering={SlideInDown.duration(ANIMATION.screenEntry).springify()}
          style={{
            backgroundColor: COLORS.cardBackground,
            borderTopLeftRadius: DIMENSIONS.borderRadius.card,
            borderTopRightRadius: DIMENSIONS.borderRadius.card,
            elevation: 8,
            paddingBottom: Math.max(insets.bottom, SPACING.lg),
            shadowColor: '#000',
            shadowOffset: { height: -4, width: 0 },
            shadowOpacity: 0.04,
            shadowRadius: 12,
          }}
        >
          <View className='flex-row justify-end px-4 pt-4'>
            <Pressable
              accessibilityLabel='Close'
              accessibilityRole='button'
              className='items-center justify-center'
              hitSlop={8}
              style={{ height: 32, width: 32 }}
              onPress={onClose}
            >
              <X color={COLORS.mutedText} size={20} />
            </Pressable>
          </View>

          <Text
            className='text-center'
            style={{
              color: COLORS.secondary,
              fontSize: TYPOGRAPHY.h2.fontSize,
              fontWeight: TYPOGRAPHY.h2.fontWeight,
              letterSpacing: TYPOGRAPHY.h2.letterSpacing,
              marginBottom: SPACING.lg,
            }}
          >
            {isEditMode ? 'Edit Habit' : 'New Habit'}
          </Text>

          <View className='px-6'>
            <NameInput
              autoFocus={visible && !isEditMode}
              error={habitNameError}
              value={habitName}
              onBlur={onHabitNameBlur}
              onChangeText={setHabitName}
            />
          </View>

          <CustomizeRow
            isExpanded={isCustomizeExpanded}
            selectedColor={selectedColor}
            selectedEmoji={selectedEmoji}
            onToggle={toggleCustomize}
          />

          <CustomizePanel
            habitName={habitName}
            isVisible={isCustomizeExpanded}
            reminderEnabled={reminderEnabled}
            reminderTime={reminderTime}
            selectedColor={selectedColor}
            selectedEmoji={selectedEmoji}
            onColorSelect={handleColorSelect}
            onEmojiSelect={handleEmojiSelect}
            onReminderTimeChange={handleReminderTimeChange}
            onReminderToggle={toggleReminder}
          />

          <View style={{ marginTop: SPACING.md }}>
            <CreateButton disabled={!canCreate} onPress={() => void handleSubmit()} />
          </View>

          <View className='mt-4 items-center'>
            <View
              style={{
                backgroundColor: COLORS.neutralBase,
                borderRadius: 2,
                height: 4,
                width: 32,
              }}
            />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export const SingleScreenCreateHabitModal = memo(
  SingleScreenCreateHabitModalComponent
);
export default SingleScreenCreateHabitModal;
