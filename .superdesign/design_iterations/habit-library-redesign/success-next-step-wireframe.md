# Add Success + Next Step Wireframe

## Goal
Convert the "habit added" moment into immediate follow-through with contextual recommendations.

## Scenarios
- **Standard success branch:** user already has habits; suggest pairings/stack.
- **First-import branch:** user just added first habit; prioritize orientation + guided picker.

## Component tree contract
- `ImportSuccessHeader`
- `HabitAddedCard`
- `WhatsNextSection`
- `NextStepRecommendationList`
- `FirstImportBranchCard` (conditional)
- `PrimaryNextActions`

## Layout wireframe (mobile-first)

```text
┌─────────────────────────────────────────────┐
│ ✓ Habit added                                │
│ "Drink Water" is now in your daily plan.    │
├─────────────────────────────────────────────┤
│ WHAT'S NEXT?                                 │
│ Recommended for momentum:                    │
│ 1) Pair with Morning Stretch (2 min)         │
│ 2) Add reminder at coffee time               │
│ 3) Start tiny streak: 3-day challenge        │
├─────────────────────────────────────────────┤
│ [Branch: userHabitCount === 1]               │
│ FIRST IMPORT 🎉                              │
│ "You're off to a great start."               │
│ Actions:                                     │
│ - Take 30-second guide to choose #2 habit    │
│ - See starter packs                          │
│ - Keep only this for now                     │
├─────────────────────────────────────────────┤
│ [Branch: userHabitCount > 1]                 │
│ Continue with pairings:                      │
│ [Add Morning Stretch] [Add 5-min Walk]       │
├─────────────────────────────────────────────┤
│ [ View today's plan ] [ Add another habit ]  │
└─────────────────────────────────────────────┘
```

## What’s next recommendation logic (mock-level)
1. Show one high-confidence pairing from `habitPairings`.
2. Show one setup recommendation (set reminder / cue alignment).
3. Show one momentum recommendation (mini challenge or streak target).

## First-import branch requirements
- Trigger when post-import `userHabitCount` becomes `1`.
- Emphasize confidence and minimal cognitive load.
- Primary CTA: "Take 30-second guide" to get next habit suggestion.
- Secondary CTA: "View today's plan".
- Tertiary option: "I'm good for now" (dismiss and return).

## Copy notes
- Keep celebratory tone but outcome-oriented.
- "What's next?" header is mandatory and above fold.
- Recommendation cards should include expected effort/time.
