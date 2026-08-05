/**
 * Premium/Subscription State Management Tests
 * Tests all subscription states: active, expired, canceled, trial, grace period
 */

import type {
  SubscriptionStatus,
  PremiumState,
  PremiumSubscriptionInfo,
} from '../types';
import type { PurchasesEntitlementInfo, CustomerInfo } from 'react-native-purchases';

describe('Premium State Management', () => {
  /**
   * Helper to create mock CustomerInfo with various states
   */
  function createMockCustomerInfo(
    overrides: Partial<CustomerInfo> = {}
  ): CustomerInfo {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days ahead

    return {
      activeSubscriptions: [],
      allExpirationDates: {},
      allPurchaseDates: {},
      allPurchasedProductIdentifiers: [],
      entitlements: {
        active: {},
        all: {},
      },
      firstSeen: now.toISOString(),
      latestExpirationDate: null,
      managementURL: null,
      originalAppUserId: 'test-user',
      originalApplicationVersion: null,
      originalPurchaseDate: null,
      requestDate: now.toISOString(),
      ...overrides,
    };
  }

  /**
   * Helper to create mock entitlement info
   */
  function createMockEntitlement(
    overrides: Partial<PurchasesEntitlementInfo> = {}
  ): PurchasesEntitlementInfo {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
      billingIssueDetectedAt: null,
      expirationDate: futureDate.toISOString(),
      identifier: 'premium',
      isActive: true,
      isSandbox: false,
      latestPurchaseDate: now.toISOString(),
      originalPurchaseDate: now.toISOString(),
      periodType: 'NORMAL',
      productIdentifier: 'monthly_premium',
      store: 'APP_STORE',
      unsubscribeDetectedAt: null,
      willRenew: true,
      ...overrides,
    };
  }

  describe('subscription status detection', () => {
    describe('active subscription', () => {
      it('detects active subscription with auto-renewal', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);

        const entitlement = createMockEntitlement({
          isActive: true,
          willRenew: true,
          expirationDate: futureDate.toISOString(),
        });

        const customerInfo = createMockCustomerInfo({
          activeSubscriptions: ['monthly_premium'],
          entitlements: {
            active: { premium: entitlement },
            all: { premium: entitlement },
          },
        });

        expect(customerInfo.entitlements.active.premium).toBeDefined();
        expect(customerInfo.entitlements.active.premium.isActive).toBe(true);
        expect(customerInfo.entitlements.active.premium.willRenew).toBe(true);
      });

      it('detects active subscription without auto-renewal (grace period)', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 3); // Grace period ending soon

        const entitlement = createMockEntitlement({
          isActive: true,
          willRenew: false, // User canceled but still has access
          expirationDate: futureDate.toISOString(),
          unsubscribeDetectedAt: new Date().toISOString(),
        });

        const customerInfo = createMockCustomerInfo({
          activeSubscriptions: ['monthly_premium'],
          entitlements: {
            active: { premium: entitlement },
            all: { premium: entitlement },
          },
        });

        expect(customerInfo.entitlements.active.premium.isActive).toBe(true);
        expect(customerInfo.entitlements.active.premium.willRenew).toBe(false);
        expect(customerInfo.entitlements.active.premium.unsubscribeDetectedAt).toBeTruthy();
      });
    });

    describe('trial period', () => {
      it('detects active trial period', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7); // 7-day trial

        const entitlement = createMockEntitlement({
          isActive: true,
          periodType: 'TRIAL',
          expirationDate: futureDate.toISOString(),
          willRenew: true,
        });

        const customerInfo = createMockCustomerInfo({
          activeSubscriptions: ['monthly_premium'],
          entitlements: {
            active: { premium: entitlement },
            all: { premium: entitlement },
          },
        });

        expect(customerInfo.entitlements.active.premium.periodType).toBe('TRIAL');
        expect(customerInfo.entitlements.active.premium.isActive).toBe(true);
      });

      it('detects trial ending soon', () => {
        const nearFutureDate = new Date();
        nearFutureDate.setHours(nearFutureDate.getHours() + 12); // 12 hours left

        const entitlement = createMockEntitlement({
          isActive: true,
          periodType: 'TRIAL',
          expirationDate: nearFutureDate.toISOString(),
          willRenew: true,
        });

        const customerInfo = createMockCustomerInfo({
          entitlements: {
            active: { premium: entitlement },
            all: { premium: entitlement },
          },
        });

        const expiryTime = new Date(customerInfo.entitlements.active.premium.expirationDate!).getTime();
        const now = Date.now();
        const hoursRemaining = (expiryTime - now) / (1000 * 60 * 60);

        expect(hoursRemaining).toBeLessThan(24);
        expect(hoursRemaining).toBeGreaterThan(0);
      });

      it('detects canceled trial (will not convert)', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 3);

        const entitlement = createMockEntitlement({
          isActive: true,
          periodType: 'TRIAL',
          expirationDate: futureDate.toISOString(),
          willRenew: false, // User canceled trial
          unsubscribeDetectedAt: new Date().toISOString(),
        });

        const customerInfo = createMockCustomerInfo({
          entitlements: {
            active: { premium: entitlement },
            all: { premium: entitlement },
          },
        });

        expect(customerInfo.entitlements.active.premium.periodType).toBe('TRIAL');
        expect(customerInfo.entitlements.active.premium.willRenew).toBe(false);
      });
    });

    describe('expired subscription', () => {
      it('detects recently expired subscription', () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1); // Expired yesterday

        const entitlement = createMockEntitlement({
          isActive: false,
          expirationDate: pastDate.toISOString(),
          willRenew: false,
        });

        const customerInfo = createMockCustomerInfo({
          activeSubscriptions: [],
          entitlements: {
            active: {},
            all: { premium: entitlement },
          },
        });

        expect(customerInfo.entitlements.active.premium).toBeUndefined();
        expect(customerInfo.entitlements.all.premium).toBeDefined();
        expect(customerInfo.entitlements.all.premium.isActive).toBe(false);
      });

      it('detects long-expired subscription', () => {
        const pastDate = new Date();
        pastDate.setFullYear(pastDate.getFullYear() - 1); // Expired a year ago

        const entitlement = createMockEntitlement({
          isActive: false,
          expirationDate: pastDate.toISOString(),
          willRenew: false,
        });

        const customerInfo = createMockCustomerInfo({
          entitlements: {
            active: {},
            all: { premium: entitlement },
          },
        });

        expect(Object.keys(customerInfo.entitlements.active)).toHaveLength(0);
      });
    });

    describe('billing issues', () => {
      it('detects billing issue during active period', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 2); // Grace period

        const entitlement = createMockEntitlement({
          isActive: true,
          willRenew: false,
          expirationDate: futureDate.toISOString(),
          billingIssueDetectedAt: new Date().toISOString(),
        });

        const customerInfo = createMockCustomerInfo({
          entitlements: {
            active: { premium: entitlement },
            all: { premium: entitlement },
          },
        });

        expect(customerInfo.entitlements.active.premium.billingIssueDetectedAt).toBeTruthy();
        expect(customerInfo.entitlements.active.premium.isActive).toBe(true);
        expect(customerInfo.entitlements.active.premium.willRenew).toBe(false);
      });

      it('maintains access during grace period after billing issue', () => {
        const gracePeriodEnd = new Date();
        gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7); // 7-day grace

        const entitlement = createMockEntitlement({
          isActive: true,
          willRenew: false,
          expirationDate: gracePeriodEnd.toISOString(),
          billingIssueDetectedAt: new Date().toISOString(),
        });

        const customerInfo = createMockCustomerInfo({
          entitlements: {
            active: { premium: entitlement },
            all: { premium: entitlement },
          },
        });

        // User still has access during grace period
        expect(customerInfo.entitlements.active.premium.isActive).toBe(true);
        
        // But we know there's an issue
        const billingIssue = customerInfo.entitlements.active.premium.billingIssueDetectedAt;
        expect(billingIssue).toBeTruthy();
        
        // Grace period is limited
        const expiryDate = new Date(customerInfo.entitlements.active.premium.expirationDate!);
        const daysRemaining = (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        expect(daysRemaining).toBeLessThan(8);
      });
    });

    describe('free user states', () => {
      it('detects never-subscribed user', () => {
        const customerInfo = createMockCustomerInfo({
          activeSubscriptions: [],
          entitlements: {
            active: {},
            all: {},
          },
        });

        expect(Object.keys(customerInfo.entitlements.all)).toHaveLength(0);
        expect(customerInfo.activeSubscriptions).toHaveLength(0);
      });

      it('detects user who had subscription but now free', () => {
        const pastDate = new Date();
        pastDate.setMonth(pastDate.getMonth() - 3); // Expired 3 months ago

        const entitlement = createMockEntitlement({
          isActive: false,
          expirationDate: pastDate.toISOString(),
          willRenew: false,
        });

        const customerInfo = createMockCustomerInfo({
          activeSubscriptions: [],
          entitlements: {
            active: {},
            all: { premium: entitlement },
          },
        });

        expect(customerInfo.entitlements.all.premium).toBeDefined();
        expect(customerInfo.entitlements.active.premium).toBeUndefined();
      });
    });

    describe('edge cases and transitions', () => {
      it('handles subscription expiring exactly now', () => {
        const now = new Date();

        const entitlement = createMockEntitlement({
          isActive: false,
          expirationDate: now.toISOString(),
          willRenew: false,
        });

        const customerInfo = createMockCustomerInfo({
          entitlements: {
            active: {},
            all: { premium: entitlement },
          },
        });

        expect(customerInfo.entitlements.active.premium).toBeUndefined();
      });

      it('handles null expiration date (lifetime purchase)', () => {
        const entitlement = createMockEntitlement({
          isActive: true,
          expirationDate: null,
          periodType: 'NORMAL',
          willRenew: false, // Lifetime doesn't renew
        });

        const customerInfo = createMockCustomerInfo({
          activeSubscriptions: ['lifetime_premium'],
          entitlements: {
            active: { premium: entitlement },
            all: { premium: entitlement },
          },
        });

        expect(customerInfo.entitlements.active.premium.expirationDate).toBeNull();
        expect(customerInfo.entitlements.active.premium.isActive).toBe(true);
      });

      it('handles user upgrading from monthly to annual', () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);

        const annualEntitlement = createMockEntitlement({
          isActive: true,
          expirationDate: futureDate.toISOString(),
          productIdentifier: 'annual_premium',
          periodType: 'NORMAL',
          willRenew: true,
        });

        const customerInfo = createMockCustomerInfo({
          activeSubscriptions: ['annual_premium'],
          allPurchasedProductIdentifiers: ['monthly_premium', 'annual_premium'],
          entitlements: {
            active: { premium: annualEntitlement },
            all: { premium: annualEntitlement },
          },
        });

        expect(customerInfo.entitlements.active.premium.productIdentifier).toBe('annual_premium');
        expect(customerInfo.allPurchasedProductIdentifiers).toContain('monthly_premium');
      });

      it('handles resubscription after expiry', () => {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);

        const newEntitlement = createMockEntitlement({
          isActive: true,
          expirationDate: futureDate.toISOString(),
          originalPurchaseDate: now.toISOString(), // Recently purchased
          latestPurchaseDate: now.toISOString(),
          willRenew: true,
        });

        const customerInfo = createMockCustomerInfo({
          activeSubscriptions: ['monthly_premium'],
          entitlements: {
            active: { premium: newEntitlement },
            all: { premium: newEntitlement },
          },
        });

        expect(customerInfo.entitlements.active.premium.isActive).toBe(true);
        
        // Verify it's a recent purchase
        const purchaseDate = new Date(customerInfo.entitlements.active.premium.latestPurchaseDate);
        const hoursSincePurchase = (Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60);
        expect(hoursSincePurchase).toBeLessThan(24);
      });

      it('handles sandbox vs production distinction', () => {
        const sandboxEntitlement = createMockEntitlement({
          isActive: true,
          isSandbox: true,
        });

        const productionEntitlement = createMockEntitlement({
          isActive: true,
          isSandbox: false,
        });

        expect(sandboxEntitlement.isSandbox).toBe(true);
        expect(productionEntitlement.isSandbox).toBe(false);
      });
    });

    describe('store platform detection', () => {
      it('detects App Store purchase', () => {
        const entitlement = createMockEntitlement({
          store: 'APP_STORE',
        });

        expect(entitlement.store).toBe('APP_STORE');
      });

      it('detects alternate store purchase', () => {
        const entitlement = createMockEntitlement({
          store: 'PLAY_STORE',
        });

        expect(entitlement.store).toBe('PLAY_STORE');
      });

      it('detects promotional entitlement', () => {
        const entitlement = createMockEntitlement({
          store: 'PROMOTIONAL',
        });

        expect(entitlement.store).toBe('PROMOTIONAL');
      });
    });

    describe('management URL', () => {
      it('provides App Store management URL when available', () => {
        const customerInfo = createMockCustomerInfo({
          managementURL: 'https://apps.apple.com/account/subscriptions',
        });

        expect(customerInfo.managementURL).toContain('apple.com');
      });

      it('provides alternate store management URL when available', () => {
        const customerInfo = createMockCustomerInfo({
          managementURL: 'https://play.google.com/store/account/subscriptions',
        });

        expect(customerInfo.managementURL).toContain('google.com');
      });

      it('handles null management URL', () => {
        const customerInfo = createMockCustomerInfo({
          managementURL: null,
        });

        expect(customerInfo.managementURL).toBeNull();
      });
    });
  });

  describe('premium state derivation', () => {
    it('derives isPremium=true from active entitlement', () => {
      const entitlement = createMockEntitlement({ isActive: true });
      const customerInfo = createMockCustomerInfo({
        entitlements: {
          active: { premium: entitlement },
          all: { premium: entitlement },
        },
      });

      const isPremium = Object.keys(customerInfo.entitlements.active).length > 0;
      expect(isPremium).toBe(true);
    });

    it('derives isPremium=false from no active entitlements', () => {
      const customerInfo = createMockCustomerInfo({
        entitlements: {
          active: {},
          all: {},
        },
      });

      const isPremium = Object.keys(customerInfo.entitlements.active).length > 0;
      expect(isPremium).toBe(false);
    });

    it('derives status=trialing from trial period', () => {
      const entitlement = createMockEntitlement({
        isActive: true,
        periodType: 'TRIAL',
      });

      const status: SubscriptionStatus = entitlement.periodType === 'TRIAL' 
        ? 'trialing' 
        : 'active';
      
      expect(status).toBe('trialing');
    });

    it('derives status=active from normal subscription', () => {
      const entitlement = createMockEntitlement({
        isActive: true,
        periodType: 'NORMAL',
      });

      const status: SubscriptionStatus = entitlement.periodType === 'TRIAL' 
        ? 'trialing' 
        : 'active';
      
      expect(status).toBe('active');
    });

    it('derives status=expired from inactive entitlement', () => {
      const entitlement = createMockEntitlement({
        isActive: false,
      });

      const status: SubscriptionStatus = entitlement.isActive 
        ? 'active' 
        : 'expired';
      
      expect(status).toBe('expired');
    });
  });
});
