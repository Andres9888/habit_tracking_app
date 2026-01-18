/**
 * Visualization cards for mental contrasting exercise summary
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Sun, CloudRain, Brain } from 'lucide-react-native';

interface VisualizationCardsProps {
  positiveVisualization: string;
  negativeVisualization: string;
}

export function VisualizationCards({
  positiveVisualization,
  negativeVisualization,
}: VisualizationCardsProps) {
  return (
    <View className='gap-4 pb-4'>
      {/* Positive */}
      <View className='rounded-2xl border border-emerald-200 bg-emerald-50 p-4'>
        <View className='mb-3 flex-row items-center gap-2'>
          <Sun className='text-emerald-600' size={18} />
          <Text className='text-sm font-semibold text-emerald-800'>
            Success Vision
          </Text>
        </View>
        <Text className='text-sm leading-relaxed text-emerald-900'>
          "{positiveVisualization}"
        </Text>
      </View>

      {/* Negative */}
      <View className='rounded-2xl border border-rose-200 bg-rose-50 p-4'>
        <View className='mb-3 flex-row items-center gap-2'>
          <CloudRain className='text-rose-600' size={18} />
          <Text className='text-sm font-semibold text-rose-800'>
            Failure Consequences
          </Text>
        </View>
        <Text className='text-sm leading-relaxed text-rose-900'>
          "{negativeVisualization}"
        </Text>
      </View>

      {/* Insight */}
      <View className='rounded-2xl bg-violet-50 p-4'>
        <View className='flex-row items-start gap-2'>
          <Brain className='mt-0.5 text-violet-500' size={16} />
          <View className='flex-1'>
            <Text className='text-sm font-semibold text-violet-800'>
              Mental Contrasting Complete
            </Text>
            <Text className='mt-1 text-xs leading-relaxed text-violet-700'>
              By holding both visions in mind, you've created a productive
              tension that drives action. Review these visualizations when
              motivation dips.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
