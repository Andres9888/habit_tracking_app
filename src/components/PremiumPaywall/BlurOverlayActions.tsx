/**
 * Blur overlay variant: CTA and footer
 * Guarantee text + polished button
 */

import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { Shield } from 'lucide-react-native';
import type { PremiumPaywallHandlers } from './usePremiumPaywall';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { VariantConfig } from './PremiumPaywall.types';
import { durations } from '../../theme/animations';

interface BlurOverlayActionsProps {
  config: VariantConfig;
  handlers: PremiumPaywallHandlers;
  onStartTrial: () => void;
  onRestore: () => void;
}

export function BlurOverlayActions({
  config,
  handlers,
  onStartTrial,
  onRestore,
}: BlurOverlayActionsProps) {
  return (
    <Animated.View entering={FadeInUp.duration(durations.enter).delay(150)}>
      <View className="mb-4">
        <Pressable
          accessibilityLabel={config.ctaText}
          accessibilityRole="button"
          disabled={handlers.isProcessing || !handlers.priceLabel}
          onPress={onStartTrial}
        >
          <LinearGradient
            className="items-center justify-center rounded-xl py-4"
            colors={[config.gradientColors[0], config.gradientColors[1]]}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={handlers.priceLabel ? undefined : { opacity: 0.5 }}
          >
            <Text className="text-base font-semibold text-white">
              {handlers.isProcessing ? 'Processing...' : config.ctaText}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
      <View className="items-center">
        {handlers.priceLabel && (
          <Text className="mb-2 text-xs text-white/70">
            then {handlers.priceLabel} after trial · Cancel anytime
          </Text>
        )}
        <View className="mb-2 flex-row items-center gap-1.5">
          <Shield color="rgba(255,255,255,0.5)" size={12} />
          <Text className="text-[11px] text-white/50">
            No charge until trial ends
          </Text>
        </View>
        <Pressable disabled={handlers.isProcessing} onPress={onRestore}>
          <Text className="text-xs text-white/60">Restore Purchases</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
