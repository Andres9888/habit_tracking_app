/**
 * Convex Auth Configuration (SEC-001: Auth Configuration Security)
 *
 * Configures Clerk as the authentication provider for Convex.
 * Links Clerk JWT tokens to Convex user identity.
 *
 * SECURITY NOTES:
 * - Auth domain is configured via environment variable (CLERK_AUTH_DOMAIN)
 * - Clerk domain should be set during deployment, not build time
 */
const authDomain = process.env.CLERK_AUTH_DOMAIN;
if (!authDomain) {
  throw new Error(
    'CLERK_AUTH_DOMAIN environment variable is required. Set it in the Convex dashboard.'
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
