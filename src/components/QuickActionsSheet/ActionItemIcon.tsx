import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/theme/ThemeContext';

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
  const { colors } = useThemeColors();

  return (
    <View
      className='h-10 w-10 items-center justify-center rounded-xl'
      style={destructive ? { backgroundColor: colors.status.errorLight } : highlighted ? undefined : { backgroundColor: colors.background }}
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
