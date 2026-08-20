/**
 * Resolve the active growth emoji set for a habit, layering
 * per-habit override → user default → built-in defaults.
 */
import { useSettingsQuery } from '../lib/settings/useSettingsQuery';
import {
  type PartialProgressEmojiSet,
  type ProgressEmojiSet,
  resolveProgressEmojis,
} from '../utils/progressEmojis';

export function useProgressEmojis(
  habit?: { progressEmojis?: PartialProgressEmojiSet } | null
): ProgressEmojiSet {
  const settings = useSettingsQuery();
  return resolveProgressEmojis(
    habit?.progressEmojis,
    settings?.progressEmojis ?? undefined
  );
}

export function useUserDefaultProgressEmojis(): ProgressEmojiSet {
  const settings = useSettingsQuery();
  return resolveProgressEmojis(
    undefined,
    settings?.progressEmojis ?? undefined
  );
}

export function useUserCustomProgressEmojis(): ProgressEmojiSet | undefined {
  const settings = useSettingsQuery();
  return settings?.customProgressEmojis ?? undefined;
}
