/**
 * HabitPreview types
 */
import type { HubermanPhase } from '../../../../constants/hubermanPhases';

export interface HabitPreviewProps {
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  timeOfDay?: HubermanPhase | null;
}
