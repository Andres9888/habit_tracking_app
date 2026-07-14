/**
 * Icon/color/reminder pickers, advanced options and template info
 */

import React from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { EmojiPicker } from '../../../../components/CreateHabitModal/components/EmojiPicker';
import { ColorPickerSection } from '../../../../components/CreateHabitModal/components/ColorPickerSection';
import { EnhancedReminderSelector } from '../../../../components/CreateHabitModal/components/EnhancedReminderSelector';
import { HABIT_COLORS } from '../../../../components/CreateHabitModal/constants';
import { AdvancedOptionsSection } from '../../../../components/AdvancedOptions';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { fontWeights, typography } from '../../../../theme/typography';
import { TemplateInfo } from '../TemplateInfo';
import { entrance } from '../constants';
import type { CustomizationSectionsProps } from '../types';

// eslint-disable-next-line max-lines-per-function
export function CustomizationSections({
  template,
  customName,
  customColor,
  customIcon,
  showTimePicker,
  reminderTime,
  strengthAlgorithm,
  progressEmojis,
  streakGoal,
  scrollToEnd,
  onIconSelect,
  onColorSelect,
  onToggleTimePicker,
  onTimeChange,
  onStrengthAlgorithmChange,
  onProgressEmojisChange,
  onStreakGoalChange,
}: CustomizationSectionsProps) {
  const { colors } = useThemeColors();
  const labelStyle = {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.5,
    color: colors.text.tertiary,
  };

  return (
    <>
      <Animated.View className='px-6' entering={entrance(280)}>
        <Text className='mb-3 text-center uppercase' style={labelStyle}>
          Choose an icon
        </Text>
        <Animated.View entering={entrance(0)}>
          <EmojiPicker
            hideLabel
            habitName={customName}
            selectedEmoji={customIcon}
            onSelect={onIconSelect}
          />
        </Animated.View>

        <Text className='mb-3 mt-4 text-center uppercase' style={labelStyle}>
          Pick a color
        </Text>
        <Animated.View entering={entrance(60)}>
          <ColorPickerSection
            hideLabel
            colors={HABIT_COLORS}
            selectedColor={customColor}
            onSelectColor={onColorSelect}
          />
        </Animated.View>

        <Animated.View entering={entrance(120)}>
          <EnhancedReminderSelector
            enabled={showTimePicker}
            reminderTime={reminderTime}
            onTimeChange={onTimeChange}
            onToggle={onToggleTimePicker}
          />
        </Animated.View>
      </Animated.View>

      {/*
        Templates with estimatedMinutes carry an explicit curve default
        (useTemplatePreview derives it via algorithmForMinutes) — treat that as
        authored and never auto-apply the growthType suggestion over it. Only
        when the template has no duration is the initial curve a generic
        fallback, so the habit-type suggestion may take over.
      */}
      <AdvancedOptionsSection
        growthType={template.growthType}
        isNewHabit={typeof template.estimatedMinutes !== 'number'}
        progressEmojis={progressEmojis}
        streakGoal={streakGoal}
        strengthAlgorithm={strengthAlgorithm}
        onExpand={scrollToEnd}
        onProgressEmojisChange={onProgressEmojisChange}
        onStreakGoalChange={onStreakGoalChange}
        onStrengthAlgorithmChange={onStrengthAlgorithmChange}
      />

      <Animated.View className='mt-4 px-6' entering={entrance(460)}>
        <TemplateInfo
          category={template.category}
          frequency={template.frequency}
        />
      </Animated.View>
    </>
  );
}
