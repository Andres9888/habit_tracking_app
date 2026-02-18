/**
 * Convex Auth Configuration (SEC-001: Auth Configuration Security)
 *
 * Configures Clerk as the authentication provider for Convex.
 * Links Clerk JWT tokens to Convex user identity.
 *
 * SECURITY NOTES:
 * - Auth domain is configured via environment variable (CLERK_AUTH_DOMAIN)
 * - Never hardcode auth provider URLs in source code
 * - Clerk domain should be set during deployment, not build time
 * - See: convex/config/apiConstants.ts#CLERK_API for centralized configuration
 */

import { CLERK_API } from './config/apiConstants';

const authDomain = CLERK_API.AUTH_DOMAIN;

if (!authDomain) {
  throw new Error(
    'CLERK_AUTH_DOMAIN environment variable is required for Convex authentication'
  );
}

export default {
  providers: [
    {
      applicationID: 'convex',
      domain: authDomain,
    },
  ],
};
