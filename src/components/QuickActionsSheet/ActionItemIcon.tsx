import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { clsx } from 'clsx';

interface ActionItemIconProps {
  icon: React.ReactNode;
  highlighted: boolean;
  destructive: boolean;
}

export function ActionItemIcon({
  icon,
  highlighted,
  destructive,
}: ActionItemIconProps) {
  return (
    <View
      className={clsx(
        'h-10 w-10 items-center justify-center rounded-xl',
        destructive && 'bg-red-100',
        !highlighted && !destructive && 'bg-stone-100'
      )}
    >
      {highlighted ? <LinearGradient
          className='absolute inset-0 rounded-xl'
          colors={['#7c3aed', '#4f46e5']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
        /> : null}
      {icon}
    </View>
  );
}
