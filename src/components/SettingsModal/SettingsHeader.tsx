/** SettingsHeader - Theme-aware close button with spring press animation */
import { X } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';
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
  const { colors: themeColors } = useThemeColors();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

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
        <AnimatedPressable
          accessibilityLabel='Close settings'
          accessibilityRole='button'
          style={{
            height: 44,
            width: 44,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 22,
            backgroundColor: themeColors.surface,
          }}
          onPress={handlePress}
        >
          <X color={colors.icon} size={20} strokeWidth={2.5} />
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
}
