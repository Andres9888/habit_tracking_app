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
import { iconSizes } from '@/theme/iconSizes';
import { clsx } from 'clsx';
import { useThemeColors } from '@/theme/ThemeContext';

import { MotivationButton } from './MotivationButton';
import { MOTIVATION_OPTIONS, getAccentColor } from './constants';
import type { MotivationCheckProps } from './types';

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

  const { colors } = useThemeColors();

  return (
    <View className={clsx('rounded-2xl p-4', className)} style={{ backgroundColor: colors.status.premiumLight }}>
      {/* Header */}
      <View className='mb-4 flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-lg' style={{ backgroundColor: colors.status.premiumLight }}>
            <Sparkles color={colors.status.premiumText} size={iconSizes.small} />
          </View>
          <Text className='font-semibold' style={{ color: colors.status.premiumText }}>
            Motivation Check
          </Text>
        </View>
        {showExplainer && onExplainerPress ? <Pressable
            accessibilityHint='Learn what motivation check is and how it works'
            accessibilityLabel='Learn about motivation check'
            accessibilityRole='button'
            className='h-8 w-8 items-center justify-center rounded-lg'
            onPress={onExplainerPress}
          >
            <HelpCircle color={colors.status.premium} size={iconSizes.medium} />
          </Pressable> : null}
      </View>

      <Text className='mb-4 text-center text-base' style={{ color: colors.status.premiumText }}>
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

      {selectedLevel && selectedLevel !== 'ready' ? <View className='mt-4 rounded-xl p-3' style={{ backgroundColor: colors.status.premiumLight }}>
          <Text className='text-center text-xs italic' style={{ color: colors.status.premiumText }}>
            💡 Science tip: Visualizing consequences moves you 2x better when
            motivation is low
          </Text>
        </View> : null}
    </View>
  );
}

export default MotivationCheck;
