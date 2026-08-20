import { useEffect, type MutableRefObject } from 'react';
import type { FunctionReference } from 'convex/server';

import type { CacheEntryDefinition } from '../types';
import {
  buildLatestArgsMemoryKey,
  buildLatestStorageKey,
  getQueryCacheScope,
} from '../persistence/keys';
import { scheduleEntryWrite } from '../persistence/writeEntry';
import { queryCacheStore } from '../store/state';

interface PersistCachedQueryArgs<Query extends FunctionReference<'query'>> {
  argsKey: string;
  entry: CacheEntryDefinition;
  latestKey: string;
  live: Query['_returnType'] | undefined;
  memoryKey: string;
  previousLive: MutableRefObject<Query['_returnType'] | undefined>;
  stableArgs: MutableRefObject<Query['_args'] | 'skip'>;
  writeLatest: boolean;
}

function writeLatestValue<Query extends FunctionReference<'query'>>(
  entry: CacheEntryDefinition,
  latestKey: string,
  args: Query['_args'] | 'skip',
  live: Query['_returnType'],
  savedAt: number,
  scope: string | null
): void {
  queryCacheStore.set(latestKey, live, savedAt);
  queryCacheStore.set(buildLatestArgsMemoryKey(entry.name), args, savedAt);
  scheduleEntryWrite(entry, buildLatestStorageKey(entry, scope), args, live, scope);
}

export function usePersistCachedQuery<Query extends FunctionReference<'query'>>({
  argsKey,
  entry,
  latestKey,
  live,
  memoryKey,
  previousLive,
  stableArgs,
  writeLatest,
}: PersistCachedQueryArgs<Query>): void {
  useEffect(() => {
    if (live == null || stableArgs.current === 'skip') return;
    previousLive.current = live;
    const scope = getQueryCacheScope();
    const savedAt = Date.now();
    queryCacheStore.set(memoryKey, live, savedAt);
    if (!writeLatest) return;
    writeLatestValue(entry, latestKey, stableArgs.current, live, savedAt, scope);
  }, [
    argsKey,
    entry,
    latestKey,
    live,
    memoryKey,
    previousLive,
    stableArgs,
    writeLatest,
  ]);
}
