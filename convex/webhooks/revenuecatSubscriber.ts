type RevenueCatEntitlement = {
  expires_date?: string | null;
  product_identifier?: string | null;
  purchase_date?: string | null;
};

type RevenueCatSubscription = {
  billing_issues_detected_at?: string | null;
  expires_date?: string | null;
  grace_period_expires_date?: string | null;
  period_type?: string | null;
  refunded_at?: string | null;
  unsubscribe_detected_at?: string | null;
};

type RevenueCatSubscriberResponse = {
  subscriber?: {
    entitlements?: Record<string, RevenueCatEntitlement>;
    original_app_user_id?: string | null;
    subscriptions?: Record<string, RevenueCatSubscription>;
  };
};

export type CanonicalRevenueCatSubscriberState = {
  cancelledAt?: number;
  expiresAt?: number;
  hasBillingIssue: boolean;
  isActive: boolean;
  isTrialing: boolean;
  planType: 'monthly' | 'yearly';
  productId?: string;
  revenueCatId?: string;
  trialEndsAt?: number;
};

const REVENUECAT_API_BASE_URL = 'https://api.revenuecat.com/v1';
const REVENUECAT_REST_API_KEY = process.env.REVENUECAT_REST_API_KEY ?? '';
const PREMIUM_ENTITLEMENT_ID =
  process.env.REVENUECAT_PREMIUM_ENTITLEMENT_ID ?? 'premium';

export async function fetchCanonicalRevenueCatSubscriberState(
  appUserId: string
): Promise<CanonicalRevenueCatSubscriberState> {
  if (!REVENUECAT_REST_API_KEY) {
    throw new Error(
      'Missing REVENUECAT_REST_API_KEY; cannot reconcile RevenueCat subscriber state'
    );
  }

  const response = await fetch(
    `${REVENUECAT_API_BASE_URL}/subscribers/${encodeURIComponent(appUserId)}`,
    {
      headers: {
        Authorization: `Bearer ${REVENUECAT_REST_API_KEY}`,
        Accept: 'application/json',
      },
      method: 'GET',
    }
  );

  if (!response.ok) {
    throw new Error(
      `RevenueCat subscriber fetch failed with status ${response.status}`
    );
  }

  return parseCanonicalRevenueCatSubscriberState(await response.json());
}

export function parseCanonicalRevenueCatSubscriberState(
  payload: RevenueCatSubscriberResponse,
  now = Date.now()
): CanonicalRevenueCatSubscriberState {
  const subscriber = payload.subscriber ?? {};
  const entitlement = subscriber.entitlements?.[PREMIUM_ENTITLEMENT_ID];
  const entitlementExpiresAt = parseRevenueCatDate(entitlement?.expires_date);
  const isActive =
    Boolean(entitlement) &&
    (entitlementExpiresAt === undefined || entitlementExpiresAt > now);
  const productId = entitlement?.product_identifier ?? undefined;
  const subscription = productId
    ? subscriber.subscriptions?.[productId]
    : findMostRelevantSubscription(subscriber.subscriptions ?? {}, now);
  const subscriptionExpiresAt = parseRevenueCatDate(subscription?.expires_date);
  const gracePeriodExpiresAt = parseRevenueCatDate(
    subscription?.grace_period_expires_date
  );
  const expiresAt =
    entitlementExpiresAt ?? gracePeriodExpiresAt ?? subscriptionExpiresAt;
  const isTrialing =
    isActive && subscription?.period_type?.toLowerCase() === 'trial';

  return {
    cancelledAt: parseRevenueCatDate(subscription?.unsubscribe_detected_at),
    expiresAt,
    hasBillingIssue:
      parseRevenueCatDate(subscription?.billing_issues_detected_at) !==
      undefined,
    isActive,
    isTrialing,
    planType: inferPlanType(productId),
    productId,
    revenueCatId: subscriber.original_app_user_id ?? undefined,
    trialEndsAt: isTrialing ? expiresAt : undefined,
  };
}

function findMostRelevantSubscription(
  subscriptions: Record<string, RevenueCatSubscription>,
  now: number
): RevenueCatSubscription | undefined {
  return Object.values(subscriptions).find((subscription) => {
    if (parseRevenueCatDate(subscription.refunded_at) !== undefined) {
      return false;
    }
    const expiresAt = parseRevenueCatDate(subscription.expires_date);
    const gracePeriodExpiresAt = parseRevenueCatDate(
      subscription.grace_period_expires_date
    );
    return (
      expiresAt === undefined ||
      expiresAt > now ||
      gracePeriodExpiresAt === undefined ||
      gracePeriodExpiresAt > now
    );
  });
}

function inferPlanType(productId: string | undefined): 'monthly' | 'yearly' {
  const normalizedProductId = productId?.toLowerCase() ?? '';
  return normalizedProductId.includes('year') ||
    normalizedProductId.includes('annual')
    ? 'yearly'
    : 'monthly';
}

function parseRevenueCatDate(value: string | null | undefined) {
  if (!value) return undefined;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
