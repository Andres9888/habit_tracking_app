import React from 'react';
import Animated from 'react-native-reanimated';
import { Cloud, CloudOff, RefreshCw, WifiOff } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { styles } from './OfflinePendingBanner.styles';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

interface BannerIconProps {
  isOffline: boolean;
  isProcessing: boolean;
  hasPendingItems: boolean;
  pulseAnimatedStyle: AnimatedStyle<ViewStyle>;
  spinAnimatedStyle: AnimatedStyle<ViewStyle>;
}

export function BannerIcon({
  isOffline,
  isProcessing,
  hasPendingItems,
  pulseAnimatedStyle,
  spinAnimatedStyle,
}: BannerIconProps) {
  return (
    <Animated.View style={[styles.iconContainer, pulseAnimatedStyle]}>
      {isOffline ? (
        <WifiOff color='#F97316' size={iconSizes.medium} />
      ) : isProcessing ? (
        <Animated.View style={spinAnimatedStyle}>
          <RefreshCw color='#0EA5E9' size={iconSizes.medium} />
        </Animated.View>
      ) : hasPendingItems ? (
        <CloudOff color='#F59E0B' size={iconSizes.medium} />
      ) : (
        <Cloud color='#10B981' size={iconSizes.medium} />
      )}
    </Animated.View>
  );
}
