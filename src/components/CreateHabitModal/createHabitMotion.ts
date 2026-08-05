/**
 * Create-habit motion tokens — aligned with full-screen Modal + theme/animations.
 */
import { durations } from '@/theme/animations';
import { fadeIn, fadeOut } from '../Modal/modalAnimationHelpers';
import { FULL_SCREEN_ENTER_MS } from '../Modal/Modal.constants';

export const createHabitMotion = {
  /** Keyboard + caret — after the modal slide finishes */
  focusAfterEnterMs: FULL_SCREEN_ENTER_MS,
  /** Placeholder hint — fades in once the sheet has landed */
  placeholderRevealDelayMs: FULL_SCREEN_ENTER_MS,
  placeholderFadeIn: fadeIn(durations.reveal),
  placeholderFadeOut: fadeOut(durations.quick),
  /** Emerald focus ring */
  inputFocusRing: fadeIn(durations.standard),
  /** Create / Save enabled state */
  saveButtonEnable: fadeIn(durations.transition),
  saveButtonDisable: fadeOut(durations.transition),
  /** Scroll hint + other post-enter UI */
  contentReadyMs: FULL_SCREEN_ENTER_MS,
} as const;
