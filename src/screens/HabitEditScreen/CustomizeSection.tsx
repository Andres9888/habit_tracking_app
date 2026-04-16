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
import { useThemeColors } from '../../theme/ThemeContext';
import { fontWeights, typography } from '../../theme/typography';

const entrance = (delay: number) => FadeInUp.delay(delay).springify().damping(18);

interface CustomizeSectionProps {
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  remindersEnabled: boolean;
  reminderTime: Date;
  strengthAlgorithm?: string;
  onEmojiSelect: (emoji: string | null) => void;
  onColorSelect: (color: string) => void;
  onReminderToggle: (enabled: boolean) => void;
  onReminderTimeChange: (time: Date) => void;
  onStrengthAlgorithmChange?: (mode: string | undefined) => void;
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
  onReminderToggle,
  onReminderTimeChange,
  onStrengthAlgorithmChange,
}: CustomizeSectionProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='flex-1'>
      <Text
        className='mb-3 text-center uppercase'
        style={{ ...typography.caption, fontWeight: fontWeights.semibold, letterSpacing: 0.5, color: themeColors.text.tertiary }}
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
        className='mt-4 mb-3 text-center uppercase'
        style={{ ...typography.caption, fontWeight: fontWeights.semibold, letterSpacing: 0.5, color: themeColors.text.tertiary }}
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

      <Animated.View entering={entrance(120)}>
        <EnhancedReminderSelector
          enabled={remindersEnabled}
          reminderTime={reminderTime}
          onTimeChange={onReminderTimeChange}
          onToggle={onReminderToggle}
        />
      </Animated.View>

      {onStrengthAlgorithmChange ? (
        <Animated.View className='mt-4' entering={entrance(180)}>
          <AdvancedAlgorithmDisclosure
            selected={strengthAlgorithm}
            onSelect={onStrengthAlgorithmChange}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}
