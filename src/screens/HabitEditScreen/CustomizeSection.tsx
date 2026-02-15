/**
 * CustomizeSection Component
 *
 * Visual customization options for a habit including:
 * - Emoji icon picker
 * - Accent color selection
 * - Reminder scheduling
 */

import { View } from 'react-native';

import Animated, { FadeInUp } from 'react-native-reanimated';

import { ColorPickerSection } from '../../components/CreateHabitModal/components/ColorPickerSection';
import { EmojiPicker } from '../../components/CreateHabitModal/components/EmojiPicker';
import { EnhancedReminderSelector } from '../../components/CreateHabitModal/components/EnhancedReminderSelector';
import { HABIT_COLORS } from '../../components/CreateHabitModal/constants';

const entrance = (delay: number) => FadeInUp.delay(delay).springify().damping(18);

interface CustomizeSectionProps {
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  remindersEnabled: boolean;
  reminderTime: Date;
  onEmojiSelect: (emoji: string | null) => void;
  onColorSelect: (color: string) => void;
  onReminderToggle: (enabled: boolean) => void;
  onReminderTimeChange: (time: Date) => void;
}

export function CustomizeSection({
  habitName,
  selectedEmoji,
  selectedColor,
  remindersEnabled,
  reminderTime,
  onEmojiSelect,
  onColorSelect,
  onReminderToggle,
  onReminderTimeChange,
}: CustomizeSectionProps) {
  return (
    <View className='flex-1'>
      <Animated.View entering={entrance(0)}>
        <EmojiPicker
          hideLabel
          habitName={habitName}
          selectedEmoji={selectedEmoji}
          onSelect={onEmojiSelect}
        />
      </Animated.View>

      <Animated.View entering={entrance(60)}>
        <ColorPickerSection
          hideLabel
          colors={HABIT_COLORS}
          selectedColor={selectedColor}
          onSelectColor={onColorSelect}
        />
      </Animated.View>

      <Animated.View entering={entrance(120)}>
        <EnhancedReminderSelector
          enabled={remindersEnabled}
          reminderTime={reminderTime}
          onTimeChange={onReminderTimeChange}
          onToggle={onReminderToggle}
        />
      </Animated.View>
    </View>
  );
}
