/**
 * DualVizSetup Component
 * Displays and allows editing of success/failure visualizations
 *
 * Part of the Motivation System Workshop tab
 * Story T5.2-T5.6: Create DualVizSetup with Body/Mind/Emotion fields
 *
 * Scientific Basis:
 * - Andrew Huberman (Stanford, 5M YouTube subscribers)
 * - Episode #55: "The Science of Setting & Achieving Goals"
 * - Key insight: Visualize FAILURE when unmotivated (fear drives action 2x)
 * - Loss aversion (Kahneman & Tversky, Nobel Prize): Losses hurt 2x more
 *
 * Protocol:
 * - Motivated user → Show SUCCESS visualization (amplifies existing drive)
 * - Unmotivated user → Show FAILURE visualization (fear moves you 2x better)
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
import {
  Plus,
  Check,
  HelpCircle,
  X,
  Sparkles,
  AlertTriangle,
  Pencil,
  Eye,
} from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import {
  PulsingIcon,
  CompletionCheckmark,
  SPRING_BUTTON,
  SPRING_GENTLE,
  STAGGER_DELAY,
} from '../../animations';

export interface VisualizationData {
  /** Success visualization - how body feels when succeeding */
  successBody?: string;
  /** Success visualization - how mind feels when succeeding */
  successMind?: string;
  /** Success visualization - emotions when succeeding */
  successEmotion?: string;
  /** Failure visualization - how body feels when failing */
  failureBody?: string;
  /** Failure visualization - how mind feels when failing */
  failureMind?: string;
  /** Failure visualization - emotions when failing */
  failureEmotion?: string;
}

export interface DualVizSetupProps {
  /** The habit's visualization data */
  visualization: VisualizationData | undefined;
  /** Callback when user taps to edit/add visualizations */
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
 * VizField Component - Individual visualization field display
 * Shows Body/Mind/Emotion with appropriate icons
 */
function VizField({
  label,
  value,
  icon,
  colorClass = 'text-stone-600',
  placeholder,
}: {
  label: string;
  value?: string;
  icon: React.ReactNode;
  colorClass?: string;
  placeholder: string;
}) {
  return (
    <View className='flex-row items-start gap-2'>
      <View className='mt-0.5 h-4 w-4 items-center justify-center'>{icon}</View>
      <View className='flex-1'>
        <Text className='text-xs font-medium text-stone-500'>{label}</Text>
        <Text
          className={clsx(
            'text-xs',
            value ? colorClass : 'italic text-stone-400'
          )}
          numberOfLines={2}
        >
          {value || placeholder}
        </Text>
      </View>
    </View>
  );
}

/**
 * VizPreview Component - Compact preview of success or failure visualization
 */
function VizPreview({
  type,
  body,
  mind,
  emotion,
}: {
  type: 'success' | 'failure';
  body?: string;
  mind?: string;
  emotion?: string;
}) {
  const isSuccess = type === 'success';
  const hasAnyField = body || mind || emotion;

  if (!hasAnyField) {
    return (
      <View
        className={clsx(
          'flex-1 rounded-xl p-3',
          isSuccess ? 'bg-emerald-50' : 'bg-rose-50'
        )}
      >
        <View className='mb-2 flex-row items-center gap-2'>
          {isSuccess ? (
            <Sparkles className='text-emerald-600' size={14} />
          ) : (
            <AlertTriangle className='text-rose-500' size={14} />
          )}
          <Text
            className={clsx(
              'text-xs font-semibold',
              isSuccess ? 'text-emerald-700' : 'text-rose-700'
            )}
          >
            {isSuccess ? 'Success' : 'Failure'}
          </Text>
        </View>
        <Text className='text-xs italic text-stone-400'>
          {isSuccess ? 'How will you feel?' : 'What will you avoid?'}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={clsx(
        'flex-1 rounded-xl p-3',
        isSuccess ? 'bg-emerald-50' : 'bg-rose-50'
      )}
    >
      <View className='mb-2 flex-row items-center gap-2'>
        {isSuccess ? (
          <Sparkles className='text-emerald-600' size={14} />
        ) : (
          <AlertTriangle className='text-rose-500' size={14} />
        )}
        <Text
          className={clsx(
            'text-xs font-semibold',
            isSuccess ? 'text-emerald-700' : 'text-rose-700'
          )}
        >
          {isSuccess ? 'Success' : 'Failure'}
        </Text>
      </View>
      <View className='gap-1'>
        {body && (
          <Text
            className={clsx(
              'text-xs',
              isSuccess ? 'text-emerald-800' : 'text-rose-800'
            )}
            numberOfLines={1}
          >
            <Text className='font-medium'>Body:</Text> {body}
          </Text>
        )}
        {mind && (
          <Text
            className={clsx(
              'text-xs',
              isSuccess ? 'text-emerald-800' : 'text-rose-800'
            )}
            numberOfLines={1}
          >
            <Text className='font-medium'>Mind:</Text> {mind}
          </Text>
        )}
        {emotion && (
          <Text
            className={clsx(
              'text-xs',
              isSuccess ? 'text-emerald-800' : 'text-rose-800'
            )}
            numberOfLines={1}
          >
            <Text className='font-medium'>Feel:</Text> {emotion}
          </Text>
        )}
      </View>
    </View>
  );
}

/**
 * DualVizExplainer Modal - Shows explanation of the Huberman visualization protocol
 */
function DualVizExplainerModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
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
              <View className='h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-rose-100'>
                <Eye className='text-stone-700' size={20} />
              </View>
              <View>
                <Text className='text-lg font-bold text-stone-800'>
                  Dual Visualization
                </Text>
                <Text className='text-xs text-stone-500'>
                  Andrew Huberman, Stanford
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

          {/* Key insight - highlighted */}
          <View className='mb-4 rounded-xl bg-gradient-to-r from-rose-50 to-amber-50 p-3'>
            <Text className='text-sm font-semibold text-rose-800'>
              💡 Fear moves you 2x better
            </Text>
            <Text className='mt-1 text-xs leading-relaxed text-rose-700'>
              When you're unmotivated, visualizing{' '}
              <Text className='font-bold'>failure</Text> is more effective than
              visualizing success. Loss aversion makes avoiding pain 2x more
              motivating than seeking pleasure.
            </Text>
          </View>

          {/* Protocol explanation */}
          <Text className='mb-3 text-sm leading-relaxed text-stone-600'>
            This protocol uses{' '}
            <Text className='font-semibold text-stone-800'>context-aware</Text>{' '}
            visualization to optimize motivation:
          </Text>

          {/* When to use which */}
          <View className='mb-4 gap-3'>
            <View className='flex-row gap-3'>
              <View className='h-8 w-8 items-center justify-center rounded-lg bg-emerald-100'>
                <Sparkles className='text-emerald-600' size={16} />
              </View>
              <View className='flex-1'>
                <Text className='font-semibold text-emerald-700'>
                  Feeling Motivated?
                </Text>
                <Text className='text-xs text-stone-500'>
                  Visualize SUCCESS → Amplify your drive
                </Text>
              </View>
            </View>
            <View className='flex-row gap-3'>
              <View className='h-8 w-8 items-center justify-center rounded-lg bg-rose-100'>
                <AlertTriangle className='text-rose-500' size={16} />
              </View>
              <View className='flex-1'>
                <Text className='font-semibold text-rose-700'>
                  Not Motivated?
                </Text>
                <Text className='text-xs text-stone-500'>
                  Visualize FAILURE → Fear drives action
                </Text>
              </View>
            </View>
          </View>

          {/* Body/Mind/Emotion breakdown */}
          <View className='mb-3 rounded-xl bg-stone-50 p-3'>
            <Text className='mb-2 text-xs font-semibold text-stone-700'>
              Visualize How You'll Feel:
            </Text>
            <View className='gap-1.5'>
              <Text className='text-xs text-stone-600'>
                <Text className='font-medium'>Body:</Text> Physical sensations
                (light vs heavy)
              </Text>
              <Text className='text-xs text-stone-600'>
                <Text className='font-medium'>Mind:</Text> Mental state (clear
                vs foggy)
              </Text>
              <Text className='text-xs text-stone-600'>
                <Text className='font-medium'>Emotion:</Text> Feelings (pride vs
                regret)
              </Text>
            </View>
          </View>

          {/* Source */}
          <Text className='text-center text-xs italic text-stone-400'>
            Source: Huberman Lab Podcast #55
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/**
 * Checks if visualization data has at least one field filled
 */
function hasVizData(viz: VisualizationData | undefined): boolean {
  if (!viz) return false;
  return !!(
    viz.successBody ||
    viz.successMind ||
    viz.successEmotion ||
    viz.failureBody ||
    viz.failureMind ||
    viz.failureEmotion
  );
}

/**
 * Checks if visualization data is complete (all 6 fields filled)
 */
function isVizComplete(viz: VisualizationData | undefined): boolean {
  if (!viz) return false;
  return !!(
    viz.successBody &&
    viz.successMind &&
    viz.successEmotion &&
    viz.failureBody &&
    viz.failureMind &&
    viz.failureEmotion
  );
}

/**
 * Checks if success visualization has at least one field
 */
function hasSuccessViz(viz: VisualizationData | undefined): boolean {
  if (!viz) return false;
  return !!(viz.successBody || viz.successMind || viz.successEmotion);
}

/**
 * Checks if failure visualization has at least one field
 */
function hasFailureViz(viz: VisualizationData | undefined): boolean {
  if (!viz) return false;
  return !!(viz.failureBody || viz.failureMind || viz.failureEmotion);
}

/**
 * DualVizSetup - Main component
 *
 * Displays the Huberman dual visualization setup with:
 * - Empty state: Pulsing eye icon with "Set up" CTA
 * - Filled state: Side-by-side success (emerald) and failure (rose) previews
 * - Help button for science explainer modal
 * - Completion checkmark when all fields are filled
 */
export function DualVizSetup({
  visualization,
  onPress,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 4,
}: DualVizSetupProps) {
  const [showExplainer, setShowExplainer] = useState(false);

  const hasViz = hasVizData(visualization);
  const isComplete = isVizComplete(visualization);

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
          accessibilityLabel={
            hasViz ? 'Edit your visualizations' : 'Add your visualizations'
          }
          className='border-l-4 border-l-violet-400'
          onPress={onPress}
        >
          {/* Header row: icon + title on left, action on right */}
          <View className='mb-2 flex-row items-center justify-between'>
            <View className='flex-row items-center gap-2'>
              <Text className="text-base">👁️</Text>
              <View>
                <Text className='text-xs font-semibold text-violet-600'>
                  Visualization Setup
                </Text>
                <Text className='text-[10px] text-stone-400'>
                  Huberman Protocol
                </Text>
              </View>
            </View>
            <View className='flex-row items-center gap-2'>
              <Pressable
                accessibilityLabel='Learn about dual visualization'
                className='h-6 w-6 items-center justify-center rounded-full'
                hitSlop={8}
                onPress={handleHelpPress}
              >
                <HelpCircle className='text-stone-400' size={16} />
              </Pressable>
              {hasViz ? (
                <Pencil className='text-stone-400' size={14} />
              ) : (
                <View className='flex-row items-center gap-1'>
                  <Plus className='text-violet-600' size={12} />
                  <Text className='text-xs font-medium text-violet-600'>Set up</Text>
                </View>
              )}
            </View>
          </View>

          {/* Content */}
          {hasViz ? (
            /* Side-by-side previews */
            <View className='flex-row gap-2'>
              <VizPreview
                body={visualization?.successBody}
                emotion={visualization?.successEmotion}
                mind={visualization?.successMind}
                type='success'
              />
              <VizPreview
                body={visualization?.failureBody}
                emotion={visualization?.failureEmotion}
                mind={visualization?.failureMind}
                type='failure'
              />
            </View>
          ) : (
            <Text className='text-sm text-stone-500'>
              Success + Failure feelings
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

      {/* Dual Visualization Explainer Modal */}
      <DualVizExplainerModal
        visible={showExplainer}
        onClose={() => setShowExplainer(false)}
      />
    </>
  );
}

export default DualVizSetup;
