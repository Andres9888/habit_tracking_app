import { api } from '../../../convex/_generated/api';
import { convexClient } from '../appConfig/convexClient';
import {
  buildProductEvent,
  type InteractionPayload,
  type ProductEvent,
} from './eventCatalog';

type ProductEventSender = (event: ProductEvent) => Promise<unknown>;

function sendProductEvent(event: ProductEvent): Promise<unknown> {
  if (!convexClient) return Promise.resolve(null);
  return convexClient.mutation(api.productEvents.track, event);
}

export function deliverProductEvent(
  event: ProductEvent,
  send: ProductEventSender = sendProductEvent
): void {
  void send(event).catch((error_) => {
    if (__DEV__) console.warn('[analytics] event delivery failed', error_);
  });
}

export function logInteraction(
  eventName: string,
  payload?: InteractionPayload
): void {
  if (!eventName) return;
  const event = buildProductEvent(eventName, payload);
  if (!event) {
    if (__DEV__)
      console.warn(`[analytics] ignored unknown event: ${eventName}`);
    return;
  }
  if (__DEV__) console.log(`[interaction:${event.name}]`, event);
  // Analytics must never block or fail a user action.
  deliverProductEvent(event);
}

export { buildProductEvent } from './eventCatalog';
export default logInteraction;
