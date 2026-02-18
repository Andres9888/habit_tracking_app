/**
 * CategoryChip Component
 * Enhanced category filter with colored backgrounds and gradient selected state
 *
 * Purpose: Expressive, color-coded category badges for filtering templates
 * Features: Category-specific colors, gradient on selection, animated transitions
 */

import React, { memo, useCallback } from 'react';
import { Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

import type { CategoryChipProps } from './CategoryChip.types';
import { hexToRgba } from './CategoryChip.constants';
import { styles } from './CategoryChip.styles';
import { useCategoryChipAnimations } from './useCategoryChipAnimations';
import { useCategoryChipHandlers } from './useCategoryChipHandlers';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function CategoryChipComponent({
  id,
  label,
  icon,
  count,
  isSelected,
  onPress,
  animationIndex = 0,
}: CategoryChipProps) {
  // Wrap onPress in useCallback to prevent unnecessary re-renders when parent re-renders
  const handlePress = useCallback(() => {
    onPress?.(id);
  }, [id, onPress]);
  const {
    backgroundStyle,
    colors,
    containerStyle,
    countBgStyle,
    countTextStyle,
    gradientOpacity,
    pressScale,
    textStyle,
  } = useCategoryChipAnimations({ animationIndex, id, isSelected });

  const { handlePressIn, handlePressOut } =
    useCategoryChipHandlers(pressScale, handlePress);

  return (
    <AnimatedPressable
      accessible
      accessibilityLabel={`Filter by ${label}, ${count} habits`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      style={[styles.container, containerStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Gradient background (visible when selected) */}
      <Animated.View style={[styles.gradientWrapper, gradientOpacity]}>
        <LinearGradient
          colors={colors.gradient}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>

      {/* White/transparent background (visible when not selected) */}
      <Animated.View style={[styles.background, backgroundStyle]} />

      {/* Content */}
      <Animated.View style={styles.content}>
        <Animated.View
          style={[
            styles.iconWrapper,
            !isSelected && { backgroundColor: hexToRgba(colors.primary, 0.07) },
          ]}
        >
          <Text style={styles.icon}>{icon}</Text>
        </Animated.View>

        <Animated.Text style={[styles.label, textStyle]}>{label}</Animated.Text>

        <Animated.View style={[styles.countBadge, countBgStyle]}>
          <Animated.Text style={[styles.countText, countTextStyle]}>
            {count}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </AnimatedPressable>
  );
}

export const CategoryChip = memo(CategoryChipComponent);

export default CategoryChip;
