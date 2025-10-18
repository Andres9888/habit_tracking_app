/**
 * Manual button to force habit strength update
 * This bypasses any toggle issues and directly updates strength
 */

import React, { useState } from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

interface ForceUpdateButtonProps {
  habitId: Id<'habits'>;
  habitName: string;
  currentStrength: number;
}

export function ForceUpdateButton({
  habitId,
  habitName,
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
        habitId,
        date: today,
        behaviorPerformed: true,
      });

      setResult(
        `✅ ${response.previousStrength.toFixed(3)} → ${response.newStrength.toFixed(3)}`
      );
      console.log('Force update result:', response);
    } catch (err) {
      setResult(`❌ Error: ${err}`);
      console.error('Force update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='mt-2 gap-2'>
      <Pressable
        onPress={handleClick}
        disabled={loading}
        className={`rounded-lg px-4 py-2 ${
          loading ? 'bg-gray-400' : 'bg-green-600'
        }`}
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

      <Text className='text-xs text-gray-500'>
        Current: {(currentStrength * 100).toFixed(1)}%
      </Text>
    </View>
  );
}
