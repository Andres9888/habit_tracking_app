/**
 * RevenueCat Webhook Handler
 *
 * SEC-002: Server-side premium validation via RevenueCat webhooks
 *
 * This handler receives webhook events from RevenueCat when subscription
 * state changes occur. It verifies the signature and delegates to
 * internal mutations to update the database.
 *
 * @see https://www.revenuecat.com/docs/integrations/webhooks
 */

import { httpAction } from '../_generated/server';
import { handleRevenueCatWebhook } from './handleRevenueCatWebhook';

/**
 * Main webhook handler for RevenueCat events
 */
export const revenuecatWebhook = httpAction(async (ctx, request) => {
  try {
    return await handleRevenueCatWebhook(ctx, request);
  } catch (error) {
    console.error('[RevenueCat] Webhook error:', error);
    // Return 500 so RevenueCat retries failed events
    return Response.json(
      { error: 'Processing error' },
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
