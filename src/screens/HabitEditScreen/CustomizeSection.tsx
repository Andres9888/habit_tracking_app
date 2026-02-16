/**
 * CustomizeSection Component
 *
 * Visual customization options for a habit including:
 * - Emoji icon picker
 * - Accent color selection
 * - Habit frequency
 * - Reminder scheduling
 */

import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { EmojiPicker } from '../../components/CreateHabitModal/components/EmojiPicker';
import { ColorPickerSection } from '../../components/CreateHabitModal/components/ColorPickerSection';
import { EnhancedReminderSelector } from '../../components/CreateHabitModal/components/EnhancedReminderSelector';
import { FrequencyPicker } from '../../components/CreateHabitModal/components/FrequencyPicker';
import { HABIT_COLORS } from '../../components/CreateHabitModal/constants';
import type { FrequencyType } from '../../components/CreateHabitModal/components/FrequencyPicker';

const entrance = (delay: number) => FadeInUp.delay(delay).springify().damping(18);

interface CustomizeSectionProps {
  customDays?: number[];
  frequencyCount?: number;
  frequency: FrequencyType;
  habitName: string;
  selectedColor: string;
  selectedEmoji: string | null;
  remindersEnabled: boolean;
  reminderTime: Date;
  onColorSelect: (color: string) => void;
  onCustomDaysChange: (days: number[]) => void;
  onEmojiSelect: (emoji: string | null) => void;
  onFrequencyChange: (frequency: FrequencyType, count?: number, days?: number[]) => void;
  onFrequencyCountChange: (count: number) => void;
  onReminderTimeChange: (time: Date) => void;
  onReminderToggle: (enabled: boolean) => void;
}

export function CustomizeSection({
  customDays = [1, 2, 3, 4, 5],
  frequency,
  frequencyCount = 3,
  habitName,
  remindersEnabled,
  reminderTime,
  selectedColor,
  selectedEmoji,
  onColorSelect,
  onCustomDaysChange,
  onEmojiSelect,
  onFrequencyChange,
  onFrequencyCountChange,
  onReminderTimeChange,
  onReminderToggle,
}: CustomizeSectionProps) {
  return (
    <View className='flex-1 space-y-6'>
      <EmojiPicker
        hideLabel
        habitName={habitName}
        selectedEmoji={selectedEmoji}
        onSelect={onEmojiSelect}
      />


      <Animated.View entering={entrance(60)}>
        <ColorPickerSection
          hideLabel
          colors={HABIT_COLORS}
          selectedColor={selectedColor}
          onSelectColor={onColorSelect}
        />
      </Animated.View>

      <FrequencyPicker
        value={frequency}
        frequencyCount={frequencyCount}
        customDays={customDays}
        onChange={(freq, count, days) => {
          onFrequencyChange(freq, count, days);
          if (count !== undefined) onFrequencyCountChange(count);
          if (days !== undefined) onCustomDaysChange(days);
        }}
      />

      <EnhancedReminderSelector
        enabled={remindersEnabled}
        reminderTime={reminderTime}
        onTimeChange={onReminderTimeChange}
        onToggle={onReminderToggle}
      />

    </View>
  );
}
