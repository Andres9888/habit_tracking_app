# RevenueCat Integration - Phase 3: Connect Paywall UI

## Overview
Wire up the existing `MotivationPaywall` component to use the `usePremium` hook for real purchases.

## Prerequisites
- Phase 1 completed (SDK + `usePremium` hook)
- Phase 2 completed (Convex backend)
- RevenueCat products configured in dashboard

---

## Tasks

### 1. Update PricingCard to Show Dynamic Price

- [ ] Update `src/components/MotivationSystem/Premium/MotivationPaywall/PricingCard.tsx`:

```typescript
/**
 * PricingCard - Subscription pricing display
 *
 * Now fetches real pricing from RevenueCat instead of hardcoded values.
 * Falls back to default pricing if offerings not loaded.
 */

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface PricingCardProps {
  /** Price string from RevenueCat (e.g., "$6.99") */
  priceString: string | null;
  /** Whether offerings are still loading */
  isLoading: boolean;
}

export function PricingCard({ priceString, isLoading }: PricingCardProps) {
  // Default fallback price (shown while loading or if fetch fails)
  const displayPrice = priceString ?? '$6.99';

  return (
    <View className='mb-4 overflow-hidden rounded-2xl border-2 border-violet-400/50 bg-white/10'>
      <View className='items-center px-4 py-4'>
        <Text className='mb-1 text-xs font-semibold uppercase tracking-wide text-violet-300'>
          Premium Subscription
        </Text>

        {isLoading ? (
          <View className='h-9 justify-center'>
            <ActivityIndicator color='#fff' size='small' />
          </View>
        ) : (
          <View className='flex-row items-baseline gap-1'>
            <Text className='text-3xl font-bold text-white'>{displayPrice}</Text>
            <Text className='text-base text-white/70'>/month</Text>
          </View>
        )}

        <Text className='mt-1 text-xs text-white/60'>
          7-day free trial • Cancel anytime
        </Text>
      </View>
    </View>
  );
}
```

---

### 2. Create Paywall Container with usePremium

- [ ] Create `src/components/MotivationSystem/Premium/MotivationPaywall/PaywallContainer.tsx`:

```typescript
/**
 * PaywallContainer
 *
 * Smart component that connects MotivationPaywall to RevenueCat via usePremium hook.
 * This separates the presentation (MotivationPaywall) from the data/actions (usePremium).
 *
 * Usage:
 * <PaywallContainer
 *   visible={showPaywall}
 *   onClose={() => setShowPaywall(false)}
 *   triggeredByFeature="voice_notes"
 * />
 */

import React, { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { MotivationPaywall } from './MotivationPaywall';
import { usePremium } from '../../../../hooks/usePremium';
import type { MotivationPremiumFeature } from '../PremiumFeatureLock';

interface PaywallContainerProps {
  visible: boolean;
  onClose: () => void;
  triggeredByFeature?: MotivationPremiumFeature;
  reduceMotion?: boolean;
  testID?: string;
}

export function PaywallContainer({
  visible,
  onClose,
  triggeredByFeature,
  reduceMotion = false,
  testID,
}: PaywallContainerProps) {
  const {
    monthlyPackage,
    priceString,
    isLoadingOfferings,
    purchasePackage,
    restorePurchases,
    error,
  } = usePremium();

  // Handle start trial / purchase
  const handleStartTrial = useCallback(async (): Promise<boolean> => {
    // Web platform doesn't support IAP
    if (Platform.OS === 'web') {
      Alert.alert(
        'Not Available',
        'In-app purchases are not available on web. Please use the iOS or Android app.',
        [{ text: 'OK' }]
      );
      return false;
    }

    // Check if we have a package to purchase
    if (!monthlyPackage) {
      Alert.alert(
        'Unable to Load',
        'Could not load subscription options. Please try again.',
        [{ text: 'OK' }]
      );
      return false;
    }

    // Attempt purchase
    const success = await purchasePackage(monthlyPackage);
    return success;
  }, [monthlyPackage, purchasePackage]);

  // Handle restore purchases
  const handleRestorePurchases = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Not Available',
        'Restore purchases is not available on web.',
        [{ text: 'OK' }]
      );
      return false;
    }

    return await restorePurchases();
  }, [restorePurchases]);

  return (
    <MotivationPaywall
      visible={visible}
      onClose={onClose}
      onStartTrial={handleStartTrial}
      onRestorePurchases={handleRestorePurchases}
      triggeredByFeature={triggeredByFeature}
      reduceMotion={reduceMotion}
      testID={testID}
      // Pass pricing data to child components via context or props
      // We'll need to update MotivationPaywall to accept these
    />
  );
}

export default PaywallContainer;
```

---

### 3. Update MotivationPaywall to Accept Pricing Props

- [ ] Update `src/components/MotivationSystem/Premium/MotivationPaywall/types.ts`:

```typescript
/**
 * Type definitions for MotivationPaywall component
 */

import type { MotivationPremiumFeature } from '../PremiumFeatureLock';

export interface MotivationPaywallProps {
  /**
   * Whether the paywall is visible
   */
  visible: boolean;

  /**
   * Callback when user closes the paywall
   */
  onClose: () => void;

  /**
   * Callback when user wants to start trial/purchase
   * Returns true if purchase was successful
   */
  onStartTrial: () => Promise<boolean>;

  /**
   * Callback for restoring purchases
   */
  onRestorePurchases?: () => Promise<boolean>;

  /**
   * Which feature triggered the paywall (for analytics and highlighting)
   */
  triggeredByFeature?: MotivationPremiumFeature;

  /**
   * Whether to reduce motion for accessibility
   */
  reduceMotion?: boolean;

  /**
   * Test ID for testing
   */
  testID?: string;

  // --- NEW: Pricing props from usePremium ---

  /**
   * Price string from RevenueCat (e.g., "$6.99")
   * Falls back to default if not provided
   */
  priceString?: string | null;

  /**
   * Whether offerings are still loading
   */
  isLoadingOfferings?: boolean;

  /**
   * Error message from purchase/restore operations
   */
  purchaseError?: string | null;
}

export interface FeatureCheckProps {
  icon: React.ComponentType<{ color: string; size: number }>;
  title: string;
  subtitle: string;
  isHighlighted: boolean;
  index: number;
  reduceMotion: boolean;
}

export interface PaywallFeature {
  icon: React.ComponentType<{ color: string; size: number }>;
  id: string;
  subtitle: string;
  title: string;
}
```

---

### 4. Update MotivationPaywall Component

- [ ] Update `src/components/MotivationSystem/Premium/MotivationPaywall/MotivationPaywall.tsx`:

```typescript
/**
 * MotivationPaywall Component
 *
 * Full-screen paywall specifically for Motivation System features.
 * Combines the feature lock UI, benefits modal, and actual purchase flow.
 *
 * @see motivation-system-spec.md - Premium Gating UX section
 */

import React from 'react';
import { View, ScrollView, Modal, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { CloseButton } from './CloseButton';
import { PaywallHero } from './PaywallHero';
import { FeaturesList } from './FeaturesList';
import { SocialProof } from './SocialProof';
import { PricingCard } from './PricingCard';
import { CTAButton } from './CTAButton';
import { PaywallFooter } from './PaywallFooter';
import { usePaywallHandlers } from './usePaywallHandlers';
import type { MotivationPaywallProps } from './types';

export function MotivationPaywall({
  visible,
  onClose,
  onStartTrial,
  onRestorePurchases,
  triggeredByFeature,
  reduceMotion = false,
  testID,
  // New pricing props
  priceString = null,
  isLoadingOfferings = false,
  purchaseError = null,
}: MotivationPaywallProps) {
  const {
    isProcessing,
    handleClose,
    handleStartTrial,
    handleRestorePurchases,
  } = usePaywallHandlers({ onClose, onRestorePurchases, onStartTrial });

  return (
    <Modal
      transparent
      animationType={reduceMotion ? 'fade' : 'slide'}
      testID={testID}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className='flex-1'>
        <BlurView className='absolute inset-0' intensity={80} tint='dark' />
        <View className='flex-1 bg-black/40'>
          <CloseButton onPress={handleClose} />
          <ScrollView
            className='flex-1 px-5'
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            <PaywallHero />
            <FeaturesList
              reduceMotion={reduceMotion}
              triggeredByFeature={triggeredByFeature}
            />
            <SocialProof />

            {/* Updated PricingCard with dynamic price */}
            <PricingCard
              priceString={priceString}
              isLoading={isLoadingOfferings}
            />

            {/* Error message if purchase failed */}
            {purchaseError && (
              <View className='mb-4 rounded-lg bg-red-500/20 p-3'>
                <Text className='text-center text-sm text-red-300'>
                  {purchaseError}
                </Text>
              </View>
            )}

            <View className='mb-4'>
              <CTAButton
                isProcessing={isProcessing}
                reduceMotion={reduceMotion}
                visible={visible}
                onPress={handleStartTrial}
              />
            </View>
            <PaywallFooter
              isProcessing={isProcessing}
              showRestorePurchases={!!onRestorePurchases}
              onRestorePurchases={handleRestorePurchases}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default MotivationPaywall;
```

---

### 5. Update PaywallContainer with Full Props

- [ ] Update `PaywallContainer.tsx` to pass pricing props:

```typescript
// Inside PaywallContainer, update the return statement:

return (
  <MotivationPaywall
    visible={visible}
    onClose={onClose}
    onStartTrial={handleStartTrial}
    onRestorePurchases={handleRestorePurchases}
    triggeredByFeature={triggeredByFeature}
    reduceMotion={reduceMotion}
    testID={testID}
    // Pricing props from usePremium
    priceString={priceString}
    isLoadingOfferings={isLoadingOfferings}
    purchaseError={error}
  />
);
```

---

### 6. Export PaywallContainer

- [ ] Update `src/components/MotivationSystem/Premium/MotivationPaywall/index.ts`:

```typescript
export { MotivationPaywall } from './MotivationPaywall';
export { PaywallContainer } from './PaywallContainer';
export type { MotivationPaywallProps } from './types';
```

- [ ] Update `src/components/MotivationSystem/Premium/index.ts` to re-export:

```typescript
// Add to existing exports
export { PaywallContainer } from './MotivationPaywall';
```

---

### 7. Update usePremiumUpsell Hook

The existing `usePremiumUpsell` hook manages when to show the paywall. Update it to use the new container.

- [ ] Check `src/components/MotivationSystem/Premium/usePremiumUpsell.ts` and update if needed to work with PaywallContainer

---

### 8. Test Purchase Flow

- [ ] Create a test component to verify the integration:

```typescript
// Temporary test - add to a screen temporarily

import { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { PaywallContainer } from '../components/MotivationSystem/Premium';
import { usePremium } from '../hooks/usePremium';

function PurchaseTest() {
  const [showPaywall, setShowPaywall] = useState(false);
  const { isPremium, status, priceString } = usePremium();

  return (
    <View style={{ padding: 20 }}>
      <Text>Premium Status: {status}</Text>
      <Text>Is Premium: {isPremium ? 'YES' : 'NO'}</Text>
      <Text>Price: {priceString ?? 'Loading...'}</Text>

      <Button
        title="Show Paywall"
        onPress={() => setShowPaywall(true)}
      />

      <PaywallContainer
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        triggeredByFeature="voice_notes"
      />
    </View>
  );
}
```

---

### 9. Replace Hardcoded isPremium Values

Search for hardcoded `isPremium` values and replace with `usePremium` hook:

- [ ] Search codebase: `grep -r "isPremium.*true" src/`

- [ ] Update `src/screens/AnalyticsScreen.tsx` (known hardcoded value):
```typescript
// Replace:
// const isPremiumUser = true; // TODO: Integrate RevenueCat

// With:
import { usePremium } from '../hooks/usePremium';
// ...
const { isPremium: isPremiumUser } = usePremium();
```

- [ ] Update any other screens with hardcoded premium values

---

### 10. Add Privacy Policy and Terms Links

Apple requires these in the paywall for subscription apps.

- [ ] Update `PaywallFooter.tsx` to include legal links:

```typescript
// Add below restore purchases button:
<View className='mt-4 flex-row justify-center gap-4'>
  <TouchableOpacity onPress={() => Linking.openURL('https://yourapp.com/privacy')}>
    <Text className='text-xs text-white/50 underline'>Privacy Policy</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => Linking.openURL('https://yourapp.com/terms')}>
    <Text className='text-xs text-white/50 underline'>Terms of Service</Text>
  </TouchableOpacity>
</View>
```

---

## Verification

After completing all tasks:

1. **Price displays**: Paywall shows price from RevenueCat (or fallback)
2. **Loading state**: Spinner shows while loading offerings
3. **Purchase flow**: Tapping "Start Trial" opens native App Store sheet (on device)
4. **Restore works**: Restore purchases button functions correctly
5. **Error handling**: Errors display in paywall UI
6. **Premium syncs**: After purchase, `isPremium` updates across app

---

## Testing Notes

- **Simulator**: Purchase flow won't work in iOS Simulator - use a physical device
- **Sandbox**: Use sandbox testers configured in App Store Connect
- **RevenueCat sandbox**: Enable sandbox mode in RevenueCat dashboard for testing

---

## Next Steps

Once Phase 3 is complete, proceed to:
- **REVENUECAT-04.md**: Subscription management UI (settings screen, subscription details)
