/**
 * CategoryChip Component
 * Enhanced category filter with colored backgrounds and gradient selected state
 *
 * Purpose: Expressive, color-coded category badges for filtering templates
 * Features: Category-specific colors, gradient on selection, animated transitions
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Helper to convert hex to rgba for valid color interpolation
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

// Category color mapping
export const CATEGORY_COLORS: Record<string, { primary: string; gradient: [string, string] }> = {
  all: {
    gradient: ['#6366F1', '#8B5CF6'],
    primary: '#6366F1',
  },
  andrew_huberman: {
    gradient: ['#059669', '#10B981'],
    primary: '#059669',
  },
  creativity: {
    gradient: ['#EC4899', '#F472B6'],
    primary: '#EC4899',
  },
  financial: {
    gradient: ['#059669', '#34D399'],
    primary: '#059669',
  },
  health_fitness: {
    gradient: ['#10B981', '#14B8A6'],
    primary: '#10B981',
  },
  learning: {
    gradient: ['#8B5CF6', '#A78BFA'],
    primary: '#8B5CF6',
  },
  mindfulness: {
    gradient: ['#8B5CF6', '#A855F7'],
    primary: '#8B5CF6',
  },
  morning_routine: {
    gradient: ['#F59E0B', '#FB923C'],
    primary: '#F59E0B',
  },
  productivity: {
    gradient: ['#3B82F6', '#06B6D4'],
    primary: '#3B82F6',
  },
  sleep: {
    gradient: ['#1E3A8A', '#3B82F6'],
    primary: '#1E3A8A',
  },
  social: {
    gradient: ['#F43F5E', '#FB7185'],
    primary: '#F43F5E',
  },
};

interface CategoryChipProps {
  /** Category identifier */
  id: string;
  /** Display label */
  label: string;
  /** Category icon/emoji */
  icon: string;
  /** Count of templates in this category */
  count: number;
  /** Whether this chip is selected */
  isSelected: boolean;
  /** Handler for chip press */
  onPress: () => void;
  /** Animation index for staggered entrance */
  animationIndex?: number;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  id,
  label,
  icon,
  count,
  isSelected,
  onPress,
  animationIndex = 0,
}) => {
  // Get category colors
  const colors = CATEGORY_COLORS[id] || CATEGORY_COLORS.all;

  // Animation values
  const chipOpacity = useSharedValue(0);
  const chipTranslateX = useSharedValue(-20);
  const pressScale = useSharedValue(1);
  const selectionProgress = useSharedValue(isSelected ? 1 : 0);

  // Entrance animation
  useEffect(() => {
    const delay = animationIndex * 50;
    chipOpacity.value = withDelay(
      delay,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
    );
    chipTranslateX.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 120 })
    );
  }, [animationIndex]);

  // Selection animation
  useEffect(() => {
    selectionProgress.value = withSpring(isSelected ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isSelected]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: chipOpacity.value,
    transform: [
      { translateX: chipTranslateX.value },
      { scale: pressScale.value },
    ],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ['#ffffff', 'rgba(255,255,255,0)']
    ),
    borderColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ['#e5e7eb', 'rgba(229,231,235,0)']
    ),
    borderWidth: 1.5 * (1 - selectionProgress.value),
  }));

  const gradientOpacity = useAnimatedStyle(() => ({
    opacity: selectionProgress.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ['#374151', '#ffffff']
    ),
  }));

  // Convert hex to rgba for valid color interpolation
  const primaryRgba = hexToRgba(colors.primary, 0.15);

  const countBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [primaryRgba, 'rgba(255,255,255,0.25)']
    ),
  }));

  const countTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [colors.primary, '#ffffff']
    ),
  }));

  // Handlers
  const handlePressIn = () => {
    pressScale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      accessible
      accessibilityLabel={`Filter by ${label}, ${count} habits`}
      accessibilityRole="button"
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
        {/* Icon with subtle background when not selected */}
        <Animated.View
          style={[
            styles.iconWrapper,
            !isSelected && { backgroundColor: hexToRgba(colors.primary, 0.07) },
          ]}
        >
          <Text style={styles.icon}>{icon}</Text>
        </Animated.View>

        {/* Label */}
        <Animated.Text style={[styles.label, textStyle]}>
          {label}
        </Animated.Text>

        {/* Count badge */}
        <Animated.View style={[styles.countBadge, countBgStyle]}>
          <Animated.Text style={[styles.countText, countTextStyle]}>
            {count}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  background: {
    borderRadius: 20,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    marginRight: 10,
    minHeight: 40,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  countBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
  },
  gradient: {
    borderRadius: 20,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  gradientWrapper: {
    borderRadius: 20,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  icon: {
    fontSize: 16,
  },
  iconWrapper: {
    alignItems: 'center',
    borderRadius: 10,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CategoryChip;
