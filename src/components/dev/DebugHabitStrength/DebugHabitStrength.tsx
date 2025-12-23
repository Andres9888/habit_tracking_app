/**
 * Debug component to inspect habit strength values
 * Add this temporarily to App.tsx to see what's happening
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function DebugHabitStrength() {
  const habits = useQuery(api.habits.list);

  if (!habits) {
    return (
      <View className='rounded-lg border border-yellow-300 bg-yellow-50 p-4'>
        <Text className='font-bold text-yellow-900'>Loading...</Text>
      </View>
    );
  }

  if (habits.length === 0) {
    return (
      <View className='rounded-lg border border-yellow-300 bg-yellow-50 p-4'>
        <Text className='font-bold text-yellow-900'>No habits found</Text>
      </View>
    );
  }

  return (
    <ScrollView className='max-h-96 rounded-lg border-2 border-purple-500 bg-purple-50 p-4'>
      <Text className='mb-3 text-lg font-bold text-purple-900'>
        🔍 Debug: Habit Strength Values
      </Text>

      {habits.map((habit) => (
        <View key={habit._id} className='mb-4 rounded-lg bg-white p-3'>
          <Text className='font-semibold text-stone-900'>{habit.name}</Text>

          <View className='mt-2 space-y-1'>
            <Text className='text-sm'>
              <Text className='font-medium'>Strength: </Text>
              {habit.strength === undefined ? (
                <Text className='text-red-600'>
                  undefined ⚠️ Schema not deployed
                </Text>
              ) : (
                <Text
                  className={
                    habit.strength === 0 ? 'text-red-600' : 'text-green-600'
                  }
                >
                  {(habit.strength * 100).toFixed(1)}%
                  {habit.strength === 0 && ' ⚠️ Not initialized'}
                </Text>
              )}
            </Text>

            <Text className='text-sm'>
              <Text className='font-medium'>Level: </Text>
              {habit.strengthLevel || 'not set'}
            </Text>

            <Text className='text-sm'>
              <Text className='font-medium'>Last Updated: </Text>
              {habit.strengthUpdatedAt
                ? new Date(habit.strengthUpdatedAt).toLocaleString()
                : 'never'}
            </Text>

            <Text className='text-sm'>
              <Text className='font-medium'>Parameters: </Text>
              HDP={habit.habitDecayParam ?? 'default'}, HGP=
              {habit.habitGainParam ?? 'default'}
            </Text>
          </View>

          {habit.strength === undefined && (
            <View className='mt-2 rounded bg-red-100 p-2'>
              <Text className='text-xs text-red-800'>
                ❌ Schema field missing! Run: npx convex dev
              </Text>
            </View>
          )}

          {habit.strength === 0 && !habit.strengthUpdatedAt && (
            <View className='mt-2 rounded bg-yellow-100 p-2'>
              <Text className='text-xs text-yellow-800'>
                ⚠️ Needs initialization! Click "Initialize Now" at top
              </Text>
            </View>
          )}

          {habit.strength === 0 && habit.strengthUpdatedAt && (
            <View className='mt-2 rounded bg-blue-100 p-2'>
              <Text className='text-xs text-blue-800'>
                💡 Initialized but at 0%. Toggle this habit to see it increase!
              </Text>
            </View>
          )}
        </View>
      ))}

      <View className='mt-4 rounded-lg bg-stone-100 p-3'>
        <Text className='text-xs text-stone-700'>
          <Text className='font-bold'>How to fix:</Text>
          {'\n'}1. Make sure Convex is running (npx convex dev)
          {'\n'}2. Click "Initialize Now" button at top of app
          {'\n'}3. Toggle a habit on/off to see strength update
          {'\n'}4. Remove this debug component when working
        </Text>
      </View>
    </ScrollView>
  );
}
