import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronDown, RefreshCw } from 'lucide-react-native';
import { styles } from './OfflinePendingBanner.styles';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '../../theme/colors';

interface SyncButtonProps {
  showSyncButton: boolean;
  isOnline: boolean;
  hasPendingItems: boolean;
  isProcessing: boolean;
  chevronAnimatedStyle: AnimatedStyle<ViewStyle>;
  onSyncPress: () => void;
}

export function SyncButton({
  showSyncButton,
  isOnline,
  hasPendingItems,
  isProcessing,
  chevronAnimatedStyle,
  onSyncPress,
}: SyncButtonProps) {
  if (showSyncButton && isOnline && hasPendingItems && !isProcessing) {
    return (
      <Pressable
        accessibilityLabel='Sync now'
        accessibilityRole='button'
        style={styles.syncButton}
        onPress={onSyncPress}
      >
        <RefreshCw color={colors.text.inverse} size={iconSizes.small} />
        <Text style={styles.syncButtonText}>Sync</Text>
      </Pressable>
    );
  }

  return (
    <Animated.View style={chevronAnimatedStyle}>
      <ChevronDown color='#71717A' size={iconSizes.medium} />
    </Animated.View>
  );
}
