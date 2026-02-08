import React, { useState } from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { assertUpdateStrengthResponse } from './types';
import type { ForceUpdateButtonProps } from './types';

export function ForceUpdateButton({
  habitId,
  habitName: _habitName,
  currentStrength,
}: ForceUpdateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const updateStrength = useMutation(api.habitStrength.updateHabitStrength);

  const handleClick = async () => {
    setLoading(true);
    setResult(null);

    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await updateStrength({
        behaviorPerformed: true,
        date: today,
        habitId,
      });

      assertUpdateStrengthResponse(response);
      setResult(
        `✅ ${response.previousStrength.toFixed(3)} → ${response.newStrength.toFixed(3)}`
      );
      if (__DEV__) console.log('Force update result:', response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setResult(`❌ Error: ${errorMessage}`);
      if (__DEV__) console.error('Force update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='mt-2 gap-2'>
      <Pressable
        accessibilityLabel='Force update habit strength'
        accessibilityRole='button'
        accessibilityState={{ disabled: loading }}
        className={`rounded-lg px-4 py-3 ${
          loading ? 'bg-stone-400' : 'bg-green-600'
        }`}
        disabled={loading}
        onPress={handleClick}
      >
        {loading ? (
          <View className='flex-row items-center justify-center gap-2'>
            <ActivityIndicator color='white' size='small' />
            <Text className='font-semibold text-white'>Updating...</Text>
          </View>
        ) : (
          <Text className='text-center font-semibold text-white'>
            🚀 Force Update Strength +15%
          </Text>
        )}
      </Pressable>

      {result && (
        <View
          className={`rounded-lg p-2 ${
            result.startsWith('✅') ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <Text
            className={`text-xs ${
              result.startsWith('✅') ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {result}
          </Text>
        </View>
      )}

      <Text className='text-xs text-stone-500'>
        Current: {(currentStrength * 100).toFixed(1)}%
      </Text>
    </View>
  );
}
