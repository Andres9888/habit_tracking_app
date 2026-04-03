import {
  isStaleWebhookTimestamp,
  validateWebhookTimestamp,
} from './premiumCheck';

describe('premiumCheck', () => {
  describe('isStaleWebhookTimestamp', () => {
    it('returns false when there is no previously processed timestamp', () => {
      expect(isStaleWebhookTimestamp(undefined, Date.now())).toBe(false);
    });

    it('returns true when an incoming event is older than the last processed event', () => {
      expect(isStaleWebhookTimestamp(2_000, 1_999)).toBe(true);
    });

    it('returns false for newer or same-timestamp events', () => {
      expect(isStaleWebhookTimestamp(2_000, 2_000)).toBe(false);
      expect(isStaleWebhookTimestamp(2_000, 2_001)).toBe(false);
    });
  });

  describe('validateWebhookTimestamp', () => {
    it('accepts a valid RevenueCat-style millisecond timestamp', () => {
      const timestamp = new Date('2026-01-15T12:00:00.000Z').getTime();

      expect(validateWebhookTimestamp(timestamp, 'event_timestamp_ms')).toBe(
        timestamp
      );
    });
  });
});
