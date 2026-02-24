/**
 * Warmup hook for templates data.
 *
 * Preloads the templates list while the habits screen is active so opening the
 * templates modal can reuse cached Convex data.
 */

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export function useTemplatesWarmup(): void {
  useQuery(api.templates.list, {});
}
