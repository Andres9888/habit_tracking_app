import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

interface StreakPillProps {
  streak: number;
  reduceMotion?: boolean;
}

const STREAK_COLORS = {
  background: '#fff7ed', // orange-50
  border: '#fed7aa', // orange-200
  text: '#ea580c', // orange-600
};

/** Compact pill showing the user's best current streak */
export const StreakPill: React.FC<StreakPillProps> = ({
  streak,
  reduceMotion = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      scaleAnim.setValue(1);
      return;
    }

    Animated.spring(scaleAnim, {
      friction: 6,
      tension: 180,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, reduceMotion]);

  if (streak <= 0) return null;

  return (
    <Animated.View
      style={{
        backgroundColor: STREAK_COLORS.background,
        borderColor: STREAK_COLORS.border,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Text style={{ fontSize: 14 }}>🔥</Text>
      <Text
        style={{
          color: STREAK_COLORS.text,
          fontSize: 13,
          fontWeight: '800',
          marginLeft: 3,
        }}
      >
        {streak}
      </Text>
    </Animated.View>
  );
};
