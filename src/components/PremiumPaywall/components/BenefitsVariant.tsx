/**
 * Benefits variant of the PremiumPaywall
 * Page-sheet modal with detailed feature rows, science facts, social proof
 */

import React, { useEffect } from 'react';
import { View, Text, ScrollView, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Crown,
  X,
  Check,
  Sparkles,
  Star,
  ChevronRight,
} from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import {
  BENEFITS_FEATURES,
  VARIANT_HERO,
} from '../PremiumPaywall.constants';
import { usePurchaseFlow } from '../usePurchaseFlow';
import type { PremiumPaywallProps } from '../PremiumPaywall.types';
import type { BenefitsFeatureItem } from '../PremiumPaywall.types';

type BenefitsVariantProps = Pick<
  PremiumPaywallProps,
  | 'visible'
  | 'onClose'
  | 'onStartTrial'
  | 'triggeredByFeature'
  | 'reduceMotion'
  | 'testID'
>;

export function BenefitsVariant({
  visible = false,
  onClose,
  onStartTrial,
  triggeredByFeature,
  reduceMotion = false,
  testID,
}: BenefitsVariantProps) {
  const hero = VARIANT_HERO.benefits;
  const {
    handleClose,
    handlePurchase,
    handleRestore,
    buttonAnimatedStyle,
    handleButtonPressIn,
    handleButtonPressOut,
    isLoadingOfferings,
    isRestoring,
    priceLabel,
  } = usePurchaseFlow({ onClose, onStartTrial });

  const sortedFeatures = [...BENEFITS_FEATURES].sort((a, b) => {
    if (a.id === triggeredByFeature) return -1;
    if (b.id === triggeredByFeature) return 1;
    return 0;
  });

  return (
    <Modal
      animationType={reduceMotion ? 'fade' : 'slide'}
      presentationStyle='pageSheet'
      testID={testID}
      transparent={false}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className='flex-1 bg-stone-50'>
        {/* Header */}
        <View className='flex-row items-center justify-between border-b border-stone-200 bg-white px-4 pb-3 pt-4'>
          <View className='flex-row items-center gap-2'>
            <LinearGradient
              className='h-8 w-8 items-center justify-center rounded-full'
              colors={['#8b5cf6', '#7c3aed']}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
            >
              <Crown color='#ffffff' size={16} />
            </LinearGradient>
            <Text className='text-lg font-bold text-stone-800'>
              Premium Features
            </Text>
          </View>
          <Pressable
            accessibilityLabel='Close'
            accessibilityRole='button'
            className='h-8 w-8 items-center justify-center rounded-full bg-stone-100'
            hitSlop={12}
            onPress={handleClose}
          >
            <X className='text-stone-500' size={24} />
          </Pressable>
        </View>

        {/* Hero */}
        <LinearGradient
          className='px-4 py-5'
          colors={['#8b5cf6', '#7c3aed']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
        >
          <Text className='mb-1 text-center text-xl font-bold text-white'>
            {hero.title}
          </Text>
          <Text className='text-center text-sm text-violet-100'>
            {hero.subtitle}
          </Text>
        </LinearGradient>

        {/* Feature rows */}
        <ScrollView
          className='flex-1 px-4 pt-4'
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {sortedFeatures.map((feature, index) => (
            <FeatureRow
              key={feature.id}
              feature={feature}
              index={index}
              isHighlighted={feature.id === triggeredByFeature}
              reduceMotion={reduceMotion}
            />
          ))}

          {/* Social Proof */}
          <View className='mb-4 mt-2 items-center'>
            <View className='flex-row items-center gap-1'>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className='text-amber-400'
                  fill='#fbbf24'
                  size={14}
                />
              ))}
            </View>
            <Text className='mt-1 text-center text-xs text-stone-500'>
              Trusted by 10,000+ users building lasting habits
            </Text>
          </View>
        </ScrollView>

        {/* CTA Footer */}
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
            onPress={() => void handlePurchase()}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
          >
            <Animated.View
              style={reduceMotion ? undefined : buttonAnimatedStyle}
            >
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
            onPress={() => void handleRestore()}
          >
            <Text className='text-center text-xs text-violet-600'>
              Already premium? Restore purchases
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ── Feature Row ────────────────────────────────────────────────────

function FeatureRow({
  feature,
  isHighlighted,
  index,
  reduceMotion,
}: {
  feature: BenefitsFeatureItem;
  isHighlighted: boolean;
  index: number;
  reduceMotion: boolean;
}) {
  const Icon = feature.icon;
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }
    const delay = index * 80;
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    }, delay);
    return () => clearTimeout(timer);
  }, [index, opacity, translateY, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      className={`mb-3 overflow-hidden rounded-xl border ${
        isHighlighted
          ? 'border-violet-300 bg-violet-50'
          : 'border-stone-200 bg-white'
      }`}
      style={reduceMotion ? undefined : animatedStyle}
    >
      {isHighlighted && (
        <View className='flex-row items-center gap-1 bg-violet-100 px-3 py-1'>
          <Star className='text-violet-600' fill='#7c3aed' size={12} />
          <Text className='text-xs font-semibold text-violet-700'>
            You tried to use this feature
          </Text>
        </View>
      )}
      <View className='flex-row items-start gap-3 p-3'>
        <View
          className='h-10 w-10 items-center justify-center rounded-xl'
          style={{ backgroundColor: `${feature.accentColor}20` }}
        >
          <Icon color={feature.accentColor} size={20} />
        </View>
        <View className='flex-1'>
          <Text className='mb-0.5 text-sm font-semibold text-stone-800'>
            {feature.title}
          </Text>
          <Text className='mb-2 text-xs text-stone-500'>
            {feature.description}
          </Text>
          <View className='flex-row items-center gap-3'>
            <View className='flex-row items-center gap-1'>
              <View className='h-1.5 w-1.5 rounded-full bg-stone-300' />
              <Text className='text-xs text-stone-400'>
                {feature.freeLimit}
              </Text>
            </View>
            <View className='flex-row items-center gap-1'>
              <Check className='text-emerald-500' size={12} />
              <Text className='text-xs font-medium text-emerald-600'>
                {feature.premiumValue}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className='flex-row items-center gap-2 border-t border-stone-100 bg-stone-50 px-3 py-2'>
        <Sparkles className='text-amber-500' size={12} />
        <Text className='flex-1 text-[10px] italic text-stone-500'>
          {feature.scienceFact}
        </Text>
      </View>
    </Animated.View>
  );
}
