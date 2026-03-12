/**
 * Purchases proxy — thin wrapper that delegates to the native RevenueCat SDK.
 * All methods throw if the SDK hasn't been initialized via initializePurchases().
 */

import type {
  CustomerInfoUpdateListener,
  PurchasesPackage,
} from 'react-native-purchases';
import type { PurchasesClient } from './client';
import { getPurchasesClient } from './client';

function unavailableError(method: string): Error {
  return new Error(`[Purchases] ${method} called before SDK initialization`);
}

function requireClient(method: string): PurchasesClient {
  const client = getPurchasesClient();
  if (!client) throw unavailableError(method);
  return client;
}

export const Purchases = {
  addCustomerInfoUpdateListener(listener: CustomerInfoUpdateListener): void {
    requireClient(
      'addCustomerInfoUpdateListener'
    ).addCustomerInfoUpdateListener(listener);
  },
  async getCustomerInfo() {
    return requireClient('getCustomerInfo').getCustomerInfo();
  },
  async getOfferings() {
    return requireClient('getOfferings').getOfferings();
  },
  async purchasePackage(pkg: PurchasesPackage) {
    return requireClient('purchasePackage').purchasePackage(pkg);
  },
  removeCustomerInfoUpdateListener(listener: CustomerInfoUpdateListener): void {
    const client = getPurchasesClient();
    if (!client) return;
    client.removeCustomerInfoUpdateListener(listener);
  },
  async restorePurchases() {
    return requireClient('restorePurchases').restorePurchases();
  },
};
