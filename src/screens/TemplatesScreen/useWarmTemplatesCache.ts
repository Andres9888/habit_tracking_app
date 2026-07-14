/**
 * Keeps the template library query cache live while the library modal is open.
 *
 * Startup warmup is handled separately after the home screen becomes ready.
 * Keeping this hook visibility-aware prevents hidden modal infrastructure from
 * creating eager Convex subscriptions during app startup.
 */
import { api } from '../../../convex/_generated/api';
import { useCachedQuery } from '../../lib/queryCache';

export function useWarmTemplatesCache(enabled = true) {
  const args = enabled ? {} : 'skip';
  useCachedQuery(api.templates.list, args, { entryName: 'templates.list' });
  useCachedQuery(api.templates.getImportedTemplateIds, args, {
    entryName: 'templates.getImportedTemplateIds',
  });
}
