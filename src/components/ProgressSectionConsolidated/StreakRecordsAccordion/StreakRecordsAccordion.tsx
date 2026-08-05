/** StreakRecordsAccordion - Collapsible section showing streak medal records */

import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { StreakRecordsAccordionProps } from '../types';
import { AccordionHeader } from './AccordionHeader';
import { MedalCardsRow } from './MedalCardsRow';
import { MeasurementContainer } from './MeasurementContainer';
import { StreakEmptyState } from './StreakEmptyState';
import { useStreakAccordionState } from './useStreakAccordionState';
import { useThemeColors } from '@/theme/ThemeContext';

export const StreakRecordsAccordion = React.memo(
  function StreakRecordsAccordion({
    streakRecords,
    currentStreak,
    defaultExpanded = false,
  }: StreakRecordsAccordionProps) {
    const { colors } = useThemeColors();
    const state = useStreakAccordionState({
      currentStreak,
      defaultExpanded,
      streakRecords,
    });
    const {
      reduceMotion,
      hasContentMeasured,
      pulseAnimatedStyle,
      contentAnimatedStyle,
      chevronAnimatedStyle,
      handleContentLayout,
      handleToggle,
      top3Records,
      hasRecords,
      previewText,
      accessibilityLabel,
      isExpanded,
    } = state;

    if (!hasRecords && currentStreak === 0) return <StreakEmptyState />;

    return (
      <View
        accessibilityLabel={accessibilityLabel}
        className='mt-3 overflow-hidden rounded-xl border'
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
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
        {hasContentMeasured ? null : <MeasurementContainer
            currentStreak={currentStreak}
            records={top3Records}
            reduceMotion={reduceMotion}
            onLayout={handleContentLayout}
          />}
      </View>
    );
  }
);
export default StreakRecordsAccordion;
