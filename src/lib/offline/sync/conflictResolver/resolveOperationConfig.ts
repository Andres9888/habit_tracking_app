import type { ConflictResolverConfig } from './types';

export const DEFAULT_CONFLICT_RESOLVER_CONFIG: Required<ConflictResolverConfig> =
  {
    checkServerStateBeforeSync: true,
    completionWins: true,
    serverCheckTimeoutMs: 5000,
  };
