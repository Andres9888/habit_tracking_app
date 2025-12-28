/**
 * ContextAwareViz Component
 * Context-aware visualization display based on motivation level
 *
 * Part of the Motivation System - Activation phase
 * Story T7.5: Create `ContextAwareViz` that shows success OR failure
 *
 * Scientific Basis:
 * - Andrew Huberman (Stanford) Dual Visualization Protocol
 * - Episode #55: "The Science of Setting & Achieving Goals"
 * - Key insight: Show FAILURE viz when unmotivated (fear drives action 2x)
 * - Loss aversion (Kahneman & Tversky, Nobel Prize): Losses hurt 2x more
 *
 * Logic:
 * - motivated (ready) → Show SUCCESS visualization
 * - unmotivated (not_motivated, meh) → Show FAILURE visualization
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  Sparkles,
  AlertTriangle,
  Brain,
  Heart,
  User,
} from 'lucide-react-native';
import { clsx } from 'clsx';

import { type MotivationLevel, shouldShowFailureViz } from './MotivationCheck';

/** Visualization data from habit */
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

export interface ContextAwareVizProps {
  /** The user's current motivation level */
  motivationLevel: MotivationLevel | undefined;
  /** Visualization data from the habit */
  visualization: VisualizationData | undefined;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Optional className for container styling */
  className?: string;
  /** Compact mode for inline use */
  compact?: boolean;
  /** Force show a specific visualization type (overrides motivation logic) */
  forceType?: 'success' | 'failure';
}

// Animation spring configs
const SPRING_BOUNCY = { damping: 8, stiffness: 300 };
const SPRING_GENTLE = { damping: 28, mass: 1.2, stiffness: 180 };

/**
 * VizField - Individual visualization field with icon
 */
function VizField({
  label,
  value,
  icon,
  colorClass,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}) {
  return (
    <View className='flex-row items-start gap-3 py-2'>
      <View
        className={clsx(
          'mt-0.5 h-8 w-8 items-center justify-center rounded-lg',
          {
            'bg-emerald-100': colorClass === 'success',
            'bg-rose-100': colorClass === 'failure',
          }
        )}
      >
        {icon}
      </View>
      <View className='flex-1'>
        <Text
          className={clsx('text-xs font-medium', {
            'text-emerald-600': colorClass === 'success',
            'text-rose-600': colorClass === 'failure',
          })}
        >
          {label}
        </Text>
        <Text
          className={clsx('text-sm leading-5', {
            'text-emerald-800': colorClass === 'success',
            'text-rose-800': colorClass === 'failure',
          })}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

/**
 * EmptyVizState - Shown when no visualization data is available
 */
function EmptyVizState({
  type,
  compact,
}: {
  type: 'success' | 'failure';
  compact: boolean;
}) {
  const isSuccess = type === 'success';

  if (compact) {
    return (
      <View className='items-center justify-center py-4'>
        <Text
          className={clsx(
            'text-center text-sm italic',
            isSuccess ? 'text-emerald-500' : 'text-rose-500'
          )}
        >
          {isSuccess
            ? 'Set up success visualization in the Motivation tab'
            : 'Set up failure visualization in the Motivation tab'}
        </Text>
      </View>
    );
  }

  return (
    <View className='items-center justify-center py-6'>
      <View
        className={clsx(
          'mb-3 h-12 w-12 items-center justify-center rounded-full',
          isSuccess ? 'bg-emerald-100' : 'bg-rose-100'
        )}
      >
        {isSuccess ? (
          <Sparkles className='text-emerald-500' size={24} />
        ) : (
          <AlertTriangle className='text-rose-500' size={24} />
        )}
      </View>
      <Text className='mb-1 text-center text-sm font-medium text-stone-600'>
        No visualization set up yet
      </Text>
      <Text className='text-center text-xs text-stone-500'>
        Add it in the Motivation tab to see it here
      </Text>
    </View>
  );
}

/**
 * VisualizationContent - The actual visualization display
 */
function VisualizationContent({
  type,
  body,
  mind,
  emotion,
  reduceMotion,
  compact,
}: {
  type: 'success' | 'failure';
  body?: string;
  mind?: string;
  emotion?: string;
  reduceMotion: boolean;
  compact: boolean;
}) {
  const isSuccess = type === 'success';
  const colorClass = isSuccess ? 'success' : 'failure';

  // Animation values
  const scale = useSharedValue(reduceMotion ? 1 : 0.9);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }

    // Entrance animation
    scale.value = withSpring(1, SPRING_GENTLE);
    opacity.value = withTiming(1, { duration: 300 });
  }, [reduceMotion, scale, opacity, type]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const hasAnyField = body || mind || emotion;

  if (!hasAnyField) {
    return <EmptyVizState compact={compact} type={type} />;
  }

  return (
    <Animated.View style={animatedStyle}>
      {/* Fields */}
      <View className={compact ? 'gap-1' : 'gap-2'}>
        {body && (
          <VizField
            colorClass={colorClass}
            icon={
              <User
                className={isSuccess ? 'text-emerald-500' : 'text-rose-500'}
                size={16}
              />
            }
            label='Body'
            value={body}
          />
        )}
        {mind && (
          <VizField
            colorClass={colorClass}
            icon={
              <Brain
                className={isSuccess ? 'text-emerald-500' : 'text-rose-500'}
                size={16}
              />
            }
            label='Mind'
            value={mind}
          />
        )}
        {emotion && (
          <VizField
            colorClass={colorClass}
            icon={
              <Heart
                className={isSuccess ? 'text-emerald-500' : 'text-rose-500'}
                size={16}
              />
            }
            label='Emotion'
            value={emotion}
          />
        )}
      </View>

      {/* Feel it prompt */}
      {!compact && (
        <View
          className={clsx(
            'mt-4 rounded-xl p-3',
            isSuccess ? 'bg-emerald-50' : 'bg-rose-50'
          )}
        >
          <Text
            className={clsx(
              'text-center text-xs font-medium italic',
              isSuccess ? 'text-emerald-700' : 'text-rose-700'
            )}
          >
            {isSuccess
              ? '✨ Feel this success in your body now'
              : '⚠️ Feel this weight of skipping now'}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

/**
 * ContextAwareViz - Main component
 *
 * Shows the appropriate visualization based on motivation level:
 * - Ready (motivated) → Success visualization (emerald)
 * - Not motivated / Meh → Failure visualization (rose)
 *
 * Uses Huberman's insight that fear/loss aversion moves unmotivated
 * people 2x more effectively than positive motivation.
 */
export function ContextAwareViz({
  motivationLevel,
  visualization,
  reduceMotion = false,
  className,
  compact = false,
  forceType,
}: ContextAwareVizProps) {
  // Determine which visualization to show
  const showFailure = forceType
    ? forceType === 'failure'
    : shouldShowFailureViz(motivationLevel);
  const vizType = showFailure ? 'failure' : 'success';
  const isSuccess = vizType === 'success';

  // Get the appropriate visualization data
  const body = isSuccess
    ? visualization?.successBody
    : visualization?.failureBody;
  const mind = isSuccess
    ? visualization?.successMind
    : visualization?.failureMind;
  const emotion = isSuccess
    ? visualization?.successEmotion
    : visualization?.failureEmotion;

  // Animation for type switch
  const iconScale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;

    // Pop animation when visualization type changes
    iconScale.value = withSequence(
      withSpring(1.2, SPRING_BOUNCY),
      withSpring(1, SPRING_BOUNCY)
    );
  }, [vizType, reduceMotion, iconScale]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  if (compact) {
    return (
      <View
        className={clsx(
          'rounded-2xl p-4',
          isSuccess ? 'bg-emerald-50' : 'bg-rose-50',
          className
        )}
      >
        <VisualizationContent
          compact
          body={body}
          emotion={emotion}
          mind={mind}
          reduceMotion={reduceMotion}
          type={vizType}
        />
      </View>
    );
  }

  return (
    <View
      className={clsx(
        'rounded-2xl border-l-4 p-4',
        isSuccess
          ? 'border-l-emerald-400 bg-emerald-50/50'
          : 'border-l-rose-400 bg-rose-50/50',
        className
      )}
    >
      {/* Header */}
      <View className='mb-4 flex-row items-center gap-3'>
        <Animated.View
          className={clsx(
            'h-10 w-10 items-center justify-center rounded-xl',
            isSuccess ? 'bg-emerald-100' : 'bg-rose-100'
          )}
          style={iconAnimatedStyle}
        >
          {isSuccess ? (
            <Sparkles className='text-emerald-600' size={20} />
          ) : (
            <AlertTriangle className='text-rose-600' size={20} />
          )}
        </Animated.View>
        <View className='flex-1'>
          <Text
            className={clsx(
              'text-base font-semibold',
              isSuccess ? 'text-emerald-800' : 'text-rose-800'
            )}
          >
            {isSuccess ? 'Visualize Success' : 'Visualize Consequences'}
          </Text>
          <Text className='text-xs text-stone-500'>
            {isSuccess
              ? 'Feel the energy of completing this'
              : 'Feel the weight of skipping this'}
          </Text>
        </View>
      </View>

      {/* Visualization content */}
      <VisualizationContent
        body={body}
        compact={false}
        emotion={emotion}
        mind={mind}
        reduceMotion={reduceMotion}
        type={vizType}
      />

      {/* Science tip for failure viz */}
      {!isSuccess && body && (
        <View className='mt-3 rounded-lg bg-rose-100/50 px-3 py-2'>
          <Text className='text-center text-xs text-rose-600'>
            💡 Loss aversion: This feeling moves you 2x more effectively
          </Text>
        </View>
      )}
    </View>
  );
}

export default ContextAwareViz;
