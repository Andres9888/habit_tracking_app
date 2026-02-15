/* eslint-disable max-lines */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import * as Haptics from 'expo-haptics';
import { ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { clsx } from 'clsx';

import type { ActionItemProps } from './types';

export const ActionItem = ({
  badge,
  destructive = false,
  disabled = false,
  highlighted = false,
  icon,
  label,
  onPress,
  showChevron = false,
  subtitle,
}: ActionItemProps) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      className={clsx(
        'flex-row items-center gap-3 rounded-xl px-4 py-3.5 active:opacity-80',
        highlighted && 'border-2 border-violet-300',
        destructive && 'bg-red-50',
        !highlighted && !destructive && 'bg-stone-50',
        disabled && 'opacity-50'
      )}
      disabled={disabled}
      onPress={handlePress}
    >
      {highlighted && (
        <LinearGradient
          className='absolute inset-0 rounded-xl'
          colors={['#f5f3ff', '#e0e7ff']}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
        />
      )}
      <View
        className={clsx(
          'h-10 w-10 items-center justify-center rounded-xl',
          destructive && 'bg-red-100',
          !highlighted && !destructive && 'bg-stone-100'
        )}
      >
        {highlighted && (
          <LinearGradient
            className='absolute inset-0 rounded-xl'
            colors={['#7c3aed', '#4f46e5']}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          />
        )}
        {icon}
      </View>

      <View className='flex-1'>
        <View className='flex-row items-center gap-2'>
          <Text
            className={clsx(
              'text-base font-semibold',
              highlighted && 'text-violet-900',
              destructive && 'text-red-600',
              !highlighted && !destructive && 'text-stone-800'
            )}
          >
            {label}
          </Text>
          {badge && (
            <View className='rounded-full bg-violet-500 px-2 py-0.5'>
              <Text className='text-xs font-bold text-white'>{badge}</Text>
            </View>
          )}
        </View>
        {subtitle && (
          <Text
            className={clsx(
              'mt-0.5 text-xs',
              highlighted && 'text-violet-600',
              destructive && 'text-red-500',
              !highlighted && !destructive && 'text-stone-500'
            )}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {showChevron && (
        <ChevronRight
          className={clsx(
            highlighted && 'text-violet-400',
            destructive && 'text-red-400',
            !highlighted && !destructive && 'text-stone-400'
          )}
          size={20}
        />
      )}
    </Pressable>
  );
};
