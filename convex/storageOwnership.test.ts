import type { Id } from './_generated/dataModel';
import { validateImageUpload } from './storage';
import { deleteCurrentUserData } from './users';
import { clearProfileImage, updateProfileImage } from './usersProfileImage';

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
  _creationTime: number;
  _id: StorageId;
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

function extractEqFilter(cb: (q: unknown) => unknown) {
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

function collectRows(
  table: string,
  filters: Array<{ field: string; value: unknown }>,
  state: { ownership: OwnershipRecord[]; users: UserRecord[] }
) {
  const rows =
    table === 'storageOwnership'
      ? state.ownership
      : table === 'users'
        ? state.users
        : [];

  return rows.filter((row) =>
    filters.every(
      ({ field, value }) =>
        (row as unknown as Record<string, unknown>)[field] === value
    )
  );
}

function createCtx({
  deleteError,
  metadata = {},
  ownership = [],
  userId = 'user_a',
  users = [],
  urls = {},
}: {
  deleteError?: Error;
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
      if (user) Object.assign(user, patch);
    }),
    query: jest.fn((table: string) => ({
      withIndex: jest.fn((_indexName: string, cb: (q: unknown) => unknown) => {
        const filters = extractEqFilter(cb);
        const rows = () => collectRows(table, filters, state);
        return {
          collect: jest.fn(async () => rows()),
          first: jest.fn(async () => rows()[0] ?? null),
          take: jest.fn(async (count: number) => rows().slice(0, count)),
          unique: jest.fn(async () => rows()[0] ?? null),
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
      delete: jest.fn(async () => {
        if (deleteError) throw deleteError;
      }),
      getUrl: jest.fn(async (storageId: StorageId) => urls[storageId] ?? null),
    },
  };

  return { ...ctx, state };
}

function imageMetadata(
  storageId: StorageId,
  contentType = 'image/png'
): StorageMetadata {
  return {
    _creationTime: Date.now(),
    _id: storageId,
    contentType,
    sha256: 'hash',
    size: 1024,
  };
}

describe('storage ownership flows', () => {
  it('rejects cross-user storage reuse before metadata is trusted', async () => {
    const storageId = asStorageId('storage_already_claimed');
    const ctx = createCtx({
      metadata: { [storageId]: imageMetadata(storageId) },
      ownership: [{ _id: 'ownership_1', storageId, userId: 'user_b' }],
    });

    await expect(
      getHandler(validateImageUpload)(ctx, { storageId })
    ).rejects.toThrow('Not authorized to use this uploaded file');

    expect(ctx.db.system.get).not.toHaveBeenCalled();
    expect(ctx.storage.delete).not.toHaveBeenCalled();
  });

  it('commits invalid-upload deletion and ownership release via a failure result', async () => {
    const storageId = asStorageId('storage_pdf');
    const ctx = createCtx({
      metadata: {
        [storageId]: imageMetadata(storageId, 'application/pdf'),
      },
      ownership: [{ _id: 'ownership_1', storageId, userId: 'user_a' }],
    });

    await expect(
      getHandler(validateImageUpload)(ctx, { storageId })
    ).resolves.toEqual({
      error: 'Unsupported image format. Use JPEG, PNG, WebP, or HEIC.',
      ok: false,
    });

    expect(ctx.storage.delete).toHaveBeenCalledWith(storageId);
    expect(ctx.state.ownership).toEqual([]);
  });

  it('rejects excess validated uploads and deletes the unclaimed blob', async () => {
    const storageId = asStorageId('storage_over_quota');
    const ownership = Array.from({ length: 5 }, (_, index) => ({
      _id: `ownership_${index}`,
      storageId: asStorageId(`owned_${index}`),
      userId: 'user_a',
    }));
    const ctx = createCtx({
      metadata: { [storageId]: imageMetadata(storageId) },
      ownership,
    });

    await expect(
      getHandler(validateImageUpload)(ctx, { storageId })
    ).resolves.toEqual({
      error: 'Upload limit reached. Remove an existing image and try again.',
      ok: false,
    });

    expect(ctx.storage.delete).toHaveBeenCalledWith(storageId);
    expect(ctx.db.insert).not.toHaveBeenCalled();
  });

  it('reattaches the current profile image without deleting its blob', async () => {
    const storageId = asStorageId('storage_current_profile');
    const ctx = createCtx({
      metadata: { [storageId]: imageMetadata(storageId, 'image/jpeg') },
      ownership: [{ _id: 'ownership_1', storageId, userId: 'user_a' }],
      urls: { [storageId]: 'https://files.example/current.jpg' },
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
    ).resolves.toEqual({
      imageUrl: 'https://files.example/current.jpg',
      ok: true,
    });

    expect(ctx.storage.delete).not.toHaveBeenCalled();
    expect(ctx.state.ownership).toHaveLength(1);
  });

  it('releases ownership even when an already-missing blob cannot be deleted', async () => {
    const storageId = asStorageId('storage_missing');
    const ctx = createCtx({
      deleteError: new Error('already missing'),
      ownership: [{ _id: 'ownership_1', storageId, userId: 'user_a' }],
      users: [
        {
          _id: 'user_doc_1',
          clerkId: 'user_a',
          profileImageStorageId: storageId,
        },
      ],
    });

    await expect(getHandler(clearProfileImage)(ctx, {})).resolves.toEqual({
      cleared: true,
    });

    expect(ctx.state.ownership).toEqual([]);
  });

  it('deletes account-owned blobs and ownership rows', async () => {
    const storageId = asStorageId('storage_profile');
    const ctx = createCtx({
      ownership: [{ _id: 'ownership_1', storageId, userId: 'user_a' }],
      users: [
        {
          _id: 'user_doc_1',
          clerkId: 'user_a',
          profileImageStorageId: storageId,
        },
      ],
    });

    await expect(
      getHandler(deleteCurrentUserData)(ctx, {})
    ).resolves.toMatchObject({ deletedUsers: 1 });

    expect(ctx.storage.delete).toHaveBeenCalledWith(storageId);
    expect(ctx.state.ownership).toEqual([]);
  });
});
