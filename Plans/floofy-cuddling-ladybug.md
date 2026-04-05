# Plan: Change Add Habit Input Placeholder

## Context
The "Add Habit" screen has a title **"Name your new habit"** and the input placeholder says **"Name your habit"** — essentially the same text repeated. The placeholder should instead provide a helpful hint, like a concrete example.

## Change
**File:** `src/components/CreateHabitModal/components/NameInputSection.tsx` (line 53)

Replace:
```
'Name your habit'
```
With:
```
'e.g. Morning run'
```

This gives the user an example of a habit name rather than restating the instruction. Short, concrete, and immediately clarifying.

## Verification
- Open the app → tap "Add Habit" → confirm the input placeholder reads "e.g. Morning run"
- Confirm the title still says "Name your new habit"
