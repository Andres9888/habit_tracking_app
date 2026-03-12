/**
 * InitializeHabitStrength - Temporary component to initialize habit strength
 */

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { InitializeHabitStrengthSkeleton } from '../SkeletonLoader';
import { InitializeButton } from './InitializeButton';
import { ResultDisplay } from './ResultDisplay';

type Result = {
  total: number;
  updated: number;
  processed: number;
  failed: number;
};

export function InitializeHabitStrength() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
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
        } catch {
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
    return <InitializeHabitStrengthSkeleton />;
  }

  return (
    <View className='m-4 rounded-lg border border-blue-300 bg-blue-50 p-4'>
      <Text className='mb-2 text-lg font-bold text-blue-900'>
        🚀 Initialize Habit Strength
      </Text>
      <Text className='mb-3 text-sm text-blue-800'>
        Found {habits.length} habit{habits.length === 1 ? '' : 's'}.
      </Text>

      {!result && !error ? <InitializeButton
          habitCount={habits.length}
          isInitializing={isInitializing}
          onPress={handleInitialize}
        /> : null}

      {result ? <ResultDisplay result={result} /> : null}

      {error ? <View className='mt-3 rounded-lg bg-red-100 p-3'>
          <Text className='font-semibold text-red-900'>❌ Error</Text>
          <Text className='mt-1 text-sm text-red-800'>{error}</Text>
        </View> : null}

      <Text className='mt-3 text-xs text-stone-600'>
        💡 Tip: After initialization, habit strength updates automatically.
      </Text>
    </View>
  );
}
