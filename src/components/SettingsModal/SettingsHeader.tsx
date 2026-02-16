/** SettingsHeader - Theme-aware header with shared close button */
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ModalCloseButton } from '../ui/ModalCloseButton';
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
    <Animated.View
      className='px-5 pb-4'
      entering={FadeInDown.duration(280).springify().damping(18)}
      style={{ backgroundColor: colors.background, paddingTop }}
    >
      <View className='flex-row items-center justify-between'>
        <View className='h-10 w-10' />
        <Text
          className='text-[22px] font-bold tracking-tight'
          style={{ color: colors.headerText, letterSpacing: -0.5 }}
        >
          Settings
        </Text>
        <ModalCloseButton label='Close settings' onClose={onClose} />
      </View>
    </Animated.View>
  );
}
