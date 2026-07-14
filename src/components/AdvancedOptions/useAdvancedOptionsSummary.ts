/** Resolves the collapsed summary's preset label + starting emoji. */
import {
  useUserCustomProgressEmojis,
  useUserDefaultProgressEmojis,
} from '@/hooks/useProgressEmojis';
import {
  CUSTOM_PRESET_ID,
  matchPresetId,
  PROGRESS_EMOJI_PRESETS,
  resolveProgressEmojis,
  type ProgressEmojiSet,
} from '@/utils/progressEmojis';

export function useAdvancedOptionsSummary(
  progressEmojis: ProgressEmojiSet | undefined
) {
  const userDefaultEmojis = useUserDefaultProgressEmojis();
  const savedCustomEmojis = useUserCustomProgressEmojis();
  const resolvedEmojis = resolveProgressEmojis(
    progressEmojis,
    userDefaultEmojis
  );
  const presetId = matchPresetId(resolvedEmojis, savedCustomEmojis);
  const presetLabel =
    presetId === CUSTOM_PRESET_ID
      ? 'Custom'
      : (PROGRESS_EMOJI_PRESETS.find((p) => p.id === presetId)?.label ??
        'Custom');

  return { userDefaultEmojis, savedCustomEmojis, resolvedEmojis, presetLabel };
}
