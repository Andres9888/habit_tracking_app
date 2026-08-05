import { iconSizes } from '../../theme/iconSizes';
import { spacing } from '../../theme/spacing';
import type { TypographyVariant } from '../../theme/typography';
import type { ButtonSize } from '../Button/types';
import type {
  EmptyStateScale,
  EmptyStateVariant,
  QuickStartTemplate,
  VariantConfig,
} from './types';

type ScaleConfig = {
  buttonSize: ButtonSize;
  descriptionStyle: TypographyVariant;
  iconMarginBottom: number;
  iconSize: number;
  paddingY: number;
  titleStyle: TypographyVariant;
};

export const VARIANT_CONFIG: Record<EmptyStateVariant, VariantConfig> = {
  noData: {
    ctaLabel: 'Go to Habits',
    description: 'Keep tracking for 7 days to unlock meaningful analytics.',
    headline: 'Almost there!',
    icon: '📊',
  },
  noHabits: {
    ctaLabel: 'Create Your First Habit',
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
    icon: '✨',
  },
};

export const SCALE_CONFIG: Record<EmptyStateScale, ScaleConfig> = {
  hero: {
    buttonSize: 'large',
    descriptionStyle: 'body',
    iconMarginBottom: spacing.base,
    iconSize: 64, // No iconSizes token above xxl (48); hero keeps the large empty-state illustration.
    paddingY: spacing['3xl'],
    titleStyle: 'displayLarge',
  },
  inline: {
    buttonSize: 'small',
    descriptionStyle: 'bodySmall',
    iconMarginBottom: spacing.md,
    iconSize: iconSizes.large,
    paddingY: spacing.md,
    titleStyle: 'bodyBold',
  },
  section: {
    buttonSize: 'medium',
    descriptionStyle: 'body',
    iconMarginBottom: spacing.base,
    iconSize: 64, // No iconSizes token above xxl (48); section preserves today's default EmptyState visual.
    paddingY: spacing['2xl'],
    titleStyle: 'heading2',
  },
};

export const QUICK_START_TEMPLATES: QuickStartTemplate[] = [
  { duration: '10 min', emoji: '🧘', name: 'Meditate' },
  { duration: '20 min', emoji: '📖', name: 'Read' },
  { duration: '30 min', emoji: '💪', name: 'Exercise' },
  { duration: '8 glasses', emoji: '💧', name: 'Drink Water' },
];
