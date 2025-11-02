# Gamification & Monetization UX/UI Specification

_Generated on 2025-11-01 by Jane_

## Executive Summary

This specification defines the UX/UI implementation for gamification and monetization features designed to increase user engagement and drive subscription conversions for the habit tracking app. Inspired by Duolingo's proven engagement mechanics, this system combines loss aversion psychology, achievement systems, and delightful micro-interactions to create a compelling free-to-premium upgrade path.

**Key Features:**
- Lives/Hearts System (limited Streak Saves)
- Streak Freeze mechanic
- Habit Coins currency and Power-Ups
- Character progression with XP and Attributes
- Leagues and social competition
- Premium tier differentiation

**Strategic Goals:**
- Increase daily active user engagement by 40%
- Achieve 8-12% free-to-premium conversion rate
- Reduce churn through streak protection mechanics
- Create viral sharing moments through achievements

---

## 1. UX Goals & Principles

### 1.1 Target User Personas

**Primary Persona: "Achievement-Driven Amy"**
- **Demographics**: 28-38, productivity-focused professional
- **Goals**: Build better habits, track progress, achieve milestones
- **Pain Points**: Loses motivation after breaking streaks, needs external validation
- **Gamification Hooks**: Loves unlocking achievements, competitive by nature, shares victories
- **Monetization Trigger**: Values protection of progress (would pay for Streak Freeze)

**Secondary Persona: "Casual Chris"**
- **Demographics**: 22-45, dabbles in self-improvement
- **Goals**: Try habit tracking without commitment
- **Pain Points**: Forgets to check in, gives up easily
- **Gamification Hooks**: Responds to streak counters, likes simple rewards
- **Monetization Trigger**: Converts after experiencing loss (broken streak)

**Tertiary Persona: "Power User Paula"**
- **Demographics**: 30-50, serious behavior change enthusiast
- **Goals**: Deep insights, long-term tracking, maximum efficiency
- **Pain Points**: Wants advanced features, frustrated by limitations
- **Gamification Hooks**: Cares about data/stats more than cosmetics
- **Monetization Trigger**: Immediately sees value in Premium analytics

### 1.2 Usability Goals

1. **Instant Gratification** - Every positive action rewarded within 200ms
   - _Success Metric_: All animations complete within 500ms

2. **Progress Visibility** - Users always know their status
   - _Success Metric_: 0 clicks to see: current streak, XP, coins, league rank

3. **Loss Prevention Clarity** - Protection mechanics obvious before loss occurs
   - _Success Metric_: 95% users understand Streak Save system before first use

4. **Frictionless Premium Conversion** - Upgrade path <3 taps from any trigger point
   - _Success Metric_: <10 seconds from CTA to purchase screen

5. **Delightful Micro-Moments** - Celebrations feel rewarding, not annoying
   - _Success Metric_: <2% users disable animations in settings

### 1.3 Design Principles

**1. "Earn Before You Burn"**
Users must experience value before seeing paywalls. Free tier is genuinely useful; premium removes friction, not features.

**2. "Celebrate Wins, Cushion Losses"**
Success animations are exuberant (confetti, sounds, haptics). Failure states are gentle and supportive ("You can use a Streak Save!").

**3. "Visible Progress, Hidden Complexity"**
Complex systems (XP calculations, attribute formulas) run invisibly. Users see simple, clear progress bars and milestone badges.

**4. "FOMO Without Frustration"**
Limited resources (Streak Saves, Freezes) create urgency but never punishment. Free users can grind coins; Premium removes grinding.

**5. "Premium = Peace of Mind"**
Subscription value is stress reduction (unlimited saves, auto-freeze) not just features. Positioning: "Never worry about losing progress again."

---

## 2. Information Architecture

### 2.1 Site Map

```
Habit Tracking App
│
├─ 🏠 Home Screen (Habits List)
│   ├─ Habit Cards (with streak, XP indicators)
│   ├─ Top Bar: [Coins: 🪙 240] [Streak Saves: ❤️ 2/3] [Profile Avatar]
│   └─ Bottom Nav: [Home] [Character] [Leagues] [Shop] [Settings]
│
├─ 🦸 Character Screen
│   ├─ Avatar & Level (XP Progress Bar)
│   ├─ Attributes (Vitality, Strength, Wisdom, Energy)
│   ├─ Stats Cards (Streak, Power, Active Habits)
│   └─ Recent Achievements Feed
│
├─ 🏆 Leagues Screen
│   ├─ Current League Rank & Badge
│   ├─ Leaderboard (20 users)
│   ├─ Promotion/Demotion Zone Indicators
│   └─ [Premium CTA: Create Private League]
│
├─ 🛒 Power-Up Shop
│   ├─ Coin Balance Display
│   ├─ Available Power-Ups:
│   │   ├─ Streak Freeze (50 coins)
│   │   ├─ Extra Reminder (20 coins)
│   │   ├─ Custom Colors (30 coins)
│   │   └─ Analytics Snapshot (40 coins)
│   ├─ [Premium Exclusive Power-Ups] (locked with shimmer)
│   └─ Coin Earning Tips
│
├─ 💎 Premium Upgrade Screens
│   ├─ Feature Comparison Table
│   ├─ Pricing Tiers (Monthly/Annual)
│   ├─ 7-Day Free Trial CTA
│   └─ Testimonials / Social Proof
│
└─ ⚙️ Settings
    ├─ Gamification Preferences:
    │   ├─ Enable/Disable Animations
    │   ├─ Enable/Disable Sound Effects
    │   ├─ Notification Preferences
    │   └─ [Manage Subscription] (if Premium)
    └─ [Restore Purchases]
```

### 2.2 Navigation Structure

**Primary Navigation** (Bottom Tab Bar)
1. **Home** 🏠 - Habits list (default view)
2. **Character** 🦸 - XP, attributes, achievements
3. **Leagues** 🏆 - Social competition
4. **Shop** 🛒 - Power-ups and coins
5. **Settings** ⚙️ - Preferences and account

**Secondary Navigation Patterns:**

**In-Context CTAs:**
- Habit completion → Floating "+10 XP" animation → (tap) → Character screen
- Streak milestone → Modal celebration → "View Character" button
- Miss habit → "Use Streak Save" modal → Shop (if out of saves)
- League rank change → Toast notification → (tap) → Leagues screen

**Premium Upgrade Triggers:**
- Shop → "Premium Exclusive" items (locked state with shimmer)
- Character → "2x XP Boost" badge (Premium only)
- Leagues → "Create Private League" button
- Streak broken → "Never lose a streak again" CTA in failure modal

**Navigation Principles:**
- Maximum 2 taps to any feature
- Context-aware deep linking (notifications → specific screen)
- Back button always returns to Home (except within multi-step flows)
- Premium CTAs never block core functionality

---

## 3. User Flows

### 3.1 Flow: Habit Completion → XP Gain

**User Goal**: Complete a habit and see progress toward character level-up

**Entry Points**: Home screen habit card

**Flow Diagram**:

```mermaid
flowchart TD
    A[User taps habit card] --> B{Habit completed?}
    B -->|No| C[Checkmark animation]
    B -->|Yes| D[Uncheck animation]

    C --> E[Haptic: Medium impact]
    E --> F["+10 XP" floats up]
    F --> G[Coin earned animation: +10 🪙]
    G --> H{XP bar fills}

    H -->|Not full| I[Update XP bar smoothly]
    H -->|Bar full!| J[LEVEL UP sequence]

    I --> K[Update character stats]
    J --> L[XP bar explosion]
    L --> M[Level number rotates: 1→2]
    M --> N[Confetti cannon fires]
    N --> O[Modal: "⚡ LEVEL UP! ⚡"]
    O --> P[Show new attribute unlocked]
    P --> Q[User taps "Awesome!" button]

    K --> R[End: Return to Home]
    Q --> R
```

**Success Criteria**: User sees XP gain within 200ms, understands leveling system

**Error States**: None (always succeeds)

---

### 3.2 Flow: Streak Milestone Celebration

**User Goal**: Experience rewarding celebration for 7/30/100-day streaks

**Entry Points**: Habit completion that triggers milestone

**Flow Diagram**:

```mermaid
flowchart TD
    A[Habit completed] --> B{Check streak count}
    B -->|Day 7| C[Star Milestone 🎉]
    B -->|Day 30| D[Trophy Milestone 🏆]
    B -->|Day 100| E[Diamond Milestone 💎]
    B -->|Other| F[Regular completion]

    C --> G[Fire emoji 🔥 grows 1.5x]
    D --> G
    E --> G

    G --> H{Milestone type?}
    H -->|7-day| I[Star ⭐ drops & bounces]
    H -->|30-day| J[Trophy 🏆 spins down]
    H -->|100-day| K[Diamond 💎 materializes from particles]

    I --> L[Haptic: Heavy impact]
    J --> M[Haptic: Success pattern]
    K --> N[Haptic: 3x Heavy pulses]

    L --> O[Modal slides up]
    M --> O
    N --> O

    O --> P["Display: '🎉 [X]-Day Streak!'"]
    P --> Q[Badge enlarges with shimmer]
    Q --> R[Confetti falls matching milestone color]
    R --> S["+50/100 Bonus Coins!" animation]
    S --> T{100-day?}

    T -->|Yes| U[Auto level-up character]
    T -->|No| V[Show shareable card option]
    U --> V

    V --> W[User taps "Share" or "Continue"]
    W --> X{Share?}
    X -->|Yes| Y[Open share sheet]
    X -->|No| Z[Return to Home]
    Y --> Z

    F --> Z
```

**Success Criteria**: 100% of milestone celebrations trigger, user feels delighted

**Edge Cases**: Multiple milestones on same day (prioritize highest)

---

### 3.3 Flow: Miss Habit → Streak Save Decision

**User Goal**: Protect streak from breaking using Streak Save

**Entry Points**: Habit missed (not completed by midnight)

**Flow Diagram**:

```mermaid
flowchart TD
    A[Midnight: Habit incomplete] --> B{Has Streak Saves?}

    B -->|Yes: 1-3 saves| C[Modal appears with gentle animation]
    B -->|No saves| D[Streak broken flow]

    C --> E["Modal: 'You missed [Habit] 😢'"]
    E --> F["Show: Streak Saves: ❤️ 2/3"]
    F --> G["Buttons: [Use Streak Save] [Let It Go]"]

    G --> H{User choice?}
    H -->|Use Save| I[Deduct 1 save ❤️: 2→1]
    H -->|Let Go| D

    I --> J[Streak counter stays intact 🔥]
    J --> K[Toast: "Streak saved! You have 1 save remaining"]
    K --> L{Saves remaining = 0?}

    L -->|Yes| M[Show Premium CTA card]
    L -->|No| N[Return to Home]

    M --> O["Card: '♾️ Never run out of saves'"]
    O --> P["Button: [Upgrade to Premium]"]
    P --> Q{User taps upgrade?}
    Q -->|Yes| R[Navigate to Premium screen]
    Q -->|No| N
    R --> S[Premium conversion flow]

    D --> T[Fire emoji 🔥 flickers & fades to gray]
    T --> U["Modal: 'Your streak ended at [X] days'"]
    U --> V["'But you're still awesome! 💚'"]
    V --> W["Show: Best streak: [X] days 🏆"]
    W --> X["Button: [Start Fresh]"]
    X --> Y[Premium CTA: "Never lose a streak → Premium"]
    Y --> Z{User taps CTA?}
    Z -->|Yes| R
    Z -->|No| AA[Return to Home]

    S --> AA
    N --> AA
```

**Success Criteria**: 95% of users understand Streak Save before using it

**Edge Cases**: Last save used (show Premium upsell), Premium user (unlimited saves, no modal)

---

### 3.4 Flow: Free-to-Premium Conversion

**User Goal**: Upgrade to Premium subscription

**Entry Points**:
- Premium CTA buttons throughout app
- After streak break
- From Shop (locked premium items)
- From Leagues (private league button)

**Flow Diagram**:

```mermaid
flowchart TD
    A[User taps Premium CTA] --> B[Navigate to Premium screen]
    B --> C[Show hero section with value prop]
    C --> D[Feature comparison table]
    D --> E["Free: ✓ 3 Saves/week, 1 Freeze/month"]
    E --> F["Premium: ♾️ Unlimited Saves & Freezes"]
    F --> G[Pricing tiers display]

    G --> H["Monthly: $4.99/mo"]
    H --> I["Annual: $39.99/yr (17% off)"]
    I --> J["7-Day Free Trial CTA (prominent)"]
    J --> K[Social proof: Testimonials]

    K --> L{User scrolls to bottom?}
    L -->|No| M[Sticky footer: "Start 7-Day Trial"]
    L -->|Yes| M

    M --> N{User taps trial/purchase?}
    N -->|No| O[Exit screen]
    N -->|Yes| P{First time?}

    P -->|Yes| Q[Show trial: "7 days free, then $4.99/mo"]
    P -->|No| R[Show pricing: "$4.99/mo or $39.99/yr"]

    Q --> S[System payment sheet]
    R --> S

    S --> T{Payment authorized?}
    T -->|No| U["Error: 'Payment failed, try again'"]
    T -->|Yes| V[Success animation]

    U --> W[Return to pricing options]
    W --> N

    V --> X[Confetti celebration]
    X --> Y["Modal: '🎉 Welcome to Premium!'"]
    Y --> Z["Show unlocked features"]
    Z --> AA["Badge: ♾️ Unlimited Saves active"]
    AA --> AB["Button: [Explore Premium Features]"]
    AB --> AC{User choice?}
    AC -->|Explore| AD[Guided tour of premium features]
    AC -->|Skip| AE[Return to Home with Premium badge]

    AD --> AE
    O --> AE
```

**Success Criteria**: <10 seconds CTA → payment sheet, >8% conversion rate

**Error States**: Payment failure (clear retry), App Store connection issues

---

### 3.5 Flow: Power-Up Purchase (Coins)

**User Goal**: Buy power-up using earned Habit Coins

**Entry Points**: Shop tab, or "Out of Streak Freezes" notification

**Flow Diagram**:

```mermaid
flowchart TD
    A[User navigates to Shop] --> B[Display coin balance: 🪙 240]
    B --> C[Show available power-ups grid]

    C --> D[Streak Freeze: 50 coins]
    C --> E[Extra Reminder: 20 coins]
    C --> F[Custom Colors: 30 coins]
    C --> G[Analytics Snapshot: 40 coins]
    C --> H["Premium Exclusives (locked with shimmer)"]

    H --> I{User taps locked item?}
    I -->|Yes| J[Modal: "Premium Only"]
    I -->|No| K[Continue browsing]
    J --> L["CTA: Upgrade to unlock"]
    L --> M{Tap upgrade?}
    M -->|Yes| N[Navigate to Premium screen]
    M -->|No| K

    K --> O{User taps purchasable power-up}
    O -->|Yes| P{Check coin balance}

    P -->|Insufficient| Q["Toast: 'Need [X] more coins'"]
    P -->|Sufficient| R["Confirmation: Buy [Item] for [X] coins?"]

    Q --> S["Show: Earn coins by completing habits"]
    S --> T[Return to Shop]

    R --> U{User confirms?}
    U -->|No| T
    U -->|Yes| V[Deduct coins with animation]

    V --> W[Coins counter: 240 → 190]
    W --> X[Power-up activation animation]
    X --> Y{Power-up type?}

    Y -->|Streak Freeze| Z[Shield icon 🛡️ materializes]
    Y -->|Reminder| AA[Bell icon 🔔 with sparkles]
    Y -->|Color| AB[Color palette expands]
    Y -->|Analytics| AC[Chart unfolds]

    Z --> AD["Toast: 'Streak Freeze active for tomorrow'"]
    AA --> AE["Toast: 'Extra reminder set for 8 PM'"]
    AB --> AF["Navigate to color picker"]
    AC --> AG["Navigate to analytics"]

    AD --> AH[Return to Shop]
    AE --> AH
    AF --> AH
    AG --> AH

    N --> AH
    T --> AH
```

**Success Criteria**: Clear understanding of coin economy, <5% purchase errors

**Edge Cases**: Coin balance exactly matches price, multiple rapid purchases (debounce)

---

## 4. Component Library & Design System

### 4.1 Design System Approach

**Extending Existing System**: Gamification components extend the existing React Native + NativeWind design system with custom animated components.

**Technology Stack**:
- **Base**: React Native + NativeWind (Tailwind for React Native)
- **Animations**: React Native Reanimated v4
- **Haptics**: expo-haptics
- **Confetti**: react-native-confetti-cannon
- **Gradients**: expo-linear-gradient
- **Icons**: Lucide React Native + custom emoji

**New Component Categories**:
1. **Currency Components** - Coin counter, heart/save indicators, XP bars
2. **Celebration Components** - Milestone modals, confetti effects, badge reveals
3. **Character Components** - Avatar, attribute cards, level indicators
4. **League Components** - Leaderboard rows, rank badges, promotion zones
5. **Shop Components** - Power-up cards, purchase confirmations, locked state shimmers
6. **Premium Components** - Feature comparison tables, pricing cards, trial CTAs

### 4.2 Core Components

#### Currency & Progress Components

**1. CoinCounter**
```typescript
interface CoinCounterProps {
  balance: number;
  animated?: boolean;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void; // Navigate to Shop
}
```
- **States**: Default, Incrementing (green pulse), Decrementing (red pulse)
- **Variants**: Compact (home top bar), Large (shop header)
- **Animation**: Number flips like odometer, coin icon bounces on change

**2. StreakSaveIndicator**
```typescript
interface StreakSaveIndicatorProps {
  current: number; // 0-3 (or '∞' for Premium)
  max: number; // 3 for free users
  isPremium: boolean;
  onPress?: () => void;
}
```
- **States**: Full (3/3), Low (1/3 - yellow), Empty (0/3 - red), Premium (∞ - gold shimmer)
- **Variants**: Compact (top bar), Detailed (settings)
- **Animation**: Heart pulses when low, shimmer effect for Premium

**3. XPProgressBar**
```typescript
interface XPProgressBarProps {
  current: number;
  total: number;
  level: number;
  showRemaining?: boolean;
}
```
- **States**: Filling, Full (ready to level up), Overflowing
- **Variants**: Inline (character card), Full-width (level-up modal)
- **Animation**: Smooth fill with glow, explosion on level-up

#### Celebration Components

**4. MilestoneCelebrationModal**
```typescript
interface MilestoneCelebrationModalProps {
  milestoneType: 7 | 30 | 100;
  streak: number;
  bonusCoins: number;
  onDismiss: () => void;
  onShare?: () => void;
}
```
- **States**: Entering, Active, Exiting
- **Variants**: Star (7-day), Trophy (30-day), Diamond (100-day)
- **Animation**: Badge drops & bounces, confetti falls, background shimmer

**5. LevelUpModal**
```typescript
interface LevelUpModalProps {
  newLevel: number;
  newAttribute?: string;
  xpGained: number;
  onContinue: () => void;
}
```
- **States**: XP bar exploding, Level incrementing, Attribute unlocking
- **Animation**: Full-sequence as defined in Part B (3-second choreography)

#### Character Components

**6. AttributeCard**
```typescript
interface AttributeCardProps {
  name: string; // 'Vitality', 'Strength', 'Wisdom', 'Energy'
  value: number; // 0-100
  icon: React.ReactNode;
  gradientColors: [string, string];
  onPress?: () => void;
}
```
- **States**: Default, Increasing (glow), Level-up (+10 threshold)
- **Variants**: Compact (list), Expanded (detail view)
- **Animation**: Progress bar fills smoothly, value flips on increment

**7. CharacterAvatar**
```typescript
interface CharacterAvatarProps {
  emoji: string; // Default: 🦸
  level: number;
  size: 'small' | 'medium' | 'large';
  isPremium: boolean;
  showLevelBadge?: boolean;
}
```
- **States**: Default, Leveling-up (pulse), Premium (gold ring)
- **Variants**: Thumbnail (home), Medium (character screen), Large (level-up)
- **Animation**: Gentle breathing effect, level badge rotates on level-up

#### Shop Components

**8. PowerUpCard**
```typescript
interface PowerUpCardProps {
  name: string;
  description: string;
  costInCoins: number;
  icon: string;
  isPremiumOnly: boolean;
  isLocked: boolean;
  onPurchase: () => void;
}
```
- **States**: Available, Locked (shimmer), Purchasing, Purchased (checkmark)
- **Variants**: Grid item, List item, Featured (larger)
- **Animation**: Shimmer for locked, icon bounces on hover, purchase success checkmark

**9. PurchaseConfirmationModal**
```typescript
interface PurchaseConfirmationModalProps {
  itemName: string;
  cost: number;
  currentBalance: number;
  onConfirm: () => void;
  onCancel: () => void;
}
```
- **States**: Confirming, Processing, Success, Error
- **Animation**: Coin deduction counter, success confetti

#### Premium Components

**10. FeatureComparisonTable**
```typescript
interface FeatureComparisonTableProps {
  features: Array<{
    name: string;
    free: string | boolean;
    premium: string | boolean;
  }>;
  onUpgrade: () => void;
}
```
- **States**: Default, Scrolling (sticky header)
- **Variants**: Compact (modal), Full (dedicated screen)
- **Visual**: Green checkmarks for included, Red X for excluded, Gold highlights for Premium

**11. PricingCard**
```typescript
interface PricingCardProps {
  tier: 'monthly' | 'annual';
  price: string;
  savings?: string; // "17% off" for annual
  features: string[];
  isRecommended?: boolean;
  onSelect: () => void;
}
```
- **States**: Default, Selected (blue border), Processing
- **Variants**: Side-by-side (2 cards), Stacked (mobile)
- **Visual**: "BEST VALUE" badge for annual, subtle gradient backgrounds

---

## 5. Visual Design Foundation

### 5.1 Color Palette

**Extends existing warm beige base** with gamification-specific colors:

**Currency Colors:**
- Coins: `#F59E0B` (Amber 500) - Gold metallic feel
- Hearts (Streak Saves): `#EF4444` (Red 500) - Life/energy
- XP Bar: Gradient `#AD46FF` → `#F6339A` (Purple to Pink)

**Attribute Gradients** (from existing CharacterScreen):
- Vitality: `#FB2C36` → `#F6339A` (Red to Pink)
- Strength: `#FF6900` → `#FE9A00` (Orange to Amber)
- Wisdom: `#AD46FF` → `#615FFF` (Purple to Indigo)
- Energy: `#F0B100` → `#FF6900` (Yellow to Orange)

**League Tier Colors:**
- Bronze: `#CD7F32` with `#4A3728` text
- Silver: `#C0C0C0` with `#3F3F3F` text
- Gold: `#FFD700` with `#4A4A00` text
- Diamond: `#B9F2FF` with `#003D4F` text

**Premium Indicators:**
- Premium Badge: `#FFD700` (Gold) with shimmer effect
- Locked State: `#9CA3AF` (Gray 400) with `#F3F4F6` shimmer overlay

**State Colors:**
- Success: `#10B981` (Green 500)
- Warning (low resources): `#F59E0B` (Amber 500)
- Error: `#EF4444` (Red 500)
- Info: `#3B82F6` (Blue 500)

### 5.2 Typography

**Font Families:**
- **Primary**: System default (SF Pro on iOS, Roboto on Android)
- **Numbers** (coins, XP): System tabular-nums for smooth animations

**Type Scale** (Tailwind/NativeWind):

| Purpose | Class | Size | Weight | Usage |
|---------|-------|------|--------|-------|
| Hero Numbers | `text-4xl` | 36px | 700 | Level numbers, large counters |
| Section Headers | `text-xl` | 20px | 600 | "Attributes", "Power-Ups" |
| Card Titles | `text-lg` | 18px | 600 | Attribute names, Power-up titles |
| Body | `text-base` | 16px | 400 | Descriptions, feature lists |
| Small Labels | `text-sm` | 14px | 500 | "2/3 saves", "50 coins" |
| Captions | `text-xs` | 12px | 400 | Helper text, timestamps |

**Special Typography:**
- **XP Gains**: Bold, green gradient, floating animation
- **Premium Features**: Italic with gold accent
- **Coin Amounts**: Tabular nums for smooth increments

### 5.3 Spacing & Layout

**Spacing Scale** (Tailwind units):
- `gap-1` (4px): Tight inline elements (icon + text)
- `gap-2` (8px): Related content grouping
- `gap-3` (12px): Component internal spacing
- `gap-4` (16px): Default card padding
- `gap-6` (24px): Section separation
- `gap-8` (32px): Major section breaks

**Layout Grid**:
- **Home Top Bar**: 16px horizontal padding, 12px vertical
- **Bottom Nav**: 56px height, 5 equal-width tabs
- **Cards**: 16px padding, 12px border-radius
- **Modals**: 24px padding, 16px border-radius

**Touch Targets**: Minimum 44x44px (iOS HIG compliance)

---

## 6. Responsive Design

### 6.1 Breakpoints

**Mobile-First Approach** (React Native handles screen sizes):

| Device | Width | Adaptations |
|--------|-------|-------------|
| Small Phone | <375px | Single-column layouts, compact nav |
| Standard Phone | 375-428px | Default design target |
| Large Phone / Phablet | 428-600px | Slightly larger cards, more spacing |
| Tablet | 600-1024px | 2-column grids where applicable |

### 6.2 Adaptation Patterns

**Character Screen:**
- Phone: Stacked attribute cards (1 column)
- Tablet: 2-column grid for attributes

**Shop:**
- Phone: Vertical scroll, 1 power-up per row
- Tablet: 2-3 power-ups per row

**Leagues Leaderboard:**
- Phone: Condensed rows (avatar + name + score)
- Tablet: Expanded rows (+ additional stats)

**Modals:**
- Phone: Full-screen takeover with slide-up
- Tablet: Centered overlay (max-width: 500px)

**Navigation:**
- Phone: Bottom tab bar (always visible)
- Tablet: Side navigation (optional based on orientation)

---

## 7. Accessibility

### 7.1 Compliance Target

**WCAG 2.1 Level AA** compliance for all gamification features.

**Rationale**: Premium app positioning requires strong accessibility. Many productivity users rely on assistive technologies.

### 7.2 Key Requirements

**Visual Accessibility:**
- ✅ Color contrast ratio ≥ 4.5:1 for all text
- ✅ Focus indicators for all interactive elements
- ✅ Icons paired with text labels (not icon-only)
- ✅ Gradient overlays don't reduce text contrast
- ⚠️ Animations can be disabled in Settings

**Screen Reader Support:**
- All components have descriptive `accessibilityLabel`
- State changes announced ("Level up! You're now level 2")
- Coin balance announced on change ("240 coins, increased by 10")
- Premium features announced as "locked" or "premium only"

**Motor Accessibility:**
- Minimum 44x44px touch targets
- No required gestures (all actions have tap alternative)
- Haptic feedback supplements visual feedback (not replaces)
- Double-tap prevention (300ms debounce on purchases)

**Cognitive Accessibility:**
- Clear language (avoid jargon like "XP" without context)
- Confirmation dialogs for irreversible actions (purchases)
- Consistent iconography throughout
- Progress indicators for all loading states

**Reduced Motion:**
- Settings toggle: "Reduce animations"
- When enabled:
  - Crossfade instead of slide transitions
  - Instant state changes (no morphing animations)
  - Confetti disabled, simple checkmark shown
  - Level-up shown as modal without particles

---

## 8. Interaction & Motion

### 8.1 Motion Principles

**Based on Part B: Micro-Transitions Strategy**

1. **Instant Feedback** (0-100ms)
   - All user actions acknowledged within 100ms
   - Haptic feedback on press, not release

2. **Purposeful Motion** (100-500ms)
   - Every animation communicates state change
   - No motion for decoration only

3. **Exaggerated Delight** (500ms-2s)
   - Success moments are celebratory (confetti, particles)
   - Failures are gentle (no shake/rejection animations)

4. **Layered Feedback**
   - Visual + Haptic + (optional) Sound
   - Each layer can be disabled independently

5. **Spring Physics**
   - Default easing: `damping: 15, stiffness: 150`
   - Feels natural, not robotic
   - Inspired by iOS system animations

### 8.2 Key Animations

**(Full specifications in Part B documentation)**

**Tier 1: High-Frequency Animations**
- Habit completion checkmark (400ms total)
  - Scale: 0 → 1.2 → 1.0 (elastic spring)
  - Rotation: 0 → 360deg
  - Haptic: Medium impact
- Coin increment (800ms)
  - "+10" text floats up 40px
  - Fades opacity: 1 → 0
  - Number flips in counter

**Tier 2: Celebration Moments**
- Streak milestones (2-3s sequences)
  - 7-day: Star drops & bounces, gold confetti
  - 30-day: Trophy spins, orange confetti explosion
  - 100-day: Diamond materializes, rainbow confetti cannon
- Level-up (3s sequence)
  - XP bar explosion
  - Level number rotation (360deg)
  - Attribute unlock reveal
  - Confetti cannon

**Tier 3: Navigation & State Changes**
- Screen transitions: 300ms slide with cubic-bezier easing
- Modal presentations: 400ms slide-up with spring
- Tab switches: Crossfade 200ms

**Animation Library Setup:**
```typescript
// Animation constants
export const ANIMATION_DURATIONS = {
  instant: 100,
  fast: 200,
  normal: 400,
  slow: 800,
  celebration: 2000,
} as const;

export const SPRING_CONFIGS = {
  gentle: { damping: 20, stiffness: 100 },
  default: { damping: 15, stiffness: 150 },
  bouncy: { damping: 10, stiffness: 200 },
} as const;
```

**Performance Targets:**
- 60 FPS maintained during all animations
- No dropped frames on iPhone 12 or newer
- Animations use `useNativeDriver: true` where possible

---

## 9. Design Files & Wireframes

### 9.1 Design Files

**Recommended Figma File Structure:**

```
Gamification & Monetization Design System/
│
├─ 🎨 Design Tokens
│   ├─ Colors (currency, attributes, leagues, premium)
│   ├─ Typography Scale
│   ├─ Spacing System
│   └─ Animation Timings
│
├─ 🧩 Components
│   ├─ Currency (CoinCounter, StreakSaveIndicator, XPBar)
│   ├─ Celebration (Modals, Confetti Effects, Badges)
│   ├─ Character (Avatar, AttributeCard)
│   ├─ Shop (PowerUpCard, PurchaseModal)
│   └─ Premium (ComparisonTable, PricingCard)
│
├─ 📱 Screens
│   ├─ Home (with gamification overlay)
│   ├─ Character Screen
│   ├─ Leagues Screen
│   ├─ Shop Screen
│   ├─ Premium Upgrade Flow
│   └─ Modals (Milestone, Level-Up, Streak Save)
│
├─ 🔄 User Flows
│   ├─ Habit Completion → XP Gain (annotated)
│   ├─ Streak Milestone Celebration
│   ├─ Miss Habit → Save Decision
│   ├─ Free-to-Premium Conversion
│   └─ Power-Up Purchase
│
└─ 📐 Prototypes
    ├─ Animation Sequences (Lottie exports)
    ├─ Interactive Flows
    └─ Micro-Interaction Demos
```

**Design Tools:**
- **Primary**: Figma (collaborative, dev handoff via Figma Dev Mode)
- **Animations**: Lottie for complex celebrations (100-day milestone)
- **Prototyping**: Figma Interactive Components for flow validation

**Handoff Method:**
- Figma Dev Mode for inspect & export
- Lottie JSON files for celebration animations
- Design tokens exported as JSON for code generation

### 9.2 Key Screen Layouts

#### Screen 1: Home with Gamification Overlay

```
┌─────────────────────────────────────┐
│  🪙 240    ❤️ 2/3    🦸 Lvl 1     │ ← Top Bar
├─────────────────────────────────────┤
│                                     │
│  📝 [Habit Card 1] ✓               │
│     █████████░ 67%  🔥 12          │
│     +10 XP ↗ (floating)             │
│                                     │
│  💪 [Habit Card 2]                 │
│     ███████░░░ 54%  🔥 7 ⭐        │
│                                     │
│  🧘 [Habit Card 3] ⚠️              │
│     ██████░░░░ 38%  🔥 3           │
│                                     │
└─────────────────────────────────────┘
│ Home  Character  Leagues  Shop  ⚙️ │ ← Bottom Nav
└─────────────────────────────────────┘
```

**Key Elements:**
- Coin/Save counters always visible
- XP gains float up from completed habits
- Streak indicators with milestone badges
- Bottom nav with new tabs: Character, Leagues, Shop

#### Screen 2: Character Screen

```
┌─────────────────────────────────────┐
│  ← Character                        │
├─────────────────────────────────────┤
│  ╔═════════════════════════════╗   │
│  ║  🦸  Level 1  ✨           ║   │
│  ║  Habit Hero                 ║   │
│  ║  ██████████████░░░░░ 69/100 ║   │
│  ║  31 XP to Level 2           ║   │
│  ╚═════════════════════════════╝   │
│                                     │
│  Attributes                         │
│  ┌───────────────────────────┐     │
│  │ ❤️  Vitality       27     │     │
│  │ ██████░░░░░░░░░░░░        │     │
│  └───────────────────────────┘     │
│  ┌───────────────────────────┐     │
│  │ 💪 Strength        34     │     │
│  │ ████████░░░░░░░░░░        │     │
│  └───────────────────────────┘     │
│                                     │
│  🔥 7    ⚡ 69    🎯 3              │
│  Day     Total    Active            │
│  Streak  Power    Habits            │
│                                     │
│  Recent Achievements                │
│  ┌───────────────────────────┐     │
│  │ 🏆 Week Warrior           │     │
│  │ Complete all for 7 days   │     │
│  └───────────────────────────┘     │
└─────────────────────────────────────┘
```

**Key Elements:**
- XP bar prominent at top
- Attributes with gradient progress bars
- Stats cards show gamification metrics
- Recent achievements feed

#### Screen 3: Shop (Power-Ups)

```
┌─────────────────────────────────────┐
│  ← Shop          🪙 240 Coins       │
├─────────────────────────────────────┤
│                                     │
│  Power-Ups                          │
│                                     │
│  ┌─────────────────┐ ┌────────────┐│
│  │ 🛡️              │ │ ⏰         ││
│  │ Streak Freeze   │ │ Reminder   ││
│  │ 50 🪙           │ │ 20 🪙      ││
│  └─────────────────┘ └────────────┘│
│                                     │
│  ┌─────────────────┐ ┌────────────┐│
│  │ 🎨              │ │ 📊         ││
│  │ Custom Colors   │ │ Analytics  ││
│  │ 30 🪙           │ │ 40 🪙      ││
│  └─────────────────┘ └────────────┘│
│                                     │
│  Premium Only  ✨                   │
│  ┌─────────────────┐ (shimmer)     │
│  │ 🌟              │               │
│  │ 2x XP Boost     │ 🔒            │
│  │ Premium         │               │
│  └─────────────────┘               │
│                                     │
│  💡 Earn coins by completing        │
│     habits daily!                   │
└─────────────────────────────────────┘
```

**Key Elements:**
- Coin balance always visible
- Power-ups in grid layout
- Premium items locked with visual shimmer
- Earning tips at bottom

---

## 10. Next Steps

### 10.1 Immediate Actions

**Phase 1: Foundation (Week 1-2)**
1. ✅ Set up currency data models (Convex schemas)
   - `coins` field on user profile
   - `streakSaves` field (0-3 for free, unlimited for premium)
   - `xp`, `level`, `attributes` on user profile

2. ✅ Create core components
   - `CoinCounter` with animation
   - `StreakSaveIndicator` with state colors
   - `XPProgressBar` with glow effect

3. ✅ Implement XP system
   - Award +10 XP on habit completion
   - Calculate level from XP (level = floor(xp/100) + 1)
   - Trigger level-up modal when threshold crossed

**Phase 2: Gamification Features (Week 3-4)**
4. ✅ Character Screen implementation
   - Attribute calculations from habit data
   - Level display with XP progress
   - Stats cards (streak, power, active habits)

5. ✅ Milestone celebrations
   - Detect 7/30/100-day streaks
   - Trigger celebration modals
   - Award bonus coins

6. ✅ Streak Save system
   - Midnight check for missed habits
   - Modal for save decision
   - Deduct saves, show remaining count

**Phase 3: Monetization (Week 5-6)**
7. ✅ Shop screen + Power-Ups
   - Display purchasable power-ups
   - Coin deduction on purchase
   - Activate purchased power-ups

8. ✅ Premium upgrade flow
   - Feature comparison table
   - Pricing cards (monthly/annual)
   - 7-day trial integration
   - In-app purchase implementation

9. ✅ Premium feature gating
   - Unlimited streak saves for premium users
   - 2x XP boost for premium
   - Lock/unlock UI states

**Phase 4: Polish & Testing (Week 7-8)**
10. ✅ Animation refinement
    - Implement all animations from Part B spec
    - Performance optimization (60 FPS target)
    - Reduced motion alternative

11. ✅ Accessibility audit
    - Screen reader testing
    - Color contrast verification
    - Touch target sizing

12. ✅ A/B Testing preparation
    - Track conversion metrics
    - Set up analytics events
    - Prepare Premium CTA variations

### 10.2 Design Handoff Checklist

**Documentation Complete:**
- [x] User personas defined
- [x] User flows documented with Mermaid diagrams
- [x] Component specifications with TypeScript interfaces
- [x] Color palette with hex codes
- [x] Animation timings and easing functions
- [x] Accessibility requirements (WCAG AA)
- [x] Responsive breakpoints

**Design Assets Ready:**
- [ ] Figma file created with all screens
- [ ] Component library built in Figma
- [ ] Animation sequences prototyped
- [ ] Lottie files exported for complex animations
- [ ] Design tokens exported as JSON
- [ ] Icon set finalized (or using Lucide)

**Development Ready:**
- [x] Tech stack confirmed (React Native + Reanimated)
- [x] Component interfaces defined
- [x] Data model schemas specified
- [ ] API endpoints identified (if backend needed)
- [x] Analytics events listed
- [ ] Feature flags configured (for A/B testing)

**Next Workflow:**
- [ ] Generate AI Frontend Prompts (v0/Lovable)
- [ ] Create implementation task list
- [ ] Set up project tracking (Jira/Linear/GitHub Issues)
- [ ] Schedule design reviews
- [ ] Plan beta testing with early users

---

## Appendix

### Related Documents

- PRD: `docs/PRD.md`
- Epics: `docs/epics.md`
- Tech Spec: `docs/tech-spec.md`
- Main UX Spec: `docs/ux-specification.md`

### Version History

| Date       | Version | Changes               | Author |
| ---------- | ------- | --------------------- | ------ |
| 2025-11-01 | 1.0     | Initial specification | Jane   |
