/**
 * WOOPSection Component
 * Displays and allows editing of the WOOP (Wish-Outcome-Obstacle-Plan) framework
 *
 * Part of the Motivation System Workshop tab
 * Story T4.2-T4.5: Create WOOPSection with 4 fields
 *
 * Scientific Basis:
 * - Gabriele Oettingen (NYU): 20+ peer-reviewed studies
 * - Mental contrasting + implementation intentions = 2x goal achievement
 * - Book: "Rethinking Positive Thinking" (2014)
 * - The IF-THEN plan is the key implementation intention that doubles follow-through
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Target, Plus, Check, HelpCircle, X, Pencil } from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import {
  PulsingIcon,
  CompletionCheckmark,
  SPRING_BUTTON,
  SPRING_GENTLE,
  STAGGER_DELAY,
} from '../../animations';

export interface WOOPData {
  /** Wish - what you want to achieve */
  wish?: string;
  /** Outcome - best result from achieving the wish */
  outcome?: string;
  /** Obstacle - main inner obstacle preventing you */
  obstacle?: string;
  /** Plan - IF obstacle THEN action */
  plan?: string;
}

export interface WOOPSectionProps {
  /** The habit's WOOP data */
  woop: WOOPData | undefined;
  /** Callback when user taps to edit/add their WOOP */
  onPress: () => void;
  /** Whether to run entrance animations (first tab visit only) */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
}

/**
 * SectionCard Component for consistent styling with press animation
 * Matches mockup: app-card with border, 16px radius, subtle shadow
 */
function SectionCard({
  children,
  className,
  onPress,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.05);
  const elevation = useSharedValue(2);

  const animatedStyle = useAnimatedStyle(() => ({
    elevation: elevation.value,
    shadowOffset: {
      height: interpolate(elevation.value, [1, 2], [1, 2]),
      width: 0,
    },
    shadowOpacity: shadowOpacity.value,
    shadowRadius: interpolate(elevation.value, [1, 2], [4, 8]),
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(0.98, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.02, SPRING_BUTTON);
    elevation.value = withSpring(1, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.05, SPRING_BUTTON);
    elevation.value = withSpring(2, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [onPress]);

  if (onPress) {
    return (
      <Animated.View
        style={[
          animatedStyle,
          { shadowColor: '#000' },
        ]}
      >
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole='button'
          className={clsx('rounded-xl border border-stone-200 bg-white p-3', className)}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View
      className={clsx(
        'rounded-xl border border-stone-200 bg-white p-3',
        className
      )}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {children}
    </View>
  );
}

/**
 * AnimatedSection Component for staggered entrance animations
 */
function AnimatedSection({
  children,
  index,
  shouldAnimate,
  reduceMotion = false,
}: {
  children: React.ReactNode;
  index: number;
  shouldAnimate: boolean;
  reduceMotion?: boolean;
}) {
  const INITIAL_TRANSLATE_Y = 24;

  const translateY = useSharedValue(
    shouldAnimate && !reduceMotion ? INITIAL_TRANSLATE_Y : 0
  );
  const opacity = useSharedValue(shouldAnimate && !reduceMotion ? 0 : 1);

  useEffect(() => {
    if (!shouldAnimate || reduceMotion) {
      translateY.value = 0;
      opacity.value = 1;
      return;
    }

    const delay = index * STAGGER_DELAY;

    const timeout = setTimeout(() => {
      translateY.value = withSpring(0, SPRING_GENTLE);
      opacity.value = withTiming(1, { duration: 300 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [shouldAnimate, reduceMotion, index, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * WOOPField Component - Individual WOOP field display
 * Uses amber for W and O (positive), rose for second O (obstacle), primary for P (plan)
 */
function WOOPField({
  letter,
  label,
  value,
  letterColorClass,
  valueColorClass = 'text-stone-600',
  isBold = false,
}: {
  letter: string;
  label: string;
  value?: string;
  letterColorClass: string;
  valueColorClass?: string;
  isBold?: boolean;
}) {
  return (
    <View className='flex-row gap-2'>
      <Text className={clsx('w-5 font-bold', letterColorClass)}>{letter}</Text>
      <Text
        className={clsx('flex-1 text-xs', valueColorClass, isBold && 'font-medium')}
        numberOfLines={2}
      >
        {value || `Add your ${label.toLowerCase()}...`}
      </Text>
    </View>
  );
}

/**
 * WOOPExplainer Modal - Shows explanation of the WOOP method
 */
function WOOPExplainerModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      animationType='fade'
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <Pressable
        className='flex-1 items-center justify-center bg-black/50 px-6'
        onPress={onClose}
      >
        <Pressable
          className='w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl'
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className='mb-4 flex-row items-start justify-between'>
            <View className='flex-row items-center gap-2'>
              <View className='h-10 w-10 items-center justify-center rounded-xl bg-amber-100'>
                <Target className='text-amber-600' size={20} />
              </View>
              <View>
                <Text className='text-lg font-bold text-stone-800'>
                  WOOP Method
                </Text>
                <Text className='text-xs text-stone-500'>
                  Dr. Gabriele Oettingen, NYU
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityLabel='Close'
              className='h-8 w-8 items-center justify-center rounded-full bg-stone-100'
              onPress={onClose}
            >
              <X className='text-stone-500' size={16} />
            </Pressable>
          </View>

          {/* Description */}
          <Text className='mb-4 text-sm leading-relaxed text-stone-600'>
            WOOP is a science-backed mental strategy proven in 20+ studies to{' '}
            <Text className='font-semibold text-stone-800'>
              double goal achievement
            </Text>
            . It combines positive thinking with realistic obstacle planning.
          </Text>

          {/* WOOP breakdown */}
          <View className='mb-4 gap-3'>
            <View className='flex-row gap-3'>
              <View className='h-8 w-8 items-center justify-center rounded-lg bg-amber-100'>
                <Text className='font-bold text-amber-600'>W</Text>
              </View>
              <View className='flex-1'>
                <Text className='font-semibold text-stone-800'>Wish</Text>
                <Text className='text-xs text-stone-500'>
                  What do you want to achieve?
                </Text>
              </View>
            </View>
            <View className='flex-row gap-3'>
              <View className='h-8 w-8 items-center justify-center rounded-lg bg-amber-100'>
                <Text className='font-bold text-amber-600'>O</Text>
              </View>
              <View className='flex-1'>
                <Text className='font-semibold text-stone-800'>Outcome</Text>
                <Text className='text-xs text-stone-500'>
                  Best result of fulfilling your wish?
                </Text>
              </View>
            </View>
            <View className='flex-row gap-3'>
              <View className='h-8 w-8 items-center justify-center rounded-lg bg-rose-100'>
                <Text className='font-bold text-rose-500'>O</Text>
              </View>
              <View className='flex-1'>
                <Text className='font-semibold text-stone-800'>Obstacle</Text>
                <Text className='text-xs text-stone-500'>
                  Main inner obstacle preventing you?
                </Text>
              </View>
            </View>
            <View className='flex-row gap-3'>
              <View className='h-8 w-8 items-center justify-center rounded-lg bg-emerald-100'>
                <Text className='font-bold text-emerald-500'>P</Text>
              </View>
              <View className='flex-1'>
                <Text className='font-semibold text-stone-800'>Plan</Text>
                <Text className='text-xs text-stone-500'>
                  If [obstacle], then I will [action]
                </Text>
              </View>
            </View>
          </View>

          {/* Key insight */}
          <View className='rounded-xl bg-amber-50 p-3'>
            <Text className='text-xs leading-relaxed text-amber-800'>
              💡 The IF-THEN plan creates an{' '}
              <Text className='font-semibold'>implementation intention</Text> —
              a mental link that triggers automatic action when you face your
              obstacle.
            </Text>
          </View>

          {/* Source */}
          <Text className='mt-3 text-center text-xs italic text-stone-400'>
            Source: "Rethinking Positive Thinking" (2014)
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/**
 * Checks if the WOOP data has at least one field filled
 */
function hasWOOPData(woop: WOOPData | undefined): boolean {
  if (!woop) return false;
  return !!(woop.wish || woop.outcome || woop.obstacle || woop.plan);
}

/**
 * Checks if the WOOP data is complete (all 4 fields filled)
 */
function isWOOPComplete(woop: WOOPData | undefined): boolean {
  if (!woop) return false;
  return !!(woop.wish && woop.outcome && woop.obstacle && woop.plan);
}

/**
 * Formats the IF-THEN implementation intention preview
 */
function formatIfThen(woop: WOOPData): string | null {
  if (!woop.obstacle || !woop.plan) return null;
  return `If ${woop.obstacle.toLowerCase()} → ${woop.plan.toLowerCase()}`;
}

/**
 * WOOPSection - Main component
 *
 * Displays the WOOP (Wish-Outcome-Obstacle-Plan) framework with:
 * - Empty state: Pulsing target icon with "Set up" CTA
 * - Filled state: W-O-O-P letters in amber/rose/emerald colors
 * - Highlighted IF-THEN implementation intention
 * - Help button for WOOP explainer modal
 * - Completion checkmark when all fields are filled
 */
export function WOOPSection({
  woop,
  onPress,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 3,
}: WOOPSectionProps) {
  const [showExplainer, setShowExplainer] = useState(false);

  const hasWoop = hasWOOPData(woop);
  const isComplete = isWOOPComplete(woop);
  const ifThenPreview = woop ? formatIfThen(woop) : null;

  const handleHelpPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowExplainer(true);
  }, []);

  return (
    <>
      <AnimatedSection
        index={sectionIndex}
        reduceMotion={reduceMotion}
        shouldAnimate={shouldAnimate}
      >
        <SectionCard
          accessibilityLabel={hasWoop ? 'Edit your WOOP plan' : 'Add your WOOP plan'}
          onPress={onPress}
        >
          {/* Header row: icon + title on left, action on right */}
          <View className='mb-2 flex-row items-center justify-between'>
            <View className='flex-row items-center gap-2'>
              <Text className="text-base">🎯</Text>
              <Text className='text-xs font-semibold text-stone-800'>
                WOOP Plan
              </Text>
            </View>
            <View className='flex-row items-center gap-2'>
              <Pressable
                accessibilityLabel='Learn about WOOP'
                className='h-6 w-6 items-center justify-center rounded-full'
                hitSlop={8}
                onPress={handleHelpPress}
              >
                <HelpCircle className='text-stone-400' size={16} />
              </Pressable>
              {hasWoop ? (
                <Pencil className='text-stone-400' size={14} />
              ) : (
                <View className='flex-row items-center gap-1'>
                  <Plus className='text-stone-600' size={12} />
                  <Text className='text-xs font-medium text-stone-600'>Set up</Text>
                </View>
              )}
            </View>
          </View>

          {/* Content */}
          {hasWoop ? (
            <View className='gap-1.5'>
              <WOOPField
                label='Wish'
                letter='W'
                letterColorClass='text-amber-500'
                value={woop?.wish}
              />
              <WOOPField
                label='Outcome'
                letter='O'
                letterColorClass='text-amber-500'
                value={woop?.outcome}
              />
              <WOOPField
                label='Obstacle'
                letter='O'
                letterColorClass='text-rose-500'
                value={woop?.obstacle}
              />
              <WOOPField
                isBold
                label='Plan'
                letter='P'
                letterColorClass='text-emerald-500'
                value={woop?.plan}
                valueColorClass='text-stone-900'
              />
            </View>
          ) : (
            <Text className='text-sm text-stone-500'>
              Wish-Outcome-Obstacle-Plan framework
            </Text>
          )}

          {/* Completion checkmark */}
          <CompletionCheckmark
            isVisible={isComplete}
            reduceMotion={reduceMotion}
            sectionIndex={sectionIndex}
            shouldAnimate={shouldAnimate}
          />
        </SectionCard>
      </AnimatedSection>

      {/* WOOP Explainer Modal */}
      <WOOPExplainerModal
        onClose={() => setShowExplainer(false)}
        visible={showExplainer}
      />
    </>
  );
}

export default WOOPSection;
