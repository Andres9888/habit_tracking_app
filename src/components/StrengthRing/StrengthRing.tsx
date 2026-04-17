/**
 * StrengthRing - Apple Watch-style ring visualization for habit strength
 */
import React from 'react';
import { View } from 'react-native';

import Animated from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { LevelLabel } from './LevelLabel';
import { RingCenter } from './RingCenter';
import {
  BACKGROUND_COLOR,
  getLevelInfo,
  SIZE_CONFIG,
} from './StrengthRing.constants';
import { styles } from './StrengthRing.styles';
import type { StrengthRingProps } from './StrengthRing.types';
import { useStrengthRingAnimation } from './useStrengthRingAnimation';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function StrengthRing({
  strength,
  size = 'small',
  showPercentage = false,
  showEmoji = false,
  showLevel = false,
  trend,
  weeklyChange,
  emojiOverrides,
}: StrengthRingProps) {
  const clampedStrength = Math.max(0, Math.min(100, strength));
  const config = SIZE_CONFIG[size];
  const { ringSize, strokeWidth, fontSize } = config;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = ringSize / 2;

  const levelInfo = getLevelInfo(clampedStrength, emojiOverrides);
  const { animatedProps, emojiAnimatedStyle } = useStrengthRingAnimation({
    circumference,
    levelLabel: levelInfo.label,
    strength: clampedStrength,
  });

  return (
    <View accessible accessibilityRole='progressbar' style={styles.container}>
      <View
        accessible
        accessibilityLabel={`${Math.round(clampedStrength)}% strength, ${levelInfo.label} level ${levelInfo.emoji}`}
        accessibilityRole='text'
      >
        <View style={{ height: ringSize, width: ringSize }}>
          <Svg height={ringSize} width={ringSize}>
            <Circle
              cx={center}
              cy={center}
              fill='none'
              r={radius}
              stroke={BACKGROUND_COLOR}
              strokeWidth={strokeWidth}
            />
            <AnimatedCircle
              animatedProps={animatedProps}
              cx={center}
              cy={center}
              fill='none'
              origin={`${center}, ${center}`}
              r={radius}
              rotation='-90'
              stroke={levelInfo.color}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap='round'
              strokeWidth={strokeWidth}
            />
          </Svg>
          <RingCenter
            emojiAnimatedStyle={emojiAnimatedStyle}
            fontSize={fontSize}
            levelInfo={levelInfo}
            ringSize={ringSize}
            showEmoji={showEmoji}
            showPercentage={showPercentage}
            strength={clampedStrength}
            trend={trend}
          />
        </View>
        {showLevel ? (
          <LevelLabel
            fontSize={fontSize}
            levelInfo={levelInfo}
            weeklyChange={weeklyChange}
          />
        ) : null}
      </View>
    </View>
  );
}
