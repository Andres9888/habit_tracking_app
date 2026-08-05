import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/theme/ThemeContext';

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
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      className='h-10 w-10 items-center justify-center rounded-xl'
      style={{
        backgroundColor: isDestructive
          ? themeColors.status.errorLight
          : isBoost
            ? undefined
            : themeColors.background,
      }}
    >
      {isBoost ? (
        <LinearGradient
          className='absolute inset-0 rounded-xl'
          colors={['#7c3aed', '#4f46e5']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
        />
      ) : null}
      {children}
    </View>
  );
}
