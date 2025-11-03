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
import PremiumBadge from './PremiumBadge';
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

  /** Is this a premium template? */
  isPremium?: boolean;

  /** Does user have access to premium? */
  hasAccess?: boolean;

  /** Is this a new template? */
  isNew?: boolean;

  /** On import handler */
  onImport: () => void;

  /** On preview handler (tap card) */
  onPreview?: () => void;

  /** On upgrade handler (for premium templates) */
  onUpgrade?: () => void;

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
  isPremium = false,
  hasAccess = true,
  isNew = false,
  onImport,
  onPreview,
  onUpgrade,
  style,
}: TemplateCardProps) {
  const theme = useAppTheme();
  const cardScale = useSharedValue(1);

  // Category display names
  const categoryLabels: Record<string, string> = {
    andrew_huberman: 'Andrew Huberman',
    health_fitness: 'Health & Fitness',
    mindfulness: 'Mindfulness',
    morning_routine: 'Morning Routine',
    productivity: 'Productivity',
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
      accessible
      accessibilityHint='Tap to preview, or tap import to add to your habits'
      accessibilityLabel={`${name} template. ${description}`}
      accessibilityRole='button'
      style={[
        styles.card,
        {
          backgroundColor: '#ffffff',
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        },
        animatedStyle,
        style,
      ]}
      onPress={handleCardPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
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
                borderRadius: 12,
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
                  backgroundColor: '#f3f4f6',
                  borderRadius: 8,
                },
              ]}
            >
              <Text
                style={[
                  theme.custom.typography.caption,
                  { color: '#6b7280', fontWeight: '500' },
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
          numberOfLines={1}
          style={[
            theme.custom.typography.heading3,
            { color: '#101727', marginTop: 12, fontWeight: '600' },
          ]}
        >
          {name}
        </Text>

        {/* Description */}
        <Text
          numberOfLines={3}
          style={[
            theme.custom.typography.bodySmall,
            { color: '#6b7280', marginTop: 8, lineHeight: 20 },
          ]}
        >
          {description}
        </Text>

        {/* Scientific Reference */}
        <View
          style={[
            styles.scienceBox,
            {
              backgroundColor: '#f0fdf4',
              borderRadius: 8,
              marginTop: 12,
              borderWidth: 1,
              borderColor: '#bbf7d0',
            },
          ]}
        >
          <Text style={styles.scienceIcon}>🔬</Text>
          <Text
            numberOfLines={2}
            style={[
              theme.custom.typography.caption,
              {
                color: '#166534',
                flex: 1,
                lineHeight: 16,
              },
            ]}
          >
            Research: {scientificReference}
          </Text>
        </View>

        {/* Import Button */}
        <View style={styles.footer}>
          <Button
            accessibilityLabel={`Import ${name} template`}
            size='medium'
            style={styles.importButton}
            variant='primary'
            onPress={handleImportPress}
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
    marginHorizontal: 20,
    marginVertical: 8,
    overflow: 'hidden',
  },
  categoryBadge: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  content: {
    padding: 20,
  },
  footer: {
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    fontSize: 28,
  },
  iconContainer: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  importButton: {
    width: '100%',
  },
  popularBadge: {
    marginLeft: 'auto',
  },
  popularEmoji: {
    fontSize: 20,
  },
  scienceBox: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  scienceIcon: {
    fontSize: 16,
  },
});

export default TemplateCard;
