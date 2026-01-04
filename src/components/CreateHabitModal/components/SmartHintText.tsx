import { memo } from 'react';
import { Text, View } from 'react-native';

/**
 * Variant types for SmartHintText styling
 */
export type HintVariant = 'success' | 'info' | 'warning';

/**
 * Props for the SmartHintText component
 */
interface SmartHintTextProps {
  /**
   * Icon component to display (e.g., Lightbulb, Info, AlertCircle)
   */
  icon: React.ReactNode;
  /**
   * The hint text to display
   */
  text: string;
  /**
   * Visual variant that determines the color scheme
   * - success: Emerald green (default)
   * - info: Blue
   * - warning: Amber
   */
  variant?: HintVariant;
}

/**
 * Color configuration for each variant
 * Per spec:
 * - Success: emerald-500/600 (#10B981)
 * - Info: blue-500/600 (#3B82F6)
 * - Warning: amber-500/600 (#F59E0B)
 */
const VARIANT_COLORS = {
  success: {
    icon: '#10B981',
    text: '#10B981',
  },
  info: {
    icon: '#3B82F6',
    text: '#3B82F6',
  },
  warning: {
    icon: '#F59E0B',
    text: '#F59E0B',
  },
} as const;

/**
 * SmartHintText Component
 *
 * Displays contextual hints and smart suggestions with an icon and text.
 * Used throughout the form to provide helpful guidance and AI-powered suggestions.
 *
 * Design specs:
 * - Icon + text in a flex row layout
 * - Icon is 12px
 * - Text is 12px, medium weight (500)
 * - Supports three variants for different message types
 *
 * @example
 * ```tsx
 * // Success hint (default - emerald)
 * <SmartHintText
 *   icon={<Lightbulb size={12} />}
 *   text='Smart pick based on "reading"'
 * />
 *
 * // Info hint (blue)
 * <SmartHintText
 *   icon={<Info size={12} />}
 *   text="Try being more specific"
 *   variant="info"
 * />
 *
 * // Warning hint (amber)
 * <SmartHintText
 *   icon={<AlertCircle size={12} />}
 *   text="This habit already exists"
 *   variant="warning"
 * />
 * ```
 */
const SmartHintText = memo(({ icon, text, variant = 'success' }: SmartHintTextProps) => {
  const colors = VARIANT_COLORS[variant];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4, // gap-1
      }}
      accessibilityRole="text"
      accessibilityLabel={text}
    >
      <View
        style={{
          width: 12,
          height: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {icon}
      </View>
      <Text
        style={{
          color: colors.text,
          fontSize: 12,
          fontWeight: '500', // medium
        }}
      >
        {text}
      </Text>
    </View>
  );
});

SmartHintText.displayName = 'SmartHintText';

export { SmartHintText };
