/**
 * Blur overlay variant: CTA and footer
 * Loading state, button animation, clear trial messaging
 */

import React from 'react';
import { View, Pressable, Text, ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield } from 'lucide-react-native';
import type { PremiumPaywallHandlers } from './usePremiumPaywall';
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
          accessibilityHint='Starts a 7-day free trial'
          accessibilityLabel={config.ctaText}
          accessibilityRole='button'
          testID='paywall-start-trial-button'
          disabled={handlers.isProcessing || !handlers.priceLabel}
          onPress={onStartTrial}
          onPressIn={handlers.handleButtonPressIn}
          onPressOut={handlers.handleButtonPressOut}
        >
          <Animated.View style={handlers.buttonAnimatedStyle}>
            <LinearGradient
              className='items-center justify-center rounded-xl py-4'
              colors={[config.gradientColors[0], config.gradientColors[1]]}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
              style={handlers.priceLabel && !handlers.isProcessing ? undefined : { opacity: 0.5 }}
            >
              {handlers.isProcessing ? (
                <ActivityIndicator color='#ffffff' size='small' />
              ) : (
                <Text className='text-base font-semibold text-white'>
                  {config.ctaText}
                </Text>
              )}
            </LinearGradient>
          </Animated.View>
        </Pressable>
      </View>
      <View className='items-center'>
        {handlers.priceLabel && (
          <Text className='mb-1 text-center text-sm font-medium text-white/80'>
            7 days free, then {handlers.priceLabel}
          </Text>
        )}
        <View className='mb-2 flex-row items-center gap-1'>
          <Shield color='rgba(255,255,255,0.5)' size={12} />
          <Text className='text-xs text-white/50'>
            No charge until trial ends · Cancel anytime
          </Text>
        </View>
        <Pressable disabled={handlers.isProcessing} onPress={onRestore} className='py-2'>
          <Text className='text-xs text-white/60 underline'>Restore Purchases</Text>
        </Pressable>
      </View>
    </>
  );
}
