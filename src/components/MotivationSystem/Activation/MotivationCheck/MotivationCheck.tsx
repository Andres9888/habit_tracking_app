/**
 * MotivationCheck Component
 *
 * Pre-habit motivation level check with emoji selection.
 * Asks "How motivated are you?" with 3 emoji options that trigger
 * different visualization paths based on Huberman's dual visualization protocol.
 *
 * @see docs/specs/motivation-system/activation-flow.md
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { HelpCircle, Sparkles } from 'lucide-react-native';
import { clsx } from 'clsx';

import type { MotivationCheckProps } from './types';
import { MOTIVATION_OPTIONS, getAccentColor } from './constants';
import { MotivationButton } from './MotivationButton';

export function MotivationCheck({
  selectedLevel,
  onSelectLevel,
  reduceMotion = false,
  showExplainer = true,
  onExplainerPress,
  className,
  compact = false,
}: MotivationCheckProps) {
  if (compact) {
    return (
      <View className={clsx('flex-row items-center justify-around', className)}>
        {MOTIVATION_OPTIONS.map((opt) => (
          <MotivationButton
            key={opt.level}
            accentColor={getAccentColor(opt.level)}
            emoji={opt.emoji}
            isSelected={selectedLevel === opt.level}
            label={opt.label}
            reduceMotion={reduceMotion}
            onPress={() => onSelectLevel(opt.level)}
          />
        ))}
      </View>
    );
  }

  return (
    <View className={clsx('rounded-2xl bg-violet-50 p-4', className)}>
      {/* Header */}
      <View className='mb-4 flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg bg-violet-100'>
            <Sparkles className='text-violet-600' size={16} />
          </View>
          <Text className='font-semibold text-violet-800'>
            Motivation Check
          </Text>
        </View>
        {showExplainer && onExplainerPress && (
          <Pressable
            accessibilityHint='Learn what motivation check is and how it works'
            accessibilityLabel='Learn about motivation check'
            accessibilityRole='button'
            className='h-8 w-8 items-center justify-center rounded-lg'
            onPress={onExplainerPress}
          >
            <HelpCircle className='text-violet-400' size={18} />
          </Pressable>
        )}
      </View>

      <Text className='mb-4 text-center text-base text-violet-700'>
        How motivated are you right now?
      </Text>

      <View className='flex-row items-center justify-around'>
        {MOTIVATION_OPTIONS.map((opt) => (
          <MotivationButton
            key={opt.level}
            accentColor={getAccentColor(opt.level)}
            emoji={opt.emoji}
            isSelected={selectedLevel === opt.level}
            label={opt.label}
            reduceMotion={reduceMotion}
            onPress={() => onSelectLevel(opt.level)}
          />
        ))}
      </View>

      {selectedLevel && selectedLevel !== 'ready' && (
        <View className='mt-4 rounded-xl bg-violet-100/50 p-3'>
          <Text className='text-center text-xs italic text-violet-600'>
            💡 Science tip: Visualizing consequences moves you 2x better when
            motivation is low
          </Text>
        </View>
      )}
    </View>
  );
}

export default MotivationCheck;
