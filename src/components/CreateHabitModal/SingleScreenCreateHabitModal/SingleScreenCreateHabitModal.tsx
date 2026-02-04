/**
 * SingleScreenCreateHabitModal
 *
 * Redesigned habit creation flow per habit-creation-redesign-spec.md
 *
 * Key features:
 * - Single screen (no multi-step wizard)
 * - Smart defaults: random icon, sage green #6B8F71, no reminder, Anytime phase
 * - Collapsible "Customize" row hides icon/color/reminder options
 * - Auto-focus name field on modal open
 * - Create button disabled until name entered (min 2 chars)
 * - Minimal cognitive load: 2-3 focal points max
 *
 * Layout (collapsed):
 * ┌────────────────────────────────┐
 * │   "New Habit"                  │
 * │   [Habit name field]           │ ← Auto-focused
 * │   ○ ● ○ Customize ▾            │ ← Preview chips
 * │   [ Create Habit ]             │ ← Disabled until name
 * └────────────────────────────────┘
 *
 * Layout (expanded):
 * │   ○ ● ○ Customize ▴            │
 * │   ┌──────────────────────────┐ │
 * │   │ Icon    [grid of 12]     │ │
 * │   │ Color   [5 swatches]     │ │
 * │   │ Remind  [time picker]    │ │
 * │   │ Phase   [AM/PM/Any]      │ │
 * │   └──────────────────────────┘ │
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
import {
  ANIMATION,
  COLORS,
  DIMENSIONS,
  SPACING,
  TYPOGRAPHY,
} from './constants';
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
    dayPhase,
    getFormData,
    habitName,
    habitNameError,
    handleColorSelect,
    handleEmojiSelect,
    handlePhaseSelect,
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
  } = useSingleScreenHabitForm({
    habitToEdit: habitToEdit || undefined,
    visible,
  });

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
        {/* Backdrop - tap to dismiss */}
        <Pressable
          accessibilityLabel='Close modal'
          accessibilityRole='button'
          className='flex-1'
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onPress={onClose}
        />

        {/* Modal card - slides up from bottom */}
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
          {/* Close button */}
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

          {/* Title - H2 centered */}
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

          {/* Name input - primary focal point */}
          <View className='px-6'>
            <NameInput
              autoFocus={visible && !isEditMode}
              error={habitNameError}
              value={habitName}
              onBlur={onHabitNameBlur}
              onChangeText={setHabitName}
            />
          </View>

          {/* Customize row - secondary, shows preview chips */}
          <CustomizeRow
            isExpanded={isCustomizeExpanded}
            selectedColor={selectedColor}
            selectedEmoji={selectedEmoji}
            onToggle={toggleCustomize}
          />

          {/* Expandable customize panel */}
          <CustomizePanel
            dayPhase={dayPhase}
            habitName={habitName}
            isVisible={isCustomizeExpanded}
            reminderEnabled={reminderEnabled}
            reminderTime={reminderTime}
            selectedColor={selectedColor}
            selectedEmoji={selectedEmoji}
            onColorSelect={handleColorSelect}
            onEmojiSelect={handleEmojiSelect}
            onPhaseSelect={handlePhaseSelect}
            onReminderTimeChange={handleReminderTimeChange}
            onReminderToggle={toggleReminder}
          />

          {/* Create button - primary action */}
          <View style={{ marginTop: SPACING.md }}>
            <CreateButton
              disabled={!canCreate}
              isEditMode={isEditMode}
              onPress={() => void handleSubmit()}
            />
          </View>

          {/* Home indicator spacer */}
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
