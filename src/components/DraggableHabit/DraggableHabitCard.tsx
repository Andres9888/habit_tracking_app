import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import ReAnimated from 'react-native-reanimated';
import { ArchiveAction } from './ArchiveAction';
import { CardContent } from './CardContent';
import { getEffectiveAccentColor, getBorderAccentColor } from './colorUtils';
import type { DraggableHabitCardProps } from './DraggableHabitCard.types';

export type { DraggableHabitCardProps } from './DraggableHabitCard.types';

export function DraggableHabitCard(props: DraggableHabitCardProps) {
  const effectiveAccentColor = getEffectiveAccentColor(props.accentColor);
  const borderAccentColor = getBorderAccentColor(
    props.highContrastMode,
    props.accentColor
  );

  const cardStyle = {
    backgroundColor:
      props.isWeekComplete && !props.highContrastMode
        ? 'rgba(220, 252, 231, 0.3)'
        : props.colors.cardBackground,
    borderColor:
      props.isWeekComplete && !props.highContrastMode
        ? '#86efac'
        : props.colors.border,
    borderWidth: props.highContrastMode ? 2 : 1,
    elevation: 3,
    opacity: props.fade,
    shadowColor: props.isWeekComplete ? '#10b981' : '#78716c',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: props.isWeekComplete ? 0.12 : 0.06,
    shadowRadius: 12,
    transform: [{ translateY: props.translateY }, { scale: props.cardScale }],
  };

  const habitCard = (
    <ReAnimated.View style={props.entranceCardStyle}>
      <Pressable
        accessibilityHint='Tap to view habit details, long press for quick actions'
        accessibilityLabel={`${props.habit.name}, ${props.streak} day streak`}
        accessibilityRole='button'
        style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}
        onLongPress={props.handleLongPress}
        onPress={() => props.onPress?.(props.habit)}
        onPressIn={props.handlePressIn}
        onPressOut={props.handlePressOut}
      >
        <Animated.View
          className='flex-row overflow-hidden rounded-3xl'
          style={cardStyle}
        >
          <ReAnimated.View
            style={[
              {
                alignSelf: 'stretch',
                backgroundColor: borderAccentColor,
                borderBottomLeftRadius: 24,
                borderTopLeftRadius: 24,
              },
              props.entranceAccentStyle,
            ]}
          />
          <ReAnimated.View
            className='flex-1'
            style={props.entranceContentStyle}
          >
            <Animated.View
              pointerEvents='none'
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.18)',
                borderRadius: 24,
                opacity: props.archiveFlash,
                ...StyleSheet.absoluteFillObject,
              }}
            />
            <Animated.View
              pointerEvents='none'
              style={{
                borderColor: props.accentColor ?? '#a855f7',
                borderRadius: 24,
                borderWidth: 2,
                opacity: props.highlightGlow,
                ...StyleSheet.absoluteFillObject,
              }}
            />
            <CardContent
              {...props}
              effectiveAccentColor={effectiveAccentColor}
            />
          </ReAnimated.View>
        </Animated.View>
      </Pressable>
    </ReAnimated.View>
  );

  if (!props.onArchive) return habitCard;

  return (
    <Swipeable
      friction={2}
      overshootRight={false}
      renderRightActions={(_, dragX) => <ArchiveAction dragX={dragX} />}
      rightThreshold={40}
      onSwipeableOpen={props.handleSwipeableOpen}
    >
      {habitCard}
    </Swipeable>
  );
}
