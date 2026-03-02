/* eslint-disable max-lines */
/**
 * Account section for settings modal
 */

import React, { useState, useCallback } from 'react';
import { Alert, Linking, Platform, Share } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { AccountInfo, AppActions, LegalLinks } from './sections';
import { PremiumStatus } from './sections/PremiumStatus';
import { FeedbackModal } from '../FeedbackModal';
import { ERROR_MESSAGES, EXTERNAL_URLS } from '../../constants';

const stagger = (delay: number) => FadeInDown.delay(delay).springify().damping(18);

interface AccountSectionProps {
  isHighContrastActive: boolean;
  isPremium?: boolean;
  onPremiumUpsell?: () => void;
}

export function AccountSection({ isHighContrastActive, isPremium = false, onPremiumUpsell }: AccountSectionProps) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const userEmail = user?.primaryEmailAddress?.emailAddress;

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
                Alert.alert('Error', 'Failed to delete account. Please try again or contact support.');
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
        default: `I'm building better habits with Chain Day 🔗⛓️ — a simple app that turns daily consistency into visible streaks. Try it free!\n\n${EXTERNAL_URLS.APP_STORE}`,
        ios: `I'm building better habits with Chain Day 🔗⛓️ — a simple app that turns daily consistency into visible streaks. Try it free!\n\n${EXTERNAL_URLS.APP_STORE}`,
      }),
      title: 'Chain Day — Build Better Habits',
      url: Platform.OS === 'ios' ? EXTERNAL_URLS.APP_STORE : undefined,
    });
  }, []);

  const openUrl = useCallback(
    (url: string) => () => void Linking.openURL(url),
    []
  );

  const handleWhatsNew = useCallback(
    () => void Linking.openURL(EXTERNAL_URLS.CHANGELOG),
    []
  );

  const handleFeedback = useCallback(() => {
    setShowFeedbackModal(true);
  }, []);

  return (
    <>
      <Animated.View entering={stagger(0)}>
        <AccountInfo
          email={userEmail}
          highContrast={isHighContrastActive}
          isDeletingAccount={isDeletingAccount}
          isLoading={isSigningOut}
          onDeleteAccount={handleDeleteAccount}
          onSignOut={handleSignOut}
        />
      </Animated.View>
      <Animated.View entering={stagger(60)}>
        <PremiumStatus
          highContrast={isHighContrastActive}
          isPremium={isPremium}
          onUpgrade={onPremiumUpsell}
        />
      </Animated.View>
      <Animated.View entering={stagger(120)}>
        <AppActions
          highContrast={isHighContrastActive}
          onRate={handleRateApp}
          onShare={handleShare}
          onFeedback={handleFeedback}
          onWhatsNew={handleWhatsNew}
        />
      </Animated.View>
      <Animated.View entering={stagger(180)}>
        <LegalLinks
          highContrast={isHighContrastActive}
          onPrivacy={openUrl(EXTERNAL_URLS.PRIVACY)}
          onTerms={openUrl(EXTERNAL_URLS.TERMS)}
        />
      </Animated.View>
      <FeedbackModal
        visible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </>
  );
}
