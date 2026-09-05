/**
 * InsightChips Component
 *
 * Horizontal scroll container with key insight chips showing:
 * - Current streak (with pulse animation if active)
 * - Best performing day
 * - Focus day (worst day - interactive)
 * - Monthly completion rate
 */

import React from 'react';
import { View, ScrollView } from 'react-native';

import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import { useReducedMotion } from 'react-native-reanimated';
import { InsightChip } from './InsightChip';
import { useInsightChipsData } from './useInsightChipsData';

import type { InsightChipsProps } from '../types';

export function InsightChips(props: InsightChipsProps) {
  const reduceMotion = useReducedMotion();
  const { triggerSelection } = useHapticFeedback();
  const chips = useInsightChipsData(props);

  return (
    <View className='mb-4'>
      <ScrollView
        horizontal
        accessibilityLabel='Habit insights'
        accessibilityRole='list'
        contentContainerStyle={{ gap: 8, paddingRight: 8 }}
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -4 }}
      >
        {chips.map((chip, index) => (
          <InsightChip
            key={chip.id}
            chip={chip}
            index={index}
            reduceMotion={reduceMotion}
            onHapticFeedback={triggerSelection}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default InsightChips;
