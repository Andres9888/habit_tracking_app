# Story: Add Habit Limit Badge for Monetization

## Overview
- **ID**: CH-004
- **Priority**: Medium
- **Effort**: Small (1-2 hours)
- **Dependencies**: Premium/subscription state access

## User Story
As a free user, I want to see how many habits I have left so I'm not surprised by the paywall.

## Acceptance Criteria
- [ ] Badge shows "X of 3 free habits" in modal header
- [ ] Badge only appears for free users
- [ ] Badge hidden for premium users
- [ ] Tapping badge shows upgrade prompt
- [ ] Badge style is subtle, not alarming

## Tasks

### T1: Create HabitLimitBadge Component
**File**: `src/components/CreateHabitModal/components/HabitLimitBadge.tsx`
```tsx
interface HabitLimitBadgeProps {
  currentCount: number;
  maxFree: number;
  isPremium: boolean;
  onPress: () => void;
}
```
- Pill-shaped badge: "2 of 3 free"
- Color: neutral (slate) normally, amber when at limit
- Small size, doesn't dominate header

### T2: Get Habit Count from Store/Context
**File**: `src/components/CreateHabitModal/hooks/useCreateHabitModal.ts`
- Query current habit count from Convex
- Get premium status from user context
- Pass to modal component

### T3: Integrate into ModalHeader
**File**: `src/components/CreateHabitModal/components/ModalHeader.tsx`
- Add `habitLimitBadge` prop or render inline
- Position to right of title or below title
- Hide in edit mode (not creating new habit)

### T4: Add Upgrade Prompt Handler
- On badge tap → show premium modal/sheet
- Or navigate to subscription screen
- Track analytics event: `habit_limit_badge_tapped`

## Testing Checklist
- [ ] Badge shows correct count (0/3, 1/3, 2/3, 3/3)
- [ ] Badge hidden for premium users
- [ ] Badge hidden in edit mode
- [ ] Tap badge → upgrade prompt appears
- [ ] At limit (3/3) → badge shows amber color
- [ ] Over limit → prevent creation + show upgrade

## Design Reference
```
┌─────────────────────────────────────────┐
│ Create Habit              ┌───────────┐ │
│                           │ 2/3 free  │ │
│                           └───────────┘ │
└─────────────────────────────────────────┘

At limit:
┌─────────────────────────────────────────┐
│ Create Habit              ┌───────────┐ │
│                           │ 3/3 ⚠️    │ │
│                           └───────────┘ │
└─────────────────────────────────────────┘
```

## Copy Variants
- Default: "2 of 3 free"
- At limit: "Limit reached"
- Premium: (hidden)
