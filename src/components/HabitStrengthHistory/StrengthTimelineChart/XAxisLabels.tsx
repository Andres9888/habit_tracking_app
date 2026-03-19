/**
 * X-axis labels component for StrengthTimelineChart
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { PADDING_LEFT, PADDING_RIGHT } from './constants';
import type { XAxisLabel } from './types';

interface XAxisLabelsProps {
  labels: XAxisLabel[];
}

export function XAxisLabels({ labels }: XAxisLabelsProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      className='absolute bottom-1 left-0 right-0 flex-row justify-between px-3'
      style={{ paddingLeft: PADDING_LEFT, paddingRight: PADDING_RIGHT }}
    >
      {labels.map((label, index) => (
        <Text
          key={`${label.text}-${index}`}
          className='text-[10px]'
          style={{
            color: themeColors.text.tertiary,
            left: label.x,
            position: 'absolute',
            transform: [
              {
                translateX:
                  label.text === 'Now' ? -20 : label.text === 'Start' ? 0 : -10,
              },
            ],
          }}
        >
          {label.text}
        </Text>
      ))}
    </View>
  );
}
