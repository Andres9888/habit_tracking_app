import React from 'react';
import { View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';

interface ActionableTipProps {
  tip: string;
}

export function ActionableTip({ tip }: ActionableTipProps) {
  const { colors } = useThemeColors();

  return (
    <View
      accessibilityLabel={`Tip: ${tip}`}
      className='flex-row items-center gap-2 rounded-xl p-3'
      style={{ backgroundColor: colors.status.successLight }}
    >
      <Text className='text-base'>💡</Text>
      <Text className='flex-1 text-sm' style={{ color: colors.status.successText }}>{tip}</Text>
      <ChevronRight color={colors.status.success} size={iconSizes.small} />
    </View>
  );
}
