/**
 * StatsRow Component
 *
 * Renders a horizontal row of stat cards for the StatsGrid.
 */

import React from 'react';
import { View } from 'react-native';
import { StatCard } from './StatCard';
import type { StatItemConfig } from './StatsGridTypes';

interface StatsRowProps {
  cards: StatItemConfig[];
  indexOffset: number;
  reduceMotion: boolean;
  onHapticFeedback: () => void;
  onFocusDayPress?: () => void;
}

export function StatsRow({
  cards,
  indexOffset,
  reduceMotion,
  onHapticFeedback,
  onFocusDayPress,
}: StatsRowProps) {
  return (
    <View className='flex-row gap-2'>
      {cards.map((card, index) => (
        <View key={card.id} className='flex-1'>
          <StatCard
            config={card}
            index={index + indexOffset}
            isInteractive={card.id === 'focusDay' && !!onFocusDayPress}
            reduceMotion={reduceMotion}
            onHapticFeedback={onHapticFeedback}
            onPress={card.id === 'focusDay' ? onFocusDayPress : undefined}
          />
        </View>
      ))}
    </View>
  );
}
