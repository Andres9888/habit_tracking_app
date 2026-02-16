# Safe AsyncStorage Utilities

Type-safe wrappers around React Native AsyncStorage with automatic error handling, validation, and consistent logging.

## Why Use These?

**Direct AsyncStorage calls are error-prone:**
```typescript
// ❌ Bad: No error handling, no validation, crashes on invalid JSON
const raw = await AsyncStorage.getItem('@my_key');
const data = JSON.parse(raw); // Can throw!
```

**Safe storage utilities handle this for you:**
```typescript
// ✅ Good: Type-safe, validated, never throws
const data = await safeGetItem('@my_key', isMyType, defaultValue);
```

## Quick Start

```typescript
import { safeGetItem, safeSetItem, safeGetBoolean } from '@/utils/storage';

// Store and retrieve typed data
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'id' in value
  );
}

const user = await safeGetItem('@user', isUser, { name: 'Guest', id: null });
await safeSetItem('@user', { name: 'Alice', id: '123' });

// Booleans (common for feature flags)
const onboardingComplete = await safeGetBoolean('@onboarding_complete', false);
await safeSetBoolean('@onboarding_complete', true);
```

## API Reference

### `safeGetItem<T>`

Get and validate a typed item from storage.

```typescript
async function safeGetItem<T>(
  key: string,
  validator: (value: unknown) => value is T,
  fallback: T
): Promise<T>
```

**Parameters:**
- `key` - AsyncStorage key
- `validator` - Type guard function (returns `true` if data is valid)
- `fallback` - Value to return if key doesn't exist or validation fails

**Returns:** Validated data or fallback

**Example:**
```typescript
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

const emojis = await safeGetItem('@recent_emojis', isStringArray, []);
```

### `safeSetItem<T>`

Store a value in AsyncStorage (automatically JSON.stringify).

```typescript
async function safeSetItem<T>(key: string, value: T): Promise<void>
```

**Throws:** Error if storage fails (catch this in critical paths)

**Example:**
```typescript
try {
  await safeSetItem('@preferences', { theme: 'dark', fontSize: 16 });
} catch (error) {
  // Handle storage failure
}
```

### `safeRemoveItem`

Remove an item from storage (never throws).

```typescript
async function safeRemoveItem(key: string): Promise<void>
```

### Helper Methods

For common primitive types:

```typescript
// Strings
await safeGetString('@username', 'Guest');
await safeSetString('@username', 'Alice');

// Booleans
await safeGetBoolean('@dark_mode', false);
await safeSetBoolean('@dark_mode', true);

// Numbers
await safeGetNumber('@count', 0);
await safeSetNumber('@count', 42);
```

## Best Practices

### ✅ DO

**Use type guards for complex data:**
```typescript
interface Preferences {
  theme: 'light' | 'dark';
  fontSize: number;
}

function isPreferences(value: unknown): value is Preferences {
  if (!value || typeof value !== 'object') return false;
  const p = value as Partial<Preferences>;
  return (
    (p.theme === 'light' || p.theme === 'dark') &&
    typeof p.fontSize === 'number'
  );
}

const prefs = await safeGetItem('@prefs', isPreferences, {
  theme: 'light',
  fontSize: 14
});
```

**Provide sensible fallbacks:**
```typescript
// Good: Empty array is safe default
const emojis = await safeGetItem('@emojis', isStringArray, []);

// Good: Default config object
const config = await safeGetItem('@config', isConfig, DEFAULT_CONFIG);
```

**Catch errors for critical operations:**
```typescript
try {
  await safeSetItem('@queue', queueData);
} catch (error) {
  // Alert user or retry
  console.error('Failed to save queue:', error);
}
```

### ❌ DON'T

**Don't store sensitive data unencrypted:**
```typescript
// ❌ Bad: Passwords should use secure storage
await safeSetString('@password', userPassword);

// ✅ Good: Use expo-secure-store for sensitive data
import * as SecureStore from 'expo-secure-store';
await SecureStore.setItemAsync('password', userPassword);
```

**Don't store large objects:**
```typescript
// ❌ Bad: AsyncStorage is for small data
await safeSetItem('@all_messages', messagesArray); // 10MB+

// ✅ Good: Use a database (SQLite, WatermelonDB)
await db.messages.insert(messagesArray);
```

**Don't skip validation:**
```typescript
// ❌ Bad: Assumes data is always valid
const data = JSON.parse(await AsyncStorage.getItem('@data'));

// ✅ Good: Validate shape
const data = await safeGetItem('@data', isValidData, DEFAULT);
```

## Storage Keys

Document your keys for easier debugging:

```typescript
/**
 * AsyncStorage Keys
 */
export const STORAGE_KEYS = {
  /** Onboarding completion flag (boolean) */
  ONBOARDING_COMPLETE: '@chainday_onboarding_complete',
  
  /** Recent emojis list (string[]) */
  RECENT_EMOJIS: '@habit_app:recent_emojis',
  
  /** Last custom color selected (hex string) */
  LAST_CUSTOM_COLOR: '@habit_app:last_custom_color',
} as const;
```

## Testing

Safe storage utilities are easier to mock:

```typescript
import { safeGetItem, safeSetItem } from '@/utils/storage';

jest.mock('@/utils/storage', () => ({
  safeGetItem: jest.fn(),
  safeSetItem: jest.fn(),
}));

test('loads saved preferences', async () => {
  (safeGetItem as jest.Mock).mockResolvedValue({ theme: 'dark' });
  
  const prefs = await loadPreferences();
  
  expect(prefs.theme).toBe('dark');
});
```

## Migration Guide

**Before:**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

try {
  const raw = await AsyncStorage.getItem('@key');
  if (raw) {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      setData(parsed);
    }
  }
} catch (error) {
  console.warn('Error:', error);
  setData([]);
}
```

**After:**
```typescript
import { safeGetItem } from '@/utils/storage';

const data = await safeGetItem(
  '@key',
  (v): v is MyType[] => Array.isArray(v),
  []
);
setData(data);
```

## Error Handling

All errors are logged in development mode (`__DEV__`). In production:

- `safeGetItem` returns fallback on errors (never throws)
- `safeSetItem` throws on errors (catch in critical paths)
- `safeRemoveItem` logs but doesn't throw (removal is non-critical)

```typescript
// Reads are safe (no try/catch needed)
const data = await safeGetItem('@key', isValid, fallback);

// Writes should be caught if critical
try {
  await safeSetItem('@critical_data', data);
} catch (error) {
  // Handle failure
}
```
