/**
 * AffirmationsActionButtons Component
 * Add/Generate buttons for the affirmations section
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { Plus, Sparkles } from 'lucide-react-native';

import { GenerateAffirmationsButton } from '../../GenerateAffirmationsButton';

interface AffirmationsActionButtonsProps {
  hasAffirmations: boolean;
  canAddMore: boolean;
  isPremium: boolean;
  affirmationCount: number;
  hasHabitContext: boolean;
  isGenerating: boolean;
  reduceMotion: boolean;
  onOpenEditor: () => void;
  onGenerateAffirmations?: () => Promise<void>;
  onPremiumRequired: () => void;
}

export function AffirmationsActionButtons({
  hasAffirmations,
  canAddMore,
  isPremium,
  affirmationCount,
  hasHabitContext,
  isGenerating,
  reduceMotion,
  onOpenEditor,
  onGenerateAffirmations,
  onPremiumRequired,
}: AffirmationsActionButtonsProps) {
  // Action buttons when affirmations exist
  if (hasAffirmations && canAddMore) {
    return (
      <View className='mt-4 gap-3'>
        {onGenerateAffirmations && (
          <GenerateAffirmationsButton
            currentCount={affirmationCount}
            hasHabitContext={hasHabitContext}
            isGenerating={isGenerating}
            isPremium={isPremium}
            maxCount={10}
            reduceMotion={reduceMotion}
            variant='full'
            onGenerate={onGenerateAffirmations}
            onPremiumRequired={onPremiumRequired}
          />
        )}
        <View className='items-center'>
          <Pressable
            accessibilityLabel='Add a new affirmation'
            accessibilityRole='button'
            className='flex-row items-center gap-2 rounded-full bg-amber-500 px-4 py-2'
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            onPress={onOpenEditor}
          >
            <Plus className='text-white' size={16} />
            <Text className='font-medium text-white'>Add Manually</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Empty state AI Generate button
  if (!hasAffirmations && onGenerateAffirmations) {
    return (
      <View className='mt-4 gap-3'>
        <GenerateAffirmationsButton
          currentCount={affirmationCount}
          hasHabitContext={hasHabitContext}
          isGenerating={isGenerating}
          isPremium={isPremium}
          maxCount={10}
          reduceMotion={reduceMotion}
          variant='full'
          onGenerate={onGenerateAffirmations}
          onPremiumRequired={onPremiumRequired}
        />
      </View>
    );
  }

  // Premium upsell when at limit
  if (hasAffirmations && !canAddMore) {
    return (
      <View className='mt-4 items-center'>
        <Pressable
          accessibilityLabel='Upgrade to add more affirmations'
          accessibilityRole='button'
          className='flex-row items-center gap-2 rounded-full bg-stone-100 px-4 py-2'
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          onPress={onPremiumRequired}
        >
          <Sparkles className='text-amber-500' size={16} />
          <Text className='font-medium text-stone-600'>
            Upgrade for Unlimited
          </Text>
        </Pressable>
      </View>
    );
  }

  return null;
}
