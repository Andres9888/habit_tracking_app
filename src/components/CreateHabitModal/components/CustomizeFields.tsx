/**
 * CustomizeFields - icon, color and reminder controls shared by Add and Edit.
 * Rendered inside the shared habit form body, below the name input.
 */

import type { RefObject } from 'react';
import { Text, View } from 'react-native';
import type { View as ViewType } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';
import { EmojiPicker } from './EmojiPicker';
import { ColorPickerSection } from './ColorPickerSection';
import { EnhancedReminderSelector } from './EnhancedReminderSelector';

const labelStyle = {
  ...typography.caption,
  fontWeight: fontWeights.semibold,
  letterSpacing: 0.5,
};

interface CustomizeFieldsProps {
  emojiQueryName: string;
  isEmojiLocked: boolean;
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string | null) => void;
  colors: readonly string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  reminderEnabled: boolean;
  reminderTime: Date;
  onReminderToggle: (enabled: boolean) => void;
  onReminderTimeChange: (time: Date) => void;
  /** Create-flow only — see EnhancedReminderSelectorProps. */
  snapReminderDefaultToPreset?: boolean;
  reminderSectionRef?: RefObject<ViewType | null>;
}

// eslint-disable-next-line max-lines-per-function
export function CustomizeFields({
  emojiQueryName,
  isEmojiLocked,
  selectedEmoji,
  onEmojiSelect,
  colors,
  selectedColor,
  onColorSelect,
  reminderEnabled,
  reminderTime,
  onReminderToggle,
  onReminderTimeChange,
  snapReminderDefaultToPreset = false,
  reminderSectionRef,
}: CustomizeFieldsProps) {
  const { colors: themeColors } = useThemeColors();
  const labelColor = { color: themeColors.text.tertiary };

  return (
    <View className='px-6'>
      <Text className='mb-3 text-center uppercase' style={{ ...labelStyle, ...labelColor }}>
        Choose an icon
      </Text>

      <EmojiPicker
        hideLabel
        habitName={emojiQueryName}
        isLocked={isEmojiLocked}
        selectedEmoji={selectedEmoji}
        onSelect={onEmojiSelect}
      />

      <Text className='mt-2 mb-3 text-center uppercase' style={{ ...labelStyle, ...labelColor }}>
        Pick a color
      </Text>

      <ColorPickerSection
        hideLabel
        colors={colors}
        selectedColor={selectedColor}
        onSelectColor={onColorSelect}
      />

      <View ref={reminderSectionRef} collapsable={false}>
        <EnhancedReminderSelector
          enabled={reminderEnabled}
          reminderTime={reminderTime}
          snapDefaultToPresetOnEnable={snapReminderDefaultToPreset}
          onTimeChange={onReminderTimeChange}
          onToggle={onReminderToggle}
        />
      </View>
    </View>
  );
}
