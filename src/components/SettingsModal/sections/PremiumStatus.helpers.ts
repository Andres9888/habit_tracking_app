/** PremiumStatus.helpers — subscription management link */
import { Linking, Platform } from 'react-native';

const IOS_SUBSCRIPTIONS_URL = 'https://apps.apple.com/account/subscriptions';
const ANDROID_SUBSCRIPTIONS_URL =
  'https://play.google.com/store/account/subscriptions';

export function handleManageSubscription() {
  if (Platform.OS === 'ios') {
    void Linking.openURL(IOS_SUBSCRIPTIONS_URL);
  } else if (Platform.OS === 'android') {
    void Linking.openURL(ANDROID_SUBSCRIPTIONS_URL);
  }
}
