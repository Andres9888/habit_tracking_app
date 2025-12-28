/**
 * MotivationPaywall Component
 *
 * Full-screen paywall specifically for Motivation System features.
 * Combines the feature lock UI, benefits modal, and actual purchase flow.
 *
 * This is the main entry point for premium upsell in the Motivation System.
 *
 * Usage:
 * 1. Parent component tracks `showPaywall` state
 * 2. When user hits a premium feature limit, call `onPremiumRequired()`
 * 3. Parent sets `showPaywall = true` and renders <MotivationPaywall />
 * 4. User can close or proceed to purchase
 *
 * @see motivation-system-spec.md - Premium Gating UX section
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Crown,
  X,
  Mic,
  Mail,
  Image,
  Sparkles,
  Shield,
  Eye,
  Check,
  ChevronRight,
  Flame,
} from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { MotivationPremiumFeature } from './PremiumFeatureLock';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Feature display data for the paywall
 */
const PAYWALL_FEATURES = [
  {
    icon: Mic,
    id: 'voiceNotes',
    subtitle: '40% higher emotional recall',
    title: 'Unlimited Voice Notes',
  },
  {
    icon: Mail,
    id: 'letters',
    subtitle: 'Time-locked motivation',
    title: 'Letters to Self',
  },
  {
    icon: Image,
    id: 'visionBoard',
    subtitle: 'Visual goal reinforcement',
    title: 'Vision Board',
  },
  {
    icon: Sparkles,
    id: 'affirmations',
    subtitle: 'Build neural pathways',
    title: 'Unlimited Affirmations',
  },
  {
    icon: Shield,
    id: 'rescueMode',
    subtitle: '#1 streak protection',
    title: 'Rescue Mode',
  },
  {
    icon: Eye,
    id: 'advancedViz',
    subtitle: 'Fear moves you 2x better',
    title: 'Huberman Protocol',
  },
] as const;

interface MotivationPaywallProps {
  /**
   * Whether the paywall is visible
   */
  visible: boolean;

  /**
   * Callback when user closes the paywall
   */
  onClose: () => void;

  /**
   * Callback when user wants to start trial/purchase
   * Returns true if purchase was successful
   */
  onStartTrial: () => Promise<boolean>;

  /**
   * Callback for restoring purchases
   */
  onRestorePurchases?: () => Promise<boolean>;

  /**
   * Which feature triggered the paywall (for analytics and highlighting)
   */
  triggeredByFeature?: MotivationPremiumFeature;

  /**
   * Whether to reduce motion for accessibility
   */
  reduceMotion?: boolean;

  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Feature check item in the paywall
 */
function FeatureCheck({
  icon: Icon,
  title,
  subtitle,
  isHighlighted,
  index,
  reduceMotion,
}: {
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  isHighlighted: boolean;
  index: number;
  reduceMotion: boolean;
}) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);

  React.useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateX.value = 0;
      return;
    }

    const delay = 200 + index * 60;
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
      translateX.value = withSpring(0, { damping: 15 });
    }, delay);

    return () => clearTimeout(timer);
  }, [index, opacity, translateX, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

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
          className={`text-xs ${
            isHighlighted ? 'text-violet-600' : 'text-white/70'
          }`}
        >
          {subtitle}
        </Text>
      </View>
      <Check
        color={isHighlighted ? '#7c3aed' : '#10b981'}
        size={18}
        strokeWidth={2.5}
      />
    </Animated.View>
  );
}

export function MotivationPaywall({
  visible,
  onClose,
  onStartTrial,
  onRestorePurchases,
  triggeredByFeature,
  reduceMotion = false,
  testID,
}: MotivationPaywallProps) {
  const { triggerSelection, triggerLightImpact, triggerSuccess } =
    useHapticFeedback({});
  const [isProcessing, setIsProcessing] = useState(false);
  const buttonScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);

  // Pulsing glow on CTA button
  React.useEffect(() => {
    if (!visible || reduceMotion) return;

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [visible, glowOpacity, reduceMotion]);

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose, triggerLightImpact]);

  const handleStartTrial = useCallback(async () => {
    if (isProcessing) return;

    triggerSelection();
    setIsProcessing(true);

    try {
      const success = await onStartTrial();
      if (success) {
        triggerSuccess();
        onClose();
      }
    } catch {
      Alert.alert(
        'Something went wrong',
        'Please try again or contact support.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, onStartTrial, onClose, triggerSelection, triggerSuccess]);

  const handleRestorePurchases = useCallback(async () => {
    if (isProcessing || !onRestorePurchases) return;

    triggerLightImpact();
    setIsProcessing(true);

    try {
      const success = await onRestorePurchases();
      if (success) {
        triggerSuccess();
        onClose();
      } else {
        Alert.alert(
          'No purchases found',
          "We couldn't find any previous purchases. Start a new subscription to unlock premium features.",
          [{ text: 'OK' }]
        );
      }
    } catch {
      Alert.alert('Restore failed', 'Please try again or contact support.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsProcessing(false);
    }
  }, [
    isProcessing,
    onRestorePurchases,
    onClose,
    triggerLightImpact,
    triggerSuccess,
  ]);

  const handleButtonPressIn = useCallback(() => {
    buttonScale.value = withTiming(0.97, { duration: 100 });
  }, [buttonScale]);

  const handleButtonPressOut = useCallback(() => {
    buttonScale.value = withTiming(1, { duration: 100 });
  }, [buttonScale]);

  return (
    <Modal
      transparent
      animationType={reduceMotion ? 'fade' : 'slide'}
      testID={testID}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className='flex-1'>
        {/* Blurred background */}
        <BlurView className='absolute inset-0' intensity={80} tint='dark' />

        {/* Content overlay */}
        <View className='flex-1 bg-black/40'>
          {/* Close button */}
          <View className='flex-row justify-end px-4 pt-14'>
            <Pressable
              accessibilityLabel='Close'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full bg-white/20'
              hitSlop={12}
              onPress={handleClose}
            >
              <X color='#ffffff' size={22} />
            </Pressable>
          </View>

          {/* Main content */}
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
                Unlock Premium Motivation
              </Text>
              <Text className='text-center text-base text-white/80'>
                Science-backed tools to help you build{'\n'}lasting habits
              </Text>
            </View>

            {/* Features list */}
            <View className='mb-6'>
              {PAYWALL_FEATURES.map((feature, index) => (
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

            {/* Social proof */}
            <View className='mb-6 flex-row items-center justify-center gap-2'>
              <View className='flex-row'>
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    className='-ml-2 h-8 w-8 items-center justify-center rounded-full border-2 border-white/30 bg-violet-400 first:ml-0'
                  >
                    <Text className='text-xs font-bold text-white'>
                      {['J', 'M', 'K'][i - 1]}
                    </Text>
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

            {/* Pricing card */}
            <View className='mb-4 overflow-hidden rounded-2xl border-2 border-violet-400/50 bg-white/10'>
              <View className='items-center px-4 py-4'>
                <Text className='mb-1 text-xs font-semibold uppercase tracking-wide text-violet-300'>
                  Premium Subscription
                </Text>
                <View className='flex-row items-baseline gap-1'>
                  <Text className='text-3xl font-bold text-white'>$6.99</Text>
                  <Text className='text-base text-white/70'>/month</Text>
                </View>
                <Text className='mt-1 text-xs text-white/60'>
                  7-day free trial • Cancel anytime
                </Text>
              </View>
            </View>

            {/* CTA Button with glow */}
            <View className='mb-4'>
              <Pressable
                accessibilityHint='Opens subscription purchase flow'
                accessibilityLabel='Start 7-Day Free Trial'
                accessibilityRole='button'
                disabled={isProcessing}
                onPress={handleStartTrial}
                onPressIn={handleButtonPressIn}
                onPressOut={handleButtonPressOut}
              >
                {/* Glow effect */}
                <Animated.View
                  className='absolute inset-0 rounded-xl bg-violet-500'
                  style={[
                    reduceMotion ? undefined : glowAnimatedStyle,
                    { transform: [{ scale: 1.05 }] },
                  ]}
                />

                <Animated.View
                  style={reduceMotion ? undefined : buttonAnimatedStyle}
                >
                  <LinearGradient
                    className='flex-row items-center justify-center gap-2 rounded-xl py-4'
                    colors={['#8b5cf6', '#7c3aed']}
                    end={{ x: 1, y: 0 }}
                    start={{ x: 0, y: 0 }}
                  >
                    <Text className='text-lg font-bold text-white'>
                      {isProcessing
                        ? 'Processing...'
                        : 'Start 7-Day Free Trial'}
                    </Text>
                    {!isProcessing && (
                      <ChevronRight color='#ffffff' size={20} />
                    )}
                  </LinearGradient>
                </Animated.View>
              </Pressable>
            </View>

            {/* Restore purchases */}
            {onRestorePurchases && (
              <Pressable
                className='py-2'
                disabled={isProcessing}
                onPress={handleRestorePurchases}
              >
                <Text className='text-center text-sm text-violet-300'>
                  Already premium? Restore purchases
                </Text>
              </Pressable>
            )}

            {/* Fine print */}
            <Text className='mt-4 text-center text-xs text-white/40'>
              By starting your trial, you agree to our Terms of Service and
              Privacy Policy. You won't be charged until your 7-day trial ends.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default MotivationPaywall;
