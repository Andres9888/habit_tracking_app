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

/** Premium upsell gradient — warm amber tones matching the PRO badge language */
export function getUpsellGradient(
  isDark: boolean
): readonly [string, string, string] {
  return isDark
    ? (['#4A340A', '#3A2806', '#4A340A'] as const)
    : (['#F59E0B', '#D97706', '#B45309'] as const);
}
