/**
 * EmptyState Component
 * Based on UX Specification Section 4.2 & Section 8.2 (Empty State Transitions)
 *
 * Purpose: Guide users when no data exists
 * Variants: No Habits (first-time), No Data Yet (<7 days), No Results (search/filter), Premium Locked
 * Elements: Illustration/icon, headline, description, CTA button
 * Usage: Home screen (no habits), Analytics (no data), Search results
 */

import React from 'react';
import { View } from 'react-native';

import Animated from 'react-native-reanimated';

import type { EmptyStateProps } from './types';
import Button from '../Button/Button';
import { TemplateChip } from './TemplateChip';
import { VARIANT_CONFIG, QUICK_START_TEMPLATES } from './constants';
import { styles } from './styles';
import { useAppTheme } from '../../theme';
import { useEmptyStateAnimations } from './useEmptyStateAnimations';
import { useThemeColors } from '../../theme/ThemeContext';

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
  const { colors } = useThemeColors();
  const config = VARIANT_CONFIG[variant];
  const { iconStyle, headlineStyle, descriptionStyle, ctaStyle } =
    useEmptyStateAnimations(variant);

  // Use custom values or fall back to variant config
  const displayIcon = icon || config.icon;
  const displayHeadline = headline || config.headline;
  const displayDescription = description || config.description;
  const displayCTALabel = ctaLabel || config.ctaLabel;

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
          { color: colors.text.primary },
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
          { color: colors.text.secondary },
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
              <TemplateChip
                key={template.name}
                template={template}
                onPress={onQuickStart}
              />
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

export default EmptyState;
