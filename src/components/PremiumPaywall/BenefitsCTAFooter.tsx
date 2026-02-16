/**
 * Benefits variant CTA footer
 * Dark-mode aware, clear trial messaging, loading state
 */

import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Shield } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
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
  const { colors, isDark } = useThemeColors();

  return (
    <View
      className='absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4'
      style={{
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}
    >
      <View className='mb-3 items-center'>
        <Text
          className='text-2xl font-bold'
          style={{ color: colors.text.primary }}
        >
          {handlers.priceLabel ?? '$6.99/month'}
        </Text>
        <Text
          className='mt-1 text-sm'
          style={{ color: colors.text.secondary }}
        >
          7 days free, then {handlers.priceLabel ?? '$6.99/month'}
        </Text>
      </View>
      <Pressable
        accessibilityHint='Starts a 7-day free trial'
        accessibilityLabel={config.ctaText}
        accessibilityRole='button'
        disabled={!handlers.priceLabel || handlers.isProcessing}

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
            style={handlers.priceLabel && !handlers.isProcessing ? undefined : { opacity: 0.5 }}
          >
            {handlers.isProcessing ? (
              <ActivityIndicator color='#ffffff' size='small' />
            ) : (
              <>
                <Text className='text-base font-semibold text-white'>{config.ctaText}</Text>
                <ChevronRight color='#ffffff' size={18} />
              </>
            )}
          </LinearGradient>
        </Animated.View>
      </Pressable>
      <View className='mt-3 flex-row items-center justify-center gap-1'>
        <Shield color={colors.text.tertiary} size={12} />
        <Text
          className='text-xs'
          style={{ color: colors.text.tertiary }}
        >
          No charge until trial ends · Cancel anytime
        </Text>
      </View>
      <Pressable className='mt-2 py-2' disabled={handlers.isProcessing} onPress={onRestore}>
        <Text
          className='text-center text-xs'
          style={{ color: isDark ? '#a78bfa' : '#7c3aed' }}
        >
          Already premium? Restore purchases
        </Text>
      </Pressable>
    </View>
  );
}
