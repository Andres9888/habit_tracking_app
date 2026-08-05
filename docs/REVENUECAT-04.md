# RevenueCat Integration - Phase 4: Subscription Management UI

## Overview
Create the subscription management screen and add premium status to settings.

## Prerequisites
- Phases 1-3 completed
- Purchase flow working end-to-end

---

## Tasks

### 1. Create SubscriptionScreen

- [ ] Create `src/screens/SubscriptionScreen.tsx`:

```typescript
/**
 * SubscriptionScreen
 *
 * Displays subscription status, plan details, and management options.
 * Accessed from Settings screen.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crown, ExternalLink, RefreshCw, HelpCircle } from 'lucide-react-native';
import { usePremium } from '../hooks/usePremium';
import { format } from 'date-fns';

export function SubscriptionScreen() {
  const {
    isPremium,
    status,
    isLoading,
    priceString,
    expirationDate,
    isTrialActive,
    managementUrl,
    restorePurchases,
    refreshStatus,
    error,
  } = usePremium();

  const handleManageSubscription = async () => {
    if (managementUrl) {
      await Linking.openURL(managementUrl);
    } else {
      // Fallback to platform-specific subscription management
      if (Platform.OS === 'ios') {
        await Linking.openURL('https://apps.apple.com/account/subscriptions');
      } else if (Platform.OS === 'android') {
        await Linking.openURL('https://play.google.com/store/account/subscriptions');
      }
    }
  };

  const handleRestorePurchases = async () => {
    await restorePurchases();
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@yourapp.com?subject=Subscription Help');
  };

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-stone-50'>
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#7c3aed' />
          <Text className='mt-4 text-stone-500'>Loading subscription...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-stone-50' edges={['bottom']}>
      <ScrollView className='flex-1 px-4 pt-4'>
        {/* Premium Status Header */}
        <View className='mb-6 items-center'>
          <View
            className={`h-20 w-20 items-center justify-center rounded-full ${
              isPremium ? 'bg-violet-100' : 'bg-stone-200'
            }`}
          >
            <Crown
              size={40}
              color={isPremium ? '#7c3aed' : '#a8a29e'}
              fill={isPremium ? '#7c3aed' : 'transparent'}
            />
          </View>
          <Text className='mt-4 text-2xl font-bold text-stone-800'>
            {isPremium ? 'Premium Member' : 'Free Plan'}
          </Text>
          {isTrialActive && (
            <View className='mt-2 rounded-full bg-violet-100 px-3 py-1'>
              <Text className='text-sm font-medium text-violet-700'>
                Trial Active
              </Text>
            </View>
          )}
        </View>

        {/* Subscription Details Card */}
        {isPremium && (
          <View className='mb-4 rounded-2xl bg-white p-4 shadow-sm'>
            <Text className='mb-3 text-lg font-semibold text-stone-800'>
              Current Plan
            </Text>

            <View className='space-y-2'>
              <View className='flex-row justify-between'>
                <Text className='text-stone-500'>Plan</Text>
                <Text className='font-medium text-stone-800'>
                  Monthly Premium
                </Text>
              </View>

              <View className='flex-row justify-between'>
                <Text className='text-stone-500'>Price</Text>
                <Text className='font-medium text-stone-800'>
                  {priceString ?? '$6.99'}/month
                </Text>
              </View>

              <View className='flex-row justify-between'>
                <Text className='text-stone-500'>Status</Text>
                <Text
                  className={`font-medium ${
                    status === 'active' || status === 'trialing'
                      ? 'text-green-600'
                      : status === 'past_due'
                        ? 'text-orange-600'
                        : 'text-stone-800'
                  }`}
                >
                  {status === 'trialing'
                    ? 'Trial'
                    : status === 'active'
                      ? 'Active'
                      : status === 'past_due'
                        ? 'Payment Issue'
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </View>

              {expirationDate && (
                <View className='flex-row justify-between'>
                  <Text className='text-stone-500'>
                    {isTrialActive ? 'Trial Ends' : 'Renews'}
                  </Text>
                  <Text className='font-medium text-stone-800'>
                    {format(expirationDate, 'MMM d, yyyy')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Error Message */}
        {error && (
          <View className='mb-4 rounded-lg bg-red-50 p-3'>
            <Text className='text-center text-sm text-red-600'>{error}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className='space-y-3'>
          {/* Manage Subscription */}
          {isPremium && (
            <TouchableOpacity
              className='flex-row items-center justify-between rounded-xl bg-white p-4 shadow-sm'
              onPress={handleManageSubscription}
            >
              <View className='flex-row items-center'>
                <ExternalLink size={20} color='#7c3aed' />
                <Text className='ml-3 font-medium text-stone-800'>
                  Manage Subscription
                </Text>
              </View>
              <Text className='text-stone-400'>→</Text>
            </TouchableOpacity>
          )}

          {/* Restore Purchases */}
          <TouchableOpacity
            className='flex-row items-center justify-between rounded-xl bg-white p-4 shadow-sm'
            onPress={handleRestorePurchases}
          >
            <View className='flex-row items-center'>
              <RefreshCw size={20} color='#7c3aed' />
              <Text className='ml-3 font-medium text-stone-800'>
                Restore Purchases
              </Text>
            </View>
            <Text className='text-stone-400'>→</Text>
          </TouchableOpacity>

          {/* Contact Support */}
          <TouchableOpacity
            className='flex-row items-center justify-between rounded-xl bg-white p-4 shadow-sm'
            onPress={handleContactSupport}
          >
            <View className='flex-row items-center'>
              <HelpCircle size={20} color='#7c3aed' />
              <Text className='ml-3 font-medium text-stone-800'>
                Contact Support
              </Text>
            </View>
            <Text className='text-stone-400'>→</Text>
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <View className='mt-6 px-4 pb-8'>
          <Text className='text-center text-xs text-stone-400'>
            {isPremium
              ? 'Manage your subscription through your device settings or the App Store/Google Play.'
              : 'Upgrade to Premium to unlock all features including unlimited voice notes, letters to self, vision board, and more.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SubscriptionScreen;
```

---

### 2. Add Subscription Section to Settings

- [ ] Find and update the Settings screen to include a subscription section.

Search for the settings screen:
```bash
find src -name "*[Ss]etting*" -type f
```

- [ ] Add subscription row to Settings:

```typescript
// In your SettingsScreen component, add this section:

import { usePremium } from '../hooks/usePremium';
import { Crown } from 'lucide-react-native';

// Inside the component:
const { isPremium, status, isTrialActive } = usePremium();

// In the JSX, add a subscription row:
<TouchableOpacity
  className='flex-row items-center justify-between rounded-xl bg-white p-4 shadow-sm'
  onPress={() => navigation.navigate('Subscription')}
>
  <View className='flex-row items-center'>
    <View className={`rounded-lg p-2 ${isPremium ? 'bg-violet-100' : 'bg-stone-100'}`}>
      <Crown
        size={20}
        color={isPremium ? '#7c3aed' : '#a8a29e'}
        fill={isPremium ? '#7c3aed' : 'transparent'}
      />
    </View>
    <View className='ml-3'>
      <Text className='font-medium text-stone-800'>
        {isPremium ? 'Premium' : 'Free Plan'}
      </Text>
      <Text className='text-xs text-stone-500'>
        {isPremium
          ? isTrialActive
            ? 'Trial active'
            : 'Manage subscription'
          : 'Tap to upgrade'}
      </Text>
    </View>
  </View>
  {isPremium && (
    <View className='rounded-full bg-violet-500 px-2 py-1'>
      <Text className='text-xs font-bold text-white'>PRO</Text>
    </View>
  )}
  {!isPremium && <Text className='text-stone-400'>→</Text>}
</TouchableOpacity>
```

---

### 3. Add Navigation Route

- [ ] Add SubscriptionScreen to navigation:

Find your navigation configuration and add:

```typescript
// In your navigation types:
type RootStackParamList = {
  // ... existing routes
  Subscription: undefined;
};

// In your navigator:
<Stack.Screen
  name="Subscription"
  component={SubscriptionScreen}
  options={{
    title: 'Subscription',
    headerBackTitle: 'Settings',
  }}
/>
```

---

### 4. Create Premium Badge Component

- [ ] Create `src/components/common/PremiumBadge.tsx`:

```typescript
/**
 * PremiumBadge
 *
 * Small badge indicating premium status.
 * Used in settings, profile, and feature headers.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Crown } from 'lucide-react-native';

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function PremiumBadge({ size = 'sm', showText = true }: PremiumBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5',
    md: 'px-2.5 py-1',
    lg: 'px-3 py-1.5',
  };

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const textSize = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <View
      className={`flex-row items-center rounded-full bg-violet-500 ${sizeClasses[size]}`}
    >
      <Crown size={iconSize[size]} color='#fff' fill='#fff' />
      {showText && (
        <Text className={`ml-1 font-bold text-white ${textSize[size]}`}>
          PRO
        </Text>
      )}
    </View>
  );
}
```

---

### 5. Create Subscription Status Banner

- [ ] Create `src/components/common/SubscriptionBanner.tsx`:

```typescript
/**
 * SubscriptionBanner
 *
 * Banner shown when subscription needs attention:
 * - Trial ending soon
 * - Billing issue
 * - Subscription expired
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertTriangle, Crown, X } from 'lucide-react-native';
import { usePremium } from '../../hooks/usePremium';
import { differenceInDays } from 'date-fns';

interface SubscriptionBannerProps {
  onPress?: () => void;
  onDismiss?: () => void;
}

export function SubscriptionBanner({ onPress, onDismiss }: SubscriptionBannerProps) {
  const { status, expirationDate, isTrialActive } = usePremium();

  // Determine if we should show a banner
  const daysUntilExpiry = expirationDate
    ? differenceInDays(expirationDate, new Date())
    : null;

  const showTrialEndingSoon = isTrialActive && daysUntilExpiry !== null && daysUntilExpiry <= 3;
  const showBillingIssue = status === 'past_due';
  const showExpired = status === 'expired';

  if (!showTrialEndingSoon && !showBillingIssue && !showExpired) {
    return null;
  }

  const getBannerContent = () => {
    if (showBillingIssue) {
      return {
        icon: <AlertTriangle size={18} color='#f97316' />,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        title: 'Payment Issue',
        message: 'Update your payment method to keep Premium features.',
        actionText: 'Fix Now',
      };
    }

    if (showExpired) {
      return {
        icon: <Crown size={18} color='#7c3aed' />,
        bgColor: 'bg-violet-50',
        borderColor: 'border-violet-200',
        title: 'Premium Expired',
        message: 'Resubscribe to unlock all features.',
        actionText: 'Resubscribe',
      };
    }

    // Trial ending soon
    return {
      icon: <Crown size={18} color='#7c3aed' />,
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200',
      title: `Trial Ends in ${daysUntilExpiry} Day${daysUntilExpiry === 1 ? '' : 's'}`,
      message: 'Subscribe now to keep your premium features.',
      actionText: 'Subscribe',
    };
  };

  const content = getBannerContent();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mx-4 mb-4 flex-row items-center rounded-xl border p-3 ${content.bgColor} ${content.borderColor}`}
    >
      <View className='mr-3'>{content.icon}</View>
      <View className='flex-1'>
        <Text className='font-semibold text-stone-800'>{content.title}</Text>
        <Text className='text-xs text-stone-600'>{content.message}</Text>
      </View>
      <Text className='font-medium text-violet-600'>{content.actionText}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} className='ml-2 p-1'>
          <X size={16} color='#a8a29e' />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
```

---

### 6. Export New Components

- [ ] Update `src/components/common/index.ts`:

```typescript
// Add exports
export { PremiumBadge } from './PremiumBadge';
export { SubscriptionBanner } from './SubscriptionBanner';
```

---

### 7. Add Banner to Main Screen (Optional)

- [ ] Optionally add `SubscriptionBanner` to the main habits screen:

```typescript
// In HabitsScreen or similar:
import { SubscriptionBanner } from '../components/common';

// In JSX, before the habit list:
<SubscriptionBanner
  onPress={() => navigation.navigate('Subscription')}
/>
```

---

### 8. Test Complete Flow

- [ ] Verify navigation from Settings → Subscription screen
- [ ] Verify premium badge shows correctly in Settings
- [ ] Verify subscription details display accurately
- [ ] Verify "Manage Subscription" opens correct URL
- [ ] Verify "Restore Purchases" works
- [ ] Test subscription banner scenarios (mock status values)

---

## Verification

After completing all tasks:

1. **Settings shows subscription**: Premium badge or "Free Plan" visible
2. **Subscription screen**: Shows all plan details correctly
3. **Actions work**: Manage, restore, and support links function
4. **Banner appears**: Shows for trial ending, billing issues, or expired
5. **Navigation smooth**: Can navigate to/from subscription screen

---

## App Store Checklist

Before submitting to App Store:

- [ ] Privacy policy URL is valid and linked
- [ ] Terms of service URL is valid and linked
- [ ] "Restore Purchases" is accessible
- [ ] Subscription terms are clearly displayed
- [ ] Price shows correctly (localized from RevenueCat)
- [ ] Cancel/manage subscription instructions are clear

---

## Final Integration Checklist

- [ ] All hardcoded `isPremium = true` removed
- [ ] All premium features use `usePremium` hook
- [ ] Webhook processes all subscription events
- [ ] Premium status syncs to Convex
- [ ] UI updates in real-time on purchase

---

## Production Launch Steps

1. **RevenueCat**: Switch from sandbox to production keys
2. **App Store**: Submit app with subscription products
3. **Google Play**: Submit app with subscription products
4. **Webhook**: Verify production webhook URL is configured
5. **Monitor**: Watch RevenueCat dashboard for first purchases

---

## Congratulations!

You have completed the RevenueCat integration. Your app now supports:
- In-app purchases via App Store and Play Store
- 7-day free trial
- Real-time subscription status
- Cross-device subscription sync
- Webhook-based backend sync
- Full subscription management UI
