/** useAccountDangerActions — sign-out and account-deletion flows */
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ERROR_MESSAGES } from '../../constants';

export function useAccountDangerActions() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const deleteCurrentUserData = useMutation(api.users.deleteCurrentUserData);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isDeleteSheetOpen, setIsDeleteSheetOpen] = useState(false);
  const [deleteAcknowledged, setDeleteAcknowledged] = useState(false);

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

  const openDeleteSheet = useCallback(() => {
    setDeleteAcknowledged(false);
    setIsDeleteSheetOpen(true);
  }, []);

  const closeDeleteSheet = useCallback(() => {
    if (isDeletingAccount) return;
    setIsDeleteSheetOpen(false);
  }, [isDeletingAccount]);

  const confirmDeleteAccount = useCallback(() => {
    if (!deleteAcknowledged) return;
    setIsDeletingAccount(true);
    void (async () => {
      try {
        await deleteCurrentUserData({});
        await user?.delete();
        setIsDeleteSheetOpen(false);
      } catch {
        Alert.alert('Error', 'Failed to delete account. Please try again.');
      } finally {
        setIsDeletingAccount(false);
      }
    })();
  }, [deleteAcknowledged, deleteCurrentUserData, user]);

  return {
    isSigningOut,
    isDeletingAccount,
    handleSignOut,
    handleDeleteAccount: openDeleteSheet,
    isDeleteSheetOpen,
    closeDeleteSheet,
    deleteAcknowledged,
    setDeleteAcknowledged,
    confirmDeleteAccount,
  };
}
