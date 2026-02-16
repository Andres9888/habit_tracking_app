import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import ReAnimated from 'react-native-reanimated';
import { StrengthFillBackground } from '../HabitCard/components/StrengthFillBackground';
import { CardContent } from './CardContent';
import { getEffectiveAccentColor, getBorderAccentColor } from './colorUtils';
import { buildCardStyle } from './cardStyles';
import type { DraggableHabitCardProps } from './DraggableHabitCard.types';
import { borderRadius } from '../../theme/spacing';

export function HabitCardInner(props: DraggableHabitCardProps) {
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

  return (
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
    </ReAnimated.View>
  );
}
