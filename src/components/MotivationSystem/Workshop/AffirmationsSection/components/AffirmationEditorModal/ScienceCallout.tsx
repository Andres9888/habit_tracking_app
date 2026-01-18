/**
 * ScienceCallout Component
 * Educational callout about self-affirmation science
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles } from 'lucide-react-native';

export function ScienceCallout() {
  return (
    <View className='mb-4 flex-row items-start gap-2 rounded-xl bg-amber-50 p-3'>
      <Sparkles className='mt-0.5 text-amber-500' size={16} />
      <Text className='flex-1 text-xs leading-relaxed text-amber-700'>
        Self-affirmations reduce stress and defensiveness while enhancing
        openness to change. Repeat them daily for best results.
      </Text>
    </View>
  );
}
