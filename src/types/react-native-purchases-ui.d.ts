declare module 'react-native-purchases-ui' {
  export enum PAYWALL_RESULT {
    NOT_PRESENTED = 'NOT_PRESENTED',
    ERROR = 'ERROR',
    CANCELLED = 'CANCELLED',
    PURCHASED = 'PURCHASED',
    RESTORED = 'RESTORED',
  }

  interface PaywallOptions {
    offering?: unknown;
    displayCloseButton?: boolean;
  }

  interface PaywallIfNeededOptions extends PaywallOptions {
    requiredEntitlementIdentifier: string;
  }

  interface RevenueCatUIStatic {
    presentPaywall(options?: PaywallOptions): Promise<PAYWALL_RESULT>;
    presentPaywallIfNeeded(
      options: PaywallIfNeededOptions
    ): Promise<PAYWALL_RESULT>;
  }

  const RevenueCatUI: RevenueCatUIStatic;
  export default RevenueCatUI;
}
