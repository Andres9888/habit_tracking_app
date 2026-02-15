/**
 * WOOPSectionContent - Content section for WOOPSection
 */

import React from 'react';
import { View, Text } from 'react-native';

import type { WOOPData } from './WOOPSection.types';
import { WOOPField } from './WOOPField';

interface WOOPSectionContentProps {
  woop?: WOOPData;
  hasWoop: boolean;
}

export function WOOPSectionContent({ woop, hasWoop }: WOOPSectionContentProps) {
  if (!hasWoop) {
    return (
      <Text className='text-sm text-stone-500'>
        Wish-Outcome-Obstacle-Plan framework
      </Text>
    );
  }

  return (
    <View className='gap-1.5'>
      <WOOPField
        label='Wish'
        letter='W'
        letterColorClass='text-amber-500'
        value={woop?.wish}
      />
      <WOOPField
        label='Outcome'
        letter='O'
        letterColorClass='text-amber-500'
        value={woop?.outcome}
      />
      <WOOPField
        label='Obstacle'
        letter='O'
        letterColorClass='text-rose-500'
        value={woop?.obstacle}
      />
      <WOOPField
        isBold
        label='Plan'
        letter='P'
        letterColorClass='text-emerald-500'
        value={woop?.plan}
        valueColorClass='text-stone-900'
      />
    </View>
  );
}
