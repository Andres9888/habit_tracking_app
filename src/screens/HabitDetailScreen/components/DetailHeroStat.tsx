/** DetailHeroStat - Single emoji + number + label item for the hero stats row. */
import React from 'react';
import { Text, View } from 'react-native';
import { typography, fontFamilies, fontWeights } from '../../../theme/typography';

interface DetailHeroStatProps {
  emoji: string;
  label: string;
  value: number;
  valueColor: string;
  labelColor: string;
}

export function DetailHeroStat({
  emoji,
  label,
  value,
  valueColor,
  labelColor,
}: DetailHeroStatProps) {
  return (
    <View className='flex-row items-center' style={{ gap: 4 }}>
      <Text style={{ fontSize: 12 }}>{emoji}</Text>
      <Text
        style={{
          color: valueColor,
          fontFamily: fontFamilies.monospace,
          fontSize: typography.caption.fontSize,
          fontWeight: fontWeights.semibold,
        }}
      >
        {value}
      </Text>
      <Text style={{ ...typography.caption, color: labelColor, fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}
