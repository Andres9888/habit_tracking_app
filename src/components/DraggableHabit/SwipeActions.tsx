import React from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { Archive } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '@/theme';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { DeleteAction } from './DeleteAction';

interface SwipeActionsProps {
  dragX: Animated.AnimatedInterpolation<number>;
  onArchive: () => void;
  onDelete: () => void;
}

export function SwipeActions({
  dragX,
  onArchive,
  onDelete,
}: SwipeActionsProps) {
  const { isDark } = useThemeColors();
  const { triggerWarning } = useHapticFeedback();
  const handleArchive = () => {
    triggerWarning();
    onArchive();
  };
  const handleDelete = () => {
    triggerWarning();
    onDelete();
  };
  const trans = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-160, 0],
    outputRange: [0, 160],
  });

  const archiveIconScale = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-160, -100, -60, 0],
    outputRange: [1.1, 1, 0.85, 0.8],
  });

  const archiveIconOpacity = dragX.interpolate({
    extrapolate: 'clamp',
    inputRange: [-160, -80, 0],
    outputRange: [1, 0.85, 0.6],
  });

  return (
    <Animated.View
      className='flex-row items-center justify-end'
      style={{ transform: [{ translateX: trans }] }}
    >
      <DeleteAction dragX={dragX} onPress={handleDelete} />
      <Pressable
        accessibilityLabel='Archive habit'
        accessibilityRole='button'
        testID='archive-habit-action'
        onPress={handleArchive}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? colors.warning : colors.streak[300],
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
          <Archive color='white' size={iconSizes.large} strokeWidth={2} />
          <Text
            style={{
              color: 'white',
              fontFamily: fontFamilies.primary.text,
              fontSize: typography.tabBar.fontSize,
              fontWeight: fontWeights.semibold,
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
