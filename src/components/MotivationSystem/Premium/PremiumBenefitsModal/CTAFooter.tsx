/**
 * CTA Footer component for PremiumBenefitsModal
 */

import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { usePremium } from '../../../../hooks/usePremium';

interface CTAFooterProps {
  onStartTrial: () => void;
  onRestorePurchases: () => void;
  buttonAnimatedStyle: object;
  onPressIn: () => void;
  onPressOut: () => void;
  reduceMotion: boolean;
  isRestoring?: boolean;
}

export function CTAFooter({
  onStartTrial,
  onRestorePurchases,
  buttonAnimatedStyle,
  onPressIn,
  onPressOut,
  reduceMotion,
  isRestoring = false,
}: CTAFooterProps) {
  const { priceString, isLoadingOfferings } = usePremium();
  const displayPrice = priceString ?? '$6.99';

  return (
    <View className='absolute bottom-0 left-0 right-0 border-t border-stone-200 bg-white px-4 pb-8 pt-4'>
      <View className='mb-3 items-center'>
        <View className='flex-row items-baseline gap-1'>
          {isLoadingOfferings ? (
            <ActivityIndicator color='#78716c' size='small' />
          ) : (
            <>
              <Text className='text-2xl font-bold text-stone-800'>
                {displayPrice}
              </Text>
              <Text className='text-sm text-stone-500'>/month</Text>
            </>
          )}
        </View>
        <Text className='text-sm text-stone-500'>
          7-day free trial • Then {displayPrice}/month • Cancel anytime
        </Text>
      </View>
      <Pressable
        accessibilityHint='Opens subscription options'
        accessibilityLabel='Start 7-Day Free Trial'
        accessibilityRole='button'
        onPress={onStartTrial}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Animated.View style={reduceMotion ? undefined : buttonAnimatedStyle}>
          <LinearGradient
            className='flex-row items-center justify-center gap-2 rounded-xl py-4'
            colors={['#8b5cf6', '#7c3aed']}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
          >
            <Text className='text-base font-semibold text-white'>
              Start 7-Day Free Trial
            </Text>
            <ChevronRight color='#ffffff' size={18} />
          </LinearGradient>
        </Animated.View>
      </Pressable>
      <Pressable
        className='mt-2 py-2'
        disabled={isRestoring}
        onPress={onRestorePurchases}
      >
        {isRestoring ? (
          <View className='flex-row items-center justify-center gap-2'>
            <ActivityIndicator color='#7c3aed' size='small' />
            <Text className='text-center text-xs text-violet-600'>
              Restoring...
            </Text>
          </View>
        ) : (
          <Text className='text-center text-xs text-violet-600'>
            Already premium? Restore purchases
          </Text>
        )}
      </Pressable>
    </View>
  );
}
