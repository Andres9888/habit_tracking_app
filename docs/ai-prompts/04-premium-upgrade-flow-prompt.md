# AI Frontend Prompt: Premium Upgrade Flow

## Context
Building subscription monetization flow for React Native habit app. Duolingo-style conversion with 7-day free trial, feature comparison, and strategic CTAs.

## Screen: Premium Upgrade

### Layout Structure

```
┌─────────────────────────────────────┐
│  ← Premium                          │ Header
├─────────────────────────────────────┤
│  🎯 Never Lose a Streak Again       │ Hero Section
│  ♾️ Unlimited Saves • Auto-Freeze   │
│                                     │
│  FREE           vs      PREMIUM     │ Comparison
│  ✓ 3 Saves/week         ♾️ Unlimited│
│  ✓ 1 Freeze/mo          ♾️ Unlimited│
│  ✓ Basic Stats          ✓ Advanced  │
│  ✗ Custom Avatars       ✓ 50+ Options│
│  ✗ Private Leagues      ✓ With Friends│
│                                     │
│  ┌─────────────────────────────┐   │ Monthly Card
│  │  Monthly                    │   │
│  │  $4.99/month                │   │
│  │  [Select]                   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │ Annual Card
│  │  Annual  💎 BEST VALUE      │   │ (highlighted)
│  │  $39.99/year                │   │
│  │  $3.33/month (17% off)      │   │
│  │  [Select]                   │   │
│  └─────────────────────────────┘   │
│                                     │
│  📈 Join 10,000+ Premium Users      │ Social Proof
│                                     │
│  💬 "Game changer! ..." - Amy       │ Testimonials
│  ⭐⭐⭐⭐⭐                           │
│                                     │
│  [Start 7-Day Free Trial]           │ Sticky CTA
└─────────────────────────────────────┘
```

### Components

**1. HeroSection**
- Large emoji/icon at top
- Value proposition headline (bold, 24px)
- Key benefits (bullet points with infinity symbol)
- Gradient background (subtle purple → pink)

```typescript
interface HeroSectionProps {
  headline: string;
  benefits: string[]; // ["Unlimited Saves", "Auto-Freeze", etc.]
  emoji: string;
}
```

**2. FeatureComparisonTable**
- Two-column layout: FREE vs PREMIUM
- Rows for each feature
- Icons: ✓ (green) for included, ✗ (gray) for excluded
- Highlight Premium features with gold tint

```typescript
interface FeatureComparisonTableProps {
  features: Array<{
    name: string;
    free: boolean | string; // true, false, or "Limited"
    premium: boolean | string;
  }>;
}

// Features list
const FEATURES = [
  {
    name: 'Streak Saves',
    free: '3 per week',
    premium: '♾️ Unlimited',
  },
  {
    name: 'Streak Freeze',
    free: '1 per month',
    premium: '♾️ Unlimited + Auto',
  },
  {
    name: 'Analytics',
    free: 'Basic stats',
    premium: 'Advanced insights',
  },
  {
    name: 'Custom Avatars',
    free: false,
    premium: '50+ options',
  },
  {
    name: 'Private Leagues',
    free: false,
    premium: true,
  },
  {
    name: '2x XP Boost',
    free: false,
    premium: true,
  },
  {
    name: 'Ad-Free Experience',
    free: false,
    premium: true,
  },
];
```

**Visual:**
```
┌────────────────────────────────┐
│  Streak Saves                  │
│  3/week          ♾️ Unlimited  │
│  ✓               ✓             │
├────────────────────────────────┤
│  Custom Avatars                │
│  ✗               50+ options   │
│                  ✓             │
└────────────────────────────────┘
```

**3. PricingCard**
- Rounded card with border
- "BEST VALUE" badge for annual (gold, top-right corner)
- Tier name (bold)
- Price (large, prominent)
- Per-month equivalent for annual
- Savings percentage
- Select button (primary or secondary style)

```typescript
interface PricingCardProps {
  tier: 'monthly' | 'annual';
  price: string; // "$4.99"
  perMonth?: string; // "$3.33" (for annual)
  savings?: string; // "17% off"
  isRecommended?: boolean; // Shows "BEST VALUE" badge
  isSelected?: boolean;
  onSelect: () => void;
}
```

**States:**
- Default: Gray border, white background
- Selected: Blue border (2px), blue tint background (5%)
- Recommended: Gold "BEST VALUE" badge

**4. TestimonialCard**
- User quote (italic)
- Star rating (⭐⭐⭐⭐⭐)
- User name + optional avatar
- Compact, horizontal layout

```typescript
interface TestimonialCardProps {
  quote: string;
  rating: number; // 1-5
  userName: string;
  avatar?: string; // emoji or image URL
}

const TESTIMONIALS = [
  {
    quote: "Game changer! Never lost a streak since upgrading.",
    rating: 5,
    userName: "Amy K.",
    avatar: "👩‍💼",
  },
  {
    quote: "The analytics helped me understand my patterns.",
    rating: 5,
    userName: "David M.",
    avatar: "👨‍💻",
  },
  {
    quote: "Worth every penny. Best habit app I've used.",
    rating: 5,
    userName: "Sarah L.",
    avatar: "👩‍🎨",
  },
];
```

**5. StickyCTA (Bottom Bar)**
- Fixed to bottom of screen
- Slightly elevated above content (shadow)
- Primary button: "Start 7-Day Free Trial"
- Subtext: "Then $4.99/month • Cancel anytime"
- Appears/disappears based on scroll position

```typescript
interface StickyC​TAProps {
  buttonText: string;
  subtext: string;
  onPress: () => void;
  visible: boolean; // controlled by scroll position
}
```

---

## User Flow

```mermaid
flowchart TD
    A[User taps Premium CTA] --> B[Premium Screen Loads]
    B --> C[User scrolls to explore]
    C --> D{Selects pricing tier?}

    D -->|Monthly| E[Monthly card highlighted]
    D -->|Annual| F[Annual card highlighted]

    E --> G[Taps "Start Trial" or "Select"]
    F --> G

    G --> H{First time user?}

    H -->|Yes| I[Show: "7 days free, then $4.99/mo"]
    H -->|Returning| J[Show: "$4.99/month" or "$39.99/year"]

    I --> K[System payment sheet appears]
    J --> K

    K --> L{Payment authorized?}

    L -->|No| M[Error: "Payment failed"]
    L -->|Yes| N[Success animation]

    M --> O[Return to pricing options]
    O --> G

    N --> P[Confetti celebration]
    P --> Q["Modal: Welcome to Premium!"]
    Q --> R[Show unlocked features]
    R --> S["Badge: ♾️ active"]
    S --> T{User choice}

    T -->|Explore| U[Guided tour of premium features]
    T -->|Skip| V[Return to Home with Premium badge]

    U --> V
```

---

## Payment Integration

**For iOS (In-App Purchase):**
```typescript
import * as InAppPurchases from 'expo-in-app-purchases';

// Product IDs (configure in App Store Connect)
const PRODUCT_IDS = {
  monthly: 'com.habitapp.premium.monthly',
  annual: 'com.habitapp.premium.annual',
};

// Purchase function
const handlePurchase = async (tier: 'monthly' | 'annual') => {
  try {
    // 1. Connect to store
    await InAppPurchases.connectAsync();

    // 2. Get products
    const { results } = await InAppPurchases.getProductsAsync([PRODUCT_IDS[tier]]);

    // 3. Purchase
    await InAppPurchases.purchaseItemAsync(PRODUCT_IDS[tier]);

    // 4. Show success animation
    showSuccessModal();

    // 5. Update user subscription status
    await updateUserPremiumStatus(true);

  } catch (error) {
    if (error.code === 'E_USER_CANCELLED') {
      // User cancelled, no error message
      return;
    }
    showErrorToast('Payment failed. Please try again.');
  }
};
```

**Trial Management:**
- iOS handles trial automatically via App Store
- Trial status checked via `purchaseHistory`
- First-time subscribers see trial pricing automatically

---

## Animations

**Screen Entry:**
- Hero fades in + scales (0.95 → 1.0)
- Feature comparison slides up (staggered rows, 50ms delay each)
- Pricing cards fade in (300ms delay from comparison)
- Testimonials fade in last

**Pricing Selection:**
- Selected card: border color transition (200ms)
- Unselected card dims slightly (opacity 1 → 0.8)
- "BEST VALUE" badge pulses (scale 1 → 1.05 → 1, repeat every 2s)

**Purchase Success:**
```
Phase 1: Processing (0-1s)
- Button shows spinner
- Disable all interactions

Phase 2: Success (1-3s)
- Confetti explosion (gold + purple colors)
- Modal slides up: "🎉 Welcome to Premium!"
- Premium badge animates in (scale + rotation)
- Haptic: Success pattern

Phase 3: Feature Reveal (3-5s)
- Show list of unlocked features (fade in, staggered)
- Each feature has checkmark animation
```

**CTA Scroll Behavior:**
- Hidden initially (if hero visible)
- Slides up from bottom when user scrolls past pricing
- Sticks to bottom with subtle shadow
- Hides when scrolling back to top

---

## Premium Badge (Post-Purchase)

**Location:** Top-right of home screen, next to profile avatar

**Visual:**
- Small badge with gold background
- ♾️ infinity symbol or "PRO" text
- Subtle gold glow/shimmer
- Tappable: shows "Manage Subscription" sheet

```typescript
interface PremiumBadgeProps {
  onPress: () => void; // Navigate to subscription management
}
```

---

## Cancel/Manage Subscription

**Sheet Content:**
- Current plan: "Premium Annual ($39.99/year)"
- Renewal date: "Renews on Feb 15, 2025"
- [Manage Subscription] → Opens iOS Settings
- [Cancel Subscription] → Confirmation dialog

**Confirmation Dialog:**
```
Are you sure you want to cancel Premium?

You'll lose:
❌ Unlimited Streak Saves
❌ Unlimited Freezes
❌ Advanced Analytics
❌ Custom Avatars

[Keep Premium] [Yes, Cancel]
```

---

## A/B Testing Variations

**Test 1: Headline**
- Variant A: "Never Lose a Streak Again"
- Variant B: "Join 10,000+ Premium Users"
- Variant C: "Unlock Your Full Potential"

**Test 2: Trial CTA**
- Variant A: "Start 7-Day Free Trial"
- Variant B: "Try Premium Free for 7 Days"
- Variant C: "Start Free Trial"

**Test 3: Pricing Display**
- Variant A: Monthly + Annual side-by-side
- Variant B: Annual only (with toggle to monthly)
- Variant C: Annual prominent, monthly smaller below

---

## Accessibility

**Screen Readers:**
- "Premium subscription screen. Unlimited streak saves and freezes available."
- Feature comparison: "Streak Saves: Free users get 3 per week. Premium users get unlimited."
- Pricing: "Annual plan, $39.99 per year, saves 17%, best value"

**Touch Targets:**
- All buttons: minimum 44px height
- Pricing cards: minimum 80px height (entire card tappable)

**Focus Order:**
- Hero → Comparison → Monthly → Annual → CTA

---

## Technical Requirements

**Dependencies:**
```json
{
  "expo-in-app-purchases": "^15.0.7",
  "react-native-reanimated": "~4.1.1",
  "react-native-confetti-cannon": "^1.5.2"
}
```

**State Management:**
```typescript
interface PremiumState {
  isPremium: boolean;
  tier: 'monthly' | 'annual' | null;
  trialActive: boolean;
  subscriptionEndDate: Date | null;
}
```

**Analytics Events:**
- `premium_screen_viewed`
- `pricing_tier_selected: {tier: 'monthly' | 'annual'}`
- `trial_started: {tier, price}`
- `purchase_completed: {tier, price, revenue}`
- `purchase_failed: {tier, error}`

---

## Success Criteria

1. ✅ Clear value proposition above the fold
2. ✅ Feature comparison easy to understand
3. ✅ Pricing feels fair and transparent
4. ✅ Trial CTA prominent and low-friction
5. ✅ Success moment feels celebratory
6. ✅ Post-purchase experience delightful
7. ✅ Target: >8% conversion rate

---

**AI Tool Instructions:**
- Build as full-screen scrollable component
- Use ScrollView with sticky CTA
- Implement in-app purchase flow with error handling
- Add loading states for async operations
- Include analytics tracking for all interactions
- Build reusable pricing card component
- Support both monthly and annual tiers
- Handle trial vs. paid states correctly
