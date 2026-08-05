/**
 * Resolve the active growth emoji set for a habit, layering
 * per-habit override → user default → built-in defaults.
 */
import { api } from '../../convex/_generated/api';
import { useCachedQuery } from '../lib/queryCache';
import {
  type PartialProgressEmojiSet,
  type ProgressEmojiSet,
  resolveProgressEmojis,
} from '../utils/progressEmojis';

export function useProgressEmojis(
  habit?: { progressEmojis?: PartialProgressEmojiSet } | null
): ProgressEmojiSet {
  const settings = useCachedQuery(
    api.settings.get,
    {},
    {
      entryName: 'settings.get',
    }
  );
  return resolveProgressEmojis(
    habit?.progressEmojis,
    settings?.progressEmojis ?? undefined
  );
}

export function useUserDefaultProgressEmojis(): ProgressEmojiSet {
  const settings = useCachedQuery(
    api.settings.get,
    {},
    {
      entryName: 'settings.get',
    }
  );
  return resolveProgressEmojis(
    undefined,
    settings?.progressEmojis ?? undefined
  );
}

export function useUserCustomProgressEmojis(): ProgressEmojiSet | undefined {
  const settings = useCachedQuery(
    api.settings.get,
    {},
    {
      entryName: 'settings.get',
    }
  );
  return settings?.customProgressEmojis ?? undefined;
}
