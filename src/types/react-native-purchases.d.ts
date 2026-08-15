declare module 'react-native-purchases' {
  /** Introductory offer attached to a product (free trial or discounted period). */
  export interface PurchasesIntroPrice {
    price: number;
    priceString: string;
    period: string;
    cycles: number;
    periodUnit: string;
    periodNumberOfUnits: number;
  }

  export interface PurchasesProduct {
    identifier: string;
    description: string;
    title: string;
    price: number;
    priceString: string;
    currencyCode: string;
    introPrice: PurchasesIntroPrice | null;
  }

  export interface PurchasesPackage {
    identifier: string;
    packageType: string;
    product: PurchasesProduct;
    offeringIdentifier: string;
  }

  export interface PurchasesEntitlementInfo {
    identifier: string;
    isActive: boolean;
    willRenew: boolean;
    periodType: string;
    latestPurchaseDate: string;
    originalPurchaseDate: string;
    expirationDate: string | null;
    store: string;
    productIdentifier: string;
    isSandbox: boolean;
    unsubscribeDetectedAt: string | null;
    billingIssueDetectedAt: string | null;
  }

  export interface CustomerInfo {
    activeSubscriptions: string[];
    allPurchasedProductIdentifiers: string[];
    latestExpirationDate: string | null;
    firstSeen: string;
    originalAppUserId: string;
    requestDate: string;
    entitlements: {
      active: Record<string, PurchasesEntitlementInfo>;
      all: Record<string, PurchasesEntitlementInfo>;
    };
    allExpirationDates: Record<string, string | null>;
    allPurchaseDates: Record<string, string>;
    originalPurchaseDate: string | null;
    originalApplicationVersion: string | null;
    managementURL: string | null;
  }

  export interface PurchasesError {
    message: string;
    code: string;
    underlyingErrorMessage?: string;
    userCancelled: boolean;
  }

  export type CustomerInfoUpdateListener = (info: CustomerInfo) => void;

  export enum PACKAGE_TYPE {
    UNKNOWN = 'UNKNOWN',
    CUSTOM = 'CUSTOM',
    LIFETIME = 'LIFETIME',
    ANNUAL = 'ANNUAL',
    SIX_MONTH = 'SIX_MONTH',
    THREE_MONTH = 'THREE_MONTH',
    TWO_MONTH = 'TWO_MONTH',
    MONTHLY = 'MONTHLY',
    WEEKLY = 'WEEKLY',
  }

  export enum LOG_LEVEL {
    VERBOSE = 'VERBOSE',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
  }

  interface PurchasesStatic {
    configure(config: { apiKey: string; appUserID?: string | null }): void;
    getOfferings(): Promise<{ current: { availablePackages: PurchasesPackage[] } | null }>;
    purchasePackage(pkg: PurchasesPackage): Promise<{ customerInfo: CustomerInfo }>;
    getCustomerInfo(): Promise<CustomerInfo>;
    logIn(userId: string): Promise<{ customerInfo: CustomerInfo; created: boolean }>;
    logOut(): Promise<CustomerInfo>;
    restorePurchases(): Promise<CustomerInfo>;
    setLogLevel(level: LOG_LEVEL): void;
    setLogHandler(handler: (level: LOG_LEVEL, message: string) => void): void;
    addCustomerInfoUpdateListener(listener: CustomerInfoUpdateListener): void;
    removeCustomerInfoUpdateListener(listener: CustomerInfoUpdateListener): void;
  }

  const Purchases: PurchasesStatic;
  export default Purchases;
}
