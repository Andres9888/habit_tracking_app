import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Modal, ScrollView, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HABIT_COLORS } from './constants';
import type { CreateHabitModalProps } from './types';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { useKeyboardState } from './hooks/useKeyboardState';
import { ModalHeader } from './components/ModalHeader';
import { InlineEmojiInput } from './components/InlineEmojiInput';
import {
  SuggestionChips,
  type SuggestionChip,
} from './components/SuggestionChips';
import { AISuggestionChips } from './components/AISuggestionChips';
import { StyleSection } from './components/StyleSection';
import { SimpleReminderSection } from './components/SimpleReminderSection';
import { StickyCreateBar } from './components/StickyCreateBar';
import { PhaseSelector } from './components/PhaseSelector';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import { formatReminderTime } from '../../utils/notifications';
import { EmojiPickerSheet } from '../EmojiPickerV2';

// Smart emoji suggestions based on habit name
const getSuggestedEmojis = (habitName: string): string[] => {
  const q = habitName.toLowerCase();

  if (q.includes('read') || q.includes('book')) return ['📖', '📚', '📰', '📝'];
  if (q.includes('meditat') || q.includes('mindful') || q.includes('calm'))
    return ['🧘', '🙏', '😌', '💭'];
  if (q.includes('run') || q.includes('jog')) return ['🏃', '👟', '🏃‍♀️', '💨'];
  if (q.includes('walk') || q.includes('step')) return ['🚶', '👣', '🚶‍♀️', '🌳'];
  if (q.includes('water') || q.includes('drink') || q.includes('hydrat'))
    return ['💧', '🥤', '🚰', '💦'];
  if (
    q.includes('workout') ||
    q.includes('gym') ||
    q.includes('exercise') ||
    q.includes('lift')
  )
    return ['💪', '🏋️', '🏋️‍♀️', '⚡'];
  if (q.includes('sleep') || q.includes('bed')) return ['😴', '🛏️', '🌙', '💤'];
  if (q.includes('journal') || q.includes('write') || q.includes('diary'))
    return ['📝', '✍️', '📓', '🖊️'];
  if (q.includes('grateful') || q.includes('gratitude') || q.includes('thank'))
    return ['🙏', '💝', '✨', '🌟'];
  if (q.includes('healthy') || q.includes('eat') || q.includes('food'))
    return ['🍎', '🥗', '🥑', '🍊'];
  if (q.includes('vitamin') || q.includes('supplement'))
    return ['💊', '🍊', '💉', '🩺'];
  if (q.includes('stretch') || q.includes('yoga'))
    return ['🧘', '🤸', '🙆', '🧘‍♀️'];
  if (q.includes('bike') || q.includes('cycle'))
    return ['🚴', '🚲', '🚴‍♀️', '🏔️'];
  if (q.includes('clean') || q.includes('tidy') || q.includes('organiz'))
    return ['🧹', '🧼', '✨', '🏠'];
  if (q.includes('phone') || q.includes('screen') || q.includes('digital'))
    return ['📱', '📵', '🔇', '⏰'];
  if (q.includes('study') || q.includes('learn'))
    return ['📚', '🎓', '🧠', '💡'];
  if (
    q.includes('music') ||
    q.includes('instrument') ||
    q.includes('guitar') ||
    q.includes('piano')
  )
    return ['🎸', '🎹', '🎵', '🎶'];
  if (
    q.includes('creative') ||
    q.includes('art') ||
    q.includes('draw') ||
    q.includes('paint')
  )
    return ['🎨', '✏️', '🖌️', '🖼️'];
  if (q.includes('coffee')) return ['☕', '🫖', '☕', '🌅'];
  if (q.includes('morning') || q.includes('wake'))
    return ['🌅', '☀️', '⏰', '🌄'];
  if (q.includes('evening') || q.includes('night'))
    return ['🌙', '🌃', '✨', '🌟'];

  return [];
};

// Debounce hook for auto-scroll
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function CreateHabitModalV2(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, handleCreate } = useCreateHabitModal(props);
  const { triggerSelection } = useHapticFeedback();
  const { isKeyboardVisible } = useKeyboardState();

  const scrollViewRef = useRef<ScrollView>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Debounced habit name for auto-scroll trigger
  const debouncedHabitName = useDebounce(form.habitName, 300);

  // Get suggested emojis based on habit name
  const suggestedEmojis = getSuggestedEmojis(form.habitName);

  // Progressive disclosure: sections disabled until name entered
  const isSectionsEnabled = form.habitName.trim().length > 0;

  // Show suggestion chips when input is empty or has less than 3 chars
  const showSuggestionChips = form.habitName.trim().length < 3;

  // Show AI suggestions when typing (3+ chars)
  const showAISuggestions = form.habitName.trim().length >= 3;

  // Auto-scroll to Style section when user types valid name (5+ chars)
  useEffect(() => {
    if (
      debouncedHabitName.length >= 5 &&
      isKeyboardVisible &&
      scrollViewRef.current
    ) {
      scrollViewRef.current.scrollTo({ animated: true, y: 100 });
    }
  }, [debouncedHabitName, isKeyboardVisible]);

  // Handle suggestion chip selection
  const handleSuggestionSelect = useCallback(
    (chip: SuggestionChip) => {
      form.setHabitName(chip.name);
      form.setSelectedEmoji(chip.emoji);
      form.setSelectedColor(chip.color);
      triggerSelection();
      Keyboard.dismiss();
    },
    [form, triggerSelection]
  );

  // Handle AI suggestion append
  const handleAIAppend = useCallback(
    (suggestion: string) => {
      const currentName = form.habitName.trim();
      const separator = currentName.endsWith(' ') ? '' : ' ';
      form.setHabitName(`${currentName}${separator}${suggestion}`);
    },
    [form]
  );

  // Handle emoji picker open
  const handleEmojiPress = useCallback(() => {
    setShowEmojiPicker(true);
  }, []);

  // Handle emoji selection
  const handleEmojiSelect = useCallback(
    (emoji: string | null) => {
      form.setSelectedEmoji(emoji);
      setShowEmojiPicker(false);
    },
    [form]
  );

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    // Could track focus state if needed
  }, []);

  // Handle keyboard dismiss
  const handleDismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-black/50'>
        <View className='mt-12 flex-1 overflow-hidden rounded-t-3xl bg-stone-50 shadow-2xl'>
          {/* Header with keyboard-aware Done button */}
          <ModalHeader
            habitName={form.habitName}
            isEditMode={isEditMode}
            isKeyboardVisible={isKeyboardVisible}
            onClose={onClose}
            onDismissKeyboard={handleDismissKeyboard}
            onSave={handleCreate}
          />

          {/* Scrollable Content */}
          <ScrollView
            ref={scrollViewRef}
            className='flex-1 px-4'
            contentContainerStyle={{ paddingBottom: 160, paddingTop: 16 }}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            {/* 1. Inline Emoji + Name Input */}
            <InlineEmojiInput
              autoFocus={visible && !isEditMode}
              color={form.selectedColor}
              emoji={form.selectedEmoji}
              value={form.habitName}
              onChange={form.setHabitName}
              onEmojiPress={handleEmojiPress}
              onFocus={handleInputFocus}
            />

            {/* 2. Suggestion Chips (visible when input empty or short) */}
            <SuggestionChips
              visible={showSuggestionChips}
              onSelect={handleSuggestionSelect}
            />

            {/* 3. AI Suggestion Chips (visible when typing 3+ chars) */}
            <AISuggestionChips
              input={form.habitName}
              visible={showAISuggestions}
              onAppend={handleAIAppend}
            />

            {/* 4. Style Section (Color only - emoji is in input prefix) */}
            <StyleSection
              colors={HABIT_COLORS}
              disabled={!isSectionsEnabled}
              selectedColor={form.selectedColor}
              onSelectColor={form.setSelectedColor}
            />

            {/* 5. Reminder Section - muted until name entered */}
            <SimpleReminderSection
              disabled={!isSectionsEnabled}
              remindersEnabled={form.remindersEnabled}
              reminderTime={form.reminderTime}
              onQuickTimeSelect={form.setReminderTime}
              onTimePress={() => form.setShowTimePicker(true)}
              onToggle={form.setRemindersEnabled}
            />

            {/* 6. Phase Selector */}
            <PhaseSelector
              selectedPhase={form.dayPhase}
              onSelect={form.setDayPhase}
            />
          </ScrollView>

          {/* Sticky Create Bar */}
          <StickyCreateBar
            disabled={form.habitName.trim().length === 0}
            onPress={handleCreate}
          />

          {/* Time Picker */}
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

          {/* Full Emoji Picker Modal */}
          <EmojiPickerSheet
            habitName={form.habitName}
            selectedEmoji={form.selectedEmoji}
            visible={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onSelect={handleEmojiSelect}
          />
        </View>
      </View>
    </Modal>
  );
}
