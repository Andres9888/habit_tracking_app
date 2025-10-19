/**
 * Temporary component to initialize habit strength for all existing habits
 * Add this to your App.tsx temporarily, run once, then remove it
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function InitializeHabitStrength() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [result, setResult] = useState<{
    total: number;
    updated: number;
    processed: number;
    failed: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const habits = useQuery(api.habits.list);
  const recalculate = useMutation(api.habitStrength.recalculateHabitStrength);

  const handleInitialize = async () => {
    if (!habits || habits.length === 0) {
      setError('No habits found');
      return;
    }

    setIsInitializing(true);
    setError(null);
    let updated = 0;
    let failed = 0;

    try {
      for (const habit of habits) {
        try {
          await recalculate({ habitId: habit._id });
          updated++;
          console.log(`✓ Initialized: ${habit.name}`);
        } catch (error_) {
          console.error(`✗ Failed: ${habit.name}`, error_);
          failed++;
        }
      }

      setResult({
        failed,
        processed: habits.length,
        total: habits.length,
        updated,
      });
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Unknown error');
    } finally {
      setIsInitializing(false);
    }
  };

  if (!habits) {
    return (
      <View className='items-center justify-center p-4'>
        <ActivityIndicator size='large' />
        <Text className='mt-2 text-sm text-gray-600'>Loading habits...</Text>
      </View>
    );
  }

  return (
    <View className='m-4 rounded-lg border border-blue-300 bg-blue-50 p-4'>
      <Text className='mb-2 text-lg font-bold text-blue-900'>
        🚀 Initialize Habit Strength
      </Text>

      <Text className='mb-3 text-sm text-blue-800'>
        Found {habits.length} habit{habits.length === 1 ? '' : 's'}. This will
        calculate habit strength from your tracking history.
      </Text>

      {!result && !error && (
        <Pressable
          className={`rounded-lg px-4 py-3 ${
            isInitializing ? 'bg-blue-300' : 'bg-blue-500'
          }`}
          disabled={isInitializing}
          onPress={handleInitialize}
        >
          {isInitializing ? (
            <View className='flex-row items-center justify-center gap-2'>
              <ActivityIndicator color='white' />
              <Text className='font-semibold text-white'>
                Initializing... ({habits.length} habits)
              </Text>
            </View>
          ) : (
            <Text className='text-center font-semibold text-white'>
              Initialize Now
            </Text>
          )}
        </Pressable>
      )}

      {result && (
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
            <Text className='text-sm text-red-600'>
              • Failed: {result.failed}
            </Text>
          )}
          <Text className='mt-2 text-xs text-green-700'>
            You can now remove this component from your App.tsx
          </Text>
        </View>
      )}

      {error && (
        <View className='mt-3 rounded-lg bg-red-100 p-3'>
          <Text className='font-semibold text-red-900'>❌ Error</Text>
          <Text className='mt-1 text-sm text-red-800'>{error}</Text>
        </View>
      )}

      <Text className='mt-3 text-xs text-gray-600'>
        💡 Tip: After initialization, habit strength will update automatically
        when you check off habits.
      </Text>
    </View>
  );
}
