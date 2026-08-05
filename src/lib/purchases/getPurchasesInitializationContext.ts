import { Platform } from 'react-native';

import { API_KEYS, getPurchasesClient, isExpoGo, state } from './client';

interface PurchasesInitializationContext {
  apiKey: string;
  client: NonNullable<ReturnType<typeof getPurchasesClient>>;
}

function getPurchasesApiKey(): string {
  return Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.mobile;
}

function logExpoGoSkip(): void {
  if (__DEV__) {
    console.log('[Purchases] Expo Go detected - native stores unavailable, skipping');
  }
}

function logMissingApiKey(): void {
  if (__DEV__) {
    console.warn('[Purchases] No API key configured for platform:', Platform.OS);
  }
}

function setVerboseLogLevel(
  client: NonNullable<ReturnType<typeof getPurchasesClient>>
): void {
  if (__DEV__ && state.module?.LOG_LEVEL?.VERBOSE !== undefined) {
    client.setLogLevel(state.module.LOG_LEVEL.VERBOSE);
  }
}

export function getPurchasesInitializationContext():
  | PurchasesInitializationContext
  | null {
  if (Platform.OS === 'web') {
    return null;
  }

  if (isExpoGo()) {
    logExpoGoSkip();
    return null;
  }

  const client = getPurchasesClient();
  if (!client) {
    return null;
  }

  const apiKey = getPurchasesApiKey();
  if (!apiKey) {
    logMissingApiKey();
    return null;
  }

  setVerboseLogLevel(client);

  return { apiKey, client };
}
