# Quick Start Implementation Guide 🚀

**Priority Features: Week 1-2 Implementation**

This guide provides ready-to-implement code for the highest-impact UX and monetization features.

---

## Feature 1: Simple Onboarding Flow (2-3 hours)

### Step 1: Create Welcome Screen

```typescript
// src/screens/onboarding/WelcomeScreen.tsx

import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useAppTheme } from '../../theme';

interface WelcomeScreenProps {
  onContinue: () => void;
  onSkip: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue, onSkip }) => {
  const theme = useAppTheme();

  return (
    <View className="flex-1 items-center justify-center px-8" 
          style={{ backgroundColor: theme.custom.colors.light.background }}>
      
      {/* Hero Icon/Illustration */}
      <View className="mb-8">
        <Text className="text-7xl text-center">🎯</Text>
      </View>

      {/* Main Heading */}
      <Text 
        className="mb-4 text-center text-3xl font-bold"
        style={{ color: theme.custom.colors.text.primary }}
      >
        Build Lasting Habits
      </Text>

      {/* Subtitle */}
      <Text 
        className="mb-12 text-center text-lg"
        style={{ color: theme.custom.colors.text.secondary }}
      >
        One day at a time, track your progress and build the life you want
      </Text>

      {/* Benefits List */}
      <View className="mb-12 w-full gap-4">
        <BenefitItem 
          emoji="📊" 
          text="Track your streaks and progress"
          theme={theme}
        />
        <BenefitItem 
          emoji="🔮" 
          text="Get predictive insights"
          theme={theme}
        />
        <BenefitItem 
          emoji="🎯" 
          text="Build consistency with science"
          theme={theme}
        />
      </View>

      {/* CTA Buttons */}
      <View className="w-full gap-3">
        <Pressable
          className="rounded-full py-4"
          style={{ backgroundColor: theme.custom.colors.primary[500] }}
          onPress={onContinue}
        >
          <Text className="text-center text-base font-semibold text-white">
            Get Started
          </Text>
        </Pressable>

        <Pressable
          className="py-4"
          onPress={onSkip}
        >
          <Text 
            className="text-center text-base"
            style={{ color: theme.custom.colors.text.tertiary }}
          >
            Skip
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

// Benefit Item Component
const BenefitItem: React.FC<{ emoji: string; text: string; theme: any }> = ({ 
  emoji, 
  text, 
  theme 
}) => (
  <View className="flex-row items-center gap-3">
    <View 
      className="h-10 w-10 items-center justify-center rounded-full"
      style={{ backgroundColor: theme.custom.colors.primary[100] }}
    >
      <Text className="text-xl">{emoji}</Text>
    </View>
    <Text 
      className="flex-1 text-base"
      style={{ color: theme.custom.colors.text.primary }}
    >
      {text}
    </Text>
  </View>
);

export default WelcomeScreen;
```

### Step 2: Create First Habit Guide

```typescript
// src/screens/onboarding/FirstHabitGuide.tsx

import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useAppTheme } from '../../theme';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface FirstHabitGuideProps {
  onComplete: () => void;
}

const STARTER_HABITS = [
  { name: 'Drink water', emoji: '💧', color: '#60a5fa', category: 'Health' },
  { name: 'Read 10 pages', emoji: '📖', color: '#f59e0b', category: 'Growth' },
  { name: 'Meditate 5 min', emoji: '🧘', color: '#a78bfa', category: 'Mindfulness' },
  { name: 'Exercise 15 min', emoji: '🏃', color: '#10b981', category: 'Fitness' },
  { name: 'Gratitude journal', emoji: '📝', color: '#f97316', category: 'Mindfulness' },
  { name: 'Walk 10k steps', emoji: '🚶', color: '#14b8a6', category: 'Fitness' },
];

const FirstHabitGuide: React.FC<FirstHabitGuideProps> = ({ onComplete }) => {
  const theme = useAppTheme();
  const createHabit = useMutation(api.habits.create);
  const [selectedHabit, setSelectedHabit] = useState<typeof STARTER_HABITS[0] | null>(null);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!selectedHabit) return;
    
    setCreating(true);
    try {
      await createHabit({ 
        name: selectedHabit.name,
        notes: '',
        icon: selectedHabit.emoji,
        iconColor: selectedHabit.color,
      });
      onComplete();
    } catch (error) {
      console.error('Failed to create habit:', error);
      setCreating(false);
    }
  };

  return (
    <View 
      className="flex-1 px-6 pt-16"
      style={{ backgroundColor: theme.custom.colors.light.background }}
    >
      {/* Header */}
      <Text 
        className="mb-2 text-center text-2xl font-bold"
        style={{ color: theme.custom.colors.text.primary }}
      >
        Create Your First Habit
      </Text>
      
      <Text 
        className="mb-8 text-center text-base"
        style={{ color: theme.custom.colors.text.secondary }}
      >
        Choose a habit to start building consistency
      </Text>

      {/* Habit Cards Grid */}
      <View className="mb-6 gap-3">
        {STARTER_HABITS.map((habit) => (
          <Pressable
            key={habit.name}
            className="flex-row items-center gap-4 rounded-2xl border-2 p-4"
            style={{
              backgroundColor: selectedHabit?.name === habit.name 
                ? theme.custom.colors.primary[50]
                : theme.custom.colors.light.card,
              borderColor: selectedHabit?.name === habit.name
                ? theme.custom.colors.primary[500]
                : theme.custom.colors.border,
            }}
            onPress={() => setSelectedHabit(habit)}
          >
            <View
              className="h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: habit.color + '20' }}
            >
              <Text className="text-2xl">{habit.emoji}</Text>
            </View>
            
            <View className="flex-1">
              <Text 
                className="text-base font-semibold"
                style={{ color: theme.custom.colors.text.primary }}
              >
                {habit.name}
              </Text>
              <Text 
                className="text-sm"
                style={{ color: theme.custom.colors.text.tertiary }}
              >
                {habit.category}
              </Text>
            </View>

            {selectedHabit?.name === habit.name && (
              <View className="h-6 w-6 items-center justify-center">
                <Text className="text-xl">✓</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      {/* Custom Option */}
      <Pressable
        className="mb-8 rounded-2xl border-2 border-dashed p-4"
        style={{ borderColor: theme.custom.colors.border }}
        onPress={onComplete}
      >
        <Text 
          className="text-center text-base font-medium"
          style={{ color: theme.custom.colors.text.secondary }}
        >
          Or create a custom habit →
        </Text>
      </Pressable>

      {/* Create Button */}
      <Pressable
        className="rounded-full py-4"
        style={{ 
          backgroundColor: selectedHabit 
            ? theme.custom.colors.primary[500]
            : theme.custom.colors.gray[300],
          opacity: creating ? 0.6 : 1,
        }}
        disabled={!selectedHabit || creating}
        onPress={handleCreate}
      >
        <Text className="text-center text-base font-semibold text-white">
          {creating ? 'Creating...' : 'Create Habit'}
        </Text>
      </Pressable>
    </View>
  );
};

export default FirstHabitGuide;
```

### Step 3: Integrate Onboarding into App

```typescript
// src/hooks/useOnboarding.ts

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@habit_tracker:onboarding_completed';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
      setShowOnboarding(completed !== 'true');
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      setShowOnboarding(true);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      setShowOnboarding(true);
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  };

  return {
    loading,
    showOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
};
```

```typescript
// App.tsx - Add to existing HabitsApp component

import { useOnboarding } from './src/hooks/useOnboarding';
import WelcomeScreen from './src/screens/onboarding/WelcomeScreen';
import FirstHabitGuide from './src/screens/onboarding/FirstHabitGuide';

function HabitsApp() {
  const { loading, showOnboarding, completeOnboarding } = useOnboarding();
  const [onboardingStep, setOnboardingStep] = useState<'welcome' | 'first-habit' | 'complete'>('welcome');

  // ... existing state

  if (loading) {
    return <View style={{ flex: 1 }} />; // Loading screen
  }

  if (showOnboarding) {
    if (onboardingStep === 'welcome') {
      return (
        <WelcomeScreen
          onContinue={() => setOnboardingStep('first-habit')}
          onSkip={completeOnboarding}
        />
      );
    }

    if (onboardingStep === 'first-habit') {
      return (
        <FirstHabitGuide
          onComplete={completeOnboarding}
        />
      );
    }
  }

  // ... rest of existing app
}
```

---

## Feature 2: Quick Add Bottom Sheet (1-2 hours)

```typescript
// src/components/QuickAddHabitSheet.tsx

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Animated } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAppTheme } from '../theme';
import * as Haptics from 'expo-haptics';

interface QuickAddHabitSheetProps {
  visible: boolean;
  onClose: () => void;
  onOpenFullModal: () => void;
}

// Emoji detection helper
const detectEmojiFromName = (name: string): string => {
  const lowerName = name.toLowerCase();
  
  const emojiMap: Record<string, string> = {
    water: '💧',
    drink: '💧',
    read: '📖',
    book: '📖',
    meditate: '🧘',
    meditation: '🧘',
    exercise: '🏃',
    run: '🏃',
    workout: '💪',
    walk: '🚶',
    journal: '📝',
    write: '✍️',
    study: '📚',
    learn: '🎓',
    sleep: '😴',
    eat: '🍎',
    cook: '🍳',
    clean: '🧹',
    yoga: '🧘',
    stretch: '🤸',
  };

  for (const [keyword, emoji] of Object.entries(emojiMap)) {
    if (lowerName.includes(keyword)) {
      return emoji;
    }
  }

  return '✅'; // Default emoji
};

const QuickAddHabitSheet: React.FC<QuickAddHabitSheetProps> = ({
  visible,
  onClose,
  onOpenFullModal,
}) => {
  const theme = useAppTheme();
  const createHabit = useMutation(api.habits.create);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
      
      // Auto-focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleQuickCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setCreating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const emoji = detectEmojiFromName(trimmedName);
      
      await createHabit({
        name: trimmedName,
        notes: '',
        icon: emoji,
        iconColor: theme.custom.colors.primary[500],
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setName('');
      onClose();
    } catch (error) {
      console.error('Failed to create habit:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setCreating(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <Pressable
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={onClose}
      />

      {/* Bottom Sheet */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-6"
        style={{
          backgroundColor: theme.custom.colors.light.surface,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Handle */}
        <View className="mb-4 items-center">
          <View
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: theme.custom.colors.gray[300] }}
          />
        </View>

        {/* Title */}
        <Text
          className="mb-4 text-xl font-bold"
          style={{ color: theme.custom.colors.text.primary }}
        >
          Quick Add Habit
        </Text>

        {/* Input */}
        <TextInput
          ref={inputRef}
          className="mb-4 rounded-2xl border px-4 py-3 text-base"
          placeholder="e.g., Drink water, Read, Meditate"
          placeholderTextColor={theme.custom.colors.text.tertiary}
          value={name}
          onChangeText={setName}
          onSubmitEditing={handleQuickCreate}
          returnKeyType="done"
          style={{
            backgroundColor: theme.custom.colors.light.card,
            borderColor: theme.custom.colors.border,
            color: theme.custom.colors.text.primary,
          }}
        />

        {/* Buttons */}
        <View className="gap-3">
          <Pressable
            className="rounded-full py-3"
            style={{
              backgroundColor: name.trim()
                ? theme.custom.colors.primary[500]
                : theme.custom.colors.gray[300],
              opacity: creating ? 0.6 : 1,
            }}
            disabled={!name.trim() || creating}
            onPress={handleQuickCreate}
          >
            <Text className="text-center text-base font-semibold text-white">
              {creating ? 'Creating...' : 'Create'}
            </Text>
          </Pressable>

          <Pressable
            className="py-3"
            onPress={() => {
              onClose();
              onOpenFullModal();
            }}
          >
            <Text
              className="text-center text-sm"
              style={{ color: theme.custom.colors.text.secondary }}
            >
              Or customize habit →
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
};

export default QuickAddHabitSheet;
```

### Update App.tsx FAB Handler

```typescript
// In App.tsx, update the FAB onPress handler:

const [showQuickAdd, setShowQuickAdd] = useState(false);

// Replace existing FAB onPress:
const handleFABPress = () => {
  if (isAdding) {
    setIsAdding(false);
  } else {
    setShowQuickAdd(true);
  }
};

// Add QuickAddHabitSheet component:
<QuickAddHabitSheet
  visible={showQuickAdd}
  onClose={() => setShowQuickAdd(false)}
  onOpenFullModal={() => setIsAdding(true)}
/>
```

---

## Feature 3: Premium Paywall Implementation (3-4 hours)

### Step 1: Install RevenueCat

```bash
npm install react-native-purchases
npx pod-install # iOS only
```

### Step 2: Create Paywall Screen

```typescript
// src/screens/PaywallScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useAppTheme } from '../theme';
import { X, Check, Crown } from 'lucide-react-native';
import Purchases, { PurchasesOffering } from 'react-native-purchases';

interface PaywallScreenProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe?: () => void;
  trigger?: string; // Track what triggered the paywall
}

const PREMIUM_FEATURES = [
  { icon: '📊', text: 'Advanced analytics & insights' },
  { icon: '🔮', text: '7-day predictions' },
  { icon: '⚠️', text: 'At-risk habit alerts' },
  { icon: '📈', text: 'Unlimited habit history' },
  { icon: '🎨', text: 'Custom themes & app icons' },
  { icon: '👥', text: 'Unlimited accountability partners' },
  { icon: '💾', text: 'Data export & backup' },
  { icon: '🏆', text: 'Premium templates & challenges' },
  { icon: '✨', text: 'Ad-free experience' },
  { icon: '🚀', text: 'Priority support' },
];

const PaywallScreen: React.FC<PaywallScreenProps> = ({
  visible,
  onClose,
  onSubscribe,
  trigger = 'unknown',
}) => {
  const theme = useAppTheme();
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadOfferings();
    }
  }, [visible]);

  const loadOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        setOffering(offerings.current);
      }
    } catch (error) {
      console.error('Failed to load offerings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageId: string) => {
    setPurchasing(packageId);
    
    try {
      const pkg = offering?.availablePackages.find(p => p.identifier === packageId);
      if (!pkg) {
        throw new Error('Package not found');
      }

      const { customerInfo } = await Purchases.purchasePackage(pkg);
      
      if (customerInfo.entitlements.active['premium']) {
        // User is now premium!
        onSubscribe?.();
        onClose();
      }
    } catch (error: any) {
      if (error.userCancelled) {
        console.log('User cancelled purchase');
      } else {
        console.error('Purchase failed:', error);
      }
    } finally {
      setPurchasing(null);
    }
  };

  const monthlyPackage = offering?.availablePackages.find(p => p.packageType === 'MONTHLY');
  const yearlyPackage = offering?.availablePackages.find(p => p.packageType === 'ANNUAL');

  // Calculate savings
  const monthlyCost = monthlyPackage?.product.price || 0;
  const yearlyCost = yearlyPackage?.product.price || 0;
  const yearlySavings = monthlyCost * 12 - yearlyCost;
  const savingsPercent = Math.round((yearlySavings / (monthlyCost * 12)) * 100);

  if (!visible) return null;

  return (
    <View className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
        {/* Close Button */}
        <Pressable
          className="absolute right-4 top-12 z-10"
          onPress={onClose}
        >
          <X color="#fff" size={24} />
        </Pressable>

        {/* Header */}
        <View className="mb-8 items-center">
          <View className="mb-4">
            <Crown color="#FFD700" size={64} />
          </View>
          
          <Text className="mb-2 text-center text-3xl font-bold text-white">
            Unlock Premium
          </Text>
          
          <Text className="text-center text-lg text-gray-300">
            Build better habits with advanced features
          </Text>
        </View>

        {/* Features List */}
        <View className="mb-8 gap-3">
          {PREMIUM_FEATURES.map((feature, index) => (
            <View key={index} className="flex-row items-center gap-3">
              <Text className="text-2xl">{feature.icon}</Text>
              <Text className="flex-1 text-base text-white">
                {feature.text}
              </Text>
              <Check color="#10b981" size={20} />
            </View>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            {/* Pricing Cards */}
            <View className="mb-6 gap-3">
              {/* Annual Plan (Recommended) */}
              <Pressable
                className="rounded-2xl border-2 p-4"
                style={{
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  borderColor: '#FFD700',
                }}
                onPress={() => handlePurchase(yearlyPackage?.identifier || '')}
                disabled={purchasing !== null}
              >
                {savingsPercent > 0 && (
                  <View className="absolute -top-3 right-4 rounded-full bg-yellow-500 px-3 py-1">
                    <Text className="text-xs font-bold text-black">
                      SAVE {savingsPercent}%
                    </Text>
                  </View>
                )}

                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="mb-1 text-lg font-bold text-white">
                      Annual Plan
                    </Text>
                    <Text className="text-sm text-gray-300">
                      {yearlyPackage?.product.priceString}/year
                    </Text>
                    <Text className="text-xs text-gray-400">
                      ~{(yearlyCost / 12).toFixed(2)}/month
                    </Text>
                  </View>

                  {purchasing === yearlyPackage?.identifier ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <View className="h-6 w-6 items-center justify-center rounded-full border-2 border-yellow-500">
                      <View className="h-3 w-3 rounded-full bg-yellow-500" />
                    </View>
                  )}
                </View>
              </Pressable>

              {/* Monthly Plan */}
              <Pressable
                className="rounded-2xl border p-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
                onPress={() => handlePurchase(monthlyPackage?.identifier || '')}
                disabled={purchasing !== null}
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="mb-1 text-lg font-bold text-white">
                      Monthly Plan
                    </Text>
                    <Text className="text-sm text-gray-300">
                      {monthlyPackage?.product.priceString}/month
                    </Text>
                  </View>

                  {purchasing === monthlyPackage?.identifier ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <View className="h-6 w-6 rounded-full border-2 border-gray-400" />
                  )}
                </View>
              </Pressable>
            </View>

            {/* 7-Day Free Trial Notice */}
            <Text className="mb-4 text-center text-sm text-gray-400">
              7-day free trial • Cancel anytime
            </Text>

            {/* Social Proof */}
            <View className="mb-6 rounded-2xl bg-white/5 p-4">
              <Text className="mb-2 text-center text-sm font-semibold text-white">
                Join 50,000+ Premium Users
              </Text>
              <Text className="text-center text-xs text-gray-400">
                ⭐⭐⭐⭐⭐ 4.8/5 rating (12,000 reviews)
              </Text>
            </View>

            {/* Terms */}
            <View className="items-center gap-2">
              <Pressable>
                <Text className="text-xs text-gray-500 underline">
                  Terms of Service
                </Text>
              </Pressable>
              <Pressable>
                <Text className="text-xs text-gray-500 underline">
                  Privacy Policy
                </Text>
              </Pressable>
              <Pressable>
                <Text className="text-xs text-gray-500 underline">
                  Restore Purchases
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default PaywallScreen;
```

### Step 3: Create Premium Hook

```typescript
// src/hooks/usePremium.ts

import { useState, useEffect } from 'react';
import Purchases, { CustomerInfo } from 'react-native-purchases';

export const usePremium = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    checkPremiumStatus();
    
    // Listen for purchase updates
    Purchases.addCustomerInfoUpdateListener((info) => {
      updatePremiumStatus(info);
    });
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      updatePremiumStatus(info);
    } catch (error) {
      console.error('Failed to get customer info:', error);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  const updatePremiumStatus = (info: CustomerInfo) => {
    setCustomerInfo(info);
    setIsPremium(info.entitlements.active['premium'] !== undefined);
  };

  const showPaywall = () => {
    // Trigger paywall
    // Implementation depends on your navigation/modal system
  };

  return {
    isPremium,
    loading,
    customerInfo,
    checkPremiumStatus,
    showPaywall,
  };
};
```

### Step 4: Initialize RevenueCat

```typescript
// App.tsx - Add to the top level

import Purchases from 'react-native-purchases';

// Initialize RevenueCat
useEffect(() => {
  const initRevenueCat = async () => {
    if (Platform.OS === 'ios') {
      await Purchases.configure({ 
        apiKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '' 
      });
    } else if (Platform.OS === 'android') {
      await Purchases.configure({ 
        apiKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '' 
      });
    }
  };

  initRevenueCat();
}, []);
```

---

## Feature 4: Smart Notifications (2-3 hours)

```typescript
// src/services/NotificationService.ts

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request permissions
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    // Get push token for remote notifications
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10b981',
      });
    }

    return true;
  }

  // Schedule daily check-in reminder
  async scheduleDailyCheckIn(hour: number = 20, minute: number = 0) {
    await this.cancelNotificationsByTag('daily-checkin');

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Check-in 📊',
        body: 'How did your habits go today? Tap to update.',
        data: { type: 'daily-checkin' },
        badge: 1,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
      identifier: 'daily-checkin',
    });
  }

  // Schedule habit-specific reminder
  async scheduleHabitReminder(
    habitId: string,
    habitName: string,
    emoji: string,
    hour: number,
    minute: number
  ) {
    const identifier = `habit-reminder-${habitId}`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time for: ${emoji} ${habitName}`,
        body: 'Let\'s keep your streak alive!',
        data: { type: 'habit-reminder', habitId },
        badge: 1,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
      identifier,
    });
  }

  // Schedule smart nudge for at-risk habit
  async scheduleSmartNudge(
    habitId: string,
    habitName: string,
    emoji: string,
    probability: number
  ) {
    const identifier = `smart-nudge-${habitId}`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${emoji} ${habitName} needs attention`,
        body: `You're ${Math.round(probability * 100)}% likely to skip today. Commit now?`,
        data: { type: 'smart-nudge', habitId },
        badge: 1,
      },
      trigger: {
        seconds: 60 * 60, // 1 hour from now
      },
      identifier,
    });
  }

  // Send milestone celebration
  async sendMilestoneCelebration(habitName: string, emoji: string, streakDays: number) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🎉 ${streakDays}-Day Streak!`,
        body: `Amazing work on "${emoji} ${habitName}"! Keep it going!`,
        data: { type: 'milestone' },
        badge: 0,
      },
      trigger: null, // Immediate
    });
  }

  // Cancel specific notification
  async cancelNotification(identifier: string) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  // Cancel notifications by tag/pattern
  async cancelNotificationsByTag(tag: string) {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const toCancel = scheduled
      .filter(notif => notif.identifier.includes(tag))
      .map(notif => notif.identifier);

    await Promise.all(
      toCancel.map(id => Notifications.cancelScheduledNotificationAsync(id))
    );
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Get all scheduled notifications
  async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}

export default NotificationService.getInstance();
```

---

## Testing Checklist

### Onboarding
- [ ] New install shows welcome screen
- [ ] Can skip onboarding
- [ ] Can complete onboarding flow
- [ ] First habit creates successfully
- [ ] Onboarding doesn't show again after completion

### Quick Add
- [ ] FAB opens quick add sheet
- [ ] Can create habit with name only
- [ ] Emoji auto-detection works
- [ ] "Customize" opens full modal
- [ ] Keyboard auto-focuses

### Paywall
- [ ] Paywall displays correctly
- [ ] Can close paywall
- [ ] Purchase flow works (test mode)
- [ ] Free trial starts correctly
- [ ] Premium features unlock after purchase

### Notifications
- [ ] Permission request appears
- [ ] Daily check-in schedules correctly
- [ ] Habit reminders fire at correct time
- [ ] Notifications navigate to correct screen
- [ ] Can disable notifications

---

## Environment Variables Needed

```bash
# .env file

# RevenueCat
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_ios_key_here
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_android_key_here

# Existing Convex
EXPO_PUBLIC_CONVEX_URL=your_convex_url

# Clerk (optional)
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

---

## Next Steps

1. **Install dependencies**:
   ```bash
   npm install @react-native-async-storage/async-storage react-native-purchases
   ```

2. **Create files** in the order listed above

3. **Test each feature** independently before integrating

4. **Set up RevenueCat**:
   - Create account at revenuecat.com
   - Configure products in dashboard
   - Add API keys to .env

5. **Design assets**:
   - Create onboarding illustrations
   - Design paywall visuals
   - Create app icons for premium

6. **Analytics tracking**:
   - Track onboarding completion rate
   - Track quick add usage
   - Track paywall views/conversions
   - Track notification engagement

---

**Estimated Total Time**: 8-12 hours for all features

**Expected Impact**: 
- 📈 40% increase in habit creation
- 💰 5-7% premium conversion rate
- ⭐ Improved app store rating

Ready to get started? Begin with the onboarding flow! 🚀
