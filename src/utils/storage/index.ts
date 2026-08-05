/**
 * Safe AsyncStorage utilities
 *
 * Use these instead of direct AsyncStorage calls for:
 * - Automatic error handling
 * - Type safety with validation
 * - Consistent logging in development
 * - Easier testing
 */

export {
  safeGetItem,
  safeSetItem,
  safeRemoveItem,
  safeGetString,
  safeSetString,
  safeGetBoolean,
  safeSetBoolean,
  safeGetNumber,
  safeSetNumber,
} from './safeStorage';

export {
  getSensitiveItem,
  setSensitiveItem,
  removeSensitiveItem,
} from './sensitiveStorage';
