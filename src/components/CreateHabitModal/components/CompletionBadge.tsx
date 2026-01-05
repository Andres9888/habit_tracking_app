import { memo } from 'react';
import { Text, View } from 'react-native';

/**
 * Badge type variants
 */
export type BadgeType = 'required' | 'optional' | 'complete';

/**
 * Props for CompletionBadge component
 */
interface CompletionBadgeProps {
  /** Type of badge to display */
  type: BadgeType;
  /** Optional custom accessibility label */
  accessibilityLabel?: string;
}

/**
 * Badge styling configuration
 */
const BADGE_STYLES = {
  required: {
    bg: '#FEE2E2',
    text: '#991B1B',
    label: 'REQUIRED',
  },
  optional: {
    bg: '#E0E7FF',
    text: '#3730A3',
    label: 'OPTIONAL',
  },
  complete: {
    bg: '#D1FAE5',
    text: '#065F46',
    label: 'COMPLETE',
  },
} as const;

/**
 * Displays a small pill-shaped badge indicating section status
 *
 * @component
 * @example
 * ```tsx
 * <CompletionBadge type="required" />
 * <CompletionBadge type="optional" />
 * <CompletionBadge type="complete" />
 * ```
 */
const CompletionBadgeComponent = ({
  type,
  accessibilityLabel,
}: CompletionBadgeProps) => {
  const style = BADGE_STYLES[type];

  return (
    <View
      accessibilityLabel={accessibilityLabel || `Section is ${style.label.toLowerCase()}`}
      accessibilityRole="text"
      className="rounded-full px-2 py-0.5"
      style={{ backgroundColor: style.bg }}
    >
      <Text
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: style.text }}
      >
        {style.label}
      </Text>
    </View>
  );
};

/**
 * Memoized CompletionBadge component for performance optimization
 */
export const CompletionBadge = memo(CompletionBadgeComponent);
