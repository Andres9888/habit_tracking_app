/** Human-readable label for a Growth Icons preset id. */
import {
  CUSTOM_PRESET_ID,
  PROGRESS_EMOJI_PRESETS,
} from '@/utils/progressEmojis';

export function presetLabelFor(presetId: string | null): string {
  if (presetId === CUSTOM_PRESET_ID || presetId === null) return 'Custom';
  return (
    PROGRESS_EMOJI_PRESETS.find((p) => p.id === presetId)?.label ?? 'Custom'
  );
}
