/**
 * Account section for settings modal
 */

import React, { useState, useCallback } from 'react';
import { Alert, Linking, Platform, Share } from 'react-native';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { AccountInfo, AppActions, LegalLinks } from './sections';
import { PremiumStatus } from './sections/PremiumStatus';

const APP_STORE_URL = 'https://apps.apple.com/app/chain-day';
const WHATS_NEW_URL = 'https://andres9888.github.io/chainday-landing/changelog.html';
const SUPPORT_EMAIL = 'support@chainday.app';
const PRIVACY_URL =
  'https://andres9888.github.io/chainday-landing/privacy.html';
const TERMS_URL = 'https://andres9888.github.io/chainday-landing/terms.html';

interface AccountSectionProps {
  isHighContrastActive: boolean;
  isPremium?: boolean;
  onPremiumUpsell?: () => void;
}

export function AccountSection({ isHighContrastActive, isPremium = false, onPremiumUpsell }: AccountSectionProps) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { style: 'cancel', text: 'Cancel' },
      {
        onPress: () => {
          setIsSigningOut(true);
          void signOut()
            .catch(() => Alert.alert('Error', 'Failed to sign out.'))
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
      void Linking.openURL(APP_STORE_URL);
    })();
  }, []);

  const handleShare = useCallback(() => {
    void Share.share({
      message: Platform.select({
        default: `I'm building better habits with Chain Day 🔗⛓️ — a simple app that turns daily consistency into visible streaks. Try it free!\n\n${APP_STORE_URL}`,
        ios: `I'm building better habits with Chain Day 🔗⛓️ — a simple app that turns daily consistency into visible streaks. Try it free!\n\n${APP_STORE_URL}`,
      }),
      title: 'Chain Day — Build Better Habits',
      url: Platform.OS === 'ios' ? APP_STORE_URL : undefined,
    });
  }, []);

  const openUrl = useCallback(
    (url: string) => () => void Linking.openURL(url),
    []
  );

  const handleWhatsNew = useCallback(
    () => void Linking.openURL(WHATS_NEW_URL),
    []
  );

  return (
    <>
      <PremiumStatus
        highContrast={isHighContrastActive}
        isPremium={isPremium}
        onUpgrade={onPremiumUpsell}
      />
      <AccountInfo
        email={userEmail}
        highContrast={isHighContrastActive}
        isLoading={isSigningOut}
        onSignOut={handleSignOut}
      />
      <AppActions
        highContrast={isHighContrastActive}
        onRate={handleRateApp}
        onShare={handleShare}
        onSupport={openUrl(`mailto:${SUPPORT_EMAIL}?subject=Chain Day`)}
        onWhatsNew={handleWhatsNew}
      />
      <LegalLinks
        highContrast={isHighContrastActive}
        onPrivacy={openUrl(PRIVACY_URL)}
        onTerms={openUrl(TERMS_URL)}
      />
    </>
  );
}
