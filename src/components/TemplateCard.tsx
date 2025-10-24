/**
 * TemplateCard Component
 * Based on UX Specification Section 2.1 (Templates Tab)
 *
 * Purpose: Display habit template with description, science reference, and import button
 * Includes: Template name, description, icon, color preview, scientific citation, import CTA
 * Usage: Templates screen list
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '../theme';
import Button from './Button';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface TemplateCardProps {
  /** Template ID */
  id: string;

  /** Template name */
  name: string;

  /** Template description */
  description: string;

  /** Template icon/emoji */
  icon: string;

  /** Template icon background color */
  iconColor: string;

  /** Scientific reference citation */
  scientificReference: string;

  /** Category badge */
  category?: string;

  /** Popularity score (optional) */
  popularityScore?: number;

  /** On import handler */
  onImport: () => void;

  /** On preview handler (tap card) */
  onPreview?: () => void;

  /** Custom style */
  style?: ViewStyle;
}

export function TemplateCard({
  id,
  name,
  description,
  icon,
  iconColor,
  scientificReference,
  category,
  popularityScore,
  onImport,
  onPreview,
  style,
}: TemplateCardProps) {
  const theme = useAppTheme();
  const cardScale = useSharedValue(1);

  // Category display names
  const categoryLabels: Record<string, string> = {
    morning_routine: 'Morning Routine',
    health_fitness: 'Health & Fitness',
    productivity: 'Productivity',
    mindfulness: 'Mindfulness',
  };

  // Animation: Scale on press
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handlePressIn = () => {
    cardScale.value = withSpring(0.98, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handlePressOut = () => {
    cardScale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handleCardPress = () => {
    if (onPreview) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPreview();
    }
  };

  const handleImportPress = (e: any) => {
    // Prevent card press when import button is tapped
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onImport();
  };

  return (
    <AnimatedPressable
      onPress={handleCardPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        {
          backgroundColor: theme.custom.colors.light.card,
          borderRadius: theme.custom.borderRadius.medium,
          ...theme.custom.shadows.card,
        },
        animatedStyle,
        style,
      ]}
      accessible={true}
      accessibilityLabel={`${name} template. ${description}`}
      accessibilityRole="button"
      accessibilityHint="Tap to preview, or tap import to add to your habits"
    >
      {/* Card Content */}
      <View style={styles.content}>
        {/* Header: Icon + Category Badge */}
        <View style={styles.header}>
          {/* Icon with color background */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: iconColor + '20', // 20% opacity
                borderRadius: theme.custom.borderRadius.small,
              },
            ]}
          >
            <Text style={styles.icon}>{icon}</Text>
          </View>

          {/* Category Badge */}
          {category && (
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor: theme.custom.colors.gray[100],
                  borderRadius: theme.custom.borderRadius.small,
                },
              ]}
            >
              <Text
                style={[
                  theme.custom.typography.caption,
                  { color: theme.custom.colors.gray[600] },
                ]}
              >
                {categoryLabels[category] || category}
              </Text>
            </View>
          )}

          {/* Popularity indicator (if high score) */}
          {popularityScore && popularityScore >= 90 && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularEmoji}>🔥</Text>
            </View>
          )}
        </View>

        {/* Template Name */}
        <Text
          style={[
            theme.custom.typography.heading3,
            { color: theme.custom.colors.gray[900], marginTop: 12 },
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>

        {/* Description */}
        <Text
          style={[
            theme.custom.typography.bodySmall,
            { color: theme.custom.colors.gray[600], marginTop: 8 },
          ]}
          numberOfLines={3}
        >
          {description}
        </Text>

        {/* Scientific Reference */}
        <View
          style={[
            styles.scienceBox,
            {
              backgroundColor: theme.custom.colors.secondary[500] + '10',
              borderRadius: theme.custom.borderRadius.small,
              marginTop: 12,
            },
          ]}
        >
          <Text style={styles.scienceIcon}>🔬</Text>
          <Text
            style={[
              theme.custom.typography.caption,
              {
                color: theme.custom.colors.secondary[600],
                flex: 1,
              },
            ]}
            numberOfLines={2}
          >
            Research: {scientificReference}
          </Text>
        </View>

        {/* Import Button */}
        <View style={styles.footer}>
          <Button
            variant="primary"
            size="medium"
            onPress={handleImportPress}
            style={styles.importButton}
            accessibilityLabel={`Import ${name} template`}
          >
            Import Template
          </Button>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flex: 1,
  },
  popularBadge: {
    marginLeft: 'auto',
  },
  popularEmoji: {
    fontSize: 20,
  },
  scienceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 8,
  },
  scienceIcon: {
    fontSize: 16,
  },
  footer: {
    marginTop: 16,
  },
  importButton: {
    width: '100%',
  },
});

export default TemplateCard;
