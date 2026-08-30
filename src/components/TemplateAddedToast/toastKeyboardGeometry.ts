export const TOAST_BOTTOM_GAP = 16;

export function computeKeyboardOverlap(
  screenHeight: number,
  keyboardScreenY: number
): number {
  return Math.max(0, screenHeight - keyboardScreenY);
}

export function computeToastKeyboardClearance(
  insetBottom: number,
  keyboardHeight: number,
  shouldLiftForKeyboard: boolean
): number {
  return shouldLiftForKeyboard
    ? Math.max(0, keyboardHeight - insetBottom)
    : 0;
}
