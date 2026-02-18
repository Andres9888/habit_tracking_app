/**
 * External URLs used throughout the app
 * Centralized for easy maintenance and configuration
 */

export const EXTERNAL_URLS = {
  // App Store and Play Store links
  APP_STORE: 'https://apps.apple.com/app/chain-day',
  PLAY_STORE: 'https://play.google.com/store/apps/details?id=com.chainday',
  
  // Marketing and legal pages
  WEBSITE: 'https://chainday.app',
  CHANGELOG: 'https://andres9888.github.io/chainday-landing/changelog.html',
  TERMS: 'https://andres9888.github.io/chainday-landing/terms.html',
  PRIVACY: 'https://andres9888.github.io/chainday-landing/privacy.html',
  
  // Platform-specific subscription management
  IOS_SUBSCRIPTIONS: 'https://apps.apple.com/account/subscriptions',
  ANDROID_SUBSCRIPTIONS: 'https://play.google.com/store/account/subscriptions',
} as const;
