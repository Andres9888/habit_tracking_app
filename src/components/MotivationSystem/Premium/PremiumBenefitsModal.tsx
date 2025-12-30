/**
 * PremiumBenefitsModal Component
 *
 * A modal that displays all premium motivation features with their
 * benefits and scientific backing. Designed to educate users on
 * the value of premium before showing the paywall.
 *
 * Follows the "soft paywall" approach: show value before asking for payment.
 *
 * @see motivation-system-spec.md - Premium Tier section
 */

import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
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
  Star,
} from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';

const { height: screenHeight } = Dimensions.get('window');

/**
 * Premium motivation features with their details
 */
const PREMIUM_FEATURES = [
  {
    accentColor: '#14b8a6',
    description: 'Record audio motivation from your most inspired moments',
    freeLimit: '1 recording',
    icon: Mic,
    id: 'voiceNotes',
    premiumValue: 'Unlimited recordings',
    scienceFact: 'Voice has 40% higher emotional recall than text',
    title: 'Unlimited Voice Notes', // teal-500
  },
  {
    accentColor: '#8b5cf6',
    description: 'Write time-locked messages that unlock in the future',
    freeLimit: 'Not available',
    icon: Mail,
    id: 'letters',
    premiumValue: 'Unlimited letters',
    scienceFact: 'Connecting with future self increases self-control',
    title: 'Letters to Self', // violet-500
  },
  {
    accentColor: '#d946ef',
    description: 'Create a visual collection of your motivation',
    freeLimit: 'Not available',
    icon: Image,
    id: 'visionBoard',
    premiumValue: '4 images per habit',
    scienceFact: 'Personal images create stronger emotional connections',
    title: 'Vision Board', // fuchsia-500
  },
  {
    accentColor: '#f59e0b',
    description: 'Add as many daily affirmations as you need',
    freeLimit: '2 affirmations',
    icon: Sparkles,
    id: 'affirmations',
    premiumValue: 'Unlimited affirmations',
    scienceFact: 'Repetition builds neural pathways',
    title: 'Unlimited Affirmations', // amber-500
  },
  {
    accentColor: '#ef4444',
    description: 'Get interventions when your streak is at risk',
    freeLimit: 'Not available',
    icon: Shield,
    id: 'rescueMode',
    premiumValue: 'Smart streak protection',
    scienceFact: 'Streak rescue is #1 retention driver (Duolingo)',
    title: 'Rescue Mode', // red-500
  },
  {
    accentColor: '#10b981',
    description: 'Full Huberman protocol with Body/Mind/Emotion breakdown',
    freeLimit: 'Basic visualization',
    icon: Eye,
    id: 'advancedViz',
    premiumValue: 'Complete protocol',
    scienceFact: 'Fear moves you 2x better when unmotivated',
    title: 'Advanced Visualization', // emerald-500
  },
] as const;

interface PremiumBenefitsModalProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean;

  /**
   * Callback when user wants to close the modal
   */
  onClose: () => void;

  /**
   * Callback when user wants to start the trial/upgrade
   */
  onStartTrial: () => void;

  /**
   * Which feature triggered the modal (for highlighting)
   */
  triggeredByFeature?: string;

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
 * Single feature row in the benefits list
 */
function FeatureRow({
  feature,
  isHighlighted,
  index,
  reduceMotion,
}: {
  feature: (typeof PREMIUM_FEATURES)[number];
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
      {/* Highlighted badge */}
      {isHighlighted && (
        <View className='flex-row items-center gap-1 bg-violet-100 px-3 py-1'>
          <Star className='text-violet-600' fill='#7c3aed' size={12} />
          <Text className='text-xs font-semibold text-violet-700'>
            You tried to use this feature
          </Text>
        </View>
      )}

      <View className='flex-row items-start gap-3 p-3'>
        {/* Icon */}
        <View
          className='h-10 w-10 items-center justify-center rounded-xl'
          style={{ backgroundColor: `${feature.accentColor}20` }}
        >
          <Icon color={feature.accentColor} size={20} />
        </View>

        {/* Content */}
        <View className='flex-1'>
          <Text className='mb-0.5 text-sm font-semibold text-stone-800'>
            {feature.title}
          </Text>
          <Text className='mb-2 text-xs text-stone-500'>
            {feature.description}
          </Text>

          {/* Free vs Premium comparison */}
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

      {/* Science fact footer */}
      <View className='flex-row items-center gap-2 border-t border-stone-100 bg-stone-50 px-3 py-2'>
        <Sparkles className='text-amber-500' size={12} />
        <Text className='flex-1 text-[10px] italic text-stone-500'>
          {feature.scienceFact}
        </Text>
      </View>
    </Animated.View>
  );
}

export function PremiumBenefitsModal({
  visible,
  onClose,
  onStartTrial,
  triggeredByFeature,
  reduceMotion = false,
  testID,
}: PremiumBenefitsModalProps) {
  const { triggerSelection, triggerLightImpact } = useHapticFeedback({});
  const buttonScale = useSharedValue(1);

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose, triggerLightImpact]);

  const handleStartTrial = useCallback(() => {
    triggerSelection();
    onStartTrial();
  }, [onStartTrial, triggerSelection]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleButtonPressIn = useCallback(() => {
    buttonScale.value = withTiming(0.97, { duration: 100 });
  }, [buttonScale]);

  const handleButtonPressOut = useCallback(() => {
    buttonScale.value = withTiming(1, { duration: 100 });
  }, [buttonScale]);

  // Sort features to put highlighted one first
  const sortedFeatures = [...PREMIUM_FEATURES].sort((a, b) => {
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
            <X className='text-stone-500' size={20} />
          </Pressable>
        </View>

        {/* Hero section */}
        <LinearGradient
          className='px-4 py-5'
          colors={['#8b5cf6', '#7c3aed']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
        >
          <Text className='mb-1 text-center text-xl font-bold text-white'>
            Unlock Your Full Motivation Toolkit
          </Text>
          <Text className='text-center text-sm text-violet-100'>
            Science-backed features proven to increase habit retention by 3x
          </Text>
        </LinearGradient>

        {/* Features list */}
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

          {/* Social proof */}
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

        {/* Fixed CTA footer */}
        <View className='absolute bottom-0 left-0 right-0 border-t border-stone-200 bg-white px-4 pb-8 pt-4'>
          {/* Pricing */}
          <View className='mb-3 items-center'>
            <View className='flex-row items-baseline gap-1'>
              <Text className='text-2xl font-bold text-stone-800'>$6.99</Text>
              <Text className='text-sm text-stone-500'>/month</Text>
            </View>
            <Text className='text-xs text-stone-400'>
              7-day free trial • Cancel anytime
            </Text>
          </View>

          {/* CTA Button */}
          <Pressable
            accessibilityHint='Opens subscription options'
            accessibilityLabel='Start 7-Day Free Trial'
            accessibilityRole='button'
            onPress={handleStartTrial}
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

          {/* Restore purchases */}
          <Pressable
            className='mt-2 py-2'
            onPress={() => {
              triggerLightImpact();
              // TODO: Implement restore purchases
            }}
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

export default PremiumBenefitsModal;
