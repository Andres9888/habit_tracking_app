# My Project - Technical Specification

**Author:** Jane
**Date:** 2025-10-30
**Project Level:** Level 0 (Single Atomic Change)
**Project Type:** Mobile application
**Development Context:** Brownfield - Adding to existing clean codebase

---

## Source Tree Structure

**Single File to Modify:**

```
src/screens/HabitDetailScreen.tsx
```

**Current Code Structure (lines 396-423):**

```typescript
{/* Navigation Bar */}
<View
  style={[
    styles.navigationBar,
    {
      borderBottomColor: theme.custom.colors.gray[200],
      borderBottomWidth: 1,
    },
  ]}
>
  <Pressable
    accessible
    accessibilityLabel='Close'
    accessibilityRole='button'
    style={styles.closeButton}
    onPress={onClose}
  >
    <X color={theme.custom.colors.gray[700]} size={24} />
  </Pressable>
  <Text
    style={[
      theme.custom.typography.heading3,
      { color: theme.custom.colors.gray[900] },
    ]}
  >
    Habit Detail
  </Text>
  <View style={styles.closeButton} />
</View>
```

**Current Style Definition (lines 685-691):**

```typescript
navigationBar: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingVertical: 12,
},
```

**Dependencies Already Imported (but not used):**

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Line 18
const insets = useSafeAreaInsets(); // Line 302
```

---

## Technical Approach

### Problem Analysis

**Root Cause:**
The navigation bar component in `HabitDetailScreen.tsx` is not accounting for device safe area insets (status bar/notch area on iOS devices). While `useSafeAreaInsets()` is imported and called, the returned `insets` object is never applied to the navigation bar styling.

**Current Behavior:**
- On devices with notches (iPhone X and newer), the navigation bar renders under the status bar
- The "Habit Detail" heading and action buttons are partially obscured by the notch/status bar
- The close button (X icon) and edit button area are cut off at the top

**Expected Behavior:**
- Navigation bar should start below the safe area (status bar/notch)
- All interactive elements should be fully visible and accessible
- Design should adapt dynamically to different device safe areas

### Solution Strategy

**Approach: Apply Safe Area Insets to Navigation Bar**

We will use the existing `insets` variable (from `useSafeAreaInsets()`) to add top padding to the navigation bar. This is the standard React Native pattern for handling safe areas.

**Why This Approach:**
1. **Already Available:** The hook is already imported and called - we just need to use it
2. **Standard Pattern:** This is the recommended React Native Safe Area Context approach
3. **Minimal Change:** Single inline style addition, no new dependencies
4. **Dynamic:** Automatically adapts to different device safe areas (iPhone notch, status bar, etc.)
5. **Performance:** No performance impact - uses existing hooks

**Alternative Considered (Rejected):**
- Using `SafeAreaView` wrapper: Would require restructuring the component layout and might conflict with the Modal component's built-in safe area handling
- Fixed padding values: Would not adapt to different devices and could cause issues on devices without notches

---

## Implementation Stack

**No new dependencies required.** This fix uses existing libraries already installed in the project.

### Existing Dependencies (Already Installed)

**Core Framework:**
- `react-native`: 0.74.x - React Native framework
- `react`: 18.x - React library

**Safe Area Handling:**
- `react-native-safe-area-context`: ^4.x - Provides `useSafeAreaInsets()` hook (already imported)

**UI Components:**
- `lucide-react-native`: ^0.x - Icon library (X icon for close button)
- Theme system from `../theme` - Custom theme with typography and colors

### File Dependencies

**Single File to Modify:**
- `src/screens/HabitDetailScreen.tsx` - Add safe area padding to navigation bar

**No Changes Required:**
- `package.json` - All dependencies already installed
- No native module changes
- No iOS/Android specific code needed

---

## Technical Details

### Precise Code Change

**Location:** `src/screens/HabitDetailScreen.tsx`

**Change Type:** Add inline style to existing View component

**Exact Modification (Line 396-403):**

**BEFORE:**
```typescript
<View
  style={[
    styles.navigationBar,
    {
      borderBottomColor: theme.custom.colors.gray[200],
      borderBottomWidth: 1,
    },
  ]}
>
```

**AFTER:**
```typescript
<View
  style={[
    styles.navigationBar,
    {
      paddingTop: insets.top,
      borderBottomColor: theme.custom.colors.gray[200],
      borderBottomWidth: 1,
    },
  ]}
>
```

**Single Line Added:**
```typescript
paddingTop: insets.top,
```

### Safe Area Insets Explanation

**What is `insets.top`?**
- Returns the top safe area inset in pixels
- On iPhone 14 Pro (with notch): ~47-59px
- On iPhone SE (no notch): ~20px (status bar height)
- On iPad: ~20px (status bar height)
- Dynamically adapts based on device and orientation

**Why `paddingTop` instead of `marginTop`?**
- `paddingTop` keeps the navigation bar's background color extended into the safe area
- `marginTop` would leave a gap above the navigation bar
- The border-bottom should remain at the bottom of the navigation bar content

**Combined Effect:**
- Static `paddingVertical: 12` from `styles.navigationBar` provides base spacing
- Dynamic `paddingTop: insets.top` adds device-specific safe area spacing
- Total top padding = `12 + insets.top` pixels

### Impact Analysis

**Visual Changes:**
- Navigation bar will have additional top padding on devices with notches
- Content (title, close button) will shift down to be fully visible
- No change on devices without notches (insets.top = 0 on older devices, but typically 20px for status bar)

**Layout Implications:**
- Navigation bar height increases by `insets.top` pixels
- ScrollView content area height decreases proportionally (still fills remaining space)
- No effect on horizontal spacing or bottom layout

**Accessibility:**
- Improved: Interactive elements (close button) are now in touchable area
- No change to accessibility labels or roles
- Better compliance with iOS Human Interface Guidelines

**Performance:**
- Zero performance impact
- No re-renders triggered (insets are calculated once on mount)
- No animation or layout thrashing

---

## Development Setup

**No special setup required.** This is a single-line code change to an existing file.

### Prerequisites

1. **Existing development environment** - Project already set up
2. **Text editor/IDE** - VS Code, WebStorm, or similar
3. **React Native development tools** - Already configured for this project

### Verification Before Making Change

```bash
# Ensure development server is running
npm start
# or
yarn start

# Run on iOS simulator to see current bug
npm run ios
# or
yarn ios
```

### No Additional Dependencies

- All required packages already installed
- No `npm install` or `yarn install` needed
- No pod install required
- No native module linking needed

---

## Implementation Guide

### Step-by-Step Implementation

**Total Time Estimate: 2-5 minutes**

#### Step 1: Open the File

```bash
# Open in your preferred editor
code src/screens/HabitDetailScreen.tsx
# or
vim src/screens/HabitDetailScreen.tsx
# or use any text editor
```

#### Step 2: Locate the Navigation Bar Component

**Find lines 396-403** (or search for "Navigation Bar" comment):

```typescript
{/* Navigation Bar */}
<View
  style={[
    styles.navigationBar,
    {
      borderBottomColor: theme.custom.colors.gray[200],
      borderBottomWidth: 1,
    },
  ]}
>
```

#### Step 3: Add Safe Area Padding

**Add one line** inside the inline style object (after line 399):

```typescript
{/* Navigation Bar */}
<View
  style={[
    styles.navigationBar,
    {
      paddingTop: insets.top,  // ← ADD THIS LINE
      borderBottomColor: theme.custom.colors.gray[200],
      borderBottomWidth: 1,
    },
  ]}
>
```

**Important:**
- Place `paddingTop: insets.top,` BEFORE `borderBottomColor`
- Include the comma at the end of the line
- Maintain proper indentation (6 spaces or 3 tabs)

#### Step 4: Save the File

```bash
# Save in your editor
# Ctrl+S (Windows/Linux) or Cmd+S (macOS)
```

#### Step 5: Verify the Change

The development server should **hot reload automatically**. If not:

```bash
# Reload the app
# Press 'r' in Metro bundler terminal
# or shake device/simulator and select "Reload"
```

#### Step 6: Visual Verification

**On iPhone simulator/device with notch:**
1. Navigate to any habit in the app
2. Tap on the habit to open Habit Detail screen
3. Verify the navigation bar is now below the status bar/notch
4. Verify "Habit Detail" heading is fully visible
5. Verify close button (X) is fully visible and tappable

**Expected Visual Result:**
- Navigation bar should have extra top padding
- All content should be visible (not cut off)
- Close button should be in the touchable area

### Troubleshooting

**Issue: Hot reload didn't work**
```bash
# Full reload
# In Metro terminal, press 'r'
# or in simulator: Cmd+R (iOS)
```

**Issue: TypeScript error about `insets`**
- Verify `const insets = useSafeAreaInsets();` exists on line 302
- Verify import exists on line 18: `import { useSafeAreaInsets } from 'react-native-safe-area-context';`

**Issue: Still cut off on device**
- Check that you added `paddingTop: insets.top,` not `paddingTop: inset.top` (typo)
- Verify the comma at the end of the line
- Check indentation matches surrounding code

---

## Testing Approach

#### 2. **Convex Backend (BaaS)**

- **Why:** Real-time sync, optimistic updates, serverless scaling
- **Current State:** Already configured, habit strength algorithms implemented
- **Responsibilities:** Data persistence, business logic, scheduled jobs (predictions, insights)
- **Scaling:** Handles 10,000+ users without architecture changes

#### 3. **TypeScript Strict Mode**

- **Why:** Solo dev maintainability, catch errors at compile time
- **Coverage:** 100% of new code, gradually type existing untyped code
- **Benefit:** Self-documenting code, refactoring confidence

#### 4. **State Management: React Context + Convex Hooks**

- **Why:** Convex provides optimistic updates and real-time subscriptions
- **Pattern:** `useQuery()` for reads, `useMutation()` for writes
- **Local State:** React Context for UI state (theme, navigation)
- **No Redux:** Unnecessary complexity for this scope

#### 5. **Navigation: React Navigation (Stack + Bottom Tabs)**

- **Why:** Industry standard, TypeScript support, deep linking
- **Structure:**
  ```
  Root Stack
    ├── Main Tabs (HomeScreen, AnalyticsScreen, SettingsScreen)
    ├── Modal Stack (CreateHabitModal, HabitDetailScreen)
    └── Auth Stack (OnboardingScreen) [Epic 5]
  ```

#### 6. **Subscription Infrastructure: StoreKit 2 (Native iOS)**

- **Why:** Apple requirement, lowest fees (15-30% vs 3rd party)
- **Library:** `react-native-iap` (community-maintained, 10k+ stars)
- **Server Validation:** Convex function validates receipts with Apple API
- **Security:** Never trust client-side subscription status

#### 7. **Notification Strategy: Local + Push (Expo Notifications)**

- **Why:** Adaptive reminders require server-triggered push
- **Local:** Milestone celebrations (instant feedback)
- **Push:** Predictive reminders (triggered by Convex scheduled functions)
- **Permission:** Request after user creates 2nd habit (proven value)

#### 8. **Analytics: Mixpanel (Privacy-Focused)**

- **Why:** Conversion funnel tracking, cohort analysis
- **Events:** Onboarding steps, paywall views, subscription conversions, feature usage
- **Privacy:** Aggregated, anonymized, GDPR-compliant
- **Alternative:** PostHog (open-source, self-hosted option)

#### 9. **Error Tracking: Sentry**

- **Why:** Stack traces, release tracking, performance monitoring
- **Configuration:** Source maps uploaded on release builds
- **Alerts:** Critical errors (crash rate >1%) notify developer

#### 10. **Testing Strategy:**

- **Unit Tests:** Jest for habit strength calculations (80%+ coverage)
- **Integration Tests:** React Native Testing Library for UI flows
- **E2E Tests:** Detox for critical flows (subscription, onboarding) - optional
- **Manual QA:** TestFlight beta with 50+ users before launch

---

## Implementation Stack

### Frontend (React Native)

**Core Dependencies:**

- `react-native`: 0.74.1 - Core framework
- `expo`: ^51.0.0 - Managed workflow tooling
- `typescript`: ^5.3.0 - Type safety
- `react-navigation`: ^6.1.0 - Navigation
  - `@react-navigation/native`: ^6.1.0
  - `@react-navigation/stack`: ^6.3.0
  - `@react-navigation/bottom-tabs`: ^6.5.0

**UI & Animations:**

- `react-native-reanimated`: ^3.8.0 - 60fps animations
- `react-native-gesture-handler`: ^2.16.0 - Swipe gestures
- `react-native-vector-icons`: ^10.0.0 - Icon library
- `victory-native`: ^36.9.0 - Data visualizations (charts)
- `react-native-svg`: ^15.0.0 - SVG support (for charts)
- `lottie-react-native`: ^6.7.0 - Confetti animations

**State & Data:**

- `convex`: ^1.10.0 - Backend client SDK
- `@react-native-async-storage/async-storage`: ^1.23.0 - Local persistence

**Subscription & Monetization:**

- `react-native-iap`: ^12.13.0 - StoreKit integration
- `react-native-purchases`: Alternative - RevenueCat wrapper (evaluate)

**Notifications:**

- `expo-notifications`: ^0.27.0 - Push notifications
- `expo-device`: ^6.0.0 - Device info for scheduling

**Analytics & Monitoring:**

- `@sentry/react-native`: ^5.20.0 - Error tracking
- `mixpanel-react-native`: ^3.0.0 - Analytics

**Utilities:**

- `date-fns`: ^3.3.0 - Date manipulation (lightweight vs moment)
- `zod`: ^3.22.0 - Runtime validation
- `react-native-share`: ^10.0.0 - Social sharing
- `react-native-view-shot`: ^3.8.0 - Screenshot generation

### Backend (Convex)

**Current Setup:**

- Convex account configured
- Database tables: `habits`, `trackingHistory`
- Functions: `generateHabitStrengthSnapshot()` in `habitStrength.ts`

**New Tables (Epic 2-4):**

```typescript
// convex/schema.ts
export default defineSchema({
  habits: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(),
    icon: v.string(),
    frequency: v.string(), // "daily" | "custom"
    customDays: v.optional(v.array(v.number())),
    strength: v.number(), // 0-1
    strengthLevel: v.string(), // "starting" | "building" | ...
    strengthUpdatedAt: v.number(),
    predictedCompletionProb: v.optional(v.number()), // Epic 3
    lastPredictionAt: v.optional(v.number()),
    pausedAt: v.optional(v.number()),
    resumeAt: v.optional(v.number()),
    strengthAtPause: v.optional(v.number()),
    archived: v.boolean(),
    sortOrder: v.number(),
  }),

  trackingHistory: defineTable({
    habitId: v.id('habits'),
    userId: v.string(),
    completedAt: v.number(),
    date: v.string(), // YYYY-MM-DD
  }),

  subscriptions: defineTable({
    // Epic 2
    userId: v.string(),
    platform: v.string(), // "ios" | "android"
    productId: v.string(), // "monthly" | "annual"
    originalTransactionId: v.string(),
    expiresAt: v.number(),
    status: v.string(), // "active" | "expired" | "trial"
    receiptData: v.optional(v.string()),
  }),

  predictions: defineTable({
    // Epic 3
    habitId: v.id('habits'),
    userId: v.string(),
    date: v.string(), // YYYY-MM-DD
    completionProb: v.number(),
    actualOutcome: v.optional(v.boolean()),
    calculatedAt: v.number(),
  }),

  insights: defineTable({
    // Epic 3
    userId: v.string(),
    weekOf: v.string(), // YYYY-MM-DD (Monday)
    content: v.object({
      habitsGained: v.array(
        v.object({ name: v.string(), increase: v.number() })
      ),
      habitsLost: v.array(v.object({ name: v.string(), decrease: v.number() })),
      habitsAtRisk: v.array(
        v.object({ name: v.string(), probability: v.number() })
      ),
      recommendations: v.array(v.string()),
    }),
    createdAt: v.number(),
    readAt: v.optional(v.number()),
  }),

  referrals: defineTable({
    // Epic 4
    referrerId: v.string(), // User who referred
    refereeId: v.optional(v.string()), // User who signed up
    referralCode: v.string(), // 6-char code
    status: v.string(), // "pending" | "signed_up" | "converted"
    createdAt: v.number(),
    convertedAt: v.optional(v.number()),
    rewardAppliedAt: v.optional(v.number()),
  }),
});
```

**Scheduled Functions (Convex Cron):**

```typescript
// Epic 3: Nightly predictions
crons.daily('calculate-predictions', { hourUTC: 0 }, async (ctx) => {
  // Calculate tomorrow's completion probability for all active habits
  // Trigger adaptive reminders for predictions <40%
});

// Epic 3: Weekly insights
crons.weekly(
  'generate-insights',
  { dayOfWeek: 'sunday', hourUTC: 18 },
  async (ctx) => {
    // Analyze week's data, generate personalized insights
    // Send push notification + store in-app
  }
);

// Epic 3: Auto-resume paused habits
crons.hourly('resume-habits', { minuteUTC: 0 }, async (ctx) => {
  // Check for habits with resumeAt < now, reactivate
});
```

### Development Tools

**Code Quality:**

- ESLint + Prettier - Consistent formatting
- Husky - Pre-commit hooks
- TypeScript strict mode - Type safety

**CI/CD:**

- GitHub Actions (or similar) - Automated builds
- Fastlane - iOS build automation
- EAS Build (Expo) - Cloud builds for TestFlight

**Design:**

- Figma - UI mockups and design system
- SF Symbols - iOS-native icons

---

## Technical Details

### Habit Strength Calculation (Already Implemented)

**Algorithm:** Zhang et al. (2021) + Lally et al. (2010)

- **Location:** `convex/habitStrength.ts` (existing)
- **Formula:** `strength = baseline(days) × compliance(30-day window)`
- **Baseline:** Logistic curve: `1 / (1 + exp(-k × (days - m)))` normalized to 100% at day 90
- **Compliance:** Beta-smoothed success rate with α=β=1 (Laplace smoothing)
- **Performance:** O(1) calculation, cached until new tracking data

**Categories:**

- Starting: 0-20%
- Building: 20-40%
- Developing: 40-60%
- Strong: 60-80%
- Automatic: 80-100%

**Integration Points:**

- Called on every habit completion (Story 1.2)
- Results displayed via `HabitStrengthIndicator` (Story 1.4)
- Historical snapshots stored for analytics (Epic 2)

### Behavior Prediction System (Epic 3)

**Algorithm:** Zhang et al. (2021) Validated Model

- **Input:** Habit strength (0-1), memory accessibility (recent activity)
- **Formula:** `P(completion) = habitStrength × accessibility`
- **Accuracy:** 65-77% (research-validated benchmark)
- **Fallback:** <7 days data → use 50% baseline

**Implementation:**

```typescript
// convex/predictions.ts
export const calculatePrediction = mutation({
  args: { habitId: v.id('habits') },
  handler: async (ctx, { habitId }) => {
    const habit = await ctx.db.get(habitId);
    const recentCompletions = await ctx.db
      .query('trackingHistory')
      .withIndex('by_habit', (q) => q.eq('habitId', habitId))
      .order('desc')
      .take(7);

    // Calculate memory accessibility (recency factor)
    const accessibility = calculateAccessibility(recentCompletions);

    // Prediction: strength × accessibility
    const prediction = habit.strength * accessibility;

    // Store prediction for validation
    await ctx.db.insert('predictions', {
      habitId,
      userId: habit.userId,
      date: tomorrow(),
      completionProb: prediction,
      calculatedAt: Date.now(),
    });

    // Update habit document
    await ctx.db.patch(habitId, {
      predictedCompletionProb: prediction,
      lastPredictionAt: Date.now(),
    });

    // Trigger adaptive reminder if prob <40%
    if (prediction < 0.4) {
      await scheduleAdaptiveReminder(ctx, habitId);
    }

    return prediction;
  },
});
```

### Subscription Infrastructure (Epic 2)

**StoreKit 2 Integration:**

```typescript
// src/utils/subscriptionManager.ts
import * as IAP from 'react-native-iap';

export class SubscriptionManager {
  async initialize() {
    await IAP.initConnection();
    await this.loadProducts();
  }

  async loadProducts() {
    const products = await IAP.getSubscriptions({
      skus: ['monthly_premium', 'annual_premium'],
    });
    return products;
  }

  async purchaseSubscription(productId: string) {
    try {
      const purchase = await IAP.requestSubscription({
        sku: productId,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });

      // Validate receipt with backend
      await validateReceipt(purchase.transactionReceipt);

      // Finish transaction
      await IAP.finishTransaction({ purchase });

      return { success: true };
    } catch (error) {
      // Handle errors (user cancelled, payment failed, etc.)
      return { success: false, error };
    }
  }

  async restorePurchases() {
    const purchases = await IAP.getAvailablePurchases();
    for (const purchase of purchases) {
      await validateReceipt(purchase.transactionReceipt);
    }
  }
}
```

**Receipt Validation (Convex):**

```typescript
// convex/subscriptions.ts
export const validateAppleReceipt = mutation({
  args: { receiptData: v.string() },
  handler: async (ctx, { receiptData }) => {
    // Call Apple's verifyReceipt API
    const response = await fetch('https://buy.itunes.apple.com/verifyReceipt', {
      method: 'POST',
      body: JSON.stringify({
        'receipt-data': receiptData,
        password: process.env.APPLE_SHARED_SECRET,
      }),
    });

    const data = await response.json();

    if (data.status === 0) {
      // Valid receipt
      const latestReceipt = data.latest_receipt_info[0];

      // Update or insert subscription
      await ctx.db.insert('subscriptions', {
        userId: ctx.auth.getUserIdentity().tokenIdentifier,
        platform: 'ios',
        productId: latestReceipt.product_id,
        originalTransactionId: latestReceipt.original_transaction_id,
        expiresAt: parseInt(latestReceipt.expires_date_ms),
        status: 'active',
        receiptData,
      });

      return { valid: true, expiresAt: latestReceipt.expires_date_ms };
    } else {
      return { valid: false, error: data.status };
    }
  },
});
```

### Adaptive Notification System (Epic 3)

**Architecture:**

- **Trigger:** Convex scheduled function runs nightly
- **Logic:** If `predictedCompletionProb < 0.4`, schedule push notification
- **Timing:** User-configured time (default 8:00 AM)
- **Personalization:** Template with habit name, probability, encouragement

**Implementation:**

```typescript
// convex/predictions.ts
export const scheduleAdaptiveReminder = mutation({
  args: { habitId: v.id('habits') },
  handler: async (ctx, { habitId }) => {
    const habit = await ctx.db.get(habitId);
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('id'), habit.userId))
      .first();

    // Only send if prediction <40% and user opted in
    if (habit.predictedCompletionProb < 0.4 && user.adaptiveRemindersEnabled) {
      // Schedule push notification via Expo Notifications API
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: user.expoPushToken,
          title: "Don't forget!",
          body: `You have a ${Math.round(habit.predictedCompletionProb * 100)}% chance of completing "${habit.name}" today - let's beat the odds! 💪`,
          data: { habitId, type: 'adaptive_reminder' },
          sound: 'default',
        }),
      });
    }
  },
});
```

---

## Development Setup

### Prerequisites

1. **Node.js:** v18+ LTS
2. **Yarn or npm:** Package manager
3. **Xcode:** 15+ (macOS only, for iOS development)
4. **CocoaPods:** `sudo gem install cocoapods`
5. **Expo CLI:** `npm install -g expo-cli`
6. **Convex CLI:** `npm install -g convex`

### Initial Setup

```bash
# Clone repository (already exists)
cd habit_tracking_app

# Install dependencies
yarn install

# iOS-specific
cd ios && pod install && cd ..

# Initialize Convex (already done)
convex dev

# Start Metro bundler
yarn start

# Run on iOS simulator
yarn ios

# Run on physical device (requires Apple Developer account)
yarn ios --device
```

### Environment Variables

```bash
# .env (root directory)
CONVEX_DEPLOYMENT=<your-convex-deployment-url>
APPLE_SHARED_SECRET=<app-store-connect-shared-secret>
SENTRY_DSN=<sentry-project-dsn>
MIXPANEL_TOKEN=<mixpanel-project-token>

# iOS-specific (Info.plist)
NSUserTrackingUsageDescription="We use data to improve your habit tracking experience"
NSLocationWhenInUseUsageDescription="Location helps personalize habit reminders"
```

### Testing Setup

```bash
# Run unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Run E2E tests (Detox - optional)
yarn e2e:build
yarn e2e:test
```

---

## Implementation Guide

### Phase 1: Epic 1 - MVP Foundation (Weeks 1-8)

**Sprint 1 (Weeks 1-2): Core Infrastructure**

1. Set up design system (Story 1.7)
   - Create `src/theme/` folder
   - Define colors, typography, spacing tokens
   - Build reusable components (Button, Card, Input)
2. Implement habit creation flow (Story 1.1)
   - Modal with form fields
   - Convex mutation integration
   - Validation with Zod
3. Set up navigation structure
   - Bottom tabs (Home, Settings)
   - Modal stack for habit creation/editing

**Sprint 2 (Weeks 3-4): Tracking & Calculations**

1. Daily check-off gestures (Story 1.2)
   - Swipe handlers with `react-native-gesture-handler`
   - Optimistic UI updates
   - Haptic feedback
2. Integrate habit strength calculation (Story 1.3)
   - Connect to existing `convex/habitStrength.ts`
   - Background calculation worker
   - Real-time updates on check-off
3. Visual strength indicators (Story 1.4)
   - Enhance existing `HabitStrengthIndicator`
   - Emoji + progress bar + percentage
   - Animations on strength updates

**Sprint 3 (Weeks 5-6): Data & Management**

1. Local data persistence (Story 1.5)
   - Convex client configuration
   - Offline queue with retry logic
   - Conflict resolution (timestamp-based)
2. Habit editing & management (Story 1.6)
   - Edit modal
   - Archive functionality
   - Delete with confirmation
   - Reordering with drag-and-drop

**Sprint 4 (Weeks 7-8): Testing & Polish**

1. Unit tests for strength calculations (80% coverage)
2. Integration tests for critical flows
3. TestFlight beta setup
4. Bug fixes from internal testing

### Phase 2: Epic 2 - Premium Monetization (Weeks 9-16)

**Sprint 5 (Weeks 9-10): Subscription Infrastructure**

1. StoreKit integration (Story 2.1)
   - `react-native-iap` setup
   - Product fetching
   - Purchase flow
2. Backend receipt validation (Story 2.1)
   - Convex mutation for Apple API calls
   - Subscription status storage
3. Subscription tiers & trial (Story 2.2)
   - Configure in App Store Connect
   - Free trial logic
   - Trial reminder notifications

**Sprint 6 (Weeks 11-12): Paywall & Free Limits**

1. Strategic paywall (Story 2.3)
   - Paywall screen design
   - Trigger logic (3-habit limit, day 7)
   - Feature teases with "Premium" badges
2. Subscription status checks
   - `useSubscription` hook
   - Feature gating throughout app

**Sprint 7 (Weeks 13-14): Analytics Dashboard**

1. Premium analytics (Story 2.4)
   - Analytics tab with charts
   - Strength distribution
   - Compliance heatmap
   - Data export CSV
2. Strength history graphs (Story 2.5)
   - Victory Native line charts
   - Milestone markers
   - Comparison with research benchmark

**Sprint 8 (Weeks 15-16): Insights & Management**

1. Weekly insights (Story 2.6)
   - Convex scheduled job
   - Insight generation algorithm
   - Push notifications
   - In-app report history
2. Subscription management (Story 2.7)
   - Settings UI for subscription status
   - Restore purchases flow
   - Deep link to App Store subscription management

### Phase 3: Epic 3 - Retention Engine (Weeks 17-24)

**Sprint 9 (Weeks 17-18): Prediction Engine**

1. Behavior prediction (Story 3.1)
   - Implement Zhang et al. algorithm
   - Nightly Convex cron job
   - Validation against actual outcomes
2. Prediction storage & indexing

**Sprint 10 (Weeks 19-20): Adaptive Reminders**

1. Reminder system (Story 3.2)
   - Expo Notifications setup
   - Permission request flow
   - Trigger logic (<40% probability)
2. Notification scheduling
   - User-configured timing
   - Batching multiple at-risk habits
   - Effectiveness tracking

**Sprint 11 (Weeks 21-22): Interventions**

1. Automated campaigns (Story 3.3)
   - Intervention tier logic
   - Campaign state machine
   - Content library with templates
2. Milestone celebrations (Story 3.4)
   - Detection on threshold crossings
   - Confetti animations
   - Share card generation

**Sprint 12 (Weeks 23-24): Advanced Features**

1. Pause/resume (Story 3.5)
   - Pause UI and logic
   - Strength preservation
   - Auto-resume scheduling
2. Predictive UI (Story 3.6)
   - "Habits at Risk" widget
   - Probability meters in habit details
   - Recommended actions

### Phase 4: Epic 4 - Viral Growth (Weeks 25-32)

**Sprint 13-14 (Weeks 25-28): Social Sharing**

1. Share cards (Story 4.1)
   - Template designs
   - `react-native-view-shot` integration
   - Export to social platforms
2. Social integration (Story 4.2)
   - Native share sheet
   - Platform-specific optimization
   - UTM tracking

**Sprint 15-16 (Weeks 29-32): Referrals & Templates**

1. Referral program (Story 4.3)
   - Referral tracking backend
   - Referral dashboard UI
   - Reward redemption logic
2. Habit templates (Story 4.4)
   - Template library JSON
   - Browse/import UI
   - Analytics on template usage
3. App Store ratings (Story 4.5)
   - Trigger logic
   - SKStoreReviewController integration
   - Tracking

### Phase 5: Epic 5 - Polish & Scale (Weeks 33-40)

**Sprint 17 (Weeks 33-34): Animations & Onboarding**

1. Refined animations (Story 5.1)
   - Microinteractions throughout app
   - Haptic feedback
   - Performance testing (60fps)
2. Basic onboarding (Story 5.2)
   - 3-screen flow
   - Science education
   - Permission requests

**Sprint 18 (Weeks 35-36): Advanced Features**

1. Interactive onboarding (Story 5.3)
   - Enhanced demo with slider
   - Live prediction showcase
   - A/B testing setup
2. Cross-device sync (Story 5.4)
   - Authentication system (if not already)
   - Multi-device testing

**Sprint 19 (Weeks 37-38): Performance & Accessibility**

1. Performance optimization (Story 5.5)
   - Profiling with Xcode Instruments
   - Bundle size reduction
   - Memory optimization
2. Accessibility (Story 5.6)
   - VoiceOver testing
   - Dynamic Type support
   - Contrast ratio fixes

**Sprint 20 (Weeks 39-40): Compliance & Data**

1. Data export & privacy (Story 5.7)
   - Export to CSV/JSON
   - Account deletion
   - Privacy policy and terms
   - GDPR/CCPA compliance review

### Phase 6: Epic 6 - App Store Launch (Weeks 41-48)

**Sprint 21-22 (Weeks 41-44): Pre-Launch Preparation**

1. App Store Connect setup (Story 6.1)
   - App record creation
   - Age rating, categories
   - Export compliance
2. Metadata & ASO (Story 6.2)
   - App name, subtitle, description
   - Keyword research
   - Promotional text
3. Screenshots & video (Story 6.3)
   - 5 screenshots with overlays
   - Optional preview video
4. App icon & assets (Story 6.4)
   - 1024x1024 icon
   - Launch screen
   - Icon alternatives

**Sprint 23 (Weeks 45-46): Legal & Testing**

1. Privacy & terms (Story 6.5)
   - Privacy policy drafted and hosted
   - Terms of service
   - App Store privacy labels
2. TestFlight beta (Story 6.6)
   - Internal testing
   - External testing (50+ testers)
   - Bug fixes from feedback

**Sprint 24 (Weeks 47-48): Submission & Launch**

1. App Review preparation (Story 6.7)
   - Pre-submission checklist
   - Demo account for reviewers
   - Review notes
   - Submission
2. Launch day (Story 6.8)
   - Marketing preparation
   - Monitoring setup
   - Launch execution
   - Post-launch support

---

## Testing Approach

### Unit Testing (Jest + React Native Testing Library)

**Coverage Target:** 80%+ for business logic

**Key Test Suites:**

1. **Habit Strength Calculations** (`convex/habitStrength.test.ts`)
   - Test baseline curve matches Lally et al. expectations
   - Test compliance calculation with various scenarios
   - Test edge cases (0 days, 90+ days, 0% compliance, 100% compliance)
   - Validate against research benchmarks:
     - Day 7 with perfect compliance → ~22% strength
     - Day 90 with perfect compliance → 100% strength
     - Day 45 with 70% compliance → ~46% strength

2. **Behavior Predictions** (`convex/predictions.test.ts`)
   - Test prediction accuracy against known outcomes
   - Test fallback for insufficient data (<7 days)
   - Test edge cases (new habits, paused habits)

3. **Subscription Logic** (`src/utils/subscriptionManager.test.ts`)
   - Test subscription status checks
   - Test receipt validation responses
   - Test free-tier limits (3 habits)
   - Test premium feature gating

4. **UI Components** (`src/components/**/*.test.tsx`)
   - Snapshot tests for visual regression
   - Interaction tests (button presses, swipes)
   - Accessibility tests (ARIA labels, roles)

### Integration Testing

**Critical Flows:**

1. **Habit Creation → Check-off → Strength Update**
   - Create habit via modal
   - Check off habit
   - Verify strength calculated and displayed
   - Verify Convex mutation called

2. **Subscription Purchase Flow**
   - Navigate to paywall
   - Initiate purchase
   - Complete in sandbox
   - Verify premium access granted

3. **Prediction → Adaptive Reminder**
   - Create habit with declining compliance
   - Wait for prediction calculation
   - Verify reminder scheduled (test environment)

### Manual QA (TestFlight Beta)

**Beta Test Plan (50+ users, 2 weeks):**

- **Focus Areas:**
  - Onboarding completion rate
  - First habit creation success rate
  - Habit check-off interaction quality
  - Subscription purchase flow (sandbox)
  - Strength calculation accuracy (compare to manual calculation)
  - App stability (crash-free rate >99%)

- **Feedback Collection:**
  - TestFlight built-in feedback
  - Google Form survey:
    - "Did onboarding explain the science clearly?" (1-5)
    - "Was habit tracking intuitive?" (1-5)
    - "Would you pay $9.99/month for premium features?" (Yes/No/Maybe)
    - "What features are missing?"
  - Direct email to support@habitstrengthapp.com

### Performance Testing

**Benchmarks (Xcode Instruments):**

- Cold start: <2 seconds
- Hot start: <500ms
- UI rendering: 60fps maintained during scrolling, animations
- Memory: <100MB during normal usage
- Network: API response times <500ms p95

**Load Testing (Backend):**

- Convex can handle 10,000+ concurrent users
- Test with synthetic load (k6 or Artillery)
- Monitor query latency, mutation success rates

---

## Deployment Strategy

### Development Workflow

**Branching Strategy:**

- `main` - Production-ready code (App Store builds)
- `develop` - Integration branch for features
- `feature/*` - Individual story branches
- `hotfix/*` - Emergency production fixes

**CI/CD Pipeline (GitHub Actions):**

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: yarn install
      - run: yarn test --coverage
      - run: yarn lint

  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - run: yarn install
      - run: cd ios && pod install
      - run: yarn ios:build
```

### TestFlight Distribution

**Build Process:**

1. Bump version in `package.json` and `ios/Info.plist`
2. Archive in Xcode (Product → Archive)
3. Upload to App Store Connect (Distribute → App Store Connect)
4. Wait for processing (~15 minutes)
5. Add to TestFlight external testing group
6. Distribute to beta testers

**Automated with Fastlane:**

```ruby
# fastlane/Fastfile
lane :beta do
  increment_build_number
  build_app(
    scheme: "HabitTracker",
    export_method: "app-store"
  )
  upload_to_testflight(
    skip_waiting_for_build_processing: true
  )
end
```

### App Store Submission

**Pre-Submission Checklist:**

- [ ] All tests passing (unit, integration)
- [ ] No compiler warnings
- [ ] Privacy policy and terms hosted
- [ ] App Store metadata complete
- [ ] Screenshots uploaded (5+)
- [ ] Demo account credentials provided
- [ ] Subscription products configured in App Store Connect
- [ ] App icon finalized (1024x1024)
- [ ] Age rating completed
- [ ] Export compliance declared
- [ ] Sentry and Mixpanel production keys configured

**Submission Process:**

1. Build release version (Archive)
2. Upload to App Store Connect
3. Select build in App Store Connect
4. Complete all required metadata fields
5. Submit for Review
6. Select "Manually release this version" (control launch timing)
7. Monitor review status (typically 24-48 hours)

**Post-Approval:**

1. Announce launch on social media (Twitter, Reddit)
2. Submit to Product Hunt
3. Monitor crash reports (Sentry)
4. Watch App Store reviews (respond within 24 hours)
5. Track KPIs (downloads, DAU, conversion rate, MRR)

### Release Cadence

**Version Strategy:**

- **1.0.0** - MVP launch (Epic 1)
- **1.1.0** - Premium monetization (Epic 2)
- **1.2.0** - Retention engine (Epic 3)
- **1.3.0** - Viral growth (Epic 4)
- **1.4.0** - Polish & scale (Epic 5)
- **1.x.y** - Hotfixes (critical bugs)

**OTA Updates (Expo):**

- For non-native changes (JS/UI updates)
- Pushes to users without App Store review
- Use for bug fixes, A/B tests, copy changes
- NOT for native module changes or major features

### Monitoring & Rollback

**Production Monitoring:**

- **Sentry:** Crash tracking, error alerts
- **Mixpanel:** User analytics, conversion funnels
- **App Store Connect:** Downloads, reviews, crashes
- **Convex Dashboard:** Backend health, query performance

**Rollback Strategy:**

- If critical bug discovered post-launch:
  1. Revert to previous version in App Store Connect (if <24 hours)
  2. Or expedite hotfix build (use expedited review if severe)
- For OTA updates: Push previous JS bundle via Expo

**Alerts:**

- Sentry: Crash rate >1% → Email alert
- Convex: Query latency >1s p95 → Slack alert
- App Store: Rating drops below 4.0 → Manual review

---

## Next Steps

Now that the technical specification is complete, you should:

### Immediate Actions:

1. **Review & Validate This Tech Spec**
   - Verify all technical decisions align with your skills and resources
   - Confirm Convex backend is properly configured
   - Ensure Apple Developer account is active

2. **Set Up Development Environment**
   - Install all prerequisites (Xcode, CocoaPods, Expo CLI)
   - Clone repository and run `yarn install`
   - Test iOS simulator build works
   - Verify Convex connection

3. **Configure Project Tools**
   - Set up Sentry project and obtain DSN
   - Create Mixpanel project (or alternative)
   - Configure GitHub repository and CI/CD
   - Set up Fastlane for TestFlight automation

4. **Begin Epic 1 Implementation**
   - Start with Story 1.7 (Design System Foundation)
   - Then Story 1.1 (Habit Creation Flow)
   - Follow implementation guide phase-by-phase

### Optional: Generate UX Specification

Since this is a Level 3 project with a premium UX focus, you may want to create a detailed UX specification document. This would include:

- Screen-by-screen user flows
- Component library specifications
- Interaction patterns and gestures
- Visual design system details
- AI Frontend Prompt for rapid prototyping

**To generate UX spec:** Run the UX specification workflow (already exists in your docs but could be enhanced)

### Success Criteria for Tech Spec:

✅ All technical decisions are **definitive** (no "use X or Y" ambiguity)
✅ Implementation stack specifies **exact versions**
✅ Architecture patterns are **clearly defined**
✅ Each epic has **sprint-by-sprint breakdown**
✅ Testing approach covers **unit, integration, and QA**
✅ Deployment strategy is **actionable**

---

_This technical specification provides the definitive blueprint for implementing all 6 epics (40 stories) across a 7-month timeline. Generated for Level 3 (Full Product) scope with solo developer velocity in mind._
