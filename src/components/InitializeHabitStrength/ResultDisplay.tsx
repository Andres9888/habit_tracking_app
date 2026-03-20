/**
 * ResultDisplay - Shows initialization results
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface ResultDisplayProps {
  result: {
    total: number;
    updated: number;
    failed: number;
  };
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mt-3 rounded-lg p-3' style={{ backgroundColor: colors.status.successLight }}>
      <Text className='font-semibold' style={{ color: colors.status.successText }}>
        ✅ Initialization Complete!
      </Text>
      <Text className='mt-1 text-sm' style={{ color: colors.status.successText }}>
        • Total habits: {result.total}
      </Text>
      <Text className='text-sm' style={{ color: colors.status.successText }}>
        • Successfully updated: {result.updated}
      </Text>
      {result.failed > 0 ? <Text className='text-sm' style={{ color: colors.status.errorText }}>• Failed: {result.failed}</Text> : null}
      <Text className='mt-2 text-xs' style={{ color: colors.status.successText }}>
        You can now remove this component from your App.tsx
      </Text>
    </View>
  );
}
