/**
 * Warms the template library query cache before the library modal opens.
 *
 * The templates modal mounts its screen (and its Convex subscriptions) only
 * when visible, so the first-ever open would otherwise wait on a full
 * templates.list round-trip. Mounting this hook alongside the habits screen
 * keeps both subscriptions live and the persisted cache fresh, making the
 * library open instantly.
 */
import { api } from '../../../convex/_generated/api';
import { useCachedQuery } from '../../lib/queryCache';

export function useWarmTemplatesCache() {
  useCachedQuery(api.templates.list, {}, { entryName: 'templates.list' });
  useCachedQuery(
    api.templates.getImportedTemplateIds,
    {},
    { entryName: 'templates.getImportedTemplateIds' }
  );
}
