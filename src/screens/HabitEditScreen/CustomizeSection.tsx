/**
 * CustomizeSection Component
 *
 * Visual customization options for a habit:
 * - Emoji icon picker
 * - Accent color selection
 * - Daily reminder scheduling
 */

import type { RefObject } from 'react';
import { Text, View } from 'react-native';
import { EmojiPicker } from '../../components/CreateHabitModal/components/EmojiPicker';
import { ColorPickerSection } from '../../components/CreateHabitModal/components/ColorPickerSection';
import { EnhancedReminderSelector } from '../../components/CreateHabitModal/components/EnhancedReminderSelector';
import { HABIT_COLORS } from '../../components/CreateHabitModal/constants';
import { useThemeColors } from '../../theme/ThemeContext';
import { fontWeights, typography } from '../../theme/typography';

interface CustomizeSectionProps {
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  remindersEnabled: boolean;
  reminderTime: Date;
  reminderSectionRef?: RefObject<View | null>;
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
  reminderSectionRef,
  onEmojiSelect,
  onColorSelect,
  onReminderToggle,
  onReminderTimeChange,
}: CustomizeSectionProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='flex-1'>
      <Text
        className='mb-3 text-center uppercase'
        style={{
          ...typography.caption,
          fontWeight: fontWeights.semibold,
          letterSpacing: 0.5,
          color: themeColors.text.tertiary,
        }}
      >
        Choose an icon
      </Text>

      <EmojiPicker
        hideLabel
        habitName={habitName}
        selectedEmoji={selectedEmoji}
        onSelect={onEmojiSelect}
      />

      <Text
        className='mb-3 mt-4 text-center uppercase'
        style={{
          ...typography.caption,
          fontWeight: fontWeights.semibold,
          letterSpacing: 0.5,
          color: themeColors.text.tertiary,
        }}
      >
        Pick a color
      </Text>

      <ColorPickerSection
        hideLabel
        colors={HABIT_COLORS}
        selectedColor={selectedColor}
        onSelectColor={onColorSelect}
      />

      <View ref={reminderSectionRef} collapsable={false}>
        <EnhancedReminderSelector
          enabled={remindersEnabled}
          reminderTime={reminderTime}
          onTimeChange={onReminderTimeChange}
          onToggle={onReminderToggle}
        />
      </View>
    </View>
  );
}
