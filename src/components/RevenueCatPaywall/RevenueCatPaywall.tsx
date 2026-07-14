import React from 'react';
import { Platform } from 'react-native';
import type { RevenueCatPaywallProps } from './types';
import { PaywallContent } from './PaywallContent';
import { WebFallback } from './WebFallback';

function noop() {
  // Default no-op callback for optional props.
}

function getPlatformOS(): string | undefined {
  const fallbackPlatform = (globalThis as { __reactNativePlatformOS?: string })
    .__reactNativePlatformOS;
  return (Platform as { OS?: string } | undefined)?.OS ?? fallbackPlatform;
}

export function RevenueCatPaywall(props: RevenueCatPaywallProps | undefined) {
  const { visible = false, onClose = noop, dismissible = true } = props ?? {};
  const platformOS = getPlatformOS();
  const isWebPlatform = platformOS
    ? platformOS === 'web'
    : 'window' in globalThis && 'document' in globalThis;
  const isPlatformLoaded = !!platformOS;

  if (__DEV__ && !isPlatformLoaded) {
    console.warn(
      '[RevenueCatPaywall] Platform.OS is undefined; using environment fallback.'
    );
  }

  if (isWebPlatform) {
    return (
      <WebFallback
        dismissible={dismissible}
        visible={visible}
        onClose={onClose}
      />
    );
  }

  if (!visible) return null;

  return (
    <PaywallContent
      visible={visible}
      onClose={onClose}
      onPurchaseSuccess={props?.onPurchaseSuccess}
      onRestoreSuccess={props?.onRestoreSuccess}
      dismissible={dismissible}
    />
  );
}
