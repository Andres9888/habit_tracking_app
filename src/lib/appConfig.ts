import { ConvexReactClient } from 'convex/react';
import * as SecureStore from 'expo-secure-store';

const expoConvexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const viteConvexUrl = (() => {
  if (typeof import.meta === 'undefined') return undefined;
  return (import.meta as { env?: { VITE_CONVEX_URL?: string } }).env
    ?.VITE_CONVEX_URL;
})();

const convexUrl = expoConvexUrl || viteConvexUrl;
if (!convexUrl) {
  throw new Error(
    'Convex URL is required but was not provided. Set EXPO_PUBLIC_CONVEX_URL or VITE_CONVEX_URL.'
  );
}

export const convexClient = new ConvexReactClient(convexUrl);

export const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn('Failed to read token from secure store', error);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn('Failed to save token to secure store', error);
      return;
    }
  },
};
