import type { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

export interface PremiumActionsInput {
  setCustomerInfo: (info: CustomerInfo) => void;
  setError: (error: string | null) => void;
}

export interface PremiumActionsReturn {
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  refreshStatus: () => Promise<void>;
  restorePurchases: () => Promise<boolean>;
}
