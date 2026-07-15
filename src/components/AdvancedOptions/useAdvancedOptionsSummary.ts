/** Resolves the collapsed summary's preset label + starting emoji. */
import {
  useUserCustomProgressEmojis,
  useUserDefaultProgressEmojis,
} from '@/hooks/useProgressEmojis';
import {
  matchPresetId,
  resolveProgressEmojis,
  type ProgressEmojiSet,
} from '@/utils/progressEmojis';
import { presetLabelFor } from './presetLabelFor';

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
  const presetLabel = presetLabelFor(presetId);

  return { userDefaultEmojis, savedCustomEmojis, resolvedEmojis, presetLabel };
}
