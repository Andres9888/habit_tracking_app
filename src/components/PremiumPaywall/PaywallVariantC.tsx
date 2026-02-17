/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/**
 * PaywallVariantC — Fear-of-Loss / Streak Protection Paywall
 *
 * A/B Test: paywall_screen / variant C
 *
 * Messaging strategy: urgency + loss aversion.
 * Headline: "Your {N}-day streak is at risk without Premium"
 * Supporting: streak flame visualization, what-you'll-lose list,
 *             streak-freeze benefit, limited-time framing.
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
import { ChevronRight, Flame, Shield, X, CheckCircle2 } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { usePremiumPaywall } from './usePremiumPaywall';
import { BlurOverlayHeader } from './BlurOverlayHeader';
import { VARIANT_CONFIGS } from './variants';
import type { PremiumPaywallProps } from './PremiumPaywall.types';

// ─── What-you-lose list ───────────────────────────────────────────────

const LOSS_ITEMS = [
  { id: 'streak-freeze', label: 'Streak freeze protection' },
  { id: 'smart-reminders', label: 'Smart reminders that adapt to your schedule' },
  { id: 'habit-insights', label: 'Weekly habit strength insights' },
  { id: 'unlimited-habits', label: 'Unlimited habits (free tier: 3 max)' },
] as const;

const GAIN_ITEMS = [
  { id: 'freeze', label: '3 streak freezes per month — use on bad days' },
  { id: 'analytics', label: 'See your strongest days, weakest moments' },
  { id: 'unlimited', label: 'Build as many habits as you want' },
  { id: 'badges', label: 'Unlock all achievement badges' },
] as const;

// ─── Flame streak visualizer ─────────────────────────────────────────

function StreakFlame({ days }: { days: number }) {
  const isLong = days >= 30;
  const flameColor = isLong ? '#ef4444' : '#f97316';
  const glowColor = isLong ? '#fca5a5' : '#fed7aa';

  return (
    <View className='mb-2 items-center'>
      <View
        className='mb-3 h-20 w-20 items-center justify-center rounded-full'
        style={{ backgroundColor: glowColor }}
      >
        <Flame color={flameColor} fill={flameColor} size={44} />
      </View>
      <Text className='text-5xl font-black text-white'>{days}</Text>
      <Text className='mt-1 text-base font-semibold text-white/80'>
        {days === 1 ? 'day streak' : 'day streak'}
      </Text>
    </View>
  );
}

function UrgencyBanner() {
  return (
    <View className='mb-4 flex-row items-center justify-center gap-2 rounded-xl bg-red-500/20 px-4 py-2.5'>
      <Shield color='#fca5a5' size={16} />
      <Text className='text-sm font-semibold text-red-200'>
        Free accounts don't protect streaks from bad days
      </Text>
    </View>
  );
}

function LossItem({ label }: { label: string }) {
  return (
    <View className='mb-2 flex-row items-center gap-3'>
      <View className='h-5 w-5 items-center justify-center rounded-full bg-red-500/20'>
        <X color='#f87171' size={12} />
      </View>
      <Text className='flex-1 text-sm text-white/70'>{label}</Text>
    </View>
  );
}

function GainItem({ label }: { label: string }) {
  return (
    <View className='mb-2 flex-row items-center gap-3'>
      <CheckCircle2 color='#34d399' size={18} />
      <Text className='flex-1 text-sm font-medium text-white'>{label}</Text>
    </View>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

interface PaywallVariantCProps extends Omit<PremiumPaywallProps, 'variant'> {
  /** User's current streak days — personalises the headline */
  streakDays?: number;
}

export function PaywallVariantC({
  visible,
  onClose,
  onStartTrial,
  onRestorePurchases,
  reduceMotion = false,
  testID,
  streakDays = 7,
}: PaywallVariantCProps) {
  const config = VARIANT_CONFIGS.motivation;

  const handlers = usePremiumPaywall({
    onClose,
    onRestorePurchases,
    onStartTrial,
    variant: 'motivation',
  });

  const handleStartTrialPress = () => { void handlers.handleStartTrial(); };
  const handleRestorePress = () => { void handlers.handleRestorePurchases(); };

  const streakLabel =
    streakDays === 1
      ? 'Your 1-day streak is at risk without Premium'
      : `Your ${String(streakDays)}-day streak is at risk without Premium`;

  return (
    <Modal
      transparent
      animationType={reduceMotion ? 'fade' : 'slide'}
      testID={testID}
      visible={visible}
      onRequestClose={handlers.handleClose}
    >
      <View className='flex-1 bg-black/90'>
        <BlurOverlayHeader
          disabled={handlers.isProcessing}
          onPress={handlers.handleClose}
        />

        <ScrollView
          className='flex-1 px-5'
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero: streak flame + urgency headline */}
          <LinearGradient
            className='mb-4 items-center rounded-3xl px-5 py-6'
            colors={['#991b1b', '#b45309']}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          >
            <StreakFlame days={streakDays} />
            <Text className='mt-4 text-center text-xl font-black text-white'>
              {streakLabel}
            </Text>
            <Text className='mt-2 text-center text-sm text-white/70'>
              One missed day wipes your streak. Premium gives you a safety net.
            </Text>
          </LinearGradient>

          <UrgencyBanner />

          {/* Without Premium section */}
          <View className='mb-4 rounded-2xl bg-white/5 p-4'>
            <Text className='mb-3 text-sm font-bold uppercase tracking-wider text-red-400'>
              Without Premium you lose:
            </Text>
            {LOSS_ITEMS.map((item) => (
              <LossItem key={item.id} label={item.label} />
            ))}
          </View>

          {/* With Premium section */}
          <View className='mb-6 rounded-2xl bg-emerald-900/40 p-4'>
            <Text className='mb-3 text-sm font-bold uppercase tracking-wider text-emerald-400'>
              Premium protects your progress:
            </Text>
            {GAIN_ITEMS.map((item) => (
              <GainItem key={item.id} label={item.label} />
            ))}
          </View>

          {/* Social proof mini */}
          <Text className='mb-8 text-center text-xs text-white/40'>
            Joined by 10,000+ people protecting their streaks
          </Text>

          {/* CTA */}
          <View className='mb-3 items-center'>
            <Text className='text-3xl font-black text-white'>
              {handlers.priceLabel ?? '$6.99/month'}
            </Text>
            <Text className='mt-1 text-sm text-white/60'>
              7-day free trial · Cancel anytime
            </Text>
          </View>

          <Pressable
            accessibilityHint='Opens subscription options'
            accessibilityLabel='Protect My Streak — Start Free Trial'
            accessibilityRole='button'
            testID='paywall-c-start-trial-button'
            disabled={!handlers.priceLabel}
            onPress={handleStartTrialPress}
            onPressIn={handlers.handleButtonPressIn}
            onPressOut={handlers.handleButtonPressOut}
          >
            <Animated.View style={reduceMotion ? undefined : handlers.buttonAnimatedStyle}>
              <LinearGradient
                className='flex-row items-center justify-center gap-2 rounded-2xl py-4'
                colors={['#047857', '#059669']}
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={handlers.priceLabel ? undefined : { opacity: 0.5 }}
              >
                <Shield color='#ffffff' size={18} />
                <Text className='text-base font-bold text-white'>
                  Protect My Streak — Start Free Trial
                </Text>
                <ChevronRight color='#ffffff' size={18} />
              </LinearGradient>
            </Animated.View>
          </Pressable>

          <Pressable className='mt-3 py-2' onPress={handleRestorePress}>
            <Text className='text-center text-xs text-emerald-400'>
              Already premium? Restore purchases
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}
