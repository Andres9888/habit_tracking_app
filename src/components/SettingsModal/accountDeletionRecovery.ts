/**
 * Durable client-side recovery state for the cross-provider account deletion
 * workflow. Convex data and the Clerk identity cannot be deleted atomically,
 * so this marker makes the identity-removal retry explicit after app data has
 * already been erased.
 */
import {
  safeGetItem,
  safeRemoveItem,
  safeSetItem,
} from '../../utils/storage';

const ACCOUNT_DELETION_RECOVERY_KEY = '@chainday/account-deletion-recovery-v1';

interface AccountDeletionRecovery {
  clerkUserId: string;
  appDataDeleted: boolean;
}

function isAccountDeletionRecovery(
  value: unknown
): value is AccountDeletionRecovery {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.clerkUserId === 'string' &&
    candidate.clerkUserId.length > 0 &&
    candidate.appDataDeleted === true
  );
}

export async function needsIdentityDeletionRecovery(
  clerkUserId: string | undefined
): Promise<boolean> {
  if (!clerkUserId) return false;

  const recovery = await safeGetItem<AccountDeletionRecovery | null>(
    ACCOUNT_DELETION_RECOVERY_KEY,
    isAccountDeletionRecovery,
    null
  );

  return recovery?.clerkUserId === clerkUserId && recovery.appDataDeleted;
}

/** Persist before deleting data so retry state survives an app restart. */
export async function markAppDataDeletedForAccount(
  clerkUserId: string
): Promise<void> {
  await safeSetItem(ACCOUNT_DELETION_RECOVERY_KEY, {
    appDataDeleted: true,
    clerkUserId,
  });
}

export async function clearAccountDeletionRecovery(): Promise<void> {
  await safeRemoveItem(ACCOUNT_DELETION_RECOVERY_KEY);
}
