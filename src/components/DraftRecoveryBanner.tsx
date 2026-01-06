/**
 * DraftRecoveryBanner Component
 * Shows a banner when a draft has been recovered from local storage
 *
 * Part of Edge Case handling: T1 - Data Loss Prevention
 *
 * Features:
 * - Non-intrusive banner at top of editor
 * - Option to keep recovered draft or discard it
 * - Auto-dismisses after user interacts with the editor
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { RefreshCw, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface DraftRecoveryBannerProps {
  /** Whether to show the banner */
  visible: boolean;
  /** Callback when user wants to discard the draft */
  onDiscard: () => void;
  /** Callback when banner is dismissed (user keeps draft) */
  onDismiss: () => void;
  /** Optional custom message */
  message?: string;
  /** Accent color variant */
  variant?: 'rose' | 'violet' | 'emerald';
}

const VARIANT_STYLES = {
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    buttonBg: 'bg-emerald-100',
    buttonText: 'text-emerald-700',
    iconBg: 'bg-emerald-100',
    iconColor: '#059669',
    text: 'text-emerald-800',
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    buttonBg: 'bg-rose-100',
    buttonText: 'text-rose-700',
    iconBg: 'bg-rose-100',
    iconColor: '#e11d48',
    text: 'text-rose-800',
  },
  violet: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    buttonBg: 'bg-violet-100',
    buttonText: 'text-violet-700',
    iconBg: 'bg-violet-100',
    iconColor: '#7c3aed',
    text: 'text-violet-800',
  },
};

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
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
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
            onPress={handleDismiss}
          >
            <X color={styles.iconColor} size={18} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

export default DraftRecoveryBanner;
