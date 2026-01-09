/**
 * StreakRecordsAccordion Component
 * Collapsible section showing streak medal records.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import type { StreakRecordsAccordionProps } from '../types';
import { MEDALS } from './constants';
import { usePulseAnimation } from './usePulseAnimation';
import { useExpandAnimation } from './useExpandAnimation';
import { AccordionHeader } from './AccordionHeader';
import { MedalCardsRow } from './MedalCardsRow';

export const StreakRecordsAccordion = React.memo(
  function StreakRecordsAccordion({
    streakRecords,
    currentStreak,
    defaultExpanded = false,
  }: StreakRecordsAccordionProps) {
    const reduceMotion = useReduceMotion();
    const { triggerSelection } = useHapticFeedback();

    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const [contentHeight, setContentHeight] = useState(0);
    const [hasContentMeasured, setHasContentMeasured] = useState(false);

    const pulseAnimatedStyle = usePulseAnimation({
      currentStreak,
      reduceMotion,
    });
    const { animateToggle, contentAnimatedStyle, chevronAnimatedStyle } =
      useExpandAnimation({
        contentHeight,
        defaultExpanded,
        hasContentMeasured,
        reduceMotion,
      });

    const handleContentLayout = useCallback((event: any) => {
      const { height } = event.nativeEvent.layout;
      if (height > 0) {
        setContentHeight(height);
        setHasContentMeasured(true);
      }
    }, []);

    const handleToggle = useCallback(() => {
      triggerSelection();
      const newExpanded = !isExpanded;
      setIsExpanded(newExpanded);
      animateToggle(newExpanded);
    }, [isExpanded, triggerSelection, animateToggle]);

    const top3Records = useMemo(
      () => streakRecords.slice(0, 3),
      [streakRecords]
    );
    const hasRecords = top3Records.length > 0;
    const previewText = useMemo(
      () => top3Records.map((r, i) => `${MEDALS[i]}${r.days}`).join(' '),
      [top3Records]
    );

    const accessibilityLabel = useMemo(
      () =>
        hasRecords
          ? `Streak records. ${top3Records.map((r, i) => `${['Gold', 'Silver', 'Bronze'][i]}: ${r.days} days${r.isCurrent ? ', current streak' : ''}`).join(', ')}. ${isExpanded ? 'Expanded' : 'Collapsed'}.`
          : 'No streak records yet.',
      [hasRecords, top3Records, isExpanded]
    );

    if (!hasRecords && currentStreak === 0) {
      return (
        <View
          accessibilityLabel='No streak records yet.'
          className='mt-3 items-center rounded-xl border border-stone-200 bg-white p-4'
        >
          <Text className='text-sm text-stone-400'>
            Complete 2+ consecutive days to start tracking streaks
          </Text>
        </View>
      );
    }

    return (
      <View
        accessibilityLabel={accessibilityLabel}
        className='mt-3 overflow-hidden rounded-xl border border-stone-200 bg-white'
      >
        <AccordionHeader
          chevronStyle={chevronAnimatedStyle}
          hasRecords={hasRecords}
          isExpanded={isExpanded}
          previewText={previewText}
          onToggle={handleToggle}
        />

        <Animated.View style={contentAnimatedStyle}>
          <View className='px-3 pb-3' onLayout={handleContentLayout}>
            <MedalCardsRow
              currentStreak={currentStreak}
              pulseStyle={pulseAnimatedStyle}
              records={top3Records}
              reduceMotion={reduceMotion}
            />
          </View>
        </Animated.View>

        {!hasContentMeasured && (
          <View
            accessibilityElementsHidden
            className='absolute opacity-0'
            importantForAccessibility='no-hide-descendants'
            pointerEvents='none'
            onLayout={handleContentLayout}
          >
            <View className='px-3 pb-3'>
              <MedalCardsRow
                isForMeasurement
                currentStreak={currentStreak}
                records={top3Records}
                reduceMotion={reduceMotion}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
);

export default StreakRecordsAccordion;
