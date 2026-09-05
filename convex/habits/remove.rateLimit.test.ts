import { enforceRateLimit } from '../lib/rateLimit';
import { remove, restore } from './remove';

jest.mock('../lib/rateLimit', () => ({ enforceRateLimit: jest.fn() }));
jest.mock('./removePayload', () => ({
  buildRemovedHabitPayload: () => ({}),
}));

const enforce = enforceRateLimit as jest.Mock;
const run = <A>(fn: unknown, ctx: unknown, args: A) =>
  (fn as { _handler: (c: unknown, a: A) => Promise<unknown> })._handler(
    ctx,
    args
  );
const auth = { getUserIdentity: async () => ({ subject: 'user_1' }) };

beforeEach(() => enforce.mockReset());

it('remove consumes the lifecycle budget before touching data', async () => {
  enforce.mockRejectedValueOnce(new Error('Too many requests'));
  const del = jest.fn();
  const ctx = {
    auth,
    db: { delete: del, get: async () => ({ _id: 'h1', userId: 'user_1' }) },
  };
  await expect(run(remove, ctx, { habitId: 'h1' })).rejects.toThrow(
    'Too many requests'
  );
  expect(enforce).toHaveBeenCalledWith(ctx, 'user_1', 'habit.lifecycle');
  expect(del).not.toHaveBeenCalled();
});

it('restore consumes the lifecycle budget before re-inserting', async () => {
  enforce.mockRejectedValueOnce(new Error('Too many requests'));
  const insert = jest.fn();
  const ctx = {
    auth,
    db: {
      delete: jest.fn(),
      get: async () => ({
        _id: 'd1',
        expiresAt: Date.now() + 60_000,
        payload: '{}',
        userId: 'user_1',
      }),
      insert,
    },
  };
  await expect(run(restore, ctx, { deletedHabitId: 'd1' })).rejects.toThrow(
    'Too many requests'
  );
  expect(enforce).toHaveBeenCalledWith(ctx, 'user_1', 'habit.lifecycle');
  expect(insert).not.toHaveBeenCalled();
});
