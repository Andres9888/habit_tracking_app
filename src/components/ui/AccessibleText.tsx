/**
 * AccessibleText Component
 * Text component with built-in font scaling limits to prevent layout breaking
 */

import type React from 'react';
import { Text, type TextProps } from 'react-native';
import {
  MAX_FONT_SIZE_MULTIPLIER,
  MAX_FONT_SIZE_MULTIPLIER_BODY,
  MAX_FONT_SIZE_MULTIPLIER_STRICT,
} from '../../utils/accessibility/textScaling';

export interface AccessibleTextProps extends TextProps {
  /**
   * Text scaling behavior
   * - 'body': Allows 2.5x scaling for reading content
   * - 'ui': Default 2.0x for UI elements
   * - 'strict': 1.5x for layout-critical text (headers, tabs)
   */
  scalingType?: 'body' | 'ui' | 'strict';

  /**
   * Custom max font size multiplier (overrides scalingType)
   */
  maxFontSizeMultiplier?: number;
}

/**
 * Text component with accessibility-friendly font scaling limits
 *
 * @example
 * ```tsx
 * <AccessibleText scalingType="body">
 *   This text can scale up to 250% for better readability
 * </AccessibleText>
 *
 * <AccessibleText scalingType="strict">
 *   Tab Bar Label
 * </AccessibleText>
 * ```
 */
export function AccessibleText({
  children,
  scalingType = 'ui',
  maxFontSizeMultiplier,
  ...props
}: AccessibleTextProps) {
  const multiplier =
    maxFontSizeMultiplier ??
    (scalingType === 'body'
      ? MAX_FONT_SIZE_MULTIPLIER_BODY
      : scalingType === 'strict'
        ? MAX_FONT_SIZE_MULTIPLIER_STRICT
        : MAX_FONT_SIZE_MULTIPLIER);

  return (
    <Text maxFontSizeMultiplier={multiplier} {...props}>
      {children}
    </Text>
  );
}

export default AccessibleText;
