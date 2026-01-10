/**
 * IdentitySection Component
 * Displays and allows editing of the user's identity statement for a habit
 *
 * Part of the Motivation System Workshop tab
 * Story T2.2-T2.5: Create IdentitySection component with "I am a..." prefix
 *
 * Scientific Basis:
 * - James Clear's Atomic Habits (10M+ copies): Identity precedes behavior
 * - Research shows identity-based habits have 2x persistence vs outcome-based
 * - "I am a runner" vs "I run" - identity creates intrinsic motivation
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Plus, Pencil } from 'lucide-react-native';
import { CompletionCheckmark } from '../../../animations';
import { SectionCard } from '../CueTriggerSection/SectionCard';
import { AnimatedSection } from '../CueTriggerSection/AnimatedSection';
import type { IdentitySectionProps } from './types';

/**
 * IdentitySection - Main component
 *
 * Displays the user's identity statement with:
 * - Empty state: Pulsing user icon with "Set up" CTA
 * - Filled state: Indigo-tinted card with "I am a..." statement
 * - Completion checkmark when filled
 * - Indigo accent color (border-l-indigo-400)
 * - Explanatory text: "Not 'I run' — who you ARE"
 */
export function IdentitySection({
  identity,
  onPress,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 1,
}: IdentitySectionProps) {
  const hasIdentity = !!identity;

  // Format identity with "I am a" prefix if not already present
  const formattedIdentity = hasIdentity
    ? identity.toLowerCase().startsWith('i am')
      ? identity
      : `I am a ${identity}`
    : '';

  return (
    <AnimatedSection
      index={sectionIndex}
      reduceMotion={reduceMotion}
      shouldAnimate={shouldAnimate}
    >
      <SectionCard
        accessibilityLabel={
          hasIdentity ? 'Edit your identity' : 'Add your identity'
        }
        className='border-l-4 border-l-indigo-400'
        onPress={onPress}
      >
        {/* Header row: icon + title on left, action on right */}
        <View className='mb-1.5 flex-row items-center justify-between'>
          <View className='flex-row items-center gap-2'>
            <Text className='text-base'>🎭</Text>
            <Text className='text-xs font-semibold text-indigo-600'>
              Identity Statement
            </Text>
          </View>
          {hasIdentity ? (
            <Pencil className='text-stone-400' size={14} />
          ) : (
            <View className='flex-row items-center gap-1'>
              <Plus className='text-indigo-600' size={12} />
              <Text className='text-xs font-medium text-indigo-600'>
                Set up
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        {hasIdentity ? (
          <>
            <Text className='text-sm font-semibold text-stone-900'>
              "{formattedIdentity}"
            </Text>
            <Text className='mt-1 text-xs text-stone-500'>
              Not "I run" — who you ARE
            </Text>
          </>
        ) : (
          <Text className='text-sm text-stone-500'>
            Define who you're becoming
          </Text>
        )}

        {/* Completion checkmark */}
        <CompletionCheckmark
          isVisible={hasIdentity}
          reduceMotion={reduceMotion}
          sectionIndex={sectionIndex}
          shouldAnimate={shouldAnimate}
        />
      </SectionCard>
    </AnimatedSection>
  );
}

export default IdentitySection;
