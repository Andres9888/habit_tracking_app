/** useAccountDangerActions — sign-out and account-deletion flows */
import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ERROR_MESSAGES } from '../../constants';
import {
  clearAccountDeletionRecovery,
  markAppDataDeletedForAccount,
  needsIdentityDeletionRecovery,
} from './accountDeletionRecovery';

export function useAccountDangerActions() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const deleteCurrentUserData = useMutation(api.users.deleteCurrentUserData);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [needsIdentityCleanup, setNeedsIdentityCleanup] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void needsIdentityDeletionRecovery(user?.id).then((needsRecovery) => {
      if (!cancelled) setNeedsIdentityCleanup(needsRecovery);
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { style: 'cancel', text: 'Cancel' },
      {
        onPress: () => {
          setIsSigningOut(true);
          void signOut()
            .catch(() =>
              Alert.alert('Error', ERROR_MESSAGES.AUTH.SIGN_OUT_FAILED)
            )
            .finally(() => setIsSigningOut(false));
        },
        style: 'destructive',
        text: 'Sign Out',
      },
    ]);
  }, [signOut]);

  const handleDeleteAccount = useCallback(() => {
    const isFinishingDeletion = needsIdentityCleanup;
    Alert.alert(
      isFinishingDeletion ? 'Finish Deleting Account' : 'Delete Account',
      isFinishingDeletion
        ? 'Your Chain Day data was removed. Finish removing your sign-in account?'
        : 'This will permanently delete your account and all your data. This action cannot be undone.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            setIsDeletingAccount(true);
            void (async () => {
              let appDataDeletionConfirmed = false;

              try {
                if (!user) {
                  throw new Error('No signed-in user');
                }

                // Always replay the server-side purge before removing the
                // Clerk identity. The mutation is idempotent, which makes a
                // retry safe on another device or after local storage clears.
                await deleteCurrentUserData({});
                await markAppDataDeletedForAccount(user.id);
                appDataDeletionConfirmed = true;
                setNeedsIdentityCleanup(true);

                await user.delete();
                await clearAccountDeletionRecovery();
                setNeedsIdentityCleanup(false);
              } catch {
                Alert.alert(
                  appDataDeletionConfirmed || needsIdentityCleanup
                    ? 'Finish account deletion'
                    : 'Failed to delete account',
                  appDataDeletionConfirmed || needsIdentityCleanup
                    ? 'Your Chain Day data was removed, but we could not remove your sign-in account. Tap “Finish deleting account” to retry.'
                    : 'Failed to delete account. Please try again.'
                );
              } finally {
                setIsDeletingAccount(false);
              }
            })();
          },
          style: 'destructive',
          text: 'Delete',
        },
      ]
    );
  }, [deleteCurrentUserData, needsIdentityCleanup, user]);

  return {
    isSigningOut,
    isDeletingAccount,
    needsIdentityCleanup,
    handleSignOut,
    handleDeleteAccount,
  };
}
