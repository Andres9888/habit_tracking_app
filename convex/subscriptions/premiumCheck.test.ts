import {
  isStaleWebhookTimestamp,
  hasPremiumAccess,
  validateWebhookTimestamp,
} from './premiumCheck';

function makeCtx(subscription: unknown) {
  return {
    db: {
      query: jest.fn(() => ({
        withIndex: jest.fn((_indexName, cb) => {
          cb({ eq: jest.fn() });
          return { first: jest.fn(async () => subscription) };
        }),
      })),
    },
  } as never;
}

describe('premiumCheck', () => {
  describe('hasPremiumAccess', () => {
    it('reads active premium access from the durable subscriptions table', async () => {
      await expect(
        hasPremiumAccess(
          makeCtx({
            _creationTime: 1,
            _id: 'sub_1',
            clerkId: 'user_1',
            createdAt: 1,
            startedAt: 1,
            status: 'active',
            updatedAt: 1,
          }),
          'user_1'
        )
      ).resolves.toBe(true);
    });

    it('rejects expired and inactive subscription rows', async () => {
      await expect(
        hasPremiumAccess(
          makeCtx({
            _creationTime: 1,
            _id: 'sub_1',
            clerkId: 'user_1',
            createdAt: 1,
            expiresAt: Date.now() - 1,
            startedAt: 1,
            status: 'active',
            updatedAt: 1,
          }),
          'user_1'
        )
      ).resolves.toBe(false);

      await expect(
        hasPremiumAccess(
          makeCtx({
            _creationTime: 1,
            _id: 'sub_2',
            clerkId: 'user_1',
            createdAt: 1,
            startedAt: 1,
            status: 'expired',
            updatedAt: 1,
          }),
          'user_1'
        )
      ).resolves.toBe(false);
    });

    it('does not grant premium when only userSettings hasPremium would be true', async () => {
      const ctx = makeCtx(null) as {
        db: { query: jest.Mock };
      };

      await expect(hasPremiumAccess(ctx as never, 'user_1')).resolves.toBe(
        false
      );
      expect(ctx.db.query).toHaveBeenCalledWith('subscriptions');
      expect(ctx.db.query).not.toHaveBeenCalledWith('userSettings');
    });
  });

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
