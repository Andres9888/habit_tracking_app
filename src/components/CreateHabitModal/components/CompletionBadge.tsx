import { memo } from 'react';
import { Text, View } from 'react-native';

/**
 * Badge types for completion state display
 */
export type BadgeType = 'required' | 'optional' | 'complete';

/**
 * Props for the CompletionBadge component
 */
interface CompletionBadgeProps {
  /**
   * The type of badge to display:
   * - required: Red badge indicating required field
   * - optional: Blue badge indicating optional field
   * - complete: Green badge indicating completed section
   */
  type: BadgeType;
  /**
   * Optional accessible label for screen readers
   * If not provided, defaults to the uppercase type
   */
  accessibilityLabel?: string;
}

/**
 * Styling configuration for each badge type
 * Per spec:
 * - Required: bg-red-50 (#FEE2E2), text-red-900 (#991B1B)
 * - Optional: bg-indigo-50 (#E0E7FF), text-indigo-900 (#3730A3)
 * - Complete: bg-emerald-50 (#D1FAE5), text-emerald-900 (#065F46)
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
 * CompletionBadge Component
 *
 * Displays a small pill-shaped badge indicating the completion status of a form section.
 * Used in card headers to show whether a section is required, optional, or complete.
 *
 * Design specs:
 * - Rounded pill shape with proper padding (px-2 py-0.5)
 * - Text is uppercase, 10px, semibold with letter-spacing
 * - Accessible label for screen readers
 *
 * @example
 * ```tsx
 * // Required field badge
 * <CompletionBadge type="required" />
 *
 * // Optional field badge
 * <CompletionBadge type="optional" />
 *
 * // Completed field badge
 * <CompletionBadge type="complete" />
 *
 * // With custom accessibility label
 * <CompletionBadge
 *   type="required"
 *   accessibilityLabel="Habit name is required"
 * />
 * ```
 */
const CompletionBadge = memo(({ type, accessibilityLabel }: CompletionBadgeProps) => {
  const style = BADGE_STYLES[type];

  return (
    <View
      style={{
        backgroundColor: style.bg,
        paddingHorizontal: 8, // px-2
        paddingVertical: 2,   // py-0.5
        borderRadius: 9999,   // rounded-full
      }}
      accessibilityLabel={accessibilityLabel || style.label}
      accessibilityRole="text"
    >
      <Text
        style={{
          color: style.text,
          fontSize: 10,
          fontWeight: '600',      // semibold
          textTransform: 'uppercase',
          letterSpacing: 0.5,     // tracking-wider
        }}
      >
        {style.label}
      </Text>
    </View>
  );
});

CompletionBadge.displayName = 'CompletionBadge';

export { CompletionBadge };
