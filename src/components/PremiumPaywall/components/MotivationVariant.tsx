/**
 * Motivation variant of the PremiumPaywall
 * Full-screen dark modal with blur, glow CTA, social proof
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, X, Check, Flame, ChevronRight } from 'lucide-react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import {
  MOTIVATION_FEATURES,
  VARIANT_HERO,
} from '../PremiumPaywall.constants';
import {
  useFeatureAnimation,
  useGlowAnimation,
  useButtonAnimation,
} from '../usePaywallAnimations';
import { usePurchaseFlow } from '../usePurchaseFlow';
import type { PremiumPaywallProps } from '../PremiumPaywall.types';
import { PricingCard } from './PricingCard';

type MotivationVariantProps = Pick<
  PremiumPaywallProps,
  | 'visible'
  | 'onClose'
  | 'onStartTrial'
  | 'onRestorePurchases'
  | 'triggeredByFeature'
  | 'reduceMotion'
  | 'testID'
>;

export function MotivationVariant({
  visible = false,
  onClose,
  onStartTrial,
  onRestorePurchases,
  triggeredByFeature,
  reduceMotion = false,
  testID,
}: MotivationVariantProps) {
  const hero = VARIANT_HERO.motivation;
  const {
    monthlyPackage,
    annualPackage,
    setSelectedPackage,
    handleClose,
    handlePurchase,
    handleRestore,
    isProcessing,
  } = usePurchaseFlow({ onClose, onStartTrial, onRestorePurchases });

  const { glowAnimatedStyle } = useGlowAnimation(visible, reduceMotion);
  const {
    buttonAnimatedStyle,
    handlePressIn,
    handlePressOut,
  } = useButtonAnimation(reduceMotion);

  return (
    <Modal
      transparent
      animationType={reduceMotion ? 'fade' : 'slide'}
      testID={testID}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className='flex-1'>
        <BlurView className='absolute inset-0' intensity={80} tint='dark' />
        <View className='flex-1 bg-black/40'>
          {/* Close */}
          <View className='flex-row justify-end px-4 pt-14'>
            <Pressable
              accessibilityLabel='Close'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full bg-white/20'
              hitSlop={12}
              onPress={handleClose}
            >
              <X color='#ffffff' size={24} />
            </Pressable>
          </View>

          <ScrollView
            className='flex-1 px-5'
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero */}
            <View className='mb-6 mt-4 items-center'>
              <LinearGradient
                className='mb-4 h-20 w-20 items-center justify-center rounded-3xl'
                colors={['#8b5cf6', '#7c3aed']}
                end={{ x: 1, y: 1 }}
                start={{ x: 0, y: 0 }}
              >
                <Crown color='#ffffff' size={40} />
              </LinearGradient>
              <Text className='mb-2 text-center text-2xl font-bold text-white'>
                {hero.title}
              </Text>
              <Text className='text-center text-base text-white/80'>
                {hero.subtitle}
              </Text>
            </View>

            {/* Features */}
            <View className='mb-6'>
              {MOTIVATION_FEATURES.map((feature, index) => (
                <FeatureCheck
                  key={feature.id}
                  icon={feature.icon}
                  index={index}
                  isHighlighted={feature.id === triggeredByFeature}
                  reduceMotion={reduceMotion}
                  subtitle={feature.subtitle}
                  title={feature.title}
                />
              ))}
            </View>

            {/* Social Proof */}
            <View className='mb-6 flex-row items-center justify-center gap-2'>
              <View className='flex-row'>
                {['J', 'M', 'K'].map((initial, i) => (
                  <View
                    key={initial}
                    className={`h-8 w-8 items-center justify-center rounded-full border-2 border-white/30 bg-violet-400 ${
                      i > 0 ? '-ml-2' : ''
                    }`}
                  >
                    <Text className='text-xs font-bold text-white'>{initial}</Text>
                  </View>
                ))}
              </View>
              <View className='flex-row items-center gap-1'>
                <Flame color='#f59e0b' fill='#f59e0b' size={14} />
                <Text className='text-sm text-white/80'>
                  10,000+ users building habits
                </Text>
              </View>
            </View>

            {/* Pricing */}
            <PricingCard
              annualPackage={annualPackage}
              monthlyPackage={monthlyPackage}
              onPackageChange={setSelectedPackage}
            />

            {/* CTA */}
            <View className='mb-4'>
              <Pressable
                accessibilityHint='Opens subscription purchase flow'
                accessibilityLabel='Start 7-Day Free Trial'
                accessibilityRole='button'
                disabled={isProcessing}
                onPress={() => void handlePurchase()}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <Animated.View
                  className='absolute inset-0 rounded-xl bg-violet-500'
                  style={[
                    reduceMotion ? undefined : glowAnimatedStyle,
                    { transform: [{ scale: 1.05 }] },
                  ]}
                />
                <Animated.View style={reduceMotion ? undefined : buttonAnimatedStyle}>
                  <LinearGradient
                    className='flex-row items-center justify-center gap-2 rounded-xl py-4'
                    colors={['#8b5cf6', '#7c3aed']}
                    end={{ x: 1, y: 0 }}
                    start={{ x: 0, y: 0 }}
                  >
                    <Text className='text-lg font-bold text-white'>
                      {isProcessing ? 'Processing...' : 'Start 7-Day Free Trial'}
                    </Text>
                    {!isProcessing && (
                      <ChevronRight color='#ffffff' size={20} />
                    )}
                  </LinearGradient>
                </Animated.View>
              </Pressable>
            </View>

            {/* Footer */}
            <Pressable
              accessibilityLabel='Restore purchases'
              accessibilityRole='button'
              accessibilityState={{ disabled: isProcessing }}
              className='py-3'
              disabled={isProcessing}
              onPress={() => void handleRestore()}
            >
              <Text className='text-center text-sm text-violet-300'>
                Already premium? Restore purchases
              </Text>
            </Pressable>
            <Text className='mt-4 text-center text-sm text-white/50'>
              By starting your trial, you agree to our Terms of Service and Privacy
              Policy. Subscription auto-renews at $6.99/month after your 7-day free
              trial. Cancel anytime before trial ends to avoid charges.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Inline sub-components ──

function FeatureCheck({
  icon: Icon,
  title,
  subtitle,
  isHighlighted,
  index,
  reduceMotion,
}: {
  icon: React.ComponentType<{ color: string; size: number }>;
  title: string;
  subtitle: string;
  isHighlighted: boolean;
  index: number;
  reduceMotion: boolean;
}) {
  const { animatedStyle, animate } = useFeatureAnimation(index, reduceMotion);

  useEffect(() => {
    animate();
  }, [animate]);

  return (
    <Animated.View
      className={`mb-2 flex-row items-center gap-3 rounded-lg px-3 py-2 ${
        isHighlighted ? 'bg-violet-100/80' : 'bg-white/10'
      }`}
      style={reduceMotion ? undefined : animatedStyle}
    >
      <View
        className={`h-8 w-8 items-center justify-center rounded-lg ${
          isHighlighted ? 'bg-violet-200' : 'bg-white/20'
        }`}
      >
        <Icon color={isHighlighted ? '#7c3aed' : '#ffffff'} size={16} />
      </View>
      <View className='flex-1'>
        <Text
          className={`text-sm font-semibold ${
            isHighlighted ? 'text-violet-900' : 'text-white'
          }`}
        >
          {title}
        </Text>
        <Text
          className={`text-xs ${isHighlighted ? 'text-violet-600' : 'text-white/70'}`}
        >
          {subtitle}
        </Text>
      </View>
      <Check color={isHighlighted ? '#7c3aed' : '#10b981'} size={18} strokeWidth={2.5} />
    </Animated.View>
  );
}
