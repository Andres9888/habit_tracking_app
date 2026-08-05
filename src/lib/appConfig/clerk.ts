const CLERK_KEY_ERROR =
  'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is required. Add it to .env.local';

export const clerkPublishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
export const hasClerkPublishableKey =
  typeof clerkPublishableKey === 'string' && clerkPublishableKey.trim().length > 0;

if (__DEV__ && !hasClerkPublishableKey) {
  console.warn(CLERK_KEY_ERROR);
}

export function getRequiredClerkPublishableKey(): string {
  if (!hasClerkPublishableKey) {
    throw new Error(CLERK_KEY_ERROR);
  }

  return clerkPublishableKey;
}
