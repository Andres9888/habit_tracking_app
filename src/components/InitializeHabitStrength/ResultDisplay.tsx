/**
 * ResultDisplay - Shows initialization results
 */

import React from 'react';
import { View, Text } from 'react-native';

interface ResultDisplayProps {
  result: {
    total: number;
    updated: number;
    failed: number;
  };
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  return (
    <View className='mt-3 rounded-lg bg-green-100 p-3'>
      <Text className='font-semibold text-green-900'>
        ✅ Initialization Complete!
      </Text>
      <Text className='mt-1 text-sm text-green-800'>
        • Total habits: {result.total}
      </Text>
      <Text className='text-sm text-green-800'>
        • Successfully updated: {result.updated}
      </Text>
      {result.failed > 0 && (
        <Text className='text-sm text-red-600'>• Failed: {result.failed}</Text>
      )}
      <Text className='mt-2 text-xs text-green-700'>
        You can now remove this component from your App.tsx
      </Text>
    </View>
  );
}
