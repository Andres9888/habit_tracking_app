/**
 * CustomizeSection Component
 *
 * Visual customization options for a habit including:
 * - Emoji icon picker
 * - Accent color selection
 * - Reminder scheduling
 */

import { View } from 'react-native';
import { EmojiPicker } from '../../components/CreateHabitModal/components/EmojiPicker';
import { ColorPickerSection } from '../../components/CreateHabitModal/components/ColorPickerSection';
import { EnhancedReminderSelector } from '../../components/CreateHabitModal/components/EnhancedReminderSelector';
import { HABIT_COLORS } from '../../components/CreateHabitModal/constants';

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
  /** Whether user has premium access */
  isPremium?: boolean;
  /** Called when non-premium user taps the locked reminder toggle */
  onPremiumUpsell?: () => void;
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
  isPremium,
  onPremiumUpsell,
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

      <EnhancedReminderSelector
        enabled={remindersEnabled}
        isPremium={isPremium}
        reminderTime={reminderTime}
        onPremiumUpsell={onPremiumUpsell}
        onTimeChange={onReminderTimeChange}
        onToggle={onReminderToggle}
      />
    </View>
  );
}
