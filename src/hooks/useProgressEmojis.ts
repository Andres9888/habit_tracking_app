/**
 * Resolve the active growth emoji set for a habit, layering
 * per-habit override → user default → built-in defaults.
 */
import { useQuery } from 'convex/react';

import { api } from '../../convex/_generated/api';
import {
  type PartialProgressEmojiSet,
  type ProgressEmojiSet,
  resolveProgressEmojis,
} from '../utils/progressEmojis';

export function useProgressEmojis(
  habit?: { progressEmojis?: PartialProgressEmojiSet } | null
): ProgressEmojiSet {
  const settings = useQuery(api.settings.get);
  return resolveProgressEmojis(
    habit?.progressEmojis,
    settings?.progressEmojis ?? undefined
  );
}

export function useUserDefaultProgressEmojis(): ProgressEmojiSet {
  const settings = useQuery(api.settings.get);
  return resolveProgressEmojis(
    undefined,
    settings?.progressEmojis ?? undefined
  );
}
