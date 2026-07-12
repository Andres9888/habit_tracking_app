/**
 * Cold-start gate: true only when settings.get has a real value
 * (cached or live). Never treats product defaults as "ready" — that
 * would paint circle/no-bar then flip to the user's saved preference.
 *
 * Subscribe while the loading screen shows so the gate cannot deadlock
 * waiting for a query nobody is running. Convex dedupes with app-tree
 * consumers.
 */
import { api } from '../../../convex/_generated/api';
import { useCachedQuery } from '../../lib/queryCache';

export function useSettingsReady(isSignedIn: boolean): boolean {
  const settings = useCachedQuery(api.settings.get, isSignedIn ? {} : 'skip', {
    entryName: 'settings.get',
  });

  if (!isSignedIn) return true;
  return settings !== undefined;
}
