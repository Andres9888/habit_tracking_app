/**
 * ButtonContent - The main pressable button content
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { clsx } from 'clsx';
import type { ButtonContentProps } from './ButtonContent.types';
import { IconContainer } from './IconContainer';

export function ButtonContent({
  Icon,
  label,
  subtitle,
  isDestructive,
  isBoost,
  showChevron,
  accessibleLabel,
  onPress,
}: ButtonContentProps) {
  return (
    <Pressable
      accessibilityLabel={accessibleLabel}
      accessibilityRole='button'
      className={clsx(
        'flex-row items-center gap-3 rounded-xl border px-4 py-3.5 active:opacity-70',
        isDestructive && 'border-red-200/60 bg-red-50/50',
        isBoost && 'border-violet-200/60',
        !isDestructive && !isBoost && 'border-stone-200 bg-white/80'
      )}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      {isBoost && (
        <LinearGradient
          className='absolute inset-0 rounded-xl'
          colors={['#f5f3ff', '#e0e7ff']}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
        />
      )}
      <IconContainer isBoost={isBoost} isDestructive={isDestructive}>
        <Icon
          className={clsx(
            isDestructive && 'text-red-500',
            isBoost && 'text-white',
            !isDestructive && !isBoost && 'text-stone-600'
          )}
          size={20}
          strokeWidth={2.25}
        />
      </IconContainer>
      <View className='flex-1'>
        <Text
          className={clsx(
            'text-base font-medium',
            isDestructive && 'text-red-600',
            isBoost && 'text-violet-900',
            !isDestructive && !isBoost && 'text-stone-800'
          )}
        >
          {label}
        </Text>
        {subtitle && (
          <Text
            className={clsx(
              'text-xs',
              isBoost ? 'text-violet-600' : 'text-stone-500'
            )}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {showChevron && (
        <ChevronRight
          className={clsx(
            isDestructive && 'text-red-400',
            isBoost && 'text-violet-400',
            !isDestructive && !isBoost && 'text-stone-400'
          )}
          size={20}
        />
      )}
    </Pressable>
  );
}
