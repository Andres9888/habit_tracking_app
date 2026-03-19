/**
 * WOOPSectionContent - Content section for WOOPSection
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { WOOPField } from './WOOPField';
import type { WOOPData } from './WOOPSection.types';

interface WOOPSectionContentProps {
  woop?: WOOPData;
  hasWoop: boolean;
}

export function WOOPSectionContent({ woop, hasWoop }: WOOPSectionContentProps) {
  const { colors } = useThemeColors();

  if (!hasWoop) {
    return (
      <Text className='text-sm' style={{ color: colors.text.secondary }}>
        Wish-Outcome-Obstacle-Plan framework
      </Text>
    );
  }

  return (
    <View className='gap-1.5'>
      <WOOPField
        label='Wish'
        letter='W'
        letterColorClass=''
        letterColorStyle={colors.status.warning}
        value={woop?.wish}
      />
      <WOOPField
        label='Outcome'
        letter='O'
        letterColorClass=''
        letterColorStyle={colors.status.warning}
        value={woop?.outcome}
      />
      <WOOPField
        label='Obstacle'
        letter='O'
        letterColorClass=''
        letterColorStyle={colors.status.error}
        value={woop?.obstacle}
      />
      <WOOPField
        isBold
        label='Plan'
        letter='P'
        letterColorClass=''
        letterColorStyle={colors.status.success}
        value={woop?.plan}
        valueColor={colors.text.primary}
      />
    </View>
  );
}
