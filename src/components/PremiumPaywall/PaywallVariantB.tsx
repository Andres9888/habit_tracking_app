/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/**
 * PaywallVariantB — Social Proof Paywall
 *
 * A/B Test: paywall_screen / variant B
 *
 * Messaging strategy: social proof + community trust.
 * Headline: "Join 10,000+ people building unbreakable chains"
 * Supporting: star ratings, user testimonials, chain count badge.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Users, ChevronRight, Award } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { usePremiumPaywall } from './usePremiumPaywall';
import { BenefitsHeader } from './BenefitsHeader';
import { VARIANT_CONFIGS } from './variants';
import type { PremiumPaywallProps } from './PremiumPaywall.types';

// ─── Testimonials ────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    id: '1',
    name: 'Sarah K.',
    days: 142,
    text: "I've tried every habit app. This is the first one where I actually kept going past 30 days. The chain visualization is addictive.",
    rating: 5,
  },
  {
    id: '2',
    name: 'Marcus T.',
    days: 89,
    text: "The streak pressure is real \u2014 in the best way. I haven't missed a workout in 3 months. Premium analytics showed me exactly when I slip.",
    rating: 5,
  },
  {
    id: '3',
    name: 'Priya M.',
    days: 210,
    text: "210 days of meditation. I wouldn't have believed it a year ago. The reminders and insights keep me accountable like nothing else.",
    rating: 5,
  },
] as const;

// ─── Sub-components ──────────────────────────────────────────────────

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <View className='flex-row items-center gap-0.5'>
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static list
        <Star key={i} fill='#fbbf24' size={14} color='#fbbf24' />
      ))}
    </View>
  );
}

function ChainCountBadge() {
  return (
    <View className='mb-4 flex-row items-center justify-center gap-2 rounded-2xl bg-white/15 px-4 py-2'>
      <Users color='#ffffff' size={16} />
      <Text className='text-sm font-semibold text-white'>
        10,000+ chains built and counting
      </Text>
    </View>
  );
}

function RatingBar() {
  return (
    <View className='mb-4 flex-row items-center justify-center gap-2'>
      <StarRow />
      <Text className='text-sm font-medium text-white/90'>4.9 · 2,400+ ratings</Text>
    </View>
  );
}

function TestimonialCard({
  name,
  days,
  text,
  rating,
}: (typeof TESTIMONIALS)[number]) {
  return (
    <View className='mb-3 rounded-2xl bg-white p-4 shadow-sm'>
      <View className='mb-2 flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          <View className='h-8 w-8 items-center justify-center rounded-full bg-emerald-100'>
            <Text className='text-sm font-bold text-emerald-700'>
              {name[0]}
            </Text>
          </View>
          <View>
            <Text className='text-sm font-semibold text-stone-800'>{name}</Text>
            <Text className='text-xs text-stone-500'>{days}-day chain 🔥</Text>
          </View>
        </View>
        <StarRow count={rating} />
      </View>
      <Text className='text-sm leading-5 text-stone-600'>{text}</Text>
    </View>
  );
}

function AwardBadgeRow() {
  return (
    <View className='mb-6 flex-row items-center justify-center gap-2 rounded-xl bg-amber-50 px-3 py-2'>
      <Award color='#d97706' size={16} />
      <Text className='text-xs font-medium text-amber-800'>
        #1 Habit Tracker on the App Store • 2024 App of the Day
      </Text>
    </View>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

interface PaywallVariantBProps extends Omit<PremiumPaywallProps, 'variant'> {
  /** User's current streak for personalisation (optional) */
  streakDays?: number;
}

export function PaywallVariantB({
  visible,
  onClose,
  onStartTrial,
  onRestorePurchases,
  triggeredByFeature,
  reduceMotion = false,
  testID,
}: PaywallVariantBProps) {
  const config = {
    ...VARIANT_CONFIGS.benefits,
    heroTitle: 'Join 10,000+ People Building Unbreakable Chains',
    heroSubtitle: 'Rated #1 habit tracker — see why so many people never miss a day.',
    ctaText: 'Start My Free Trial',
    gradientColors: ['#047857', '#059669'] as const,
  };

  const handlers = usePremiumPaywall({
    onClose,
    onRestorePurchases,
    onStartTrial,
    variant: 'benefits',
  });

  const handleStartTrialPress = () => { void handlers.handleStartTrial(); };
  const handleRestorePress = () => { void handlers.handleRestorePurchases(); };

  return (
    <Modal
      animationType={reduceMotion ? 'fade' : 'slide'}
      presentationStyle='pageSheet'
      testID={testID}
      transparent={false}
      visible={visible}
      onRequestClose={handlers.handleClose}
    >
      <View className='flex-1 bg-stone-50'>
        {/* Header */}
        <BenefitsHeader config={config} onClose={handlers.handleClose} />

        {/* Hero gradient */}
        <LinearGradient
          colors={[config.gradientColors[0], config.gradientColors[1]]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          className='px-5 pb-5 pt-4'
        >
          <Text className='mb-2 text-center text-xl font-bold text-white'>
            {config.heroTitle}
          </Text>
          <Text className='mb-3 text-center text-sm text-emerald-100'>
            {config.heroSubtitle}
          </Text>
          <RatingBar />
          <ChainCountBadge />
        </LinearGradient>

        {/* Scrollable content */}
        <ScrollView
          className='flex-1 px-4 pt-4'
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <AwardBadgeRow />

          <Text className='mb-3 text-base font-semibold text-stone-800'>
            What our community says
          </Text>

          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}

          <Text className='mb-6 text-center text-xs text-stone-400'>
            Real users. Real streaks. Your results may vary.
          </Text>
        </ScrollView>

        {/* CTA Footer */}
        <View className='absolute bottom-0 left-0 right-0 border-t border-stone-200 bg-white px-4 pb-10 pt-4'>
          <View className='mb-3 items-center'>
            <Text className='text-2xl font-bold text-stone-800'>
              {handlers.priceLabel ?? '$6.99/month'}
            </Text>
            <Text className='text-sm text-stone-500'>7-day free trial · Cancel anytime</Text>
          </View>
          <Pressable
            accessibilityHint='Opens subscription options'
            accessibilityLabel={config.ctaText}
            accessibilityRole='button'
            testID='paywall-b-start-trial-button'
            disabled={!handlers.priceLabel}
            onPress={handleStartTrialPress}
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
          <Pressable className='mt-3 py-2' onPress={handleRestorePress}>
            <Text className='text-center text-xs text-emerald-700'>
              Already premium? Restore purchases
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
