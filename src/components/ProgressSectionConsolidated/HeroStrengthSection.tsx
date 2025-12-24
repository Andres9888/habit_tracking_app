/**
 * HeroStrengthSection Component
 *
 * Hero section displaying the main habit strength progress ring
 * with level information and trend indicator.
 *
 * @see docs/specs/habit-details-screen/progress-consolidated-redesign.md
 */

import React, { useEffect } from 'react';
import { View, Text, AccessibilityInfo } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

import type { HeroStrengthSectionProps } from './types';
import { getProgressToNextLevel } from './types';
import { TrendIndicator } from './TrendIndicator';
import { AnimatedPercentageText } from './AnimatedPercentageText';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RING_ANIMATION_DURATION = 1200;
const EMOJI_SCALE_DELAY = 300;

export function HeroStrengthSection({
  strength,
  weeklyChange = 0,
}: HeroStrengthSectionProps) {
  const clampedStrength = Math.max(0, Math.min(100, strength));
  const { currentLevel, nextLevel, progressPercent, pointsToNext } =
    getProgressToNextLevel(clampedStrength);

  const ringSize = 100;
  const strokeWidth = 10;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = ringSize / 2;

  const [reduceMotion, setReduceMotion] = React.useState(false);
  const animatedStrength = useSharedValue(0);
  const emojiScale = useSharedValue(0);
  const progressBarWidth = useSharedValue(0);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      animatedStrength.value = clampedStrength;
      emojiScale.value = 1;
      progressBarWidth.value = progressPercent;
      return;
    }
    animatedStrength.value = withTiming(clampedStrength, {
      duration: RING_ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    emojiScale.value = withDelay(
      EMOJI_SCALE_DELAY,
      withSpring(1, { damping: 8, stiffness: 150 })
    );
    progressBarWidth.value = withDelay(
      200,
      withTiming(progressPercent, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clampedStrength, reduceMotion, progressPercent]);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedStrength.value / 100),
  }));
  const emojiAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));
  const progressBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressBarWidth.value}%`,
  }));

  const accessLabel = `Habit strength at ${Math.round(clampedStrength)} percent, ${currentLevel.label} level${weeklyChange === 0 ? '' : `, ${weeklyChange > 0 ? 'up' : 'down'} ${Math.abs(weeklyChange)} percent this week`}`;

  return (
    <View
      accessibilityLabel={accessLabel}
      accessibilityRole='summary'
      className='mb-5 flex-row items-center gap-4'
    >
      <View
        style={{
          elevation: 4,
          height: ringSize,
          shadowColor: currentLevel.color,
          shadowOffset: { height: 0, width: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          width: ringSize,
        }}
      >
        <Svg height={ringSize} width={ringSize}>
          <Circle
            cx={center}
            cy={center}
            fill='none'
            r={radius}
            stroke='#f3f4f6'
            strokeWidth={strokeWidth}
          />
          <AnimatedCircle
            animatedProps={animatedCircleProps}
            cx={center}
            cy={center}
            fill='none'
            origin={`${center}, ${center}`}
            r={radius}
            rotation='-90'
            stroke={currentLevel.color}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap='round'
            strokeWidth={strokeWidth}
          />
        </Svg>
        <View
          className='absolute items-center justify-center'
          style={{ height: ringSize, width: ringSize }}
        >
          <Animated.Text className='text-2xl' style={emojiAnimatedStyle}>
            {currentLevel.emoji}
          </Animated.Text>
          <AnimatedPercentageText animatedValue={animatedStrength} />
        </View>
      </View>
      <View className='flex-1'>
        <View className='mb-1.5 flex-row items-center gap-2'>
          <View
            className='rounded-full px-3 py-1'
            style={{ backgroundColor: currentLevel.bgColor }}
          >
            <Text
              className='text-sm font-semibold'
              style={{ color: currentLevel.color }}
            >
              {currentLevel.label}
            </Text>
          </View>
          <TrendIndicator weeklyChange={weeklyChange} />
        </View>
        <Text className='mb-1 text-sm text-stone-600'>
          {currentLevel.description}
        </Text>
        <View className='flex-row items-center gap-1.5'>
          <View className='h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100'>
            <Animated.View
              className='h-full rounded-full'
              style={[
                { backgroundColor: currentLevel.color },
                progressBarAnimatedStyle,
              ]}
            />
          </View>
          {nextLevel ? (
            <Text className='whitespace-nowrap text-[10px] text-stone-400'>
              {pointsToNext}% to {nextLevel.emoji}
            </Text>
          ) : (
            <Text className='whitespace-nowrap text-[10px] text-stone-400'>
              Max level! {currentLevel.emoji}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default HeroStrengthSection;
