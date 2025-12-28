import React, { useCallback, useMemo } from 'react';
import { View, AccessibilityInfo, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { format, addMonths, subMonths } from 'date-fns';
import { MonthGrid } from './MonthGrid';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import type {
  SwipeableMonthGridProps,
  SwipeDirection,
} from './SwipeableMonthGridTypes';
export type {
  SwipeableMonthGridProps,
  SwipeDirection,
} from './SwipeableMonthGridTypes';

export function SwipeableMonthGrid({
  grid,
  month,
  year,
  habitColor,
  onDayPress,
  instantToggle = true,
  onMonthChange,
  swipeEnabled = true,
  swipeThreshold = 50,
  velocityThreshold = 500,
  minDate,
  maxDate,
  disableHaptics = false,
}: SwipeableMonthGridProps) {
  const reduceMotion = useReduceMotion();
  const translateX = useSharedValue(0);
  const containerWidth = useSharedValue(0);
  const isNavigating = useSharedValue(false);

  const getTargetMonth = useCallback(
    (direction: SwipeDirection) => {
      const current = new Date(year, month, 1);
      const target =
        direction === 'next' ? addMonths(current, 1) : subMonths(current, 1);
      return { month: target.getMonth(), year: target.getFullYear() };
    },
    [month, year]
  );

  const canNavigate = useCallback(
    (direction: SwipeDirection): boolean => {
      const target = getTargetMonth(direction);
      const targetDate = new Date(target.year, target.month, 1);
      if (direction === 'prev' && minDate) {
        const min = new Date(minDate);
        if (targetDate < new Date(min.getFullYear(), min.getMonth(), 1))
          return false;
      }
      if (direction === 'next' && maxDate) {
        const max = new Date(maxDate);
        if (targetDate > new Date(max.getFullYear(), max.getMonth(), 1))
          return false;
      }
      return true;
    },
    [getTargetMonth, minDate, maxDate]
  );

  const triggerMonthChange = useCallback(
    (direction: SwipeDirection) => {
      if (!onMonthChange) return;
      const target = getTargetMonth(direction);
      if (!disableHaptics)
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const monthName = format(
        new Date(target.year, target.month, 1),
        'MMMM yyyy'
      );
      AccessibilityInfo.announceForAccessibility(`Navigated to ${monthName}`);
      onMonthChange(direction, target.month, target.year);
    },
    [onMonthChange, getTargetMonth, disableHaptics]
  );

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      containerWidth.value = e.nativeEvent.layout.width;
    },
    [containerWidth]
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(swipeEnabled)
        .activeOffsetX([-10, 10])
        .failOffsetY([-20, 20])
        .onUpdate((e) => {
          if (isNavigating.value) return;
          const dir = e.translationX > 0 ? 'prev' : 'next';
          translateX.value = canNavigate(dir)
            ? e.translationX
            : e.translationX * 0.2;
        })
        .onEnd((e) => {
          if (isNavigating.value) {
            translateX.value = reduceMotion
              ? 0
              : withSpring(0, { damping: 20 });
            return;
          }
          const dir: SwipeDirection = e.translationX > 0 ? 'prev' : 'next';
          const shouldNav =
            (Math.abs(e.translationX) >= swipeThreshold ||
              Math.abs(e.velocityX) >= velocityThreshold) &&
            canNavigate(dir);
          if (shouldNav) {
            isNavigating.value = true;
            const targetX =
              dir === 'prev' ? containerWidth.value : -containerWidth.value;
            if (reduceMotion) {
              translateX.value = 0;
              runOnJS(triggerMonthChange)(dir);
              isNavigating.value = false;
            } else {
              translateX.value = withSpring(
                targetX,
                { damping: 20, stiffness: 200 },
                (done) => {
                  if (done) {
                    translateX.value = 0;
                    runOnJS(triggerMonthChange)(dir);
                    isNavigating.value = false;
                  }
                }
              );
            }
          } else {
            translateX.value = reduceMotion
              ? 0
              : withSpring(0, { damping: 20, stiffness: 300 });
          }
        }),
    [
      swipeEnabled,
      swipeThreshold,
      velocityThreshold,
      reduceMotion,
      canNavigate,
      triggerMonthChange,
      translateX,
      containerWidth,
      isNavigating,
    ]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      accessible
      accessibilityHint={
        swipeEnabled
          ? 'Swipe left or right to navigate between months'
          : undefined
      }
      accessibilityRole='adjustable'
      onLayout={handleLayout}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          <MonthGrid
            grid={grid}
            habitColor={habitColor}
            instantToggle={instantToggle}
            month={month}
            year={year}
            onDayPress={onDayPress}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
