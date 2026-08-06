/**
 * Alert presentation for actions blocked by the free tier.
 *
 * A capped free user who taps "restore" is not looking at a transient failure,
 * so the generic "…please try again" alert sends them round a loop that can
 * never succeed. These helpers separate the two cases: an entitlement block
 * gets the server's explanatory copy under an upgrade-shaped title, everything
 * else keeps the retry framing.
 */

import { Alert } from 'react-native';
import { isPremiumRequiredError } from './freeTier';

const PREMIUM_ALERT_TITLE = 'Upgrade for unlimited habits';

/** Strip the machine-readable prefix so the user sees only the explanation. */
function readableMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) return fallback;
  const [, explanation] = error.message.split(/PREMIUM_REQUIRED:\s*/);
  return explanation?.trim() || fallback;
}

/**
 * Show the right alert for a failed action.
 *
 * @param error - The thrown value.
 * @param fallbackMessage - Copy for ordinary, retryable failures.
 * @param onUpgrade - Optional handler that opens the paywall. When provided, an
 *   "Upgrade" button is offered alongside "Not now".
 */
export function alertPremiumOrError(
  error: unknown,
  fallbackMessage: string,
  onUpgrade?: () => void
): void {
  if (!isPremiumRequiredError(error)) {
    Alert.alert('Error', fallbackMessage);
    return;
  }

  const message = readableMessage(
    error,
    'Your free plan is full. Upgrade for unlimited habits.'
  );

  if (!onUpgrade) {
    Alert.alert(PREMIUM_ALERT_TITLE, message);
    return;
  }

  Alert.alert(PREMIUM_ALERT_TITLE, message, [
    { style: 'cancel', text: 'Not now' },
    { onPress: onUpgrade, text: 'Upgrade' },
  ]);
}
