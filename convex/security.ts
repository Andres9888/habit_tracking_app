type AuthenticatedContext = {
  auth: {
    getUserIdentity: () => Promise<{
      subject?: string;
    } | null>;
  };
};

type ScalableAuthContext = AuthenticatedContext & {
  db: {
    get: (id: string) => Promise<{
      userId?: string;
      [key: string]: any;
    } | null>;
  };
};

export async function requireAuthenticatedUserId(
  ctx: AuthenticatedContext
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.subject) {
    throw new Error('Not authenticated');
  }
  return identity.subject;
}

export async function requireAuthenticatedUser(ctx: AuthenticatedContext): Promise<string> {
  return requireAuthenticatedUserId(ctx);
}

export async function requireOwnedDocumentById<T extends { userId?: string }>(
  docFetcher: (id: string) => Promise<T | null>,
  docId: string,
  currentUserId: string,
  resource: string
) {
  const doc = await docFetcher(docId);
  if (!doc) {
    throw new Error(`${resource} not found`);
  }

  assertOwnership(doc.userId, currentUserId, resource);
  return doc;
}

export function assertOwnership(
  recordUserId: string | undefined,
  userId: string,
  resource: string
): void {
  if (!recordUserId || recordUserId !== userId) {
    throw new Error(`Unauthorized: access to ${resource} denied`);
  }
}

export function assertUserIdFilter(
  requestedUserId: string | undefined,
  currentUserId: string
): string {
  if (requestedUserId && requestedUserId !== currentUserId) {
    throw new Error('Unauthorized: cannot access another user');
  }
  return currentUserId;
}

export async function requireOwnedHabit(
  ctx: ScalableAuthContext,
  habitId: string,
  userId: string
) {
  const habit = await ctx.db.get(habitId);
  if (!habit) {
    throw new Error('Habit not found');
  }
  assertOwnership(habit.userId, userId, 'habit');
  return habit;
}

export async function requireOwnedDoc<T extends { userId?: string }>(
  ctx: { db: { get: (id: string) => Promise<T | null> } },
  getDoc: (id: string) => Promise<T | null>,
  docId: string,
  userId: string,
  resource: string
) {
  const doc = await getDoc(docId);
  if (!doc) {
    throw new Error(`${resource} not found`);
  }
  assertOwnership(doc.userId, userId, resource);
  return doc;
}
