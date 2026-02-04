/**
 * HabitEditScreen Component
 *
 * Full-screen modal for editing an existing habit's properties.
 * Features card-based layout with staggered entrance animations.
 *
 * Allows modification of:
 * - Habit name
 * - Emoji icon and accent color
 * - Reminder settings
 * - Archive/delete actions
 *
 * Includes unsaved changes protection and haptic feedback.
 */

import { Keyboard, Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EditHeader } from './EditHeader';
import { LivePreviewChip } from './LivePreviewChip';
import { NameInputSection } from './NameInputSection';
import { CustomizeSection } from './CustomizeSection';
import { DangerZone } from './DangerZone';
import { useHabitEditScreen } from './useHabitEditScreen';
import type { HabitEditScreenProps } from './types';

export default function HabitEditScreen({
  visible,
  habitId,
  onClose,
}: HabitEditScreenProps) {
  const insets = useSafeAreaInsets();
  const state = useHabitEditScreen({ habitId, onClose });

  if (!visible || !habitId) {
    return null;
  }

  return (
    <Modal animationType='slide' visible={visible} onRequestClose={onClose}>
      <View className='flex-1 bg-stone-50'>
        <EditHeader
          paddingTop={insets.top + 8}
          onCancel={() => {
            state.triggerSelection();
            onClose();
          }}
          onSave={() => void state.handleSave()}
        />

        <ScrollView
          className='flex-1'
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={Keyboard.dismiss}>
            <LivePreviewChip
              color={state.selectedColor}
              emoji={state.selectedEmoji}
              name={state.habitName}
            />

            <NameInputSection
              habitName={state.habitName}
              onChangeText={state.setHabitName}
            />

            <CustomizeSection
              habitName={state.habitName}
              remindersEnabled={state.remindersEnabled}
              reminderTime={state.reminderTime}
              selectedColor={state.selectedColor}
              selectedEmoji={state.selectedEmoji}
              onColorSelect={state.handleColorSelect}
              onEmojiSelect={state.handleEmojiSelect}
              onReminderTimeChange={state.handleReminderTimeChange}
              onReminderToggle={state.handleReminderToggle}
            />

            <DangerZone
              onArchive={state.handleArchive}
              onDelete={state.handleDelete}
            />
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}
