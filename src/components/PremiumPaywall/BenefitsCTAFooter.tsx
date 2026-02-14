/**
 * Benefits variant CTA footer
 * Subtle pulse animation on CTA + guarantee text
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Shield } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
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
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    glowOpacity.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1200 }),
          withTiming(0, { duration: 1200 })
        ),
        -1,
        false
      )
    );
  }, [glowOpacity, reduceMotion]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value * 0.3,
  }));

  return (
    <View className="absolute bottom-0 left-0 right-0 border-t border-stone-100 bg-white px-4 pb-8 pt-4">
      <View className="mb-3 items-center">
        <Text className="text-2xl font-bold text-stone-800">
          {handlers.priceLabel ?? '$6.99/month'}
        </Text>
        <Text className="text-sm text-stone-500">
          7-day free trial · Cancel anytime
        </Text>
      </View>

      {/* CTA Button with glow */}
      <View>
        {!reduceMotion && (
          <Animated.View
            className="absolute -inset-1 rounded-2xl"
            style={[
              {
                backgroundColor: config.gradientColors[0],
              },
              glowStyle,
            ]}
          />
        )}
        <Pressable
          accessibilityHint="Opens subscription options"
          accessibilityLabel={config.ctaText}
          accessibilityRole="button"
          disabled={!handlers.priceLabel}
          onPress={onStartTrial}
          onPressIn={handlers.handleButtonPressIn}
          onPressOut={handlers.handleButtonPressOut}
        >
          <Animated.View
            style={reduceMotion ? undefined : handlers.buttonAnimatedStyle}
          >
            <LinearGradient
              className="flex-row items-center justify-center gap-2 rounded-xl py-4"
              colors={[config.gradientColors[0], config.gradientColors[1]]}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
              style={handlers.priceLabel ? undefined : { opacity: 0.5 }}
            >
              <Text className="text-base font-semibold text-white">
                {config.ctaText}
              </Text>
              <ChevronRight color="#ffffff" size={18} />
            </LinearGradient>
          </Animated.View>
        </Pressable>
      </View>

      {handlers.priceLabel && (
        <Text className="mt-2 text-center text-xs text-stone-500">
          then {handlers.priceLabel} after trial
        </Text>
      )}

      {/* Guarantee line */}
      <View className="mt-3 flex-row items-center justify-center gap-1.5">
        <Shield color="#a1a1aa" size={12} />
        <Text className="text-[11px] text-stone-400">
          No charge until trial ends · Cancel in Settings
        </Text>
      </View>

      <Pressable className="mt-2 py-2" onPress={onRestore}>
        <Text className="text-center text-xs text-violet-600">
          Already premium? Restore purchases
        </Text>
      </Pressable>
    </View>
  );
}
