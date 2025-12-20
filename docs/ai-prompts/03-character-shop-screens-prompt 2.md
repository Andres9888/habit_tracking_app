# AI Frontend Prompt: Character & Shop Screens

## Context
Building Character progression screen and Power-Up Shop for React Native habit tracking app. RPG-style attributes + in-app currency economy.

## Screen 1: Character Screen

### Layout Structure

```
┌─────────────────────────────────────┐
│  ← Character                        │ Header
├─────────────────────────────────────┤
│  ╔═════════════════════════════╗   │ Character Card
│  ║  🦸  Level 1  ✨           ║   │
│  ║  Habit Hero                 ║   │
│  ║  ██████████████░░░░░ 69/100 ║   │ XP Bar
│  ║  31 XP to Level 2           ║   │
│  ╚═════════════════════════════╝   │
│                                     │
│  Attributes                         │ Section Header
│  ┌───────────────────────────┐     │ Attribute Cards
│  │ ❤️  Vitality       27     │     │ (4 cards total)
│  │ ██████░░░░░░░░░░░░        │     │
│  └───────────────────────────┘     │
│                                     │
│  🔥 7    ⚡ 69    🎯 3              │ Stats Row
│  Day     Total    Active            │
│  Streak  Power    Habits            │
│                                     │
│  Recent Achievements                │ Section Header
│  ┌───────────────────────────┐     │ Achievement List
│  │ 🏆 Week Warrior           │     │
│  │ Complete all for 7 days   │     │
│  └───────────────────────────┘     │
└─────────────────────────────────────┘
```

### Components

**1. CharacterCard**
- White background, rounded-3xl (24px), shadow
- Gradient avatar (purple → pink)
- Level display with sparkle icon
- Title below avatar ("Habit Hero", "Streak Master", etc.)
- XP Progress Bar (reuse from previous prompt)
- Trophy badge with count (gold gradient button)

**Props:**
```typescript
interface CharacterCardProps {
  avatar: string; // emoji, default: 🦸
  level: number;
  title: string;
  xp: number;
  xpToNextLevel: number;
  trophyCount: number;
}
```

**2. AttributeCard**
- Compact card with icon, name, value, progress bar
- Icon in white circle with shadow
- Gradient progress bar (matches attribute type)
- Background gradient (subtle, 60% opacity)

**Attribute Configurations:**
```typescript
const ATTRIBUTES = {
  vitality: {
    icon: <Heart color="#FB2C36" />, // from lucide-react-native
    name: 'Vitality',
    gradientColors: ['#FB2C36', '#F6339A'],
    bgGradient: ['#FFE2E2', '#FDF2F8'],
  },
  strength: {
    icon: <Dumbbell color="#FF6900" />,
    name: 'Strength',
    gradientColors: ['#FF6900', '#FE9A00'],
    bgGradient: ['#FFEDD4', '#FFFBEB'],
  },
  wisdom: {
    icon: <Brain color="#AD46FF" />,
    name: 'Wisdom',
    gradientColors: ['#AD46FF', '#615FFF'],
    bgGradient: ['#F3E8FF', '#EEF2FF'],
  },
  energy: {
    icon: <Zap color="#F0B100" />,
    name: 'Energy',
    gradientColors: ['#F0B100', '#FF6900'],
    bgGradient: ['#FEF9C2', '#FFF7ED'],
  },
};
```

**Props:**
```typescript
interface AttributeCardProps {
  name: 'vitality' | 'strength' | 'wisdom' | 'energy';
  value: number; // 0-100
  maxValue: number; // 100
}
```

**3. StatCard**
- Small compact card
- Large emoji at top
- Number value (bold)
- Label below (small, gray)

```typescript
interface StatCardProps {
  emoji: string;
  value: number | string;
  label: string;
}
```

**4. AchievementCard**
- White rounded card
- Trophy icon in colored circle (left)
- Title + description (stacked, right)
- Achievement emoji (far right)

```typescript
interface AchievementCardProps {
  icon: string; // emoji
  title: string;
  description: string;
}
```

### Full Component

```typescript
interface CharacterScreenProps {
  user: {
    avatar: string;
    level: number;
    title: string;
    xp: number;
    xpToNextLevel: number;
    trophyCount: number;
  };
  attributes: {
    vitality: number;
    strength: number;
    wisdom: number;
    energy: number;
  };
  stats: {
    dayStreak: number;
    totalPower: number;
    activeHabits: number;
  };
  recentAchievements: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
  }>;
  onBack?: () => void;
}
```

---

## Screen 2: Shop Screen

### Layout Structure

```
┌─────────────────────────────────────┐
│  ← Shop          🪙 240 Coins       │ Header
├─────────────────────────────────────┤
│                                     │
│  Power-Ups                          │ Section
│                                     │
│  ┌─────────────┐ ┌─────────────┐   │ 2-column grid
│  │ 🛡️          │ │ ⏰          │   │
│  │ Freeze      │ │ Reminder    │   │
│  │ 50 🪙       │ │ 20 🪙       │   │
│  └─────────────┘ └─────────────┘   │
│                                     │
│  Premium Only  ✨                   │ Section
│  ┌─────────────┐ (shimmer effect)  │
│  │ 🌟          │ 🔒              │
│  │ 2x XP       │                 │
│  │ Premium     │                 │
│  └─────────────┘                   │
│                                     │
│  💡 Earn coins by completing        │ Footer tip
│     habits daily!                   │
└─────────────────────────────────────┘
```

### Components

**1. PowerUpCard**
- Rounded card (16px radius)
- Large icon/emoji at top (centered)
- Name below
- Price in coins at bottom
- Different states: available, locked, purchasing

**Visual States:**
```
Available:
- White background
- Full color icon
- Black text
- Coin icon + price (amber color)

Locked (Premium):
- Gray 100 background
- Desaturated icon
- Gray text
- Lock icon 🔒
- Shimmer overlay effect

Purchasing:
- Animated: scale pulse
- Loading spinner

Purchased:
- Green checkmark overlay (temporary, 1s)
- Then return to available state
```

**Props:**
```typescript
interface PowerUpCardProps {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  costInCoins: number;
  isPremiumOnly: boolean;
  isLocked: boolean;
  onPress: () => void;
}

// Power-up definitions
const POWER_UPS = [
  {
    id: 'streak-freeze',
    name: 'Streak Freeze',
    description: 'Protect your streak for one day',
    icon: '🛡️',
    costInCoins: 50,
    isPremiumOnly: false,
  },
  {
    id: 'extra-reminder',
    name: 'Extra Reminder',
    description: 'Get an additional reminder at 8 PM',
    icon: '⏰',
    costInCoins: 20,
    isPremiumOnly: false,
  },
  {
    id: 'custom-colors',
    name: 'Custom Colors',
    description: 'Unlock premium habit colors',
    icon: '🎨',
    costInCoins: 30,
    isPremiumOnly: false,
  },
  {
    id: 'analytics-snapshot',
    name: 'Analytics Snapshot',
    description: 'View detailed analytics for 24h',
    icon: '📊',
    costInCoins: 40,
    isPremiumOnly: false,
  },
  {
    id: 'xp-boost',
    name: '2x XP Boost',
    description: 'Double XP for 24 hours',
    icon: '🌟',
    costInCoins: 0,
    isPremiumOnly: true,
  },
];
```

**2. ShimmerOverlay (for locked items)**
- Animated gradient sweep
- Horizontal movement left → right
- 2 second loop, infinite
- Semi-transparent white (#FFFFFF at 30%)

```typescript
// Shimmer animation
const shimmer = useSharedValue(0);

useEffect(() => {
  shimmer.value = withRepeat(
    withTiming(1, { duration: 2000, easing: Easing.linear }),
    -1, // infinite
    false
  );
}, []);

const shimmerStyle = useAnimatedStyle(() => ({
  transform: [
    {
      translateX: interpolate(
        shimmer.value,
        [0, 1],
        [-100, 100],
        Extrapolate.CLAMP
      ),
    },
  ],
}));
```

**3. PurchaseConfirmationModal**
- Small centered modal
- Shows item being purchased
- Current balance and new balance
- Confirmation buttons

```typescript
interface PurchaseConfirmationModalProps {
  visible: boolean;
  item: PowerUp;
  currentBalance: number;
  onConfirm: () => void;
  onCancel: () => void;
}
```

**Modal Content:**
```
┌────────────────────────┐
│  Buy Streak Freeze?    │
│                        │
│  🛡️                    │
│                        │
│  Cost: 50 🪙           │
│  Balance: 240 → 190 🪙 │
│                        │
│  [Cancel]  [Confirm]   │
└────────────────────────┘
```

### Full Component

```typescript
interface ShopScreenProps {
  coinBalance: number;
  isPremium: boolean;
  ownedPowerUps: string[]; // IDs of owned power-ups
  onPurchase: (powerUpId: string) => Promise<void>;
  onUpgradeToPremium: () => void;
  onBack?: () => void;
}
```

---

## Animations

**Attribute Increment:**
- When attribute value increases (e.g., 34 → 35)
- Number flips (odometer style)
- Progress bar extends smoothly (800ms)
- Brief green highlight on value (200ms pulse)

**Power-Up Purchase Success:**
- Card scales up (1 → 1.1, 200ms)
- Green checkmark appears (scale 0 → 1.2 → 1.0)
- Confetti burst (small, 5-10 particles)
- Coin counter animates down
- Haptic: Medium impact

**Locked Item Tap:**
- Card shakes (gentle, 3x left-right, 50ms each)
- Modal appears: "Premium Only - Upgrade to unlock"
- Haptic: Light impact

---

## Navigation

**Character Screen:**
- Entry: Slide from right (300ms)
- Exit: Slide to right on back

**Shop Screen:**
- Entry: Slide from right
- Exit: Slide to right on back
- Purchase modal: Fade + scale entrance (200ms)

---

## Accessibility

**Screen Readers:**
- Attributes: "Vitality: 27 out of 100"
- Stats: "Day streak: 7 days"
- Power-ups: "Streak Freeze, costs 50 coins, [locked for premium only]"

**Touch Targets:**
- All cards: minimum 60px height
- Buttons: minimum 44x44px

**Reduced Motion:**
- Disable shimmer effect
- Use fade instead of slide transitions
- Instant progress bar updates

---

## Technical Requirements

**Dependencies:**
```json
{
  "lucide-react-native": "^0.545.0",
  "expo-linear-gradient": "~15.0.7",
  "react-native-reanimated": "~4.1.1"
}
```

**Performance:**
- ScrollView with staggered card animations
- Use FlatList for achievements (if >10 items)
- Memoize attribute cards (React.memo)
- Lazy load shop power-ups

---

## Success Criteria

1. ✅ Visually compelling character progression
2. ✅ Clear attribute representation with gradients
3. ✅ Shop feels like valuable marketplace
4. ✅ Premium items are visually distinct but not annoying
5. ✅ Smooth animations throughout

---

**AI Tool Instructions:**
- Build as full-screen navigable components
- Use ScrollView for main content
- Implement staggered entry animations (FadeInDown with delays)
- Use expo-linear-gradient for all gradients
- Include TypeScript interfaces
- Add accessibility labels to all interactive elements
