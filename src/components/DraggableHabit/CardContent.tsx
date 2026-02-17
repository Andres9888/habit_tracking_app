/**
 * CardContent — The main content area inside DraggableHabitCard.
 *
 * Layout (top to bottom):
 * 1. {@link CardHeader} — icon, title, phase tag, best-streak subtitle
 * 2. {@link NewRecordBadge} — conditional "New Personal Record!" banner
 * 3. {@link StrengthProgressBar} or a thin divider line
 * 4. {@link HabitChainVisualizer} — 7-day dot chain with toggle
 * 5. {@link WeekCompleteIndicator} — "✨ Perfect Week ✨" badge
 */

import React from 'react';
import { View } from 'react-native';
import { HabitChainVisualizer } from '../HabitChainVisualizer';
import { useThemeColors } from '../../theme/ThemeContext';
import { CardHeader } from './CardHeader';
import { FrequencyBadge } from '../HabitCard/components/FrequencyBadge';
import { NewRecordBadge } from './NewRecordBadge';
import { StrengthProgressBar } from './StrengthProgressBar';
import { WeekCompleteIndicator } from './WeekCompleteIndicator';
import type { DraggableHabitCardProps } from './DraggableHabitCard.types';

interface CardContentProps extends DraggableHabitCardProps {
  effectiveAccentColor: string;
}

export function CardContent(props: CardContentProps) {
  const { colors: themeColors } = useThemeColors();
  return (
    <>
      <View className='pt-4'>
        <CardHeader
          accentColor={props.accentColor}
          bestStreak={props.bestStreak}
          colors={props.colors}
          emoji={props.emoji}
          habit={props.habit}
          highContrastMode={props.highContrastMode}
          iconPulse={props.iconPulse}
          name={props.name}
          showHabitStrengthPercentage={props.showHabitStrengthPercentage}
          streak={props.streak}
        />
        <View className='px-4'>
          <FrequencyBadge
            daysOfWeek={props.habit.daysOfWeek}
            frequency={props.habit.frequency}
          />
        </View>
        {props.showNewRecord && (
          <NewRecordBadge
            newRecordOpacity={props.newRecordOpacity}
            newRecordScale={props.newRecordScale}
          />
        )}
        {props.showHabitStrengthPercentage ? (
          <StrengthProgressBar
            progressAnimatedStyle={props.progressAnimatedStyle}
            strengthEmojiAnimatedStyle={props.strengthEmojiAnimatedStyle}
            strengthPercent={props.strengthPercent}
          />
        ) : (
          <View
            className='mx-3 mb-3 h-[1.5px] rounded-full'
            style={{ backgroundColor: themeColors.gray[200] }}
          />
        )}
      </View>
      <View className='px-3 pb-5'>
        <HabitChainVisualizer
          accentColor={props.accentColor}
          celebrationsEnabled={props.celebrationsEnabled}
          completionIcon={props.completionIcon}
          currentStreak={props.streak}
          habitId={props.habit._id}
          highContrastMode={props.highContrastMode}
          isConnectedToNextWeek={props.isConnectedToNextWeek}
          isConnectedToPreviousWeek={props.isConnectedToPreviousWeek}
          reduceMotionPreference={props.reduceMotionPreference}
          shape={props.dayShape}
          showConnectors={props.showConnectors}
          weekDateStrings={props.weekDateStrings}
          weekStatus={props.weekStatus}
          onToggle={props.toggleHabit}
          onWeekComplete={({ completedDate }) =>
            props.onWeekComplete?.({ completedDate, habit: props.habit })
          }
        />
        {props.isWeekComplete && (
          <WeekCompleteIndicator accentColor={props.effectiveAccentColor} />
        )}
      </View>
    </>
  );
}
