import { memo, useCallback, useState } from 'react';
import { View } from 'react-native';
import { NameInputSection } from './NameInputSection';
import { CustomizeFields } from './CustomizeFields';
import { AdvancedOptionsSection } from '../../AdvancedOptions';
import type { HabitFormBodyProps } from './HabitFormBody.types';

/**
 * Shared habit form body used by both Add (CreateHabitModal) and Edit
 * (HabitEditScreen). Renders name → icon → color → "More to customize" panel
 * (the reminder is row one of that panel).
 * Mode differences (title, placeholder, growth pill) come in as props.
 *
 * NOTE: the two flows feed this body from SEPARATE state hooks — create uses
 * useHabitForm/useCreateHabitModal, edit uses useHabitEditScreen. When adding a
 * new field here, wire it on BOTH paths, or edit will silently render a default
 * and drop the saved value.
 */
// eslint-disable-next-line max-lines-per-function
const HabitFormBodyComponent = ({
  habitName,
  onHabitNameChange,
  onHabitNameBlur,
  title,
  placeholder,
  growthType,
  isNewHabit,
  initialEmojiLocked,
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
  why,
  onWhyChange,
}: HabitFormBodyProps) => {
  const [committedHabitName, setCommittedHabitName] = useState(habitName);
  const [isEmojiLocked, setIsEmojiLocked] = useState(
    initialEmojiLocked ?? selectedEmoji !== null
  );

  const handleHabitNameBlur = useCallback(() => {
    setCommittedHabitName(habitName);
    onHabitNameBlur?.();
  }, [habitName, onHabitNameBlur]);

  const handleEmojiSelect = useCallback(
    (emoji: string | null) => {
      setIsEmojiLocked(emoji !== null);
      onEmojiSelect(emoji);
    },
    [onEmojiSelect]
  );

  return (
    <View className='flex-1'>
      <NameInputSection
        autoFocus={autoFocus}
        habitName={habitName}
        placeholder={placeholder}
        showNameError={showNameError}
        title={title}
        onHabitNameBlur={handleHabitNameBlur}
        onHabitNameChange={onHabitNameChange}
      />

      <CustomizeFields
        colors={colors}
        emojiQueryName={committedHabitName}
        isEmojiLocked={isEmojiLocked}
        selectedColor={selectedColor}
        selectedEmoji={selectedEmoji}
        onColorSelect={onColorSelect}
        onEmojiSelect={handleEmojiSelect}
      />

      <AdvancedOptionsSection
        growthType={growthType}
        habitIcon={selectedEmoji}
        isNewHabit={isNewHabit}
        progressEmojis={progressEmojis}
        reminder={{
          enabled: reminderEnabled,
          onTimeChange: onReminderTimeChange,
          onToggle: onReminderToggle,
          reminderTime,
          sectionRef: reminderSectionRef,
          snapDefaultToPresetOnEnable: snapReminderDefaultToPreset,
        }}
        streakGoal={streakGoal}
        strengthAlgorithm={strengthAlgorithm}
        why={why}
        onExpand={onAdvancedExpand}
        onProgressEmojisChange={onProgressEmojisChange}
        onStreakGoalChange={onStreakGoalChange}
        onStrengthAlgorithmChange={onStrengthAlgorithmChange}
        onWhyChange={onWhyChange}
      />
    </View>
  );
};

export const HabitFormBody = memo(HabitFormBodyComponent);
