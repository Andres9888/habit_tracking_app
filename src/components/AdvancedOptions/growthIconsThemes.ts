/** Theme list helpers for GrowthIconsInline. */
import { PROGRESS_EMOJI_PRESETS } from '@/utils/progressEmojis';

const PRIMARY = [
  { id: 'plants', label: 'Sprout' },
  { id: 'fire', label: 'Fire' },
] as const;

export function getPrimaryThemes() {
  return PRIMARY.flatMap((row) => {
    const preset = PROGRESS_EMOJI_PRESETS.find((p) => p.id === row.id);
    return preset
      ? [
          {
            id: preset.id,
            label: row.label,
            emojis: preset.emojis,
            chipEmoji: preset.chipEmoji ?? preset.emojis.starting,
          },
        ]
      : [];
  });
}

export function getMoreThemes() {
  return PROGRESS_EMOJI_PRESETS.filter(
    (p) => p.id !== 'plants' && p.id !== 'fire'
  );
}
