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
import { useAppTheme } from '../../theme';
import { useThemeColors } from '../../theme/ThemeContext';
import Button from '../Button/Button';
import type { EmptyStateProps } from './types';
import { VARIANT_CONFIG, QUICK_START_TEMPLATES } from './constants';
import { useEmptyStateAnimations } from './useEmptyStateAnimations';
import { styles } from './styles';
import { TemplateChip } from './TemplateChip';

export function EmptyState({
  variant = 'noHabits',
  size = 'default',
  icon,
  iconBackplate,
  headline,
  description,
  actionSlot,
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
  const isCompact = size === 'compact';
  const isStringIcon = typeof displayIcon === 'string';

  return (
    <View
      accessible
      accessibilityLabel={`${displayHeadline}. ${displayDescription}`}
      accessibilityRole='text'
      style={[isCompact ? styles.containerCompact : styles.container, style]}
    >
      {/* Icon/Illustration — string emoji or custom ReactNode, optionally wrapped in a backplate */}
      {iconBackplate ? (
        <Animated.View style={[{ marginBottom: isCompact ? 12 : 16 }, iconBackplate, iconStyle]}>
          {isStringIcon ? (
            <Animated.Text style={isCompact ? styles.iconCompact : styles.icon}>
              {displayIcon}
            </Animated.Text>
          ) : (
            displayIcon
          )}
        </Animated.View>
      ) : isStringIcon ? (
        <Animated.Text style={[isCompact ? styles.iconCompact : styles.icon, iconStyle]}>
          {displayIcon}
        </Animated.Text>
      ) : (
        <Animated.View style={[{ marginBottom: isCompact ? 12 : 16 }, iconStyle]}>
          {displayIcon}
        </Animated.View>
      )}

      {/* Headline */}
      <Animated.Text
        style={[
          theme.custom.typography.heading2,
          isCompact ? styles.headlineCompact : styles.headline,
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
          isCompact ? styles.descriptionCompact : styles.description,
          { color: colors.text.secondary },
          descriptionStyle,
        ]}
      >
        {displayDescription}
      </Animated.Text>

      {/* Optional inline action slot — tip cards, hint rows, inline action chips */}
      {actionSlot ? <Animated.View style={descriptionStyle}>{actionSlot}</Animated.View> : null}

      {/* Quick Start Templates (noHabits variant only) */}
      {variant === 'noHabits' && onQuickStart ? <Animated.View style={[styles.quickStartSection, descriptionStyle]}>
          <View style={styles.templateRow}>
            {QUICK_START_TEMPLATES.map((template) => (
              <TemplateChip
                key={template.name}
                template={template}
                onPress={onQuickStart}
              />
            ))}
          </View>
        </Animated.View> : null}

      {/* CTA Button */}
      {!hideCTA && onCTA ? <Animated.View style={ctaStyle}>
          <Button
            accessibilityHint={`Tap to ${displayCTALabel.toLowerCase()}`}
            accessibilityLabel={displayCTALabel}
            size='medium'
            variant='primary'
            onPress={onCTA}
          >
            {displayCTALabel}
          </Button>
        </Animated.View> : null}
    </View>
  );
}

export default EmptyState;
