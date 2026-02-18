import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { clsx } from 'clsx';

interface IconContainerProps {
  isDestructive: boolean;
  isBoost: boolean;
  children: React.ReactNode;
}

export function IconContainer({
  isDestructive,
  isBoost,
  children,
}: IconContainerProps) {
  return (
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
      {children}
    </View>
  );
}
