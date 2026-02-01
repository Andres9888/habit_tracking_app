import { ConvexReactClient } from 'convex/react';
import * as SecureStore from 'expo-secure-store';

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error('EXPO_PUBLIC_CONVEX_URL is required but was not provided');
}

export const convexClient = new ConvexReactClient(convexUrl);

export const clerkPublishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to read token from secure store', error);
      }
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to save token to secure store', error);
      }
      return;
    }
  },
};
