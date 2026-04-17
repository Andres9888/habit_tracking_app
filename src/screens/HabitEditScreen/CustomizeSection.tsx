/**
 * CustomizeSection Component
 *
 * Visual customization options for a habit including:
 * - Emoji icon picker
 * - Accent color selection
 * - Reminder scheduling
 */

import { Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { EmojiPicker } from '../../components/CreateHabitModal/components/EmojiPicker';
import { ColorPickerSection } from '../../components/CreateHabitModal/components/ColorPickerSection';
import { EnhancedReminderSelector } from '../../components/CreateHabitModal/components/EnhancedReminderSelector';
import { HABIT_COLORS } from '../../components/CreateHabitModal/constants';
import { AdvancedAlgorithmDisclosure } from '../../components/AlgorithmPicker';
import { ProgressEmojiPicker } from '../../components/ProgressEmojiPicker';
import { useUserDefaultProgressEmojis } from '../../hooks/useProgressEmojis';
import { useThemeColors } from '../../theme/ThemeContext';
import { fontWeights, typography } from '../../theme/typography';
import type { ProgressEmojiSet } from '../../utils/progressEmojis';

const entrance = (delay: number) =>
  FadeInUp.delay(delay).springify().damping(18);

interface CustomizeSectionProps {
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  remindersEnabled: boolean;
  reminderTime: Date;
  strengthAlgorithm: 'forgiving' | 'balanced' | 'strict';
  progressEmojis: ProgressEmojiSet | undefined;
  onEmojiSelect: (emoji: string | null) => void;
  onColorSelect: (color: string) => void;
  onReminderToggle: (enabled: boolean) => void;
  onReminderTimeChange: (time: Date) => void;
  onStrengthAlgorithmChange: (
    mode: 'forgiving' | 'balanced' | 'strict'
  ) => void;
  onProgressEmojisChange: (next: ProgressEmojiSet | undefined) => void;
}

export function CustomizeSection({
  habitName,
  selectedEmoji,
  selectedColor,
  remindersEnabled,
  reminderTime,
  onEmojiSelect,
  onColorSelect,
  strengthAlgorithm,
  progressEmojis,
  onReminderToggle,
  onReminderTimeChange,
  onStrengthAlgorithmChange,
  onProgressEmojisChange,
}: CustomizeSectionProps) {
  const { colors: themeColors } = useThemeColors();
  const userDefaultEmojis = useUserDefaultProgressEmojis();

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

      <Animated.View entering={entrance(0)}>
        <EmojiPicker
          hideLabel
          habitName={habitName}
          selectedEmoji={selectedEmoji}
          onSelect={onEmojiSelect}
        />
      </Animated.View>

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

      <Animated.View entering={entrance(60)}>
        <ColorPickerSection
          hideLabel
          colors={HABIT_COLORS}
          selectedColor={selectedColor}
          onSelectColor={onColorSelect}
        />
      </Animated.View>

      <Animated.View className='mt-4' entering={entrance(90)}>
        <ProgressEmojiPicker
          fallback={userDefaultEmojis}
          label='Growth icons'
          value={progressEmojis}
          onChange={onProgressEmojisChange}
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

      <Animated.View className='mt-4' entering={entrance(180)}>
        <AdvancedAlgorithmDisclosure
          selected={strengthAlgorithm}
          onSelect={onStrengthAlgorithmChange}
        />
      </Animated.View>
    </View>
  );
}
