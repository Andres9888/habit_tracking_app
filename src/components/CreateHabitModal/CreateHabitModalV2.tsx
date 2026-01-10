import { useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';

import useHapticFeedback from '../../hooks/useHapticFeedback';
import { EmojiPickerSheet } from '../EmojiPickerV2';
import { AISuggestionChips } from './components/AISuggestionChips';
import { InlineEmojiInput } from './components/InlineEmojiInput';
import { ModalHeader } from './components/ModalHeader';
import { PhaseSelector } from './components/PhaseSelector';
import { SimpleReminderSection } from './components/SimpleReminderSection';
import { StickyCreateBar } from './components/StickyCreateBar';
import { StyleSection } from './components/StyleSection';
import { SuggestionChips } from './components/SuggestionChips';
import { TimePickerSection } from './components/TimePickerSection';
import { HABIT_COLORS } from './constants';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { useDebounce } from './hooks/useDebounce';
import { useKeyboardState } from './hooks/useKeyboardState';
import type { CreateHabitModalProps } from './types';
import { useModalV2Handlers } from './useModalV2Handlers';

export default function CreateHabitModalV2(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, handleCreate } = useCreateHabitModal(props);
  const { triggerSelection } = useHapticFeedback();
  const { isKeyboardVisible } = useKeyboardState();

  const scrollViewRef = useRef<ScrollView>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const debouncedHabitName = useDebounce(form.habitName, 300);
  const isSectionsEnabled = form.habitName.trim().length > 0;
  const showSuggestionChips = form.habitName.trim().length < 3;
  const showAISuggestions = form.habitName.trim().length >= 3;

  const handlers = useModalV2Handlers({ form, setShowEmojiPicker, triggerSelection });

  useEffect(() => {
    if (debouncedHabitName.length >= 5 && isKeyboardVisible && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ animated: true, y: 100 });
    }
  }, [debouncedHabitName, isKeyboardVisible]);

  const handleTimeSelect = (date: Date) => {
    triggerSelection();
    form.setReminderTime(date);
  };

  return (
    <Modal transparent animationType='slide' visible={visible} onRequestClose={onClose}>
      <View className='flex-1 bg-black/50'>
        <View className='mt-12 flex-1 overflow-hidden rounded-t-3xl bg-stone-50 shadow-2xl'>
          <ModalHeader
            habitName={form.habitName}
            isEditMode={isEditMode}
            isKeyboardVisible={isKeyboardVisible}
            onClose={onClose}
            onDismissKeyboard={handlers.handleDismissKeyboard}
            onSave={handleCreate}
          />

          <ScrollView
            ref={scrollViewRef}
            className='flex-1 px-4'
            contentContainerStyle={{ paddingBottom: 160, paddingTop: 16 }}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <InlineEmojiInput
              autoFocus={visible && !isEditMode}
              color={form.selectedColor}
              emoji={form.selectedEmoji}
              value={form.habitName}
              onChange={form.setHabitName}
              onEmojiPress={handlers.handleEmojiPress}
              onFocus={handlers.handleInputFocus}
            />
            <SuggestionChips visible={showSuggestionChips} onSelect={handlers.handleSuggestionSelect} />
            <AISuggestionChips input={form.habitName} visible={showAISuggestions} onAppend={handlers.handleAIAppend} />
            <StyleSection colors={HABIT_COLORS} disabled={!isSectionsEnabled} selectedColor={form.selectedColor} onSelectColor={form.setSelectedColor} />
            <SimpleReminderSection disabled={!isSectionsEnabled} reminderTime={form.reminderTime} remindersEnabled={form.remindersEnabled} onQuickTimeSelect={form.setReminderTime} onTimePress={() => form.setShowTimePicker(true)} onToggle={form.setRemindersEnabled} />
            <PhaseSelector selectedPhase={form.dayPhase} onSelect={form.setDayPhase} />
          </ScrollView>

          <StickyCreateBar disabled={form.habitName.trim().length === 0} onPress={handleCreate} />
          <TimePickerSection visible={form.showTimePicker} value={form.reminderTime} onClose={() => form.setShowTimePicker(false)} onSelect={handleTimeSelect} />
          <EmojiPickerSheet habitName={form.habitName} selectedEmoji={form.selectedEmoji} visible={showEmojiPicker} onClose={() => setShowEmojiPicker(false)} onSelect={handlers.handleEmojiSelect} />
        </View>
      </View>
    </Modal>
  );
}
