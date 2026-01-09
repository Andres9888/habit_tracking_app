import { ScrollView, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { HabitNameField } from './HabitNameField';
import { LivePreview } from './LivePreview';
import { EmojiPicker } from './EmojiPicker';
import { ColorPickerSection } from './ColorPickerSection';
import { EnhancedReminderSelector } from './EnhancedReminderSelector';
import { HABIT_COLORS } from '../constants';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const ANIMATION_STAGGER_DELAY = 50;
const ANIMATION_DURATION = 300;

interface ModalContentProps {
  isEditMode: boolean;
  visible: boolean;
  // Form state
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  reminderOption: string;
  reminderTime: Date;
  // Form handlers
  onNameChange: (value: string) => void;
  onEmojiSelect: (emoji: string | null) => void;
  onColorSelect: (color: string) => void;
  onReminderToggle: (enabled: boolean) => void;
  onReminderTimeChange: (time: Date) => void;
  onCustomColorPress: () => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function ModalContent({
  isEditMode,
  visible,
  habitName,
  selectedEmoji,
  selectedColor,
  reminderOption,
  reminderTime,
  onNameChange,
  onEmojiSelect,
  onColorSelect,
  onReminderToggle,
  onReminderTimeChange,
  onCustomColorPress,
  onScroll,
}: ModalContentProps) {
  return (
    <ScrollView
      className='flex-1 px-4'
      contentContainerStyle={{ paddingBottom: isEditMode ? 32 : 160 }}
      keyboardShouldPersistTaps='handled'
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
    >
      <Animated.View entering={FadeInUp.duration(ANIMATION_DURATION).delay(0)}>
        <View className='mt-4' />
        <HabitNameField
          autoFocus={visible && !isEditMode}
          value={habitName}
          onChange={onNameChange}
        />
        <LivePreview
          color={selectedColor}
          emoji={selectedEmoji}
          habitName={habitName}
        />
      </Animated.View>
      <Animated.View
        entering={FadeInUp.duration(ANIMATION_DURATION).delay(
          ANIMATION_STAGGER_DELAY
        )}
      >
        <EmojiPicker
          habitName={habitName}
          selectedEmoji={selectedEmoji}
          onSelect={onEmojiSelect}
        />
      </Animated.View>
      <Animated.View
        entering={FadeInUp.duration(ANIMATION_DURATION).delay(
          ANIMATION_STAGGER_DELAY * 2
        )}
      >
        <ColorPickerSection
          colors={HABIT_COLORS}
          selectedColor={selectedColor}
          onCustomPress={onCustomColorPress}
          onSelectColor={onColorSelect}
        />
      </Animated.View>
      <Animated.View
        entering={FadeInUp.duration(ANIMATION_DURATION).delay(
          ANIMATION_STAGGER_DELAY * 3
        )}
      >
        <EnhancedReminderSelector
          enabled={reminderOption !== 'none'}
          reminderTime={reminderTime}
          onTimeChange={onReminderTimeChange}
          onToggle={onReminderToggle}
        />
      </Animated.View>
    </ScrollView>
  );
}
