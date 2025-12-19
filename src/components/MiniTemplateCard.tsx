/**
 * MiniTemplateCard Component
 * Compact template card for horizontal scrolling previews within category sections
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface MiniTemplateCardProps {
  /** Template icon/emoji */
  icon: string;
  /** Template icon background color */
  iconColor: string;
  /** Template name */
  name: string;
  /** Short description or frequency */
  subtitle?: string;
  /** Has scientific backing */
  hasResearch?: boolean;
  /** Tap handler */
  onPress: () => void;
}

export function MiniTemplateCard({
  icon,
  iconColor,
  name,
  subtitle,
  hasResearch,
  onPress,
}: MiniTemplateCardProps) {
  const pressScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
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
      accessibilityLabel={`${name} template`}
      accessibilityRole="button"
      style={[styles.card, { backgroundColor: `${iconColor}08` }, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Left accent */}
      <View style={[styles.accent, { backgroundColor: iconColor }]} />

      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        {subtitle && (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Research indicator */}
      {hasResearch && (
        <View style={styles.researchBadge}>
          <Text style={styles.researchIcon}>🔬</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    paddingLeft: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101727',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  researchBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  researchIcon: {
    fontSize: 12,
  },
});

export default MiniTemplateCard;
