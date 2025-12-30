# Motivation System - Comprehensive Specification

## Overview

A science-backed motivation toolkit within the Habit Details screen that helps users build emotional commitment to their habits. The system surfaces context-aware motivational content across four key moments: Workshop (setup), Activation (pre-habit), Rescue (at-risk), and Reward (post-completion).

**Design Mock**: `.superdesign/design_iterations/motivation_features_v2_light_validated.html`

---

## Table of Contents

1. [Business Rationale & Monetization](#business-rationale--monetization)
2. [Feature Breakdown](#feature-breakdown)
3. [Screen Flow](#screen-flow)
4. [Technical Architecture](#technical-architecture)
5. [Implementation Tasks](#implementation-tasks)
6. [Success Metrics](#success-metrics)

---

## Business Rationale & Monetization

### Why This Feature Matters

| Metric             | Industry Benchmark   | Our Target |
| ------------------ | -------------------- | ---------- |
| Day 7 Retention    | 20% (avg habit apps) | 35%+       |
| Day 30 Retention   | 8% (avg habit apps)  | 18%+       |
| Premium Conversion | 2-4% (freemium apps) | 6%+        |

### Monetization Strategy

#### Free Tier (Hook Users with Core Science)

| Feature                    | Why Free                     | Business Logic                                    |
| -------------------------- | ---------------------------- | ------------------------------------------------- |
| **Your Why** (1 statement) | Creates emotional investment | Users who set "why" have 3x retention (Noom data) |
| **Identity Statement**     | Low effort, high impact      | Identity-based habits show 2x persistence         |
| **WOOP Plan**              | Core behavioral science      | Proven to double goal achievement                 |
| **Cue/Trigger Setup**      | Habit loop foundation        | Habits with cues are 2x more likely to stick      |
| **Basic Dual Viz**         | Introduces Huberman concept  | Hooks users into visualization habit              |
| **Quick Reflection**       | Post-habit feedback          | Users who reflect = 60% higher retention          |

#### Premium Tier ($6.99/mo)

| Feature                       | Why Premium             | Willingness-to-Pay Driver                   |
| ----------------------------- | ----------------------- | ------------------------------------------- |
| **Voice Notes** (unlimited)   | High emotional value    | Audio has 40% higher recall than text       |
| **Letters to Self**           | Time-delayed motivation | Creates anticipation, emotional anchor      |
| **Vision Board**              | Visual motivation       | Personalized content = premium perception   |
| **Affirmations** (unlimited)  | Daily reinforcement     | Repetition builds neural pathways           |
| **Rescue Mode** interventions | Saves streaks           | Streak protection = #1 retention (Duolingo) |
| **Advanced Visualization**    | Full Huberman protocol  | Science credibility = premium value         |

### Competitive Validation

| App           | Revenue        | Key Monetized Feature              | Our Equivalent         |
| ------------- | -------------- | ---------------------------------- | ---------------------- |
| **Noom**      | $400M ARR      | "Why" + coaching + personalization | Your Why + Rescue Mode |
| **Calm**      | $2B valuation  | Emotional audio content            | Voice Notes            |
| **Headspace** | $300M ARR      | Context-aware content              | Motivation Check       |
| **Duolingo**  | $500M ARR      | Streak protection                  | Rescue Mode            |
| **Daylio**    | 50M+ downloads | Reflection journaling              | Quick Reflection       |
| **Reflectly** | $2M ARR        | Voice journaling                   | Voice Notes            |

---

## Feature Breakdown

### 1. Your Why

**What**: A personal statement connecting the habit to deeper life goals.

**Scientific Basis**:

- Self-Determination Theory (Deci & Ryan): Intrinsic motivation from personal meaning
- Noom clinical studies: Users with defined purpose show 3x higher retention

**Business Rationale**:

- **Free**: Low friction to set up, creates immediate emotional investment
- **Monetization**: Unlocks premium features for users who've invested emotionally

**UX Flow**:

1. Empty state with pulsing icon + "Set up" CTA
2. Tap opens text editor with prompts
3. Saved why displays in rose-tinted card
4. Surfaced prominently in Activation and Rescue screens

---

### 2. Identity Statement

**What**: "I am a [identity]" statement (e.g., "I am a runner" not "I run").

**Scientific Basis**:

- James Clear's Atomic Habits (10M+ copies): Identity precedes behavior
- Research shows identity-based habits have 2x persistence vs outcome-based

**Business Rationale**:

- **Free**: Single text field, massive psychological impact
- **Monetization**: Part of core hook that drives premium conversion

**UX Flow**:

1. Empty state: "Define who you're becoming"
2. Input with "I am a..." prefix
3. Displays with explanation: "Not 'I run' — who you ARE"

---

### 3. Cue/Trigger Setup

**What**: When, where, and after what the habit occurs.

**Scientific Basis**:

- Charles Duhigg's Habit Loop: Cue → Routine → Reward
- Implementation intentions double follow-through (Gollwitzer)

**Business Rationale**:

- **Free**: Essential for habit formation, no premium value
- **Monetization**: Data enables smart notifications (future premium)

**UX Flow**:

1. Three fields: Time, Location, Preceding habit
2. Example: "7:00 AM" + "Front door" + "After morning coffee"
3. Powers notification timing

---

### 4. Voice Notes

**What**: Audio recordings of motivation, progress, and emotional states.

**Scientific Basis**:

- Voice has 40% higher emotional recall than text (cognitive psychology)
- Hearing your own voice from Day 1 creates powerful emotional anchor

**Business Rationale**:

- **Premium**: High perceived value, storage costs, emotional depth
- **Monetization**: Key differentiator from text-only competitors
- **Validation**: Reflectly ($2M ARR) built business on voice journaling

**UX Flow**:

1. Record button with waveform visualization
2. List of recordings with playback
3. "Day 1" recording prominently featured in Rescue Mode
4. Free tier: 1 recording; Premium: unlimited

---

### 5. Letters to Self

**What**: Time-locked messages from past self to future self.

**Scientific Basis**:

- Temporal self-continuity: Connecting with future self increases self-control
- Delayed gratification psychology (Mischel's marshmallow studies)

**Business Rationale**:

- **Premium**: Creates anticipation, unique feature, emotional depth
- **Monetization**: Users pay for emotional experiences (Calm model)

**UX Flow**:

1. Write letter with unlock date (7, 14, 30, 90 days)
2. Locked letters show countdown
3. Notification when letter unlocks
4. Read past letters for motivation

---

### 6. WOOP Plan

**What**: Wish-Outcome-Obstacle-Plan framework.

**Scientific Basis**:

- Gabriele Oettingen (NYU): 20+ peer-reviewed studies
- Mental contrasting + implementation intentions = 2x goal achievement
- Book: "Rethinking Positive Thinking" (2014)

**Business Rationale**:

- **Free**: Core behavioral science, drives habit success
- **Monetization**: Successful users become premium converters

**UX Flow**:

1. Four-field form: W-O-O-P
2. "If [obstacle] → then [plan]" statement highlighted
3. IF-THEN plan surfaced in Activation screen

---

### 7. Huberman Dual Visualization

**What**: Context-aware visualization based on motivation level.

**Scientific Basis**:

- Andrew Huberman (Stanford, 5M YouTube subscribers)
- Episode #55: "The Science of Setting & Achieving Goals"
- Key insight: **Visualize FAILURE when unmotivated** (fear drives action 2x)
- Loss aversion (Kahneman & Tversky, Nobel Prize): Losses hurt 2x more

**Business Rationale**:

- **Free (basic)**: Introduction to visualization
- **Premium**: Full protocol with Body/Mind/Emotion breakdown
- **Monetization**: Science credibility = premium value

**Protocol**:

| User State        | What to Visualize | Why                      |
| ----------------- | ----------------- | ------------------------ |
| **Motivated**     | SUCCESS outcomes  | Amplifies existing drive |
| **Not Motivated** | FAILURE outcomes  | Fear moves you 2x better |

**UX Flow**:

1. **Workshop**: Set up both visualizations (success + failure feelings)
2. **Activation**: Ask "How motivated are you?" → show appropriate viz
3. **Rescue**: Always show failure visualization (user is clearly struggling)

---

### 8. Vision Board

**What**: Photo grid of motivational images.

**Scientific Basis**:

- Visual motivation reinforces goals
- Personal images > stock images for emotional connection

**Business Rationale**:

- **Premium**: Storage costs, personalization, high perceived value
- **Monetization**: Users pay for customization (Notion model)

**UX Flow**:

1. 4-image grid with add button
2. Tap to view full-size
3. Optional captions

---

### 9. Affirmations

**What**: Daily positive statements about the habit.

**Scientific Basis**:

- Self-affirmation theory (Steele): Reduces defensive processing
- Repetition builds neural pathways

**Business Rationale**:

- **Free**: 2 affirmations
- **Premium**: Unlimited + scheduled delivery
- **Monetization**: Low storage, high perceived value

**UX Flow**:

1. List of affirmations
2. Random selection for Activation screen
3. Add/edit interface

---

### 10. Quick Reflection

**What**: Post-habit emoji rating + optional note.

**Scientific Basis**:

- BJ Fogg (Stanford, "Tiny Habits"): Celebration wires habits
- Journaling increases self-awareness and consistency

**Business Rationale**:

- **Free**: Essential for habit loop completion
- **Monetization**: Data powers insights (future premium analytics)
- **Validation**: Daylio (50M+ downloads) entire business model

**UX Flow**:

1. Emoji selector: 😤 😐 😊 🔥
2. Optional text note
3. Displays in Reward screen

---

## Screen Flow

### 1. Workshop (Motivation Tab in Habit Details)

**Purpose**: Build the motivation toolkit

**Contains**:

- Your Why (with completion checkmark)
- Identity Statement
- Cue/Trigger Setup
- Voice Notes (record + list)
- Letters to Self
- WOOP Plan
- Dual Visualization Setup (both success + failure)
- Vision Board
- Affirmations

**Animations**:

- Staggered entrance (80ms between sections)
- Completion checkmarks pop-in
- Empty state pulse on icons

---

### 2. Activation (Pre-Habit Notification/Modal)

**Purpose**: Prime user for habit execution

**Trigger**: Notification at scheduled habit time

**Contains**:

1. Habit card with streak/completion stats
2. Your Why (featured)
3. Voice note quick-play (Day 1 recording)
4. WOOP IF-THEN reminder
5. **Motivation Check**: "How motivated are you?"
   - 😩 Not at all → Show failure visualization
   - 😐 Meh → Show failure visualization
   - 💪 Ready! → Show success visualization
6. Start Now button (glowing)
7. Quick actions: Snooze, Just 2 Min

---

### 3. Rescue Mode (Streak at Risk)

**Purpose**: Prevent streak break when user is struggling

**Trigger**:

- X hours before day ends with habit incomplete
- User opens app after missing notification
- Manually triggered from habit card

**Contains**:

1. "🆘 Rescue Mode" header with streak-at-risk badge
2. Voice playback (Day 1, prominently featured)
3. Your Why (emphasized, larger)
4. Letter to Self (if available)
5. **Failure Visualization ONLY** (Huberman protocol)
   - Body: heavy, sluggish, stuck
   - Mind: foggy, making excuses
   - Emotion: regret, shame, broken promise
   - Streak: "14 days gone, starting over"
6. "Just Do 2 Minutes" CTA
7. Quick access: More Voice, Vision Board

**Key Insight**: In Rescue Mode, ALWAYS show failure visualization because the user is clearly not motivated. Loss aversion is the most powerful lever.

---

### 4. Reward (Post-Completion)

**Purpose**: Celebrate and capture positive emotions

**Trigger**: User marks habit complete

**Contains**:

1. Celebration: 🎉 "You Did It!"
2. Updated streak with flame animation
3. Stats: completion rate, best streak
4. Quick Reflection (emoji + note)
5. "Capture this feeling" prompts:
   - Record Voice
   - Write Letter
6. Done button

**Key Insight**: BJ Fogg's research shows celebration IMMEDIATELY after behavior is the most important part of habit formation. It releases dopamine and wires the habit.

---

## Technical Architecture

### Database Schema (Convex)

```typescript
// habits table additions
{
  // Existing fields...

  // Motivation fields
  why?: string;
  identity?: string;
  cue?: {
    time?: string;
    location?: string;
    afterHabit?: string;
  };
  woop?: {
    wish: string;
    outcome: string;
    obstacle: string;
    plan: string;
  };
  visualization?: {
    successBody: string;
    successMind: string;
    successEmotion: string;
    failureBody: string;
    failureMind: string;
    failureEmotion: string;
  };
  affirmations?: string[];
}

// New tables
voiceNotes: {
  habitId: Id<"habits">;
  userId: string;
  audioUrl: string;
  duration: number;
  createdAt: number;
  label?: string;
}

letters: {
  habitId: Id<"habits">;
  userId: string;
  content: string;
  unlockAt: number;
  createdAt: number;
  isRead: boolean;
}

visionBoardImages: {
  habitId: Id<"habits">;
  userId: string;
  imageUrl: string;
  caption?: string;
  order: number;
}

reflections: {
  habitId: Id<"habits">;
  userId: string;
  date: string;
  emoji: "frustrated" | "neutral" | "happy" | "fire";
  note?: string;
}
```

### Component Architecture

```
src/components/
├── MotivationSystem/
│   ├── Workshop/
│   │   ├── YourWhySection.tsx
│   │   ├── IdentitySection.tsx
│   │   ├── CueTriggerSection.tsx
│   │   ├── VoiceNotesSection.tsx
│   │   ├── LettersSection.tsx
│   │   ├── WOOPSection.tsx
│   │   ├── DualVizSetup.tsx
│   │   ├── VisionBoardSection.tsx
│   │   └── AffirmationsSection.tsx
│   ├── Activation/
│   │   ├── ActivationModal.tsx
│   │   ├── MotivationCheck.tsx
│   │   ├── ContextAwareViz.tsx
│   │   └── QuickActions.tsx
│   ├── Rescue/
│   │   ├── RescueMode.tsx
│   │   ├── FailureViz.tsx
│   │   └── RescueCTA.tsx
│   └── Reward/
│       ├── CelebrationScreen.tsx
│       ├── QuickReflection.tsx
│       └── CapturePrompts.tsx
```

### Premium Gating

```typescript
// src/hooks/useMotivationFeatures.ts
export function useMotivationFeatures() {
  const { isPremium } = useSubscription();

  return {
    // Free features
    canSetWhy: true,
    canSetIdentity: true,
    canSetCue: true,
    canUseWOOP: true,
    canUseBasicViz: true,
    canReflect: true,

    // Premium features
    canRecordVoice: isPremium,
    canWriteLetters: isPremium,
    canUseVisionBoard: isPremium,
    unlimitedAffirmations: isPremium,
    canUseRescueMode: isPremium,
    canUseAdvancedViz: isPremium,

    // Limits
    maxAffirmations: isPremium ? Infinity : 2,
    maxVoiceNotes: isPremium ? Infinity : 1,
  };
}
```

---

## Implementation Tasks

### Phase 1: Core Free Features (Week 1-2)

#### T1: Your Why Section

- [x] T1.1: Add `why` field to habits schema _(Already implemented - field exists at `convex/schema.ts:75` as `why: v.optional(v.string())`)_
- [x] T1.2: Create `YourWhySection` component with empty/filled states _(Implemented at `src/components/MotivationSystem/Workshop/YourWhySection.tsx` with PulsingIcon empty state, filled state with quoted why, and SectionCard with press animation)_
- [x] T1.3: Add text editor modal with prompts _(Already implemented in `HabitDetailScreen.tsx:2581-2704` with multiline TextInput, 200 char limit, "I do this because..." prefix, 4 inspirational prompts with icons, character counter, keyboard handling, and save via `updateHabit` API)_
- [x] T1.4: Style with rose accent color (border-l-rose-400) _(Implemented in YourWhySection with border-l-4 border-l-rose-400, rose-100 icon background, rose-500 Heart icon)_
- [x] T1.5: Add completion checkmark when filled _(Implemented CompletionCheckmark subcomponent with emerald-500 badge, pop-in animation 0→1.2→1, staggered delay based on sectionIndex)_

#### T2: Identity Statement Section

- [ ] T2.1: Add `identity` field to habits schema
- [ ] T2.2: Create `IdentitySection` component
- [ ] T2.3: Add "I am a..." prefix in input
- [ ] T2.4: Style with indigo accent color
- [ ] T2.5: Add explanatory text: "Not 'I run' — who you ARE"

#### T3: Cue/Trigger Section

- [ ] T3.1: Add `cue` object field to habits schema
- [ ] T3.2: Create `CueTriggerSection` with 3 fields
- [ ] T3.3: Time picker integration
- [ ] T3.4: Location text input
- [ ] T3.5: "After habit" text input
- [ ] T3.6: Style with sky accent color

#### T4: WOOP Plan Section

- [ ] T4.1: Add `woop` object field to habits schema
- [ ] T4.2: Create `WOOPSection` with 4 fields
- [ ] T4.3: Highlight IF-THEN statement visually
- [ ] T4.4: Add WOOP explanation tooltip
- [ ] T4.5: Style with amber/rose W-O-O-P letters

#### T5: Basic Dual Visualization

- [ ] T5.1: Add `visualization` object to habits schema
- [ ] T5.2: Create `DualVizSetup` component for Workshop
- [ ] T5.3: Success visualization form (Body/Mind/Emotion)
- [ ] T5.4: Failure visualization form (Body/Mind/Emotion)
- [ ] T5.5: Add science explainer: "Fear moves you 2x better"
- [ ] T5.6: Style with emerald (success) / rose (failure) gradients

#### T6: Quick Reflection

- [ ] T6.1: Create `reflections` table in Convex
- [ ] T6.2: Create `QuickReflection` component
- [ ] T6.3: Emoji selector (4 options)
- [ ] T6.4: Optional text note field
- [ ] T6.5: Integrate into habit completion flow
- [ ] T6.6: Style with emerald accent

---

### Phase 2: Screen Flows (Week 2-3)

#### T7: Activation Modal

- [ ] T7.1: Create `ActivationModal` component
- [ ] T7.2: Habit card with stats at top
- [ ] T7.3: Featured "Your Why" display
- [ ] T7.4: Create `MotivationCheck` component (emoji buttons)
- [ ] T7.5: Create `ContextAwareViz` that shows success OR failure
- [ ] T7.6: "Start Now" button with glow animation
- [ ] T7.7: Quick actions: Snooze, Just 2 Min
- [ ] T7.8: Trigger from notification tap

#### T8: Rescue Mode

- [ ] T8.1: Create `RescueMode` screen/modal
- [ ] T8.2: Streak-at-risk header with badge
- [ ] T8.3: Featured "Your Why" (larger text)
- [ ] T8.4: Create `FailureViz` component (always shows failure)
- [ ] T8.5: "Just Do 2 Minutes" prominent CTA
- [ ] T8.6: Trigger logic: X hours before day ends
- [ ] T8.7: Trigger logic: App open after missed notification

#### T9: Reward/Celebration Screen

- [ ] T9.1: Create `CelebrationScreen` component
- [ ] T9.2: Confetti/celebration animation
- [ ] T9.3: Updated streak display with flame
- [ ] T9.4: Stats cards (completion rate, best streak)
- [ ] T9.5: Quick Reflection integration
- [ ] T9.6: "Capture this feeling" prompt buttons
- [ ] T9.7: Done button

---

### Phase 3: Premium Features (Week 3-4)

#### T10: Voice Notes

- [ ] T10.1: Create `voiceNotes` table in Convex
- [ ] T10.2: Audio recording integration (expo-av)
- [ ] T10.3: Waveform visualization during recording
- [ ] T10.4: Playback UI with progress bar
- [ ] T10.5: List of recordings with labels
- [ ] T10.6: Premium gate: 1 free, unlimited premium
- [ ] T10.7: Feature in Rescue Mode (Day 1 recording)
- [ ] T10.8: Style with teal accent

#### T11: Letters to Self

- [ ] T11.1: Create `letters` table in Convex
- [ ] T11.2: Letter writing modal
- [ ] T11.3: Unlock date picker (7/14/30/90 days)
- [ ] T11.4: Locked letter display with countdown
- [ ] T11.5: Unlock notification
- [ ] T11.6: Letter reading modal
- [ ] T11.7: Premium gate
- [ ] T11.8: Style with violet accent

#### T12: Vision Board

- [ ] T12.1: Create `visionBoardImages` table
- [ ] T12.2: Image picker integration (expo-image-picker)
- [ ] T12.3: Image upload to storage (Convex file storage)
- [ ] T12.4: 4-image grid display
- [ ] T12.5: Full-size image viewer
- [ ] T12.6: Optional captions
- [ ] T12.7: Premium gate

#### T13: Affirmations (Extended)

- [ ] T13.1: Add `affirmations` array to habits schema
- [ ] T13.2: Affirmation list management
- [ ] T13.3: Random selection for Activation
- [ ] T13.4: Premium gate: 2 free, unlimited premium
- [ ] T13.5: Style with amber accent

---

### Phase 4: Polish & Integration (Week 4-5)

#### T14: Animations

- [ ] T14.1: Staggered entrance for Workshop sections (80ms)
- [ ] T14.2: Completion checkmark pop-in
- [ ] T14.3: Empty state pulse animations
- [ ] T14.4: Press feedback on cards
- [ ] T14.5: Glow animation on Start Now button
- [ ] T14.6: Celebration confetti/particles
- [ ] T14.7: Reduce motion preference support

#### T15: Premium Upsell

- [ ] T15.1: Create premium feature lock UI
- [ ] T15.2: "Upgrade" CTA on locked features
- [ ] T15.3: Premium benefits modal
- [ ] T15.4: Paywall integration

#### T16: Testing

- [ ] T16.1: Unit tests for motivation components
- [ ] T16.2: Integration tests for screen flows
- [ ] T16.3: Premium gating tests
- [ ] T16.4: Animation performance tests
- [ ] T16.5: Accessibility audit (reduce motion, screen readers)

---

## Success Metrics

### Retention Metrics

| Metric              | Current | Target | Measurement                 |
| ------------------- | ------- | ------ | --------------------------- |
| Day 7 Retention     | TBD     | +50%   | Mixpanel cohort             |
| Day 30 Retention    | TBD     | +100%  | Mixpanel cohort             |
| Streak Length (avg) | TBD     | +75%   | Database query              |
| Rescue Mode Success | N/A     | 40%+   | % who complete after rescue |

### Engagement Metrics

| Metric                | Target           | Measurement               |
| --------------------- | ---------------- | ------------------------- |
| Motivation Tab Visits | 3x/week per user | Event tracking            |
| Voice Notes Recorded  | 2+ per user      | Database count            |
| Why Completion Rate   | 70%+             | % of habits with why      |
| Visualization Use     | 50%+             | % of activations with viz |

### Monetization Metrics

| Metric                   | Target | Measurement                |
| ------------------------ | ------ | -------------------------- |
| Premium Conversion       | 6%+    | Revenue / MAU              |
| Feature-driven Upgrades  | 60%+   | Upgrade source tracking    |
| Voice Notes Upgrade Rate | 15%+   | % who upgrade after 1 free |

---

## Edge Cases & Error Handling

### Data Loss Prevention

- [x] Auto-save drafts for long-form content (Why, Letters, Reflections)
  - Implemented: `useDraftStorage` hook with debounced auto-save (1000ms), AsyncStorage persistence, 7-day expiration, draft recovery on mount
  - Implemented: `DraftRecoveryBanner` component for UI feedback when drafts are recovered
  - Files: `src/hooks/useDraftStorage.ts`, `src/components/DraftRecoveryBanner.tsx`
  - Tests: 47 tests covering all functionality (39 hook tests + 8 component tests)
- [x] Confirm before discarding unsaved changes
  - Implemented: `useUnsavedChangesGuard` hook with change detection, Alert.alert confirmation, async/callback APIs, Android back button interception
  - Implemented: `UnsavedChangesAlert` component with centerAlert Modal variant, content preview, variant styling, useUnsavedChangesAlert companion hook
  - Files: `src/hooks/useUnsavedChangesGuard.ts`, `src/components/UnsavedChangesAlert.tsx`
  - Tests: 47 tests covering hook (change detection, normalization, confirmation flow, back button, edge cases) + 25 tests for component (visibility, buttons, preview, accessibility, hook)
- [ ] Offline queue for submissions when network unavailable

### Premium Gating UX

- [ ] Free users see locked features with preview
- [ ] Soft paywall: show value before asking for payment
- [ ] Premium badge on locked features
- [ ] Deep link to specific feature from upgrade prompt

### Voice Notes Edge Cases

- [ ] Handle microphone permission denial gracefully
- [ ] Maximum recording length (5 min) with warning
- [ ] Playback controls: speed (0.5x, 1x, 1.5x, 2x)
- [ ] Handle audio interruption (phone call, other app)

### Rescue Mode Triggers

- [ ] Don't trigger rescue if habit already completed
- [ ] Don't trigger rescue for paused/archived habits
- [ ] Limit to 1 rescue notification per habit per day
- [ ] Respect Do Not Disturb settings

### Accessibility

- [ ] All animations respect `reduceMotion` preference
- [ ] Screen reader labels for all interactive elements
- [ ] Minimum tap targets (44x44pt per Apple HIG)
- [ ] Sufficient color contrast (WCAG 2.1 AA)

---

## Acceptance Criteria

### Must Have (MVP)

- [ ] User can set and edit "Your Why" statement
- [ ] User can set and edit Identity Statement
- [ ] User can configure Cue/Trigger (time, location, after)
- [ ] User can complete WOOP plan
- [ ] User can set up basic visualization (success + failure)
- [ ] User sees Quick Reflection after completing habit
- [x] Free/Premium features are correctly gated _(Validated: Comprehensive acceptance criteria test suite at `tests/integration/features/premium-gating-acceptance.test.tsx` with 46 passing tests covering: 1) Free features always accessible (Your Why, Identity, Cue/Trigger, WOOP, Basic Viz, Quick Reflection) with no PRO badges; 2) Premium features gated for free users (Voice Notes 1 free, Letters premium-only, Vision Board premium-only, Affirmations 2 free); 3) Premium UI patterns (PRO badges, free tier limit badges, upgrade prompts); 4) Premium state consistency across all features; 5) Premium upsell flow (paywall trigger, feature context, dismissal); 6) Business logic validation (free tier limits enforced, premium users unlimited). Combined with existing `premium-gating.test.tsx` totaling 114 tests.)_

### Should Have (v1.1)

- [ ] Activation modal appears at habit notification time
- [x] Rescue Mode triggers when streak is at risk _(Validated: Comprehensive acceptance criteria test suite at `tests/integration/features/rescue-mode-streak-acceptance.test.tsx` with 62 passing tests covering: 1) Scheduled trigger (X hours before day ends) with configurable hoursBeforeEnd, respecting scheduled time check; 2) App resume trigger with manual triggerRescue function, eligibility validation, clearRescue; 3) Safety checks (completed habits, paused/inactive habits, rescue already shown today, minimum streak requirement, rescue shown tracking); 4) Quiet Hours/DND support with overnight range handling, isInQuietHours exposure; 5) Habit prioritization (higher streak triggers first); 6) RescueMode UI streak-at-risk display (badge, hours remaining, conditional display); 7) Featured Your Why with loss aversion messaging; 8) Failure Visualization per Huberman protocol (ALWAYS shows failure in Rescue Mode); 9) Just 2 Minutes CTA per Tiny Habits principle; 10) Secondary actions (Full Habit, Skip Today, Close); 11) Complete flow validation (trigger → eligibility → modal); 12) Edge cases (minimal data, null habit); 13) Accessibility compliance (labels, roles, reduceMotion); 14) Scientific basis validation (Loss Aversion, Huberman Dual Viz, Tiny Habits, Duolingo streak protection).)_
- [x] Celebration screen with confetti after completion _(Validated: Comprehensive acceptance criteria test suite at `tests/integration/features/celebration-screen-acceptance.test.tsx` with 77 passing tests covering: 1) Trigger Condition - modal visibility on habit completion, null/false state handling; 2) Confetti Animation - PartyPopper icon for regular celebration, Crown icon for milestones, reduceMotion accessibility support; 3) Streak Display - current streak count with Flame icon, Day Streak label, hide logic for 0/undefined streaks; 4) Milestone Detection - special messages for 7/14/30/100 day milestones with Crown icon, dedication messaging; 5) Stats Display - completion rate (rounded %), best streak, total completions with TrendingUp/Trophy/Target icons, partial stats handling; 6) Quick Reflection Integration - emoji selection (4 options), note capture, prop sync, callback validation; 7) Capture Prompts - "Record Voice" and "Write Letter" premium CTAs with PRO badges, Mic/Mail icons, descriptions; 8) Done Button - closes modal, calls onDone + onClose, accessibility hint; 9) Scientific Basis Validation - BJ Fogg celebration principle (dopamine release wires habits), Daylio reflection model, Calm emotional capture model; 10) Edge Cases - minimal data, empty/long names, 0-100% rates, undefined callbacks; 11) Accessibility - labels, roles, reduceMotion, hints; 12) Complete Flow - habit completion → celebration → reflection → done; 13) State Management - emoji/note prop sync across re-renders)_
- [ ] Voice Notes recording and playback (premium)
- [ ] Letters to Self with time-lock (premium)

### Nice to Have (v1.2+)

- [x] Vision Board with image upload (premium) _(Validated: 95 acceptance criteria tests in vision-board-acceptance.test.tsx - covers image picker integration, upload to storage, 4-image grid display, full-size viewer, optional captions, premium gating, delete with confirmation, fuchsia styling, accessibility, scientific basis)_
- [x] Affirmations with scheduled delivery (premium) _(Validated: 55 acceptance criteria tests in affirmations-scheduled-delivery-acceptance.test.tsx - covers schedule setup flow (time picker, daily/weekly frequency, day selection), schedule management (enable/disable toggle, remove schedule), premium gating (schedule feature premium-only), schedule display (next delivery time, scheduled count badge, days of week for weekly), modal behavior (close, preview, science tip, initial values), notification utilities (formatDaysOfWeek, getNextAffirmationDeliveryRelativeTime), accessibility (time picker, frequency radio buttons, day checkboxes, toggle switch). Implementation includes: schema extension with scheduledTime/frequency/daysOfWeek/isScheduleEnabled fields, Convex mutations (scheduleDelivery, toggleSchedule, cancelSchedule, recordDelivery, listScheduled), notification utilities (scheduleAffirmationDelivery, cancelAffirmationDelivery, formatDaysOfWeek, getNextAffirmationDeliveryRelativeTime), AffirmationScheduleModal component with time picker/frequency selector/day selector, AffirmationsSection integration with schedule button on each affirmation item, amber/emerald accent styling.)_
- [x] AI-generated affirmations based on habit _(Validated: 68 acceptance criteria tests in ai-generated-affirmations-acceptance.test.tsx and GenerateAffirmationsButton.test.tsx - covers: 1) AI Generation Backend Action - prompt engineering with habit context (name, why, identity, visualization), response validation (3-200 char limit, type validation), error handling (habit not found, max limit, API key, no valid output); 2) Premium Gating - shows button to all users, PRO badge for non-premium, triggers paywall, allows generation for premium; 3) Habit Context Usage - personalization hints, accessibility hints about context; 4) UI Integration - GenerateAffirmationsButton component (loading states, success feedback, error alerts), AffirmationsSection integration (full/compact variants, slots remaining display); 5) Slot Management - shows remaining slots, prevents generation at max (10), adjusts count to fit remaining; 6) Empty State - shows AI generate in empty state; 7) Accessibility - labels, hints, disabled state, reduceMotion; 8) Scientific Basis - Sherman & Cohen 2006 (personalization), Hatzigeorgiadis et al 2011 (context-specific self-talk), Steele 1988 (self-affirmation theory), Atomic Habits identity methodology. Implementation includes: OpenAI SDK integration in package.json, generateAffirmations action in convex/affirmations.ts with prompt engineering using habit context, parseAffirmationsResponse validation, generateAndSaveAffirmations convenience wrapper, GenerateAffirmationsButton.tsx with SparkleAnimation/loading states/success feedback, AffirmationsSection integration with onGenerateAffirmations/isGenerating/hasHabitContext props, violet/purple gradient styling for AI button.)_
- [x] Streak recovery with Voice Note from past self _(Validated: 42 acceptance criteria tests in streak-recovery-voice-notes-acceptance.test.tsx - covers: 1) Best Streak Voice Notes Query - Convex `getFromBestStreak` query at `convex/voiceNotes.ts:301-393` with `findBestStreakPeriod` helper for identifying best streak date range, filters notes by timestamp, calculates `streakAtRecording` (1-indexed day of streak) and `daysAgo` for temporal context, requires bestStreak >= 3; 2) PreviousStreakVoiceNotes Component at `src/components/MotivationSystem/Rescue/PreviousStreakVoiceNotes.tsx` with StreakVoiceNoteCard expandable items, streak day context display ("Day 14 of your 21-day streak"), relative time (Today/Yesterday/X days ago), auto-expand first note, amber/orange accent styling (distinct from Day 1 teal); 3) RescueMode Integration - added `bestStreak` and `previousStreakVoiceNotes` to RescueHabitData interface, renders PreviousStreakVoiceNotes after Day 1 voice note section, requires bestStreak >= 3 and non-empty notes array; 4) Playback Callbacks - forwards onVoiceNotePlayStart/onVoiceNotePlayFinish; 5) Scientific Basis - temporal self-continuity ("Your Best Streak Self"), voice emotional recall science callout, "Peak Motivation" badge, encouragement message; 6) Accessibility - descriptive labels including streak day and days ago, button roles, reduceMotion support)_

---

## Appendix: Research Sources

### Scientific Literature

1. **WOOP Method**: Oettingen, G. (2014). "Rethinking Positive Thinking." Penguin.
2. **Huberman Protocol**: Huberman Lab Podcast #55, "The Science of Setting & Achieving Goals"
3. **Loss Aversion**: Kahneman, D. & Tversky, A. (1979). "Prospect Theory." Econometrica.
4. **Identity-Based Habits**: Clear, J. (2018). "Atomic Habits." Avery.
5. **Tiny Habits**: Fogg, BJ. (2019). "Tiny Habits." Houghton Mifflin.
6. **Habit Loop**: Duhigg, C. (2012). "The Power of Habit." Random House.

### Industry Validation

1. **Noom**: $400M ARR, "why" statements = 3x retention
2. **Duolingo**: S-1 filing, streak rescue = #1 retention driver
3. **Calm**: $2B valuation, emotional audio content premium
4. **Headspace**: Context-aware personalization = 25% more engagement
5. **Daylio**: 50M+ downloads, reflection = 60% higher retention
6. **Reflectly**: $2M ARR, voice journaling premium model

---

## Changelog

| Date       | Version | Changes                                                            |
| ---------- | ------- | ------------------------------------------------------------------ |
| 2025-12-28 | 1.0     | Initial spec with business rationale, feature breakdown, and tasks |
