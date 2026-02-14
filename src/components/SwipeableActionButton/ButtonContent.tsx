/**
 * ButtonContent - The main pressable button content
 */

import { triggerHaptic } from '@/utils/haptics';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { clsx } from 'clsx';

interface ButtonContentProps {
  Icon: React.ComponentType<{
    className?: string;
    size?: number;
    strokeWidth?: number;
  }>;
  label: string;
  subtitle?: string;
  isDestructive: boolean;
  isBoost: boolean;
  showChevron: boolean;
  accessibleLabel: string;
  onPress: () => void;
}

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
        triggerHaptic('tap');
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
      <View
        className={clsx(
          'h-10 w-10 items-center justify-center rounded-xl',
          isDestructive && 'bg-red-100',
          !isBoost && !isDestructive && 'bg-stone-100'
        )}
      >
        {isBoost && (
          <LinearGradient
            className='absolute inset-0 rounded-xl'
            colors={['#7c3aed', '#4f46e5']}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          />
        )}
        <Icon
          className={clsx(
            isDestructive && 'text-red-500',
            isBoost && 'text-white',
            !isDestructive && !isBoost && 'text-stone-600'
          )}
          size={20}
          strokeWidth={2.25}
        />
      </View>
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
