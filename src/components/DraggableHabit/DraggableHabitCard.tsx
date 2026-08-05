/* eslint-disable max-lines */
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
 * Swipeable (optional — only when onArchive or onDelete is provided)
 *   └─ Pressable
 *       └─ ReAnimated.View (card shell: fade, translateY, scale)
 *           ├─ Accent left border strip (entrance animation)
 *           ├─ StrengthFillBackground (watercolor gradient)
 *           ├─ Highlight glow border overlay
 *           └─ CardContent (header + progress bar + chain + week badge)
 * ```
 *
 * Wrapped in `React.memo` to avoid FlatList re-render cascades.
 */

import React, { memo, useCallback, useMemo } from 'react';
import { Pressable } from 'react-native';
import { absoluteFillObject } from '@/theme/absoluteFillObject';
import { Swipeable } from 'react-native-gesture-handler';
import ReAnimated, { useAnimatedStyle } from 'react-native-reanimated';
import { SwipeActions } from './SwipeActions';
import { CardContent } from './CardContent';
import { SelectionOverlay } from './SelectionOverlay';
import { StrengthFillBackground } from '../HabitCard/components/StrengthFillBackground';
import { getEffectiveAccentColor, getBorderAccentColor } from './colorUtils';
import { buildStaticCardStyle } from './cardStyles';
import type { DraggableHabitCardProps } from './DraggableHabitCard.types';
import { colors } from '@/theme';
import { borderRadius } from '../../theme/spacing';

export type { DraggableHabitCardProps } from './DraggableHabitCard.types';

function DraggableHabitCardComponent(props: DraggableHabitCardProps) {
  const effectiveAccentColor = getEffectiveAccentColor(props.accentColor);
  const borderAccentColor = getBorderAccentColor(props.accentColor);
  const staticCardStyle = buildStaticCardStyle({
    colors: props.colors,
    isWeekComplete: props.isWeekComplete,
  });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: props.fade.value,
    transform: [
      { translateY: props.translateY.value },
      { scale: props.cardScale.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: props.highlightGlow.value,
  }));

  // PERF: static style avoids recreating function on every render
  const pressableStyle = useMemo(() => ({ flex: 1 as const }), []);

  const handlePress = useMemo(() => {
    if (props.showSelectionOverlay) return () => props.onToggleSelection?.();
    return () => props.onPress?.(props.habit);
  }, [
    props.showSelectionOverlay,
    props.onToggleSelection,
    props.onPress,
    props.habit,
  ]);

  const handleArchivePress = useCallback(() => {
    props.onArchive?.(props.habit._id);
  }, [props.onArchive, props.habit._id]);

  const handleDeletePress = useCallback(() => {
    props.onDelete?.(props.habit._id);
  }, [props.onDelete, props.habit._id]);

  const hasSwipeActions = props.onArchive || props.onDelete;

  const habitCard = (
    <ReAnimated.View
      collapsable={false}
      style={[
        props.entranceCardStyle,
        { flexDirection: 'row', alignItems: 'center' },
      ]}
    >
      {props.showSelectionOverlay ? (
        <SelectionOverlay
          isSelected={!!props.isSelected}
          onToggle={() => props.onToggleSelection?.()}
        />
      ) : null}
      <Pressable
        accessibilityHint={
          props.showSelectionOverlay
            ? 'Tap to toggle selection'
            : `Tap to view details${hasSwipeActions ? ', swipe left for actions' : ''}`
        }
        accessibilityLabel={`${props.habit.name}, ${props.streak} day streak`}
        accessibilityRole='button'
        testID='habit-card'
        style={pressableStyle}
        onLongPress={
          props.showSelectionOverlay ? undefined : props.handleLongPress
        }
        onPress={handlePress}
        onPressIn={props.showSelectionOverlay ? undefined : props.handlePressIn}
        onPressOut={
          props.showSelectionOverlay ? undefined : props.handlePressOut
        }
      >
        <ReAnimated.View
          className='flex-row overflow-hidden rounded-3xl'
          collapsable={false}
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
            {props.showGradientFill ? (
              <StrengthFillBackground
                isDark={props.isDark}
                strengthColor={effectiveAccentColor}
                strengthFillStyle={props.strengthFillStyle}
              />
            ) : null}
            <ReAnimated.View
              pointerEvents='none'
              style={[
                {
                  borderColor: props.accentColor ?? colors.premium[400],
                  borderRadius: borderRadius.xl,
                  borderWidth: 2,
                  ...absoluteFillObject,
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

  if (!hasSwipeActions || props.showSelectionOverlay) return habitCard;

  return (
    <Swipeable
      friction={2}
      overshootRight={false}
      renderRightActions={(_, dragX) => (
        <SwipeActions
          dragX={dragX}
          onArchive={handleArchivePress}
          onDelete={handleDeletePress}
        />
      )}
    >
      {habitCard}
    </Swipeable>
  );
}

export const DraggableHabitCard = memo(DraggableHabitCardComponent);
