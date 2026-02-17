/* eslint-disable max-lines */
/**
 * ChainBreak.tsx
 *
 * Visual representation of a gap/break in the habit chain.
 * Shown when one or more consecutive days were missed.
 *
 * Features:
 * - Jagged break visual (SVG split links)
 * - "Repair" chip button if the gap is in the recent 7 days
 * - Pulse animation on the repair chip to draw attention
 */

import React, { useRef, useEffect } from 'react';
import { Animated, Easing, TouchableOpacity, View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ChainBreakProps {
  /** Number of missed days in this gap */
  gapSize: number;
  /** Whether the gap is recent enough to repair (≤7 days ago) */
  isRepairable: boolean;
  onRepair?: () => void;
  reduceMotion?: boolean;
  accentColor: string;
}

const BREAK_ICON_SIZE = 24;

const ChainBreakComponent: React.FC<ChainBreakProps> = ({
  gapSize,
  isRepairable,
  onRepair,
  reduceMotion = false,
  accentColor,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isRepairable || reduceMotion) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRepairable, reduceMotion]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', minWidth: 32 }}>
      {/* Broken chain icon */}
      <Svg width={BREAK_ICON_SIZE} height={BREAK_ICON_SIZE} viewBox='0 0 24 24'>
        {/* Left broken link half */}
        <Path
          d='M8 12c0-2.2 1.8-4 4-4h1.5M8 12c0 2.2 1.8 4 4 4h1.5'
          stroke='#c4bfba'
          strokeWidth='1.8'
          strokeLinecap='round'
          fill='none'
        />
        {/* Right broken link half */}
        <Path
          d='M16 12c0-2.2-1.8-4-4-4h-1.5M16 12c0 2.2-1.8 4-4 4h-1.5'
          stroke='#c4bfba'
          strokeWidth='1.8'
          strokeLinecap='round'
          fill='none'
        />
        {/* Break gap lines */}
        <Path
          d='M11 9.5 L13 9.5'
          stroke='#e5e2de'
          strokeWidth='1.2'
          strokeLinecap='round'
        />
        <Path
          d='M11 14.5 L13 14.5'
          stroke='#e5e2de'
          strokeWidth='1.2'
          strokeLinecap='round'
        />
      </Svg>

      {/* Gap count */}
      {gapSize > 1 && (
        <Text
          style={{
            color: '#c4bfba',
            fontSize: 9,
            fontWeight: '600',
            marginTop: 1,
          }}
        >
          {gapSize}d
        </Text>
      )}

      {/* Repair CTA chip */}
      {isRepairable && onRepair && (
        <Animated.View style={{ transform: [{ scale: pulseAnim }], marginTop: 4 }}>
          <TouchableOpacity
            accessibilityLabel={`Repair ${gapSize}-day gap in chain`}
            accessibilityRole='button'
            activeOpacity={0.75}
            onPress={onRepair}
            style={{
              backgroundColor: `${accentColor}18`,
              borderColor: `${accentColor}55`,
              borderRadius: 8,
              borderWidth: 1,
              paddingHorizontal: 5,
              paddingVertical: 2,
            }}
          >
            <Text
              style={{
                color: accentColor,
                fontSize: 9,
                fontWeight: '700',
                letterSpacing: 0.3,
              }}
            >
              REPAIR
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export const ChainBreak = React.memo(ChainBreakComponent);
