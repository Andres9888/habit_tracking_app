/**
 * Modal Component Types
 * Type definitions for the Modal component and its variants
 */

import type { ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export type ModalVariant = 'bottomSheet' | 'fullScreen' | 'centerAlert';

export interface ModalProps {
  /** Modal visibility */
  visible: boolean;

  /** On close callback */
  onClose: () => void;

  /** Render without a nested native modal container (useful inside another modal) */
  inline?: boolean;

  /** Mount children once in a hidden inert host before the modal opens */
  warmMount?: boolean;

  /**
   * Keep children mounted for the modal's whole lifetime, rendered inline as
   * an absolutely positioned overlay instead of a native modal. Opening then
   * only runs the enter animation: no chunk load, no mount, no native
   * presentation. Closed, the overlay is offscreen, inert and hidden from
   * assistive tech.
   */
  keepMounted?: boolean;

  /** Modal variant */
  variant?: ModalVariant;

  /** Modal content */
  children: React.ReactNode;

  /** Disable backdrop tap to close */
  disableBackdropClose?: boolean;

  /** Disable gesture to close */
  disableGestureClose?: boolean;

  /** Custom backdrop opacity (0-1) */
  backdropOpacity?: number;

  /** Custom style */
  style?: ViewStyle;

  /** Respect system reduce motion preference (default: true) */
  respectReduceMotion?: boolean;

  /** Skip open/close entrance animations (instant show/hide) */
  skipAnimation?: boolean;

  /** Flag the modal container as a modal for assistive tech (default: true) */
  accessibilityViewIsModal?: boolean;
}

export interface ModalAnimationValues {
  /** Bottom sheet translateY */
  translateY: SharedValue<number>;
  /** Full screen progress (0-1) */
  fullScreenProgress: SharedValue<number>;
  /** Full screen gesture Y offset */
  fullScreenGestureY: SharedValue<number>;
  /** Center alert scale */
  scale: SharedValue<number>;
  /** Center alert opacity */
  alertOpacity: SharedValue<number>;
  /** Backdrop opacity */
  backdropOpacityValue: SharedValue<number>;
}

export interface ModalGestureConfig {
  dismissThreshold: number;
  velocityThreshold: number;
}
