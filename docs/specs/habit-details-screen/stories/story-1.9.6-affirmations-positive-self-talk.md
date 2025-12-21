# Story 1.9.6: Affirmations & Positive Self-Talk

**Epic:** Epic 1.5 - Habit Detail Screen
**Priority:** Medium
**Status:** 🟢 DONE
**Estimated Effort:** 6-10 hours
**Completed:** 2025-12-20

---

## User Story

**As a** user who struggles with negative self-talk during difficult days
**I want to** create and view positive affirmations tied to my habit
**So that** I can counter self-doubt and reinforce my identity as someone who succeeds

---

## Scientific Foundation

### Research Evidence

| Study / Researcher | Finding |
|-------------------|---------|
| Claude Steele (1988) | Self-affirmation theory: Affirming core values reduces defensiveness and improves behavior change |
| Creswell et al. (2013) | Self-affirmation under stress reduced cortisol and improved problem-solving |
| Critcher & Dunning (2015) | Self-affirmations broadened perspective and reduced ego-depletion effects |
| Hatzigeorgiadis et al. (2011) | Meta-analysis: Positive self-talk improved sports performance (effect size d = 0.48) |
| Wood et al. (2009) | Caveat: Generic affirmations can backfire for people with low self-esteem; habit-specific works better |

### The Science of Self-Talk

**Types of Self-Talk (Theodorakis et al.):**

1. **Instructional Self-Talk**: "Keep your back straight" (technique)
2. **Motivational Self-Talk**: "You can do this" (encouragement)
3. **Identity Self-Talk**: "I am someone who..." (who you are)

**Key Insight:** The most effective affirmations are:
- **Specific** to the behavior (not generic "I am great")
- **Believable** (not wildly unrealistic)
- **Identity-based** ("I am..." rather than "I will...")
- **Present tense** (as if already true)

### Why Affirmations Work

1. **Cognitive Restructuring**: Replaces negative automatic thoughts
2. **Identity Reinforcement**: Strengthens "I am the type of person who..."
3. **Stress Buffer**: Reduces cortisol during challenging moments
4. **Motivation Boost**: Activates approach motivation (toward goals)

### The Self-Talk Loop

```
Negative Thought        →  "I always fail at this"
        ↓
Affirmation Intercept   →  "I am someone who shows up, even imperfectly"
        ↓
Behavior Enabled        →  [Does the habit anyway]
        ↓
Evidence Created        →  Stats show completion
        ↓
Identity Reinforced     →  "I really AM that person"
```

---

## Placement Decision

**Option A (Recommended):** Part of Motivation section, after Vision Board

```
┌─────────────────────────────────────────────────────────────┐
│  MOTIVATION SECTION                                         │
│                                                             │
│  💭 Vision Board                                            │
│  [Cards...]                                                 │
│                                                             │
│  ✨ My Affirmations                               [+ Add]   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ "I am someone who takes care of my body"            │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ "Every rep makes me stronger, inside and out"       │   │
│  └─────────────────────────────────────────────────────┘   │
│  [View all 5 affirmations →]                               │
└─────────────────────────────────────────────────────────────┘
```

**Option B:** Separate collapsible section after Motivation

**Rationale for Option A:**
- Affirmations serve a motivational purpose
- Keeps related psychological tools together
- Reduces section count (avoids clutter)

---

## References

- Current screen: `src/screens/HabitDetailScreen.tsx`
- Schema: `convex/schema.ts`
- Related: Story 1.9.2 (Why + Vision Board)

---

## Acceptance Criteria

### 1. Backend Support

- [x] **1a)** Create `affirmations` table in schema:
  ```typescript
  affirmations: defineTable({
    habitId: v.id('habits'),
    text: v.string(),           // The affirmation text
    type: v.optional(v.union(   // Category (optional)
      v.literal('identity'),    // "I am..."
      v.literal('motivational'), // "I can..."
      v.literal('instructional') // "Remember to..."
    )),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.optional(v.string()),
  }).index('by_habit', ['habitId'])
  ```
  > Implemented in `convex/schema.ts` with scientific research comments
- [x] **1b)** Create `affirmations.listByHabit` query
  > Returns affirmations sorted by creation date (newest first)
- [x] **1c)** Create `affirmations.create` mutation (max 200 chars, max 10 per habit)
  > Includes validation for empty text, character limit, and per-habit limit
- [x] **1d)** Create `affirmations.update` mutation
  > Supports partial updates of text and type fields
- [x] **1e)** Create `affirmations.remove` mutation
  > Validates affirmation existence before deletion

### 2. Affirmations Display (Motivation Section)

- [x] **2a)** Show "My Affirmations" subsection within Motivation
  > Displays after Vision Board in MotivationTabContent
- [x] **2b)** Display up to 2 affirmations as preview cards
  > Uses `affirmations.slice(0, 2)` for preview
- [x] **2c)** Each card shows the affirmation text
  > Cards show quoted text with violet/indigo gradient background
- [x] **2d)** "View all" button if more than 2 exist
  > Opens AffirmationsListModal with full list
- [x] **2e)** "Add" button to create new affirmation
  > Violet button in section header opens editor modal
- [x] **2f)** Empty state with explanation and starter prompts
  > Shows MessageCircle icon with "What do you tell yourself?"

### 3. Affirmation Editor Modal

- [x] **3a)** Modal for adding/editing affirmation
  > Full-screen RNModal with slide animation
- [x] **3b)** Text input with character counter (max 200)
  > MultiLine TextInput with live character count display
- [x] **3c)** Type selector (Identity / Motivational / Instructional) - optional
  > Toggle buttons that support selection/deselection
- [x] **3d)** Starter templates/suggestions:
  - Identity: "I am someone who..."
  - Motivational: "I can do hard things"
  - Instructional: "Remember: progress over perfection"
  > 4 templates with auto-populate on tap
- [x] **3e)** Save/Cancel/Delete actions
  > Save button, X close button, long-press delete on cards
- [x] **3f)** Haptic feedback on save
  > Uses `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`

### 4. Affirmation Starter Templates

Provide helpful starting points based on affirmation type:

**Identity Affirmations (most powerful):**
- "I am someone who [keeps promises to myself]"
- "I am the type of person who [prioritizes health]"
- "I am becoming someone who [exercises daily]"

**Motivational Affirmations:**
- "I can do hard things"
- "This discomfort is temporary; my growth is permanent"
- "I don't have to feel like it to do it"
- "Showing up imperfectly beats not showing up"

**Instructional Affirmations:**
- "Progress, not perfection"
- "One day at a time"
- "The habit is the goal, not the outcome"

### 5. Accessibility

- [x] **5a)** Affirmation cards have accessibility labels
  > Cards have `accessibilityLabel` with affirmation preview text
- [x] **5b)** Modal inputs have proper labels and roles
  > TextInputs have `accessibilityLabel`, buttons have `accessibilityRole="button"`
- [x] **5c)** Supports Dynamic Type
  > Uses NativeWind/Tailwind text sizing which respects system font settings
- [x] **5d)** Screen reader announces affirmation type
  > Type selector has `accessibilityState={{ selected }}` for current selection

---

## Technical Notes

### Schema Addition

```typescript
// convex/schema.ts
affirmations: defineTable({
  habitId: v.id('habits'),
  text: v.string(),
  type: v.optional(
    v.union(
      v.literal('identity'),
      v.literal('motivational'),
      v.literal('instructional')
    )
  ),
  createdAt: v.number(),
  updatedAt: v.number(),
  userId: v.optional(v.string()),
}).index('by_habit', ['habitId']),
```

### New Convex File

```typescript
// convex/affirmations.ts
export const listByHabit = query({ ... });
export const create = mutation({ ... });
export const update = mutation({ ... });
export const remove = mutation({ ... });
```

### UI Component Structure

```
src/components/
  AffirmationsSection/
    AffirmationsSection.tsx     # Container with preview
    AffirmationCard.tsx         # Individual card
    AffirmationEditor.tsx       # Add/edit modal
    AffirmationsList.tsx        # Full list modal
    affirmationTemplates.ts     # Starter templates
    index.ts
```

### Affirmation Templates Data

```typescript
// affirmationTemplates.ts
export const AFFIRMATION_TEMPLATES = {
  identity: [
    "I am someone who ${habitAction}",
    "I am the type of person who ${habitAction}",
    "I am becoming someone who ${habitAction}",
    "I honor my commitment to ${habitAction}",
  ],
  motivational: [
    "I can do hard things",
    "This discomfort is temporary; my growth is permanent",
    "I don't have to feel like it to do it",
    "Showing up imperfectly beats not showing up",
    "My future self will thank me",
    "I've done hard things before; I can do this",
  ],
  instructional: [
    "Progress, not perfection",
    "One day at a time",
    "The habit is the goal, not the outcome",
    "Small steps lead to big changes",
    "Consistency beats intensity",
  ],
};
```

---

## UX Considerations

### When to Show Affirmations

1. **In Habit Detail**: Always visible in Motivation section
2. **On Completion** (future): Random affirmation as celebration
3. **In Notifications** (future): Include affirmation in reminder

### Preventing "Backfire Effect"

Research (Wood et al., 2009) shows generic positive affirmations can backfire for people with low self-esteem. Mitigations:

1. **Habit-specific**: Affirmations tied to this specific habit
2. **Identity-based**: "I am someone who..." (behavioral, not trait-based)
3. **Growth-oriented**: "I am becoming..." allows for imperfection
4. **Evidence-connected**: Stats nearby prove the affirmation is true

### Visual Design

```
┌─────────────────────────────────────────────────────────┐
│ ✨  "I am someone who takes care of my body"           │
│                                                         │
│                                        [Identity] 🏷️   │
└─────────────────────────────────────────────────────────┘
```

- Soft background (warm tone, not harsh)
- Subtle sparkle or star icon
- Optional type badge
- Quotation marks for emphasis

---

## Out of Scope (for this story)

- AI-generated affirmations based on habit
- Audio playback of affirmations
- Affirmation reminders/notifications
- Sharing affirmations
- Community affirmation library

---

## Testing Strategy

1. **Backend:**
   - Verify affirmations CRUD operations
   - Verify max limits (200 chars, 10 per habit)
   - Verify type validation

2. **UI:**
   - Verify display in Motivation section
   - Verify editor modal opens and saves
   - Verify character counter works
   - Verify templates populate correctly

3. **Integration:**
   - Verify affirmations persist across app restarts
   - Verify affirmations are habit-specific (not shared)

---

## Definition of Done

- [x] All acceptance criteria met
- [x] Affirmations persist across app restarts
  > Data stored in Convex backend with proper queries
- [x] No console errors or warnings
- [x] Accessibility audit passed

## Implementation Notes

**Files Modified/Created:**
- `convex/schema.ts` - Added `affirmations` table with research citations
- `convex/affirmations.ts` - Complete CRUD API (181 lines)
- `src/screens/HabitDetailScreen.tsx` - Integrated affirmations into Motivation tab

**Design Decisions:**
- Affirmations displayed inline within MotivationTabContent (Option A from spec)
- Violet/indigo gradient background for affirmation cards matches Identity section theming
- Long-press delete pattern consistent with VisionBoard cards
- Templates inline in editor modal rather than separate component for simplicity

**Testing Notes:**
- Backend validation tested: empty text, 200 char limit, 10 per habit limit
- UI tested: add/edit/delete flow, character counter, type selection
- Persistence verified: affirmations survive app restarts

---

## Why This Matters (User Benefit)

### The Inner Critic Problem

When motivation is low, users often experience negative self-talk:
- "I always fail at this"
- "What's the point?"
- "I'm not disciplined enough"

### The Affirmation Solution

Pre-written affirmations serve as **cognitive first-aid**:
- User sees their own words reminding them who they're becoming
- Counters negative thoughts with prepared positive ones
- Doesn't require creative energy when depleted

### The Identity Connection

Affirmations work best when connected to identity:

```
Old Pattern:
  "I failed to exercise" → "I'm not a gym person" → Give up

New Pattern:
  "I missed today" → [Sees affirmation: "I am someone who shows up"]
  → "One miss doesn't define me" → Continue tomorrow
```

> "Whether you think you can or you think you can't, you're right."
> — Henry Ford

Affirmations help users **think they can**.

---

**Created:** 2025-12-14


