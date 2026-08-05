/**
 * Types for SwipeableActionButton component
 */

import type { Animated } from 'react-native';
import type { Swipeable } from 'react-native-gesture-handler';

export interface SwipeableActionButtonProps {
  /** Icon component to display */
  icon: React.ComponentType<{
    className?: string;
    size?: number;
    strokeWidth?: number;
  }>;
  /** Primary label text */
  label: string;
  /** Subtitle text */
  subtitle?: string;
  /** Press handler for the button */
  onPress: () => void;
  /** Swipe action handler (called when swiped fully) */
  onSwipeAction?: () => void;
  /** Whether to show chevron */
  showChevron?: boolean;
  /** Button variant */
  variant?: 'default' | 'destructive' | 'boost';
  /** Whether swipe is enabled */
  swipeEnabled?: boolean;
  /** Custom swipe action icon */
  swipeIcon?: React.ComponentType<{
    color: string;
    size: number;
    strokeWidth: number;
  }>;
  /** Custom swipe action label */
  swipeLabel?: string;
  /** Swipe action color scheme */
  swipeVariant?: 'destructive' | 'warning';
}

export interface SwipeColors {
  bg: string;
  text: string;
  iconBg: string;
}

export interface SwipeActionsProps {
  dragX: Animated.AnimatedInterpolation<number>;
  swipeColors: SwipeColors;
  swipeLabel: string;
  label: string;
  swipeableRef: React.RefObject<Swipeable | null>;
  onSwipeAction?: () => void;
  SwipeIcon: React.ComponentType<{
    color: string;
    size: number;
    strokeWidth: number;
  }>;
}
