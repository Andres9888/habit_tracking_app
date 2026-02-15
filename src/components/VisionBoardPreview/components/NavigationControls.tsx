/**
 * NavigationControls Component
 * Bottom navigation with prev/next buttons and dots indicator
 */

import React from 'react';
import { View, Pressable } from 'react-native';

import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import type { NavigationControlsProps } from '../VisionBoardPreview.types';

export function NavigationControls({
  currentIndex,
  itemCount,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  bottomPadding,
}: NavigationControlsProps) {
  return (
    <View
      className='flex-row items-center justify-between px-5 pb-4'
      style={{ paddingBottom: bottomPadding }}
    >
      {/* Previous */}
      <Pressable
        accessibilityLabel='Previous card'
        accessibilityRole='button'
        className={`h-12 w-12 items-center justify-center rounded-full ${
          hasPrev ? 'bg-white/10 active:bg-white/20' : 'opacity-30'
        }`}
        disabled={!hasPrev}
        onPress={onPrev}
      >
        <ChevronLeft className='text-white' size={24} />
      </Pressable>

      {/* Dots indicator */}
      <View className='flex-row items-center gap-2'>
        {Array.from({ length: itemCount }).map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full ${
              index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </View>

      {/* Next */}
      <Pressable
        accessibilityLabel='Next card'
        accessibilityRole='button'
        className={`h-12 w-12 items-center justify-center rounded-full ${
          hasNext ? 'bg-white/10 active:bg-white/20' : 'opacity-30'
        }`}
        disabled={!hasNext}
        onPress={onNext}
      >
        <ChevronRight className='text-white' size={24} />
      </Pressable>
    </View>
  );
}
