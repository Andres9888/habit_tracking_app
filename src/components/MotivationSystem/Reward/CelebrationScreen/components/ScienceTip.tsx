/**
 * ScienceTip - Educational tip about habit formation science
 */

import React from 'react';
import { View, Text } from 'react-native';

export function ScienceTip() {
  return (
    <View className='mt-4 rounded-xl bg-stone-100 p-3'>
      <Text className='text-center text-xs italic text-stone-600'>
        💡 BJ Fogg (Stanford): Celebration immediately after a behavior is the
        most powerful way to wire a new habit.
      </Text>
    </View>
  );
}
