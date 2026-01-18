/**
 * useTimeBasedChipAnalytics Hook
 *
 * Hook for tracking Time-Based Chip analytics
 * Use this hook in SuggestionChips component to track user interactions
 *
 * @example
 * ```tsx
 * const analytics = useTimeBasedChipAnalytics();
 *
 * // Track chips displayed
 * useEffect(() => {
 *   analytics.trackChipsDisplayed(chips);
 * }, [chips]);
 *
 * // Track chip selection
 * const handleChipSelect = (index: number, chip: SuggestionChip) => {
 *   analytics.trackChipSelected(chip, index);
 *   onSelect(index, chip);
 * };
 * ```
 */

import {
  createTrackChipsDisplayed,
  createTrackChipSelected,
  createTrackChipDeselected,
  createTrackChipConvertedToHabit,
  createTrackManualInputAfterChipView,
} from './eventCreators';

export function useTimeBasedChipAnalytics() {
  return {
    trackChipConvertedToHabit: createTrackChipConvertedToHabit(),
    trackChipDeselected: createTrackChipDeselected(),
    trackChipsDisplayed: createTrackChipsDisplayed(),
    trackChipSelected: createTrackChipSelected(),
    trackManualInputAfterChipView: createTrackManualInputAfterChipView(),
  };
}
