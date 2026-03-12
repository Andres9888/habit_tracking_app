/**
 * Blur overlay variant: CTA and footer
 */

import React from 'react';
import { View, Pressable, Text } from 'react-native';
import type { PremiumPaywallHandlers } from './usePremiumPaywall';
import { LinearGradient } from 'expo-linear-gradient';
import type { VariantConfig } from './PremiumPaywall.types';

interface BlurOverlayActionsProps {
  config: VariantConfig;
  handlers: PremiumPaywallHandlers;
  onStartTrial: () => void;
  onRestore: () => void;
}

export function BlurOverlayActions({ config, handlers, onStartTrial, onRestore }: BlurOverlayActionsProps) {
  return (
    <>
      <View className='mb-4'>
        <Pressable
          accessibilityLabel={config.ctaText}
          accessibilityRole='button'
          testID='paywall-start-trial-button'
          disabled={handlers.isProcessing || !handlers.priceLabel}
          onPress={onStartTrial}
        >
          <LinearGradient
            className='items-center justify-center rounded-xl py-4'
            colors={[config.gradientColors[0], config.gradientColors[1]]}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={handlers.priceLabel ? undefined : { opacity: 0.5 }}
          >
            <Text className='text-base font-semibold text-white'>
              {handlers.isProcessing ? 'Processing...' : config.ctaText}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
      <View className='items-center'>
        {handlers.priceLabel ? <Text className='mb-2 text-xs text-white/70'>
            then {handlers.priceLabel} after trial • Cancel anytime
          </Text> : null}
        <Pressable disabled={handlers.isProcessing} onPress={onRestore}>
          <Text className='text-xs text-white/60'>Restore Purchases</Text>
        </Pressable>
      </View>
    </>
  );
}
