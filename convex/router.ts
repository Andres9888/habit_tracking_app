/**
 * Convex HTTP Router
 *
 * Defines HTTP endpoints for external integrations like webhooks.
 * These endpoints are accessible at: https://<deployment>.convex.site/<path>
 * See: convex/config/apiConstants.ts#CONVEX_API for endpoint definitions
 */

import { httpRouter } from 'convex/server';
import { revenuecatWebhook } from './webhooks/revenuecat';
import { CONVEX_API } from './config/apiConstants';

const http = httpRouter();

/**
 * RevenueCat Webhook Endpoint
 *
 * SEC-002: Server-side premium validation
 *
 * Configure this URL in RevenueCat Dashboard:
 * https://<deployment-name>.convex.site${CONVEX_API.WEBHOOK_REVENUECAT}
 *
 * Required events to enable:
 * - INITIAL_PURCHASE
 * - RENEWAL
 * - PRODUCT_CHANGE
 * - UNCANCELLATION
 * - CANCELLATION
 * - EXPIRATION
 * - BILLING_ISSUE
 */
http.route({
  path: CONVEX_API.WEBHOOK_REVENUECAT,
  method: 'POST',
  handler: revenuecatWebhook,
});

export default http;
