/** PremiumStatus.helpers — subscription management link + upsell gradient */
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

/** Premium gradient uses custom indigo/violet tones on a non-semantic surface */
export function getUpsellGradient(
  isDark: boolean
): readonly [string, string, string] {
  return isDark
    ? (['#2e1f5e', '#1e1b4b', '#312e81'] as const)
    : (['#8b5cf6', '#6366f1', '#818cf8'] as const);
}
