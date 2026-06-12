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
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all your data. This action cannot be undone.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            setIsDeletingAccount(true);
            void (async () => {
              try {
                await deleteCurrentUserData({});
                await user?.delete();
              } catch {
                Alert.alert(
                  'Error',
                  'Failed to delete account. Please try again.'
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
  }, [deleteCurrentUserData, user]);

  return {
    isSigningOut,
    isDeletingAccount,
    handleSignOut,
    handleDeleteAccount,
  };
}
