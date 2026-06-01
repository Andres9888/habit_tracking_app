/** DetailHeroStat - Single emoji + number + label item for the hero stats row. */
import React from 'react';
import { Text, View } from 'react-native';
import { spacing } from '../../../theme/spacing';
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
    <View className='flex-row items-center' style={{ gap: spacing.xs }}>
      <Text style={{ fontSize: typography.overline.fontSize }}>{emoji}</Text>
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
      <Text style={{ ...typography.caption, color: labelColor, fontSize: typography.overline.fontSize }}>
        {label}
      </Text>
    </View>
  );
}
