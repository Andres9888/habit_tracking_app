import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { RefreshCw, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { VARIANT_STYLES } from './constants';
import type { DraftRecoveryBannerProps } from './types';

export function DraftRecoveryBanner({
  visible,
  onDiscard,
  onDismiss,
  message = 'Unsaved draft recovered',
  variant = 'rose',
}: DraftRecoveryBannerProps) {
  if (!visible) return null;

  const styles = VARIANT_STYLES[variant];

  const handleDiscard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDiscard();
  };

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss();
  };

  return (
    <Animated.View
      className={`mx-4 mb-3 rounded-xl border ${styles.border} ${styles.bg} p-3`}
      entering={FadeIn.duration(280).springify().damping(18)}
      exiting={FadeOut.duration(200)}
    >
      <View className='flex-row items-center gap-3'>
        <View className={`rounded-lg ${styles.iconBg} p-2`}>
          <RefreshCw color={styles.iconColor} size={16} />
        </View>
        <View className='flex-1'>
          <Text className={`text-sm font-medium ${styles.text}`}>
            {message}
          </Text>
          <Text className={`text-xs ${styles.text} opacity-70`}>
            Your previous edits were saved locally
          </Text>
        </View>
        <View className='flex-row items-center gap-2'>
          <Pressable
            accessibilityLabel='Discard recovered draft'
            accessibilityRole='button'
            className={`rounded-lg ${styles.buttonBg} px-3 py-1.5`}
            onPress={handleDiscard}
          >
            <Text className={`text-xs font-medium ${styles.buttonText}`}>
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
            <X color={styles.iconColor} size={18} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
