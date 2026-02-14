import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import ReAnimated from 'react-native-reanimated';
import { Play } from 'lucide-react-native';
import { ArchiveAction } from './ArchiveAction';
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

  // Dimmed appearance for paused habits
  const isPaused = props.habit.paused === true;
  const cardOpacity = isPaused ? 0.6 : 1;

  const handleResumePress = () => {
    if (props.onResume) {
      props.onResume(props.habit._id);
    }
  };

  const habitCard = (
    <ReAnimated.View style={props.entranceCardStyle}>
      <Pressable
        accessibilityHint={isPaused ? 'Tap Resume to continue this habit' : 'Tap to view habit details, long press for quick actions'}
        accessibilityLabel={`${props.habit.name}, ${props.streak} day streak${isPaused ? ', paused' : ''}`}
        accessibilityRole='button'
        style={({ pressed }) => ({ opacity: (pressed ? 0.92 : 1) * cardOpacity })}
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
                backgroundColor: isPaused ? '#d1d5db' : borderAccentColor,
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
      {/* Resume Button for Paused Habits */}
      {isPaused && props.onResume && (
        <Pressable
          className='mt-2 flex-row items-center justify-center rounded-full bg-green-500 py-2'
          onPress={handleResumePress}
          accessibilityHint='Resume this habit'
          accessibilityLabel={`Resume ${props.habit.name}`}
          accessibilityRole='button'
        >
          <Play size={16} color='#ffffff' fill='#ffffff' />
          <Text className='ml-1 text-[14px] font-semibold text-white'>Resume</Text>
        </Pressable>
      )}
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
