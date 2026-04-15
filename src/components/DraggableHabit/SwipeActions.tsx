import React from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { Archive } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '../../theme/spacing';
import { typography, fontFamilies } from '@/theme/typography';
import { DeleteAction } from './DeleteAction';
import { FormedAction } from './FormedAction';

interface SwipeActionsProps {
  dragX: Animated.AnimatedInterpolation<number>;
  onArchive: () => void;
  onDelete: () => void;
  onFormed?: () => void;
}

export function SwipeActions({ dragX, onArchive, onDelete, onFormed }: SwipeActionsProps) {
  const { isDark } = useThemeColors();
  const totalWidth = onFormed ? 240 : 160;
  const trans = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-totalWidth, 0],
    outputRange: [0, totalWidth],
  });

  const archiveIconScale = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-totalWidth, -100, -60, 0],
    outputRange: [1.1, 1, 0.85, 0.8],
  });

  const archiveIconOpacity = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-totalWidth, -80, 0],
    outputRange: [1, 0.85, 0.6],
  });

  return (
    <Animated.View
      className="flex-row items-center justify-end"
      style={{ transform: [{ translateX: trans }] }}
    >
      <DeleteAction dragX={dragX} onPress={onDelete} />
      {onFormed && <FormedAction dragX={dragX} onPress={onFormed} />}
      <Pressable
        accessibilityLabel="Archive habit"
        accessibilityRole="button"
        onPress={onArchive}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#D97706' : '#f59e0b',
          borderBottomRightRadius: borderRadius.xl,
          borderTopRightRadius: borderRadius.xl,
          height: '100%',
          justifyContent: 'center',
          width: 80,
        }}
      >
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: archiveIconOpacity,
            transform: [{ scale: archiveIconScale }],
          }}
        >
          <Archive color="white" size={22} strokeWidth={2} />
          <Text
            style={{
              color: 'white',
              fontFamily: fontFamilies.primary.text,
              fontSize: typography.tabBar.fontSize,
              fontWeight: '600',
              letterSpacing: 0.2,
              marginTop: 4,
            }}
          >
            Archive
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
