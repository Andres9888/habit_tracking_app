import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import {
  findHabitByClientRequestId,
  validateClientRequestId,
} from './clientRequestId';

describe('validateClientRequestId', () => {
  it('accepts the generated identifier alphabet', () => {
    expect(validateClientRequestId('temp_habit_123-abc')).toBe(
      'temp_habit_123-abc'
    );
  });

  it('rejects empty, overlong, and punctuated identifiers', () => {
    expect(() => validateClientRequestId('')).toThrow(/invalid characters/);
    expect(() => validateClientRequestId('x'.repeat(65))).toThrow(
      /cannot exceed 64/
    );
    expect(() => validateClientRequestId('request:1')).toThrow(
      /invalid characters/
    );
  });
});

describe('findHabitByClientRequestId', () => {
  it('uses the compound user and request index', async () => {
    const existingId = 'habit_existing' as Id<'habits'>;
    const first = jest.fn().mockResolvedValue({ _id: existingId });
    const indexQuery = {
      eq: jest.fn().mockReturnThis(),
    };
    const withIndex = jest.fn(
      (_name: string, configure: (query: typeof indexQuery) => unknown) => {
        configure(indexQuery);
        return { first };
      }
    );
    const query = jest.fn().mockReturnValue({ withIndex });
    const ctx = { db: { query } } as unknown as MutationCtx;

    const existing = await findHabitByClientRequestId(
      ctx,
      'user_1',
      'request_1'
    );

    expect(query).toHaveBeenCalledWith('habits');
    expect(withIndex).toHaveBeenCalledWith(
      'by_userId_and_clientRequestId',
      expect.any(Function)
    );
    expect(indexQuery.eq).toHaveBeenNthCalledWith(1, 'userId', 'user_1');
    expect(indexQuery.eq).toHaveBeenNthCalledWith(
      2,
      'clientRequestId',
      'request_1'
    );
    expect(existing?._id).toBe(existingId);
  });
});
