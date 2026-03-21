/* eslint-disable max-lines */
/** useAccountActions — Extracted account handlers from AccountSection */
import { useState, useCallback } from 'react';
import { Alert, Linking, Platform, Share } from 'react-native';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { ERROR_MESSAGES, EXTERNAL_URLS } from '../../constants';

export function useAccountActions() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { style: 'cancel', text: 'Cancel' },
      {
        onPress: () => {
          setIsSigningOut(true);
          void signOut()
            .catch(() => Alert.alert('Error', ERROR_MESSAGES.AUTH.SIGN_OUT_FAILED))
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
                await user?.delete();
              } catch {
                Alert.alert('Error', 'Failed to delete account. Please try again.');
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
  }, [user]);

  const handleRateApp = useCallback(() => {
    void (async () => {
      if (Platform.OS === 'ios') {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const StoreReview = require('expo-store-review') as {
            hasAction: () => Promise<boolean>;
            requestReview: () => Promise<void>;
          };
          if (await StoreReview.hasAction()) {
            await StoreReview.requestReview();
            return;
          }
        } catch {
          // Fall through
        }
      }
      void Linking.openURL(EXTERNAL_URLS.APP_STORE);
    })();
  }, []);

  const handleShare = useCallback(() => {
    void Share.share({
      message: Platform.select({
        default: `I'm building better habits with Chain Day — a simple app that turns daily consistency into visible streaks. Try it free!\n\n${EXTERNAL_URLS.APP_STORE}`,
        ios: `I'm building better habits with Chain Day — a simple app that turns daily consistency into visible streaks. Try it free!\n\n${EXTERNAL_URLS.APP_STORE}`,
      }),
      title: 'Chain Day — Build Better Habits',
      url: Platform.OS === 'ios' ? EXTERNAL_URLS.APP_STORE : undefined,
    });
  }, []);

  const handleFeedback = useCallback(() => setShowFeedbackModal(true), []);
  const closeFeedback = useCallback(() => setShowFeedbackModal(false), []);

  const handleWhatsNew = useCallback(
    () => void Linking.openURL(EXTERNAL_URLS.CHANGELOG),
    []
  );

  const openUrl = useCallback(
    (url: string) => () => void Linking.openURL(url),
    []
  );

  return {
    isSigningOut,
    isDeletingAccount,
    showFeedbackModal,
    closeFeedback,
    handleSignOut,
    handleDeleteAccount,
    handleRateApp,
    handleShare,
    handleFeedback,
    handleWhatsNew,
    openPrivacy: openUrl(EXTERNAL_URLS.PRIVACY),
    openTerms: openUrl(EXTERNAL_URLS.TERMS),
  };
}
