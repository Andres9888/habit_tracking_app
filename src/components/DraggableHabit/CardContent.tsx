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

import React, { memo } from 'react';
import { View } from 'react-native';
import { HabitChainVisualizer } from '../HabitChainVisualizer';
import { useThemeColors } from '../../theme/ThemeContext';
import { useCardContent } from './CardContent.hooks';
import { CardHeader } from './CardHeader';
import { NewRecordBadge } from './NewRecordBadge';
import { StrengthProgressBar } from './StrengthProgressBar';
import { WeekCompleteIndicator } from './WeekCompleteIndicator';
import type { DraggableHabitCardProps } from './DraggableHabitCard.types';
import {
  CARD_CHAIN_PADDING_RIGHT,
  CARD_HORIZONTAL_PADDING,
} from './cardLayout.constants';

interface CardContentProps extends DraggableHabitCardProps {
  effectiveAccentColor: string;
}

/**
 * Height of the strength/week subtree that deferHeavyContent skips, so the
 * placeholder reserves the exact space the real content will occupy. Must
 * match the rendered height of the divider/progress bar + chain block.
 */
const DEFERRED_BODY_HEIGHT_COMPACT = 68;
const DEFERRED_BODY_HEIGHT_FULL = 100;

function CardContentComponent(props: CardContentProps) {
  const { colors: themeColors } = useThemeColors();
  const compact = props.isCompactMode;
  const { handleWeekComplete, progressEmojis } = useCardContent(props);

  // The focus list is hidden by the library during its remount. Keep the
  // recognizable shell and header in that first frame, but reserve the full
  // card height without constructing the animated strength/week subtree.
  // The parent enables the real content on the next animation frame.
  if (props.deferHeavyContent) {
    return (
      <>
        <View className={`px-3 ${compact ? 'pt-3' : 'pt-4'}`}>
          <CardHeader
            accentColor={props.accentColor}
            bestStreak={props.bestStreak}
            colors={props.colors}
            emoji={props.emoji}
            habit={props.habit}
            iconPulse={props.iconPulse}
            isCompactMode={compact}
            isPaused={props.isPaused}
            name={props.name}
            showHabitStrengthPercentage={props.showHabitStrengthPercentage}
            streak={props.streak}
          />
        </View>
        <View
          style={{
            height: compact
              ? DEFERRED_BODY_HEIGHT_COMPACT
              : DEFERRED_BODY_HEIGHT_FULL,
          }}
        />
      </>
    );
  }

  return (
    <>
      <View className={`px-3 ${compact ? 'pt-3' : 'pt-4'}`}>
        <CardHeader
          accentColor={props.accentColor}
          bestStreak={props.bestStreak}
          colors={props.colors}
          emoji={props.emoji}
          habit={props.habit}
          iconPulse={props.iconPulse}
          isCompactMode={compact}
          isPaused={props.isPaused}
          name={props.name}
          showHabitStrengthPercentage={props.showHabitStrengthPercentage}
          streak={props.streak}
        />
        {!compact && props.showNewRecord ? (
          <NewRecordBadge
            newRecordOpacity={props.newRecordOpacity}
            newRecordScale={props.newRecordScale}
          />
        ) : null}
        {compact ? (
          <View
            className='mb-2 h-[1px] rounded-full'
            style={{ backgroundColor: themeColors.gray[200] }}
          />
        ) : props.showHabitStrengthPercentage ? (
          <StrengthProgressBar
            accentColor={props.effectiveAccentColor}
            emojis={progressEmojis}
            progressAnimatedStyle={props.progressAnimatedStyle}
            strengthEmojiAnimatedStyle={props.strengthEmojiAnimatedStyle}
            strengthPercent={props.strengthPercent}
          />
        ) : (
          <View
            className='mb-3 h-[1.5px] rounded-full'
            style={{ backgroundColor: themeColors.gray[200] }}
          />
        )}
      </View>
      <View
        className={compact ? 'pb-3' : 'pb-4'}
        style={{
          paddingLeft: CARD_HORIZONTAL_PADDING,
          paddingRight: CARD_CHAIN_PADDING_RIGHT,
        }}
      >
        <HabitChainVisualizer
          accentColor={props.accentColor}
          celebrationsEnabled={props.celebrationsEnabled}
          completionIcon={props.completionIcon}
          strengthPercent={props.strengthPercent}
          habitId={props.habit._id}
          isConnectedToNextWeek={props.isConnectedToNextWeek}
          isConnectedToPreviousWeek={props.isConnectedToPreviousWeek}
          reduceMotionPreference={props.reduceMotionPreference}
          shape={props.dayShape}
          showConnectors={props.showConnectors}
          weekDateStrings={props.weekDateStrings}
          weekStatus={props.weekStatus}
          onToggle={props.toggleHabit}
          onWeekComplete={handleWeekComplete}
        />
        {!compact && props.isWeekComplete ? (
          <WeekCompleteIndicator accentColor={props.effectiveAccentColor} />
        ) : null}
      </View>
    </>
  );
}

export const CardContent = memo(CardContentComponent);
