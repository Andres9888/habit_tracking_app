import { deleteCurrentUserData } from './users';

it('keeps open throttle windows across account deletion and drops closed ones', async () => {
  const now = Date.now();
  const limits = [
    {
      _id: 'open',
      action: 'storage.generateUploadUrl',
      count: 10,
      userId: 'u',
      windowStartMs: now - 60_000,
    },
    {
      _id: 'closed',
      action: 'storage.generateUploadUrl',
      count: 10,
      userId: 'u',
      windowStartMs: now - 2 * 60 * 60_000,
    },
    {
      _id: 'unknown',
      action: 'retired.action',
      count: 1,
      userId: 'u',
      windowStartMs: now,
    },
  ];
  const deleted: string[] = [];
  const ctx = {
    auth: { getUserIdentity: async () => ({ subject: 'u' }) },
    db: {
      delete: async (id: string) => {
        deleted.push(id);
      },
      query: (table: string) => ({
        withIndex: (_i: string, cb: (q: unknown) => unknown) => {
          const q = { eq: () => q };
          cb(q);
          return {
            collect: async () => (table === 'rateLimits' ? limits : []),
          };
        },
      }),
    },
    storage: { delete: jest.fn() },
  };
  await (
    deleteCurrentUserData as unknown as {
      _handler: (c: unknown, a: object) => Promise<unknown>;
    }
  )._handler(ctx, {});
  expect(deleted.sort()).toEqual(['closed', 'unknown']);
});
