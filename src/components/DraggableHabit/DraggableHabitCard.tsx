import React from 'react';
import { Animated, Pressable, StyleSheet, View, Text } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import ReAnimated from 'react-native-reanimated';
import { Play } from 'lucide-react-native';
import { ArchiveAction } from './ArchiveAction';
import { PauseAction } from './PauseAction';
import { CardContent } from './CardContent';
import { StrengthFillBackground } from '../HabitCard/components/StrengthFillBackground';
import { getEffectiveAccentColor, getBorderAccentColor } from './colorUtils';
import { buildCardStyle } from './cardStyles';
import type { DraggableHabitCardProps } from './DraggableHabitCard.types';
import { borderRadius } from '../../theme/spacing';

export type { DraggableHabitCardProps } from './DraggableHabitCard.types';

export function DraggableHabitCard(props: DraggableHabitCardProps) {
  const effectiveAccentColor = getEffectiveAccentColor(props.accentColor);
  const borderAccentColor = getBorderAccentColor(
    props.highContrastMode,
    props.accentColor
  );
  const cardStyle = buildCardStyle({
    cardScale: props.cardScale,
    colors: props.colors,
    fade: props.fade,
    highContrastMode: props.highContrastMode,
    isWeekComplete: props.isWeekComplete,
    translateY: props.translateY,
  });

  // Dimmed style for paused habits
  const pausedOpacity = props.isPaused ? 0.6 : 1;

  const habitCard = (
    <ReAnimated.View style={props.entranceCardStyle}>
      <Pressable
        accessibilityHint='Tap to view habit details, long press for quick actions'
        accessibilityLabel={`${props.habit.name}, ${props.streak} day streak`}
        accessibilityRole='button'
        style={({ pressed }) => ({ 
          opacity: pressed ? 0.92 * pausedOpacity : pausedOpacity 
        })}
        onLongPress={props.handleLongPress}
        onPress={() => props.onPress?.(props.habit)}
        onPressIn={props.handlePressIn}
        onPressOut={props.handlePressOut}
      >
        <Animated.View
          className='flex-row overflow-hidden rounded-3xl'
          style={[cardStyle, props.isPaused && { opacity: pausedOpacity }]}
        >
          <ReAnimated.View
            style={[
              {
                alignSelf: 'stretch',
                backgroundColor: borderAccentColor,
                borderBottomLeftRadius: borderRadius.xl,
                borderTopLeftRadius: borderRadius.xl,
              },
              props.entranceAccentStyle,
            ]}
          />
          <ReAnimated.View
            className='flex-1'
            style={props.entranceContentStyle}
          >
            {props.showGradientFill && (
              <StrengthFillBackground
                isDark={props.isDark}
                strengthColor={effectiveAccentColor}
                strengthFillStyle={props.strengthFillStyle}
              />
            )}
            <Animated.View
              pointerEvents='none'
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.18)',
                borderRadius: borderRadius.xl,
                opacity: props.archiveFlash,
                ...StyleSheet.absoluteFillObject,
              }}
            />
            <Animated.View
              pointerEvents='none'
              style={{
                borderColor: props.accentColor ?? '#a855f7',
                borderRadius: borderRadius.xl,
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
      
      {/* Resume button for paused habits */}
      {props.isPaused && props.onResume && (
        <Pressable
          className='mt-2 flex-row items-center justify-center rounded-full py-2'
          style={{ backgroundColor: '#10b981' }}
          onPress={() => props.onResume?.(props.habit._id)}
        >
          <Play color='white' size={16} fill='white' />
          <Text className='ml-1 text-sm font-semibold text-white'>
            Resume Habit
          </Text>
        </Pressable>
      )}
    </ReAnimated.View>
  );

  if (!props.onArchive && !props.onPause) return habitCard;

  // If only archive is available, use archive action
  if (props.onArchive && !props.onPause) {
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

  // If pause is available (and possibly archive), show both actions
  // We'll use a different approach - swipe left for pause, swipe right for archive
  return (
    <Swipeable
      friction={2}
      overshootRight={false}
      renderRightActions={(_, dragX) => (
        <PauseAction
          dragX={dragX}
          isPaused={props.isPaused ?? false}
          onPause={() => props.onPause?.(props.habit._id)}
          onResume={() => props.onResume?.(props.habit._id)}
        />
      )}
      rightThreshold={40}
      onSwipeableOpen={props.handleSwipeableOpen}
    >
      {habitCard}
    </Swipeable>
  );
}
