/**
 * Paper surfaces — the warm card fill the Habit Browser, Settings and Analytics
 * all sit on.
 *
 * Light mode uses `cardPaper`, a few steps above the canvas rather than a hard
 * white: the warmth is the brand. Dark mode keeps the already-elevated `card`
 * (a lighter fill would collapse onto the canvas background).
 *
 * Pair with `shadows.cardLifted` — at this little contrast, the shadow is what
 * makes a card read as an object instead of a tinted rectangle.
 */
import { darkColors, lightColors } from './darkColors';

export function getPaperSurface(isDark: boolean): string {
  return isDark ? darkColors.card : lightColors.cardPaper;
}
