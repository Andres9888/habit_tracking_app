import type { HabitCardEntranceVariant } from '../components/HabitCard';

const COMPACT_KEY = 'habitTrackerSettings.compactMode';
const ENTRANCE_ANIMATION_VARIANT_KEY = 'habitTrackerSettings.entranceAnimationVariant';

/**
 * Valid entrance animation variants for dev testing.
 * @see HabitCardEntranceVariant
 */
const VALID_VARIANTS: HabitCardEntranceVariant[] = [
  'fadeUp',
  'accentSlideDown',
  'widthExpansion',
  'none',
];

/**
 * Get the stored entrance animation variant for A/B testing (dev only).
 * @returns The stored variant or 'accentSlideDown' as default.
 */
export const getEntranceAnimationVariant = async (): Promise<HabitCardEntranceVariant> => {
  // Only enable in development mode
  if (!__DEV__) {
    return 'accentSlideDown';
  }

  // Prefer web localStorage when available
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(ENTRANCE_ANIMATION_VARIANT_KEY);
      if (raw && VALID_VARIANTS.includes(raw as HabitCardEntranceVariant)) {
        return raw as HabitCardEntranceVariant;
      }
      return 'accentSlideDown';
    }
  } catch (error) {
    console.warn('Failed to read entrance animation variant from localStorage', error);
  }

  // Fallback to Expo SecureStore (native only)
  try {
    const SecureStore = await import('expo-secure-store');
    const raw = await SecureStore.getItemAsync(ENTRANCE_ANIMATION_VARIANT_KEY);
    if (raw && VALID_VARIANTS.includes(raw as HabitCardEntranceVariant)) {
      return raw as HabitCardEntranceVariant;
    }
    return 'accentSlideDown';
  } catch {
    return 'accentSlideDown';
  }
};

/**
 * Set the entrance animation variant for A/B testing (dev only).
 * @param value - The variant to store.
 */
export const setEntranceAnimationVariant = async (value: HabitCardEntranceVariant): Promise<void> => {
  // Only enable in development mode
  if (!__DEV__) {
    return;
  }

  // Log for analytics/debugging
  console.log('[DEV] Animation variant changed:', value);

  // Prefer web localStorage when available
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ENTRANCE_ANIMATION_VARIANT_KEY, value);
      return;
    }
  } catch (error) {
    console.warn('Failed to write entrance animation variant to localStorage', error);
  }

  // Fallback to Expo SecureStore (native only)
  try {
    const SecureStore = await import('expo-secure-store');
    await SecureStore.setItemAsync(ENTRANCE_ANIMATION_VARIANT_KEY, value);
  } catch {
    // no-op
  }
};

export const getCompactMode = async (): Promise<boolean> => {
  // Prefer web localStorage when available
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(COMPACT_KEY);
      if (raw == null) return false;
      return raw === 'true';
    }
  } catch (error) {
    console.warn('Failed to read compact mode from localStorage', error);
  }

  // Fallback to Expo SecureStore (native only)
  try {
    const SecureStore = await import('expo-secure-store');
    const raw = await SecureStore.getItemAsync(COMPACT_KEY);
    if (raw == null) return false;
    return raw === 'true';
  } catch {
    return false;
  }
};

export const setCompactMode = async (value: boolean): Promise<void> => {
  // Prefer web localStorage when available
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(COMPACT_KEY, value ? 'true' : 'false');
      return;
    }
  } catch (error) {
    console.warn('Failed to write compact mode to localStorage', error);
  }

  // Fallback to Expo SecureStore (native only)
  try {
    const SecureStore = await import('expo-secure-store');
    await SecureStore.setItemAsync(COMPACT_KEY, value ? 'true' : 'false');
  } catch {
    // no-op
  }
};
