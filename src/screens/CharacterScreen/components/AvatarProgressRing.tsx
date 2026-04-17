/**
 * AvatarProgressRing — SVG ring encircling the avatar emoji, stroke offset
 * based on XP progress toward next level. Ring track = gray.200, fill = primary.600.
 */
import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AVATAR_SIZE, RING_STROKE, styles } from './CharacterCard.styles';

interface AvatarProgressRingProps {
  emoji: string;
  progress: number;
}

export function AvatarProgressRing({ emoji, progress }: AvatarProgressRingProps) {
  const { colors } = useThemeColors();
  const radius = (AVATAR_SIZE - RING_STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, progress));
  const offset = circumference * (1 - clamped);

  return (
    <View style={styles.avatarRing}>
      <Svg
        height={AVATAR_SIZE}
        style={{ transform: [{ rotate: '-90deg' }] }}
        viewBox={`0 0 ${AVATAR_SIZE} ${AVATAR_SIZE}`}
        width={AVATAR_SIZE}
      >
        <Circle
          cx={AVATAR_SIZE / 2}
          cy={AVATAR_SIZE / 2}
          fill='none'
          r={radius}
          stroke={colors.gray[200]}
          strokeWidth={RING_STROKE}
        />
        <Circle
          cx={AVATAR_SIZE / 2}
          cy={AVATAR_SIZE / 2}
          fill='none'
          r={radius}
          stroke={colors.primary[600]}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap='round'
          strokeWidth={RING_STROKE}
        />
      </Svg>
      <View style={styles.avatarInner}>
        <Text style={styles.avatarEmoji}>{emoji}</Text>
      </View>
    </View>
  );
}
