import { Alert } from 'react-native';

export function showPurchaseFailure(): void {
  Alert.alert(
    'Purchase Failed',
    'Please check your payment method and try again.',
    [{ text: 'OK' }]
  );
}

export function showRestoreFailure(): void {
  Alert.alert('Restore Failed', 'Please try again or contact support.', [
    { text: 'OK' },
  ]);
}

export function showNoPurchasesFound(): void {
  Alert.alert(
    'No Purchases Found',
    'We couldn\u2019t find any previous purchases.',
    [{ text: 'OK' }]
  );
}

export function showRestoreSuccess(onConfirm: () => void): void {
  Alert.alert('Purchases Restored', 'Your premium access has been restored!', [
    { onPress: onConfirm, text: 'Great!' },
  ]);
}
