/**
 * YourProgressCard Component
 *
 * Section 1: Combines Habit Strength + actionable guidance.
 * Features:
 * - Progress ring (88px) with emoji + percentage
 * - Level badge with trend indicator (+X%)
 * - Progress bar to next level with emoji markers
 * - Actionable tip based on weak days pattern
 * - Teal/emerald gradient theme
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text, Pressable, AccessibilityInfo } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import { TrendingUp, TrendingDown, Minus, Info, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import type { YourProgressCardProps, LevelConfig } from './types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Level configurations
const STRENGTH_LEVELS: Record<string, LevelConfig> = {
  automatic: {
    color: '#059669', // emerald-600
    colorLight: '#d1fae5', // emerald-100
    description: 'This habit is second nature!',
    emoji: '⚡',
    label: 'Automatic',
    maxThreshold: 100,
    minThreshold: 80,
  },
  building: {
    color: '#16a34a', // green-600
    colorLight: '#dcfce7', // green-100
    description: 'Making good progress',
    emoji: '🌿',
    label: 'Building',
    maxThreshold: 40,
    minThreshold: 20,
  },
  developing: {
    color: '#0d9488', // teal-600
    colorLight: '#ccfbf1', // teal-100
    description: 'Getting stronger every day',
    emoji: '🌳',
    label: 'Developing',
    maxThreshold: 60,
    minThreshold: 40,
  },
  starting: {
    color: '#65a30d', // lime-600
    colorLight: '#ecfccb', // lime-100
    description: 'Just getting started',
    emoji: '🌱',
    label: 'Starting Out',
    maxThreshold: 20,
    minThreshold: 0,
  },
  strong: {
    color: '#0891b2', // cyan-600
    colorLight: '#cffafe', // cyan-100
    description: 'Well-established habit',
    emoji: '💪',
    label: 'Strong',
    maxThreshold: 80,
    minThreshold: 60,
  },
};

const getStrengthLevel = (strength: number): LevelConfig => {
  if (strength < 20) return STRENGTH_LEVELS.starting;
  if (strength < 40) return STRENGTH_LEVELS.building;
  if (strength < 60) return STRENGTH_LEVELS.developing;
  if (strength < 80) return STRENGTH_LEVELS.strong;
  return STRENGTH_LEVELS.automatic;
};

const getNextLevel = (strength: number): LevelConfig | null => {
  if (strength >= 80) return null;
  if (strength < 20) return STRENGTH_LEVELS.building;
  if (strength < 40) return STRENGTH_LEVELS.developing;
  if (strength < 60) return STRENGTH_LEVELS.strong;
  return STRENGTH_LEVELS.automatic;
};

// Animation constants
const RING_ANIMATION_DURATION = 1200;

/**
 * AnimatedPercentageText - Displays the strength percentage with counting animation
 */
function AnimatedPercentageText({
  animatedValue,
}: {
  animatedValue: SharedValue<number>;
}) {
  const [displayText, setDisplayText] = React.useState('0%');

  useDerivedValue(() => {
    const formatted = `${Math.round(animatedValue.value)}%`;
    runOnJS(setDisplayText)(formatted);
    return formatted;
  });

  return (
    <Text className="text-lg font-bold text-stone-900" accessibilityElementsHidden>
      {displayText}
    </Text>
  );
}

export function YourProgressCard({
  strength,
  weeklyChange = 0,
  actionableTip,
  onInfoPress,
}: YourProgressCardProps) {
  const clampedStrength = Math.max(0, Math.min(100, strength));
  const level = getStrengthLevel(clampedStrength);
  const nextLevel = getNextLevel(clampedStrength);

  // Ring dimensions (88px as per spec)
  const ringSize = 88;
  const strokeWidth = 8;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = ringSize / 2;

  // Track reduce motion preference
  const [reduceMotion, setReduceMotion] = React.useState(false);

  // Animations
  const animatedStrength = useSharedValue(0);
  const emojiScale = useSharedValue(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      animatedStrength.value = clampedStrength;
      emojiScale.value = 1;
      return;
    }

    // Ring fill animation - 1200ms with ease-out
    animatedStrength.value = withTiming(clampedStrength, {
      duration: RING_ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    // Emoji scale animation
    emojiScale.value = withDelay(
      300,
      withSpring(1, { damping: 8, stiffness: 150 })
    );
  }, [clampedStrength, reduceMotion]);

  const animatedCircleProps = useAnimatedProps(() => {
    const progress = animatedStrength.value / 100;
    return {
      strokeDashoffset: circumference * (1 - progress),
    };
  });

  const emojiAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  const handleInfoPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onInfoPress?.();
  };

  // Trend indicator component
  const TrendIndicator = () => {
    if (weeklyChange > 0) {
      return (
        <View className="flex-row items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5">
          <TrendingUp className="text-emerald-600" size={12} />
          <Text className="text-xs font-semibold text-emerald-600">
            +{weeklyChange}%
          </Text>
        </View>
      );
    }
    if (weeklyChange < 0) {
      return (
        <View className="flex-row items-center gap-1 rounded-full bg-red-100 px-2 py-0.5">
          <TrendingDown className="text-red-600" size={12} />
          <Text className="text-xs font-semibold text-red-600">
            {weeklyChange}%
          </Text>
        </View>
      );
    }
    return (
      <View className="flex-row items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5">
        <Minus className="text-stone-500" size={12} />
        <Text className="text-xs font-semibold text-stone-500">Stable</Text>
      </View>
    );
  };

  // Calculate progress within current level for the progress bar
  const levelProgress = useMemo(() => {
    if (!nextLevel) return 100; // At max level
    const levelRange = nextLevel.minThreshold - level.minThreshold;
    const currentProgress = clampedStrength - level.minThreshold;
    return Math.min(100, Math.max(0, (currentProgress / levelRange) * 100));
  }, [clampedStrength, level, nextLevel]);

  return (
    <View
      className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50"
      accessibilityRole="summary"
      accessibilityLabel={`Habit strength at ${Math.round(clampedStrength)}%, ${level.label} level${weeklyChange !== 0 ? `, ${weeklyChange > 0 ? 'up' : 'down'} ${Math.abs(weeklyChange)}% this week` : ''}`}
    >
      {/* Gradient Background */}
      <View className="absolute inset-0 bg-gradient-to-br from-teal-50/30 via-white to-emerald-50/30" />
      <View className="absolute inset-0 border border-teal-500/20 rounded-2xl" />

      <View className="p-4">
        {/* Header */}
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-stone-600">Your Progress</Text>
          <Pressable
            accessibilityLabel="Learn about habit strength"
            accessibilityRole="button"
            className="h-7 w-7 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200"
            onPress={handleInfoPress}
          >
            <Info className="text-stone-500" size={16} />
          </Pressable>
        </View>

        {/* Main content: Ring + Level info */}
        <View className="mb-4 flex-row items-center">
          {/* Progress Ring */}
          <View style={{ width: ringSize, height: ringSize }}>
            <Svg width={ringSize} height={ringSize}>
              {/* Background track */}
              <Circle
                cx={center}
                cy={center}
                fill="none"
                r={radius}
                stroke="#f3f4f6"
                strokeWidth={strokeWidth}
              />
              {/* Progress arc */}
              <AnimatedCircle
                animatedProps={animatedCircleProps}
                cx={center}
                cy={center}
                fill="none"
                origin={`${center}, ${center}`}
                r={radius}
                rotation="-90"
                stroke={level.color}
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                strokeLinecap="round"
                strokeWidth={strokeWidth}
              />
            </Svg>

            {/* Center content */}
            <View
              className="absolute items-center justify-center"
              style={{ width: ringSize, height: ringSize }}
            >
              <Animated.Text className="text-xl" style={emojiAnimatedStyle}>
                {level.emoji}
              </Animated.Text>
              <AnimatedPercentageText animatedValue={animatedStrength} />
            </View>
          </View>

          {/* Level info */}
          <View className="ml-4 flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <View
                className="rounded-full px-2.5 py-0.5"
                style={{ backgroundColor: level.colorLight }}
              >
                <Text className="text-xs font-semibold" style={{ color: level.color }}>
                  {level.label}
                </Text>
              </View>
              <TrendIndicator />
            </View>

            <Text className="text-xs text-stone-500 mb-2">
              {level.description}
            </Text>

            {nextLevel && (
              <Text className="text-[10px] text-stone-400">
                {Math.round(nextLevel.minThreshold - clampedStrength)}% to {nextLevel.emoji} {nextLevel.label}
              </Text>
            )}
          </View>
        </View>

        {/* Progress bar to next level */}
        <View className="mb-3">
          <View className="h-2 overflow-hidden rounded-full bg-stone-100">
            <Animated.View
              className="h-full rounded-full"
              style={{
                width: `${levelProgress}%`,
                backgroundColor: level.color,
              }}
            />
          </View>
          <View className="mt-1.5 flex-row justify-between">
            {['🌱', '🌿', '🌳', '💪', '⚡'].map((emoji, i) => (
              <Text key={i} className="text-[10px]">
                {emoji}
              </Text>
            ))}
          </View>
        </View>

        {/* Actionable tip */}
        <View
          className="flex-row items-center gap-2 rounded-xl p-3"
          style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}
          accessibilityLabel={`Tip: ${actionableTip}`}
        >
          <Text className="text-base">💡</Text>
          <Text className="flex-1 text-sm text-teal-700">{actionableTip}</Text>
          <ChevronRight className="text-teal-400" size={16} />
        </View>
      </View>
    </View>
  );
}

export default YourProgressCard;
