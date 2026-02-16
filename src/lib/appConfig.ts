/**
 * App Configuration Module
 *
 * Core application configuration including:
 * - Convex client for real-time database
 * - Clerk authentication keys
 * - Secure token storage for auth persistence
 *
 * This module initializes critical infrastructure components that
 * must be configured before the app can function properly.
 *
 * @module appConfig
 * @category Infrastructure
 */

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
  /**
   * Retrieve a token from secure storage.
   * @param key - The storage key to retrieve
   * @returns The stored token string, or null if not found/error
   */
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (error) {
      if (__DEV__) console.warn('Failed to read token from secure store', error);
      return null;
    }
  },
  /**
   * Save a token to secure storage.
   * @param key - The storage key to save under
   * @param value - The token value to store
   */
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (error) {
      if (__DEV__) console.warn('Failed to save token to secure store', error);
      return;
    }
  },
  /**
   * Delete a token from secure storage.
   * Used during logout to ensure no stale credentials remain.
   * @param key - The storage key to remove
   */
  async deleteToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      if (__DEV__) console.warn('Failed to delete token from secure store', error);
    }
  },
};
