/**
 * SettingsHeader Component
 *
 * Header bar for the Settings modal with back button and title.
 * Handles safe area padding for notched devices.
 */

import { ChevronLeft } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import type { SettingsColors } from './types';

interface SettingsHeaderProps {
  colors: SettingsColors;
  paddingTop: number;
  onClose: () => void;
}

export function SettingsHeader({
  colors,
  paddingTop,
  onClose,
}: SettingsHeaderProps) {
  return (
    <View
      className='bg-background px-4 pb-4'
      style={{ backgroundColor: colors.background, paddingTop }}
    >
      <View className='flex-row items-center justify-between'>
        <TouchableOpacity
          accessibilityLabel='Back'
          accessibilityRole='button'
          activeOpacity={0.7}
          className='size-10 items-center justify-center rounded-full'
          onPress={onClose}
        >
          <ChevronLeft color={colors.icon} size={28} />
        </TouchableOpacity>
        <Text
          className='text-[24px] font-bold leading-[32px] tracking-tight text-foreground'
          style={{ color: colors.headerText }}
        >
          Settings
        </Text>
        <View className='size-10' />
      </View>
    </View>
  );
}
