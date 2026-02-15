/* eslint-disable unicorn/consistent-function-scoping -- factory functions intentionally return inner arrow functions */
/**
 * Analytics Event Creator Functions
 * Factory functions for creating analytics tracking functions
 */

import type { SuggestionChip } from '../types';
import { getChipLabels } from './helpers';
import { getTimeContext } from './timeContext';
import { trackTimeBasedChipEvent } from './trackers';

/** Track when user first views chips */
export function createTrackChipsDisplayed() {
  return (chips: SuggestionChip[]) => {
    const { now, hour, timeWindow } = getTimeContext();

    trackTimeBasedChipEvent({
      chipLabels: getChipLabels(chips),
      hour,
      timestamp: now.getTime(),
      timeWindow,
      type: 'chips_displayed',
    });

    trackTimeBasedChipEvent({
      dayOfWeek: now.getDay(),
      hour,
      timestamp: now.getTime(),
      timeWindow,
      type: 'time_window_distribution',
    });
  };
}

/** Track chip selection */
export function createTrackChipSelected() {
  return (chip: SuggestionChip, index: number) => {
    const { now, hour, timeWindow } = getTimeContext();

    trackTimeBasedChipEvent({
      chipEmoji: chip.emoji,
      chipFullName: chip.fullName,
      chipIndex: index,
      chipLabel: chip.label,
      hour,
      timestamp: now.getTime(),
      timeWindow,
      type: 'chip_selected',
    });
  };
}

/** Track chip deselection */
export function createTrackChipDeselected() {
  return (chip: SuggestionChip, index: number) => {
    const { now, timeWindow } = getTimeContext();

    trackTimeBasedChipEvent({
      chipIndex: index,
      chipLabel: chip.label,
      previouslySelected: true,
      timestamp: now.getTime(),
      timeWindow,
      type: 'chip_deselected',
    });
  };
}

/** Track successful chip-to-habit conversion */
export function createTrackChipConvertedToHabit() {
  return (chip: SuggestionChip, index: number, displayTimestamp: number) => {
    const { now, timeWindow } = getTimeContext();

    trackTimeBasedChipEvent({
      chipEmoji: chip.emoji,
      chipFullName: chip.fullName,
      chipIndex: index,
      chipLabel: chip.label,
      timestamp: now.getTime(),
      timeToConversion: now.getTime() - displayTimestamp,
      timeWindow,
      type: 'chip_converted_to_habit',
    });
  };
}

/** Track when user types manually instead of using chips */
export function createTrackManualInputAfterChipView() {
  return (habitName: string, viewedChips: SuggestionChip[]) => {
    const { now, timeWindow } = getTimeContext();

    trackTimeBasedChipEvent({
      chipsViewed: getChipLabels(viewedChips),
      manualHabitName: habitName,
      timestamp: now.getTime(),
      timeWindow,
      type: 'manual_input_after_chip_view',
    });
  };
}
