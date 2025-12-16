# Story 1.9.5: Habit Cue & Implementation Intention

**Epic:** Epic 1.5 - Habit Detail Screen
**Priority:** High
**Status:** 🔴 TODO
**Estimated Effort:** 8-12 hours

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

- **Cue section** lives in the **Hero area**, below "Why"
- Positioned BEFORE the Quick Complete button (sets up the trigger → action flow)
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

---

## Acceptance Criteria

### 1. Backend Support

- [ ] **1a)** Add `cueAfterBehavior` field to habits schema (string, max 100 chars)
- [ ] **1b)** Add `cueLocation` field to habits schema (string, optional, max 50 chars)
- [ ] **1c)** Add `cueTime` field to habits schema (string, optional, e.g., "7:00 AM" or "Morning")
- [ ] **1d)** Update `habits.update` mutation to accept cue fields
- [ ] **1e)** Update `habits.create` mutation to accept cue fields (optional)
- [ ] **1f)** Update query return validators to include cue fields

### 2. Cue Display (Hero Section)

- [ ] **2a)** If cue is set, display a compact "Cue" card in Hero section
- [ ] **2b)** Show implementation intention as primary text: "After I [anchor]"
- [ ] **2c)** Show location and time as secondary metadata (if set)
- [ ] **2d)** Tap on cue card opens editor modal
- [ ] **2e)** If no cue set, show empty state: "Add a trigger" with CTA

### 3. Cue Editor Modal

- [ ] **3a)** Modal with guided input for implementation intention
- [ ] **3b)** Prompt: "After I __________, I will [habit name]"
- [ ] **3c)** Examples/suggestions provided:
  - "pour my morning coffee"
  - "brush my teeth"
  - "sit down at my desk"
  - "finish lunch"
  - "put on my workout clothes"
- [ ] **3d)** Optional: Location picker or free text input
- [ ] **3e)** Optional: Time input (time picker or preset: Morning/Afternoon/Evening/Night)
- [ ] **3f)** Save updates habit via mutation
- [ ] **3g)** Clear/remove cue option

### 4. UX Polish

- [ ] **4a)** Haptic feedback on save
- [ ] **4b)** Success toast: "Cue saved! Your trigger is set."
- [ ] **4c)** Empty state icon and explanation of why cues help
- [ ] **4d)** Character counter for implementation intention field

### 5. Accessibility

- [ ] **5a)** Cue card has proper accessibility labels
- [ ] **5b)** Modal inputs have labels and roles
- [ ] **5c)** Supports Dynamic Type

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
src/components/
  HabitCueSection/
    HabitCueSection.tsx      # Display component
    HabitCueEditor.tsx       # Modal editor
    index.ts
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
   - Verify cue fields save and retrieve correctly
   - Verify empty/null cue fields don't break existing habits

2. **UI:**
   - Verify cue displays correctly when set
   - Verify empty state appears when no cue
   - Verify editor opens and saves
   - Verify character limits enforced

3. **Integration:**
   - Verify cue persists across app restarts
   - Verify cue appears in habit detail after creation

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Cue data persists across app restarts
- [ ] No console errors or warnings
- [ ] Accessibility audit passed

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

**Created:** 2025-12-14



