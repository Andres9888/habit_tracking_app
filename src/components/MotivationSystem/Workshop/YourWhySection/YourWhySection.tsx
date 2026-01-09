/**
 * YourWhySection Component
 * Displays and allows editing of the user's "why" statement for a habit
 *
 * Part of the Motivation System Workshop tab
 * Story T1.2-T1.5: Create YourWhySection component with empty/filled states
 *
 * Scientific Basis:
 * - Self-Determination Theory (Deci & Ryan): Intrinsic motivation from personal meaning
 * - Noom clinical studies: Users with defined purpose show 3x higher retention
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Plus, Pencil } from 'lucide-react-native';
import { CompletionCheckmark } from '../../animations';
import { SectionCard } from '../CueTriggerSection/SectionCard';
import { AnimatedSection } from '../CueTriggerSection/AnimatedSection';
import type { YourWhySectionProps } from './types';

/**
 * YourWhySection - Main component
 *
 * Displays the user's "why" statement with:
 * - Empty state: Pulsing heart icon with "Set up" CTA
 * - Filled state: Rose-tinted card with the why statement in quotes
 * - Completion checkmark when filled
 * - Rose accent color (border-l-rose-400)
 */
export function YourWhySection({
  why,
  onPress,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 0,
}: YourWhySectionProps) {
  const hasWhy = !!why;

  return (
    <AnimatedSection
      index={sectionIndex}
      reduceMotion={reduceMotion}
      shouldAnimate={shouldAnimate}
    >
      <SectionCard
        accessibilityLabel={hasWhy ? 'Edit your why' : 'Add your why'}
        className='border-l-4 border-l-rose-400'
        onPress={onPress}
      >
        {/* Header row: icon + title on left, action on right */}
        <View className='mb-1.5 flex-row items-center justify-between'>
          <View className='flex-row items-center gap-2'>
            <Text className='text-base'>❤️</Text>
            <Text className='text-xs font-semibold text-rose-600'>
              Your Why
            </Text>
          </View>
          {hasWhy ? (
            <Pencil className='text-stone-400' size={14} />
          ) : (
            <View className='flex-row items-center gap-1'>
              <Plus className='text-rose-600' size={12} />
              <Text className='text-xs font-medium text-rose-600'>Set up</Text>
            </View>
          )}
        </View>

        {/* Content */}
        {hasWhy ? (
          <Text className='text-sm italic leading-relaxed text-stone-700'>
            "{why}"
          </Text>
        ) : (
          <Text className='text-sm text-stone-500'>
            Define your deeper motivation
          </Text>
        )}

        {/* Completion checkmark */}
        <CompletionCheckmark
          isVisible={hasWhy}
          reduceMotion={reduceMotion}
          sectionIndex={sectionIndex}
          shouldAnimate={shouldAnimate}
        />
      </SectionCard>
    </AnimatedSection>
  );
}

export default YourWhySection;
