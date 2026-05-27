import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';
import Button from '../Button/Button';
import { EmptyStateIcon } from './EmptyStateIcon';
import { TemplateChip } from './TemplateChip';
import {
  QUICK_START_TEMPLATES,
  SCALE_CONFIG,
  VARIANT_CONFIG,
} from './constants';
import { styles } from './styles';
import type { EmptyStateProps } from './types';
import { useEmptyStateAnimations } from './useEmptyStateAnimations';

export function EmptyState({
  variant = 'noHabits',
  scale = 'section',
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
  const { colors } = useThemeColors();
  const {
    ctaLabel: fallbackCTA,
    description: fallbackDescription,
    headline: fallbackHeadline,
    icon: fallbackIcon,
  } = VARIANT_CONFIG[variant];
  const scaleConfig = SCALE_CONFIG[scale];
  const { iconStyle, headlineStyle, descriptionStyle, ctaStyle } =
    useEmptyStateAnimations(variant);
  const displayIcon = icon || fallbackIcon;
  const displayHeadline = headline || fallbackHeadline;
  const displayDescription = description || fallbackDescription;
  const displayCTALabel = ctaLabel || fallbackCTA;
  const isCompact = size === 'compact';
  // Legacy compact remains the stronger layout override; scale still controls typography and CTA size.
  const iconSize = isCompact ? 34 : scaleConfig.iconSize; // No iconSizes token matches the legacy compact emoji size.
  const iconMarginBottom = isCompact
    ? spacing.md
    : scaleConfig.iconMarginBottom;
  const paddingY = isCompact ? spacing.lg : scaleConfig.paddingY;
  const titleMarginBottom = isCompact ? spacing.xs : spacing.sm;
  const descriptionMarginBottom = isCompact ? 0 : spacing.base;

  return (
    <View
      accessible
      accessibilityLabel={`${displayHeadline}. ${displayDescription}`}
      accessibilityRole='text'
      style={[
        isCompact ? styles.containerCompact : styles.container,
        { paddingVertical: paddingY },
        style,
      ]}
    >
      <EmptyStateIcon
        icon={displayIcon}
        iconBackplate={iconBackplate}
        iconSize={iconSize}
        marginBottom={iconMarginBottom}
        style={iconStyle}
      />
      <Animated.Text
        style={[
          typography[scaleConfig.titleStyle],
          styles.headline,
          { color: colors.text.primary, marginBottom: titleMarginBottom },
          headlineStyle,
        ]}
      >
        {displayHeadline}
      </Animated.Text>
      <Animated.Text
        style={[
          typography[scaleConfig.descriptionStyle],
          styles.description,
          {
            color: colors.text.secondary,
            marginBottom: descriptionMarginBottom,
          },
          descriptionStyle,
        ]}
      >
        {displayDescription}
      </Animated.Text>
      {actionSlot ? (
        <Animated.View style={descriptionStyle}>{actionSlot}</Animated.View>
      ) : null}
      {variant === 'noHabits' && onQuickStart ? (
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
      ) : null}
      {!hideCTA && onCTA ? (
        <Animated.View style={ctaStyle}>
          <Button
            accessibilityHint={`Tap to ${displayCTALabel.toLowerCase()}`}
            accessibilityLabel={displayCTALabel}
            size={scaleConfig.buttonSize}
            variant='primary'
            onPress={onCTA}
          >
            {displayCTALabel}
          </Button>
        </Animated.View>
      ) : null}
    </View>
  );
}

export default EmptyState;
