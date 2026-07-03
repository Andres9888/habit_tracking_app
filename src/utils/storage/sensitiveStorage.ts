/* eslint-disable max-lines */
/**
 * Sensitive storage utilities.
 *
 * Stores large sensitive values in chunked SecureStore entries on native
 * platforms. Tests intentionally fall back to AsyncStorage so existing storage
 * tests can keep asserting against concrete keys. When secure storage is
 * unavailable (for example on web), values are kept in memory only.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const SECURE_CHUNK_CHAR_LIMIT = 512;
const SECURE_META_VERSION = 1;
const SECURE_KEY_PREFIX = 'sensitive.';

const secureStoreOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
};

const memoryFallback = new Map<string, string>();

let secureStoreAvailabilityPromise: Promise<boolean> | null = null;

interface SecureItemMeta {
  chunkCount: number;
  version: number;
}

function usesAsyncStorageTestFallback(): boolean {
  return process.env.NODE_ENV === 'test';
}

async function isSecureStoreAvailable(): Promise<boolean> {
  if (usesAsyncStorageTestFallback()) {
    return false;
  }

  if (!secureStoreAvailabilityPromise) {
    secureStoreAvailabilityPromise = (async () => {
      try {
        return await SecureStore.isAvailableAsync();
      } catch {
        return false;
      }
    })();
  }

  return secureStoreAvailabilityPromise;
}

// Injective: `_` is itself escaped (as `_5f_`), so the only source of the
// `_<hex>_` shape in the output is an escape. Without this, a key containing a
// literal `_20_` would collide with the encoding of a key containing a space
// (both -> `a_20_b`), letting two distinct secrets share meta/chunks.
// Exported for tests. In test mode the AsyncStorage fallback uses raw keys, so
// injectivity can't be exercised behaviorally — it is asserted directly.
export function encodeSecureKey(key: string): string {
  return key.replaceAll(/[^A-Za-z0-9.-]/g, (character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return `_${codePoint.toString(16)}_`;
  });
}

function getSecureMetaKey(key: string): string {
  return `${SECURE_KEY_PREFIX}${encodeSecureKey(key)}.meta`;
}

function getSecureChunkKey(key: string, chunkIndex: number): string {
  return `${SECURE_KEY_PREFIX}${encodeSecureKey(key)}.${chunkIndex}`;
}

function parseSecureMeta(raw: string | null): SecureItemMeta | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const maybeMeta = parsed as Partial<SecureItemMeta>;
    const chunkCount = maybeMeta.chunkCount;
    if (
      typeof chunkCount !== 'number' ||
      !Number.isInteger(chunkCount) ||
      chunkCount < 1 ||
      maybeMeta.version !== SECURE_META_VERSION
    ) {
      return null;
    }

    return {
      chunkCount,
      version: SECURE_META_VERSION,
    };
  } catch {
    return null;
  }
}

async function removeSecureStoreChunks(
  key: string,
  chunkCount: number
): Promise<void> {
  await Promise.all(
    Array.from({ length: chunkCount }, (_, index) =>
      SecureStore.deleteItemAsync(
        getSecureChunkKey(key, index),
        secureStoreOptions
      )
    )
  );
}

export async function getSensitiveItem(key: string): Promise<string | null> {
  if (usesAsyncStorageTestFallback()) {
    return AsyncStorage.getItem(key);
  }

  if (!(await isSecureStoreAvailable())) {
    return memoryFallback.get(key) ?? null;
  }

  const metaRaw = await SecureStore.getItemAsync(
    getSecureMetaKey(key),
    secureStoreOptions
  );
  const meta = parseSecureMeta(metaRaw);
  if (!meta) {
    return null;
  }

  const chunks = await Promise.all(
    Array.from({ length: meta.chunkCount }, (_, index) =>
      SecureStore.getItemAsync(
        getSecureChunkKey(key, index),
        secureStoreOptions
      )
    )
  );

  if (chunks.includes(null)) {
    await removeSensitiveItem(key);
    return null;
  }

  return chunks.join('');
}

export async function setSensitiveItem(
  key: string,
  value: string
): Promise<void> {
  if (usesAsyncStorageTestFallback()) {
    await AsyncStorage.setItem(key, value);
    return;
  }

  if (!(await isSecureStoreAvailable())) {
    memoryFallback.set(key, value);
    return;
  }

  const existingMeta = parseSecureMeta(
    await SecureStore.getItemAsync(getSecureMetaKey(key), secureStoreOptions)
  );
  const chunks =
    value.length === 0
      ? ['']
      : Array.from(
          { length: Math.ceil(value.length / SECURE_CHUNK_CHAR_LIMIT) },
          (_, index) =>
            value.slice(
              index * SECURE_CHUNK_CHAR_LIMIT,
              (index + 1) * SECURE_CHUNK_CHAR_LIMIT
            )
        );

  await Promise.all(
    chunks.map((chunk, index) =>
      SecureStore.setItemAsync(
        getSecureChunkKey(key, index),
        chunk,
        secureStoreOptions
      )
    )
  );

  await SecureStore.setItemAsync(
    getSecureMetaKey(key),
    JSON.stringify({
      chunkCount: chunks.length,
      version: SECURE_META_VERSION,
    } satisfies SecureItemMeta),
    secureStoreOptions
  );

  const oldChunkCount = existingMeta?.chunkCount ?? 0;
  if (oldChunkCount > chunks.length) {
    await Promise.all(
      Array.from({ length: oldChunkCount - chunks.length }, (_, offset) =>
        SecureStore.deleteItemAsync(
          getSecureChunkKey(key, chunks.length + offset),
          secureStoreOptions
        )
      )
    );
  }
}

export async function removeSensitiveItem(key: string): Promise<void> {
  if (usesAsyncStorageTestFallback()) {
    await AsyncStorage.removeItem(key);
    return;
  }

  if (!(await isSecureStoreAvailable())) {
    memoryFallback.delete(key);
    return;
  }

  const meta = parseSecureMeta(
    await SecureStore.getItemAsync(getSecureMetaKey(key), secureStoreOptions)
  );

  await SecureStore.deleteItemAsync(getSecureMetaKey(key), secureStoreOptions);

  if (!meta) {
    return;
  }

  await removeSecureStoreChunks(key, meta.chunkCount);
}
