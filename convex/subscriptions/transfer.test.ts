import { transferPremium } from './transfer';

type Row = Record<string, unknown> & { _id: string };
function fakeDb(seed: Record<string, Row[]> = {}) {
  const tables: Record<string, Row[]> = { ...seed };
  let n = 0;
  const rows = (t: string) => (tables[t] ??= []);
  const db = {
    get: async (id: string) =>
      Object.values(tables)
        .flat()
        .find((r) => r._id === id) ?? null,
    insert: async (t: string, doc: Record<string, unknown>) => {
      const _id = `${t}_${++n}`;
      rows(t).push({ ...doc, _id });
      return _id;
    },
    patch: async (id: string, fields: Record<string, unknown>) => {
      const row = await db.get(id);
      if (row) Object.assign(row, fields);
    },
    query: (t: string) => ({
      withIndex: (_i: string, cb: (q: unknown) => unknown) => {
        const filters: [string, unknown][] = [];
        const q = { eq: (k: string, v: unknown) => (filters.push([k, v]), q) };
        cb(q);
        const match = () =>
          rows(t).filter((r) => filters.every(([k, v]) => r[k] === v));
        return {
          collect: async () => match(),
          first: async () => match()[0] ?? null,
        };
      },
    }),
  };
  return { db, tables };
}
const handlerOf = <A>(fn: unknown) =>
  (fn as { _handler: (ctx: unknown, args: A) => Promise<unknown> })._handler;

const user = (clerkId: string) => ({ _id: `u_${clerkId}`, clerkId });
const liveSub = (clerkId: string) => ({
  _id: `s_${clerkId}`,
  clerkId,
  createdAt: 1,
  expiresAt: Date.now() + 86_400_000,
  lastWebhookEventId: 'evt_0',
  lastWebhookEventTimestamp: 1_000,
  planType: 'monthly',
  productId: 'premium_monthly',
  startedAt: 1,
  status: 'active',
  updatedAt: 1,
});
const args = (over: Record<string, unknown> = {}) => ({
  eventId: 'evt_transfer',
  eventTimestamp: 2_000,
  fromClerkIds: ['old'],
  toClerkIds: ['new'],
  ...over,
});

describe('transferPremium', () => {
  it('moves a live subscription and flips hasPremium on both accounts', async () => {
    const { db, tables } = fakeDb({
      subscriptions: [liveSub('old')],
      userSettings: [{ _id: 'st_old', hasPremium: true, userId: 'old' }],
      users: [user('old'), user('new')],
    });
    await handlerOf(transferPremium)({ db }, args());

    expect(tables.subscriptions.find((s) => s.clerkId === 'old')).toMatchObject(
      {
        lastWebhookEventId: 'evt_transfer',
        status: 'expired',
      }
    );
    expect(tables.subscriptions.find((s) => s.clerkId === 'new')).toMatchObject(
      {
        planType: 'monthly',
        productId: 'premium_monthly',
        status: 'active',
      }
    );
    expect(
      tables.userSettings.find((s) => s.userId === 'old')?.hasPremium
    ).toBe(false);
    expect(
      tables.userSettings.find((s) => s.userId === 'new')?.hasPremium
    ).toBe(true);
  });

  it('ignores anonymous ids and never grants without a live source', async () => {
    const { db, tables } = fakeDb({
      subscriptions: [
        { ...liveSub('old'), expiresAt: Date.now() - 1, status: 'expired' },
      ],
      users: [user('old'), user('new')],
    });
    await handlerOf(transferPremium)(
      { db },
      args({
        fromClerkIds: ['old', '$RCAnonymousID:abc'],
        toClerkIds: ['new', 'ghost'],
      })
    );
    expect(tables.userSettings ?? []).not.toContainEqual(
      expect.objectContaining({ userId: '$RCAnonymousID:abc' })
    );
    expect(tables.userSettings ?? []).not.toContainEqual(
      expect.objectContaining({ userId: 'ghost' })
    );
    expect(
      tables.subscriptions.find((s) => s.clerkId === 'new')
    ).toBeUndefined();
    expect(
      tables.userSettings?.find((s) => s.userId === 'new')
    ).toBeUndefined();
  });

  it('is idempotent on redelivery of the same event', async () => {
    const { db, tables } = fakeDb({
      subscriptions: [liveSub('old')],
      users: [user('old'), user('new')],
    });
    await handlerOf(transferPremium)({ db }, args());
    const snapshot = JSON.stringify(tables);
    await handlerOf(transferPremium)({ db }, args());
    expect(JSON.stringify(tables)).toBe(snapshot);
  });
});
