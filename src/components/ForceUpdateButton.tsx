/**
 * Manual button to force habit strength update
 * This bypasses any toggle issues and directly updates strength
 */

import React, { useState } from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { getTodayString } from '../../utils/dateUtils';

interface ForceUpdateButtonProps {
  habitId: Id<'habits'>;
  habitName: string;
  currentStrength: number;
}

type UpdateStrengthResponse = {
  baseline: number;
  compliance: number;
  daysSinceCreation: number;
  newStrength: number;
  predictionProbability: number;
  previousStrength: number;
  strengthLevel: string;
};

const assertUpdateStrengthResponse: (
  response: unknown
) => asserts response is UpdateStrengthResponse = (response: unknown) => {
  if (!response || typeof response !== 'object') {
    throw new Error('Unexpected empty response from updateHabitStrength');
  }

  const candidate = response as Partial<UpdateStrengthResponse>;
  if (
    typeof candidate.previousStrength !== 'number' ||
    typeof candidate.newStrength !== 'number'
  ) {
    throw new TypeError('updateHabitStrength returned unexpected payload');
  }
};

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
      const today = getTodayString();
      const response = await updateStrength({
        behaviorPerformed: true,
        date: today,
        habitId,
      });

      assertUpdateStrengthResponse(response);
      setResult(
        `✅ ${response.previousStrength.toFixed(3)} → ${response.newStrength.toFixed(3)}`
      );
      console.log('Force update result:', response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setResult(`❌ Error: ${errorMessage}`);
      console.error('Force update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='mt-2 gap-2'>
      <Pressable
        className={`rounded-lg px-4 py-2 ${
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
