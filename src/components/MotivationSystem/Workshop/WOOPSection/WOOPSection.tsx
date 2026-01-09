/**
 * WOOPSection Component
 * Displays and allows editing of the WOOP (Wish-Outcome-Obstacle-Plan) framework
 *
 * Scientific Basis:
 * - Gabriele Oettingen (NYU): 20+ peer-reviewed studies
 * - Mental contrasting + implementation intentions = 2x goal achievement
 */

import React, { useCallback, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { HelpCircle, Plus, Pencil } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { CompletionCheckmark } from '../../../animations';
import { SectionCard } from './SectionCard';
import { AnimatedSection } from './AnimatedSection';
import { WOOPField } from './WOOPField';
import { WOOPExplainerModal } from './WOOPExplainerModal';
import { hasWOOPData, isWOOPComplete } from './woopUtils';
import type { WOOPSectionProps } from './WOOPSection.types';

export function WOOPSection({
  woop,
  onPress,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 3,
}: WOOPSectionProps) {
  const [showExplainer, setShowExplainer] = useState(false);

  const hasWoop = hasWOOPData(woop);
  const isComplete = isWOOPComplete(woop);

  const handleHelpPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowExplainer(true);
  }, []);

  return (
    <>
      <AnimatedSection
        index={sectionIndex}
        reduceMotion={reduceMotion}
        shouldAnimate={shouldAnimate}
      >
        <SectionCard
          accessibilityLabel={
            hasWoop ? 'Edit your WOOP plan' : 'Add your WOOP plan'
          }
          onPress={onPress}
        >
          {/* Header row */}
          <View className='mb-2 flex-row items-center justify-between'>
            <View className='flex-row items-center gap-2'>
              <Text className='text-base'>🎯</Text>
              <Text className='text-xs font-semibold text-stone-800'>
                WOOP Plan
              </Text>
            </View>
            <View className='flex-row items-center gap-2'>
              <Pressable
                accessibilityLabel='Learn about WOOP'
                className='h-6 w-6 items-center justify-center rounded-full'
                hitSlop={8}
                onPress={handleHelpPress}
              >
                <HelpCircle className='text-stone-400' size={16} />
              </Pressable>
              {hasWoop ? (
                <Pencil className='text-stone-400' size={14} />
              ) : (
                <View className='flex-row items-center gap-1'>
                  <Plus className='text-stone-600' size={12} />
                  <Text className='text-xs font-medium text-stone-600'>
                    Set up
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Content */}
          {hasWoop ? (
            <View className='gap-1.5'>
              <WOOPField
                label='Wish'
                letter='W'
                letterColorClass='text-amber-500'
                value={woop?.wish}
              />
              <WOOPField
                label='Outcome'
                letter='O'
                letterColorClass='text-amber-500'
                value={woop?.outcome}
              />
              <WOOPField
                label='Obstacle'
                letter='O'
                letterColorClass='text-rose-500'
                value={woop?.obstacle}
              />
              <WOOPField
                isBold
                label='Plan'
                letter='P'
                letterColorClass='text-emerald-500'
                value={woop?.plan}
                valueColorClass='text-stone-900'
              />
            </View>
          ) : (
            <Text className='text-sm text-stone-500'>
              Wish-Outcome-Obstacle-Plan framework
            </Text>
          )}

          {/* Completion checkmark */}
          <CompletionCheckmark
            isVisible={isComplete}
            reduceMotion={reduceMotion}
            sectionIndex={sectionIndex}
            shouldAnimate={shouldAnimate}
          />
        </SectionCard>
      </AnimatedSection>

      <WOOPExplainerModal
        visible={showExplainer}
        onClose={() => setShowExplainer(false)}
      />
    </>
  );
}

export default WOOPSection;
