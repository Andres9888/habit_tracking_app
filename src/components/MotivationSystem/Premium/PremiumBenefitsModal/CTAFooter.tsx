/**
 * CTA Footer component for PremiumBenefitsModal
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import Animated from 'react-native-reanimated';

interface CTAFooterProps {
  onStartTrial: () => void;
  onRestorePurchases: () => void;
  buttonAnimatedStyle: object;
  onPressIn: () => void;
  onPressOut: () => void;
  reduceMotion: boolean;
}

export function CTAFooter({
  onStartTrial,
  onRestorePurchases,
  buttonAnimatedStyle,
  onPressIn,
  onPressOut,
  reduceMotion,
}: CTAFooterProps) {
  return (
    <View className='absolute bottom-0 left-0 right-0 border-t border-stone-200 bg-white px-4 pb-8 pt-4'>
      <View className='mb-3 items-center'>
        <View className='flex-row items-baseline gap-1'>
          <Text className='text-2xl font-bold text-stone-800'>$6.99</Text>
          <Text className='text-sm text-stone-500'>/month</Text>
        </View>
        <Text className='text-sm text-stone-500'>
          7-day free trial • Auto-renews at $6.99/month • Cancel anytime
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
      <Pressable className='mt-2 py-2' onPress={onRestorePurchases}>
        <Text className='text-center text-xs text-violet-600'>
          Already premium? Restore purchases
        </Text>
      </Pressable>
    </View>
  );
}
