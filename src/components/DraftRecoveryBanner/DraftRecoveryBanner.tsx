import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { RefreshCw, X } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { VARIANT_STYLES } from './constants';
import type { DraftRecoveryBannerProps } from './types';
import { iconSizes } from '@/theme/iconSizes';
import { triggerHaptic } from '@/utils/haptics';
import { durations, enterEasing } from '@/theme/animations';

export function DraftRecoveryBanner({
  visible,
  onDiscard,
  onDismiss,
  message = 'Unsaved draft recovered',
  variant = 'rose',
}: DraftRecoveryBannerProps) {
  const { colors: themeColors } = useThemeColors();

  if (!visible) return null;

  const styles = VARIANT_STYLES[variant];
  const useTheme = styles.useTheme;
  const themeStyle = useTheme === 'success' ? {
    bg: { backgroundColor: themeColors.status.successLight },
    border: { borderColor: themeColors.status.success },
    buttonBg: { backgroundColor: themeColors.status.successLight },
    buttonText: { color: themeColors.status.successText },
    iconBg: { backgroundColor: themeColors.status.successLight },
    iconColor: themeColors.status.success,
    text: { color: themeColors.status.successText },
  } : useTheme === 'error' ? {
    bg: { backgroundColor: themeColors.status.errorLight },
    border: { borderColor: themeColors.status.error },
    buttonBg: { backgroundColor: themeColors.status.errorLight },
    buttonText: { color: themeColors.status.errorText },
    iconBg: { backgroundColor: themeColors.status.errorLight },
    iconColor: themeColors.status.error,
    text: { color: themeColors.status.errorText },
  } : useTheme ? {
    bg: { backgroundColor: themeColors.status.premiumLight },
    border: { borderColor: themeColors.status.premiumLight },
    buttonBg: { backgroundColor: themeColors.status.premiumLight },
    buttonText: { color: themeColors.status.premiumText },
    iconBg: { backgroundColor: themeColors.status.premiumLight },
    iconColor: themeColors.status.premium,
    text: { color: themeColors.status.premiumText },
  } : null;

  const handleDiscard = () => {
    triggerHaptic('tap');
    onDiscard();
  };

  const handleDismiss = () => {
    triggerHaptic('tap');
    onDismiss();
  };

  return (
    <Animated.View
      className={`mx-4 mb-3 rounded-xl border ${styles.border} ${styles.bg} p-3`}
      entering={FadeInDown.duration(durations.enter).easing(enterEasing)}
      exiting={FadeOut.duration(durations.quick)}
      style={themeStyle ? [themeStyle.bg, themeStyle.border] : undefined}
    >
      <View className='flex-row items-center gap-3'>
        <View className={`rounded-lg ${styles.iconBg} p-2`} style={themeStyle?.iconBg}>
          <RefreshCw color={themeStyle?.iconColor ?? styles.iconColor} size={iconSizes.small} />
        </View>
        <View className='flex-1'>
          <Text className={`text-sm font-medium ${styles.text}`} style={themeStyle?.text}>
            {message}
          </Text>
          <Text className={`text-xs ${styles.text} opacity-70`} style={themeStyle?.text}>
            Your previous edits were saved locally
          </Text>
        </View>
        <View className='flex-row items-center gap-2'>
          <Pressable
            accessibilityLabel='Discard recovered draft'
            accessibilityRole='button'
            className={`rounded-lg ${styles.buttonBg} px-3 py-1.5`}
            style={themeStyle?.buttonBg}
            onPress={handleDiscard}
          >
            <Text className={`text-xs font-medium ${styles.buttonText}`} style={themeStyle?.buttonText}>
              Discard
            </Text>
          </Pressable>
          <Pressable
            accessibilityLabel='Keep recovered draft'
            accessibilityRole='button'
            className='h-7 w-7 items-center justify-center rounded-full'
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            onPress={handleDismiss}
          >
            <X color={themeStyle?.iconColor ?? styles.iconColor} size={iconSizes.medium} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
