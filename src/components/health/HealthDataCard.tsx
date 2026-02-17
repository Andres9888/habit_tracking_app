/**
 * HealthDataCard - Display health metrics on habit detail screen
 * Created by: Sonnet (Claude Sonnet 4.5)
 */

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { AppleHealthIcon } from '@/components/icons/AppleHealthIcon';
import { useHealthData } from '@/hooks/useHealthData';

interface HealthDataCardProps {
  habitName: string;
  enabled?: boolean;
}

export function HealthDataCard({ habitName, enabled = true }: HealthDataCardProps) {
  const { data, isLoading, error } = useHealthData({ habitName, enabled });

  if (!enabled || (!data && !isLoading)) {
    return null;
  }

  if (isLoading) {
    return (
      <View className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
        <View className="flex-row items-center gap-2">
          <AppleHealthIcon size={20} />
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Loading health data...
          </Text>
          <ActivityIndicator size="small" />
        </View>
      </View>
    );
  }

  if (error || !data) {
    return null;
  }

  const isComplete = data.percentage >= 100;
  const progressColor = isComplete ? 'bg-green-500' : 'bg-blue-500';
  const textColor = isComplete ? 'text-green-600' : 'text-blue-600';

  return (
    <View className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <AppleHealthIcon size={20} />
          <Text className="text-sm font-semibold text-gray-900 dark:text-white">
            Apple Health
          </Text>
        </View>
        {isComplete && (
          <Text className="text-xs font-medium text-green-600">✓ Goal reached</Text>
        )}
      </View>

      {/* Progress Bar */}
      <View className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <View
          className={`h-full ${progressColor}`}
          style={{ width: `${data.percentage}%` }}
        />
      </View>

      {/* Stats */}
      <View className="flex-row items-baseline gap-1">
        <Text className={`text-2xl font-bold ${textColor} dark:text-blue-400`}>
          {formatValue(data.current, data.unit)}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          / {formatValue(data.goal, data.unit)}
        </Text>
      </View>

      {/* Type label */}
      <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {getTypeLabel(data.type)}
      </Text>
    </View>
  );
}

function formatValue(value: number, unit: string): string {
  if (unit === 'steps') {
    return value.toLocaleString();
  }
  if (unit === 'hours') {
    return `${value.toFixed(1)}h`;
  }
  if (unit === 'minutes') {
    return `${Math.round(value)}m`;
  }
  if (unit === 'workouts') {
    return `${value}`;
  }
  return String(value);
}

function getTypeLabel(type: string | null): string {
  switch (type) {
    case 'steps':
      return 'From step counter';
    case 'sleep':
      return 'From sleep analysis';
    case 'workout':
      return 'From workouts';
    default:
      return 'From HealthKit';
  }
}
