import { memo, useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { NameInputSection } from './NameInputSection';
import { EmojiPicker } from './EmojiPicker';
import { ColorPickerSection } from './ColorPickerSection';
import { EnhancedReminderSelector } from './EnhancedReminderSelector';
import { AdvancedOptionsSection } from '../../AdvancedOptions';
import type { CreateHabitFormCenteredProps } from './CreateHabitFormCentered.types';

/**
 * Centered habit creation form with optional fields.
 * Follows "identity before behavior" in habit formation psychology.
 */
// eslint-disable-next-line max-lines-per-function
const CreateHabitFormCenteredComponent = ({
  habitName,
  onHabitNameChange,
  selectedEmoji,
  onEmojiSelect,
  colors,
  selectedColor,
  onColorSelect,
  reminderEnabled,
  reminderTime,
  onReminderToggle,
  onReminderTimeChange,
  autoFocus = false,
  showNameError = false,
  strengthAlgorithm,
  onStrengthAlgorithmChange,
  progressEmojis,
  onProgressEmojisChange,
  streakGoal,
  onStreakGoalChange,
  onAdvancedExpand,
  reminderSectionRef,
}: CreateHabitFormCenteredProps) => {
  const { colors: themeColors, isDark } = useThemeColors();
  const [committedHabitName, setCommittedHabitName] = useState(habitName);
  const [isEmojiLocked, setIsEmojiLocked] = useState(selectedEmoji !== null);

  const handleHabitNameBlur = useCallback(() => setCommittedHabitName(habitName), [habitName]);

  const handleEmojiSelect = useCallback((emoji: string | null) => {
    setIsEmojiLocked(emoji !== null);
    onEmojiSelect(emoji);
  }, [onEmojiSelect]);

  return (
    <View className='flex-1'>
      <View className='px-6'>
        <NameInputSection
          autoFocus={autoFocus}
          habitName={habitName}
          isDark={isDark}
          showNameError={showNameError}
          themeColors={themeColors}
          onHabitNameBlur={handleHabitNameBlur}
          onHabitNameChange={onHabitNameChange}
        />

        {/* Optional fields section */}
        <Text
          className='mb-3 text-center text-sm font-semibold uppercase'
          style={{ letterSpacing: 0.5, color: themeColors.text.tertiary }}
        >
          Choose an icon
        </Text>

        <EmojiPicker
          hideLabel
          habitName={committedHabitName}
          isLocked={isEmojiLocked}
          selectedEmoji={selectedEmoji}
          onSelect={handleEmojiSelect}
        />

        <Text
          className='mt-4 mb-3 text-center text-sm font-semibold uppercase'
          style={{ letterSpacing: 0.5, color: themeColors.text.tertiary }}
        >
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
            onTimeChange={onReminderTimeChange}
            onToggle={onReminderToggle}
          />
        </View>
      </View>

      <AdvancedOptionsSection
        progressEmojis={progressEmojis}
        streakGoal={streakGoal}
        strengthAlgorithm={strengthAlgorithm}
        onExpand={onAdvancedExpand}
        onProgressEmojisChange={onProgressEmojisChange}
        onStreakGoalChange={onStreakGoalChange}
        onStrengthAlgorithmChange={onStrengthAlgorithmChange}
      />
    </View>
  );
};

export const CreateHabitFormCentered = memo(CreateHabitFormCenteredComponent);
