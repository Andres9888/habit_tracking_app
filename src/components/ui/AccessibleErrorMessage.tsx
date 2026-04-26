/**
 * AccessibleErrorMessage Component
 * Error message that announces to screen readers using accessibilityLiveRegion
 */

import { View, type ViewStyle } from 'react-native';
import { AccessibleText } from './AccessibleText';
import { typography, fontFamilies } from '@/theme/typography';

export interface AccessibleErrorMessageProps {
  /**
   * Error message to display and announce
   */
  message: string | null | undefined;

  /**
   * Custom styles for the container
   */
  style?: ViewStyle;

  /**
   * Custom styles for the text
   */
  textStyle?: ViewStyle;

  /**
   * Announcement urgency
   * - 'polite': Waits for user to finish (default for validation errors)
   * - 'assertive': Interrupts immediately (critical errors)
   */
  urgency?: 'polite' | 'assertive';
}

/**
 * Error message component with screen reader announcements
 *
 * Features:
 * - Announces errors via accessibilityLiveRegion
 * - Marked as alert for screen readers
 * - Respects font scaling for readability
 *
 * @example
 * ```tsx
 * <AccessibleErrorMessage
 *   message={error}
 *   urgency="polite"
 * />
 * ```
 */
export function AccessibleErrorMessage({
  message,
  style,
  textStyle,
  urgency = 'polite',
}: AccessibleErrorMessageProps) {
  if (!message) return null;

  return (
    <View
      accessible
      accessibilityLiveRegion={urgency}
      accessibilityRole="alert"
      style={style}
    >
      <AccessibleText
        scalingType="body"
        style={[
          { fontFamily: fontFamilies.primary.text, fontSize: typography.caption.fontSize, color: '#B53030' },
          textStyle,
        ]}
      >
        {message}
      </AccessibleText>
    </View>
  );
}

export default AccessibleErrorMessage;
