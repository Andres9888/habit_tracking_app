/**
 * InfoCallouts Component
 * Information callouts for schedule preview and science tips
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles } from 'lucide-react-native';

interface NextDeliveryPreviewProps {
  nextDelivery: string | null;
}

export function NextDeliveryPreview({
  nextDelivery,
}: NextDeliveryPreviewProps) {
  if (!nextDelivery) return null;

  return (
    <View className='mb-6 flex-row items-center gap-2 rounded-xl bg-emerald-50 p-3'>
      <Sparkles className='text-emerald-500' size={16} />
      <Text className='flex-1 text-sm text-emerald-700'>
        Next delivery: <Text className='font-medium'>{nextDelivery}</Text>
      </Text>
    </View>
  );
}

export function ScienceCallout() {
  return (
    <View className='flex-row items-start gap-2 rounded-xl bg-amber-50 p-3'>
      <Sparkles className='mt-0.5 text-amber-500' size={16} />
      <Text className='flex-1 text-xs leading-relaxed text-amber-700'>
        Morning affirmations have been shown to improve mood and focus
        throughout the day. Consistency is key for building neural pathways.
      </Text>
    </View>
  );
}

interface AffirmationPreviewProps {
  text: string;
}

export function AffirmationPreview({ text }: AffirmationPreviewProps) {
  return (
    <View className='mb-6 rounded-xl bg-amber-50 p-4'>
      <Text className='text-sm font-medium italic text-amber-800'>
        "{text}"
      </Text>
    </View>
  );
}
