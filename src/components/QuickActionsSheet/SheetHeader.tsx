import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../theme/ThemeContext';

interface SheetHeaderProps {
  habitName: string;
  habitIcon?: string;
  onClose: () => void;
}

export const SheetHeader = ({
  habitName,
  habitIcon,
  onClose,
}: SheetHeaderProps) => {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row items-center justify-between border-b px-5 py-4' style={{ borderColor: colors.border }}>
      <View className='flex-row items-center gap-3'>
        {habitIcon ? <Text className='text-2xl'>{habitIcon}</Text> : null}
        <View>
          <Text className='text-lg font-bold' style={{ color: colors.text.primary }}>
            Quick Actions
          </Text>
          <Text className='text-xs' style={{ color: colors.text.tertiary }}>{habitName}</Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full'
        style={{ backgroundColor: colors.gray[200] }}
        onPress={onClose}
      >
        <X color={colors.text.secondary} size={iconSizes.medium} />
      </Pressable>
    </View>
  );
};
