
import type { AnimatedStyle } from 'react-native-reanimated';
import React from 'react';
import type { ViewStyle } from 'react-native';

import Animated from 'react-native-reanimated';
import { Cloud, CloudOff, RefreshCw, WifiOff } from 'lucide-react-native';

import { styles } from './OfflinePendingBanner.styles';

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
        <WifiOff color='#F97316' size={20} />
      ) : isProcessing ? (
        <Animated.View style={spinAnimatedStyle}>
          <RefreshCw color='#0EA5E9' size={20} />
        </Animated.View>
      ) : hasPendingItems ? (
        <CloudOff color='#F59E0B' size={20} />
      ) : (
        <Cloud color='#10B981' size={20} />
      )}
    </Animated.View>
  );
}
