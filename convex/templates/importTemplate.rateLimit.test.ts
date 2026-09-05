import type { Id } from '../_generated/dataModel';
import { enforceRateLimit } from '../lib/rateLimit';
import { importTemplate } from './importTemplate';

jest.mock('../lib/rateLimit', () => ({
  enforceRateLimit: jest.fn(),
}));

const enforce = enforceRateLimit as jest.Mock;
const templateId = 'template_1' as Id<'templates'>;

function createCtx() {
  const insert = jest.fn(async (table: string) =>
    table === 'habits' ? 'habit_1' : 'usage_1'
  );
  return {
    auth: { getUserIdentity: jest.fn(async () => ({ subject: 'user_1' })) },
    db: {
      get: jest.fn(async () => ({
        _id: templateId,
        category: 'creativity',
        createdAt: 1,
        description: 'desc',
        frequency: 'daily',
        icon: '✍️',
        iconColor: '#7C3AED',
        name: 'Creative Writing',
        scientificReference: 'ref',
      })),
      insert,
      query: jest.fn(() => ({
        withIndex: jest.fn(() => ({
          collect: jest.fn(async () => []),
          first: jest.fn(async () => null),
        })),
      })),
    },
  };
}

function run(ctx: ReturnType<typeof createCtx>) {
  const handler = (
    importTemplate as unknown as {
      _handler: (
        c: unknown,
        a: { templateId: Id<'templates'> }
      ) => Promise<unknown>;
    }
  )._handler;
  return handler(ctx, { templateId });
}

describe('importTemplate rate limiting', () => {
  beforeEach(() => enforce.mockReset());

  it('shares the habit.create budget', async () => {
    await run(createCtx());
    expect(enforce).toHaveBeenCalledWith(
      expect.anything(),
      'user_1',
      'habit.create'
    );
  });

  it('does not insert a habit when the budget is exhausted', async () => {
    enforce.mockRejectedValueOnce(new Error('Too many requests'));
    const ctx = createCtx();
    await expect(run(ctx)).rejects.toThrow('Too many requests');
    expect(ctx.db.insert).not.toHaveBeenCalledWith('habits', expect.anything());
  });
});
