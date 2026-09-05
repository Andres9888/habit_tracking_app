import { grantPremium, revokePremium } from './subscriptions';

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

const settingsOf = (t: Record<string, Row[]>, id: string) =>
  t.userSettings?.find((s) => s.userId === id);

describe('grantPremium / revokePremium ordering', () => {
  it('records a purchase whose period already ended without turning premium on', async () => {
    const { db, tables } = fakeDb();
    await handlerOf(grantPremium)(
      { db },
      {
        clerkId: 'u1',
        eventId: 'evt_late',
        eventTimestamp: 1_000,
        eventType: 'INITIAL_PURCHASE',
        expiresAt: Date.now() - 60_000,
        productId: 'premium_monthly',
      }
    );
    expect(tables.subscriptions[0]).toMatchObject({ status: 'expired' });
    expect(settingsOf(tables, 'u1')?.hasPremium).toBe(false);
  });

  it('leaves a tombstone on EXPIRATION with no row so an older purchase cannot re-grant', async () => {
    const { db, tables } = fakeDb({
      userSettings: [{ _id: 'st', hasPremium: false, userId: 'u1' }],
    });
    await handlerOf(revokePremium)(
      { db },
      {
        clerkId: 'u1',
        eventId: 'evt_exp',
        eventTimestamp: 5_000,
        eventType: 'EXPIRATION',
      }
    );
    expect(tables.subscriptions[0]).toMatchObject({
      clerkId: 'u1',
      lastWebhookEventTimestamp: 5_000,
      status: 'expired',
    });

    await handlerOf(grantPremium)(
      { db },
      {
        clerkId: 'u1',
        eventId: 'evt_old_purchase',
        eventTimestamp: 4_000,
        eventType: 'INITIAL_PURCHASE',
        expiresAt: Date.now() + 86_400_000,
      }
    );
    expect(settingsOf(tables, 'u1')?.hasPremium).toBe(false);
    expect(tables.subscriptions).toHaveLength(1);
    expect(tables.subscriptions[0].status).toBe('expired');
  });
});
