# AI Frontend Prompt: Celebration Modals & Animations

## Context
Building Duolingo-style celebration moments for a React Native habit tracking app. Need modals with confetti, particles, and multi-stage animation sequences.

## Components to Build

### 1. MilestoneCelebrationModal Component

**Purpose:** Celebrate 7/30/100-day streaks with delightful animations

**Visual Design:**
- Full-screen modal with semi-transparent backdrop (black 40%)
- White rounded card (24px border-radius, max-width: 340px)
- Centered content with vertical layout
- Backdrop blur on iOS (expo-blur)

**Content Hierarchy:**
1. Badge icon (⭐ / 🏆 / 💎) - drops & bounces
2. Title: "🎉 [X]-Day Streak!"
3. Subtitle: Milestone name ("Star Streak" / "Trophy Streak" / "Diamond Streak")
4. Bonus coins animation: "+50 Coins!" / "+100 Coins!"
5. Shareable card preview (optional)
6. Buttons: [Share] [Continue]

**Animation Sequence (3 phases, 2-3 seconds total):**

**Phase 1: Entry (0-500ms)**
- Modal slides up from bottom with spring
- Backdrop fades in
- Fire emoji 🔥 grows 1.5x with pulse

**Phase 2: Badge Reveal (500-1500ms)**
```
For 7-day (⭐):
  - Star drops from top
  - Bounces 2 times (decreasing height)
  - Settles with rotation
  - Gold confetti falls (15-20 particles)
  - Haptic: Heavy impact on landing

For 30-day (🏆):
  - Trophy spins while descending (360deg)
  - Orange/gold confetti explosion (30-40 particles)
  - Screen flash effect (white 30% → 0%, 200ms)
  - Haptic: Success pattern (3 light impacts)

For 100-day (💎):
  - Diamond materializes from particles
  - Rotates slowly with prism effect
  - Rainbow confetti cannon (60+ particles)
  - Screen: Rainbow gradient overlay
  - Haptic: Custom pattern (3 heavy pulses)
```

**Phase 3: Content Reveal (1500-2000ms)**
- Title fades in with scale (0.9 → 1.0)
- Coins counter counts up from 0 → 50/100
- Buttons fade in
- Confetti continues falling

**Code Interface:**
```typescript
interface MilestoneCelebrationModalProps {
  visible: boolean;
  milestoneType: 7 | 30 | 100;
  currentStreak: number;
  bonusCoins: number;
  onDismiss: () => void;
  onShare?: () => void;
}
```

**Confetti Configuration:**
```typescript
const CONFETTI_CONFIG = {
  7: {
    count: 20,
    colors: ['#FFD700', '#FFA500', '#FFED4E'], // Gold/yellow
    duration: 2000,
  },
  30: {
    count: 40,
    colors: ['#FF6900', '#FE9A00', '#FFD700'], // Orange/gold
    duration: 3000,
  },
  100: {
    count: 80,
    colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'], // Rainbow
    duration: 4000,
  },
};
```

---

### 2. LevelUpModal Component

**Purpose:** Celebrate character level-up with epic sequence

**Visual Design:**
- Similar full-screen modal structure
- Purple gradient background (#AD46FF → #F6339A)
- Larger hero section for level badge

**Content:**
1. "⚡ LEVEL UP! ⚡" title (animated)
2. Level badge: "1" → "2" with rotation
3. "You're now Level 2!" subtitle
4. New attribute unlock (if applicable)
5. Confetti explosion
6. [Awesome!] button

**Animation Sequence (3 seconds):**

**Phase 1: Bar Full Recognition (0-300ms)**
- XP bar flashes gold 3x (pulse animation)
- Haptic: Heavy impact
- Screen shake (5px amplitude, 3 oscillations)

**Phase 2: Explosion (300-1000ms)**
- XP bar explodes into particles (30-40 particles)
- Particles scatter radially and fade
- Level number scales 1 → 0 (fade out)

**Phase 3: New Level Reveal (1000-2000ms)**
- New level number appears (scale 0 → 1.2 → 1.0)
- Number rotates 360deg during entrance
- Gold glow effect behind number
- Confetti cannon fires
- Haptic: Medium impact

**Phase 4: Attribute Unlock (2000-3000ms, if new attribute)**
- Modal slides up: "New Attribute Unlocked!"
- Attribute card slides in from right
- Progress bar fills 0 → starting value
- Haptic: Light impact

**Code Interface:**
```typescript
interface LevelUpModalProps {
  visible: boolean;
  oldLevel: number;
  newLevel: number;
  newAttribute?: {
    name: string; // 'Wisdom', 'Energy', etc.
    icon: React.ReactNode;
    startingValue: number;
  };
  xpGained: number;
  onContinue: () => void;
}
```

---

### 3. StreakSaveDe​cisionModal Component

**Purpose:** Gentle, supportive modal when user misses a habit

**Visual Design:**
- White card with soft shadows
- Warm, empathetic color scheme
- Small, non-intimidating size (max-width: 320px)

**Content:**
1. Emoji: 😢 (but not too sad)
2. Title: "You missed [Habit Name]"
3. Body: "Your [X]-day streak is at risk"
4. Saves display: "Streak Saves: ❤️ 2/3"
5. Buttons: [Use Streak Save] (primary) [Let It Go] (secondary)

**Behavior:**
- Appears with gentle slide-up (no harsh entrance)
- No harsh colors or aggressive animations
- Supportive tone in copy
- If saves = 0, show different content:
  - "Your streak ended at [X] days"
  - "But you're still awesome! 💚"
  - "Best streak: [X] days 🏆"
  - [Start Fresh] button
  - Premium CTA: "Never lose a streak → Premium"

**Animation:**
- Gentle entrance: slide up 300ms with spring
- Heart icons pulse when showing remaining saves
- NO failure animations (no shake, no red flash)

**Code Interface:**
```typescript
interface StreakSaveDecisionModalProps {
  visible: boolean;
  habitName: string;
  currentStreak: number;
  savesRemaining: number;
  maxSaves: number;
  onUseSave: () => void;
  onLetGo: () => void;
  onUpgrade?: () => void; // Premium CTA
}
```

---

## Shared Components

### ConfettiCannon (using react-native-confetti-cannon)

```typescript
interface ConfettiCannonProps {
  active: boolean;
  count: number;
  colors: string[];
  duration: number;
  explosionSpeed?: number; // default: 350
  fallSpeed?: number; // default: 3000
}

// Usage
<ConfettiCannon
  active={showConfetti}
  count={CONFETTI_CONFIG[milestoneType].count}
  colors={CONFETTI_CONFIG[milestoneType].colors}
  duration={CONFETTI_CONFIG[milestoneType].duration}
/>
```

### FloatingXPText (for habit completion)

**Visual:**
- "+10 XP" text
- Bold, green gradient (#10B981)
- Floats up 40px from habit card
- Fades opacity 1 → 0 over 800ms

```typescript
interface FloatingXPTextProps {
  value: number; // 10, 50, 100
  startPosition: { x: number; y: number };
  onComplete: () => void;
}
```

---

## Animation Library

```typescript
// Shared animation utilities
export const CELEBRATION_ANIMATIONS = {
  modalEntrance: {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  },
  badgeDrop: {
    duration: 600,
    bounceHeight: [0, 100, 20, 80, 10, 50, 0], // Bounce decay
  },
  rotation360: {
    duration: 800,
    easing: Easing.inOut(Easing.cubic),
  },
  scaleSpring: {
    damping: 10,
    stiffness: 200,
  },
};

// Haptic patterns
export const HAPTIC_PATTERNS = {
  milestone7: Haptics.ImpactFeedbackStyle.Heavy,
  milestone30: Haptics.NotificationFeedbackType.Success,
  milestone100: [
    Haptics.ImpactFeedbackStyle.Heavy,
    Haptics.ImpactFeedbackStyle.Heavy,
    Haptics.ImpactFeedbackStyle.Heavy,
  ], // Custom pattern (trigger 3x with delays)
  levelUp: Haptics.ImpactFeedbackStyle.Heavy,
};
```

---

## Design System Colors

```typescript
export const CELEBRATION_COLORS = {
  gold: ['#FFD700', '#FFA500', '#FFED4E'],
  orange: ['#FF6900', '#FE9A00', '#FFD700'],
  rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'],
  purple: ['#AD46FF', '#F6339A'],
  backdrop: 'rgba(0, 0, 0, 0.4)',
  cardBackground: '#FFFFFF',
};
```

---

## Accessibility

**Screen Reader Announcements:**
- Milestone: "Milestone achieved! [X]-day streak! You earned [Y] bonus coins"
- Level Up: "Level up! You're now level [X]. New attribute unlocked: [Name]"
- Streak Save: "You missed [Habit]. Use a Streak Save to protect your [X]-day streak?"

**Reduced Motion:**
- Disable confetti
- Use fade transitions instead of slides
- Show static badges instead of drops/spins
- Instant state changes

---

## Technical Requirements

**Dependencies:**
```json
{
  "react-native-reanimated": "~4.1.1",
  "react-native-confetti-cannon": "^1.5.2",
  "expo-haptics": "~15.0.7",
  "expo-blur": "~15.0.7"
}
```

**Performance:**
- Confetti runs on UI thread (useNativeDriver)
- Particle animations use Skia for 60 FPS
- Stagger animations to prevent frame drops
- Cleanup particles after animation completes

---

## Success Criteria

1. ✅ Celebrations feel joyful and rewarding (not cheesy)
2. ✅ Animations are smooth (60 FPS, no dropped frames)
3. ✅ Haptic feedback enhances the experience
4. ✅ Failure states are gentle and supportive
5. ✅ Accessible to all users (reduced motion support)

---

**AI Tool Instructions:**
- Build self-contained modal components
- Use React Native Modal with transparent backdrop
- Implement animation sequences with useEffect + setTimeout chains
- Add cleanup logic in useEffect return functions
- Include TypeScript types and prop validation
- Add inline comments for complex animation choreography
