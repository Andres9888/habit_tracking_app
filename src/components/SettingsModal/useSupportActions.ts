/** useSupportActions — rate, share, feedback, changelog, and legal links */
import { useState, useCallback } from 'react';
import { Alert, Linking, Platform, Share } from 'react-native';
import { EXTERNAL_URLS } from '../../constants';

const SHARE_MESSAGE = `I'm building better habits with Chain Day. It turns daily consistency into visible streaks. Try it free!\n\n${EXTERNAL_URLS.APP_STORE}`;

export function useSupportActions() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

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
      message: SHARE_MESSAGE,
      title: 'Chain Day',
      url: Platform.OS === 'ios' ? EXTERNAL_URLS.APP_STORE : undefined,
    });
  }, []);

  const handleLoveChainDay = useCallback(() => {
    Alert.alert('Love Chain Day?', 'Rate the app or share it with a friend.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: handleShare },
      { text: 'Rate', onPress: handleRateApp },
    ]);
  }, [handleRateApp, handleShare]);

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
    showFeedbackModal,
    closeFeedback,
    handleFeedback,
    handleLoveChainDay,
    handleRateApp,
    handleShare,
    handleWhatsNew,
    openPrivacy: openUrl(EXTERNAL_URLS.PRIVACY),
    openTerms: openUrl(EXTERNAL_URLS.TERMS),
  };
}
