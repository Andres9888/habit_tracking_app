/**
 * CueTriggerSection Component
 *
 * Scientific Basis:
 * - Charles Duhigg's Habit Loop: Cue → Routine → Reward
 * - Implementation intentions double follow-through (Gollwitzer, 1999)
 * - "After I [cue], I will [habit]" - creates automatic trigger
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Plus, Pencil } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { CompletionCheckmark } from '../../../animations';
import { SectionCard } from './SectionCard';
import { AnimatedSection } from './AnimatedSection';
import { CueField } from './CueField';
import { hasCueData } from './utils';
import type { CueTriggerSectionProps } from './types';

export function CueTriggerSection({
  cue,
  onPress,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 2,
}: CueTriggerSectionProps) {
  const { colors } = useThemeColors();
  const hasCue = hasCueData(cue);

  return (
    <AnimatedSection
      index={sectionIndex}
      reduceMotion={reduceMotion}
      shouldAnimate={shouldAnimate}
    >
      <SectionCard
        accessibilityLabel={hasCue ? 'Edit your cue' : 'Add your cue'}
        className='border-l-4 border-l-sky-400'
        onPress={onPress}
      >
        {/* Header row: icon + title on left, action on right */}
        <View className='mb-2 flex-row items-center justify-between'>
          <View className='flex-row items-center gap-2'>
            <Text className='text-base'>🔔</Text>
            <Text className='text-xs font-semibold text-sky-600'>
              Cue / Trigger
            </Text>
          </View>
          {hasCue ? (
            <Pencil color={colors.text.tertiary} size={iconSizes.small} />
          ) : (
            <View className='flex-row items-center gap-1'>
              <Plus className='text-sky-600' size={iconSizes.small} />
              <Text className='text-xs font-medium text-sky-600'>Set up</Text>
            </View>
          )}
        </View>

        {/* Content */}
        {hasCue ? (
          <View className='gap-1.5'>
            {cue?.time ? <CueField emoji='⏰' label='When' value={cue.time} /> : null}
            {cue?.location ? <CueField emoji='📍' label='Where' value={cue.location} /> : null}
            {cue?.afterBehavior ? <CueField emoji='⚡' label='After' value={cue.afterBehavior} /> : null}
          </View>
        ) : (
          <Text className='text-sm' style={{ color: colors.text.secondary }}>
            When, where, and after what
          </Text>
        )}

        {/* Completion checkmark */}
        <CompletionCheckmark
          isVisible={hasCue}
          reduceMotion={reduceMotion}
          sectionIndex={sectionIndex}
          shouldAnimate={shouldAnimate}
        />
      </SectionCard>
    </AnimatedSection>
  );
}

export default CueTriggerSection;
