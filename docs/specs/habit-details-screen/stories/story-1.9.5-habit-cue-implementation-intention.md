# Story 1.9.5: Habit Cue & Implementation Intention

**Epic:** Epic 1.5 - Habit Detail Screen
**Priority:** High
**Status:** 🟢 COMPLETE
**Estimated Effort:** 8-12 hours
**Completed:** 2025-12-20

---

## User Story

**As a** user trying to build consistent habits
**I want to** define when, where, and what triggers my habit
**So that** I don't rely on motivation alone and have a concrete "entry point" into the behavior

---

## Scientific Foundation

### Research Evidence

| Study | Finding |
|-------|---------|
| Gollwitzer (1999) | Implementation intentions ("if-then" plans) increase follow-through by **2-3x** |
| Milne et al. (2002) | 91% of people who wrote implementation intentions exercised vs 38% control |
| Orbell & Sheeran (1998) | Meta-analysis: Implementation intentions have medium-to-large effect size (d = 0.65) |

### The Science

**Implementation Intentions** follow the format:
> "When [SITUATION], I will [BEHAVIOR]"

This works because:
1. **Pre-decides** the action (removes decision fatigue)
2. **Links to existing behavior** (habit stacking)
3. **Creates automatic trigger** (cue-response pattern)
4. **Bypasses willpower** (the decision is already made)

### BJ Fogg's Tiny Habits Formula

> "After I [ANCHOR HABIT], I will [NEW HABIT]"

Example: "After I pour my morning coffee, I will do 5 pushups"

---

## Placement Decision

- **Cue section** lives in the **Motivation Tab** (implemented as card in MotivationTabContent)
- Positioned as a bordered card with amber accent
- Collapsible if the user hasn't set a cue yet (empty state)

```
┌─────────────────────────────────────────┐
│  Hero: Name + Icon                      │
│  Why: "So I can be healthy..."          │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🎯 Cue                       [✏️] │  │
│  │ "After I pour my morning coffee"  │  │
│  │ 📍 Kitchen  •  ⏰ 7:00 AM         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [ ✓ COMPLETE ]                         │
└─────────────────────────────────────────┘
```

---

## References

- Current screen: `src/screens/HabitDetailScreen.tsx`
- Schema: `convex/schema.ts` (habits table)
- Habits API: `convex/habits.ts`
- Tests: `convex/habits.cue.test.ts`

---

## Acceptance Criteria

### 1. Backend Support

- [x] **1a)** Add `cueAfterBehavior` field to habits schema (string, max 100 chars)
  - *Implemented in `convex/schema.ts` lines 50-56*
- [x] **1b)** Add `cueLocation` field to habits schema (string, optional, max 50 chars)
  - *Implemented in `convex/schema.ts` lines 50-56*
- [x] **1c)** Add `cueTime` field to habits schema (string, optional, e.g., "7:00 AM" or "Morning")
  - *Implemented in `convex/schema.ts` lines 50-56*
- [x] **1d)** Update `habits.update` mutation to accept cue fields
  - *Implemented in `convex/habits.ts` lines 89-123*
- [x] **1e)** Update `habits.create` mutation to accept cue fields (optional)
  - *Implemented in `convex/habits.ts` lines 18-81*
- [x] **1f)** Update query return validators to include cue fields
  - *Implemented in `convex/habits.ts` - get, list, listArchived, listPaused queries all include cue fields*

### 2. Cue Display (Motivation Tab)

- [x] **2a)** If cue is set, display a compact "Cue" card in Motivation Tab
  - *Implemented in `MotivationTabContent` component, lines 507-551*
- [x] **2b)** Show implementation intention as primary text: "After I [anchor], I will [habit name]"
  - *Implemented with amber border-l-4 card styling*
- [x] **2c)** Show location and time as secondary metadata (if set)
  - *Shows location with MapPin icon and time with Clock icon in amber-50 pills*
- [x] **2d)** Tap on cue card opens editor modal
  - *`onPress={onOpenCueEditor}` triggers modal*
- [x] **2e)** If no cue set, show empty state: "When and where will you do this?"
  - *Implemented with italic stone-400 text for empty state*

### 3. Cue Editor Modal

- [x] **3a)** Modal with guided input for implementation intention
  - *Full-screen modal with header, scrollable content, and fixed footer*
- [x] **3b)** Prompt: "After I __________, I will [habit name]"
  - *Live preview card shows the full implementation intention*
- [x] **3c)** Examples/suggestions provided:
  - "pour my morning coffee"
  - "brush my teeth"
  - "sit down at my desk"
  - "finish lunch"
  - "put on my workout clothes"
  - *7 suggestions implemented as tappable pills*
- [x] **3d)** Optional: Location picker or free text input
  - *Free text input with "Kitchen, Gym, Office..." placeholder, max 50 chars*
- [x] **3e)** Optional: Time input (time picker or preset: Morning/Afternoon/Evening/Night)
  - *Free text input with "7:00 AM or Morning" placeholder, max 20 chars*
- [x] **3f)** Save updates habit via mutation
  - *`handleSaveCue` calls `updateHabit` mutation*
- [x] **3g)** Clear/remove cue option
  - *"Clear Cue" button appears when cue is set, calls `handleClearCue`*

### 4. UX Polish

- [x] **4a)** Haptic feedback on save
  - *`Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)` on save*
- [x] **4b)** Success toast: "Cue saved! Your trigger is set."
  - *Toast shows "Cue saved! You're 2-3x more likely to follow through 🎯"*
- [x] **4c)** Empty state icon and explanation of why cues help
  - *Blue info box with Sparkles icon explains "Link your habit to an existing behavior. Research shows this increases follow-through by 2-3x."*
- [x] **4d)** Character counter for implementation intention field
  - *Shows "{length} / 100" below input field*

### 5. Accessibility

- [x] **5a)** Cue card has proper accessibility labels
  - *`accessibilityLabel={hasCue ? 'Edit your cue' : 'Add a cue'}` and `accessibilityRole="button"`*
- [x] **5b)** Modal inputs have labels and roles
  - *All inputs have `accessibilityLabel` attributes*
- [x] **5c)** Supports Dynamic Type
  - *Uses Tailwind text classes (text-xs, text-sm, text-base) which respect system font scaling*

---

## Technical Notes

### Schema Addition

```typescript
// convex/schema.ts - add to habits table
habits: defineTable({
  // ... existing fields ...

  // Cue - Implementation Intention
  cueAfterBehavior: v.optional(v.string()),  // "pour my morning coffee"
  cueLocation: v.optional(v.string()),        // "Kitchen"
  cueTime: v.optional(v.string()),            // "7:00 AM" or "Morning"

  // ... existing fields ...
})
```

### Update Mutation Args

```typescript
// convex/habits.ts - update mutation
args: {
  // ... existing args ...
  cueAfterBehavior: v.optional(v.string()),
  cueLocation: v.optional(v.string()),
  cueTime: v.optional(v.string()),
}
```

### UI Component Structure

```
src/screens/HabitDetailScreen.tsx
  - MotivationTabContent component (cue display card)
  - Cue Editor Modal (inline in main component)
  - State: isCueEditorOpen, cueAfterBehaviorDraft, cueLocationDraft, cueTimeDraft
  - Handlers: handleOpenCueEditor, handleSaveCue, handleClearCue
```

### Suggested Anchor Habits (for suggestions)

```typescript
const ANCHOR_HABIT_SUGGESTIONS = [
  "pour my morning coffee",
  "brush my teeth",
  "sit down at my desk",
  "finish lunch",
  "get home from work",
  "put on my workout clothes",
  "wake up",
  "finish dinner",
  "turn off my alarm",
  "open my laptop",
];
```

---

## Out of Scope (for this story)

- Reminder/notification integration with cue time
- Multiple cues per habit
- Cue-based habit grouping on home screen
- Smart suggestions based on existing habits
- Location-based triggers (GPS)

---

## Testing Strategy

1. **Backend:**
   - [x] Verify cue fields save and retrieve correctly
   - [x] Verify empty/null cue fields don't break existing habits
   - *Test file: `convex/habits.cue.test.ts` - 15 passing tests*

2. **UI:**
   - [x] Verify cue displays correctly when set
   - [x] Verify empty state appears when no cue
   - [x] Verify editor opens and saves
   - [x] Verify character limits enforced (100 chars for behavior, 50 for location)

3. **Integration:**
   - [x] Verify cue persists across app restarts
   - [x] Verify cue appears in habit detail after creation

---

## Definition of Done

- [x] All acceptance criteria met
- [x] Cue data persists across app restarts
- [x] No console errors or warnings (related to cue functionality)
- [x] Accessibility audit passed

---

## Why This Matters (User Benefit)

> "People think they lack motivation when they actually lack clarity."
> — James Clear, Atomic Habits

Without a cue:
- User relies on **remembering** to do the habit
- Requires **willpower** to initiate
- Easy to **forget** when busy

With a cue:
- Habit is **triggered automatically** by existing behavior
- Requires **minimal willpower** (decision pre-made)
- Becomes **part of existing routine**

**Research shows 2-3x higher follow-through** when implementation intentions are set.

---

## Implementation Notes

### Key Implementation Decisions

1. **Placement in Motivation Tab**: Rather than Hero section, the cue lives in the Motivation tab alongside other motivational tools (Why, Identity, Vision Board, Affirmations). This groups all "preparation" content together.

2. **Live Preview**: The editor shows a real-time preview of the implementation intention as the user types, reinforcing the "After I..., I will..." format.

3. **Research-Backed Messaging**: Toast message includes "You're 2-3x more likely to follow through" to reinforce the value of the feature.

4. **Flexible Time Input**: Uses free text instead of a time picker to allow both specific times ("7:00 AM") and general periods ("Morning", "After dinner").

### Files Modified

- `convex/schema.ts` - Added cue fields to habits table
- `convex/habits.ts` - Added cue fields to create/update mutations and query validators
- `src/screens/HabitDetailScreen.tsx` - Added cue display card and editor modal
- `convex/habits.cue.test.ts` - Added unit tests for cue functionality (NEW)

---

**Created:** 2025-12-14
**Completed:** 2025-12-20
