/**
 * Lifted settings-card surface.
 *
 * Light mode floats cards on a lighter parchment (gray-50) above the warm
 * background for real, layered depth. Dark mode keeps the already-elevated
 * card surface (a lighter gray-50 would collapse onto the canvas background).
 */
import { darkColors, lightColors } from '@/theme/darkColors';

export function getRaisedSurface(isDark: boolean): string {
  return isDark ? darkColors.card : lightColors.gray[50];
}
