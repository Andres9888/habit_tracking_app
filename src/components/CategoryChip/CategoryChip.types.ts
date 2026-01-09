/**
 * CategoryChip Types
 */

export interface CategoryChipProps {
  /** Category identifier */
  id: string;
  /** Display label */
  label: string;
  /** Category icon/emoji */
  icon: string;
  /** Count of templates in this category */
  count: number;
  /** Whether this chip is selected */
  isSelected: boolean;
  /** Handler for chip press */
  onPress: () => void;
  /** Animation index for staggered entrance */
  animationIndex?: number;
}

export interface CategoryColorConfig {
  primary: string;
  gradient: [string, string];
}
