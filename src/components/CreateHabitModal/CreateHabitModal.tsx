import { useCallback, useEffect, useState } from 'react';
import { Modal, ScrollView, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ColorPickerSheet } from './ColorPickerSheet';
import TemplateScienceModal from '../TemplateScienceModal';
import { COLORS } from './constants';
import type { CreateHabitModalProps } from './types';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { ModalHeader } from './components/ModalHeader';
import { TemplateReminderPrompt } from './components/TemplateReminderPrompt';
import { HabitPreview } from './components/HabitPreview';
import { HabitNameField } from './components/HabitNameField';
import { EmojiPicker } from './components/EmojiPicker';
import { ColorPickerSection } from './components/ColorPickerSection';
import { ReminderSection } from './components/ReminderSection';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import { StickyCreateBar } from './components/StickyCreateBar';
import { QuickPicksRow, type QuickPickTemplate } from './components/QuickPicksRow';
import { TimeOfDaySelector, getReminderTimeForPhase } from './components/TimeOfDaySelector';
import type { HubermanPhase } from '../../constants/hubermanPhases';

export default function CreateHabitModal(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, template, science, handleCreate } = useCreateHabitModal(props);
  const { triggerSelection } = useHapticFeedback();
  const [selectedQuickPickId, setSelectedQuickPickId] = useState<string | null>(null);

  const handleQuickPickSelect = useCallback(
    (quickPick: QuickPickTemplate) => {
      setSelectedQuickPickId(quickPick.id);
      form.setHabitName(quickPick.name);
      form.setSelectedEmoji(quickPick.emoji);
      form.setSelectedColor(quickPick.color);
      form.setDayPhase(quickPick.timeOfDay);
    },
    [form]
  );

  // Clear quick pick selection when user manually modifies any field
  const handleNameChange = useCallback(
    (value: string) => {
      setSelectedQuickPickId(null);
      form.setHabitName(value);
    },
    [form]
  );

  const handleEmojiSelect = useCallback(
    (emoji: string | null) => {
      setSelectedQuickPickId(null);
      form.setSelectedEmoji(emoji);
    },
    [form]
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      setSelectedQuickPickId(null);
      form.setSelectedColor(color);
    },
    [form]
  );

  const handleTimeOfDaySelect = useCallback(
    (phase: HubermanPhase) => {
      setSelectedQuickPickId(null);
      form.setDayPhase(phase);
      // Auto-set reminder time based on selected phase
      const reminderTime = getReminderTimeForPhase(phase);
      form.setReminderTime(reminderTime);
    },
    [form]
  );

  // Reset quick pick selection when modal opens (for new habit creation)
  useEffect(() => {
    if (visible && !isEditMode) {
      setSelectedQuickPickId(null);
    }
  }, [visible, isEditMode]);

  return (
    <Modal transparent animationType='slide' visible={visible} onRequestClose={onClose}>
      <View className='flex-1 bg-black/50'>
        <View className='flex-1 overflow-hidden rounded-t-3xl bg-[#faf9f7] shadow-2xl'>
          <ModalHeader isEditMode={isEditMode} habitName={form.habitName} onClose={onClose} onSave={handleCreate} />
          <ScrollView
            ref={template.scrollViewRef}
            className='flex-1 px-4'
            contentContainerStyle={{ paddingBottom: isEditMode ? 32 : 160 }}
            keyboardShouldPersistTaps='handled'
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onScroll={template.handleMainScroll}
          >
            {/* Quick Picks Section - hidden in edit mode */}
            {!isEditMode && (
              <>
                <View className='mt-3' />
                <QuickPicksRow
                  selectedTemplateId={selectedQuickPickId}
                  onSelectTemplate={handleQuickPickSelect}
                />
                {/* Divider */}
                <View className='mb-4 flex-row items-center'>
                  <View className='h-px flex-1 bg-[#e7e5e4]' />
                  <Text className='mx-4 text-xs font-medium text-[#a8a29e]'>or create your own</Text>
                  <View className='h-px flex-1 bg-[#e7e5e4]' />
                </View>
              </>
            )}
            <HabitPreview
              habitName={form.habitName}
              selectedEmoji={form.selectedEmoji}
              selectedColor={form.selectedColor}
              timeOfDay={form.dayPhase}
            />
            <HabitNameField value={form.habitName} onChange={handleNameChange} autoFocus={visible && !isEditMode} />
            <EmojiPicker
              selectedEmoji={form.selectedEmoji}
              onSelect={handleEmojiSelect}
              habitName={form.habitName}
            />
            <ColorPickerSection
              colors={COLORS}
              selectedColor={form.selectedColor}
              onSelectColor={handleColorSelect}
              onCustomPress={form.openColorPicker}
            />
            <TimeOfDaySelector
              selectedPhase={form.dayPhase}
              onSelectPhase={handleTimeOfDaySelect}
            />
            <ReminderSection
              remindersEnabled={form.remindersEnabled}
              onToggle={form.setRemindersEnabled}
              reminderTime={form.reminderTime}
              onTimePress={() => form.setShowTimePicker(true)}
            />
          </ScrollView>
          <TemplateReminderPrompt
            visible={template.shouldShowTemplateReminder}
            bottomOffset={template.reminderBottomOffset}
            onPress={template.handleReminderPress}
          />
          <StickyCreateBar
            disabled={!form.habitName.trim().length}
            onPress={handleCreate}
            selectedColor={form.selectedColor}
          />
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
