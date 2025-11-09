import { Modal, ScrollView, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ColorPickerSheet } from './ColorPickerSheet';
import TemplateScienceModal from '../TemplateScienceModal';
import { COLORS, EMOJIS } from './constants';
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

export default function CreateHabitModal(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, template, science, handleCreate } = useCreateHabitModal(props);
  const { triggerSelection } = useHapticFeedback();

  return (
    <Modal transparent animationType='slide' visible={visible} onRequestClose={onClose}>
      <View className='flex-1 bg-black/50'>
        <View className='mt-12 flex-1 overflow-hidden rounded-t-3xl bg-[#f8f5f1] shadow-2xl'>
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
            <TemplateBrowser isEditMode={isEditMode} template={template} onViewScience={science.open} />
            <HabitPreview
              habitName={form.habitName}
              selectedEmoji={form.selectedEmoji}
              selectedColor={form.selectedColor}
              frequencyLabel={form.frequency}
            />
            <HabitNameField value={form.habitName} onChange={form.setHabitName} autoFocus={visible && !isEditMode} />
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
          <StickyCreateBar
            disabled={!form.habitName.trim().length}
            onPress={handleCreate}
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
