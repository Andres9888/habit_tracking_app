/**
 * InitializeHabitStrength - Temporary component to initialize habit strength
 */

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
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
  const { colors: themeColors } = useThemeColors();
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
    <View className='m-4 rounded-lg border p-4' style={{ borderColor: themeColors.status.info, backgroundColor: themeColors.status.infoLight }}>
      <Text className='mb-2 text-lg font-bold' style={{ color: themeColors.status.infoText }}>
        🚀 Initialize Habit Strength
      </Text>
      <Text className='mb-3 text-sm' style={{ color: themeColors.status.infoText }}>
        Found {habits.length} habit{habits.length === 1 ? '' : 's'}.
      </Text>

      {!result && !error ? <InitializeButton
          habitCount={habits.length}
          isInitializing={isInitializing}
          onPress={handleInitialize}
        /> : null}

      {result ? <ResultDisplay result={result} /> : null}

      {error ? <View className='mt-3 rounded-lg p-3' style={{ backgroundColor: themeColors.status.errorLight }}>
          <Text className='font-semibold' style={{ color: themeColors.status.errorText }}>❌ Error</Text>
          <Text className='mt-1 text-sm' style={{ color: themeColors.status.errorText }}>{error}</Text>
        </View> : null}

      <Text className='mt-3 text-xs' style={{ color: themeColors.text.primary }}>
        💡 Tip: After initialization, habit strength updates automatically.
      </Text>
    </View>
  );
}
