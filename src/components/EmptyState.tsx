/**
 * EmptyState Component
 * Based on UX Specification Section 4.2 & Section 8.2 (Empty State Transitions)
 *
 * Purpose: Guide users when no data exists
 * Variants: No Habits (first-time), No Data Yet (<7 days), No Results (search/filter), Premium Locked
 * Elements: Illustration/icon, headline, description, CTA button
 * Usage: Home screen (no habits), Analytics (no data), Search results
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { useAppTheme } from '../theme';
import Button from './Button/Button';

export type EmptyStateVariant =
  | 'noHabits'
  | 'noData'
  | 'noResults'
  | 'premiumLocked';

/**
 * Quick start template for one-tap habit creation
 */
export interface QuickStartTemplate {
  emoji: string;
  name: string;
  duration?: string;
}

export interface EmptyStateProps {
  /** Variant type */
  variant?: EmptyStateVariant;

  /** Custom icon/emoji */
  icon?: string;

  /** Custom headline */
  headline?: string;

  /** Custom description */
  description?: string;

  /** CTA button label */
  ctaLabel?: string;

  /** CTA button handler */
  onCTA?: () => void;

  /** Quick start template handler (noHabits variant) */
  onQuickStart?: (template: QuickStartTemplate) => void;

  /** Hide CTA button */
  hideCTA?: boolean;

  /** Custom style */
  style?: ViewStyle;
}

/**
 * Quick start templates for first-time users
 * Reduces decision fatigue by offering popular habits
 */
export const QUICK_START_TEMPLATES: QuickStartTemplate[] = [
  { emoji: '🧘', name: 'Meditate', duration: '10 min' },
  { emoji: '📖', name: 'Read', duration: '20 min' },
  { emoji: '💪', name: 'Exercise', duration: '30 min' },
  { emoji: '💧', name: 'Drink Water', duration: '8 glasses' },
];

/**
 * Default content for each variant
 */
const VARIANT_CONFIG: Record<
  EmptyStateVariant,
  {
    icon: string;
    headline: string;
    description: string;
    ctaLabel: string;
  }
> = {
  noData: {
    ctaLabel: 'Go to Habits',
    description:
      'You need at least 7 days of data to see meaningful analytics.',
    headline: 'Keep tracking',
    icon: '📊',
  },
  noHabits: {
    ctaLabel: 'Create Custom Habit',
    description: 'Or start with a popular template:',
    headline: 'Ready to build a new habit?',
    icon: '🚀',
  },
  noResults: {
    ctaLabel: 'Clear Filters',
    description:
      "Try adjusting your search or filters to find what you're looking for.",
    headline: 'No results found',
    icon: '🔍',
  },
  premiumLocked: {
    ctaLabel: 'Start Free Trial',
    description: 'Unlock advanced analytics and insights with Premium.',
    headline: 'Premium Feature',
    icon: '🔒',
  },
};

export function EmptyState({
  variant = 'noHabits',
  icon,
  headline,
  description,
  ctaLabel,
  onCTA,
  onQuickStart,
  hideCTA = false,
  style,
}: EmptyStateProps) {
  const theme = useAppTheme();
  const config = VARIANT_CONFIG[variant];

  // Use custom values or fall back to variant config
  const displayIcon = icon || config.icon;
  const displayHeadline = headline || config.headline;
  const displayDescription = description || config.description;
  const displayCTALabel = ctaLabel || config.ctaLabel;

  // Animation values
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.9);
  const headlineOpacity = useSharedValue(0);
  const descriptionOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(20);

  // Entrance animation with stagger (UX spec Section 8.2)
  useEffect(() => {
    // Icon: fade in and scale up
    iconOpacity.value = withSpring(1, { damping: 15, stiffness: 150 });
    iconScale.value = withSpring(1, { damping: 15, stiffness: 150 });

    // Headline: fade in with delay
    headlineOpacity.value = withDelay(
      200,
      withSpring(1, { damping: 15, stiffness: 150 })
    );

    // Description: fade in with delay
    descriptionOpacity.value = withDelay(
      300,
      withSpring(1, { damping: 15, stiffness: 150 })
    );

    // CTA: fade in and slide up with delay
    ctaOpacity.value = withDelay(
      400,
      withSpring(1, { damping: 15, stiffness: 150 })
    );
    ctaTranslateY.value = withDelay(
      400,
      withSpring(0, { damping: 15, stiffness: 150 })
    );
  }, [variant]);

  // Animated styles
  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const headlineStyle = useAnimatedStyle(() => ({
    opacity: headlineOpacity.value,
  }));

  const descriptionStyle = useAnimatedStyle(() => ({
    opacity: descriptionOpacity.value,
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }],
  }));

  return (
    <View
      accessible
      accessibilityLabel={`${displayHeadline}. ${displayDescription}`}
      accessibilityRole='text'
      style={[styles.container, style]}
    >
      {/* Icon/Illustration */}
      <Animated.Text style={[styles.icon, iconStyle]}>
        {displayIcon}
      </Animated.Text>

      {/* Headline */}
      <Animated.Text
        style={[
          theme.custom.typography.heading2,
          styles.headline,
          { color: theme.custom.colors.gray[900] },
          headlineStyle,
        ]}
      >
        {displayHeadline}
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        style={[
          theme.custom.typography.body,
          styles.description,
          { color: theme.custom.colors.gray[500] },
          descriptionStyle,
        ]}
      >
        {displayDescription}
      </Animated.Text>

      {/* Quick Start Templates (noHabits variant only) */}
      {variant === 'noHabits' && onQuickStart && (
        <Animated.View style={[styles.quickStartSection, descriptionStyle]}>
          <View style={styles.templateRow}>
            {QUICK_START_TEMPLATES.map((template) => (
              <Pressable
                key={template.name}
                accessibilityLabel={`Create ${template.name} habit`}
                accessibilityRole='button'
                style={({ pressed }) => [
                  styles.templateChip,
                  pressed && styles.templateChipPressed,
                ]}
                onPress={() => onQuickStart(template)}
              >
                <Text style={styles.templateEmoji}>{template.emoji}</Text>
                <Text style={styles.templateName}>{template.name}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      )}

      {/* CTA Button */}
      {!hideCTA && onCTA && (
        <Animated.View style={ctaStyle}>
          <Button
            accessibilityHint={`Tap to ${displayCTALabel.toLowerCase()}`}
            accessibilityLabel={displayCTALabel}
            size='medium'
            variant='primary'
            onPress={onCTA}
          >
            {displayCTALabel}
          </Button>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  description: {
    marginBottom: 16,
    maxWidth: 320,
    textAlign: 'center',
  },
  headline: {
    marginBottom: 8,
    textAlign: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  // Quick start templates
  quickStartSection: {
    marginTop: 8,
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  templateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  templateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    gap: 6,
  },
  templateChipPressed: {
    backgroundColor: '#e5e7eb',
    transform: [{ scale: 0.98 }],
  },
  templateEmoji: {
    fontSize: 16,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});

export default EmptyState;
