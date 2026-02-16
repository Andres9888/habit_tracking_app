/**
 * Text Scaling Utilities
 * Prevents text from scaling beyond readable limits while respecting accessibility preferences
 */

/**
 * Maximum font size multiplier to prevent layout breaking
 * - Allows up to 200% scaling (accessibility friendly)
 * - Prevents infinite scaling that breaks layouts
 * - Use on layout-sensitive text (buttons, badges, fixed-width components)
 */
export const MAX_FONT_SIZE_MULTIPLIER = 2;

/**
 * More permissive multiplier for body text
 * Allows up to 250% scaling for better reading accessibility
 */
export const MAX_FONT_SIZE_MULTIPLIER_BODY = 2.5;

/**
 * Strict multiplier for UI chrome elements
 * Prevents scaling for layout-critical elements (tab bars, headers)
 */
export const MAX_FONT_SIZE_MULTIPLIER_STRICT = 1.5;

/**
 * Returns appropriate maxFontSizeMultiplier based on text type
 */
export function getMaxFontSizeMultiplier(
  type: 'body' | 'ui' | 'strict' = 'ui'
): number {
  switch (type) {
    case 'body': {
      return MAX_FONT_SIZE_MULTIPLIER_BODY;
    }
    case 'strict': {
      return MAX_FONT_SIZE_MULTIPLIER_STRICT;
    }
    default: {
      return MAX_FONT_SIZE_MULTIPLIER;
    }
  }
}
