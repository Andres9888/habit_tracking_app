/** DetailHeroStat - Centered number-over-label column for the hero stat row. */
import React from 'react';
import { Text, View } from 'react-native';
import {
  fontFamilies,
  fontWeights,
  typography,
} from '../../../theme/typography';

interface DetailHeroStatProps {
  label: string;
  value: number;
  valueColor: string;
  labelColor: string;
}

export function DetailHeroStat({
  label,
  value,
  valueColor,
  labelColor,
}: DetailHeroStatProps) {
  return (
    <View className='flex-1 items-center'>
      <Text
        style={{
          color: valueColor,
          fontFamily: fontFamilies.monospace,
          fontSize: typography.heading3.fontSize,
          fontWeight: fontWeights.bold,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          ...typography.caption,
          color: labelColor,
          fontSize: typography.overline.fontSize,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
