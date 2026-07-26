import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { typography } from '../../theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';
import { EmptyStateIcon } from './EmptyStateIcon';
import { SCALE_CONFIG, VARIANT_CONFIG } from './constants';
import { EmptyStateActions } from './EmptyStateActions';
import { styles } from './styles';
import type { EmptyStateProps } from './types';
import { useEmptyStateAnimations } from './useEmptyStateAnimations';
import { getEmptyStateLayout } from './getEmptyStateLayout';

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
  const layout = getEmptyStateLayout(isCompact, scaleConfig);

  return (
    <View
      accessible
      accessibilityLabel={`${displayHeadline}. ${displayDescription}`}
      accessibilityRole='text'
      style={[
        isCompact ? styles.containerCompact : styles.container,
        { paddingVertical: layout.paddingY },
        style,
      ]}
    >
      <EmptyStateIcon
        icon={displayIcon}
        iconBackplate={iconBackplate}
        iconSize={layout.iconSize}
        marginBottom={layout.iconMarginBottom}
        style={iconStyle}
      />
      <Animated.Text
        style={[
          typography[scaleConfig.titleStyle],
          styles.headline,
          { color: colors.text.primary, marginBottom: layout.titleMarginBottom },
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
            marginBottom: layout.descriptionMarginBottom,
          },
          descriptionStyle,
        ]}
      >
        {displayDescription}
      </Animated.Text>
      {actionSlot ? (
        <Animated.View style={descriptionStyle}>{actionSlot}</Animated.View>
      ) : null}
      <EmptyStateActions
        buttonSize={scaleConfig.buttonSize}
        ctaLabel={displayCTALabel}
        ctaStyle={ctaStyle}
        descriptionStyle={descriptionStyle}
        hideCTA={hideCTA}
        onCTA={onCTA}
        onQuickStart={onQuickStart}
        showQuickStart={variant === 'noHabits'}
      />
    </View>
  );
}

export default EmptyState;
