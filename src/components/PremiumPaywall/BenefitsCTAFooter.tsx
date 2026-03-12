/**
 * Benefits variant CTA footer
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import type { VariantConfig } from './PremiumPaywall.types';
import type { PremiumPaywallHandlers } from './usePremiumPaywall';

interface BenefitsCTAFooterProps {
  config: VariantConfig;
  handlers: PremiumPaywallHandlers;
  reduceMotion: boolean;
  onStartTrial: () => void;
  onRestore: () => void;
}

export function BenefitsCTAFooter({
  config,
  handlers,
  reduceMotion,
  onStartTrial,
  onRestore,
}: BenefitsCTAFooterProps) {
  return (
    <View className='absolute bottom-0 left-0 right-0 border-t border-stone-200 bg-white px-4 pb-8 pt-4'>
      <View className='mb-3 items-center'>
        <Text className='text-2xl font-bold text-stone-800'>
          {handlers.priceLabel ?? '$6.99/month'}
        </Text>
        <Text className='text-sm text-stone-500'>7-day free trial • Cancel anytime</Text>
      </View>
      <Pressable
        accessibilityHint='Opens subscription options'
        accessibilityLabel={config.ctaText}
        accessibilityRole='button'
        testID='paywall-start-trial-button'
        disabled={!handlers.priceLabel}
        onPress={onStartTrial}
        onPressIn={handlers.handleButtonPressIn}
        onPressOut={handlers.handleButtonPressOut}
      >
        <Animated.View style={reduceMotion ? undefined : handlers.buttonAnimatedStyle}>
          <LinearGradient
            className='flex-row items-center justify-center gap-2 rounded-xl py-4'
            colors={[config.gradientColors[0], config.gradientColors[1]]}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={handlers.priceLabel ? undefined : { opacity: 0.5 }}
          >
            <Text className='text-base font-semibold text-white'>{config.ctaText}</Text>
            <ChevronRight color='#ffffff' size={18} />
          </LinearGradient>
        </Animated.View>
      </Pressable>
      {handlers.priceLabel ? <Text className='mt-2 text-center text-xs text-stone-500'>
          then {handlers.priceLabel} after trial
        </Text> : null}
      <Pressable className='mt-2 py-2' onPress={onRestore}>
        <Text className='text-center text-xs text-violet-600'>
          Already premium? Restore purchases
        </Text>
      </Pressable>
    </View>
  );
}
