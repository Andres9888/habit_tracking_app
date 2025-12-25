# Empty Habits Page Monetization Spec

## Overview

Redesign the empty habits page to maximize monetization while maintaining excellent user experience. The goal is to convert free users into paying subscribers by demonstrating value and creating natural upgrade paths.

## Current State

The empty habits page currently shows:

1. Welcome hero with greeting
2. Import templates card (moved to top with "POPULAR" badge) ✅
3. Section divider "Or pick one to start now" ✅
4. Quick-start habit grid (2x2) with pulsing tap indicators ✅
5. Custom habit card
6. Helper row (quiz, remind later)

## Proposed Improvements

### Phase 1: Quick Wins (High Impact, Low Effort)

#### 1.1 Social Proof Numbers

**Location:** Import card or welcome hero
**Content:** "12,847 users started this week"
**Why:** Social proof increases conversion 15-30%

```tsx
// Add to TemplatesPeekCard
<Text className='mt-2 text-xs text-stone-500'>
  12,847 users started this week
</Text>
```

#### 1.2 Habit Preview in Import Card

**Current:** "Import science-backed habits" (abstract)
**Proposed:** Show actual habit emojis from the pack

```
┌─────────────────────────────────────┐
│  ⭐ POPULAR                         │
│  Morning Momentum                   │
│  💪 🍋 🧘 📝 📵  ← 5 habits         │
│  [Get started →]                    │
└─────────────────────────────────────┘
```

**Why:** Concrete value > abstract promise

#### 1.3 Pro Trial Banner

**Location:** Below welcome hero or as footer
**Content:** "🎁 New user bonus: 7 days Pro free"
**Why:** Creates urgency, lowers barrier to try premium

### Phase 2: Premium Gating (Medium Effort, High Revenue)

#### 2.1 Template Pack Tiers

- **Free packs:** Morning Momentum, Evening Wind-Down
- **Pro packs:** Productivity Reset, Fitness Journey, Mindfulness Path

**UI Treatment:**

```
┌─────────────────────────────────────┐
│  🧪 Productivity Reset              │
│  🔒 PRO                             │
│  Unlock with 7-day free trial       │
└─────────────────────────────────────┘
```

#### 2.2 Habit Limit Indicator

**Free tier:** 3 habits max
**Pro tier:** Unlimited habits

Show at empty state:

```
"Free: 3 habits | Pro: Unlimited"
```

### Phase 3: Guided Journeys (Higher Effort, Highest Revenue)

Reframe "Import habits" as "Start a Journey" following the Fabulous app model.

#### 3.1 Journey Structure

```
┌─────────────────────────────────────┐
│  🚀 START YOUR JOURNEY              │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │ 🌅 7-Day Morning Momentum   │    │
│  │ Build your AM routine       │    │
│  │ [FREE] ← Start Here         │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🧠 14-Day Focus Reset       │    │
│  │ Master deep work            │    │
│  │ [PRO] 🔒 7-day free trial   │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

#### 3.2 Journey Benefits

- Reduces decision fatigue (app guides user)
- Creates commitment (multi-day investment)
- Natural paywall (Journey 1 free, others paid)
- Higher perceived value than "template packs"

### Phase 4: Future Enhancements

#### 4.1 Success Preview

Show 30-day progress visualization:

- Calendar with green streaks
- "🔥 30 day streak" badge
- Achievement badges preview

#### 4.2 Anti-Failure Positioning

Ask: "What habit have you tried and failed at?"
Then show tailored solution with social proof.

#### 4.3 Commitment Level Selector

```
Choose your commitment:
[ Casual ] [ Regular ] [ Serious ] [ Intense (Pro) ]
```

#### 4.4 Referral Program

"Invite a friend → Both get 30 days Pro free"

## Premium Features to Mention

Plant seeds at empty state for later conversion:

| Feature           | Description                       | When User Pays              |
| ----------------- | --------------------------------- | --------------------------- |
| Streak Recovery   | Miss a day, don't lose streak     | After 7+ day streak         |
| Smart Reminders   | AI learns optimal reminder times  | When they miss habits       |
| AI Coach          | Personalized tips and adjustments | When motivation drops       |
| Progress Insights | Detailed analytics and trends     | When curious about patterns |
| Unlimited Habits  | No cap on habit count             | When they hit 3-habit limit |

## Implementation Priority

| Phase | Items                                     | Effort | Impact  | Timeline |
| ----- | ----------------------------------------- | ------ | ------- | -------- |
| 1     | Social proof, habit preview, trial banner | Low    | Medium  | Week 1   |
| 2     | Premium pack gating, habit limit          | Medium | High    | Week 2-3 |
| 3     | Guided Journeys system                    | High   | Highest | Week 4-6 |
| 4     | Success preview, referral                 | Medium | Medium  | Future   |

## Success Metrics

- **Primary:** Template import rate (target: +50%)
- **Secondary:** Pro trial start rate (target: 20% of new users)
- **Tertiary:** Day-7 retention (target: +25%)
- **Revenue:** Pro conversion rate (target: 5% of trial users)

## Technical Considerations

### Data Requirements

- Track template pack usage by user
- Store user's "commitment level" selection
- Track journey progress (day X of Y)
- A/B testing infrastructure for conversion optimization

### Backend Changes

- Add `isPremium` flag to template packs in Convex schema
- Add `userTier` field to user document
- Add `journeyProgress` table for guided journeys
- Add `trialEndDate` for Pro trial tracking

### Frontend Changes

- Update `HabitsEmptyState.tsx` with new components
- Create `ProTrialBanner` component
- Create `JourneyCard` component
- Update `TemplatesPeekCard` with habit preview
- Add premium lock icon component

## Files to Modify

- `src/features/habits/components/HabitsEmptyState.tsx`
- `src/screens/TemplatesScreen.tsx`
- `convex/templates.ts`
- `convex/schema.ts`

## Open Questions

1. What should the Pro pricing be? ($4.99/month, $29.99/year, $49.99 lifetime?)
2. Should free trial require credit card upfront?
3. How many free template packs should be available?
4. Should Journeys be a separate feature or replace template packs?

## Implementation Tasks

### Phase 1: Quick Wins

- [ ] Add social proof text to TemplatesPeekCard ("12,847 users started this week")
- [ ] Add habit emoji preview to Import card (💪🍋🧘📝📵)
- [ ] Create `ProTrialBanner` component with "🎁 7 days Pro free" messaging
- [ ] Add ProTrialBanner to HabitsEmptyState below welcome hero

### Phase 2: Premium Gating

- [ ] Add `isPremium` boolean field to template packs in Convex schema
- [ ] Add `userTier` field to user document in Convex schema
- [ ] Create premium lock icon component for Pro packs
- [ ] Update TemplatesScreen to show free vs Pro pack distinction
- [ ] Implement 3-habit limit for free tier users
- [ ] Add "Free: 3 habits | Pro: Unlimited" indicator to empty state

### Phase 3: Guided Journeys

- [ ] Create `journeyProgress` table in Convex schema
- [ ] Add `trialEndDate` field to user document
- [ ] Create `JourneyCard` component with progress tracking
- [ ] Rename "Import habits" to "Start a Journey" in UI
- [ ] Implement 7-Day Morning Momentum as free journey
- [ ] Implement 14-Day Focus Reset as Pro journey
- [ ] Add journey selection UI to HabitsEmptyState

### Phase 4: Future Enhancements

- [ ] Create success preview visualization (30-day calendar mockup)
- [ ] Implement "What habit have you failed at?" onboarding question
- [ ] Create commitment level selector UI
- [ ] Implement referral program with 30-day Pro bonus

## References

- Fabulous app (Journey model, $10M+ revenue)
- Headspace (Free trial → subscription)
- Duolingo (Gamification + streaks)
- Calm (Premium content gating)
