/**
 * Helper functions for HabitPreview
 */
import {
  HUBERMAN_PHASES,
  type HubermanPhase,
} from '../../../../constants/hubermanPhases';

export const getTimeOfDayLabel = (timeOfDay?: HubermanPhase | null): string => {
  if (!timeOfDay) return 'Daily';
  const phase = HUBERMAN_PHASES[timeOfDay];
  return phase ? `Daily • ${phase.icon} ${phase.shortLabel}` : 'Daily';
};

export const getAccessibilityLabel = (
  isEmpty: boolean,
  habitName: string,
  selectedEmoji: string | null,
  timeOfDay?: HubermanPhase | null
): string => {
  if (isEmpty) {
    return 'Habit preview: No habit configured yet. Enter a name and select an icon to preview.';
  }
  const nameText = habitName || 'Unnamed habit';
  const emojiText = selectedEmoji
    ? `with icon ${selectedEmoji}`
    : 'without icon';
  const timeText = getTimeOfDayLabel(timeOfDay);
  return `Habit preview: ${nameText} ${emojiText}. Schedule: ${timeText}`;
};
