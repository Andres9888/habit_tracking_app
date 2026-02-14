/**
 * CustomizeSection Component
 *
 * Visual customization options for a habit including:
 * - Emoji icon picker
 * - Accent color selection
 * - Reminder scheduling
 * - Difficulty selector
 */

import { View } from 'react-native';
import { EmojiPicker } from '../../components/CreateHabitModal/components/EmojiPicker';
import { ColorPickerSection } from '../../components/CreateHabitModal/components/ColorPickerSection';
import { EnhancedReminderSelector } from '../../components/CreateHabitModal/components/EnhancedReminderSelector';
import { DifficultySelector } from '../../components/DifficultySelector';
import { HABIT_COLORS } from '../../components/CreateHabitModal/constants';
import type { HabitDifficulty } from './useHabitEditScreen';

interface CustomizeSectionProps {
  difficulty: HabitDifficulty;
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  remindersEnabled: boolean;
  reminderTime: Date;
  onDifficultyChange: (difficulty: HabitDifficulty) => void;
  onEmojiSelect: (emoji: string | null) => void;
  onColorSelect: (color: string) => void;
  onReminderToggle: (enabled: boolean) => void;
  onReminderTimeChange: (time: Date) => void;
}

export function CustomizeSection({
  difficulty,
  habitName,
  selectedEmoji,
  selectedColor,
  remindersEnabled,
  reminderTime,
  onDifficultyChange,
  onEmojiSelect,
  onColorSelect,
  onReminderToggle,
  onReminderTimeChange,
}: CustomizeSectionProps) {
  return (
    <View className='flex-1'>
      <EmojiPicker
        hideLabel
        habitName={habitName}
        selectedEmoji={selectedEmoji}
        onSelect={onEmojiSelect}
      />

      <ColorPickerSection
        hideLabel
        colors={HABIT_COLORS}
        selectedColor={selectedColor}
        onSelectColor={onColorSelect}
      />

      <DifficultySelector
        difficulty={difficulty}
        onChange={onDifficultyChange}
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
