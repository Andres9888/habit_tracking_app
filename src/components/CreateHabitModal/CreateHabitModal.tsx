import { useCallback, useMemo } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQuery } from 'convex/react';
import { ColorPickerSheet } from './ColorPickerSheet';
import TemplateScienceModal from '../TemplateScienceModal';
import { COLORS, EMOJIS, MAX_HABIT_NAME_LENGTH, MIN_HABIT_NAME_LENGTH } from './constants';
import type { CreateHabitModalProps } from './types';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { ModalHeader } from './components/ModalHeader';
import { TemplateBrowser } from './components/TemplateBrowser';
import { TemplateReminderPrompt } from './components/TemplateReminderPrompt';
import { HabitPreview } from './components/HabitPreview';
import { HabitNameField } from './components/HabitNameField';
import { NameSuggestions } from './components/NameSuggestions';
import { EmojiPicker } from './components/EmojiPicker';
import { ColorPickerSection } from './components/ColorPickerSection';
import { ReminderSection } from './components/ReminderSection';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import { StickyCreateBar } from './components/StickyCreateBar';
import { api } from '../../../convex/_generated/api';
import { parseHabitName } from './utils';

export default function CreateHabitModal(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, template, science, handleCreate } = useCreateHabitModal(props);
  const { triggerSelection, triggerWarning } = useHapticFeedback();
  const insets = useSafeAreaInsets();
  const habits = useQuery(api.habits.list) ?? [];

  const trimmedName = form.habitName.trim();
  const normalizedName = trimmedName.toLowerCase();
  const editingHabitId = props.habitToEdit?._id;

  const isDuplicateName = useMemo(() => {
    if (!trimmedName) return false;
    return habits.some((habit) => {
      if (editingHabitId && habit._id === editingHabitId) {
        return false;
      }
      const parsed = parseHabitName(habit.name);
      return parsed.name.trim().toLowerCase() === normalizedName;
    });
  }, [habits, editingHabitId, normalizedName, trimmedName]);

  const isNameTooShort =
    trimmedName.length > 0 && trimmedName.length < MIN_HABIT_NAME_LENGTH;
  const canSubmit = trimmedName.length >= MIN_HABIT_NAME_LENGTH && !isDuplicateName;

  const handleAttemptCreate = useCallback(() => {
    if (!canSubmit) {
      triggerWarning();
      return;
    }
    handleCreate();
  }, [canSubmit, handleCreate, triggerWarning]);

  return (
    <Modal transparent animationType='slide' visible={visible} onRequestClose={onClose}>
      <View className='flex-1 bg-black/50'>
        <View
          className='flex-1 overflow-hidden rounded-t-3xl bg-[#f8f5f1] shadow-2xl'
          style={{ marginTop: Math.max(insets.top + 16, 48) }}
        >
          <ModalHeader
            isEditMode={isEditMode}
            canSave={canSubmit}
            onClose={onClose}
            onSave={handleAttemptCreate}
          />
          <ScrollView
            ref={template.scrollViewRef}
            className='flex-1 px-4'
            contentContainerStyle={{ paddingBottom: isEditMode ? 32 : 160 }}
            keyboardShouldPersistTaps='handled'
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onScroll={template.handleMainScroll}
          >
            <TemplateBrowser isEditMode={isEditMode} template={template} onViewScience={science.open} />
            <HabitPreview
              habitName={form.habitName}
              selectedEmoji={form.selectedEmoji}
              selectedColor={form.selectedColor}
              frequencyLabel={form.frequency}
            />
            <HabitNameField
              value={form.habitName}
              onChange={form.setHabitName}
              autoFocus={visible && !isEditMode}
              maxLength={MAX_HABIT_NAME_LENGTH}
              isDuplicate={isDuplicateName}
              isTooShort={isNameTooShort}
            />
            <NameSuggestions
              query={form.habitName}
              onPick={(emoji, name) => {
                form.setHabitName(name);
                form.setSelectedEmoji(emoji);
              }}
            />
            <EmojiPicker emojis={EMOJIS} selectedEmoji={form.selectedEmoji} onSelect={form.setSelectedEmoji} />
            <ColorPickerSection
              colors={COLORS}
              selectedColor={form.selectedColor}
              onSelectColor={form.setSelectedColor}
              onCustomPress={form.openColorPicker}
            />
            <ReminderSection
              remindersEnabled={form.remindersEnabled}
              onToggle={form.setRemindersEnabled}
              reminderTime={form.reminderTime}
              onTimePress={() => form.setShowTimePicker(true)}
              reminderSound={form.reminderSound}
              onQuickTimeSelect={form.setReminderTime}
            />
          </ScrollView>
          <TemplateReminderPrompt
            visible={template.shouldShowTemplateReminder}
            bottomOffset={template.reminderBottomOffset}
            onPress={template.handleReminderPress}
          />
          <StickyCreateBar disabled={!canSubmit} onPress={handleAttemptCreate} />
          {form.showTimePicker && (
            <DateTimePicker
              display='spinner'
              is24Hour={false}
              mode='time'
              value={form.reminderTime}
              onChange={(_event, selected) => {
                form.setShowTimePicker(false);
                if (selected) {
                  triggerSelection();
                  form.setReminderTime(selected);
                }
              }}
            />
          )}
        </View>
      </View>
      <ColorPickerSheet
        presetColors={COLORS}
        value={form.selectedColor}
        visible={form.isColorPickerVisible}
        onClose={form.closeColorPicker}
        onSelect={form.setSelectedColor}
      />
      <TemplateScienceModal
        template={science.template}
        visible={science.isVisible}
        onClose={science.close}
        onUseTemplate={science.useTemplate}
      />
    </Modal>
  );
}
