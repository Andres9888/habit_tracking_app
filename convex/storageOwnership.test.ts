import type { Id } from './_generated/dataModel';
import { validateImageUpload } from './storage';
import { deleteCurrentUserData } from './users';
import { updateProfileImage } from './usersProfileImage';

jest.mock('./lib/rateLimit', () => ({
  enforceRateLimit: jest.fn(),
}));

type StorageId = Id<'_storage'>;

type OwnershipRecord = {
  _id: string;
  storageId: StorageId;
  userId: string;
};

type UserRecord = {
  _id: string;
  clerkId: string;
  imageUrl?: string;
  profileImageStorageId?: StorageId;
};

type StorageMetadata = {
  contentType?: string;
  sha256: string;
  size: number;
};

type TestCtx = ReturnType<typeof createCtx>;

const asStorageId = (value: string) => value as StorageId;

function getHandler<TArgs, TResult>(fn: unknown) {
  return (fn as { _handler: (ctx: TestCtx, args: TArgs) => Promise<TResult> })
    ._handler;
}

function createCtx({
  metadata = {},
  ownership = [],
  userId = 'user_a',
  users = [],
  urls = {},
}: {
  metadata?: Record<string, StorageMetadata | null>;
  ownership?: OwnershipRecord[];
  userId?: string;
  users?: UserRecord[];
  urls?: Record<string, string | null>;
} = {}) {
  const state = {
    ownership: [...ownership],
    users: [...users],
  };

  const db = {
    delete: jest.fn(async (id: string) => {
      state.ownership = state.ownership.filter((record) => record._id !== id);
      state.users = state.users.filter((record) => record._id !== id);
    }),
    insert: jest.fn(
      async (table: string, record: Omit<OwnershipRecord, '_id'>) => {
        if (table !== 'storageOwnership') return `${table}_new`;
        const inserted = {
          _id: `ownership_${state.ownership.length + 1}`,
          ...record,
        };
        state.ownership.push(inserted);
        return inserted._id;
      }
    ),
    patch: jest.fn(async (id: string, patch: Partial<UserRecord>) => {
      const user = state.users.find((record) => record._id === id);
      if (user) {
        Object.assign(user, patch);
      }
    }),
    query: jest.fn((table: string) => ({
      withIndex: jest.fn((_indexName: string, cb: (q: unknown) => unknown) => {
        const filter = extractEqFilter(cb);
        return {
          collect: jest.fn(async () => collectRows(table, filter, state)),
          unique: jest.fn(
            async () => collectRows(table, filter, state)[0] ?? null
          ),
        };
      }),
    })),
    system: {
      get: jest.fn(async (storageId: StorageId) => metadata[storageId] ?? null),
    },
  };

  const ctx = {
    auth: {
      getUserIdentity: jest.fn(async () => ({ subject: userId })),
    },
    db,
    storage: {
      delete: jest.fn(async () => undefined),
      getUrl: jest.fn(async (storageId: StorageId) => urls[storageId] ?? null),
    },
  };

  return { ...ctx, state };
}

function extractEqFilter(cb: (q: unknown) => unknown) {
  const filter: { field?: string; value?: unknown } = {};
  cb({
    eq: (field: string, value: unknown) => {
      filter.field = field;
      filter.value = value;
      return filter;
    },
  });
  return filter;
}

function collectRows(
  table: string,
  filter: { field?: string; value?: unknown },
  state: { ownership: OwnershipRecord[]; users: UserRecord[] }
) {
  const rows =
    table === 'storageOwnership'
      ? state.ownership
      : table === 'users'
        ? state.users
        : [];

  if (!filter.field) {
    return rows;
  }

  return rows.filter(
    (row) =>
      (row as unknown as Record<string, unknown>)[filter.field!] ===
      filter.value
  );
}

describe('storage ownership flows', () => {
  it('rejects cross-user storage reuse before metadata is trusted', async () => {
    const storageId = asStorageId('storage_already_claimed');
    const ctx = createCtx({
      metadata: {
        [storageId]: {
          contentType: 'image/png',
          sha256: 'hash',
          size: 1024,
        },
      },
      ownership: [{ _id: 'ownership_1', storageId, userId: 'user_b' }],
      userId: 'user_a',
    });

    await expect(
      getHandler(validateImageUpload)(ctx, { storageId })
    ).rejects.toThrow('Not authorized to use this uploaded file');

    expect(ctx.db.system.get).not.toHaveBeenCalled();
    expect(ctx.storage.delete).not.toHaveBeenCalled();
    expect(ctx.db.insert).not.toHaveBeenCalled();
  });

  it('deletes invalid uploaded metadata and releases the caller ownership row', async () => {
    const storageId = asStorageId('storage_pdf');
    const ctx = createCtx({
      metadata: {
        [storageId]: {
          contentType: 'application/pdf',
          sha256: 'hash',
          size: 1024,
        },
      },
      ownership: [{ _id: 'ownership_1', storageId, userId: 'user_a' }],
      userId: 'user_a',
    });

    await expect(
      getHandler(validateImageUpload)(ctx, { storageId })
    ).rejects.toThrow('Unsupported image format');

    expect(ctx.storage.delete).toHaveBeenCalledWith(storageId);
    expect(ctx.db.delete).toHaveBeenCalledWith('ownership_1');
    expect(ctx.state.ownership).toEqual([]);
  });

  it('reattaching the current profile image is a no-op for blob deletion', async () => {
    const storageId = asStorageId('storage_current_profile');
    const ctx = createCtx({
      metadata: {
        [storageId]: {
          contentType: 'image/jpeg',
          sha256: 'hash',
          size: 2048,
        },
      },
      ownership: [{ _id: 'ownership_1', storageId, userId: 'user_a' }],
      urls: { [storageId]: 'https://files.example/current.jpg' },
      userId: 'user_a',
      users: [
        {
          _id: 'user_doc_1',
          clerkId: 'user_a',
          imageUrl: 'https://files.example/current.jpg',
          profileImageStorageId: storageId,
        },
      ],
    });

    await expect(
      getHandler(updateProfileImage)(ctx, { storageId })
    ).resolves.toEqual({ imageUrl: 'https://files.example/current.jpg' });

    expect(ctx.storage.delete).not.toHaveBeenCalled();
    expect(ctx.db.delete).not.toHaveBeenCalledWith('ownership_1');
    expect(ctx.db.patch).toHaveBeenCalledWith('user_doc_1', {
      imageUrl: 'https://files.example/current.jpg',
      profileImageStorageId: storageId,
    });
  });

  it('account deletion removes owned storage rows and deletes every owned profile blob once', async () => {
    const profileStorageId = asStorageId('storage_profile');
    const orphanOwnedStorageId = asStorageId('storage_owned_orphan');
    const ctx = createCtx({
      ownership: [
        {
          _id: 'ownership_profile',
          storageId: profileStorageId,
          userId: 'user_a',
        },
        {
          _id: 'ownership_orphan',
          storageId: orphanOwnedStorageId,
          userId: 'user_a',
        },
        {
          _id: 'ownership_other_user',
          storageId: asStorageId('storage_other_user'),
          userId: 'user_b',
        },
      ],
      userId: 'user_a',
      users: [
        {
          _id: 'user_doc_1',
          clerkId: 'user_a',
          profileImageStorageId: profileStorageId,
        },
      ],
    });

    await expect(
      getHandler(deleteCurrentUserData)(ctx, {})
    ).resolves.toMatchObject({
      deletedUsers: 1,
    });

    expect(ctx.db.delete).toHaveBeenCalledWith('ownership_profile');
    expect(ctx.db.delete).toHaveBeenCalledWith('ownership_orphan');
    expect(ctx.db.delete).not.toHaveBeenCalledWith('ownership_other_user');
    expect(ctx.storage.delete).toHaveBeenCalledTimes(2);
    expect(ctx.storage.delete).toHaveBeenCalledWith(profileStorageId);
    expect(ctx.storage.delete).toHaveBeenCalledWith(orphanOwnedStorageId);
    expect(ctx.state.ownership).toEqual([
      {
        _id: 'ownership_other_user',
        storageId: asStorageId('storage_other_user'),
        userId: 'user_b',
      },
    ]);
  });
});
