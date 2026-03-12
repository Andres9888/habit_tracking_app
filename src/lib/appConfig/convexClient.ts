import { ConvexReactClient } from 'convex/react';

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
export const hasConvexUrl = typeof convexUrl === 'string' && convexUrl.trim().length > 0;

if (__DEV__ && !hasConvexUrl) {
  console.warn(
    'Missing environment variable: EXPO_PUBLIC_CONVEX_URL is required. Set it in .env.local'
  );
}

export const convexClient = hasConvexUrl ? new ConvexReactClient(convexUrl) : null;
