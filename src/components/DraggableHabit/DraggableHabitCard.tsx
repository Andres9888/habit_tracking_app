/**
 * @module DraggableHabitCard
 *
 * Pure rendering layer for a single habit card.
 *
 * Receives fully-resolved props (shared values, colors, handlers) from
 * the parent {@link DraggableHabit} orchestrator and renders the visual
 * structure:
 *
 * ```
 * Swipeable (optional — only when onArchive is provided)
 *   └─ Pressable
 *       └─ ReAnimated.View (card shell: fade, translateY, scale)
 *           ├─ Accent left border strip (entrance animation)
 *           ├─ StrengthFillBackground (watercolor gradient)
 *           ├─ Archive flash overlay
 *           ├─ Highlight glow border overlay
 *           └─ CardContent (header + progress bar + chain + week badge)
 * ```
 *
 * Wrapped in `React.memo` to avoid FlatList re-render cascades.
 */

import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import ReAnimated, { useAnimatedStyle } from 'react-native-reanimated';
import { ArchiveAction } from './ArchiveAction';
import { CardContent } from './CardContent';
import { SelectionOverlay } from './SelectionOverlay';
import { StrengthFillBackground } from '../HabitCard/components/StrengthFillBackground';
import { getEffectiveAccentColor, getBorderAccentColor } from './colorUtils';
import { buildStaticCardStyle } from './cardStyles';
import type { DraggableHabitCardProps } from './DraggableHabitCard.types';
import { borderRadius } from '../../theme/spacing';

export type { DraggableHabitCardProps } from './DraggableHabitCard.types';

function DraggableHabitCardComponent(props: DraggableHabitCardProps) {
  const effectiveAccentColor = getEffectiveAccentColor(props.accentColor);
  const borderAccentColor = getBorderAccentColor(
    props.highContrastMode,
    props.accentColor
  );
  const staticCardStyle = buildStaticCardStyle({
    colors: props.colors,
    highContrastMode: props.highContrastMode,
    isWeekComplete: props.isWeekComplete,
  });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: props.fade.value,
    transform: [
      { translateY: props.translateY.value },
      { scale: props.cardScale.value },
    ],
  }));

  const archiveFlashStyle = useAnimatedStyle(() => ({
    opacity: props.archiveFlash.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: props.highlightGlow.value,
  }));

  // PERF: Memoize pressable style to prevent recreating function on every render
  const pressableStyle = useMemo(
    () =>
      ({ pressed }: { pressed: boolean }) => ({
        opacity: pressed ? 0.92 : 1,
      }),
    []
  );

  const handlePress = useMemo(() => {
    if (props.showSelectionOverlay) return () => props.onToggleSelection?.();
    return () => props.onPress?.(props.habit);
  }, [props.showSelectionOverlay, props.onToggleSelection, props.onPress, props.habit]);

  const habitCard = (
    <ReAnimated.View style={[props.entranceCardStyle, { flexDirection: 'row', alignItems: 'center' }]}>
      {props.showSelectionOverlay && (
        <SelectionOverlay isSelected={!!props.isSelected} onToggle={() => props.onToggleSelection?.()} />
      )}
      <Pressable
        accessibilityHint={props.showSelectionOverlay ? 'Tap to toggle selection' : `Tap to view details${props.onArchive ? ', swipe left to archive' : ''}`}
        accessibilityLabel={`${props.habit.name}, ${props.streak} day streak`}
        accessibilityRole='button'
        style={[pressableStyle, { flex: 1 }]}
        onLongPress={props.showSelectionOverlay ? undefined : props.handleLongPress}
        onPress={handlePress}
        onPressIn={props.showSelectionOverlay ? undefined : props.handlePressIn}
        onPressOut={props.showSelectionOverlay ? undefined : props.handlePressOut}
      >
        <ReAnimated.View
          className='flex-row overflow-hidden rounded-3xl'
          style={[staticCardStyle, cardAnimatedStyle]}
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
            <ReAnimated.View
              pointerEvents='none'
              style={[
                {
                  backgroundColor: 'rgba(245, 158, 11, 0.18)',
                  borderRadius: borderRadius.xl,
                  ...StyleSheet.absoluteFillObject,
                },
                archiveFlashStyle,
              ]}
            />
            <ReAnimated.View
              pointerEvents='none'
              style={[
                {
                  borderColor: props.accentColor ?? '#a855f7',
                  borderRadius: borderRadius.xl,
                  borderWidth: 2,
                  ...StyleSheet.absoluteFillObject,
                },
                glowStyle,
              ]}
            />
            <CardContent
              {...props}
              effectiveAccentColor={effectiveAccentColor}
            />
          </ReAnimated.View>
        </ReAnimated.View>
      </Pressable>
    </ReAnimated.View>
  );

  if (!props.onArchive || props.showSelectionOverlay) return habitCard;

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

export const DraggableHabitCard = memo(DraggableHabitCardComponent);
