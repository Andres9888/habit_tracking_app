import { safeGetString, safeSetString } from './safeStorageCore';

export {
  safeGetItem,
  safeRemoveItem,
  safeGetString,
  safeSetItem,
  safeSetString,
} from './safeStorageCore';

export async function safeGetBoolean(
  key: string,
  fallback: boolean
): Promise<boolean> {
  const value = await safeGetString(key, String(fallback));
  return value === 'true';
}

export async function safeSetBoolean(
  key: string,
  value: boolean
): Promise<void> {
  await safeSetString(key, String(value));
}

export async function safeGetNumber(
  key: string,
  fallback: number
): Promise<number> {
  const value = await safeGetString(key, String(fallback));
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export async function safeSetNumber(key: string, value: number): Promise<void> {
  await safeSetString(key, String(value));
}
