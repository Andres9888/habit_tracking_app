import {
  handleRefund,
  reconcileRevenueCatSubscriber,
  transferPremium,
} from '../subscriptions';
import { hasPremiumAccess } from './premiumCheck';

type Row = Record<string, unknown> & { _id: string };
type TableName = 'subscriptions' | 'userSettings' | 'productEvents';

const FIXED_NOW = Date.parse('2026-07-14T12:00:00.000Z');

function createDb(seed: Partial<Record<TableName, Row[]>> = {}) {
  const tables: Record<TableName, Row[]> = {
    productEvents: [...(seed.productEvents ?? [])],
    subscriptions: [...(seed.subscriptions ?? [])],
    userSettings: [...(seed.userSettings ?? [])],
  };
  let nextId = 1;

  const findByArgs = (table: TableName, args: unknown[]) => {
    if (table === 'subscriptions') {
      const clerkId = args.find(
        (value) => typeof value === 'string' && value.startsWith('user_')
      );
      return tables.subscriptions.find((row) => row.clerkId === clerkId);
    }

    if (table === 'userSettings') {
      const userId = args.find(
        (value) => typeof value === 'string' && value.startsWith('user_')
      );
      return tables.userSettings.find((row) => row.userId === userId);
    }

    return undefined;
  };

  return {
    db: {
      insert: jest.fn(async (table: TableName, value: Record<string, unknown>) => {
        const row = { _id: `${table}_${nextId++}`, ...value };
        tables[table].push(row);
        return row._id;
      }),
      patch: jest.fn(async (id: string, value: Record<string, unknown>) => {
        const row = Object.values(tables)
          .flat()
          .find((candidate) => candidate._id === id);
        if (!row) throw new Error(`Missing row ${id}`);
        Object.assign(row, value);
      }),
      query: jest.fn((table: TableName) => ({
        withIndex: jest.fn((_indexName: string, cb: (...args: unknown[]) => unknown) => {
          const args: unknown[] = [];
          cb({
            eq: jest.fn((...eqArgs: unknown[]) => {
              args.push(...eqArgs);
            }),
          });
          return {
            first: jest.fn(async () => findByArgs(table, args) ?? null),
          };
        }),
      })),
    },
    tables,
  };
}

function subscription(overrides: Partial<Row>): Row {
  return {
    _id: 'sub_1',
    clerkId: 'user_active',
    createdAt: FIXED_NOW - 10_000,
    lastWebhookEventId: 'evt_initial',
    lastWebhookEventTimestamp: FIXED_NOW,
    planType: 'monthly',
    startedAt: FIXED_NOW - 10_000,
    status: 'active',
    updatedAt: FIXED_NOW - 10_000,
    ...overrides,
  };
}

function settings(userId: string, hasPremium: boolean): Row {
  return {
    _id: `settings_${userId}`,
    hasPremium,
    userId,
  };
}

async function callMutation<TArgs>(
  fn: { _handler: (ctx: unknown, args: TArgs) => Promise<void> },
  ctx: unknown,
  args: TArgs
) {
  await fn._handler(ctx, args);
}

describe('RevenueCat subscription lifecycle regressions', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(FIXED_NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('ignores stale webhook snapshots so old expirations cannot override newer grants', async () => {
    const ctx = createDb({
      subscriptions: [subscription({ expiresAt: FIXED_NOW + 86_400_000 })],
      userSettings: [settings('user_active', true)],
    });

    await callMutation(reconcileRevenueCatSubscriber, ctx, {
      clerkId: 'user_active',
      eventId: 'evt_old_expiration',
      eventTimestamp: FIXED_NOW - 1,
      eventType: 'EXPIRATION',
      expiresAt: FIXED_NOW - 86_400_000,
      hasBillingIssue: false,
      isActive: false,
      isTrialing: false,
      planType: 'monthly',
    });

    expect(ctx.tables.subscriptions[0]).toMatchObject({
      lastWebhookEventId: 'evt_initial',
      status: 'active',
    });
    expect(ctx.tables.userSettings[0]).toMatchObject({ hasPremium: true });
  });

  it('records cancellation without revoking paid access before entitlement expiration', async () => {
    const ctx = createDb({
      subscriptions: [subscription({ clerkId: 'user_cancelled' })],
      userSettings: [settings('user_cancelled', true)],
    });

    await callMutation(reconcileRevenueCatSubscriber, ctx, {
      cancelledAt: FIXED_NOW,
      clerkId: 'user_cancelled',
      eventId: 'evt_cancel',
      eventTimestamp: FIXED_NOW + 1,
      eventType: 'CANCELLATION',
      expiresAt: FIXED_NOW + 86_400_000,
      hasBillingIssue: false,
      isActive: true,
      isTrialing: false,
      planType: 'monthly',
      productId: 'chain_day_monthly',
    });

    expect(ctx.tables.subscriptions[0]).toMatchObject({
      cancelledAt: FIXED_NOW,
      lastWebhookEventId: 'evt_cancel',
      status: 'cancelled',
    });
    expect(ctx.tables.userSettings[0]).toMatchObject({ hasPremium: true });
  });

  it('revokes premium when RevenueCat canonical state reports an inactive entitlement', async () => {
    const ctx = createDb({
      subscriptions: [subscription({ clerkId: 'user_expired' })],
      userSettings: [settings('user_expired', true)],
    });

    await callMutation(reconcileRevenueCatSubscriber, ctx, {
      clerkId: 'user_expired',
      eventId: 'evt_expired',
      eventTimestamp: FIXED_NOW + 1,
      eventType: 'EXPIRATION',
      expiresAt: FIXED_NOW - 1,
      hasBillingIssue: false,
      isActive: false,
      isTrialing: false,
      planType: 'monthly',
      productId: 'chain_day_monthly',
    });

    expect(ctx.tables.subscriptions[0]).toMatchObject({
      lastWebhookEventId: 'evt_expired',
      status: 'expired',
    });
    expect(ctx.tables.userSettings[0]).toMatchObject({ hasPremium: false });
  });

  it('revokes refunded purchases and restores access when a refund is reversed', async () => {
    const ctx = createDb({
      subscriptions: [subscription({ clerkId: 'user_refund' })],
      userSettings: [settings('user_refund', true)],
    });

    await callMutation(handleRefund, ctx, {
      clerkId: 'user_refund',
      eventId: 'evt_refund',
      eventTimestamp: FIXED_NOW + 1,
      eventType: 'REFUND',
      productId: 'chain_day_monthly',
    });

    expect(ctx.tables.subscriptions[0]).toMatchObject({
      lastWebhookEventId: 'evt_refund',
      status: 'expired',
    });
    expect(ctx.tables.userSettings[0]).toMatchObject({ hasPremium: false });

    await callMutation(handleRefund, ctx, {
      clerkId: 'user_refund',
      eventId: 'evt_refund_reversed',
      eventTimestamp: FIXED_NOW + 2,
      eventType: 'REFUND_REVERSED',
      expiresAt: FIXED_NOW + 86_400_000,
      isTrialing: false,
      productId: 'chain_day_monthly',
    });

    expect(ctx.tables.subscriptions[0]).toMatchObject({
      lastWebhookEventId: 'evt_refund_reversed',
      status: 'active',
    });
    expect(ctx.tables.userSettings[0]).toMatchObject({ hasPremium: true });
  });

  it('transfers premium away from source ids and grants destination ids', async () => {
    const ctx = createDb({
      subscriptions: [subscription({ clerkId: 'user_source' })],
      userSettings: [
        settings('user_destination', false),
        settings('user_source', true),
      ],
    });

    await callMutation(transferPremium, ctx, {
      clerkId: 'user_destination',
      eventId: 'evt_transfer',
      eventTimestamp: FIXED_NOW + 1,
      transferredFrom: ['user_source'],
      transferredTo: ['user_destination'],
    });

    expect(
      ctx.tables.subscriptions.find((row) => row.clerkId === 'user_source')
    ).toMatchObject({
      lastWebhookEventId: 'evt_transfer',
      status: 'expired',
    });
    expect(
      ctx.tables.subscriptions.find(
        (row) => row.clerkId === 'user_destination'
      )
    ).toMatchObject({
      lastWebhookEventId: 'evt_transfer',
      status: 'active',
    });
    expect(
      ctx.tables.userSettings.find((row) => row.userId === 'user_source')
    ).toMatchObject({ hasPremium: false });
    expect(
      ctx.tables.userSettings.find((row) => row.userId === 'user_destination')
    ).toMatchObject({ hasPremium: true });
  });

  it('does not trust client-writable userSettings.hasPremium for premium gates', async () => {
    const ctx = createDb({
      userSettings: [settings('user_settings_only', true)],
    });

    await expect(
      hasPremiumAccess(ctx as never, 'user_settings_only')
    ).resolves.toBe(false);

    expect(ctx.db.query).toHaveBeenCalledWith('subscriptions');
    expect(ctx.db.query).not.toHaveBeenCalledWith('userSettings');
  });
});
