/**
 * Types for SwipeableActionButton component
 */

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
