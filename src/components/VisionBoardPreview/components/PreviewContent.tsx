/**
 * PreviewContent Component
 * Main content area showing the vision board item
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import type { PreviewContentProps } from '../VisionBoardPreview.types';

export function PreviewContent({ item }: PreviewContentProps) {
  return (
    <View className='flex-1 justify-center px-6'>
      <View className='rounded-3xl bg-white/10 p-6 backdrop-blur-lg'>
        {/* Title */}
        <Text className='mb-4 text-center text-2xl font-bold tracking-tight text-white'>
          {item.title}
        </Text>

        {/* Body */}
        {item.body && (
          <ScrollView className='max-h-80' showsVerticalScrollIndicator={false}>
            <Text className='text-center text-lg leading-7 text-white/90'>
              {item.body}
            </Text>
          </ScrollView>
        )}

        {/* Created date */}
        <Text className='mt-6 text-center text-xs text-white/50'>
          Created{' '}
          {new Date(item.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      </View>

      {/* Swipe hint */}
      <Text className='mt-6 text-center text-sm text-white/40'>
        Swipe down to close • Swipe left/right to navigate
      </Text>
    </View>
  );
}
