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
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../../theme/ThemeContext';
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
  const { colors } = useThemeColors();
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
        className='border-l-4'
        style={{ borderLeftColor: colors.status.premium }}
        onPress={onPress}
      >
        {/* Header row: icon + title on left, action on right */}
        <View className='mb-1.5 flex-row items-center justify-between'>
          <View className='flex-row items-center gap-2'>
            <Text className='text-base'>🎭</Text>
            <Text className='text-xs font-semibold' style={{ color: colors.status.premiumText }}>
              Identity Statement
            </Text>
          </View>
          {hasIdentity ? (
            <Pencil color={colors.text.tertiary} size={iconSizes.small} />
          ) : (
            <View className='flex-row items-center gap-1'>
              <Plus color={colors.status.premiumText} size={iconSizes.small} />
              <Text className='text-xs font-medium' style={{ color: colors.status.premiumText }}>
                Set up
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        {hasIdentity ? (
          <>
            <Text className='text-sm font-semibold' style={{ color: colors.text.primary }}>
              "{formattedIdentity}"
            </Text>
            <Text className='mt-1 text-xs' style={{ color: colors.text.secondary }}>
              Not "I run" — who you ARE
            </Text>
          </>
        ) : (
          <Text className='text-sm' style={{ color: colors.text.secondary }}>
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
