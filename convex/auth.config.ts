/**
 * Convex Auth Configuration
 *
 * Configures Clerk as the authentication provider for Convex.
 * Links Clerk JWT tokens to Convex user identity.
 */

export default {
  providers: [
    {
      applicationID: 'convex',
      domain: 'https://vital-elf-64.clerk.accounts.dev',
    },
  ],
};
