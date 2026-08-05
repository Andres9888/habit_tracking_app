import type { Id } from './_generated/dataModel';
import { purgeUnclaimedUploads } from './crons';

type StorageId = Id<'_storage'>;

type StorageFile = {
  _creationTime: number;
  _id: StorageId;
  contentType?: string;
  sha256: string;
  size: number;
};

type OwnershipRecord = {
  _id: string;
  createdAt: number;
  storageId: StorageId;
  userId: string;
};

type UserRecord = {
  _id: string;
  clerkId?: string;
  profileImageStorageId?: StorageId;
};

const asStorageId = (value: string) => value as StorageId;

function extractIndexFilters(cb: (q: unknown) => unknown) {
  const filters: Array<{ field: string; value: unknown }> = [];
  const query = {
    eq: (field: string, value: unknown) => {
      filters.push({ field, value });
      return query;
    },
  };
  cb(query);
  return filters;
}

function createCronCtx({
  deleteError,
  files,
  ownership = [],
  users = [],
}: {
  deleteError?: Error;
  files: StorageFile[];
  ownership?: OwnershipRecord[];
  users?: UserRecord[];
}) {
  const state = {
    ownership: [...ownership],
    users: [...users],
  };

  const db = {
    delete: jest.fn(async (id: string) => {
      state.ownership = state.ownership.filter((record) => record._id !== id);
    }),
    insert: jest.fn(
      async (table: string, record: Omit<OwnershipRecord, '_id'>) => {
        const inserted = {
          _id: `${table}_${state.ownership.length + 1}`,
          ...record,
        };
        state.ownership.push(inserted);
        return inserted._id;
      }
    ),
    query: jest.fn((table: string) => ({
      withIndex: jest.fn((_indexName: string, cb: (q: unknown) => unknown) => {
        const filters = extractIndexFilters(cb);
        const rows = () => {
          const candidates =
            table === 'storageOwnership'
              ? state.ownership
              : table === 'users'
                ? state.users
                : [];
          return candidates.filter((row) =>
            filters.every(
              ({ field, value }) =>
                (row as unknown as Record<string, unknown>)[field] === value
            )
          );
        };
        return {
          first: jest.fn(async () => rows()[0] ?? null),
          unique: jest.fn(async () => rows()[0] ?? null),
        };
      }),
    })),
    system: {
      query: jest.fn(() => ({
        filter: jest.fn(() => ({
          take: jest.fn(async () => files),
        })),
      })),
    },
  };

  const ctx = {
    db,
    storage: {
      delete: jest.fn(async () => {
        if (deleteError) throw deleteError;
      }),
    },
  };

  return { ...ctx, state };
}

function storageFile(storageId: StorageId): StorageFile {
  return {
    _creationTime: 0,
    _id: storageId,
    contentType: 'image/jpeg',
    sha256: 'hash',
    size: 1024,
  };
}

function getHandler() {
  return (
    purgeUnclaimedUploads as unknown as {
      _handler: (
        ctx: ReturnType<typeof createCronCtx>,
        args: Record<string, never>
      ) => Promise<{ backfilled: number; deleted: number; scanned: number }>;
    }
  )._handler;
}

describe('stale upload retention', () => {
  it('deletes stale claimed uploads that were never attached', async () => {
    const storageId = asStorageId('stale_claimed');
    const ctx = createCronCtx({
      files: [storageFile(storageId)],
      ownership: [
        {
          _id: 'ownership_1',
          createdAt: 0,
          storageId,
          userId: 'user_a',
        },
      ],
    });

    await expect(getHandler()(ctx, {})).resolves.toEqual({
      backfilled: 0,
      deleted: 1,
      scanned: 1,
    });
    expect(ctx.storage.delete).toHaveBeenCalledWith(storageId);
    expect(ctx.state.ownership).toEqual([]);
  });

  it('preserves attached legacy images and backfills ownership', async () => {
    const storageId = asStorageId('legacy_profile');
    const ctx = createCronCtx({
      files: [storageFile(storageId)],
      users: [
        {
          _id: 'user_1',
          clerkId: 'user_a',
          profileImageStorageId: storageId,
        },
      ],
    });

    await expect(getHandler()(ctx, {})).resolves.toEqual({
      backfilled: 1,
      deleted: 0,
      scanned: 1,
    });
    expect(ctx.storage.delete).not.toHaveBeenCalled();
    expect(ctx.state.ownership).toEqual([
      expect.objectContaining({ storageId, userId: 'user_a' }),
    ]);
  });

  it('retains ownership when blob deletion fails so cleanup can retry', async () => {
    const storageId = asStorageId('retry_claimed');
    const ownership = {
      _id: 'ownership_1',
      createdAt: 0,
      storageId,
      userId: 'user_a',
    };
    const ctx = createCronCtx({
      deleteError: new Error('transient storage failure'),
      files: [storageFile(storageId)],
      ownership: [ownership],
    });

    await expect(getHandler()(ctx, {})).resolves.toEqual({
      backfilled: 0,
      deleted: 0,
      scanned: 1,
    });
    expect(ctx.state.ownership).toEqual([ownership]);
  });
});
