/**
 * API Configuration Constants
 *
 * Centralized location for all hardcoded API URLs and endpoints.
 * Environment variables take precedence over defaults.
 *
 * SECURITY NOTES:
 * - Never hardcode sensitive credentials in this file
 * - Always use environment variables for deployment-specific values
 * - Defaults should only be used for development/fallback purposes
 */

/**
 * Figma API Configuration
 */
export const FIGMA_API = {
  BASE_URL: process.env.FIGMA_API_BASE_URL || 'https://api.figma.com/v1',
} as const;

/**
 * Clerk Authentication Configuration
 *
 * SECURITY: AUTH-001
 * The auth domain is loaded from environment variable with a fallback for development.
 * This should be set during deployment based on your Clerk instance.
 */
export const CLERK_API = {
  AUTH_DOMAIN: process.env.CLERK_AUTH_DOMAIN ?? '',
} as const;

/**
 * Convex Deployment Configuration
 *
 * These URLs are dynamically constructed at runtime using the deployment name.
 */
export const CONVEX_API = {
  // Endpoint format: https://<deployment-name>.convex.site/<path>
  WEBHOOK_REVENUECAT: '/revenuecat-webhook',
  // Other webhook endpoints can be added here as needed
} as const;

/**
 * External API Base URLs
 * Used for external service integrations
 */
export const EXTERNAL_APIS = {
  REVENUECAT: 'https://api.revenuecat.com',
  SENTRY: 'https://sentry.io',
} as const;
