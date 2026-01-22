/**
 * Convex HTTP Router
 *
 * Defines HTTP endpoints for external integrations like webhooks.
 * These endpoints are accessible at: https://<deployment>.convex.site/<path>
 */

import { httpRouter } from 'convex/server';
import { revenuecatWebhook } from './webhooks/revenuecat';

const http = httpRouter();

/**
 * RevenueCat Webhook Endpoint
 *
 * SEC-002: Server-side premium validation
 *
 * Configure this URL in RevenueCat Dashboard:
 * https://<deployment-name>.convex.site/revenuecat-webhook
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
  path: '/revenuecat-webhook',
  method: 'POST',
  handler: revenuecatWebhook,
});

export default http;
